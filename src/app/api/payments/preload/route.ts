import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { 
      listing_id, user_id, 
      is_top_ad, top_ad_duration = 7,
      is_highlighted, highlighted_duration = 7,
      is_urgent, urgent_duration = 7,
      is_home_gallery, home_gallery_duration = 7
    } = body;

    const parsedUserId = parseInt(String(user_id), 10) || 1;
    const parsedListingId = parseInt(String(listing_id), 10);

    if (!parsedListingId || isNaN(parsedListingId)) {
      return NextResponse.json(
        { success: false, message: 'listing_id is required' },
        { status: 400 }
      );
    }

    // Fetch all active pricing options from DB
    const { data: rawOptions, error: pricingError } = await supabase
      .from('promotion_pricing')
      .select('promotion_type, duration_days, price')
      .eq('is_active', true);

    if (pricingError) throw pricingError;

    const pricingOptions = (rawOptions || []).map((r: any) => ({
      promotion_type: r.promotion_type,
      duration_days: Number(r.duration_days),
      price: Number(r.price),
    }));

    let total = 0;
    const selectedPromotions: string[] = [];

    // Helper to calculate price
    const calculatePrice = (promoType: string, duration: number, fallbackPrice: number) => {
      const options = pricingOptions.filter((p: any) => p.promotion_type === promoType);
      if (options.length > 0) {
        const match = options.find((p: any) => Number(p.duration_days) === Number(duration));
        if (match) return Number(match.price);
        return Number(options[0].price);
      }
      return fallbackPrice;
    };

    if (is_top_ad) { 
      total += calculatePrice('top_ad', top_ad_duration, 9.99); 
      selectedPromotions.push(`top_ad:${top_ad_duration}`); 
    }
    if (is_highlighted) { 
      total += calculatePrice('highlighted', highlighted_duration, 4.99); 
      selectedPromotions.push(`highlighted:${highlighted_duration}`); 
    }
    if (is_urgent) { 
      total += calculatePrice('urgent', urgent_duration, 5.99); 
      selectedPromotions.push(`urgent:${urgent_duration}`); 
    }
    if (is_home_gallery) { 
      total += calculatePrice('home_gallery', home_gallery_duration, 14.99); 
      selectedPromotions.push(`home_gallery:${home_gallery_duration}`); 
    }

    if (total === 0) {
      return NextResponse.json(
        { success: false, message: 'No promotions selected' },
        { status: 400 }
      );
    }

    // Round to 2 decimal places to avoid floating point issues
    total = Math.round(total * 100) / 100;

    // 2. Generate unique order number
    const orderNo = `HITADS-${listing_id}-${Date.now()}`;

    // 3. Moneris Checkout preload — server-to-server request
    const storeId = process.env.MONERIS_STORE_ID;
    const apiToken = process.env.MONERIS_API_TOKEN;
    const checkoutId = process.env.MONERIS_CHECKOUT_ID;
    const environment = process.env.MONERIS_ENVIRONMENT || 'qa';

    if (!storeId || !apiToken || !checkoutId) {
      console.error('Missing Moneris credentials in environment variables');
      return NextResponse.json(
        { success: false, message: 'Payment gateway not configured' },
        { status: 500 }
      );
    }

    // Determine Moneris gateway URL based on environment
    const gatewayUrl = environment === 'prod'
      ? 'https://gateway.moneris.com/chkt/request/request.php'
      : 'https://gatewayt.moneris.com/chkt/request/request.php';

    const preloadPayload = {
      store_id: storeId,
      api_token: apiToken,
      checkout_id: checkoutId,
      action: 'preload',
      environment: environment === 'prod' ? 'prod' : 'qa',
      txn_total: total.toFixed(2),
      order_no: orderNo,
      cust_id: `user-${parsedUserId}`,
      dynamic_descriptor: 'HITADS PROMO',
    };

    const monerisRes = await fetch(gatewayUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(preloadPayload),
    });

    const monerisData = await monerisRes.json();

    const ticket = monerisData.ticket || monerisData.response?.ticket;

    if (!ticket || monerisData.response?.error) {
      console.error('Moneris preload failed:', monerisData);
      return NextResponse.json(
        { success: false, message: 'Payment gateway returned an error: ' + (monerisData.response?.error?.message || 'Unknown error') },
        { status: 502 }
      );
    }

    // 4. Save pending transaction record in database
    const { error: insertError } = await supabase
      .from('transactions')
      .insert({
        user_id: parsedUserId,
        listing_id: parsedListingId,
        ticket: ticket,
        amount: total,
        promotions: selectedPromotions.join(','),
        status: 'pending',
      });
      
    if (insertError) throw insertError;

    // 5. Return ticket to frontend
    return NextResponse.json({
      success: true,
      ticket: ticket,
      amount: total,
      environment: environment,
      order_no: orderNo,
    });

  } catch (error: any) {
    console.error('Payment preload error:', error);
    return NextResponse.json(
      { success: false, message: 'Server error: ' + error.message },
      { status: 500 }
    );
  }
}

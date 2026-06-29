import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { ticket } = body;

    if (!ticket) {
      return NextResponse.json(
        { success: false, message: 'ticket is required' },
        { status: 400 }
      );
    }

    // 1. Find the pending transaction by ticket
    const transaction = await prisma.transactions.findFirst({
      where: { ticket, status: 'pending' },
    });

    if (!transaction) {
      // Check if already completed (idempotent)
      const completed = await prisma.transactions.findFirst({
        where: { ticket, status: 'completed' },
      });
      if (completed) {
        return NextResponse.json({
          success: true,
          receipt_id: completed.receipt_id || 'ALREADY_VERIFIED',
          message: 'Transaction already verified',
        });
      }

      return NextResponse.json(
        { success: false, message: 'Transaction not found or already processed' },
        { status: 404 }
      );
    }

    // 2. Verify with Moneris — server-to-server receipt request
    const storeId = process.env.MONERIS_STORE_ID;
    const apiToken = process.env.MONERIS_API_TOKEN;
    const checkoutId = process.env.MONERIS_CHECKOUT_ID;
    const environment = process.env.MONERIS_ENVIRONMENT || 'qa';

    const gatewayUrl = environment === 'prod'
      ? 'https://gateway.moneris.com/chkt/request/request.php'
      : 'https://gatewayt.moneris.com/chkt/request/request.php';

    const receiptPayload = {
      store_id: storeId,
      api_token: apiToken,
      checkout_id: checkoutId,
      action: 'receipt',
      ticket: ticket,
      environment: environment === 'prod' ? 'prod' : 'qa',
    };

    const monerisRes = await fetch(gatewayUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(receiptPayload),
    });

    const monerisData = await monerisRes.json();

    // 3. Parse Moneris response
    const responseCode = monerisData.response?.receipt?.result || 
                         monerisData.response?.receipt?.response_code ||
                         monerisData.receipt?.response_code ||
                         '';
    const receiptId = monerisData.response?.receipt?.cc?.order_no ||
                      monerisData.response?.receipt?.order_no ||
                      monerisData.receipt?.order_no ||
                      ticket;
    const isApproved = responseCode !== '' && parseInt(responseCode, 10) < 50;

    if (isApproved) {
      // 4. Parse which promotions were selected
      const promotions = transaction.promotions.split(',');
      const promoUpdate: any = {};
      let maxDurationDays = 7; // Default fallback
      
      for (const promo of promotions) {
        // e.g. "top_ad:14"
        const [type, daysStr] = promo.split(':');
        const days = parseInt(daysStr, 10);
        
        if (!isNaN(days) && days > maxDurationDays) {
          maxDurationDays = days;
        }

        if (type === 'top_ad') promoUpdate.is_top_ad = true;
        if (type === 'highlighted') promoUpdate.is_highlighted = true;
        if (type === 'urgent') promoUpdate.is_urgent = true;
        if (type === 'home_gallery') promoUpdate.is_home_gallery = true;
      }

      // Calculate expiry date dynamically
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + maxDurationDays);
      promoUpdate.promotion_expires_at = expiresAt;

      // 5. Use a transaction to update both records atomically
      await prisma.$transaction([
        // Update the transaction record
        prisma.transactions.update({
          where: { id: transaction.id },
          data: {
            status: 'completed',
            receipt_id: receiptId,
            response_code: String(responseCode),
            payment_type: 'moneris_checkout',
          },
        }),
        // Activate promotions on the listing
        prisma.listings.update({
          where: { id: transaction.listing_id },
          data: promoUpdate,
        }),
      ]);

      return NextResponse.json({
        success: true,
        receipt_id: receiptId,
        promotions_activated: promotions,
        expires_at: expiresAt.toISOString(),
      });

    } else {
      // Payment was declined
      await prisma.transactions.update({
        where: { id: transaction.id },
        data: {
          status: 'declined',
          response_code: String(responseCode),
        },
      });

      return NextResponse.json(
        { 
          success: false, 
          message: 'Payment was declined by the payment processor. Response code: ' + responseCode,
        },
        { status: 402 }
      );
    }

  } catch (error: any) {
    console.error('Payment verify error:', error);
    return NextResponse.json(
      { success: false, message: 'Server error during verification: ' + error.message },
      { status: 500 }
    );
  }
}

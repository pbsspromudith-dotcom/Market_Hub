import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { buildInvoiceData } from '@/lib/invoice';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const user_id = searchParams.get('user_id');

    if (!user_id) {
      return NextResponse.json(
        { success: false, message: 'user_id is required' },
        { status: 400 }
      );
    }

    const parsedUserId = parseInt(user_id, 10);

    // Fetch user details
    const { data: user } = await supabase
      .from('users')
      .select('id, name, email, phone')
      .eq('id', parsedUserId)
      .maybeSingle();

    // Fetch transactions for the given user, ordered by newest first
    const { data: transactions, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', parsedUserId)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    // Get unique listing IDs
    const listingIds = Array.from(new Set((transactions || []).map((t: any) => t.listing_id).filter(Boolean)));

    let listingsMap: Record<number, any> = {};
    if (listingIds.length > 0) {
      const { data: listings } = await supabase
        .from('listings')
        .select('id, title')
        .in('id', listingIds);
      
      if (listings) {
        listings.forEach((l: any) => {
          listingsMap[l.id] = l;
        });
      }
    }

    const enrichedTransactions = (transactions || []).map((tx: any) => {
      const listing = listingsMap[tx.listing_id];
      const invoice = buildInvoiceData(tx, user, listing);
      return {
        ...tx,
        listing_title: listing?.title || null,
        promotions_readable: invoice.promotionsReadable,
        subtotal: invoice.subtotal,
        tax: invoice.tax,
        invoice_no: invoice.invoiceNo,
        invoice,
      };
    });

    return NextResponse.json({
      success: true,
      data: enrichedTransactions,
    });
  } catch (error: any) {
    console.error('Error fetching user transactions:', error);
    return NextResponse.json(
      { success: false, message: 'Server error: ' + error.message },
      { status: 500 }
    );
  }
}

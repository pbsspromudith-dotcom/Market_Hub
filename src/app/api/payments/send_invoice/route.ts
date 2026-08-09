import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { sendEmail } from '@/lib/email';
import { buildInvoiceData, generateInvoiceEmailHtml } from '@/lib/invoice';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { transaction_id, recipient_email } = body;

    if (!transaction_id) {
      return NextResponse.json(
        { success: false, message: 'transaction_id is required' },
        { status: 400 }
      );
    }

    // 1. Fetch transaction record
    const { data: tx, error: txErr } = await supabase
      .from('transactions')
      .select('*')
      .eq('id', parseInt(String(transaction_id), 10))
      .maybeSingle();

    if (txErr || !tx) {
      return NextResponse.json(
        { success: false, message: 'Transaction not found' },
        { status: 404 }
      );
    }

    // 2. Fetch user details
    const { data: user } = await supabase
      .from('users')
      .select('id, name, email, phone')
      .eq('id', tx.user_id)
      .maybeSingle();

    // 3. Fetch listing details
    const { data: listing } = await supabase
      .from('listings')
      .select('id, title')
      .eq('id', tx.listing_id)
      .maybeSingle();

    // 4. Build invoice data
    const invoice = buildInvoiceData(tx, user, listing);

    const targetEmail = recipient_email || user?.email;

    if (!targetEmail) {
      return NextResponse.json(
        { success: false, message: 'No recipient email found for this transaction' },
        { status: 400 }
      );
    }

    // 5. Generate email HTML and send email
    const emailHtml = generateInvoiceEmailHtml(invoice);
    await sendEmail(
      targetEmail,
      `Official Invoice ${invoice.invoiceNo} - HitAds.ca Promotion Payment`,
      emailHtml
    );

    return NextResponse.json({
      success: true,
      message: `Invoice ${invoice.invoiceNo} successfully sent to ${targetEmail}`,
      invoice,
    });
  } catch (error: any) {
    console.error('Error sending invoice email:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to send invoice email: ' + error.message },
      { status: 500 }
    );
  }
}

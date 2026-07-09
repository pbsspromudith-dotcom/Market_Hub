import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { pan, expdate, cvd, order_id } = body;

    if (!pan || !expdate) {
      return NextResponse.json(
        { success: false, message: 'PAN and Expiry Date are required' },
        { status: 400 }
      );
    }

    const storeId = process.env.MONERIS_STORE_ID;
    const apiToken = process.env.MONERIS_API_TOKEN;
    const environment = process.env.MONERIS_ENVIRONMENT || 'qa';

    const gatewayUrl = environment === 'prod'
      ? 'https://www3.moneris.com/gateway2/servlet/MpgRequest'
      : 'https://esqa.moneris.com/gateway2/servlet/MpgRequest';

    // Build the XML payload for card_verification
    const uniqueOrderId = order_id || `CardVal-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    
    // Construct cvd_info tag only if cvd is provided
    const cvdInfoXml = cvd ? `
      <cvd_info>
        <cvd_indicator>1</cvd_indicator>
        <cvd_value>${cvd}</cvd_value>
      </cvd_info>` : '';

    const xmlPayload = `<?xml version="1.0"?>
    <request>
      <store_id>${storeId}</store_id>
      <api_token>${apiToken}</api_token>
      <card_verification>
        <order_id>${uniqueOrderId}</order_id>
        <pan>${pan}</pan>
        <expdate>${expdate}</expdate>
        <crypt_type>7</crypt_type>${cvdInfoXml}
      </card_verification>
    </request>`;

    const monerisRes = await fetch(gatewayUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/xml',
      },
      body: xmlPayload,
    });

    const monerisText = await monerisRes.text();

    // Parse the XML response using basic regex to avoid pulling in heavy XML parsers
    const responseCodeMatch = monerisText.match(/<ResponseCode>(.*?)<\/ResponseCode>/);
    const messageMatch = monerisText.match(/<Message>(.*?)<\/Message>/);
    const receiptIdMatch = monerisText.match(/<ReceiptId>(.*?)<\/ReceiptId>/);
    const transIdMatch = monerisText.match(/<TransID>(.*?)<\/TransID>/);
    
    const responseCode = responseCodeMatch ? responseCodeMatch[1] : '';
    const message = messageMatch ? messageMatch[1].trim() : 'Unknown Error';
    const receiptId = receiptIdMatch ? receiptIdMatch[1] : '';
    const transId = transIdMatch ? transIdMatch[1] : '';

    const isApproved = responseCode !== '' && parseInt(responseCode, 10) < 50;

    if (isApproved) {
      return NextResponse.json({
        success: true,
        message: 'Card verified successfully',
        receipt_id: receiptId,
        trans_id: transId,
        response_code: responseCode,
        moneris_message: message
      });
    } else {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Card verification failed',
          response_code: responseCode,
          moneris_message: message
        },
        { status: 402 } // Payment Required / Declined
      );
    }
  } catch (error: any) {
    console.error('Card verification error:', error);
    return NextResponse.json(
      { success: false, message: 'Server error during card verification' },
      { status: 500 }
    );
  }
}

import { getThemedEmailHtml } from './email';

export interface InvoiceItem {
  name: string;
  duration: string;
  price: number;
}

export interface InvoiceData {
  transactionId?: number | string;
  invoiceNo: string;
  date: string;
  rawDate?: string;
  receiptId: string;
  status: string;
  paymentMethod: string;
  customer: {
    id: number | string;
    name: string;
    email: string;
    phone?: string;
  };
  listing: {
    id: number | string;
    title: string;
  };
  items: InvoiceItem[];
  subtotal: number;
  taxRate: string;
  tax: number;
  total: number;
  promotionsReadable: string;
}

const nameMap: Record<string, string> = {
  top_ad: 'Top Ad',
  highlighted: 'Highlighted',
  urgent: 'Urgent',
  home_gallery: 'Home Page',
  test_checkout: 'Test Checkout',
};

export function buildInvoiceData(tx: any, user?: any, listing?: any): InvoiceData {
  const total = parseFloat(tx.amount || 0);
  const subtotal = Math.round((total / 1.13) * 100) / 100;
  const tax = Math.round((total - subtotal) * 100) / 100;
  const invoiceNo = `INV-HITADS-${String(tx.id || '000').padStart(6, '0')}`;

  const rawPromos = (tx.promotions || '').split(',').filter(Boolean);
  const items: InvoiceItem[] = [];
  const readableParts: string[] = [];

  const perItemPrice = rawPromos.length > 0 ? Math.round((subtotal / rawPromos.length) * 100) / 100 : subtotal;

  for (const item of rawPromos) {
    const [key, days] = item.split(':');
    const name = nameMap[key] || key.replace('_', ' ');
    const duration = days ? `${days} Days` : 'Standard';
    items.push({
      name,
      duration,
      price: perItemPrice,
    });
    readableParts.push(days ? `${name} (${days} Days)` : name);
  }

  if (items.length === 0) {
    items.push({
      name: 'Ad Promotion Package',
      duration: 'Standard',
      price: subtotal,
    });
    readableParts.push('Ad Promotion');
  }

  const formattedDate = tx.created_at
    ? new Date(tx.created_at).toLocaleDateString('en-CA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : new Date().toLocaleDateString('en-CA');

  return {
    transactionId: tx.id,
    invoiceNo,
    date: formattedDate,
    rawDate: tx.created_at,
    receiptId: tx.receipt_id || tx.ticket || 'N/A',
    status: (tx.status || 'completed').toUpperCase(),
    paymentMethod: tx.payment_type || 'Credit Card (Moneris Checkout)',
    customer: {
      id: user?.id || tx.user_id || 'N/A',
      name: user?.name || tx.user_name || 'Valued Customer',
      email: user?.email || tx.user_email || 'N/A',
      phone: user?.phone || tx.user_phone || 'N/A',
    },
    listing: {
      id: listing?.id || tx.listing_id || 'N/A',
      title: listing?.title || tx.listing_title || `Listing #${tx.listing_id}`,
    },
    items,
    subtotal,
    taxRate: '13% HST',
    tax,
    total,
    promotionsReadable: readableParts.join(', '),
  };
}

export function generateInvoiceEmailHtml(invoice: InvoiceData): string {
  const itemsRows = invoice.items
    .map(
      (item) => `
    <tr>
      <td style="padding: 12px 16px; border-bottom: 1px solid #edf2f7; font-size: 14px; color: #2d3748; font-weight: 600;">
        ${item.name}
      </td>
      <td style="padding: 12px 16px; border-bottom: 1px solid #edf2f7; font-size: 14px; color: #4a5568; text-align: center;">
        ${item.duration}
      </td>
      <td style="padding: 12px 16px; border-bottom: 1px solid #edf2f7; font-size: 14px; color: #2d3748; font-weight: 700; text-align: right;">
        $${item.price.toFixed(2)}
      </td>
    </tr>
  `
    )
    .join('');

  const bodyContent = `
    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1a202c;">
      
      <!-- Invoice Header Badge -->
      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px;">
        <tr>
          <td>
            <h2 style="margin: 0; font-size: 20px; font-weight: 900; color: #0f172a; text-transform: uppercase; letter-spacing: 0.5px;">Payment Receipt & Invoice</h2>
            <p style="margin: 4px 0 0 0; font-size: 13px; color: #64748b;">Thank you for promoting your ad on HitAds.ca!</p>
          </td>
          <td align="right" style="vertical-align: top;">
            <span style="display: inline-block; padding: 6px 14px; background-color: #dcfce7; color: #15803d; font-size: 11px; font-weight: 800; border-radius: 9999px; text-transform: uppercase; letter-spacing: 1px;">${invoice.status}</span>
          </td>
        </tr>
      </table>

      <!-- Meta Info Box -->
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; border-radius: 12px; padding: 16px; margin-bottom: 24px; border: 1px solid #e2e8f0;">
        <tr>
          <td width="50%" style="vertical-align: top; padding-right: 12px;">
            <p style="margin: 0 0 4px 0; font-size: 10px; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px;">Invoice Details</p>
            <p style="margin: 0; font-size: 13px; font-weight: 700; color: #1e293b;">Invoice #: <span style="font-family: monospace;">${invoice.invoiceNo}</span></p>
            <p style="margin: 3px 0 0 0; font-size: 12px; color: #475569;">Date: ${invoice.date}</p>
            <p style="margin: 3px 0 0 0; font-size: 12px; color: #475569;">Receipt Ref: <span style="font-family: monospace;">${invoice.receiptId}</span></p>
          </td>
          <td width="50%" style="vertical-align: top; padding-left: 12px;">
            <p style="margin: 0 0 4px 0; font-size: 10px; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px;">Billed To</p>
            <p style="margin: 0; font-size: 13px; font-weight: 700; color: #1e293b;">${invoice.customer.name}</p>
            <p style="margin: 3px 0 0 0; font-size: 12px; color: #475569;">${invoice.customer.email}</p>
            <p style="margin: 6px 0 0 0; font-size: 12px; font-weight: 700; color: #0f172a;">Ad Title: ${invoice.listing.title}</p>
          </td>
        </tr>
      </table>

      <!-- Items Table -->
      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px; border-collapse: collapse; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
        <thead>
          <tr style="background-color: #f1f5f9;">
            <th align="left" style="padding: 12px 16px; font-size: 11px; font-weight: 800; color: #475569; text-transform: uppercase; letter-spacing: 1px;">Promotion Item</th>
            <th align="center" style="padding: 12px 16px; font-size: 11px; font-weight: 800; color: #475569; text-transform: uppercase; letter-spacing: 1px;">Duration</th>
            <th align="right" style="padding: 12px 16px; font-size: 11px; font-weight: 800; color: #475569; text-transform: uppercase; letter-spacing: 1px;">Price</th>
          </tr>
        </thead>
        <tbody>
          ${itemsRows}
        </tbody>
      </table>

      <!-- Financial Totals -->
      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px;">
        <tr>
          <td width="50%"></td>
          <td width="50%">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="padding: 4px 0; font-size: 13px; color: #475569;">Subtotal:</td>
                <td align="right" style="padding: 4px 0; font-size: 13px; font-weight: 600; color: #1e293b;">$${invoice.subtotal.toFixed(2)}</td>
              </tr>
              <tr>
                <td style="padding: 4px 0; font-size: 13px; color: #475569;">Tax (13% HST):</td>
                <td align="right" style="padding: 4px 0; font-size: 13px; font-weight: 600; color: #1e293b;">$${invoice.tax.toFixed(2)}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0 0 0; font-size: 15px; font-weight: 800; color: #0f172a; border-top: 2px solid #e2e8f0;">Total Paid:</td>
                <td align="right" style="padding: 8px 0 0 0; font-size: 16px; font-weight: 900; color: #fd3d28; border-top: 2px solid #e2e8f0;">$${invoice.total.toFixed(2)} CAD</td>
              </tr>
            </table>
          </td>
        </tr>
      </table>

      <!-- Footer Note -->
      <div style="background-color: #f8fafc; border-radius: 12px; padding: 14px; text-align: center; border: 1px solid #e2e8f0;">
        <p style="margin: 0; font-size: 11px; color: #64748b; font-weight: 600;">
          Payment processed securely via Moneris Checkout. This is an official tax invoice/receipt for your records.
        </p>
      </div>
    </div>
  `;

  return getThemedEmailHtml(`Invoice ${invoice.invoiceNo} - HitAds.ca`, bodyContent);
}

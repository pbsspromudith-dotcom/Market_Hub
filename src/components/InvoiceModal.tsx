"use client";

import React, { useState } from "react";
import { InvoiceData } from "@/lib/invoice";

interface InvoiceModalProps {
  invoice: InvoiceData | null;
  onClose: () => void;
}

export default function InvoiceModal({ invoice, onClose }: InvoiceModalProps) {
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailMessage, setEmailMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (!invoice) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleSendEmail = async () => {
    if (!invoice.transactionId) {
      setEmailMessage({ type: 'error', text: 'Transaction ID is missing.' });
      return;
    }

    setIsSendingEmail(true);
    setEmailMessage(null);

    try {
      const res = await fetch('/api/payments/send_invoice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transaction_id: invoice.transactionId,
          recipient_email: invoice.customer.email,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setEmailMessage({
          type: 'success',
          text: `Invoice sent successfully to ${invoice.customer.email}!`,
        });
      } else {
        setEmailMessage({
          type: 'error',
          text: data.message || 'Failed to send invoice email.',
        });
      }
    } catch (err: any) {
      console.error(err);
      setEmailMessage({
        type: 'error',
        text: 'Error sending invoice email.',
      });
    } finally {
      setIsSendingEmail(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl border border-slate-100/80 overflow-hidden flex flex-col my-8 animate-in zoom-in-95 duration-200 print:shadow-none print:border-none print:m-0 print:w-full print:max-w-none print:rounded-none">
        
        {/* Modal Action Bar (Hidden on print) */}
        <div className="px-8 py-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center print:hidden">
          <div className="flex items-center gap-2">
            <span className="material-icons text-primary text-xl">receipt_long</span>
            <span className="text-xs font-black text-slate-700 uppercase tracking-widest">
              Official Payment Invoice
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleSendEmail}
              disabled={isSendingEmail}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 shadow-sm cursor-pointer disabled:opacity-50"
            >
              {isSendingEmail ? (
                <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              ) : (
                <span className="material-icons text-sm">send</span>
              )}
              Send to User Email
            </button>
            <button
              onClick={handlePrint}
              className="bg-primary hover:bg-primary-hover text-white text-xs font-bold px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <span className="material-icons text-sm">print</span>
              Print / Save PDF
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 transition-colors w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center cursor-pointer"
            >
              <span className="material-icons">close</span>
            </button>
          </div>
        </div>

        {/* Email Alert Banner */}
        {emailMessage && (
          <div className={`px-8 py-3 text-xs font-bold flex items-center gap-2 border-b print:hidden ${
            emailMessage.type === 'success' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-red-50 text-red-800 border-red-200'
          }`}>
            <span className="material-icons text-sm">{emailMessage.type === 'success' ? 'check_circle' : 'error'}</span>
            {emailMessage.text}
          </div>
        )}

        {/* Printable Invoice Container */}
        <div className="p-8 sm:p-10 space-y-8 bg-white print:p-0">
          
          {/* Header & Logo */}
          <div className="flex justify-between items-start border-b border-slate-100 pb-8">
            <div>
              <img
                src="/logos/HitAds-Horizontal-Logo.png"
                alt="HitAds.ca"
                className="h-10 w-auto object-contain mb-2"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">HitAds.ca</h1>
              <p className="text-xs text-slate-400 font-medium mt-0.5">Free Ads. Sell Fast. Buy Local. Canada-Wide.</p>
              <p className="text-xs text-slate-500 font-medium">support@hitads.ca • www.hitads.ca</p>
            </div>
            <div className="text-right">
              <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-widest rounded-full mb-2">
                {invoice.status}
              </span>
              <h2 className="text-xl font-black font-mono text-slate-800">{invoice.invoiceNo}</h2>
              <p className="text-xs font-bold text-slate-500 mt-1">{invoice.date}</p>
            </div>
          </div>

          {/* Billed To & Listing Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-slate-50/80 p-6 rounded-2xl border border-slate-100">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Billed To</p>
              <p className="text-sm font-black text-slate-800">{invoice.customer.name}</p>
              <p className="text-xs text-slate-500 font-medium">{invoice.customer.email}</p>
              {invoice.customer.phone && <p className="text-xs text-slate-500 font-medium">{invoice.customer.phone}</p>}
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Ad Details</p>
              <p className="text-sm font-black text-slate-800">{invoice.listing.title}</p>
              <p className="text-xs text-slate-500 font-medium">Listing ID: #{invoice.listing.id}</p>
              <p className="text-xs text-slate-500 font-medium">Payment Method: {invoice.paymentMethod}</p>
              <p className="text-xs font-mono text-slate-400 mt-1">Receipt ID: {invoice.receiptId}</p>
            </div>
          </div>

          {/* Itemized Table */}
          <div className="overflow-hidden rounded-2xl border border-slate-200">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-200 text-[10px] font-black uppercase tracking-widest text-slate-400">
                <tr>
                  <th className="p-4">Description</th>
                  <th className="p-4 text-center">Duration</th>
                  <th className="p-4 text-right">Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                {invoice.items.map((item, idx) => (
                  <tr key={idx}>
                    <td className="p-4 font-bold text-slate-800">{item.name}</td>
                    <td className="p-4 text-center">{item.duration}</td>
                    <td className="p-4 text-right font-bold">${item.price.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals Breakdown */}
          <div className="flex justify-end pt-2">
            <div className="w-full max-w-xs space-y-2 text-xs">
              <div className="flex justify-between items-center text-slate-600 font-medium">
                <span>Subtotal</span>
                <span className="font-bold text-slate-800">${invoice.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-slate-600 font-medium">
                <span>Tax (13% HST)</span>
                <span className="font-bold text-slate-800">${invoice.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-slate-900 font-black text-sm pt-3 border-t-2 border-slate-200">
                <span>Total Amount Paid</span>
                <span className="text-primary font-black text-base">${invoice.total.toFixed(2)} CAD</span>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="border-t border-slate-100 pt-6 text-center text-slate-400 text-[11px] font-medium leading-relaxed">
            <p className="font-bold text-slate-500">Thank you for choosing HitAds.ca!</p>
            <p>This is an officially generated electronic receipt and tax invoice for your records.</p>
            <p className="text-[10px] text-slate-400 mt-1 font-mono">HitAds Canada • HST/GST Registered • PCI DSS Compliant Moneris Checkout</p>
          </div>

        </div>
      </div>
    </div>
  );
}

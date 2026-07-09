"use client";

import React, { useState } from 'react';

interface CardVerificationModalProps {
  onSuccess: (receiptId: string) => void;
  onCancel: () => void;
}

const CardVerificationModal: React.FC<CardVerificationModalProps> = ({ onSuccess, onCancel }) => {
  const [pan, setPan] = useState('');
  const [expMonth, setExpMonth] = useState('');
  const [expYear, setExpYear] = useState('');
  const [cvd, setCvd] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Basic Validation
    if (!pan || pan.replace(/\s/g, '').length < 13) {
      setError('Please enter a valid card number.');
      return;
    }
    if (!expMonth || !expYear || expMonth.length !== 2 || expYear.length !== 2) {
      setError('Please enter a valid expiry date (MM/YY).');
      return;
    }

    setIsSubmitting(true);

    try {
      // Format expiry date for Moneris: YYMM
      const expdate = `${expYear}${expMonth}`;

      const res = await fetch('/api/payments/verify_card', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pan: pan.replace(/\s/g, ''),
          expdate,
          cvd: cvd.trim(),
        }),
      });

      const data = await res.json();

      if (data.success) {
        setSuccess(true);
        setTimeout(() => {
          onSuccess(data.receipt_id);
        }, 1500);
      } else {
        setError(data.message || data.moneris_message || 'Verification failed. Please check your card details.');
      }
    } catch (err: any) {
      setError('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden relative">
        <div className="p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-2">Verify Payment Method</h2>
          <p className="text-sm text-slate-500 mb-6">
            Please enter your card details. We will securely verify this card without charging it.
          </p>

          {error && (
            <div className="mb-6 p-3 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100 flex items-start gap-2">
              <span className="material-icons text-[18px]">error_outline</span>
              <span>{error}</span>
            </div>
          )}

          {success ? (
            <div className="mb-6 p-6 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100 flex flex-col items-center gap-3 text-center">
              <span className="material-icons text-4xl">check_circle</span>
              <div>
                <h3 className="font-bold text-lg">Card Verified!</h3>
                <p className="text-sm opacity-80">Your card was successfully verified.</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Card Number</label>
                <div className="relative">
                  <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">credit_card</span>
                  <input
                    type="text"
                    value={pan}
                    onChange={(e) => setPan(e.target.value.replace(/\D/g, '').substring(0, 16))}
                    placeholder="0000 0000 0000 0000"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Expiry Date</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={expMonth}
                      onChange={(e) => setExpMonth(e.target.value.replace(/\D/g, '').substring(0, 2))}
                      placeholder="MM"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-center"
                      required
                    />
                    <span className="text-slate-400">/</span>
                    <input
                      type="text"
                      value={expYear}
                      onChange={(e) => setExpYear(e.target.value.replace(/\D/g, '').substring(0, 2))}
                      placeholder="YY"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-center"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">CVD / CVV <span className="font-normal text-slate-400">(Optional)</span></label>
                  <input
                    type="text"
                    value={cvd}
                    onChange={(e) => setCvd(e.target.value.replace(/\D/g, '').substring(0, 4))}
                    placeholder="123"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={onCancel}
                  disabled={isSubmitting}
                  className="flex-1 py-3 px-4 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3 px-4 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Verifying...</span>
                    </>
                  ) : (
                    'Verify Card'
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default CardVerificationModal;

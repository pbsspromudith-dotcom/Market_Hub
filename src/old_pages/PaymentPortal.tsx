"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const PaymentPortal: React.FC = () => {
  const navigate = useRouter();
  const [user, setUser] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      navigate.push('/login');
      return;
    }
    const userData = JSON.parse(userStr);
    setUser(userData);

    fetch(`/api/payments/read_user?user_id=${userData.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          setTransactions(data.data);
        }
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [navigate]);

  if (!user) return null;

  const totalSpent = transactions
    .filter((tx) => tx.status === 'approved')
    .reduce((sum, tx) => sum + parseFloat(tx.amount), 0);

  const activePromoCount = transactions.filter(
    (tx) => tx.status === 'approved'
  ).length;

  return (
    <div className="w-full px-4 sm:px-6 lg:px-10 py-12 max-w-7xl mx-auto">
      {/* Back to Profile */}
      <div className="mb-8">
        <Link href="/profile" 
          className="inline-flex items-center gap-2 text-slate-500 hover:text-primary transition-colors font-bold text-xs uppercase tracking-widest bg-white px-4 py-2.5 rounded-xl border border-slate-200 shadow-sm"
        >
          <span className="material-icons text-sm">arrow_back</span>
          Back to Dashboard
        </Link>
      </div>

      {/* Header Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-gradient-to-r from-primary to-primary-light p-8 rounded-[2rem] text-white shadow-lg relative overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px'}}></div>
          <div className="relative z-10">
            <span className="material-icons text-white/80 text-3xl mb-4 block">account_balance_wallet</span>
            <p className="text-[10px] font-black uppercase tracking-widest text-white/70 mb-1">Total Promotional Spent</p>
            <p className="text-3xl font-black">${totalSpent.toFixed(2)} CAD</p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col justify-center">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <span className="material-icons text-2xl">campaign</span>
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Active Promotion Payments</p>
              <p className="text-2xl font-black text-slate-800">{activePromoCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col justify-center">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center">
              <span className="material-icons text-2xl">shield</span>
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Gateway Partner</p>
              <p className="text-lg font-black text-slate-800">Moneris Checkout</p>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">PCI DSS Level 1 Secure</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Transaction Logs */}
        <div className="lg:col-span-8 bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
          <h2 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
            <span className="material-icons text-primary">receipt_long</span>
            Transaction History
          </h2>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-4">
                <span className="material-icons text-slate-300 text-4xl">payments</span>
              </div>
              <h3 className="text-lg font-black text-slate-700 mb-2">No Transactions</h3>
              <p className="text-sm text-slate-400 font-medium">Any listing promotion payments you complete will be securely logged here.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-y border-slate-100 uppercase text-[10px] font-black text-slate-400 tracking-widest">
                  <tr>
                    <th className="px-6 py-4 rounded-l-xl">Details</th>
                    <th className="px-6 py-4">Amount</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 rounded-r-xl">Date & Receipt</th>
                  </tr>
                </thead>
                <tbody className="text-sm font-medium">
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-black text-slate-800">{tx.promotions_readable}</p>
                          <p className="text-xs text-slate-500 font-medium">
                            Listing: {tx.listing_title ? (
                              <Link href={`/item/${tx.listing_id}`} className="text-primary hover:underline">{tx.listing_title}</Link>
                            ) : (
                              <span className="text-slate-400 italic">Deleted listing</span>
                            )}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-black text-slate-700">${parseFloat(tx.amount).toFixed(2)}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] uppercase font-black tracking-widest ${
                          tx.status === 'approved' 
                            ? 'bg-green-50 text-green-700' 
                            : tx.status === 'declined' 
                              ? 'bg-red-50 text-red-700' 
                              : 'bg-amber-50 text-amber-700'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            tx.status === 'approved' 
                              ? 'bg-green-500' 
                              : tx.status === 'declined' 
                                ? 'bg-red-500' 
                                : 'bg-amber-500'
                          }`}></span>
                          {tx.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-500 font-bold">
                        <p>{new Date(tx.created_at).toLocaleString('en-CA')}</p>
                        {tx.receipt_id && (
                          <p className="text-[10px] text-slate-400 font-mono mt-0.5">Receipt: {tx.receipt_id}</p>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Promotion Pricing Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-primary/5 rounded-[2rem] border border-primary/20 p-8">
            <h3 className="font-black mb-6 flex items-center gap-2 text-primary uppercase tracking-widest text-sm">
              <span className="material-icons text-base">campaign</span>
              Promotion Packages
            </h3>
            <ul className="space-y-4">
              {[
                { name: 'Top Ad', price: '$9.99', desc: 'Keeps ad at top of listings' },
                { name: 'Highlighted', price: '$4.99', desc: 'Bright styled stand-out bg' },
                { name: 'Urgent', price: '$5.99', desc: 'Urgent call-out ribbon tag' },
                { name: 'Home Gallery', price: '$14.99', desc: 'Featured on home carousel' },
              ].map((pkg) => (
                <li key={pkg.name} className="flex justify-between items-start border-b border-primary/10 pb-3 last:border-0 last:pb-0">
                  <div>
                    <h4 className="font-black text-slate-800 text-sm">{pkg.name}</h4>
                    <p className="text-xs text-slate-500 font-medium">{pkg.desc}</p>
                  </div>
                  <span className="text-xs font-black bg-primary/10 text-primary px-2.5 py-1 rounded-lg shrink-0">
                    {pkg.price}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-slate-50 rounded-[2rem] border border-slate-200 p-8">
            <h3 className="font-black mb-4 flex items-center gap-2 text-slate-700 uppercase tracking-widest text-xs">
              <span className="material-icons text-sm">lock</span>
              Payment Security
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              We process credit card transactions securely using Moneris Checkout. We do not store credit card details directly on our server. All data entry is securely routed to Moneris' PCI compliant environment.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPortal;

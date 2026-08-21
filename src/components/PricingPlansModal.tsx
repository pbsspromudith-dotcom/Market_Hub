"use client";

import React, { useEffect } from 'react';

export interface PricingPlansModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPlan: (plan: 'free' | 'boost' | 'premium', price: number) => void;
  isSubmitting?: boolean;
}

export const PricingPlansModal: React.FC<PricingPlansModalProps> = ({
  isOpen,
  onClose,
  onSelectPlan,
  isSubmitting = false,
}) => {
  // Prevent body scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-auto animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={isSubmitting}
          className="absolute top-5 right-5 z-10 w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700 flex items-center justify-center transition-all disabled:opacity-50 cursor-pointer"
          aria-label="Close"
        >
          <span className="material-icons text-xl">close</span>
        </button>

        {/* Modal Header */}
        <div className="pt-10 pb-6 px-6 text-center max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight mb-2">
            Pick Your HitAds Plan
          </h2>
          <p className="text-sm sm:text-base text-slate-500 font-medium">
            Choose the level of visibility that works for your ad.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="px-6 sm:px-10 pb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            
            {/* 1. FREE PLAN */}
            <div className="flex flex-col rounded-2xl border border-slate-200 bg-white p-7 hover:border-slate-300 hover:shadow-lg transition-all duration-200">
              {/* Header */}
              <div className="text-center pb-6 border-b border-slate-100">
                <h3 className="text-xl font-extrabold text-[#111827] uppercase tracking-wider mb-1">
                  FREE
                </h3>
                <p className="text-xs text-slate-400 font-medium mb-4">
                  Get your ad online
                </p>
                <div className="text-2xl sm:text-3xl font-black text-[#16a34a] tracking-tight">
                  FREE
                </div>
              </div>

              {/* Features List */}
              <div className="py-6 flex-1 space-y-3.5">
                <div className="flex items-center gap-2.5 text-sm text-slate-600 font-medium">
                  <span className="text-[#16a34a] font-bold text-base">✓</span>
                  <span>Up to 10 photos</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm text-slate-600 font-medium">
                  <span className="text-[#16a34a] font-bold text-base">✓</span>
                  <span>Standard listing</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm text-slate-600 font-medium">
                  <span className="text-[#16a34a] font-bold text-base">✓</span>
                  <span>Business phone / contact</span>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-4">
                <button
                  onClick={() => onSelectPlan('free', 0)}
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-6 rounded-xl bg-[#3b2885] hover:bg-[#312070] text-white font-bold text-sm uppercase tracking-wider transition-all duration-150 shadow-md hover:shadow-lg active:scale-[0.98] disabled:opacity-60 cursor-pointer"
                >
                  {isSubmitting ? 'Processing...' : 'SELECT'}
                </button>
              </div>
            </div>

            {/* 2. BOOST PLAN (MOST POPULAR) */}
            <div className="relative flex flex-col rounded-2xl border-2 border-[#2563eb] bg-white p-7 shadow-xl shadow-blue-500/10 hover:shadow-2xl hover:shadow-blue-500/15 transition-all duration-200 scale-[1.02] z-10">
              {/* Most Popular Banner */}
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#1d4ed8] text-white text-[11px] font-black uppercase tracking-widest py-1 px-4 rounded-full shadow-md">
                MOST POPULAR
              </div>

              {/* Header */}
              <div className="text-center pt-2 pb-6 border-b border-slate-100">
                <h3 className="text-xl font-extrabold text-[#111827] uppercase tracking-wider mb-1">
                  BOOST
                </h3>
                <p className="text-xs text-slate-400 font-medium mb-4">
                  Get noticed faster
                </p>
                <div className="text-2xl sm:text-3xl font-black text-[#16a34a] tracking-tight">
                  $9.99 <span className="text-sm font-semibold text-slate-500">/ 30 days</span>
                </div>
              </div>

              {/* Features List */}
              <div className="py-6 flex-1 space-y-3.5">
                <div className="flex items-center gap-2.5 text-sm text-slate-700 font-semibold">
                  <span className="text-[#16a34a] font-bold text-base">✓</span>
                  <span>Up to 20 photos</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm text-slate-600 font-medium">
                  <span className="text-[#16a34a] font-bold text-base">✓</span>
                  <span>Standard listing</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm text-slate-600 font-medium">
                  <span className="text-[#16a34a] font-bold text-base">✓</span>
                  <span>Automatic refresh every 7 days</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm text-slate-700 font-semibold">
                  <span className="text-[#16a34a] font-bold text-base">✓</span>
                  <span>Priority in search</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm text-slate-600 font-medium">
                  <span className="text-[#16a34a] font-bold text-base">✓</span>
                  <span>Website link</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm text-slate-600 font-medium">
                  <span className="text-[#16a34a] font-bold text-base">✓</span>
                  <span>Business phone / contact</span>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-4">
                <button
                  onClick={() => onSelectPlan('boost', 9.99)}
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-6 rounded-xl bg-[#3b2885] hover:bg-[#312070] text-white font-bold text-sm uppercase tracking-wider transition-all duration-150 shadow-md hover:shadow-lg active:scale-[0.98] disabled:opacity-60 cursor-pointer"
                >
                  {isSubmitting ? 'Processing...' : 'SELECT'}
                </button>
              </div>
            </div>

            {/* 3. PREMIUM PLAN */}
            <div className="flex flex-col rounded-2xl border border-slate-200 bg-white p-7 hover:border-slate-300 hover:shadow-lg transition-all duration-200">
              {/* Header */}
              <div className="text-center pb-6 border-b border-slate-100">
                <h3 className="text-xl font-extrabold text-[#111827] uppercase tracking-wider mb-1">
                  PREMIUM
                </h3>
                <p className="text-xs text-slate-400 font-medium mb-4">
                  Maximum exposure
                </p>
                <div className="text-2xl sm:text-3xl font-black text-[#16a34a] tracking-tight">
                  $24.99 <span className="text-sm font-semibold text-slate-500">/ 30 days</span>
                </div>
              </div>

              {/* Features List */}
              <div className="py-6 flex-1 space-y-3">
                <div className="flex items-center gap-2.5 text-sm text-slate-700 font-semibold">
                  <span className="text-[#16a34a] font-bold text-base">✓</span>
                  <span>Up to 20 photos</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm text-slate-600 font-medium">
                  <span className="text-[#16a34a] font-bold text-base">✓</span>
                  <span>Standard listing</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm text-slate-600 font-medium">
                  <span className="text-[#16a34a] font-bold text-base">✓</span>
                  <span>Automatic refresh every 3 days</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm text-slate-700 font-semibold">
                  <span className="text-[#16a34a] font-bold text-base">✓</span>
                  <span>Priority in search</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm text-blue-600 font-bold">
                  <span className="text-[#16a34a] font-bold text-base">✓</span>
                  <span>Multi-city posting - up to 5 cities</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm text-slate-600 font-medium">
                  <span className="text-[#16a34a] font-bold text-base">✓</span>
                  <span>Website link</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm text-slate-600 font-medium">
                  <span className="text-[#16a34a] font-bold text-base">✓</span>
                  <span>Facebook link</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm text-slate-600 font-medium">
                  <span className="text-[#16a34a] font-bold text-base">✓</span>
                  <span>YouTube link</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm text-slate-600 font-medium">
                  <span className="text-[#16a34a] font-bold text-base">✓</span>
                  <span>Business phone / contact</span>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-4">
                <button
                  onClick={() => onSelectPlan('premium', 24.99)}
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-6 rounded-xl bg-[#3b2885] hover:bg-[#312070] text-white font-bold text-sm uppercase tracking-wider transition-all duration-150 shadow-md hover:shadow-lg active:scale-[0.98] disabled:opacity-60 cursor-pointer"
                >
                  {isSubmitting ? 'Processing...' : 'SELECT'}
                </button>
              </div>
            </div>

          </div>

          {/* Footnote Caption */}
          <div className="mt-8 text-center">
            <p className="text-xs sm:text-sm text-slate-400 font-medium">
              Premium Multi-City Posting lets the same ad appear in up to 5 cities selected by the advertiser.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPlansModal;

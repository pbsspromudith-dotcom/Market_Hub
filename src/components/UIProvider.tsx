"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect, useRef } from 'react';

type AlertType = 'success' | 'error' | 'info' | 'warning';

interface ToastItem {
  id: string;
  message: string;
  type: AlertType;
  title?: string;
  duration?: number;
}

interface ConfirmConfig {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel?: () => void;
  isDestructive?: boolean;
}

interface UIContextType {
  showAlert: (message: string, type?: AlertType, title?: string) => void;
  showConfirm: (config: ConfirmConfig) => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export function useUI() {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
}

export function UIProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [confirmConfig, setConfirmConfig] = useState<ConfirmConfig | null>(null);

  const showAlert = (message: string, type: AlertType = 'info', title?: string) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newToast: ToastItem = {
      id,
      message,
      type,
      title: title || (type === 'success' ? 'Success' : type === 'error' ? 'Action Required' : type === 'warning' ? 'Notice' : 'Information'),
      duration: 4500,
    };

    setToasts((prev) => [newToast, ...prev].slice(0, 3)); // Keep max 3 toasts visible

    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const showConfirm = (config: ConfirmConfig) => {
    setConfirmConfig(config);
  };

  return (
    <UIContext.Provider value={{ showAlert, showConfirm }}>
      {children}

      {/* Global Alert Toasts Container — Floating Top Center */}
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[9999] flex flex-col gap-3 w-full max-w-md px-4 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="pointer-events-auto relative overflow-hidden rounded-2xl bg-white/95 backdrop-blur-xl border border-slate-200/80 shadow-[0_20px_50px_rgba(0,0,0,0.12)] p-4 sm:p-5 flex items-start gap-3.5 transition-all duration-300 animate-in fade-in slide-in-from-top-6 group"
          >
            {/* Color Accent Bar */}
            <div
              className={`absolute left-0 top-0 bottom-0 w-1.5 ${
                toast.type === 'success'
                  ? 'bg-gradient-to-b from-emerald-500 to-teal-600'
                  : toast.type === 'error'
                  ? 'bg-gradient-to-b from-red-500 to-rose-600'
                  : toast.type === 'warning'
                  ? 'bg-gradient-to-b from-amber-400 to-orange-500'
                  : 'bg-gradient-to-b from-blue-500 to-indigo-600'
              }`}
            />

            {/* Glowing Icon Badge */}
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
                toast.type === 'success'
                  ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                  : toast.type === 'error'
                  ? 'bg-red-50 text-red-600 border border-red-100'
                  : toast.type === 'warning'
                  ? 'bg-amber-50 text-amber-600 border border-amber-100'
                  : 'bg-blue-50 text-blue-600 border border-blue-100'
              }`}
            >
              <span className="material-icons text-xl">
                {toast.type === 'success'
                  ? 'check_circle'
                  : toast.type === 'error'
                  ? 'error'
                  : toast.type === 'warning'
                  ? 'warning'
                  : 'info'}
              </span>
            </div>

            {/* Text Message */}
            <div className="flex-1 min-w-0 pr-2 pt-0.5">
              <div className="flex items-center gap-2 mb-0.5">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-800">
                  {toast.title}
                </h4>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-slate-600 leading-relaxed break-words">
                {toast.message}
              </p>
            </div>

            {/* Dismiss Button */}
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-700 transition-colors p-1.5 rounded-lg hover:bg-slate-100 shrink-0"
              aria-label="Close notification"
            >
              <span className="material-icons text-sm">close</span>
            </button>

            {/* Auto-dismiss Countdown Progress Bar */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-100 overflow-hidden">
              <div
                className={`h-full animate-[toastProgress_4.5s_linear_forwards] ${
                  toast.type === 'success'
                    ? 'bg-emerald-500'
                    : toast.type === 'error'
                    ? 'bg-red-500'
                    : toast.type === 'warning'
                    ? 'bg-amber-500'
                    : 'bg-blue-500'
                }`}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Global Confirm Modal */}
      {confirmConfig && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
          {/* Backdrop Blur */}
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity animate-in fade-in duration-200"
            onClick={() => {
              if (confirmConfig.onCancel) confirmConfig.onCancel();
              setConfirmConfig(null);
            }}
          />

          {/* Modal Box */}
          <div className="relative bg-white rounded-3xl w-full max-w-sm sm:max-w-md p-6 sm:p-8 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.25)] border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Header Badge Icon */}
            <div
              className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-5 mx-auto shadow-lg ${
                confirmConfig.isDestructive !== false
                  ? 'bg-red-50 text-red-600 border border-red-100 shadow-red-500/10'
                  : 'bg-blue-50 text-blue-600 border border-blue-100 shadow-blue-500/10'
              }`}
            >
              <span className="material-icons text-3xl">
                {confirmConfig.isDestructive !== false ? 'warning' : 'help_outline'}
              </span>
            </div>

            <h3 className="text-xl font-black text-slate-800 mb-2 text-center tracking-tight">
              {confirmConfig.title}
            </h3>
            <p className="text-slate-500 text-center text-sm font-medium leading-relaxed mb-8">
              {confirmConfig.message}
            </p>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  if (confirmConfig.onCancel) confirmConfig.onCancel();
                  setConfirmConfig(null);
                }}
                className="flex-1 py-3.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-black rounded-xl transition-colors"
              >
                {confirmConfig.cancelText || 'Cancel'}
              </button>
              <button
                onClick={() => {
                  confirmConfig.onConfirm();
                  setConfirmConfig(null);
                }}
                className={`flex-1 py-3.5 px-4 text-sm font-black rounded-xl transition-all shadow-lg hover:shadow-xl active:scale-[0.98] ${
                  confirmConfig.isDestructive !== false
                    ? 'bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white shadow-red-500/30'
                    : 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-blue-500/30'
                }`}
              >
                {confirmConfig.confirmText || 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </UIContext.Provider>
  );
}

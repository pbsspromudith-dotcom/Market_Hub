"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

type AlertType = 'success' | 'error' | 'info';

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
  showAlert: (message: string, type?: AlertType) => void;
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
  const [alert, setAlert] = useState<{ message: string, type: AlertType } | null>(null);
  const [confirmConfig, setConfirmConfig] = useState<ConfirmConfig | null>(null);

  const showAlert = (message: string, type: AlertType = 'info') => {
    setAlert({ message, type });
    // Auto hide alert after 4 seconds
    setTimeout(() => setAlert(null), 4000);
  };

  const showConfirm = (config: ConfirmConfig) => {
    setConfirmConfig(config);
  };

  return (
    <UIContext.Provider value={{ showAlert, showConfirm }}>
      {children}
      
      {/* Global Alert Toast */}
      {alert && (
        <div className="fixed bottom-6 right-6 z-[100] transition-all duration-300">
          <div className={`px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 border ${
            alert.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' :
            alert.type === 'error' ? 'bg-red-50 border-red-200 text-red-800' :
            'bg-blue-50 border-blue-200 text-blue-800'
          }`}>
            <span className="material-icons">
              {alert.type === 'success' ? 'check_circle' : alert.type === 'error' ? 'error' : 'info'}
            </span>
            <p className="font-bold text-sm">{alert.message}</p>
            <button onClick={() => setAlert(null)} className="ml-4 opacity-50 hover:opacity-100 transition-opacity">
              <span className="material-icons text-sm">close</span>
            </button>
          </div>
        </div>
      )}

      {/* Global Confirm Modal */}
      {confirmConfig && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => {
            if (confirmConfig.onCancel) confirmConfig.onCancel();
            setConfirmConfig(null);
          }}></div>
          <div className="relative bg-white rounded-3xl w-full max-w-sm p-8 shadow-2xl border border-slate-100">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto ${
              confirmConfig.isDestructive !== false ? 'bg-red-50 text-red-500' : 'bg-primary/10 text-primary'
            }`}>
              <span className="material-icons text-3xl">
                {confirmConfig.isDestructive !== false ? 'warning' : 'help_outline'}
              </span>
            </div>
            <h3 className="text-xl font-black text-slate-800 mb-2 text-center">{confirmConfig.title}</h3>
            <p className="text-slate-500 text-center mb-8">{confirmConfig.message}</p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  if (confirmConfig.onCancel) confirmConfig.onCancel();
                  setConfirmConfig(null);
                }}
                className="flex-1 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors"
              >
                {confirmConfig.cancelText || 'Cancel'}
              </button>
              <button
                onClick={() => {
                  confirmConfig.onConfirm();
                  setConfirmConfig(null);
                }}
                className={`flex-1 py-3 px-4 font-bold rounded-xl transition-colors shadow-lg ${
                  confirmConfig.isDestructive !== false 
                    ? 'bg-red-500 hover:bg-red-600 text-white shadow-red-500/30' 
                    : 'bg-primary hover:bg-primary/90 text-white shadow-primary/30'
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

"use client";

import React, { useEffect, useState, useRef } from 'react';

interface MonerisPayModalProps {
  ticket: string;
  amount: number;
  environment: string;
  onSuccess: (receiptId: string) => void;
  onCancel: () => void;
}

const MonerisPayModal: React.FC<MonerisPayModalProps> = ({
  ticket,
  amount,
  environment,
  onSuccess,
  onCancel,
}) => {
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [isInitializingCheckout, setIsInitializingCheckout] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const checkoutInstanceRef = useRef<any>(null);

  // Load Moneris Checkout script dynamically
  useEffect(() => {
    const scriptUrl = environment === 'prod' 
      ? 'https://gateway.moneris.com/chktv2/js/chkt_v3.00.js'
      : 'https://gatewayt.moneris.com/chktv2/js/chkt_v3.00.js';
    
    const loadScript = () => {
      if (document.querySelector(`script[src="${scriptUrl}"]`)) {
        setIsScriptLoaded(true);
        return;
      }
      
      const script = document.createElement('script');
      script.src = scriptUrl;
      script.async = true;
      script.onload = () => {
        setIsScriptLoaded(true);
      };
      script.onerror = () => {
        setError('Failed to load Moneris payment library. Please check your internet connection.');
        setIsInitializingCheckout(false);
      };
      document.body.appendChild(script);
    };

    loadScript();

    return () => {
      // Clean up checkout if open
      if (checkoutInstanceRef.current) {
        try {
          checkoutInstanceRef.current.closeCheckout();
        } catch (e) {
          // Ignore error during cleanup. In Next.js Strict Mode, 
          // this fires immediately before the iframe is ready.
        }
      }
    };
  }, []);

  // Initialize Moneris Checkout when script is loaded and ticket is available
  useEffect(() => {
    if (!isScriptLoaded || !ticket) return;

    const initializeCheckout = () => {
      try {
        setError(null);
        setIsInitializingCheckout(true);

        const myCheckout = new window.monerisCheckout();
        checkoutInstanceRef.current = myCheckout;

        myCheckout.setMode(environment === 'prod' ? 'prod' : 'qa');
        myCheckout.setCheckoutDiv('monerisCheckoutDiv');

        // Setup callbacks
        myCheckout.setCallback('page_loaded', (data: string) => {
          console.log('Moneris page loaded:', data);
          setIsInitializingCheckout(false);
        });

        myCheckout.setCallback('cancel_transaction', (data: string) => {
          console.log('Moneris payment cancelled:', data);
          myCheckout.closeCheckout();
          onCancel();
        });

        myCheckout.setCallback('error_event', (data: string) => {
          console.error('Moneris error:', data);
          try {
            const parsed = JSON.parse(data);
            setError(parsed.message || 'An error occurred during payment processing.');
          } catch (e) {
            setError('An error occurred during payment processing.');
          }
          setIsInitializingCheckout(false);
        });

        // Additional v3.00 required callbacks
        myCheckout.setCallback('page_closed', (data: string) => {
          console.log('Moneris page closed:', data);
          myCheckout.closeCheckout();
          onCancel();
        });

        myCheckout.setCallback('payment_submitted', (data: string) => {
          console.log('Moneris payment submitted:', data);
          // Optional: handle UI loading state while waiting for payment_complete
        });

        myCheckout.setCallback('payment_complete', (data: string) => {
          console.log('Moneris payment completed:', data);
          myCheckout.closeCheckout();
          
          try {
            const parsed = JSON.parse(data);
            if (parsed.ticket) {
              verifyPayment(parsed.ticket);
            } else {
              setError('Payment completed but ticket information was missing.');
            }
          } catch (e) {
            setError('Failed to parse payment completion details.');
          }
        });

        // Start checkout
        myCheckout.startCheckout(ticket);

      } catch (err: any) {
        console.error('Failed to initialize Moneris Checkout:', err);
        setError('Could not initialize payment module: ' + (err.message || err));
        setIsInitializingCheckout(false);
      }
    };

    // Small timeout to ensure target div is mounted in the DOM
    const timer = setTimeout(initializeCheckout, 300);
    return () => clearTimeout(timer);
  }, [isScriptLoaded, ticket, environment]);

  const verifyPayment = async (completedTicket: string) => {
    setIsVerifying(true);
    setError(null);

    try {
      const response = await fetch('/api/payments/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticket: completedTicket }),
      });

      const data = await response.json();
      if (data.success) {
        onSuccess(data.receipt_id || 'SUCCESS');
      } else {
        setError(data.message || 'Payment verification failed. Please contact support.');
      }
    } catch (err) {
      console.error(err);
      setError('A network error occurred while verifying your payment. Please do not close this window and refresh the page.');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-slate-100/80 overflow-hidden flex flex-col my-8 animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-8 pt-8 pb-4 flex justify-between items-center border-b border-slate-100">
          <div>
            <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
              <span className="material-icons text-primary">shield</span>
              Secure Payment Gateway
            </h3>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-0.5">
              Powered by Moneris
            </p>
          </div>
          <button 
            disabled={isVerifying}
            onClick={onCancel}
            className="text-slate-400 hover:text-slate-600 transition-colors w-8 h-8 rounded-full hover:bg-slate-50 flex items-center justify-center disabled:opacity-50"
          >
            <span className="material-icons">close</span>
          </button>
        </div>

        {/* Payment Summary */}
        <div className="bg-slate-50/80 px-8 py-5 border-b border-slate-100 flex justify-between items-center">
          <span className="text-xs font-black text-slate-500 uppercase tracking-widest">Amount Due</span>
          <span className="text-2xl font-black text-slate-800">${amount.toFixed(2)} CAD</span>
        </div>

        {/* Content Area */}
        <div className="p-8 flex-1 flex flex-col justify-center min-h-[300px] relative">
          {/* Loading / Verifying States */}
          {(isInitializingCheckout || isVerifying || !isScriptLoaded) && (
            <div className="absolute inset-0 bg-white/90 backdrop-blur-sm z-10 flex flex-col items-center justify-center p-6 text-center">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
              <h4 className="font-black text-slate-700">
                {isVerifying 
                  ? 'Verifying transaction...' 
                  : !isScriptLoaded 
                    ? 'Loading payment gateway...' 
                    : 'Initializing Moneris Checkout...'}
              </h4>
              <p className="text-xs text-slate-400 mt-2 max-w-xs">
                {isVerifying 
                  ? 'Please do not refresh the page or click back while we secure your authorization.' 
                  : 'Establishing secure PCI-compliant connection.'}
              </p>
            </div>
          )}

          {/* Error Banner */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl mb-6 flex gap-3 items-start animate-in fade-in duration-300">
              <span className="material-icons text-xl mt-0.5 shrink-0">error_outline</span>
              <div>
                <p className="text-sm font-bold">Transaction Failed</p>
                <p className="text-xs mt-1 leading-relaxed">{error}</p>
                <button 
                  onClick={onCancel}
                  className="mt-3 text-xs font-black uppercase tracking-widest bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1.5 rounded-lg transition-colors"
                >
                  Return to options
                </button>
              </div>
            </div>
          )}

          {/* Moneris Checkout Container */}
          <div 
            id="monerisCheckoutDiv" 
            className={`w-full transition-opacity duration-300 ${
              isInitializingCheckout || isVerifying || error ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100'
            }`}
          ></div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50/50 px-8 py-5 border-t border-slate-100 flex items-center justify-center gap-2">
          <span className="material-icons text-slate-400 text-sm">lock</span>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            PCI DSS Compliant • 256-bit Encryption
          </span>
        </div>

      </div>
    </div>
  );
};

export default MonerisPayModal;

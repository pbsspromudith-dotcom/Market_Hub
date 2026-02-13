
import React, { useState } from 'react';

type HelpCategory = 'Safety' | 'Legal' | 'Pro' | 'Business';

const Help: React.FC = () => {
  const [activeTab, setActiveTab] = useState<HelpCategory>('Safety');
  
  const faqs: Record<HelpCategory, { q: string, a: string }[]> = {
    Safety: [
      { 
        q: "What are 'Safe Trade Zones' in Canada?", 
        a: "Many Canadian police services (Toronto Police Service, RCMP, Peel Regional Police) offer 'Safe Exchange Zones' or 'Buy and Sell Exchange Zones' in their station parking lots. These are well-lit, monitored by 24/7 video surveillance, and are the safest place to meet for an exchange in Canada." 
      },
      { 
        q: "How can I prevent Interac e-Transfer scams?", 
        a: "In Canada, Interac e-Transfer is a standard payment method. We recommend enabling 'Autodeposit' so funds go directly into your account. As a buyer, never send money before seeing and testing the item in person. Be wary of 'overpayment' scams where a buyer sends too much and asks for a partial refund." 
      }
    ],
    Legal: [
      { 
        q: "Is MarketHub compliant with PIPEDA?", 
        a: "Yes. We strictly adhere to the Personal Information Protection and Electronic Documents Act (PIPEDA). This means we protect your personal data with high-level encryption and only collect information necessary for the operation of the marketplace." 
      }
    ],
    Pro: [
      { 
        q: "When do I need to register for GST/HST?", 
        a: "According to the Canada Revenue Agency (CRA), if your total taxable revenues from your business (including marketplace sales) exceed $30,000 in a single calendar quarter or over four consecutive calendar quarters, you must register for and collect GST/HST." 
      }
    ],
    Business: [
      { 
        q: "What is the 'MarketHub Business' verified status?", 
        a: "For professional Canadian sellers, we offer a Business Verification badge. This requires proof of a valid Canadian Business Number (BN) and adherence to local municipal licensing requirements for second-hand dealers where applicable." 
      }
    ]
  };

  const categories = [
    { id: 'Safety', title: 'Trust & Safety', icon: 'shield', count: '12 ARTICLES' },
    { id: 'Legal', title: 'Legal & Privacy', icon: 'gavel', count: '8 ARTICLES' },
    { id: 'Pro', title: 'Pro Accounts', icon: 'star', count: '15 ARTICLES' },
    { id: 'Business', title: 'MarketHub Business', icon: 'business', count: '24 ARTICLES' },
  ];

  return (
    <div className="bg-slate-50 min-h-screen">
      <section className="bg-white border-b border-slate-100 pt-32 pb-24 px-4 text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-soft/5 rounded-full blur-3xl"></div>
        <div className="max-w-4xl mx-auto relative z-10">
          <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tight mb-8">Help Center</h1>
          <div className="relative max-w-2xl mx-auto">
            <span className="material-icons absolute left-6 top-5 text-primary-neutral">search</span>
            <input 
              type="text" 
              placeholder="Search for answers..." 
              className="w-full pl-16 pr-6 py-5 bg-slate-50 border-none rounded-[2rem] shadow-inner text-slate-900 font-medium focus:ring-4 focus:ring-primary/10 transition-all"
            />
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
          {categories.map((cat) => (
            <div 
              key={cat.id} 
              onClick={() => setActiveTab(cat.id as HelpCategory)}
              className={`bg-white p-16 rounded-[3rem] border transition-all cursor-pointer group text-center ${activeTab === cat.id ? 'border-primary-light ring-8 ring-primary-soft/10 shadow-2xl' : 'border-slate-100 shadow-sm hover:shadow-xl hover:border-slate-200'}`}
            >
              <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-10 group-hover:bg-primary-soft/10 transition-all">
                <span className={`material-icons text-4xl ${activeTab === cat.id ? 'text-primary-light' : 'text-primary-neutral'}`}>{cat.icon}</span>
              </div>
              <h4 className="text-2xl font-black mb-3 text-slate-900 tracking-tight">{cat.title}</h4>
              <p className="text-[10px] font-black text-primary-neutral uppercase tracking-[0.3em]">{cat.count}</p>
            </div>
          ))}
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
           <div className="mb-12 text-center md:text-left">
              <h2 className="text-3xl font-black text-slate-900 mb-2">{activeTab} Assistance</h2>
              <p className="text-primary-light font-bold text-xs uppercase tracking-widest">Protocol Version 2024.1</p>
           </div>
           
           {faqs[activeTab].map((faq, i) => (
             <div key={i} className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-black text-slate-900 mb-6 flex items-start gap-5 leading-tight">
                  <span className="w-8 h-8 rounded-lg bg-primary-soft/20 flex items-center justify-center text-primary-light text-xs flex-shrink-0 font-black">Q</span>
                  {faq.q}
                </h3>
                <div className="flex items-start gap-5">
                  <span className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-primary-neutral text-xs flex-shrink-0 font-black">A</span>
                  <p className="text-slate-600 font-medium leading-relaxed text-lg">
                    {faq.a}
                  </p>
                </div>
             </div>
           ))}
        </div>
      </main>
    </div>
  );
};

export default Help;

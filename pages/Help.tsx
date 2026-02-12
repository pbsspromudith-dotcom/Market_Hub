
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
      },
      { 
        q: "How do I report a fraudster to Canadian authorities?", 
        a: "If you have been a victim of a scam, report it to the Canadian Anti-Fraud Centre (CAFC) online or by calling 1-888-495-8501. You should also file a report with your local police service and provide our support team with the police report number." 
      }
    ],
    Legal: [
      { 
        q: "Is MarketHub compliant with PIPEDA?", 
        a: "Yes. We strictly adhere to the Personal Information Protection and Electronic Documents Act (PIPEDA). This means we protect your personal data with high-level encryption and only collect information necessary for the operation of the marketplace." 
      },
      { 
        q: "What are the Canadian rules on selling used electronics?", 
        a: "Under the Canada Consumer Product Safety Act (CCPSA), it is illegal to sell products that are recalled or do not meet current safety standards. Ensure any electronics you sell are safe to use and comply with Electrical Safety Authority (ESA) standards." 
      },
      { 
        q: "Do provincial consumer protection laws apply to me?", 
        a: "Generally, provincial Consumer Protection Acts (like Ontario's CPA or BC's Business Practices and Consumer Protection Act) apply to transactions between businesses and consumers. If you are a private individual selling a used couch, these laws typically do not apply, and sales are considered 'As-Is'." 
      }
    ],
    Pro: [
      { 
        q: "When do I need to register for GST/HST?", 
        a: "According to the Canada Revenue Agency (CRA), if your total taxable revenues from your business (including marketplace sales) exceed $30,000 in a single calendar quarter or over four consecutive calendar quarters, you must register for and collect GST/HST." 
      },
      { 
        q: "How should I report my marketplace income to the CRA?", 
        a: "If you are buying items with the intent to resell them for a profit, the CRA considers this 'business income.' You should keep detailed records of your sales and expenses to report on your T2125 form during tax season." 
      }
    ],
    Business: [
      { 
        q: "What is the 'MarketHub Business' verified status?", 
        a: "For professional Canadian sellers, we offer a Business Verification badge. This requires proof of a valid Canadian Business Number (BN) and adherence to local municipal licensing requirements for second-hand dealers where applicable." 
      },
      { 
        q: "How do Canadian shipping rules work?", 
        a: "If your business ships across provinces, you must comply with the Weights and Measures Act for accurate descriptions and ensure you are charging the correct PST/GST/HST based on the destination province (Place of Supply rules)." 
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
      {/* Search Header */}
      <section className="bg-white border-b border-slate-100 pt-32 pb-24 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tight mb-8">Help Center</h1>
          <div className="relative max-w-2xl mx-auto">
            <span className="material-icons absolute left-6 top-5 text-slate-400">search</span>
            <input 
              type="text" 
              placeholder="Search safety tips, legal rules, or help..." 
              className="w-full pl-16 pr-6 py-5 bg-slate-50 border-none rounded-[2rem] shadow-inner text-slate-900 font-medium focus:ring-4 focus:ring-primary/10 transition-all"
            />
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 py-20">
        {/* Topic Grid (Exactly as per provided Screenshot) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
          {categories.map((cat) => (
            <div 
              key={cat.id} 
              onClick={() => setActiveTab(cat.id as HelpCategory)}
              className={`bg-white p-16 rounded-[3rem] border transition-all cursor-pointer group text-center ${activeTab === cat.id ? 'border-primary ring-8 ring-primary/5 shadow-2xl' : 'border-slate-100 shadow-sm hover:shadow-xl hover:border-slate-200'}`}
            >
              <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-10 group-hover:bg-primary/5 transition-all">
                <span className={`material-icons text-4xl ${activeTab === cat.id ? 'text-primary' : 'text-slate-300'}`}>{cat.icon}</span>
              </div>
              <h4 className="text-2xl font-black mb-3 text-slate-900 tracking-tight">{cat.title}</h4>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">{cat.count}</p>
            </div>
          ))}
        </div>

        {/* Dynamic FAQ Content */}
        <div className="max-w-4xl mx-auto space-y-8">
           <div className="mb-12 text-center md:text-left">
              <h2 className="text-3xl font-black text-slate-900 mb-2">{activeTab} Guidance</h2>
              <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Official Canada Trading Protocols 2024</p>
           </div>
           
           {faqs[activeTab].map((faq, i) => (
             <div key={i} className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-black text-slate-900 mb-6 flex items-start gap-5 leading-tight">
                  <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary text-xs flex-shrink-0 font-black">Q</span>
                  {faq.q}
                </h3>
                <div className="flex items-start gap-5">
                  <span className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-300 text-xs flex-shrink-0 font-black">A</span>
                  <p className="text-slate-600 font-medium leading-relaxed text-lg">
                    {faq.a}
                  </p>
                </div>
             </div>
           ))}
        </div>

        {/* Safety Badges Footer */}
        <div className="mt-32 pt-20 border-t border-slate-100 flex flex-wrap justify-center gap-12 md:gap-20">
          {[
            { icon: 'verified_user', label: 'PIPEDA PROTECTED' },
            { icon: 'account_balance', label: 'CRA REGISTERED' },
            { icon: 'location_on', label: 'SAFE TRADE ZONES' },
            { icon: 'privacy_tip', label: 'FRAUD PREVENTION' }
          ].map(badge => (
            <div key={badge.label} className="flex flex-col items-center gap-4 opacity-40 hover:opacity-100 transition-opacity">
               <span className="material-icons text-3xl text-primary">{badge.icon}</span>
               <span className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em]">{badge.label}</span>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Help;

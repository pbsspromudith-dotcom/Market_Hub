
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Help: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Safety');
  
  const faqs = {
    Safety: [
      { 
        q: "Where is the safest place to meet for a trade in Canada?", 
        a: "We highly recommend using 'Safe Exchange Zones' located at many local Canadian Police Service stations (e.g., TPS, Peel, or RCMP detachments). These are well-lit areas monitored by cameras 24/7. Always avoid meeting in secluded areas or private residences." 
      },
      { 
        q: "How should I handle Interac e-Transfers safely?", 
        a: "Enable 'Autodeposit' on your bank account so funds are received immediately without a security question. For buyers, never send an e-Transfer before seeing the item in person. Be wary of 'overpayment' scams where a buyer sends more than the price and asks for the difference back." 
      },
      { 
        q: "What should I do if I've been scammed?", 
        a: "In addition to reporting the user on MarketHub, you should contact your local police and the Canadian Anti-Fraud Centre (CAFC) at 1-888-495-8501 or through their online reporting tool. This helps track national fraud trends." 
      },
      {
        q: "Is it legal to sell used items without a permit?",
        a: "Generally, yes, for occasional personal items. However, if you are 'carrying on a business' (buying to resell for profit), you may need a municipal business license and must report income to the CRA. If your revenue exceeds $30,000/year, you must register for a GST/HST number."
      }
    ],
    Buying: [
      { q: "How do I verify a seller's identity?", a: "Look for the 'Verified' badge on profiles, which indicates the user has confirmed their Canadian phone number and email. Check their rating and 'Joined' date to see their history in the community." },
      { q: "Can I return an item?", a: "Most private sales in Canada are 'As-Is' unless otherwise specified. We recommend testing electronics and inspecting goods thoroughly before completing the transaction. Consumer protection laws generally apply to businesses, not private individuals." },
      { q: "Are there shipping options?", a: "MarketHub is primarily for local pickup. If you choose to ship, we recommend using Canada Post with 'Collect on Delivery' (COD) or tracking to ensure both parties are protected." }
    ],
    Selling: [
      { q: "What are the rules for selling food or plants?", a: "Canada has strict regulations regarding the sale of homemade food and certain plants (to prevent invasive species). Ensure you comply with your local Health Unit requirements and CFIA regulations before posting." },
      { q: "How do I write a legally compliant ad?", a: "Be honest. Under Canadian law, misrepresenting an item's condition or safety can lead to liability. Disclose all known defects, especially for vehicles (OMVIC rules) and children's products (CCPSA)." },
      { q: "How much does it cost?", a: "Standard listings are free. Premium 'Featured' spots follow a transparent pricing model with applicable GST/HST included at checkout." }
    ],
    Account: [
      { q: "How is my data protected under Canadian law?", a: "MarketHub is fully PIPEDA compliant. We do not sell your personal data to third parties. Your information is stored on secure servers and you have the right to request your data or account deletion at any time." },
      { q: "Why was my ad removed?", a: "Ads are removed if they violate our community guidelines or Canadian law (e.g., recalled products, counterfeit goods, or prohibited weapons). Check your email for a specific reason from our moderation team." }
    ]
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="bg-slate-900 py-24 px-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[100px] -mr-48 -mt-48"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tight">Support & Safety Center</h1>
          <div className="relative max-w-2xl mx-auto">
            <span className="material-icons absolute left-6 top-5 text-slate-400">search</span>
            <input 
              type="text" 
              placeholder="Search safety tips, legal rules, or help..." 
              className="w-full pl-16 pr-6 py-5 bg-white border-none rounded-[1.8rem] shadow-2xl text-slate-900 font-medium focus:ring-4 focus:ring-primary/20 transition-all"
            />
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
             {['PIPEDA', 'Safe Zones', 'e-Transfer', 'CRA Rules'].map(tag => (
               <button key={tag} className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white/80 rounded-full text-xs font-bold transition-colors">
                 {tag}
               </button>
             ))}
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 py-20">
        {/* Topic Grid (As per requested screenshot) */}
        <section className="mb-32">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black mb-4">Browse by Topic</h2>
            <p className="text-slate-500">Essential information for Canadian traders</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="bg-white p-12 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:border-primary/20 transition-all cursor-pointer group text-center">
              <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-8 group-hover:bg-primary/10 transition-all">
                <span className="material-icons text-3xl text-slate-400 group-hover:text-primary">shield</span>
              </div>
              <h4 className="text-xl font-black mb-2">Trust & Safety</h4>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">12 ARTICLES</p>
            </div>
            
            <div className="bg-white p-12 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:border-primary/20 transition-all cursor-pointer group text-center">
              <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-8 group-hover:bg-primary/10 transition-all">
                <span className="material-icons text-3xl text-slate-400 group-hover:text-primary">gavel</span>
              </div>
              <h4 className="text-xl font-black mb-2">Legal & Privacy</h4>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">8 ARTICLES</p>
            </div>

            <div className="bg-white p-12 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:border-primary/20 transition-all cursor-pointer group text-center">
              <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-8 group-hover:bg-primary/10 transition-all">
                <span className="material-icons text-3xl text-slate-400 group-hover:text-primary">star</span>
              </div>
              <h4 className="text-xl font-black mb-2">Pro Accounts</h4>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">15 ARTICLES</p>
            </div>

            <div className="bg-white p-12 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:border-primary/20 transition-all cursor-pointer group text-center">
              <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-8 group-hover:bg-primary/10 transition-all">
                <span className="material-icons text-3xl text-slate-400 group-hover:text-primary">business</span>
              </div>
              <h4 className="text-xl font-black mb-2">MarketHub Business</h4>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">24 ARTICLES</p>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 border-t pt-20 border-slate-100">
          {/* Categories Sidebar */}
          <aside className="lg:col-span-3">
            <nav className="sticky top-24 space-y-2">
              {Object.keys(faqs).map(tab => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`w-full text-left px-6 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-900'}`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </aside>

          {/* FAQ Content */}
          <div className="lg:col-span-9">
            <div className="mb-12">
              <h2 className="text-3xl font-black mb-4">{activeTab} Guidelines</h2>
              <p className="text-slate-500 font-medium italic">All guidelines are updated to reflect latest Canadian Federal and Provincial regulations.</p>
            </div>

            <div className="space-y-6">
              {faqs[activeTab as keyof typeof faqs].map((faq, i) => (
                <div key={i} className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 hover:bg-white hover:border-primary/20 hover:shadow-xl transition-all group">
                  <h3 className="text-xl font-black mb-4 flex items-start gap-4 text-slate-900">
                    <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary text-sm flex-shrink-0">Q</span>
                    {faq.q}
                  </h3>
                  <div className="flex items-start gap-4">
                    <span className="w-8 h-8 rounded-lg bg-slate-200 flex items-center justify-center text-slate-400 text-sm flex-shrink-0 group-hover:bg-slate-100 group-hover:text-slate-500 transition-colors">A</span>
                    <p className="text-slate-600 leading-relaxed font-medium pt-1">
                      {faq.a}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Support CTA */}
            <div className="mt-20 p-12 bg-primary/5 rounded-[3rem] border border-primary/20 text-center">
              <h3 className="text-2xl font-black mb-4">Can't find what you need?</h3>
              <p className="text-slate-500 max-w-md mx-auto mb-8 font-medium leading-relaxed">Our Canadian-based support team is available to assist with disputes or technical issues.</p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link to="/contact" className="px-10 py-4 bg-primary text-white font-black rounded-2xl shadow-xl shadow-primary/20 hover:bg-primary-hover transition-all">
                  Talk to a Real Person
                </Link>
                <button className="px-10 py-4 bg-white text-slate-900 border border-slate-200 font-black rounded-2xl hover:bg-slate-50 transition-all">
                  Emergency Safety Report
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Trust Badges */}
      <section className="bg-slate-900 py-16 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap justify-center gap-12 md:gap-24 opacity-60">
          <div className="flex items-center gap-3"><span className="material-icons text-primary">verified</span> <span className="text-xs font-black uppercase tracking-widest">PIPEDA Compliant</span></div>
          <div className="flex items-center gap-3"><span className="material-icons text-primary">security</span> <span className="text-xs font-black uppercase tracking-widest">Fraud Detection</span></div>
          <div className="flex items-center gap-3"><span className="material-icons text-primary">gavel</span> <span className="text-xs font-black uppercase tracking-widest">Consumer Rights</span></div>
        </div>
      </section>
    </div>
  );
};

export default Help;

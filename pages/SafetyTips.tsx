import React from 'react';

const SafetyTips: React.FC = () => {
  const [activeSection, setActiveSection] = React.useState<string | null>(null);

  const sections = [
    {
      id: 'general',
      title: 'General Marketplace Safety',
      shortTitle: 'General Safety',
      description: 'Always use caution when communicating and meeting with other users.',
      icon: 'shield',
      color: 'bg-blue-50 text-blue-600',
      content: (
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h4 className="font-bold text-slate-800 flex items-center gap-2">
              <span className="material-icons text-primary text-xl">recommend</span>
              Basic Recommendations
            </h4>
            <ul className="space-y-2 text-slate-600 text-sm">
              <li className="flex items-start gap-2">
                <span className="material-icons text-green-500 text-xs mt-1">check_circle</span>
                Trust your instincts
              </li>
              <li className="flex items-start gap-2">
                <span className="material-icons text-green-500 text-xs mt-1">check_circle</span>
                Be cautious of deals that seem too good to be true
              </li>
              <li className="flex items-start gap-2">
                <span className="material-icons text-green-500 text-xs mt-1">check_circle</span>
                Avoid rushed transactions
              </li>
              <li className="flex items-start gap-2">
                <span className="material-icons text-green-500 text-xs mt-1">check_circle</span>
                Keep communication professional
              </li>
            </ul>
          </div>
          <div className="bg-red-50 p-6 rounded-2xl border border-red-100">
            <h4 className="text-secondary font-black text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="material-icons text-sm">warning</span>
              Stay Alert for Red Flags
            </h4>
            <ul className="space-y-3 text-sm text-slate-700">
              <li className="flex items-center gap-2 font-medium">Refusal to meet in person</li>
              <li className="flex items-center gap-2 font-medium">Pressure to act quickly</li>
              <li className="flex items-center gap-2 font-medium">Unusual payment methods</li>
              <li className="flex items-center gap-2 font-medium">Inconsistent information</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 'meetings',
      title: 'Safe Meeting Tips',
      shortTitle: 'Meeting Safely',
      description: 'Meeting safely is one of the most important parts of marketplace transactions.',
      icon: 'groups',
      color: 'bg-emerald-50 text-emerald-600',
      content: (
        <div className="space-y-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h4 className="font-bold text-slate-800">Recommended Practices</h4>
              <ul className="grid grid-cols-1 gap-2">
                {[
                  'Meet in public places',
                  'Prefer daylight hours',
                  'Bring another person when possible',
                  'Inform someone where you are going',
                  'Avoid isolated locations',
                  'Leave immediately if you feel unsafe'
                ].map(item => (
                  <li key={item} className="flex items-center gap-3 text-sm text-slate-600 bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                    <span className="material-icons text-emerald-500 text-sm">location_on</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-6">
              <div className="p-6 bg-slate-900 text-white rounded-3xl relative overflow-hidden">
                <span className="material-icons absolute -right-4 -top-4 text-white/10 text-8xl">place</span>
                <h4 className="font-bold mb-4 flex items-center gap-2 text-primary-light">Good Meeting Locations</h4>
                <div className="flex flex-wrap gap-2">
                  {['Shopping plazas', 'Coffee shops', 'Police exchange zones', 'Public transit'].map(loc => (
                    <span key={loc} className="px-3 py-1 bg-white/10 rounded-full text-xs border border-white/10">{loc}</span>
                  ))}
                </div>
              </div>
              <div className="p-6 bg-primary/5 rounded-3xl border border-primary/10">
                <h4 className="font-bold text-primary mb-3">Vehicle Transactions</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Consider meeting at a mechanic shop, near Service Ontario locations, or at police-designated safe exchange areas.
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'payments',
      title: 'Payment Safety',
      shortTitle: 'Payment Safety',
      description: 'Online payment scams are common. Never release items until payment is confirmed.',
      icon: 'payments',
      color: 'bg-orange-50 text-orange-600',
      content: (
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h4 className="font-bold text-slate-800">Recommended Practices</h4>
            <div className="space-y-3">
              {[
                'Verify payment before releasing items',
                'Confirm e-transfers are fully deposited',
                'Be cautious with deposits',
                'Keep records of communications'
              ].map(p => (
                <div key={p} className="p-3 bg-white border border-slate-100 rounded-xl text-sm text-slate-600 flex items-center gap-3">
                  <span className="material-icons text-orange-500 text-lg">verified</span>
                  {p}
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <h4 className="font-bold text-slate-800">Avoid These Risks</h4>
            <div className="grid grid-cols-1 gap-2">
              {['Requests for gift cards', 'Cryptocurrency pressure', 'Overpayment requests', 'Suspicious screenshots'].map(risk => (
                <div key={risk} className="p-3 bg-red-50 text-red-700 rounded-xl text-xs font-bold flex items-center gap-2 border border-red-100">
                  <span className="material-icons text-sm">block</span>
                  {risk}
                </div>
              ))}
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'scams',
      title: 'Common Marketplace Scams',
      shortTitle: 'Common Scams',
      description: 'Understanding common scams can help users avoid fraud.',
      icon: 'gpp_bad',
      color: 'bg-red-50 text-red-600',
      content: (
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                t: 'Fake Shipping Scam',
                d: 'Claims they will send payment after shipping or requests shipping before payment clears.',
                s: 'Urgent requests, refuses local pickup.'
              },
              {
                t: 'Overpayment Scam',
                d: 'Buyer intentionally submits false proof of excess payment and requests a refund.',
                s: 'Offers more than asking price, requests refund quickly.'
              },
              {
                t: 'Fake Rental Scam',
                d: 'Fraudulent listings advertise fake properties and request deposits before viewings.',
                s: 'Rent far below market, landlord claims to be overseas.'
              },
              {
                t: 'Fake Buyer Scam',
                d: 'Pretends to purchase an item to collect personal info or attempt payment fraud.',
                s: 'Requests banking details, sends suspicious links.'
              }
            ].map(scam => (
              <div key={scam.t} className="p-6 bg-white border border-slate-100 rounded-3xl hover:shadow-xl transition-all group">
                <h5 className="font-bold text-slate-900 mb-2 group-hover:text-primary transition-colors">{scam.t}</h5>
                <p className="text-xs text-slate-500 mb-4 leading-relaxed">{scam.d}</p>
                <div className="pt-4 border-t border-slate-50">
                  <span className="text-[10px] font-black uppercase tracking-widest text-secondary block mb-1">Warning Signs</span>
                  <p className="text-[11px] text-slate-600 italic">{scam.s}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 'buying-selling',
      title: 'Buying & Selling Safety',
      shortTitle: 'Buying & Selling',
      description: 'Protect yourself during the entire transaction process.',
      icon: 'sync_alt',
      color: 'bg-indigo-50 text-indigo-600',
      content: (
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-indigo-50/50 border border-indigo-100">
              <h4 className="font-bold text-indigo-900 mb-4">For Buyers</h4>
              <ul className="text-xs space-y-2 text-indigo-800">
                <li>• Read listing & compare prices</li>
                <li>• Test items (especially electronics)</li>
                <li>• Verify serial numbers or receipts</li>
                <li>• Inspect for damage or missing parts</li>
              </ul>
            </div>
          </div>
          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200">
              <h4 className="font-bold text-slate-800 mb-4">For Sellers</h4>
              <ul className="text-xs space-y-2 text-slate-600">
                <li>• Verify payment fully before release</li>
                <li>• Count cash carefully</li>
                <li>• Avoid partial payment arrangements</li>
                <li>• Protect personal information</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'specifics',
      title: 'Specific Category Safety',
      shortTitle: 'Vehicles & Rentals',
      description: 'Vehicle and rental transactions require additional precautions.',
      icon: 'category',
      color: 'bg-cyan-50 text-cyan-600',
      content: (
        <div className="space-y-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-6 bg-white border border-cyan-100 rounded-3xl">
              <h4 className="font-bold text-cyan-800 mb-4 flex items-center gap-2">
                <span className="material-icons">directions_car</span>
                Vehicles
              </h4>
              <ul className="text-xs space-y-2 text-slate-500">
                <li>• Verify ownership documents & VIN</li>
                <li>• Request vehicle history reports</li>
                <li>• Use trusted mechanic's inspection</li>
                <li>• Avoid cash-only pressure</li>
              </ul>
            </div>
            <div className="p-6 bg-white border border-cyan-100 rounded-3xl">
              <h4 className="font-bold text-cyan-800 mb-4 flex items-center gap-2">
                <span className="material-icons">apartment</span>
                Rentals
              </h4>
              <ul className="text-xs space-y-2 text-slate-500">
                <li>• Visit property in person first</li>
                <li>• Verify landlord identity</li>
                <li>• Request written agreements</li>
                <li>• Research average rental pricing</li>
              </ul>
            </div>
          </div>
          <div className="p-6 bg-cyan-900 text-white rounded-3xl">
            <h4 className="font-bold mb-3 flex items-center gap-2">
              <span className="material-icons">work</span>
              Job Listing Safety
            </h4>
            <p className="text-xs text-cyan-100 leading-relaxed mb-4">
              Be cautious if employers request upfront payment, promise unrealistic income, or ask for banking info immediately. Research employers thoroughly.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'privacy',
      title: 'Protecting Your Privacy',
      shortTitle: 'Privacy & Data',
      description: 'Online safety also includes protecting your personal information.',
      icon: 'fingerprint',
      color: 'bg-slate-900 text-white',
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['SIN numbers', 'Passwords', 'Credit cards', 'Passport copies'].map(item => (
              <div key={item} className="p-4 bg-white/5 border border-white/10 rounded-2xl text-center">
                <span className="material-icons text-secondary mb-2">block</span>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Never Share</p>
                <p className="text-xs font-bold">{item}</p>
              </div>
            ))}
          </div>
          <div className="p-6 bg-white border border-slate-200 rounded-3xl">
            <h4 className="font-bold text-slate-800 mb-4">Recommended Practices</h4>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-slate-600">
              <div className="flex items-center gap-2"><span className="material-icons text-primary text-sm">lock</span> Use strong passwords</div>
              <div className="flex items-center gap-2"><span className="material-icons text-primary text-sm">no_photography</span> Remove info from photos</div>
              <div className="flex items-center gap-2"><span className="material-icons text-primary text-sm">link_off</span> Beware of suspicious links</div>
              <div className="flex items-center gap-2"><span className="material-icons text-primary text-sm">contact_support</span> Report suspicious activity</div>
            </div>
          </div>
        </div>
      )
    }
  ];

  React.useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const id = hash.replace("#", "").split("#")[1] || hash.replace("#", "");
      if (id) {
        setTimeout(() => scrollToSection(id), 500);
      }
    }
  }, []);

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const el = document.getElementById(id);
    if (el) {
      const offset = 160;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-secondary to-secondary-hover text-white py-24 px-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-black rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
          <h1 className="text-4xl md:text-7xl font-black tracking-tight">
            Safety Tips
          </h1>
          <p className="text-lg md:text-xl text-white/80 font-medium max-w-2xl mx-auto">
            Your safety is our priority. Learn how to stay protected while buying, selling, and advertising online.
          </p>
          <div className="pt-4 flex justify-center gap-4">
            <span className="bg-white/10 backdrop-blur-md px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-white/20">
              Stay Secure
            </span>
            <span className="bg-white/10 backdrop-blur-md px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-white/20">
              Avoid Scams
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar Navigation */}
          <aside className="lg:w-80 shrink-0">
            <div className="sticky top-32 space-y-8">
              <div className="bg-white rounded-[2rem] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 px-4">
                  Safety Navigator
                </h3>
                <nav className="space-y-1">
                  {sections.map(section => (
                    <button
                      key={section.id}
                      onClick={() => scrollToSection(section.id)}
                      className={`w-full group flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 text-left ${activeSection === section.id ? 'bg-secondary/5 ring-1 ring-secondary/10' : 'hover:bg-slate-50'}`}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${activeSection === section.id ? 'bg-secondary text-white shadow-lg shadow-secondary/20' : 'bg-slate-100 text-slate-400 group-hover:bg-white group-hover:text-secondary group-hover:shadow-md'}`}>
                        <span className="material-icons text-xl">{section.icon}</span>
                      </div>
                      <span className={`text-[13px] font-bold leading-tight transition-colors ${activeSection === section.id ? 'text-secondary' : 'text-slate-600 group-hover:text-secondary'}`}>
                        {section.shortTitle}
                      </span>
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-8 bg-slate-900 text-white rounded-[2rem] shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-secondary opacity-20 blur-3xl group-hover:opacity-40 transition-opacity"></div>
                <h4 className="text-xs font-black uppercase tracking-widest mb-2 opacity-60">Need Assistance?</h4>
                <p className="text-sm font-medium mb-6 leading-relaxed">Our support team is here to help with any safety concerns.</p>
                <a href="mailto:customerservice@hitads.ca" className="inline-flex items-center gap-3 px-6 py-3 bg-white text-slate-900 rounded-xl font-bold text-xs hover:bg-secondary hover:text-white transition-all shadow-lg">
                  <span className="material-icons text-sm">email</span>
                  Email Support
                </a>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 space-y-24">
            {sections.map((section) => (
              <section key={section.id} id={section.id} className="scroll-mt-40">
                <div className="flex items-center gap-6 mb-10">
                  <div className={`w-20 h-20 rounded-[2rem] ${section.color} flex items-center justify-center shadow-2xl shadow-black/5 relative`}>
                    <span className="material-icons text-4xl">{section.icon}</span>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-sm">
                        <div className="w-2 h-2 bg-slate-300 rounded-full"></div>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                      {section.title}
                    </h2>
                    <p className="text-slate-500 font-medium text-lg">
                      {section.description}
                    </p>
                  </div>
                </div>
                
                <div className={`bg-white rounded-[3rem] p-8 md:p-12 transition-all duration-700 border ${activeSection === section.id ? 'shadow-[0_40px_80px_-15px_rgba(0,0,0,0.1)] border-secondary/20 ring-8 ring-secondary/5' : 'shadow-[0_8px_30px_rgba(0,0,0,0.02)] border-slate-100'}`}>
                  {section.content}
                </div>
              </section>
            ))}

            {/* Reporting & Disclaimer */}
            <section className="bg-white rounded-[3rem] p-12 md:p-16 border border-slate-100 shadow-xl space-y-12">
                <div className="grid md:grid-cols-2 gap-12">
                    <div className="space-y-6">
                        <div className="w-12 h-12 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center">
                            <span className="material-icons">flag</span>
                        </div>
                        <h3 className="text-2xl font-black text-slate-900">Reporting Activity</h3>
                        <p className="text-slate-500 text-sm leading-relaxed">
                            Report suspicious listings, fraud attempts, or unsafe behavior. Your reports help improve marketplace safety for everyone.
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {['Fraud', 'Fake Ads', 'Harassment', 'Illegal items'].map(t => (
                                <span key={t} className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-bold uppercase tracking-wider">{t}</span>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-6">
                        <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center">
                            <span className="material-icons">family_restroom</span>
                        </div>
                        <h3 className="text-2xl font-black text-slate-900">Parents & Families</h3>
                        <p className="text-slate-500 text-sm leading-relaxed">
                            Always supervise transactions involving minors. Keep family members informed about meetings and use public locations.
                        </p>
                    </div>
                </div>
                
                <div className="pt-12 border-t border-slate-100 text-center space-y-6">
                    <div className="flex items-center justify-center gap-4 text-secondary">
                        <span className="material-icons">gpp_maybe</span>
                        <span className="font-black uppercase tracking-widest text-xs">Safety Disclaimer</span>
                        <span className="material-icons">gpp_maybe</span>
                    </div>
                    <p className="text-xs text-slate-400 max-w-3xl mx-auto leading-loose uppercase tracking-widest">
                        HitAds.ca is an online classifieds platform and does not guarantee listings, users, buyers, sellers, products, services, or transactions. 
                        Users are responsible for conducting their own due diligence.
                    </p>
                </div>
            </section>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 pb-12 text-center">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
          © HitAds.ca – Free Ads. Sell Fast. Buy Local. Canada-wide.
        </p>
      </div>
    </div>
  );
};

export default SafetyTips;

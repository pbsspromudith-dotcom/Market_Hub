import React from 'react';

const SellingAdvice: React.FC = () => {
  const [activeSection, setActiveSection] = React.useState<string | null>(null);

  const sections = [
    {
      id: 'listing',
      title: 'How to Create a Great Listing?',
      shortTitle: 'Create Great Listing',
      description: 'A well-written listing improves visibility and increases serious inquiries.',
      icon: 'edit_note',
      color: 'bg-blue-50 text-blue-600',
      content: (
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h4 className="font-bold text-slate-800 flex items-center gap-2">
              <span className="material-icons text-primary text-xl">title</span>
              Use a Clear Title
            </h4>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 italic text-sm text-slate-600">
                <span className="text-[10px] font-black uppercase text-slate-400 block mb-1">Bad Example</span>
                "Laptop for Sale"
                <span className="text-[10px] font-black uppercase text-primary block mt-3 mb-1">Good Example</span>
                "Dell XPS 13 – 16GB RAM – Excellent Condition – Toronto"
            </div>
            <p className="text-xs text-slate-500">Include: Product name, Brand, Specs, Condition, and Location.</p>
          </div>
          <div className="space-y-4">
            <h4 className="font-bold text-slate-800 flex items-center gap-2">
              <span className="material-icons text-primary text-xl">description</span>
              Honest Description
            </h4>
            <ul className="text-xs space-y-2 text-slate-600">
                <li>• Item condition & Specifications</li>
                <li>• Age of the item & Included accessories</li>
                <li>• Any damage or defects</li>
                <li>• Pickup or delivery information</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 'photography',
      title: 'Photography Tips for Sellers',
      shortTitle: 'Photography Tips',
      description: 'High-quality photos increase trust and improve response rates.',
      icon: 'photo_camera',
      color: 'bg-purple-50 text-purple-600',
      content: (
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h4 className="font-bold text-slate-800">Best Practices</h4>
              <div className="grid grid-cols-1 gap-2">
                {[
                  'Use natural lighting',
                  'Multiple angles',
                  'Clean background',
                  'Show accessories',
                  'Show any damage clearly'
                ].map(item => (
                  <div key={item} className="flex items-center gap-3 text-sm text-slate-600 bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                    <span className="material-icons text-purple-500 text-sm">check_circle</span>
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <div className="relative group overflow-hidden rounded-[2rem] shadow-xl">
                <img src="https://images.unsplash.com/photo-1542744094-24638eff58bb?auto=format&fit=crop&q=80" alt="Photography" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-purple-900/60 to-transparent flex items-end p-6">
                    <p className="text-white text-xs font-bold italic">Listings with multiple clear photos receive more inquiries.</p>
                </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'pricing',
      title: 'Pricing Your Item Properly',
      shortTitle: 'Pricing Advice',
      description: 'Correct pricing is one of the most important factors in selling successfully.',
      icon: 'sell',
      color: 'bg-emerald-50 text-emerald-600',
      content: (
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h4 className="font-bold text-slate-800">Before Setting a Price</h4>
            <div className="flex flex-wrap gap-2">
                {['Market Demand', 'Condition', 'Brand Popularity', 'Seasonality'].map(f => (
                    <span key={f} className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-[11px] font-bold">{f}</span>
                ))}
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">Research similar listings to stay competitive.</p>
          </div>
          <div className="p-6 bg-slate-900 text-white rounded-3xl border border-white/10">
            <h4 className="font-bold text-emerald-400 mb-3">Pricing Tips</h4>
            <ul className="text-xs space-y-2 text-slate-300">
                <li>• Leave room for negotiation</li>
                <li>• Mention if price is firm</li>
                <li>• Avoid unrealistic pricing</li>
                <li>• Update if no responses</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 'speed',
      title: 'Tips to Sell Faster',
      shortTitle: 'Sell Faster',
      description: 'Improve your chances of completing a sale with these strategies.',
      icon: 'bolt',
      color: 'bg-orange-50 text-orange-600',
      content: (
        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-6 bg-white border border-slate-100 rounded-3xl text-center space-y-3 shadow-sm hover:shadow-md transition-shadow">
            <span className="material-icons text-orange-500 text-3xl">shutter_speed</span>
            <h5 className="font-bold text-sm">Fast Response</h5>
            <p className="text-[11px] text-slate-500">Buyers contact multiple sellers. Quick replies win.</p>
          </div>
          <div className="p-6 bg-white border border-slate-100 rounded-3xl text-center space-y-3 shadow-sm hover:shadow-md transition-shadow">
            <span className="material-icons text-orange-500 text-3xl">update</span>
            <h5 className="font-bold text-sm">Keep Updated</h5>
            <p className="text-[11px] text-slate-500">Renew listings regularly and update photos/pricing.</p>
          </div>
          <div className="p-6 bg-white border border-slate-100 rounded-3xl text-center space-y-3 shadow-sm hover:shadow-md transition-shadow">
            <span className="material-icons text-orange-500 text-3xl">handshake</span>
            <h5 className="font-bold text-sm">Be Flexible</h5>
            <p className="text-[11px] text-slate-500">Offer flexible pickup times or local delivery.</p>
          </div>
        </div>
      )
    },
    {
      id: 'categories',
      title: 'Selling Specific Items',
      shortTitle: 'Electronics & Vehicles',
      description: 'Special advice for the most popular categories on HitAds.ca.',
      icon: 'category',
      color: 'bg-cyan-50 text-cyan-600',
      content: (
        <div className="space-y-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-6 bg-cyan-50/50 border border-cyan-100 rounded-3xl space-y-4">
              <h4 className="font-bold text-cyan-900 flex items-center gap-2">
                <span className="material-icons text-lg">smartphone</span>
                Electronics
              </h4>
              <ul className="text-xs space-y-2 text-cyan-800">
                <li>• Reset data & remove passwords</li>
                <li>• Include Processor, RAM, Storage</li>
                <li>• Mention battery & warranty status</li>
                <li>• Clean the device thoroughly</li>
              </ul>
            </div>
            <div className="p-6 bg-slate-50 border border-slate-200 rounded-3xl space-y-4">
              <h4 className="font-bold text-slate-800 flex items-center gap-2">
                <span className="material-icons text-lg">directions_car</span>
                Vehicles
              </h4>
              <ul className="text-xs space-y-2 text-slate-600">
                <li>• Prepare UVIP & Service records</li>
                <li>• Include Mileage & Accident history</li>
                <li>• Take photos of Engine & Interior</li>
                <li>• Show dashboard warning lights</li>
              </ul>
            </div>
          </div>
          <div className="p-6 bg-cyan-900 text-white rounded-3xl">
            <h4 className="font-bold mb-3">Selling Furniture</h4>
            <p className="text-xs text-cyan-100 leading-relaxed">
              Always provide Length, Width, and Height. Be honest about stains, wear, and assembly status. Accurate measurements reduce failed pickups.
            </p>
          </div>
        </div>
      )
    },
    {
        id: 'business',
        title: 'Business Seller Advice',
        shortTitle: 'Business Tips',
        description: 'Grow your local brand recognition and generate more leads.',
        icon: 'business',
        color: 'bg-slate-100 text-slate-800',
        content: (
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <ul className="space-y-3">
                {[
                  'Use your business name consistently',
                  'Include logo and branding',
                  'Add website and contact information',
                  'Respond professionally'
                ].map(tip => (
                  <li key={tip} className="flex items-start gap-3 text-sm text-slate-600">
                    <span className="material-icons text-primary text-lg">verified</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-primary text-white p-8 rounded-[2.5rem] shadow-2xl">
                <h4 className="font-black text-xl mb-4">Professional Benefits</h4>
                <div className="space-y-4 text-sm opacity-90 font-medium">
                    <p>• Build customer trust</p>
                    <p>• Increase visibility</p>
                    <p>• Generate more local leads</p>
                </div>
            </div>
          </div>
        )
      },
    {
      id: 'scams',
      title: 'Avoiding Seller Scams',
      shortTitle: 'Avoid Scams',
      description: 'Protect yourself from fraudulent buyers and payment traps.',
      icon: 'gpp_bad',
      color: 'bg-red-50 text-red-600',
      content: (
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h4 className="font-bold text-slate-800">Common Seller Scams</h4>
            <div className="space-y-3">
                {[
                  { t: 'Fake Payment Confirmation', d: 'Funds are never actually received.' },
                  { t: 'Overpayment Scam', d: 'Buyer requests refund for "accidental" overpayment.' },
                  { t: 'Shipping Scam', d: 'Requests shipment before payment clears.' }
                ].map(scam => (
                  <div key={scam.t} className="p-4 bg-white border border-red-100 rounded-2xl shadow-sm">
                    <h5 className="font-bold text-xs text-red-600 mb-1">{scam.t}</h5>
                    <p className="text-[11px] text-slate-500">{scam.d}</p>
                  </div>
                ))}
            </div>
          </div>
          <div className="bg-red-600 text-white p-6 rounded-[2rem] relative overflow-hidden">
            <span className="material-icons absolute -right-4 -bottom-4 text-white/10 text-9xl">security</span>
            <h4 className="font-black text-xs uppercase tracking-widest mb-4 opacity-80">Protection Tips</h4>
            <ul className="text-sm space-y-3 font-bold">
                <li>• Verify payment before release</li>
                <li>• Avoid unusual payment methods</li>
                <li>• Meet in safe public places</li>
                <li>• Trust your instincts</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 'seasonal',
      title: 'Seasonal Selling Advice',
      shortTitle: 'Seasonal Advice',
      description: 'Time your listings properly to increase demand and prices.',
      icon: 'calendar_month',
      color: 'bg-indigo-50 text-indigo-600',
      content: (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
                { s: 'Winter', i: 'ac_unit', t: 'Tires, Snow blowers' },
                { s: 'Spring', i: 'local_florist', t: 'Gardening, Patio' },
                { s: 'Summer', i: 'sunny', t: 'AC, Camping, Bikes' },
                { s: 'Fall', i: 'school', t: 'Laptops, Student Gear' }
            ].map(season => (
                <div key={season.s} className="p-4 bg-white border border-indigo-50 rounded-2xl text-center group hover:bg-indigo-600 transition-all duration-300">
                    <span className="material-icons text-indigo-600 mb-2 group-hover:text-white transition-colors">{season.i}</span>
                    <h5 className="font-black text-[10px] uppercase text-indigo-400 group-hover:text-indigo-200 block mb-1">{season.s}</h5>
                    <p className="text-[11px] font-bold text-slate-700 group-hover:text-white">{season.t}</p>
                </div>
            ))}
        </div>
      )
    }
  ];

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
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary to-primary-hover text-white py-24 px-4 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
          <h1 className="text-4xl md:text-7xl font-black tracking-tight">
            Selling Advice
          </h1>
          <p className="text-lg md:text-xl text-primary-soft font-medium max-w-2xl mx-auto">
            Create better listings, attract more buyers, and sell faster across Canada with our expert selling tips.
          </p>
          <div className="pt-4">
            <span className="bg-white/10 backdrop-blur-md px-8 py-3 rounded-full text-xs font-black uppercase tracking-[0.3em] border border-white/20">
              Professional Results
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar Navigation */}
          <aside className="lg:w-80 shrink-0">
            <div className="sticky top-32 space-y-8">
              <div className="bg-white rounded-[2.5rem] p-6 shadow-[0_10px_40px_rgb(0,0,0,0.03)] border border-slate-100">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 px-4">
                  Seller Navigator
                </h3>
                <nav className="space-y-1">
                  {sections.map(section => (
                    <button
                      key={section.id}
                      onClick={() => scrollToSection(section.id)}
                      className={`w-full group flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 text-left ${activeSection === section.id ? 'bg-primary/5 shadow-sm' : 'hover:bg-slate-50'}`}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${activeSection === section.id ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-slate-50 text-slate-400 group-hover:bg-white group-hover:text-primary'}`}>
                        <span className="material-icons text-xl">{section.icon}</span>
                      </div>
                      <span className={`text-[13px] font-bold leading-tight transition-colors ${activeSection === section.id ? 'text-primary' : 'text-slate-600 group-hover:text-primary'}`}>
                        {section.shortTitle}
                      </span>
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-8 bg-primary rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group">
                <h4 className="text-xs font-black uppercase tracking-widest mb-2 opacity-70">New to Selling?</h4>
                <p className="text-sm font-medium mb-6 leading-relaxed">Check our first-time seller checklist to get started professionally.</p>
                <div className="space-y-3">
                    {['Clean your item', 'Take quality photos', 'Price correctly'].map(step => (
                        <div key={step} className="flex items-center gap-2 text-[11px] font-bold">
                            <span className="material-icons text-sm">check</span>
                            {step}
                        </div>
                    ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 space-y-24">
            {sections.map((section) => (
              <section key={section.id} id={section.id} className="scroll-mt-40">
                <div className="flex items-center gap-6 mb-10">
                  <div className={`w-20 h-20 rounded-[2.2rem] ${section.color} flex items-center justify-center shadow-xl shadow-black/5`}>
                    <span className="material-icons text-4xl">{section.icon}</span>
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
                
                <div className={`bg-white rounded-[3.5rem] p-8 md:p-12 transition-all duration-700 border ${activeSection === section.id ? 'shadow-[0_50px_100px_-20px_rgba(0,0,0,0.12)] border-primary/20 ring-12 ring-primary/5 scale-[1.02]' : 'shadow-[0_10px_40px_rgba(0,0,0,0.02)] border-slate-100'}`}>
                  {section.content}
                </div>
              </section>
            ))}

            {/* Why Sell on HitAds & Footer Disclaimer */}
            <section className="bg-slate-900 rounded-[4rem] p-12 md:p-20 text-white relative overflow-hidden">
                <div className="relative z-10 max-w-4xl mx-auto space-y-16">
                    <div className="text-center space-y-6">
                        <h3 className="text-4xl font-black tracking-tight">Why Sell on HitAds.ca?</h3>
                        <p className="text-slate-400 max-w-2xl mx-auto">Connecting individuals and businesses across Canada with local buyers.</p>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-8">
                            {['Free Listings', 'Local Audience', 'Easy Management', 'Canadian Wide', 'Business Friendly', 'Active Community'].map(b => (
                                <div key={b} className="p-4 bg-white/5 rounded-2xl border border-white/10 text-xs font-bold uppercase tracking-widest text-primary-soft">{b}</div>
                            ))}
                        </div>
                    </div>

                    <div className="h-px bg-white/10"></div>

                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6">
                            <h4 className="text-xl font-bold">Communication is Key</h4>
                            <p className="text-sm text-slate-400 leading-relaxed">
                                Professional communication increases buyer confidence. Reply politely, answer clearly, and always inform buyers if an item is sold.
                            </p>
                        </div>
                        <div className="p-8 bg-secondary/10 rounded-[2.5rem] border border-secondary/20 space-y-4">
                            <div className="flex items-center gap-3 text-secondary">
                                <span className="material-icons">gpp_maybe</span>
                                <h5 className="font-black text-xs uppercase tracking-widest">Safety Reminder</h5>
                            </div>
                            <p className="text-[11px] text-slate-400 leading-loose uppercase tracking-widest">
                                HitAds.ca does not guarantee buyers, sellers, or transactions. Users are responsible for verifying all information.
                            </p>
                        </div>
                    </div>
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

export default SellingAdvice;

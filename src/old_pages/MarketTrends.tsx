"use client";

import React from "react";

const MarketTrends: React.FC = () => {
  const [activeSection, setActiveSection] = React.useState<string | null>(null);

  const sections = [
    {
      id: "why-trends",
      title: "Why Market Trends Matter",
      shortTitle: "Why Trends Matter",
      description:
        "Understanding activity cycles helps users make better decisions.",
      icon: "insights",
      color: "bg-blue-50 text-blue-600",
      content: (
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h4 className="font-bold text-slate-800">Key Benefits</h4>
            <div className="grid grid-cols-1 gap-2">
              {[
                "Price items more accurately",
                "Sell faster",
                "Find better buying opportunities",
                "Identify high-demand products",
                "Plan business advertising",
              ].map((benefit) => (
                <div
                  key={benefit}
                  className="flex items-center gap-3 text-sm text-slate-600 bg-white p-3 rounded-xl border border-slate-100 shadow-sm"
                >
                  <span className="material-icons text-blue-500 text-sm">
                    trending_up
                  </span>
                  {benefit}
                </div>
              ))}
            </div>
          </div>
          <div className="bg-blue-600 text-white p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden">
            <span className="material-icons absolute -right-4 -bottom-4 text-white/10 text-9xl">
              analytics
            </span>
            <p className="text-sm font-medium leading-relaxed opacity-90">
              Online ads change throughout the year. Certain products
              become more popular during specific seasons, economic conditions,
              and local demand cycles.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "vehicles",
      title: "Vehicle Market Trends",
      shortTitle: "Vehicle Trends",
      description:
        "Vehicles remain one of the most active categories in Canadian ads.",
      icon: "directions_car",
      color: "bg-emerald-50 text-emerald-600",
      content: (
        <div className="space-y-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-6 bg-white border border-emerald-100 rounded-3xl shadow-sm">
              <h4 className="font-bold text-emerald-900 mb-4 uppercase tracking-widest text-[10px]">
                Seasonal Demand
              </h4>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center shrink-0">
                    <span className="material-icons text-sm">ac_unit</span>
                  </div>
                  <div>
                    <span className="font-bold text-xs block">Winter</span>
                    <p className="text-[11px] text-slate-500">
                      SUVs, AWD vehicles, Winter tires, Snow removal equipment.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center shrink-0">
                    <span className="material-icons text-sm">sunny</span>
                  </div>
                  <div>
                    <span className="font-bold text-xs block">
                      Spring/Summer
                    </span>
                    <p className="text-[11px] text-slate-500">
                      Motorcycles, Boats, Recreational vehicles, Moving vans.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6 bg-slate-50 border border-slate-200 rounded-3xl">
              <h4 className="font-bold text-slate-800 mb-4 uppercase tracking-widest text-[10px]">
                Business Demand
              </h4>
              <div className="flex flex-wrap gap-2">
                {[
                  "Cargo Vans",
                  "Pickup Trucks",
                  "Commercial Trucks",
                  "Trades Vehicles",
                ].map((v) => (
                  <span
                    key={v}
                    className="px-3 py-1 bg-white border border-slate-200 text-slate-600 rounded-md text-[10px] font-bold"
                  >
                    {v}
                  </span>
                ))}
              </div>
              <p className="text-[11px] text-slate-500 mt-4 leading-relaxed">
                Strong demand from delivery businesses, contractors, and small
                businesses throughout Canada.
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "electronics",
      title: "Electronics Market Trends",
      shortTitle: "Electronics Trends",
      description:
        "Laptops and smartphones lead search traffic across all provinces.",
      icon: "smartphone",
      color: "bg-purple-50 text-purple-600",
      content: (
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              t: "Back-to-School",
              d: "Laptops, Tablets, Monitors, Desks.",
              i: "school",
              c: "text-blue-500",
            },
            {
              t: "Holiday Season",
              d: "Consoles, TVs, Smartphones, Gifts.",
              i: "redeem",
              c: "text-red-500",
            },
            {
              t: "Tax Refunds",
              d: "Upgrades to premium gaming rigs & PCs.",
              i: "account_balance_wallet",
              c: "text-emerald-500",
            },
          ].map((season) => (
            <div
              key={season.t}
              className="p-6 bg-white border border-slate-100 rounded-[2rem] shadow-sm hover:shadow-lg transition-all text-center space-y-3"
            >
              <span className={`material-icons ${season.c} text-3xl`}>
                {season.i}
              </span>
              <h5 className="font-bold text-sm">{season.t}</h5>
              <p className="text-[11px] text-slate-500">{season.d}</p>
            </div>
          ))}
        </div>
      ),
    },
    {
      id: "housing",
      title: "Rental Housing Trends",
      shortTitle: "Housing Trends",
      description:
        "High-interest category in major cities and university areas.",
      icon: "apartment",
      color: "bg-cyan-50 text-cyan-600",
      content: (
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h4 className="font-bold text-slate-800">Peak Demand Periods</h4>
            <div className="space-y-2">
              {[
                { p: "May – July", t: "Primary Moving Season" },
                { p: "August – Sept", t: "Student Rental Surge" },
                { p: "December", t: "Pre-January Search" },
              ].map((item) => (
                <div
                  key={item.p}
                  className="flex items-center justify-between p-3 bg-cyan-50/30 border border-cyan-100 rounded-xl"
                >
                  <span className="text-xs font-black text-cyan-700">
                    {item.p}
                  </span>
                  <span className="text-xs font-bold text-slate-600">
                    {item.t}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="p-6 bg-slate-900 text-white rounded-[2.5rem] relative overflow-hidden">
            <h4 className="font-bold text-sm mb-4">Common Searches</h4>
            <div className="grid grid-cols-2 gap-3">
              {[
                "Basements",
                "Condos",
                "Rooms",
                "Shared",
                "Short-term",
                "Commercial",
              ].map((s) => (
                <div
                  key={s}
                  className="flex items-center gap-2 text-[11px] font-medium opacity-80"
                >
                  <span className="w-1 h-1 bg-cyan-400 rounded-full"></span>
                  {s}
                </div>
              ))}
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "services",
      title: "Services & Employment Trends",
      shortTitle: "Jobs & Services",
      description:
        "Connecting local businesses with workers and specialized contractors.",
      icon: "work",
      color: "bg-indigo-50 text-indigo-600",
      content: (
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h4 className="font-bold text-slate-800">Popular Services</h4>
              <div className="flex flex-wrap gap-2">
                {[
                  "Renovations",
                  "Cleaning",
                  "Moving",
                  "Auto Repair",
                  "Snow Removal",
                  "Digital Marketing",
                ].map((s) => (
                  <span
                    key={s}
                    className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="font-bold text-slate-800">Hiring Seasons</h4>
              <ul className="text-xs space-y-2 text-slate-500">
                <li>
                  • <span className="font-bold text-slate-700">Spring:</span>{" "}
                  Construction & Landscaping
                </li>
                <li>
                  • <span className="font-bold text-slate-700">Summer:</span>{" "}
                  Student Jobs & General Labour
                </li>
                <li>
                  • <span className="font-bold text-slate-700">Winter:</span>{" "}
                  Holiday Retail & Staffing
                </li>
              </ul>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "pricing",
      title: "Pricing Trends & Behaviour",
      shortTitle: "Pricing Behaviour",
      description:
        "Understand what buyers look for and how to price effectively.",
      icon: "payments",
      color: "bg-orange-50 text-orange-600",
      content: (
        <div className="grid md:grid-cols-2 gap-8">
          <div className="p-6 bg-white border border-orange-100 rounded-3xl space-y-4 shadow-sm">
            <h4 className="font-black text-[10px] uppercase tracking-widest text-orange-600">
              What Buyers Want
            </h4>
            <div className="grid grid-cols-1 gap-3">
              {[
                "Fair Pricing",
                "Fast Replies",
                "Local Availability",
                "Safe Transactions",
              ].map((w) => (
                <div
                  key={w}
                  className="flex items-center gap-3 text-sm text-slate-700 font-medium"
                >
                  <span className="material-icons text-orange-500 text-lg">
                    check_circle
                  </span>
                  {w}
                </div>
              ))}
            </div>
          </div>
          <div className="p-8 bg-orange-600 text-white rounded-[3rem] shadow-xl">
            <h4 className="font-black text-xl mb-4">Pricing Tip</h4>
            <p className="text-sm opacity-90 leading-relaxed italic">
              "Compare similar active listings before setting your price. If
              your item is priced too high, buyers may skip it even if the
              condition is perfect."
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "local",
      title: "Local Trends Across Canada",
      shortTitle: "Local Insights",
      description:
        "Marketplace activity varies significantly by city and region.",
      icon: "map",
      color: "bg-slate-100 text-slate-800",
      content: (
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h4 className="font-bold text-slate-800">Major Urban Areas</h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Toronto, Brampton, Vancouver, and Calgary show intense demand for{" "}
              <span className="font-bold text-slate-700">
                Rentals, Jobs, and Professional Services
              </span>
              .
            </p>
          </div>
          <div className="space-y-4">
            <h4 className="font-bold text-slate-800">Smaller Communities</h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Rural areas and smaller towns see higher activity in{" "}
              <span className="font-bold text-slate-700">
                Farm Equipment, Tools, and Construction Services
              </span>
              .
            </p>
          </div>
        </div>
      ),
    },
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
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white py-24 px-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-full opacity-20 pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary rounded-full blur-[120px]"></div>
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-secondary rounded-full blur-[120px]"></div>
        </div>
        <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
          <h1 className="text-4xl md:text-7xl font-black tracking-tight">
            Market Trends
          </h1>
          <p className="text-lg md:text-xl text-slate-400 font-medium max-w-2xl mx-auto">
            Understand Canadian marketplace activity, seasonal demand, and
            popular categories to make smarter decisions.
          </p>
          <div className="pt-4">
            <span className="bg-white/10 backdrop-blur-md px-8 py-3 rounded-full text-xs font-black uppercase tracking-[0.3em] border border-white/20">
              Data Driven Decisions
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar Navigation */}
          <aside className="lg:w-80 shrink-0">
            <div className="sticky top-32 space-y-8">
              <div className="bg-white rounded-[2.5rem] p-6 shadow-[0_15px_50px_rgb(0,0,0,0.04)] border border-slate-100">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 px-4">
                  Trend Navigator
                </h3>
                <nav className="space-y-1">
                  {sections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => scrollToSection(section.id)}
                      className={`w-full group flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 text-left ${activeSection === section.id ? "bg-slate-900 shadow-xl scale-[1.02]" : "hover:bg-slate-50"}`}
                    >
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${activeSection === section.id ? "bg-primary text-white shadow-lg" : "bg-slate-100 text-slate-400 group-hover:bg-white group-hover:text-primary"}`}
                      >
                        <span className="material-icons text-xl">
                          {section.icon}
                        </span>
                      </div>
                      <span
                        className={`text-[13px] font-bold leading-tight transition-colors ${activeSection === section.id ? "text-white" : "text-slate-600 group-hover:text-primary"}`}
                      >
                        {section.shortTitle}
                      </span>
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-8 bg-secondary rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group">
                <h4 className="text-xs font-black uppercase tracking-widest mb-2 opacity-70">
                  Business Insights
                </h4>
                <p className="text-sm font-medium mb-6 leading-relaxed">
                  Reach local customers by updating listings regularly with
                  clear photos and links.
                </p>
                <a
                  href="mailto:customerservice@hitads.ca"
                  className="inline-flex items-center gap-2 text-xs font-bold bg-white/10 px-4 py-2 rounded-xl border border-white/20 hover:bg-white/20 transition-all"
                >
                  <span className="material-icons text-sm">
                    contact_support
                  </span>
                  Contact Support
                </a>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 space-y-24">
            {sections.map((section) => (
              <section
                key={section.id}
                id={section.id}
                className="scroll-mt-40"
              >
                <div className="flex items-center gap-6 mb-10">
                  <div
                    className={`w-20 h-20 rounded-[2.2rem] ${section.color} flex items-center justify-center shadow-xl shadow-black/5`}
                  >
                    <span className="material-icons text-4xl">
                      {section.icon}
                    </span>
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

                <div
                  className={`bg-white rounded-[3.5rem] p-8 md:p-12 transition-all duration-700 border ${activeSection === section.id ? "shadow-[0_60px_120px_-30px_rgba(0,0,0,0.15)] border-slate-900/10 ring-12 ring-slate-900/5" : "shadow-[0_10px_40px_rgba(0,0,0,0.02)] border-slate-100"}`}
                >
                  {section.content}
                </div>
              </section>
            ))}

            {/* Summary & Disclaimer */}
            <section className="bg-white rounded-[4rem] p-12 md:p-20 border border-slate-100 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-3xl rounded-full"></div>
              <div className="relative z-10 max-w-4xl mx-auto space-y-12">
                <div className="grid md:grid-cols-2 gap-12">
                  <div className="space-y-4">
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                      How to Benefit
                    </h3>
                    <div className="space-y-4">
                      <div className="p-4 bg-slate-50 rounded-2xl">
                        <span className="text-[10px] font-black text-primary uppercase tracking-widest block mb-2">
                          For Buyers
                        </span>
                        <p className="text-xs text-slate-600">
                          Identify the best time to buy and avoid overpaying by
                          tracking seasonal cycles.
                        </p>
                      </div>
                      <div className="p-4 bg-slate-50 rounded-2xl">
                        <span className="text-[10px] font-black text-secondary uppercase tracking-widest block mb-2">
                          For Sellers
                        </span>
                        <p className="text-xs text-slate-600">
                          Post during high-demand months and price competitively
                          using market insights.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-slate-900 text-white p-8 rounded-[3rem] space-y-6">
                    <div className="flex items-center gap-3 text-secondary">
                      <span className="material-icons">gpp_maybe</span>
                      <h4 className="font-black text-xs uppercase tracking-widest">
                        Market Disclaimer
                      </h4>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-loose uppercase tracking-[0.1em]">
                      Market trends may change based on location, season, and
                      economic conditions. Information provided is for general
                      guidance and not professional advice. Users should conduct
                      their own research.
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
          © HitAds.ca – Post free ads, sell fast, buy local, and connect with
          buyers and sellers across Canada.
        </p>
      </div>
    </div>
  );
};

export default MarketTrends;

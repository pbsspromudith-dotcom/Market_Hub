import React from "react";

const BuyingGuides: React.FC = () => {
  const [activeSection, setActiveSection] = React.useState<string | null>(null);
  const sections = [
    {
      id: "general-safety",
      title: "How to Buy Used Items Safely in Canada",
      shortTitle: "Used Items Safely in Canada",
      description:
        "Buying second-hand products online can save money, but buyers should always take precautions.",
      icon: "verified_user",
      color: "bg-blue-50 text-blue-600",
      content: (
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h4 className="font-bold text-slate-800 flex items-center gap-2">
              <span className="material-icons text-primary text-xl">
                fact_check
              </span>
              Before Contacting the Seller
            </h4>
            <ul className="space-y-2 text-slate-600 text-sm">
              <li className="flex items-start gap-2">
                <span className="material-icons text-green-500 text-xs mt-1">
                  check_circle
                </span>
                Read the listing carefully
              </li>
              <li className="flex items-start gap-2">
                <span className="material-icons text-green-500 text-xs mt-1">
                  check_circle
                </span>
                Compare prices with similar listings
              </li>
              <li className="flex items-start gap-2">
                <span className="material-icons text-green-500 text-xs mt-1">
                  check_circle
                </span>
                Review all photos closely
              </li>
              <li className="flex items-start gap-2">
                <span className="material-icons text-green-500 text-xs mt-1">
                  check_circle
                </span>
                Be cautious of listings priced far below market value
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="font-bold text-slate-800 flex items-center gap-2">
              <span className="material-icons text-primary text-xl">
                help_outline
              </span>
              Questions to Ask
            </h4>
            <ul className="space-y-2 text-slate-600 text-sm">
              <li className="flex items-start gap-2">
                <span className="material-icons text-blue-400 text-xs mt-1">
                  question_answer
                </span>
                How old is the item? Is it fully functional?
              </li>
              <li className="flex items-start gap-2">
                <span className="material-icons text-blue-400 text-xs mt-1">
                  question_answer
                </span>
                Are there any repairs or defects?
              </li>
              <li className="flex items-start gap-2">
                <span className="material-icons text-blue-400 text-xs mt-1">
                  question_answer
                </span>
                Is it still under warranty? Original receipts?
              </li>
              <li className="flex items-start gap-2">
                <span className="material-icons text-blue-400 text-xs mt-1">
                  question_answer
                </span>
                Why are you selling it?
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="font-bold text-slate-800 flex items-center gap-2">
              <span className="material-icons text-primary text-xl">
                groups
              </span>
              Safe Meeting Tips
            </h4>
            <ul className="space-y-2 text-slate-600 text-sm">
              <li className="flex items-start gap-2">
                <span className="material-icons text-orange-500 text-xs mt-1">
                  place
                </span>
                Meet in public locations during daytime
              </li>
              <li className="flex items-start gap-2">
                <span className="material-icons text-orange-500 text-xs mt-1">
                  place
                </span>
                Avoid isolated areas; bring a friend
              </li>
              <li className="flex items-start gap-2">
                <span className="material-icons text-orange-500 text-xs mt-1">
                  place
                </span>
                Test the item before payment
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="font-bold text-slate-800 flex items-center gap-2">
              <span className="material-icons text-primary text-xl">
                payments
              </span>
              Payment Safety
            </h4>
            <ul className="space-y-2 text-slate-600 text-sm">
              <li className="flex items-start gap-2">
                <span className="material-icons text-red-500 text-xs mt-1">
                  warning
                </span>
                Use secure payment methods
              </li>
              <li className="flex items-start gap-2">
                <span className="material-icons text-red-500 text-xs mt-1">
                  warning
                </span>
                Verify e-transfers before releasing payment
              </li>
              <li className="flex items-start gap-2">
                <span className="material-icons text-red-500 text-xs mt-1">
                  warning
                </span>
                Be cautious with deposits
              </li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: "laptops",
      title: "Buying a Used Laptop",
      shortTitle: "Used Laptop",
      description:
        "Used laptops are one of the most popular products on online marketplaces.",
      icon: "laptop",
      color: "bg-purple-50 text-purple-600",
      content: (
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h4 className="font-bold text-slate-800">
                Physical Inspection Checklist
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {[
                  "Screen condition",
                  "Keyboard functionality",
                  "Battery health",
                  "Charging port",
                  "Hinges",
                  "Webcam",
                  "USB ports",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-2 text-sm text-slate-600 bg-white p-2 rounded-lg border border-slate-100"
                  >
                    <span className="material-icons text-primary text-xs">
                      laptop_mac
                    </span>
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="font-bold text-slate-800">Recommended Specs</h4>
              <div className="space-y-3">
                <div className="p-3 bg-white rounded-xl border border-slate-100 shadow-sm">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">
                    Everyday Use
                  </span>
                  <p className="text-sm text-slate-600">
                    i5/Ryzen 5 • 8GB RAM • 256GB SSD
                  </p>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-100 shadow-sm">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">
                    Business/Gaming
                  </span>
                  <p className="text-sm text-slate-600">
                    i7/Ryzen 7 • 16GB+ RAM • 512GB+ SSD
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-primary/5 p-4 rounded-xl border border-primary/10">
            <h4 className="text-sm font-bold text-primary mb-2 flex items-center gap-2">
              <span className="material-icons text-sm">
                notification_important
              </span>
              Before Final Payment
            </h4>
            <p className="text-xs text-slate-600 mb-2">
              Always test: Wi-Fi, Audio, Webcam, Keyboard, Charging, USB ports,
              Screen brightness.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "vehicles",
      title: "Buying a Used Vehicle in Ontario",
      shortTitle: "Used Vehicle in Ontario",
      description:
        "Buying a used vehicle requires careful inspection and proper documentation.",
      icon: "directions_car",
      color: "bg-emerald-50 text-emerald-600",
      content: (
        <div className="space-y-6">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-4 bg-white rounded-xl border border-slate-100">
              <h4 className="text-sm font-bold text-slate-800 mb-3 uppercase tracking-wider">
                Documents
              </h4>
              <ul className="text-xs space-y-2 text-slate-500">
                <li>• Vehicle ownership</li>
                <li>• UVIP Package</li>
                <li>• Service records</li>
                <li>• CARFAX report</li>
              </ul>
            </div>
            <div className="p-4 bg-white rounded-xl border border-slate-100">
              <h4 className="text-sm font-bold text-slate-800 mb-3 uppercase tracking-wider">
                Exterior
              </h4>
              <ul className="text-xs space-y-2 text-slate-500">
                <li>• Rust & Tire wear</li>
                <li>• Paint mismatch</li>
                <li>• Windshield cracks</li>
                <li>• Accident signs</li>
              </ul>
            </div>
            <div className="p-4 bg-white rounded-xl border border-slate-100">
              <h4 className="text-sm font-bold text-slate-800 mb-3 uppercase tracking-wider">
                Interior
              </h4>
              <ul className="text-xs space-y-2 text-slate-500">
                <li>• Dashboard lights</li>
                <li>• AC / Heating</li>
                <li>• Power windows</li>
                <li>• Infotainment</li>
              </ul>
            </div>
          </div>
          <div className="bg-slate-900 text-white p-6 rounded-2xl">
            <h4 className="font-bold mb-4 flex items-center gap-2 text-primary-light">
              <span className="material-icons">speed</span>
              Test Drive Checklist
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-slate-300">
              <div className="flex items-center gap-2">
                <span className="material-icons text-primary-light text-xs">
                  noise_aware
                </span>{" "}
                No unusual noises
              </div>
              <div className="flex items-center gap-2">
                <span className="material-icons text-primary-light text-xs">
                  shutter_speed
                </span>{" "}
                Test braking
              </div>
              <div className="flex items-center gap-2">
                <span className="material-icons text-primary-light text-xs">
                  straighten
                </span>{" "}
                Steering alignment
              </div>
              <div className="flex items-center gap-2">
                <span className="material-icons text-primary-light text-xs">
                  thermostat
                </span>{" "}
                Engine temperature
              </div>
              <div className="flex items-center gap-2">
                <span className="material-icons text-primary-light text-xs">
                  settings_input_component
                </span>{" "}
                Acceleration/Shifting
              </div>
            </div>
          </div>
          <p className="text-xs font-bold text-secondary text-center">
            Safety Recommendation: Always have a trusted mechanic inspect used
            vehicles before purchase.
          </p>
        </div>
      ),
    },
    {
      id: "smartphones",
      title: "Buying Used Smartphones Safely",
      shortTitle: "Used Smartphones Safely",
      description:
        "Verify the device is fully functional and not locked or blacklisted.",
      icon: "smartphone",
      color: "bg-orange-50 text-orange-600",
      content: (
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h4 className="font-bold text-slate-800">Platform Specific Tips</h4>
            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-slate-100 bg-white">
                <span className="text-blue-600 font-bold text-sm block mb-2">
                  iPhone (iOS)
                </span>
                <ul className="text-xs space-y-1 text-slate-500">
                  <li>• iCloud lock removed</li>
                  <li>• Apple ID signed out</li>
                  <li>• Battery health % check</li>
                  <li>• True Tone functionality</li>
                </ul>
              </div>
              <div className="p-4 rounded-xl border border-slate-100 bg-white">
                <span className="text-green-600 font-bold text-sm block mb-2">
                  Android
                </span>
                <ul className="text-xs space-y-1 text-slate-500">
                  <li>• Google account removed</li>
                  <li>• Factory reset completed</li>
                  <li>• Charging speed check</li>
                  <li>• Display burn-in check</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="bg-red-50 p-6 rounded-2xl border border-red-100">
            <h4 className="text-secondary font-black text-xs uppercase tracking-widest mb-4">
              Warning Signs
            </h4>
            <div className="space-y-3">
              {[
                "Cannot be fully tested",
                "Suspiciously low prices",
                "Blocked IMEI numbers",
                "Sold without clear info",
              ].map((sign) => (
                <div
                  key={sign}
                  className="flex items-center gap-3 text-sm text-slate-700 font-medium"
                >
                  <span className="material-icons text-secondary text-lg">
                    error_outline
                  </span>
                  {sign}
                </div>
              ))}
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "furniture",
      title: "Buying Furniture Online",
      shortTitle: "Furniture Online",
      description:
        "Furniture shopping online requires planning and accurate measurements.",
      icon: "chair",
      color: "bg-indigo-50 text-indigo-600",
      content: (
        <div className="space-y-6">
          <div className="flex flex-wrap gap-4">
            {[
              "Room dimensions",
              "Doorways",
              "Staircases",
              "Elevator access",
            ].map((item) => (
              <div
                key={item}
                className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-xs font-bold"
              >
                Measure: {item}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              "Structural stability",
              "Water damage",
              "Fabric stains",
              "Odours",
              "Missing parts",
              "Scratches",
            ].map((check) => (
              <div
                key={check}
                className="p-3 bg-white border border-slate-100 rounded-xl text-sm text-slate-600 flex items-center gap-2"
              >
                <span className="material-icons text-slate-300 text-sm">
                  zoom_in
                </span>
                {check}
              </div>
            ))}
          </div>
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <h4 className="text-sm font-bold text-slate-800 mb-2">
              Pickup Tips
            </h4>
            <p className="text-xs text-slate-500">
              Confirm dimensions before pickup. Bring moving blankets or straps.
              Get assistance for heavy items.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "scams",
      title: "Avoiding Online Marketplace Scams",
      shortTitle: "Avoiding Marketplace Scams",
      description:
        "Online marketplaces are generally safe when users follow proper precautions.",
      icon: "gpp_bad",
      color: "bg-red-50 text-red-600",
      content: (
        <div className="space-y-8">
          <div className="grid md:grid-cols-2 gap-4">
            {[
              {
                t: "Fake Shipping Scam",
                d: "Scammer requests payment before shipping and disappears.",
              },
              {
                t: "Overpayment Scam",
                d: "Buyer sends fake payment confirmation or intentionally overpays.",
              },
              {
                t: "Fake Deposit Scam",
                d: "Fraudulent sellers request deposits for non-existent items.",
              },
              {
                t: "Rental Scam",
                d: "Fake landlords request deposits before property viewing.",
              },
            ].map((scam) => (
              <div
                key={scam.t}
                className="p-4 bg-white border border-red-100 rounded-xl hover:shadow-md transition-shadow"
              >
                <h5 className="font-bold text-sm text-slate-800 mb-1">
                  {scam.t}
                </h5>
                <p className="text-xs text-slate-500">{scam.d}</p>
              </div>
            ))}
          </div>
          <div className="bg-red-600 text-white p-6 rounded-2xl relative overflow-hidden">
            <span className="material-icons absolute -right-4 -bottom-4 text-white/10 text-9xl">
              warning
            </span>
            <h4 className="font-black text-xs uppercase tracking-widest mb-6 opacity-80">
              Major Red Flags
            </h4>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                "Refusal to meet in person",
                "Pressure to pay quickly",
                "Extremely low pricing",
                "Poor communication",
                "Requests for gift cards or crypto",
              ].map((flag) => (
                <div
                  key={flag}
                  className="flex items-center gap-3 text-sm font-bold"
                >
                  <span className="w-2 h-2 rounded-full bg-white/40"></span>
                  {flag}
                </div>
              ))}
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "business",
      title: "Buying Used Business Equipment",
      shortTitle: "Used Business Equipment",
      description:
        "Small businesses can save significantly by purchasing quality used commercial equipment.",
      icon: "business_center",
      color: "bg-slate-100 text-slate-800",
      content: (
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h4 className="font-bold text-slate-800">Popular Categories</h4>
            <div className="flex flex-wrap gap-2">
              {[
                "Restaurant",
                "Office",
                "Printers",
                "Signs",
                "Delivery Vans",
                "Shelving",
                "Tools",
              ].map((c) => (
                <span
                  key={c}
                  className="px-3 py-1 bg-slate-200 text-slate-700 rounded-md text-[11px] font-bold"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <h4 className="font-bold text-slate-800">What to Verify</h4>
            <ul className="text-xs space-y-2 text-slate-500">
              <li>• Maintenance history & Repair costs</li>
              <li>• Availability of replacement parts</li>
              <li>• Electrical compatibility</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: "rentals",
      title: "Rental Safety Tips",
      shortTitle: "Rental Safety Tips",
      description:
        "Rental scams are increasing. Always visit in person before paying.",
      icon: "apartment",
      color: "bg-cyan-50 text-cyan-600",
      content: (
        <div className="p-6 bg-white border border-cyan-100 rounded-2xl space-y-4">
          <h4 className="font-bold text-cyan-800">Before Paying Deposits</h4>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              "Visit the property in person",
              "Verify landlord identity",
              "Request written agreements",
              "Confirm parking and utilities",
              "Review lease terms carefully",
            ].map((tip) => (
              <div
                key={tip}
                className="flex items-center gap-2 text-sm text-slate-600"
              >
                <span className="material-icons text-cyan-500">verified</span>
                {tip}
              </div>
            ))}
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
        setTimeout(() => {
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
        }, 500);
      }
    }
  }, []);

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary to-primary-hover text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h1 className="text-4xl md:text-6xl font-black tracking-tight">
            Buying Guides
          </h1>
          <p className="text-lg md:text-xl text-primary-soft font-medium max-w-2xl mx-auto">
            Our goal is to help Canadians make safer, smarter, and more informed
            buying decisions when using online classifieds.
          </p>
          <div className="pt-4">
            <span className="bg-white/10 backdrop-blur-md px-6 py-2 rounded-full text-xs font-black uppercase tracking-[0.2em] border border-white/20">
              Shop With Confidence
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar Navigation */}
          <aside className="lg:w-72 shrink-0">
            <div className="sticky top-32 space-y-8">
              <div>
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 px-4">
                  Jump to Section
                </h3>
                <nav className="space-y-1">
                  {sections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => {
                        setActiveSection(section.id);
                        const el = document.getElementById(section.id);
                        if (el) {
                          const offset = 160; // Increased offset
                          const bodyRect =
                            document.body.getBoundingClientRect().top;
                          const elementRect = el.getBoundingClientRect().top;
                          const elementPosition = elementRect - bodyRect;
                          const offsetPosition = elementPosition - offset;
                          window.scrollTo({
                            top: offsetPosition,
                            behavior: "smooth",
                          });
                        }
                      }}
                      className={`w-full group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 text-left ${activeSection === section.id ? "bg-white shadow-md" : "hover:bg-white hover:shadow-sm"}`}
                    >
                      <span
                        className={`material-icons text-xl ${section.color.split(" ")[1]} ${activeSection === section.id ? "opacity-100" : "opacity-50 group-hover:opacity-100"} transition-opacity`}
                      >
                        {section.icon}
                      </span>
                      <span
                        className={`text-[13px] font-bold leading-tight transition-colors ${activeSection === section.id ? "text-primary" : "text-slate-600 group-hover:text-primary"}`}
                      >
                        {section.shortTitle}
                      </span>
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-6 bg-secondary/5 rounded-2xl border border-secondary/10">
                <h4 className="text-xs font-black text-secondary uppercase tracking-wider mb-2">
                  Need Help?
                </h4>
                <p className="text-[11px] text-slate-500 mb-4">
                  Contact our support for assistance.
                </p>
                <a
                  href="mailto:customerservice@hitads.ca"
                  className="text-xs font-bold text-slate-800 hover:text-primary transition-colors flex items-center gap-2"
                >
                  <span className="material-icons text-sm">email</span>
                  customerservice@hitads.ca
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
                <div className="flex items-start gap-6 mb-8">
                  <div
                    className={`w-16 h-16 rounded-2xl ${section.color} flex items-center justify-center shadow-lg shadow-black/5`}
                  >
                    <span className="material-icons text-3xl">
                      {section.icon}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                      {section.title}
                    </h2>
                    <p className="text-slate-500 font-medium">
                      {section.description}
                    </p>
                  </div>
                </div>

                <div
                  className={`bg-white rounded-3xl p-8 md:p-10 transition-all duration-700 border ${activeSection === section.id ? "shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] border-primary/20 ring-4 ring-primary/5" : "shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border-slate-100"}`}
                >
                  {section.content}
                </div>
              </section>
            ))}

            {/* Final Tips & About */}
            <section className="bg-slate-900 rounded-[3rem] p-12 md:p-16 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[100px] -mr-32 -mt-32"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/20 blur-[100px] -ml-32 -mb-32"></div>

              <div className="relative z-10 max-w-3xl mx-auto text-center space-y-12">
                <div className="space-y-4">
                  <h3 className="text-3xl font-black tracking-tight">
                    First-Time Buyer Tips
                  </h3>
                  <div className="flex flex-wrap justify-center gap-4">
                    {[
                      "Read carefully",
                      "Ask questions",
                      "Compare",
                      "Meet safely",
                      "Verify",
                      "Trust instincts",
                    ].map((tip) => (
                      <span
                        key={tip}
                        className="px-5 py-2 bg-white/5 rounded-full border border-white/10 text-sm font-bold"
                      >
                        {tip}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="h-px bg-white/10"></div>

                <div className="space-y-6">
                  <h4 className="text-xl font-bold text-primary-light">
                    Why Use HitAds.ca?
                  </h4>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    Local Canadian marketplace with a wide range of categories,
                    free classified listings, and easy communication tools for a
                    growing business community.
                  </p>
                </div>

                <div className="pt-8 space-y-4">
                  <div className="flex items-center justify-center gap-4 text-secondary">
                    <span className="material-icons">gpp_maybe</span>
                    <span className="font-black uppercase tracking-widest text-xs">
                      Safety Reminder
                    </span>
                    <span className="material-icons">gpp_maybe</span>
                  </div>
                  <p className="text-[11px] text-slate-500 uppercase tracking-widest leading-loose">
                    HitAds.ca does not guarantee listings, sellers, buyers, or
                    transactions between users. Users are responsible for
                    conducting their own due diligence before completing
                    purchases.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* Scroll to Top helper (optional but nice) */}
      <div className="max-w-7xl mx-auto px-4 pb-12 text-center">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
          © HitAds.ca – Post free ads, sell fast, buy local, and connect with
          buyers and sellers across Canada.
        </p>
      </div>
    </div>
  );
};

export default BuyingGuides;

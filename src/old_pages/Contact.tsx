"use client";

import React, { useState, useEffect } from "react";

const Contact: React.FC = () => {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    subject: "General Inquiry",
    message: "",
  });
  const [isSent, setIsSent] = useState(false);
  const [isLive, setIsLive] = useState(true);
  const [socialLinks, setSocialLinks] = useState({
    facebook: "https://www.facebook.com/share/1AUADECy9x/",
    x: "https://x.com",
    instagram: "https://www.instagram.com/hitads.ca?igsh=bnVlaG5maWRvMHdx",
  });

  // Simulate a live status pulse
  useEffect(() => {
    const interval = setInterval(() => {
      setIsLive((prev) => !prev);
    }, 3000);

    fetch("/api/admin/seo_read?t=" + new Date().getTime())
      .then((res) => res.json())
      .then((data) => {
        if (data?.success && data.settings) {
          setSocialLinks({
            facebook: data.settings.social_facebook || "https://www.facebook.com/share/1AUADECy9x/",
            x: data.settings.social_x || "https://x.com",
            instagram: data.settings.social_instagram || "https://www.instagram.com/hitads.ca?igsh=bnVlaG5maWRvMHdx",
          });
        }
      })
      .catch((err) => console.error("Error loading social settings:", err));

    return () => clearInterval(interval);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSent(true);
    setTimeout(() => {
      setIsSent(false);
      setFormState({
        name: "",
        email: "",
        subject: "General Inquiry",
        message: "",
      });
    }, 5000);
  };

  const departments = [
    {
      name: "Customer Support",
      email: "customerservice@hitads.ca",
      hours: "24/7 Response Time",
      desc: "For general inquiries, account assistance, and listing support",
    },
    {
      name: "Technical & Partnerships",
      email: "hello@hitads.ca",
      hours: "Mon-Fri, 8am-8pm EST",
      desc: "For business advertising, technical issues, and partner inquiries",
    },
  ];

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Header */}
      <section className="bg-white border-b border-slate-200 pt-24 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.2em] rounded-full mb-8">
            <span
              className={`w-2 h-2 rounded-full ${isLive ? "bg-green-500 animate-pulse" : "bg-green-300"} transition-colors duration-500`}
            ></span>
            Support is currently Live
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight mb-8">
            How can we help?
          </h1>
          <p className="text-slate-500 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed">
            Whether you're a buyer, seller, or local business, we're here to ensure
            your HitAds experience is seamless and secure.
          </p>
        </div>
      </section>

      <main className="w-full px-4 sm:px-6 lg:px-10 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 max-w-7xl mx-auto">
          {/* Contact Form Container */}
          <div className="lg:col-span-7">
            <div className="bg-white p-8 md:p-14 rounded-[3.5rem] border border-slate-100 shadow-2xl shadow-slate-200/50 relative overflow-hidden">
              {isSent && (
                <div className="absolute inset-0 bg-white/95 backdrop-blur-md z-20 flex flex-col items-center justify-center p-12 text-center transition-all duration-500">
                  <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center text-green-500 mb-8 shadow-inner">
                    <span className="material-icons text-5xl">verified</span>
                  </div>
                  <h3 className="text-3xl font-black text-slate-900 mb-4">
                    Inquiry Received!
                  </h3>
                  <p className="text-slate-500 font-medium max-w-sm mx-auto leading-relaxed">
                    Thanks for reaching out, {formState.name.split(" ")[0]}. A
                    member of our team will contact you at{" "}
                    <strong>{formState.email}</strong> shortly.
                  </p>
                  <button
                    onClick={() => setIsSent(false)}
                    className="mt-10 px-8 py-3 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-all"
                  >
                    Send Another Message
                  </button>
                </div>
              )}

              <div className="mb-12">
                <h2 className="text-3xl font-black text-slate-900 mb-3">
                  Send a Message
                </h2>
                <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">
                  Expected response time: &lt; 2 hours
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="group">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1 transition-colors group-focus-within:text-primary">
                      Full Name
                    </label>
                    <div className="relative">
                      <span className="material-icons absolute left-5 top-4 text-slate-300 text-lg group-focus-within:text-primary transition-colors">
                        person_outline
                      </span>
                      <input
                        required
                        type="text"
                        className="w-full pl-14 pr-6 py-4.5 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-primary/10 text-sm font-semibold text-slate-700 transition-all"
                        placeholder="e.g. Sarah Connor"
                        value={formState.name}
                        onChange={(e) =>
                          setFormState({ ...formState, name: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div className="group">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1 transition-colors group-focus-within:text-primary">
                      Email Address
                    </label>
                    <div className="relative">
                      <span className="material-icons absolute left-5 top-4 text-slate-300 text-lg group-focus-within:text-primary transition-colors">
                        alternate_email
                      </span>
                      <input
                        required
                        type="email"
                        className="w-full pl-14 pr-6 py-4.5 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-primary/10 text-sm font-semibold text-slate-700 transition-all"
                        placeholder="sarah@example.com"
                        value={formState.email}
                        onChange={(e) =>
                          setFormState({ ...formState, email: e.target.value })
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="group">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1 transition-colors group-focus-within:text-primary">
                    Nature of Inquiry
                  </label>
                  <div className="relative">
                    <span className="material-icons absolute left-5 top-4 text-slate-300 text-lg group-focus-within:text-primary transition-colors">
                      help_outline
                    </span>
                    <select
                      className="w-full pl-14 pr-12 py-4.5 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-primary/10 text-sm font-semibold text-slate-700 transition-all appearance-none cursor-pointer"
                      value={formState.subject}
                      onChange={(e) =>
                        setFormState({ ...formState, subject: e.target.value })
                      }
                    >
                      <option>General Inquiry</option>
                      <option>Technical Support</option>
                      <option>Account Safety & Security</option>
                      <option>Billing & Invoices</option>
                      <option>Business & Advertising</option>
                      <option>Report an Ad / Feedback</option>
                    </select>
                    <span className="material-icons absolute right-5 top-4 text-slate-300 pointer-events-none">
                      expand_more
                    </span>
                  </div>
                </div>

                <div className="group">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1 transition-colors group-focus-within:text-primary">
                    Your Message
                  </label>
                  <textarea
                    required
                    rows={6}
                    className="w-full px-6 py-5 bg-slate-50 border-none rounded-[2rem] focus:ring-4 focus:ring-primary/10 text-sm font-semibold text-slate-700 transition-all resize-none"
                    placeholder="Provide as much detail as possible..."
                    value={formState.message}
                    onChange={(e) =>
                      setFormState({ ...formState, message: e.target.value })
                    }
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary-hover text-white font-black py-5 rounded-2xl transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-3 group text-lg cursor-pointer"
                >
                  Dispatch Message
                  <span className="material-icons text-2xl group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform">
                    send
                  </span>
                </button>
              </form>
            </div>
          </div>

          {/* Sidebar - Official Channels & Social Links */}
          <div className="lg:col-span-5 space-y-8">
            {/* Direct Support Directory */}
            <div className="bg-slate-900 rounded-[3rem] p-8 md:p-10 text-white relative overflow-hidden shadow-xl">
              <div className="absolute top-0 right-0 w-48 h-48 bg-primary/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
              <h3 className="text-xl font-black mb-8 relative z-10">
                Direct Support Channels
              </h3>
              <div className="space-y-6 relative z-10">
                {departments.map((dept, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/40 transition-colors">
                    <div className="flex justify-between items-center mb-1.5">
                      <h4 className="text-xs font-black uppercase tracking-widest text-slate-300">
                        {dept.name}
                      </h4>
                      <span className="text-[10px] font-bold text-green-400">
                        {dept.hours}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mb-3">{dept.desc}</p>
                    <a
                      href={`mailto:${dept.email}`}
                      className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline"
                    >
                      <span className="material-icons text-sm">mail</span>
                      {dept.email}
                    </a>
                  </div>
                ))}
              </div>
            </div>

            {/* Connect on Social Media */}
            <div className="bg-white rounded-[3rem] p-8 md:p-10 border border-slate-100 shadow-xl shadow-slate-200/50">
              <h3 className="text-xl font-black text-slate-900 mb-3">
                Connect on Social Media
              </h3>
              <p className="text-slate-500 text-sm font-medium mb-6">
                Stay updated with the latest community listings, verified promotions, and announcements.
              </p>

              <div className="space-y-3">
                <a
                  href={socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 hover:bg-[#1877F2]/10 border border-slate-100 hover:border-[#1877F2]/30 transition-all group"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-[#1877F2] text-white flex items-center justify-center shadow-xs">
                      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-slate-800 group-hover:text-[#1877F2] transition-colors">
                        Facebook
                      </h4>
                      <p className="text-[11px] font-bold text-slate-400">@hitads.ca</p>
                    </div>
                  </div>
                  <span className="material-icons text-slate-400 group-hover:text-[#1877F2] group-hover:translate-x-1 transition-all">
                    arrow_forward
                  </span>
                </a>

                <a
                  href={socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 hover:bg-[#E4405F]/10 border border-slate-100 hover:border-[#E4405F]/30 transition-all group"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white flex items-center justify-center shadow-xs">
                      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-slate-800 group-hover:text-[#E4405F] transition-colors">
                        Instagram
                      </h4>
                      <p className="text-[11px] font-bold text-slate-400">@hitads.ca</p>
                    </div>
                  </div>
                  <span className="material-icons text-slate-400 group-hover:text-[#E4405F] group-hover:translate-x-1 transition-all">
                    arrow_forward
                  </span>
                </a>

                <a
                  href={socialLinks.x}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-100 hover:border-slate-300 transition-all group"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center shadow-xs">
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-slate-800 group-hover:text-black transition-colors">
                        X (Twitter)
                      </h4>
                      <p className="text-[11px] font-bold text-slate-400">Official Profile</p>
                    </div>
                  </div>
                  <span className="material-icons text-slate-400 group-hover:text-black group-hover:translate-x-1 transition-all">
                    arrow_forward
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Social Follow Bar */}
      <section className="bg-white py-12 border-t border-slate-100">
        <div className="w-full px-4 sm:px-6 lg:px-10 flex flex-col md:flex-row justify-between items-center gap-6 max-w-7xl mx-auto">
          <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
            Follow the HitAds journey on social media
          </p>
          <div className="flex items-center gap-3">
            <a
              href={socialLinks.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-xl bg-slate-50 hover:bg-[#1877F2] text-slate-600 hover:text-white transition-all text-xs font-bold flex items-center gap-2 shadow-xs"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              Facebook
            </a>
            <a
              href={socialLinks.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-xl bg-slate-50 hover:bg-gradient-to-tr hover:from-[#f09433] hover:via-[#dc2743] hover:to-[#bc1888] text-slate-600 hover:text-white transition-all text-xs font-bold flex items-center gap-2 shadow-xs"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
              Instagram
            </a>
            <a
              href={socialLinks.x}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-xl bg-slate-50 hover:bg-black text-slate-600 hover:text-white transition-all text-xs font-bold flex items-center gap-2 shadow-xs"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              X (Twitter)
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;

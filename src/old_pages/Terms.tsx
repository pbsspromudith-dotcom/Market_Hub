"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const Terms: React.FC = () => {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<"terms" | "privacy">("terms");
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const termsSections = [
    {
      id: "terms-venue",
      num: "1",
      title: "The Platform as a Venue",
      content: [
        "HitAds.ca acts solely as a platform for users to offer, sell, and buy business services and goods.",
        "We are not involved in the actual transaction between buyers and sellers.",
        "We do not guarantee the quality, safety, accuracy, or legality of items or services listed, or the truthfulness of user communications.",
        "You acknowledge that you use the Services at your own risk.",
      ],
    },
    {
      id: "terms-account",
      num: "2",
      title: "Your Account",
      content: [
        "To access certain Services, you may be required to register for an account.",
        "You are solely responsible for maintaining the confidentiality of your password and for all activities that occur under your account.",
        "You agree not to transfer your account to another party without our prior written consent.",
      ],
    },
    {
      id: "terms-prohibited",
      num: "3",
      title: "Using the Services & Prohibited Content",
      content: [
        "You agree to post in the appropriate category and adhere to all applicable laws.",
        "You will not:",
      ],
      bullets: [
        "Post false, misleading, or deceptive content.",
        "Infringe any third-party intellectual property rights.",
        "Distribute spam, viruses, or any technologies that may harm the Platform or our users.",
        "Use automated means (bots, scrapers, crawlers) to collect content or data from our site without express written permission.",
        "Impose an unreasonable load on our infrastructure.",
      ],
    },
    {
      id: "terms-license",
      num: "4",
      title: "Content & License",
      content: [
        "You are solely responsible for the content you post.",
        "When you provide us with content, you grant Global Canadian Media House Inc. a non-exclusive, worldwide, perpetual, irrevocable, royalty-free, sub-licensable right to host, display, and use that content for the purpose of operating the Platform.",
        "We reserve the right to remove any content that we believe violates these Terms or the rights of any third party.",
      ],
    },
    {
      id: "terms-fees",
      num: "5",
      title: "Fees and Services",
      content: [
        "While basic use of the Platform may be free, we may charge fees for premium features or services.",
        "All fees are quoted in Canadian Dollars (CAD).",
        "If a service carries a fee, you will be able to review and accept that charge before it is incurred.",
        "Fees are non-refundable.",
      ],
    },
    {
      id: "terms-liability",
      num: "6",
      title: "Disclaimer and Limitation of Liability",
      content: [
        "THE SERVICES ARE PROVIDED “AS IS” AND “AS AVAILABLE.” TO THE FULLEST EXTENT PERMITTED BY LAW, GLOBAL CANADIAN MEDIA HOUSE INC. EXPRESSLY DISCLAIMS ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING WARRANTIES OF MERCHANTABILITY OR FITNESS FOR A PARTICULAR PURPOSE.",
        "WE ARE NOT LIABLE FOR ANY LOSS OF MONEY, GOODWILL, REPUTATION, OR ANY SPECIAL, INDIRECT, OR CONSEQUENTIAL DAMAGES ARISING OUT OF YOUR USE OF THE PLATFORM.",
        "IN ANY EVENT, OUR TOTAL LIABILITY TO YOU SHALL NOT EXCEED THE GREATER OF (A) THE TOTAL FEES YOU PAID US IN THE 12 MONTHS PRIOR TO THE ACTION GIVING RISE TO LIABILITY, OR (B) 100 CANADIAN DOLLARS.",
      ],
      isWarning: true,
    },
    {
      id: "terms-indemnification",
      num: "7",
      title: "Indemnification",
      content: [
        "You agree to indemnify and hold harmless Global Canadian Media House Inc., its officers, directors, and employees from any claim or demand, including reasonable legal fees, made by any third party arising out of your use of the Services, your breach of these Terms, or your violation of any law or the rights of a third party.",
      ],
    },
    {
      id: "terms-governing-law",
      num: "8",
      title: "Governing Law",
      content: [
        "These Terms are governed by the laws of the Province of Ontario and the federal laws of Canada applicable therein.",
        "You submit to the exclusive jurisdiction of the courts located in Toronto, Ontario.",
      ],
    },
    {
      id: "terms-changes",
      num: "9",
      title: "Changes to Terms",
      content: [
        "We may update these Terms at any time.",
        "Updates take effect when you next use the site or after 30 days, whichever is sooner.",
      ],
    },
  ];

  const privacySections = [
    {
      id: "privacy-collect",
      num: "1",
      title: "What Personal Information We Collect",
      items: [
        {
          label: "Information You Provide",
          text: "When you register for an account or post an ad, we collect information such as your name, email address, business address, and profile details.",
        },
        {
          label: "Automatically Collected Information",
          text: "When you use our website, we automatically collect data sent by your device, including your IP address, device ID, browser type, page view statistics, and general geo-location information.",
        },
        {
          label: "Cookies and Tracking",
          text: "We use cookies, web beacons, and similar technologies to identify you, improve your user experience, and ensure the security of the Platform.",
        },
      ],
    },
    {
      id: "privacy-use",
      num: "2",
      title: "How We Use Your Information",
      content: ["We use your personal information to:"],
      bullets: [
        "Provide, improve, and personalize our Services.",
        "Prevent, detect, and investigate potentially illegal or prohibited activities (e.g., fraud, spam).",
        "Communicate with you regarding your account, support requests, or marketing updates (where you have opted in).",
        "Facilitate business transactions between users.",
      ],
    },
    {
      id: "privacy-sharing",
      num: "3",
      title: "Sharing Information with Third Parties",
      content: [
        "We do not sell your personal information. We may share your data only in the following limited circumstances:",
      ],
      items: [
        {
          label: "Service Providers",
          text: "We share data with third-party service providers who assist us in operating our platform (e.g., hosting, analytics, security, or payment processing).",
        },
        {
          label: "Legal Obligations",
          text: "We may disclose information if required by law, such as to comply with a court order or to protect our legal rights.",
        },
        {
          label: "Business Transfers",
          text: "In the event of a merger, acquisition, or reorganization, your information may be transferred as part of the business assets.",
        },
        {
          label: "User Interaction",
          text: "Information included in your ads or public profiles is accessible to other users.",
        },
      ],
    },
    {
      id: "privacy-transfers",
      num: "4",
      title: "International Transfers",
      content: [
        "Your information may be processed and stored on servers located outside of your jurisdiction (e.g., the United States or the European Union).",
        "By using our Services, you acknowledge that these jurisdictions may have different data protection laws.",
      ],
    },
    {
      id: "privacy-rights",
      num: "5",
      title: "Your Data Rights",
      content: ["You have the right to:"],
      items: [
        {
          label: "Access / Rectify",
          text: "Access or correct your account information via your account settings.",
        },
        {
          label: "Deletion",
          text: "Request the deletion of your account and personal information by contacting us at our support email.",
        },
        {
          label: "Withdraw Consent",
          text: "Opt out of marketing communications at any time via the unsubscribe link in our emails or your account settings.",
        },
      ],
    },
    {
      id: "privacy-security",
      num: "6",
      title: "Security and Retention",
      content: [
        "We implement technical and administrative security measures (e.g., encryption, firewalls) to protect your data.",
        "We retain personal information only for as long as it is necessary for the purposes described in this policy or as required by law.",
      ],
    },
    {
      id: "privacy-spam",
      num: "7",
      title: "Spam and Abuse",
      content: [
        "We do not tolerate spam. You may not use our platform to send unsolicited commercial communications.",
        "We reserve the right to scan messages for malicious activity or prohibited content to protect our community.",
      ],
    },
    {
      id: "privacy-contact",
      num: "8",
      title: "Contact Us & Privacy Officer",
      content: [
        "If you have questions or concerns about this Privacy Policy, please contact our Privacy Officer at:",
      ],
      isContact: true,
    },
  ];

  useEffect(() => {
    const tabParam = searchParams?.get("tab");
    const hash = typeof window !== "undefined" ? window.location.hash : "";

    if (tabParam === "privacy" || hash.includes("privacy")) {
      setActiveTab("privacy");
      if (hash && hash !== "#privacy") {
        const id = hash.replace("#", "");
        setTimeout(() => scrollToSection(id), 300);
      }
    } else if (tabParam === "terms" || hash.includes("terms")) {
      setActiveTab("terms");
      if (hash && hash !== "#terms") {
        const id = hash.replace("#", "");
        setTimeout(() => scrollToSection(id), 300);
      }
    }
  }, [searchParams]);

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const el = document.getElementById(id);
    if (el) {
      const offset = 140;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const offsetPosition = elementRect - bodyRect - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  const currentSections = activeTab === "terms" ? termsSections : privacySections;

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Header Section */}
      <div className="bg-white border-b border-slate-200 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-5">
          <div className="flex justify-center gap-2">
            <span className="bg-primary/10 text-primary px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
              Legal & Compliance
            </span>
            <span className="bg-slate-100 text-slate-600 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-slate-200">
              Global Canadian Media House Inc.
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight">
            {activeTab === "terms" ? "Terms of Service" : "Privacy Policy"}
          </h1>

          <p className="text-slate-500 font-medium text-sm">
            Last Updated: July 7, 2026 • Official HitAds.ca Documentation
          </p>

          {/* Tab Switcher */}
          <div className="pt-6 flex justify-center">
            <div className="inline-flex p-1.5 bg-slate-100 rounded-2xl border border-slate-200 shadow-inner gap-1">
              <button
                onClick={() => {
                  setActiveTab("terms");
                  setActiveSection(null);
                }}
                className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === "terms"
                    ? "bg-white text-slate-900 shadow-md shadow-slate-200 scale-100"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                Terms of Service
              </button>
              <button
                onClick={() => {
                  setActiveTab("privacy");
                  setActiveSection(null);
                }}
                className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === "privacy"
                    ? "bg-white text-slate-900 shadow-md shadow-slate-200 scale-100"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                Privacy Policy
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-16">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sticky Sidebar Navigation */}
          <aside className="lg:w-80 shrink-0 hidden lg:block">
            <div className="sticky top-28 bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 px-3">
                {activeTab === "terms" ? "Terms Sections" : "Privacy Sections"}
              </h3>
              <nav className="space-y-1 max-h-[60vh] overflow-y-auto pr-1">
                {currentSections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2.5 ${
                      activeSection === section.id
                        ? "bg-primary text-white shadow-md shadow-primary/20"
                        : "text-slate-600 hover:bg-slate-50 hover:text-primary"
                    }`}
                  >
                    <span
                      className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-black ${
                        activeSection === section.id
                          ? "bg-white/20 text-white"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {section.num}
                    </span>
                    <span className="truncate">{section.title}</span>
                  </button>
                ))}
              </nav>

              <div className="mt-6 pt-6 border-t border-slate-100">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-slate-500 text-[11px] leading-relaxed">
                  <p className="font-bold text-slate-700 mb-1">Need help or advice?</p>
                  <p>Contact our support team anytime at:</p>
                  <a
                    href="mailto:customerservice@hitads.ca"
                    className="text-primary font-bold hover:underline block mt-1"
                  >
                    customerservice@hitads.ca
                  </a>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Legal Content */}
          <div className="flex-1 bg-white rounded-[2.5rem] p-8 sm:p-12 md:p-16 shadow-xl shadow-slate-200/40 border border-slate-100">
            {/* Preamble / Introduction */}
            <div className="p-6 md:p-8 rounded-3xl bg-slate-50 border border-slate-200/80 mb-12">
              <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">
                Overview & Scope
              </h2>
              {activeTab === "terms" ? (
                <p className="text-slate-700 text-sm md:text-base leading-relaxed font-medium">
                  Welcome to <strong>HitAds.ca</strong> (the "Platform"), owned and operated by{" "}
                  <strong>Global Canadian Media House Incorporated</strong>, Ravine Park Plaza, 15584 - 275 Port Union Rd, Toronto, ON M1C 4Z7, Canada.
                  By accessing or using our website, services, or tools (collectively, “Services”), you agree to be bound by these Terms of Service. If you do not agree to these Terms, you must not access or use the Platform.
                </p>
              ) : (
                <p className="text-slate-700 text-sm md:text-base leading-relaxed font-medium">
                  <strong>Global Canadian Media House Incorporated</strong> (“we,” “us,” or “our”) is committed to protecting your privacy. This Privacy Policy describes how we collect, use, and share your personal information when you use <strong>HitAds.ca</strong> and all related services (the “Services”). By using our Services, you consent to the practices described in this policy.
                </p>
              )}
            </div>

            {/* Content Sections */}
            <div className="space-y-12">
              {activeTab === "terms"
                ? termsSections.map((section) => (
                    <section
                      key={section.id}
                      id={section.id}
                      className="scroll-mt-36 border-b border-slate-100 pb-10 last:border-0 last:pb-0"
                    >
                      <h2 className="text-xl md:text-2xl font-black text-slate-900 mb-5 flex items-center gap-3">
                        <span className="w-8 h-8 bg-primary/10 text-primary rounded-xl flex items-center justify-center text-xs font-black">
                          {section.num}
                        </span>
                        {section.title}
                      </h2>

                      {section.isWarning ? (
                        <div className="p-6 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-slate-800 text-xs md:text-sm leading-relaxed space-y-3 font-semibold">
                          {section.content.map((para, i) => (
                            <p key={i}>{para}</p>
                          ))}
                        </div>
                      ) : (
                        <div className="text-slate-600 text-sm md:text-base leading-relaxed space-y-3.5 font-medium">
                          {section.content.map((para, i) => (
                            <p key={i}>{para}</p>
                          ))}
                          {section.bullets && (
                            <ul className="list-disc list-inside space-y-2 pl-2 text-slate-700 font-semibold pt-1">
                              {section.bullets.map((b, bi) => (
                                <li key={bi} className="leading-relaxed">
                                  {b}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      )}
                    </section>
                  ))
                : privacySections.map((section) => (
                    <section
                      key={section.id}
                      id={section.id}
                      className="scroll-mt-36 border-b border-slate-100 pb-10 last:border-0 last:pb-0"
                    >
                      <h2 className="text-xl md:text-2xl font-black text-slate-900 mb-5 flex items-center gap-3">
                        <span className="w-8 h-8 bg-primary/10 text-primary rounded-xl flex items-center justify-center text-xs font-black">
                          {section.num}
                        </span>
                        {section.title}
                      </h2>

                      <div className="text-slate-600 text-sm md:text-base leading-relaxed space-y-4 font-medium">
                        {section.content?.map((para, i) => (
                          <p key={i}>{para}</p>
                        ))}

                        {section.items && (
                          <div className="space-y-3 pt-2">
                            {section.items.map((item, idx) => (
                              <div
                                key={idx}
                                className="p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-colors"
                              >
                                <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 mb-1">
                                  {item.label}
                                </h3>
                                <p className="text-sm text-slate-600 leading-relaxed font-medium">
                                  {item.text}
                                </p>
                              </div>
                            ))}
                          </div>
                        )}

                        {section.bullets && (
                          <ul className="list-disc list-inside space-y-2 pl-2 text-slate-700 font-semibold pt-1">
                            {section.bullets.map((b, bi) => (
                              <li key={bi} className="leading-relaxed">
                                {b}
                              </li>
                            ))}
                          </ul>
                        )}

                        {section.isContact && (
                          <div className="mt-4 p-6 rounded-3xl bg-slate-900 text-white space-y-3">
                            <h3 className="text-sm font-black uppercase tracking-widest text-primary">
                              Privacy Officer Contact
                            </h3>
                            <div className="text-sm text-slate-300 space-y-1 font-medium">
                              <p className="font-bold text-white">Global Canadian Media House Incorporated</p>
                              <p>Attn: Privacy Officer</p>
                              <p>Ravine Park Plaza, 15584 - 275 Port Union Rd</p>
                              <p>Toronto, ON M1C 4Z7, Canada</p>
                            </div>
                            <div className="pt-2">
                              <a
                                href="mailto:customerservice@hitads.ca"
                                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-xs font-black uppercase tracking-wider hover:bg-primary-hover transition-all"
                              >
                                <span className="material-icons text-sm">mail</span>
                                customerservice@hitads.ca
                              </a>
                            </div>
                          </div>
                        )}
                      </div>
                    </section>
                  ))}
            </div>

            <div className="mt-16 pt-12 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
              <p className="text-xs text-slate-400 font-semibold">
                © 2026 HitAds.ca — Global Canadian Media House Inc. All rights reserved.
              </p>
              <div className="flex gap-4 text-xs font-bold text-slate-500">
                <Link
                  href="/contact"
                  className="hover:text-primary transition-colors"
                >
                  Contact Support
                </Link>
                <span>•</span>
                <Link
                  href="/safety-tips"
                  className="hover:text-primary transition-colors"
                >
                  Safety Guidelines
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;

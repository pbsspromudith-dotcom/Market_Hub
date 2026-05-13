import React from 'react';

const Terms: React.FC = () => {
  const [activeSection, setActiveSection] = React.useState<string | null>(null);

  const sections = [
    { id: 'intro', title: '1. Introduction', content: `Welcome to HitAds.ca (“HitAds”, “we”, “our”, or “us”). These Terms and Conditions (“Terms”) govern access to and use of HitAds.ca, including all related websites, mobile applications, services, tools, features, and content provided through the platform. By accessing, browsing, creating an account, posting advertisements, purchasing services, or otherwise using HitAds.ca, you agree to be legally bound by these Terms. If you do not agree with these Terms, you must not use the platform.` },
    { id: 'about', title: '2. About the Platform', content: `HitAds.ca is an online classified advertising platform that enables users to: post classified advertisements; promote products and services; buy, sell, rent, trade, or advertise goods and services; communicate with other users; and access advertising and promotional tools. HitAds.ca acts solely as a platform provider and is not a party to transactions between users unless explicitly stated otherwise.` },
    { id: 'eligibility', title: '3. Eligibility', content: `By using HitAds.ca, users represent and warrant that they are at least 18 years old or the age of majority in their jurisdiction; they have the legal authority to enter into binding agreements; all information provided is accurate and current; and their use of the platform complies with applicable laws. We reserve the right to refuse access or terminate accounts at our discretion.` },
    { id: 'accounts', title: '4. User Accounts', content: `Users may be required to create an account to access certain services. Users are responsible for maintaining account confidentiality, protecting login credentials, all activities occurring under their account, providing accurate information, and updating account information when necessary. Users must immediately notify HitAds.ca of any unauthorized account use. We reserve the right to suspend or terminate accounts that violate these Terms, provide false information, engage in suspicious activity, create security risks, or abuse the platform.` },
    { id: 'content', title: '5. User Content and Advertisements', content: `Users are solely responsible for all content they submit, upload, publish, or display on HitAds.ca, including listings, advertisements, photos, videos, descriptions, messages, reviews, and comments. By posting content, users represent and warrant that they own or have rights to the content, it does not violate laws or third-party rights, is truthful and accurate, and does not infringe intellectual property rights. Users grant HitAds.ca a worldwide, non-exclusive, royalty-free license to use, display, host, copy, modify, reproduce, publish, promote, and distribute such content in connection with operating and promoting the platform.` },
    { id: 'prohibited', title: '6. Prohibited Content and Activities', content: `Users must not post content that is illegal, fraudulent, misleading, violates intellectual property, contains hate speech, is sexually explicit, promotes violence, or contains malware. Users must not use automated scraping tools, attempt unauthorized access, interfere with platform functionality, harvest user info, circumvent security, create fake accounts, manipulate rankings, or spam users. HitAds.ca reserves the right to remove any content at its sole discretion.` },
    { id: 'restrictions', title: '7. Categories Subject to Restrictions', content: `Certain products or services may be restricted or prohibited on HitAds.ca, including firearms, alcohol, cannabis, tobacco, pharmaceuticals, financial services, real estate, vehicles, employment, animals, adult-oriented services, and medical services. Users are responsible for ensuring compliance with all applicable laws. HitAds.ca may remove listings or restrict categories without notice.` },
    { id: 'fees', title: '8. Fees and Paid Services', content: `Certain services may require payment, such as featured listings, business advertising, promotional placements, and premium features. All fees are in Canadian Dollars unless stated otherwise, may change without notice, and are generally non-refundable. Users are responsible for applicable taxes. Failure to pay may result in listing removal or service suspension.` },
    { id: 'transactions', title: '9. Transactions Between Users', content: `HitAds.ca is not responsible for transactions between users. We do not guarantee listings, verify every seller or buyer, guarantee payment or delivery, inspect products, or provide warranties on user transactions. Users engage at their own risk and are encouraged to exercise caution, verify identities, meet safely, and conduct independent due diligence.` },
    { id: 'fraud', title: '10. Fraud Prevention and Safety', content: `HitAds.ca reserves the right to monitor activity, investigate suspicious conduct, remove listings, suspend accounts, and cooperate with law enforcement for fraud prevention and safety. Users should immediately report suspicious activity.` },
    { id: 'ip', title: '11. Intellectual Property', content: `All platform content excluding user-generated content, such as logos, branding, design, software, and features, are owned by or licensed to HitAds.ca. Users may not copy, reproduce, or reverse engineer platform content without written authorization.` },
    { id: 'third-party', title: '12. Third-Party Services and Links', content: `HitAds.ca may contain links to third-party sites or services. We do not control or endorse third-party content and are not responsible for their products, services, or privacy practices. Users access them at their own risk.` },
    { id: 'warranty', title: '13. Disclaimer of Warranties', content: `To the maximum extent permitted by law, HitAds.ca services are provided “as is” and “as available.” We do not guarantee continuous availability, error-free operation, or successful transactions. Users use the platform at their own risk.` },
    { id: 'liability', title: '14. Limitation of Liability', content: `To the fullest extent permitted by law, HitAds.ca and its affiliates shall not be liable for indirect damages, lost profits, data loss, fraud by users, or transaction disputes. Our maximum liability shall not exceed the amount paid by the user to HitAds.ca during the preceding 12 months.` },
    { id: 'indemnity', title: '15. Indemnification', content: `Users agree to indemnify and hold harmless HitAds.ca from claims, damages, or losses arising from user content, violation of these Terms, misuse of the platform, or violation of third-party rights.` },
    { id: 'suspension', title: '16. Account Suspension and Termination', content: `HitAds.ca may suspend or terminate accounts or listings at any time for reasons including policy violations, fraud concerns, or security risks. Termination may result in loss of access to platform services.` },
    { id: 'privacy', title: '17. Privacy', content: `Use of HitAds.ca is also governed by our Privacy Policy. By using the platform, users consent to the collection and use of information as described therein.` },
    { id: 'electronic', title: '18. Electronic Communications', content: `By using HitAds.ca, users consent to receiving electronic communications, which satisfy legal requirements for written communications where permitted by law.` },
    { id: 'law', title: '19. Governing Law', content: `These Terms shall be governed by the laws of the Province of Ontario and the federal laws of Canada. Users agree to the exclusive jurisdiction of the courts of Ontario, Canada.` },
    { id: 'changes', title: '20. Changes to Terms', content: `HitAds.ca reserves the right to modify these Terms at any time. Continued use of the platform after updates constitutes acceptance of revised Terms.` },
    { id: 'severability', title: '21. Severability', content: `If any provision of these Terms is found unenforceable, the remaining provisions shall remain in full force and effect.` },
    { id: 'entire', title: '22. Entire Agreement', content: `These Terms, together with the Privacy Policy, constitute the complete agreement between users and HitAds.ca regarding use of the platform.` },
    { id: 'contact', title: '23. Contact Information', content: `For legal inquiries, policy questions, or support requests, contact: customerservice@hitads.ca` }
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
      {/* Header Section */}
      <div className="bg-white border-b border-slate-200 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
            Terms and Conditions
          </h1>
          <p className="text-slate-500 font-medium">
            Effective Date: May 12, 2026
          </p>
          <div className="flex justify-center gap-2 pt-4">
            <span className="bg-slate-100 text-slate-600 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-slate-200">
              Legal
            </span>
            <span className="bg-slate-100 text-slate-600 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-slate-200">
              HitAds.ca
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sticky Sidebar Navigation */}
          <aside className="lg:w-80 shrink-0 hidden lg:block">
            <div className="sticky top-32 bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 px-4">
                Contents
              </h3>
              <nav className="space-y-1 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                {sections.map(section => (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className={`w-full text-left px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeSection === section.id ? 'bg-primary text-white shadow-md' : 'text-slate-500 hover:bg-slate-50 hover:text-primary'}`}
                  >
                    {section.title}
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          {/* Main Legal Content */}
          <div className="flex-1 bg-white rounded-[2.5rem] p-8 md:p-16 shadow-sm border border-slate-100">
            <div className="space-y-12">
              {sections.map((section) => (
                <section key={section.id} id={section.id} className="scroll-mt-40 border-b border-slate-50 pb-12 last:border-0 last:pb-0">
                  <h2 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-3">
                    <span className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-[10px] font-black text-slate-400 group-hover:bg-primary group-hover:text-white transition-colors">
                        {section.id === 'intro' ? 'I' : section.title.split('.')[0]}
                    </span>
                    {section.title.includes('.') ? section.title.split('. ')[1] : section.title}
                  </h2>
                  <div className="text-slate-600 text-sm leading-relaxed space-y-4 font-medium">
                    {section.content.split('; ').map((para, i) => (
                        <p key={i}>{para}</p>
                    ))}
                  </div>
                </section>
              ))}
            </div>

            <div className="mt-16 pt-16 border-t border-slate-100 text-center">
                <p className="text-xs text-slate-400 leading-loose uppercase tracking-widest">
                    By using HitAds.ca, you acknowledge that you have read and understood these terms.
                </p>
                <div className="mt-8 flex justify-center gap-8 text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">
                    <span>Secure</span>
                    <span>Transparent</span>
                    <span>Canadian</span>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;

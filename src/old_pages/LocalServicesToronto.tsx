"use client";

import React from 'react';
import Link from 'next/link';

const LocalServicesToronto: React.FC = () => {
  return (
    <div className="overflow-x-hidden">
      <section className="bg-gradient-to-br from-amber-800 via-amber-600 to-orange-500 text-white py-20 md:py-28 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-x-1/2 translate-y-1/2"></div>
        </div>
        <div className="w-full px-4 sm:px-6 lg:px-10 relative z-10 text-center">
          <span className="inline-block py-1.5 px-4 rounded-full bg-white/10 text-white/90 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
            Trusted Local Professionals
          </span>
          <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
            Local Services in Toronto<br />Find Trusted Pros
          </h1>
          <p className="text-lg text-white/80 max-w-3xl mx-auto mb-10 font-medium">
            Connect with skilled professionals across the GTA — movers, plumbers, electricians, contractors, cleaners, tutors, and more. Browse verified service listings on HitAds.ca.
          </p>
          <Link href="/search?cat=Local%20Services" className="bg-white text-amber-700 font-black px-10 py-5 rounded-2xl hover:bg-slate-50 transition-all shadow-xl text-sm uppercase tracking-widest inline-block">
            Find Services
          </Link>
        </div>
      </section>

      <main className="w-full px-4 sm:px-6 lg:px-10 py-16 md:py-24">
        <section className="max-w-4xl mx-auto mb-20">
          <h2 className="text-3xl font-black text-slate-900 mb-6">Find the Best Local Services in Toronto</h2>
          <div className="space-y-4 text-slate-600 leading-relaxed">
            <p>
              Finding reliable service providers in Toronto can be challenging. HitAds.ca simplifies this by connecting you with local professionals who have been vetted by your community. Whether you need an emergency plumber at 2 AM, a reliable moving crew for your weekend relocation, or a skilled web designer for your business rebrand, our local services marketplace has you covered.
            </p>
            <p>
              Toronto's service economy is booming, with thousands of independent professionals and small businesses offering everything from home renovation and landscaping to photography, tutoring, legal consulting, and immigration services. HitAds.ca makes it easy to compare providers, read about their services, and contact them directly — all for free.
            </p>
            <p>
              Our platform serves every neighborhood across the GTA including downtown Toronto, Scarborough, North York, Etobicoke, Mississauga, Brampton, Vaughan, Richmond Hill, Markham, and Oshawa. Find professionals near you and support local businesses in your community.
            </p>
          </div>
        </section>

        <section className="mb-20">
          <h2 className="text-3xl font-black text-slate-900 mb-10 text-center">Popular Service Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'Movers', icon: 'local_shipping' },
              { name: 'Plumbing', icon: 'plumbing' },
              { name: 'Electrical', icon: 'electrical_services' },
              { name: 'Renovation', icon: 'construction' },
              { name: 'Cleaning', icon: 'cleaning_services' },
              { name: 'Landscaping', icon: 'grass' },
              { name: 'Web Design', icon: 'web' },
              { name: 'Photography', icon: 'photo_camera' },
              { name: 'Tutoring', icon: 'school' },
              { name: 'Legal Services', icon: 'gavel' },
              { name: 'Immigration', icon: 'flight_land' },
              { name: 'Appliance Repair', icon: 'build' },
            ].map(svc => (
              <Link key={svc.name} href={`/search?cat=Local%20Services&sub=${encodeURIComponent(svc.name)}`} className="bg-white p-6 rounded-2xl border border-slate-100 text-center hover:border-amber-500 hover:shadow-lg transition-all group">
                <span className="material-icons text-3xl text-slate-400 group-hover:text-amber-600 mb-3 block">{svc.icon}</span>
                <span className="text-xs font-black text-slate-600 uppercase tracking-widest">{svc.name}</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="max-w-4xl mx-auto mb-20">
          <h2 className="text-3xl font-black text-slate-900 mb-6">Why List Your Services on HitAds.ca?</h2>
          <div className="space-y-4 text-slate-600 leading-relaxed">
            <p>
              <strong>Free Exposure:</strong> Reach thousands of potential customers across the GTA without paying listing fees. HitAds.ca is completely free for service providers, making it the most cost-effective way to grow your local business.
            </p>
            <p>
              <strong>Targeted Local Audience:</strong> Our users are actively searching for services in their area. When someone in Mississauga needs a plumber, they come to HitAds.ca — and your listing is right there waiting for them.
            </p>
            <p>
              <strong>Direct Communication:</strong> No middlemen or booking fees. Customers message you directly through our platform, allowing you to provide personalized quotes and build direct relationships with your clients.
            </p>
            <p>
              <strong>Build Your Reputation:</strong> Create a detailed service listing showcasing your expertise, areas served, pricing, and availability. Stand out from the competition with professional descriptions and photos of your work.
            </p>
          </div>
        </section>

        <section className="bg-amber-50 rounded-3xl p-10 md:p-16 max-w-4xl mx-auto">
          <h2 className="text-2xl font-black text-slate-900 mb-6">Tips for Hiring Service Providers in Toronto</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              'Always get written quotes before starting any project',
              'Ask for references and verify past work quality',
              'Ensure service providers carry appropriate insurance',
              'Read the service description carefully for inclusions and exclusions',
              'Communicate your expectations clearly upfront',
              'Leave feedback to help other community members',
            ].map((tip, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="material-icons text-amber-600 text-lg mt-0.5">check_circle</span>
                <span className="text-sm text-slate-600 font-medium">{tip}</span>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default LocalServicesToronto;

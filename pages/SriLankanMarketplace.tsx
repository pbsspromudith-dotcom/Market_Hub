import React from 'react';
import { Link } from 'react-router-dom';

const SriLankanMarketplace: React.FC = () => {
  return (
    <div className="overflow-x-hidden">
      <section className="bg-gradient-to-br from-rose-900 via-rose-700 to-pink-500 text-white py-20 md:py-28 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-1/2 w-96 h-96 bg-white rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
        </div>
        <div className="w-full px-4 sm:px-6 lg:px-10 relative z-10 text-center">
          <span className="inline-block py-1.5 px-4 rounded-full bg-white/10 text-white/90 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
            Community Classifieds
          </span>
          <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
            Sri Lankan Marketplace<br />Canada
          </h1>
          <p className="text-lg text-white/80 max-w-3xl mx-auto mb-10 font-medium">
            Canada's premier Sri Lankan community marketplace. Buy, sell, and connect with the Sri Lankan diaspora across Toronto, the GTA, and throughout Canada on HitAds.ca.
          </p>
          <Link to="/search" className="bg-white text-rose-700 font-black px-10 py-5 rounded-2xl hover:bg-slate-50 transition-all shadow-xl text-sm uppercase tracking-widest inline-block">
            Browse Community Listings
          </Link>
        </div>
      </section>

      <main className="w-full px-4 sm:px-6 lg:px-10 py-16 md:py-24">
        <section className="max-w-4xl mx-auto mb-20">
          <h2 className="text-3xl font-black text-slate-900 mb-6">Connecting the Sri Lankan Community in Canada</h2>
          <div className="space-y-4 text-slate-600 leading-relaxed">
            <p>
              Canada is home to one of the largest Sri Lankan diaspora populations in the world, with vibrant communities thriving in Toronto, Scarborough, Markham, Mississauga, and beyond. HitAds.ca serves as a dedicated digital marketplace to help this community connect, trade, and support local Sri Lankan businesses.
            </p>
            <p>
              Whether you're looking for traditional Sri Lankan clothing, authentic grocery items, event catering, immigration services, or simply wanting to rent a room from a fellow community member, HitAds.ca makes it easy to find what you need within your cultural network.
            </p>
            <p>
              Our platform offers a safe and familiar environment for newcomers to Canada to find jobs, housing, and essential services recommended by the community. We're proud to support the growth of Sri Lankan entrepreneurs and small businesses across the Greater Toronto Area by providing a free platform to advertise their products and services.
            </p>
          </div>
        </section>

        <section className="mb-20">
          <h2 className="text-3xl font-black text-slate-900 mb-10 text-center">Popular Community Services</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'Catering & Food', icon: 'restaurant' },
              { name: 'Event Planning', icon: 'celebration' },
              { name: 'Traditional Clothing', icon: 'checkroom' },
              { name: 'Immigration Services', icon: 'flight_land' },
              { name: 'Travel Agencies', icon: 'airplanemode_active' },
              { name: 'Real Estate Agents', icon: 'real_estate_agent' },
              { name: 'Community Events', icon: 'event' },
              { name: 'Room Rentals', icon: 'meeting_room' },
            ].map(svc => (
              <Link key={svc.name} to="/search" className="bg-white p-6 rounded-2xl border border-slate-100 text-center hover:border-rose-500 hover:shadow-lg transition-all group">
                <span className="material-icons text-3xl text-slate-400 group-hover:text-rose-600 mb-3 block">{svc.icon}</span>
                <span className="text-xs font-black text-slate-600 uppercase tracking-widest">{svc.name}</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="max-w-4xl mx-auto mb-20">
          <h2 className="text-3xl font-black text-slate-900 mb-6">Support Local Sri Lankan Businesses</h2>
          <div className="space-y-4 text-slate-600 leading-relaxed">
            <p>
              The Sri Lankan community in the GTA has built a strong network of successful businesses spanning retail, professional services, trades, and real estate. By using HitAds.ca, you're directly supporting these local entrepreneurs and helping wealth circulate within the community.
            </p>
            <p>
              Are you a Sri Lankan business owner in Canada? Create your free service listing on HitAds.ca today. Our platform is designed to help you reach both the local Sri Lankan community and the broader Canadian market without paying expensive advertising fees.
            </p>
          </div>
          <div className="mt-8 text-center sm:text-left">
            <Link to="/post-ad" className="bg-rose-600 text-white font-black px-10 py-5 rounded-2xl hover:bg-rose-700 transition-all shadow-xl text-sm uppercase tracking-widest inline-block">
              Advertise Your Business Free
            </Link>
          </div>
        </section>

        <section className="bg-rose-50 rounded-3xl p-10 md:p-16 max-w-4xl mx-auto">
          <h2 className="text-2xl font-black text-slate-900 mb-6">Welcome to Newcomers</h2>
          <p className="text-slate-600 mb-6 leading-relaxed">
            If you've recently arrived in Canada from Sri Lanka, navigating a new country can be overwhelming. HitAds.ca is here to help you settle in. Use our platform to:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              'Find affordable basement or room rentals in Sri Lankan neighborhoods',
              'Search for entry-level jobs and cash-paid opportunities',
              'Connect with immigration consultants and legal services',
              'Buy used furniture and winter clothing affordably',
              'Find driving instructors who speak Tamil or Sinhala',
              'Locate authentic grocery stores and restaurants near you',
            ].map((tip, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="material-icons text-rose-600 text-lg mt-0.5">check_circle</span>
                <span className="text-sm text-slate-600 font-medium">{tip}</span>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default SriLankanMarketplace;

"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { formatPrice } from '../constants';

const TorontoClassifieds: React.FC = () => {
  const [listings, setListings] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/listings/read?location=Toronto')
      .then(res => res.json())
      .then(data => setListings(Array.isArray(data) ? data.slice(0, 8) : []))
      .catch(console.error);
  }, []);

  return (
    <div className="overflow-x-hidden">
      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 via-primary to-primary-light text-white py-20 md:py-28 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
        </div>
        <div className="w-full px-4 sm:px-6 lg:px-10 relative z-10 text-center">
          <span className="inline-block py-1.5 px-4 rounded-full bg-white/10 text-white/90 text-[10px] font-black uppercase tracking-[0.2em] mb-6 backdrop-blur-sm">
            Toronto's #1 Ads Platform
          </span>
          <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
            Toronto Ads &<br />Local Marketplace
          </h1>
          <p className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto mb-10 font-medium leading-relaxed">
            Search thousands of local listings in Toronto, Ontario. Post free advertisements for jobs, cars, real estate, services, and items for sale on HitAds.ca — Canada's modern ads platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/search" className="bg-white text-primary font-black px-10 py-5 rounded-2xl hover:bg-slate-50 transition-all shadow-xl text-sm uppercase tracking-widest">
              Browse All Listings
            </Link>
            <Link href="/post-ad" className="bg-secondary hover:bg-secondary-hover text-white font-black px-10 py-5 rounded-2xl transition-all shadow-xl text-sm uppercase tracking-widest">
              Post Free Ad
            </Link>
          </div>
        </div>
      </section>

      <main className="w-full px-4 sm:px-6 lg:px-10 py-16 md:py-24">
        {/* About Section */}
        <section className="max-w-4xl mx-auto mb-20">
          <h2 className="text-3xl font-black text-slate-900 mb-6">Why Toronto Chooses HitAds.ca</h2>
          <div className="prose prose-lg text-slate-600 leading-relaxed space-y-4">
            <p>
              HitAds.ca is Toronto's premier online ads marketplace, connecting millions of local buyers and sellers across the Greater Toronto Area (GTA). Whether you're searching for a used car in Scarborough, a rental apartment in downtown Toronto, or professional services in North York, HitAds.ca makes it easy to find exactly what you need — completely free.
            </p>
            <p>
              Our platform brings together Canada's most diverse communities, offering a safe and trusted environment for everyday commerce. From Brampton to Mississauga, Markham to Etobicoke, HitAds.ca serves the entire GTA with thousands of active listings updated daily. Unlike other platforms that charge listing fees, HitAds.ca remains completely free for individuals and small businesses.
            </p>
            <p>
              As Toronto's ads landscape evolves, HitAds.ca continues to lead with innovative features including verified user profiles, instant messaging between buyers and sellers, and advanced search filters that help you narrow down results by category, price range, location, and condition. Our mobile-optimized experience ensures you can browse, buy, and sell from anywhere across Ontario.
            </p>
          </div>
        </section>

        {/* How It Works */}
        <section className="mb-20">
          <h2 className="text-3xl font-black text-slate-900 mb-10 text-center">How HitAds.ca Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: 'search', title: 'Search & Browse', desc: 'Explore thousands of listings across Toronto. Filter by category, price, location, and condition to find exactly what you need.' },
              { icon: 'add_circle', title: 'Post for Free', desc: 'Create your ad in minutes with photos, descriptions, and pricing. Reach thousands of local buyers instantly — no fees required.' },
              { icon: 'handshake', title: 'Connect & Trade', desc: 'Message sellers directly, negotiate deals, and arrange meetups at safe exchange zones across the GTA.' },
            ].map(step => (
              <div key={step.title} className="bg-white p-10 rounded-3xl border border-slate-100 text-center shadow-sm hover:shadow-xl transition-all">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <span className="material-icons text-3xl text-primary">{step.icon}</span>
                </div>
                <h3 className="text-xl font-black mb-3">{step.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Featured Categories */}
        <section className="mb-20">
          <h2 className="text-3xl font-black text-slate-900 mb-10 text-center">Popular Categories in Toronto</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {[
              { name: 'Vehicles', icon: 'directions_car' },
              { name: 'Real Estate', icon: 'home' },
              { name: 'Jobs', icon: 'work' },
              { name: 'Local Services', icon: 'handyman' },
              { name: 'Buy & Sell', icon: 'shopping_cart' },
              { name: 'Electronics & Computers', icon: 'computer' },
            ].map(cat => (
              <Link key={cat.name} href={`/search?cat=${encodeURIComponent(cat.name)}`} className="bg-white p-6 rounded-2xl border border-slate-100 text-center hover:border-primary hover:shadow-lg transition-all group">
                <span className="material-icons text-3xl text-slate-400 group-hover:text-primary mb-3 block">{cat.icon}</span>
                <span className="text-xs font-black text-slate-600 uppercase tracking-widest">{cat.name}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Recent Listings */}
        {listings.length > 0 && (
          <section className="mb-20">
            <div className="flex justify-between items-end mb-10">
              <h2 className="text-3xl font-black text-slate-900">Latest Toronto Listings</h2>
              <Link href="/search" className="text-xs font-black text-primary uppercase tracking-widest hover:underline">View All</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {listings.map(item => (
                <Link href={`/item/${item.id}`} key={item.id} className="group bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-xl transition-all">
                  <div className="aspect-[4/3] bg-slate-100 overflow-hidden">
                    <img src={item.image || 'https://picsum.photos/seed/default/800/600'} alt={item.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-5">
                    <div className="text-lg font-black text-slate-900 mb-1">{formatPrice(item.price, item.price_type)}</div>
                    <h3 className="text-sm font-bold text-slate-600 line-clamp-2 group-hover:text-primary transition-colors">{item.title}</h3>
                    <div className="mt-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                      <span className="material-icons text-xs">location_on</span> {item.location}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Local Benefits */}
        <section className="max-w-4xl mx-auto mb-20">
          <h2 className="text-3xl font-black text-slate-900 mb-6">Benefits of Using Toronto Ads on HitAds.ca</h2>
          <div className="space-y-4 text-slate-600 leading-relaxed">
            <p>
              Toronto is Canada's largest city and the economic hub of Ontario, with over 6 million residents in the GTA alone. This massive population creates a thriving marketplace for buying, selling, and trading goods and services. HitAds.ca taps into this vast network, giving you access to an audience of millions right in your neighbourhood.
            </p>
            <p>
              <strong>For Sellers:</strong> Reach thousands of potential buyers across the GTA without spending a dime on listing fees. Our platform supports multiple photos, detailed descriptions, and direct messaging — everything you need to sell quickly and get the best price for your items.
            </p>
            <p>
              <strong>For Buyers:</strong> Find incredible deals on everything from electronics and furniture to vehicles and real estate. Our advanced search filters help you narrow down listings by location, price range, category, and condition, so you only see what's relevant to you.
            </p>
            <p>
              <strong>For Service Providers:</strong> Whether you're a plumber in Etobicoke, a graphic designer in Yorkville, or a moving company in Brampton, HitAds.ca helps you reach local customers actively searching for your services. Create your service listing for free and start growing your client base today.
            </p>
          </div>
        </section>

        {/* Safety */}
        <section className="bg-primary/5 rounded-3xl p-10 md:p-16 max-w-4xl mx-auto">
          <h2 className="text-2xl font-black text-slate-900 mb-6">Safety Tips for Toronto Users</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              'Meet in public places like coffee shops or police station exchange zones',
              'Never share personal financial information or send money upfront',
              'Inspect items thoroughly before completing any transaction',
              'Use HitAds.ca messaging to keep all communications on-platform',
              'Report suspicious listings or users through our reporting system',
              'Bring a friend when meeting for high-value transactions',
            ].map((tip, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="material-icons text-primary text-lg mt-0.5">check_circle</span>
                <span className="text-sm text-slate-600 font-medium">{tip}</span>
              </div>
            ))}
          </div>
          <div className="mt-8">
            <Link href="/safety-tips" className="text-xs font-black text-primary uppercase tracking-widest hover:underline">Read Full Safety Guide →</Link>
          </div>
        </section>
      </main>
    </div>
  );
};

export default TorontoClassifieds;

"use client";

import React from 'react';
import Link from 'next/link';

const RealEstateToronto: React.FC = () => {
  return (
    <div className="overflow-x-hidden">
      <section className="bg-gradient-to-br from-sky-900 via-sky-700 to-cyan-500 text-white py-20 md:py-28 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
        </div>
        <div className="w-full px-4 sm:px-6 lg:px-10 relative z-10 text-center">
          <span className="inline-block py-1.5 px-4 rounded-full bg-white/10 text-white/90 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
            Property Listings
          </span>
          <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
            Real Estate in Toronto<br />Houses, Condos & Rentals
          </h1>
          <p className="text-lg text-white/80 max-w-3xl mx-auto mb-10 font-medium">
            Browse real estate listings in Toronto. Find houses for sale, condos, apartments for rent, commercial property, and more on HitAds.ca — your local property marketplace.
          </p>
          <Link href="/search?cat=Real%20Estate" className="bg-white text-sky-700 font-black px-10 py-5 rounded-2xl hover:bg-slate-50 transition-all shadow-xl text-sm uppercase tracking-widest inline-block">
            Browse Properties
          </Link>
        </div>
      </section>

      <main className="w-full px-4 sm:px-6 lg:px-10 py-16 md:py-24">
        <section className="max-w-4xl mx-auto mb-20">
          <h2 className="text-3xl font-black text-slate-900 mb-6">Toronto Real Estate on HitAds.ca</h2>
          <div className="space-y-4 text-slate-600 leading-relaxed">
            <p>
              Toronto's real estate market is one of the most dynamic in Canada, with opportunities ranging from luxury downtown condominiums to family homes in suburban neighborhoods like Scarborough, North York, and Etobicoke. HitAds.ca brings together property listings from independent sellers, landlords, and real estate professionals — all in one convenient platform.
            </p>
            <p>
              Whether you're a first-time homebuyer looking for an affordable condo in Mississauga, a family searching for a spacious house in Brampton, or a student seeking a room rental near the University of Toronto, HitAds.ca has thousands of listings to explore. Our advanced filters let you search by property type, number of bedrooms, price range, and specific neighborhoods across the Greater Toronto Area.
            </p>
            <p>
              For landlords and property owners, HitAds.ca provides a free platform to advertise your properties to thousands of potential tenants and buyers. Create detailed listings with floor plans, multiple photos, and neighborhood descriptions to attract quality inquiries from serious prospects.
            </p>
            <p>
              The GTA real estate landscape includes everything from high-rise condominiums along the Yonge-University corridor to charming townhouses in Oakville, commercial properties in Vaughan's business parks, and vacation rentals in Niagara-on-the-Lake. Whatever your real estate needs, HitAds.ca connects you with local opportunities.
            </p>
          </div>
        </section>

        <section className="mb-20">
          <h2 className="text-3xl font-black text-slate-900 mb-10 text-center">Property Types Available</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'Houses for Sale', icon: 'house' },
              { name: 'Condos', icon: 'apartment' },
              { name: 'Apartments for Rent', icon: 'meeting_room' },
              { name: 'Townhouses', icon: 'holiday_village' },
              { name: 'Basements for Rent', icon: 'stairs' },
              { name: 'Commercial Property', icon: 'store' },
              { name: 'Land for Sale', icon: 'landscape' },
              { name: 'Room Rentals', icon: 'single_bed' },
            ].map(prop => (
              <Link key={prop.name} href={`/search?cat=Real%20Estate&sub=${encodeURIComponent(prop.name)}`} className="bg-white p-6 rounded-2xl border border-slate-100 text-center hover:border-sky-500 hover:shadow-lg transition-all group">
                <span className="material-icons text-3xl text-slate-400 group-hover:text-sky-600 mb-3 block">{prop.icon}</span>
                <span className="text-xs font-black text-slate-600 uppercase tracking-widest">{prop.name}</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="max-w-4xl mx-auto mb-20">
          <h2 className="text-3xl font-black text-slate-900 mb-6">Popular Toronto Neighborhoods</h2>
          <div className="space-y-4 text-slate-600 leading-relaxed">
            <p>
              <strong>Downtown Toronto:</strong> The heart of the city features luxury condos, vibrant nightlife, and proximity to the Financial District. Ideal for young professionals and urban dwellers who want walkability and transit access.
            </p>
            <p>
              <strong>North York:</strong> A diverse and family-friendly area with excellent schools, parks, and shopping centers. North York offers a mix of high-rise condos and detached homes at prices more accessible than downtown.
            </p>
            <p>
              <strong>Scarborough:</strong> Known for its multicultural communities and affordable housing options. Scarborough offers excellent value for families, with spacious homes, natural parks, and diverse dining options.
            </p>
            <p>
              <strong>Mississauga & Brampton:</strong> These rapidly growing suburbs offer new construction homes, modern amenities, and a suburban lifestyle with easy commuter access to Toronto via GO Transit.
            </p>
          </div>
        </section>

        <section className="bg-sky-50 rounded-3xl p-10 md:p-16 max-w-4xl mx-auto">
          <h2 className="text-2xl font-black text-slate-900 mb-6">Real Estate Tips for Toronto Buyers & Renters</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              'Get pre-approved for a mortgage before house hunting',
              'Research neighborhood transit, schools, and amenities',
              'Visit properties during different times of day',
              'Understand Ontario tenant rights and landlord obligations',
              'Compare similar listings to ensure fair market pricing',
              'Always conduct a home inspection before purchasing',
            ].map((tip, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="material-icons text-sky-600 text-lg mt-0.5">check_circle</span>
                <span className="text-sm text-slate-600 font-medium">{tip}</span>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default RealEstateToronto;

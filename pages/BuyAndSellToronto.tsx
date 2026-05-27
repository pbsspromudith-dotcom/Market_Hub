import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const BuyAndSellToronto: React.FC = () => {
  const [listings, setListings] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/listings/read.php')
      .then(res => res.json())
      .then(data => setListings(data.filter((l: any) => !['Jobs', 'Real Estate'].some(c => l.category?.startsWith(c))).slice(0, 8)))
      .catch(console.error);
  }, []);

  return (
    <div className="overflow-x-hidden">
      <section className="bg-gradient-to-br from-emerald-900 via-emerald-700 to-teal-500 text-white py-20 md:py-28 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
        </div>
        <div className="w-full px-4 sm:px-6 lg:px-10 relative z-10 text-center">
          <span className="inline-block py-1.5 px-4 rounded-full bg-white/10 text-white/90 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
            Free Buy & Sell Marketplace
          </span>
          <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
            Buy and Sell in Toronto<br />The Easy Way
          </h1>
          <p className="text-lg text-white/80 max-w-3xl mx-auto mb-10 font-medium">
            Find electronics, furniture, vehicles, clothing, and more from local sellers in Toronto. Post your items for free and connect with thousands of buyers in the GTA.
          </p>
          <Link to="/search" className="bg-white text-emerald-700 font-black px-10 py-5 rounded-2xl hover:bg-slate-50 transition-all shadow-xl text-sm uppercase tracking-widest inline-block">
            Start Shopping
          </Link>
        </div>
      </section>

      <main className="w-full px-4 sm:px-6 lg:px-10 py-16 md:py-24">
        <section className="max-w-4xl mx-auto mb-20">
          <h2 className="text-3xl font-black text-slate-900 mb-6">Toronto's Most Trusted Buy & Sell Platform</h2>
          <div className="space-y-4 text-slate-600 leading-relaxed">
            <p>
              HitAds.ca is the go-to platform for buying and selling in Toronto and across the Greater Toronto Area. With thousands of new listings posted daily, you'll find an incredible selection of pre-owned and brand-new items — from cutting-edge electronics and designer fashion to household furniture and sporting goods.
            </p>
            <p>
              Our marketplace connects you directly with local sellers in your neighborhood, eliminating shipping costs and delivery delays. Browse items in Scarborough, Mississauga, Brampton, North York, Etobicoke, and every corner of the GTA. Meet locally, inspect items in person, and complete transactions safely.
            </p>
            <p>
              Whether you're decluttering your home, upgrading your tech setup, or hunting for bargains, HitAds.ca makes the entire process simple and secure. Create detailed listings with up to 10 photos, set your price, and start receiving inquiries from interested buyers within minutes.
            </p>
            <p>
              Our verified user system and built-in messaging ensure transparency in every transaction. Unlike social media marketplaces with limited search capabilities, HitAds.ca offers advanced filters for price range, condition, category, and proximity — saving you time and helping you find exactly what you're looking for.
            </p>
          </div>
        </section>

        <section className="mb-20">
          <h2 className="text-3xl font-black text-slate-900 mb-10 text-center">What Can You Buy & Sell?</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'Electronics', icon: 'devices' },
              { name: 'Furniture', icon: 'chair' },
              { name: 'Fashion & Beauty', icon: 'checkroom' },
              { name: 'Sports & Outdoors', icon: 'fitness_center' },
              { name: 'Baby & Kids', icon: 'child_care' },
              { name: 'Musical Instruments', icon: 'music_note' },
              { name: 'Tools & Hardware', icon: 'build' },
              { name: 'Collectibles', icon: 'collections' },
            ].map(cat => (
              <Link key={cat.name} to={`/search?q=${encodeURIComponent(cat.name)}`} className="bg-white p-6 rounded-2xl border border-slate-100 text-center hover:border-emerald-500 hover:shadow-lg transition-all group">
                <span className="material-icons text-3xl text-slate-400 group-hover:text-emerald-600 mb-3 block">{cat.icon}</span>
                <span className="text-xs font-black text-slate-600 uppercase tracking-widest">{cat.name}</span>
              </Link>
            ))}
          </div>
        </section>

        {listings.length > 0 && (
          <section className="mb-20">
            <div className="flex justify-between items-end mb-10">
              <h2 className="text-3xl font-black text-slate-900">Items for Sale in Toronto</h2>
              <Link to="/search" className="text-xs font-black text-primary uppercase tracking-widest hover:underline">View All</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {listings.map(item => (
                <Link to={`/item/${item.id}`} key={item.id} className="group bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-xl transition-all">
                  <div className="aspect-[4/3] bg-slate-100 overflow-hidden">
                    <img src={item.image || 'https://picsum.photos/seed/default/800/600'} alt={item.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-5">
                    <div className="text-lg font-black text-slate-900 mb-1">${Number(item.price).toLocaleString()}</div>
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

        <section className="max-w-4xl mx-auto mb-20">
          <h2 className="text-3xl font-black text-slate-900 mb-6">Tips for Selling Successfully in Toronto</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { title: 'Take Great Photos', desc: 'Clear, well-lit photos from multiple angles attract more buyers. Use natural lighting and clean backgrounds.' },
              { title: 'Price Competitively', desc: 'Research similar listings on HitAds.ca to price your items competitively. Consider listing slightly above your minimum to allow negotiation room.' },
              { title: 'Write Detailed Descriptions', desc: 'Include brand, model, condition, dimensions, and any defects. Honest descriptions build trust and reduce time-wasters.' },
              { title: 'Respond Quickly', desc: 'Buyers in Toronto move fast. Respond to inquiries within hours to secure the sale before they find an alternative.' },
            ].map(tip => (
              <div key={tip.title} className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
                <h3 className="text-lg font-black text-slate-900 mb-3">{tip.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{tip.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default BuyAndSellToronto;

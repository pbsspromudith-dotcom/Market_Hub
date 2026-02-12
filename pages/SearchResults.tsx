
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MOCK_LISTINGS } from '../constants';

const SearchResults: React.FC = () => {
  const [mileage, setMileage] = useState(125);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar Filters */}
        <aside className="col-span-12 lg:col-span-3 space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm sticky top-24">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold">Filters</h2>
              <button className="text-xs font-bold text-primary uppercase tracking-widest">Clear All</button>
            </div>

            <div className="space-y-8">
              <section>
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Category</h3>
                <ul className="space-y-3">
                  {['Vehicles', 'Electronics', 'Furniture', 'Real Estate'].map((cat, i) => (
                    <li key={cat} className={`flex justify-between items-center text-sm font-medium cursor-pointer ${i === 0 ? 'text-primary' : 'text-slate-600 hover:text-primary'}`}>
                      {cat}
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${i === 0 ? 'bg-primary/10' : 'bg-slate-100 text-slate-500'}`}>
                        {1245 - (i * 300)}
                      </span>
                    </li>
                  ))}
                </ul>
              </section>

              <section>
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Location</h3>
                <div className="relative mb-3">
                  <span className="material-icons absolute left-3 top-2.5 text-slate-400 text-lg">search</span>
                  <input className="w-full pl-10 pr-4 py-2 bg-slate-50 border-slate-200 rounded-xl text-sm focus:ring-primary focus:border-primary" placeholder="Postal Code or City" type="text" />
                </div>
                <select className="w-full py-2 bg-slate-50 border-slate-200 rounded-xl text-sm focus:ring-primary focus:border-primary">
                  <option>Within 10 km</option>
                  <option selected>Within 50 km</option>
                  <option>Nationwide</option>
                </select>
              </section>

              <section>
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Price Range</h3>
                <div className="flex items-center gap-2">
                  <input className="w-full px-3 py-2 bg-slate-50 border-slate-200 rounded-xl text-sm" placeholder="Min" type="number" />
                  <span className="text-slate-300">-</span>
                  <input className="w-full px-3 py-2 bg-slate-50 border-slate-200 rounded-xl text-sm" placeholder="Max" type="number" />
                </div>
              </section>

              <section>
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Condition</h3>
                <div className="space-y-3">
                  {['New', 'Used', 'Certified'].map(cond => (
                    <label key={cond} className="flex items-center gap-3 cursor-pointer group">
                      <input type="checkbox" className="w-5 h-5 rounded border-slate-200 text-primary focus:ring-primary" />
                      <span className="text-sm font-medium text-slate-600 group-hover:text-primary transition-colors">{cond}</span>
                    </label>
                  ))}
                </div>
              </section>

              <section>
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Mileage: {mileage}k+ km</h3>
                <input 
                  type="range" 
                  min="0" 
                  max="250" 
                  value={mileage} 
                  onChange={(e) => setMileage(parseInt(e.target.value))}
                  className="w-full accent-primary" 
                />
                <div className="flex justify-between text-[10px] font-bold text-slate-400 mt-2">
                  <span>0 KM</span>
                  <span>250K+ KM</span>
                </div>
              </section>
            </div>
          </div>

          <div className="bg-primary/5 rounded-2xl p-6 text-center border border-primary/10">
            <span className="text-[10px] font-black text-primary uppercase tracking-widest mb-2 block">Sponsored</span>
            <h4 className="font-bold mb-2">Sell your car today!</h4>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">Get a free instant quote and sell in 24 hours.</p>
            <button className="bg-slate-900 text-white font-bold py-2 px-6 rounded-lg text-xs shadow-md">Get Quote</button>
          </div>
        </aside>

        {/* Results Content */}
        <main className="col-span-12 lg:col-span-9 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <nav className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                Home / Vehicles / Cars & Trucks
              </nav>
              <h1 className="text-2xl font-black">1,245 Cars & Trucks in Toronto</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Sort by:</span>
              <select className="text-sm border-slate-200 rounded-xl focus:ring-primary focus:border-primary pr-10">
                <option>Most Recent</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            {MOCK_LISTINGS.map((item) => (
              <Link 
                to={`/item/${item.id}`} 
                key={item.id} 
                className={`group flex flex-col md:flex-row bg-white rounded-2xl border overflow-hidden hover:shadow-lg transition-all ${item.isFeatured ? 'border-primary/30 ring-1 ring-primary/10' : 'border-slate-200'}`}
              >
                <div className="w-full md:w-64 aspect-video md:aspect-square flex-shrink-0 relative">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  {item.isFeatured && (
                    <div className="absolute top-3 left-3 bg-primary text-white text-[10px] font-black px-2 py-0.5 rounded-md flex items-center gap-1 shadow-sm">
                      <span className="material-icons text-xs">star</span> FEATURED
                    </div>
                  )}
                </div>
                <div className="p-6 flex-grow flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start gap-4 mb-2">
                      <h3 className="text-xl font-bold group-hover:text-primary transition-colors leading-tight">{item.title}</h3>
                      <span className="text-2xl font-black text-slate-900">${item.price.toLocaleString()}</span>
                    </div>
                    <p className="text-sm text-slate-500 line-clamp-2 mb-4">
                      {item.description || "Excellent condition, well maintained and ready for its next owner. Competitive pricing and reliable performance."}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-slate-100 rounded-full text-[10px] font-bold text-slate-500 uppercase tracking-wide">12,400 KM</span>
                      <span className="px-3 py-1 bg-slate-100 rounded-full text-[10px] font-bold text-slate-500 uppercase tracking-wide">Automatic</span>
                      <span className="px-3 py-1 bg-slate-100 rounded-full text-[10px] font-bold text-slate-500 uppercase tracking-wide">Gasoline</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-50">
                    <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      <span className="flex items-center gap-1"><span className="material-icons text-sm">location_on</span> {item.location}</span>
                      <span className="flex items-center gap-1"><span className="material-icons text-sm">schedule</span> {item.time}</span>
                    </div>
                    <button className="material-icons text-slate-300 hover:text-red-500 transition-colors">favorite_border</button>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="flex justify-center gap-2 pt-10">
            <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-primary text-white font-bold">1</button>
            <button className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-slate-100 font-bold transition-colors">2</button>
            <button className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-slate-100 font-bold transition-colors">3</button>
            <span className="w-10 h-10 flex items-center justify-center text-slate-300">...</span>
            <button className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-slate-100 font-bold transition-colors">12</button>
          </div>
        </main>
      </div>

      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-40">
        <button className="bg-slate-900 text-white px-8 py-4 rounded-full shadow-2xl flex items-center gap-3 font-bold hover:scale-105 transition-transform">
          <span className="material-icons">map</span>
          <span>Show Map View</span>
        </button>
      </div>
    </div>
  );
};

export default SearchResults;

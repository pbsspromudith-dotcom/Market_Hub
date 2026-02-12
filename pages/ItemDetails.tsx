
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { MOCK_LISTINGS, CURRENT_USER } from '../constants';

const ItemDetails: React.FC = () => {
  const { id } = useParams();
  const listing = MOCK_LISTINGS.find(l => l.id === id) || MOCK_LISTINGS[0];

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <nav className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest mb-8">
        <Link to="/" className="hover:text-primary">Home</Link>
        <span className="material-icons text-xs">chevron_right</span>
        <Link to="/search" className="hover:text-primary">{listing.category}</Link>
        <span className="material-icons text-xs">chevron_right</span>
        <span className="text-slate-900">{listing.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-10">
          {/* Header Info */}
          <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-3xl font-black text-slate-900 leading-tight">{listing.title}</h1>
              <div className="flex gap-3">
                <button className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-primary transition-all">
                  <span className="material-icons">share</span>
                </button>
                <button className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-red-500 transition-all">
                  <span className="material-icons">favorite_border</span>
                </button>
              </div>
            </div>
            <div className="flex flex-wrap gap-6 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
              <span className="flex items-center gap-1.5"><span className="material-icons text-sm text-primary">location_on</span> {listing.location}</span>
              <span className="flex items-center gap-1.5"><span className="material-icons text-sm text-primary">schedule</span> Posted {listing.time}</span>
              <span className="flex items-center gap-1.5"><span className="material-icons text-sm text-primary">visibility</span> 1,240 Views</span>
            </div>
          </div>

          {/* Gallery */}
          <div className="bg-white p-2 rounded-[2rem] border border-slate-200 overflow-hidden shadow-sm">
            <div className="aspect-video relative rounded-2xl overflow-hidden group">
              <img src={listing.image} alt="Main" className="w-full h-full object-cover" />
              <button className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/90 p-3 rounded-full shadow-xl opacity-0 group-hover:opacity-100 transition-all">
                <span className="material-icons">chevron_left</span>
              </button>
              <button className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/90 p-3 rounded-full shadow-xl opacity-0 group-hover:opacity-100 transition-all">
                <span className="material-icons">chevron_right</span>
              </button>
              <div className="absolute bottom-6 right-6 bg-black/60 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-xs font-bold">1 / 8 Photos</div>
            </div>
            <div className="flex gap-3 mt-3 overflow-x-auto pb-2 scrollbar-hide">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className={`flex-shrink-0 w-28 h-20 rounded-xl overflow-hidden cursor-pointer border-2 ${i === 1 ? 'border-primary' : 'border-transparent opacity-60'}`}>
                  <img src={`https://picsum.photos/seed/thumb${i}/300/200`} alt="Thumb" className="w-full h-full object-cover" />
                </div>
              ))}
              <div className="flex-shrink-0 w-28 h-20 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 font-bold border-2 border-transparent">+4</div>
            </div>
          </div>

          {/* Specifications */}
          <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
            <h2 className="text-xl font-black mb-8 flex items-center gap-2">
              <span className="material-icons text-primary">list_alt</span>
              Specifications
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-y-8 gap-x-12">
              {[
                { label: 'Make', value: 'Apple' },
                { label: 'Model', value: 'MacBook Pro 16"' },
                { label: 'Year', value: '2023' },
                { label: 'Processor', value: 'M2 Max' },
                { label: 'RAM', value: '32GB' },
                { label: 'Condition', value: 'Like New', isBadge: true }
              ].map(spec => (
                <div key={spec.label}>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">{spec.label}</p>
                  {spec.isBadge ? (
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-[10px] font-black uppercase tracking-wider">{spec.value}</span>
                  ) : (
                    <p className="font-bold text-slate-800">{spec.value}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
            <h2 className="text-xl font-black mb-6">Description</h2>
            <div className="text-slate-600 space-y-4 leading-relaxed">
              <p>Selling my barely used {listing.title}. It's in pristine condition and comes with all original accessories and packaging.</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>No scratches or dents</li>
                <li>Battery health at 100%</li>
                <li>Still under manufacturer warranty</li>
              </ul>
              <p>Reason for selling: upgraded to a different model. Local pickup only, cash or e-transfer accepted.</p>
            </div>
          </div>

          {/* Map */}
          <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-black">Location</h2>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{listing.location}</span>
            </div>
            <div className="h-72 rounded-2xl bg-slate-100 relative overflow-hidden group">
              <img src="https://picsum.photos/seed/map/1200/600" alt="Map" className="w-full h-full object-cover grayscale opacity-60" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-24 h-24 bg-primary/20 rounded-full border-4 border-primary flex items-center justify-center animate-pulse">
                  <span className="material-icons text-primary text-4xl">location_on</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Sticky */}
        <aside className="lg:col-span-4">
          <div className="sticky top-28 space-y-8">
            <div className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-xl shadow-slate-100">
              <div className="mb-8">
                <span className="text-4xl font-black text-slate-900">${listing.price.toLocaleString()}</span>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-2">Fair price for this condition</p>
              </div>

              <div className="space-y-6">
                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-4 mb-6">
                    <img src={CURRENT_USER.avatar} alt="Seller" className="w-14 h-14 rounded-full border-2 border-white shadow-sm" />
                    <div>
                      <p className="font-black text-lg">Jordan S.</p>
                      <div className="flex items-center gap-1.5 text-xs font-bold">
                        <span className="flex items-center text-primary"><span className="material-icons text-sm">star</span> 4.9</span>
                        <span className="text-slate-300">•</span>
                        <span className="text-slate-400">Since 2018</span>
                      </div>
                    </div>
                  </div>
                  <textarea className="w-full text-sm rounded-xl border-slate-200 bg-white focus:ring-primary focus:border-primary placeholder:text-slate-300 mb-4" placeholder="Is this still available?" rows={3}></textarea>
                  <button className="w-full bg-primary text-white font-black py-4 rounded-xl hover:bg-primary-hover transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20">
                    <span className="material-icons">send</span> Send Message
                  </button>
                </div>
                
                <button className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-lg">
                  <span className="material-icons">phone</span> Reveal Phone Number
                </button>
              </div>
            </div>

            <div className="bg-primary/10 border border-primary/20 p-6 rounded-2xl flex items-start gap-4">
              <span className="material-icons text-primary mt-1">verified_user</span>
              <div>
                <h4 className="font-black text-sm text-slate-900 uppercase tracking-widest mb-1">Trade Safely</h4>
                <p className="text-xs text-slate-600 leading-relaxed mb-3">Meet in a public place. Avoid shipping or wiring money. Inspect thoroughly before paying.</p>
                <a href="#" className="text-xs font-black text-primary hover:underline uppercase tracking-widest">Read Security Guide</a>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default ItemDetails;

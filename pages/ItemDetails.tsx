import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CURRENT_USER } from '../constants';

const ItemDetails: React.FC = () => {
  const { id } = useParams();
  const [listing, setListing] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch('/api/listings/' + id)
      .then(res => res.json())
      .then(data => {
        if (!data.error) setListing(data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="p-20 text-center font-bold">Loading listing...</div>;
  if (!listing) return <div className="p-20 text-center font-bold text-red-500">Listing not found.</div>;

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
              <span className="flex items-center gap-1.5"><span className="material-icons text-sm text-primary">visibility</span> {listing.views || 0} Views</span>
            </div>
          </div>

          {/* Gallery */}
          <div className="bg-white p-2 rounded-[2rem] border border-slate-200 overflow-hidden shadow-sm">
            <div className="aspect-video relative rounded-2xl overflow-hidden group">
              <img src={listing.image || 'https://picsum.photos/seed/default/800/600'} alt="Main" className="w-full h-full object-cover" />
            </div>
          </div>

          {/* Description */}
          <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
            <h2 className="text-xl font-black mb-6">Description</h2>
            <div className="text-slate-600 space-y-4 leading-relaxed whitespace-pre-line">
              {listing.description || 'No description provided.'}
            </div>
          </div>
        </div>

        {/* Sidebar Sticky */}
        <aside className="lg:col-span-4">
          <div className="sticky top-28 space-y-8">
            <div className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-xl shadow-slate-100">
              <div className="mb-8">
                <span className="text-4xl font-black text-slate-900">\${Number(listing.price).toLocaleString()}</span>
              </div>

              <div className="space-y-6">
                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-4 mb-6">
                    <img src={listing.seller_avatar || CURRENT_USER.avatar} alt="Seller" className="w-14 h-14 rounded-full border-2 border-white shadow-sm" />
                    <div>
                      <p className="font-black text-lg">{listing.seller_name || 'Anonymous User'}</p>
                      <div className="flex items-center gap-1.5 text-xs font-bold">
                        <span className="text-slate-400">Joined {listing.seller_join_date ? new Date(listing.seller_join_date).toLocaleDateString() : 'Recently'}</span>
                      </div>
                    </div>
                  </div>
                  <textarea className="w-full text-sm rounded-xl border-slate-200 bg-white focus:ring-primary focus:border-primary placeholder:text-slate-300 mb-4" placeholder="Is this still available?" rows={3}></textarea>
                  <button className="w-full bg-primary text-white font-black py-4 rounded-xl hover:bg-primary-hover transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20">
                    <span className="material-icons">send</span> Send Message
                  </button>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default ItemDetails;

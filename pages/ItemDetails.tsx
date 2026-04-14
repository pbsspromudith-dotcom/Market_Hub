import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CURRENT_USER } from '../constants';

const ItemDetails: React.FC = () => {
  const { id } = useParams();
  const [listing, setListing] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeIdx, setActiveIdx] = useState(0);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch('/api/listings/read_single.php?id=' + id)
      .then(res => res.json())
      .then(data => {
        if (!data.error) {
          setListing(data);
          setActiveIdx(0);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="p-20 text-center font-bold">Loading listing...</div>;
  if (!listing) return <div className="p-20 text-center font-bold text-red-500">Listing not found.</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 lg:py-10">
      <nav className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">
        <Link to="/" className="hover:text-primary">Home</Link>
        <span className="material-icons text-xs">chevron_right</span>
        <Link to="/search" className="hover:text-primary">{listing.category}</Link>
        <span className="material-icons text-xs">chevron_right</span>
        <span className="text-slate-900 truncate max-w-[160px]">{listing.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10">
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
          {(() => {
            const images: string[] = listing.allImages && listing.allImages.length > 0
              ? listing.allImages
              : [listing.image || 'https://picsum.photos/seed/default/800/600'];
            const total = images.length;
            const prev = () => setActiveIdx(i => (i - 1 + total) % total);
            const next = () => setActiveIdx(i => (i + 1) % total);

            return (
              <div className="bg-white p-2 rounded-[2rem] border border-slate-200 overflow-hidden shadow-sm">
                {/* Main Viewer */}
                <div
                  className="aspect-video relative rounded-2xl overflow-hidden bg-slate-100 flex items-center justify-center select-none"
                  onTouchStart={e => { touchStartX.current = e.touches[0].clientX; }}
                  onTouchEnd={e => {
                    if (touchStartX.current === null) return;
                    const diff = touchStartX.current - e.changedTouches[0].clientX;
                    if (Math.abs(diff) > 40) diff > 0 ? next() : prev();
                    touchStartX.current = null;
                  }}
                >
                  {/* Sliding images */}
                  <div
                    className="flex h-full transition-transform duration-500 ease-in-out w-full absolute inset-0"
                    style={{ transform: `translateX(-${activeIdx * 100}%)` }}
                  >
                    {images.map((img: string, idx: number) => (
                      <div key={idx} className="flex-shrink-0 w-full h-full flex items-center justify-center bg-slate-100 p-4">
                        <img src={img} alt={`Image ${idx + 1}`} className="max-w-full max-h-full object-contain" />
                      </div>
                    ))}
                  </div>

                  {/* Arrows */}
                  {total > 1 && (
                    <>
                      <button
                        onClick={prev}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm p-2.5 rounded-full shadow-lg hover:bg-white hover:scale-110 transition-all z-10"
                      >
                        <span className="material-icons text-slate-700">chevron_left</span>
                      </button>
                      <button
                        onClick={next}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm p-2.5 rounded-full shadow-lg hover:bg-white hover:scale-110 transition-all z-10"
                      >
                        <span className="material-icons text-slate-700">chevron_right</span>
                      </button>
                    </>
                  )}

                  {/* Counter badge */}
                  {total > 1 && (
                    <div className="absolute bottom-4 right-4 bg-black/50 text-white text-xs font-bold px-3 py-1 rounded-full backdrop-blur-sm">
                      {activeIdx + 1} / {total}
                    </div>
                  )}
                </div>

                {/* Dot Indicators */}
                {total > 1 && (
                  <div className="flex justify-center gap-2 mt-3 mb-1">
                    {images.map((_: string, idx: number) => (
                      <button
                        key={idx}
                        onClick={() => setActiveIdx(idx)}
                        className={`rounded-full transition-all duration-300 ${
                          activeIdx === idx
                            ? 'w-6 h-2 bg-primary'
                            : 'w-2 h-2 bg-slate-300 hover:bg-slate-400'
                        }`}
                      />
                    ))}
                  </div>
                )}

                {/* Thumbnail Strip */}
                {total > 1 && (
                  <div className="flex gap-2 mt-2 overflow-x-auto pb-2 px-1">
                    {images.map((img: string, idx: number) => (
                      <div
                        key={idx}
                        onClick={() => setActiveIdx(idx)}
                        className={`flex-shrink-0 w-24 h-16 rounded-xl overflow-hidden cursor-pointer border-2 transition-all bg-slate-50 flex items-center justify-center ${
                          activeIdx === idx
                            ? 'border-primary shadow-md shadow-primary/20 scale-105'
                            : 'border-transparent opacity-60 hover:opacity-90 hover:border-slate-200'
                        }`}
                      >
                        <img src={img} alt={`Thumb ${idx + 1}`} className="w-full h-full object-contain p-1" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })()}

          {/* Description */}
          <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
            <h2 className="text-xl font-black mb-6">Description</h2>
            <div className="text-slate-600 space-y-4 leading-relaxed whitespace-pre-line">
              {listing.description || 'No description provided.'}
            </div>
          </div>
        </div>

        {/* Sidebar Sticky */}
        <aside className="lg:col-span-4 order-first lg:order-last">
          <div className="sticky top-28 space-y-8">
            <div className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-xl shadow-slate-100">
              <div className="mb-8">
                <span className="text-4xl font-black text-slate-900">${Number(listing.price).toLocaleString()}</span>
              </div>

              <div className="space-y-6">
                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-4 mb-6">
                    {listing.seller_avatar ? (
                      <img src={listing.seller_avatar} alt="Seller" className="w-14 h-14 rounded-full border-2 border-white shadow-sm object-cover" />
                    ) : (
                      <div className="w-14 h-14 rounded-full bg-slate-200 border-2 border-white shadow-sm flex items-center justify-center">
                        <span className="material-icons text-slate-400 text-2xl">person</span>
                      </div>
                    )}
                    <div>
                      <p className="font-black text-lg">{listing.seller_name || 'Private Seller'}</p>
                      <div className="flex items-center gap-1.5 text-xs font-bold">
                        <span className="text-slate-400">
                          {listing.seller_join_date ? `Joined ${new Date(listing.seller_join_date).toLocaleDateString()}` : 'Member'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <textarea className="w-full text-sm rounded-xl border-slate-200 bg-white focus:ring-primary focus:border-primary placeholder:text-slate-300 mb-4" placeholder="Is this still available?" rows={3}></textarea>
                  <button className="w-full bg-primary text-white font-black py-4 rounded-xl hover:bg-primary-hover transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20">
                    <span className="material-icons">send</span> Send Message
                  </button>
                </div>
                
                {(listing.contact_email || listing.seller_email || listing.contact_phone || listing.seller_phone) && (
                  <div className="bg-slate-50 rounded-2xl border border-slate-100 p-5 mt-6">
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Direct Contact Info</h4>
                    <div className="space-y-3">
                      {(listing.contact_phone || listing.seller_phone) && (
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 flex-shrink-0">
                            <span className="material-icons text-sm">phone</span>
                          </div>
                          <a href={`tel:${listing.contact_phone || listing.seller_phone}`} className="text-sm font-bold text-slate-700 hover:text-green-600 transition-colors">
                            {listing.contact_phone || listing.seller_phone}
                          </a>
                        </div>
                      )}
                      
                      {(listing.contact_email || listing.seller_email) && (
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
                            <span className="material-icons text-sm">email</span>
                          </div>
                          <a href={`mailto:${listing.contact_email || listing.seller_email}`} className="text-sm font-bold text-slate-700 hover:text-blue-600 transition-colors break-all">
                            {listing.contact_email || listing.seller_email}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default ItemDetails;

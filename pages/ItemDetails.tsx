import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CURRENT_USER, formatPrice } from '../constants';
import { trackContactClick } from '../analytics';

function getYouTubeEmbedUrl(url: string): string | null {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  if (match && match[2].length === 11) {
    return `https://www.youtube.com/embed/${match[2]}`;
  }
  return null;
}

const ItemDetails: React.FC = () => {
  const { id } = useParams();
  const [listing, setListing] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeIdx, setActiveIdx] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sentStatus, setSentStatus] = useState<string | null>(null);
  
  const [mapWidth, setMapWidth] = useState('100%');
  const [mapHeight, setMapHeight] = useState('200px');

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

    fetch('/api/admin/seo_read.php?t=' + new Date().getTime())
      .then(res => res.json())
      .then(data => {
        if (data.success && data.settings) {
          if (data.settings.listing_map_width) setMapWidth(data.settings.listing_map_width);
          if (data.settings.listing_map_height) setMapHeight(data.settings.listing_map_height);
        }
      })
      .catch(console.error);
  }, [id]);

  const handleSendMessage = async () => {
    const finalMessage = message.trim() || "Is this still available?";
    
    setSending(true);
    setSentStatus(null);
    
    try {
      const user = JSON.parse(localStorage.getItem('user') || 'null');
      const response = await fetch('/api/messages/create.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listing_id: id,
          message: finalMessage,
          sender_id: user ? user.id : 0,
          sender_name: user ? user.name : 'A Guest'
        })
      });
      const data = await response.json();
      if (data.success) {
        setSentStatus('Message sent successfully!');
        setMessage('');
        trackContactClick(id || '0', 'message');
      } else {
        setSentStatus('Failed to send message.');
      }
    } catch (err) {
      setSentStatus('Error sending message.');
    } finally {
      setSending(false);
    }
  };

  if (loading) return <div className="p-20 text-center font-bold">Loading listing...</div>;
  if (!listing) return <div className="p-20 text-center font-bold text-red-500">Listing not found.</div>;

  return (
    <div className="w-full px-4 sm:px-6 lg:px-10 py-6 lg:py-10">
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
                        <img src={img} alt={`${listing.title} — Photo ${idx + 1} of ${total}${listing.category ? ' | ' + listing.category : ''}${listing.location ? ' in ' + listing.location : ''}`} className="max-w-full max-h-full object-contain" />
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
                        <img src={img} alt={`${listing.title} thumbnail ${idx + 1}`} className="w-full h-full object-contain p-1" />
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


          {/* YouTube Video Section */}
          {listing.youtube_link && (
            <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
              <h2 className="text-xl font-black mb-6 flex items-center gap-2">
                <span className="material-icons text-red-500 text-2xl">play_circle</span>
                Video Walkthrough
              </h2>
              {getYouTubeEmbedUrl(listing.youtube_link) ? (
                <div className="aspect-video rounded-2xl overflow-hidden shadow-sm border border-slate-200 bg-slate-50">
                  <iframe
                    src={getYouTubeEmbedUrl(listing.youtube_link)!}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title="YouTube Video Walkthrough"
                  ></iframe>
                </div>
              ) : (
                <a
                  href={listing.youtube_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-5 bg-red-50/50 hover:bg-red-50 text-red-600 rounded-2xl font-bold transition-all border border-red-100/50"
                >
                  <div className="flex items-center gap-3">
                    <span className="material-icons text-2xl">open_in_new</span>
                    <span>Watch Video on YouTube</span>
                  </div>
                  <span className="material-icons">chevron_right</span>
                </a>
              )}
            </div>
          )}

          {/* Facebook Link Section */}
          {listing.facebook_link && (
            <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
              <h2 className="text-xl font-black mb-6 flex items-center gap-2">
                <span className="material-icons text-blue-600 text-2xl">facebook</span>
                Facebook Profile / Page
              </h2>
              <a
                href={listing.facebook_link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-5 bg-blue-50/50 hover:bg-blue-50 text-blue-600 rounded-2xl font-bold transition-all border border-blue-100/50"
              >
                <div className="flex items-center gap-3">
                  <span className="material-icons text-2xl">link</span>
                  <span>View Facebook Link</span>
                </div>
                <span className="material-icons">chevron_right</span>
              </a>
            </div>
          )}
        </div>

        {/* Sidebar Sticky */}
        <aside className="lg:col-span-4">
          <div className="sticky top-28 space-y-8">
            <div className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-xl shadow-slate-100">
              <div className="mb-8">
                <span className="text-4xl font-black text-slate-900">{formatPrice(listing.price, listing.price_type)}</span>
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
                  <textarea 
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full text-sm rounded-xl border-slate-200 bg-white focus:ring-primary focus:border-primary placeholder:text-slate-300 mb-4" 
                    placeholder="Is this still available?" 
                    rows={3}
                  ></textarea>
                  
                  {sentStatus && (
                    <div className={`text-xs font-bold mb-4 p-3 rounded-lg ${sentStatus.includes('successfully') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                      {sentStatus}
                    </div>
                  )}

                  <button 
                    onClick={handleSendMessage}
                    disabled={sending}
                    className="w-full bg-primary text-white font-black py-4 rounded-xl hover:bg-primary-hover transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20 disabled:opacity-50"
                  >
                    <span className="material-icons">{sending ? 'sync' : 'send'}</span> 
                    {sending ? 'Sending...' : 'Send Message'}
                  </button>
                </div>
                
                {((listing.contact_phone && listing.contact_phone.trim() !== "") || listing.location) && (
                  <div className="bg-slate-50 rounded-2xl border border-slate-100 p-5 mt-6">
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Direct Contact Info</h4>
                    <div className="space-y-4">
                      {listing.contact_phone && listing.contact_phone.trim() !== "" && (
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 flex-shrink-0">
                            <span className="material-icons text-sm">phone</span>
                          </div>
                          <a href={`tel:${listing.contact_phone}`} className="text-sm font-bold text-slate-700 hover:text-green-600 transition-colors">
                            {listing.contact_phone}
                          </a>
                        </div>
                      )}
                      
                      {listing.location && (
                        <div className={`pt-4 ${listing.contact_phone && listing.contact_phone.trim() !== "" ? 'border-t border-slate-200/60' : ''}`}>
                          <div className="flex items-start gap-3 mb-3">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0 mt-0.5">
                              <span className="material-icons text-sm">location_on</span>
                            </div>
                            <div className="text-sm font-bold text-slate-700 leading-snug">
                              {listing.location} {listing.postal_code ? `(${listing.postal_code})` : ''}
                            </div>
                          </div>
                          
                          {/* Mini Map embedded in the sidebar */}
                          <div 
                            style={{ width: mapWidth, height: mapHeight, maxWidth: '100%' }}
                            className="rounded-xl mx-auto overflow-hidden border border-slate-200 bg-slate-100 shadow-inner"
                          >
                            <iframe
                              src={`/map.html?q=${encodeURIComponent(listing.postal_code || listing.location)}`}
                              className="w-full h-full border-0"
                              title="Location Map"
                            ></iframe>
                          </div>
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

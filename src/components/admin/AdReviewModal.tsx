import React, { useState } from 'react';
import { formatPrice } from '@/constants';

interface AdReviewModalProps {
  listing: any;
  onClose: () => void;
  onApprove?: (listingId: number, approvalId?: number) => void;
  onReject?: (listingId: number, approvalId?: number, reason?: string) => void;
  isPendingApproval?: boolean;
}

export default function AdReviewModal({
  listing,
  onClose,
  onApprove,
  onReject,
  isPendingApproval = false,
}: AdReviewModalProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectInput, setShowRejectInput] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!listing) return null;

  // Extract all images
  let images: string[] = [];
  if (Array.isArray(listing.allImages) && listing.allImages.length > 0) {
    images = listing.allImages;
  } else if (listing.image) {
    if (listing.image.startsWith('[')) {
      try {
        const parsed = JSON.parse(listing.image);
        if (Array.isArray(parsed)) images = parsed;
      } catch {
        images = [listing.image];
      }
    } else {
      images = [listing.image];
    }
  }

  // Format Dates
  const formatDate = (dateStr: any) => {
    if (!dateStr) return 'N/A';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return 'N/A';
      return d.toLocaleDateString('en-CA', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return 'N/A';
    }
  };

  const adDate = formatDate(listing.created_at);
  const expiryDate = formatDate(listing.expires_at);

  const pendingStage = (listing.approval_stages || []).find((s: any) => s.status === 'pending');

  const handleApproveClick = async () => {
    if (!onApprove) return;
    setIsProcessing(true);
    try {
      await onApprove(listing.id, pendingStage?.id);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRejectClick = async () => {
    if (!onReject) return;
    setIsProcessing(true);
    try {
      await onReject(listing.id, pendingStage?.id, rejectReason);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden border border-slate-200 my-auto flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-3 min-w-0">
            <span className="material-icons text-primary text-2xl">pageview</span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-slate-800 truncate">Full Ad Review</h3>
                <span className="text-xs text-slate-400 font-mono font-bold">#{listing.id}</span>
              </div>
              <p className="text-xs text-slate-500 font-medium truncate">
                {listing.title || 'Untitled Advertisement'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={`/item/${listing.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 text-slate-700 hover:text-primary hover:border-primary/40 rounded-xl text-xs font-bold transition-all shadow-xs"
              title="Open ad in live view (new tab)"
            >
              <span className="material-icons text-sm">open_in_new</span>
              <span className="hidden sm:inline">Open in New Tab</span>
            </a>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors"
            >
              <span className="material-icons text-lg">close</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-6 space-y-6 flex-1">
          {/* Top Info Banner */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Gallery Column */}
            <div>
              <div className="relative aspect-4/3 w-full bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 shadow-inner flex items-center justify-center">
                {images.length > 0 ? (
                  <img
                    src={images[activeImageIndex] || images[0]}
                    alt={listing.title}
                    className="w-full h-full object-contain bg-slate-900/5"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-slate-400">
                    <span className="material-icons text-5xl mb-2">image_not_supported</span>
                    <span className="text-xs font-bold">No Photos Uploaded</span>
                  </div>
                )}
                {images.length > 1 && (
                  <div className="absolute bottom-3 right-3 bg-black/70 text-white text-[11px] font-bold px-2.5 py-1 rounded-full backdrop-blur-xs">
                    {activeImageIndex + 1} / {images.length}
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex items-center gap-2 mt-3 overflow-x-auto pb-2 scrollbar-thin">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                        activeImageIndex === idx
                          ? 'border-primary ring-2 ring-primary/20 scale-105'
                          : 'border-slate-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Details Column */}
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] uppercase font-black tracking-wider bg-slate-100 text-slate-600">
                    {listing.category || 'General'}
                  </span>
                  {listing.status === 'pending_approval' ? (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] uppercase font-black tracking-wider bg-amber-100 text-amber-700 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                      Pending Approval
                    </span>
                  ) : listing.status === 'rejected' ? (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] uppercase font-black tracking-wider bg-red-100 text-red-700">
                      Rejected
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] uppercase font-black tracking-wider bg-emerald-100 text-emerald-700">
                      Active
                    </span>
                  )}
                  {(listing.is_top_ad || listing.is_home_gallery || listing.is_featured) && (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] uppercase font-black tracking-wider bg-purple-100 text-purple-700">
                      Promoted
                    </span>
                  )}
                </div>
                <h2 className="text-xl font-black text-slate-900 leading-tight">
                  {listing.title}
                </h2>
                <div className="text-2xl font-black text-primary mt-2">
                  {formatPrice(listing.price, listing.price_type)}
                </div>
              </div>

              {/* Location Card */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2">
                <div className="flex items-start gap-2.5 text-xs">
                  <span className="material-icons text-base text-primary shrink-0 mt-0.5">location_on</span>
                  <div>
                    <span className="font-bold text-slate-800 block">
                      {listing.location || 'Location Not Specified'}
                    </span>
                    {(listing.city || listing.province || listing.postal_code) && (
                      <span className="text-slate-500 text-[11px] block mt-0.5">
                        {[listing.city, listing.province, listing.postal_code].filter(Boolean).join(', ')}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Dates & Timeline */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5">
                  <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-black uppercase tracking-wider mb-1">
                    <span className="material-icons text-sm">calendar_today</span>
                    <span>Ad Posted</span>
                  </div>
                  <div className="text-xs font-bold text-slate-700">{adDate}</div>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5">
                  <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-black uppercase tracking-wider mb-1">
                    <span className="material-icons text-sm">event_busy</span>
                    <span>Expires On</span>
                  </div>
                  <div className="text-xs font-bold text-slate-700">{expiryDate}</div>
                </div>
              </div>

              {/* Seller / Contact Info */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                  <span className="material-icons text-sm">person</span>
                  Seller Details
                </h4>
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Name:</span>
                    <span className="font-bold text-slate-800">
                      {listing.poster?.name || listing.poster_name || listing.seller_name || 'N/A'}
                    </span>
                  </div>
                  {(listing.contact_email || listing.poster?.email || listing.poster_email) && (
                    <div className="flex justify-between">
                      <span className="text-slate-500">Email:</span>
                      <a
                        href={`mailto:${listing.contact_email || listing.poster?.email || listing.poster_email}`}
                        className="font-bold text-primary hover:underline truncate max-w-[200px]"
                      >
                        {listing.contact_email || listing.poster?.email || listing.poster_email}
                      </a>
                    </div>
                  )}
                  {(listing.contact_phone || listing.poster?.phone || listing.seller_phone) && (
                    <div className="flex justify-between">
                      <span className="text-slate-500">Phone:</span>
                      <a
                        href={`tel:${listing.contact_phone || listing.poster?.phone || listing.seller_phone}`}
                        className="font-bold text-slate-800 hover:text-primary"
                      >
                        {listing.contact_phone || listing.poster?.phone || listing.seller_phone}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Ad Description Section */}
          <div className="bg-slate-50/70 border border-slate-200 rounded-2xl p-5">
            <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <span className="material-icons text-base text-slate-500">description</span>
              Full Description & Information
            </h4>
            <div className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-wrap font-medium">
              {listing.description ? (
                listing.description
              ) : (
                <span className="text-slate-400 italic">No description provided by poster.</span>
              )}
            </div>
          </div>

          {/* Pending Approval In-Modal Action Box */}
          {isPendingApproval && onApprove && onReject && (
            <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="material-icons text-amber-600">verified_user</span>
                  <span className="text-sm font-black text-amber-900">Moderation Decision</span>
                </div>
                <span className="text-xs font-bold text-amber-700">Stage: {pendingStage?.stage?.stage_name || 'Approval'}</span>
              </div>

              {showRejectInput ? (
                <div className="space-y-3 mt-3">
                  <textarea
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="Enter reason for rejection (this will be logged and can be emailed to the seller)..."
                    rows={2}
                    className="w-full px-3.5 py-2.5 bg-white border border-red-200 rounded-xl text-xs focus:ring-2 focus:ring-red-500 outline-none"
                  />
                  <div className="flex items-center gap-2 justify-end">
                    <button
                      type="button"
                      onClick={() => setShowRejectInput(false)}
                      className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-700 font-bold"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleRejectClick}
                      disabled={isProcessing}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-colors disabled:opacity-50"
                    >
                      Confirm Rejection
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleApproveClick}
                    disabled={isProcessing}
                    style={{ backgroundColor: '#27AE60' }}
                    className="flex-1 flex items-center justify-center gap-1.5 px-4 py-3 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:opacity-90 shadow-md transition-all disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <span className="material-icons text-sm animate-spin">sync</span>
                    ) : (
                      <span className="material-icons text-base">check_circle</span>
                    )}
                    Approve Advertisement
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowRejectInput(true)}
                    disabled={isProcessing}
                    className="flex-1 flex items-center justify-center gap-1.5 px-4 py-3 bg-red-50 hover:bg-red-500 text-red-600 hover:text-white border border-red-200 rounded-xl text-xs font-black uppercase tracking-widest transition-colors disabled:opacity-50"
                  >
                    <span className="material-icons text-base">cancel</span>
                    Reject Advertisement
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-400 font-medium">
            Reviewing Ad ID #{listing.id}
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-bold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

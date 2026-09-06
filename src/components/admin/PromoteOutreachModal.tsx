import React, { useState } from 'react';
import { useUI } from '@/components/UIProvider';

interface PromoteOutreachModalProps {
  listing: any;
  onClose: () => void;
}

export default function PromoteOutreachModal({
  listing,
  onClose,
}: PromoteOutreachModalProps) {
  const { showAlert } = useUI();

  const defaultEmail = listing.target_email || listing.contact_email || listing.poster?.email || listing.poster_email || '';
  const [recipientEmail, setRecipientEmail] = useState(defaultEmail);
  const [activeTab, setActiveTab] = useState<'promote' | 'custom'>('promote');
  const [isSending, setIsSending] = useState(false);

  // Promote Tab State
  const [promoteSubject, setPromoteSubject] = useState(
    `Boost your sales: Promote "${listing.title}" on HitAds.ca!`
  );
  const [promoteNote, setPromoteNote] = useState('');

  // Custom Message Tab State
  const [customSubject, setCustomSubject] = useState(
    `Important update regarding your HitAds listing "${listing.title}"`
  );
  const [customBody, setCustomBody] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('custom');

  const templates: Record<string, { subject: string; body: string }> = {
    custom: {
      subject: `Important update regarding your HitAds listing "${listing.title}"`,
      body: `Hello,\n\nWe are reaching out to you regarding your listing "${listing.title}" on HitAds.ca.\n\n`,
    },
    discount: {
      subject: `Special 25% Discount to Promote "${listing.title}" on HitAds.ca`,
      body: `Hello,\n\nWe noticed your advertisement "${listing.title}" is currently active on HitAds.ca! For a limited time, we'd like to offer you an exclusive 25% discount on our Top Ad and Homepage Gallery promotion packages to help you sell even faster.\n\nUse promo code BOOST25 when upgrading your listing.\n\nBest regards,\nThe HitAds Team`,
    },
    tips: {
      subject: `Quick Tips to Get More Buyers for "${listing.title}"`,
      body: `Hello,\n\nHere are three quick tips from the HitAds team to help you attract more serious local buyers:\n\n1. Ensure you have at least 3-5 clear, high-resolution photos in bright lighting.\n2. Include dimensions, condition, and any accessories in your description.\n3. Consider featuring or pinning your ad to the top of your category to multiply your views!\n\nBest regards,\nThe HitAds Team`,
    },
    renewal: {
      subject: `Renewal & Promotion Notice for "${listing.title}"`,
      body: `Hello,\n\nYour listing "${listing.title}" is nearing its expiration date. To keep your ad active and maintain your visibility among local buyers, please review your ad and consider choosing a featured promotion package.\n\nBest regards,\nThe HitAds Team`,
    },
  };

  const handleTemplateChange = (templateKey: string) => {
    setSelectedTemplate(templateKey);
    const tpl = templates[templateKey];
    if (tpl) {
      setCustomSubject(tpl.subject);
      setCustomBody(tpl.body);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!recipientEmail || !recipientEmail.includes('@')) {
      showAlert('Please provide a valid recipient email address', 'error');
      return;
    }

    setIsSending(true);
    try {
      const isPromote = activeTab === 'promote';
      const payload = {
        listing_id: listing.id,
        recipient_email: recipientEmail.trim(),
        outreach_type: isPromote ? 'promotion_offer' : 'custom_message',
        subject: isPromote ? promoteSubject.trim() : customSubject.trim(),
        message_body: isPromote ? promoteNote.trim() : customBody.trim(),
      };

      const res = await fetch('/api/admin/listings/send-promotion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        showAlert(`Promotion email sent successfully to ${recipientEmail}!`, 'success');
        onClose();
      } else {
        showAlert(data.message || 'Failed to send outreach email', 'error');
      }
    } catch (err: any) {
      showAlert('Network error sending email: ' + err.message, 'error');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden border border-slate-200 my-auto flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
              <span className="material-icons text-xl">campaign</span>
            </div>
            <div className="min-w-0">
              <h3 className="text-lg font-black text-slate-800 truncate">Promotional Outreach & Messaging</h3>
              <p className="text-xs text-slate-500 font-medium truncate">
                Ad #{listing.id}: {listing.title}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors"
          >
            <span className="material-icons text-lg">close</span>
          </button>
        </div>

        {/* Tab Selection */}
        <div className="grid grid-cols-2 p-1.5 mx-6 mt-5 bg-slate-100 rounded-2xl border border-slate-200 text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('promote')}
            className={`py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 ${
              activeTab === 'promote'
                ? 'bg-white text-primary shadow-xs font-black'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <span className="material-icons text-base">local_fire_department</span>
            <span>1. Promote Your Ad via Email</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('custom')}
            className={`py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 ${
              activeTab === 'custom'
                ? 'bg-white text-primary shadow-xs font-black'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <span className="material-icons text-base">forward_to_inbox</span>
            <span>2. Customized Message</span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSend} className="overflow-y-auto p-6 space-y-5 flex-1">
          {/* Recipient Email */}
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
              Recipient Email Address *
            </label>
            <div className="relative">
              <span className="material-icons absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-base">
                alternate_email
              </span>
              <input
                type="email"
                required
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
                placeholder="seller@example.com"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
              />
            </div>
            {!defaultEmail && (
              <p className="text-[11px] text-amber-600 mt-1 flex items-center gap-1">
                <span className="material-icons text-xs">info</span>
                No registered email found on this ad. Please enter the seller's email.
              </p>
            )}
          </div>

          {/* TAB 1: PROMOTE YOUR AD */}
          {activeTab === 'promote' && (
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
                  Email Subject
                </label>
                <input
                  type="text"
                  required
                  value={promoteSubject}
                  onChange={(e) => setPromoteSubject(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
                  Optional Admin Note or Promo Code (Appears inside the email)
                </label>
                <textarea
                  rows={2}
                  value={promoteNote}
                  onChange={(e) => setPromoteNote(e.target.value)}
                  placeholder="e.g. Special offer for this weekend: reply to this email for a free Top Ad extension!"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                />
              </div>

              {/* Visual Preview Box */}
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200/80 rounded-2xl p-4 text-xs">
                <div className="flex items-center gap-2 mb-2 font-black text-amber-900">
                  <span className="material-icons text-base text-amber-600">visibility</span>
                  <span>Email Content Highlights:</span>
                </div>
                <ul className="space-y-1.5 text-amber-800/90 list-disc list-inside">
                  <li>Features listing title <strong>"{listing.title}"</strong> and direct promotion link.</li>
                  <li>Highlights <strong>Top Ad</strong> (pin to top of search results for 10x visibility).</li>
                  <li>Highlights <strong>Homepage Gallery</strong> (spotlighted on HitAds homepage).</li>
                  <li>Highlights <strong>Featured Badge & Urgency Highlight</strong>.</li>
                  <li>Professional branded template with HitAds logo, colors, and Canada-wide footer.</li>
                </ul>
              </div>
            </div>
          )}

          {/* TAB 2: CUSTOMIZED MESSAGE */}
          {activeTab === 'custom' && (
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
                  Select a Quick Template (Optional)
                </label>
                <div className="relative">
                  <select
                    value={selectedTemplate}
                    onChange={(e) => handleTemplateChange(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  >
                    <option value="custom">Blank Custom Message</option>
                    <option value="discount">25% Promotion Discount Offer</option>
                    <option value="tips">Tips to Improve Views & Photos</option>
                    <option value="renewal">Ad Renewal & Expiration Notice</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
                  Subject Line *
                </label>
                <input
                  type="text"
                  required
                  value={customSubject}
                  onChange={(e) => setCustomSubject(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
                  Message Body *
                </label>
                <textarea
                  required
                  rows={6}
                  value={customBody}
                  onChange={(e) => setCustomBody(e.target.value)}
                  placeholder="Type your message to the seller..."
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs leading-relaxed font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                />
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSending}
              className="flex items-center gap-2 px-6 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-sm hover:shadow-md transition-all disabled:opacity-50"
            >
              {isSending ? (
                <>
                  <span className="material-icons text-sm animate-spin">sync</span>
                  <span>Sending Email...</span>
                </>
              ) : (
                <>
                  <span className="material-icons text-sm">send</span>
                  <span>Send {activeTab === 'promote' ? 'Promotion Offer' : 'Message'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

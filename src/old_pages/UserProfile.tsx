"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import MonerisPayModal from '../components/MonerisPayModal';
import { formatPrice } from '../constants';
import { useUI } from '../components/UIProvider';

const UserProfile: React.FC = () => {
  const navigate = useRouter();
  const { showAlert } = useUI();
  const [user, setUser] = useState<any>(null);
  const [userListings, setUserListings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<any>({ name: '', phone: '' });
  const [isPromoteModalOpen, setIsPromoteModalOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState<any>(null);
  const [promotionPricing, setPromotionPricing] = useState<any[]>([]);
  const [promotionData, setPromotionData] = useState({
    is_top_ad: false,
    is_highlighted: false,
    is_urgent: false,
    is_home_gallery: false,
    top_ad_duration: 7,
    highlighted_duration: 7,
    urgent_duration: 7,
    home_gallery_duration: 7
  });

  // Moneris payment state
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [payTicket, setPayTicket] = useState('');
  const [payAmount, setPayAmount] = useState(0);
  const [payEnvironment, setPayEnvironment] = useState('qa');
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<'listings' | 'messages'>('listings');
  const [messages, setMessages] = useState<any[]>([]);
  const [isMessagesLoading, setIsMessagesLoading] = useState(false);
  const [listingToDelete, setListingToDelete] = useState<string | null>(null);
  const [listingToEdit, setListingToEdit] = useState<string | null>(null);
  
  const [replyText, setReplyText] = useState("");
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [isSendingReply, setIsSendingReply] = useState(false);

  const threads = React.useMemo(() => {
    if (!user) return [];
    const map = new Map<string, any>();
    messages.forEach(msg => {
      const isSender = msg.sender_id === user.id;
      const otherUserId = isSender ? msg.receiver_id : msg.sender_id;
      const otherUserName = isSender ? (msg.receiver_name_db || "User") : (msg.sender_name_db || msg.sender_name || "User");
      const otherUserEmail = isSender ? msg.receiver_email : msg.sender_email;
      
      const threadId = `${msg.listing_id}_${otherUserId}`;
      if (!map.has(threadId)) {
        let parsedImage = msg.listing_image;
        if (parsedImage) {
          try {
            const arr = JSON.parse(parsedImage);
            if (Array.isArray(arr) && arr.length > 0) {
              parsedImage = arr[0];
            }
          } catch (e) {
            // Not JSON, keep original
          }
        }

        map.set(threadId, {
          threadId,
          listing_id: msg.listing_id,
          listing_title: msg.listing_title,
          listing_image: parsedImage,
          otherUserId,
          otherUserName,
          otherUserEmail,
          messages: []
        });
      }
      map.get(threadId).messages.push(msg);
    });
    
    return Array.from(map.values()).sort((a, b) => {
      const aLast = new Date(a.messages[a.messages.length - 1].created_at).getTime();
      const bLast = new Date(b.messages[b.messages.length - 1].created_at).getTime();
      return bLast - aLast;
    });
  }, [messages, user]);

  const activeThread = activeThreadId ? threads.find(t => t.threadId === activeThreadId) : null;

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      navigate.push('/login');
      return;
    }
    const userData = JSON.parse(userStr);
    setUser(userData);
    setEditData({ name: userData.name || '', phone: userData.phone || '' });

    // Fetch this user's listings (including pending/rejected)
    fetch(`/api/listings/read?user_id=${userData.id}`)
      .then(res => res.json())
      .then(data => {
        const myListings = Array.isArray(data) ? data : [];
        setUserListings(myListings);
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));

    // Fetch user messages
    setIsMessagesLoading(true);
    fetch(`/api/messages/read_user?user_id=${userData.id}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setMessages(data);
      })
      .catch(console.error)
      .finally(() => setIsMessagesLoading(false));
  }, []);

  useEffect(() => {
    fetch('/api/promotions/pricing')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          setPromotionPricing(data.data);
          setPromotionData((prev) => {
            const getValidDuration = (type: string, currentDuration: number) => {
              const opts = data.data.filter((p: any) => p.promotion_type?.toLowerCase().replace(/\s+/g, '_') === type.toLowerCase().replace(/\s+/g, '_'));
              if (opts.length > 0) {
                const match = opts.find((p: any) => Number(p.duration_days) === Number(currentDuration));
                if (match) return Number(match.duration_days);
                return Number(opts[0].duration_days);
              }
              return currentDuration;
            };

            return {
              ...prev,
              top_ad_duration: getValidDuration('top_ad', prev.top_ad_duration),
              highlighted_duration: getValidDuration('highlighted', prev.highlighted_duration),
              urgent_duration: getValidDuration('urgent', prev.urgent_duration),
              home_gallery_duration: getValidDuration('home_gallery', prev.home_gallery_duration),
            };
          });
        }
      })
      .catch(console.error);
  }, []);

  const getPromotionOptions = (type: string, fallbackPrice: number) => {
    const normType = type.toLowerCase().replace(/\s+/g, '_');
    const opts = promotionPricing.filter(
      (p: any) => p.promotion_type?.toLowerCase().replace(/\s+/g, '_') === normType
    );
    if (opts.length > 0) return opts;
    return [{ duration_days: 7, price: fallbackPrice }];
  };

  const calculatePromoPrice = (type: string, duration: number, fallbackPrice: number) => {
    const opts = getPromotionOptions(type, fallbackPrice);
    const match = opts.find((p: any) => Number(p.duration_days) === Number(duration));
    if (match) return Number(match.price);
    return Number(opts[0]?.price || fallbackPrice);
  };

  const getPromotionSubtotal = () => {
    let subtotal = 0;
    if (promotionData.is_top_ad) {
      subtotal += calculatePromoPrice('top_ad', promotionData.top_ad_duration, 9.99);
    }
    if (promotionData.is_highlighted) {
      subtotal += calculatePromoPrice('highlighted', promotionData.highlighted_duration, 4.99);
    }
    if (promotionData.is_urgent) {
      subtotal += calculatePromoPrice('urgent', promotionData.urgent_duration, 5.99);
    }
    if (promotionData.is_home_gallery) {
      subtotal += calculatePromoPrice('home_gallery', promotionData.home_gallery_duration, 14.99);
    }
    return Math.round(subtotal * 100) / 100;
  };

  const getPromotionTax = () => {
    const subtotal = getPromotionSubtotal();
    return Math.round(subtotal * 0.13 * 100) / 100;
  };

  const getTotalPromotionCost = () => {
    const subtotal = getPromotionSubtotal();
    const tax = getPromotionTax();
    return Math.round((subtotal + tax) * 100) / 100;
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate client-side
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      showAlert('Please select a JPG, PNG, GIF, or WebP image.', 'error');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showAlert('Image must be under 5MB.', 'error');
      return;
    }

    setIsUploadingAvatar(true);
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      formData.append('user_id', user.id.toString());

      const response = await fetch('/api/users/upload-avatar', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();

      if (data.success) {
        const updatedUser = { ...user, ...data.user };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        window.dispatchEvent(new Event('auth_updated'));
      } else {
        showAlert(data.message || 'Failed to upload avatar', 'error');
      }
    } catch (err) {
      console.error(err);
      showAlert('Error uploading avatar', 'error');
    } finally {
      setIsUploadingAvatar(false);
      // Reset input so the same file can be selected again
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/users/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: user.id,
          name: editData.name,
          email: user.email,
          phone: editData.phone
        }),
      });
      const data = await response.json();
      if (data.success) {
        // Update local storage and state
        const updatedUser = { ...user, ...data.user };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        setIsEditing(false);
        // Sync app state if needed
        window.dispatchEvent(new Event('auth_updated'));
      } else {
        showAlert(data.message || 'Failed to update profile', 'error');
      }
    } catch (err) {
      console.error(err);
      showAlert('Error updating profile', 'error');
    }
  };

  const openPromoteModal = (listing: any) => {
    setSelectedListing(listing);
    
    const getDefaultDuration = (type: string, fallback: number) => {
      const opts = getPromotionOptions(type, fallback);
      return opts.length > 0 ? Number(opts[0].duration_days) : fallback;
    };

    setPromotionData({
      is_top_ad: !!listing.is_top_ad,
      is_highlighted: !!listing.is_highlighted,
      is_urgent: !!listing.is_urgent,
      is_home_gallery: !!listing.is_home_gallery,
      top_ad_duration: getDefaultDuration('top_ad', 7),
      highlighted_duration: getDefaultDuration('highlighted', 7),
      urgent_duration: getDefaultDuration('urgent', 7),
      home_gallery_duration: getDefaultDuration('home_gallery', 7),
    });
    setIsPromoteModalOpen(true);
  };

  const handlePromoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const total = getTotalPromotionCost();

    if (total === 0) {
      showAlert("Please select at least one promotion option.", "error");
      return;
    }

    try {
      const response = await fetch('/api/payments/preload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listing_id: selectedListing.id,
          user_id: user.id,
          ...promotionData
        }),
      });

      const data = await response.json();
      if (data.success) {
        setPayTicket(data.ticket);
        setPayAmount(data.amount);
        setPayEnvironment(data.environment || 'qa');
        setIsPromoteModalOpen(false);
        setIsPayModalOpen(true);
      } else {
        showAlert(data.message || 'Failed to initialize payment process.', 'error');
      }
    } catch (err) {
      console.error(err);
      showAlert('Error connecting to the payment server. Please try again.', 'error');
    }
  };

  const handlePaymentSuccess = (receiptId: string) => {
    setIsPayModalOpen(false);
    showAlert('Payment complete! Your promotions are now active. Receipt: ' + receiptId, 'success');
    
    // Update local listings state
    setUserListings(userListings.map(l => 
      l.id === selectedListing.id 
        ? { ...l, ...promotionData } 
        : l
    ));
  };

  const handlePaymentCancel = () => {
    setIsPayModalOpen(false);
    setIsPromoteModalOpen(true);
  };

  const handleDeleteListing = (listingId: string) => {
    setListingToDelete(listingId);
  };

  const confirmDeleteListing = async () => {
    if (!listingToDelete) return;
    
    try {
      const response = await fetch(`/api/listings/delete`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: listingToDelete })
      });
      const data = await response.json();
      if (data.success) {
        setUserListings(userListings.filter(l => l.id !== listingToDelete));
        showAlert("Ad removed! It's no longer visible.", "success");
      } else {
        showAlert(data.message || "Failed to delete ad.", "error");
      }
    } catch (err) {
      console.error(err);
      showAlert("Error deleting ad.", "error");
    } finally {
      setListingToDelete(null);
    }
  };

  const handleSendReply = async () => {
    if (!replyText.trim() || !activeThread) return;
    setIsSendingReply(true);
    try {
      const response = await fetch('/api/messages/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listing_id: activeThread.listing_id,
          message: replyText,
          sender_id: user.id,
          sender_name: user.name,
          receiver_id: activeThread.otherUserId
        })
      });
      const data = await response.json();
      if (data.success) {
        showAlert("Reply sent! They'll see it right away.", "success");
        setReplyText("");
        // Optimistically reload messages
        fetch(`/api/messages/read_user?user_id=${user.id}`)
          .then(res => res.json())
          .then(resData => {
            if (Array.isArray(resData)) setMessages(resData);
          });
      } else {
        showAlert(data.message || "Failed to send reply.", "error");
      }
    } catch (err) {
      console.error(err);
      showAlert("Error sending reply.", "error");
    } finally {
      setIsSendingReply(false);
    }
  };

  const handleThreadClick = async (thread: any) => {
    setActiveThreadId(thread.threadId);
    setReplyText("");
    
    // Check if there are any unread messages for me
    const hasUnread = thread.messages.some((m: any) => !m.is_read && Number(m.receiver_id) === Number(user.id));
    if (hasUnread) {
      // Optimistically update local state
      const updatedMessages = messages.map(m => {
        if (m.listing_id === thread.listing_id && m.sender_id === thread.otherUserId && Number(m.receiver_id) === Number(user.id)) {
          return { ...m, is_read: true };
        }
        return m;
      });
      setMessages(updatedMessages);

      // Tell backend
      fetch('/api/messages/mark_read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listing_id: thread.listing_id,
          sender_id: thread.otherUserId,
          receiver_id: user.id
        })
      }).catch(console.error);
    }
  };

  if (!user) return null;

  const avatarInitials = user.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) || 'U';
  const joinDate = user.join_date ? new Date(user.join_date).toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A';

  return (
    <div className="w-full px-4 sm:px-6 lg:px-10 py-12">
      {/* Profile Header Card */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden mb-8">
        {/* Banner */}
        <div className="h-32 bg-gradient-to-r from-primary/80 to-primary-light relative">
          <div className="absolute inset-0 opacity-20" style={{backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px'}}></div>
        </div>

        <div className="px-8 pb-8">
          {/* Avatar with upload */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp"
            className="hidden"
            onChange={handleAvatarUpload}
          />
          <div className="-mt-12 mb-4 flex justify-between items-end">
            <div
              onClick={() => fileInputRef.current?.click()}
              className="w-24 h-24 rounded-[1.5rem] bg-primary flex items-center justify-center text-white text-3xl font-black border-4 border-white shadow-xl relative group cursor-pointer overflow-hidden"
            >
              {user.avatar ? (
                <img src={user.avatar.startsWith('/uploads') ? `/api${user.avatar}` : user.avatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                avatarInitials
              )}
              {/* Camera overlay */}
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                {isUploadingAvatar ? (
                  <div className="w-8 h-8 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <span className="material-icons text-white text-2xl">photo_camera</span>
                )}
              </div>
            </div>
            {user.isAdmin && (
              <span className="inline-flex items-center gap-1.5 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full">
                <span className="material-icons text-sm">admin_panel_settings</span>
                Admin
              </span>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-black text-slate-900 mb-1">{user.name}</h1>
              <p className="text-sm text-slate-500 font-medium">{user.email}</p>
              {user.phone && <p className="text-sm text-slate-500 font-medium">{user.phone}</p>}
            </div>
            <div className="flex flex-wrap gap-2.5 self-start sm:self-auto">
              <Link
                href="/payment-portal"
                className="bg-primary/10 hover:bg-primary/20 text-primary px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span className="material-icons text-sm">receipt_long</span>
                Payment Receipts & Invoices
              </Link>
              <button
                onClick={() => {
                  setEditData({ name: user.name || '', phone: user.phone || '' });
                  setIsEditing(true);
                }}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all"
              >
                <span className="material-icons text-sm">edit</span>
                Edit Profile
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-50 rounded-2xl p-4">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Member Since</p>
              <p className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <span className="material-icons text-primary text-base">calendar_today</span>
                {joinDate}
              </p>
            </div>
            <div className="bg-slate-50 rounded-2xl p-4">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Active Listings</p>
              <p className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <span className="material-icons text-primary text-base">inventory_2</span>
                {isLoading ? '...' : userListings.length}
              </p>
            </div>
            <div className="bg-slate-50 rounded-2xl p-4">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Account Role</p>
              <p className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <span className="material-icons text-primary text-base">verified_user</span>
                {user.role || (user.isAdmin ? 'Admin' : 'User')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex gap-8 mb-8 border-b border-slate-100 px-4">
        <button 
          onClick={() => setActiveTab('listings')}
          className={`pb-4 text-sm font-black uppercase tracking-widest transition-all relative ${activeTab === 'listings' ? 'text-primary' : 'text-slate-400 hover:text-slate-600'}`}
        >
          My Listings ({userListings.length})
          {activeTab === 'listings' && <div className="absolute bottom-0 left-0 w-full h-1 bg-primary rounded-full"></div>}
        </button>
        <button 
          onClick={() => setActiveTab('messages')}
          className={`pb-4 text-sm font-black uppercase tracking-widest transition-all relative ${activeTab === 'messages' ? 'text-primary' : 'text-slate-400 hover:text-slate-600'}`}
        >
          Inquiries ({messages.length})
          {activeTab === 'messages' && <div className="absolute bottom-0 left-0 w-full h-1 bg-primary rounded-full"></div>}
        </button>
      </div>

      {/* My Listings Content */}
      {activeTab === 'listings' && (
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-black text-slate-900">My Listings</h2>
          <Link href="/post-ad" className="bg-primary hover:bg-primary-hover text-white px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest flex items-center gap-2 transition-all shadow-md shadow-primary/20">
            <span className="material-icons text-sm">add</span>
            Post New
          </Link>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : userListings.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-4">
              <span className="material-icons text-slate-300 text-4xl">inventory_2</span>
            </div>
            <h3 className="text-lg font-black text-slate-700 mb-2">No Listings Yet</h3>
            <p className="text-sm text-slate-400 font-medium mb-6">You haven't posted any ads yet. Start selling today!</p>
            <Link href="/post-ad" className="bg-primary text-white px-8 py-3 rounded-2xl font-black text-sm shadow-lg shadow-primary/25 hover:bg-primary-hover transition-all inline-block">
              Post Your First Ad
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            {userListings.map((listing: any) => (
              <div key={listing.id} className="group bg-white rounded-2xl overflow-hidden hover:shadow-lg transition-all border border-slate-100 flex flex-col sm:flex-row">
                
                {/* Image Section */}
                <Link href={`/item/${listing.id}`} className="block w-full sm:w-72 h-48 sm:h-auto relative shrink-0 overflow-hidden bg-slate-100">
                  <img
                    src={listing.image || 'https://picsum.photos/seed/listing/800/600'}
                    alt={listing.title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </Link>

                {/* Details Section */}
                <div className="flex flex-col flex-1">
                  <Link href={`/item/${listing.id}`} className="p-6 flex-1 flex flex-col justify-center">
                    {/* Status Badge */}
                    {listing.status === 'pending_approval' && (
                      <div className="flex items-center gap-1.5 mb-2">
                        <span className="flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-600 border border-amber-200 rounded-lg text-[10px] font-black uppercase tracking-widest">
                          <span className="material-icons text-xs">schedule</span> Pending Approval
                        </span>
                      </div>
                    )}
                    {listing.status === 'rejected' && (
                      <div className="mb-2">
                        <span className="flex items-center gap-1 px-2.5 py-1 bg-red-50 text-red-600 border border-red-200 rounded-lg text-[10px] font-black uppercase tracking-widest w-fit">
                          <span className="material-icons text-xs">cancel</span> Rejected
                        </span>
                        {listing.rejection_reason && (
                          <p className="text-xs text-red-400 mt-1 italic">Reason: {listing.rejection_reason}</p>
                        )}
                      </div>
                    )}
                    <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">{listing.category}</p>
                    <h3 className="text-xl font-black text-slate-800 mb-2 line-clamp-2 leading-tight">{listing.title}</h3>
                    <p className="text-2xl font-black text-slate-900 mb-3">{formatPrice(listing.price, listing.price_type)}</p>
                    <p className="text-xs text-slate-400 font-bold flex items-center gap-1 mt-auto">
                      <span className="material-icons text-sm">location_on</span>
                      {listing.location}
                    </p>
                  </Link>
                </div>
                
                {/* Promotions Section */}
                <div className="w-full sm:w-80 border-t sm:border-t-0 sm:border-l border-slate-100 bg-slate-50/50 p-6 flex flex-col">
                  <div className="mb-3">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ad Promotions</p>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded border ${listing.is_top_ad ? 'bg-amber-100 text-amber-700 border-amber-200 shadow-sm' : 'bg-white text-slate-400 border-slate-200 grayscale opacity-60'}`}>Top Ad</span>
                    <span className={`text-[10px] font-bold px-2 py-1 rounded border ${listing.is_highlighted ? 'bg-yellow-100 text-yellow-700 border-yellow-200 shadow-sm' : 'bg-white text-slate-400 border-slate-200 grayscale opacity-60'}`}>Highlighted</span>
                    <span className={`text-[10px] font-bold px-2 py-1 rounded border ${listing.is_urgent ? 'bg-red-100 text-red-700 border-red-200 shadow-sm' : 'bg-white text-slate-400 border-slate-200 grayscale opacity-60'}`}>Urgent</span>
                    <span className={`text-[10px] font-bold px-2 py-1 rounded border ${listing.is_home_gallery ? 'bg-blue-100 text-blue-700 border-blue-200 shadow-sm' : 'bg-white text-slate-400 border-slate-200 grayscale opacity-60'}`}>Home Page</span>
                  </div>
                  {listing.promotion_expires_at && (listing.is_top_ad || listing.is_highlighted || listing.is_urgent || listing.is_home_gallery) && (
                    <p className="text-[10px] font-bold text-slate-500 mb-4 flex items-center gap-1">
                      <span className="material-icons text-[12px] text-blue-600">schedule</span>
                      Home/Ad Promotion Expiration: {new Date(listing.promotion_expires_at).toLocaleDateString('en-CA', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </p>
                  )}
                  <button onClick={() => openPromoteModal(listing)} className="w-full bg-primary hover:bg-primary-hover text-white text-[11px] font-black uppercase tracking-widest py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary/25 mt-auto hover:-translate-y-0.5">
                    <span className="material-icons text-base">campaign</span>
                    Promote Ad
                  </button>
                  <button onClick={() => setListingToEdit(listing.id)} className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-black uppercase tracking-widest py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all mt-3 text-center border border-slate-200/60 shadow-sm">
                    <span className="material-icons text-base">edit</span>
                    Edit Ad
                  </button>
                  <button onClick={() => handleDeleteListing(listing.id)} className="w-full bg-red-50 hover:bg-red-100 text-red-600 text-[11px] font-black uppercase tracking-widest py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all mt-3 text-center border border-red-200/60 shadow-sm">
                    <span className="material-icons text-base">delete</span>
                    Delete Ad
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
      )}

      {/* Messages Content */}
      {activeTab === 'messages' && (
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-0 overflow-hidden flex flex-col md:flex-row min-h-[600px]">
        {/* Left Side: Thread List */}
        <div className="w-full md:w-1/3 border-b md:border-b-0 md:border-r border-slate-100 flex flex-col bg-slate-50/50">
          <div className="p-6 border-b border-slate-100 bg-white">
            <h2 className="text-xl font-black text-slate-900">Chats</h2>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-2 max-h-[500px]">
            {isMessagesLoading ? (
              <div className="flex justify-center py-8">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : threads.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <span className="material-icons text-slate-300">forum</span>
                </div>
                <p className="text-sm text-slate-500 font-medium">No messages yet.</p>
              </div>
            ) : (
              threads.map(thread => {
                const latestMsg = thread.messages[thread.messages.length - 1];
                const isActive = activeThreadId === thread.threadId;
                const hasUnread = thread.messages.some((m: any) => !m.is_read && Number(m.receiver_id) === Number(user.id));
                return (
                  <button 
                    key={thread.threadId}
                    onClick={() => handleThreadClick(thread)}
                    className={`w-full text-left p-4 rounded-2xl transition-all relative ${isActive ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-white hover:bg-slate-50 border border-slate-100'}`}
                  >
                    {hasUnread && !isActive && (
                      <span className="absolute top-4 right-4 w-2.5 h-2.5 bg-red-500 rounded-full shadow-sm"></span>
                    )}
                    <div className="flex justify-between items-start mb-2">
                      <p className={`text-sm font-black truncate pr-2 ${isActive ? 'text-white' : 'text-slate-800'}`}>
                        {thread.otherUserName}
                      </p>
                      <span className={`text-[10px] font-bold uppercase tracking-wider shrink-0 ${hasUnread && !isActive ? 'text-red-500 mr-3' : (isActive ? 'text-primary-100' : 'text-slate-400')}`}>
                        {new Date(latestMsg.created_at).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})}
                      </span>
                    </div>
                    <p className={`text-xs font-medium truncate mb-1 ${isActive ? 'text-primary-100' : 'text-primary'}`}>
                      Ad: {thread.listing_title}
                    </p>
                    <p className={`text-xs truncate ${isActive ? 'text-primary-50' : (hasUnread ? 'text-slate-800 font-bold' : 'text-slate-500')}`}>
                      {latestMsg.sender_id === user.id ? 'You: ' : ''}{latestMsg.message}
                    </p>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Side: Chat History */}
        <div className="w-full md:w-2/3 flex flex-col bg-slate-50">
          {activeThread ? (
            <>
              {/* Chat Header */}
              <div className="p-6 bg-white border-b border-slate-100 flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-black text-slate-900">{activeThread.otherUserName}</h3>
                  <p className="text-xs text-slate-500 font-medium">{activeThread.otherUserEmail}</p>
                </div>
                <Link href={`/item/${activeThread.listing_id}`} className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100 px-3 py-2 rounded-xl transition-colors border border-slate-100">
                  {activeThread.listing_image && (
                     <img src={activeThread.listing_image.startsWith('/uploads') ? `/api${activeThread.listing_image}` : activeThread.listing_image} alt="" className="w-8 h-8 rounded-lg object-cover" />
                  )}
                  <div className="text-right hidden sm:block max-w-[120px]">
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Regarding Ad</p>
                    <p className="text-xs font-black text-slate-700 truncate">{activeThread.listing_title}</p>
                  </div>
                </Link>
              </div>
              
              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 max-h-[400px]">
                {activeThread.messages.map((msg: any) => {
                  const isMe = msg.sender_id === user.id;
                  return (
                    <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[75%] rounded-2xl p-4 ${isMe ? 'bg-primary text-white rounded-br-sm' : 'bg-white border border-slate-100 text-slate-800 rounded-bl-sm shadow-sm'}`}>
                        <p className="text-sm">{msg.message}</p>
                        <div className={`text-[9px] flex items-center justify-${isMe ? 'end' : 'start'} gap-1 font-bold uppercase tracking-widest mt-2 ${isMe ? 'text-primary-200' : 'text-slate-400'}`}>
                          {new Date(msg.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          {isMe && (
                            <span className="material-icons text-[12px]" title={msg.is_read ? "Read" : "Delivered"}>
                              {msg.is_read ? 'done_all' : 'check'}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {/* Reply Area */}
              <div className="p-4 bg-white border-t border-slate-100">
                <div className="flex gap-2 items-end">
                  <textarea 
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className="flex-1 text-sm rounded-2xl border-slate-200 focus:ring-primary focus:border-primary resize-none p-3" 
                    placeholder="Type your message..." 
                    rows={2}
                  ></textarea>
                  <button 
                    onClick={handleSendReply}
                    disabled={isSendingReply || !replyText.trim()}
                    className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center hover:bg-primary-hover shadow-lg shadow-primary/20 transition-all disabled:opacity-50 shrink-0"
                  >
                    <span className="material-icons">{isSendingReply ? 'sync' : 'send'}</span>
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-slate-400">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm border border-slate-100">
                <span className="material-icons text-5xl text-slate-200">chat</span>
              </div>
              <p className="text-lg font-bold text-slate-600 mb-1">Select a conversation</p>
              <p className="text-sm">Choose a thread from the left to view the chat history.</p>
            </div>
          )}
        </div>
      </div>
      )}

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black">Edit Profile</h3>
              <button onClick={() => setIsEditing(false)} className="text-slate-400 hover:text-slate-600">
                <span className="material-icons">close</span>
              </button>
            </div>
            {/* Avatar change in modal */}
            <div className="flex justify-center mb-6">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-20 h-20 rounded-2xl bg-primary flex items-center justify-center text-white text-2xl font-black relative group cursor-pointer overflow-hidden shadow-lg"
              >
                {user.avatar ? (
                  <img src={user.avatar.startsWith('/uploads') ? `/api${user.avatar}` : user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  avatarInitials
                )}
                <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="material-icons text-white text-lg">photo_camera</span>
                  <span className="text-white text-[8px] font-bold uppercase tracking-wider mt-0.5">Change</span>
                </div>
              </div>
            </div>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Name</label>
                <input
                  type="text"
                  required
                  value={editData.name}
                  onChange={e => setEditData({...editData, name: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border-slate-100 rounded-xl focus:ring-primary text-sm"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Email (Cannot be changed)</label>
                <input
                  type="email"
                  disabled
                  value={user.email}
                  className="w-full px-4 py-3 bg-slate-100 border-slate-200 text-slate-400 rounded-xl text-sm cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Phone</label>
                <input
                  type="text"
                  value={editData.phone}
                  onChange={e => setEditData({...editData, phone: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border-slate-100 rounded-xl focus:ring-primary text-sm"
                />
              </div>
              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="flex-1 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-sm transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-primary hover:bg-primary-hover text-white font-bold rounded-xl text-sm transition-colors shadow-lg shadow-primary/20"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Promote Modal */}
      {isPromoteModalOpen && selectedListing && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black">Upgrade Ad</h3>
              <button onClick={() => setIsPromoteModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <span className="material-icons">close</span>
              </button>
            </div>
            <div className="mb-6">
              <p className="text-sm font-bold text-slate-700">{selectedListing.title}</p>
              <p className="text-xs text-slate-500">Select promotions to make your ad stand out.</p>
            </div>
            <form onSubmit={handlePromoteSubmit} className="space-y-4">
              {/* Top Ad */}
              <div className={`p-4 border rounded-xl transition-colors ${promotionData.is_top_ad ? 'border-amber-300 bg-amber-50/40' : 'border-slate-200 hover:bg-slate-50'}`}>
                <div className="flex items-center justify-between gap-3">
                  <label className="flex items-center gap-3 cursor-pointer flex-1 min-w-0">
                    <input 
                      type="checkbox" 
                      checked={promotionData.is_top_ad} 
                      onChange={e => setPromotionData({...promotionData, is_top_ad: e.target.checked})}
                      className="w-5 h-5 text-amber-600 rounded border-slate-300 focus:ring-amber-500 shrink-0 cursor-pointer"
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                        <span>Top Ad</span>
                        <span className="text-[10px] font-black bg-amber-100 text-amber-800 px-2 py-0.5 rounded">
                          ${calculatePromoPrice('top_ad', promotionData.top_ad_duration, 9.99).toFixed(2)}
                        </span>
                      </p>
                      <p className="text-[10px] text-slate-500">Appears at the very top of search results.</p>
                    </div>
                  </label>
                  <div className="shrink-0">
                    <select 
                      value={promotionData.top_ad_duration}
                      onChange={e => setPromotionData({ ...promotionData, top_ad_duration: Number(e.target.value) })}
                      className="text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none shadow-xs cursor-pointer"
                    >
                      {getPromotionOptions('top_ad', 9.99).map((opt: any) => (
                        <option key={opt.duration_days} value={opt.duration_days}>
                          {opt.duration_days} Days (${Number(opt.price).toFixed(2)})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              
              {/* Highlighted */}
              <div className={`p-4 border rounded-xl transition-colors ${promotionData.is_highlighted ? 'border-yellow-300 bg-yellow-50/40' : 'border-slate-200 hover:bg-slate-50'}`}>
                <div className="flex items-center justify-between gap-3">
                  <label className="flex items-center gap-3 cursor-pointer flex-1 min-w-0">
                    <input 
                      type="checkbox" 
                      checked={promotionData.is_highlighted} 
                      onChange={e => setPromotionData({...promotionData, is_highlighted: e.target.checked})}
                      className="w-5 h-5 text-yellow-500 rounded border-slate-300 focus:ring-yellow-500 shrink-0 cursor-pointer"
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                        <span>Highlighted</span>
                        <span className="text-[10px] font-black bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">
                          ${calculatePromoPrice('highlighted', promotionData.highlighted_duration, 4.99).toFixed(2)}
                        </span>
                      </p>
                      <p className="text-[10px] text-slate-500">Ad stands out with a bright highlighted background.</p>
                    </div>
                  </label>
                  <div className="shrink-0">
                    <select 
                      value={promotionData.highlighted_duration}
                      onChange={e => setPromotionData({ ...promotionData, highlighted_duration: Number(e.target.value) })}
                      className="text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none shadow-xs cursor-pointer"
                    >
                      {getPromotionOptions('highlighted', 4.99).map((opt: any) => (
                        <option key={opt.duration_days} value={opt.duration_days}>
                          {opt.duration_days} Days (${Number(opt.price).toFixed(2)})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Urgent */}
              <div className={`p-4 border rounded-xl transition-colors ${promotionData.is_urgent ? 'border-red-300 bg-red-50/40' : 'border-slate-200 hover:bg-slate-50'}`}>
                <div className="flex items-center justify-between gap-3">
                  <label className="flex items-center gap-3 cursor-pointer flex-1 min-w-0">
                    <input 
                      type="checkbox" 
                      checked={promotionData.is_urgent} 
                      onChange={e => setPromotionData({...promotionData, is_urgent: e.target.checked})}
                      className="w-5 h-5 text-red-500 rounded border-slate-300 focus:ring-red-500 shrink-0 cursor-pointer"
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                        <span>Urgent</span>
                        <span className="text-[10px] font-black bg-red-100 text-red-800 px-2 py-0.5 rounded">
                          ${calculatePromoPrice('urgent', promotionData.urgent_duration, 5.99).toFixed(2)}
                        </span>
                      </p>
                      <p className="text-[10px] text-slate-500">Mark as urgent to sell faster.</p>
                    </div>
                  </label>
                  <div className="shrink-0">
                    <select 
                      value={promotionData.urgent_duration}
                      onChange={e => setPromotionData({ ...promotionData, urgent_duration: Number(e.target.value) })}
                      className="text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none shadow-xs cursor-pointer"
                    >
                      {getPromotionOptions('urgent', 5.99).map((opt: any) => (
                        <option key={opt.duration_days} value={opt.duration_days}>
                          {opt.duration_days} Days (${Number(opt.price).toFixed(2)})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Home Gallery */}
              <div className={`p-4 border rounded-xl transition-colors ${promotionData.is_home_gallery ? 'border-blue-300 bg-blue-50/40' : 'border-slate-200 hover:bg-slate-50'}`}>
                <div className="flex items-center justify-between gap-3">
                  <label className="flex items-center gap-3 cursor-pointer flex-1 min-w-0">
                    <input 
                      type="checkbox" 
                      checked={promotionData.is_home_gallery} 
                      onChange={e => setPromotionData({...promotionData, is_home_gallery: e.target.checked})}
                      className="w-5 h-5 text-blue-500 rounded border-slate-300 focus:ring-blue-500 shrink-0 cursor-pointer"
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                        <span>Home Page</span>
                        <span className="text-[10px] font-black bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                          ${calculatePromoPrice('home_gallery', promotionData.home_gallery_duration, 14.99).toFixed(2)}
                        </span>
                      </p>
                      <p className="text-[10px] text-slate-500">Showcase your ad on the homepage gallery.</p>
                    </div>
                  </label>
                  <div className="shrink-0">
                    <select 
                      value={promotionData.home_gallery_duration}
                      onChange={e => setPromotionData({ ...promotionData, home_gallery_duration: Number(e.target.value) })}
                      className="text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none shadow-xs cursor-pointer"
                    >
                      {getPromotionOptions('home_gallery', 14.99).map((opt: any) => (
                        <option key={opt.duration_days} value={opt.duration_days}>
                          {opt.duration_days} Days (${Number(opt.price).toFixed(2)})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {getPromotionSubtotal() > 0 && (
                <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 space-y-2 text-xs">
                  <div className="flex justify-between items-center text-slate-600 font-medium">
                    <span>Subtotal</span>
                    <span className="font-bold text-slate-800">${getPromotionSubtotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-600 font-medium">
                    <span>Tax (13%)</span>
                    <span className="font-bold text-slate-800">${getPromotionTax().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-900 font-black pt-2 border-t border-slate-200">
                    <span>Total Amount</span>
                    <span className="text-sm text-primary font-black">${getTotalPromotionCost().toFixed(2)}</span>
                  </div>
                </div>
              )}

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsPromoteModalOpen(false)}
                  className="flex-1 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-sm transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-primary hover:bg-primary-hover text-white font-bold rounded-xl text-sm transition-colors shadow-lg shadow-primary/20 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span className="material-icons text-sm">payment</span>
                  Proceed to Pay ${getTotalPromotionCost().toFixed(2)}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isPayModalOpen && (
        <MonerisPayModal
          ticket={payTicket}
          amount={payAmount}
          environment={payEnvironment}
          onSuccess={handlePaymentSuccess}
          onCancel={handlePaymentCancel}
        />
      )}

      {/* Delete Confirmation Modal */}
      {listingToDelete && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-2xl animate-in zoom-in-95 duration-200 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500">
              <span className="material-icons text-3xl">warning</span>
            </div>
            <h3 className="text-xl font-black mb-2">Delete Ad?</h3>
            <p className="text-sm text-slate-500 font-medium mb-6">
              Are you sure you want to permanently delete this ad? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setListingToDelete(null)}
                className="flex-1 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-sm transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteListing}
                className="flex-1 px-4 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl text-sm transition-colors shadow-lg shadow-red-500/20"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Confirmation Modal */}
      {listingToEdit && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-2xl animate-in zoom-in-95 duration-200 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-500">
              <span className="material-icons text-3xl">edit</span>
            </div>
            <h3 className="text-xl font-black mb-2">Edit Ad?</h3>
            <p className="text-sm text-slate-500 font-medium mb-6">
              Do you want to edit the details of this ad?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setListingToEdit(null)}
                className="flex-1 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-sm transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => navigate.push(`/post-ad?edit=${listingToEdit}`)}
                className="flex-1 px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl text-sm transition-colors shadow-lg shadow-blue-500/20"
              >
                Yes, Edit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;

import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MonerisPayModal from '../components/MonerisPayModal';
import { formatPrice } from '../constants';
import { useUI } from '../components/UIProvider';

const UserProfile: React.FC = () => {
  const navigate = useNavigate();
  const { showAlert } = useUI();
  const [user, setUser] = useState<any>(null);
  const [userListings, setUserListings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<any>({ name: '', phone: '' });
  const [isPromoteModalOpen, setIsPromoteModalOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState<any>(null);
  const [promotionData, setPromotionData] = useState({
    is_top_ad: false,
    is_highlighted: false,
    is_urgent: false,
    is_home_gallery: false
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

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      navigate('/login');
      return;
    }
    const userData = JSON.parse(userStr);
    setUser(userData);
    setEditData({ name: userData.name || '', phone: userData.phone || '' });

    // Fetch this user's listings
    fetch('/api/listings/read.php')
      .then(res => res.json())
      .then(data => {
        const myListings = data.filter((l: any) => l.user_id === userData.id);
        setUserListings(myListings);
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));

    // Fetch user messages
    setIsMessagesLoading(true);
    fetch(`/api/messages/read_user.php?user_id=${userData.id}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setMessages(data);
      })
      .catch(console.error)
      .finally(() => setIsMessagesLoading(false));
  }, []);

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

      const response = await fetch('/api/users/upload-avatar.php', {
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
      const response = await fetch('/api/users/update.php', {
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
    setPromotionData({
      is_top_ad: !!listing.is_top_ad,
      is_highlighted: !!listing.is_highlighted,
      is_urgent: !!listing.is_urgent,
      is_home_gallery: !!listing.is_home_gallery
    });
    setIsPromoteModalOpen(true);
  };

  const handlePromoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Calculate total cost
    let total = 0;
    if (promotionData.is_top_ad) total += 9.99;
    if (promotionData.is_highlighted) total += 4.99;
    if (promotionData.is_urgent) total += 5.99;
    if (promotionData.is_home_gallery) total += 14.99;

    if (total === 0) {
      showAlert("Please select at least one promotion option.", "error");
      return;
    }

    try {
      const response = await fetch('/api/payments/preload.php', {
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
    showAlert('Payment approved and promotions applied successfully! Receipt ID: ' + receiptId, 'success');
    
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
            <button
              onClick={() => {
                setEditData({ name: user.name || '', phone: user.phone || '' });
                setIsEditing(true);
              }}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all self-start sm:self-auto"
            >
              <span className="material-icons text-sm">edit</span>
              Edit Profile
            </button>
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
          <Link to="/post-ad" className="bg-primary hover:bg-primary-hover text-white px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest flex items-center gap-2 transition-all shadow-md shadow-primary/20">
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
            <Link to="/post-ad" className="bg-primary text-white px-8 py-3 rounded-2xl font-black text-sm shadow-lg shadow-primary/25 hover:bg-primary-hover transition-all inline-block">
              Post Your First Ad
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            {userListings.map((listing: any) => (
              <div key={listing.id} className="group bg-white rounded-2xl overflow-hidden hover:shadow-lg transition-all border border-slate-100 flex flex-col sm:flex-row">
                
                {/* Image Section */}
                <Link to={`/item/${listing.id}`} className="block w-full sm:w-72 h-48 sm:h-auto relative shrink-0 overflow-hidden bg-slate-100">
                  <img
                    src={listing.image || 'https://picsum.photos/seed/listing/800/600'}
                    alt={listing.title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </Link>

                {/* Details Section */}
                <div className="flex flex-col flex-1">
                  <Link to={`/item/${listing.id}`} className="p-6 flex-1 flex flex-col justify-center">
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
                  <div className="flex flex-wrap gap-2 mb-6">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded border ${listing.is_top_ad ? 'bg-amber-100 text-amber-700 border-amber-200 shadow-sm' : 'bg-white text-slate-400 border-slate-200 grayscale opacity-60'}`}>Top Ad</span>
                    <span className={`text-[10px] font-bold px-2 py-1 rounded border ${listing.is_highlighted ? 'bg-yellow-100 text-yellow-700 border-yellow-200 shadow-sm' : 'bg-white text-slate-400 border-slate-200 grayscale opacity-60'}`}>Highlighted</span>
                    <span className={`text-[10px] font-bold px-2 py-1 rounded border ${listing.is_urgent ? 'bg-red-100 text-red-700 border-red-200 shadow-sm' : 'bg-white text-slate-400 border-slate-200 grayscale opacity-60'}`}>Urgent</span>
                    <span className={`text-[10px] font-bold px-2 py-1 rounded border ${listing.is_home_gallery ? 'bg-blue-100 text-blue-700 border-blue-200 shadow-sm' : 'bg-white text-slate-400 border-slate-200 grayscale opacity-60'}`}>Home Gallery</span>
                  </div>
                  <button onClick={() => openPromoteModal(listing)} className="w-full bg-primary hover:bg-primary-hover text-white text-[11px] font-black uppercase tracking-widest py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary/25 mt-auto hover:-translate-y-0.5">
                    <span className="material-icons text-base">campaign</span>
                    Promote Ad
                  </button>
                  <Link to={`/post-ad?edit=${listing.id}`} className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-black uppercase tracking-widest py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all mt-3 text-center border border-slate-200/60 shadow-sm">
                    <span className="material-icons text-base">edit</span>
                    Edit Ad
                  </Link>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
      )}

      {/* Messages Content */}
      {activeTab === 'messages' && (
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8">
        <h2 className="text-xl font-black text-slate-900 mb-6">Inquiries Received</h2>
        
        {isMessagesLoading ? (
          <div className="flex justify-center py-12">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-4">
              <span className="material-icons text-slate-300 text-4xl">forum</span>
            </div>
            <h3 className="text-lg font-black text-slate-700 mb-2">No Inquiries</h3>
            <p className="text-sm text-slate-400 font-medium">When users message you about your ads, they will appear here.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {messages.map((msg: any) => (
              <div key={msg.id} className="p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:border-primary/30 transition-all">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <span className="material-icons text-xl">person</span>
                    </div>
                    <div>
                      <p className="text-sm font-black text-slate-800">{msg.sender_name}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                        {new Date(msg.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <Link to={`/item/${msg.listing_id}`} className="text-[10px] font-black text-primary bg-white px-3 py-1.5 rounded-lg border border-slate-200 hover:border-primary transition-all uppercase tracking-widest">
                    View Ad
                  </Link>
                </div>
                <div className="mb-3">
                   <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Regarding Listing:</p>
                   <p className="text-sm font-black text-slate-700">{msg.listing_title}</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-100">
                  <p className="text-sm text-slate-600 italic">"{msg.message}"</p>
                </div>
              </div>
            ))}
          </div>
        )}
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
              <label className="flex items-center p-4 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
                <input 
                  type="checkbox" 
                  checked={promotionData.is_top_ad} 
                  onChange={e => setPromotionData({...promotionData, is_top_ad: e.target.checked})}
                  className="w-5 h-5 text-primary rounded border-slate-300 focus:ring-primary"
                />
                <div className="ml-3 flex-1 flex justify-between items-center">
                  <div>
                    <p className="text-sm font-bold text-slate-800">Top Ad</p>
                    <p className="text-[10px] text-slate-500">Appears at the very top of search results.</p>
                  </div>
                  <span className="text-xs font-black bg-amber-50 text-amber-700 px-2 py-1 rounded border border-amber-100 shrink-0">$9.99</span>
                </div>
              </label>
              
              <label className="flex items-center p-4 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
                <input 
                  type="checkbox" 
                  checked={promotionData.is_highlighted} 
                  onChange={e => setPromotionData({...promotionData, is_highlighted: e.target.checked})}
                  className="w-5 h-5 text-yellow-500 rounded border-slate-300 focus:ring-yellow-500"
                />
                <div className="ml-3 flex-1 flex justify-between items-center">
                  <div>
                    <p className="text-sm font-bold text-slate-800">Highlighted</p>
                    <p className="text-[10px] text-slate-500">Ad stands out with a bright highlighted background.</p>
                  </div>
                  <span className="text-xs font-black bg-yellow-50 text-yellow-700 px-2 py-1 rounded border border-yellow-100 shrink-0">$4.99</span>
                </div>
              </label>

              <label className="flex items-center p-4 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
                <input 
                  type="checkbox" 
                  checked={promotionData.is_urgent} 
                  onChange={e => setPromotionData({...promotionData, is_urgent: e.target.checked})}
                  className="w-5 h-5 text-red-500 rounded border-slate-300 focus:ring-red-500"
                />
                <div className="ml-3 flex-1 flex justify-between items-center">
                  <div>
                    <p className="text-sm font-bold text-slate-800">Urgent</p>
                    <p className="text-[10px] text-slate-500">Mark as urgent to sell faster.</p>
                  </div>
                  <span className="text-xs font-black bg-red-50 text-red-700 px-2 py-1 rounded border border-red-100 shrink-0">$5.99</span>
                </div>
              </label>

              <label className="flex items-center p-4 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
                <input 
                  type="checkbox" 
                  checked={promotionData.is_home_gallery} 
                  onChange={e => setPromotionData({...promotionData, is_home_gallery: e.target.checked})}
                  className="w-5 h-5 text-blue-500 rounded border-slate-300 focus:ring-blue-500"
                />
                <div className="ml-3 flex-1 flex justify-between items-center">
                  <div>
                    <p className="text-sm font-bold text-slate-800">Home Gallery</p>
                    <p className="text-[10px] text-slate-500">Showcase your ad on the homepage gallery.</p>
                  </div>
                  <span className="text-xs font-black bg-blue-50 text-blue-700 px-2 py-1 rounded border border-blue-100 shrink-0">$14.99</span>
                </div>
              </label>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsPromoteModalOpen(false)}
                  className="flex-1 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-sm transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-primary hover:bg-primary-hover text-white font-bold rounded-xl text-sm transition-colors shadow-lg shadow-primary/20 flex items-center justify-center gap-1.5"
                >
                  <span className="material-icons text-sm">payment</span>
                  Proceed to Pay ${(
                    (promotionData.is_top_ad ? 9.99 : 0) +
                    (promotionData.is_highlighted ? 4.99 : 0) +
                    (promotionData.is_urgent ? 5.99 : 0) +
                    (promotionData.is_home_gallery ? 14.99 : 0)
                  ).toFixed(2)}
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
    </div>
  );
};

export default UserProfile;

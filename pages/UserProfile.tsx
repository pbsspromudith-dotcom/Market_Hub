import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const UserProfile: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [userListings, setUserListings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      navigate('/login');
      return;
    }
    const userData = JSON.parse(userStr);
    setUser(userData);

    // Fetch this user's listings
    fetch('/api/listings/read.php')
      .then(res => res.json())
      .then(data => {
        const myListings = data.filter((l: any) => l.user_id === userData.id);
        setUserListings(myListings);
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  if (!user) return null;

  const avatarInitials = user.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) || 'U';
  const joinDate = user.join_date ? new Date(user.join_date).toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A';

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      {/* Profile Header Card */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden mb-8">
        {/* Banner */}
        <div className="h-32 bg-gradient-to-r from-primary/80 to-primary-light relative">
          <div className="absolute inset-0 opacity-20" style={{backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px'}}></div>
        </div>

        <div className="px-8 pb-8">
          {/* Avatar */}
          <div className="-mt-12 mb-4 flex justify-between items-end">
            <div className="w-24 h-24 rounded-[1.5rem] bg-primary flex items-center justify-center text-white text-3xl font-black border-4 border-white shadow-xl">
              {user.avatar ? (
                <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover rounded-[1.2rem]" />
              ) : (
                avatarInitials
              )}
            </div>
            {user.isAdmin && (
              <span className="inline-flex items-center gap-1.5 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full">
                <span className="material-icons text-sm">admin_panel_settings</span>
                Admin
              </span>
            )}
          </div>

          {/* Info */}
          <h1 className="text-2xl font-black text-slate-900 mb-1">{user.name}</h1>
          <p className="text-sm text-slate-500 font-medium mb-6">{user.email}</p>

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

      {/* My Listings */}
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {userListings.map((listing: any) => (
              <Link key={listing.id} to={`/item/${listing.id}`} className="group bg-slate-50 rounded-2xl overflow-hidden hover:shadow-md transition-all border border-slate-100">
                <div className="aspect-video bg-slate-200 overflow-hidden">
                  <img
                    src={listing.image || 'https://picsum.photos/seed/listing/400/300'}
                    alt={listing.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <p className="text-xs font-black text-primary uppercase tracking-widest mb-1">{listing.category}</p>
                  <h3 className="text-sm font-black text-slate-800 mb-1 line-clamp-1">{listing.title}</h3>
                  <p className="text-base font-black text-slate-900">${Number(listing.price).toLocaleString()}</p>
                  <p className="text-[10px] text-slate-400 font-bold mt-1 flex items-center gap-1">
                    <span className="material-icons text-xs">location_on</span>
                    {listing.location}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;

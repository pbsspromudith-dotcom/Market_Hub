
import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

import { Link } from 'react-router-dom';

const AdminDashboard: React.FC = () => {
  const [adminStats, setAdminStats] = useState<any>(null);
  const [listings, setListings] = useState<any[]>([]);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);
  const [options, setOptions] = useState<any[]>([]);
  const [newOptionType, setNewOptionType] = useState('category');
  const [newOptionValue, setNewOptionValue] = useState('');
  const [isCreatingOption, setIsCreatingOption] = useState(false);
  const [isDeletingOption, setIsDeletingOption] = useState<number | null>(null);

  // Email Config State
  const [emailConfig, setEmailConfig] = useState({
    smtp_host: 'smtp.gmail.com',
    smtp_port: '587',
    smtp_username: '',
    smtp_password: '',
    smtp_from_email: '',
    smtp_from_name: 'HitAds.ca',
    smtp_encryption: 'tls',
  });
  const [isSavingEmail, setIsSavingEmail] = useState(false);
  const [emailSaveMsg, setEmailSaveMsg] = useState<{type: 'success' | 'error', text: string} | null>(null);
  const [testEmail, setTestEmail] = useState('');
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [showSmtpPassword, setShowSmtpPassword] = useState(false);

  useEffect(() => {
    fetch('/api/admin/stats.php')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setAdminStats(data.stats);
        }
      })
      .catch(console.error);

    fetchListings();
    fetchOptions();
    fetchEmailConfig();
  }, []);

  const fetchOptions = () => {
    fetch('/api/options/read.php')
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.data)) {
          setOptions(data.data);
        }
      })
      .catch(console.error);
  };

  const fetchListings = () => {
    fetch('/api/listings/read.php')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setListings(data);
        }
      })
      .catch(console.error);
  };

  const handleDeleteListing = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) return;
    setIsDeleting(id);
    try {
      const response = await fetch('/api/listings/delete.php', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      const data = await response.json();
      if (data.success) {
        setListings(listings.filter((l: any) => l.id !== id));
        setSelectedIds(prev => { const next = new Set(prev); next.delete(id); return next; });
      } else {
        alert(data.error || 'Failed to delete listing');
      }
    } catch (err) {
      console.error(err);
      alert('Error deleting listing');
    } finally {
      setIsDeleting(null);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    if (!window.confirm(`Delete ${selectedIds.size} selected listing${selectedIds.size > 1 ? 's' : ''}? This cannot be undone.`)) return;
    setIsBulkDeleting(true);
    const ids = Array.from(selectedIds);
    let deletedCount = 0;
    for (const id of ids) {
      try {
        const res = await fetch('/api/listings/delete.php', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id }),
        });
        const data = await res.json();
        if (data.success) deletedCount++;
      } catch {}
    }
    setListings(prev => prev.filter((l: any) => !selectedIds.has(String(l.id))));
    setSelectedIds(new Set());
    setIsBulkDeleting(false);
    if (deletedCount < ids.length) alert(`${ids.length - deletedCount} listing(s) could not be deleted.`);
  };

  const handleCreateOption = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOptionValue.trim()) return;
    setIsCreatingOption(true);
    try {
      const response = await fetch('/api/options/create.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ option_type: newOptionType, option_value: newOptionValue.trim() }),
      });
      const data = await response.json();
      if (data.success) {
        setNewOptionValue('');
        fetchOptions();
      } else {
        alert(data.error || 'Failed to create option');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsCreatingOption(false);
    }
  };

  const handleDeleteOption = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this option?')) return;
    setIsDeletingOption(id);
    try {
      const response = await fetch('/api/options/delete.php', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      const data = await response.json();
      if (data.success) {
        setOptions(options.filter((o: any) => o.id !== id));
      } else {
        alert(data.error || 'Failed to delete option');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsDeletingOption(null);
    }
  };

  const fetchEmailConfig = () => {
    fetch('/api/admin/email_config.php')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.settings) {
          setEmailConfig(prev => ({ ...prev, ...data.settings }));
        }
      })
      .catch(console.error);
  };

  const handleSaveEmailConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingEmail(true);
    setEmailSaveMsg(null);
    try {
      const response = await fetch('/api/admin/email_config.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(emailConfig),
      });
      const data = await response.json();
      if (data.success) {
        setEmailSaveMsg({ type: 'success', text: data.message });
      } else {
        setEmailSaveMsg({ type: 'error', text: data.message || 'Failed to save settings' });
      }
    } catch (err) {
      setEmailSaveMsg({ type: 'error', text: 'Network error. Backend not reachable.' });
    } finally {
      setIsSavingEmail(false);
      setTimeout(() => setEmailSaveMsg(null), 5000);
    }
  };

  const handleSendTestEmail = async () => {
    if (!testEmail.trim()) return;
    setIsSendingTest(true);
    setEmailSaveMsg(null);
    try {
      const response = await fetch('/api/admin/email_config.php', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ test_email: testEmail }),
      });
      const data = await response.json();
      setEmailSaveMsg({ type: data.success ? 'success' : 'error', text: data.message });
    } catch (err) {
      setEmailSaveMsg({ type: 'error', text: 'Network error sending test email.' });
    } finally {
      setIsSendingTest(false);
      setTimeout(() => setEmailSaveMsg(null), 8000);
    }
  };

  const data = [
    { name: '30d ago', value: 400 },
    { name: '25d ago', value: 300 },
    { name: '20d ago', value: 600 },
    { name: '15d ago', value: 800 },
    { name: '10d ago', value: 500 },
    { name: '5d ago', value: 700 },
    { name: 'Today', value: 900 },
  ];

  const stats = adminStats ? [
    { label: 'Total Listings', value: adminStats.totalListings.toLocaleString(), change: '+12%', icon: 'inventory_2', color: 'blue' },
    { label: 'New Users Today', value: adminStats.newUsersToday.toLocaleString(), change: '+5.2%', icon: 'person_add', color: 'purple' },
    { label: 'Total Users', value: adminStats.totalUsers.toLocaleString(), change: '+18%', icon: 'people', color: 'red' },
    { label: 'Total Listing Value', value: '$' + Number(adminStats.revenue).toLocaleString(), change: '+3%', icon: 'payments', color: 'green' },
  ] : [
    { label: 'Total Listings', value: '-', change: '0%', icon: 'inventory_2', color: 'blue' },
    { label: 'New Users Today', value: '-', change: '0%', icon: 'person_add', color: 'purple' },
    { label: 'Total Users', value: '-', change: '0%', icon: 'people', color: 'red' },
    { label: 'Total Listing Value', value: '-', change: '0%', icon: 'payments', color: 'green' },
  ];

  return (
    <div className="max-w-[1600px] mx-auto px-6 py-10">
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black">Dashboard Overview</h1>
          <p className="text-slate-500 font-medium">Welcome back, Alex. Here's what's happening today.</p>
        </div>
        <div className="flex gap-4">
          <div className="relative">
            <span className="material-icons absolute left-4 top-2.5 text-slate-400">search</span>
            <input className="pl-12 pr-4 py-2.5 bg-white border-slate-200 rounded-xl w-72 text-sm" placeholder="Search orders, users..." />
          </div>
          <button className="w-11 h-11 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 hover:text-primary transition-colors relative">
            <span className="material-icons">notifications</span>
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map(stat => (
          <div key={stat.label} className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className={`w-12 h-12 rounded-2xl bg-${stat.color}-50 flex items-center justify-center text-${stat.color}-500`}>
                <span className="material-icons text-2xl">{stat.icon}</span>
              </div>
              <span className={`text-[10px] font-black text-${stat.change.startsWith('+') ? 'green' : 'red'}-500 uppercase tracking-widest`}>
                {stat.change}
              </span>
            </div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
            <p className="text-2xl font-black text-slate-900">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h2 className="text-xl font-black">Listing Trends</h2>
              <p className="text-xs text-slate-400 uppercase font-bold tracking-widest">Volume of new listings over 30 days</p>
            </div>
            <select className="text-xs font-bold border-slate-200 rounded-lg px-4 py-2">
              <option>Last 30 Days</option>
              <option>Last 7 Days</option>
            </select>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} axisLine={false} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={10} axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="value" fill="#f2b90d" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
          <h2 className="text-xl font-black mb-8">Recent Activity</h2>
          <div className="space-y-8">
            {adminStats?.recentActivity ? adminStats.recentActivity.map((activity: any, i: number) => (
              <div key={i} className="flex gap-4">
                <div className={`w-10 h-10 rounded-xl bg-green-50 flex-shrink-0 flex items-center justify-center text-green-500`}>
                  <span className="material-icons text-lg">inventory_2</span>
                </div>
                <div>
                  <p className="text-sm">
                    <span className="font-bold">{activity.title}</span> was posted as a new listing.
                  </p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Recently</p>
                </div>
              </div>
            )) : (
              <p className="text-sm text-slate-400">Loading recent activity...</p>
            )}
          </div>
          <button className="w-full mt-10 py-3 font-bold text-primary hover:bg-primary/5 rounded-xl transition-all uppercase tracking-widest text-xs">View All Activity</button>
        </div>
      </div>

      <div className="mt-10 bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
          <div>
            <h2 className="text-xl font-black">Manage Listings</h2>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Add, review, or remove active listings</p>
          </div>
          <Link 
            to="/post-ad"
            className="bg-primary hover:bg-primary-hover text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-primary/20 flex items-center gap-2 text-sm"
          >
            <span className="material-icons text-sm">add</span>
            Add Listing
          </Link>
        </div>

        {/* Bulk Action Bar */}
        {selectedIds.size > 0 && (
          <div className="flex items-center justify-between bg-red-50 border border-red-200 rounded-2xl px-6 py-4 mb-4 animate-in fade-in duration-200">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <span className="material-icons text-red-500 text-sm">checklist</span>
              </div>
              <span className="text-sm font-black text-red-700">
                {selectedIds.size} listing{selectedIds.size > 1 ? 's' : ''} selected
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSelectedIds(new Set())}
                className="text-xs font-bold text-slate-500 hover:text-slate-700 px-3 py-1.5 rounded-lg hover:bg-white transition-all"
              >
                Clear Selection
              </button>
              <button
                onClick={handleBulkDelete}
                disabled={isBulkDeleting}
                className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-red-200 disabled:opacity-60"
              >
                {isBulkDeleting ? (
                  <span className="material-icons text-sm animate-spin">sync</span>
                ) : (
                  <span className="material-icons text-sm">delete_sweep</span>
                )}
                {isBulkDeleting ? 'Deleting...' : `Delete ${selectedIds.size} Selected`}
              </button>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-y border-slate-100 uppercase text-[10px] font-black text-slate-400 tracking-widest">
              <tr>
                <th className="px-6 py-4 rounded-l-xl w-10">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary cursor-pointer"
                    checked={listings.length > 0 && selectedIds.size === listings.length}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedIds(new Set(listings.map((l: any) => String(l.id))));
                      } else {
                        setSelectedIds(new Set());
                      }
                    }}
                    title="Select All"
                  />
                </th>
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right rounded-r-xl">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm font-medium">
              {listings.map((l: any) => (
                <tr
                  key={l.id}
                  className={`border-b border-slate-50 transition-colors ${
                    selectedIds.has(String(l.id))
                      ? 'bg-primary/5 hover:bg-primary/10'
                      : 'hover:bg-slate-50/50'
                  }`}
                >
                  {/* Checkbox */}
                  <td className="px-6 py-4 w-10">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary cursor-pointer"
                      checked={selectedIds.has(String(l.id))}
                      onChange={(e) => {
                        const next = new Set(selectedIds);
                        if (e.target.checked) next.add(String(l.id));
                        else next.delete(String(l.id));
                        setSelectedIds(next);
                      }}
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-slate-100 overflow-hidden flex-shrink-0 border border-slate-200">
                        {l.image ? (
                           <img src={l.image.startsWith('http') || l.image.startsWith('/upload') ? l.image : ('http://localhost:8080' + (l.image.startsWith('/') ? '' : '/') + l.image)} className="w-full h-full object-cover" alt="" />
                        ) : (
                           <span className="w-full h-full flex items-center justify-center material-icons text-slate-400 text-sm">image</span>
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 line-clamp-1">{l.title}</p>
                        <p className="text-xs text-slate-400">{l.location}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-bold">${Number(l.price).toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-[10px] uppercase font-black tracking-widest">
                      {l.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="flex items-center gap-1.5 text-green-500 text-xs font-bold">
                      <span className="w-2 h-2 rounded-full bg-green-500"></span> Active
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => handleDeleteListing(l.id)}
                      disabled={isDeleting === l.id}
                      className="w-8 h-8 rounded-lg bg-red-50 text-red-500 hover:bg-red-500 hover:text-white flex items-center justify-center transition-colors disabled:opacity-50 inline-flex"
                      title="Delete Listing"
                    >
                      {isDeleting === l.id ? (
                        <span className="material-icons text-sm animate-spin">sync</span>
                      ) : (
                        <span className="material-icons text-sm">delete</span>
                      )}
                    </button>
                  </td>
                </tr>
              ))}
              {listings.length === 0 && (
                <tr>
                   <td colSpan={5} className="px-6 py-10 text-center text-slate-400">Loading listings...</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-10 bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
        <div className="mb-8">
          <h2 className="text-xl font-black">System Configuration</h2>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Manage global categories, car makes, models, and types</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-1 border-r border-slate-100 pr-0 lg:pr-8">
            <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
              <span className="material-icons text-primary text-sm">add_circle</span>
              Add New Option
            </h3>
            <form onSubmit={handleCreateOption} className="space-y-4">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Option Type</label>
                <select 
                  value={newOptionType}
                  onChange={e => setNewOptionType(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border-slate-100 rounded-xl focus:ring-primary focus:border-primary text-sm font-medium"
                >
                  <option value="category">Category</option>
                  <option value="car_make">Car Make</option>
                  <option value="car_model">Car Model</option>
                  <option value="car_type">Car Type</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Option Value</label>
                <input 
                  type="text"
                  required
                  value={newOptionValue}
                  onChange={e => setNewOptionValue(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border-slate-100 rounded-xl focus:ring-primary focus:border-primary text-sm"
                  placeholder="e.g. Real Estate, Toyota, Sedan..."
                />
              </div>
              <button 
                type="submit"
                disabled={!newOptionValue.trim() || isCreatingOption}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black py-4 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 text-xs uppercase tracking-widest"
              >
                {isCreatingOption ? 'Saving...' : 'Save Option'}
              </button>
            </form>
          </div>

          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {['category', 'car_make', 'car_model', 'car_type'].map(type => (
                <div key={type}>
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2 pb-2 border-b border-slate-100">
                    <span className="w-2 h-2 rounded-full bg-slate-300"></span> 
                    {type.replace('_', ' ')}s
                  </h4>
                  <ul className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                    {options.filter(o => o.option_type === type).length === 0 && (
                      <li className="text-xs text-slate-400 italic">No items found</li>
                    )}
                    {options.filter(o => o.option_type === type).map((opt) => (
                      <li key={opt.id} className="group flex items-center justify-between px-4 py-2 bg-slate-50 hover:bg-primary/5 rounded-lg border border-transparent hover:border-primary/10 transition-all">
                        <span className="text-sm font-bold text-slate-700">{opt.option_value}</span>
                        <button 
                          onClick={() => handleDeleteOption(opt.id)}
                          disabled={isDeletingOption === opt.id}
                          className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 transition-all disabled:opacity-50"
                        >
                          <span className="material-icons text-[16px]">remove_circle</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Email Server Configuration */}
      <div className="mt-10 bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
        <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-black flex items-center gap-3">
              <span className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <span className="material-icons text-primary">email</span>
              </span>
              Email Server Configuration
            </h2>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-2">Configure SMTP settings for welcome emails and notifications</p>
          </div>
          {emailConfig.smtp_username && (
            <span className="flex items-center gap-2 text-xs font-bold text-green-500 bg-green-50 px-4 py-2 rounded-full">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Configured
            </span>
          )}
        </div>

        {/* Status Messages */}
        {emailSaveMsg && (
          <div className={`mb-6 px-5 py-4 rounded-2xl text-sm font-bold flex items-center gap-3 animate-in fade-in duration-200 ${
            emailSaveMsg.type === 'success' 
              ? 'bg-green-50 border border-green-100 text-green-700' 
              : 'bg-red-50 border border-red-100 text-red-700'
          }`}>
            <span className="material-icons text-lg">
              {emailSaveMsg.type === 'success' ? 'check_circle' : 'error'}
            </span>
            {emailSaveMsg.text}
          </div>
        )}

        <form onSubmit={handleSaveEmailConfig}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Left Column — Server Settings */}
            <div className="space-y-5">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest pb-3 border-b border-slate-100 flex items-center gap-2">
                <span className="material-icons text-sm text-slate-300">dns</span>
                SMTP Server
              </h3>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">SMTP Host</label>
                <div className="relative">
                  <span className="material-icons absolute left-4 top-3.5 text-slate-300 text-lg">cloud</span>
                  <input 
                    type="text"
                    value={emailConfig.smtp_host}
                    onChange={e => setEmailConfig({...emailConfig, smtp_host: e.target.value})}
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-slate-100 rounded-2xl focus:ring-primary focus:border-primary text-sm font-medium"
                    placeholder="smtp.gmail.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Port</label>
                  <input 
                    type="number"
                    value={emailConfig.smtp_port}
                    onChange={e => setEmailConfig({...emailConfig, smtp_port: e.target.value})}
                    className="w-full px-4 py-4 bg-slate-50 border-slate-100 rounded-2xl focus:ring-primary focus:border-primary text-sm font-medium"
                    placeholder="587"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Encryption</label>
                  <select 
                    value={emailConfig.smtp_encryption}
                    onChange={e => setEmailConfig({...emailConfig, smtp_encryption: e.target.value})}
                    className="w-full px-4 py-4 bg-slate-50 border-slate-100 rounded-2xl focus:ring-primary focus:border-primary text-sm font-medium"
                  >
                    <option value="tls">TLS (Port 587)</option>
                    <option value="ssl">SSL (Port 465)</option>
                    <option value="none">None (Port 25)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Right Column — Credentials */}
            <div className="space-y-5">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest pb-3 border-b border-slate-100 flex items-center gap-2">
                <span className="material-icons text-sm text-slate-300">lock</span>
                Authentication
              </h3>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">SMTP Username / Email</label>
                <div className="relative">
                  <span className="material-icons absolute left-4 top-3.5 text-slate-300 text-lg">alternate_email</span>
                  <input 
                    type="email"
                    value={emailConfig.smtp_username}
                    onChange={e => setEmailConfig({...emailConfig, smtp_username: e.target.value})}
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-slate-100 rounded-2xl focus:ring-primary focus:border-primary text-sm font-medium"
                    placeholder="yourname@gmail.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">SMTP Password / App Password</label>
                <div className="relative">
                  <span className="material-icons absolute left-4 top-3.5 text-slate-300 text-lg">key</span>
                  <input 
                    type={showSmtpPassword ? 'text' : 'password'}
                    value={emailConfig.smtp_password}
                    onChange={e => setEmailConfig({...emailConfig, smtp_password: e.target.value})}
                    className="w-full pl-12 pr-12 py-4 bg-slate-50 border-slate-100 rounded-2xl focus:ring-primary focus:border-primary text-sm font-medium"
                    placeholder="App password (not your regular password)"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSmtpPassword(!showSmtpPassword)}
                    className="absolute right-4 top-3.5 text-slate-400 hover:text-primary transition-colors"
                    tabIndex={-1}
                  >
                    <span className="material-icons text-lg">{showSmtpPassword ? 'visibility_off' : 'visibility'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Sender Identity */}
          <div className="mt-8 pt-6 border-t border-slate-100">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest pb-4 flex items-center gap-2">
              <span className="material-icons text-sm text-slate-300">badge</span>
              Sender Identity
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">From Name</label>
                <input 
                  type="text"
                  value={emailConfig.smtp_from_name}
                  onChange={e => setEmailConfig({...emailConfig, smtp_from_name: e.target.value})}
                  className="w-full px-4 py-4 bg-slate-50 border-slate-100 rounded-2xl focus:ring-primary focus:border-primary text-sm font-medium"
                  placeholder="HitAds.ca"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">From Email</label>
                <input 
                  type="email"
                  value={emailConfig.smtp_from_email}
                  onChange={e => setEmailConfig({...emailConfig, smtp_from_email: e.target.value})}
                  className="w-full px-4 py-4 bg-slate-50 border-slate-100 rounded-2xl focus:ring-primary focus:border-primary text-sm font-medium"
                  placeholder="noreply@hitads.ca"
                />
              </div>
            </div>
          </div>

          {/* Actions Row */}
          <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            {/* Test Email */}
            <div className="flex items-center gap-3 flex-grow max-w-md">
              <div className="relative flex-grow">
                <span className="material-icons absolute left-4 top-3 text-slate-300 text-lg">send</span>
                <input 
                  type="email"
                  value={testEmail}
                  onChange={e => setTestEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border-slate-100 rounded-xl focus:ring-primary focus:border-primary text-sm font-medium"
                  placeholder="test@example.com"
                />
              </div>
              <button
                type="button"
                onClick={handleSendTestEmail}
                disabled={isSendingTest || !testEmail.trim()}
                className="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs uppercase tracking-widest transition-all disabled:opacity-50 whitespace-nowrap flex items-center gap-2"
              >
                {isSendingTest ? (
                  <><span className="material-icons text-sm animate-spin">sync</span> Sending...</>
                ) : (
                  <><span className="material-icons text-sm">send</span> Send Test</>
                )}
              </button>
            </div>

            {/* Save Button */}
            <button 
              type="submit"
              disabled={isSavingEmail}
              className="bg-primary hover:bg-primary-hover text-white font-black py-4 px-10 rounded-2xl transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-50 text-xs uppercase tracking-widest"
            >
              {isSavingEmail ? (
                <><span className="material-icons text-sm animate-spin">sync</span> Saving...</>
              ) : (
                <><span className="material-icons text-sm">save</span> Save Email Settings</>
              )}
            </button>
          </div>
        </form>

        {/* Help Tip */}
        <div className="mt-8 p-5 bg-amber-50 border border-amber-100 rounded-2xl flex items-start gap-4">
          <span className="material-icons text-amber-500 mt-0.5">tips_and_updates</span>
          <div>
            <p className="text-sm font-bold text-amber-800 mb-1">Gmail App Password Setup</p>
            <p className="text-xs text-amber-700 leading-relaxed">
              For Gmail: Enable 2-Factor Authentication, then go to 
              <a href="https://myaccount.google.com/apppasswords" target="_blank" rel="noopener" className="font-bold underline"> myaccount.google.com/apppasswords</a> 
              to generate a 16-character App Password. Use that instead of your regular Gmail password.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

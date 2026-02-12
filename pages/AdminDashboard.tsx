
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const AdminDashboard: React.FC = () => {
  const data = [
    { name: '30d ago', value: 400 },
    { name: '25d ago', value: 300 },
    { name: '20d ago', value: 600 },
    { name: '15d ago', value: 800 },
    { name: '10d ago', value: 500 },
    { name: '5d ago', value: 700 },
    { name: 'Today', value: 900 },
  ];

  const stats = [
    { label: 'Total Listings', value: '42,894', change: '+12%', icon: 'inventory_2', color: 'blue' },
    { label: 'New Users Today', value: '1,204', change: '+5.2%', icon: 'person_add', color: 'purple' },
    { label: 'Reported Ads', value: '84', change: '+18%', icon: 'report_problem', color: 'red' },
    { label: 'Revenue (Monthly)', value: '$12,450.00', change: '+3%', icon: 'payments', color: 'green' },
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
            {[
              { name: 'John Doe', action: 'joined as a new seller.', time: '2 minutes ago', color: 'blue' },
              { name: 'iPhone 15 Pro Max', action: 'was posted as a new listing.', time: '15 minutes ago', color: 'green' },
              { name: 'Ad #94021', action: 'was flagged for spam.', time: '1 hour ago', color: 'red' },
              { name: 'Sara Smith', action: 'purchased featured package.', time: '3 hours ago', color: 'purple' },
              { name: 'Maintenance', action: 'scheduled for midnight.', time: '5 hours ago', color: 'slate' }
            ].map((activity, i) => (
              <div key={i} className="flex gap-4">
                <div className={`w-10 h-10 rounded-xl bg-${activity.color}-50 flex-shrink-0 flex items-center justify-center text-${activity.color}-500`}>
                  <span className="material-icons text-lg">{i % 2 === 0 ? 'person' : 'inventory_2'}</span>
                </div>
                <div>
                  <p className="text-sm">
                    <span className="font-bold">{activity.name}</span> {activity.action}
                  </p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-10 py-3 font-bold text-primary hover:bg-primary/5 rounded-xl transition-all uppercase tracking-widest text-xs">View All Activity</button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

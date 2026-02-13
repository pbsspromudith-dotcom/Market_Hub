
import React from 'react';
import { Link } from 'react-router-dom';
import { MOCK_LISTINGS } from '../constants';

interface HomeProps {
  isLoggedIn: boolean;
}

const Home: React.FC<HomeProps> = ({ isLoggedIn }) => {
  const categories = [
    { name: 'Vehicles', icon: 'directions_car' },
    { name: 'Real Estate', icon: 'home' },
    { name: 'Jobs', icon: 'work' },
    { name: 'Pets', icon: 'pets' },
    { name: 'Electronics', icon: 'laptop_mac' },
    { name: 'More', icon: 'more_horiz' },
  ];

  return (
    <div className="overflow-x-hidden">
      {/* Hero Section */}
      <section className="bg-gradient-mesh border-b border-slate-100 pt-20 pb-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-primary-soft/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-primary-light/10 rounded-full blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
          <span className="inline-block py-1.5 px-4 rounded-full bg-primary-soft/20 text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-6">
            Global Standards. Local Trading.
          </span>
          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight text-slate-900 leading-[1.1]">
            Find what you need,<br/>
            <span className="text-primary-light">right in your community.</span>
          </h1>
          <p className="text-slate-500 text-lg md:text-xl mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
            MarketHub Pro connects you with verified local sellers using a secure, professional-grade platform.
          </p>
          
          <div className="max-w-4xl mx-auto bg-white p-2.5 rounded-[2.5rem] shadow-2xl shadow-primary-neutral/40 border border-slate-100 flex flex-col md:flex-row gap-2">
            <div className="flex-grow relative flex items-center">
              <span className="material-icons absolute left-5 text-primary-neutral">search</span>
              <input className="w-full pl-14 pr-4 py-5 bg-transparent border-none focus:ring-0 text-sm font-medium" placeholder="Search for anything..." type="text" />
            </div>
            <div className="w-px h-10 bg-slate-100 self-center hidden md:block"></div>
            <div className="md:w-64 relative flex items-center">
              <span className="material-icons absolute left-5 text-primary-neutral">location_on</span>
              <input className="w-full pl-14 pr-4 py-5 bg-transparent border-none focus:ring-0 text-sm font-bold text-slate-700" defaultValue="Toronto, ON" type="text" />
            </div>
            <Link to="/search" className="bg-primary hover:bg-primary-hover text-white px-12 py-5 rounded-[1.8rem] font-black transition-all flex items-center justify-center shadow-lg shadow-primary/25">
              Explore
            </Link>
          </div>

          <div className="mt-12 flex flex-wrap justify-center gap-8 text-xs font-bold text-slate-400 uppercase tracking-widest">
            <div className="flex items-center gap-2"><span className="material-icons text-primary-light text-sm">verified</span> Trusted Users</div>
            <div className="flex items-center gap-2"><span className="material-icons text-primary-light text-sm">security</span> Encrypted Data</div>
            <div className="flex items-center gap-2"><span className="material-icons text-primary-light text-sm">forum</span> Direct Chat</div>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 py-20">
        {/* Categories */}
        <section className="mb-32">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-black mb-2 text-slate-900">Explore Categories</h2>
              <p className="text-slate-500 font-medium">Browse thousands of curated listings</p>
            </div>
            <Link to="/search" className="text-xs font-black text-primary-light uppercase tracking-widest hover:underline">All Categories</Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
            {categories.map((cat) => (
              <Link key={cat.name} to="/search" className="bg-white p-8 rounded-3xl border border-slate-100 text-center hover:border-primary-light hover:shadow-xl hover:-translate-y-1 transition-all group">
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-primary-soft/10 transition-all">
                  <span className="material-icons text-3xl text-primary-neutral group-hover:text-primary-light">{cat.icon}</span>
                </div>
                <span className="text-xs font-black text-slate-700 uppercase tracking-widest">{cat.name}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Recently Added */}
        <div className="flex flex-col lg:flex-row gap-16">
          <div className="flex-grow">
            <div className="flex justify-between items-end mb-10">
              <div>
                <h2 className="text-3xl font-black mb-2">Recently Added</h2>
                <p className="text-slate-500 font-medium">New items posted in your area</p>
              </div>
              <Link to="/search" className="text-xs font-black text-primary-light uppercase tracking-widest hover:underline">See All</Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
              {MOCK_LISTINGS.map((item) => (
                <Link to={`/item/${item.id}`} key={item.id} className="group bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden hover:shadow-2xl transition-all">
                  <div className="aspect-[4/3] relative overflow-hidden bg-slate-100">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <button className="absolute top-5 right-5 w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors shadow-sm">
                      <span className="material-icons text-xl">favorite_border</span>
                    </button>
                    {item.isFeatured && (
                      <div className="absolute top-5 left-5 bg-primary-light text-white text-[10px] font-black px-3 py-1.5 rounded-xl shadow-lg">FEATURED</div>
                    )}
                  </div>
                  <div className="p-8">
                    <div className="text-primary font-black text-2xl mb-2">${item.price.toLocaleString()}</div>
                    <h3 className="font-bold text-slate-800 line-clamp-2 min-h-[3rem] text-lg group-hover:text-primary-light transition-colors mb-4">{item.title}</h3>
                    <div className="flex items-center text-slate-400 text-[10px] font-black uppercase tracking-widest pt-5 border-t border-slate-50">
                      <span className="flex items-center gap-1.5"><span className="material-icons text-sm text-primary-soft">location_on</span> {item.location}</span>
                      <span className="mx-3 text-slate-200">|</span>
                      <span>{item.time}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:w-80 space-y-10 flex-shrink-0">
            {!isLoggedIn && (
              <div className="bg-primary rounded-[2.5rem] p-10 text-white relative overflow-hidden group">
                 <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-colors"></div>
                 <h3 className="text-2xl font-black mb-4 relative z-10">Join MarketHub</h3>
                 <p className="text-primary-neutral text-sm mb-8 leading-relaxed relative z-10 font-medium">Create a free account to contact sellers and save your favorite items.</p>
                 <Link to="/login" className="block w-full bg-white text-primary font-black py-4 rounded-2xl text-center transition-all shadow-lg hover:bg-slate-50">
                   Join Free
                 </Link>
              </div>
            )}

            <div className="bg-white rounded-[2.5rem] border border-slate-100 p-10 shadow-sm">
              <div className="w-12 h-12 bg-primary-soft/10 rounded-2xl flex items-center justify-center text-primary-light mb-6">
                <span className="material-icons">shield</span>
              </div>
              <h3 className="font-black mb-3 text-lg text-slate-900">Safety First</h3>
              <p className="text-xs text-slate-500 leading-relaxed mb-6 font-medium">
                We prioritize secure trading and verified interactions for every user on our platform.
              </p>
              <ul className="space-y-4 mb-8">
                {['Verified Identities', 'Safe Exchange Zones', 'Secure Messaging'].map(t => (
                  <li key={t} className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-400">
                    <span className="material-icons text-primary-soft text-sm">check_circle</span>
                    {t}
                  </li>
                ))}
              </ul>
              <Link to="/help" className="text-xs font-black text-primary-light hover:underline uppercase tracking-widest">Learn More</Link>
            </div>
          </aside>
        </div>
      </main>

      {/* Stats Section */}
      <section className="bg-white py-24 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
            {[
              { label: 'Listings', value: '120K+' },
              { label: 'Community', value: '4M+' },
              { label: 'Locations', value: '1.2K+' },
              { label: 'Trust Score', value: '4.95' },
            ].map(stat => (
              <div key={stat.label}>
                <div className="text-4xl font-black text-primary mb-2">{stat.value}</div>
                <div className="text-[10px] font-black text-primary-neutral uppercase tracking-widest">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 px-4">
        <div className="max-w-5xl mx-auto bg-primary-light rounded-[4rem] p-16 md:p-24 text-center text-white relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.2),transparent)]"></div>
          <h2 className="text-4xl md:text-6xl font-black mb-8 relative z-10 leading-tight">Ready to start<br/>trading better?</h2>
          <div className="flex flex-col sm:flex-row justify-center gap-6 relative z-10">
            <Link to="/login" className="bg-white text-primary px-12 py-5 rounded-[2rem] font-black text-lg hover:bg-slate-50 transition-all shadow-xl">
              Get Started
            </Link>
            <Link to="/search" className="bg-primary/20 backdrop-blur-md text-white border border-white/30 px-12 py-5 rounded-[2rem] font-black text-lg hover:bg-white/10 transition-all">
              Browse All
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

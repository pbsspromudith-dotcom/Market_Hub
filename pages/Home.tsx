
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
      <section className="bg-white border-b border-slate-100 pt-20 pb-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-primary/10 rounded-full blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
          <span className="inline-block py-1.5 px-4 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-6">
            The World's Best Community Marketplace
          </span>
          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight text-slate-900 leading-[1.1]">
            Everything you need,<br/>
            <span className="text-primary">right in your backyard.</span>
          </h1>
          <p className="text-slate-500 text-lg md:text-xl mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
            MarketHub Pro connects you with verified local sellers for everything from iPhones to Apartments.
          </p>
          
          <div className="max-w-4xl mx-auto bg-white p-2.5 rounded-[2.5rem] shadow-2xl shadow-slate-200/60 border border-slate-100 flex flex-col md:flex-row gap-2">
            <div className="flex-grow relative flex items-center">
              <span className="material-icons absolute left-5 text-slate-400">search</span>
              <input className="w-full pl-14 pr-4 py-5 bg-transparent border-none focus:ring-0 text-sm font-medium" placeholder="I'm looking for a used Tesla..." type="text" />
            </div>
            <div className="w-px h-10 bg-slate-100 self-center hidden md:block"></div>
            <div className="md:w-64 relative flex items-center">
              <span className="material-icons absolute left-5 text-slate-400">location_on</span>
              <input className="w-full pl-14 pr-4 py-5 bg-transparent border-none focus:ring-0 text-sm font-bold text-slate-700" defaultValue="Toronto, ON" type="text" />
            </div>
            <Link to="/search" className="bg-primary hover:bg-primary-hover text-white px-12 py-5 rounded-[1.8rem] font-black transition-all flex items-center justify-center shadow-lg shadow-primary/25">
              Explore Now
            </Link>
          </div>

          <div className="mt-12 flex flex-wrap justify-center gap-8 text-xs font-bold text-slate-400 uppercase tracking-widest">
            <div className="flex items-center gap-2"><span className="material-icons text-primary text-sm">verified</span> Verified Sellers</div>
            <div className="flex items-center gap-2"><span className="material-icons text-primary text-sm">security</span> Secure Payments</div>
            <div className="flex items-center gap-2"><span className="material-icons text-primary text-sm">forum</span> Instant Chat</div>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 py-20">
        {/* How it Works - Guest Feature */}
        <section className="mb-32">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black mb-4">How it Works</h2>
            <p className="text-slate-500 max-w-lg mx-auto font-medium">Trading locally has never been simpler or more secure.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { step: '01', title: 'Find Your Item', desc: 'Browse through thousands of local listings or use our smart search filters.', icon: 'search' },
              { step: '02', title: 'Chat Instantly', desc: 'Message sellers directly through our secure platform to ask questions.', icon: 'chat' },
              { step: '03', title: 'Complete Trade', desc: 'Meet in a safe location, inspect the item, and finish the transaction.', icon: 'handshake' },
            ].map((item) => (
              <div key={item.step} className="relative group p-10 rounded-[3rem] bg-white border border-slate-100 hover:border-primary hover:shadow-2xl transition-all text-center">
                <div className="w-20 h-20 bg-primary/5 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:bg-primary group-hover:text-white transition-all">
                  <span className="material-icons text-4xl">{item.icon}</span>
                </div>
                <div className="absolute top-8 right-10 text-4xl font-black text-slate-50 group-hover:text-primary/10 transition-colors">{item.step}</div>
                <h3 className="text-xl font-black mb-4">{item.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed font-medium">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Categories */}
        <section className="mb-32">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-black mb-2">Browse by Category</h2>
              <p className="text-slate-500 font-medium">Fast tracking for what you need</p>
            </div>
            <Link to="/search" className="text-xs font-black text-primary uppercase tracking-widest hover:underline">View All Categories</Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
            {categories.map((cat) => (
              <Link key={cat.name} to="/search" className="bg-white p-8 rounded-3xl border border-slate-100 text-center hover:border-primary hover:shadow-2xl hover:-translate-y-1 transition-all group">
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/10 transition-all">
                  <span className="material-icons text-3xl text-slate-400 group-hover:text-primary">{cat.icon}</span>
                </div>
                <span className="text-xs font-black text-slate-700 uppercase tracking-widest">{cat.name}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Trending Ads */}
        <div className="flex flex-col lg:flex-row gap-16">
          <div className="flex-grow">
            <div className="flex justify-between items-end mb-10">
              <div>
                <h2 className="text-3xl font-black mb-2">Recently Added</h2>
                <p className="text-slate-500 font-medium">Hot items posted just moments ago</p>
              </div>
              <Link to="/search" className="text-xs font-black text-primary uppercase tracking-widest hover:underline">See all 4,200+</Link>
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
                      <div className="absolute top-5 left-5 bg-primary text-white text-[10px] font-black px-3 py-1.5 rounded-xl shadow-lg">FEATURED</div>
                    )}
                  </div>
                  <div className="p-8">
                    <div className="text-primary font-black text-2xl mb-2">${item.price.toLocaleString()}</div>
                    <h3 className="font-bold text-slate-800 line-clamp-2 min-h-[3rem] text-lg group-hover:text-primary transition-colors mb-4">{item.title}</h3>
                    <div className="flex items-center text-slate-400 text-[10px] font-black uppercase tracking-widest pt-5 border-t border-slate-50">
                      <span className="flex items-center gap-1.5"><span className="material-icons text-sm text-primary">location_on</span> {item.location}</span>
                      <span className="mx-3 text-slate-200">|</span>
                      <span>{item.time}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            
            <div className="mt-16 text-center">
              <Link to="/search" className="inline-block px-14 py-5 bg-slate-900 text-white rounded-[1.8rem] font-black hover:bg-slate-800 transition-all shadow-xl shadow-slate-200">
                Explore More Items
              </Link>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:w-80 space-y-10 flex-shrink-0">
            {/* Conditional CTA for Sidebar */}
            {!isLoggedIn && (
              <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden group">
                 <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/20 rounded-full blur-2xl group-hover:bg-primary/30 transition-colors"></div>
                 <h3 className="text-2xl font-black mb-4 relative z-10">Start Selling Today</h3>
                 <p className="text-slate-400 text-sm mb-8 leading-relaxed relative z-10 font-medium">Reach over 1 million local buyers in your area. It's fast, easy and free to post.</p>
                 <Link to="/login" className="block w-full bg-primary hover:bg-primary-hover text-white font-black py-4 rounded-2xl text-center transition-all shadow-lg shadow-primary/20">
                   Join MarketHub
                 </Link>
              </div>
            )}

            {/* Safety Section */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 p-10">
              <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-500 mb-6">
                <span className="material-icons">verified_user</span>
              </div>
              <h3 className="font-black mb-3 text-lg">Trust & Safety</h3>
              <p className="text-xs text-slate-500 leading-relaxed mb-6 font-medium">
                Every user is verified via email and phone. We use AI-powered fraud detection to keep you safe.
              </p>
              <ul className="space-y-4 mb-8">
                {['Verified Sellers Only', 'Encrypted Messaging', 'Fraud Protection'].map(t => (
                  <li key={t} className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-400">
                    <span className="material-icons text-green-500 text-sm">check_circle</span>
                    {t}
                  </li>
                ))}
              </ul>
              <a href="#" className="text-xs font-black text-primary hover:underline uppercase tracking-widest">Learn More</a>
            </div>

            {/* Promo */}
            <div className="rounded-[2.5rem] overflow-hidden relative aspect-[3/4] group cursor-pointer shadow-2xl shadow-slate-200">
              <img src="https://picsum.photos/seed/promo/600/800" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt="Promo" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent p-10 flex flex-col justify-end">
                <span className="bg-primary/20 backdrop-blur-md text-primary text-[10px] font-black tracking-widest uppercase mb-3 w-fit px-3 py-1 rounded-lg">MarketHub Business</span>
                <h4 className="text-white font-black text-2xl leading-tight mb-6">Scale your shop to a new level.</h4>
                <button className="bg-white text-slate-900 font-black py-3 rounded-xl text-sm px-6 w-fit hover:bg-slate-100 transition-colors">Get Started</button>
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* Stats - Social Proof */}
      <section className="bg-slate-50 py-24 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
            {[
              { label: 'Active Ads', value: '42K+' },
              { label: 'Daily Users', value: '1.2M+' },
              { label: 'Cities Covered', value: '850+' },
              { label: 'Avg Rating', value: '4.9/5' },
            ].map(stat => (
              <div key={stat.label}>
                <div className="text-4xl font-black text-slate-900 mb-2">{stat.value}</div>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 px-4">
        <div className="max-w-5xl mx-auto bg-primary rounded-[4rem] p-16 md:p-24 text-center text-white relative overflow-hidden shadow-[0_40px_100px_-20px_rgba(242,185,13,0.3)]">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.2),transparent)]"></div>
          <h2 className="text-4xl md:text-6xl font-black mb-8 relative z-10 leading-tight">Ready to join the<br/>MarketHub community?</h2>
          <p className="text-white/80 text-lg md:text-xl mb-12 max-w-xl mx-auto leading-relaxed relative z-10 font-medium">
            Sign up for free and start buying or selling in just a few clicks. It's time to trade better.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6 relative z-10">
            <Link to="/login" className="bg-white text-primary px-12 py-5 rounded-[2rem] font-black text-lg hover:bg-slate-50 transition-all shadow-xl">
              Create Free Account
            </Link>
            <Link to="/search" className="bg-slate-900/20 backdrop-blur-md text-white border border-white/30 px-12 py-5 rounded-[2rem] font-black text-lg hover:bg-white/10 transition-all">
              Browse Listings
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

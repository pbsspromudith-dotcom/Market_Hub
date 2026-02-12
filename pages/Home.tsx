
import React from 'react';
import { Link } from 'react-router-dom';
import { MOCK_LISTINGS } from '../constants';

const Home: React.FC = () => {
  const categories = [
    { name: 'Vehicles', icon: 'directions_car' },
    { name: 'Real Estate', icon: 'home' },
    { name: 'Jobs', icon: 'work' },
    { name: 'Pets', icon: 'pets' },
    { name: 'Electronics', icon: 'laptop_mac' },
    { name: 'More', icon: 'more_horiz' },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-white border-b border-slate-200 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">Find exactly what you're looking for</h1>
          <p className="text-slate-500 text-lg mb-10">Search millions of local listings for cars, jobs, real estate and more.</p>
          
          <div className="max-w-5xl mx-auto bg-slate-100 p-2 rounded-2xl shadow-xl flex flex-col md:flex-row gap-2">
            <div className="flex-1 relative flex items-center">
              <span className="material-icons absolute left-4 text-slate-400">search</span>
              <input className="w-full pl-12 pr-4 py-4 bg-transparent border-none focus:ring-0 text-sm" placeholder="What are you looking for?" type="text" />
            </div>
            <div className="w-px h-8 bg-slate-300 self-center hidden md:block"></div>
            <div className="flex-1 relative flex items-center">
              <span className="material-icons absolute left-4 text-slate-400">location_on</span>
              <input className="w-full pl-12 pr-4 py-4 bg-transparent border-none focus:ring-0 text-sm font-medium" defaultValue="Toronto, ON" type="text" />
            </div>
            <Link to="/search" className="bg-primary hover:bg-primary-hover text-white px-10 py-4 rounded-xl font-bold transition-all flex items-center justify-center">
              Search
            </Link>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Categories */}
        <section className="mb-16">
          <h2 className="text-xl font-bold mb-8">Top Categories</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
            {categories.map((cat) => (
              <Link key={cat.name} to="/search" className="bg-white p-6 rounded-2xl border border-slate-200 text-center hover:border-primary hover:shadow-lg transition-all group">
                <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary group-hover:text-white transition-all">
                  <span className="material-icons text-2xl">{cat.icon}</span>
                </div>
                <span className="text-sm font-bold text-slate-700">{cat.name}</span>
              </Link>
            ))}
          </div>
        </section>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Main Listings */}
          <div className="flex-grow">
            <div className="flex justify-between items-end mb-8">
              <div>
                <h2 className="text-2xl font-bold">Trending Ads</h2>
                <p className="text-slate-500">Fresh picks in your area</p>
              </div>
              <Link to="/search" className="text-primary font-bold hover:underline">View all</Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
              {MOCK_LISTINGS.map((item) => (
                <Link to={`/item/${item.id}`} key={item.id} className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl transition-all">
                  <div className="aspect-[4/3] relative overflow-hidden bg-slate-100">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <button className="absolute top-4 right-4 w-9 h-9 bg-white/80 backdrop-blur rounded-full flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors">
                      <span className="material-icons text-xl">favorite_border</span>
                    </button>
                    {item.isFeatured && (
                      <div className="absolute top-4 left-4 bg-primary text-white text-[10px] font-black px-2 py-1 rounded-md shadow-sm">FEATURED</div>
                    )}
                  </div>
                  <div className="p-5">
                    <div className="text-primary font-black text-xl mb-1">${item.price.toLocaleString()}</div>
                    <h3 className="font-bold text-slate-800 line-clamp-2 min-h-[3rem] group-hover:text-primary transition-colors">{item.title}</h3>
                    <div className="flex items-center text-slate-400 text-xs mt-4 pt-4 border-t border-slate-50">
                      <span className="material-icons text-sm mr-1">location_on</span>
                      {item.location}
                      <span className="mx-2">•</span>
                      {item.time}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            
            <div className="mt-12 text-center">
              <button className="px-12 py-4 border-2 border-slate-200 rounded-2xl font-bold hover:bg-slate-50 hover:border-primary transition-all">
                Load More Listings
              </button>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:w-80 space-y-8 flex-shrink-0">
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <h3 className="font-bold mb-6 flex items-center gap-2">
                <span className="material-icons text-primary">groups</span>
                Local Community
              </h3>
              <ul className="space-y-4">
                {['Local Events', 'Neighborhood Groups', 'Lost & Found', 'Volunteering'].map(link => (
                  <li key={link}>
                    <a href="#" className="flex justify-between items-center text-sm font-medium text-slate-600 hover:text-primary transition-colors">
                      {link}
                      <span className="material-icons text-lg">chevron_right</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-primary/10 rounded-2xl border border-primary/20 p-6">
              <h3 className="font-bold mb-3 flex items-center gap-2 text-primary">
                <span className="material-icons">verified_user</span>
                Stay Safe
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Always meet in a public place, inspect the item before paying, and never send money wire transfers.
              </p>
              <a href="#" className="text-xs font-bold text-primary hover:underline">Read Safety Guidelines</a>
            </div>

            <div className="rounded-2xl overflow-hidden relative aspect-[4/5] group cursor-pointer shadow-lg">
              <img src="https://picsum.photos/seed/promo/400/500" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Promo" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-6 flex flex-col justify-end">
                <span className="text-primary text-[10px] font-black tracking-widest uppercase mb-2">Sponsored</span>
                <h4 className="text-white font-extrabold text-xl leading-tight mb-4">Grow your small business with Marketplace Pro</h4>
                <button className="bg-primary text-white font-bold py-2 rounded-lg text-sm w-fit px-4">Learn More</button>
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* App CTA */}
      <section className="bg-slate-50 py-20 mt-12 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-primary rounded-[3rem] p-12 flex flex-col md:flex-row items-center gap-12 text-white">
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-4xl font-black mb-6">Take the Marketplace with you</h2>
              <p className="text-white/90 text-lg mb-8 leading-relaxed">
                Get the best experience and real-time notifications by downloading our mobile app. Available on iOS and Android.
              </p>
              <div className="flex flex-wrap justify-center md:justify-start gap-4">
                <button className="bg-white text-slate-900 px-8 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-slate-100 transition-all shadow-lg">
                  <span className="material-icons">apple</span> App Store
                </button>
                <button className="bg-white text-slate-900 px-8 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-slate-100 transition-all shadow-lg">
                  <span className="material-icons">android</span> Play Store
                </button>
              </div>
            </div>
            <div className="hidden lg:block w-72 h-[32rem] bg-zinc-800 rounded-[2.5rem] border-[6px] border-zinc-700 relative shadow-2xl overflow-hidden p-6">
               <div className="w-12 h-1 bg-zinc-600 rounded-full mx-auto mb-10"></div>
               <div className="space-y-4">
                 <div className="h-8 bg-zinc-700/50 rounded-lg"></div>
                 <div className="grid grid-cols-2 gap-2">
                   <div className="h-24 bg-primary/30 rounded-lg"></div>
                   <div className="h-24 bg-zinc-700/50 rounded-lg"></div>
                 </div>
                 <div className="h-40 bg-zinc-700/50 rounded-lg"></div>
               </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

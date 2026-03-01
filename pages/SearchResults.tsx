import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const SearchResults: React.FC = () => {
  const [sliderMaxPrice, setSliderMaxPrice] = useState(100000);
  const [absoluteMaxPrice, setAbsoluteMaxPrice] = useState(100000);
  const [listings, setListings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialQ = queryParams.get('q') || '';
  const initialLoc = queryParams.get('loc') || localStorage.getItem('user_location') || '';

  // Filter States
  const [searchQuery, setSearchQuery] = useState(initialQ);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [locationSearch, setLocationSearch] = useState(initialLoc);
  const [distance, setDistance] = useState('Within 50 km');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortOption, setSortOption] = useState('Most Recent');
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);

  useEffect(() => {
    setIsLoading(true);
    fetch('/api/listings/read.php')
      .then(res => res.json())
      .then(data => {
        setListings(data);
        const highestPrice = data.reduce((max: number, item: any) => Math.max(max, Number(item.price) || 0), 0);
        const calcMax = highestPrice > 0 ? highestPrice + 10000 : 100000;
        setAbsoluteMaxPrice(calcMax);
        setSliderMaxPrice(calcMax);
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  const filteredListings = listings.filter(item => {
    // text search query
    if (searchQuery && !item.title.toLowerCase().includes(searchQuery.toLowerCase()) && !item.description?.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    
    // category filter
    if (selectedCategory && item.category !== selectedCategory) return false;
    
    // location filter (simple text match treating 10km/50km as "within same city")
    if (distance !== 'Nationwide' && locationSearch && item.location) {
      const searchCity = locationSearch.split(',')[0].trim().toLowerCase();
      if (!item.location.toLowerCase().includes(searchCity)) return false;
    }
    
    // minPrice
    if (minPrice && Number(item.price) < Number(minPrice)) return false;
    
    // maxPrice
    if (maxPrice && Number(item.price) > Number(maxPrice)) return false;

    // mock condition logic (since DB doesn't have it yet)
    const mockCondition = item.id % 3 === 0 ? 'Certified' : (item.id % 2 === 0 ? 'New' : 'Used');
    if (selectedConditions.length > 0 && !selectedConditions.includes(mockCondition)) return false;

    // max price slider logic
    if (sliderMaxPrice < absoluteMaxPrice && Number(item.price) > sliderMaxPrice) return false;

    return true;
  }).sort((a, b) => {
    if (sortOption === 'Price: Low to High') return Number(a.price) - Number(b.price);
    if (sortOption === 'Price: High to Low') return Number(b.price) - Number(a.price);
    return b.id - a.id; // Default: Most Recent
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar Filters */}
        <aside className="col-span-12 lg:col-span-3 space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm sticky top-24">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold">Filters</h2>
              <button 
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory(null);
                  setLocationSearch('');
                  setDistance('Within 50 km');
                  setMinPrice('');
                  setMaxPrice('');
                  setSortOption('Most Recent');
                  setSelectedConditions([]);
                  setSliderMaxPrice(absoluteMaxPrice);
                }}
                className="text-xs font-bold text-primary uppercase tracking-widest hover:underline"
              >
                Clear All
              </button>
            </div>

            <div className="space-y-8">
              <section>
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Search</h3>
                <div className="relative">
                  <span className="material-icons absolute left-3 top-2.5 text-slate-400 text-lg">search</span>
                  <input 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-slate-50 border-slate-200 rounded-xl text-sm focus:ring-primary focus:border-primary" 
                    placeholder="Keywords..." 
                    type="text" 
                  />
                </div>
              </section>

              <section>
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Category</h3>
                <ul className="space-y-3">
                  {['Vehicles', 'Electronics', 'Furniture', 'Real Estate', 'Jobs', 'Pets', 'Baby Items', 'Other'].map((cat) => (
                    <li 
                      key={cat} 
                      onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
                      className={`flex justify-between items-center text-sm font-medium cursor-pointer transition-colors ${selectedCategory === cat ? 'text-primary' : 'text-slate-600 hover:text-primary'}`}
                    >
                      {cat}
                      {selectedCategory === cat && <span className="material-icons text-xs">check</span>}
                    </li>
                  ))}
                </ul>
              </section>

              <section>
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Location</h3>
                <div className="relative mb-3">
                  <span className="material-icons absolute left-3 top-2.5 text-slate-400 text-lg">search</span>
                  <input 
                    value={locationSearch}
                    onChange={(e) => setLocationSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-slate-50 border-slate-200 rounded-xl text-sm focus:ring-primary focus:border-primary" 
                    placeholder="Postal Code or City" 
                    type="text" 
                  />
                </div>
                <select 
                  value={distance}
                  onChange={e => setDistance(e.target.value)}
                  className="w-full py-2 bg-slate-50 border-slate-200 rounded-xl text-sm focus:ring-primary focus:border-primary"
                >
                  <option value="Within 10 km">Within 10 km</option>
                  <option value="Within 50 km">Within 50 km</option>
                  <option value="Nationwide">Nationwide</option>
                </select>
              </section>

              <section>
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Price Range</h3>
                <div className="flex items-center gap-2">
                  <input 
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border-slate-200 rounded-xl text-sm focus:border-primary focus:ring-primary" 
                    placeholder="Min" 
                    type="number" 
                  />
                  <span className="text-slate-300">-</span>
                  <input 
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border-slate-200 rounded-xl text-sm focus:border-primary focus:ring-primary" 
                    placeholder="Max" 
                    type="number" 
                  />
                </div>
              </section>

              <section>
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Condition</h3>
                <div className="space-y-3">
                  {['New', 'Used', 'Certified'].map(cond => (
                    <label key={cond} className="flex items-center gap-3 cursor-pointer group">
                      <input 
                        type="checkbox" 
                        checked={selectedConditions.includes(cond)}
                        onChange={(e) => {
                          if (e.target.checked) setSelectedConditions([...selectedConditions, cond]);
                          else setSelectedConditions(selectedConditions.filter(c => c !== cond));
                        }}
                        className="w-5 h-5 rounded border-slate-200 text-primary focus:ring-primary" 
                      />
                      <span className="text-sm font-medium text-slate-600 group-hover:text-primary transition-colors">{cond}</span>
                    </label>
                  ))}
                </div>
              </section>

              <section>
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Max Price: ${sliderMaxPrice === absoluteMaxPrice ? `${Math.floor(absoluteMaxPrice/1000)}k+` : sliderMaxPrice.toLocaleString()}</h3>
                <input 
                  type="range" 
                  min="0" 
                  max={absoluteMaxPrice} 
                  step="1000"
                  value={sliderMaxPrice} 
                  onChange={(e) => setSliderMaxPrice(parseInt(e.target.value))}
                  className="w-full accent-primary" 
                />
                <div className="flex justify-between text-[10px] font-bold text-slate-400 mt-2">
                  <span>$0</span>
                  <span>${Math.floor(absoluteMaxPrice/1000)}k+</span>
                </div>
              </section>
            </div>
          </div>

          <div className="bg-primary/5 rounded-2xl p-6 text-center border border-primary/10">
            <span className="text-[10px] font-black text-primary uppercase tracking-widest mb-2 block">Sponsored</span>
            <h4 className="font-bold mb-2">Sell your car today!</h4>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">Get a free instant quote and sell in 24 hours.</p>
            <button className="bg-slate-900 text-white font-bold py-2 px-6 rounded-lg text-xs shadow-md">Get Quote</button>
          </div>
        </aside>

        {/* Results Content */}
        <main className="col-span-12 lg:col-span-9 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <nav className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                Home / Search Results
              </nav>
              <h1 className="text-2xl font-black">{filteredListings.length} Results Found</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Sort by:</span>
              <select 
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="text-sm border-slate-200 rounded-xl focus:ring-primary focus:border-primary pr-10"
              >
                <option value="Most Recent">Most Recent</option>
                <option value="Price: Low to High">Price: Low to High</option>
                <option value="Price: High to Low">Price: High to Low</option>
              </select>
            </div>
          </div>

            <div className="space-y-4">
              {isLoading && <p className="text-center p-10 font-bold">Loading listings...</p>}
              {!isLoading && filteredListings.length === 0 && <p className="text-center p-10 font-bold text-slate-500">No matching listings found.</p>}
              {filteredListings.map((item) => (
              <Link 
                to={`/item/${item.id}`} 
                key={item.id} 
                className={`group flex flex-col md:flex-row bg-white rounded-2xl border overflow-hidden hover:shadow-lg transition-all ${item.is_featured ? 'border-primary/30 ring-1 ring-primary/10' : 'border-slate-200'}`}
              >
                <div className="w-full md:w-64 aspect-video md:aspect-square flex-shrink-0 relative bg-slate-100 flex items-center justify-center">
                  <img src={item.image || 'https://picsum.photos/seed/default/800/600'} alt={item.title} className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-500" />
                  {item.is_featured ? (
                    <div className="absolute top-3 left-3 bg-primary text-white text-[10px] font-black px-2 py-0.5 rounded-md flex items-center gap-1 shadow-sm">
                      <span className="material-icons text-xs">star</span> FEATURED
                    </div>
                  ) : null}
                </div>
                <div className="p-6 flex-grow flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start gap-4 mb-2">
                      <h3 className="text-xl font-bold group-hover:text-primary transition-colors leading-tight">{item.title}</h3>
                      <span className="text-2xl font-black text-slate-900">\${Number(item.price).toLocaleString()}</span>
                    </div>
                    <p className="text-sm text-slate-500 line-clamp-2 mb-4">
                      {item.description || "No description provided."}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-slate-100 rounded-full text-[10px] font-bold text-slate-500 uppercase tracking-wide">{item.category}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-50">
                    <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      <span className="flex items-center gap-1"><span className="material-icons text-sm">location_on</span> {item.location}</span>
                      <span className="flex items-center gap-1"><span className="material-icons text-sm">schedule</span> {item.time || 'Recently'}</span>
                    </div>
                    <button className="material-icons text-slate-300 hover:text-red-500 transition-colors">favorite_border</button>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="flex justify-center gap-2 pt-10">
            <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-primary text-white font-bold">1</button>
            <button className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-slate-100 font-bold transition-colors">2</button>
            <button className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-slate-100 font-bold transition-colors">3</button>
            <span className="w-10 h-10 flex items-center justify-center text-slate-300">...</span>
            <button className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-slate-100 font-bold transition-colors">12</button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SearchResults;

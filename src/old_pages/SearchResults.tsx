"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { formatPrice } from '../constants';
import { calculateDistance } from '../utils';

const CATEGORY_SYNONYMS: Record<string, string[]> = {
  'Vehicles': ['vehicle', 'vehicles', 'car', 'cars', 'truck', 'trucks', 'suv', 'suvs', 'motorcycle', 'motorcycles', 'auto', 'automotive', 'boat', 'boats', 'rv', 'rvs', 'van', 'vans', 'atv', 'atvs', 'classic car', 'classic cars', 'heavy equipment', 'trailers', 'trailer', 'auto parts', 'motor', 'motors', 'wheel', 'wheels', 'drive'],
  'Real Estate': ['real estate', 'estate', 'property', 'properties', 'house', 'houses', 'condo', 'condos', 'apartment', 'apartments', 'rent', 'rentals', 'rental', 'housing', 'land', 'basement', 'basements', 'room', 'rooms', 'office', 'commercial', 'storefront', 'storage', 'flat', 'flats', 'studio', 'accommodation', 'lease'],
  'Jobs': ['job', 'jobs', 'work', 'career', 'careers', 'employment', 'hiring', 'recruitment', 'staff', 'position', 'positions', 'internship', 'internships', 'cash job', 'gig', 'gigs', 'part-time', 'full-time', 'vacancy', 'vacancies', 'hire', 'resume'],
  'Local Services': ['service', 'services', 'handyman', 'trades', 'contractor', 'plumber', 'plumbing', 'electrician', 'electrical', 'mover', 'movers', 'moving', 'cleaner', 'cleaning', 'painter', 'painting', 'renovation', 'repair', 'pest control', 'roofing', 'tutor', 'lessons', 'helper', 'hauling', 'plumb', 'electric'],
  'Buy & Sell': ['buy', 'sell', 'sale', 'item', 'items', 'furniture', 'tools', 'appliances', 'decor', 'musical', 'sports', 'collectibles', 'antique', 'antiques', 'tickets', 'garage sale', 'yard sale', 'free stuff', 'deals', 'closet', 'thrift'],
  'Business & Industrial': ['business', 'industrial', 'machinery', 'equipment', 'wholesale', 'liquidation', 'supplies', 'manufacturing', 'warehouse', 'factory', 'commercial supply'],
  'Community': ['community', 'events', 'event', 'volunteer', 'volunteers', 'news', 'lost & found', 'lost and found', 'artists', 'musicians', 'partners', 'club', 'clubs', 'group', 'groups', 'meetup'],
  'Pets': ['pet', 'pets', 'dog', 'dogs', 'puppy', 'puppies', 'cat', 'cats', 'kitten', 'kittens', 'fish', 'bird', 'birds', 'adoption', 'accessories', 'veterinary', 'vet', 'animal', 'animals', 'food'],
  'Home & Garden': ['home', 'garden', 'furniture', 'decor', 'kitchen', 'lighting', 'renovation', 'yard', 'patio', 'plants', 'plant', 'lawn', 'mower', 'sofa', 'chair', 'table', 'bed', 'mattress'],
  'Electronics & Computers': ['electronic', 'electronics', 'computer', 'computers', 'tech', 'device', 'devices', 'laptop', 'laptops', 'phone', 'phones', 'smartphone', 'smartphones', 'tv', 'tvs', 'television', 'audio', 'console', 'consoles', 'ps5', 'playstation', 'xbox', 'nintendo', 'switch', 'camera', 'cameras', 'networking', 'gadget', 'gadgets', 'pc', 'monitor', 'screen', 'screens', 'ipad', 'tablet', 'tablets', 'iphone', 'android'],
  'Fashion & Beauty': ['fashion', 'clothing', 'clothes', 'beauty', 'makeup', 'apparel', 'shoes', 'footwear', 'jewelry', 'bag', 'bags', 'wallet', 'wallets', 'watch', 'watches', 'skincare', 'fragrance', 'perfume', 'salon', 'barber', 'shirt', 'pants', 'dress', 'cosmetics', 'nails'],
  'Events & Entertainment': ['event', 'events', 'entertainment', 'concert', 'concerts', 'ticket', 'tickets', 'party', 'wedding', 'dj', 'catering', 'show', 'shows', 'festival', 'gigs', 'performance']
};

const getSynonymCategoryKey = (rootCategory: string): string => {
  if (rootCategory === 'Cars') return 'Vehicles';
  if (rootCategory === 'Electronics') return 'Electronics & Computers';
  return rootCategory;
};

const ITEMS_PER_PAGE = 10;

const SearchResults: React.FC = () => {
  const [sliderMaxPrice, setSliderMaxPrice] = useState(100000);
  const [absoluteMaxPrice, setAbsoluteMaxPrice] = useState(100000);
  const [listings, setListings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const location = { pathname, search: searchParams ? "?" + searchParams.toString() : "", state: null };
  const queryParams = new URLSearchParams(location.search);
  const initialQ = queryParams.get('q') || '';
  const initialCat = queryParams.get('cat') || null;
  const initialSub = queryParams.get('sub') || null;
  const initialSubSub = queryParams.get('subsub') || null;
  const initialLoc = queryParams.get('loc') || '';

  // Filter States
  const [searchQuery, setSearchQuery] = useState(initialQ);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(initialCat);
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(initialSub);
  const [selectedSubSubCategory, setSelectedSubSubCategory] = useState<string | null>(initialSubSub);
  const [locationSearch, setLocationSearch] = useState(initialLoc);
  const [locationFilterActive, setLocationFilterActive] = useState(!!initialLoc);
  const [distance, setDistance] = useState('Within 50 miles');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortOption, setSortOption] = useState('Most Recent');
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);

  // Sub-master Category States
  const [makes, setMakes] = useState<any[]>([]);
  const [models, setModels] = useState<any[]>([]);
  const [selectedMakeId, setSelectedMakeId] = useState('');
  const [selectedModelId, setSelectedModelId] = useState('');

  // Location suggestions
  const [locationSuggestions, setLocationSuggestions] = useState<any[]>([]);
  const [isSearchingLocation, setIsSearchingLocation] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Update states if URL changes
  useEffect(() => {
    setSearchQuery(queryParams.get('q') || '');
    setSelectedCategory(queryParams.get('cat') || null);
    setSelectedSubCategory(queryParams.get('sub') || null);
    setSelectedSubSubCategory(queryParams.get('subsub') || null);
    const loc = queryParams.get('loc') || '';
    setLocationSearch(loc);
    setLocationFilterActive(!!loc);
  }, [location.search]);

  useEffect(() => {
    setIsLoading(true);
    fetch('/api/listings/read')
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

    // Fetch options for dropdowns
    fetch('/api/options/read')
      .then(res => res.json())
      .then(data => {
        if (data && data.success && Array.isArray(data.data)) {
          setMakes(data.data.filter((opt: any) => opt.option_type === 'car_make'));
          setModels(data.data.filter((opt: any) => opt.option_type === 'car_model'));
        }
      })
      .catch(console.error);
  }, []);

  // Normalize category aliases: DB has both 'Cars' and 'Vehicles' for the same category
  const CATEGORY_ALIASES: Record<string, string[]> = {
    'Vehicles': ['Vehicles', 'Cars'],
    'Cars': ['Vehicles', 'Cars'],
    'Electronics & Computers': ['Electronics', 'Electronics & Computers'],
    'Electronics': ['Electronics', 'Electronics & Computers'],
    'Home & Garden': ['Home & Garden'],
    'Real Estate': ['Real Estate'],
    'Jobs': ['Jobs'],
  };

  useEffect(() => {
    if (locationSearch.trim().length > 2 && showSuggestions) {
      const delayFn = setTimeout(() => {
        setIsSearchingLocation(true);
        fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(locationSearch)}&countrycodes=ca&format=json&addressdetails=1&limit=5`,
        )
          .then((res) => res.json())
          .then((data) => setLocationSuggestions(data))
          .catch(console.error)
          .finally(() => setIsSearchingLocation(false));
      }, 500);
      return () => clearTimeout(delayFn);
    } else {
      setLocationSuggestions([]);
    }
  }, [locationSearch, showSuggestions]);

  const handleSelectLocation = (place: any) => {
    const city = place.address?.city || place.address?.town || place.address?.village || '';
    const state = place.address?.state || '';
    const cleanAddr = city ? `${city}, ${state}` : state || place.display_name.split(',')[0];
    
    setLocationSearch(cleanAddr);
    localStorage.setItem("user_location", cleanAddr);
    if (place.lat && place.lon) {
      localStorage.setItem("user_lat", place.lat);
      localStorage.setItem("user_lon", place.lon);
    }
    window.dispatchEvent(new Event("location_updated"));
    setShowSuggestions(false);
  };

  const getSearchRelevanceScore = (item: any, query: string): number => {
    if (!query) return 0;
    
    const terms = query.toLowerCase().split(/\s+/).filter(t => t.length > 1);
    if (terms.length === 0) return 0;
    
    let score = 0;
    const titleLower = item.title.toLowerCase();
    const descLower = (item.description || '').toLowerCase();
    const catLower = (item.category || '').toLowerCase();
    const rootCat = item.category ? item.category.split(' > ')[0].trim() : '';
    const synonymKey = getSynonymCategoryKey(rootCat);
    const synonyms = CATEGORY_SYNONYMS[synonymKey] || [];
    
    terms.forEach(term => {
      // 1. Title Exact / Word / Substring matches
      if (titleLower === term) {
        score += 20; // Exact match on title
      } else if (titleLower.includes(` ${term} `) || titleLower.startsWith(`${term} `) || titleLower.endsWith(` ${term}`)) {
        score += 15; // Whole word match in title
      } else if (titleLower.includes(term)) {
        score += 8;  // Substring match in title
      }
      
      // 2. Category match
      if (catLower.includes(term)) {
        score += 10;
      }
      
      // 3. Synonym matches
      const isSynonym = synonyms.some(syn => syn === term || (term.length > 3 && syn.includes(term)) || (syn.length > 3 && term.includes(syn)));
      if (isSynonym) {
        score += 8;
      }
      
      // 4. Description match
      if (descLower.includes(` ${term} `) || descLower.startsWith(`${term} `) || descLower.endsWith(` ${term}`)) {
        score += 4;
      } else if (descLower.includes(term)) {
        score += 2;
      }
    });
    
    return score;
  };

  const filteredListings = listings.map(item => {
    const relevanceScore = searchQuery ? getSearchRelevanceScore(item, searchQuery) : 0;
    return { ...item, relevanceScore };
  }).filter(item => {
    // If a text search query was entered, only keep items that have a relevance score > 0
    if (searchQuery && item.relevanceScore === 0) return false;
    
    // category filter — support aliases so 'Vehicles' also matches 'Cars'
    if (selectedCategory) {
      const aliases = CATEGORY_ALIASES[selectedCategory] || [selectedCategory];
      const match = aliases.some(alias => {
        if (selectedSubCategory) {
          if (selectedSubSubCategory) {
            return item.category === `${alias} > ${selectedSubCategory} > ${selectedSubSubCategory}`;
          }
          return item.category === `${alias} > ${selectedSubCategory}` || item.category.startsWith(`${alias} > ${selectedSubCategory} >`);
        }
        return item.category === alias || item.category.startsWith(alias + ' > ');
      });
      if (!match) return false;
    }
    
    // location filter — only active if user explicitly set a location in filter
    if (locationFilterActive && distance !== 'Nationwide' && locationSearch && item.location) {
      const userLat = parseFloat(localStorage.getItem("user_lat") || "");
      const userLon = parseFloat(localStorage.getItem("user_lon") || "");
      
      if (!isNaN(userLat) && !isNaN(userLon) && item.latitude && item.longitude) {
        const dist = calculateDistance(userLat, userLon, parseFloat(item.latitude), parseFloat(item.longitude));
        // Parse distance string to number
        const maxDistMatch = distance.match(/\d+/);
        const maxDist = maxDistMatch ? parseInt(maxDistMatch[0], 10) : 50;
        
        if (dist > maxDist) return false;
      } else {
        // Fallback to basic text search if no coordinates
        const searchCity = locationSearch.split(',')[0].trim().toLowerCase();
        if (!item.location.toLowerCase().includes(searchCity)) return false;
      }
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
    // If we have a search query and the sort option is "Most Recent" (default), sort by relevance score first!
    if (searchQuery && sortOption === 'Most Recent') {
      if (b.relevanceScore !== a.relevanceScore) {
        return b.relevanceScore - a.relevanceScore;
      }
    }
    // Fall back to standard sort options
    if (sortOption === 'Price: Low to High') return Number(a.price) - Number(b.price);
    if (sortOption === 'Price: High to Low') return Number(b.price) - Number(a.price);
    return b.id - a.id;
  });

  const totalPages = Math.max(1, Math.ceil(filteredListings.length / ITEMS_PER_PAGE));
  const paginatedListings = filteredListings.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  // Reset to page 1 when filters change
  const resetPage = () => setCurrentPage(1);

  return (
    <div className="w-full bg-slate-50 min-h-screen">
      {selectedCategory === 'Vehicles' && (
        <div className="w-full bg-slate-900 relative flex flex-col items-center justify-center pt-24 pb-48 mb-20 overflow-visible">
          <div className="absolute inset-0 opacity-40 z-0">
            <img src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1280&q=70" alt="Find cars for sale on HitAds.ca" loading="lazy" className="w-full h-full object-cover" />
          </div>
          
          <div className="relative z-10 text-center text-white mb-8 px-4">
            <h1 className="text-4xl md:text-5xl font-black mb-3 drop-shadow-lg">Find Cars for Sale</h1>
            <p className="text-lg md:text-xl font-medium drop-shadow-md">Search thousands of ads on the local motors marketplace</p>
          </div>

          {/* Floating Filter Card */}
          <div className="absolute -bottom-24 w-full max-w-5xl z-20 px-4">
            <div className="bg-white rounded-xl shadow-2xl p-6 border border-slate-100">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-widest font-black text-slate-400 mb-2">Make</label>
                  <select 
                    value={selectedMakeId}
                    onChange={(e) => { setSelectedMakeId(e.target.value); setSelectedModelId(''); }}
                    className="w-full border-slate-200 rounded-lg text-sm bg-slate-50 py-2.5 px-3 focus:ring-primary focus:border-primary font-bold text-slate-700"
                  >
                    <option value="">Select make</option>
                    {makes.map(make => (
                      <option key={make.id} value={make.id}>{make.option_value}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-widest font-black text-slate-400 mb-2">Model</label>
                  <select 
                    value={selectedModelId}
                    onChange={(e) => setSelectedModelId(e.target.value)}
                    className="w-full border-slate-200 rounded-lg text-sm bg-slate-50 py-2.5 px-3 focus:ring-primary focus:border-primary font-bold text-slate-700 disabled:opacity-50"
                    disabled={!selectedMakeId}
                  >
                    <option value="">Select model</option>
                    {models
                      .filter(model => model.parent_id === Number(selectedMakeId))
                      .map(model => (
                        <option key={model.id} value={model.id}>{model.option_value}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-widest font-black text-slate-400 mb-2">Min Price</label>
                  <select className="w-full border-slate-200 rounded-lg text-sm bg-slate-50 py-2.5 px-3 focus:ring-primary focus:border-primary font-bold text-slate-700">
                    <option>No min</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-widest font-black text-slate-400 mb-2">Max Price</label>
                  <select className="w-full border-slate-200 rounded-lg text-sm bg-slate-50 py-2.5 px-3 focus:ring-primary focus:border-primary font-bold text-slate-700">
                    <option>No max</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div className="md:col-span-2">
                  <label className="block text-[11px] uppercase tracking-widest font-black text-slate-400 mb-2">Location</label>
                  <div className="relative">
                    <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">location_on</span>
                    <input 
                      type="text" 
                      placeholder="Canada" 
                      value={locationSearch}
                      onChange={(e) => {
                        setLocationSearch(e.target.value);
                        setShowSuggestions(true);
                      }}
                      className="w-full border-slate-200 rounded-lg text-sm bg-slate-50 py-2.5 pl-10 pr-4 focus:ring-primary focus:border-primary font-bold text-slate-700" 
                    />
                    {showSuggestions && locationSuggestions.length > 0 && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-xl z-[60] overflow-hidden">
                        {locationSuggestions.map((place, idx) => (
                          <div 
                            key={idx} 
                            className="px-4 py-3 hover:bg-slate-50 cursor-pointer border-b border-slate-100 last:border-0"
                            onClick={() => handleSelectLocation(place)}
                          >
                            <div className="font-bold text-sm text-slate-800">
                              {place.address?.city || place.address?.town || place.address?.village || place.display_name.split(",")[0]}
                            </div>
                            <div className="text-xs text-slate-500">{place.display_name}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <button className="w-full bg-[#62b914] hover:bg-[#52a10d] text-white font-bold py-3 rounded-lg transition-colors shadow-md">
                    Search Cars ({filteredListings.length.toLocaleString()})
                  </button>
                </div>
              </div>
              
              <div className="mt-4 border-t border-slate-100 pt-3">
                <button className="text-xs font-bold text-slate-500 flex items-center gap-1 hover:text-primary transition-colors">
                  More options <span className="material-icons text-sm">expand_more</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className={`w-full px-4 sm:px-6 lg:px-10 ${selectedCategory === 'Vehicles' ? 'pt-24 pb-8' : 'py-8'}`}>

      {/* Mobile Filter Overlay */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-[100] bg-white overflow-y-auto lg:hidden animate-in slide-in-from-bottom-full duration-300">
          <div className="sticky top-0 bg-white border-b border-slate-100 px-4 py-4 flex items-center justify-between shadow-sm">
            <h2 className="text-lg font-black">Filters</h2>
            <button 
              onClick={() => setShowMobileFilters(false)}
              className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
            >
              <span className="material-icons">close</span>
            </button>
          </div>
          
          <div className="p-6 space-y-8 pb-24">
            {/* Search Query */}
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Keyword</label>
              <div className="relative">
                <span className="material-icons absolute left-4 top-3.5 text-slate-300">search</span>
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="What are you looking for?"
                  className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Price Range ($)</label>
              <div className="grid grid-cols-2 gap-4">
                <input 
                  type="number" 
                  placeholder="Min" 
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-sm font-bold focus:ring-2 focus:ring-primary/20"
                />
                <input 
                  type="number" 
                  placeholder="Max" 
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-sm font-bold focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Location</label>
              <div className="relative">
                <span className="material-icons absolute left-4 top-3.5 text-slate-300">place</span>
                <input 
                  type="text" 
                  value={locationSearch}
                  onChange={(e) => {
                    setLocationSearch(e.target.value);
                    setShowSuggestions(true);
                  }}
                  placeholder="City or Postcode"
                  className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:ring-2 focus:ring-primary/20"
                />
                {showSuggestions && locationSuggestions.length > 0 && (
                  <div className="mt-2 bg-white border border-slate-200 rounded-2xl shadow-lg z-[60] overflow-hidden">
                    {locationSuggestions.map((place, idx) => (
                      <div 
                        key={idx} 
                        className="px-4 py-3 hover:bg-slate-50 cursor-pointer border-b border-slate-100 last:border-0"
                        onClick={() => handleSelectLocation(place)}
                      >
                        <div className="font-bold text-sm text-slate-800">
                          {place.address?.city || place.address?.town || place.address?.village || place.display_name.split(",")[0]}
                        </div>
                        <div className="text-xs text-slate-500 truncate">{place.display_name}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Category-specific filters */}
            {selectedCategory === 'Vehicles' && (
              <div className="space-y-6 pt-6 border-t border-slate-100">
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Make</label>
                  <select 
                    value={selectedMakeId}
                    onChange={(e) => { setSelectedMakeId(e.target.value); setSelectedModelId(''); }}
                    className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-sm font-bold focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="">All Makes</option>
                    {makes.map(make => (
                      <option key={make.id} value={make.id}>{make.option_value}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Model</label>
                  <select 
                    value={selectedModelId}
                    onChange={(e) => setSelectedModelId(e.target.value)}
                    disabled={!selectedMakeId}
                    className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-sm font-bold focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
                  >
                    <option value="">All Models</option>
                    {models
                      .filter(model => model.parent_id === Number(selectedMakeId))
                      .map(model => (
                        <option key={model.id} value={model.id}>{model.option_value}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>

          <div className="fixed bottom-0 left-0 w-full p-4 bg-white border-t border-slate-100 flex gap-4">
            <button 
              onClick={() => {
                setMinPrice('');
                setMaxPrice('');
                setSearchQuery('');
                setLocationSearch('');
                setSelectedMakeId('');
                setSelectedModelId('');
              }}
              className="flex-1 py-4 text-sm font-black text-slate-400 uppercase tracking-widest"
            >
              Reset
            </button>
            <button 
              onClick={() => setShowMobileFilters(false)}
              className="flex-[2] bg-primary text-white py-4 rounded-2xl text-sm font-black uppercase tracking-widest shadow-xl shadow-primary/20"
            >
              Show Results
            </button>
          </div>
        </div>
      )}

      {/* Mobile Filter Toggle Bar */}
      <div className="lg:hidden flex items-center justify-between mb-4 bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
        <span className="text-sm font-black text-slate-700">{filteredListings.length} Results</span>
        <button
          onClick={() => setShowMobileFilters(!showMobileFilters)}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl text-sm font-bold"
        >
          <span className="material-icons text-sm">tune</span>
          {showMobileFilters ? 'Hide Filters' : 'Show Filters'}
        </button>
      </div>

      <div className="flex flex-col gap-8">
        {/* Results Content */}
        <main className="w-full space-y-6">
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

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {isLoading && <p className="text-center p-10 font-bold col-span-full">Loading listings...</p>}
              {!isLoading && filteredListings.length === 0 && <p className="text-center p-10 font-bold text-slate-500 col-span-full">No matching listings found.</p>}
              {paginatedListings.map((item) => (
              <Link href={`/item/${item.id}`} 
                key={item.id} 
                className={`group flex flex-col bg-white rounded-2xl border overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all ${item.is_featured ? 'border-primary/30 ring-1 ring-primary/10' : 'border-slate-200'}`}
              >
                <div className="w-full aspect-[4/3] flex-shrink-0 relative bg-slate-100 flex items-center justify-center overflow-hidden">
                  <img src={item.image || 'https://picsum.photos/seed/default/800/600'} alt={item.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  {item.is_home_gallery ? (
                    <div className="absolute top-3 left-3 bg-blue-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded-md flex items-center gap-1 shadow-sm">
                      <span className="material-icons text-xs">home</span> HOME PAGE
                    </div>
                  ) : item.is_featured ? (
                    <div className="absolute top-3 left-3 bg-primary text-white text-[10px] font-black px-2 py-0.5 rounded-md flex items-center gap-1 shadow-sm">
                      <span className="material-icons text-xs">star</span> FEATURED
                    </div>
                  ) : null}
                </div>
                <div className="p-5 flex-grow flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start gap-2 mb-2">
                      <h3 className="text-base font-bold group-hover:text-primary transition-colors leading-tight line-clamp-2">{item.title}</h3>
                    </div>
                     <span className="text-xl font-black text-slate-900 mb-2 block">{formatPrice(item.price, item.price_type)}</span>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="px-2 py-1 bg-slate-100 rounded-md text-[10px] font-bold text-slate-500 uppercase tracking-wide truncate max-w-full">{item.category}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-50">
                    <div className="flex flex-col gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      <span className="flex items-center gap-1 truncate"><span className="material-icons text-[12px]">location_on</span> {item.location}</span>
                      <span className="flex items-center gap-1"><span className="material-icons text-[12px]">schedule</span> {item.created_at ? new Date(item.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : (item.time || 'Recently')}</span>
                    </div>
                    <button className="material-icons text-slate-300 hover:text-red-500 transition-colors bg-slate-50 p-1.5 rounded-full hover:bg-red-50">favorite_border</button>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 pt-10 flex-wrap">
              {/* Prev */}
              <button
                onClick={() => { setCurrentPage(p => Math.max(1, p - 1)); window.scrollTo(0, 0); }}
                disabled={currentPage === 1}
                className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-slate-100 font-bold transition-colors disabled:opacity-30"
              >
                <span className="material-icons text-sm">chevron_left</span>
              </button>

              {/* Page numbers */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => {
                // Always show first, last, current ±1, and use ellipsis elsewhere
                const show = page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1;
                const showEllipsisBefore = page === currentPage - 2 && page > 2;
                const showEllipsisAfter = page === currentPage + 2 && page < totalPages - 1;

                if (showEllipsisBefore || showEllipsisAfter) {
                  return <span key={page} className="w-10 h-10 flex items-center justify-center text-slate-300 font-bold">…</span>;
                }
                if (!show) return null;

                return (
                  <button
                    key={page}
                    onClick={() => { setCurrentPage(page); window.scrollTo(0, 0); }}
                    className={`w-10 h-10 flex items-center justify-center rounded-xl font-bold transition-colors ${
                      currentPage === page
                        ? 'bg-primary text-white shadow-md shadow-primary/30'
                        : 'hover:bg-slate-100 text-slate-600'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}

              {/* Next */}
              <button
                onClick={() => { setCurrentPage(p => Math.min(totalPages, p + 1)); window.scrollTo(0, 0); }}
                disabled={currentPage === totalPages}
                className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-slate-100 font-bold transition-colors disabled:opacity-30"
              >
                <span className="material-icons text-sm">chevron_right</span>
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
    </div>
  );
};

export default SearchResults;

"use client";

import React, { useEffect, useState } from "react";
import Link from 'next/link';
import { formatPrice } from "../constants";
import { calculateDistance } from "../utils";
import { 
  Home as HomeIcon, 
  Building2, 
  Car, 
  Briefcase, 
  Wrench, 
  Calendar, 
  Users, 
  ShoppingBag, 
  Store, 
  Megaphone,
  Folder
} from "lucide-react";

const OFFICIAL_CATEGORY_SYSTEM = [
  { name: "Marketplace", iconKey: "marketplace" },
  { name: "Real Estate", iconKey: "real estate" },
  { name: "Automotive", iconKey: "automotive" },
  { name: "Jobs", iconKey: "jobs" },
  { name: "Services", iconKey: "services" },
  { name: "Events", iconKey: "events" },
  { name: "Community", iconKey: "community" },
  { name: "Buy & Sell", iconKey: "buy & sell" },
  { name: "Businesses", iconKey: "businesses" },
  { name: "Promotions", iconKey: "promotions" },
];

const CATEGORY_ICON_MAP: Record<string, { icon: React.ElementType; textColor: string; badgeBg: string }> = {
  "marketplace": { icon: HomeIcon, textColor: "text-[#FD3D28]", badgeBg: "bg-[#FD3D28]/10" },
  "real estate": { icon: Building2, textColor: "text-[#1774F5]", badgeBg: "bg-[#1774F5]/10" },
  "automotive": { icon: Car, textColor: "text-[#F2994A]", badgeBg: "bg-[#F2994A]/10" },
  "vehicles": { icon: Car, textColor: "text-[#F2994A]", badgeBg: "bg-[#F2994A]/10" },
  "jobs": { icon: Briefcase, textColor: "text-[#27AE60]", badgeBg: "bg-[#27AE60]/10" },
  "services": { icon: Wrench, textColor: "text-[#5B616A]", badgeBg: "bg-[#5B616A]/10" },
  "events": { icon: Calendar, textColor: "text-[#F2C94C]", badgeBg: "bg-[#F2C94C]/15" },
  "community": { icon: Users, textColor: "text-[#FD3D28]", badgeBg: "bg-[#FD3D28]/10" },
  "buy & sell": { icon: ShoppingBag, textColor: "text-[#1774F5]", badgeBg: "bg-[#1774F5]/10" },
  "buy and sell": { icon: ShoppingBag, textColor: "text-[#1774F5]", badgeBg: "bg-[#1774F5]/10" },
  "businesses": { icon: Store, textColor: "text-[#F2994A]", badgeBg: "bg-[#F2994A]/10" },
  "business": { icon: Store, textColor: "text-[#F2994A]", badgeBg: "bg-[#F2994A]/10" },
  "promotions": { icon: Megaphone, textColor: "text-[#FD3D28]", badgeBg: "bg-[#FD3D28]/10" },
};

const getCategoryIconConfig = (name: string) => {
  const key = name.toLowerCase().trim();
  if (CATEGORY_ICON_MAP[key]) return CATEGORY_ICON_MAP[key];
  for (const k of Object.keys(CATEGORY_ICON_MAP)) {
    if (key.includes(k) || k.includes(key)) return CATEGORY_ICON_MAP[k];
  }
  return { icon: Folder, textColor: "text-slate-500", badgeBg: "bg-slate-100" };
};

interface HomeProps {
  isLoggedIn: boolean;
  initialCategories?: any[];
  initialSeoSettings?: Record<string, string>;
}

const getGoogleStyleAddress = (place: any) => {
  const addr = place.address || {};
  
  // 1. Determine main text (e.g., "123 Yonge Street" or "McDonald's")
  let mainText = "";
  if (addr.amenity || addr.shop || addr.tourism || addr.office || addr.leisure) {
    mainText = addr.amenity || addr.shop || addr.tourism || addr.office || addr.leisure;
  } else if (addr.house_number && addr.road) {
    mainText = `${addr.house_number} ${addr.road}`;
  } else if (addr.road) {
    mainText = addr.road;
  } else {
    mainText = place.display_name.split(",")[0];
  }

  // 2. Determine secondary text (e.g., "Toronto, ON")
  const city = addr.city || addr.town || addr.village || addr.suburb || addr.city_district || "";
  
  const provinceMap: Record<string, string> = {
    "Ontario": "ON",
    "Quebec": "QC",
    "British Columbia": "BC",
    "Alberta": "AB",
    "Manitoba": "MB",
    "Saskatchewan": "SK",
    "Nova Scotia": "NS",
    "New Brunswick": "NB",
    "Newfoundland and Labrador": "NL",
    "Prince Edward Island": "PE",
    "Northwest Territories": "NT",
    "Yukon": "YT",
    "Nunavut": "NU"
  };
  
  let state = addr.state || "";
  if (provinceMap[state]) {
    state = provinceMap[state];
  }
  
  let secondaryText = "";
  if (city && state) {
    secondaryText = `${city}, ${state}`;
  } else if (city) {
    secondaryText = city;
  } else if (state) {
    secondaryText = state;
  } else {
    const parts = place.display_name.split(",");
    secondaryText = parts.slice(1).map((p: string) => p.trim()).join(", ");
  }
  
  return { mainText, secondaryText };
};

const getCleanAddressString = (place: any) => {
  const addr = place.address || {};
  const parts: string[] = [];
  
  if (addr.amenity || addr.shop || addr.tourism || addr.office || addr.leisure) {
    const name = addr.amenity || addr.shop || addr.tourism || addr.office || addr.leisure;
    parts.push(name);
    if (addr.house_number && addr.road) {
      parts.push(`${addr.house_number} ${addr.road}`);
    } else if (addr.road) {
      parts.push(addr.road);
    }
  } else if (addr.house_number && addr.road) {
    parts.push(`${addr.house_number} ${addr.road}`);
  } else if (addr.road) {
    parts.push(addr.road);
  } else {
    parts.push(place.display_name.split(",")[0]);
  }
  
  const city = addr.city || addr.town || addr.village || addr.suburb || addr.city_district || "";
  
  const provinceMap: Record<string, string> = {
    "Ontario": "ON",
    "Quebec": "QC",
    "British Columbia": "BC",
    "Alberta": "AB",
    "Manitoba": "MB",
    "Saskatchewan": "SK",
    "Nova Scotia": "NS",
    "New Brunswick": "NB",
    "Newfoundland and Labrador": "NL",
    "Prince Edward Island": "PE",
    "Northwest Territories": "NT",
    "Yukon": "YT",
    "Nunavut": "NU"
  };
  
  let state = addr.state || "";
  if (provinceMap[state]) {
    state = provinceMap[state];
  }
  
  if (city) {
    parts.push(city);
  }
  if (state) {
    parts.push(state);
  }
  
  return parts.filter((val, index, self) => self.indexOf(val) === index && val !== "").join(", ");
};

const Home: React.FC<HomeProps> = ({ isLoggedIn, initialCategories = [], initialSeoSettings = {} }) => {
  const [categories, setCategories] = useState<any[]>(initialCategories);
  const [heroText, setHeroText] = useState({
    title1: initialSeoSettings.homepage_hero_title_1 || "Find what you need,",
    title2: initialSeoSettings.homepage_hero_title_2 || "right in your community.",
    tag1: initialSeoSettings.homepage_hero_tag_1 || "Free Ads.",
    tag2: initialSeoSettings.homepage_hero_tag_2 || "Sell Fast.",
    tag3: initialSeoSettings.homepage_hero_tag_3 || "Buy Local.",
    tag4: initialSeoSettings.homepage_hero_tag_4 || "Canada-Wide."
  });
  const [homepageAdCount, setHomepageAdCount] = useState(
    parseInt(initialSeoSettings.homepage_ad_count || "12", 10) || 12
  );

  const [serverMessage, setServerMessage] = useState<string>(
    "Checking backend connection...",
  );
  const [listings, setListings] = useState<any[]>([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [locationSearch, setLocationSearch] = useState(() => {
    if (typeof window === "undefined") return "Toronto, ON";
    return localStorage.getItem("user_location") || "Toronto, ON";
  });
  const [locationSuggestions, setLocationSuggestions] = useState<any[]>([]);
  const [isSearchingLocation, setIsSearchingLocation] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    if (locationSearch.trim().length >= 1 && showSuggestions) {
      const delayFn = setTimeout(() => {
        setIsSearchingLocation(true);
        fetch(
          `/api/locations/search?q=${encodeURIComponent(locationSearch)}`
        )
          .then((res) => res.json())
          .then((data) => setLocationSuggestions(data))
          .catch(console.error)
          .finally(() => setIsSearchingLocation(false));
      }, 150);
      return () => clearTimeout(delayFn);
    } else {
      setLocationSuggestions([]);
    }
  }, [locationSearch, showSuggestions]);

  const handleSelectLocation = (place: any) => {
    const cleanAddr = getCleanAddressString(place);
    setLocationSearch(cleanAddr);
    localStorage.setItem("user_location", cleanAddr);
    if (place.lat && place.lon) {
      localStorage.setItem("user_lat", place.lat);
      localStorage.setItem("user_lon", place.lon);
    }
    window.dispatchEvent(new Event("location_updated"));
    setShowSuggestions(false);
  };

  const loadListings = (loc?: string) => {
    const activeLoc = loc !== undefined ? loc : (localStorage.getItem("user_location") || locationSearch || "Toronto, ON");
    const endpoint = activeLoc ? `/api/listings/read?location=${encodeURIComponent(activeLoc)}` : "/api/listings/read";
    fetch(endpoint)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setListings(data);
        } else if (data && Array.isArray(data.data)) {
          setListings(data.data);
        } else {
          setListings([]);
        }
      })
      .catch((err) => console.error("DB fetch error", err));
  };

  useEffect(() => {
    fetch("/api/status")
      .then((res) => res.json())
      .then((data) => setServerMessage(data.message))
      .catch((err) =>
        setServerMessage("Backend is not running: " + err.message),
      );

    const currentLoc = localStorage.getItem("user_location") || locationSearch || "Toronto, ON";
    loadListings(currentLoc);

    const handleLocationUpdate = () => {
      const updatedLoc = localStorage.getItem("user_location") || "Toronto, ON";
      setLocationSearch(updatedLoc);
      loadListings(updatedLoc);
    };

    window.addEventListener("location_updated", handleLocationUpdate);
    return () =>
      window.removeEventListener("location_updated", handleLocationUpdate);
  }, []);

  return (
    <div className="overflow-x-hidden">
      {/* Hero Section */}
      <section className="bg-gradient-mesh border-b border-slate-100 pt-12 pb-16 md:pt-20 md:pb-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-primary-soft/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-primary-light/10 rounded-full blur-3xl"></div>

        <div className="w-full px-4 sm:px-6 lg:px-10 text-center relative z-10">
          <span className="inline-block py-1.5 px-4 rounded-full bg-primary-soft/20 text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-6">
            Global Standards. Local Trading.
          </span>
          <h1 className="type-hero mb-6 tracking-tight text-slate-900">
            {heroText.title1}
            <br />
            <span className="text-primary-light">{heroText.title2}</span>
          </h1>
          <p className="text-base md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed font-bold flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <span className="w-10 h-[2px] bg-secondary hidden sm:inline-block"></span>
            <span className="text-slate-800">{heroText.tag1}</span>
            <span className="text-secondary">{heroText.tag2}</span>
            <span className="text-[#1a2e5a]">{heroText.tag3}</span>
            <span className="text-secondary">{heroText.tag4}</span>
            <span className="w-10 h-[2px] bg-secondary hidden sm:inline-block"></span>
          </p>

          <div className="max-w-4xl mx-auto bg-white p-2.5 rounded-[2.5rem] shadow-2xl shadow-primary-neutral/40 border border-slate-100 flex flex-col md:flex-row gap-2">
            <div className="flex-grow relative flex items-center">
              <span className="material-icons absolute left-5 text-primary-neutral">
                search
              </span>
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search for anything"
                className="w-full pl-14 pr-4 py-5 bg-transparent border-none focus:ring-0 text-sm font-medium"
                placeholder="Search for anything..."
                type="text"
              />
            </div>
            <div className="w-px h-10 bg-slate-100 self-center hidden md:block"></div>
            <div className="md:w-64 relative flex items-center">
              <span className="material-icons absolute left-5 text-primary-neutral z-10">
                location_on
              </span>
              <input
                value={locationSearch}
                onChange={(e) => {
                  setLocationSearch(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                aria-label="Location, City, Province or Postal Code"
                className="w-full pl-14 pr-4 py-5 bg-transparent border-none focus:ring-0 text-sm font-bold text-slate-700"
                type="text"
                placeholder="City, Province or Postal Code..."
                autoComplete="off"
              />

              {/* Autocomplete Dropdown */}
              {showSuggestions && locationSearch.trim().length >= 1 && (
                <div className="absolute top-[110%] left-0 w-full min-w-[250px] bg-white border border-slate-200 rounded-xl shadow-2xl z-50 overflow-hidden text-left">
                  {isSearchingLocation ? (
                    <div className="p-4 text-xs font-bold text-slate-400 text-center">
                      Searching...
                    </div>
                  ) : locationSuggestions.length > 0 ? (
                    <ul>
                      {locationSuggestions.map((place, idx) => {
                        const { mainText, secondaryText } = getGoogleStyleAddress(place);
                        return (
                          <li
                            key={idx}
                            onClick={() => handleSelectLocation(place)}
                            className="px-4 py-3 hover:bg-slate-50 cursor-pointer border-b border-slate-50 last:border-0 flex items-start gap-3 transition-colors"
                          >
                            <span className="material-icons text-slate-300 text-lg mt-0.5">
                              place
                            </span>
                            <div>
                              <p className="text-sm font-bold text-slate-700 leading-tight mb-0.5">
                                {mainText}
                              </p>
                              <p className="text-xs text-slate-400 leading-tight">
                                {secondaryText}
                              </p>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  ) : (
                    <div className="p-4 text-xs font-bold text-slate-400 text-center">
                      No locations found.
                    </div>
                  )}
                </div>
              )}
            </div>
            <Link href={`/search?q=${encodeURIComponent(searchQuery)}&loc=${encodeURIComponent(locationSearch)}`}
              onClick={() => window.scrollTo(0, 0)}
              className="bg-secondary hover:bg-secondary-hover text-white px-12 py-5 rounded-[1.8rem] font-black transition-all flex items-center justify-center shadow-lg shadow-secondary/25"
            >
              Explore
            </Link>
          </div>

          <div className="mt-12 flex flex-wrap justify-center gap-8 text-xs font-bold text-slate-400 uppercase tracking-widest">
            <div className="flex items-center gap-2">
              <span className="material-icons text-primary-light text-sm">
                verified
              </span>{" "}
              Trusted Users
            </div>
            <div className="flex items-center gap-2">
              <span className="material-icons text-primary-light text-sm">
                security
              </span>{" "}
              Encrypted Data
            </div>
            <div className="flex items-center gap-2">
              <span className="material-icons text-primary-light text-sm">
                forum
              </span>{" "}
              Direct Chat
            </div>
          </div>
        </div>
      </section>

      <main className="w-full px-4 sm:px-6 lg:px-10 py-20">
        {/* Categories */}
        <section className="mb-32">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="type-section font-black mb-2 text-slate-900">
                Explore Categories
              </h2>
              <p className="text-slate-500 font-medium">
                Browse thousands of curated listings
              </p>
            </div>
            <Link href="/search"
              className="text-xs font-black text-primary uppercase tracking-widest hover:underline"
            >
              All Categories
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-5 gap-6">
            {(categories && categories.length >= 10 ? categories : OFFICIAL_CATEGORY_SYSTEM).map((cat) => {
              const catName = cat.name;
              const config = getCategoryIconConfig(catName);
              const IconComponent = config.icon;

              return (
                <Link
                  key={catName} 
                  href={`/search?cat=${encodeURIComponent(catName)}`}
                  onClick={() => window.scrollTo(0, 0)}
                  className="bg-white p-6 rounded-3xl border border-slate-200/80 text-center hover:border-primary hover:shadow-xl hover:-translate-y-1 transition-all group flex flex-col items-center justify-center"
                >
                  <div className={`w-14 h-14 ${config.badgeBg} rounded-[12px] flex items-center justify-center mb-4 group-hover:scale-110 transition-all`}>
                    <IconComponent
                      size={24}
                      strokeWidth={2}
                      className={config.textColor}
                    />
                  </div>
                  <span className="text-xs font-black text-slate-800 uppercase tracking-wider">
                    {catName}
                  </span>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Home Page Featured Showcase Gallery */}
        {(() => {
          const homeGalleryItems = listings.filter((item: any) => item.is_home_gallery || item.is_home_page);
          if (homeGalleryItems.length === 0) return null;

          return (
            <section className="mb-20 bg-gradient-to-br from-blue-900/5 via-indigo-900/5 to-slate-900/5 p-8 sm:p-10 rounded-[3rem] border border-blue-100/80 shadow-sm relative overflow-hidden">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
                <div>
                  <span className="inline-flex items-center gap-1.5 py-1 px-3.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-black uppercase tracking-widest mb-2 shadow-xs">
                    <span className="material-icons text-sm">home</span> Home Page Exclusives
                  </span>
                  <h2 className="type-section font-black text-slate-900">
                    Home Page Showcase Gallery
                  </h2>
                  <p className="text-slate-500 font-medium text-sm">
                    Premium featured listings displayed directly on the homepage
                  </p>
                </div>
                <Link 
                  href="/search"
                  onClick={() => window.scrollTo(0, 0)}
                  className="text-xs font-black text-blue-600 hover:text-blue-800 uppercase tracking-widest flex items-center gap-1 hover:underline"
                >
                  View All Listings <span className="material-icons text-sm">arrow_forward</span>
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {homeGalleryItems.map((item: any) => (
                  <Link 
                    key={item.id} 
                    href={`/item/${item.id}`}
                    onClick={() => window.scrollTo(0, 0)}
                    className="group bg-white rounded-[2rem] border border-blue-200/80 overflow-hidden shadow-lg shadow-blue-500/5 hover:shadow-2xl hover:border-blue-500 transition-all duration-300 flex flex-col"
                  >
                    <div className="aspect-[16/10] relative bg-slate-100 overflow-hidden">
                      <img
                        src={item.image || "https://picsum.photos/seed/default/800/600"}
                        alt={item.title}
                        loading="lazy"
                        className="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute top-4 left-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[10px] font-black px-3 py-1.5 rounded-xl shadow-md uppercase tracking-wider flex items-center gap-1">
                        <span className="material-icons text-xs">home</span> Home Page Showcase
                      </span>
                    </div>

                    <div className="p-6 flex flex-col flex-grow">
                      <div className="text-primary font-black text-xl mb-1">
                        {formatPrice(item.price, item.price_type)}
                      </div>
                      <h3 className="font-bold text-slate-900 line-clamp-2 min-h-[2.5rem] text-base group-hover:text-blue-600 transition-colors mb-4">
                        {item.title}
                      </h3>

                      <div className="mt-auto pt-3 border-t border-slate-100 flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        <span className="flex items-center gap-1">
                          <span className="material-icons text-xs">location_on</span>
                          {item.location || 'Canada'}
                        </span>
                        <span className="text-blue-600 font-black">HOME PAGE PROMOTED</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          );
        })()}

        {/* Recently Added */}
        <div className="flex flex-col lg:flex-row gap-16">
          <div className="flex-grow">
            <div className="flex justify-between items-end mb-10">
              <div>
                <h2 className="type-section font-black mb-2">Recently Added</h2>
                <p className="text-slate-500 font-medium">
                  New items posted in your area
                </p>
              </div>
              <Link href="/search"
                onClick={() => window.scrollTo(0, 0)}
                className="text-xs font-black text-primary uppercase tracking-widest hover:underline"
              >
                See All
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
              {listings
                .filter((item: any) => {
                  const userLat = parseFloat(localStorage.getItem("user_lat") || "");
                  const userLon = parseFloat(localStorage.getItem("user_lon") || "");
                  
                  if (!isNaN(userLat) && !isNaN(userLon) && item.latitude && item.longitude) {
                    const dist = calculateDistance(userLat, userLon, parseFloat(item.latitude), parseFloat(item.longitude));
                    return dist <= 50; // Show within 50 miles radius
                  }
                  
                  // Fallback to text search if no coordinates
                  if (locationSearch) {
                    const itemLoc = (item.location || "").toLowerCase().trim();
                    const userLoc = (locationSearch || "").toLowerCase().trim();
                    if (!itemLoc) return true;

                    const userCity = userLoc.split(',')[0].trim();
                    const itemCity = itemLoc.split(',')[0].trim();

                    return itemLoc.includes(userLoc) || 
                           userLoc.includes(itemLoc) || 
                           (userCity && itemCity && (userCity.includes(itemCity) || itemCity.includes(userCity)));
                  }
                  return true;
                })
                .slice(0, homepageAdCount)
                .map((item: any) => (
                <Link href={`/item/${item.id}`}
                  key={item.id}
                  onClick={() => window.scrollTo(0, 0)}
                  className={`group rounded-[2.5rem] border border-slate-100 overflow-hidden hover:shadow-2xl transition-all ${item.is_featured ? 'bg-accent-beige' : 'bg-white'}`}
                >
                  <div className="aspect-[4/3] relative flex items-center justify-center bg-slate-100">
                    <img
                      src={
                        item.image ||
                        "https://picsum.photos/seed/default/800/600"
                      }
                      alt={item.title}
                      loading="lazy"
                      width="800"
                      height="600"
                      decoding="async"
                      className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-700"
                    />
                    <button 
                      aria-label="Add to favorites"
                      className="absolute top-5 right-5 w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors shadow-sm"
                    >
                      <span className="material-icons text-xl">
                        favorite_border
                      </span>
                    </button>
                    {item.is_featured ? (
                      <div className="absolute top-5 left-5 bg-accent-gold text-charcoal text-[10px] font-black px-3 py-1.5 rounded-xl shadow-lg">
                        FEATURED
                      </div>
                    ) : null}
                  </div>
                  <div className="p-8">
                    <div className="text-slate-900 font-black text-2xl mb-2">
                      {formatPrice(item.price, item.price_type)}
                    </div>
                    <h3 className="font-bold text-slate-800 line-clamp-2 min-h-[3rem] text-lg group-hover:text-primary transition-colors mb-4">
                      {item.title}
                    </h3>
                    <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest pt-4 mt-auto border-t border-slate-50">
                      <span className="flex items-center gap-1">
                        <span className="material-icons text-[12px] text-slate-gray">
                          schedule
                        </span>{" "}
                        {item.created_at ? new Date(item.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : (item.time || "Recently")}
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="material-icons text-[12px] text-slate-gray">
                          location_on
                        </span>{" "}
                        {item.location}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:w-80 space-y-10 flex-shrink-0">
            {!isLoggedIn && (
              <div className="bg-secondary rounded-[2.5rem] p-10 text-white relative overflow-hidden group">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-colors"></div>
                <h3 className="text-2xl font-black mb-4 relative z-10">
                  Join HitAds
                </h3>
                <p className="text-white text-sm mb-8 leading-relaxed relative z-10 font-medium">
                  Create a free account to contact sellers and save your
                  favorite items.
                </p>
                <Link href="/login"
                  onClick={() => window.scrollTo(0, 0)}
                  className="block w-full bg-white text-slate-900 font-black py-4 rounded-2xl text-center transition-all shadow-lg hover:bg-slate-100"
                >
                  Join Free
                </Link>
              </div>
            )}

            <div className="bg-white rounded-[2.5rem] border border-slate-100 p-10 shadow-sm">
              <div className="w-12 h-12 bg-primary-soft/10 rounded-2xl flex items-center justify-center text-primary mb-6">
                <span className="material-icons">shield</span>
              </div>
              <h3 className="font-black mb-3 text-lg text-slate-900">
                Safety First
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed mb-6 font-medium">
                We prioritize secure trading and verified interactions for every
                user on our platform.
              </p>
              <ul className="space-y-4 mb-8">
                {[
                  "Verified Identities",
                  "Safe Exchange Zones",
                  "Secure Messaging",
                ].map((t) => (
                  <li
                    key={t}
                    className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-400"
                  >
                    <span className="material-icons text-primary-soft text-sm">
                      check_circle
                    </span>
                    {t}
                  </li>
                ))}
              </ul>
              <Link href="/help"
                onClick={() => window.scrollTo(0, 0)}
                className="text-xs font-black text-primary hover:underline uppercase tracking-widest"
              >
                Learn More
              </Link>
            </div>
          </aside>
        </div>
      </main>

    </div>
  );
};

export default Home;

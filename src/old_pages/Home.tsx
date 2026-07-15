"use client";

import React, { useEffect, useState } from "react";
import Link from 'next/link';
import { formatPrice } from "../constants";
import { calculateDistance } from "../utils";

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
    if (locationSearch.trim().length > 2 && showSuggestions) {
      const delayFn = setTimeout(() => {
        setIsSearchingLocation(true);
        fetch(
          `/api/locations/search?q=${encodeURIComponent(locationSearch)}`
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

  useEffect(() => {
    // Categories are now loaded server-side and passed via props

    fetch("/api/status")
      .then((res) => res.json())
      .then((data) => setServerMessage(data.message))
      .catch((err) =>
        setServerMessage("Backend is not running: " + err.message),
      );

    fetch("/api/listings/read")
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

    // SEO settings are now loaded server-side and passed via props

    const handleLocationUpdate = () => {
      const loc = localStorage.getItem("user_location");
      if (loc) setLocationSearch(loc);
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
          <h1 className="text-4xl md:text-7xl font-black mb-6 tracking-tight text-slate-900 leading-[1.1]">
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
                className="w-full pl-14 pr-4 py-5 bg-transparent border-none focus:ring-0 text-sm font-bold text-slate-700"
                type="text"
                placeholder="City, Province or Postal Code..."
                autoComplete="off"
              />

              {/* Autocomplete Dropdown */}
              {showSuggestions && locationSearch.length > 2 && (
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
              <h2 className="text-3xl font-black mb-2 text-slate-900">
                Explore Categories
              </h2>
              <p className="text-slate-500 font-medium">
                Browse thousands of curated listings
              </p>
            </div>
            <Link href="/search"
              className="text-xs font-black text-primary-light uppercase tracking-widest hover:underline"
            >
              All Categories
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
            {categories.map((cat) => (
              <Link
                key={cat.name} href={`/search?cat=${encodeURIComponent(cat.name)}`}
                onClick={() => window.scrollTo(0, 0)}
                className="bg-white p-8 rounded-3xl border border-slate-100 text-center hover:border-primary-light hover:shadow-xl hover:-translate-y-1 transition-all group"
              >
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-primary-soft/10 transition-all">
                  <span className="material-icons text-3xl text-primary-neutral group-hover:text-primary-light">
                    {cat.icon}
                  </span>
                </div>
                <span className="text-xs font-black text-slate-700 uppercase tracking-widest">
                  {cat.name}
                </span>
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
                <p className="text-slate-500 font-medium">
                  New items posted in your area
                </p>
              </div>
              <Link href="/search"
                onClick={() => window.scrollTo(0, 0)}
                className="text-xs font-black text-primary-light uppercase tracking-widest hover:underline"
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
                    return item.location?.toLowerCase().includes(locationSearch.toLowerCase());
                  }
                  return true;
                })
                .slice(0, homepageAdCount)
                .map((item: any) => (
                <Link href={`/item/${item.id}`}
                  key={item.id}
                  onClick={() => window.scrollTo(0, 0)}
                  className="group bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden hover:shadow-2xl transition-all"
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
                    <button className="absolute top-5 right-5 w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors shadow-sm">
                      <span className="material-icons text-xl">
                        favorite_border
                      </span>
                    </button>
                    {item.is_featured ? (
                      <div className="absolute top-5 left-5 bg-primary-light text-white text-[10px] font-black px-3 py-1.5 rounded-xl shadow-lg">
                        FEATURED
                      </div>
                    ) : null}
                  </div>
                  <div className="p-8">
                    <div className="text-primary font-black text-2xl mb-2">
                      {formatPrice(item.price, item.price_type)}
                    </div>
                    <h3 className="font-bold text-slate-800 line-clamp-2 min-h-[3rem] text-lg group-hover:text-primary-light transition-colors mb-4">
                      {item.title}
                    </h3>
                    <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest pt-4 mt-auto border-t border-slate-50">
                      <span className="flex items-center gap-1">
                        <span className="material-icons text-[12px] text-primary">
                          schedule
                        </span>{" "}
                        {item.created_at ? new Date(item.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : (item.time || "Recently")}
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="material-icons text-[12px] text-primary">
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
                <p className="text-white/80 text-sm mb-8 leading-relaxed relative z-10 font-medium">
                  Create a free account to contact sellers and save your
                  favorite items.
                </p>
                <Link href="/login"
                  onClick={() => window.scrollTo(0, 0)}
                  className="block w-full bg-white text-secondary font-black py-4 rounded-2xl text-center transition-all shadow-lg hover:bg-slate-50"
                >
                  Join Free
                </Link>
              </div>
            )}

            <div className="bg-white rounded-[2.5rem] border border-slate-100 p-10 shadow-sm">
              <div className="w-12 h-12 bg-primary-soft/10 rounded-2xl flex items-center justify-center text-primary-light mb-6">
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
                className="text-xs font-black text-primary-light hover:underline uppercase tracking-widest"
              >
                Learn More
              </Link>
            </div>
          </aside>
        </div>
      </main>

      {/* Stats Section */}
      <section className="bg-white py-24 border-y border-slate-100">
        <div className="w-full px-4 sm:px-6 lg:px-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
            {[
              { label: "Listings", value: "120K+" },
              { label: "Community", value: "4M+" },
              { label: "Locations", value: "1.2K+" },
              { label: "Trust Score", value: "4.95" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-4xl font-black text-primary mb-2">
                  {stat.value}
                </div>
                <div className="text-[10px] font-black text-primary-neutral uppercase tracking-widest">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

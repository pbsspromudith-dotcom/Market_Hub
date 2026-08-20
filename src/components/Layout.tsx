"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { CURRENT_USER } from "../constants";
import LocationAutocomplete from "./LocationAutocomplete";


interface LayoutProps {
  children: React.ReactNode;
  isLoggedIn: boolean;
  isAdmin?: boolean;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  isLoggedIn,
  isAdmin,
  onLogout,
}) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const location = {
    pathname,
    search: searchParams ? "?" + searchParams.toString() : "",
    state: null,
  };
  const navigate = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState("");
  const [globalLocation, setGlobalLocation] = useState(() => {
    if (typeof window === "undefined") return "Toronto, ON";
    return localStorage.getItem("user_location") || "Toronto, ON";
  });
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  interface Category {
    CategoryID: number;
    ParentCategoryID: number | null;
    CategoryName: string;
    Slug: string | null;
    Icon: string | null;
    SortOrder: number;
    children?: Category[];
  }

  const [categoriesTree, setCategoriesTree] = useState<Category[]>([]);
  const [socialLinks, setSocialLinks] = useState({
    facebook: "https://www.facebook.com/share/1AUADECy9x/",
    x: "https://x.com",
    instagram: "https://www.instagram.com/hitads.ca?igsh=bnVlaG5maWRvMHdx",
  });
  const [footerText, setFooterText] = useState(
    "© 2026 HitAds.ca — Post free ads, sell fast, buy local, and connect with buyers and sellers across Canada.",
  );
  const [expandedFooter, setExpandedFooter] = useState<string | null>(null);

  useEffect(() => {
    // Retry helper for cold database connections after deployment
    const fetchWithRetry = async (
      url: string,
      retries = 2,
      delay = 2000,
    ): Promise<any> => {
      for (let i = 0; i < retries; i++) {
        try {
          const res = await fetch(url);
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          return await res.json();
        } catch (err) {
          if (i < retries - 1) {
            await new Promise((r) => setTimeout(r, delay * Math.pow(2, i)));
          } else {
            throw err;
          }
        }
      }
    };

    fetchWithRetry("/api/categories/read")
      .then((res: any) => {
        if (res.success && Array.isArray(res.data)) {
          setCategoriesTree(res.data);
        }
      })
      .catch((err: any) => console.error("Error loading categories:", err));

    fetchWithRetry("/api/admin/seo_read?t=" + new Date().getTime())
      .then((data: any) => {
        if (data.success && data.settings) {
          setSocialLinks({
            facebook: data.settings.social_facebook || "https://www.facebook.com/share/1AUADECy9x/",
            x: data.settings.social_x || "https://x.com",
            instagram: data.settings.social_instagram || "https://www.instagram.com/hitads.ca?igsh=bnVlaG5maWRvMHdx",
          });
          if (data.settings.footer_copyright_text) {
            setFooterText(data.settings.footer_copyright_text);
          }
        }
      })
      .catch((err: any) =>
        console.error("Error loading social settings:", err),
      );
    const handleLocationUpdate = () => {
      const loc = localStorage.getItem("user_location");
      if (loc) setGlobalLocation(loc);
    };
    window.addEventListener("location_updated", handleLocationUpdate);
    return () => window.removeEventListener("location_updated", handleLocationUpdate);
  }, []);

  const CATEGORIES = categoriesTree.map((cat) => cat.CategoryName);
  const hoveredCategoryObj = categoriesTree.find(
    (cat) => cat.CategoryName === hoveredCategory,
  );

  const handleGlobalSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (globalLocation.trim()) {
      localStorage.setItem("user_location", globalLocation.trim());
      window.dispatchEvent(new Event("location_updated"));
    }
    let url = "/search?";
    if (globalSearch.trim())
      url += `q=${encodeURIComponent(globalSearch.trim())}&`;
    if (globalLocation.trim())
      url += `loc=${encodeURIComponent(globalLocation.trim())}&`;
    navigate.push(url.replace(/&$/, ""));
    window.scrollTo(0, 0);
  };

  const isAdminPage =
    location.pathname.startsWith("/admin") ||
    location.pathname.startsWith("/dashboard");
  const isLoginPage =
    location.pathname === "/login" || location.pathname === "/admin-login";

  const handleLogoutClick = () => {
    onLogout();
    navigate.push("/");
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const handleNavClick = () => {
    setHoveredCategory(null);
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="sticky top-0 z-50 bg-white border-b border-slate-100">
        <div className="w-full px-4 sm:px-6 lg:px-10">
          <div className="flex justify-between items-center h-20 md:h-24 gap-4 lg:gap-8">
            {/* Logo Section */}
            <div className="flex-1 shrink-0 flex items-center justify-start">
              <Link href="/" className="flex items-center gap-1">
                <img
                  src="/logo.png?v=2"
                  alt="HitAds Logo"
                  width="240"
                  height="80"
                  fetchPriority="high"
                  className="h-14 md:h-20 w-auto object-contain transition-transform hover:scale-105"
                />
              </Link>
            </div>

            {/* Desktop Search */}
            <div className="hidden lg:flex items-center justify-center flex-[2] max-w-3xl">
              {!isLoginPage && (
                <form
                  onSubmit={handleGlobalSearch}
                  className="w-full relative flex items-center bg-white border border-slate-200 rounded-full p-1.5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.08)] hover:shadow-[0_4px_25px_-4px_rgba(0,0,0,0.12)] focus-within:ring-4 focus-within:ring-primary/10 focus-within:border-primary transition-all duration-300"
                >
                  <div className="flex-1 relative flex items-center group">
                    <span className="material-icons absolute left-4 text-slate-400 text-xl group-focus-within:text-primary transition-colors">
                      search
                    </span>
                    <input
                      type="text"
                      value={globalSearch}
                      onChange={(e) => setGlobalSearch(e.target.value)}
                      placeholder="What are you looking for?"
                      className="w-full bg-transparent border-none focus:ring-0 text-sm font-bold text-slate-800 placeholder:text-slate-400 placeholder:font-medium pl-12 pr-4 py-2.5 outline-none"
                    />
                  </div>
                  <div className="w-px h-6 bg-slate-200 mx-1"></div>
                  <LocationAutocomplete
                    value={globalLocation}
                    onChange={(val) => setGlobalLocation(val)}
                    onSelectLocation={(item) => {
                      setGlobalLocation(item.fullAddress);
                      localStorage.setItem("user_location", item.fullAddress);
                      localStorage.setItem("user_lat", item.lat);
                      localStorage.setItem("user_lon", item.lon);
                      window.dispatchEvent(new Event("location_updated"));
                    }}
                    variant="navbar"
                    placeholder="City, Province or Postal Code..."
                    syncWithLocalStorage={true}
                  />
                  <button
                    type="submit"
                    className="bg-primary hover:bg-primary-hover text-white px-8 py-3 rounded-full transition-all flex items-center justify-center font-black text-[11px] uppercase tracking-widest shadow-sm hover:shadow-md hover:-translate-y-[1px] active:translate-y-0 ml-1 shrink-0"
                  >
                    Search
                  </button>
                </form>
              )}
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6 flex-1 justify-end shrink-0">
              {!isLoginPage && (
                <Link
                  href="/post-ad"
                  className="flex flex-col items-center justify-center text-slate-600 hover:text-primary transition-colors group"
                >
                  <span className="material-icons text-[26px] group-hover:scale-110 transition-transform">
                    add_circle_outline
                  </span>
                  <span className="text-[11px] font-bold mt-1">Post an ad</span>
                </Link>
              )}

              {!isLoggedIn && !isLoginPage ? (
                <>
                  <Link
                    href="/login?mode=register"
                    className="flex flex-col items-center justify-center text-slate-600 hover:text-primary transition-colors group"
                  >
                    <span className="material-icons text-[26px] group-hover:scale-110 transition-transform">
                      person_add
                    </span>
                    <span className="text-[11px] font-bold mt-1">Sign up</span>
                  </Link>
                  <Link
                    href="/login"
                    className="flex flex-col items-center justify-center text-slate-600 hover:text-primary transition-colors group"
                  >
                    <span className="material-icons text-[26px] group-hover:scale-110 transition-transform">
                      person
                    </span>
                    <span className="text-[11px] font-bold mt-1">Login</span>
                  </Link>
                </>
              ) : (
                isLoggedIn && (
                  <>
                    {isAdmin && (
                      <Link
                        href="/dashboard"
                        className="flex flex-col items-center justify-center text-slate-600 hover:text-primary transition-colors group"
                      >
                        <span className="material-icons text-[26px] group-hover:scale-110 transition-transform">
                          admin_panel_settings
                        </span>
                        <span className="text-[11px] font-bold mt-1">
                          Admin
                        </span>
                      </Link>
                    )}
                    <Link
                      href="/profile"
                      className="flex flex-col items-center justify-center text-slate-600 hover:text-primary transition-colors group"
                    >
                      <span className="material-icons text-[26px] group-hover:scale-110 transition-transform">
                        account_circle
                      </span>
                      <span className="text-[11px] font-bold mt-1">
                        Profile
                      </span>
                    </Link>
                    <Link
                      href="/payment-portal"
                      className="flex flex-col items-center justify-center text-slate-600 hover:text-primary transition-colors group"
                    >
                      <span className="material-icons text-[26px] group-hover:scale-110 transition-transform">
                        payment
                      </span>
                      <span className="text-[11px] font-bold mt-1">
                        Billing
                      </span>
                    </Link>
                    <button
                      onClick={handleLogoutClick}
                      className="flex flex-col items-center justify-center text-slate-600 hover:text-red-500 transition-colors group"
                    >
                      <span className="material-icons text-[26px] group-hover:scale-110 transition-transform">
                        logout
                      </span>
                      <span className="text-[11px] font-bold mt-1">Logout</span>
                    </button>
                  </>
                )
              )}
            </div>

            {/* Mobile Actions */}
            <div className="flex md:hidden items-center gap-3">
              {!isLoginPage && (
                <Link
                  href="/post-ad"
                  className="bg-secondary text-white p-2 rounded-xl flex items-center justify-center shadow-lg shadow-secondary/20"
                >
                  <span className="material-icons text-lg">add</span>
                </Link>
              )}
              <button
                onClick={toggleMobileMenu}
                className="w-10 h-10 flex items-center justify-center text-slate-900 rounded-xl hover:bg-slate-50 transition-colors"
              >
                <span className="material-icons">
                  {isMobileMenuOpen ? "close" : "menu"}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-slate-100 shadow-2xl py-6 px-4 space-y-4 animate-in slide-in-from-top-4 duration-200">
            {!isLoginPage && (
              <>
                {/* Mobile Quick Search Form */}
                <form
                  onSubmit={(e) => {
                    handleGlobalSearch(e);
                    setIsMobileMenuOpen(false);
                  }}
                  className="space-y-2 mb-4 p-2 bg-slate-50 rounded-2xl border border-slate-100"
                >
                  <div className="relative flex items-center bg-white rounded-xl border border-slate-200 px-3 py-2">
                    <span className="material-icons text-slate-400 text-lg mr-2">search</span>
                    <input
                      type="text"
                      value={globalSearch}
                      onChange={(e) => setGlobalSearch(e.target.value)}
                      placeholder="What are you looking for?"
                      className="w-full text-xs font-bold text-slate-800 outline-none bg-transparent"
                    />
                  </div>
                  <LocationAutocomplete
                    value={globalLocation}
                    onChange={(val) => setGlobalLocation(val)}
                    onSelectLocation={(item) => {
                      setGlobalLocation(item.fullAddress);
                      localStorage.setItem("user_location", item.fullAddress);
                      localStorage.setItem("user_lat", item.lat);
                      localStorage.setItem("user_lon", item.lon);
                      window.dispatchEvent(new Event("location_updated"));
                    }}
                    variant="mobile"
                    placeholder="City or sub-city..."
                    syncWithLocalStorage={true}
                  />
                  <button
                    type="submit"
                    className="w-full py-3 bg-primary text-white font-black text-xs uppercase tracking-widest rounded-xl hover:bg-primary-hover transition-colors shadow-sm"
                  >
                    Search Listings
                  </button>
                </form>

                <Link
                  href="/search"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-4 py-3 text-lg font-black text-slate-900 hover:bg-slate-50 rounded-2xl transition-all"
                >
                  Browse
                </Link>
                {isLoggedIn && isAdmin && (
                  <Link
                    href="/dashboard"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="mx-4 px-4 py-3 text-sm font-black text-white bg-slate-900 rounded-2xl flex items-center gap-2 transition-all"
                  >
                    <span className="material-icons text-sm">
                      admin_panel_settings
                    </span>
                    Admin Panel
                  </Link>
                )}
                {isLoggedIn && (
                  <>
                    <Link
                      href="/profile"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-4 py-3 text-lg font-black text-slate-900 hover:bg-slate-50 rounded-2xl transition-all"
                    >
                      My Profile
                    </Link>
                    <Link
                      href="/payment-portal"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-4 py-3 text-lg font-black text-slate-900 hover:bg-slate-50 rounded-2xl transition-all"
                    >
                      Billing Portal
                    </Link>
                  </>
                )}
                <div className="h-px bg-slate-50 mx-4"></div>
                {isLoggedIn ? (
                  <button
                    onClick={handleLogoutClick}
                    className="w-full text-left px-4 py-3 text-lg font-black text-red-500 hover:bg-red-50 rounded-2xl transition-all"
                  >
                    Logout
                  </button>
                ) : (
                  <div className="space-y-4 pt-2">
                    <Link
                      href="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-4 py-3 text-lg font-black text-slate-900 hover:bg-slate-50 rounded-2xl transition-all"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/login?mode=register"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block w-full text-center py-4 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl"
                    >
                      Join Free
                    </Link>
                  </div>
                )}

                {/* Mobile Categories Grid */}
                <div className="pt-6 border-t border-slate-50">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 px-4">
                    Quick Browse
                  </p>
                  <div className="grid grid-cols-2 gap-3 px-2">
                    {CATEGORIES.slice(0, 8).map((cat) => (
                      <Link
                        key={cat}
                        href={`/search?cat=${encodeURIComponent(cat)}`}
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          window.scrollTo(0, 0);
                        }}
                        className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl hover:bg-primary/5 transition-all group"
                      >
                        <span className="text-[11px] font-bold text-slate-700 truncate">
                          {cat}
                        </span>
                      </Link>
                    ))}
                  </div>
                  <Link
                    href="/search"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      window.scrollTo(0, 0);
                    }}
                    className="block mt-4 mx-2 py-3 text-center text-xs font-black text-primary-light uppercase tracking-widest hover:bg-primary/5 rounded-xl transition-all"
                  >
                    View All Categories
                  </Link>
                </div>
              </>
            )}
          </div>
        )}

        {/* Secondary Navigation - Categories */}
        {!isLoginPage && (
          <div
            className="hidden md:block w-full border-t border-slate-200 bg-white shadow-sm relative z-40"
            onMouseLeave={() => setHoveredCategory(null)}
          >
            <div className="w-full px-4 sm:px-6 lg:px-10 overflow-x-auto custom-scrollbar relative z-50 bg-white">
              <ul className="flex items-center justify-center min-w-max mx-auto">
                {CATEGORIES.map((cat, index) => (
                  <React.Fragment key={cat}>
                    <li onMouseEnter={() => setHoveredCategory(cat)}>
                      <Link
                        href={`/search?cat=${encodeURIComponent(cat)}`}
                        onClick={handleNavClick}
                        className={`block px-4 lg:px-6 py-3 text-sm font-bold transition-all whitespace-nowrap border-b-2 ${hoveredCategory === cat ? "border-primary text-primary" : "border-transparent text-slate-700 hover:text-primary hover:border-primary/50"}`}
                      >
                        {cat}
                      </Link>
                    </li>
                    {index < CATEGORIES.length - 1 && (
                      <div className="h-6 w-px bg-slate-200 shrink-0"></div>
                    )}
                  </React.Fragment>
                ))}
              </ul>
            </div>

            {/* Mega Menu Dropdown */}
            <div
              className={`absolute top-full left-0 w-full bg-slate-50 border-t border-slate-200 shadow-2xl transition-all duration-300 origin-top z-40 ${hoveredCategory ? "opacity-100 scale-y-100 visible" : "opacity-0 scale-y-0 invisible"}`}
            >
              <div className="w-full max-w-[1400px] px-4 sm:px-6 lg:px-10 py-8 mx-auto flex">
                {/* Subcategories Grid */}
                <div className="flex-1 pr-8">
                  <h3 className="text-sm font-black text-slate-800 mb-6 uppercase tracking-widest border-b border-slate-200 pb-3">
                    Browse {hoveredCategory} by
                  </h3>
                  {hoveredCategoryObj && hoveredCategoryObj.children && (
                    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-y-6 gap-x-8 items-start">
                      {hoveredCategoryObj.children.map((subCat: any) => {
                        const hasChildren =
                          subCat.children && subCat.children.length > 0;
                        if (hasChildren) {
                          return (
                            <div
                              key={subCat.CategoryID}
                              className="flex flex-col gap-2"
                            >
                              <Link
                                href={`/search?cat=${encodeURIComponent(hoveredCategoryObj.CategoryName)}&sub=${encodeURIComponent(subCat.CategoryName)}`}
                                onClick={handleNavClick}
                                className="text-[13px] font-black text-slate-800 hover:text-primary transition-colors"
                              >
                                {subCat.CategoryName}
                              </Link>
                              <div className="flex flex-col gap-1.5 pl-3 border-l border-slate-200 mt-1">
                                {subCat.children.map((nestedCat: any) => (
                                  <Link
                                    key={nestedCat.CategoryID}
                                    href={`/search?cat=${encodeURIComponent(hoveredCategoryObj.CategoryName)}&sub=${encodeURIComponent(subCat.CategoryName)}&subsub=${encodeURIComponent(nestedCat.CategoryName)}`}
                                    onClick={handleNavClick}
                                    className="text-[12px] font-bold text-slate-500 hover:text-primary transition-colors truncate"
                                  >
                                    {nestedCat.CategoryName}
                                  </Link>
                                ))}
                              </div>
                            </div>
                          );
                        } else {
                          return (
                            <Link
                              key={subCat.CategoryID}
                              href={`/search?cat=${encodeURIComponent(hoveredCategoryObj.CategoryName)}&sub=${encodeURIComponent(subCat.CategoryName)}`}
                              onClick={handleNavClick}
                              className="text-[13px] font-bold text-slate-600 hover:text-primary transition-colors flex items-center gap-2 group"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-slate-300 group-hover:bg-primary transition-colors shrink-0"></span>
                              <span className="truncate">
                                {subCat.CategoryName}
                              </span>
                            </Link>
                          );
                        }
                      })}
                    </div>
                  )}
                </div>

                {/* Discover Guides (Right Side Pane) */}
                <div className="w-80 shrink-0 border-l border-slate-200 pl-8 hidden xl:block">
                  <h3 className="text-sm font-black text-slate-800 mb-6 uppercase tracking-widest border-b border-slate-200 pb-3">
                    Discover more in our guides
                  </h3>
                  <div className="flex flex-col gap-4 mb-8">
                    <Link
                      href="/buying-guides"
                      onClick={handleNavClick}
                      className="text-[13px] font-bold text-slate-600 hover:text-primary transition-colors"
                    >
                      Buying Guides
                    </Link>

                    <Link
                      href="/selling-advice"
                      onClick={handleNavClick}
                      className="text-[13px] font-bold text-slate-600 hover:text-primary transition-colors"
                    >
                      Selling Advice
                    </Link>

                    <Link
                      href="/market-trends"
                      onClick={handleNavClick}
                      className="text-[13px] font-bold text-slate-600 hover:text-primary transition-colors"
                    >
                      Market Trends
                    </Link>

                    <Link
                      href="/safety-tips"
                      onClick={handleNavClick}
                      className="text-[13px] font-bold text-slate-600 hover:text-primary transition-colors"
                    >
                      Safety Tips
                    </Link>
                  </div>
                  <Link
                    href="/buying-guides"
                    onClick={handleNavClick}
                    className="rounded-xl overflow-hidden shadow-md relative group cursor-pointer block"
                  >
                    <img
                      src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=640&h=256&q=60"
                      alt="Buying guides and tips for smart shopping on HitAds.ca"
                      loading="lazy"
                      width="320"
                      height="128"
                      className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-4">
                      <span className="text-white font-bold text-sm">
                        Read the {hoveredCategory} guide
                      </span>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      <main className="flex-grow">{children}</main>

      {!isLoginPage && (
        <footer className="relative mt-10 md:mt-24 pt-12 md:pt-24 pb-8 md:pb-12 bg-slate-100/60 border-t border-slate-200 overflow-hidden">
          <div className="relative z-10 w-full px-4 sm:px-6 lg:px-10">
            <div className="flex items-center gap-3 mb-8 md:mb-12">
              <a
                href={socialLinks.facebook || "https://www.facebook.com/share/1AUADECy9x/"}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit HitAds on Facebook"
                className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:text-white hover:bg-[#1877F2] hover:border-[#1877F2] bg-white shadow-xs transition-all duration-200"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a
                href={socialLinks.x || "https://x.com"}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit HitAds on X"
                className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:text-white hover:bg-black hover:border-black bg-white shadow-xs transition-all duration-200 font-black text-xs"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href={socialLinks.instagram || "https://www.instagram.com/hitads.ca?igsh=bnVlaG5maWRvMHdx"}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit HitAds on Instagram"
                className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:text-white hover:bg-gradient-to-tr hover:from-[#f09433] hover:via-[#dc2743] hover:to-[#bc1888] hover:border-transparent bg-white shadow-xs transition-all duration-200"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-8 mb-10 sm:mb-16">
              {/* Column 1: Tips & Help */}
              <div className="border-b border-slate-100 sm:border-none pb-4 sm:pb-0">
                <button
                  onClick={() =>
                    setExpandedFooter(expandedFooter === "tips" ? null : "tips")
                  }
                  className="w-full flex justify-between items-center sm:cursor-default sm:mb-6"
                >
                  <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em]">
                    Tips & Help
                  </h4>
                </button>
                <ul
                  className={`space-y-3 overflow-hidden transition-all duration-300 ${expandedFooter === "tips" ? "max-h-[500px] opacity-100 pt-4" : "max-h-0 opacity-0 sm:max-h-[500px] sm:opacity-100 sm:pt-0"}`}
                >
                  {/* <li>
                    <Link href="/help"
                      onClick={() =>
                        window.scrollTo({ top: 0, behavior: "smooth" })
                      }
                      className="text-[13px] font-bold text-slate-600 hover:text-primary transition-colors"
                    >
                      Help Center
                    </Link>
                  </li> */}
                  <li>
                    <Link
                      href="/contact"
                      onClick={() =>
                        window.scrollTo({ top: 0, behavior: "smooth" })
                      }
                      className="text-[13px] font-bold text-slate-600 hover:text-primary transition-colors"
                    >
                      Contact Us
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/buying-guides"
                      onClick={() =>
                        window.scrollTo({ top: 0, behavior: "smooth" })
                      }
                      className="text-[13px] font-bold text-slate-600 hover:text-primary transition-colors"
                    >
                      Buying Guides
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/safety-tips"
                      onClick={() =>
                        window.scrollTo({ top: 0, behavior: "smooth" })
                      }
                      className="text-[13px] font-bold text-slate-600 hover:text-primary transition-colors"
                    >
                      Safety Guidelines
                    </Link>
                  </li>

                  <li>
                    <Link
                      href="/selling-advice"
                      onClick={() =>
                        window.scrollTo({ top: 0, behavior: "smooth" })
                      }
                      className="text-[13px] font-bold text-slate-600 hover:text-primary transition-colors"
                    >
                      Selling Advice
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/market-trends"
                      onClick={() =>
                        window.scrollTo({ top: 0, behavior: "smooth" })
                      }
                      className="text-[13px] font-bold text-slate-600 hover:text-primary transition-colors"
                    >
                      Market Trends
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Column 2: Legal */}
              <div className="border-b border-slate-100 sm:border-none pb-4 sm:pb-0">
                <button
                  onClick={() =>
                    setExpandedFooter(
                      expandedFooter === "legal" ? null : "legal",
                    )
                  }
                  className="w-full flex justify-between items-center sm:cursor-default sm:mb-6"
                >
                  <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em]">
                    Legal
                  </h4>
                </button>
                <ul
                  className={`space-y-3 overflow-hidden transition-all duration-300 ${expandedFooter === "legal" ? "max-h-[500px] opacity-100 pt-4" : "max-h-0 opacity-0 sm:max-h-[500px] sm:opacity-100 sm:pt-0"}`}
                >
                  <li>
                    <Link
                      href="/terms"
                      onClick={() => window.scrollTo(0, 0)}
                      className="text-[13px] font-bold text-slate-600 hover:text-primary transition-colors"
                    >
                      Terms & Conditions
                    </Link>
                  </li>

                  <li>
                    <Link
                      href="/terms?tab=privacy"
                      onClick={() => window.scrollTo(0, 0)}
                      className="text-[13px] font-bold text-slate-600 hover:text-primary transition-colors"
                    >
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/terms"
                      onClick={() => window.scrollTo(0, 0)}
                      className="text-[13px] font-bold text-slate-600 hover:text-primary transition-colors"
                    >
                      Posting Policy
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/terms?tab=privacy#privacy-collect"
                      onClick={() => window.scrollTo(0, 0)}
                      className="text-[13px] font-bold text-slate-600 hover:text-primary transition-colors"
                    >
                      Cookie Policy
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Column 3: For Business */}
              <div className="border-b border-slate-100 sm:border-none pb-4 sm:pb-0">
                <button
                  onClick={() =>
                    setExpandedFooter(
                      expandedFooter === "business" ? null : "business",
                    )
                  }
                  className="w-full flex justify-between items-center sm:cursor-default sm:mb-6"
                >
                  <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em]">
                    For Business
                  </h4>
                </button>
                <ul
                  className={`space-y-3 overflow-hidden transition-all duration-300 ${expandedFooter === "business" ? "max-h-[500px] opacity-100 pt-4" : "max-h-0 opacity-0 sm:max-h-[500px] sm:opacity-100 sm:pt-0"}`}
                >
                  <li>
                    <Link
                      href="/contact"
                      onClick={() => window.scrollTo(0, 0)}
                      className="text-[13px] font-bold text-slate-600 hover:text-primary transition-colors"
                    >
                      Business Advertising
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/contact"
                      onClick={() => window.scrollTo(0, 0)}
                      className="text-[13px] font-bold text-slate-600 hover:text-primary transition-colors"
                    >
                      Promote Your Service
                    </Link>
                  </li>
                  {/* <li>
                    <Link href="/search?q=Business%20Equipment"
                      onClick={() => window.scrollTo(0, 0)}
                      className="text-[13px] font-bold text-slate-600 hover:text-primary transition-colors"
                    >
                      Business Equipment
                    </Link>
                  </li> */}
                </ul>
              </div>

              {/* Column 4: Explore */}
              <div className="border-b border-slate-100 sm:border-none pb-4 sm:pb-0">
                <button
                  onClick={() =>
                    setExpandedFooter(
                      expandedFooter === "explore" ? null : "explore",
                    )
                  }
                  className="w-full flex justify-between items-center sm:cursor-default sm:mb-6"
                >
                  <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em]">
                    Explore
                  </h4>
                </button>
                <ul
                  className={`space-y-3 overflow-hidden transition-all duration-300 ${expandedFooter === "explore" ? "max-h-[500px] opacity-100 pt-4" : "max-h-0 opacity-0 sm:max-h-[500px] sm:opacity-100 sm:pt-0"}`}
                >
                  <li>
                    <Link
                      href="/search"
                      onClick={() => window.scrollTo(0, 0)}
                      className="text-[13px] font-bold text-slate-600 hover:text-primary transition-colors"
                    >
                      All Categories
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/search"
                      onClick={() => window.scrollTo(0, 0)}
                      className="text-[13px] font-bold text-slate-600 hover:text-primary transition-colors"
                    >
                      All Locations
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/search?q=Free"
                      onClick={() => window.scrollTo(0, 0)}
                      className="text-[13px] font-bold text-slate-600 hover:text-primary transition-colors"
                    >
                      Free Stuff
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/market-trends"
                      onClick={() => window.scrollTo(0, 0)}
                      className="text-[13px] font-bold text-slate-600 hover:text-primary transition-colors"
                    >
                      Blog & News
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Column 5: HitAds Vehicles */}
              <div className="border-b border-slate-100 sm:border-none pb-4 sm:pb-0">
                <button
                  onClick={() =>
                    setExpandedFooter(
                      expandedFooter === "vehicles" ? null : "vehicles",
                    )
                  }
                  className="w-full flex justify-between items-center sm:cursor-default sm:mb-6"
                >
                  <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em]">
                    HitAds Vehicles
                  </h4>
                </button>
                <ul
                  className={`space-y-3 overflow-hidden transition-all duration-300 ${expandedFooter === "vehicles" ? "max-h-[500px] opacity-100 pt-4" : "max-h-0 opacity-0 sm:max-h-[500px] sm:opacity-100 sm:pt-0"}`}
                >
                  <li>
                    <Link
                      href="/search?q=Cars"
                      onClick={() => window.scrollTo(0, 0)}
                      className="text-[13px] font-bold text-slate-600 hover:text-primary transition-colors"
                    >
                      Cars & Trucks
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/search?q=SUV"
                      onClick={() => window.scrollTo(0, 0)}
                      className="text-[13px] font-bold text-slate-600 hover:text-primary transition-colors"
                    >
                      SUVs
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/search?q=Pickup"
                      onClick={() => window.scrollTo(0, 0)}
                      className="text-[13px] font-bold text-slate-600 hover:text-primary transition-colors"
                    >
                      Pickup Trucks
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/search?q=Vans"
                      onClick={() => window.scrollTo(0, 0)}
                      className="text-[13px] font-bold text-slate-600 hover:text-primary transition-colors"
                    >
                      Vans
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/search?q=Parts"
                      onClick={() => window.scrollTo(0, 0)}
                      className="text-[13px] font-bold text-slate-600 hover:text-primary transition-colors"
                    >
                      Auto Parts
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Column 6: Top Categories */}
              <div className="border-b border-slate-100 sm:border-none pb-4 sm:pb-0">
                <button
                  onClick={() =>
                    setExpandedFooter(
                      expandedFooter === "categories" ? null : "categories",
                    )
                  }
                  className="w-full flex justify-between items-center sm:cursor-default sm:mb-6"
                >
                  <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em]">
                    Top Categories
                  </h4>
                </button>
                <ul
                  className={`space-y-3 overflow-hidden transition-all duration-300 ${expandedFooter === "categories" ? "max-h-[500px] opacity-100 pt-4" : "max-h-0 opacity-0 sm:max-h-[500px] sm:opacity-100 sm:pt-0"}`}
                >
                  <li>
                    <Link
                      href="/search?q=Real%20Estate"
                      onClick={() => window.scrollTo(0, 0)}
                      className="text-[13px] font-bold text-slate-600 hover:text-primary transition-colors"
                    >
                      Real Estate
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/search?q=Jobs"
                      onClick={() => window.scrollTo(0, 0)}
                      className="text-[13px] font-bold text-slate-600 hover:text-primary transition-colors"
                    >
                      Jobs
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/search?q=Services"
                      onClick={() => window.scrollTo(0, 0)}
                      className="text-[13px] font-bold text-slate-600 hover:text-primary transition-colors"
                    >
                      Local Services
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/search?q=Buy"
                      onClick={() => window.scrollTo(0, 0)}
                      className="text-[13px] font-bold text-slate-600 hover:text-primary transition-colors"
                    >
                      Buy & Sell
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/search?q=Pets"
                      onClick={() => window.scrollTo(0, 0)}
                      className="text-[13px] font-bold text-slate-600 hover:text-primary transition-colors"
                    >
                      Pets
                    </Link>
                  </li>
                </ul>
              </div>

            </div>

            <div className="pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-[10px] font-black text-slate-400 lowercase">
                {footerText}
              </div>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

export default Layout;

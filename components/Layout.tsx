import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { CURRENT_USER } from "../constants";
import logoImg from "../assets/HitAds.png";
import footerImg from "../assets/Footer.jpeg";

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
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState("");
  const [globalLocation, setGlobalLocation] = useState("");
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  const MEGA_MENU_DATA: Record<string, string[]> = {
    Vehicles: [
      "Cars & Trucks",
      "SUVs",
      "Pickup Trucks",
      "Vans",
      "Commercial Vehicles",
      "Auto Parts",
      "Tires & Rims",
      "Motorcycles",
      "ATVs",
      "Boats",
      "RVs",
      "Trailers",
      "Heavy Equipment",
      "Vehicle Services",
    ],
    "Real Estate": [
      "Houses for Sale",
      "Condos for Sale",
      "Townhouses",
      "Commercial Property",
      "Land for Sale",
      "Apartments for Rent",
      "Basements for Rent",
      "Office Space",
      "Retail Space",
      "Vacation Rentals",
      "Room Rentals",
    ],
    Jobs: [
      "General Labour",
      "Construction",
      "Driving",
      "Delivery",
      "Office Admin",
      "Accounting",
      "IT & Tech",
      "Sales",
      "Healthcare",
      "Hospitality",
      "Security",
      "Cleaning",
      "Customer Service",
      "Remote Jobs",
    ],
    "Local Services": [
      "Movers",
      "Roofing",
      "Plumbing",
      "Electrical",
      "Renovation",
      "Landscaping",
      "Cleaning",
      "Marketing Services",
      "Web Design",
      "Printing",
      "Photography",
      "Tutors",
      "Legal Services",
      "Immigration",
      "Towing",
      "Appliance Repair",
    ],
    "Buy & Sell": [
      "Furniture",
      "Electronics",
      "TVs",
      "Phones",
      "Computers",
      "Laptops",
      "Tools",
      "Appliances",
      "Home Décor",
      "Office Furniture",
      "Baby Items",
      "Musical Instruments",
      "Cameras",
      "Collectibles",
      "Jewelry",
    ],
    "Business & Industrial": [
      "Restaurant Equipment",
      "Office Equipment",
      "Commercial Supplies",
      "Warehouse Equipment",
      "POS Systems",
      "Retail Fixtures",
      "Manufacturing",
      "Packaging Supplies",
      "Forklifts",
      "Construction Equipment",
    ],
    Community: [
      "Events",
      "Volunteers",
      "Lost & Found",
      "Local News",
      "Networking",
      "Artists",
      "Musicians",
      "Activity Partners",
    ],
    Pets: [
      "Dogs",
      "Cats",
      "Fish",
      "Birds",
      "Pet Services",
      "Pet Accessories",
      "Pet Adoption",
    ],
    "Home & Garden": [
      "Furniture",
      "Gardening",
      "Kitchen",
      "Lighting",
      "Outdoor",
      "Renovation Materials",
      "Home Improvement",
    ],
    "Electronics & Computers": [
      "Laptops",
      "Desktop Computers",
      "Gaming PCs",
      "Phones",
      "Tablets",
      "Networking",
      "Cameras",
      "Smart Home",
    ],
    "Fashion & Beauty": [
      "Men’s Clothing",
      "Women’s Clothing",
      "Shoes",
      "Bags",
      "Jewelry",
      "Beauty Products",
      "Salons",
      "Watches",
    ],
    "Events & Entertainment": [
      "Concerts",
      "Business Events",
      "Wedding Services",
      "DJs",
      "Party Rentals",
      "Tickets",
      "Catering",
    ],
  };

  const CATEGORIES = Object.keys(MEGA_MENU_DATA);

  const handleGlobalSearch = (e: React.FormEvent) => {
    e.preventDefault();
    let url = "/search?";
    if (globalSearch.trim())
      url += `q=${encodeURIComponent(globalSearch.trim())}&`;
    if (globalLocation.trim())
      url += `loc=${encodeURIComponent(globalLocation.trim())}&`;
    navigate(url.replace(/&$/, ""));
  };

  const isAdminPage =
    location.pathname.startsWith("/admin") ||
    location.pathname.startsWith("/dashboard");
  const isLoginPage =
    location.pathname === "/login" || location.pathname === "/admin-login";

  const handleLogoutClick = () => {
    onLogout();
    navigate("/");
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="sticky top-0 z-50 bg-white border-b border-slate-100">
        <div className="w-full px-4 sm:px-6 lg:px-10">
          <div className="flex justify-between items-center h-24 gap-4 lg:gap-8">
            {/* Logo Section */}
            <div className="flex-1 shrink-0 flex items-center justify-start">
              <Link to="/" className="flex items-center gap-1">
                <img
                  src={logoImg}
                  alt="HitAds Logo"
                  className="h-20 object-contain transition-transform hover:scale-105 mix-blend-multiply"
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
                  <div className="flex-1 relative flex items-center group">
                    <span className="material-icons absolute left-4 text-slate-400 text-xl group-focus-within:text-primary transition-colors">
                      location_on
                    </span>
                    <input
                      type="text"
                      value={globalLocation}
                      onChange={(e) => setGlobalLocation(e.target.value)}
                      placeholder="Any Location..."
                      className="w-full bg-transparent border-none focus:ring-0 text-sm font-bold text-slate-800 placeholder:text-slate-400 placeholder:font-medium pl-12 pr-4 py-2.5 outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-primary hover:bg-primary-hover text-white px-8 py-3 rounded-full transition-all flex items-center justify-center font-black text-[11px] uppercase tracking-widest shadow-sm hover:shadow-md hover:-translate-y-[1px] active:translate-y-0 ml-1"
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
                  to="/post-ad"
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
                    to="/login"
                    state={{ mode: "register" }}
                    className="flex flex-col items-center justify-center text-slate-600 hover:text-primary transition-colors group"
                  >
                    <span className="material-icons text-[26px] group-hover:scale-110 transition-transform">
                      person_add
                    </span>
                    <span className="text-[11px] font-bold mt-1">Sign up</span>
                  </Link>
                  <Link
                    to="/login"
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
                        to="/dashboard"
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
                      to="/profile"
                      className="flex flex-col items-center justify-center text-slate-600 hover:text-primary transition-colors group"
                    >
                      <span className="material-icons text-[26px] group-hover:scale-110 transition-transform">
                        account_circle
                      </span>
                      <span className="text-[11px] font-bold mt-1">
                        Profile
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
                  to="/post-ad"
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
                <Link
                  to="/search"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-4 py-3 text-lg font-black text-slate-900 hover:bg-slate-50 rounded-2xl transition-all"
                >
                  Browse
                </Link>
                {isLoggedIn && isAdmin && (
                  <Link
                    to="/dashboard"
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
                  <Link
                    to="/profile"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-4 py-3 text-lg font-black text-slate-900 hover:bg-slate-50 rounded-2xl transition-all"
                  >
                    My Profile
                  </Link>
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
                      to="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-4 py-3 text-lg font-black text-slate-900 hover:bg-slate-50 rounded-2xl transition-all"
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/login"
                      state={{ mode: "register" }}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block w-full text-center py-4 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl"
                    >
                      Join Free
                    </Link>
                  </div>
                )}
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
                        to={`/search?cat=${encodeURIComponent(cat)}`}
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
                  {hoveredCategory && MEGA_MENU_DATA[hoveredCategory] && (
                    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-y-5 gap-x-8">
                      {MEGA_MENU_DATA[hoveredCategory].map((subCat) => (
                        <Link
                          key={subCat}
                          to={`/search?cat=${encodeURIComponent(hoveredCategory)}&sub=${encodeURIComponent(subCat)}`}
                          className="text-[13px] font-bold text-slate-600 hover:text-primary transition-colors flex items-center gap-2 group"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-300 group-hover:bg-primary transition-colors shrink-0"></span>
                          <span className="truncate">{subCat}</span>
                        </Link>
                      ))}
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
                      to="/buying-guides"
                      className="text-[13px] font-bold text-slate-600 hover:text-primary transition-colors"
                    >
                      Buying Guides
                    </Link>

                    <Link
                      to="/selling-advice"
                      className="text-[13px] font-bold text-slate-600 hover:text-primary transition-colors"
                    >
                      Selling Advice
                    </Link>

                    <Link
                      to="/market-trends"
                      className="text-[13px] font-bold text-slate-600 hover:text-primary transition-colors"
                    >
                      Market Trends
                    </Link>

                    <Link
                      to="/safety-tips"
                      className="text-[13px] font-bold text-slate-600 hover:text-primary transition-colors"
                    >
                      Safety Tips
                    </Link>
                  </div>
                  <div className="rounded-xl overflow-hidden shadow-md relative group cursor-pointer">
                    <img
                      src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80"
                      alt="Guides"
                      className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-4">
                      <span className="text-white font-bold text-sm">
                        Read the {hoveredCategory} guide
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      <main className="flex-grow">{children}</main>

      {!isLoginPage && (
        <footer className="relative mt-16 md:mt-24 pt-24 pb-12 bg-white border-t border-slate-100 overflow-hidden">
          <div className="relative z-10 w-full px-4 sm:px-6 lg:px-10">
            <div className="flex gap-4 mb-12">
              <a
                href="#"
                className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-primary hover:border-primary transition-all"
              >
                <span className="material-icons text-lg">facebook</span>
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-primary hover:border-primary transition-all font-black text-xs"
              >
                X
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-primary hover:border-primary transition-all"
              >
                <span className="material-icons text-lg">tag</span>
              </a>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8 mb-16">
              {/* Column 1: Tips & Help */}
              <div className="space-y-6">
                <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em]">
                  Tips & Help
                </h4>
                <ul className="space-y-3">
                  {/* <li>
                    <Link
                      to="/help"
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
                      to="/contact"
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
                      to="/buying-guides"
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
                      to="/safety-tips"
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
                      to="/selling-advice"
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
                      to="/market-trends"
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
              <div className="space-y-6">
                <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em]">
                  Legal
                </h4>
                <ul className="space-y-3">
                  <li>
                    <Link
                      to="/terms"
                      onClick={() => window.scrollTo(0, 0)}
                      className="text-[13px] font-bold text-slate-600 hover:text-primary transition-colors"
                    >
                      Terms & Conditions
                    </Link>
                  </li>

                  <li>
                    <Link
                      to="/terms"
                      onClick={() => window.scrollTo(0, 0)}
                      className="text-[13px] font-bold text-slate-600 hover:text-primary transition-colors"
                    >
                      Privacy Policy
                    </Link>
                  </li>
                  {/* <li>
                    <Link
                      to="/terms"
                      onClick={() => window.scrollTo(0, 0)}
                      className="text-[13px] font-bold text-slate-600 hover:text-primary transition-colors"
                    >
                      Posting Policy
                    </Link>
                  </li> */}
                  {/* <li>
                    <Link
                      to="/terms"
                      onClick={() => window.scrollTo(0, 0)}
                      className="text-[13px] font-bold text-slate-600 hover:text-primary transition-colors"
                    >
                      Cookie Policy
                    </Link>
                  </li> */}
                </ul>
              </div>

              {/* Column 3: For Business */}
              <div className="space-y-6">
                <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em]">
                  For Business
                </h4>
                <ul className="space-y-3">
                  <li>
                    <Link
                      to="/contact"
                      onClick={() => window.scrollTo(0, 0)}
                      className="text-[13px] font-bold text-slate-600 hover:text-primary transition-colors"
                    >
                      Business Advertising
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/contact"
                      onClick={() => window.scrollTo(0, 0)}
                      className="text-[13px] font-bold text-slate-600 hover:text-primary transition-colors"
                    >
                      Promote Your Service
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/search?q=Business%20Equipment"
                      onClick={() => window.scrollTo(0, 0)}
                      className="text-[13px] font-bold text-slate-600 hover:text-primary transition-colors"
                    >
                      Business Equipment
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Column 4: Explore */}
              <div className="space-y-6">
                <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em]">
                  Explore
                </h4>
                <ul className="space-y-3">
                  <li>
                    <Link
                      to="/search"
                      onClick={() => window.scrollTo(0, 0)}
                      className="text-[13px] font-bold text-slate-600 hover:text-primary transition-colors"
                    >
                      All Categories
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/search"
                      onClick={() => window.scrollTo(0, 0)}
                      className="text-[13px] font-bold text-slate-600 hover:text-primary transition-colors"
                    >
                      All Locations
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/search?q=Free"
                      onClick={() => window.scrollTo(0, 0)}
                      className="text-[13px] font-bold text-slate-600 hover:text-primary transition-colors"
                    >
                      Free Stuff
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/market-trends"
                      onClick={() => window.scrollTo(0, 0)}
                      className="text-[13px] font-bold text-slate-600 hover:text-primary transition-colors"
                    >
                      Blog & News
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Column 5: HitAds Vehicles */}
              <div className="space-y-6">
                <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em]">
                  HitAds Vehicles
                </h4>
                <ul className="space-y-3">
                  <li>
                    <Link
                      to="/search?q=Cars"
                      onClick={() => window.scrollTo(0, 0)}
                      className="text-[13px] font-bold text-slate-600 hover:text-primary transition-colors"
                    >
                      Cars & Trucks
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/search?q=SUV"
                      onClick={() => window.scrollTo(0, 0)}
                      className="text-[13px] font-bold text-slate-600 hover:text-primary transition-colors"
                    >
                      SUVs
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/search?q=Pickup"
                      onClick={() => window.scrollTo(0, 0)}
                      className="text-[13px] font-bold text-slate-600 hover:text-primary transition-colors"
                    >
                      Pickup Trucks
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/search?q=Vans"
                      onClick={() => window.scrollTo(0, 0)}
                      className="text-[13px] font-bold text-slate-600 hover:text-primary transition-colors"
                    >
                      Vans
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/search?q=Parts"
                      onClick={() => window.scrollTo(0, 0)}
                      className="text-[13px] font-bold text-slate-600 hover:text-primary transition-colors"
                    >
                      Auto Parts
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Column 6: Top Categories */}
              <div className="space-y-6">
                <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em]">
                  Top Categories
                </h4>
                <ul className="space-y-3">
                  <li>
                    <Link
                      to="/search?q=Real%20Estate"
                      onClick={() => window.scrollTo(0, 0)}
                      className="text-[13px] font-bold text-slate-600 hover:text-primary transition-colors"
                    >
                      Real Estate
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/search?q=Jobs"
                      onClick={() => window.scrollTo(0, 0)}
                      className="text-[13px] font-bold text-slate-600 hover:text-primary transition-colors"
                    >
                      Jobs
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/search?q=Services"
                      onClick={() => window.scrollTo(0, 0)}
                      className="text-[13px] font-bold text-slate-600 hover:text-primary transition-colors"
                    >
                      Local Services
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/search?q=Buy"
                      onClick={() => window.scrollTo(0, 0)}
                      className="text-[13px] font-bold text-slate-600 hover:text-primary transition-colors"
                    >
                      Buy & Sell
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/search?q=Pets"
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
                © 2026 HitAds.ca — Free Ads. Sell Fast. Buy Local. Canada Wide.
              </div>
              <div className="flex gap-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <Link
                  to="/contact"
                  onClick={() =>
                    window.scrollTo({ top: 0, behavior: "smooth" })
                  }
                  className="hover:text-primary transition-colors"
                >
                  Contact
                </Link>
              </div>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

export default Layout;

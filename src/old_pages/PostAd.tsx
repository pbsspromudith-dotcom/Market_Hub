"use client";

import React, { useState, useEffect } from "react";
import Link from 'next/link';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { trackListingSubmission } from "../analytics";
import MonerisPayModal from "../components/MonerisPayModal";
import { useUI } from "../components/UIProvider";
import LocationAutocomplete from "../components/LocationAutocomplete";
import PricingPlansModal from "../components/PricingPlansModal";
const CAR_FEATURES_LIST = [
  "Alloy Wheels",
  "Backup Camera",
  "Bluetooth",
  "Leather Seats",
  "Cruise Control",
  "Remote Start",
  "Navigation System",
  "Blind Spot Monitor",
  "Sunroof/Moonroof",
  "Heated Seats",
];

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

const getTitlePlaceholder = (category: string) => {
  if (!category) return "e.g. Ad Title";
  const catLower = category.toLowerCase();
  
  if (catLower.startsWith("vehicles")) {
    return "e.g. 2018 Honda Civic LX - Excellent Condition";
  }
  if (catLower.startsWith("real estate")) {
    return "e.g. Beautiful 3 Bedroom House for Sale in Toronto";
  }
  if (catLower.startsWith("jobs")) {
    return "e.g. Experienced Software Engineer Needed / Part-Time Line Cook";
  }
  if (catLower.startsWith("local services")) {
    return "e.g. Professional Home Cleaning & Janitorial Services";
  }
  if (catLower.startsWith("buy & sell") || catLower.startsWith("buy and sell")) {
    return "e.g. Solid Oak Dining Table with 6 Chairs";
  }
  if (catLower.startsWith("business & industrial") || catLower.startsWith("business and industrial")) {
    return "e.g. Commercial Grade Printing Press / Industrial Forklift";
  }
  if (catLower.startsWith("community")) {
    return "e.g. Neighbourhood Garage Sale this Saturday / Lost Golden Retriever";
  }
  if (catLower.startsWith("pets")) {
    return "e.g. Friendly 8-Week-Old Golden Retriever Puppies";
  }
  if (catLower.startsWith("home & garden") || catLower.startsWith("home and garden")) {
    return "e.g. Brand New Premium Gas BBQ Grill for Patio";
  }
  if (catLower.startsWith("electronics")) {
    return "e.g. PlayStation 5 Console 825GB - Like New in Box";
  }
  if (catLower.startsWith("fashion")) {
    return "e.g. Authentic Men's Rolex Submariner Watch";
  }
  if (catLower.startsWith("events")) {
    return "e.g. Live Wedding DJ & Lighting Services / Concert Tickets";
  }
  
  return "e.g. Brand Name, Model, or Key Details";
};

const PostAd: React.FC = () => {
  const [step, setStep] = useState(1);
  const navigate = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { showAlert, showConfirm } = useUI();

  useEffect(() => {
    // Auth Check
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      showAlert("You must be logged in to post an ad.", "info");
      navigate.push("/login?redirect=/post-ad");
      return;
    }

    if (!searchParams?.get("edit")) {
      setStep(1);
      setCategory("");
      setTitle("");
      setDescription("");
      setPrice("");
      setPriceType("amount");
      setLocation("");
      setPostalCode("");
      setCarMake("");
      setCarModel("");
      setCarFeatures([]);
      setYoutubeLink("");
      setFacebookLink("");
      setElectronBrand("");
      setElectronModel("");
      setImageFiles(Array(20).fill(null));
      setImagePreviews(Array(20).fill(null));
      setPostInMultipleCities(false);
      setSelectedCities([]);
      setCategoryPath([]);
      setTemplateConfig({});
    }
  }, [pathname, searchParams]);

  const [isEditMode, setIsEditMode] = useState(false);
  const [loadingEditData, setLoadingEditData] = useState(false);

  // State for form
  const [category, setCategory] = useState("");

  // Plan selection state (HitAds 3-tier plans: Free, Boost $9.99, Premium $24.99)
  const [selectedPlan, setSelectedPlan] = useState<'free' | 'boost' | 'premium'>('free');
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);

  // Standalone promotional publishing modes (Homepage Ad, Top Ad, Urgent Ad, Highlighted Ad)
  const [promotionData, setPromotionData] = useState({
    is_top_ad: false,
    is_highlighted: false,
    is_urgent: false,
    is_home_gallery: false,
    top_ad_duration: 7,
    highlighted_duration: 7,
    urgent_duration: 7,
    home_gallery_duration: 7,
  });
  const [promotionPricing, setPromotionPricing] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/promotions/pricing')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          setPromotionPricing(data.data);
          setPromotionData((prev) => {
            const getValidDuration = (type: string, currentDuration: number) => {
              const opts = data.data.filter((p: any) => p.promotion_type?.toLowerCase().replace(/\s+/g, '_') === type.toLowerCase().replace(/\s+/g, '_'));
              if (opts.length > 0) {
                const match = opts.find((p: any) => Number(p.duration_days) === Number(currentDuration));
                if (match) return Number(match.duration_days);
                return Number(opts[0].duration_days);
              }
              return currentDuration;
            };

            return {
              ...prev,
              top_ad_duration: getValidDuration('top_ad', prev.top_ad_duration),
              highlighted_duration: getValidDuration('highlighted', prev.highlighted_duration),
              urgent_duration: getValidDuration('urgent', prev.urgent_duration),
              home_gallery_duration: getValidDuration('home_gallery', prev.home_gallery_duration),
            };
          });
        }
      })
      .catch(console.error);
  }, []);

  const getPromotionOptions = (type: string, fallbackPrice: number) => {
    const normType = type.toLowerCase().replace(/\s+/g, '_');
    const opts = promotionPricing.filter(
      (p: any) => p.promotion_type?.toLowerCase().replace(/\s+/g, '_') === normType
    );
    if (opts.length > 0) return opts;
    return [{ duration_days: 7, price: fallbackPrice }];
  };

  const calculatePromoPrice = (type: string, duration: number, fallbackPrice: number) => {
    const opts = getPromotionOptions(type, fallbackPrice);
    const match = opts.find((p: any) => Number(p.duration_days) === Number(duration));
    if (match) return Number(match.price);
    return Number(opts[0]?.price || fallbackPrice);
  };

  const getAddonTotal = () => {
    let subtotal = 0;
    if (selectedPlan === 'free' && promotionData.is_top_ad) {
      subtotal += calculatePromoPrice('top_ad', promotionData.top_ad_duration, 9.99);
    }
    if (selectedPlan !== 'premium' && promotionData.is_highlighted) {
      subtotal += calculatePromoPrice('highlighted', promotionData.highlighted_duration, 4.99);
    }
    if (promotionData.is_urgent) {
      subtotal += calculatePromoPrice('urgent', promotionData.urgent_duration, 5.99);
    }
    if (selectedPlan !== 'premium' && promotionData.is_home_gallery) {
      subtotal += calculatePromoPrice('home_gallery', promotionData.home_gallery_duration, 14.99);
    }
    return subtotal;
  };

  const getPlanPrice = (plan: 'free' | 'boost' | 'premium') => {
    if (plan === 'free') return 0;
    if (plan === 'boost') {
      const match = promotionPricing.find((p: any) => 
        p.promotion_type?.toLowerCase() === 'plan_boost' || p.promotion_type?.toLowerCase() === 'boost'
      );
      return match ? Number(match.price) : 9.99;
    }
    if (plan === 'premium') {
      const match = promotionPricing.find((p: any) => 
        p.promotion_type?.toLowerCase() === 'plan_premium' || p.promotion_type?.toLowerCase() === 'premium'
      );
      return match ? Number(match.price) : 24.99;
    }
    return 0;
  };

  const getGrandTotal = () => {
    let planPrice = getPlanPrice(selectedPlan);
    let addonPrice = getAddonTotal();
    let subtotal = planPrice + addonPrice;
    let tax = Math.round(subtotal * 0.13 * 100) / 100;
    return {
      planPrice,
      addonPrice,
      subtotal,
      tax,
      total: Math.round((subtotal + tax) * 100) / 100,
    };
  };

  // Moneris Checkout payment state
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [payTicket, setPayTicket] = useState("");
  const [payAmount, setPayAmount] = useState(0);
  const [payEnvironment, setPayEnvironment] = useState("qa");
  const [createdListingId, setCreatedListingId] = useState<number | null>(null);
  const [createdNeedsApproval, setCreatedNeedsApproval] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [priceType, setPriceType] = useState("amount");
  const [priceOptions, setPriceOptions] = useState<any[]>([]);
  const [location, setLocation] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [contactEmail, setContactEmail] = useState("");

  // Multi-city posting state
  const [postInMultipleCities, setPostInMultipleCities] = useState(false);
  const [selectedCities, setSelectedCities] = useState<{location: string; postalCode: string; latitude?: number | null; longitude?: number | null}[]>([]);
  const [citySearchQuery, setCitySearchQuery] = useState("");
  const [citySearchSuggestions, setCitySearchSuggestions] = useState<any[]>([]);
  const [isSearchingCity, setIsSearchingCity] = useState(false);
  const [showCitySuggestions, setShowCitySuggestions] = useState(false);
  const [contactPhone, setContactPhone] = useState("");
  const [includeEmail, setIncludeEmail] = useState(false);
  const [includePhone, setIncludePhone] = useState(false);
  const [carMake, setCarMake] = useState("");
  const [isCustomMake, setIsCustomMake] = useState(false);
  const [carModel, setCarModel] = useState("");
  const [isCustomModel, setIsCustomModel] = useState(false);
  const [carYear, setCarYear] = useState("");
  const [carTransmission, setCarTransmission] = useState("");
  const [carFuelType, setCarFuelType] = useState("");
  const [carMileage, setCarMileage] = useState("");
  const [carVIN, setCarVIN] = useState("");
  const [carTrim, setCarTrim] = useState("");
  const [carBodyType, setCarBodyType] = useState("");
  const [carDrivetrain, setCarDrivetrain] = useState("");
  const [carColor, setCarColor] = useState("");
  const [carDoors, setCarDoors] = useState("");
  const [carSeatingCapacity, setCarSeatingCapacity] = useState("");
  const [carFeatures, setCarFeatures] = useState<string[]>([]);
  const [youtubeLink, setYoutubeLink] = useState("");
  const [facebookLink, setFacebookLink] = useState("");
  // Job-specific fields
  const [jobType, setJobType] = useState("");
  const [jobEmploymentType, setJobEmploymentType] = useState("");
  const [jobExperience, setJobExperience] = useState("");
  const [jobSalaryMin, setJobSalaryMin] = useState("");
  const [jobSalaryMax, setJobSalaryMax] = useState("");
  // Real Estate specific
  const [reBedrooms, setReBedrooms] = useState("");
  const [reBathrooms, setReBathrooms] = useState("");
  const [reSize, setReSize] = useState("");
  // Shared
  const [condition, setCondition] = useState("New");
  // Electronics-specific fields (Mobile Phones & Computers)
  const [electronBrand, setElectronBrand] = useState("");
  const [electronModel, setElectronModel] = useState("");
  const [imageFiles, setImageFiles] = useState<(File | null)[]>(
    Array(20).fill(null),
  );
  const [imagePreviews, setImagePreviews] = useState<(string | null)[]>(
    Array(20).fill(null),
  );
  const [isPublishing, setIsPublishing] = useState(false);
  const [dbOptions, setDbOptions] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/options/read")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          setDbOptions(data.data);
        }
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    fetch("/api/options/read?type=price_option")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          setPriceOptions(data.data);
        }
      })
      .catch(console.error);
  }, []);

  const handleReset = () => {
    showConfirm({
      title: "Clear Form",
      message: "Are you sure you want to clear the entire form? All your progress will be lost.",
      isDestructive: true,
      onConfirm: () => {
        setStep(1);
        setCategory("");
        setTitle("");
        setDescription("");
        setPrice("");
        setPriceType("amount");
        setLocation("");
        setPostalCode("");
        setContactEmail("");
        setContactPhone("");
        setIncludeEmail(false);
        setIncludePhone(false);
        setCarVIN("");
        setCarMake("");
        setCarModel("");
        setCarYear("");
        setCarTrim("");
        setCarMileage("");
        setCarTransmission("");
        setCarFuelType("");
        setCarBodyType("");
        setCarDrivetrain("");
        setCarColor("");
        setCarDoors("");
        setCarSeatingCapacity("");
        setCarFeatures([]);
        setYoutubeLink("");
        setFacebookLink("");
        setElectronBrand("");
        setElectronModel("");
        setSelectedPlan("free");
        setImageFiles(Array(20).fill(null));
        setImagePreviews(Array(20).fill(null));
        setPostInMultipleCities(false);
        setSelectedCities([]);
        setCitySearchQuery("");
      }
    });
  };

  const handleSelectLocation = (place: any) => {
    const cleanAddr = place.fullAddress || getCleanAddressString(place);
    setLocation(cleanAddr);
    if (place.address?.postcode) {
      setPostalCode(place.address.postcode);
    }
    if (place.lat && place.lon) {
      setLatitude(parseFloat(place.lat));
      setLongitude(parseFloat(place.lon));
    }
  };

  const handleSelectCity = (place: any) => {
    if (selectedCities.length >= 5) {
      showAlert("You can select up to 5 cities maximum for Multi-City posting.", "warning");
      setCitySearchQuery("");
      return;
    }
    const cleanAddr = place.fullAddress || getCleanAddressString(place);
    const pc = place.address?.postcode || "";
    const lat = place.lat ? parseFloat(place.lat) : null;
    const lon = place.lon ? parseFloat(place.lon) : null;
    // Avoid duplicates (case-insensitive)
    if (!selectedCities.some(c => c.location.toLowerCase() === cleanAddr.toLowerCase())) {
      setSelectedCities(prev => {
        if (prev.length >= 5) return prev;
        return [...prev, { location: cleanAddr, postalCode: pc, latitude: lat, longitude: lon }];
      });
    } else {
      showAlert("This city has already been added.", "info");
    }
    setCitySearchQuery("");
  };

  const handleAddCustomCity = (cityName: string) => {
    const cleanCity = cityName.trim();
    if (!cleanCity) return;
    if (selectedCities.length >= 5) {
      showAlert("You can select up to 5 cities maximum for Multi-City posting.", "warning");
      setCitySearchQuery("");
      return;
    }
    // Avoid duplicates (case-insensitive)
    if (!selectedCities.some(c => c.location.toLowerCase() === cleanCity.toLowerCase())) {
      setSelectedCities(prev => {
        if (prev.length >= 5) return prev;
        return [...prev, { location: cleanCity, postalCode: "" }];
      });
    } else {
      showAlert("This city has already been added.", "info");
    }
    setCitySearchQuery("");
  };

  const handleRemoveCity = (index: number) => {
    setSelectedCities(prev => prev.filter((_, i) => i !== index));
  };

  const [categoriesTree, setCategoriesTree] = useState<any[]>([]);
  const [categoryPath, setCategoryPath] = useState<any[]>([]);
  const [templateConfig, setTemplateConfig] = useState<any>({});
  const [dynamicAttributesList, setDynamicAttributesList] = useState<any[]>([]);
  const [dynamicAttributesValues, setDynamicAttributesValues] = useState<
    Record<string, string>
  >({});

  // Resolve template config by walking up the category path
  const resolveTemplate = (path: any[]) => {
    for (let i = path.length - 1; i >= 0; i--) {
      if (path[i]?.template_config) {
        try {
          const cfg = typeof path[i].template_config === 'string'
            ? JSON.parse(path[i].template_config)
            : path[i].template_config;
          if (typeof cfg === 'string') {
            try {
              const double = JSON.parse(cfg);
              if (typeof double === 'object' && double !== null) return double;
            } catch {}
          }
          if (typeof cfg === 'object' && cfg !== null) return cfg;
        } catch {
          try {
            const unescaped = String(path[i].template_config).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
            const cfg = JSON.parse(unescaped);
            if (typeof cfg === 'object' && cfg !== null) return cfg;
          } catch {}
        }
      }
    }
    return {}; // default: all fields visible
  };

  useEffect(() => {
    fetch("/api/categories/read")
      .then((res) => res.json())
      .then((res) => {
        if (res.success && Array.isArray(res.data)) {
          setCategoriesTree(res.data);
        }
      })
      .catch((err) => console.error("Error loading categories", err));
  }, []);

  const editId = searchParams?.get("edit") || null;

  useEffect(() => {
    if (editId && categoriesTree.length > 0) {
      setLoadingEditData(true);
      const userStr = localStorage.getItem("user");
      let viewerParams = '';
      if (userStr) {
        try {
          const u = JSON.parse(userStr);
          if (u.id) viewerParams += `&viewer_id=${u.id}`;
          if (u.role) viewerParams += `&viewer_role=${u.role}`;
        } catch (e) {}
      }
      fetch(`/api/listings/read_single?id=${editId}${viewerParams}`)
        .then((res) => res.json())
        .then((l) => {
          if (l.error) {
            showAlert("Listing not found or error loading listing.", "error");
            navigate.push("/profile");
            return;
          }
          
          // Verify owner or admin status
          const userStr = localStorage.getItem("user");
          const currentUser = userStr ? JSON.parse(userStr) : null;
          if (!currentUser || (currentUser.id !== l.user_id && !currentUser.isAdmin && currentUser.role !== "admin")) {
            showAlert("You are not authorized to edit this ad.", "error");
            navigate.push("/profile");
            return;
          }

          setIsEditMode(true);
          setTitle(l.title);
          setPrice(l.price.toString());
          setPriceType(l.price_type || "amount");
          setCategory(l.category || "");
          setLocation(l.location || "");
          setPostalCode(l.postal_code || "");
          setContactEmail(l.contact_email || "");
          setContactPhone(l.contact_phone || "");
          setIncludeEmail(!!l.contact_email);
          setIncludePhone(!!l.contact_phone);
          setYoutubeLink(l.youtube_link || "");
          setFacebookLink(l.facebook_link || "");

          // Populate imagePreviews with existing image URLs
          const previews = Array(10).fill(null);
          if (l.allImages && Array.isArray(l.allImages)) {
            l.allImages.forEach((img: string, idx: number) => {
              if (idx < 10) previews[idx] = img;
            });
          }
          setImagePreviews(previews);

          // Parse category path
          if (l.category) {
            const catParts = l.category.split(" > ").map((c: string) => c.trim());
            const parsedPath: any[] = [];
            let currentLevel = categoriesTree;
            
            for (const part of catParts) {
              const matchedCat = currentLevel.find((c: any) => c.CategoryName === part);
              if (matchedCat) {
                parsedPath.push(matchedCat);
                currentLevel = matchedCat.children || [];
              } else {
                break;
              }
            }
            setCategoryPath(parsedPath);
            setTemplateConfig(resolveTemplate(parsedPath));
          }

          // Parse description and extract attributes
          if (l.description) {
            const lines = l.description.split("\n");
            const attrVals: Record<string, string> = {};
            const features: string[] = [];
            const descriptionLines: string[] = [];
            let readingDesc = false;

            for (let line of lines) {
              const trimmed = line.trim();
              if (trimmed === "") {
                if (readingDesc || Object.keys(attrVals).length > 0 || features.length > 0) {
                  readingDesc = true;
                }
                continue;
              }
              if (!readingDesc) {
                const parts = trimmed.split(":");
                if (parts.length >= 2) {
                  const key = parts[0].trim();
                  const val = parts.slice(1).join(":").trim();
                  if (key === "Features") {
                    features.push(...val.split(",").map((f: string) => f.trim()));
                  } else {
                    attrVals[key] = val;
                  }
                } else {
                  readingDesc = true;
                  descriptionLines.push(trimmed);
                }
              } else {
                descriptionLines.push(trimmed);
              }
            }
            setDescription(descriptionLines.join("\n"));
            setDynamicAttributesValues(attrVals);
            setCarFeatures(features);
            
            // Set vehicle fields if present in parsed attributes
            if (attrVals["VIN"]) setCarVIN(attrVals["VIN"]);
            if (attrVals["Make"]) setCarMake(attrVals["Make"]);
            if (attrVals["Model"]) setCarModel(attrVals["Model"]);
            if (attrVals["Year"]) setCarYear(attrVals["Year"]);
            if (attrVals["Trim"]) setCarTrim(attrVals["Trim"]);
            if (attrVals["Kilometers"]) setCarMileage(attrVals["Kilometers"].replace(" km", ""));
            if (attrVals["Transmission"]) setCarTransmission(attrVals["Transmission"]);
            if (attrVals["Fuel Type"]) setCarFuelType(attrVals["Fuel Type"]);
            if (attrVals["Body Type"]) setCarBodyType(attrVals["Body Type"]);
            if (attrVals["Drivetrain"]) setCarDrivetrain(attrVals["Drivetrain"]);
            if (attrVals["Color"]) setCarColor(attrVals["Color"]);
            if (attrVals["Doors"]) setCarDoors(attrVals["Doors"]);
            if (attrVals["Seating Capacity"]) setCarSeatingCapacity(attrVals["Seating Capacity"]);

            // Set condition specifically if it exists in parsed attributes
            if (attrVals["Condition"]) {
              setCondition(attrVals["Condition"]);
            }
          }
        })
        .catch((err) => {
          console.error("Error fetching listing details:", err);
          showAlert("Error loading listing details.", "error");
          navigate.push("/profile");
        })
        .finally(() => setLoadingEditData(false));
    }
  }, [editId, categoriesTree, navigate]);


  useEffect(() => {
    const leafCategory = categoryPath.length > 0 ? categoryPath[categoryPath.length - 1] : null;
    if (leafCategory) {
      fetch(
        `/api/categories/attributes?category_id=${leafCategory.CategoryID}`,
      )
        .then((res) => res.json())
        .then((res) => {
          if (res.success && Array.isArray(res.data)) {
            setDynamicAttributesList(res.data);
            setDynamicAttributesValues((prev) => {
              const nextVals = { ...prev };
              res.data.forEach((attr: any) => {
                if (nextVals[attr.AttributeName] === undefined) {
                  nextVals[attr.AttributeName] = "";
                }
              });
              return nextVals;
            });
          }
        })
        .catch((err) => console.error("Error loading attributes", err));
    } else {
      setDynamicAttributesList([]);
      setDynamicAttributesValues({});
    }
  }, [categoryPath]);

  const handleCategoryClick = (cat: any) => {
    const newPath = [...categoryPath, cat];
    setCategoryPath(newPath);
    setTemplateConfig(resolveTemplate(newPath));
    if (!cat.children || cat.children.length === 0) {
      setCategory(newPath.map((c) => c.CategoryName).join(" > "));
    }
  };

  const handleCategoryBack = () => {
    const newPath = categoryPath.slice(0, -1);
    setCategoryPath(newPath);
    setCategory("");
    setTemplateConfig(resolveTemplate(newPath));
  };

  const handleCategoryReset = () => {
    setCategoryPath([]);
    setCategory("");
    setTemplateConfig({});
  };

  const currentLevelCategories =
    categoryPath.length === 0
      ? categoriesTree
      : categoryPath[categoryPath.length - 1].children || [];

  const isVehicleSpecCategory = (path: any[], catString: string) => {
    const names: string[] = [];
    if (Array.isArray(path)) {
      for (const node of path) {
        if (node?.CategoryName) names.push(String(node.CategoryName).trim());
      }
    }
    if (names.length === 0 && typeof catString === "string") {
      names.push(...catString.split(" > ").map(s => s.trim()));
    }

    if (names.length === 0) return false;
    if (names[0].toLowerCase() !== "vehicles") return false;

    const subCat = names[1] ? names[1].toUpperCase() : "";
    if (!subCat) return false;

    // Strictly allowed 7 vehicle subcategories:
    const ALLOWED = [
      "CARS & TRUCKS",
      "SUVS",
      "PICKUP TRUCKS",
      "VANS",
      "COMMERCIAL VEHICLES",
      "MOTORCYCLES",
      "CLASSIC CARS"
    ];

    return ALLOWED.includes(subCat);
  };

  const handlePublish = async (chosenPlan?: 'free' | 'boost' | 'premium') => {
    setIsPublishing(true);
    const planToUse = chosenPlan || selectedPlan;
    try {
      const userStr = localStorage.getItem("user");
      const user = userStr ? JSON.parse(userStr) : null;
      const userId = user ? user.id : 1;

      const attrDetails = [];
      for (const [key, val] of Object.entries(dynamicAttributesValues)) {
        if (val) attrDetails.push(`${key}: ${val}`);
      }

      // Add vehicle characteristics if posting under allowed Vehicle categories
      const isVehicleCategory = isVehicleSpecCategory(categoryPath, category);
      
      if (isVehicleCategory) {
        if (carVIN) attrDetails.push(`VIN: ${carVIN.toUpperCase().trim()}`);
        if (carMake) attrDetails.push(`Make: ${carMake}`);
        if (carModel) attrDetails.push(`Model: ${carModel}`);
        if (carYear) attrDetails.push(`Year: ${carYear}`);
        if (carTrim) attrDetails.push(`Trim: ${carTrim}`);
        if (carMileage) attrDetails.push(`Kilometers: ${carMileage} km`);
        if (carTransmission) attrDetails.push(`Transmission: ${carTransmission}`);
        if (carFuelType) attrDetails.push(`Fuel Type: ${carFuelType}`);
        if (carBodyType) attrDetails.push(`Body Type: ${carBodyType}`);
        if (carDrivetrain) attrDetails.push(`Drivetrain: ${carDrivetrain}`);
        if (carColor) attrDetails.push(`Color: ${carColor}`);
        if (carDoors) attrDetails.push(`Doors: ${carDoors}`);
        if (carSeatingCapacity) attrDetails.push(`Seating Capacity: ${carSeatingCapacity}`);
      }

      if (carFeatures.length > 0 && !templateConfig.hideCarFeatures && isVehicleCategory) {
        attrDetails.push(`Features: ${carFeatures.join(", ")}`);
      }
      if (!templateConfig.hideBrandModel) {
        if (electronBrand) attrDetails.push(`Brand: ${electronBrand}`);
        if (electronModel) attrDetails.push(`Model: ${electronModel}`);
      }
      if (!templateConfig.hideCondition) {
        attrDetails.push(`Condition: ${condition}`);
      }

      const finalTitle = templateConfig.hideTitle ? `${category.split(" > ").pop()} Listing` : title;
      const finalDescription = templateConfig.hideDescription 
        ? (attrDetails.length > 0 ? attrDetails.join("\n") : "No description provided.") 
        : (attrDetails.length > 0 ? attrDetails.join("\n") + "\n\n" + description : description);

      // 1. Gather any new files to upload based on plan limit
      const maxAllowedPhotos = planToUse === 'free' ? 10 : 20;
      const newFilesIndices: number[] = [];
      const validFiles: File[] = [];
      imageFiles.slice(0, maxAllowedPhotos).forEach((file, idx) => {
        if (file !== null) {
          newFilesIndices.push(idx);
          validFiles.push(file);
        }
      });

      let uploadedUrls: string[] = [];
      if (validFiles.length > 0) {
        const formData = new FormData();
        validFiles.forEach((file: File) => {
          formData.append("images[]", file);
        });
        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        const uploadData = await uploadRes.json();
        if (uploadData.success) {
          uploadedUrls = uploadData.imageUrls;
        }
      }

      // 2. Reassemble the final images list
      let nextUploadIdx = 0;
      const imageUrls: string[] = [];
      for (let i = 0; i < maxAllowedPhotos; i++) {
        if (newFilesIndices.includes(i)) {
          if (uploadedUrls[nextUploadIdx]) {
            imageUrls.push(uploadedUrls[nextUploadIdx]);
            nextUploadIdx++;
          }
        } else if (imagePreviews[i]) {
          let url = imagePreviews[i] as string;
          if (url.startsWith("/api/uploads/")) {
            url = url.replace("/api/uploads/", "/uploads/");
          }
          imageUrls.push(url);
        }
      }

      const urlEndpoint = isEditMode ? "/api/listings/update" : "/api/listings/create";
      
      const payload: any = {
        title: finalTitle,
        price: priceType === "amount" ? (parseFloat(price) || 0) : 0,
        price_type: priceType,
        category: category || "Other",
        description: finalDescription,
        image: imageUrls,
        user_id: userId,
        contact_email: contactEmail,
        contact_phone: contactPhone,
        youtube_link: planToUse !== 'free' ? (youtubeLink || null) : null,
        facebook_link: planToUse !== 'free' ? (facebookLink || null) : null,
      };

      // Apply promotional plan properties & publishing modes
      payload.is_top_ad = planToUse === 'boost' || planToUse === 'premium' || promotionData.is_top_ad;
      payload.is_home_gallery = planToUse === 'premium' || promotionData.is_home_gallery;
      payload.is_highlighted = planToUse === 'premium' || promotionData.is_highlighted;
      payload.is_urgent = promotionData.is_urgent;

      // Multi-city or single city (Multi-city only available on paid plans)
      if (!isEditMode && planToUse !== 'free' && postInMultipleCities && selectedCities.length > 0) {
        if (selectedCities.length > 5) {
          showAlert("Maximum 5 cities allowed for Multi-City posting.", "error");
          setIsPublishing(false);
          return;
        }
        payload.locations = selectedCities.map(c => ({
          location: c.location,
          postal_code: c.postalCode,
          latitude: c.latitude,
          longitude: c.longitude,
        }));
      } else {
        payload.location = location || "Unknown";
        payload.postal_code = postalCode;
        payload.latitude = latitude;
        payload.longitude = longitude;
      }

      if (isEditMode) {
        payload.id = parseInt(editId!);
      }

      const response = await fetch(urlEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (data.success) {
        if (isEditMode) {
          showAlert("All saved! Your ad has been updated.", "success");
          navigate.push("/item/" + editId);
          return;
        }

        trackListingSubmission(
          category || "Other",
          parseFloat(price) || 0,
          location || "Unknown",
        );

        const isPending = !!(data.needs_approval || data.status === 'pending_approval');
        setCreatedNeedsApproval(isPending);

        // Check if there are any charges (Paid Plan or Individual Add-ons)
        const grandTotal = getGrandTotal();
        const hasCharges = grandTotal.subtotal > 0;

        if (hasCharges) {
          setCreatedListingId(data.id);

          const preloadRes = await fetch("/api/payments/preload", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              listing_id: data.id,
              user_id: userId,
              plan: planToUse !== 'free' ? planToUse : undefined,
              is_top_ad: promotionData.is_top_ad,
              top_ad_duration: promotionData.top_ad_duration,
              is_highlighted: promotionData.is_highlighted,
              highlighted_duration: promotionData.highlighted_duration,
              is_urgent: promotionData.is_urgent,
              urgent_duration: promotionData.urgent_duration,
              is_home_gallery: promotionData.is_home_gallery,
              home_gallery_duration: promotionData.home_gallery_duration,
            }),
          });
          const preloadData = await preloadRes.json();
          if (preloadData.success) {
            setPayTicket(preloadData.ticket);
            setPayAmount(preloadData.amount);
            setPayEnvironment(preloadData.environment || "qa");
            setIsPayModalOpen(true);
          } else {
            showAlert(
              "Your ad was created, but we couldn't start the promotion payment: " +
                (preloadData.message || "Unknown error"),
              "error"
            );
            if (isPending) {
              navigate.push("/profile");
            } else {
              navigate.push("/item/" + data.id);
            }
          }
        } else if (isPending) {
          showAlert(
            "Ad submitted! We'll review it and let you know once it's live.",
            "info"
          );
          navigate.push("/profile");
        } else {
          showAlert("Your ad is now published and live on HitAds!", "success");
          navigate.push("/item/" + data.id);
        }
      } else {
        showAlert("Failed to publish", "error");
      }
    } catch (err) {
      console.error(err);
      showAlert("Error publishing", "error");
    } finally {
      setIsPublishing(false);
    }
  };

  const handleInitiatePublish = () => {
    if (!templateConfig.hideTitle && !title.trim()) {
      showAlert("Please enter an ad title", "error");
      return;
    }
    if (templateConfig.photosRequired !== false && imageFiles[0] === null && imagePreviews[0] === null) {
      showAlert("Please upload a cover photo for your ad", "error");
      return;
    }
    if (!templateConfig.hideLocation && (!postInMultipleCities || selectedPlan === 'free') && !location && !postalCode) {
      showAlert("Please specify a location or postal code", "error");
      return;
    }
    if (!templateConfig.hideLocation && postInMultipleCities && selectedPlan !== 'free' && selectedCities.length === 0) {
      showAlert("Please select at least one city", "error");
      return;
    }

    if (isEditMode) {
      handlePublish('free');
    } else {
      handlePublish(selectedPlan);
    }
  };

  const handleSelectPlanFromModal = async (plan: 'free' | 'boost' | 'premium', price: number) => {
    setSelectedPlan(plan);
    if (plan === 'free') {
      setPostInMultipleCities(false);
      setSelectedCities([]);
    }
    setIsPlanModalOpen(false);
  };

  const handlePaymentSuccess = (receiptId: string) => {
    setIsPayModalOpen(false);
    if (createdNeedsApproval) {
      showAlert(
        "You're all set! Payment was successful and your ad has been submitted for review.",
        "success"
      );
      navigate.push("/profile");
    } else {
      showAlert(
        "You're all set! Your payment was successful and your ad is promoted.",
        "success"
      );
      navigate.push("/item/" + createdListingId);
    }
  };

  const handlePaymentCancel = () => {
    setIsPayModalOpen(false);
    if (createdNeedsApproval) {
      showAlert(
        "Payment was not completed. Your ad has been submitted for review, but promotions were not applied.",
        "info"
      );
      navigate.push("/profile");
    } else {
      showAlert(
        "Payment was not completed. Your ad is created, but promotions were not applied. You can promote it anytime from your profile.",
        "info"
      );
      navigate.push("/item/" + createdListingId);
    }
  };
  return (
    <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-6 lg:py-10">
      {/* Top Title & Quick Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {isEditMode ? "Edit Your Listing" : "Post a Free Ad"}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            Connect with verified buyers and sellers across Canada in 4 easy steps
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleReset}
            type="button"
            className="inline-flex items-center gap-2 text-slate-500 hover:text-red-600 font-bold text-xs uppercase tracking-wider transition-all bg-white hover:bg-red-50/80 px-4 py-2.5 rounded-xl border border-slate-200 shadow-2xs hover:border-red-200 cursor-pointer"
          >
            <span className="material-icons text-base">refresh</span> Reset Form
          </button>
        </div>
      </div>

      {/* Stepper Progress (4-Step Flow) */}
      <div className="max-w-3xl mx-auto mb-8 sm:mb-10">
        <div className="flex items-center justify-between relative">
          {/* Step 1: Category */}
          <div 
            onClick={() => step > 1 && setStep(1)} 
            className={`flex flex-col items-center z-10 ${step > 1 ? "cursor-pointer group" : ""}`}
          >
            <div
              className={`w-11 h-11 rounded-full flex items-center justify-center font-bold transition-all shadow-sm ${
                step >= 1 ? "bg-primary text-white shadow-primary/30" : "bg-slate-100 text-slate-400 border border-slate-200"
              }`}
            >
              <span className="material-icons text-xl">
                {step > 1 ? "check" : "category"}
              </span>
            </div>
            <span
              className={`text-[11px] font-black mt-2 uppercase tracking-widest transition-colors ${
                step >= 1 ? "text-primary" : "text-slate-400"
              }`}
            >
              1. Category
            </span>
          </div>

          {/* Connector Line 1-2 */}
          <div className="h-1 flex-1 mx-2 sm:mx-3 rounded-full bg-slate-200 relative overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-300 rounded-full"
              style={{ width: step >= 2 ? "100%" : "0%" }}
            />
          </div>

          {/* Step 2: Details */}
          <div 
            onClick={() => step > 2 && setStep(2)} 
            className={`flex flex-col items-center z-10 ${step > 2 ? "cursor-pointer group" : ""}`}
          >
            <div
              className={`w-11 h-11 rounded-full flex items-center justify-center font-bold transition-all shadow-sm ${
                step >= 2 ? "bg-primary text-white shadow-primary/30" : "bg-slate-100 text-slate-400 border border-slate-200"
              }`}
            >
              <span className="material-icons text-xl">
                {step > 2 ? "check" : "edit_note"}
              </span>
            </div>
            <span
              className={`text-[11px] font-black mt-2 uppercase tracking-widest transition-colors ${
                step >= 2 ? "text-primary" : "text-slate-400"
              }`}
            >
              2. Details
            </span>
          </div>

          {/* Connector Line 2-3 */}
          <div className="h-1 flex-1 mx-2 sm:mx-3 rounded-full bg-slate-200 relative overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-300 rounded-full"
              style={{ width: step >= 3 ? "100%" : "0%" }}
            />
          </div>

          {/* Step 3: Plan */}
          <div 
            onClick={() => step > 3 && setStep(3)} 
            className={`flex flex-col items-center z-10 ${step > 3 ? "cursor-pointer group" : ""}`}
          >
            <div
              className={`w-11 h-11 rounded-full flex items-center justify-center font-bold transition-all shadow-sm ${
                step >= 3 ? "bg-primary text-white shadow-primary/30" : "bg-slate-100 text-slate-400 border border-slate-200"
              }`}
            >
              <span className="material-icons text-xl">
                {step > 3 ? "check" : "workspace_premium"}
              </span>
            </div>
            <span
              className={`text-[11px] font-black mt-2 uppercase tracking-widest transition-colors ${
                step >= 3 ? "text-primary" : "text-slate-400"
              }`}
            >
              3. Plan
            </span>
          </div>

          {/* Connector Line 3-4 */}
          <div className="h-1 flex-1 mx-2 sm:mx-3 rounded-full bg-slate-200 relative overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-300 rounded-full"
              style={{ width: step >= 4 ? "100%" : "0%" }}
            />
          </div>

          {/* Step 4: Media & Publish */}
          <div className="flex flex-col items-center z-10">
            <div
              className={`w-11 h-11 rounded-full flex items-center justify-center font-bold transition-all shadow-sm ${
                step >= 4 ? "bg-primary text-white shadow-primary/30" : "bg-slate-100 text-slate-400 border border-slate-200"
              }`}
            >
              <span className="material-icons text-xl">add_a_photo</span>
            </div>
            <span
              className={`text-[11px] font-black mt-2 uppercase tracking-widest transition-colors ${
                step >= 4 ? "text-primary" : "text-slate-400"
              }`}
            >
              4. Media & Publish
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Form Column + Sticky Sidebar Column */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-10 items-start">
        {/* Left Form Area (Full width on Step 3, 8/9 cols on other steps) */}
        <div className={step === 3 ? "lg:col-span-12 space-y-6 sm:space-y-8" : "lg:col-span-8 xl:col-span-9 space-y-6 sm:space-y-8"}>
          {/* ═══════════════════════════════════════════
              STEP 1: CATEGORY SELECTION
             ═══════════════════════════════════════════ */}
          {step === 1 && (
            <div className="bg-white p-6 sm:p-8 md:p-10 rounded-3xl border border-slate-200 shadow-sm space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                  {isEditMode ? "Edit Listing Category" : "Select a Category"}
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                  Choose the category that best matches what you are advertising.
                </p>
              </div>

              <div>
                {/* Category Breadcrumbs / Selected path */}
                {categoryPath.length > 0 && (
                  <div className="flex items-center justify-between p-4 border border-slate-200 rounded-2xl mb-6 bg-slate-50/70 shadow-2xs">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {categoryPath.map((c, i) => (
                        <React.Fragment key={c.CategoryID}>
                          {i > 0 && (
                            <span className="text-slate-400 text-sm font-black">
                              /
                            </span>
                          )}
                          <span className="font-bold text-slate-800 text-sm">
                            {c.CategoryName}
                          </span>
                        </React.Fragment>
                      ))}
                    </div>
                    <div className="flex items-center gap-2">
                      {category === "" && (
                        <button
                          onClick={handleCategoryBack}
                          className="text-slate-600 hover:text-slate-900 transition-colors text-xs font-bold flex items-center gap-1 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-2xs"
                        >
                          <span className="material-icons text-sm">
                            arrow_back
                          </span>{" "}
                          Back
                        </button>
                      )}
                      <button
                        onClick={handleCategoryReset}
                        className="text-slate-500 hover:text-red-600 transition-colors text-xs font-bold flex items-center gap-1 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-2xs"
                      >
                        <span className="material-icons text-sm">close</span>{" "}
                        Reset
                      </button>
                    </div>
                  </div>
                )}

                {/* Categories lists at current depth */}
                {category === "" ? (
                  currentLevelCategories.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-6 gap-3.5 sm:gap-4">
                      {currentLevelCategories.map((cat: any) => (
                        <button
                          key={cat.CategoryID}
                          onClick={() => handleCategoryClick(cat)}
                          className="flex flex-col items-center justify-center p-5 sm:p-6 rounded-2xl border-2 transition-all group bg-slate-50/70 border-slate-100 hover:border-primary hover:bg-white hover:shadow-md cursor-pointer text-center"
                        >
                          <span className="material-icons text-3xl mb-2.5 text-slate-400 group-hover:text-primary group-hover:scale-110 transition-all">
                            {cat.Icon || "folder"}
                          </span>
                          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider group-hover:text-primary transition-colors">
                            {cat.CategoryName}
                          </span>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center bg-amber-50 rounded-2xl border border-amber-200 text-amber-800 font-bold text-sm">
                      No subcategories available.
                    </div>
                  )
                ) : (
                  <div className="p-8 text-center bg-blue-50/60 rounded-2xl border border-blue-200/80">
                    <span className="material-icons text-4xl text-primary mb-3 block">
                      check_circle
                    </span>
                    <p className="font-black text-slate-900 text-lg">
                      Category Selected
                    </p>
                    <p className="text-primary font-bold text-sm mt-1">{category}</p>
                    <button
                      onClick={handleCategoryReset}
                      className="mt-4 text-xs font-bold text-slate-500 hover:text-primary underline"
                    >
                      Choose a different category
                    </button>
                  </div>
                )}
              </div>

              <div className="pt-6 border-t border-slate-100 flex justify-end">
                <button
                  disabled={category === ""}
                  onClick={() => setStep(2)}
                  className="bg-primary hover:bg-primary-hover text-white px-8 py-3.5 rounded-xl font-black text-sm uppercase tracking-wider transition-all shadow-md shadow-primary/20 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  Continue to Details{" "}
                  <span className="material-icons text-lg">chevron_right</span>
                </button>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════
              STEP 2: AD DETAILS & VEHICLE SPECIFICATIONS
             ═══════════════════════════════════════════ */}
          {step === 2 && (
            <div className="bg-white p-6 sm:p-8 md:p-10 rounded-3xl border border-slate-200 shadow-sm space-y-8">
              {/* Header & Category Banner */}
              <div className="border-b border-slate-100 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                    {isEditMode ? "Edit Ad Information" : "Ad Information & Details"}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                    Fill in the details to make your ad informative and searchable.
                  </p>
                </div>
                {category && (
                  <div className="flex items-center gap-2 bg-blue-50/80 text-primary border border-blue-200/80 px-3.5 py-1.5 rounded-full text-xs font-bold self-start sm:self-center">
                    <span className="material-icons text-sm">category</span>
                    <span className="truncate max-w-[200px]">{category}</span>
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="text-primary hover:text-primary-hover underline text-[11px] ml-1"
                    >
                      Change
                    </button>
                  </div>
                )}
              </div>

              {/* Title & Description Section */}
              <div className="space-y-6">
                {!templateConfig.hideTitle && (
                  <div>
                    <label className="block text-xs font-black text-slate-600 uppercase tracking-widest mb-2 flex items-center justify-between">
                      <span>Ad Title <span className="text-red-500">*</span></span>
                      <span className="text-slate-400 font-normal text-[11px]">Clear & descriptive</span>
                    </label>
                    <input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm font-bold text-slate-900 placeholder:text-slate-400 placeholder:font-normal transition-all"
                      placeholder={getTitlePlaceholder(category)}
                      required
                    />
                  </div>
                )}

                {!templateConfig.hideDescription && (
                  <div>
                    <label className="block text-xs font-black text-slate-600 uppercase tracking-widest mb-2 flex items-center justify-between">
                      <span>Description <span className="text-red-500">*</span></span>
                      <span className="text-slate-400 font-normal text-[11px]">Include key specs, condition, features</span>
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={6}
                      className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm font-medium text-slate-800 placeholder:text-slate-400 resize-y transition-all"
                      placeholder="Provide a detailed description of your item, service, or job..."
                      required
                    />
                  </div>
                )}
              </div>

              {/* ───────────────────────────────────────────
                  VEHICLE SPECIFICATIONS & CHARACTERISTICS
                  ─────────────────────────────────────────── */}
              {isVehicleSpecCategory(categoryPath, category) && (
                <div className="bg-gradient-to-br from-blue-50/70 via-slate-50 to-white p-6 sm:p-8 rounded-2xl border border-blue-200/80 shadow-2xs space-y-6">
                  {/* Header */}
                  <div className="flex items-center gap-3.5 pb-4 border-b border-blue-200/60">
                    <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center shadow-md shadow-primary/20 shrink-0">
                      <span className="material-icons text-xl">directions_car</span>
                    </div>
                    <div>
                      <h3 className="text-base font-black text-slate-900 tracking-tight">
                        Vehicle Specifications & Characteristics
                      </h3>
                      <p className="text-xs text-slate-500 font-medium">
                        Detailed specs build buyer trust, verify vehicle history, and increase visibility.
                      </p>
                    </div>
                  </div>

                  {/* VIN Full Width Input */}
                  <div>
                    <label className="block text-[11px] font-black text-slate-600 uppercase tracking-widest mb-2 flex items-center justify-between">
                      <span>Vehicle Identification Number (VIN)</span>
                      <span className="text-slate-400 font-medium normal-case text-[11px]">17 characters</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        maxLength={17}
                        value={carVIN}
                        onChange={(e) => setCarVIN(e.target.value.toUpperCase())}
                        className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm font-mono tracking-wider text-slate-900 uppercase placeholder:normal-case placeholder:tracking-normal placeholder:text-slate-400 transition-all shadow-2xs"
                        placeholder="e.g. 2T1BURHE9FC123456"
                      />
                      <span className="material-icons absolute left-3.5 top-3.5 text-slate-400 text-lg">
                        fingerprint
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1.5 font-medium flex items-center gap-1">
                      <span className="material-icons text-xs text-primary">verified</span>
                      Valid VINs unlock verified vehicle badges and build instant buyer confidence.
                    </p>
                  </div>

                  {/* 2-Column Responsive Specifications Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Make / Brand (Backend Options) */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-[11px] font-black text-slate-600 uppercase tracking-widest">
                          Make / Brand <span className="text-red-500">*</span>
                        </label>
                        {isCustomMake && (
                          <button
                            type="button"
                            onClick={() => {
                              setIsCustomMake(false);
                              setCarMake("");
                            }}
                            className="text-[10px] font-bold text-primary hover:underline cursor-pointer"
                          >
                            Select from List
                          </button>
                        )}
                      </div>
                      
                      {(() => {
                        const makesList = dbOptions
                          .filter((o: any) => o.option_type === 'car_make')
                          .sort((a: any, b: any) => a.option_value.localeCompare(b.option_value));

                        if (isCustomMake) {
                          return (
                            <input
                              type="text"
                              value={carMake}
                              onChange={(e) => setCarMake(e.target.value)}
                              className="w-full h-12 px-4 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm font-bold text-slate-900 placeholder:text-slate-400 placeholder:font-normal transition-all shadow-2xs"
                              placeholder="Enter custom make (e.g. Genesis, Rivian, Lucid...)"
                              autoFocus
                            />
                          );
                        }

                        const isMakeInList = makesList.some((m: any) => m.option_value.toLowerCase() === carMake.toLowerCase());

                        return (
                          <select
                            value={isMakeInList ? carMake : (carMake ? "__custom__" : "")}
                            onChange={(e) => {
                              const val = e.target.value;
                              if (val === "__custom__") {
                                setIsCustomMake(true);
                                setCarMake("");
                                setCarModel("");
                              } else {
                                setCarMake(val);
                                setIsCustomMake(false);
                                // Check if current model exists under new make, if not reset
                                const matchedMake = makesList.find((m: any) => m.option_value === val);
                                if (matchedMake) {
                                  const makeModels = dbOptions.filter((o: any) => o.option_type === 'car_model' && o.parent_id === matchedMake.id);
                                  const modelExists = makeModels.some((m: any) => m.option_value.toLowerCase() === carModel.toLowerCase());
                                  if (!modelExists) setCarModel("");
                                }
                              }
                            }}
                            className="w-full h-12 px-4 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm font-bold text-slate-900 cursor-pointer transition-all shadow-2xs"
                          >
                            <option value="">Select Make / Brand...</option>
                            {makesList.map((m: any) => (
                              <option key={m.id} value={m.option_value}>
                                {m.option_value}
                              </option>
                            ))}
                            <option value="__custom__">+ Other / Custom Make...</option>
                          </select>
                        );
                      })()}
                    </div>

                    {/* Model (Backend Options filtered by Make) */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-[11px] font-black text-slate-600 uppercase tracking-widest">
                          Model <span className="text-red-500">*</span>
                        </label>
                        {isCustomModel && (
                          <button
                            type="button"
                            onClick={() => {
                              setIsCustomModel(false);
                              setCarModel("");
                            }}
                            className="text-[10px] font-bold text-primary hover:underline cursor-pointer"
                          >
                            Select from List
                          </button>
                        )}
                      </div>

                      {(() => {
                        const selectedMakeObj = dbOptions.find(
                          (o: any) => o.option_type === 'car_make' && o.option_value.toLowerCase() === carMake.toLowerCase()
                        );

                        const availableModels = dbOptions
                          .filter((o: any) => 
                            o.option_type === 'car_model' && 
                            (selectedMakeObj ? o.parent_id === selectedMakeObj.id : true)
                          )
                          .sort((a: any, b: any) => a.option_value.localeCompare(b.option_value));

                        if (isCustomModel || (!selectedMakeObj && availableModels.length === 0 && carMake)) {
                          return (
                            <input
                              type="text"
                              value={carModel}
                              onChange={(e) => setCarModel(e.target.value)}
                              className="w-full h-12 px-4 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm font-bold text-slate-900 placeholder:text-slate-400 placeholder:font-normal transition-all shadow-2xs"
                              placeholder={carMake ? `Enter model for ${carMake}...` : "Enter model..."}
                              autoFocus={isCustomModel}
                            />
                          );
                        }

                        const isModelInList = availableModels.some((m: any) => m.option_value.toLowerCase() === carModel.toLowerCase());

                        return (
                          <select
                            disabled={!carMake}
                            value={isModelInList ? carModel : (carModel ? "__custom__" : "")}
                            onChange={(e) => {
                              const val = e.target.value;
                              if (val === "__custom__") {
                                setIsCustomModel(true);
                                setCarModel("");
                              } else {
                                setCarModel(val);
                                setIsCustomModel(false);
                              }
                            }}
                            className="w-full h-12 px-4 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm font-bold text-slate-900 cursor-pointer transition-all shadow-2xs disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed"
                          >
                            <option value="">
                              {carMake 
                                ? (availableModels.length > 0 ? `Select ${carMake} Model...` : "No models found - Select Custom")
                                : "Select a Make first..."}
                            </option>
                            {availableModels.map((m: any) => (
                              <option key={m.id} value={m.option_value}>
                                {m.option_value}
                              </option>
                            ))}
                            {carMake && (
                              <option value="__custom__">+ Other / Custom Model...</option>
                            )}
                          </select>
                        );
                      })()}
                    </div>

                    {/* Year */}
                    <div>
                      <label className="block text-[11px] font-black text-slate-600 uppercase tracking-widest mb-2">
                        Model Year
                      </label>
                      <select
                        value={carYear}
                        onChange={(e) => setCarYear(e.target.value)}
                        className="w-full h-12 px-4 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm font-bold text-slate-800 cursor-pointer transition-all shadow-2xs"
                      >
                        <option value="">Select Year...</option>
                        {Array.from({ length: 47 }, (_, i) => 2026 - i).map((y) => (
                          <option key={y} value={y}>{y}</option>
                        ))}
                      </select>
                    </div>

                    {/* Trim / Edition */}
                    <div>
                      <label className="block text-[11px] font-black text-slate-600 uppercase tracking-widest mb-2">
                        Trim / Package
                      </label>
                      <input
                        type="text"
                        value={carTrim}
                        onChange={(e) => setCarTrim(e.target.value)}
                        className="w-full h-12 px-4 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm font-medium text-slate-800 placeholder:text-slate-400 transition-all shadow-2xs"
                        placeholder="e.g. XLE, EX-L, Lariat, M Sport..."
                      />
                    </div>

                    {/* Mileage / Kilometers */}
                    <div>
                      <label className="block text-[11px] font-black text-slate-600 uppercase tracking-widest mb-2">
                        Kilometers (km)
                      </label>
                      <input
                        type="number"
                        value={carMileage}
                        onChange={(e) => setCarMileage(e.target.value)}
                        className="w-full h-12 px-4 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm font-bold text-slate-900 placeholder:text-slate-400 placeholder:font-normal transition-all shadow-2xs"
                        placeholder="e.g. 45000"
                      />
                    </div>

                    {/* Transmission */}
                    <div>
                      <label className="block text-[11px] font-black text-slate-600 uppercase tracking-widest mb-2">
                        Transmission
                      </label>
                      <select
                        value={carTransmission}
                        onChange={(e) => setCarTransmission(e.target.value)}
                        className="w-full h-12 px-4 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm font-medium text-slate-800 cursor-pointer transition-all shadow-2xs"
                      >
                        <option value="">Select Transmission...</option>
                        <option value="Automatic">Automatic</option>
                        <option value="Manual">Manual</option>
                        <option value="CVT">CVT (Continuously Variable)</option>
                        <option value="Dual-Clutch">Dual-Clutch (DCT)</option>
                        <option value="Direct Drive">Direct Drive (EV)</option>
                      </select>
                    </div>

                    {/* Fuel Type */}
                    <div>
                      <label className="block text-[11px] font-black text-slate-600 uppercase tracking-widest mb-2">
                        Fuel Type
                      </label>
                      <select
                        value={carFuelType}
                        onChange={(e) => setCarFuelType(e.target.value)}
                        className="w-full h-12 px-4 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm font-medium text-slate-800 cursor-pointer transition-all shadow-2xs"
                      >
                        <option value="">Select Fuel Type...</option>
                        <option value="Gasoline">Gasoline</option>
                        <option value="Hybrid">Hybrid</option>
                        <option value="Electric">Electric (EV)</option>
                        <option value="Plug-in Hybrid">Plug-in Hybrid (PHEV)</option>
                        <option value="Diesel">Diesel</option>
                      </select>
                    </div>

                    {/* Body Type */}
                    <div>
                      <label className="block text-[11px] font-black text-slate-600 uppercase tracking-widest mb-2">
                        Body Type
                      </label>
                      <select
                        value={carBodyType}
                        onChange={(e) => setCarBodyType(e.target.value)}
                        className="w-full h-12 px-4 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm font-medium text-slate-800 cursor-pointer transition-all shadow-2xs"
                      >
                        <option value="">Select Body Type...</option>
                        <option value="Sedan">Sedan</option>
                        <option value="SUV / Crossover">SUV / Crossover</option>
                        <option value="Truck / Pickup">Truck / Pickup</option>
                        <option value="Coupe">Coupe</option>
                        <option value="Hatchback">Hatchback</option>
                        <option value="Convertible">Convertible</option>
                        <option value="Minivan / Van">Minivan / Van</option>
                        <option value="Wagon">Wagon</option>
                      </select>
                    </div>

                    {/* Drivetrain */}
                    <div>
                      <label className="block text-[11px] font-black text-slate-600 uppercase tracking-widest mb-2">
                        Drivetrain
                      </label>
                      <select
                        value={carDrivetrain}
                        onChange={(e) => setCarDrivetrain(e.target.value)}
                        className="w-full h-12 px-4 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm font-medium text-slate-800 cursor-pointer transition-all shadow-2xs"
                      >
                        <option value="">Select Drivetrain...</option>
                        <option value="All-Wheel Drive (AWD)">All-Wheel Drive (AWD)</option>
                        <option value="Four-Wheel Drive (4WD)">Four-Wheel Drive (4WD)</option>
                        <option value="Front-Wheel Drive (FWD)">Front-Wheel Drive (FWD)</option>
                        <option value="Rear-Wheel Drive (RWD)">Rear-Wheel Drive (RWD)</option>
                      </select>
                    </div>

                    {/* Exterior Color */}
                    <div>
                      <label className="block text-[11px] font-black text-slate-600 uppercase tracking-widest mb-2">
                        Exterior Color
                      </label>
                      <select
                        value={carColor}
                        onChange={(e) => setCarColor(e.target.value)}
                        className="w-full h-12 px-4 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm font-medium text-slate-800 cursor-pointer transition-all shadow-2xs"
                      >
                        <option value="">Select Color...</option>
                        <option value="Black">Black</option>
                        <option value="White">White</option>
                        <option value="Silver">Silver</option>
                        <option value="Grey">Grey</option>
                        <option value="Blue">Blue</option>
                        <option value="Red">Red</option>
                        <option value="Green">Green</option>
                        <option value="Brown / Bronze">Brown / Bronze</option>
                        <option value="Gold / Yellow">Gold / Yellow</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    {/* Doors */}
                    <div>
                      <label className="block text-[11px] font-black text-slate-600 uppercase tracking-widest mb-2">
                        Doors
                      </label>
                      <select
                        value={carDoors}
                        onChange={(e) => setCarDoors(e.target.value)}
                        className="w-full h-12 px-4 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm font-medium text-slate-800 cursor-pointer transition-all shadow-2xs"
                      >
                        <option value="">Select Doors...</option>
                        <option value="2 Doors">2 Doors</option>
                        <option value="3 Doors">3 Doors</option>
                        <option value="4 Doors">4 Doors</option>
                        <option value="5 Doors">5 Doors</option>
                      </select>
                    </div>

                    {/* Seating Capacity */}
                    <div>
                      <label className="block text-[11px] font-black text-slate-600 uppercase tracking-widest mb-2">
                        Seating Capacity
                      </label>
                      <select
                        value={carSeatingCapacity}
                        onChange={(e) => setCarSeatingCapacity(e.target.value)}
                        className="w-full h-12 px-4 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm font-medium text-slate-800 cursor-pointer transition-all shadow-2xs"
                      >
                        <option value="">Select Seating...</option>
                        <option value="2 Seats">2 Seats</option>
                        <option value="4 Seats">4 Seats</option>
                        <option value="5 Seats">5 Seats</option>
                        <option value="6 Seats">6 Seats</option>
                        <option value="7 Seats">7 Seats</option>
                        <option value="8+ Seats">8+ Seats</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Dynamic Specific Attributes (if configured in DB) */}
              {dynamicAttributesList.length > 0 && (
                <div className="bg-slate-50/80 p-6 sm:p-7 rounded-2xl border border-slate-200/80 space-y-4">
                  <h3 className="font-bold text-slate-900 flex items-center gap-2 text-sm">
                    <span className="material-icons text-primary text-base">tune</span>
                    Category Specific Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {dynamicAttributesList.map((attr) => {
                      const name = attr.AttributeName;
                      const isRequired = attr.IsRequired === 1;
                      if (attr.AttributeType === "Dropdown") {
                        return (
                          <div key={attr.AttributeID}>
                            <label className="block text-[11px] font-black text-slate-600 uppercase tracking-widest mb-2">
                              {name} {isRequired && <span className="text-red-500">*</span>}
                            </label>
                            <select
                              value={dynamicAttributesValues[name] || ""}
                              onChange={(e) =>
                                setDynamicAttributesValues((prev) => ({
                                  ...prev,
                                  [name]: e.target.value,
                                }))
                              }
                              className="w-full h-12 px-4 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm font-medium text-slate-800"
                              required={isRequired}
                            >
                              <option value="">Select {name}...</option>
                              {attr.options.map((opt: string) => (
                                <option key={opt} value={opt}>
                                  {opt}
                                </option>
                              ))}
                            </select>
                          </div>
                        );
                      } else if (attr.AttributeType === "Number") {
                        return (
                          <div key={attr.AttributeID}>
                            <label className="block text-[11px] font-black text-slate-600 uppercase tracking-widest mb-2">
                              {name} {isRequired && <span className="text-red-500">*</span>}
                            </label>
                            <input
                              type="number"
                              value={dynamicAttributesValues[name] || ""}
                              onChange={(e) =>
                                setDynamicAttributesValues((prev) => ({
                                  ...prev,
                                  [name]: e.target.value,
                                }))
                              }
                              className="w-full h-12 px-4 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm font-medium text-slate-800"
                              placeholder={`Enter ${name}...`}
                              required={isRequired}
                            />
                          </div>
                        );
                      } else if (attr.AttributeType === "CheckboxGroup") {
                        const currentVals = dynamicAttributesValues[name] ? dynamicAttributesValues[name].split(",").map((v: string) => v.trim()) : [];
                        return (
                          <div key={attr.AttributeID} className="col-span-1 md:col-span-2 pt-3">
                            <label className="block text-[11px] font-black text-slate-600 uppercase tracking-widest mb-3">
                              {name} {isRequired && <span className="text-red-500">*</span>}
                            </label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              {attr.options.map((opt: string) => {
                                const isChecked = currentVals.includes(opt);
                                return (
                                  <label key={opt} className="flex items-center gap-3 cursor-pointer group bg-white p-3 rounded-xl border border-slate-200 hover:border-primary/50 transition-all">
                                    <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${isChecked ? "bg-primary border-primary" : "bg-white border-slate-300 group-hover:border-primary"}`}>
                                      {isChecked && <span className="material-icons text-white text-[14px]">check</span>}
                                    </div>
                                    <span className="text-xs font-bold text-slate-700">{opt}</span>
                                    <input
                                      type="checkbox"
                                      className="hidden"
                                      checked={isChecked}
                                      onChange={() => {
                                        const newVals = isChecked ? currentVals.filter((v: string) => v !== opt) : [...currentVals, opt];
                                        setDynamicAttributesValues((prev) => ({ ...prev, [name]: newVals.join(", ") }));
                                      }}
                                    />
                                  </label>
                                );
                              })}
                            </div>
                          </div>
                        );
                      } else {
                        return (
                          <div key={attr.AttributeID}>
                            <label className="block text-[11px] font-black text-slate-600 uppercase tracking-widest mb-2">
                              {name} {isRequired && <span className="text-red-500">*</span>}
                            </label>
                            <input
                              type="text"
                              value={dynamicAttributesValues[name] || ""}
                              onChange={(e) =>
                                setDynamicAttributesValues((prev) => ({
                                  ...prev,
                                  [name]: e.target.value,
                                }))
                              }
                              className="w-full h-12 px-4 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm font-medium text-slate-800"
                              placeholder={`Enter ${name}...`}
                              required={isRequired}
                            />
                          </div>
                        );
                      }
                    })}
                  </div>
                </div>
              )}

              {/* Vehicle Features Checklist */}
              {!templateConfig.hideCarFeatures && isVehicleSpecCategory(categoryPath, category) && (Array.isArray(templateConfig.carFeaturesList) ? templateConfig.carFeaturesList.length > 0 : CAR_FEATURES_LIST.length > 0) && (
                <div className="bg-slate-50/80 p-6 sm:p-7 rounded-2xl border border-slate-200/80 space-y-3.5">
                  <label className="block text-[11px] font-black text-slate-600 uppercase tracking-widest">
                    Vehicle Key Features & Options
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {(Array.isArray(templateConfig.carFeaturesList) ? templateConfig.carFeaturesList : CAR_FEATURES_LIST).map((feature: string) => (
                      <label
                        key={feature}
                        className="flex items-center gap-3 cursor-pointer group bg-white p-3 rounded-xl border border-slate-200 hover:border-primary/50 transition-all"
                      >
                        <div
                          className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                            carFeatures.includes(feature) ? "bg-primary border-primary" : "bg-white border-slate-300 group-hover:border-primary"
                          }`}
                        >
                          {carFeatures.includes(feature) && (
                            <span className="material-icons text-white text-[14px]">
                              check
                            </span>
                          )}
                        </div>
                        <span className="text-xs font-bold text-slate-700">
                          {feature}
                        </span>
                        <input
                          type="checkbox"
                          className="hidden"
                          checked={carFeatures.includes(feature)}
                          onChange={() => {
                            setCarFeatures((prev) =>
                              prev.includes(feature)
                                ? prev.filter((f) => f !== feature)
                                : [...prev, feature],
                            );
                          }}
                        />
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Brand & Model for Electronics */}
              {!templateConfig.hideBrandModel && (category.includes("Mobile Phones") ||
                category.includes("Laptops") ||
                category.includes("Desktop Computers") ||
                category.includes("Gaming PCs") ||
                category.includes("Tablets") ||
                category.includes("Computer Parts")) && (
                <div className="bg-slate-50/80 p-6 sm:p-7 rounded-2xl border border-slate-200/80 space-y-4">
                  <label className="block text-[11px] font-black text-slate-600 uppercase tracking-widest">
                    Brand & Model Information
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-2">
                        Brand
                      </label>
                      <input
                        type="text"
                        value={electronBrand}
                        onChange={(e) => setElectronBrand(e.target.value)}
                        className="w-full h-12 px-4 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm font-medium text-slate-800"
                        placeholder="e.g. Apple, Samsung, Dell, HP..."
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-2">
                        Model
                      </label>
                      <input
                        type="text"
                        value={electronModel}
                        onChange={(e) => setElectronModel(e.target.value)}
                        className="w-full h-12 px-4 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm font-medium text-slate-800"
                        placeholder="e.g. iPhone 16 Pro, Galaxy S25, XPS 15..."
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* ───────────────────────────────────────────
                  PRICING & CONDITION (UNIFIED & ALIGNED CARD)
                  ─────────────────────────────────────────── */}
              <div className="bg-slate-50/80 p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-2xs space-y-6">
                <div className="flex items-center gap-3 pb-3 border-b border-slate-200">
                  <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-xs shrink-0">
                    <span className="material-icons text-lg">attach_money</span>
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900 tracking-tight">
                      Pricing & Item Condition
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">
                      Set a fair price and honest condition to attract more serious buyers.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                  {/* Left Column: Pricing */}
                  <div className="space-y-3">
                    <label className="block text-xs font-black text-slate-600 uppercase tracking-widest">
                      {templateConfig.priceLabel || "Price"} <span className="text-red-500">*</span>
                    </label>

                    {/* Price Type Segmented Buttons */}
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => setPriceType("amount")}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all border ${
                          priceType === "amount"
                            ? "bg-primary text-white border-primary shadow-xs"
                            : "bg-white text-slate-700 border-slate-200 hover:border-primary/50"
                        }`}
                      >
                        Fixed Amount ($)
                      </button>
                      {priceOptions.map((opt: any) => (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => {
                            setPriceType(opt.option_key);
                            setPrice("0");
                          }}
                          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all border ${
                            priceType === opt.option_key
                              ? "bg-primary text-white border-primary shadow-xs"
                              : "bg-white text-slate-700 border-slate-200 hover:border-primary/50"
                          }`}
                        >
                          {opt.option_value}
                        </button>
                      ))}
                    </div>

                    {/* Price Input when amount selected */}
                    {priceType === "amount" ? (
                      <div className="relative flex items-center">
                        <span className="absolute left-4 font-black text-base text-slate-400 pointer-events-none">
                          $
                        </span>
                        <input
                          type="number"
                          value={price}
                          onChange={(e) => setPrice(e.target.value)}
                          className="w-full h-12 pl-9 pr-14 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary text-base font-black text-slate-900 placeholder:text-slate-400 placeholder:font-normal transition-all shadow-2xs"
                          placeholder={templateConfig.pricePlaceholder || "0.00"}
                          required
                        />
                        <span className="absolute right-4 text-xs font-bold text-slate-400 uppercase tracking-wider pointer-events-none">
                          CAD
                        </span>
                      </div>
                    ) : (
                      <div className="h-12 px-4 rounded-xl bg-white border border-slate-200 flex items-center text-xs font-bold text-slate-600">
                        <span className="material-icons text-sm text-green-600 mr-2">check_circle</span>
                        No numerical price required ({priceOptions.find(o => o.option_key === priceType)?.option_value || "Special Pricing"})
                      </div>
                    )}
                  </div>

                  {/* Right Column: Condition */}
                  {!templateConfig.hideCondition && (
                    <div className="space-y-3">
                      <label className="block text-xs font-black text-slate-600 uppercase tracking-widest">
                        Condition
                      </label>
                      <select
                        value={condition}
                        onChange={(e) => setCondition(e.target.value)}
                        className="w-full h-12 px-4 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm font-bold text-slate-800 cursor-pointer transition-all shadow-2xs"
                      >
                        {category.startsWith("Vehicles") ? (
                          <>
                            <option value="Excellent">Excellent</option>
                            <option value="Good">Good</option>
                            <option value="Fair">Fair</option>
                            <option value="Parts Only">Parts Only</option>
                          </>
                        ) : (
                          <>
                            <option value="New">Brand New</option>
                            <option value="Used - Like New">Used - Like New</option>
                            <option value="Used - Good">Used - Good</option>
                            <option value="Used - Fair">Used - Fair</option>
                            <option value="For Parts">For Parts / Not Working</option>
                          </>
                        )}
                      </select>
                      <p className="text-[11px] text-slate-400 font-medium">
                        Accurate condition helps set the right buyer expectations.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Navigation Actions */}
              <div className="pt-6 border-t border-slate-100 flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-6 py-3 font-bold text-slate-500 hover:text-slate-800 text-sm transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <span className="material-icons text-base">chevron_left</span>
                  Back to Category
                </button>
                <button
                  disabled={(!templateConfig.hideTitle && !title) || (!templateConfig.hideDescription && !description) || (priceType === "amount" && !price && !templateConfig.hidePrice)}
                  onClick={() => setStep(3)}
                  className="bg-primary hover:bg-primary-hover text-white px-8 py-3.5 rounded-xl font-black text-sm uppercase tracking-wider transition-all shadow-md shadow-primary/20 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  Next: Choose Plan{" "}
                  <span className="material-icons text-lg">chevron_right</span>
                </button>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════
              STEP 3: CHOOSE VISIBILITY PLAN (FULL PAGE MATCHING PDF)
             ═══════════════════════════════════════════ */}
          {step === 3 && (
            <div className="w-full max-w-6xl mx-auto py-2 sm:py-6 space-y-8 animate-in fade-in duration-300">
              {/* Header from PDF Page 1 */}
              <div className="text-center max-w-2xl mx-auto space-y-2">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-[#111827] tracking-tight">
                  Pick Your HitAds Plan
                </h1>
                <p className="text-sm sm:text-base text-slate-500 font-medium">
                  Choose the level of visibility that works for your ad.
                </p>
              </div>

              {/* 3 Pricing Cards Grid from PDF Page 2 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
                
                {/* 1. FREE PLAN */}
                <div 
                  onClick={() => {
                    setSelectedPlan('free');
                    setPostInMultipleCities(false);
                    setSelectedCities([]);
                  }}
                  className={`flex flex-col rounded-2xl border bg-white p-7 sm:p-8 transition-all duration-200 cursor-pointer ${
                    selectedPlan === 'free'
                      ? "border-[#3b2885] ring-2 ring-[#3b2885]/20 shadow-xl scale-[1.02]"
                      : "border-slate-200 hover:border-slate-300 hover:shadow-lg"
                  }`}
                >
                  {/* Header */}
                  <div className="text-center pb-6 border-b border-slate-100">
                    <h3 className="text-xl font-extrabold text-[#111827] uppercase tracking-wider mb-1">
                      FREE
                    </h3>
                    <p className="text-xs text-slate-400 font-medium mb-4">
                      Get your ad online
                    </p>
                    <div className="text-3xl font-black text-[#16a34a] tracking-tight">
                      FREE
                    </div>
                  </div>

                  {/* Features List */}
                  <div className="py-6 flex-1 space-y-3.5">
                    <div className="flex items-center gap-2.5 text-sm text-slate-600 font-medium">
                      <span className="text-[#16a34a] font-bold text-base">✓</span>
                      <span>Up to 10 photos</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-sm text-slate-600 font-medium">
                      <span className="text-[#16a34a] font-bold text-base">✓</span>
                      <span>Standard listing</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-sm text-slate-600 font-medium">
                      <span className="text-[#16a34a] font-bold text-base">✓</span>
                      <span>Business phone / contact</span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="pt-4">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedPlan('free');
                        setPostInMultipleCities(false);
                        setSelectedCities([]);
                        setStep(4);
                      }}
                      className={`w-full py-3.5 px-6 rounded-xl font-bold text-sm uppercase tracking-wider transition-all duration-150 shadow-md cursor-pointer ${
                        selectedPlan === 'free'
                          ? "bg-[#3b2885] text-white hover:bg-[#312070] shadow-[#3b2885]/20 ring-2 ring-[#3b2885]/30"
                          : "bg-[#3b2885] text-white hover:bg-[#312070]"
                      }`}
                    >
                      {selectedPlan === 'free' ? "SELECT & CONTINUE" : "SELECT"}
                    </button>
                  </div>
                </div>

                {/* 2. BOOST PLAN (MOST POPULAR) */}
                <div 
                  onClick={() => setSelectedPlan('boost')}
                  className={`relative flex flex-col rounded-2xl border-2 bg-white p-7 sm:p-8 transition-all duration-200 cursor-pointer ${
                    selectedPlan === 'boost'
                      ? "border-[#2563eb] ring-2 ring-blue-500/20 shadow-2xl scale-[1.03] z-10"
                      : "border-[#2563eb] shadow-xl shadow-blue-500/10 hover:shadow-2xl hover:shadow-blue-500/15"
                  }`}
                >
                  {/* Most Popular Banner */}
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#1d4ed8] text-white text-[11px] font-black uppercase tracking-widest py-1 px-4 rounded-full shadow-md">
                    MOST POPULAR
                  </div>

                  {/* Header */}
                  <div className="text-center pt-2 pb-6 border-b border-slate-100">
                    <h3 className="text-xl font-extrabold text-[#111827] uppercase tracking-wider mb-1">
                      BOOST
                    </h3>
                    <p className="text-xs text-slate-400 font-medium mb-4">
                      Get noticed faster
                    </p>
                    <div className="text-3xl font-black text-[#16a34a] tracking-tight">
                      ${getPlanPrice('boost').toFixed(2)} <span className="text-sm font-semibold text-slate-500">/ 30 days</span>
                    </div>
                  </div>

                  {/* Features List */}
                  <div className="py-6 flex-1 space-y-3.5">
                    <div className="flex items-center gap-2.5 text-sm text-slate-700 font-semibold">
                      <span className="text-[#16a34a] font-bold text-base">✓</span>
                      <span>Up to 20 photos</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-sm text-slate-600 font-medium">
                      <span className="text-[#16a34a] font-bold text-base">✓</span>
                      <span>Standard listing</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-sm text-slate-600 font-medium">
                      <span className="text-[#16a34a] font-bold text-base">✓</span>
                      <span>Automatic refresh every 7 days</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-sm text-slate-700 font-semibold">
                      <span className="text-[#16a34a] font-bold text-base">✓</span>
                      <span>Priority in search</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-sm text-slate-600 font-medium">
                      <span className="text-[#16a34a] font-bold text-base">✓</span>
                      <span>Website link</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-sm text-slate-600 font-medium">
                      <span className="text-[#16a34a] font-bold text-base">✓</span>
                      <span>Business phone / contact</span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="pt-4">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedPlan('boost');
                        setStep(4);
                      }}
                      className={`w-full py-3.5 px-6 rounded-xl font-bold text-sm uppercase tracking-wider transition-all duration-150 shadow-md cursor-pointer ${
                        selectedPlan === 'boost'
                          ? "bg-[#3b2885] text-white hover:bg-[#312070] shadow-[#3b2885]/20 ring-2 ring-[#3b2885]/30"
                          : "bg-[#3b2885] text-white hover:bg-[#312070]"
                      }`}
                    >
                      {selectedPlan === 'boost' ? "SELECT & CONTINUE" : "SELECT"}
                    </button>
                  </div>
                </div>

                {/* 3. PREMIUM PLAN */}
                <div 
                  onClick={() => setSelectedPlan('premium')}
                  className={`flex flex-col rounded-2xl border bg-white p-7 sm:p-8 transition-all duration-200 cursor-pointer ${
                    selectedPlan === 'premium'
                      ? "border-[#3b2885] ring-2 ring-[#3b2885]/20 shadow-xl scale-[1.02]"
                      : "border-slate-200 hover:border-slate-300 hover:shadow-lg"
                  }`}
                >
                  {/* Header */}
                  <div className="text-center pb-6 border-b border-slate-100">
                    <h3 className="text-xl font-extrabold text-[#111827] uppercase tracking-wider mb-1">
                      PREMIUM
                    </h3>
                    <p className="text-xs text-slate-400 font-medium mb-4">
                      Maximum exposure
                    </p>
                    <div className="text-3xl font-black text-[#16a34a] tracking-tight">
                      ${getPlanPrice('premium').toFixed(2)} <span className="text-sm font-semibold text-slate-500">/ 30 days</span>
                    </div>
                  </div>

                  {/* Features List */}
                  <div className="py-6 flex-1 space-y-3">
                    <div className="flex items-center gap-2.5 text-sm text-slate-700 font-semibold">
                      <span className="text-[#16a34a] font-bold text-base">✓</span>
                      <span>Up to 20 photos</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-sm text-slate-600 font-medium">
                      <span className="text-[#16a34a] font-bold text-base">✓</span>
                      <span>Standard listing</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-sm text-slate-600 font-medium">
                      <span className="text-[#16a34a] font-bold text-base">✓</span>
                      <span>Automatic refresh every 3 days</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-sm text-slate-700 font-semibold">
                      <span className="text-[#16a34a] font-bold text-base">✓</span>
                      <span>Priority in search</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-sm text-blue-600 font-bold">
                      <span className="text-[#16a34a] font-bold text-base">✓</span>
                      <span>Multi-city posting - up to 5 cities</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-sm text-slate-600 font-medium">
                      <span className="text-[#16a34a] font-bold text-base">✓</span>
                      <span>Website link</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-sm text-slate-600 font-medium">
                      <span className="text-[#16a34a] font-bold text-base">✓</span>
                      <span>Facebook link</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-sm text-slate-600 font-medium">
                      <span className="text-[#16a34a] font-bold text-base">✓</span>
                      <span>YouTube link</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-sm text-slate-600 font-medium">
                      <span className="text-[#16a34a] font-bold text-base">✓</span>
                      <span>Business phone / contact</span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="pt-4">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedPlan('premium');
                        setStep(4);
                      }}
                      className={`w-full py-3.5 px-6 rounded-xl font-bold text-sm uppercase tracking-wider transition-all duration-150 shadow-md cursor-pointer ${
                        selectedPlan === 'premium'
                          ? "bg-[#3b2885] text-white hover:bg-[#312070] shadow-[#3b2885]/20 ring-2 ring-[#3b2885]/30"
                          : "bg-[#3b2885] text-white hover:bg-[#312070]"
                      }`}
                    >
                      {selectedPlan === 'premium' ? "SELECT & CONTINUE" : "SELECT"}
                    </button>
                  </div>
                </div>

              </div>

              {/* Footnote from PDF */}
              <div className="text-center pt-2">
                <p className="text-xs sm:text-sm text-slate-400 font-medium">
                  Premium Multi-City Posting lets the same ad appear in up to 5 cities selected by the advertiser.
                </p>
              </div>

              {/* Bottom Navigation */}
              <div className="pt-6 border-t border-slate-200 flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-6 py-3 font-bold text-slate-500 hover:text-slate-800 text-sm transition-colors cursor-pointer flex items-center gap-1.5 bg-white border border-slate-200 rounded-xl shadow-2xs hover:bg-slate-50"
                >
                  <span className="material-icons text-base">chevron_left</span>
                  Back to Details
                </button>
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="bg-primary hover:bg-primary-hover text-white px-8 py-3.5 rounded-xl font-black text-sm uppercase tracking-wider transition-all shadow-md shadow-primary/20 flex items-center gap-2 cursor-pointer"
                >
                  Next: Media & Location{" "}
                  <span className="material-icons text-lg">chevron_right</span>
                </button>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════
              STEP 4: MEDIA, LOCATION & PUBLISH
             ═══════════════════════════════════════════ */}
          {step === 4 && (
            <div className="bg-white p-6 sm:p-8 md:p-10 rounded-3xl border border-slate-200 shadow-sm space-y-8 animate-in fade-in duration-300">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="inline-flex items-center gap-1 py-1 px-3 rounded-full bg-blue-50 text-primary text-[10px] font-black uppercase tracking-widest border border-blue-200/60">
                      <span className="material-icons text-xs">add_a_photo</span> STEP 4 OF 4
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                    {isEditMode ? "Edit Media & Location" : "Media, Location & Publish"}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                    Upload high quality photos, set your location, and publish your ad across Canada.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-black px-3.5 py-1.5 rounded-full uppercase tracking-wider flex items-center gap-1 ${
                    selectedPlan === 'free' 
                      ? 'bg-slate-100 text-slate-700 border border-slate-200' 
                      : selectedPlan === 'boost'
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'bg-purple-50 text-purple-700 border border-purple-200'
                  }`}>
                    <span className="material-icons text-sm">workspace_premium</span>
                    {selectedPlan.toUpperCase()} PLAN
                  </span>
                </div>
              </div>

              {/* Photos Section */}
              {(() => {
                const maxAllowedPhotos = selectedPlan === 'free' ? 10 : 20;
                const activePhotoCount = imagePreviews.filter((p) => p !== null).length;

                return (
                  <section className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-xs font-black text-slate-700 uppercase tracking-widest flex items-center gap-2">
                          Add Photos {templateConfig.photosRequired !== false ? '(Cover Photo Required)' : '(Optional)'}{" "}
                          {templateConfig.photosRequired !== false && <span className="text-red-500">*</span>}
                        </label>
                        <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                          {selectedPlan === 'free' 
                            ? 'Free plan includes up to 10 photos.' 
                            : '⭐ Paid plan unlocked: Up to 20 high-resolution photos.'}
                        </p>
                      </div>
                      <span
                        className={`text-xs font-black px-3 py-1 rounded-full ${
                          activePhotoCount > 0
                            ? "bg-green-100 text-green-700"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {activePhotoCount} / {maxAllowedPhotos} photos
                      </span>
                    </div>

                    {/* Progress bar */}
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${(activePhotoCount / maxAllowedPhotos) * 100}%`,
                          background:
                            imagePreviews[0] !== null ? "#22c55e" : "#f59e0b",
                        }}
                      />
                    </div>

                    {imageFiles[0] === null && imagePreviews[0] === null && (
                      <p className="text-xs text-amber-600 font-bold flex items-center gap-1.5">
                        <span className="material-icons text-sm">info</span>
                        Cover photo is required to publish your ad.
                      </p>
                    )}

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5">
                      {Array.from({ length: maxAllowedPhotos }).map((_, index) => (
                        <div
                          key={index}
                          className={`relative w-full aspect-square border-2 border-dashed rounded-2xl flex flex-col items-center justify-center group hover:border-primary hover:bg-white transition-all overflow-hidden cursor-pointer ${
                            imagePreviews[index]
                              ? "border-green-400 bg-green-50/50"
                              : "border-slate-200 bg-slate-50/70"
                          }`}
                        >
                          <input
                            type="file"
                            accept="image/*"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                const file = e.target.files[0];
                                const newFiles = [...imageFiles];
                                newFiles[index] = file;
                                setImageFiles(newFiles);
                                const reader = new FileReader();
                                reader.onload = (ev) => {
                                  const newPreviews = [...imagePreviews];
                                  newPreviews[index] = ev.target?.result as string;
                                  setImagePreviews(newPreviews);
                                };
                                reader.readAsDataURL(file);
                              }
                              e.target.value = "";
                            }}
                          />
                          {imagePreviews[index] ? (
                            <div className="absolute inset-0 z-10 pointer-events-none">
                              <img
                                src={imagePreviews[index]!}
                                className="w-full h-full object-cover"
                                alt={`Image ${index + 1}`}
                              />
                              <div className="absolute bottom-2 left-2 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center shadow-xs">
                                <span className="material-icons text-white text-[12px]">
                                  check
                                </span>
                              </div>
                            </div>
                          ) : (
                            <>
                              <span className="material-icons text-2xl text-slate-300 group-hover:text-primary mb-1">
                                {index === 0 ? "add_a_photo" : "add"}
                              </span>
                              <span className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">
                                {index === 0 ? "Cover Photo" : `Photo ${index + 1}`}
                              </span>
                              {index === 0 && (
                                <span className="text-[9px] text-red-500 font-bold mt-0.5">
                                  Required
                                </span>
                              )}
                            </>
                          )}

                          {/* Delete button */}
                          {imagePreviews[index] && (
                            <button
                              type="button"
                              className="absolute top-2 right-2 z-30 w-6 h-6 bg-white/90 rounded-full flex items-center justify-center text-red-500 hover:scale-110 shadow-xs transition-all"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                const newFiles = [...imageFiles];
                                newFiles[index] = null;
                                setImageFiles(newFiles);
                                const newPreviews = [...imagePreviews];
                                newPreviews[index] = null;
                                setImagePreviews(newPreviews);
                              }}
                            >
                              <span className="material-icons text-xs pointer-events-none">
                                close
                              </span>
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </section>
                );
              })()}

              {/* Location Section */}
              {!templateConfig.hideLocation && (
                <section className="space-y-4 pt-6 border-t border-slate-100">
                  <div>
                    <label className="block text-xs font-black text-slate-700 uppercase tracking-widest mb-1">
                      Item Location
                    </label>
                    <p className="text-xs text-slate-400 font-medium">
                      Enter your city, neighborhood, or postal code.
                    </p>
                  </div>

                  {/* Multi-city option: Locked on Free plan, Unlocked on Paid plans */}
                  {!isEditMode && selectedPlan === 'free' ? (
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center shrink-0">
                          <span className="material-icons text-base">lock</span>
                        </div>
                        <div>
                          <span className="text-xs font-black text-slate-800">
                            Multi-City Posting (Up to 5 Cities)
                          </span>
                          <p className="text-[11px] text-slate-500 font-medium">
                            Reach buyers in up to 5 Canadian cities at once. Available with Boost & Premium plans.
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setStep(3)}
                        className="px-3.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-primary rounded-xl font-bold text-xs uppercase tracking-wider border border-blue-200 transition-colors cursor-pointer shrink-0"
                      >
                        Upgrade Plan
                      </button>
                    </div>
                  ) : !isEditMode ? (
                    <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-200/80">
                      <label className="flex items-center gap-3.5 cursor-pointer group w-fit select-none">
                        <div
                          className={`relative w-11 h-6 rounded-full transition-colors duration-300 ${
                            postInMultipleCities
                              ? "bg-primary"
                              : "bg-slate-300 group-hover:bg-slate-400"
                          }`}
                          onClick={() => {
                            setPostInMultipleCities(!postInMultipleCities);
                            if (postInMultipleCities) {
                              setSelectedCities([]);
                              setCitySearchQuery("");
                            }
                          }}
                        >
                          <div
                            className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300 ${
                              postInMultipleCities ? "translate-x-5" : "translate-x-0"
                            }`}
                          />
                        </div>
                        <div
                          className="flex flex-col"
                          onClick={() => {
                            setPostInMultipleCities(!postInMultipleCities);
                            if (postInMultipleCities) {
                              setSelectedCities([]);
                              setCitySearchQuery("");
                            }
                          }}
                        >
                          <span className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                            Post in Multiple Cities (Up to 5)
                            <span className="text-[9px] font-black text-white bg-blue-600 px-2 py-0.5 rounded-full uppercase tracking-wider">
                              Paid Feature Unlocked
                            </span>
                          </span>
                          <span className="text-[11px] text-slate-500 font-medium">
                            Reach wider audiences across several Canadian cities at once
                          </span>
                        </div>
                      </label>
                    </div>
                  ) : null}

                  {/* MULTI-CITY MODE (when paid plan & toggle active) */}
                  {!isEditMode && selectedPlan !== 'free' && postInMultipleCities ? (
                    <div className="space-y-4">
                      <div className="flex gap-2">
                        <div className="flex-1">
                          <LocationAutocomplete
                            value={citySearchQuery}
                            onChange={(val) => setCitySearchQuery(val)}
                            onSelectLocation={(item) => handleSelectCity(item)}
                            disabled={selectedCities.length >= 5}
                            variant="form"
                            placeholder={selectedCities.length >= 5 ? "Maximum 5 cities limit reached" : "Search and add cities/sub-cities (e.g. Scarborough, Airdrie, Richmond...)"}
                            syncWithLocalStorage={false}
                          />
                        </div>
                        <button
                          type="button"
                          disabled={selectedCities.length >= 5 || !citySearchQuery.trim()}
                          onClick={() => handleAddCustomCity(citySearchQuery)}
                          className="px-6 bg-primary hover:bg-primary-hover text-white rounded-xl font-bold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                        >
                          Add
                        </button>
                      </div>

                      {selectedCities.length > 0 ? (
                        <div>
                          <div className="flex items-center justify-between mb-2.5">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                              Selected Cities ({selectedCities.length} / 5 max)
                            </span>
                            <button
                              type="button"
                              onClick={() => setSelectedCities([])}
                              className="text-[10px] font-bold text-red-500 hover:text-red-700 uppercase tracking-widest transition-colors cursor-pointer"
                            >
                              Clear All
                            </button>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {selectedCities.map((city, idx) => (
                              <div
                                key={idx}
                                className="flex items-center gap-2 bg-blue-50 text-primary pl-3.5 pr-2 py-1.5 rounded-full border border-blue-200 text-xs font-bold"
                              >
                                <span className="material-icons text-sm">location_on</span>
                                <span>{city.location}</span>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveCity(idx)}
                                  className="w-4 h-4 rounded-full bg-blue-200/60 hover:bg-red-500 hover:text-white text-primary flex items-center justify-center transition-all ml-1 cursor-pointer"
                                >
                                  <span className="material-icons text-[10px]">close</span>
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="p-5 text-center bg-amber-50 rounded-xl border border-amber-200 text-xs font-bold text-amber-800">
                          Search and add at least one city above to continue.
                        </div>
                      )}
                    </div>
                  ) : (
                    /* SINGLE LOCATION MODE */
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <LocationAutocomplete
                          value={location}
                          onChange={(val) => setLocation(val)}
                          onSelectLocation={(item) => handleSelectLocation(item)}
                          variant="form"
                          placeholder="Street address, City or Sub-city (e.g. Toronto, ON)"
                          syncWithLocalStorage={false}
                        />
                      </div>
                      <div className="relative">
                        <span className="material-icons absolute left-4 top-3.5 text-slate-400 text-lg">
                          markunread_mailbox
                        </span>
                        <input
                          value={postalCode}
                          onChange={(e) => setPostalCode(e.target.value)}
                          className="w-full h-12 pl-11 pr-4 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm font-medium text-slate-800"
                          placeholder="Postal Code (e.g. M5C 1X6)"
                        />
                      </div>
                    </div>
                  )}
                </section>
              )}

              {/* Contact & Social Links Section */}
              <section className="space-y-4 pt-6 border-t border-slate-100">
                <label className="block text-xs font-black text-slate-700 uppercase tracking-widest">
                  Contact & Social Media Links
                </label>

                {/* Phone Toggle (Available on all plans) */}
                {!templateConfig.hidePhone && (
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer group w-fit select-none">
                      <div
                        className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                          includePhone ? "bg-primary border-primary" : "bg-white border-slate-300 group-hover:border-primary"
                        }`}
                      >
                        {includePhone && (
                          <span className="material-icons text-white text-[14px]">
                            check
                          </span>
                        )}
                      </div>
                      <span className="text-xs font-bold text-slate-700">
                        Display Phone Number on Public Ad
                      </span>
                      <input
                        type="checkbox"
                        className="hidden"
                        checked={includePhone}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          setIncludePhone(checked);
                          if (!checked) {
                            setContactPhone("");
                          }
                        }}
                      />
                    </label>

                    {includePhone && (
                      <div className="relative max-w-md">
                        <span className="material-icons absolute left-4 top-3.5 text-slate-400 text-lg">
                          phone
                        </span>
                        <input
                          type="tel"
                          value={contactPhone}
                          onChange={(e) => setContactPhone(e.target.value)}
                          className="w-full h-12 pl-11 pr-4 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm font-medium text-slate-800"
                          placeholder="Phone Number (e.g. 416-555-0199)"
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* Social Links: Locked on Free, Unlocked on Paid */}
                {!templateConfig.hideSocialLinks && (
                  selectedPlan === 'free' ? (
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mt-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center shrink-0">
                          <span className="material-icons text-base">smart_display</span>
                        </div>
                        <div>
                          <span className="text-xs font-black text-slate-800">
                            YouTube Video & Facebook Links
                          </span>
                          <p className="text-[11px] text-slate-500 font-medium">
                            Add interactive video tours and Facebook links to increase buyer engagement. Available on Boost & Premium plans.
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setStep(3)}
                        className="px-3.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-primary rounded-xl font-bold text-xs uppercase tracking-wider border border-blue-200 transition-colors cursor-pointer shrink-0"
                      >
                        Upgrade Plan
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                      <div>
                        <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                          <span className="material-icons text-red-500 text-sm">play_circle</span>
                          YouTube Video Link
                        </label>
                        <input
                          type="url"
                          value={youtubeLink}
                          onChange={(e) => setYoutubeLink(e.target.value)}
                          className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm font-medium text-slate-800"
                          placeholder="e.g. https://www.youtube.com/watch?v=..."
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                          <span className="material-icons text-blue-600 text-sm">facebook</span>
                          Facebook Page or Listing Link
                        </label>
                        <input
                          type="url"
                          value={facebookLink}
                          onChange={(e) => setFacebookLink(e.target.value)}
                          className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm font-medium text-slate-800"
                          placeholder="e.g. https://www.facebook.com/..."
                        />
                      </div>
                    </div>
                  )
                )}
              </section>

              {/* ═══════════════════════════════════════════
                  PUBLISHING MODES & PROMOTIONAL UPGRADES
                 ═══════════════════════════════════════════ */}
              <section className="space-y-4 pt-6 border-t border-slate-100">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <label className="block text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                      <span className="material-icons text-primary text-base">stars</span>
                      Publishing Modes & Promotional Upgrades
                    </label>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                      Boost visibility, get urgent buyers, or feature your ad on the Homepage.
                    </p>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Optional Add-ons
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* 1. HOMEPAGE AD / HOME GALLERY */}
                  <div className={`p-4.5 rounded-2xl border transition-all ${
                    selectedPlan === 'premium'
                      ? 'border-purple-200 bg-purple-50/50'
                      : promotionData.is_home_gallery
                      ? 'border-blue-500 bg-blue-50/60 shadow-md ring-1 ring-blue-500/20'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}>
                    <div className="flex items-start justify-between gap-3">
                      <label className="flex items-start gap-3 cursor-pointer flex-1 min-w-0 select-none">
                        <input
                          type="checkbox"
                          disabled={selectedPlan === 'premium'}
                          checked={selectedPlan === 'premium' || promotionData.is_home_gallery}
                          onChange={(e) => setPromotionData({ ...promotionData, is_home_gallery: e.target.checked })}
                          className="w-5 h-5 text-blue-600 rounded border-slate-300 focus:ring-blue-500 mt-0.5 shrink-0 cursor-pointer disabled:opacity-75"
                        />
                        <div className="min-w-0">
                          <p className="text-xs font-black text-slate-900 flex items-center gap-1.5 flex-wrap">
                            <span>Homepage Ad (Gallery)</span>
                            {selectedPlan === 'premium' ? (
                              <span className="text-[9px] font-black bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full uppercase tracking-wider">
                                ✓ Included in Premium
                              </span>
                            ) : (
                              <span className="text-[10px] font-black bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                                ${calculatePromoPrice('home_gallery', promotionData.home_gallery_duration, 14.99).toFixed(2)} CAD
                              </span>
                            )}
                          </p>
                          <p className="text-[11px] text-slate-500 font-medium mt-0.5 leading-relaxed">
                            Showcase your ad prominently on the HitAds Homepage Showcase Gallery.
                          </p>
                        </div>
                      </label>

                      {selectedPlan !== 'premium' && (
                        <div className="shrink-0">
                          <select
                            disabled={!promotionData.is_home_gallery}
                            value={promotionData.home_gallery_duration}
                            onChange={(e) => setPromotionData({ ...promotionData, home_gallery_duration: Number(e.target.value) })}
                            className="text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 focus:ring-2 focus:ring-blue-500 outline-none shadow-2xs cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {getPromotionOptions('home_gallery', 14.99).map((opt: any) => (
                              <option key={opt.duration_days} value={opt.duration_days}>
                                {opt.duration_days} Days (${Number(opt.price).toFixed(2)})
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 2. TOP AD */}
                  <div className={`p-4.5 rounded-2xl border transition-all ${
                    selectedPlan === 'boost' || selectedPlan === 'premium'
                      ? 'border-blue-200 bg-blue-50/50'
                      : promotionData.is_top_ad
                      ? 'border-amber-500 bg-amber-50/60 shadow-md ring-1 ring-amber-500/20'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}>
                    <div className="flex items-start justify-between gap-3">
                      <label className="flex items-start gap-3 cursor-pointer flex-1 min-w-0 select-none">
                        <input
                          type="checkbox"
                          disabled={selectedPlan === 'boost' || selectedPlan === 'premium'}
                          checked={selectedPlan === 'boost' || selectedPlan === 'premium' || promotionData.is_top_ad}
                          onChange={(e) => setPromotionData({ ...promotionData, is_top_ad: e.target.checked })}
                          className="w-5 h-5 text-amber-600 rounded border-slate-300 focus:ring-amber-500 mt-0.5 shrink-0 cursor-pointer disabled:opacity-75"
                        />
                        <div className="min-w-0">
                          <p className="text-xs font-black text-slate-900 flex items-center gap-1.5 flex-wrap">
                            <span>Top Ad Placement</span>
                            {selectedPlan === 'boost' || selectedPlan === 'premium' ? (
                              <span className="text-[9px] font-black bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full uppercase tracking-wider">
                                ✓ Included in {selectedPlan.toUpperCase()}
                              </span>
                            ) : (
                              <span className="text-[10px] font-black bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                                ${calculatePromoPrice('top_ad', promotionData.top_ad_duration, 9.99).toFixed(2)} CAD
                              </span>
                            )}
                          </p>
                          <p className="text-[11px] text-slate-500 font-medium mt-0.5 leading-relaxed">
                            Positioned at the very top of category and search results above standard ads.
                          </p>
                        </div>
                      </label>

                      {selectedPlan === 'free' && (
                        <div className="shrink-0">
                          <select
                            disabled={!promotionData.is_top_ad}
                            value={promotionData.top_ad_duration}
                            onChange={(e) => setPromotionData({ ...promotionData, top_ad_duration: Number(e.target.value) })}
                            className="text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 focus:ring-2 focus:ring-amber-500 outline-none shadow-2xs cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {getPromotionOptions('top_ad', 9.99).map((opt: any) => (
                              <option key={opt.duration_days} value={opt.duration_days}>
                                {opt.duration_days} Days (${Number(opt.price).toFixed(2)})
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 3. URGENT AD */}
                  <div className={`p-4.5 rounded-2xl border transition-all ${
                    promotionData.is_urgent
                      ? 'border-red-500 bg-red-50/60 shadow-md ring-1 ring-red-500/20'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}>
                    <div className="flex items-start justify-between gap-3">
                      <label className="flex items-start gap-3 cursor-pointer flex-1 min-w-0 select-none">
                        <input
                          type="checkbox"
                          checked={promotionData.is_urgent}
                          onChange={(e) => setPromotionData({ ...promotionData, is_urgent: e.target.checked })}
                          className="w-5 h-5 text-red-600 rounded border-slate-300 focus:ring-red-500 mt-0.5 shrink-0 cursor-pointer"
                        />
                        <div className="min-w-0">
                          <p className="text-xs font-black text-slate-900 flex items-center gap-1.5 flex-wrap">
                            <span className="flex items-center gap-1">
                              <span className="material-icons text-red-500 text-sm">local_fire_department</span>
                              Urgent Ad
                            </span>
                            <span className="text-[10px] font-black bg-red-100 text-red-800 px-2 py-0.5 rounded-full">
                              ${calculatePromoPrice('urgent', promotionData.urgent_duration, 5.99).toFixed(2)} CAD
                            </span>
                          </p>
                          <p className="text-[11px] text-slate-500 font-medium mt-0.5 leading-relaxed">
                            Stands out with an eye-catching bright red "Urgent" badge to sell up to 3x faster.
                          </p>
                        </div>
                      </label>

                      <div className="shrink-0">
                        <select
                          disabled={!promotionData.is_urgent}
                          value={promotionData.urgent_duration}
                          onChange={(e) => setPromotionData({ ...promotionData, urgent_duration: Number(e.target.value) })}
                          className="text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 focus:ring-2 focus:ring-red-500 outline-none shadow-2xs cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {getPromotionOptions('urgent', 5.99).map((opt: any) => (
                            <option key={opt.duration_days} value={opt.duration_days}>
                              {opt.duration_days} Days (${Number(opt.price).toFixed(2)})
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* 4. HIGHLIGHTED AD */}
                  <div className={`p-4.5 rounded-2xl border transition-all ${
                    selectedPlan === 'premium'
                      ? 'border-purple-200 bg-purple-50/50'
                      : promotionData.is_highlighted
                      ? 'border-yellow-500 bg-yellow-50/60 shadow-md ring-1 ring-yellow-500/20'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}>
                    <div className="flex items-start justify-between gap-3">
                      <label className="flex items-start gap-3 cursor-pointer flex-1 min-w-0 select-none">
                        <input
                          type="checkbox"
                          disabled={selectedPlan === 'premium'}
                          checked={selectedPlan === 'premium' || promotionData.is_highlighted}
                          onChange={(e) => setPromotionData({ ...promotionData, is_highlighted: e.target.checked })}
                          className="w-5 h-5 text-yellow-600 rounded border-slate-300 focus:ring-yellow-500 mt-0.5 shrink-0 cursor-pointer disabled:opacity-75"
                        />
                        <div className="min-w-0">
                          <p className="text-xs font-black text-slate-900 flex items-center gap-1.5 flex-wrap">
                            <span>Highlighted Background</span>
                            {selectedPlan === 'premium' ? (
                              <span className="text-[9px] font-black bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full uppercase tracking-wider">
                                ✓ Included in Premium
                              </span>
                            ) : (
                              <span className="text-[10px] font-black bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">
                                ${calculatePromoPrice('highlighted', promotionData.highlighted_duration, 4.99).toFixed(2)} CAD
                              </span>
                            )}
                          </p>
                          <p className="text-[11px] text-slate-500 font-medium mt-0.5 leading-relaxed">
                            Distinct highlighted background that catches the buyer's eye when scrolling listings.
                          </p>
                        </div>
                      </label>

                      {selectedPlan !== 'premium' && (
                        <div className="shrink-0">
                          <select
                            disabled={!promotionData.is_highlighted}
                            value={promotionData.highlighted_duration}
                            onChange={(e) => setPromotionData({ ...promotionData, highlighted_duration: Number(e.target.value) })}
                            className="text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 focus:ring-2 focus:ring-yellow-500 outline-none shadow-2xs cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {getPromotionOptions('highlighted', 4.99).map((opt: any) => (
                              <option key={opt.duration_days} value={opt.duration_days}>
                                {opt.duration_days} Days (${Number(opt.price).toFixed(2)})
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </section>

              {/* Selected Plan Summary Banner */}
              <div className="pt-6 border-t border-slate-100">
                <div className={`p-5 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                  selectedPlan === 'free' 
                    ? 'bg-slate-50 border-slate-200' 
                    : selectedPlan === 'boost'
                    ? 'bg-blue-50/60 border-blue-200'
                    : 'bg-purple-50/60 border-purple-200'
                }`}>
                  <div className="flex items-center gap-3.5">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-white ${
                      selectedPlan === 'free' ? 'bg-slate-700' : selectedPlan === 'boost' ? 'bg-blue-600' : 'bg-purple-600'
                    }`}>
                      <span className="material-icons text-xl">
                        {selectedPlan === 'free' ? 'check' : selectedPlan === 'boost' ? 'bolt' : 'workspace_premium'}
                      </span>
                    </div>
                    <div>
                      <div className="text-xs font-black text-slate-900 flex items-center gap-2">
                        <span>{selectedPlan.toUpperCase()} PLAN SELECTED</span>
                        <span className="text-green-600 font-bold">
                          {(() => {
                            const grand = getGrandTotal();
                            return grand.subtotal === 0 
                              ? 'FREE ($0.00 CAD)' 
                              : `${grand.total.toFixed(2)} CAD (incl. 13% tax)`;
                          })()}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                        {selectedPlan === 'free' 
                          ? 'Standard 10-photo listing, 1 city location, free Canada-wide listing.' 
                          : selectedPlan === 'boost'
                          ? 'Priority Top Placement, 20 photos, Multi-City posting, YouTube/Facebook links, 7-day auto refresh.'
                          : 'Homepage Showcase Gallery, Top Placement, 20 photos, Multi-City posting, YouTube/Facebook links, 3-day auto refresh.'}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 rounded-xl font-bold text-xs uppercase tracking-wider border border-slate-200 transition-colors cursor-pointer shrink-0 shadow-2xs"
                  >
                    Change Plan
                  </button>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-6 border-t border-slate-100 flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-6 py-3 font-bold text-slate-500 hover:text-slate-800 text-sm transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <span className="material-icons text-base">chevron_left</span>
                  Back to Plan
                </button>
                <button
                  disabled={
                    (templateConfig.hideLocation ? false : (postInMultipleCities && selectedPlan !== 'free' ? selectedCities.length === 0 : (!location && !postalCode))) ||
                    isPublishing ||
                    (templateConfig.photosRequired !== false && imageFiles[0] === null && imagePreviews[0] === null)
                  }
                  onClick={handleInitiatePublish}
                  className="bg-primary hover:bg-primary-hover text-white px-8 py-3.5 rounded-xl font-black text-sm uppercase tracking-wider transition-all shadow-md shadow-primary/20 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isPublishing 
                    ? (isEditMode ? "Saving Changes..." : "Publishing Ad...") 
                    : (isEditMode 
                        ? "Save Changes" 
                        : (() => {
                            const grand = getGrandTotal();
                            return grand.subtotal === 0 
                              ? "Publish Free Ad" 
                              : `Proceed to Secure Payment (${grand.total.toFixed(2)} CAD)`;
                          })())}{" "}
                  <span className="material-icons text-lg">
                    {selectedPlan === 'free' ? 'check' : 'lock'}
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ═══════════════════════════════════════════
            RIGHT SIDEBAR (STICKY, LIVE SUMMARY & TIPS)
           ═══════════════════════════════════════════ */}
        {step !== 3 && (
        <aside className="lg:col-span-4 xl:col-span-3 space-y-6 sticky top-28 self-start">
          {/* Live Ad Summary Card */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-black text-xs uppercase tracking-widest text-slate-900 flex items-center gap-2">
                <span className="material-icons text-primary text-base">visibility</span>
                Live Summary
              </h3>
              <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-blue-50 text-primary">
                Step {step} of 4
              </span>
            </div>

            <div className="space-y-3.5 text-xs">
              {/* Category */}
              <div className="flex justify-between items-start gap-2">
                <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Category:</span>
                <span className="font-bold text-slate-800 text-right truncate max-w-[180px]">
                  {category || "Not selected"}
                </span>
              </div>

              {/* Title */}
              <div className="flex justify-between items-start gap-2">
                <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Title:</span>
                <span className="font-bold text-slate-800 text-right truncate max-w-[180px]">
                  {title || "Untitled Ad"}
                </span>
              </div>

              {/* Price */}
              <div className="flex justify-between items-start gap-2">
                <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Price:</span>
                <span className="font-black text-green-600 text-right">
                  {priceType === "amount" 
                    ? (price ? `$${parseFloat(price).toLocaleString()}` : "$0.00")
                    : (priceOptions.find(o => o.option_key === priceType)?.option_value || "Special Pricing")}
                </span>
              </div>

              {/* Location */}
              <div className="flex justify-between items-start gap-2">
                <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Location:</span>
                <span className="font-bold text-slate-800 text-right truncate max-w-[180px]">
                  {!isEditMode && postInMultipleCities && selectedPlan !== 'free'
                    ? `${selectedCities.length} ${selectedCities.length === 1 ? 'city' : 'cities'}` 
                    : (location || "Not set")}
                </span>
              </div>

              {/* Plan */}
              <div className="flex justify-between items-start gap-2">
                <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Plan:</span>
                <span className="font-black text-primary text-right uppercase">
                  {selectedPlan === 'free' ? 'FREE ($0)' : selectedPlan === 'boost' ? 'BOOST ($9.99)' : 'PREMIUM ($24.99)'}
                </span>
              </div>

              {/* Photos */}
              <div className="flex justify-between items-start gap-2">
                <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Photos:</span>
                <span className="font-bold text-slate-800 text-right">
                  {imagePreviews.filter(p => p !== null).length} / {selectedPlan === 'free' ? 10 : 20} added
                </span>
              </div>
            </div>
          </div>

          {/* Context-Aware Tips Card */}
          <div className="bg-slate-50/80 rounded-3xl border border-slate-200 p-6 space-y-4">
            <h3 className="font-black flex items-center gap-2 text-primary uppercase tracking-widest text-xs">
              <span className="material-icons text-base">lightbulb</span> 
              {step === 1 ? "Category Tips" : step === 2 ? "Listing Tips" : step === 3 ? "Visibility Tips" : "Publishing Tips"}
            </h3>

            <ul className="space-y-4">
              {step === 1 && [
                { title: "Select Exact Subcategory", desc: "Choosing the most specific subcategory places your ad directly in front of interested buyers." },
                { title: "Vehicle Categories", desc: "Selecting Cars & Trucks unlocks full VIN decoding and verified specifications." },
              ].map((tip, i) => (
                <li key={i} className="flex gap-3">
                  <div className="w-5 h-5 bg-primary/10 text-primary text-[10px] font-black rounded-full flex items-center justify-center shrink-0 mt-0.5">
                    {i + 1}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs mb-0.5">{tip.title}</h4>
                    <p className="text-[11px] text-slate-500 leading-relaxed font-medium">{tip.desc}</p>
                  </div>
                </li>
              ))}

              {step === 2 && [
                { title: "Include Valid VIN", desc: "Including your 17-digit VIN builds buyer trust and unlocks verified history badges." },
                { title: "Be Transparent", desc: "Mention exact mileage, recent maintenance, and any minor cosmetic wear." },
                { title: "Competitive Pricing", desc: "Check similar listings in your city to price your item competitively." },
              ].map((tip, i) => (
                <li key={i} className="flex gap-3">
                  <div className="w-5 h-5 bg-primary/10 text-primary text-[10px] font-black rounded-full flex items-center justify-center shrink-0 mt-0.5">
                    {i + 1}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs mb-0.5">{tip.title}</h4>
                    <p className="text-[11px] text-slate-500 leading-relaxed font-medium">{tip.desc}</p>
                  </div>
                </li>
              ))}

              {step === 3 && [
                { title: "Boost for Faster Sales", desc: "Boost ads receive priority ranking at the top of search results and 20 photo uploads." },
                { title: "Premium Homepage Showcase", desc: "Premium ads are featured directly in the homepage gallery across up to 5 Canadian cities." },
                { title: "Flexible Plans", desc: "You can change or upgrade your promotion plan anytime." },
              ].map((tip, i) => (
                <li key={i} className="flex gap-3">
                  <div className="w-5 h-5 bg-primary/10 text-primary text-[10px] font-black rounded-full flex items-center justify-center shrink-0 mt-0.5">
                    {i + 1}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs mb-0.5">{tip.title}</h4>
                    <p className="text-[11px] text-slate-500 leading-relaxed font-medium">{tip.desc}</p>
                  </div>
                </li>
              ))}

              {step === 4 && [
                { title: "Bright Natural Light", desc: "Take photos in daylight showing front, rear, interior, and all key angles." },
                { title: "Accurate Location", desc: "Set your exact city or postal code so local buyers find your ad easily." },
                { title: "Verified Moneris Checkout", desc: "HitAds uses Moneris encrypted Canadian payment processing for paid promotions." },
              ].map((tip, i) => (
                <li key={i} className="flex gap-3">
                  <div className="w-5 h-5 bg-primary/10 text-primary text-[10px] font-black rounded-full flex items-center justify-center shrink-0 mt-0.5">
                    {i + 1}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs mb-0.5">{tip.title}</h4>
                    <p className="text-[11px] text-slate-500 leading-relaxed font-medium">{tip.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Canadian Marketplace Trust Guarantee */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50/50 rounded-3xl border border-blue-100 p-6 space-y-3">
            <div className="flex items-center gap-2 text-primary font-black text-xs uppercase tracking-wider">
              <span className="material-icons text-base">verified_user</span>
              HitAds Canada Verified
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
              Free ads Canada-wide. All paid promotions are securely processed with Moneris.
            </p>
          </div>
        </aside>
        )}
      </div>

      {/* HitAds Pricing Cards Popup Modal */}
      <PricingPlansModal
        isOpen={isPlanModalOpen}
        onClose={() => setIsPlanModalOpen(false)}
        onSelectPlan={handleSelectPlanFromModal}
        isSubmitting={isPublishing}
      />

      {/* Moneris Payment Modal */}
      {isPayModalOpen && (
        <MonerisPayModal
          ticket={payTicket}
          amount={payAmount}
          environment={payEnvironment}
          onSuccess={handlePaymentSuccess}
          onCancel={handlePaymentCancel}
        />
      )}
    </div>
  );
};

export default PostAd;

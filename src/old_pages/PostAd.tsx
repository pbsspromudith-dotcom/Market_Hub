"use client";

import React, { useState, useEffect } from "react";
import Link from 'next/link';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { trackListingSubmission } from "../analytics";
import MonerisPayModal from "../components/MonerisPayModal";
import { useUI } from "../components/UIProvider";
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
      setImageFiles(Array(10).fill(null));
      setImagePreviews(Array(10).fill(null));
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

  // Promotion selection state
  const [promotionData, setPromotionData] = useState({
    is_top_ad: false,
    top_ad_duration: 7,
    is_highlighted: false,
    highlighted_duration: 7,
    is_urgent: false,
    urgent_duration: 7,
    is_home_gallery: false,
    home_gallery_duration: 7,
  });
  
  const [promotionPricing, setPromotionPricing] = useState<any[]>([]);

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
  const [carModel, setCarModel] = useState("");
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
    Array(10).fill(null),
  );
  const [imagePreviews, setImagePreviews] = useState<(string | null)[]>(
    Array(10).fill(null),
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

  useEffect(() => {
    fetch("/api/promotions/pricing")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          setPromotionPricing(data.data);

          // Auto-sync initial duration selections to match active packages set in Admin
          setPromotionData((prev) => {
            const getValidDuration = (type: string, currentDuration: number) => {
              const opts = data.data.filter((p: any) => p.promotion_type === type);
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
        setImageFiles(Array(10).fill(null));
        setImagePreviews(Array(10).fill(null));
        setPostInMultipleCities(false);
        setSelectedCities([]);
        setCitySearchQuery("");
      }
    });
  };

  const [locationSuggestions, setLocationSuggestions] = useState<any[]>([]);
  const [isSearchingLocation, setIsSearchingLocation] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    if (location.trim().length >= 1 && showSuggestions) {
      const delayFn = setTimeout(() => {
        setIsSearchingLocation(true);
        fetch(
          `/api/locations/search?q=${encodeURIComponent(location)}`
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
  }, [location, showSuggestions]);

  // Multi-city search effect
  useEffect(() => {
    if (citySearchQuery.trim().length >= 1 && showCitySuggestions) {
      const delayFn = setTimeout(() => {
        setIsSearchingCity(true);
        fetch(
          `/api/locations/search?q=${encodeURIComponent(citySearchQuery)}`
        )
          .then((res) => res.json())
          .then((data) => setCitySearchSuggestions(data))
          .catch(console.error)
          .finally(() => setIsSearchingCity(false));
      }, 150);
      return () => clearTimeout(delayFn);
    } else {
      setCitySearchSuggestions([]);
    }
  }, [citySearchQuery, showCitySuggestions]);

  const handleSelectCity = (place: any) => {
    if (selectedCities.length >= 5) {
      showAlert("You can select up to 5 cities maximum for Multi-City posting.", "warning");
      setCitySearchQuery("");
      setShowCitySuggestions(false);
      return;
    }
    const cleanAddr = getCleanAddressString(place);
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
    setShowCitySuggestions(false);
  };

  const handleAddCustomCity = (cityName: string) => {
    const cleanCity = cityName.trim();
    if (!cleanCity) return;
    if (selectedCities.length >= 5) {
      showAlert("You can select up to 5 cities maximum for Multi-City posting.", "warning");
      setCitySearchQuery("");
      setShowCitySuggestions(false);
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
    setShowCitySuggestions(false);
  };

  const handleRemoveCity = (index: number) => {
    setSelectedCities(prev => prev.filter((_, i) => i !== index));
  };

  const handleSelectLocation = (place: any) => {
    const cleanAddr = getCleanAddressString(place);
    setLocation(cleanAddr);
    if (place.address && place.address.postcode) {
      setPostalCode(place.address.postcode);
    }
    if (place.lat && place.lon) {
      setLatitude(parseFloat(place.lat));
      setLongitude(parseFloat(place.lon));
    }
    setShowSuggestions(false);
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
      if (path[i].template_config) {
        try {
          return typeof path[i].template_config === 'string'
            ? JSON.parse(path[i].template_config)
            : path[i].template_config;
        } catch { return {}; }
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
    if (leafCategory && (!leafCategory.children || leafCategory.children.length === 0)) {
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

  const getPromotionOptions = (promoType: string, defaultPrice: number) => {
    const options = promotionPricing.filter(p => p.promotion_type === promoType);
    if (options.length === 0) {
      return [{ duration_days: 7, price: defaultPrice }];
    }
    return [...options].sort((a, b) => Number(a.duration_days) - Number(b.duration_days));
  };

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

  const calculatePrice = (promoType: string, duration: number, fallbackPrice: number) => {
    const options = promotionPricing.filter(p => p.promotion_type === promoType);
    if (options.length > 0) {
      const match = options.find(p => Number(p.duration_days) === Number(duration));
      if (match) return Number(match.price);
      return Number(options[0].price);
    }
    return fallbackPrice;
  };

  const handlePublish = async () => {
    setIsPublishing(true);
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

      // 1. Gather any new files to upload
      const newFilesIndices: number[] = [];
      const validFiles: File[] = [];
      imageFiles.forEach((file, idx) => {
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
      for (let i = 0; i < 10; i++) {
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
        youtube_link: youtubeLink,
        facebook_link: facebookLink,
      };

      // Multi-city or single city
      if (!isEditMode && postInMultipleCities && selectedCities.length > 0) {
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

        // Check if any promotions are selected
        const hasPromotions =
          promotionData.is_top_ad ||
          promotionData.is_highlighted ||
          promotionData.is_urgent ||
          promotionData.is_home_gallery;

        const isPending = !!(data.needs_approval || data.status === 'pending_approval');
        setCreatedNeedsApproval(isPending);

        if (hasPromotions) {
          setCreatedListingId(data.id);

          const preloadRes = await fetch("/api/payments/preload", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              listing_id: data.id,
              user_id: userId,
              ...promotionData,
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
    <div className="w-full px-4 sm:px-6 lg:px-10 py-12">
      {/* Header Stepper */}
      <div className="flex items-center justify-center mb-16 relative">
        <div className="flex flex-col items-center z-10">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= 1 ? "bg-primary text-white" : "bg-slate-200 text-slate-400"}`}
          >
            <span className="material-icons text-xl">
              {step > 1 ? "check" : "category"}
            </span>
          </div>
          <span
            className={`text-[10px] font-bold mt-2 uppercase tracking-widest ${step >= 1 ? "text-primary" : "text-slate-400"}`}
          >
            Category
          </span>
        </div>
        <div
          className={`h-1 flex-1 mx-4 rounded-full ${step >= 2 ? "bg-primary" : "bg-slate-200"}`}
        ></div>
        <div className="flex flex-col items-center z-10">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= 2 ? "bg-primary text-white" : "bg-slate-200 text-slate-400"}`}
          >
            <span className="material-icons text-xl">
              {step > 2 ? "check" : "info"}
            </span>
          </div>
          <span
            className={`text-[10px] font-bold mt-2 uppercase tracking-widest ${step >= 2 ? "text-primary" : "text-slate-400"}`}
          >
            Details
          </span>
        </div>
        <div
          className={`h-1 flex-1 mx-4 rounded-full ${step >= 3 ? "bg-primary" : "bg-slate-200"}`}
        ></div>
        <div className="flex flex-col items-center z-10">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= 3 ? "bg-primary text-white" : "bg-slate-200 text-slate-400"}`}
          >
            <span className="material-icons text-xl">image</span>
          </div>
          <span
            className={`text-[10px] font-bold mt-2 uppercase tracking-widest ${step >= 3 ? "text-primary" : "text-slate-400"}`}
          >
            Media
          </span>
        </div>
      </div>

      <div className="flex justify-end mb-6 relative z-20">
        <button
          onClick={handleReset}
          type="button"
          className="flex items-center gap-2 text-slate-500 hover:text-red-500 font-bold text-sm transition-colors bg-white px-5 py-2.5 rounded-xl border border-slate-200 shadow-sm hover:border-red-200 hover:bg-red-50 cursor-pointer"
        >
          <span className="material-icons text-lg">refresh</span> Reset Form
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-8">
          {step === 1 && (
            <div className="bg-white p-10 rounded-[2rem] border border-slate-200 shadow-sm">
              <h2 className="text-2xl font-black mb-8">{isEditMode ? "Edit Category" : "Select Category"}</h2>
              <div className="mb-4">
                <p className="text-sm text-slate-500 mb-4 tracking-widest uppercase font-bold text-center">
                  Manually select a category
                </p>

                {/* Category Breadcrumbs / Selected path */}
                {categoryPath.length > 0 && (
                  <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl mb-4 bg-white shadow-sm">
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
                          className="text-slate-400 hover:text-slate-700 transition-colors text-xs font-bold flex items-center gap-1 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-100"
                        >
                          <span className="material-icons text-sm">
                            arrow_back
                          </span>{" "}
                          Back
                        </button>
                      )}
                      <button
                        onClick={handleCategoryReset}
                        className="text-slate-400 hover:text-red-500 transition-colors text-xs font-bold flex items-center gap-1 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-100"
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
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {currentLevelCategories.map((cat: any) => (
                        <button
                          key={cat.CategoryID}
                          onClick={() => handleCategoryClick(cat)}
                          className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all group bg-slate-50 border-transparent hover:border-primary hover:bg-white`}
                        >
                          <span
                            className={`material-icons text-3xl mb-3 text-slate-400 group-hover:text-primary`}
                          >
                            {cat.Icon || "folder"}
                          </span>
                          <span className="text-xs font-bold text-slate-600 uppercase tracking-widest text-center">
                            {cat.CategoryName}
                          </span>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center bg-amber-50 rounded-xl border border-amber-200 text-amber-800 font-bold">
                      No subcategories available.
                    </div>
                  )
                ) : (
                  <div className="p-8 text-center bg-primary/5 rounded-xl border border-primary/20">
                    <span className="material-icons text-4xl text-primary mb-4 block">
                      check_circle
                    </span>
                    <p className="font-bold text-slate-800 text-lg">
                      Category Selected
                    </p>
                    <p className="text-slate-500 text-sm mt-2">{category}</p>
                  </div>
                )}
              </div>
              <div className="mt-10 pt-10 border-t border-slate-100 text-right">
                <button
                  disabled={category === ""}
                  onClick={() => setStep(2)}
                  className="bg-primary hover:bg-primary-hover text-white px-10 py-4 rounded-xl font-bold transition-all shadow-lg shadow-primary/20 flex items-center gap-2 ml-auto disabled:opacity-50"
                >
                  Next Step{" "}
                  <span className="material-icons">chevron_right</span>
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="bg-white p-10 rounded-[2rem] border border-slate-200 shadow-sm space-y-8">
              <h2 className="text-2xl font-black">{isEditMode ? "Edit Ad Information" : "Ad Information"}</h2>
              <div className="space-y-6">
                {!templateConfig.hideTitle && (
                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">
                      Ad Title
                    </label>
                    <input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-5 py-4 bg-slate-50 border-slate-100 rounded-xl focus:ring-primary focus:border-primary text-sm"
                      placeholder={getTitlePlaceholder(category)}
                    />
                  </div>
                )}
                {!templateConfig.hideDescription && (
                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">
                      Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={6}
                      className="w-full px-5 py-4 bg-slate-50 border-slate-100 rounded-xl focus:ring-primary focus:border-primary text-sm font-medium resize-y"
                      placeholder="Provide a detailed description of your item, service, or job..."
                      required
                    />
                  </div>
                )}

                {/* Vehicle Specifications & Characteristics Section — strictly scoped to selected vehicle categories */}
                {isVehicleSpecCategory(categoryPath, category) && (
                  <div className="bg-gradient-to-br from-blue-50/80 to-slate-50 p-6 sm:p-8 rounded-2xl border border-blue-100/80 shadow-xs space-y-6">
                    <div className="flex items-center gap-3 pb-3 border-b border-blue-100">
                      <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center shadow-md shadow-primary/20">
                        <span className="material-icons text-xl">directions_car</span>
                      </div>
                      <div>
                        <h3 className="text-base font-black text-slate-900 tracking-tight">
                          Vehicle Specifications & Characteristics
                        </h3>
                        <p className="text-xs text-slate-500 font-medium">
                          Provide detailed vehicle specifications to build buyer trust and increase search visibility.
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {/* VIN Field */}
                      <div className="col-span-1 md:col-span-2">
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 flex items-center justify-between">
                          <span>Vehicle Identification Number (VIN)</span>
                          <span className="text-slate-400 font-medium normal-case">17-character VIN</span>
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            maxLength={17}
                            value={carVIN}
                            onChange={(e) => setCarVIN(e.target.value.toUpperCase())}
                            className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl focus:ring-primary focus:border-primary text-sm font-mono tracking-wider text-slate-800 uppercase placeholder:normal-case placeholder:tracking-normal placeholder:text-slate-400"
                            placeholder="e.g. 2T1BURHE9FC123456"
                          />
                          <span className="material-icons absolute left-4 top-3.5 text-slate-400 text-lg">
                            fingerprint
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-1 font-medium">
                          Including a valid VIN gives buyers confidence and unlocks car history verification badges.
                        </p>
                      </div>

                      {/* Make */}
                      <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">
                          Make / Brand <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={carMake}
                          onChange={(e) => setCarMake(e.target.value)}
                          className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-xl focus:ring-primary focus:border-primary text-sm font-bold text-slate-800"
                          placeholder="e.g. Toyota, Honda, Ford, BMW..."
                        />
                      </div>

                      {/* Model */}
                      <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">
                          Model <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={carModel}
                          onChange={(e) => setCarModel(e.target.value)}
                          className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-xl focus:ring-primary focus:border-primary text-sm font-bold text-slate-800"
                          placeholder="e.g. Camry, Civic, F-150, RAV4..."
                        />
                      </div>

                      {/* Year */}
                      <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">
                          Model Year
                        </label>
                        <select
                          value={carYear}
                          onChange={(e) => setCarYear(e.target.value)}
                          className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-xl focus:ring-primary focus:border-primary text-sm font-bold text-slate-800 cursor-pointer"
                        >
                          <option value="">Select Year...</option>
                          {Array.from({ length: 47 }, (_, i) => 2026 - i).map((y) => (
                            <option key={y} value={y}>{y}</option>
                          ))}
                        </select>
                      </div>

                      {/* Trim / Edition */}
                      <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">
                          Trim / Package
                        </label>
                        <input
                          type="text"
                          value={carTrim}
                          onChange={(e) => setCarTrim(e.target.value)}
                          className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-xl focus:ring-primary focus:border-primary text-sm font-medium text-slate-800"
                          placeholder="e.g. XLE, EX-L, Lariat, M Sport..."
                        />
                      </div>

                      {/* Mileage / Kilometers */}
                      <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">
                          Kilometers (km)
                        </label>
                        <input
                          type="number"
                          value={carMileage}
                          onChange={(e) => setCarMileage(e.target.value)}
                          className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-xl focus:ring-primary focus:border-primary text-sm font-bold text-slate-800"
                          placeholder="e.g. 45000"
                        />
                      </div>

                      {/* Transmission */}
                      <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">
                          Transmission
                        </label>
                        <select
                          value={carTransmission}
                          onChange={(e) => setCarTransmission(e.target.value)}
                          className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-xl focus:ring-primary focus:border-primary text-sm font-medium text-slate-800 cursor-pointer"
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
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">
                          Fuel Type
                        </label>
                        <select
                          value={carFuelType}
                          onChange={(e) => setCarFuelType(e.target.value)}
                          className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-xl focus:ring-primary focus:border-primary text-sm font-medium text-slate-800 cursor-pointer"
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
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">
                          Body Type
                        </label>
                        <select
                          value={carBodyType}
                          onChange={(e) => setCarBodyType(e.target.value)}
                          className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-xl focus:ring-primary focus:border-primary text-sm font-medium text-slate-800 cursor-pointer"
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
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">
                          Drivetrain
                        </label>
                        <select
                          value={carDrivetrain}
                          onChange={(e) => setCarDrivetrain(e.target.value)}
                          className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-xl focus:ring-primary focus:border-primary text-sm font-medium text-slate-800 cursor-pointer"
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
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">
                          Exterior Color
                        </label>
                        <select
                          value={carColor}
                          onChange={(e) => setCarColor(e.target.value)}
                          className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-xl focus:ring-primary focus:border-primary text-sm font-medium text-slate-800 cursor-pointer"
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
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">
                          Doors
                        </label>
                        <select
                          value={carDoors}
                          onChange={(e) => setCarDoors(e.target.value)}
                          className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-xl focus:ring-primary focus:border-primary text-sm font-medium text-slate-800 cursor-pointer"
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
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">
                          Seating Capacity
                        </label>
                        <select
                          value={carSeatingCapacity}
                          onChange={(e) => setCarSeatingCapacity(e.target.value)}
                          className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-xl focus:ring-primary focus:border-primary text-sm font-medium text-slate-800 cursor-pointer"
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
                {dynamicAttributesList.length > 0 && (
                  <div className="bg-primary/5 p-6 rounded-xl border border-primary/20 space-y-4">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-2">
                      <span className="material-icons text-primary">info</span>
                      Specific Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {dynamicAttributesList.map((attr) => {
                        const name = attr.AttributeName;
                        const isRequired = attr.IsRequired === 1;
                        if (attr.AttributeType === "Dropdown") {
                          return (
                            <div key={attr.AttributeID}>
                              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">
                                {name}{" "}
                                {isRequired && (
                                  <span className="text-red-500">*</span>
                                )}
                              </label>
                              <select
                                value={dynamicAttributesValues[name] || ""}
                                onChange={(e) =>
                                  setDynamicAttributesValues((prev) => ({
                                    ...prev,
                                    [name]: e.target.value,
                                  }))
                                }
                                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:ring-primary focus:border-primary text-sm text-slate-700"
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
                              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">
                                {name}{" "}
                                {isRequired && (
                                  <span className="text-red-500">*</span>
                                )}
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
                                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:ring-primary focus:border-primary text-sm"
                                placeholder={`Enter ${name}...`}
                                required={isRequired}
                              />
                            </div>
                          );
                        } else if (attr.AttributeType === "CheckboxGroup") {
                          const currentVals = dynamicAttributesValues[name] ? dynamicAttributesValues[name].split(",").map((v: string) => v.trim()) : [];
                          return (
                            <div key={attr.AttributeID} className="col-span-1 md:col-span-2 pt-4 mt-2 border-t border-primary/10">
                              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">
                                {name} {isRequired && <span className="text-red-500">*</span>}
                              </label>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {attr.options.map((opt: string) => {
                                  const isChecked = currentVals.includes(opt);
                                  return (
                                    <label key={opt} className="flex items-center gap-3 cursor-pointer group">
                                      <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${isChecked ? "bg-primary border-primary" : "bg-white border-slate-300 group-hover:border-primary"}`}>
                                        {isChecked && <span className="material-icons text-white text-[14px]">check</span>}
                                      </div>
                                      <span className="text-sm font-medium text-slate-700">{opt}</span>
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
                              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">
                                {name}{" "}
                                {isRequired && (
                                  <span className="text-red-500">*</span>
                                )}
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
                                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:ring-primary focus:border-primary text-sm"
                                placeholder={`Enter ${name}...`}
                                required={isRequired}
                              />
                            </div>
                          );
                        }
                      })}
                    </div>
                    {!templateConfig.hideCarFeatures && isVehicleSpecCategory(categoryPath, category) && (Array.isArray(templateConfig.carFeaturesList) ? templateConfig.carFeaturesList.length > 0 : CAR_FEATURES_LIST.length > 0) && (
                      <div className="pt-4 mt-2 border-t border-primary/10">
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">
                          Features
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {(Array.isArray(templateConfig.carFeaturesList) ? templateConfig.carFeaturesList : CAR_FEATURES_LIST).map((feature: string) => (
                            <label
                              key={feature}
                              className="flex items-center gap-3 cursor-pointer group"
                            >
                              <div
                                className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${carFeatures.includes(feature) ? "bg-primary border-primary" : "bg-white border-slate-300 group-hover:border-primary"}`}
                              >
                                {carFeatures.includes(feature) && (
                                  <span className="material-icons text-white text-[14px]">
                                    check
                                  </span>
                                )}
                              </div>
                              <span className="text-sm font-medium text-slate-700">
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

                    {/* Brand & Model — for Mobile Phones & Computers under Electronics */}
                    {!templateConfig.hideBrandModel && (category.includes("Mobile Phones") ||
                      category.includes("Laptops") ||
                      category.includes("Desktop Computers") ||
                      category.includes("Gaming PCs") ||
                      category.includes("Tablets") ||
                      category.includes("Computer Parts")) && (
                      <div className="pt-4 mt-2 border-t border-primary/10">
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">
                          Brand & Model
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">
                              Brand
                            </label>
                            <input
                              type="text"
                              value={electronBrand}
                              onChange={(e) => setElectronBrand(e.target.value)}
                              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:ring-primary focus:border-primary text-sm"
                              placeholder="e.g. Apple, Samsung, Dell, HP..."
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">
                              Model
                            </label>
                            <input
                              type="text"
                              value={electronModel}
                              onChange={(e) => setElectronModel(e.target.value)}
                              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:ring-primary focus:border-primary text-sm"
                              placeholder="e.g. iPhone 16 Pro, Galaxy S25, XPS 15..."
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">
                      {templateConfig.priceLabel || "Price"}
                    </label>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="priceType"
                            value="amount"
                            checked={priceType === "amount"}
                            onChange={() => setPriceType("amount")}
                            className="w-4 h-4 text-primary border-slate-300 focus:ring-primary"
                          />
                          <span className="text-sm font-bold text-slate-700">$</span>
                        </label>
                        <input
                          type="number"
                          value={priceType === "amount" ? price : ""}
                          disabled={priceType !== "amount"}
                          onChange={(e) => setPrice(e.target.value)}
                          className="flex-1 px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-primary focus:border-primary text-sm font-bold disabled:opacity-50 disabled:bg-slate-100"
                          placeholder={templateConfig.pricePlaceholder || "0.00"}
                          required={priceType === "amount"}
                        />
                      </div>
                      {priceOptions.map((opt: any) => (
                        <label key={opt.id} className="flex items-center gap-2 cursor-pointer w-fit">
                          <input
                            type="radio"
                            name="priceType"
                            value={opt.option_key}
                            checked={priceType === opt.option_key}
                            onChange={() => {
                              setPriceType(opt.option_key);
                              setPrice("0");
                            }}
                            className="w-4 h-4 text-primary border-slate-300 focus:ring-primary"
                          />
                          <span className="text-sm font-bold text-slate-700">{opt.option_value}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  {/* Condition — only for relevant categories */}
                  {!templateConfig.hideCondition && (
                      <div>
                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">
                          Condition
                        </label>
                        <select
                          value={condition}
                          onChange={(e) => setCondition(e.target.value)}
                          className="w-full px-5 py-4 bg-slate-50 border-slate-100 rounded-xl focus:ring-primary focus:border-primary text-sm font-medium"
                        >
                          {category.startsWith("Vehicles") ? (
                            <>
                              <option>Excellent</option>
                              <option>Good</option>
                              <option>Fair</option>
                              <option>Parts Only</option>
                            </>
                          ) : (
                            <>
                              <option>New</option>
                              <option>Used - Like New</option>
                              <option>Used - Good</option>
                              <option>Used - Fair</option>
                              <option>For Parts</option>
                            </>
                          )}
                        </select>
                      </div>
                    )}
                </div>
              </div>
              <div className="pt-10 border-t border-slate-100 flex justify-between">
                <button
                  onClick={() => setStep(1)}
                  className="px-10 py-4 font-bold text-slate-400 hover:text-slate-600"
                >
                  Back
                </button>
                <button
                  disabled={(!templateConfig.hideTitle && !title) || (!templateConfig.hideDescription && !description) || (priceType === "amount" && !price && !templateConfig.hidePrice)}
                  onClick={() => setStep(3)}
                  className="bg-primary hover:bg-primary-hover text-white px-10 py-4 rounded-xl font-bold transition-all shadow-lg shadow-primary/20 flex items-center gap-2 disabled:opacity-50"
                >
                  Next Step{" "}
                  <span className="material-icons">chevron_right</span>
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="bg-white p-10 rounded-[2rem] border border-slate-200 shadow-sm space-y-10">
              <h2 className="text-2xl font-black">{isEditMode ? "Edit Media & Location" : "Media & Location"}</h2>

              <section>
                {/* Header + progress */}
                <div className="flex items-center justify-between mb-3">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">
                    Add Photos {templateConfig.photosRequired !== false ? '(Cover Photo Required)' : '(Optional)'}{" "}
                    {templateConfig.photosRequired !== false && <span className="text-red-500">*</span>}
                  </label>
                  <span
                    className={`text-xs font-black px-3 py-1 rounded-full ${
                      imagePreviews.filter((p) => p !== null).length > 0
                        ? "bg-green-100 text-green-600"
                        : "bg-amber-50 text-amber-600"
                    }`}
                  >
                    {imagePreviews.filter((p) => p !== null).length} / 10 photos
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-1.5 bg-slate-100 rounded-full mb-4 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${(imagePreviews.filter((p) => p !== null).length / 10) * 100}%`,
                      background:
                        imagePreviews[0] !== null ? "#22c55e" : "#f59e0b",
                    }}
                  />
                </div>

                {imageFiles[0] === null && imagePreviews[0] === null && (
                  <p className="text-xs text-amber-600 font-bold mb-4 flex items-center gap-1.5">
                    <span className="material-icons text-sm">info</span>
                    Cover photo is required to publish your ad.
                  </p>
                )}

                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                  {Array.from({ length: 10 }).map((_, index) => (
                    <div
                      key={index}
                      className={`relative w-full aspect-square border-2 border-dashed rounded-2xl flex flex-col items-center justify-center group hover:border-primary hover:bg-white transition-all overflow-hidden cursor-pointer ${
                        imagePreviews[index]
                          ? "border-green-400 bg-green-50"
                          : "border-slate-200 bg-slate-50"
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
                          {/* Green check badge */}
                          <div className="absolute bottom-2 left-2 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center shadow">
                            <span className="material-icons text-white text-[12px]">
                              check
                            </span>
                          </div>
                        </div>
                      ) : (
                        <>
                          <span className="material-icons text-3xl text-slate-300 group-hover:text-primary mb-1">
                            {index === 0 ? "add_a_photo" : "add"}
                          </span>
                          <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">
                            {index === 0 ? "Cover" : `Pic ${index + 1}`}
                          </span>
                          {index === 0 && (
                            <span className="text-[9px] text-red-400 font-bold mt-0.5">
                              Required
                            </span>
                          )}
                        </>
                      )}

                      {/* Delete button */}
                      {imagePreviews[index] && (
                        <button
                          className="absolute top-2 right-2 z-30 w-6 h-6 bg-white/90 rounded-full flex items-center justify-center text-red-500 hover:scale-110 shadow-sm transition-all"
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

              {!templateConfig.hideLocation && (
              <section>
                <div className="flex flex-col gap-1 mb-4">
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest">
                    Item Location
                  </label>
                  <p className="text-xs text-slate-400 font-medium">
                    Provide either a street address/city or a postal code. If you prefer to keep your exact home address private, you can enter just your city or postal code.
                  </p>
                </div>

                {/* Multi-city toggle — only for new ads */}
                {!isEditMode && (
                  <div className="mb-6">
                    <label className="flex items-center gap-3 cursor-pointer group w-fit select-none">
                      <div
                        className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${
                          postInMultipleCities
                            ? "bg-primary"
                            : "bg-slate-200 group-hover:bg-slate-300"
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
                            postInMultipleCities ? "translate-x-6" : "translate-x-0"
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
                        <span className="text-sm font-black text-slate-700">
                          Post in Multiple Cities
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">
                          Reach more buyers by posting your ad in multiple cities at once
                        </span>
                      </div>
                    </label>
                  </div>
                )}

                {/* MULTI-CITY MODE */}
                {!isEditMode && postInMultipleCities ? (
                  <div className="space-y-4 mb-6">
                    {/* City Search Input */}
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <span className="material-icons absolute left-4 top-3.5 text-primary">
                          add_location_alt
                        </span>
                        <input
                          value={citySearchQuery}
                          disabled={selectedCities.length >= 5}
                          onChange={(e) => {
                            setCitySearchQuery(e.target.value);
                            setShowCitySuggestions(true);
                          }}
                          onFocus={() => {
                            if (selectedCities.length < 5) setShowCitySuggestions(true);
                          }}
                          onBlur={() =>
                            setTimeout(() => setShowCitySuggestions(false), 200)
                          }
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              handleAddCustomCity(citySearchQuery);
                            }
                          }}
                          className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-primary focus:border-primary text-sm disabled:opacity-60 disabled:cursor-not-allowed"
                          placeholder={selectedCities.length >= 5 ? "Maximum 5 cities limit reached" : "Search and add cities (e.g. Toronto, Vancouver, Montreal...)"}
                          autoComplete="off"
                        />

                        {/* City Suggestions Dropdown */}
                        {showCitySuggestions && citySearchQuery.trim().length >= 1 && selectedCities.length < 5 && (
                          <div className="absolute top-14 left-0 w-full bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden">
                            {isSearchingCity ? (
                              <div className="p-4 text-xs font-bold text-slate-400 text-center flex items-center justify-center gap-2">
                                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                                Searching cities...
                              </div>
                            ) : citySearchSuggestions.length > 0 ? (
                              <ul>
                                {citySearchSuggestions.map((place, idx) => {
                                  const { mainText, secondaryText } = getGoogleStyleAddress(place);
                                  const cleanAddr = getCleanAddressString(place);
                                  const isAlreadyAdded = selectedCities.some(c => c.location.toLowerCase() === cleanAddr.toLowerCase());
                                  return (
                                    <li
                                      key={idx}
                                      onMouseDown={(e) => {
                                        e.preventDefault(); // Prevent onBlur on input
                                        if (!isAlreadyAdded) handleSelectCity(place);
                                      }}
                                      className={`px-4 py-3 border-b border-slate-50 last:border-0 flex items-start gap-3 transition-colors ${
                                        isAlreadyAdded
                                          ? "bg-green-50 cursor-default"
                                          : "hover:bg-slate-50 cursor-pointer"
                                      }`}
                                    >
                                      <span className={`material-icons text-lg mt-0.5 ${isAlreadyAdded ? "text-green-500" : "text-slate-300"}`}>
                                        {isAlreadyAdded ? "check_circle" : "place"}
                                      </span>
                                      <div className="flex-1">
                                        <p className="text-sm font-bold text-slate-700 leading-tight mb-0.5">
                                          {mainText}
                                        </p>
                                        <p className="text-xs text-slate-400 leading-tight">
                                          {secondaryText}
                                        </p>
                                      </div>
                                      {isAlreadyAdded && (
                                        <span className="text-[9px] font-black text-green-600 uppercase tracking-widest bg-green-100 px-2 py-1 rounded self-center">
                                          Added
                                        </span>
                                      )}
                                    </li>
                                  );
                                })}
                              </ul>
                            ) : (
                              <div className="p-4 text-xs font-bold text-slate-400 text-center">
                                No cities found. Try a different search term.
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      <button
                        type="button"
                        disabled={selectedCities.length >= 5 || !citySearchQuery.trim()}
                        onClick={() => handleAddCustomCity(citySearchQuery)}
                        className="px-6 bg-primary hover:bg-primary-hover text-white rounded-xl font-bold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Add
                      </button>
                    </div>

                    {/* Limit notification warning */}
                    {selectedCities.length >= 5 && (
                      <p className="text-xs font-bold text-amber-600 flex items-center gap-1">
                        <span className="material-icons text-sm">warning</span>
                        Maximum 5 cities limit reached for Multi-City posting.
                      </p>
                    )}

                    {/* Selected Cities Chips */}
                    {selectedCities.length > 0 ? (
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            Selected Cities ({selectedCities.length} / 5 max)
                          </span>
                          <button
                            type="button"
                            onClick={() => setSelectedCities([])}
                            className="text-[10px] font-bold text-red-500 hover:text-red-700 uppercase tracking-widest transition-colors"
                          >
                            Clear All
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {selectedCities.map((city, idx) => (
                            <div
                              key={idx}
                              className="flex items-center gap-2 bg-primary/10 text-primary pl-4 pr-2 py-2 rounded-full border border-primary/20 group hover:bg-primary/20 transition-all"
                            >
                              <span className="material-icons text-sm">location_on</span>
                              <span className="text-xs font-bold">{city.location}</span>
                              {city.postalCode && (
                                <span className="text-[9px] font-medium text-primary/60">
                                  ({city.postalCode})
                                </span>
                              )}
                              <button
                                type="button"
                                onClick={() => handleRemoveCity(idx)}
                                className="w-5 h-5 rounded-full bg-primary/10 hover:bg-red-500 hover:text-white text-primary flex items-center justify-center transition-all ml-1"
                              >
                                <span className="material-icons text-xs">close</span>
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="p-6 text-center bg-amber-50 rounded-xl border border-amber-200">
                        <span className="material-icons text-amber-500 text-2xl mb-2 block">add_location_alt</span>
                        <p className="text-xs font-bold text-amber-700">
                          Search and add at least one city above (up to 5 max) to continue.
                        </p>
                      </div>
                    )}

                    {/* Info banner */}
                    <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl border border-blue-200">
                      <span className="material-icons text-blue-500 text-lg mt-0.5">info</span>
                      <p className="text-xs text-blue-700 font-medium leading-relaxed">
                        You can select up to 5 cities. Your ad will be posted as a separate listing in each selected city, sharing the same details, images, and promotions. You can manage all copies from your profile.
                      </p>
                    </div>
                  </div>
                ) : (
                  /* SINGLE LOCATION MODE (original) */
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="relative">
                      <span className="material-icons absolute left-4 top-3.5 text-slate-400">
                        location_on
                      </span>
                      <input
                        value={location}
                        onChange={(e) => {
                          setLocation(e.target.value);
                          setShowSuggestions(true);
                        }}
                        onFocus={() => setShowSuggestions(true)}
                        onBlur={() =>
                          setTimeout(() => setShowSuggestions(false), 200)
                        }
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border-slate-100 rounded-xl focus:ring-primary focus:border-primary text-sm"
                        placeholder="Street address or City (e.g. Toronto, ON)"
                        autoComplete="off"
                      />

                      {/* Suggestions Dropdown */}
                      {showSuggestions && location.trim().length >= 1 && (
                        <div className="absolute top-14 left-0 w-full bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden">
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
                                    onMouseDown={(e) => {
                                      e.preventDefault(); // Prevent input from losing focus
                                      handleSelectLocation(place);
                                    }}
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
                    <div className="relative">
                      <span className="material-icons absolute left-4 top-3.5 text-slate-400">
                        markunread_mailbox
                      </span>
                      <input
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border-slate-100 rounded-xl focus:ring-primary focus:border-primary text-sm"
                        placeholder="Postal Code (e.g. M5C 1X6)"
                      />
                    </div>
                  </div>
                )}
              </section>
              )}

              <section>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-4">
                  Contact Details
                </label>
                <div className="space-y-6">
                  {/* Phone Toggle Option */}
                  {!templateConfig.hidePhone && (
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer group w-fit">
                      <div
                        className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                          includePhone ? "bg-primary border-primary" : "bg-white border-slate-300 group-hover:border-primary"
                        }`}
                      >
                        {includePhone && (
                          <span className="material-icons text-white text-[14px]">
                            check
                          </span>
                        )}
                      </div>
                      <span className="text-sm font-bold text-slate-700 select-none">
                        Show Phone Number on Ad
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
                      <div className="relative animate-fadeIn max-w-md">
                        <span className="material-icons absolute left-4 top-3.5 text-slate-400">
                          phone
                        </span>
                        <input
                          type="tel"
                          value={contactPhone}
                          onChange={(e) => setContactPhone(e.target.value)}
                          className="w-full pl-12 pr-4 py-4 bg-slate-50 border-slate-100 rounded-xl focus:ring-primary focus:border-primary text-sm font-medium"
                          placeholder="Contact Phone Number (e.g. 416-555-0199)"
                        />
                      </div>
                    )}
                  </div>
                  )}
                </div>
              </section>

              {!templateConfig.hideSocialLinks && (
              <section className="pt-6 border-t border-slate-100">
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-4">
                  Social Media Links (Optional)
                </label>
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                      <span className="material-icons text-red-500 text-sm">play_circle</span>
                      YouTube Video Link
                    </label>
                    <input
                      type="url"
                      value={youtubeLink}
                      onChange={(e) => setYoutubeLink(e.target.value)}
                      className="w-full px-5 py-4 bg-slate-50 border-slate-100 rounded-xl focus:ring-primary focus:border-primary text-sm font-medium"
                      placeholder="e.g. https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                    />
                    <p className="text-[10px] text-slate-400 mt-1 font-medium">
                      Add a YouTube video walkthrough of your item/property/service to attract more interest.
                    </p>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                      <span className="material-icons text-blue-600 text-sm">facebook</span>
                      Facebook Page or Listing Link
                    </label>
                    <input
                      type="url"
                      value={facebookLink}
                      onChange={(e) => setFacebookLink(e.target.value)}
                      className="w-full px-5 py-4 bg-slate-50 border-slate-100 rounded-xl focus:ring-primary focus:border-primary text-sm font-medium"
                      placeholder="e.g. https://www.facebook.com/yourpage"
                    />
                    <p className="text-[10px] text-slate-400 mt-1 font-medium">
                      Provide a link to your Facebook page or listing for buyer credibility.
                    </p>
                  </div>
                </div>
              </section>
              )}

              <section className="pt-8 border-t border-slate-100">
                {/* Section Header */}
                <div className="mb-2">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                      <span className="material-icons text-white text-lg">campaign</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-slate-900 tracking-tight">Promote Your Ad <span className="text-sm font-medium text-slate-400">(Optional)</span></h3>
                    </div>
                  </div>
                  <p className="text-sm text-slate-500 font-medium ml-[52px]">
                    Increase your listing visibility and sell faster by selecting one or more promotional options.
                  </p>
                </div>

                {/* Promotion Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6">

                  {/* Top Ad Card */}
                  <div
                    onClick={() => setPromotionData(prev => ({ ...prev, is_top_ad: !prev.is_top_ad }))}
                    className={`relative flex flex-col p-6 rounded-2xl cursor-pointer transition-all duration-200 group border-2 ${
                      promotionData.is_top_ad
                        ? "border-blue-500 bg-blue-50/50 shadow-lg shadow-blue-500/10"
                        : "border-slate-100 bg-white hover:border-slate-200 hover:shadow-md"
                    }`}
                  >
                    {/* Most Popular Badge */}
                    <div className="absolute -top-3 right-5">
                      <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-blue-600 to-blue-500 text-white px-3 py-1 rounded-full shadow-md shadow-blue-500/30">
                        <span className="material-icons text-[10px]">star</span> Most Popular
                      </span>
                    </div>

                    <div className="flex items-start gap-4">
                      {/* Checkbox */}
                      <div className="pt-0.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={promotionData.is_top_ad}
                          onChange={(e) =>
                            setPromotionData({
                              ...promotionData,
                              is_top_ad: e.target.checked,
                            })
                          }
                          className="w-5 h-5 text-blue-600 border-2 border-slate-300 rounded-md focus:ring-blue-500 focus:ring-offset-0 transition-all duration-200 cursor-pointer checked:border-blue-600"
                        />
                      </div>
                      {/* Icon */}
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-all duration-200 ${
                        promotionData.is_top_ad ? "bg-blue-100" : "bg-slate-50 group-hover:bg-slate-100"
                      }`}>
                        <span className="text-2xl leading-none">&#11088;</span>
                      </div>
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="text-sm font-black text-slate-900">Top Ad</span>
                          <span className="inline-flex items-center text-[11px] font-bold bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 px-2.5 py-0.5 rounded-lg">
                            ${calculatePrice('top_ad', promotionData.top_ad_duration, 9.99).toFixed(2)}
                          </span>
                          <select 
                            value={promotionData.top_ad_duration}
                            onChange={(e) => setPromotionData({...promotionData, top_ad_duration: Number(e.target.value)})}
                            onClick={(e) => e.stopPropagation()}
                            className="text-[10px] font-bold text-slate-600 bg-white border border-slate-200 px-2 py-0.5 rounded-md focus:ring-2 focus:border-blue-500 cursor-pointer shadow-xs"
                          >
                            {getPromotionOptions('top_ad', 9.99).map(opt => (
                              <option key={opt.duration_days} value={opt.duration_days}>
                                {opt.duration_days} Days (${Number(opt.price).toFixed(2)})
                              </option>
                            ))}
                          </select>
                        </div>
                        <p className="text-xs text-slate-500 font-medium leading-relaxed mb-3">
                          Keep your listing at the top of category search results for {promotionData.top_ad_duration} days.
                        </p>
                        <div className="flex flex-wrap gap-x-4 gap-y-1">
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                            <span className="material-icons text-[11px]">check_circle</span> Higher visibility
                          </span>
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                            <span className="material-icons text-[11px]">check_circle</span> More impressions
                          </span>
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                            <span className="material-icons text-[11px]">check_circle</span> Higher click-through
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Highlighted Card */}
                  <div
                    onClick={() => setPromotionData(prev => ({ ...prev, is_highlighted: !prev.is_highlighted }))}
                    className={`relative flex flex-col p-6 rounded-2xl cursor-pointer transition-all duration-200 group border-2 ${
                      promotionData.is_highlighted
                        ? "border-blue-500 bg-blue-50/50 shadow-lg shadow-blue-500/10"
                        : "border-slate-100 bg-white hover:border-slate-200 hover:shadow-md"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="pt-0.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={promotionData.is_highlighted}
                          onChange={(e) =>
                            setPromotionData({
                              ...promotionData,
                              is_highlighted: e.target.checked,
                            })
                          }
                          className="w-5 h-5 text-blue-600 border-2 border-slate-300 rounded-md focus:ring-blue-500 focus:ring-offset-0 transition-all duration-200 cursor-pointer checked:border-blue-600"
                        />
                      </div>
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-all duration-200 ${
                        promotionData.is_highlighted ? "bg-yellow-100" : "bg-slate-50 group-hover:bg-slate-100"
                      }`}>
                        <span className="text-2xl leading-none">&#128310;</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="text-sm font-black text-slate-900">Highlighted</span>
                          <span className="inline-flex items-center text-[11px] font-bold bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 px-2.5 py-0.5 rounded-lg">
                            ${calculatePrice('highlighted', promotionData.highlighted_duration, 4.99).toFixed(2)}
                          </span>
                          <select 
                            value={promotionData.highlighted_duration}
                            onChange={(e) => setPromotionData({...promotionData, highlighted_duration: Number(e.target.value)})}
                            onClick={(e) => e.stopPropagation()}
                            className="text-[10px] font-bold text-slate-600 bg-white border border-slate-200 px-2 py-0.5 rounded-md focus:ring-2 focus:border-blue-500 cursor-pointer shadow-xs"
                          >
                            {getPromotionOptions('highlighted', 4.99).map(opt => (
                              <option key={opt.duration_days} value={opt.duration_days}>
                                {opt.duration_days} Days (${Number(opt.price).toFixed(2)})
                              </option>
                            ))}
                          </select>
                        </div>
                        <p className="text-xs text-slate-500 font-medium leading-relaxed mb-3">
                          Highlight your listing with a premium background color to attract more attention.
                        </p>
                        <div className="flex flex-wrap gap-x-4 gap-y-1">
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                            <span className="material-icons text-[11px]">check_circle</span> Yellow highlighted card
                          </span>
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                            <span className="material-icons text-[11px]">check_circle</span> More clicks
                          </span>
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                            <span className="material-icons text-[11px]">check_circle</span> Better visibility
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Urgent Card */}
                  <div
                    onClick={() => setPromotionData(prev => ({ ...prev, is_urgent: !prev.is_urgent }))}
                    className={`relative flex flex-col p-6 rounded-2xl cursor-pointer transition-all duration-200 group border-2 ${
                      promotionData.is_urgent
                        ? "border-blue-500 bg-blue-50/50 shadow-lg shadow-blue-500/10"
                        : "border-slate-100 bg-white hover:border-slate-200 hover:shadow-md"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="pt-0.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={promotionData.is_urgent}
                          onChange={(e) =>
                            setPromotionData({
                              ...promotionData,
                              is_urgent: e.target.checked,
                            })
                          }
                          className="w-5 h-5 text-blue-600 border-2 border-slate-300 rounded-md focus:ring-blue-500 focus:ring-offset-0 transition-all duration-200 cursor-pointer checked:border-blue-600"
                        />
                      </div>
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-all duration-200 ${
                        promotionData.is_urgent ? "bg-red-100" : "bg-slate-50 group-hover:bg-slate-100"
                      }`}>
                        <span className="text-2xl leading-none">&#128293;</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="text-sm font-black text-slate-900">Urgent</span>
                          <span className="inline-flex items-center text-[11px] font-bold bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 px-2.5 py-0.5 rounded-lg">
                            ${calculatePrice('urgent', promotionData.urgent_duration, 5.99).toFixed(2)}
                          </span>
                          <select 
                            value={promotionData.urgent_duration}
                            onChange={(e) => setPromotionData({...promotionData, urgent_duration: Number(e.target.value)})}
                            onClick={(e) => e.stopPropagation()}
                            className="text-[10px] font-bold text-slate-600 bg-white border border-slate-200 px-2 py-0.5 rounded-md focus:ring-2 focus:border-blue-500 cursor-pointer shadow-xs"
                          >
                            {getPromotionOptions('urgent', 5.99).map(opt => (
                              <option key={opt.duration_days} value={opt.duration_days}>
                                {opt.duration_days} Days (${Number(opt.price).toFixed(2)})
                              </option>
                            ))}
                          </select>
                        </div>
                        <p className="text-xs text-slate-500 font-medium leading-relaxed mb-3">
                          Display a red &quot;URGENT&quot; badge to encourage faster buyer engagement.
                        </p>
                        <div className="flex flex-wrap gap-x-4 gap-y-1">
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                            <span className="material-icons text-[11px]">check_circle</span> Urgent badge
                          </span>
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                            <span className="material-icons text-[11px]">check_circle</span> Increased trust
                          </span>
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                            <span className="material-icons text-[11px]">check_circle</span> Higher response rate
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Home Gallery Card */}
                  <div
                    onClick={() => setPromotionData(prev => ({ ...prev, is_home_gallery: !prev.is_home_gallery }))}
                    className={`relative flex flex-col p-6 rounded-2xl cursor-pointer transition-all duration-200 group border-2 ${
                      promotionData.is_home_gallery
                        ? "border-blue-500 bg-blue-50/50 shadow-lg shadow-blue-500/10"
                        : "border-slate-100 bg-white hover:border-slate-200 hover:shadow-md"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="pt-0.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={promotionData.is_home_gallery}
                          onChange={(e) =>
                            setPromotionData({
                              ...promotionData,
                              is_home_gallery: e.target.checked,
                            })
                          }
                          className="w-5 h-5 text-blue-600 border-2 border-slate-300 rounded-md focus:ring-blue-500 focus:ring-offset-0 transition-all duration-200 cursor-pointer checked:border-blue-600"
                        />
                      </div>
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-all duration-200 ${
                        promotionData.is_home_gallery ? "bg-blue-100" : "bg-slate-50 group-hover:bg-slate-100"
                      }`}>
                        <span className="text-2xl leading-none">&#127968;</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="text-sm font-black text-slate-900">Home Page</span>
                          <span className="inline-flex items-center text-[11px] font-bold bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 px-2.5 py-0.5 rounded-lg">
                            ${calculatePrice('home_gallery', promotionData.home_gallery_duration, 14.99).toFixed(2)}
                          </span>
                          <select 
                            value={promotionData.home_gallery_duration}
                            onChange={(e) => setPromotionData({...promotionData, home_gallery_duration: Number(e.target.value)})}
                            onClick={(e) => e.stopPropagation()}
                            className="text-[10px] font-bold text-slate-600 bg-white border border-slate-200 px-2 py-0.5 rounded-md focus:ring-2 focus:border-blue-500 cursor-pointer shadow-xs"
                          >
                            {getPromotionOptions('home_gallery', 14.99).map(opt => (
                              <option key={opt.duration_days} value={opt.duration_days}>
                                {opt.duration_days} Days (${Number(opt.price).toFixed(2)})
                              </option>
                            ))}
                          </select>
                        </div>
                        <p className="text-xs text-slate-500 font-medium leading-relaxed mb-3">
                          Feature your listing on the homepage gallery for maximum exposure.
                        </p>
                        <div className="flex flex-wrap gap-x-4 gap-y-1">
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                            <span className="material-icons text-[11px]">check_circle</span> Homepage placement
                          </span>
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                            <span className="material-icons text-[11px]">check_circle</span> Large featured card
                          </span>
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                            <span className="material-icons text-[11px]">check_circle</span> Maximum impressions
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Promotion Summary */}
                {(promotionData.is_top_ad || promotionData.is_highlighted || promotionData.is_urgent || promotionData.is_home_gallery) && (
                  <div className="mt-6 bg-slate-50 rounded-2xl border border-slate-100 p-6 transition-all duration-200">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="material-icons text-blue-600 text-lg">receipt_long</span>
                      <h4 className="text-sm font-black text-slate-900">Promotion Summary</h4>
                    </div>
                    <div className="space-y-2.5">
                      {promotionData.is_top_ad && (
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-slate-600 font-medium flex items-center gap-2">
                            <span className="text-base leading-none">&#11088;</span> Top Ad <span className="text-xs text-slate-400">({promotionData.top_ad_duration} days)</span>
                          </span>
                          <span className="font-bold text-slate-800">${calculatePrice('top_ad', promotionData.top_ad_duration, 9.99).toFixed(2)}</span>
                        </div>
                      )}
                      {promotionData.is_highlighted && (
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-slate-600 font-medium flex items-center gap-2">
                            <span className="text-base leading-none">&#128310;</span> Highlighted <span className="text-xs text-slate-400">({promotionData.highlighted_duration} days)</span>
                          </span>
                          <span className="font-bold text-slate-800">${calculatePrice('highlighted', promotionData.highlighted_duration, 4.99).toFixed(2)}</span>
                        </div>
                      )}
                      {promotionData.is_urgent && (
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-slate-600 font-medium flex items-center gap-2">
                            <span className="text-base leading-none">&#128293;</span> Urgent <span className="text-xs text-slate-400">({promotionData.urgent_duration} days)</span>
                          </span>
                          <span className="font-bold text-slate-800">${calculatePrice('urgent', promotionData.urgent_duration, 5.99).toFixed(2)}</span>
                        </div>
                      )}
                      {promotionData.is_home_gallery && (
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-slate-600 font-medium flex items-center gap-2">
                            <span className="text-base leading-none">&#127968;</span> Home Page <span className="text-xs text-slate-400">({promotionData.home_gallery_duration} days)</span>
                          </span>
                          <span className="font-bold text-slate-800">${calculatePrice('home_gallery', promotionData.home_gallery_duration, 14.99).toFixed(2)}</span>
                        </div>
                      )}
                      {(() => {
                        const subtotal = (
                          (promotionData.is_top_ad ? calculatePrice('top_ad', promotionData.top_ad_duration, 9.99) : 0) +
                          (promotionData.is_highlighted ? calculatePrice('highlighted', promotionData.highlighted_duration, 4.99) : 0) +
                          (promotionData.is_urgent ? calculatePrice('urgent', promotionData.urgent_duration, 5.99) : 0) +
                          (promotionData.is_home_gallery ? calculatePrice('home_gallery', promotionData.home_gallery_duration, 14.99) : 0)
                        );
                        const tax = Math.round(subtotal * 0.13 * 100) / 100;
                        const total = Math.round((subtotal + tax) * 100) / 100;
                        return (
                          <div className="border-t border-slate-200 pt-3 mt-3 space-y-2">
                            <div className="flex justify-between items-center text-sm">
                              <span className="text-slate-600 font-medium">Subtotal</span>
                              <span className="font-bold text-slate-800">${subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                              <span className="text-slate-600 font-medium">Tax (13%)</span>
                              <span className="font-bold text-slate-800">${tax.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm pt-2 border-t border-slate-200">
                              <span className="text-sm font-black text-slate-900">Total</span>
                              <span className="text-lg font-black text-blue-600">${total.toFixed(2)}</span>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                )}
              </section>

              <div className="pt-10 border-t border-slate-100 flex justify-between items-center">
                <button
                  onClick={() => setStep(2)}
                  className="px-10 py-4 font-bold text-slate-400 hover:text-slate-600"
                >
                  Back
                </button>
                <div className="flex flex-col items-end gap-2">
                  {templateConfig.photosRequired !== false && imageFiles[0] === null && imagePreviews[0] === null && (
                    <p className="text-xs text-red-500 font-bold">
                      Cover photo is required
                    </p>
                  )}
                  <button
                    disabled={
                      (templateConfig.hideLocation ? false : (postInMultipleCities ? selectedCities.length === 0 : (!location && !postalCode))) ||
                      isPublishing ||
                      (templateConfig.photosRequired !== false && imageFiles[0] === null && imagePreviews[0] === null)
                    }
                    onClick={handlePublish}
                    className="bg-primary hover:bg-primary-hover text-white px-10 py-4 rounded-xl font-bold transition-all shadow-lg shadow-primary/20 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isPublishing ? (isEditMode ? "Saving..." : "Publishing...") : (isEditMode ? "Save Changes" : "Publish Ad")}{" "}
                    <span className="material-icons">check</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Info */}
        <aside className="lg:col-span-4 space-y-8">
          <div className="bg-primary/5 rounded-[2rem] border border-primary/20 p-8">
            <h3 className="font-black mb-6 flex items-center gap-2 text-primary uppercase tracking-widest text-sm">
              <span className="material-icons">lightbulb</span> Tips for a Great
              Ad
            </h3>
            <ul className="space-y-8">
              {[
                {
                  title: "Be specific",
                  desc: "Include brand, model, and dimensions to help buyers find your item.",
                },
                {
                  title: "Price it right",
                  desc: "Research similar items to stay competitive and sell faster.",
                },
                {
                  title: "Mention defects",
                  desc: "Honesty builds trust. Highlight any scratches or repairs needed.",
                },
              ].map((tip, i) => (
                <li key={i} className="flex gap-4">
                  <div className="w-7 h-7 bg-primary text-white text-xs font-bold rounded-full flex items-center justify-center flex-shrink-0">
                    {i + 1}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm mb-1">
                      {tip.title}
                    </h4>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      {tip.desc}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
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

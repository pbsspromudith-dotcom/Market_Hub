import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { trackListingSubmission } from "../analytics";
import MonerisPayModal from "../components/MonerisPayModal";
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
    return "e.g. Neighborhood Garage Sale this Saturday / Lost Golden Retriever";
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
  const navigate = useNavigate();

  const [isEditMode, setIsEditMode] = useState(false);
  const [loadingEditData, setLoadingEditData] = useState(false);

  // State for form
  const [category, setCategory] = useState("");

  // Promotion selection state
  const [promotionData, setPromotionData] = useState({
    is_top_ad: false,
    is_highlighted: false,
    is_urgent: false,
    is_home_gallery: false,
  });

  // Moneris Checkout payment state
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [payTicket, setPayTicket] = useState("");
  const [payAmount, setPayAmount] = useState(0);
  const [payEnvironment, setPayEnvironment] = useState("qa");
  const [createdListingId, setCreatedListingId] = useState<number | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [priceType, setPriceType] = useState("amount");
  const [priceOptions, setPriceOptions] = useState<any[]>([]);
  const [location, setLocation] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [contactEmail, setContactEmail] = useState("");
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
  const [imageFiles, setImageFiles] = useState<(File | null)[]>(
    Array(10).fill(null),
  );
  const [imagePreviews, setImagePreviews] = useState<(string | null)[]>(
    Array(10).fill(null),
  );
  const [isPublishing, setIsPublishing] = useState(false);
  const [dbOptions, setDbOptions] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/options/read.php")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          setDbOptions(data.data);
        }
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    fetch("/api/options/read.php?type=price_option")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          setPriceOptions(data.data);
        }
      })
      .catch(console.error);
  }, []);

  const handleReset = () => {
    if (window.confirm("Are you sure you want to clear the entire form?")) {
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
      setCarMake("");
      setCarModel("");
      setCarYear("");
      setCarTransmission("");
      setCarFuelType("");
      setCarMileage("");
      setCarVIN("");
      setCarTrim("");
      setCarBodyType("");
      setCarDrivetrain("");
      setCarColor("");
      setCarDoors("");
      setCarSeatingCapacity("");
      setCarFeatures([]);
      setYoutubeLink("");
      setFacebookLink("");
      setImageFiles(Array(10).fill(null));
      setImagePreviews(Array(10).fill(null));
    }
  };

  const [locationSuggestions, setLocationSuggestions] = useState<any[]>([]);
  const [isSearchingLocation, setIsSearchingLocation] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    if (location.trim().length > 2 && showSuggestions) {
      const delayFn = setTimeout(() => {
        setIsSearchingLocation(true);
        fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(location)}&countrycodes=ca&format=json&addressdetails=1&limit=5`,
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
  }, [location, showSuggestions]);

  const handleSelectLocation = (place: any) => {
    const cleanAddr = getCleanAddressString(place);
    setLocation(cleanAddr);
    if (place.address && place.address.postcode) {
      setPostalCode(place.address.postcode);
    }
    setShowSuggestions(false);
  };

  const [categoriesTree, setCategoriesTree] = useState<any[]>([]);
  const [categoryPath, setCategoryPath] = useState<any[]>([]);
  const [dynamicAttributesList, setDynamicAttributesList] = useState<any[]>([]);
  const [dynamicAttributesValues, setDynamicAttributesValues] = useState<
    Record<string, string>
  >({});

  useEffect(() => {
    fetch("/api/categories/read.php")
      .then((res) => res.json())
      .then((res) => {
        if (res.success && Array.isArray(res.data)) {
          setCategoriesTree(res.data);
        }
      })
      .catch((err) => console.error("Error loading categories", err));
  }, []);

  const queryParams = new URLSearchParams(window.location.search);
  const editId = queryParams.get("edit");

  useEffect(() => {
    if (editId && categoriesTree.length > 0) {
      setLoadingEditData(true);
      fetch(`/api/listings/read_single.php?id=${editId}`)
        .then((res) => res.json())
        .then((l) => {
          if (l.error) {
            alert("Listing not found or error loading listing.");
            navigate("/profile");
            return;
          }
          
          // Verify owner or admin status
          const userStr = localStorage.getItem("user");
          const currentUser = userStr ? JSON.parse(userStr) : null;
          if (!currentUser || (currentUser.id !== l.user_id && !currentUser.isAdmin && currentUser.role !== "admin")) {
            alert("You are not authorized to edit this ad.");
            navigate("/profile");
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
                    features.push(...val.split(",").map(f => f.trim()));
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
            
            // Set condition specifically if it exists in parsed attributes
            if (attrVals["Condition"]) {
              setCondition(attrVals["Condition"]);
            }
          }
        })
        .catch((err) => {
          console.error("Error fetching listing details:", err);
          alert("Error loading listing details.");
          navigate("/profile");
        })
        .finally(() => setLoadingEditData(false));
    }
  }, [editId, categoriesTree, navigate]);


  useEffect(() => {
    if (category) {
      fetch(
        `/api/categories/attributes.php?category_name=${encodeURIComponent(category)}`,
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
  }, [category]);

  const handleCategoryClick = (cat: any) => {
    const newPath = [...categoryPath, cat];
    setCategoryPath(newPath);
    if (!cat.children || cat.children.length === 0) {
      setCategory(newPath.map((c) => c.CategoryName).join(" > "));
    }
  };

  const handleCategoryBack = () => {
    const newPath = categoryPath.slice(0, -1);
    setCategoryPath(newPath);
    setCategory("");
  };

  const handleCategoryReset = () => {
    setCategoryPath([]);
    setCategory("");
  };

  const currentLevelCategories =
    categoryPath.length === 0
      ? categoriesTree
      : categoryPath[categoryPath.length - 1].children || [];

  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      // Get user from local storage
      const userStr = localStorage.getItem("user");
      const user = userStr ? JSON.parse(userStr) : null;
      const userId = user ? user.id : 1;

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
        const uploadRes = await fetch("/api/upload.php", {
          method: "POST",
          body: formData,
        });
        const uploadData = await uploadRes.json();
        if (uploadData.success) {
          uploadedUrls = uploadData.imageUrls;
        }
      }

      // 2. Reassemble the final images list (new uploaded + unchanged existing)
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

      let finalDescription = description;
      const attrDetails = [];
      for (const [key, val] of Object.entries(dynamicAttributesValues)) {
        if (val) {
          attrDetails.push(`${key}: ${val}`);
        }
      }
      if (carFeatures.length > 0 && category.startsWith("Vehicles")) {
        attrDetails.push(`Features: ${carFeatures.join(", ")}`);
      }
      if (
        !category.startsWith("Jobs") &&
        !category.startsWith("Real Estate") &&
        !category.startsWith("Community") &&
        !category.startsWith("Local Services") &&
        !category.startsWith("Events")
      ) {
        attrDetails.push(`Condition: ${condition}`);
      }
      if (attrDetails.length > 0) {
        finalDescription = attrDetails.join("\n") + "\n\n" + description;
      }

      const urlEndpoint = isEditMode ? "/api/listings/update.php" : "/api/listings/create.php";
      
      const payload: any = {
        title,
        price: priceType === "amount" ? (parseFloat(price) || 0) : 0,
        price_type: priceType,
        category: category || "Other",
        location: location || "Unknown",
        description: finalDescription,
        image: imageUrls,
        user_id: userId,
        contact_email: contactEmail,
        contact_phone: contactPhone,
        postal_code: postalCode,
        youtube_link: youtubeLink,
        facebook_link: facebookLink,
      };

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
          alert("Ad updated successfully!");
          navigate("/item/" + editId);
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

        if (hasPromotions) {
          setCreatedListingId(data.id);

          const preloadRes = await fetch("/api/payments/preload.php", {
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
            alert(
              "Ad was published successfully, but we could not initialize the promotion payment: " +
                (preloadData.message || "Unknown error"),
            );
            navigate("/item/" + data.id);
          }
        } else {
          navigate("/item/" + data.id);
        }
      } else {
        alert("Failed to publish");
      }
    } catch (err) {
      console.error(err);
      alert("Error publishing");
    } finally {
      setIsPublishing(false);
    }
  };

  const handlePaymentSuccess = (receiptId: string) => {
    setIsPayModalOpen(false);
    alert(
      "Payment approved! Your ad has been published and successfully promoted.",
    );
    navigate("/item/" + createdListingId);
  };

  const handlePaymentCancel = () => {
    setIsPayModalOpen(false);
    alert(
      "Payment was not completed. Your ad is published, but promotions were not applied. You can promote it anytime from your profile.",
    );
    navigate("/item/" + createdListingId);
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

                    {category.startsWith("Vehicles") && (
                      <div className="pt-4 mt-2 border-t border-primary/10">
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">
                          Features
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {CAR_FEATURES_LIST.map((feature) => (
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
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">
                      Price {category.startsWith("Jobs") ? "/ Year" : ""}
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
                          placeholder={
                            category.startsWith("Jobs")
                              ? "Annual salary or 0 for negotiable"
                              : "0.00"
                          }
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
                  {!category.startsWith("Jobs") &&
                    !category.startsWith("Real Estate") &&
                    !category.startsWith("Community") &&
                    !category.startsWith("Local Services") &&
                    !category.startsWith("Events") && (
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
                  disabled={!title || !description || (priceType === "amount" && !price)}
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
                    Add Photos (Cover Photo Required){" "}
                    <span className="text-red-500">*</span>
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

              <section>
                <div className="flex flex-col gap-1 mb-4">
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest">
                    Item Location
                  </label>
                  <p className="text-xs text-slate-400 font-medium">
                    Provide either a street address/city or a postal code. If you prefer to keep your exact home address private, you can enter just your city or postal code.
                  </p>
                </div>
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
                    {showSuggestions && location.length > 2 && (
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
              </section>

              <section>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-4">
                  Contact Details
                </label>
                <div className="space-y-6">
                  {/* Phone Toggle Option */}
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
                </div>
              </section>

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

              <section className="pt-6 border-t border-slate-100">
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-4">
                  Promote Your Ad (Optional)
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="flex items-start gap-4 p-4 border border-slate-200 rounded-2xl cursor-pointer hover:border-primary transition-colors bg-slate-50">
                    <div className="mt-0.5">
                      <input
                        type="checkbox"
                        checked={promotionData.is_top_ad}
                        onChange={(e) =>
                          setPromotionData({
                            ...promotionData,
                            is_top_ad: e.target.checked,
                          })
                        }
                        className="w-5 h-5 text-primary border-slate-300 rounded focus:ring-primary"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-black text-slate-800">
                          Top Ad
                        </span>
                        <span className="text-[10px] font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded uppercase tracking-widest">
                          $9.99
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-medium">
                        Keep your ad at the top of the category listings for 7
                        days.
                      </p>
                    </div>
                  </label>

                  <label className="flex items-start gap-4 p-4 border border-slate-200 rounded-2xl cursor-pointer hover:border-primary transition-colors bg-slate-50">
                    <div className="mt-0.5">
                      <input
                        type="checkbox"
                        checked={promotionData.is_highlighted}
                        onChange={(e) =>
                          setPromotionData({
                            ...promotionData,
                            is_highlighted: e.target.checked,
                          })
                        }
                        className="w-5 h-5 text-primary border-slate-300 rounded focus:ring-primary"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-black text-slate-800">
                          Highlighted
                        </span>
                        <span className="text-[10px] font-bold bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded uppercase tracking-widest">
                          $4.99
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-medium">
                        Make your ad stand out with a bright highlighted
                        background.
                      </p>
                    </div>
                  </label>

                  <label className="flex items-start gap-4 p-4 border border-slate-200 rounded-2xl cursor-pointer hover:border-primary transition-colors bg-slate-50">
                    <div className="mt-0.5">
                      <input
                        type="checkbox"
                        checked={promotionData.is_urgent}
                        onChange={(e) =>
                          setPromotionData({
                            ...promotionData,
                            is_urgent: e.target.checked,
                          })
                        }
                        className="w-5 h-5 text-primary border-slate-300 rounded focus:ring-primary"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-black text-slate-800">
                          Urgent
                        </span>
                        <span className="text-[10px] font-bold bg-red-100 text-red-700 px-2 py-0.5 rounded uppercase tracking-widest">
                          $5.99
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-medium">
                        Add an eye-catching 'Urgent' badge to sell your item
                        faster.
                      </p>
                    </div>
                  </label>

                  <label className="flex items-start gap-4 p-4 border border-slate-200 rounded-2xl cursor-pointer hover:border-primary transition-colors bg-slate-50">
                    <div className="mt-0.5">
                      <input
                        type="checkbox"
                        checked={promotionData.is_home_gallery}
                        onChange={(e) =>
                          setPromotionData({
                            ...promotionData,
                            is_home_gallery: e.target.checked,
                          })
                        }
                        className="w-5 h-5 text-primary border-slate-300 rounded focus:ring-primary"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-black text-slate-800">
                          Home Gallery
                        </span>
                        <span className="text-[10px] font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded uppercase tracking-widest">
                          $14.99
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-medium">
                        Feature your ad directly on the HitAds homepage gallery.
                      </p>
                    </div>
                  </label>
                </div>
              </section>

              <div className="pt-10 border-t border-slate-100 flex justify-between items-center">
                <button
                  onClick={() => setStep(2)}
                  className="px-10 py-4 font-bold text-slate-400 hover:text-slate-600"
                >
                  Back
                </button>
                <div className="flex flex-col items-end gap-2">
                  {imageFiles[0] === null && imagePreviews[0] === null && (
                    <p className="text-xs text-red-500 font-bold">
                      Cover photo is required
                    </p>
                  )}
                  <button
                    disabled={
                      (!location && !postalCode) || isPublishing || (imageFiles[0] === null && imagePreviews[0] === null)
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

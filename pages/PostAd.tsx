import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
const CAR_FEATURES_LIST = [
  'Alloy Wheels', 'Backup Camera',
  'Bluetooth', 'Leather Seats',
  'Cruise Control', 'Remote Start',
  'Navigation System', 'Blind Spot Monitor',
  'Sunroof/Moonroof', 'Heated Seats'
];

const PostAd: React.FC = () => {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  // State for form
  const [category, setCategory] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [location, setLocation] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [carMake, setCarMake] = useState('');
  const [carModel, setCarModel] = useState('');
  const [carYear, setCarYear] = useState('');
  const [carTransmission, setCarTransmission] = useState('');
  const [carFuelType, setCarFuelType] = useState('');
  const [carMileage, setCarMileage] = useState('');
  const [carVIN, setCarVIN] = useState('');
  const [carTrim, setCarTrim] = useState('');
  const [carBodyType, setCarBodyType] = useState('');
  const [carDrivetrain, setCarDrivetrain] = useState('');
  const [carColor, setCarColor] = useState('');
  const [carDoors, setCarDoors] = useState('');
  const [carSeatingCapacity, setCarSeatingCapacity] = useState('');
  const [carFeatures, setCarFeatures] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<(File | null)[]>([null, null, null, null, null]);
  const [imagePreviews, setImagePreviews] = useState<(string | null)[]>([null, null, null, null, null]);
  const [isPublishing, setIsPublishing] = useState(false);

  const handleReset = () => {
    if (window.confirm('Are you sure you want to clear the entire form?')) {
      setStep(1);
      setCategory('');
      setTitle('');
      setDescription('');
      setPrice('');
      setLocation('');
      setPostalCode('');
      setContactEmail('');
      setContactPhone('');
      setCarMake('');
      setCarModel('');
      setCarYear('');
      setCarTransmission('');
      setCarFuelType('');
      setCarMileage('');
      setCarVIN('');
      setCarTrim('');
      setCarBodyType('');
      setCarDrivetrain('');
      setCarColor('');
      setCarDoors('');
      setCarSeatingCapacity('');
      setCarFeatures([]);
      setImageFiles([null, null, null, null, null]);
      setImagePreviews([null, null, null, null, null]);
    }
  };

  const [locationSuggestions, setLocationSuggestions] = useState<any[]>([]);
  const [isSearchingLocation, setIsSearchingLocation] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    if (location.trim().length > 2 && showSuggestions) {
      const delayFn = setTimeout(() => {
        setIsSearchingLocation(true);
        fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(location)}&countrycodes=ca&format=json&addressdetails=1&limit=5`)
          .then(res => res.json())
          .then(data => setLocationSuggestions(data))
          .catch(console.error)
          .finally(() => setIsSearchingLocation(false));
      }, 500);
      return () => clearTimeout(delayFn);
    } else {
      setLocationSuggestions([]);
    }
  }, [location, showSuggestions]);

  const handleSelectLocation = (place: any) => {
    setLocation(place.display_name);
    if (place.address && place.address.postcode) {
      setPostalCode(place.address.postcode);
    }
    setShowSuggestions(false);
  };

  const categoriesData = [
    { name: 'Cars', icon: 'directions_car' },
    { 
      name: 'Real Estate', 
      icon: 'home',
      subcategories: [
        { name: 'For Rent' },
        { name: 'For Sale' },
        { name: 'Real Estate Services', hasSubcategories: true }
      ]
    },
    { name: 'Electronics', icon: 'laptop_mac' },
    { name: 'Home & Garden', icon: 'weekend' },
    { name: 'Jobs', icon: 'work' },
    { name: 'Pets', icon: 'pets' },
    { name: 'Baby Items', icon: 'child_care' },
    { name: 'Other', icon: 'more_horiz' },
  ];

  const handleCategorySelect = (catName: string) => {
    // Check if it's a top-level selection
    const topLevelCat = categoriesData.find(c => c.name === catName);
    if (topLevelCat) {
      if (topLevelCat.subcategories) {
        setCategory(catName); // Set it, but we need more info
      } else {
        setCategory(catName);
      }
    } else {
       // It's a subcategory
       setCategory(category.split(' > ')[0] + ' > ' + catName);
    }
  };

  // Helper to find current subcategories
  const currentTopCategory = categoriesData.find(c => c.name === category.split(' > ')[0]);
  const currentSubcategories = currentTopCategory?.subcategories;

  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      // Get user from local storage
      const userStr = localStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : null;
      
      let imageUrls: string[] = [];
      const validFiles = imageFiles.filter(f => f !== null) as File[];

      if (validFiles.length > 0) {
        const formData = new FormData();
        validFiles.forEach((file: File) => {
          formData.append('images', file);
        });
        const uploadRes = await fetch('/api/upload.php', {
          method: 'POST',
          body: formData,
        });
        const uploadData = await uploadRes.json();
        if (uploadData.success) {
          imageUrls = uploadData.imageUrls;
        }
      }

      let finalDescription = description;
      if (category === 'Cars') {
        const carDetails = [];
        if (carMake) carDetails.push(`Make: ${carMake}`);
        if (carModel) carDetails.push(`Model: ${carModel}`);
        if (carYear) carDetails.push(`Year: ${carYear}`);
        if (carTransmission) carDetails.push(`Transmission: ${carTransmission}`);
        if (carFuelType) carDetails.push(`Fuel Type: ${carFuelType}`);
        if (carMileage) carDetails.push(`Mileage: ${carMileage} km`);
        if (carVIN) carDetails.push(`VIN: ${carVIN}`);
        if (carTrim) carDetails.push(`Trim: ${carTrim}`);
        if (carBodyType) carDetails.push(`Body Type: ${carBodyType}`);
        if (carDrivetrain) carDetails.push(`Drivetrain: ${carDrivetrain}`);
        if (carColor) carDetails.push(`Color: ${carColor}`);
        if (carDoors) carDetails.push(`Doors: ${carDoors}`);
        if (carSeatingCapacity) carDetails.push(`Seating Capacity: ${carSeatingCapacity}`);
        if (carFeatures.length > 0) carDetails.push(`Features: ${carFeatures.join(', ')}`);
        
        if (carDetails.length > 0) {
          finalDescription = carDetails.join('\n') + '\n\n' + description;
        }
      }

      const response = await fetch('/api/listings/create.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          price: parseFloat(price) || 0,
          category: category || 'Other',
          location: location || 'Unknown',
          description: finalDescription,
          image: imageUrls,
          user_id: user ? user.id : 1, // fallback to 1 if not logged in
          contact_email: contactEmail,
          contact_phone: contactPhone,
          postal_code: postalCode
        })
      });
      const data = await response.json();
      if (data.success) {
        navigate('/item/' + data.id);
      } else {
        alert('Failed to publish');
      }
    } catch (err) {
      console.error(err);
      alert('Error publishing');
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Header Stepper */}
      <div className="flex items-center justify-center mb-16 relative">
        <div className="flex flex-col items-center z-10">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= 1 ? 'bg-primary text-white' : 'bg-slate-200 text-slate-400'}`}>
            <span className="material-icons text-xl">{step > 1 ? 'check' : 'category'}</span>
          </div>
          <span className={`text-[10px] font-bold mt-2 uppercase tracking-widest ${step >= 1 ? 'text-primary' : 'text-slate-400'}`}>Category</span>
        </div>
        <div className={`h-1 flex-1 mx-4 rounded-full ${step >= 2 ? 'bg-primary' : 'bg-slate-200'}`}></div>
        <div className="flex flex-col items-center z-10">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= 2 ? 'bg-primary text-white' : 'bg-slate-200 text-slate-400'}`}>
            <span className="material-icons text-xl">{step > 2 ? 'check' : 'info'}</span>
          </div>
          <span className={`text-[10px] font-bold mt-2 uppercase tracking-widest ${step >= 2 ? 'text-primary' : 'text-slate-400'}`}>Details</span>
        </div>
        <div className={`h-1 flex-1 mx-4 rounded-full ${step >= 3 ? 'bg-primary' : 'bg-slate-200'}`}></div>
        <div className="flex flex-col items-center z-10">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= 3 ? 'bg-primary text-white' : 'bg-slate-200 text-slate-400'}`}>
            <span className="material-icons text-xl">image</span>
          </div>
          <span className={`text-[10px] font-bold mt-2 uppercase tracking-widest ${step >= 3 ? 'text-primary' : 'text-slate-400'}`}>Media</span>
        </div>
      </div>

      <div className="flex justify-end mb-6 relative z-20">
        <button onClick={handleReset} type="button" className="flex items-center gap-2 text-slate-500 hover:text-red-500 font-bold text-sm transition-colors bg-white px-5 py-2.5 rounded-xl border border-slate-200 shadow-sm hover:border-red-200 hover:bg-red-50 cursor-pointer">
          <span className="material-icons text-lg">refresh</span> Reset Form
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-8">
          {step === 1 && (
            <div className="bg-white p-10 rounded-[2rem] border border-slate-200 shadow-sm">
              <h2 className="text-2xl font-black mb-8">Select Category</h2>
              <div className="mb-4">
                <p className="text-sm text-slate-500 mb-4 tracking-widest uppercase font-bold text-center">Manually select a category</p>
                
                {/* Selected Top-Level Category */}
                {category && (
                  <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl mb-4 bg-white shadow-sm">
                    <span className="font-bold text-slate-800">{category.split(' > ')[0]}</span>
                    <button 
                      onClick={() => setCategory('')}
                      className="text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      <span className="material-icons text-xl">close</span>
                    </button>
                  </div>
                )}

                {/* Subcategories or Top-Level Categories */}
                {!category ? (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {categoriesData.map(cat => (
                      <button 
                        key={cat.name} 
                        onClick={() => handleCategorySelect(cat.name)}
                        className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all group bg-slate-50 border-transparent hover:border-primary hover:bg-white`}
                      >
                        <span className={`material-icons text-3xl mb-3 text-slate-400 group-hover:text-primary`}>{cat.icon}</span>
                        <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">{cat.name}</span>
                      </button>
                    ))}
                  </div>
                ) : currentSubcategories && !category.includes(' > ') ? (
                  <div className="space-y-2">
                    {currentSubcategories.map(subcat => (
                      <button
                        key={subcat.name}
                        onClick={() => handleCategorySelect(subcat.name)}
                        className="w-full flex items-center justify-between p-4 border border-slate-200 rounded-xl bg-white hover:border-primary transition-all text-left group"
                      >
                        <span className="font-bold text-slate-700 group-hover:text-primary">{subcat.name}</span>
                        {subcat.hasSubcategories && (
                          <span className="material-icons text-slate-400">chevron_right</span>
                        )}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center bg-primary/5 rounded-xl border border-primary/20">
                    <span className="material-icons text-4xl text-primary mb-4 block">check_circle</span>
                    <p className="font-bold text-slate-800 text-lg">Category Selected</p>
                    <p className="text-slate-500 text-sm mt-2">{category}</p>
                  </div>
                )}
              </div>
              <div className="mt-10 pt-10 border-t border-slate-100 text-right">
                <button 
                  disabled={!category || (currentSubcategories != null && !category.includes(' > '))}
                  onClick={() => setStep(2)} 
                  className="bg-primary hover:bg-primary-hover text-white px-10 py-4 rounded-xl font-bold transition-all shadow-lg shadow-primary/20 flex items-center gap-2 ml-auto disabled:opacity-50"
                >
                  Next Step <span className="material-icons">chevron_right</span>
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="bg-white p-10 rounded-[2rem] border border-slate-200 shadow-sm space-y-8">
              <h2 className="text-2xl font-black">Ad Information</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Ad Title</label>
                  <input 
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    className="w-full px-5 py-4 bg-slate-50 border-slate-100 rounded-xl focus:ring-primary focus:border-primary text-sm" 
                    placeholder="e.g. 2018 Honda Civic LX - Excellent Condition" 
                  />
                </div>
                
                {category === 'Cars' && (
                  <div className="bg-primary/5 p-6 rounded-xl border border-primary/20 space-y-4">
                     <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-2">
                       <span className="material-icons text-primary">directions_car</span>
                       Vehicle Details
                     </h3>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <div>
                         <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Make</label>
                         <input value={carMake} onChange={e => setCarMake(e.target.value)} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:ring-primary focus:border-primary text-sm" placeholder="e.g. Toyota" />
                       </div>
                       <div>
                         <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Model</label>
                         <input value={carModel} onChange={e => setCarModel(e.target.value)} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:ring-primary focus:border-primary text-sm" placeholder="e.g. Camry" />
                       </div>
                       <div>
                         <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Year</label>
                         <input type="number" value={carYear} onChange={e => setCarYear(e.target.value)} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:ring-primary focus:border-primary text-sm" placeholder="e.g. 2020" />
                       </div>
                       <div>
                         <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Transmission</label>
                         <select value={carTransmission} onChange={e => setCarTransmission(e.target.value)} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:ring-primary focus:border-primary text-sm text-slate-700">
                           <option value="">Select...</option>
                           <option>Automatic</option>
                           <option>Manual</option>
                           <option>Other</option>
                         </select>
                       </div>
                       <div>
                         <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Fuel Type</label>
                         <select value={carFuelType} onChange={e => setCarFuelType(e.target.value)} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:ring-primary focus:border-primary text-sm text-slate-700">
                           <option value="">Select...</option>
                           <option>Gas</option>
                           <option>Diesel</option>
                           <option>Hybrid</option>
                           <option>Electric</option>
                           <option>Other</option>
                         </select>
                       </div>
                       <div>
                         <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Mileage (km)</label>
                         <input type="number" value={carMileage} onChange={e => setCarMileage(e.target.value)} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:ring-primary focus:border-primary text-sm" placeholder="e.g. 50000" />
                       </div>
                       <div>
                         <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Trim</label>
                         <input value={carTrim} onChange={e => setCarTrim(e.target.value)} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:ring-primary focus:border-primary text-sm" placeholder="e.g. EX-L" />
                       </div>
                       <div>
                         <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Body Type</label>
                         <select value={carBodyType} onChange={e => setCarBodyType(e.target.value)} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:ring-primary focus:border-primary text-sm text-slate-700">
                           <option value="">Select...</option>
                           <option>SUV</option>
                           <option>Sedan</option>
                           <option>Coupe</option>
                           <option>Hatchback</option>
                           <option>Truck</option>
                           <option>Van</option>
                           <option>Wagon</option>
                           <option>Other</option>
                         </select>
                       </div>
                       <div>
                         <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Drivetrain</label>
                         <select value={carDrivetrain} onChange={e => setCarDrivetrain(e.target.value)} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:ring-primary focus:border-primary text-sm text-slate-700">
                           <option value="">Select...</option>
                           <option>FWD</option>
                           <option>RWD</option>
                           <option>AWD</option>
                           <option>4WD</option>
                         </select>
                       </div>
                       <div>
                         <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Exterior Color</label>
                         <input value={carColor} onChange={e => setCarColor(e.target.value)} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:ring-primary focus:border-primary text-sm" placeholder="e.g. Black" />
                       </div>
                       <div>
                         <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Doors</label>
                         <select value={carDoors} onChange={e => setCarDoors(e.target.value)} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:ring-primary focus:border-primary text-sm text-slate-700">
                           <option value="">Select...</option>
                           <option>2</option>
                           <option>3</option>
                           <option>4</option>
                           <option>5</option>
                           <option>Other</option>
                         </select>
                       </div>
                       <div>
                         <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Seating Capacity</label>
                         <input type="number" value={carSeatingCapacity} onChange={e => setCarSeatingCapacity(e.target.value)} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:ring-primary focus:border-primary text-sm" placeholder="e.g. 5" />
                       </div>
                       <div className="md:col-span-2">
                         <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">VIN Number</label>
                         <input value={carVIN} onChange={e => setCarVIN(e.target.value)} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:ring-primary focus:border-primary text-sm uppercase" placeholder="17-character VIN" maxLength={17} />
                       </div>
                     </div>
                     <div className="pt-4 mt-2 border-t border-primary/10">
                       <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Features</label>
                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                         {CAR_FEATURES_LIST.map(feature => (
                           <label key={feature} className="flex items-center gap-3 cursor-pointer group">
                             <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${carFeatures.includes(feature) ? 'bg-primary border-primary' : 'bg-white border-slate-300 group-hover:border-primary'}`}>
                               {carFeatures.includes(feature) && <span className="material-icons text-white text-[14px]">check</span>}
                             </div>
                             <span className="text-sm font-medium text-slate-700">{feature}</span>
                             <input 
                               type="checkbox" 
                               className="hidden" 
                               checked={carFeatures.includes(feature)}
                               onChange={() => {
                                 setCarFeatures(prev => 
                                   prev.includes(feature) ? prev.filter(f => f !== feature) : [...prev, feature]
                                 );
                               }}
                             />
                           </label>
                         ))}
                       </div>
                     </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Description</label>
                  <div className="bg-slate-50 border border-slate-100 rounded-xl overflow-hidden">
                    <textarea 
                      value={description}
                      onChange={e => setDescription(e.target.value)}
                      className="w-full bg-transparent border-none focus:ring-0 p-5 text-sm" 
                      rows={8} 
                      placeholder="Describe what you are selling..."
                    ></textarea>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div>
                      <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Price ($)</label>
                      <input 
                        type="number"
                        value={price}
                        onChange={e => setPrice(e.target.value)}
                        className="w-full px-5 py-4 bg-slate-50 border-slate-100 rounded-xl focus:ring-primary focus:border-primary text-sm font-bold" 
                        placeholder="0.00" 
                      />
                   </div>
                   <div>
                      <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Condition</label>
                      <select className="w-full px-5 py-4 bg-slate-50 border-slate-100 rounded-xl focus:ring-primary focus:border-primary text-sm font-medium">
                         <option>New</option>
                         <option>Used - Like New</option>
                         <option>Used - Good</option>
                      </select>
                   </div>
                </div>
              </div>
              <div className="pt-10 border-t border-slate-100 flex justify-between">
                <button onClick={() => setStep(1)} className="px-10 py-4 font-bold text-slate-400 hover:text-slate-600">Back</button>
                <button 
                  disabled={!title || !price}
                  onClick={() => setStep(3)} 
                  className="bg-primary hover:bg-primary-hover text-white px-10 py-4 rounded-xl font-bold transition-all shadow-lg shadow-primary/20 flex items-center gap-2 disabled:opacity-50"
                >
                  Next Step <span className="material-icons">chevron_right</span>
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="bg-white p-10 rounded-[2rem] border border-slate-200 shadow-sm space-y-10">
              <h2 className="text-2xl font-black">Media & Location</h2>
              
              <section>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Add Photos (Up to 5)</label>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <div key={index} className="relative w-full aspect-square border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center bg-slate-50 group hover:border-primary hover:bg-white transition-all overflow-hidden cursor-pointer">
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
                          e.target.value = '';
                        }}
                      />
                      {imagePreviews[index] ? (
                        <div className="absolute inset-0 z-10 pointer-events-none">
                          <img src={imagePreviews[index]!} className="w-full h-full object-cover" alt={`Image ${index + 1}`} />
                        </div>
                      ) : (
                        <>
                          <span className="material-icons text-3xl text-slate-300 group-hover:text-primary mb-1">
                             {index === 0 ? 'add_a_photo' : 'add'}
                          </span>
                          <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">
                             {index === 0 ? 'Cover' : `Pic ${index + 1}`}
                          </span>
                        </>
                      )}
                      
                      {/* Delete button if image exists */}
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
                          <span className="material-icons text-xs pointer-events-none">close</span>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Item Location</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="relative">
                    <span className="material-icons absolute left-4 top-3.5 text-slate-400">location_on</span>
                    <input 
                      value={location}
                      onChange={e => {
                        setLocation(e.target.value);
                        setShowSuggestions(true);
                      }}
                      onFocus={() => setShowSuggestions(true)}
                      onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border-slate-100 rounded-xl focus:ring-primary focus:border-primary text-sm" 
                      placeholder="Enter street address or city in Canada..." 
                      autoComplete="off"
                    />
                    
                    {/* Suggestions Dropdown */}
                    {showSuggestions && location.length > 2 && (
                      <div className="absolute top-14 left-0 w-full bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden">
                        {isSearchingLocation ? (
                          <div className="p-4 text-xs font-bold text-slate-400 text-center">Searching...</div>
                        ) : locationSuggestions.length > 0 ? (
                          <ul>
                            {locationSuggestions.map((place, idx) => (
                              <li 
                                key={idx} 
                                onClick={() => handleSelectLocation(place)}
                                className="px-4 py-3 hover:bg-slate-50 cursor-pointer border-b border-slate-50 last:border-0 flex items-start gap-3 transition-colors"
                              >
                                <span className="material-icons text-slate-300 text-lg mt-0.5">place</span>
                                <div>
                                  <p className="text-sm font-bold text-slate-700 leading-tight mb-0.5">{place.display_name.split(',')[0]}</p>
                                  <p className="text-xs text-slate-400 leading-tight">{place.display_name}</p>
                                </div>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <div className="p-4 text-xs font-bold text-slate-400 text-center">No locations found.</div>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="relative">
                    <span className="material-icons absolute left-4 top-3.5 text-slate-400">markunread_mailbox</span>
                    <input 
                      value={postalCode}
                      onChange={e => setPostalCode(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border-slate-100 rounded-xl focus:ring-primary focus:border-primary text-sm" 
                      placeholder="Postal Code" 
                    />
                  </div>
                </div>
              </section>

              <section>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Contact Details</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative">
                    <span className="material-icons absolute left-4 top-3.5 text-slate-400">email</span>
                    <input 
                      type="email"
                      value={contactEmail}
                      onChange={e => setContactEmail(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border-slate-100 rounded-xl focus:ring-primary focus:border-primary text-sm" 
                      placeholder="Contact Email" 
                    />
                  </div>
                  <div className="relative">
                    <span className="material-icons absolute left-4 top-3.5 text-slate-400">phone</span>
                    <input 
                      type="tel"
                      value={contactPhone}
                      onChange={e => setContactPhone(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border-slate-100 rounded-xl focus:ring-primary focus:border-primary text-sm" 
                      placeholder="Contact Phone Number" 
                    />
                  </div>
                </div>
              </section>
              <div className="pt-10 border-t border-slate-100 flex justify-between">
                <button onClick={() => setStep(2)} className="px-10 py-4 font-bold text-slate-400 hover:text-slate-600">Back</button>
                <button 
                  disabled={!location || isPublishing}
                  onClick={handlePublish} 
                  className="bg-primary hover:bg-primary-hover text-white px-10 py-4 rounded-xl font-bold transition-all shadow-lg shadow-primary/20 flex items-center gap-2 disabled:opacity-50"
                >
                  {isPublishing ? 'Publishing...' : 'Publish Ad'} <span className="material-icons">check</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Info */}
        <aside className="lg:col-span-4 space-y-8">
           <div className="bg-primary/5 rounded-[2rem] border border-primary/20 p-8">
              <h3 className="font-black mb-6 flex items-center gap-2 text-primary uppercase tracking-widest text-sm">
                <span className="material-icons">lightbulb</span> Tips for a Great Ad
              </h3>
              <ul className="space-y-8">
                {[
                  { title: 'Be specific', desc: 'Include brand, model, and dimensions to help buyers find your item.' },
                  { title: 'Price it right', desc: 'Research similar items to stay competitive and sell faster.' },
                  { title: 'Mention defects', desc: 'Honesty builds trust. Highlight any scratches or repairs needed.' }
                ].map((tip, i) => (
                  <li key={i} className="flex gap-4">
                    <div className="w-7 h-7 bg-primary text-white text-xs font-bold rounded-full flex items-center justify-center flex-shrink-0">{i+1}</div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm mb-1">{tip.title}</h4>
                      <p className="text-xs text-slate-500 leading-relaxed">{tip.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
           </div>
        </aside>
      </div>
    </div>
  );
};

export default PostAd;

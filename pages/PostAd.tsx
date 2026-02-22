import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

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
  const [imageFiles, setImageFiles] = useState<(File | null)[]>([null, null, null, null, null]);
  const [imagePreviews, setImagePreviews] = useState<(string | null)[]>([null, null, null, null, null]);
  const [isPublishing, setIsPublishing] = useState(false);

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

  const categories = [
    { name: 'Cars', icon: 'directions_car' },
    { name: 'Real Estate', icon: 'home' },
    { name: 'Electronics', icon: 'laptop_mac' },
    { name: 'Home & Garden', icon: 'weekend' },
    { name: 'Jobs', icon: 'work' },
    { name: 'Pets', icon: 'pets' },
    { name: 'Baby Items', icon: 'child_care' },
    { name: 'Other', icon: 'more_horiz' },
  ];

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
        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        const uploadData = await uploadRes.json();
        if (uploadData.success) {
          imageUrls = uploadData.imageUrls;
        }
      }

      const response = await fetch('/api/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          price: parseFloat(price) || 0,
          category: category || 'Other',
          location: location || 'Unknown',
          description,
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-8">
          {step === 1 && (
            <div className="bg-white p-10 rounded-[2rem] border border-slate-200 shadow-sm">
              <h2 className="text-2xl font-black mb-8">Select Category</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {categories.map(cat => (
                  <button 
                    key={cat.name} 
                    onClick={() => setCategory(cat.name)}
                    className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all group ${category === cat.name ? 'border-primary bg-primary/5' : 'bg-slate-50 border-transparent hover:border-primary hover:bg-white'}`}
                  >
                    <span className={`material-icons text-3xl mb-3 ${category === cat.name ? 'text-primary' : 'text-slate-400 group-hover:text-primary'}`}>{cat.icon}</span>
                    <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">{cat.name}</span>
                  </button>
                ))}
              </div>
              <div className="mt-10 pt-10 border-t border-slate-100 text-right">
                <button 
                  disabled={!category}
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
                            const newFiles = [...imageFiles];
                            newFiles[index] = e.target.files[0];
                            setImageFiles(newFiles);

                            const newPreviews = [...imagePreviews];
                            newPreviews[index] = URL.createObjectURL(e.target.files[0]);
                            setImagePreviews(newPreviews);
                          }
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
                            // Revoke safely to avoid memory leaks
                            if (newPreviews[index]) URL.revokeObjectURL(newPreviews[index]!);
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

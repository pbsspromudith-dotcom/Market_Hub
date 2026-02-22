import React, { useState } from 'react';
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
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isPublishing, setIsPublishing] = useState(false);

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
      if (imageFiles.length > 0) {
        const formData = new FormData();
        imageFiles.forEach((file: File) => {
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
          user_id: user ? user.id : 1 // fallback to 1 if not logged in
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
                <div className="mb-6 relative">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    id="imagesUpload"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    onChange={(e) => {
                      if (e.target.files) {
                        const filesArray = Array.from(e.target.files).slice(0, 5) as File[];
                        setImageFiles(filesArray);
                        setImagePreviews(filesArray.map((file: File) => URL.createObjectURL(file)));
                      }
                    }}
                  />
                  {imagePreviews.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {imagePreviews.map((preview, idx) => (
                        <div key={idx} className="w-full aspect-[4/3] rounded-2xl overflow-hidden relative">
                           <img src={preview} className="w-full h-full object-cover" alt={`Preview ${idx + 1}`} />
                        </div>
                      ))}
                      {imagePreviews.length < 5 && (
                        <div className="w-full aspect-[4/3] bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center">
                           <span className="material-icons text-3xl text-slate-300">add_a_photo</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="w-full aspect-[4/3] bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center group hover:border-primary hover:bg-white transition-all">
                       <span className="material-icons text-5xl text-slate-300 group-hover:text-primary mb-2">cloud_upload</span>
                       <span className="font-bold text-slate-500">Tap to upload up to 5 photos</span>
                    </div>
                  )}
                </div>
              </section>

              <section>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Item Location</label>
                <div className="relative mb-4">
                  <span className="material-icons absolute left-4 top-3.5 text-slate-400">location_on</span>
                  <input 
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-slate-100 rounded-xl focus:ring-primary focus:border-primary text-sm" 
                    placeholder="Enter street address or city..." 
                  />
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


import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PostAd: React.FC = () => {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

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
                  <button key={cat.name} className="flex flex-col items-center justify-center p-6 bg-slate-50 rounded-2xl border-2 border-transparent hover:border-primary hover:bg-white transition-all group">
                    <span className="material-icons text-3xl text-slate-400 group-hover:text-primary mb-3">{cat.icon}</span>
                    <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">{cat.name}</span>
                  </button>
                ))}
              </div>
              <div className="mt-10 pt-10 border-t border-slate-100 text-right">
                <button onClick={() => setStep(2)} className="bg-primary hover:bg-primary-hover text-white px-10 py-4 rounded-xl font-bold transition-all shadow-lg shadow-primary/20 flex items-center gap-2 ml-auto">
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
                  <input className="w-full px-5 py-4 bg-slate-50 border-slate-100 rounded-xl focus:ring-primary focus:border-primary text-sm" placeholder="e.g. 2018 Honda Civic LX - Excellent Condition" />
                  <p className="text-[10px] text-slate-400 mt-2">A good title includes name, brand, and key features. (0/100)</p>
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Description</label>
                  <div className="bg-slate-50 border border-slate-100 rounded-xl overflow-hidden">
                    <div className="flex gap-2 p-2 border-b border-slate-200">
                      {['format_bold', 'format_italic', 'format_list_bulleted', 'link'].map(tool => (
                        <button key={tool} className="p-1.5 hover:bg-white rounded transition-colors">
                          <span className="material-icons text-sm text-slate-500">{tool}</span>
                        </button>
                      ))}
                    </div>
                    <textarea className="w-full bg-transparent border-none focus:ring-0 p-5 text-sm" rows={8} placeholder="Describe what you are selling..."></textarea>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div>
                      <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Price ($)</label>
                      <input className="w-full px-5 py-4 bg-slate-50 border-slate-100 rounded-xl focus:ring-primary focus:border-primary text-sm font-bold" defaultValue="0.00" />
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
                <button onClick={() => setStep(3)} className="bg-primary hover:bg-primary-hover text-white px-10 py-4 rounded-xl font-bold transition-all shadow-lg shadow-primary/20 flex items-center gap-2">
                  Next Step <span className="material-icons">chevron_right</span>
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="bg-white p-10 rounded-[2rem] border border-slate-200 shadow-sm space-y-10">
              <h2 className="text-2xl font-black">Media & Location</h2>
              <section>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Add Photos</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                   <div className="col-span-2 aspect-video bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-white transition-all group">
                      <span className="material-icons text-4xl text-slate-300 group-hover:text-primary mb-2">add_a_photo</span>
                      <p className="text-xs font-bold text-slate-400">Main Cover Photo</p>
                   </div>
                   {[1, 2].map(i => (
                     <div key={i} className="aspect-video bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center cursor-pointer hover:border-primary transition-all">
                        <span className="material-icons text-2xl text-slate-200">add</span>
                     </div>
                   ))}
                </div>
              </section>
              <section>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Item Location</label>
                <div className="relative mb-4">
                  <span className="material-icons absolute left-4 top-3.5 text-slate-400">location_on</span>
                  <input className="w-full pl-12 pr-4 py-4 bg-slate-50 border-slate-100 rounded-xl focus:ring-primary focus:border-primary text-sm" placeholder="Enter street address or city..." />
                  <button className="absolute right-4 top-3.5 text-[10px] font-black text-primary uppercase tracking-widest hover:underline">Use My Location</button>
                </div>
                <div className="h-60 bg-slate-100 rounded-2xl overflow-hidden">
                   <img src="https://picsum.photos/seed/location/1000/400" className="w-full h-full object-cover grayscale opacity-50" />
                </div>
              </section>
              <div className="pt-10 border-t border-slate-100 flex justify-between">
                <button onClick={() => setStep(2)} className="px-10 py-4 font-bold text-slate-400 hover:text-slate-600">Back</button>
                <button onClick={() => navigate('/dashboard')} className="bg-primary hover:bg-primary-hover text-white px-10 py-4 rounded-xl font-bold transition-all shadow-lg shadow-primary/20 flex items-center gap-2">
                  Publish Ad <span className="material-icons">check</span>
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

           <div className="bg-slate-900 rounded-[2rem] p-8 text-white">
              <h3 className="font-black text-lg mb-4">Boost your reach!</h3>
              <p className="text-xs text-slate-400 mb-6 leading-relaxed">Ads with featured placement get up to 5x more views from local buyers.</p>
              <button className="w-full bg-white text-slate-900 font-bold py-3 rounded-xl text-sm">Learn about Promotions</button>
           </div>
        </aside>
      </div>
    </div>
  );
};

export default PostAd;

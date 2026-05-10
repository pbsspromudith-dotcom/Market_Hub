
import React, { useState, useEffect } from 'react';

const Contact: React.FC = () => {
  const [formState, setFormState] = useState({ name: '', email: '', subject: 'General Inquiry', message: '' });
  const [isSent, setIsSent] = useState(false);
  const [isLive, setIsLive] = useState(true);

  // Simulate a live status pulse
  useEffect(() => {
    const interval = setInterval(() => {
      setIsLive(prev => !prev);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSent(true);
    setTimeout(() => {
      setIsSent(false);
      setFormState({ name: '', email: '', subject: 'General Inquiry', message: '' });
    }, 5000);
  };

  const departments = [
    { name: 'Customer Support', email: 'support@hitads.ca', hours: '24/7 Availability' },
    { name: 'Billing & Payments', email: 'billing@hitads.ca', hours: 'Mon-Fri, 9am-5pm EST' },
    { name: 'Technical Support', email: 'dev@hitads.ca', hours: 'Mon-Fri, 8am-8pm EST' },
    { name: 'Media & Press', email: 'press@hitads.ca', hours: 'Mon-Fri, 10am-4pm EST' },
  ];

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Header */}
      <section className="bg-white border-b border-slate-200 pt-24 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.2em] rounded-full mb-8">
            <span className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-500 animate-pulse' : 'bg-green-300'} transition-colors duration-500`}></span>
            Support is currently Live
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight mb-8">How can we help?</h1>
          <p className="text-slate-500 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed">
            Whether you're a buyer, seller, or developer, we're here to ensure your HitAds experience is exceptional.
          </p>
        </div>
      </section>

      <main className="w-full px-4 sm:px-6 lg:px-10 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Contact Form Container */}
          <div className="lg:col-span-7">
            <div className="bg-white p-8 md:p-14 rounded-[3.5rem] border border-slate-100 shadow-2xl shadow-slate-200/50 relative overflow-hidden">
              {isSent && (
                <div className="absolute inset-0 bg-white/95 backdrop-blur-md z-20 flex flex-col items-center justify-center p-12 text-center transition-all duration-500">
                  <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center text-green-500 mb-8 shadow-inner">
                    <span className="material-icons text-5xl">verified</span>
                  </div>
                  <h3 className="text-3xl font-black text-slate-900 mb-4">Inquiry Received!</h3>
                  <p className="text-slate-500 font-medium max-w-sm mx-auto leading-relaxed">
                    Thanks for reaching out, {formState.name.split(' ')[0]}. A member of our team will contact you at <strong>{formState.email}</strong> shortly.
                  </p>
                  <button 
                    onClick={() => setIsSent(false)} 
                    className="mt-10 px-8 py-3 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-all"
                  >
                    Send Another Message
                  </button>
                </div>
              )}

              <div className="mb-12">
                <h2 className="text-3xl font-black text-slate-900 mb-3">Send a Message</h2>
                <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Expected response time: &lt; 2 hours</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="group">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1 transition-colors group-focus-within:text-primary">Full Name</label>
                    <div className="relative">
                      <span className="material-icons absolute left-5 top-4 text-slate-300 text-lg group-focus-within:text-primary transition-colors">person_outline</span>
                      <input 
                        required
                        type="text" 
                        className="w-full pl-14 pr-6 py-4.5 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-primary/10 text-sm font-semibold text-slate-700 transition-all" 
                        placeholder="e.g. Sarah Connor"
                        value={formState.name}
                        onChange={e => setFormState({...formState, name: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="group">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1 transition-colors group-focus-within:text-primary">Email Address</label>
                    <div className="relative">
                      <span className="material-icons absolute left-5 top-4 text-slate-300 text-lg group-focus-within:text-primary transition-colors">alternate_email</span>
                      <input 
                        required
                        type="email" 
                        className="w-full pl-14 pr-6 py-4.5 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-primary/10 text-sm font-semibold text-slate-700 transition-all" 
                        placeholder="sarah@example.com"
                        value={formState.email}
                        onChange={e => setFormState({...formState, email: e.target.value})}
                      />
                    </div>
                  </div>
                </div>

                <div className="group">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1 transition-colors group-focus-within:text-primary">Nature of Inquiry</label>
                  <div className="relative">
                    <span className="material-icons absolute left-5 top-4 text-slate-300 text-lg group-focus-within:text-primary transition-colors">help_outline</span>
                    <select 
                      className="w-full pl-14 pr-12 py-4.5 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-primary/10 text-sm font-semibold text-slate-700 transition-all appearance-none cursor-pointer"
                      value={formState.subject}
                      onChange={e => setFormState({...formState, subject: e.target.value})}
                    >
                      <option>General Inquiry</option>
                      <option>Technical Support</option>
                      <option>Account Safety & Fraud</option>
                      <option>Billing & Invoices</option>
                      <option>Feature Requests</option>
                      <option>Advertising Partnerships</option>
                    </select>
                    <span className="material-icons absolute right-5 top-4 text-slate-300 pointer-events-none">expand_more</span>
                  </div>
                </div>

                <div className="group">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1 transition-colors group-focus-within:text-primary">Your Message</label>
                  <textarea 
                    required
                    rows={6} 
                    className="w-full px-6 py-5 bg-slate-50 border-none rounded-[2rem] focus:ring-4 focus:ring-primary/10 text-sm font-semibold text-slate-700 transition-all resize-none" 
                    placeholder="Provide as much detail as possible..."
                    value={formState.message}
                    onChange={e => setFormState({...formState, message: e.target.value})}
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  className="w-full bg-primary hover:bg-primary-hover text-white font-black py-5 rounded-2xl transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-3 group text-lg"
                >
                  Dispatch Message
                  <span className="material-icons text-2xl group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform">send</span>
                </button>
              </form>
            </div>

          </div>

          {/* Sidebar - Sample Contact Details */}
          <div className="lg:col-span-5 space-y-12">
            


            {/* Department Directory */}
            <div className="bg-slate-900 rounded-[3rem] p-10 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-primary/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
              <h3 className="text-xl font-black mb-8 relative z-10">Sample Department Directory</h3>
              <div className="space-y-8 relative z-10">
                {departments.map((dept, i) => (
                  <div key={i} className="group cursor-pointer">
                    <div className="flex justify-between items-center mb-1">
                      <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 group-hover:text-primary transition-colors">{dept.name}</h4>
                      <span className="text-[9px] font-bold text-slate-500">{dept.hours}</span>
                    </div>
                    <p className="font-bold text-sm hover:text-primary transition-colors">{dept.email}</p>
                  </div>
                ))}
              </div>
            </div>



          </div>
        </div>
      </main>



      {/* Final Social Bar */}
      <section className="bg-white py-12 border-t border-slate-100">
        <div className="w-full px-4 sm:px-6 lg:px-10 flex flex-col md:flex-row justify-between items-center gap-8">
           <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Follow the HitAds journey</p>
           <div className="flex gap-4">
              {['Facebook', 'Twitter', 'Instagram', 'LinkedIn', 'YouTube', 'Discord'].map(s => (
                <a key={s} href="#" className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-primary hover:text-white transition-all shadow-sm hover:shadow-primary/20 hover:-translate-y-1">
                  <span className="material-icons text-lg">
                    {s === 'Twitter' ? 'close' : 
                     s === 'YouTube' ? 'smart_display' :
                     s === 'LinkedIn' ? 'business' :
                     s === 'Discord' ? 'forum' : 
                     s.toLowerCase().substring(0,1)}
                  </span>
                </a>
              ))}
           </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;

"use client";

import React, { useState, useEffect } from 'react';

const LocationPrompt: React.FC = () => {
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Check if we've already asked for location
    const prompted = localStorage.getItem('location_prompted');
    if (!prompted) {
      // Delay showing the prompt slightly for a smoother load experience
      const timer = setTimeout(() => setShowPrompt(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAllow = () => {
    localStorage.setItem('location_prompted', 'true');
    setShowPrompt(false);
    
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=jsonv2`)
            .then(res => res.json())
            .then(data => {
              if (data && data.address) {
                const city = data.address.city || data.address.town || data.address.village || '';
                const state = data.address.state || 'CA';
                const locString = city ? `${city}, ${state}` : state;
                localStorage.setItem('user_location', locString);
                localStorage.setItem('user_lat', lat.toString());
                localStorage.setItem('user_lon', lon.toString());
                window.dispatchEvent(new Event('location_updated'));
              }
            })
            .catch(err => console.error("Failed to reverse geocode:", err));
        },
        (error) => {
          console.log("Location access denied or failed", error);
        }
      );
    }
  };

  const handleDeny = () => {
    localStorage.setItem('location_prompted', 'true');
    setShowPrompt(false);
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={handleDeny}></div>
      <div className="bg-white rounded-[2.5rem] p-10 max-w-md w-full relative z-10 shadow-2xl animate-fade-in-up text-center overflow-hidden">
        <div className="absolute top-0 right-0 -mr-10 -mt-10 w-32 h-32 bg-primary-soft/10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-0 left-0 -ml-10 -mb-10 w-24 h-24 bg-primary-light/10 rounded-full blur-2xl"></div>
        
        <div className="w-20 h-20 bg-primary/10 rounded-[1.5rem] flex items-center justify-center mx-auto mb-6 relative">
          <span className="material-icons text-primary text-4xl">location_on</span>
          <div className="absolute w-full h-full border-4 border-white rounded-[1.5rem] scale-110 opacity-50 pulse-ring"></div>
        </div>
        
        <h3 className="text-2xl font-black text-slate-900 mb-3 leading-tight">Find items near you</h3>
        <p className="text-sm text-slate-500 mb-8 leading-relaxed font-medium">
          HitAds uses your location to show verified local sellers and trending listings right in your community.
        </p>
        
        <div className="space-y-3">
          <button 
            onClick={handleAllow}
            className="w-full bg-primary hover:bg-primary-hover text-white font-black py-4 rounded-2xl transition-all shadow-lg shadow-primary/25 flex items-center justify-center gap-2"
          >
            Allow Location Access
          </button>
          <button 
            onClick={handleDeny}
            className="w-full bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold py-4 rounded-2xl transition-all"
          >
            Not Right Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default LocationPrompt;

import fs from 'fs';

const filePath = 'd:/Nishantha/Market_Hub/src/old_pages/PostAd.tsx';
let content = fs.readFileSync(filePath, 'utf-8');

// 1. Update Stepper Header
const oldStepper = `      {/* Stepper Progress */}
      <div className="max-w-3xl mx-auto mb-8 sm:mb-10">
        <div className="flex items-center justify-between relative">
          {/* Step 1: Category */}
          <div 
            onClick={() => step > 1 && setStep(1)} 
            className={\`flex flex-col items-center z-10 \${step > 1 ? "cursor-pointer group" : ""}\`}
          >
            <div
              className={\`w-11 h-11 rounded-full flex items-center justify-center font-bold transition-all shadow-sm \${
                step >= 1 ? "bg-primary text-white shadow-primary/30" : "bg-slate-100 text-slate-400 border border-slate-200"
              }\`}
            >
              <span className="material-icons text-xl">
                {step > 1 ? "check" : "category"}
              </span>
            </div>
            <span
              className={\`text-[11px] font-black mt-2 uppercase tracking-widest transition-colors \${
                step >= 1 ? "text-primary" : "text-slate-400"
              }\`}
            >
              1. Category
            </span>
          </div>

          {/* Connector Line 1-2 */}
          <div className="h-1 flex-1 mx-3 rounded-full bg-slate-200 relative overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-300 rounded-full"
              style={{ width: step >= 2 ? "100%" : "0%" }}
            />
          </div>

          {/* Step 2: Details */}
          <div 
            onClick={() => step > 2 && setStep(2)} 
            className={\`flex flex-col items-center z-10 \${step > 2 ? "cursor-pointer group" : ""}\`}
          >
            <div
              className={\`w-11 h-11 rounded-full flex items-center justify-center font-bold transition-all shadow-sm \${
                step >= 2 ? "bg-primary text-white shadow-primary/30" : "bg-slate-100 text-slate-400 border border-slate-200"
              }\`}
            >
              <span className="material-icons text-xl">
                {step > 2 ? "check" : "edit_note"}
              </span>
            </div>
            <span
              className={\`text-[11px] font-black mt-2 uppercase tracking-widest transition-colors \${
                step >= 2 ? "text-primary" : "text-slate-400"
              }\`}
            >
              2. Details
            </span>
          </div>

          {/* Connector Line 2-3 */}
          <div className="h-1 flex-1 mx-3 rounded-full bg-slate-200 relative overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-300 rounded-full"
              style={{ width: step >= 3 ? "100%" : "0%" }}
            />
          </div>

          {/* Step 3: Media & Publish */}
          <div className="flex flex-col items-center z-10">
            <div
              className={\`w-11 h-11 rounded-full flex items-center justify-center font-bold transition-all shadow-sm \${
                step >= 3 ? "bg-primary text-white shadow-primary/30" : "bg-slate-100 text-slate-400 border border-slate-200"
              }\`}
            >
              <span className="material-icons text-xl">image</span>
            </div>
            <span
              className={\`text-[11px] font-black mt-2 uppercase tracking-widest transition-colors \${
                step >= 3 ? "text-primary" : "text-slate-400"
              }\`}
            >
              3. Media & Publish
            </span>
          </div>
        </div>
      </div>`;

const newStepper = `      {/* Stepper Progress (4-Step Flow) */}
      <div className="max-w-3xl mx-auto mb-8 sm:mb-10">
        <div className="flex items-center justify-between relative">
          {/* Step 1: Category */}
          <div 
            onClick={() => step > 1 && setStep(1)} 
            className={\`flex flex-col items-center z-10 \${step > 1 ? "cursor-pointer group" : ""}\`}
          >
            <div
              className={\`w-11 h-11 rounded-full flex items-center justify-center font-bold transition-all shadow-sm \${
                step >= 1 ? "bg-primary text-white shadow-primary/30" : "bg-slate-100 text-slate-400 border border-slate-200"
              }\`}
            >
              <span className="material-icons text-xl">
                {step > 1 ? "check" : "category"}
              </span>
            </div>
            <span
              className={\`text-[11px] font-black mt-2 uppercase tracking-widest transition-colors \${
                step >= 1 ? "text-primary" : "text-slate-400"
              }\`}
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
            className={\`flex flex-col items-center z-10 \${step > 2 ? "cursor-pointer group" : ""}\`}
          >
            <div
              className={\`w-11 h-11 rounded-full flex items-center justify-center font-bold transition-all shadow-sm \${
                step >= 2 ? "bg-primary text-white shadow-primary/30" : "bg-slate-100 text-slate-400 border border-slate-200"
              }\`}
            >
              <span className="material-icons text-xl">
                {step > 2 ? "check" : "edit_note"}
              </span>
            </div>
            <span
              className={\`text-[11px] font-black mt-2 uppercase tracking-widest transition-colors \${
                step >= 2 ? "text-primary" : "text-slate-400"
              }\`}
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
            className={\`flex flex-col items-center z-10 \${step > 3 ? "cursor-pointer group" : ""}\`}
          >
            <div
              className={\`w-11 h-11 rounded-full flex items-center justify-center font-bold transition-all shadow-sm \${
                step >= 3 ? "bg-primary text-white shadow-primary/30" : "bg-slate-100 text-slate-400 border border-slate-200"
              }\`}
            >
              <span className="material-icons text-xl">
                {step > 3 ? "check" : "workspace_premium"}
              </span>
            </div>
            <span
              className={\`text-[11px] font-black mt-2 uppercase tracking-widest transition-colors \${
                step >= 3 ? "text-primary" : "text-slate-400"
              }\`}
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
              className={\`w-11 h-11 rounded-full flex items-center justify-center font-bold transition-all shadow-sm \${
                step >= 4 ? "bg-primary text-white shadow-primary/30" : "bg-slate-100 text-slate-400 border border-slate-200"
              }\`}
            >
              <span className="material-icons text-xl">add_a_photo</span>
            </div>
            <span
              className={\`text-[11px] font-black mt-2 uppercase tracking-widest transition-colors \${
                step >= 4 ? "text-primary" : "text-slate-400"
              }\`}
            >
              4. Media & Publish
            </span>
          </div>
        </div>
      </div>`;

content = content.replace("Connect with verified buyers and sellers across Canada in 3 easy steps", "Connect with verified buyers and sellers across Canada in 4 easy steps");
content = content.replace(oldStepper, newStepper);

// 2. Update Step 2 button to Continue to Plan (step = 3)
const oldStep2Btn = `<button
                  disabled={(!templateConfig.hideTitle && !title) || (!templateConfig.hideDescription && !description) || (priceType === "amount" && !price && !templateConfig.hidePrice)}
                  onClick={() => setStep(3)}
                  className="bg-primary hover:bg-primary-hover text-white px-8 py-3.5 rounded-xl font-black text-sm uppercase tracking-wider transition-all shadow-md shadow-primary/20 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  Continue to Media{" "}
                  <span className="material-icons text-lg">chevron_right</span>
                </button>`;

const newStep2Btn = `<button
                  disabled={(!templateConfig.hideTitle && !title) || (!templateConfig.hideDescription && !description) || (priceType === "amount" && !price && !templateConfig.hidePrice)}
                  onClick={() => setStep(3)}
                  className="bg-primary hover:bg-primary-hover text-white px-8 py-3.5 rounded-xl font-black text-sm uppercase tracking-wider transition-all shadow-md shadow-primary/20 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  Next: Choose Plan{" "}
                  <span className="material-icons text-lg">chevron_right</span>
                </button>`;

content = content.replace(oldStep2Btn, newStep2Btn);

// 3. Replace Step 3 and Sidebar section
const step3StartMarker = "{/* ═══════════════════════════════════════════\n              STEP 3: MEDIA, LOCATION & VISIBILITY PLAN";
const step3EndMarker = "{/* ═══════════════════════════════════════════\n            RIGHT SIDEBAR (STICKY, LIVE SUMMARY & TIPS)";

const step3Idx = content.indexOf(step3StartMarker);
const sidebarIdx = content.indexOf(step3EndMarker);

if (step3Idx !== -1 && sidebarIdx !== -1) {
  const newStepsAndSidebar = `{/* ═══════════════════════════════════════════
              STEP 3: CHOOSE VISIBILITY PLAN
             ═══════════════════════════════════════════ */}
          {step === 3 && (
            <div className="bg-white p-6 sm:p-8 md:p-10 rounded-3xl border border-slate-200 shadow-sm space-y-8 animate-in fade-in duration-300">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="inline-flex items-center gap-1 py-1 px-3 rounded-full bg-blue-50 text-primary text-[10px] font-black uppercase tracking-widest border border-blue-200/60">
                      <span className="material-icons text-xs">workspace_premium</span> STEP 3 OF 4
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    HitAds Visibility Plan
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                    Boost views and sell up to 5x faster with optional promotion across Canada.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsPlanModalOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-primary font-bold text-xs uppercase tracking-wider transition-all border border-blue-200 cursor-pointer self-start sm:self-center shadow-2xs hover:shadow-xs"
                >
                  <span className="material-icons text-base">view_carousel</span> Compare All Plans
                </button>
              </div>

              {/* 3 Interactive Plan Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* FREE PLAN */}
                <div 
                  onClick={() => {
                    setSelectedPlan('free');
                    setPostInMultipleCities(false);
                    setSelectedCities([]);
                  }}
                  className={\`p-6 rounded-3xl border-2 cursor-pointer transition-all duration-200 flex flex-col justify-between relative \${
                    selectedPlan === 'free'
                      ? "border-primary bg-blue-50/40 shadow-xl ring-2 ring-primary/20 scale-[1.02]"
                      : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5"
                  }\`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-black text-slate-900 uppercase tracking-widest">FREE</span>
                      {selectedPlan === 'free' ? (
                        <span className="text-[10px] font-black text-white bg-primary px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-xs">
                          <span className="material-icons text-xs">check</span> Selected
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Standard</span>
                      )}
                    </div>
                    <div className="text-2xl font-black text-green-600 mb-1">FREE</div>
                    <p className="text-xs text-slate-500 font-medium mb-5">Basic listing for casual sellers</p>

                    <div className="space-y-2.5 pt-4 border-t border-slate-100 text-xs">
                      <div className="flex items-center gap-2 text-slate-700 font-bold">
                        <span className="material-icons text-green-600 text-sm">check_circle</span>
                        <span>10 Photo Uploads</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-700 font-bold">
                        <span className="material-icons text-green-600 text-sm">check_circle</span>
                        <span>Single City Location</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-700 font-bold">
                        <span className="material-icons text-green-600 text-sm">check_circle</span>
                        <span>Standard Search Ranking</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-400 font-medium">
                        <span className="material-icons text-slate-300 text-sm">remove_circle_outline</span>
                        <span className="line-through text-slate-400">Multi-City Posting</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-400 font-medium">
                        <span className="material-icons text-slate-300 text-sm">remove_circle_outline</span>
                        <span className="line-through text-slate-400">YouTube & Facebook Links</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedPlan('free');
                        setPostInMultipleCities(false);
                        setSelectedCities([]);
                      }}
                      className={\`w-full py-3 rounded-xl font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 \${
                        selectedPlan === 'free'
                          ? "bg-primary text-white shadow-md shadow-primary/25"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      }\`}
                    >
                      {selectedPlan === 'free' ? "Active Selection" : "Select Free"}
                    </button>
                  </div>
                </div>

                {/* BOOST PLAN */}
                <div 
                  onClick={() => setSelectedPlan('boost')}
                  className={\`p-6 rounded-3xl border-2 cursor-pointer transition-all duration-200 flex flex-col justify-between relative \${
                    selectedPlan === 'boost'
                      ? "border-blue-600 bg-blue-50/50 shadow-xl ring-2 ring-blue-500/20 scale-[1.02]"
                      : "border-slate-200 bg-white hover:border-blue-200 hover:shadow-md hover:-translate-y-0.5"
                  }\`}
                >
                  <div className="absolute -top-3 right-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[9px] font-black uppercase tracking-widest py-1 px-3 rounded-full shadow-md">
                    ⭐ POPULAR
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-black text-blue-900 uppercase tracking-widest">BOOST</span>
                      {selectedPlan === 'boost' ? (
                        <span className="text-[10px] font-black text-white bg-blue-600 px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-xs">
                          <span className="material-icons text-xs">check</span> Selected
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">Fast Sale</span>
                      )}
                    </div>
                    <div className="text-2xl font-black text-slate-900 mb-1">
                      $9.99 <span className="text-xs text-slate-500 font-normal">/ 30 days</span>
                    </div>
                    <p className="text-xs text-slate-500 font-medium mb-5">Sell up to 3x faster with priority ranking</p>

                    <div className="space-y-2.5 pt-4 border-t border-slate-100 text-xs">
                      <div className="flex items-center gap-2 text-blue-900 font-bold">
                        <span className="material-icons text-blue-600 text-sm">stars</span>
                        <span>Priority Top Ad Placement</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-800 font-bold">
                        <span className="material-icons text-green-600 text-sm">check_circle</span>
                        <span>20 Photo Uploads (2x More!)</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-800 font-bold">
                        <span className="material-icons text-green-600 text-sm">check_circle</span>
                        <span>Multi-City Posting (Up to 5 Cities)</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-800 font-bold">
                        <span className="material-icons text-green-600 text-sm">check_circle</span>
                        <span>YouTube & Facebook Links</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-800 font-bold">
                        <span className="material-icons text-green-600 text-sm">autorenew</span>
                        <span>7-Day Auto Refresh</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setSelectedPlan('boost')}
                      className={\`w-full py-3 rounded-xl font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 \${
                        selectedPlan === 'boost'
                          ? "bg-blue-600 text-white shadow-md shadow-blue-500/25"
                          : "bg-blue-50 text-blue-700 hover:bg-blue-100"
                      }\`}
                    >
                      {selectedPlan === 'boost' ? "Active Selection" : "Select Boost ($9.99)"}
                    </button>
                  </div>
                </div>

                {/* PREMIUM PLAN */}
                <div 
                  onClick={() => setSelectedPlan('premium')}
                  className={\`p-6 rounded-3xl border-2 cursor-pointer transition-all duration-200 flex flex-col justify-between relative \${
                    selectedPlan === 'premium'
                      ? "border-purple-600 bg-purple-50/50 shadow-xl ring-2 ring-purple-600/20 scale-[1.02]"
                      : "border-slate-200 bg-white hover:border-purple-200 hover:shadow-md hover:-translate-y-0.5"
                  }\`}
                >
                  <div className="absolute -top-3 right-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-[9px] font-black uppercase tracking-widest py-1 px-3 rounded-full shadow-md">
                    👑 BEST VALUE
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-black text-purple-900 uppercase tracking-widest">PREMIUM</span>
                      {selectedPlan === 'premium' ? (
                        <span className="text-[10px] font-black text-white bg-purple-600 px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-xs">
                          <span className="material-icons text-xs">check</span> Selected
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-purple-600 uppercase tracking-wider">Max Reach</span>
                      )}
                    </div>
                    <div className="text-2xl font-black text-slate-900 mb-1">
                      $24.99 <span className="text-xs text-slate-500 font-normal">/ 30 days</span>
                    </div>
                    <p className="text-xs text-slate-500 font-medium mb-5">Maximum visibility on Homepage & Search</p>

                    <div className="space-y-2.5 pt-4 border-t border-slate-100 text-xs">
                      <div className="flex items-center gap-2 text-purple-900 font-bold">
                        <span className="material-icons text-purple-600 text-sm">home</span>
                        <span>Homepage Showcase Gallery</span>
                      </div>
                      <div className="flex items-center gap-2 text-purple-900 font-bold">
                        <span className="material-icons text-purple-600 text-sm">stars</span>
                        <span>Priority Top Ad Placement</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-800 font-bold">
                        <span className="material-icons text-green-600 text-sm">check_circle</span>
                        <span>20 Photo Uploads</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-800 font-bold">
                        <span className="material-icons text-green-600 text-sm">check_circle</span>
                        <span>Multi-City Posting (Up to 5 Cities)</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-800 font-bold">
                        <span className="material-icons text-green-600 text-sm">check_circle</span>
                        <span>YouTube & Facebook Links</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-800 font-bold">
                        <span className="material-icons text-green-600 text-sm">autorenew</span>
                        <span>3-Day Auto Refresh</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setSelectedPlan('premium')}
                      className={\`w-full py-3 rounded-xl font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 \${
                        selectedPlan === 'premium'
                          ? "bg-purple-600 text-white shadow-md shadow-purple-600/25"
                          : "bg-purple-50 text-purple-700 hover:bg-purple-100"
                      }\`}
                    >
                      {selectedPlan === 'premium' ? "Active Selection" : "Select Premium ($24.99)"}
                    </button>
                  </div>
                </div>
              </div>

              {/* Selection Highlights Banner */}
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-primary flex items-center justify-center shrink-0">
                    <span className="material-icons text-xl">
                      {selectedPlan === 'free' ? 'photo_camera' : 'stars'}
                    </span>
                  </div>
                  <div>
                    <div className="text-xs font-black text-slate-900">
                      Selected: {selectedPlan === 'free' ? 'FREE Standard Plan' : selectedPlan === 'boost' ? 'BOOST Plan ($9.99 CAD)' : 'PREMIUM Plan ($24.99 CAD)'}
                    </div>
                    <div className="text-[11px] text-slate-500 font-medium">
                      {selectedPlan === 'free' 
                        ? 'Next, upload up to 10 photos and enter your item location.' 
                        : 'Next, upload up to 20 photos, choose up to 5 cities, and add your YouTube/Facebook links.'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-6 border-t border-slate-100 flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-6 py-3 font-bold text-slate-500 hover:text-slate-800 text-sm transition-colors cursor-pointer flex items-center gap-1.5"
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
                  <span className={\`text-xs font-black px-3.5 py-1.5 rounded-full uppercase tracking-wider flex items-center gap-1 \${
                    selectedPlan === 'free' 
                      ? 'bg-slate-100 text-slate-700 border border-slate-200' 
                      : selectedPlan === 'boost'
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'bg-purple-50 text-purple-700 border border-purple-200'
                  }\`}>
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
                        className={\`text-xs font-black px-3 py-1 rounded-full \${
                          activePhotoCount > 0
                            ? "bg-green-100 text-green-700"
                            : "bg-amber-50 text-amber-700"
                        }\`}
                      >
                        {activePhotoCount} / {maxAllowedPhotos} photos
                      </span>
                    </div>

                    {/* Progress bar */}
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: \`\${(activePhotoCount / maxAllowedPhotos) * 100}%\`,
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
                          className={\`relative w-full aspect-square border-2 border-dashed rounded-2xl flex flex-col items-center justify-center group hover:border-primary hover:bg-white transition-all overflow-hidden cursor-pointer \${
                            imagePreviews[index]
                              ? "border-green-400 bg-green-50/50"
                              : "border-slate-200 bg-slate-50/70"
                          }\`}
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
                                alt={\`Image \${index + 1}\`}
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
                                {index === 0 ? "Cover Photo" : \`Photo \${index + 1}\`}
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
                          className={\`relative w-11 h-6 rounded-full transition-colors duration-300 \${
                            postInMultipleCities
                              ? "bg-primary"
                              : "bg-slate-300 group-hover:bg-slate-400"
                          }\`}
                          onClick={() => {
                            setPostInMultipleCities(!postInMultipleCities);
                            if (postInMultipleCities) {
                              setSelectedCities([]);
                              setCitySearchQuery("");
                            }
                          }}
                        >
                          <div
                            className={\`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300 \${
                              postInMultipleCities ? "translate-x-5" : "translate-x-0"
                            }\`}
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
                        className={\`w-5 h-5 rounded-md border flex items-center justify-center transition-colors \${
                          includePhone ? "bg-primary border-primary" : "bg-white border-slate-300 group-hover:border-primary"
                        }\`}
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

              {/* Selected Plan Summary Banner */}
              <div className="pt-6 border-t border-slate-100">
                <div className={\`p-5 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 \${
                  selectedPlan === 'free' 
                    ? 'bg-slate-50 border-slate-200' 
                    : selectedPlan === 'boost'
                    ? 'bg-blue-50/60 border-blue-200'
                    : 'bg-purple-50/60 border-purple-200'
                }\`}>
                  <div className="flex items-center gap-3.5">
                    <div className={\`w-10 h-10 rounded-xl flex items-center justify-center font-black text-white \${
                      selectedPlan === 'free' ? 'bg-slate-700' : selectedPlan === 'boost' ? 'bg-blue-600' : 'bg-purple-600'
                    }\`}>
                      <span className="material-icons text-xl">
                        {selectedPlan === 'free' ? 'check' : selectedPlan === 'boost' ? 'bolt' : 'workspace_premium'}
                      </span>
                    </div>
                    <div>
                      <div className="text-xs font-black text-slate-900 flex items-center gap-2">
                        <span>{selectedPlan.toUpperCase()} PLAN SELECTED</span>
                        <span className="text-green-600 font-bold">
                          {selectedPlan === 'free' ? 'FREE ($0.00 CAD)' : selectedPlan === 'boost' ? '$9.99 CAD / 30 days' : '$24.99 CAD / 30 days'}
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
                        : (selectedPlan === 'free' ? "Publish Free Ad" : \`Proceed to Secure Payment (\${selectedPlan === 'boost' ? '$9.99' : '$24.99'})\`))}{" "}
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
                    ? (price ? \`\$\${parseFloat(price).toLocaleString()}\` : "$0.00")
                    : (priceOptions.find(o => o.option_key === priceType)?.option_value || "Special Pricing")}
                </span>
              </div>

              {/* Location */}
              <div className="flex justify-between items-start gap-2">
                <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Location:</span>
                <span className="font-bold text-slate-800 text-right truncate max-w-[180px]">
                  {!isEditMode && postInMultipleCities && selectedPlan !== 'free'
                    ? \`\${selectedCities.length} \${selectedCities.length === 1 ? 'city' : 'cities'}\` 
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
      </div>`;

  // Find the end of the entire form & sidebar before modals
  const modalsMarker = "{/* HitAds Pricing Cards Popup Modal */}";
  const modalsIdx = content.indexOf(modalsMarker);

  if (modalsIdx !== -1) {
    const before = content.slice(0, step3Idx);
    const after = content.slice(modalsIdx);
    fs.writeFileSync(filePath, before + newStepsAndSidebar + '\n\n      ' + after, 'utf-8');
    console.log('Successfully restructured Step 3, Step 4, and Sidebar in PostAd.tsx!');
  } else {
    console.error('Modals marker not found!');
  }
} else {
  console.error('Step 3 or sidebar markers not found!', step3Idx, sidebarIdx);
}

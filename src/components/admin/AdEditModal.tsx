import React, { useState } from 'react';
import { useUI } from '@/components/UIProvider';

interface AdEditModalProps {
  listing: any;
  onClose: () => void;
  onSaved: (updatedListing: any) => void;
  currentUserId: number;
}

export default function AdEditModal({
  listing,
  onClose,
  onSaved,
  currentUserId,
}: AdEditModalProps) {
  const { showAlert } = useUI();

  // Parse existing images
  const getInitialImages = (): string[] => {
    if (Array.isArray(listing.allImages) && listing.allImages.length > 0) {
      return [...listing.allImages];
    }
    if (listing.image) {
      if (listing.image.startsWith('[')) {
        try {
          const parsed = JSON.parse(listing.image);
          if (Array.isArray(parsed)) return parsed;
        } catch {}
      }
      return [listing.image];
    }
    return [];
  };

  const [title, setTitle] = useState(listing.title || '');
  const [price, setPrice] = useState(String(listing.price ?? ''));
  const [priceType, setPriceType] = useState(listing.price_type || 'amount');
  const [category, setCategory] = useState(listing.category || '');
  const [location, setLocation] = useState(listing.location || '');
  const [contactEmail, setContactEmail] = useState(listing.contact_email || listing.poster_email || '');
  const [contactPhone, setContactPhone] = useState(listing.contact_phone || '');
  const [description, setDescription] = useState(listing.description || '');
  const [images, setImages] = useState<string[]>(getInitialImages());
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Remove unwanted photo
  const handleRemoveImage = (indexToRemove: number) => {
    setImages(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  // Upload new photo
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append('file', file);

        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        const data = await res.json();
        if (data.success && data.url) {
          setImages(prev => [...prev, data.url]);
        } else if (data.url) {
          setImages(prev => [...prev, data.url]);
        } else {
          showAlert(data.message || 'Failed to upload photo', 'error');
        }
      }
    } catch (err: any) {
      showAlert('Error uploading image: ' + err.message, 'error');
    } finally {
      setIsUploading(false);
      // Reset input value
      e.target.value = '';
    }
  };

  // Save changes
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      showAlert('Listing title is required', 'error');
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        id: listing.id,
        user_id: currentUserId || 1,
        title: title.trim(),
        price: parseFloat(price) || 0,
        price_type: priceType,
        category: category.trim(),
        location: location.trim(),
        description: description.trim(),
        contact_email: contactEmail.trim() || null,
        contact_phone: contactPhone.trim() || null,
        images: images,
      };

      const res = await fetch('/api/listings/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        showAlert('Listing updated successfully without needing to re-post!', 'success');
        onSaved({
          ...listing,
          title: payload.title,
          price: payload.price,
          price_type: payload.price_type,
          category: payload.category,
          location: payload.location,
          description: payload.description,
          contact_email: payload.contact_email,
          contact_phone: payload.contact_phone,
          allImages: images,
          image: images.length > 0 ? images[0] : null,
        });
        onClose();
      } else {
        showAlert(data.error || data.message || 'Failed to update listing', 'error');
      }
    } catch (err: any) {
      showAlert('Network error saving changes: ' + err.message, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-3xl shadow-2xl overflow-hidden border border-slate-200 my-auto flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
              <span className="material-icons text-xl">edit</span>
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-800">Edit Advertisement</h3>
              <p className="text-xs text-slate-500 font-medium">
                Correct mistakes or remove unwanted images without deleting the ad.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors"
          >
            <span className="material-icons text-lg">close</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-6 flex-1">
          {/* Photos Management Section */}
          <div className="bg-slate-50/80 border border-slate-200 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="material-icons text-base text-primary">collections</span>
                  Manage Uploaded Photos ({images.length})
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Click the red <strong className="text-red-600">✕</strong> button on any photo to remove unwanted or duplicate pictures.
                </p>
              </div>
              <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary hover:bg-primary-hover text-white rounded-xl text-xs font-bold cursor-pointer transition-all shadow-xs">
                <span className="material-icons text-sm">add_photo_alternate</span>
                <span>{isUploading ? 'Uploading...' : 'Add Photos'}</span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileUpload}
                  disabled={isUploading}
                  className="hidden"
                />
              </label>
            </div>

            {images.length === 0 ? (
              <div className="py-8 text-center border-2 border-dashed border-slate-200 rounded-xl bg-white">
                <span className="material-icons text-4xl text-slate-300 block mb-1">add_a_photo</span>
                <p className="text-xs font-bold text-slate-400">No photos currently attached to this ad.</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Click "Add Photos" above to upload images.</p>
              </div>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                {images.map((imgUrl, idx) => (
                  <div
                    key={idx}
                    className="relative group aspect-square rounded-xl overflow-hidden bg-slate-200 border border-slate-200 shadow-xs"
                  >
                    <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                    {idx === 0 && (
                      <span className="absolute bottom-1 left-1 bg-black/70 text-white text-[9px] font-black uppercase px-1.5 py-0.5 rounded backdrop-blur-xs">
                        Cover
                      </span>
                    )}
                    {/* Delete Image Overlay Button */}
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="absolute top-1 right-1 w-6 h-6 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center shadow-md transition-transform hover:scale-110"
                      title="Remove this image"
                    >
                      <span className="material-icons text-xs">close</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Form Fields Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Title */}
            <div className="sm:col-span-2">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
                Ad Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Listing title..."
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
              />
            </div>

            {/* Price */}
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
                Price ($)
              </label>
              <input
                type="number"
                step="any"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0.00"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
              />
            </div>

            {/* Price Type */}
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
                Price Type
              </label>
              <select
                value={priceType}
                onChange={(e) => setPriceType(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
              >
                <option value="amount">Fixed Price</option>
                <option value="free">Free</option>
                <option value="contact">Please Contact</option>
                <option value="swap">Swap / Trade</option>
              </select>
            </div>

            {/* Category */}
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
                Category
              </label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g. Vehicles > Cars, Electronics"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
                Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Toronto, ON"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
              />
            </div>

            {/* Contact Email */}
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
                Contact Email
              </label>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="seller@example.com"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
              />
            </div>

            {/* Contact Phone */}
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
                Contact Phone
              </label>
              <input
                type="text"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
              />
            </div>

            {/* Description */}
            <div className="sm:col-span-2">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
                Ad Description
              </label>
              <textarea
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Full description of the item or service..."
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs leading-relaxed font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-2 px-6 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-sm hover:shadow-md transition-all disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <span className="material-icons text-sm animate-spin">sync</span>
                  <span>Saving Changes...</span>
                </>
              ) : (
                <>
                  <span className="material-icons text-sm">save</span>
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

"use client";

import React, { useState, useEffect, useRef, useId } from 'react';
import { searchCanadianLocations, LocationItem, POPULAR_CANADIAN_CITIES } from '@/lib/canadianLocations';

export interface LocationAutocompleteProps {
  value?: string;
  onChange?: (value: string) => void;
  onSelectLocation?: (location: LocationItem) => void;
  placeholder?: string;
  variant?: 'hero' | 'navbar' | 'mobile' | 'filter' | 'form';
  className?: string;
  inputClassName?: string;
  dropdownClassName?: string;
  autoFocus?: boolean;
  disabled?: boolean;
  name?: string;
  id?: string;
  required?: boolean;
  showPopularOnEmpty?: boolean;
  maxSuggestions?: number;
  syncWithLocalStorage?: boolean;
}

export const LocationAutocomplete: React.FC<LocationAutocompleteProps> = ({
  value = '',
  onChange,
  onSelectLocation,
  placeholder = 'City, Province or Postal Code...',
  variant = 'hero',
  className = '',
  inputClassName = '',
  dropdownClassName = '',
  autoFocus = false,
  disabled = false,
  name,
  id,
  required = false,
  showPopularOnEmpty = true,
  maxSuggestions = 8,
  syncWithLocalStorage = false,
}) => {
  const generatedId = useId();
  const inputId = id || `location-autocomplete-${generatedId}`;
  
  const [inputValue, setInputValue] = useState(value);
  const [suggestions, setSuggestions] = useState<LocationItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync external value changes
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Update suggestions instantly (0ms latency via in-memory dataset)
  useEffect(() => {
    if (!isOpen) return;

    if (!inputValue.trim()) {
      if (showPopularOnEmpty) {
        setSuggestions(searchCanadianLocations('', maxSuggestions));
      } else {
        setSuggestions([]);
      }
    } else {
      const results = searchCanadianLocations(inputValue, maxSuggestions);
      setSuggestions(results);
    }
    setHighlightedIndex(-1);
  }, [inputValue, isOpen, showPopularOnEmpty, maxSuggestions]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);
    if (onChange) onChange(val);
    setIsOpen(true);
  };

  const handleSelect = (item: LocationItem) => {
    const locStr = item.fullAddress;
    setInputValue(locStr);
    if (onChange) onChange(locStr);
    
    if (syncWithLocalStorage && typeof window !== 'undefined') {
      localStorage.setItem('user_location', locStr);
      localStorage.setItem('user_lat', item.lat);
      localStorage.setItem('user_lon', item.lon);
      window.dispatchEvent(new Event('location_updated'));
    }

    if (onSelectLocation) {
      onSelectLocation(item);
    }

    setIsOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setInputValue('');
    if (onChange) onChange('');
    setIsOpen(true);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || suggestions.length === 0) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') {
        setIsOpen(true);
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === 'Enter') {
      if (highlightedIndex >= 0 && highlightedIndex < suggestions.length) {
        e.preventDefault();
        handleSelect(suggestions[highlightedIndex]);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  // Helper to highlight matching characters
  const highlightMatch = (text: string, query: string) => {
    if (!query.trim()) return text;
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? (
        <span key={i} className="text-primary font-black underline decoration-primary/40">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  // Variant-specific styling rules
  const getContainerStyles = () => {
    switch (variant) {
      case 'hero':
        return 'relative w-full flex items-center';
      case 'navbar':
        return 'relative flex-1 flex items-center';
      case 'mobile':
        return 'relative w-full flex items-center';
      case 'filter':
        return 'relative w-full';
      case 'form':
        return 'relative w-full';
      default:
        return 'relative w-full';
    }
  };

  const getInputStyles = () => {
    switch (variant) {
      case 'hero':
        return 'w-full pl-14 pr-10 py-5 bg-transparent border-0 border-none outline-none focus:outline-none focus:ring-0 focus:border-none focus-visible:outline-none shadow-none text-sm font-bold text-slate-800 placeholder:text-slate-400';
      case 'navbar':
        return 'w-full bg-transparent border-0 border-none outline-none focus:outline-none focus:ring-0 focus:border-none focus-visible:outline-none shadow-none text-sm font-bold text-slate-800 placeholder:text-slate-400 placeholder:font-medium pl-12 pr-8 py-2.5';
      case 'mobile':
        return 'w-full pl-11 pr-8 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-800 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none';
      case 'filter':
        return 'w-full border border-slate-200 rounded-xl text-sm bg-slate-50 py-3 pl-11 pr-8 focus:ring-2 focus:ring-primary/20 focus:border-primary font-bold text-slate-700 transition-all outline-none';
      case 'form':
        return 'w-full pl-12 pr-9 py-4 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm font-bold text-slate-800 transition-all outline-none';
      default:
        return 'w-full pl-10 pr-8 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none';
    }
  };

  const getIconStyles = () => {
    switch (variant) {
      case 'hero':
        return 'absolute left-5 text-primary-neutral text-xl pointer-events-none z-10';
      case 'navbar':
        return 'absolute left-4 text-slate-400 text-xl group-focus-within:text-primary transition-colors pointer-events-none';
      case 'mobile':
        return 'absolute left-3.5 text-slate-400 text-xl pointer-events-none';
      case 'filter':
        return 'absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-xl';
      case 'form':
        return 'absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-xl';
      default:
        return 'absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none';
    }
  };

  return (
    <div ref={containerRef} className={`${getContainerStyles()} ${className}`}>
      {/* Location Pin Icon */}
      <span className={`material-icons ${getIconStyles()}`}>
        location_on
      </span>

      {/* Main Input */}
      <input
        ref={inputRef}
        id={inputId}
        name={name}
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onFocus={() => setIsOpen(true)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        autoFocus={autoFocus}
        autoComplete="off"
        spellCheck={false}
        className={`${getInputStyles()} ${inputClassName}`}
      />

      {/* Clear Button */}
      {inputValue && (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Clear location"
          className="absolute right-3.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors z-10"
        >
          <span className="material-icons text-sm">close</span>
        </button>
      )}

      {/* Autocomplete Dropdown */}
      {isOpen && (
        <div
          className={`absolute top-[108%] left-0 w-full min-w-[280px] bg-white border border-slate-200 rounded-2xl shadow-2xl z-[100] overflow-hidden text-left animate-in fade-in slide-in-from-top-2 duration-150 ${dropdownClassName}`}
        >
          {/* Header indicator when showing popular cities */}
          {!inputValue.trim() && showPopularOnEmpty && (
            <div className="px-4 py-2.5 bg-slate-50/80 border-b border-slate-100 flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                <span className="material-icons text-xs text-primary">stars</span>
                Popular Cities in Canada
              </span>
              <span className="text-[9px] font-bold text-slate-400">10 Provinces</span>
            </div>
          )}

          {suggestions.length > 0 ? (
            <ul className="max-h-[320px] overflow-y-auto divide-y divide-slate-50 py-1">
              {suggestions.map((item, idx) => {
                const isSelected = idx === highlightedIndex;
                return (
                  <li
                    key={`${item.name}-${item.provinceCode}-${idx}`}
                    onMouseDown={(e) => {
                      e.preventDefault(); // Prevent input onBlur
                      handleSelect(item);
                    }}
                    onMouseEnter={() => setHighlightedIndex(idx)}
                    className={`px-4 py-3 flex items-center gap-3 cursor-pointer transition-colors ${
                      isSelected ? 'bg-primary/5 text-primary' : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                      item.isMainCity ? 'bg-primary/10 text-primary' : 'bg-slate-100 text-slate-400'
                    }`}>
                      <span className="material-icons text-base">
                        {item.isMainCity ? 'location_city' : 'place'}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-black truncate leading-tight">
                          {highlightMatch(item.name, inputValue)}
                        </p>
                        {item.isMainCity && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-primary/10 text-primary uppercase tracking-wider">
                            Main City
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 font-medium truncate mt-0.5">
                        {item.displaySubtitle}
                      </p>
                    </div>

                    <div className="shrink-0">
                      <span className="px-2 py-1 bg-slate-100 rounded-lg text-[10px] font-black text-slate-600 uppercase tracking-widest">
                        {item.provinceCode}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="p-6 text-center">
              <span className="material-icons text-slate-300 text-3xl mb-1 block">search_off</span>
              <p className="text-sm font-bold text-slate-700">No locations found</p>
              <p className="text-xs text-slate-400 mt-1">Try searching by province, main city, or sub-city</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LocationAutocomplete;

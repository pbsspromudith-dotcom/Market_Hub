"use client";

import React, { useEffect, useState } from "react";
import Link from 'next/link';
import { formatPrice } from "../constants";
import { calculateDistance, getExpandedLocationKeywords, extractCityName, isLocationMatch } from "../utils";
import LocationAutocomplete from "@/components/LocationAutocomplete";
import { 
  Home as HomeIcon, 
  Building2, 
  Car, 
  Briefcase, 
  Wrench, 
  Calendar, 
  Users, 
  ShoppingBag, 
  Store, 
  Megaphone,
  PawPrint,
  Trees,
  Laptop,
  Sparkles,
  Gamepad2,
  Folder
} from "lucide-react";

const OFFICIAL_CATEGORY_SYSTEM = [
  { name: "Vehicles", iconKey: "vehicles" },
  { name: "Real Estate", iconKey: "real estate" },
  { name: "Jobs", iconKey: "jobs" },
  { name: "Local Services", iconKey: "local services" },
  { name: "Buy & Sell", iconKey: "buy & sell" },
  { name: "Business & Industrial", iconKey: "business & industrial" },
  { name: "Community", iconKey: "community" },
  { name: "Pets", iconKey: "pets" },
  { name: "Home & Garden", iconKey: "home & garden" },
  { name: "Electronics & Computers", iconKey: "electronics & computers" },
  { name: "Fashion & Beauty", iconKey: "fashion & beauty" },
  { name: "Events & Entertainment", iconKey: "events & entertainment" },
];

export const CATEGORY_MEDIA_MAP: Record<string, {
  image: string;
  fallbackImage: string;
  icon: React.ElementType;
  textColor: string;
  badgeBg: string;
  tagline: string;
}> = {
  // Vehicles & Automotive
  "vehicles": {
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80",
    fallbackImage: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=600&q=80",
    icon: Car,
    textColor: "text-[#F2994A]",
    badgeBg: "bg-[#F2994A]/15 text-[#F2994A]",
    tagline: "Cars, Trucks & Parts"
  },
  "automotive": {
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80",
    fallbackImage: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=600&q=80",
    icon: Car,
    textColor: "text-[#F2994A]",
    badgeBg: "bg-[#F2994A]/15 text-[#F2994A]",
    tagline: "Cars, Trucks & Parts"
  },
  "cars": {
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80",
    fallbackImage: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=600&q=80",
    icon: Car,
    textColor: "text-[#F2994A]",
    badgeBg: "bg-[#F2994A]/15 text-[#F2994A]",
    tagline: "Cars, Trucks & Parts"
  },
  "directions_car": {
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80",
    fallbackImage: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=600&q=80",
    icon: Car,
    textColor: "text-[#F2994A]",
    badgeBg: "bg-[#F2994A]/15 text-[#F2994A]",
    tagline: "Cars, Trucks & Parts"
  },

  // Real Estate
  "real estate": {
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80",
    fallbackImage: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80",
    icon: Building2,
    textColor: "text-[#1774F5]",
    badgeBg: "bg-[#1774F5]/15 text-[#1774F5]",
    tagline: "Houses, Condos & Rentals"
  },
  "real-estate": {
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80",
    fallbackImage: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80",
    icon: Building2,
    textColor: "text-[#1774F5]",
    badgeBg: "bg-[#1774F5]/15 text-[#1774F5]",
    tagline: "Houses, Condos & Rentals"
  },
  "property": {
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80",
    fallbackImage: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80",
    icon: Building2,
    textColor: "text-[#1774F5]",
    badgeBg: "bg-[#1774F5]/15 text-[#1774F5]",
    tagline: "Houses, Condos & Rentals"
  },
  "real_estate_agent": {
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80",
    fallbackImage: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80",
    icon: Building2,
    textColor: "text-[#1774F5]",
    badgeBg: "bg-[#1774F5]/15 text-[#1774F5]",
    tagline: "Houses, Condos & Rentals"
  },

  // Jobs
  "jobs": {
    image: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=600&q=80",
    fallbackImage: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=600&q=80",
    icon: Briefcase,
    textColor: "text-[#27AE60]",
    badgeBg: "bg-[#27AE60]/15 text-[#27AE60]",
    tagline: "Careers & Hiring"
  },
  "careers": {
    image: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=600&q=80",
    fallbackImage: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=600&q=80",
    icon: Briefcase,
    textColor: "text-[#27AE60]",
    badgeBg: "bg-[#27AE60]/15 text-[#27AE60]",
    tagline: "Careers & Hiring"
  },
  "work": {
    image: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=600&q=80",
    fallbackImage: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=600&q=80",
    icon: Briefcase,
    textColor: "text-[#27AE60]",
    badgeBg: "bg-[#27AE60]/15 text-[#27AE60]",
    tagline: "Careers & Hiring"
  },

  // Services
  "local services": {
    image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80",
    fallbackImage: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80",
    icon: Wrench,
    textColor: "text-[#0284C7]",
    badgeBg: "bg-[#0284C7]/15 text-[#0284C7]",
    tagline: "Contractors & Skilled Help"
  },
  "services": {
    image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80",
    fallbackImage: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80",
    icon: Wrench,
    textColor: "text-[#0284C7]",
    badgeBg: "bg-[#0284C7]/15 text-[#0284C7]",
    tagline: "Contractors & Skilled Help"
  },
  "handyman": {
    image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80",
    fallbackImage: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80",
    icon: Wrench,
    textColor: "text-[#0284C7]",
    badgeBg: "bg-[#0284C7]/15 text-[#0284C7]",
    tagline: "Contractors & Skilled Help"
  },
  "build": {
    image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80",
    fallbackImage: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80",
    icon: Wrench,
    textColor: "text-[#0284C7]",
    badgeBg: "bg-[#0284C7]/15 text-[#0284C7]",
    tagline: "Contractors & Skilled Help"
  },

  // Buy & Sell
  "buy & sell": {
    image: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=600&q=80",
    fallbackImage: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=600&q=80",
    icon: ShoppingBag,
    textColor: "text-[#8B5CF6]",
    badgeBg: "bg-[#8B5CF6]/15 text-[#8B5CF6]",
    tagline: "Items, Goods & Deals"
  },
  "buy and sell": {
    image: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=600&q=80",
    fallbackImage: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=600&q=80",
    icon: ShoppingBag,
    textColor: "text-[#8B5CF6]",
    badgeBg: "bg-[#8B5CF6]/15 text-[#8B5CF6]",
    tagline: "Items, Goods & Deals"
  },
  "buy-sell": {
    image: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=600&q=80",
    fallbackImage: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=600&q=80",
    icon: ShoppingBag,
    textColor: "text-[#8B5CF6]",
    badgeBg: "bg-[#8B5CF6]/15 text-[#8B5CF6]",
    tagline: "Items, Goods & Deals"
  },
  "shopping_cart": {
    image: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=600&q=80",
    fallbackImage: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=600&q=80",
    icon: ShoppingBag,
    textColor: "text-[#8B5CF6]",
    badgeBg: "bg-[#8B5CF6]/15 text-[#8B5CF6]",
    tagline: "Items, Goods & Deals"
  },
  "shopping_bag": {
    image: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=600&q=80",
    fallbackImage: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=600&q=80",
    icon: ShoppingBag,
    textColor: "text-[#8B5CF6]",
    badgeBg: "bg-[#8B5CF6]/15 text-[#8B5CF6]",
    tagline: "Items, Goods & Deals"
  },

  // Business & Industrial
  "business & industrial": {
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&q=80",
    fallbackImage: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=600&q=80",
    icon: Store,
    textColor: "text-[#EA580C]",
    badgeBg: "bg-[#EA580C]/15 text-[#EA580C]",
    tagline: "Commercial & Machinery"
  },
  "business and industrial": {
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&q=80",
    fallbackImage: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=600&q=80",
    icon: Store,
    textColor: "text-[#EA580C]",
    badgeBg: "bg-[#EA580C]/15 text-[#EA580C]",
    tagline: "Commercial & Machinery"
  },
  "business-industrial": {
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&q=80",
    fallbackImage: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=600&q=80",
    icon: Store,
    textColor: "text-[#EA580C]",
    badgeBg: "bg-[#EA580C]/15 text-[#EA580C]",
    tagline: "Commercial & Machinery"
  },
  "businesses": {
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&q=80",
    fallbackImage: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=600&q=80",
    icon: Store,
    textColor: "text-[#EA580C]",
    badgeBg: "bg-[#EA580C]/15 text-[#EA580C]",
    tagline: "Commercial & Machinery"
  },
  "business": {
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&q=80",
    fallbackImage: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=600&q=80",
    icon: Store,
    textColor: "text-[#EA580C]",
    badgeBg: "bg-[#EA580C]/15 text-[#EA580C]",
    tagline: "Commercial & Machinery"
  },

  // Community
  "community": {
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=600&q=80",
    fallbackImage: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=600&q=80",
    icon: Users,
    textColor: "text-[#DC2626]",
    badgeBg: "bg-[#DC2626]/15 text-[#DC2626]",
    tagline: "Groups & Local Activities"
  },
  "people": {
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=600&q=80",
    fallbackImage: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=600&q=80",
    icon: Users,
    textColor: "text-[#DC2626]",
    badgeBg: "bg-[#DC2626]/15 text-[#DC2626]",
    tagline: "Groups & Local Activities"
  },

  // Pets
  "pets": {
    image: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=600&q=80",
    fallbackImage: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80",
    icon: PawPrint,
    textColor: "text-[#D97706]",
    badgeBg: "bg-[#D97706]/15 text-[#D97706]",
    tagline: "Dogs, Cats & Supplies"
  },
  "pet": {
    image: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=600&q=80",
    fallbackImage: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80",
    icon: PawPrint,
    textColor: "text-[#D97706]",
    badgeBg: "bg-[#D97706]/15 text-[#D97706]",
    tagline: "Dogs, Cats & Supplies"
  },
  "animals": {
    image: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=600&q=80",
    fallbackImage: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80",
    icon: PawPrint,
    textColor: "text-[#D97706]",
    badgeBg: "bg-[#D97706]/15 text-[#D97706]",
    tagline: "Dogs, Cats & Supplies"
  },

  // Home & Garden
  "home & garden": {
    image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80",
    fallbackImage: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=600&q=80",
    icon: Trees,
    textColor: "text-[#16A34A]",
    badgeBg: "bg-[#16A34A]/15 text-[#16A34A]",
    tagline: "Furniture, Decor & Patio"
  },
  "home and garden": {
    image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80",
    fallbackImage: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=600&q=80",
    icon: Trees,
    textColor: "text-[#16A34A]",
    badgeBg: "bg-[#16A34A]/15 text-[#16A34A]",
    tagline: "Furniture, Decor & Patio"
  },
  "home-garden": {
    image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80",
    fallbackImage: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=600&q=80",
    icon: Trees,
    textColor: "text-[#16A34A]",
    badgeBg: "bg-[#16A34A]/15 text-[#16A34A]",
    tagline: "Furniture, Decor & Patio"
  },
  "garden": {
    image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80",
    fallbackImage: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=600&q=80",
    icon: Trees,
    textColor: "text-[#16A34A]",
    badgeBg: "bg-[#16A34A]/15 text-[#16A34A]",
    tagline: "Furniture, Decor & Patio"
  },
  "yard": {
    image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80",
    fallbackImage: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=600&q=80",
    icon: Trees,
    textColor: "text-[#16A34A]",
    badgeBg: "bg-[#16A34A]/15 text-[#16A34A]",
    tagline: "Furniture, Decor & Patio"
  },

  // Electronics & Computers
  "electronics & computers": {
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=600&q=80",
    fallbackImage: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=600&q=80",
    icon: Laptop,
    textColor: "text-[#4F46E5]",
    badgeBg: "bg-[#4F46E5]/15 text-[#4F46E5]",
    tagline: "Laptops, Phones & Tech"
  },
  "electronics and computers": {
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=600&q=80",
    fallbackImage: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=600&q=80",
    icon: Laptop,
    textColor: "text-[#4F46E5]",
    badgeBg: "bg-[#4F46E5]/15 text-[#4F46E5]",
    tagline: "Laptops, Phones & Tech"
  },
  "electronics-computers": {
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=600&q=80",
    fallbackImage: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=600&q=80",
    icon: Laptop,
    textColor: "text-[#4F46E5]",
    badgeBg: "bg-[#4F46E5]/15 text-[#4F46E5]",
    tagline: "Laptops, Phones & Tech"
  },
  "electronics": {
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=600&q=80",
    fallbackImage: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=600&q=80",
    icon: Laptop,
    textColor: "text-[#4F46E5]",
    badgeBg: "bg-[#4F46E5]/15 text-[#4F46E5]",
    tagline: "Laptops, Phones & Tech"
  },
  "computers": {
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=600&q=80",
    fallbackImage: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=600&q=80",
    icon: Laptop,
    textColor: "text-[#4F46E5]",
    badgeBg: "bg-[#4F46E5]/15 text-[#4F46E5]",
    tagline: "Laptops, Phones & Tech"
  },
  "computer": {
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=600&q=80",
    fallbackImage: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=600&q=80",
    icon: Laptop,
    textColor: "text-[#4F46E5]",
    badgeBg: "bg-[#4F46E5]/15 text-[#4F46E5]",
    tagline: "Laptops, Phones & Tech"
  },

  // Fashion & Beauty
  "fashion & beauty": {
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=600&q=80",
    fallbackImage: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=600&q=80",
    icon: Sparkles,
    textColor: "text-[#DB2777]",
    badgeBg: "bg-[#DB2777]/15 text-[#DB2777]",
    tagline: "Apparel, Shoes & Style"
  },
  "fashion and beauty": {
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=600&q=80",
    fallbackImage: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=600&q=80",
    icon: Sparkles,
    textColor: "text-[#DB2777]",
    badgeBg: "bg-[#DB2777]/15 text-[#DB2777]",
    tagline: "Apparel, Shoes & Style"
  },
  "fashion-beauty": {
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=600&q=80",
    fallbackImage: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=600&q=80",
    icon: Sparkles,
    textColor: "text-[#DB2777]",
    badgeBg: "bg-[#DB2777]/15 text-[#DB2777]",
    tagline: "Apparel, Shoes & Style"
  },
  "fashion": {
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=600&q=80",
    fallbackImage: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=600&q=80",
    icon: Sparkles,
    textColor: "text-[#DB2777]",
    badgeBg: "bg-[#DB2777]/15 text-[#DB2777]",
    tagline: "Apparel, Shoes & Style"
  },
  "beauty": {
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=600&q=80",
    fallbackImage: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=600&q=80",
    icon: Sparkles,
    textColor: "text-[#DB2777]",
    badgeBg: "bg-[#DB2777]/15 text-[#DB2777]",
    tagline: "Apparel, Shoes & Style"
  },
  "checkroom": {
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=600&q=80",
    fallbackImage: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=600&q=80",
    icon: Sparkles,
    textColor: "text-[#DB2777]",
    badgeBg: "bg-[#DB2777]/15 text-[#DB2777]",
    tagline: "Apparel, Shoes & Style"
  },

  // Events & Entertainment
  "events & entertainment": {
    image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=600&q=80",
    fallbackImage: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80",
    icon: Calendar,
    textColor: "text-[#CA8A04]",
    badgeBg: "bg-[#CA8A04]/15 text-[#CA8A04]",
    tagline: "Concerts, Tickets & Fun"
  },
  "events and entertainment": {
    image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=600&q=80",
    fallbackImage: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80",
    icon: Calendar,
    textColor: "text-[#CA8A04]",
    badgeBg: "bg-[#CA8A04]/15 text-[#CA8A04]",
    tagline: "Concerts, Tickets & Fun"
  },
  "events": {
    image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=600&q=80",
    fallbackImage: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80",
    icon: Calendar,
    textColor: "text-[#CA8A04]",
    badgeBg: "bg-[#CA8A04]/15 text-[#CA8A04]",
    tagline: "Concerts, Tickets & Fun"
  },

  // Hobbies & Recreation
  "hobbies & recreation": {
    image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=600&q=80",
    fallbackImage: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80",
    icon: Gamepad2,
    textColor: "text-[#9333EA]",
    badgeBg: "bg-[#9333EA]/15 text-[#9333EA]",
    tagline: "Sports, Games & Gear"
  },
  "hobbies and recreation": {
    image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=600&q=80",
    fallbackImage: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80",
    icon: Gamepad2,
    textColor: "text-[#9333EA]",
    badgeBg: "bg-[#9333EA]/15 text-[#9333EA]",
    tagline: "Sports, Games & Gear"
  },
  "hobbies": {
    image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=600&q=80",
    fallbackImage: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80",
    icon: Gamepad2,
    textColor: "text-[#9333EA]",
    badgeBg: "bg-[#9333EA]/15 text-[#9333EA]",
    tagline: "Sports, Games & Gear"
  },
  "recreation": {
    image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=600&q=80",
    fallbackImage: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80",
    icon: Gamepad2,
    textColor: "text-[#9333EA]",
    badgeBg: "bg-[#9333EA]/15 text-[#9333EA]",
    tagline: "Sports, Games & Gear"
  },
  "sports_esports": {
    image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=600&q=80",
    fallbackImage: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80",
    icon: Gamepad2,
    textColor: "text-[#9333EA]",
    badgeBg: "bg-[#9333EA]/15 text-[#9333EA]",
    tagline: "Sports, Games & Gear"
  },

  // Promotions & Marketplace
  "promotions": {
    image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=600&q=80",
    fallbackImage: "https://images.unsplash.com/photo-1526178613552-2b45c6c302f0?auto=format&fit=crop&w=600&q=80",
    icon: Megaphone,
    textColor: "text-[#FD3D28]",
    badgeBg: "bg-[#FD3D28]/15 text-[#FD3D28]",
    tagline: "Special Deals & Offers"
  },
  "marketplace": {
    image: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=600&q=80",
    fallbackImage: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=600&q=80",
    icon: HomeIcon,
    textColor: "text-[#FD3D28]",
    badgeBg: "bg-[#FD3D28]/15 text-[#FD3D28]",
    tagline: "All Market Categories"
  },
};

const getCategoryMediaConfig = (name: string, iconHint?: string | null) => {
  if (iconHint) {
    const hintKey = iconHint.toLowerCase().trim();
    if (CATEGORY_MEDIA_MAP[hintKey]) return CATEGORY_MEDIA_MAP[hintKey];
  }
  const key = name.toLowerCase().trim();
  if (CATEGORY_MEDIA_MAP[key]) return CATEGORY_MEDIA_MAP[key];
  for (const k of Object.keys(CATEGORY_MEDIA_MAP)) {
    if (key.includes(k) || k.includes(key)) return CATEGORY_MEDIA_MAP[k];
  }
  return {
    image: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=600&q=80",
    fallbackImage: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=600&q=80",
    icon: ShoppingBag,
    textColor: "text-[#FD3D28]",
    badgeBg: "bg-[#FD3D28]/15 text-[#FD3D28]",
    tagline: "Explore Listings"
  };
};

interface HomeProps {
  isLoggedIn: boolean;
  initialCategories?: any[];
  initialSeoSettings?: Record<string, string>;
}

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

const Home: React.FC<HomeProps> = ({ isLoggedIn, initialCategories = [], initialSeoSettings = {} }) => {
  const [categories, setCategories] = useState<any[]>(initialCategories);
  const [heroText, setHeroText] = useState({
    title1: initialSeoSettings.homepage_hero_title_1 || "Find what you need,",
    title2: initialSeoSettings.homepage_hero_title_2 || "right in your community.",
    tag1: initialSeoSettings.homepage_hero_tag_1 || "Free Ads.",
    tag2: initialSeoSettings.homepage_hero_tag_2 || "Sell Fast.",
    tag3: initialSeoSettings.homepage_hero_tag_3 || "Buy Local.",
    tag4: initialSeoSettings.homepage_hero_tag_4 || "Canada-Wide."
  });
  const [homepageAdCount, setHomepageAdCount] = useState(
    parseInt(initialSeoSettings.homepage_ad_count || "12", 10) || 12
  );

  const [serverMessage, setServerMessage] = useState<string>(
    "Checking backend connection...",
  );
  const [listings, setListings] = useState<any[]>([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [locationSearch, setLocationSearch] = useState(() => {
    if (typeof window === "undefined") return "Toronto, ON";
    return localStorage.getItem("user_location") || "Toronto, ON";
  });

  const handleSelectLocation = (place: any) => {
    const cleanAddr = place.fullAddress || getCleanAddressString(place);
    setLocationSearch(cleanAddr);
    localStorage.setItem("user_location", cleanAddr);
    if (place.lat && place.lon) {
      localStorage.setItem("user_lat", place.lat);
      localStorage.setItem("user_lon", place.lon);
    }
    window.dispatchEvent(new Event("location_updated"));
  };

  const loadListings = (loc?: string) => {
    const activeLoc = loc !== undefined ? loc : (localStorage.getItem("user_location") || locationSearch || "Toronto, ON");
    const endpoint = activeLoc ? `/api/listings/read?location=${encodeURIComponent(activeLoc)}` : "/api/listings/read";
    fetch(endpoint)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setListings(data);
        } else if (data && Array.isArray(data.data)) {
          setListings(data.data);
        } else {
          setListings([]);
        }
      })
      .catch((err) => console.error("DB fetch error", err));
  };

  useEffect(() => {
    fetch("/api/status")
      .then((res) => res.json())
      .then((data) => setServerMessage(data.message))
      .catch((err) =>
        setServerMessage("Backend is not running: " + err.message),
      );

    const currentLoc = localStorage.getItem("user_location") || locationSearch || "Toronto, ON";
    loadListings(currentLoc);

    const handleLocationUpdate = () => {
      const updatedLoc = localStorage.getItem("user_location") || "Toronto, ON";
      setLocationSearch(updatedLoc);
      loadListings(updatedLoc);
    };

    window.addEventListener("location_updated", handleLocationUpdate);
    return () =>
      window.removeEventListener("location_updated", handleLocationUpdate);
  }, []);

  return (
    <div className="overflow-x-hidden w-full">
      {/* Hero Section */}
      <section className="bg-gradient-mesh border-b border-slate-100 pt-10 pb-12 sm:pt-16 sm:pb-18 md:pt-20 md:pb-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-72 sm:w-96 h-72 sm:h-96 bg-primary-soft/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 sm:w-80 h-64 sm:h-80 bg-primary-light/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="w-full max-w-6xl px-4 sm:px-6 lg:px-10 text-center relative z-10 mx-auto">
          <span className="inline-block py-1.5 px-4 rounded-full bg-primary-soft/20 text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-4 sm:mb-6">
            Global Standards. Local Trading.
          </span>
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-4 sm:mb-6 tracking-tight text-slate-900 leading-[1.15]">
            {heroText.title1}
            <br />
            <span className="text-primary-light">{heroText.title2}</span>
          </h1>
          <p className="text-sm sm:text-lg md:text-xl mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed font-bold flex flex-wrap items-center justify-center gap-2 sm:gap-4">
            <span className="w-8 sm:w-10 h-[2px] bg-secondary hidden sm:inline-block"></span>
            <span className="text-slate-800">{heroText.tag1}</span>
            <span className="text-secondary">{heroText.tag2}</span>
            <span className="text-[#1a2e5a]">{heroText.tag3}</span>
            <span className="text-secondary">{heroText.tag4}</span>
            <span className="w-8 sm:w-10 h-[2px] bg-secondary hidden sm:inline-block"></span>
          </p>

          <div className="max-w-4xl mx-auto bg-white p-2 sm:p-2.5 rounded-2xl sm:rounded-[2.5rem] shadow-xl sm:shadow-2xl shadow-primary-neutral/20 border border-slate-200/80 flex flex-col md:flex-row gap-2">
            <div className="flex-grow relative flex items-center min-h-[48px]">
              <span className="material-icons absolute left-4 sm:left-5 text-slate-400 text-xl pointer-events-none">
                search
              </span>
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search for anything"
                className="w-full pl-11 sm:pl-14 pr-4 py-3 sm:py-4 bg-transparent border-0 border-none outline-none focus:outline-none focus:ring-0 focus:border-none focus-visible:outline-none shadow-none text-xs sm:text-sm font-semibold text-slate-800 placeholder:text-slate-400"
                placeholder="Search for anything..."
                type="text"
              />
            </div>
            <div className="w-px h-8 bg-slate-200 self-center hidden md:block"></div>
            <div className="w-full md:w-72 relative flex items-center">
              <LocationAutocomplete
                value={locationSearch}
                onChange={(val) => setLocationSearch(val)}
                onSelectLocation={(item) => handleSelectLocation(item)}
                variant="hero"
                placeholder="City, Province or Postal Code..."
                syncWithLocalStorage={true}
              />
            </div>
            <Link 
              href={`/search?q=${encodeURIComponent(searchQuery)}&loc=${encodeURIComponent(locationSearch)}`}
              onClick={() => window.scrollTo(0, 0)}
              className="w-full md:w-auto bg-secondary hover:bg-secondary-hover text-white px-8 sm:px-10 py-3.5 sm:py-4 rounded-xl sm:rounded-[1.8rem] font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center shadow-lg shadow-secondary/25 active:scale-95 shrink-0"
            >
              Explore
            </Link>
          </div>

          <div className="mt-8 sm:mt-12 flex flex-wrap justify-center gap-4 sm:gap-8 text-[11px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="material-icons text-primary-light text-sm sm:text-base">
                verified
              </span>{" "}
              Trusted Users
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="material-icons text-primary-light text-sm sm:text-base">
                security
              </span>{" "}
              Encrypted Data
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="material-icons text-primary-light text-sm sm:text-base">
                forum
              </span>{" "}
              Direct Chat
            </div>
          </div>
        </div>
      </section>

      <main className="w-full max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-10 py-10 sm:py-16 md:py-20">
        {/* Categories Grid Section */}
        <section className="mb-16 sm:mb-24 md:mb-28">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3 mb-6 sm:mb-10">
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-1 sm:mb-2">
                Explore Categories
              </h2>
              <p className="text-slate-500 font-medium text-xs sm:text-sm md:text-base">
                Browse thousands of curated listings across Canada
              </p>
            </div>
            <Link 
              href="/search"
              className="text-xs font-black text-primary uppercase tracking-widest hover:underline flex items-center gap-1 shrink-0"
            >
              All Categories <span className="material-icons text-sm">arrow_forward</span>
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-5 lg:gap-6">
            {(categories && categories.length >= 10 ? categories : OFFICIAL_CATEGORY_SYSTEM).map((cat) => {
              const catName = cat.name;
              const config = getCategoryMediaConfig(catName, cat.icon || cat.iconKey);
              const IconComponent = config.icon;

              return (
                <Link
                  key={catName} 
                  href={`/search?cat=${encodeURIComponent(catName)}`}
                  onClick={() => window.scrollTo(0, 0)}
                  className="group relative bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 hover:border-primary/60 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 overflow-hidden flex flex-col"
                >
                  {/* Category Representative Image */}
                  <div className="relative w-full aspect-[16/11] sm:aspect-[16/10] bg-slate-100 overflow-hidden">
                    <img
                      src={config.image}
                      alt={catName}
                      loading="lazy"
                      onError={(e) => {
                        if (e.currentTarget.src !== config.fallbackImage) {
                          e.currentTarget.src = config.fallbackImage;
                        }
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                    
                    {/* Floating Category Icon Badge */}
                    <div className={`absolute top-2.5 right-2.5 sm:top-3.5 sm:right-3.5 w-8 h-8 sm:w-10 sm:h-10 ${config.badgeBg} backdrop-blur-md rounded-xl sm:rounded-2xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                      <IconComponent
                        size={18}
                        strokeWidth={2.5}
                        className={config.textColor}
                      />
                    </div>
                  </div>

                  {/* Category Title & Tagline */}
                  <div className="p-3.5 sm:p-5 text-center flex flex-col items-center justify-center flex-grow bg-white">
                    <span className="text-xs sm:text-sm md:text-base font-black text-slate-800 uppercase tracking-wider group-hover:text-primary transition-colors line-clamp-1">
                      {catName}
                    </span>
                    {config.tagline && (
                      <span className="text-[11px] sm:text-xs font-medium text-slate-400 mt-1 line-clamp-1">
                        {config.tagline}
                      </span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Home Page Featured Showcase Gallery */}
        {(() => {
          const activeLoc = locationSearch || (typeof window !== "undefined" ? localStorage.getItem("user_location") : "") || "";
          const homeGalleryItems = listings.filter((item: any) => {
            const isShowcase = item.is_home_gallery || item.is_home_page;
            if (!isShowcase) return false;
            return isLocationMatch(item.location, activeLoc);
          });
          if (homeGalleryItems.length === 0) return null;

          return (
            <section className="mb-16 sm:mb-20 bg-gradient-to-br from-blue-900/5 via-indigo-900/5 to-slate-900/5 p-5 sm:p-8 md:p-10 rounded-2xl sm:rounded-[3rem] border border-blue-100/80 shadow-sm relative overflow-hidden">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-6 sm:mb-8">
                <div>
                  <span className="inline-flex items-center gap-1.5 py-1 px-3.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-black uppercase tracking-widest mb-2 shadow-xs">
                    <span className="material-icons text-sm">home</span> Home Page Exclusives
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                    Home Page Showcase Gallery
                  </h2>
                  <p className="text-slate-500 font-medium text-xs sm:text-sm">
                    Premium featured listings displayed directly on the homepage
                  </p>
                </div>
                <Link 
                  href="/search"
                  onClick={() => window.scrollTo(0, 0)}
                  className="text-xs font-black text-blue-600 hover:text-blue-800 uppercase tracking-widest flex items-center gap-1 hover:underline shrink-0"
                >
                  View All Listings <span className="material-icons text-sm">arrow_forward</span>
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {homeGalleryItems.map((item: any) => (
                  <Link 
                    key={item.id} 
                    href={`/item/${item.id}`}
                    onClick={() => window.scrollTo(0, 0)}
                    className="group bg-white rounded-2xl sm:rounded-[2rem] border border-blue-200/80 overflow-hidden shadow-lg shadow-blue-500/5 hover:shadow-2xl hover:border-blue-500 transition-all duration-300 flex flex-col"
                  >
                    <div className="aspect-[16/10] relative bg-slate-100 overflow-hidden">
                      <img
                        src={item.image || "https://picsum.photos/seed/default/800/600"}
                        alt={item.title}
                        loading="lazy"
                        className="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[10px] font-black px-3 py-1.5 rounded-xl shadow-md uppercase tracking-wider flex items-center gap-1">
                        <span className="material-icons text-xs">home</span> Home Page Showcase
                      </span>
                    </div>

                    <div className="p-5 sm:p-6 flex flex-col flex-grow">
                      <div className="text-primary font-black text-lg sm:text-xl mb-1">
                        {formatPrice(item.price, item.price_type)}
                      </div>
                      <h3 className="font-bold text-slate-900 line-clamp-2 min-h-[2.5rem] text-sm sm:text-base group-hover:text-blue-600 transition-colors mb-4">
                        {item.title}
                      </h3>

                      <div className="mt-auto pt-3 border-t border-slate-100 flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        <span className="flex items-center gap-1">
                          <span className="material-icons text-xs">location_on</span>
                          {item.location || 'Canada'}
                        </span>
                        <span className="text-blue-600 font-black">HOME PAGE PROMOTED</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          );
        })()}

        {/* Recently Added Section - 4 Ads in 1 Row & Fully Responsive */}
        <section className="mb-14 sm:mb-20">
          <div className="flex justify-between items-end mb-6 sm:mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-1">Recently Added</h2>
              <p className="text-slate-500 font-medium text-xs sm:text-sm">
                New items posted in your area
              </p>
            </div>
            <Link 
              href="/search"
              onClick={() => window.scrollTo(0, 0)}
              className="text-xs font-black text-primary uppercase tracking-widest hover:underline shrink-0"
            >
              See All
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {listings
              .filter((item: any) => {
                const activeLoc = locationSearch || (typeof window !== "undefined" ? localStorage.getItem("user_location") : "") || "";
                return isLocationMatch(item.location, activeLoc);
              })
              .slice(0, homepageAdCount)
              .map((item: any) => (
              <Link 
                href={`/item/${item.id}`}
                key={item.id}
                onClick={() => window.scrollTo(0, 0)}
                className={`group rounded-2xl sm:rounded-[2rem] border border-slate-200/80 overflow-hidden hover:shadow-xl hover:border-primary/40 transition-all flex flex-col ${item.is_featured ? 'bg-accent-beige' : 'bg-white'}`}
              >
                <div className="aspect-[4/3] relative flex items-center justify-center bg-slate-100 overflow-hidden">
                  <img
                    src={
                      item.image ||
                      "https://picsum.photos/seed/default/800/600"
                    }
                    alt={item.title}
                    loading="lazy"
                    width="800"
                    height="600"
                    decoding="async"
                    className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                  />
                  <button 
                    aria-label="Add to favorites"
                    className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 w-9 h-9 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors shadow-sm"
                  >
                    <span className="material-icons text-lg">
                      favorite_border
                    </span>
                  </button>
                  {item.is_featured ? (
                    <div className="absolute top-3.5 left-3.5 sm:top-4 sm:left-4 bg-accent-gold text-charcoal text-[10px] font-black px-2.5 py-1 rounded-xl shadow-lg">
                      FEATURED
                    </div>
                  ) : null}
                </div>
                <div className="p-4 sm:p-6 flex flex-col flex-grow">
                  <div className="text-slate-900 font-black text-xl sm:text-2xl mb-1 sm:mb-2">
                    {formatPrice(item.price, item.price_type)}
                  </div>
                  <h3 className="font-bold text-slate-800 line-clamp-2 min-h-[2.5rem] sm:min-h-[3rem] text-sm sm:text-base group-hover:text-primary transition-colors mb-4">
                    {item.title}
                  </h3>
                  <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest pt-3 sm:pt-4 mt-auto border-t border-slate-100">
                    <span className="flex items-center gap-1 truncate">
                      <span className="material-icons text-[12px] text-slate-gray">
                        schedule
                      </span>{" "}
                      {item.created_at ? new Date(item.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : (item.time || "Recently")}
                    </span>
                    <span className="flex items-center gap-1 shrink-0 ml-2">
                      <span className="material-icons text-[12px] text-slate-gray">
                        location_on
                      </span>{" "}
                      {item.location || 'Canada'}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Community & Trust Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {!isLoggedIn && (
            <div className="bg-secondary rounded-2xl sm:rounded-[2.5rem] p-6 sm:p-8 text-white relative overflow-hidden group shadow-lg shadow-secondary/15 flex flex-col justify-between">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-colors"></div>
              <div>
                <h3 className="text-xl sm:text-2xl font-black mb-2 sm:mb-3 relative z-10">
                  Join HitAds
                </h3>
                <p className="text-white/90 text-xs sm:text-sm mb-6 leading-relaxed relative z-10 font-medium max-w-md">
                  Create a free account to contact sellers, post your own ads, and save your favorite items across Canada.
                </p>
              </div>
              <Link 
                href="/login"
                onClick={() => window.scrollTo(0, 0)}
                className="inline-block w-full sm:w-auto self-start bg-white text-slate-900 font-black py-3.5 px-8 rounded-xl sm:rounded-2xl text-center transition-all shadow-lg hover:bg-slate-100 text-xs sm:text-sm uppercase tracking-wider"
              >
                Join Free
              </Link>
            </div>
          )}

          <div className={`bg-white rounded-2xl sm:rounded-[2.5rem] border border-slate-200/80 p-6 sm:p-8 shadow-sm flex flex-col justify-between ${isLoggedIn ? 'md:col-span-2' : ''}`}>
            <div>
              <div className="flex items-center gap-3 mb-4 sm:mb-5">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary-soft/20 rounded-xl sm:rounded-2xl flex items-center justify-center text-primary shrink-0">
                  <span className="material-icons text-xl sm:text-2xl">shield</span>
                </div>
                <div>
                  <h3 className="font-black text-base sm:text-lg text-slate-900">
                    Safety First
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    We prioritize secure trading and verified interactions for every user on our platform.
                  </p>
                </div>
              </div>

              <ul className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 my-4 sm:my-6">
                {[
                  "Verified Identities",
                  "Safe Exchange Zones",
                  "Secure Messaging",
                ].map((t) => (
                  <li
                    key={t}
                    className="flex items-center gap-2 text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100"
                  >
                    <span className="material-icons text-primary text-sm sm:text-base shrink-0">
                      check_circle
                    </span>
                    <span className="truncate">{t}</span>
                  </li>
                ))}
              </ul>
            </div>
            <Link 
              href="/help"
              onClick={() => window.scrollTo(0, 0)}
              className="text-xs font-black text-primary hover:underline uppercase tracking-widest inline-flex items-center gap-1 self-start"
            >
              Learn More <span className="material-icons text-xs">arrow_forward</span>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;

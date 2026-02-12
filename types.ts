
export interface Listing {
  id: string;
  title: string;
  price: number;
  priceType?: 'fixed' | 'monthly' | 'free';
  category: string;
  location: string;
  time: string;
  image: string;
  isFeatured?: boolean;
  description?: string;
  stats?: {
    views: number;
    saves: number;
    inquiries: number;
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  avatar: string;
  joinDate: string;
  rating: number;
  reviews: number;
}

export enum AppRoute {
  Home = '/',
  Login = '/login',
  Search = '/search',
  ItemDetails = '/item/:id',
  PostAd = '/post-ad',
  UserDashboard = '/dashboard',
  UserListings = '/dashboard/listings',
  UserSettings = '/dashboard/settings',
  AdminDashboard = '/admin',
  AdminUsers = '/admin/users',
  AdminListings = '/admin/listings'
}

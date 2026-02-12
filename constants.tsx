
import { Listing, User } from './types';

export const MOCK_LISTINGS: Listing[] = [
  {
    id: '1',
    title: 'iPhone 13 Pro - 256GB - Unlocked - Mint Condition',
    price: 850,
    category: 'Electronics',
    location: 'Toronto, ON',
    time: '2 hours ago',
    image: 'https://picsum.photos/seed/iphone/800/600',
    isFeatured: true,
    description: 'Pristine condition iPhone 13 Pro. Fully unlocked and ready for a new owner.',
    stats: { views: 142, saves: 12, inquiries: 5 }
  },
  {
    id: '2',
    title: '2021 BMW M4 Competition - Low Mileage',
    price: 78500,
    category: 'Vehicles',
    location: 'Etobicoke, ON',
    time: '45 mins ago',
    image: 'https://picsum.photos/seed/car1/800/600',
    isFeatured: true,
    stats: { views: 248, saves: 34, inquiries: 12 }
  },
  {
    id: '3',
    title: 'Brand New Running Shoes - Size 10',
    price: 120,
    category: 'Buy & Sell',
    location: 'North York, ON',
    time: '5 hours ago',
    image: 'https://picsum.photos/seed/shoes/800/600',
    stats: { views: 89, saves: 4, inquiries: 2 }
  },
  {
    id: '4',
    title: 'Specialized Mountain Bike - 21 Speed',
    price: 450,
    category: 'Bikes',
    location: 'Scarborough, ON',
    time: '3 hours ago',
    image: 'https://picsum.photos/seed/bike/800/600',
    stats: { views: 156, saves: 18, inquiries: 7 }
  },
  {
    id: '5',
    title: '1 BR Condo - Downtown Core - All Inclusive',
    price: 2400,
    priceType: 'monthly',
    category: 'Real Estate',
    location: 'Toronto, ON',
    time: 'Just now',
    image: 'https://picsum.photos/seed/condo/800/600',
    stats: { views: 540, saves: 82, inquiries: 24 }
  }
];

export const CURRENT_USER: User = {
  id: 'u1',
  name: 'Alex Johnson',
  email: 'alex.j@example.com',
  role: 'admin',
  avatar: 'https://picsum.photos/seed/user1/100/100',
  joinDate: 'Feb 2021',
  rating: 4.8,
  reviews: 120
};

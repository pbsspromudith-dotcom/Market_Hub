
import { User } from './types';

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

export const formatPrice = (price: number | string, priceType?: string) => {
  if (priceType === "free") return "Free";
  if (priceType === "contact") return "Please Contact";
  if (priceType === "swap") return "Swap / Trade";
  const num = Number(price);
  return isNaN(num) ? "$0" : `$${num.toLocaleString()}`;
};

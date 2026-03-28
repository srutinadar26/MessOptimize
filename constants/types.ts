export type UserRole = 'student' | 'staff' | 'ngo';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  hostelName?: string;
  roomNumber?: string;
  streak: number;
  totalMealsSaved: number;
  moneySaved: number;
  co2Reduced: number;
}

export interface Meal {
  id: string;
  type: 'breakfast' | 'lunch' | 'dinner';
  date: string;
  marked: boolean;
  deadline: Date;
  items: string[];
}

export interface MenuItem {
  id: string;
  name: string;
  category: 'breakfast' | 'lunch' | 'dinner' | 'fastfood' | 'beverage' | 'dessert';
  description: string;
  tags: ('veg' | 'vegan' | 'non-veg' | 'jain' | 'gluten-free')[];
  spiceLevel: 0 | 1 | 2 | 3;
  upvotes: number;
  downvotes: number;
  userVote?: 'up' | 'down' | null;
  imageEmoji: string;
  day: number; // 0-6, 0 = Sunday
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  streak: number;
  mealsMissedReduced: number;
  points: number;
  badges: string[];
  isCurrentUser: boolean;
}

export interface MarketplaceItem {
  id: string;
  name: string;
  quantity: string;
  expiresAt: Date;
  postedBy: string;
  messName: string;
  category: string;
  claimedBy?: string;
  ngoVerified: boolean;
  imageEmoji: string;
  whatsappNumber: string;
}

export interface AnalyticsData {
  wasteReduced: number; // kg
  moneySaved: number; // INR
  co2Reduced: number; // kg
  peopleFed: number;
  weeklyWaste: { day: string; waste: number }[];
  mealTypeData: { type: string; count: number }[];
  categoryData: { category: string; percentage: number; color: string }[];
}

export interface MealHeadcount {
  date: string;
  breakfast: number;
  lunch: number;
  dinner: number;
  expectedBreakfast: number;
  expectedLunch: number;
  expectedDinner: number;
}

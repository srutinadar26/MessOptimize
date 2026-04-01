export type UserRole = 'student' | 'staff' | 'ngo';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  streak: number;
  totalMealsSaved: number;
  moneySaved: number;
  co2Reduced: number;
  hostelName?: string;      // ✅ Add this
  roomNumber?: string;      // ✅ Add this
  createdAt?: string;
}

export interface MealAttendance {
  date: string;
  breakfast: {
    status: boolean;
    markedAt: string | null;
    verifiedBy: 'self' | 'staff' | 'qr' | 'gps' | 'otp';
  };
  lunch: {
    status: boolean;
    markedAt: string | null;
    verifiedBy: 'self' | 'staff' | 'qr' | 'gps' | 'otp';
  };
  dinner: {
    status: boolean;
    markedAt: string | null;
    verifiedBy: 'self' | 'staff' | 'qr' | 'gps' | 'otp';
  };
}
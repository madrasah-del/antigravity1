
// Add ViewMode enum to satisfy imports in components/DayCard.tsx
export enum ViewMode {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export interface Booking {
  id: string; // ISO Date string or composite ID for uniqueness
  date: Date;
  name: string;
  phone: string;
  foodDetails?: string;
  isBooked: boolean;
  bookedBySessionId?: string;
  type?: 'iftar' | 'suhoor';
}

export interface RamadanDay {
  date: Date;
  dayNumber: number;
  isWeekend: boolean;
  expectedAttendance: number;
  booking?: Booking; // For normal days
  iftarBooking?: Booking; // Specific to Day 27
  suhoorBooking?: Booking; // Specific to Day 27
}

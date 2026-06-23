import type { CalendarMonth } from '../types';

// Mock calendar/pricing data modeled after the dashboard reference design.
export const augustCalendar: CalendarMonth = {
  label: 'Aug 2025',
  minNights: 2,
  weekendDays: [1, 2, 8, 9, 15, 16, 22, 23, 29, 30],
  discountDays: [11, 12, 13, 14, 24, 25, 26, 27, 28],
  ownerDays: [18, 19, 20],
  maintenanceDays: [31],
  prices: {
    1: 608, 2: 608, 3: 413, 4: 413, 5: 413, 6: 413, 7: 413,
    8: 523, 9: 523, 10: 523, 11: 295, 12: 295, 13: 295, 14: 295,
    15: 499, 16: 499, 17: 413, 18: 400, 19: 400, 20: 400, 21: 367,
    22: 367, 23: 367, 24: 523, 25: 295, 26: 295, 27: 295, 28: 295,
    29: 632, 30: 632, 31: 632,
  },
  bookings: [
    { startDate: 8, endDate: 10, label: '3 Nights / 2 Guests' },
    { startDate: 11, endDate: 15, label: '5 Nights / 3 Guests' },
    { startDate: 21, endDate: 23, label: '3 Nights / 2 Guests' },
    { startDate: 25, endDate: 29, label: '5 Nights / 2 Guests' },
    { startDate: 29, endDate: 31, label: '2 Nights / 2 Guests' },
  ],
};

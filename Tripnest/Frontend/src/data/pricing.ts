import type { PricingSettings } from '../types';

// Mock pricing rules for the active listing. Swap for API data later.
export const pricingSettings: PricingSettings = {
  baseRate: 413,
  weekendRate: 523,
  weeklyDiscountPercent: 10,
  monthlyDiscountPercent: 22,
  minNights: 2,
  cleaningFee: 75,
};

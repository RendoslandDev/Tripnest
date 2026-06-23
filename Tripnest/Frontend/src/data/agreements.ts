import type { Agreement } from '../types';

export const agreements: Agreement[] = [
  { id: 'AGR-2041', property: '2 Bedroom Apartment', landlord: 'Kwame Mensah', startDate: 'May 20, 2025', endDate: 'May 20, 2026', rent: 1200, period: 'month', status: 'active' },
  { id: 'AGR-2038', property: 'Studio Apartment', landlord: 'Yaw Boateng', startDate: 'May 1, 2025', endDate: 'May 8, 2025', rent: 700, period: 'week', status: 'pending' },
  { id: 'AGR-1990', property: '1 Bedroom Apartment', landlord: 'Yaw Boateng', startDate: 'Jan 5, 2025', endDate: 'Jan 20, 2025', rent: 850, period: 'month', status: 'expired' },
];

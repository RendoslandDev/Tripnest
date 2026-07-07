import type { EarningsSummary } from '../types';

// Mock landlord earnings. In production these are aggregated server-side from
// settled transactions and scheduled provider payouts (Paystack transfers).
export const earnings: EarningsSummary = {
  available: 4820,
  pending: 1340,
  thisMonth: 6160,
  lastMonth: 5480,
  lifetime: 48750,
  nextPayoutDate: 'Jul 1, 2025',
  transactions: [
    { id: 'TN-PAY-4912', date: 'Jun 22, 2025', guest: 'Ama Serwaa', listing: 'Sunlit Loft near Osu', gross: 1450, fee: 145, net: 1305, status: 'settled' },
    { id: 'TN-PAY-4905', date: 'Jun 18, 2025', guest: 'Kojo Antwi', listing: 'Garden Studio, East Legon', gross: 980, fee: 98, net: 882, status: 'settled' },
    { id: 'TN-PAY-4898', date: 'Jun 14, 2025', guest: 'Efua Boateng', listing: 'Hillside Family House', gross: 2200, fee: 220, net: 1980, status: 'pending' },
    { id: 'TN-PAY-4881', date: 'Jun 9, 2025', guest: 'Yaw Darko', listing: 'Sunlit Loft near Osu', gross: 1450, fee: 145, net: 1305, status: 'settled' },
    { id: 'TN-PAY-4870', date: 'Jun 3, 2025', guest: 'Adwoa Nyarko', listing: 'Beachfront Cabana', gross: 1750, fee: 175, net: 1575, status: 'settled' },
  ],
};

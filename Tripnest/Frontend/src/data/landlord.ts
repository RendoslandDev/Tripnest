import type { Inquiry, LandlordBooking, LandlordTenant, LandlordReview } from '../types';

export const inquiries: Inquiry[] = [
  { id: '1', guest: 'Ama Serwaa', listing: 'Sunlit Loft near Osu', message: 'Is the loft available from August? I’d need it for 6 months.', date: '2h ago', status: 'new' },
  { id: '2', guest: 'Kojo Antwi', listing: 'Garden Studio, East Legon', message: 'Could I schedule a viewing this weekend?', date: '5h ago', status: 'new' },
  { id: '3', guest: 'Efua Boateng', listing: 'Hillside Family House', message: 'Are utilities included in the monthly rent?', date: '1d ago', status: 'new' },
  { id: '4', guest: 'Yaw Darko', listing: 'Sunlit Loft near Osu', message: 'Do you allow pets? I have a small dog.', date: '2d ago', status: 'replied' },
  { id: '5', guest: 'Adwoa Nyarko', listing: 'Beachfront Cabana', message: 'Is the cabana available for a 2-week stay in September?', date: '3d ago', status: 'replied' },
];

export const landlordBookings: LandlordBooking[] = [
  { id: 'BK-7001', guest: 'Ama Serwaa', listing: 'Sunlit Loft near Osu', checkIn: 'Jul 1, 2025', checkOut: 'Jul 8, 2025', nights: 7, guests: 2, amount: 1015, status: 'pending' },
  { id: 'BK-6992', guest: 'Kojo Antwi', listing: 'Garden Studio, East Legon', checkIn: 'Jun 28, 2025', checkOut: 'Jul 5, 2025', nights: 7, guests: 1, amount: 686, status: 'confirmed' },
  { id: 'BK-6980', guest: 'Efua Boateng', listing: 'Hillside Family House', checkIn: 'Jun 24, 2025', checkOut: 'Jun 30, 2025', nights: 6, guests: 4, amount: 1320, status: 'checked-in' },
  { id: 'BK-6955', guest: 'Yaw Darko', listing: 'Sunlit Loft near Osu', checkIn: 'Jun 9, 2025', checkOut: 'Jun 16, 2025', nights: 7, guests: 2, amount: 1015, status: 'completed' },
  { id: 'BK-6940', guest: 'Adwoa Nyarko', listing: 'Beachfront Cabana', checkIn: 'Jun 3, 2025', checkOut: 'Jun 10, 2025', nights: 7, guests: 3, amount: 1225, status: 'completed' },
  { id: 'BK-6921', guest: 'Kwame Asare', listing: 'Garden Studio, East Legon', checkIn: 'May 30, 2025', checkOut: 'Jun 2, 2025', nights: 3, guests: 1, amount: 294, status: 'cancelled' },
];

export const landlordTenants: LandlordTenant[] = [
  { id: 'T-1', name: 'Efua Boateng', property: 'Hillside Family House', email: 'efua.b@example.com', phone: '+233 24 700 1010', since: 'Jan 2025', leaseEnd: 'Dec 2025', monthlyRent: 2200, standing: 'current' },
  { id: 'T-2', name: 'Kojo Antwi', property: 'Garden Studio, East Legon', email: 'kojo.a@example.com', phone: '+233 24 700 1020', since: 'Mar 2025', leaseEnd: 'Aug 2025', monthlyRent: 980, standing: 'ending-soon' },
  { id: 'T-3', name: 'Nana Yaa', property: 'Sunlit Loft near Osu', email: 'nana.yaa@example.com', phone: '+233 24 700 1030', since: 'Nov 2024', leaseEnd: 'Oct 2025', monthlyRent: 1450, standing: 'overdue' },
  { id: 'T-4', name: 'Kwesi Owusu', property: 'Beachfront Cabana', email: 'kwesi.o@example.com', phone: '+233 24 700 1040', since: 'Feb 2025', leaseEnd: 'Jan 2026', monthlyRent: 1750, standing: 'current' },
];

export const landlordReviews: LandlordReview[] = [
  { id: '1', guest: 'Yaw Darko', listing: 'Sunlit Loft near Osu', rating: 5, date: 'Jun 17, 2025', text: 'Spotless, great location and the host was super responsive. Would book again!' },
  { id: '2', guest: 'Adwoa Nyarko', listing: 'Beachfront Cabana', rating: 4, date: 'Jun 11, 2025', text: 'Beautiful spot right on the beach. Water pressure could be better but overall lovely.', reply: 'Thanks Adwoa! We’ve since serviced the pump — hope to host you again.' },
  { id: '3', guest: 'Kwame Asare', listing: 'Garden Studio, East Legon', rating: 5, date: 'Jun 2, 2025', text: 'Cosy, quiet and exactly as pictured. Check-in was seamless.' },
  { id: '4', guest: 'Efua Boateng', listing: 'Hillside Family House', rating: 4, date: 'May 28, 2025', text: 'Spacious house, perfect for our family. A little far from town but worth it.' },
  { id: '5', guest: 'Ama Serwaa', listing: 'Sunlit Loft near Osu', rating: 5, date: 'May 20, 2025', text: 'The SMS safety alerts gave me real peace of mind. Highly recommend this host.' },
];

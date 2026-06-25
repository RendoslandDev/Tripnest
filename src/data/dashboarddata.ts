import type {
  StatCard, Booking, MaintenanceItem,
  QuickAction, Message, TrustUser, PaymentLogo
} from '../types';

export const statCards: StatCard[] = [
  { label: 'Active Bookings', icon: 'ti-calendar-check', value: 2, link: 'View details →' },
  { label: 'Rent Paid', icon: 'ti-credit-card', value: 'GHC 2,400', sub: 'This month' },
  { label: 'Saved Properties', icon: 'ti-heart', value: 12, link: 'View list →' },
  { label: 'Open Maintenance', icon: 'ti-tools', value: 1, link: 'View details →', alert: true },
];

export const upcomingBooking: Booking = {
  id: '38492-PROP',
  title: '2 Bedroom Apartment',
  location: 'Tarkwa, Nsuaem',
  status: 'Confirmed',
  dateRange: 'May 20 — May 27, 2025',
  guests: 2,
  pricePerMonth: 1200,
  imgSrc: '/Images/product1.png',
};

export const maintenanceItems: MaintenanceItem[] = [
  { id: 'maint-1', description: 'Fix leaking tap in kitchen', reportedDate: 'May 15, 2025', status: 'Pending' },
  { id: 'maint-2', description: 'Repaint bedroom wall', reportedDate: 'May 10, 2025', status: 'In Progress' },
  { id: 'maint-3', description: 'Replace broken window latch', reportedDate: 'April 28, 2025', status: 'Resolved' },
  { id: 'maint-4', description: 'Fix electrical socket in living room', reportedDate: 'April 20, 2025', status: 'Resolved' },
  { id: 'maint-5', description: 'Unclog bathroom drain', reportedDate: 'April 12, 2025', status: 'Resolved' },
];

export const quickActions: QuickAction[] = [
  { icon: 'ti-search', label: 'Search Properties' },
  { icon: 'ti-plus', label: 'Add Property' },
  { icon: 'ti-message', label: 'Messages', badgeCount: 3, badgeColor: 'red' },
  { icon: 'ti-credit-card', label: 'Make Payment' },
  { icon: 'ti-alert-triangle', label: 'Report an Issue' },
];

export const messages: Message[] = [
  { initials: 'KA', avatarColor: 'amber', name: 'Kwame (Agent)', preview: 'Hi Kofi, the viewing is...', time: '2 min ago', unread: 2 },
  { initials: 'NC', avatarColor: 'green', name: 'Nana (Caretaker)', preview: 'Maintenance update...', time: '1 hr ago' },
  { initials: 'TN', avatarColor: 'blue', name: 'TripNest Support', preview: 'Your payment was...', time: '2 hr ago' },
];

export const trustUsers: TrustUser[] = [
  { initials: 'AK', bg: '#e1f5ee', color: '#0f6e56' },
  { initials: 'BM', bg: '#faeeda', color: '#854f0b' },
  { initials: 'EO', bg: '#e6f1fb', color: '#185fa5' },
  { initials: 'KA', bg: '#fcebeb', color: '#a32d2d' },
];

export const paymentLogos: PaymentLogo[] = [
  { src: '/Images/MTN-Logo.jpg', alt: 'MTN Mobile Money' },
  { src: '/Images/voda.jpg', alt: 'Vodafone Cash' },
  { src: '/Images/airtel.webp', alt: 'AirtelTigo Money' },
];

export const safetySettings = {
  smsAlertEnabled: true,
  emergencyContact: '+233 24 123 4567',
};
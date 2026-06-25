export interface StatCard {
  label: string;
  icon: string;
  value: string | number;
  sub?: string;
  link?: string;
  alert?: boolean;
}

export interface Booking {
  id: string;
  title: string;
  location: string;
  status: 'Confirmed' | 'Pending' | 'Cancelled';
  dateRange: string;
  guests: number;
  pricePerMonth: number;
  imgSrc: string;
}

export interface MaintenanceItem {
  id: string;
  description: string;
  reportedDate: string;
  status: 'Pending' | 'In Progress' | 'Resolved';
}

export interface QuickAction {
  icon: string;
  label: string;
  badgeCount?: number;
  badgeColor?: 'red' | 'green' | 'amber' | 'blue';
}

export interface Message {
  initials: string;
  avatarColor: 'green' | 'amber' | 'blue';
  name: string;
  preview: string;
  time: string;
  unread?: number;
}

export interface TrustUser {
  initials: string;
  bg: string;
  color: string;
}

export interface PaymentLogo {
  src: string;
  alt: string;
}
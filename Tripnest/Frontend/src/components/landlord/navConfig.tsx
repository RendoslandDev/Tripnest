import type { ReactNode } from 'react';
import {
  HomeIcon, KeyIcon, MessageIcon, CalendarIcon, CardIcon, UsersIcon, StarIcon,
  SettingsIcon, HelpIcon,
} from '../tenant/icons';

export interface LandlordNavItem {
  label: string;
  path: string;
  icon: ReactNode;
  badge?: number;
  /** Match the route exactly (used for the index route). */
  end?: boolean;
}

export interface LandlordNavGroup {
  heading?: string;
  items: LandlordNavItem[];
}

export const LANDLORD_NAV: LandlordNavGroup[] = [
  {
    items: [{ label: 'Overview', path: '/landlord', icon: <HomeIcon />, end: true }],
  },
  {
    heading: 'Manage',
    items: [
      { label: 'My Listings', path: '/landlord/listings', icon: <KeyIcon /> },
      { label: 'Inquiries', path: '/landlord/inquiries', icon: <MessageIcon />, badge: 4 },
      { label: 'Bookings', path: '/landlord/bookings', icon: <CalendarIcon /> },
      { label: 'Earnings', path: '/landlord/earnings', icon: <CardIcon /> },
    ],
  },
  {
    heading: 'People',
    items: [
      { label: 'Tenants', path: '/landlord/tenants', icon: <UsersIcon /> },
      { label: 'Reviews', path: '/landlord/reviews', icon: <StarIcon /> },
    ],
  },
  {
    heading: 'Account',
    items: [
      { label: 'Settings', path: '/landlord/settings', icon: <SettingsIcon /> },
      { label: 'Help & Support', path: '/landlord/help', icon: <HelpIcon /> },
    ],
  },
];

/** Flat list of all landlord nav items, for route generation. */
export const LANDLORD_NAV_ITEMS: LandlordNavItem[] = LANDLORD_NAV.flatMap((g) => g.items);

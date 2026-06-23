import type { TenantDashboard } from '../types';

// Mock tenant dashboard summary for the home right-rail.
export const tenantDashboard: TenantDashboard = {
  stats: {
    activeBookings: 2,
    rentPaid: 2400,
    savedProperties: 12,
    openMaintenance: 1,
  },
  upcoming: {
    title: '2 Bedroom Apartment',
    propertyId: '38492-PROP',
    location: 'Tarkwa, Newtown',
    dates: 'May 20 – May 27, 2025',
    price: 1200,
    period: 'month',
    status: 'Confirmed',
  },
  maintenance: {
    pending: 1,
    inProgress: 1,
    resolved: 3,
    latest: { title: 'Fix leaking tap in kitchen', reportedOn: 'May 15, 2025', status: 'Pending' },
  },
  messages: [
    { id: 1, name: 'Kwame', role: 'Agent', preview: 'Hi Kofi, the viewing is…', time: '2m' },
    { id: 2, name: 'Nana', role: 'Caretaker', preview: 'Maintenance update…', time: '1h' },
    { id: 3, name: 'TripNest Support', role: 'Support', preview: 'Your payment was…', time: '3h' },
  ],
  emergencyContact: '+233 24 123 4567',
};

import type { MaintenanceTicket } from '../types';

export const maintenanceTickets: MaintenanceTicket[] = [
  { id: 1, title: 'Fix leaking tap in kitchen', property: '2 Bedroom Apartment', category: 'Plumbing', status: 'pending', reportedOn: 'May 15, 2025' },
  { id: 2, title: 'Air conditioner not cooling', property: '2 Bedroom Apartment', category: 'Electrical', status: 'in-progress', reportedOn: 'May 10, 2025' },
  { id: 3, title: 'Replace broken window latch', property: '2 Bedroom Apartment', category: 'General', status: 'resolved', reportedOn: 'Apr 28, 2025' },
  { id: 4, title: 'Repaint bedroom wall', property: '2 Bedroom Apartment', category: 'General', status: 'resolved', reportedOn: 'Apr 20, 2025' },
  { id: 5, title: 'Door lock jammed', property: '2 Bedroom Apartment', category: 'General', status: 'resolved', reportedOn: 'Apr 12, 2025' },
];

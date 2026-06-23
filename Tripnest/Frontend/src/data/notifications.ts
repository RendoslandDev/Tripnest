import type { Notification } from '../types';

export const notifications: Notification[] = [
  { id: 1, type: 'booking', title: 'Booking confirmed', body: 'Your booking for 2 Bedroom Apartment is confirmed.', time: '2m', read: false },
  { id: 2, type: 'message', title: 'New message from Kwame', body: 'Hi Kofi, the viewing is confirmed for tomorrow.', time: '1h', read: false },
  { id: 3, type: 'payment', title: 'Payment received', body: 'GH₵ 1,200 rent payment was successful.', time: '3h', read: false },
  { id: 4, type: 'maintenance', title: 'Maintenance update', body: 'Your request "Fix leaking tap" is in progress.', time: '1d', read: true },
  { id: 5, type: 'safety', title: 'SMS safety alert enabled', body: 'Emergency contact saved successfully.', time: '2d', read: true },
  { id: 6, type: 'booking', title: 'Check-in reminder', body: 'Your stay begins on May 20. Get ready!', time: '3d', read: true },
];

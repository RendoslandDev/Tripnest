import type { Booking } from '../types';

export const bookings: Booking[] = [
  { id: 'BK-1042', property: '2 Bedroom Apartment', propertyId: '38492-PROP', location: 'Tarkwa, Newtown', checkIn: 'May 20, 2025', checkOut: 'May 27, 2025', guests: 2, amount: 1200, period: 'month', status: 'upcoming' },
  { id: 'BK-1039', property: 'Studio Apartment', propertyId: '39500-PROP', location: 'Tarkwa, Magazine Area', checkIn: 'May 1, 2025', checkOut: 'May 8, 2025', guests: 1, amount: 700, period: 'week', status: 'active' },
  { id: 'BK-1021', property: 'Single Room (Student)', propertyId: '38821-PROP', location: 'Tarkwa, Apinto', checkIn: 'Feb 1, 2025', checkOut: 'Apr 1, 2025', guests: 1, amount: 450, period: 'month', status: 'past' },
  { id: 'BK-1010', property: '1 Bedroom Apartment', propertyId: '40233-PROP', location: 'Tarkwa, Newtown', checkIn: 'Jan 5, 2025', checkOut: 'Jan 20, 2025', guests: 1, amount: 850, period: 'month', status: 'past' },
  { id: 'BK-0998', property: 'Guest House Room', propertyId: '40455-PROP', location: 'Tarkwa, Town Centre', checkIn: 'Dec 18, 2024', checkOut: 'Dec 25, 2024', guests: 2, amount: 550, period: 'week', status: 'cancelled' },
];

import type { Booking } from '../types';
import { bookings } from '../data/bookings';
import { mockResponse } from './client';

export function getBookings(): Promise<Booking[]> {
  // return apiGet<Booking[]>('/bookings');
  return mockResponse(bookings);
}

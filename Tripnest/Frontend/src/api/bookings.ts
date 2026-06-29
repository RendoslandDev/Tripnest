import type { Booking } from '../types';
import { getBookingsSnapshot } from '../store/bookingStore';
import { mockResponse } from './client';

export function getBookings(): Promise<Booking[]> {
  // return apiGet<Booking[]>('/bookings');
  return mockResponse(getBookingsSnapshot());
}

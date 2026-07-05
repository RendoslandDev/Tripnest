import type { Booking } from '../types';
import { apiGet, apiPost } from './client';
import { mapBooking, type BookingResponseDto } from './backend';
import { getProperties } from './properties';

export async function getBookings(): Promise<Booking[]> {
  // Booking DTOs carry only propertyId — join against listings for titles.
  const [dtos, properties] = await Promise.all([
    apiGet<BookingResponseDto[]>('/api/bookings/user/my-bookings'),
    getProperties().catch(() => []),
  ]);
  const byId = new Map(properties.map((p) => [p.id, p]));
  return dtos.map((dto) => mapBooking(dto, byId.get(dto.propertyId)));
}

// Postgres only accepts UTC timestamps; a bare YYYY-MM-DD deserializes as
// Kind=Unspecified server-side and is rejected, so pin dates to UTC midnight.
const utcMidnight = (isoDate: string) =>
  isoDate.length === 10 ? `${isoDate}T00:00:00Z` : isoDate;

export async function createBooking(input: {
  propertyId: string;
  checkInDate: string;
  checkOutDate: string;
}): Promise<Booking> {
  const dto = await apiPost<BookingResponseDto>('/api/bookings', {
    propertyId: input.propertyId,
    checkInDate: utcMidnight(input.checkInDate),
    checkOutDate: utcMidnight(input.checkOutDate),
  });
  return mapBooking(dto);
}

export function cancelBooking(bookingId: string): Promise<unknown> {
  return apiPost(`/api/bookings/${bookingId}/cancel`);
}

import type { Booking } from '../types';
import { apiGetList, apiPost } from './client';
import { mapBooking, type BookingResponseDto } from './backend';
import { getProperties } from './properties';

export async function getBookings(): Promise<Booking[]> {
  // Booking DTOs carry only propertyId — join against listings for titles.
  const [dtos, properties] = await Promise.all([
    apiGetList<BookingResponseDto>('/api/bookings/user/my-bookings'),
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

// ---- Split billing (group bookings) ---------------------------------------------------------

export const SHARE_STATUS = ['Pending', 'Paid', 'Refunded'] as const;

export interface BookingShareDto {
  shareId: string;
  bookingId: string;
  participantUserId: string;
  participantName?: string | null;
  amount: number;
  status: number; // index into SHARE_STATUS
  paidAt?: string | null;
  /** Set only on the pay response — this participant's checkout link. */
  checkoutUrl?: string | null;
}

export function getBookingShares(bookingId: string): Promise<BookingShareDto[]> {
  return apiGetList<BookingShareDto>(`/api/bookings/${bookingId}/shares`);
}

export function payShare(shareId: string): Promise<BookingShareDto> {
  return apiPost<BookingShareDto>(`/api/bookings/shares/${shareId}/pay`);
}

export function verifyShare(shareId: string): Promise<BookingShareDto> {
  return apiPost<BookingShareDto>(`/api/bookings/shares/${shareId}/verify`);
}

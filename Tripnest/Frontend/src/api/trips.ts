import type { Trip, TripStatus } from '../types';
import { apiGet } from './client';
import { formatIsoDate, type BookingResponseDto } from './backend';
import { getProperties } from './properties';

// The host's own stays as a guest = their bookings. Joined against properties
// for names/locations, like api/bookings.ts.

const COVER_COLORS = ['#bae6fd', '#bbf7d0', '#fde68a', '#fecaca', '#ddd6fe', '#fbcfe8'];

function tripStatus(status: number, checkOutIso: string): TripStatus {
  if (status === 4) return 'canceled'; // Cancelled
  if (status === 3 || status === 5) return 'completed'; // CheckedOut / Completed
  return new Date(checkOutIso).getTime() < Date.now() ? 'completed' : 'upcoming';
}

function nightsBetween(checkInIso: string, checkOutIso: string): number {
  const ms = new Date(checkOutIso).getTime() - new Date(checkInIso).getTime();
  return Math.max(1, Math.round(ms / 86_400_000));
}

export async function getTrips(): Promise<Trip[]> {
  const [dtos, properties] = await Promise.all([
    apiGet<BookingResponseDto[]>('/api/bookings/user/my-bookings'),
    getProperties().catch(() => []),
  ]);
  const byId = new Map(properties.map((p) => [p.id, p]));
  return dtos.map((dto, i) => {
    const property = byId.get(dto.propertyId);
    return {
      id: dto.bookingId,
      destination: property?.location ?? 'Ghana',
      property: property?.title ?? 'Property',
      checkIn: formatIsoDate(dto.checkInDate),
      checkOut: formatIsoDate(dto.checkOutDate),
      nights: nightsBetween(dto.checkInDate, dto.checkOutDate),
      guests: 1, // not tracked by the backend booking model
      price: dto.totalAmount,
      status: tripStatus(dto.status, dto.checkOutDate),
      coverColor: COVER_COLORS[i % COVER_COLORS.length],
    };
  });
}

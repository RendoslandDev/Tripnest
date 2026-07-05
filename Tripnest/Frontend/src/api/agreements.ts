import type { Agreement } from '../types';
import { apiGet } from './client';
import { mapAgreement, type AgreementResponseDto } from './backend';
import { getBookings } from './bookings';

export async function getAgreements(): Promise<Agreement[]> {
  // Agreements reference bookings; join for property names and dates.
  const [dtos, bookings] = await Promise.all([
    apiGet<AgreementResponseDto[]>('/api/agreements/mine'),
    getBookings().catch(() => []),
  ]);
  const byId = new Map(bookings.map((b) => [b.id, b]));
  return dtos.map((dto) => mapAgreement(dto, byId.get(dto.bookingId)));
}

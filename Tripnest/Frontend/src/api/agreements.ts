import type { Agreement } from '../types';
import { apiDownload, apiGet, apiGetList, apiPost } from './client';
import { mapAgreement, type AgreementResponseDto } from './backend';
import { getBookings } from './bookings';

export async function getAgreements(): Promise<Agreement[]> {
  // Agreements reference bookings; join for property names and dates.
  const [dtos, bookings] = await Promise.all([
    apiGetList<AgreementResponseDto>('/api/agreements/mine'),
    getBookings().catch(() => []),
  ]);
  const byId = new Map(bookings.map((b) => [b.id, b]));
  return dtos.map((dto) => mapAgreement(dto, byId.get(dto.bookingId)));
}

/** Adds the caller's stored signature to the agreement (400 if they haven't set one on their profile). */
export function signAgreement(id: string): Promise<unknown> {
  return apiPost(`/api/agreements/${id}/sign`);
}

export function terminateAgreement(id: string): Promise<unknown> {
  return apiPost(`/api/agreements/${id}/terminate`);
}

/** Plain-language AI explanation of the agreement. Advisory — the signed terms stay binding. */
export interface AgreementSummary {
  summary: string;
  keyTerms: string[];
  yourObligations: string[];
  disclaimer: string;
}

export function getAgreementSummary(id: string): Promise<AgreementSummary> {
  return apiGet<AgreementSummary>(`/api/agreements/${id}/summary`);
}

/** The real signed PDF (with both parties' signature images), served by the backend. */
export function downloadAgreementPdf(id: string): Promise<void> {
  return apiDownload(`/api/agreements/${id}/download`, `tripnest-agreement-${id}.pdf`);
}

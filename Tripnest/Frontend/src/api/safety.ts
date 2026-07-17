import { apiGet, apiPost, apiPut } from './client';

// Guest safety: a trusted contact on file, stay check-ins that notify them, and the 24/7
// urgent-help line that pages every admin.

export interface TrustedContact {
  name?: string | null;
  phone?: string | null;
  email?: string | null;
}

export function getTrustedContact(): Promise<TrustedContact> {
  return apiGet<TrustedContact>('/api/safety/contact');
}

export function saveTrustedContact(contact: { name: string; phone: string; email?: string }): Promise<TrustedContact> {
  return apiPut<TrustedContact>('/api/safety/contact', contact);
}

/** "I've arrived safely" — texts the trusted contact (or the per-request override). */
export function safetyCheckIn(bookingId: string, contactPhone?: string): Promise<unknown> {
  return apiPost('/api/safety/checkin', { bookingId, contactPhone });
}

export interface UrgentHelpResult {
  hotline?: string | null;
  promisedResponseMinutes: number;
}

/**
 * Locked out / unsafe RIGHT NOW: files a queue-jumping urgent ticket, pages every admin over the
 * emergency channel, and returns the 24/7 hotline number to call.
 */
export function requestUrgentHelp(message: string): Promise<UrgentHelpResult> {
  return apiPost<UrgentHelpResult>('/api/safety/urgent', { message });
}

import { apiGet, apiPost, apiPut } from './client';

// Safety module (api/safety): trusted contact + safe-arrival check-ins.
// Check-in texts/emails the trusted contact (best-effort, dev logs the SMS);
// the emergency alert bypasses notification opt-outs server-side.

export interface TrustedContact {
  name?: string | null;
  phone?: string | null;
  email?: string | null;
}

export const getTrustedContact = () => apiGet<TrustedContact>('/api/safety/contact');

/** Phone is normalised to E.164 server-side; invalid numbers 400. */
export const saveTrustedContact = (contact: TrustedContact) =>
  apiPut<TrustedContact>('/api/safety/contact', contact);

export interface SafetyCheckInResult {
  checkInId: string;
  bookingId: string;
  isCheckedIn: boolean;
  checkedInAt?: string | null;
  contactNotified: boolean;
  locationShared: boolean;
}

/** Safe-arrival check-in for a booking; coordinates only sent with consent. */
export const safetyCheckIn = (input: {
  bookingId: string;
  shareLocation: boolean;
  latitude?: number;
  longitude?: number;
}) => apiPost<SafetyCheckInResult>('/api/safety/checkin', input);

/** Emergency alert: notifies the user (ignoring opt-outs) and the trusted contact. */
export const sendEmergencyAlert = (bookingId: string) =>
  apiPost('/api/safety/alert', { bookingId });

import type { Payment, PaymentMethod, Transaction } from '../types';
import { paymentMethods } from '../data/payments';
import {
  initiatePayment as storeInitiate,
  verifyPayment as storeVerify,
  attachBooking as storeAttachBooking,
  type InitiatePaymentInput,
  type InitiateResult,
  type MomoNetwork,
} from '../store/paymentStore';
import { apiDownload, apiGet, mockResponse } from './client';
import { formatIsoDate, type PagedResultDto, type ReceiptResponseDto } from './backend';
import { getBookings } from './bookings';

/** Settled payments = the user's receipts. Joined against bookings for property names. */
export async function getPayments(): Promise<Payment[]> {
  const [paged, bookings] = await Promise.all([
    apiGet<PagedResultDto<ReceiptResponseDto>>('/api/receipts/mine?page=1&pageSize=50'),
    getBookings().catch(() => []),
  ]);
  const propertyByBooking = new Map(bookings.map((b) => [b.id, b.property]));
  return paged.items.map((r) => ({
    id: r.receiptId,
    description: r.description || 'Booking payment',
    property: propertyByBooking.get(r.bookingId) ?? `Booking ${r.bookingId.slice(0, 8).toUpperCase()}`,
    date: formatIsoDate(r.createdAt),
    amount: r.amount,
    method: r.paymentMethod || 'Paystack',
    status: 'paid' as const,
  }));
}

export function downloadReceipt(receiptId: string): Promise<void> {
  return apiDownload(`/api/receipts/${receiptId}/download`, `tripnest-receipt-${receiptId.slice(0, 8)}.pdf`);
}

// Saved payment methods have no backend yet (Paystack's hosted page collects
// the instrument per charge) — still mock-backed.
export function getPaymentMethods(): Promise<PaymentMethod[]> {
  return mockResponse(paymentMethods);
}

// Legacy in-browser charge simulation. Real checkout now goes through
// api/escrow.ts (booking → escrow initiate → hosted Paystack page); these
// remain only for mock-backed surfaces that haven't moved yet.
export function initiatePayment(input: InitiatePaymentInput): Promise<InitiateResult> {
  return mockResponse(storeInitiate(input));
}

export function verifyPayment(reference: string): Promise<Transaction> {
  return mockResponse(storeVerify(reference));
}

/** Link a settled charge to the booking it created. */
export function attachBooking(reference: string, bookingId: string): void {
  storeAttachBooking(reference, bookingId);
}

export type { InitiatePaymentInput, InitiateResult, MomoNetwork };

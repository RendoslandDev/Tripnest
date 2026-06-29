import type { Payment, PaymentMethod, Transaction } from '../types';
import { payments, paymentMethods } from '../data/payments';
import {
  initiatePayment as storeInitiate,
  verifyPayment as storeVerify,
  attachBooking as storeAttachBooking,
  type InitiatePaymentInput,
  type InitiateResult,
  type MomoNetwork,
} from '../store/paymentStore';
import { mockResponse } from './client';

export function getPayments(): Promise<Payment[]> {
  // return apiGet<Payment[]>('/payments');
  return mockResponse(payments);
}

export function getPaymentMethods(): Promise<PaymentMethod[]> {
  // return apiGet<PaymentMethod[]>('/payments/methods');
  return mockResponse(paymentMethods);
}

/** Open a payment with the provider (Paystack). Real impl: POST /payments/initiate. */
export function initiatePayment(input: InitiatePaymentInput): Promise<InitiateResult> {
  // return apiPost<InitiateResult>('/payments/initiate', input);
  return mockResponse(storeInitiate(input));
}

/** Verify a payment's outcome. Real impl: GET /payments/:reference/verify. */
export function verifyPayment(reference: string): Promise<Transaction> {
  // return apiGet<Transaction>(`/payments/${reference}/verify`);
  return mockResponse(storeVerify(reference));
}

/** Link a settled charge to the booking it created. */
export function attachBooking(reference: string, bookingId: string): void {
  storeAttachBooking(reference, bookingId);
}

export type { InitiatePaymentInput, InitiateResult, MomoNetwork };

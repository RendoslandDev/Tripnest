import type { Payment, PaymentMethod } from '../types';
import { payments, paymentMethods } from '../data/payments';
import { mockResponse } from './client';

export function getPayments(): Promise<Payment[]> {
  // return apiGet<Payment[]>('/payments');
  return mockResponse(payments);
}

export function getPaymentMethods(): Promise<PaymentMethod[]> {
  // return apiGet<PaymentMethod[]>('/payments/methods');
  return mockResponse(paymentMethods);
}

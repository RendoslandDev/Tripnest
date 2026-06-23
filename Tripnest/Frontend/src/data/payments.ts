import type { Payment, PaymentMethod } from '../types';

export const paymentMethods: PaymentMethod[] = [
  { id: 'PM-1', provider: 'MTN MoMo', number: '•••• 4567', primary: true },
  { id: 'PM-2', provider: 'Vodafone Cash', number: '•••• 8821', primary: false },
];

export const payments: Payment[] = [
  { id: 'PY-5012', description: 'Rent — June', property: '2 Bedroom Apartment', date: 'Jun 1, 2025', amount: 1200, method: 'MTN MoMo', status: 'due' },
  { id: 'PY-5001', description: 'Rent — May', property: '2 Bedroom Apartment', date: 'May 1, 2025', amount: 1200, method: 'MTN MoMo', status: 'paid' },
  { id: 'PY-4980', description: 'Security deposit', property: '2 Bedroom Apartment', date: 'Apr 28, 2025', amount: 1200, method: 'MTN MoMo', status: 'paid' },
  { id: 'PY-4955', description: 'Rent — April', property: '1 Bedroom Apartment', date: 'Apr 1, 2025', amount: 850, method: 'Vodafone Cash', status: 'paid' },
  { id: 'PY-5030', description: 'Rent — July', property: '2 Bedroom Apartment', date: 'Jul 1, 2025', amount: 1200, method: 'MTN MoMo', status: 'upcoming' },
];

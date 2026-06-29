import type { EarningsSummary } from '../types';
import { earnings } from '../data/earnings';
import { mockResponse } from './client';

export function getEarnings(): Promise<EarningsSummary> {
  // return apiGet<EarningsSummary>('/landlord/earnings');
  return mockResponse(earnings);
}

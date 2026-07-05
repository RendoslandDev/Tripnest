import type { EarningsSummary } from '../types';
import { apiGet } from './client';
import type { LandlordEarningsDto } from './backend';

export async function getEarnings(): Promise<EarningsSummary> {
  const dto = await apiGet<LandlordEarningsDto>('/api/landlord/earnings');
  // The API reports totals only; per-transaction settlement rows aren't
  // exposed yet, so the table renders empty until that endpoint exists.
  return {
    available: dto.totalEarnings,
    pending: 0,
    thisMonth: dto.thisMonthEarnings,
    lifetime: dto.totalEarnings,
    nextPayoutDate: '—',
    transactions: [],
  };
}

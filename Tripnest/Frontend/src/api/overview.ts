import type { OverviewSummary } from '../types';
import { reservations as mockReservations } from '../data/reservations';
import { mockResponse } from './client';

// Overview aggregates derived from reservation data (as a real backend would).
export function getOverview(): Promise<OverviewSummary> {
  // return apiGet<OverviewSummary>('/overview');
  const active = mockReservations.filter((r) => r.status !== 'canceled');

  const monthlyEarnings = active.reduce(
    (sum, r) => sum + r.nightlyRate * r.nights * (1 - r.managementFeePercent / 100),
    0,
  );
  const avgNightlyRate = Math.round(
    mockReservations.reduce((sum, r) => sum + r.nightlyRate, 0) / mockReservations.length,
  );
  const upcomingCount = mockReservations.filter((r) => r.status === 'upcoming').length;

  return mockResponse({
    monthlyEarnings,
    occupancyRate: 68,
    upcomingCount,
    avgNightlyRate,
    recent: mockReservations.slice(0, 4),
  });
}

import type { TenantDashboard } from '../types';
import { tenantDashboard } from '../data/tenantDashboard';
import { mockResponse } from './client';

export function getTenantDashboard(): Promise<TenantDashboard> {
  // return apiGet<TenantDashboard>('/tenant/dashboard');
  return mockResponse(tenantDashboard);
}

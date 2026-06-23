import type { ServiceProvider } from '../types';
import { providers } from '../data/providers';
import { mockResponse } from './client';

export function getProviders(category: string): Promise<ServiceProvider[]> {
  // return apiGet<ServiceProvider[]>(`/providers?category=${category}`);
  return mockResponse(providers.filter((p) => p.category === category));
}

import type { PricingSettings } from '../types';
import { pricingSettings } from '../data/pricing';
import { mockResponse } from './client';

export function getPricingSettings(): Promise<PricingSettings> {
  // return apiGet<PricingSettings>('/pricing');
  return mockResponse(pricingSettings);
}

export function savePricingSettings(settings: PricingSettings): Promise<PricingSettings> {
  // return apiPut<PricingSettings>('/pricing', settings);
  return mockResponse(settings);
}

import type { PropertyTour } from '../types';
import { properties } from '../data/properties';
import { buildTour } from '../data/tours';
import { mockResponse } from './client';

// Service layer for property virtual tours. Today the tour is derived from the
// mock property; to go live, swap the body for the commented apiGet call.

export function getPropertyTour(id: string): Promise<PropertyTour | undefined> {
  // return apiGet<PropertyTour>(`/properties/${id}/tour`);
  const property = properties.find((p) => p.id === id);
  return mockResponse(property ? buildTour(property) : undefined);
}

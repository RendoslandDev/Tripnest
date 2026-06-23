import type { Property } from '../types';
import { properties } from '../data/properties';
import { mockResponse } from './client';

export function getFeaturedProperties(): Promise<Property[]> {
  // return apiGet<Property[]>('/properties/featured');
  return mockResponse(properties.slice(0, 4));
}

export function getProperties(): Promise<Property[]> {
  // return apiGet<Property[]>('/properties');
  return mockResponse(properties);
}

export function getPropertyById(id: string): Promise<Property | undefined> {
  // return apiGet<Property>(`/properties/${id}`);
  return mockResponse(properties.find((p) => p.id === id));
}

export function getSavedProperties(): Promise<Property[]> {
  // return apiGet<Property[]>('/properties/saved');
  return mockResponse([properties[0], properties[2], properties[5]]);
}

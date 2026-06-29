import type { Listing } from '../types';
import { listings as mockListings } from '../data/listings';
import { mockResponse } from './client';

// Service layer for host listings. Today these resolve local mock data; to go
// live, swap each body for the commented apiGet call — callers don't change.

export function getListings(): Promise<Listing[]> {
  // return apiGet<Listing[]>('/listings');
  return mockResponse(mockListings);
}

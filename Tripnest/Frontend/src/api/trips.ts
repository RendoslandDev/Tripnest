import type { Trip } from '../types';
import { trips as mockTrips } from '../data/trips';
import { mockResponse } from './client';

// Service layer for the host's own trips. Today these resolve local mock data;
// to go live, swap each body for the commented apiGet call.

export function getTrips(): Promise<Trip[]> {
  // return apiGet<Trip[]>('/trips');
  return mockResponse(mockTrips);
}

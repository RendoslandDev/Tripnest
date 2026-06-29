import type { Resource } from '../types';
import { resources as mockResources } from '../data/resources';
import { mockResponse } from './client';

// Service layer for host resources. Today these resolve local mock data; to go
// live, swap each body for the commented apiGet call.

export function getResources(): Promise<Resource[]> {
  // return apiGet<Resource[]>('/resources');
  return mockResponse(mockResources);
}

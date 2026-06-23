import type { Agreement } from '../types';
import { agreements } from '../data/agreements';
import { mockResponse } from './client';

export function getAgreements(): Promise<Agreement[]> {
  // return apiGet<Agreement[]>('/agreements');
  return mockResponse(agreements);
}

import type { HostTask } from '../types';
import { hostTasks as mockTasks } from '../data/hostTasks';
import { mockResponse } from './client';

// Service layer for host operational tasks. Today these resolve local mock
// data; to go live, swap each body for the commented apiGet call.

export function getHostTasks(): Promise<HostTask[]> {
  // return apiGet<HostTask[]>('/tasks');
  return mockResponse(mockTasks);
}

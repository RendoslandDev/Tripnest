import type { TeamUser } from '../types';
import { teamUsers as mockUsers } from '../data/teamUsers';
import { mockResponse } from './client';

// Service layer for host team members. Today these resolve local mock data; to
// go live, swap each body for the commented apiGet call.

export function getTeamUsers(): Promise<TeamUser[]> {
  // return apiGet<TeamUser[]>('/users');
  return mockResponse(mockUsers);
}

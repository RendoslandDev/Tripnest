import type { MaintenanceTicket } from '../types';
import { maintenanceTickets } from '../data/maintenance';
import { mockResponse } from './client';

export function getMaintenanceTickets(): Promise<MaintenanceTicket[]> {
  // return apiGet<MaintenanceTicket[]>('/maintenance');
  return mockResponse(maintenanceTickets);
}

export function createMaintenanceTicket(
  input: Pick<MaintenanceTicket, 'title' | 'category'>,
): Promise<MaintenanceTicket> {
  // return apiPost<MaintenanceTicket>('/maintenance', input);
  return mockResponse({
    id: Date.now(),
    title: input.title,
    category: input.category,
    property: '2 Bedroom Apartment',
    status: 'pending',
    reportedOn: 'Just now',
  });
}

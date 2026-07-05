import type { MaintenanceTicket } from '../types';
import { apiGet, apiPost } from './client';
import { mapMaintenance, type BookingResponseDto, type MaintenanceResponseDto } from './backend';
import { getPropertyById } from './properties';

export async function getMaintenanceTickets(): Promise<MaintenanceTicket[]> {
  const dtos = await apiGet<MaintenanceResponseDto[]>('/api/maintenance/mine');
  return Promise.all(
    dtos.map(async (dto) => mapMaintenance(dto, await getPropertyById(dto.propertyId))),
  );
}

export async function createMaintenanceTicket(
  input: Pick<MaintenanceTicket, 'title' | 'category'>,
): Promise<MaintenanceTicket> {
  // The API requires a propertyId; report against the most recent booking.
  const bookings = await apiGet<BookingResponseDto[]>('/api/bookings/user/my-bookings');
  const target = bookings.find((b) => b.status !== 4); // any non-cancelled booking
  if (!target) {
    throw new Error('You need an active booking before reporting a maintenance issue.');
  }
  const dto = await apiPost<MaintenanceResponseDto>('/api/maintenance', {
    propertyId: target.propertyId,
    category: input.category,
    description: input.title,
    priority: 'Medium',
  });
  return mapMaintenance(dto, await getPropertyById(dto.propertyId));
}

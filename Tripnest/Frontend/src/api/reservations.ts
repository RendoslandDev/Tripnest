import type { Reservation } from '../types';
import { reservations as mockReservations } from '../data/reservations';
import { mockResponse } from './client';

// Service layer for reservations. Today these resolve local mock data; to go
// live, swap each body for the commented apiGet call — callers don't change.

export function getReservations(): Promise<Reservation[]> {
  // return apiGet<Reservation[]>('/reservations');
  return mockResponse(mockReservations);
}

export function getReservationById(id: number): Promise<Reservation | undefined> {
  // return apiGet<Reservation>(`/reservations/${id}`);
  return mockResponse(mockReservations.find((r) => r.id === id));
}

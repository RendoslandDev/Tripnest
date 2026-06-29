import type { Reservation } from '../types';
import { getReservationsSnapshot } from '../store/bookingStore';
import { mockResponse } from './client';

// Service layer for reservations. Today these resolve the live in-memory store
// (seeded from mock data); to go live, swap each body for the commented apiGet
// call — callers don't change.

export function getReservations(): Promise<Reservation[]> {
  // return apiGet<Reservation[]>('/reservations');
  return mockResponse(getReservationsSnapshot());
}

export function getReservationById(id: number): Promise<Reservation | undefined> {
  // return apiGet<Reservation>(`/reservations/${id}`);
  return mockResponse(getReservationsSnapshot().find((r) => r.id === id));
}

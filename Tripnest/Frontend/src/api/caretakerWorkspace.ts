import { apiGetList, apiPatch } from './client';

// Caretaker workspace: service requests raised against the caller's
// assignments. GET /mine is role-aware server-side (caretaker sees requests
// on their assignments; requesters see the ones they raised).

export interface ServiceRequestDto {
  serviceRequestId: string;
  caretakerId: string;
  requestedByUserId: string;
  propertyId: string;
  serviceType: string;
  description: string;
  status: string; // "Pending" | "Accepted" | "InProgress" | "Completed" | "Cancelled"
  rating?: number | null;
  reviewComment?: string | null;
  createdAt: string;
  completedAt?: string | null;
}

export function getMyServiceRequests(): Promise<ServiceRequestDto[]> {
  return apiGetList<ServiceRequestDto>('/api/caretakers/service-requests/mine');
}

export function acceptServiceRequest(id: string): Promise<unknown> {
  return apiPatch(`/api/caretakers/service-requests/${id}/accept`);
}

/** The server Enum.TryParses this, so the PascalCase names are the contract. */
export type ServiceRequestStatus = 'InProgress' | 'Completed' | 'Cancelled';

export function updateServiceRequestStatus(id: string, status: ServiceRequestStatus): Promise<unknown> {
  return apiPatch(`/api/caretakers/service-requests/${id}/status`, { status });
}

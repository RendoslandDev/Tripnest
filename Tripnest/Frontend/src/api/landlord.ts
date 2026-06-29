import type { Inquiry, LandlordBooking, LandlordTenant, LandlordReview } from '../types';
import { inquiries, landlordBookings, landlordTenants, landlordReviews } from '../data/landlord';
import { mockResponse } from './client';

// Landlord workspace service layer. Today these resolve local mock data; swap
// each body for the commented apiGet call to go live — callers don't change.

export function getInquiries(): Promise<Inquiry[]> {
  // return apiGet<Inquiry[]>('/landlord/inquiries');
  return mockResponse(inquiries);
}

export function getLandlordBookings(): Promise<LandlordBooking[]> {
  // return apiGet<LandlordBooking[]>('/landlord/bookings');
  return mockResponse(landlordBookings);
}

export function getLandlordTenants(): Promise<LandlordTenant[]> {
  // return apiGet<LandlordTenant[]>('/landlord/tenants');
  return mockResponse(landlordTenants);
}

export function getLandlordReviews(): Promise<LandlordReview[]> {
  // return apiGet<LandlordReview[]>('/landlord/reviews');
  return mockResponse(landlordReviews);
}

import type { ServiceProvider } from '../types';

// Mock service providers across the tenant "Services" categories.
export const providers: ServiceProvider[] = [
  { id: 'CT-01', name: 'Nana Adwoa', category: 'Caretakers', role: 'Resident Caretaker', location: 'Tarkwa, Newtown', rating: 4.9, reviews: 56, verified: true, rate: 400, ratePeriod: 'month', skills: ['Cleaning', 'Security', 'Errands'] },
  { id: 'CT-02', name: 'Kojo Asare', category: 'Caretakers', role: 'Compound Caretaker', location: 'Tarkwa, Aboso', rating: 4.7, reviews: 31, verified: true, rate: 350, ratePeriod: 'month', skills: ['Security', 'Gardening'] },
  { id: 'HH-01', name: 'Akua Boateng', category: 'House Help', role: 'Home Cleaner', location: 'Tarkwa, Apinto', rating: 4.8, reviews: 42, verified: true, rate: 60, ratePeriod: 'day', skills: ['Cleaning', 'Laundry', 'Cooking'] },
  { id: 'HH-02', name: 'Esi Mensimah', category: 'House Help', role: 'Housekeeper', location: 'Tarkwa, Bankyim', rating: 4.6, reviews: 19, verified: true, rate: 70, ratePeriod: 'day', skills: ['Cleaning', 'Childcare'] },
  { id: 'AG-01', name: 'Kwame Mensah', category: 'Agents', role: 'Verified Agent', location: 'Tarkwa, Newtown', rating: 4.9, reviews: 88, verified: true, rate: 0, ratePeriod: 'commission', skills: ['Apartments', 'Student Rooms'] },
  { id: 'AG-02', name: 'Yaw Boateng', category: 'Agents', role: 'Verified Agent', location: 'Tarkwa, Town Centre', rating: 4.7, reviews: 64, verified: true, rate: 0, ratePeriod: 'commission', skills: ['Houses', 'Short Stay'] },
];

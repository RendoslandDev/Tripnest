export interface CurrentUser {
  name: string;
  role: string;
  location: string;
  email: string;
  phone: string;
}

// Mock signed-in tenant. Replace with auth/session data later.
export const currentUser: CurrentUser = {
  name: 'Kofi Mensah',
  role: 'Tenant',
  location: 'Tarkwa, Ghana',
  email: 'kofi.mensah@example.com',
  phone: '+233 24 123 4567',
};

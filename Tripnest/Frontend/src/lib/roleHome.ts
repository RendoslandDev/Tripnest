import type { Role } from '../store/authStore';

/** Where each role lands after auth / onboarding. */
export const homeForRole = (role: Role): string =>
  role === 'landlord' ? '/landlord'
    : role === 'agent' ? '/agent'
      : role === 'caretaker' ? '/caretaker'
        : role === 'admin' ? '/admin'
          : '/';

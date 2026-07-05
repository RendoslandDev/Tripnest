import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useSession, type Role } from '../store/authStore';

/**
 * Gate protected routes. No session → onboarding. When `role` is given, a
 * signed-in user of the other role is sent to their own surface, so login
 * decides which side of the app someone sees.
 */
export default function RequireAuth({ children, role }: { children: ReactNode; role?: Role }) {
  const session = useSession();
  if (!session) return <Navigate to="/welcome" replace />;
  if (role && session.role !== role) {
    return <Navigate to={session.role === 'landlord' ? '/landlord' : '/'} replace />;
  }
  return <>{children}</>;
}

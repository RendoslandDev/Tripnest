import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useSession } from '../store/authStore';

//  Gate protected routes — redirect to onboarding when there's no session.
export default function RequireAuth({ children }: { children: ReactNode }) {
  const session = useSession();
  if (!session) return <Navigate to="/welcome" replace />;
  return <>{children}</>;
}

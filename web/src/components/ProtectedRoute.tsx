import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useRole } from '../hooks/useRole';

interface ProtectedRouteProps {
  children: ReactNode;
  requireAdmin?: boolean;
}

export function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const { isAdmin } = useRole();

  if (requireAdmin && !isAdmin) {
    // Redirigir a home si no es admin
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

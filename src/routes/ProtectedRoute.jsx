import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Protege rutas del dashboard.
 * - Sin token → redirige a /login
 * - Sin el rol requerido → redirige a /
 */
export default function ProtectedRoute({ requiredRoles = ['ROLE_ADMIN', 'ROLE_EDITOR'] }) {
  const { isAuthenticated, hasRole } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const hasPermission = requiredRoles.length === 0 || requiredRoles.some((r) => hasRole(r));
  if (!hasPermission) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

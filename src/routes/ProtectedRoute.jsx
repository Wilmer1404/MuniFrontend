import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * edwind, esta puerta solo se abre si tienes la llave (el token) y permiso.
 * Si no tienes llave, te mandamos al login.
 * Si la llave no entra, te regresamos a la pantalla de inicio.
 */
export default function ProtectedRoute({
  requiredRoles = ["ROLE_ADMIN", "ROLE_EDITOR"],
}) {
  const { isAuthenticated, hasRole } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const hasPermission =
    requiredRoles.length === 0 || requiredRoles.some((r) => hasRole(r));
  if (!hasPermission) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

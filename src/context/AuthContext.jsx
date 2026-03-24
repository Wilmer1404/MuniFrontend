/* eslint-disable react-refresh/only-export-components */
// edwind, aquí exportamos el provider y el hook, es a propósito así que le decimos a eslint que no moleste
import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  useEffect,
} from "react";
import PropTypes from "prop-types";
import { Toaster } from "react-hot-toast";
import api from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // empezamos cargando para verificar la sesión
  const [error, setError] = useState(null);

  // edwind, al iniciar la app, le preguntamos al backend "oye, ¿sigo teniendo sesión?"
  // el backend leerá la cookie solita
  useEffect(() => {
    const verifySession = async () => {
      try {
        const res = await api.get("/auth/me");
        setUser(res.data);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    verifySession();
  }, []);

  // edwind, con esta función hacemos login en el backend y guardamos el token jwt
  const login = useCallback(async (username, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post("/auth/signin", { username, password });
      const userData = response.data; // la cookie HttpOnly ya viene pegada en esta respuesta

      setUser(userData);
      return { success: true, user: userData };
    } catch (err) {
      let msg = "Credenciales incorrectas.";
      if (err.response) {
        if (err.response.status === 429) {
          msg =
            err.response?.data?.mensaje ||
            "Demasiados intentos. Por favor, espera 1 minuto.";
        } else if (err.response.data && err.response.data.mensaje) {
          msg = err.response.data.mensaje;
        }
      }
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post("/auth/logout"); // le pedimos al backend que destruya la cookie
    } catch (error) {
      console.error("Error al desloguearse", error);
    }
    setUser(null);
    window.location.href = "/login";
  }, []);

  const isAuthenticated = !!user;

  // edwind, aquí comprobamos si el usuario tiene un rol en específico, como admin por ejemplo
  const hasRole = useCallback((role) => user?.roles?.includes(role), [user]);

  // edwind, usamos useMemo para no crear el objeto a cada rato y mejorar el rendimiento
  const contextValue = useMemo(
    () => ({
      user,
      token: "httpOnly_cookie", // ya no exponemos token
      loading,
      error,
      login,
      logout,
      isAuthenticated,
      hasRole,
    }),
    [user, loading, error, login, logout, isAuthenticated, hasRole],
  );

  return (
    <AuthContext.Provider value={contextValue}>
      {/* edwind, este es el toaster global para mostrar mensajitos en toda la app */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            borderRadius: "10px",
            background: "#1e293b",
            color: "#f1f5f9",
            fontSize: "14px",
          },
          success: {
            iconTheme: { primary: "#22c55e", secondary: "#fff" },
          },
          error: {
            iconTheme: { primary: "#ef4444", secondary: "#fff" },
          },
        }}
      />
      {children}
    </AuthContext.Provider>
  );
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  return ctx;
}

export default AuthContext;

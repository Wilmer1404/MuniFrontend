/* eslint-disable react-refresh/only-export-components */
// los archivos de contexto exportan tanto el Provider como el hook; es intencional
import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Toaster } from 'react-hot-toast';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // inicializa el usuario desde localStorage si ya había sesión guardada
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // inicia sesión contra el backend y guarda el JWT
  const login = useCallback(async (username, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/auth/signin', { username, password });
      const { token: jwt, ...userData } = response.data;

      localStorage.setItem('token', jwt);
      localStorage.setItem('user', JSON.stringify(userData));
      setToken(jwt);
      setUser(userData);
      return { success: true, user: userData };
    } catch (err) {
      const msg = err.response?.data?.message || 'Credenciales incorrectas.';
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  }, []);

  // cierra sesión y limpia todos los datos de la sesión
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  }, []);

  const isAuthenticated = !!token;

  // verifica si el usuario tiene un rol específico (ej: 'ROLE_ADMIN')
  const hasRole = useCallback(
    (role) => user?.roles?.includes(role),
    [user]
  );

  // useMemo evita que el objeto value sea una nueva referencia en cada render
  const contextValue = useMemo(
    () => ({ user, token, loading, error, login, logout, isAuthenticated, hasRole }),
    [user, token, loading, error, login, logout, isAuthenticated, hasRole]
  );

  return (
    <AuthContext.Provider value={contextValue}>
      {/* Toaster global: disponible en toda la app */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            borderRadius: '10px',
            background: '#1e293b',
            color: '#f1f5f9',
            fontSize: '14px',
          },
          success: {
            iconTheme: { primary: '#22c55e', secondary: '#fff' },
          },
          error: {
            iconTheme: { primary: '#ef4444', secondary: '#fff' },
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
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  return ctx;
}

export default AuthContext;

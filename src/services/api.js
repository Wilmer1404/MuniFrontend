import axios from 'axios';

// edwind, esta es nuestra instancia central de axios que apunta al backend
const api = axios.create({
  baseURL: 'https://api-v2.munimarcona.gob.pe/api',
  withCredentials: true, // edwind: IMPORTANT, esto permite enviar y recibir cookies (JWT) en cross-origin
  headers: {
    'Content-Type': 'application/json',
  },
});

// edwind, y este interceptor revisa las respuestas por si la sesión expiró
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    // edwind, si nos da 401 es porque el token ya no sirve, y 403 es que no tenemos permiso
    if (status === 401 || status === 403) {
      localStorage.removeItem('user');
      // edwind, MUY IMPORTANTE: si el error viene de chequear la sesión inicial (/auth/me), no redirigimos porque la app puede ser pública.
      // Solo pateamos al login si la ruta que falló fue otra (ej. intentando guardar algo) o si estamos dentro del panel de admin.
      if (
        !window.location.pathname.startsWith('/login') &&
        error.config?.url !== '/auth/me' &&
        window.location.pathname.startsWith('/admin') // o solo redirigimos si está en una ruta privada
      ) {
        window.location.href = '/login';
      }
    } else if (status === 429) {
      // edwind, el rate limiting bloquea (fuerza bruta). Evitamos que la app explote y mandamos un aviso amigable
      console.warn("Demasiados intentos. Por favor espera y vuelve a intentar.");
    }
    return Promise.reject(error);
  }
);

export default api;

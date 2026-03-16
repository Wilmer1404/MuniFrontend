import axios from 'axios';

// edwind, esta es nuestra instancia central de axios que apunta al backend
const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// edwind, este interceptor agarra cada petición y le mete el token jwt si es que lo tenemos
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// edwind, y este interceptor revisa las respuestas por si el token ya venció o es inválido
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    // edwind, si nos da 401 es porque el token ya no sirve, y 403 es que no tenemos permiso
    if (status === 401 || status === 403) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // edwind, muy importante, solo redirigimos al login si no estamos ya ahí, si no se hace un bucle infinito
      if (!window.location.pathname.startsWith('/login')) {
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

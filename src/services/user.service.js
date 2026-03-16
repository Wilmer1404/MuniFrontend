import api from "./api";

const API_URL = "/usuarios";

export const UserService = {
  // edwind, aquí pedimos todos los usuarios, pero por páginas
  getUsuarios: async (page = 0, size = 10) => {
    const response = await api.get(API_URL, {
      params: { page, size },
    });
    return response.data;
  },

  // edwind, este es para sacar a un usuario usando su id
  getUsuarioById: async (id) => {
    const response = await api.get(`${API_URL}/${id}`);
    return response.data;
  },

  // edwind, con este creamos un nuevo usuario
  createUsuario: async (userData) => {
    const response = await api.post(API_URL, userData);
    return response.data;
  },

  // edwind, y este sirve para actualizar los datos de alguien que ya existe
  updateUsuario: async (id, userData) => {
    const response = await api.put(`${API_URL}/${id}`, userData);
    return response.data;
  },

  // edwind, por último este elimina a un usuario
  deleteUsuario: async (id) => {
    const response = await api.delete(`${API_URL}/${id}`);
    return response.data;
  },
};

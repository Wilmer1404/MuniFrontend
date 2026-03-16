import api from './api';

// edwind, con este traemos a todos los miembros del consejo para que el público los vea
export const getConsejoMiembros = async () => {
  const { data } = await api.get('/consejo');
  return data;
};

// edwind, y con este podemos sacar los datos de un solo miembro usando su id
export const getConsejoMiembroById = async (id) => {
  const { data } = await api.get(`/consejo/${id}`);
  return data;
};

// edwind, aquí es donde los admin pueden crear un nuevo miembro
export const createConsejoMiembro = async (dto) => {
  const { data } = await api.post('/consejo', dto);
  return data;
};

// edwind, este sirve para que el admin actualice la info de alguien del consejo
export const updateConsejoMiembro = async (id, dto) => {
  const { data } = await api.put(`/consejo/${id}`, dto);
  return data;
};

// edwind, y este es clave para subir o cambiarle la foto a un miembro
export const uploadFotoMiembro = async (id, file) => {
  const formData = new FormData();
  formData.append('foto', file);
  const { data } = await api.post(`/consejo/${id}/foto`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};

// edwind, por último este es para borrar a un miembro del consejo
export const deleteConsejoMiembro = async (id) => {
  await api.delete(`/consejo/${id}`);
};

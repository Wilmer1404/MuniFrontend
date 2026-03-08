import api from './api';

// obtener todos los miembros del consejo (público)
export const getConsejoMiembros = async () => {
  const { data } = await api.get('/consejo');
  return data;
};

// obtener un miembro por id (público)
export const getConsejoMiembroById = async (id) => {
  const { data } = await api.get(`/consejo/${id}`);
  return data;
};

// crear un nuevo miembro (admin)
export const createConsejoMiembro = async (dto) => {
  const { data } = await api.post('/consejo', dto);
  return data;
};

// actualizar datos de un miembro (admin)
export const updateConsejoMiembro = async (id, dto) => {
  const { data } = await api.put(`/consejo/${id}`, dto);
  return data;
};

// subir o reemplazar la foto de un miembro (admin)
export const uploadFotoMiembro = async (id, file) => {
  const formData = new FormData();
  formData.append('foto', file);
  const { data } = await api.post(`/consejo/${id}/foto`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};

// eliminar un miembro (admin)
export const deleteConsejoMiembro = async (id) => {
  await api.delete(`/consejo/${id}`);
};

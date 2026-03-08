import api from './api';

// obtener la URL del PDF del organigrama actual
export const getOrganigramaUrl = async () => {
  const { data } = await api.get('/organigrama');
  return data;
};

// subir o reemplazar el PDF del organigrama (solo admin)
export const uploadOrganigrama = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  const { data } = await api.post('/organigrama/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};

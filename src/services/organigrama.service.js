import api from './api';

// edwind, esto nos trae la url del pdf del organigrama que está publicado
export const getOrganigramaUrl = async () => {
  const { data } = await api.get('/organigrama');
  return data;
};

// edwind, y con este los admin pueden subir un nuevo organigrama o reemplazar el de ahorita
export const uploadOrganigrama = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  const { data } = await api.post('/organigrama/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};

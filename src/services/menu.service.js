import api from './api';

export const getPublicMenu = async () => {
  const { data } = await api.get('/menu/public');
  return data;
};

export const getAllMenusAdmin = async () => {
    const { data } = await api.get('/menu');
    return data;
};

export const createMenu = async (menuData) => {
    const { data } = await api.post('/menu', menuData);
    return data;
};

export const updateMenu = async (id, menuData) => {
    const { data } = await api.put(`/menu/${id}`, menuData);
    return data;
};

export const deleteMenu = async (id) => {
    const { data } = await api.delete(`/menu/${id}`);
    return data;
};

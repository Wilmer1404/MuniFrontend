import api from './api';

export const getPublicPageBySlug = async (slug) => {
    const { data } = await api.get(`/pages/public/${slug}`);
    return data;
};

export const getAllPagesAdmin = async () => {
    const { data } = await api.get('/pages');
    return data;
};

export const getPageByIdAdmin = async (id) => {
    const { data } = await api.get(`/pages/${id}`);
    return data;
};

export const createPage = async (pageData) => {
    const { data } = await api.post('/pages', pageData);
    return data;
};

export const updatePage = async (id, pageData) => {
    const { data } = await api.put(`/pages/${id}`, pageData);
    return data;
};

export const deletePage = async (id) => {
    const { data } = await api.delete(`/pages/${id}`);
    return data;
};

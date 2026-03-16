import api from "./api";

/**
 * edwind, esta función es para hacer la búsqueda global en noticias y documentos.
 * @param {string} query Lo que el usuario escribió para buscar
 * @returns {Promise<{noticias: Array, documentos: Array}>} Los resultados que nos manda el backend
 */
export const globalSearch = async (query) => {
  if (!query) return { noticias: [], documentos: [] };
  const response = await api.get(`/search?q=${encodeURIComponent(query)}`);
  return response.data;
};

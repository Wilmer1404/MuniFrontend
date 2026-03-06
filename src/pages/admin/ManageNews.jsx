import { useState, useEffect, useCallback } from 'react';
import { Plus, Pencil, Trash2, Search, X, Loader2, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const CATEGORY_COLORS = {
  Obras: 'bg-blue-100 text-blue-700',
  Salud: 'bg-emerald-100 text-emerald-700',
  Comunicado: 'bg-purple-100 text-purple-700',
  Normativa: 'bg-orange-100 text-orange-700',
  Cultura: 'bg-pink-100 text-pink-700',
  Educación: 'bg-indigo-100 text-indigo-700',
};

const FORM_INITIAL = {
  titulo: '',
  contenido: '',
  urlImagen: '',
  categoria: '',
  destacada: false,
};

// formatea fecha ISO a formato legible
function formatDate(iso) {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleDateString('es-PE', {
      day: '2-digit', month: 'short', year: 'numeric',
    });
  } catch {
    return iso;
  }
}

export default function ManageNews() {
  const { user } = useAuth();
  const [noticias, setNoticias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');

  // estado del modal
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState(FORM_INITIAL);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // carga la lista de noticias desde el backend
  const fetchNoticias = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/noticias', { params: { size: 50 } });
      // el backend devuelve Page<NoticiaResponse>; extraemos el contenido
      const data = res.data?.content ?? res.data;
      setNoticias(Array.isArray(data) ? data : []);
    } catch (err) {
      const msg = err.response?.data?.message || 'Error al cargar noticias.';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNoticias();
  }, [fetchNoticias]);

  const filtered = noticias.filter(
    (n) =>
      n.titulo?.toLowerCase().includes(search.toLowerCase()) ||
      n.categoria?.toLowerCase().includes(search.toLowerCase())
  );

  // abre el modal para crear
  function openCreateModal() {
    setEditingId(null);
    setFormData({ ...FORM_INITIAL, autorId: user?.id });
    setModalOpen(true);
  }

  // abre el modal para editar
  function openEditModal(noticia) {
    setEditingId(noticia.id);
    setFormData({
      titulo: noticia.titulo,
      contenido: noticia.contenido,
      urlImagen: noticia.urlImagen || '',
      categoria: noticia.categoria,
      destacada: noticia.destacada,
      autorId: user?.id,
    });
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setFormData(FORM_INITIAL);
    setEditingId(null);
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  }

  // crea o edita una noticia
  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingId) {
        await api.put(`/noticias/${editingId}`, formData);
        toast.success('¡Noticia actualizada con éxito!');
      } else {
        await api.post('/noticias', formData);
        toast.success('¡Noticia publicada con éxito!');
      }
      closeModal();
      fetchNoticias();
    } catch (err) {
      const msg = err.response?.data?.message || 'No se pudo guardar la noticia.';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  }

  // elimina una noticia
  async function handleDelete(id, titulo) {
    if (!window.confirm(`¿Eliminar la noticia "${titulo}"? Esta acción no se puede deshacer.`)) return;
    try {
      await api.delete(`/noticias/${id}`);
      toast.success('Noticia eliminada correctamente.');
      setNoticias((prev) => prev.filter((n) => n.id !== id));
    } catch (err) {
      const msg = err.response?.data?.message || 'No se pudo eliminar la noticia.';
      toast.error(msg);
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Gestionar Noticias</h1>
          <p className="text-gray-500 text-sm mt-1">
            {loading ? 'Cargando...' : `${noticias.length} noticias en total`}
          </p>
        </div>
        <button
          id="create-news-btn"
          onClick={openCreateModal}
          className="btn-primary text-sm"
        >
          <Plus size={16} strokeWidth={2} />
          Crear Noticia
        </button>
      </div>

      {/* Buscador */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-5">
        <div className="relative max-w-sm">
          <Search size={16} strokeWidth={1.5} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            id="news-search"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por título o categoría..."
            className="w-full border border-gray-200 rounded-lg pl-9 pr-4 py-2 text-sm
                       focus:outline-none focus:ring-2 focus:ring-marcona-blue/30 focus:border-marcona-blue transition"
          />
        </div>
      </div>

      {/* Error del fetch */}
      {error && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-100 text-red-700 rounded-xl px-5 py-4 mb-5">
          <AlertCircle size={16} className="flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Tabla */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3.5">ID</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3.5">Título</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3.5">Categoría</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3.5">Fecha</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3.5">Autor</th>
                <th className="text-center text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3.5">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                // filas skeleton mientras carga
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-5 py-4"><div className="h-3 bg-gray-200 rounded w-8" /></td>
                    <td className="px-5 py-4"><div className="h-3 bg-gray-200 rounded w-48" /></td>
                    <td className="px-5 py-4"><div className="h-3 bg-gray-200 rounded w-20" /></td>
                    <td className="px-5 py-4"><div className="h-3 bg-gray-200 rounded w-24" /></td>
                    <td className="px-5 py-4"><div className="h-3 bg-gray-200 rounded w-16" /></td>
                    <td className="px-5 py-4"><div className="h-3 bg-gray-200 rounded w-16 mx-auto" /></td>
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center text-gray-400 text-sm py-10">
                    No se encontraron noticias
                  </td>
                </tr>
              ) : (
                filtered.map((n) => (
                  <tr key={n.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3.5 text-gray-400 font-mono text-xs">#{n.id}</td>
                    <td className="px-5 py-3.5 font-medium text-gray-800 max-w-xs truncate">
                      {n.titulo}
                      {n.destacada && (
                        <span className="ml-2 text-[10px] bg-marcona-gold/20 text-marcona-gold font-bold px-1.5 py-0.5 rounded-full">
                          Destacada
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold
                        ${CATEGORY_COLORS[n.categoria] || 'bg-gray-100 text-gray-600'}`}>
                        {n.categoria}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-gray-500 text-xs">{formatDate(n.fechaPublicacion)}</td>
                    <td className="px-5 py-3.5 text-gray-500 text-xs">{n.autorUsername}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => openEditModal(n)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-green-600 hover:bg-green-50 transition-all"
                          title="Editar"
                        >
                          <Pencil size={15} strokeWidth={1.5} />
                        </button>
                        <button
                          onClick={() => handleDelete(n.id, n.titulo)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all"
                          title="Eliminar"
                        >
                          <Trash2 size={15} strokeWidth={1.5} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pie de tabla */}
        {!loading && (
          <div className="px-5 py-4 border-t border-gray-100 flex items-center justify-between">
            <p className="text-xs text-gray-400">{filtered.length} resultados</p>
          </div>
        )}
      </div>

      {/* Modal de crear / editar */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}
        >
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            {/* Cabecera del modal */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-extrabold text-gray-900 text-lg">
                {editingId ? 'Editar Noticia' : 'Nueva Noticia'}
              </h2>
              <button onClick={closeModal} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors">
                <X size={18} />
              </button>
            </div>

            {/* Formulario */}
            <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
              {/* Título */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                  Título <span className="text-red-500">*</span>
                </label>
                <input
                  name="titulo"
                  value={formData.titulo}
                  onChange={handleChange}
                  required
                  maxLength={200}
                  placeholder="Ej: Inauguración del nuevo parque..."
                  className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm
                             focus:outline-none focus:ring-2 focus:ring-marcona-blue/30 focus:border-marcona-blue transition"
                />
              </div>

              {/* Categoría */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                  Categoría <span className="text-red-500">*</span>
                </label>
                <select
                  name="categoria"
                  value={formData.categoria}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm
                             focus:outline-none focus:ring-2 focus:ring-marcona-blue/30 focus:border-marcona-blue transition"
                >
                  <option value="">Seleccionar categoría...</option>
                  <option value="Obras">Obras</option>
                  <option value="Salud">Salud</option>
                  <option value="Comunicado">Comunicado</option>
                  <option value="Normativa">Normativa</option>
                  <option value="Cultura">Cultura</option>
                  <option value="Educación">Educación</option>
                </select>
              </div>

              {/* URL de Imagen */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">URL de Imagen</label>
                <input
                  name="urlImagen"
                  value={formData.urlImagen}
                  onChange={handleChange}
                  placeholder="https://ejemplo.com/imagen.jpg"
                  type="url"
                  className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm
                             focus:outline-none focus:ring-2 focus:ring-marcona-blue/30 focus:border-marcona-blue transition"
                />
              </div>

              {/* Contenido */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                  Contenido <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="contenido"
                  value={formData.contenido}
                  onChange={handleChange}
                  required
                  rows={4}
                  placeholder="Redacta el contenido completo de la noticia..."
                  className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm resize-none
                             focus:outline-none focus:ring-2 focus:ring-marcona-blue/30 focus:border-marcona-blue transition"
                />
              </div>

              {/* Destacada */}
              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  name="destacada"
                  checked={formData.destacada}
                  onChange={handleChange}
                  className="w-4 h-4 text-marcona-blue accent-marcona-blue rounded"
                />
                <span className="text-sm text-gray-700">Marcar como destacada</span>
              </label>

              {/* Botones */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600
                             hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 btn-primary text-sm justify-center"
                >
                  {submitting ? (
                    <span className="flex items-center gap-2 justify-center">
                      <Loader2 size={15} className="animate-spin" />
                      Guardando...
                    </span>
                  ) : (
                    editingId ? 'Guardar Cambios' : 'Publicar Noticia'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

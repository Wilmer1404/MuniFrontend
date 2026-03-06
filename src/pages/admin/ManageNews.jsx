import { useState } from 'react';
import { Plus, Pencil, Trash2, Search, Eye } from 'lucide-react';

const MOCK_NEWS = [
  { id: 1, title: 'Entrega de nueva obra en Barrio Nuevo', category: 'Obras', date: '2026-03-02', status: 'Publicado', author: 'admin' },
  { id: 2, title: 'Campaña de Salud Gratuita en Plaza de Armas', category: 'Salud', date: '2026-02-28', status: 'Publicado', author: 'editor1' },
  { id: 3, title: 'Comunicado Oficial sobre horarios de atención', category: 'Comunicado', date: '2026-02-25', status: 'Publicado', author: 'admin' },
  { id: 4, title: 'Nueva ordenanza de tránsito vehicular', category: 'Normativa', date: '2026-02-20', status: 'Borrador', author: 'editor1' },
  { id: 5, title: 'Inauguración del nuevo parque recreacional', category: 'Obras', date: '2026-02-15', status: 'Publicado', author: 'admin' },
];

const STATUS_COLORS = {
  Publicado: 'bg-green-100 text-green-700',
  Borrador: 'bg-yellow-100 text-yellow-700',
  Archivado: 'bg-gray-100 text-gray-600',
};

const CATEGORY_COLORS = {
  Obras: 'bg-blue-100 text-blue-700',
  Salud: 'bg-emerald-100 text-emerald-700',
  Comunicado: 'bg-purple-100 text-purple-700',
  Normativa: 'bg-orange-100 text-orange-700',
};

export default function ManageNews() {
  const [search, setSearch] = useState('');
  const [news, setNews] = useState(MOCK_NEWS);

  const filtered = news.filter(
    (n) =>
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id) => {
    if (window.confirm('¿Eliminar esta noticia?')) {
      setNews((prev) => prev.filter((n) => n.id !== id));
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Gestionar Noticias</h1>
          <p className="text-gray-500 text-sm mt-1">{news.length} noticias en total</p>
        </div>
        <button
          id="create-news-btn"
          className="btn-primary text-sm"
        >
          <Plus size={16} strokeWidth={2} />
          Crear Noticia
        </button>
      </div>

      {/* Filtros */}
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
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3.5">Estado</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3.5">Autor</th>
                <th className="text-center text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3.5">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center text-gray-400 text-sm py-10">
                    No se encontraron noticias
                  </td>
                </tr>
              ) : (
                filtered.map((n) => (
                  <tr key={n.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3.5 text-gray-400 font-mono text-xs">#{n.id}</td>
                    <td className="px-5 py-3.5 font-medium text-gray-800 max-w-xs truncate">{n.title}</td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold ${CATEGORY_COLORS[n.category] || 'bg-gray-100 text-gray-600'}`}>
                        {n.category}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-gray-500 text-xs">{n.date}</td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold ${STATUS_COLORS[n.status] || 'bg-gray-100 text-gray-600'}`}>
                        {n.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-gray-500 text-xs">{n.author}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-center gap-2">
                        <button className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all" title="Ver">
                          <Eye size={15} strokeWidth={1.5} />
                        </button>
                        <button className="p-1.5 rounded-lg text-gray-400 hover:text-green-600 hover:bg-green-50 transition-all" title="Editar">
                          <Pencil size={15} strokeWidth={1.5} />
                        </button>
                        <button
                          onClick={() => handleDelete(n.id)}
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

        {/* Pagination placeholder */}
        <div className="px-5 py-4 border-t border-gray-100 flex items-center justify-between">
          <p className="text-xs text-gray-400">{filtered.length} resultados</p>
          <div className="flex items-center gap-1">
            <button className="px-3 py-1.5 rounded-lg text-xs text-gray-500 hover:bg-gray-100 disabled:opacity-40 transition-colors" disabled>
              ← Anterior
            </button>
            <span className="px-3 py-1.5 rounded-lg bg-marcona-blue text-white text-xs font-semibold">1</span>
            <button className="px-3 py-1.5 rounded-lg text-xs text-gray-500 hover:bg-gray-100 transition-colors">
              Siguiente →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

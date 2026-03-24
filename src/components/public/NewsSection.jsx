import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Tag,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import api from "../../services/api";

// edwind, aquí les asignamos un colorcito a cada categoría para que se vean diferentes
const CATEGORY_COLORS = {
  Obras: "bg-blue-600",
  Salud: "bg-green-600",
  Comunicado: "bg-marcona-gold",
  Normativa: "bg-orange-600",
  Cultura: "bg-purple-600",
  Educación: "bg-indigo-600",
};

// edwind, arreglamos las fechas feas para que salgan como "15 oct 2026"
function formatDate(isoString) {
  if (!isoString) return "";
  try {
    return new Date(isoString).toLocaleDateString("es-PE", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return isoString;
  }
}

// edwind, estas son las tarjetas grises que parpadean mientras cargan las noticias reales
function NewsCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-md border border-gray-100 animate-pulse">
      <div className="h-48 bg-gray-200" />
      <div className="p-5 space-y-3">
        <div className="h-3 bg-gray-200 rounded w-1/4" />
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-200 rounded w-full" />
        <div className="h-3 bg-gray-200 rounded w-5/6" />
      </div>
    </div>
  );
}

export default function NewsSection() {
  const [noticias, setNoticias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    let cancelled = false;

    async function fetchNoticias() {
      setLoading(true);
      try {
        const res = await api.get(`/noticias?page=${page}&size=6`);
        if (!cancelled) {
          setNoticias(res.data.content || []);
          setTotalPages(res.data.totalPages || 1);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            "No se pudieron cargar las noticias. Intente nuevamente más tarde.",
          );
          console.error("Error al cargar noticias recientes:", err);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchNoticias();

    // edwind, limpiamos todo si el usuario se va a otra página antes de que carguen las noticias
    return () => {
      cancelled = true;
    };
  }, [page]);

  return (
    <section className="py-14 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* edwind, el encabezado de las noticias en la página principal */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-marcona-gold font-semibold text-xs uppercase tracking-widest mb-1">
              Últimas actualizaciones
            </p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
              Noticias y Comunicados
            </h2>
          </div>
        </div>

        {/* edwind, si algo falló, mostramos un cuadrito rojo de alerta */}
        {error && (
          <div className="flex items-center gap-3 bg-red-50 border border-red-100 text-red-700 rounded-xl px-5 py-4 mb-6">
            <AlertCircle
              size={18}
              strokeWidth={1.5}
              className="flex-shrink-0"
            />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* edwind, aquí enfilamos todas las noticias como si fueran cartas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            // edwind, mostramos los esqueletos grises si todavía está cargando
            Array.from({ length: 3 }).map((_, i) => (
              <NewsCardSkeleton key={i} />
            ))
          ) : noticias.length === 0 && !error ? (
            <p className="col-span-3 text-center text-gray-400 py-10 text-sm">
              No hay noticias disponibles por el momento.
            </p>
          ) : (
            noticias.map((item) => {
              const badgeColor =
                CATEGORY_COLORS[item.categoria] || "bg-gray-500";
              return (
                <article
                  key={item.id}
                  className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl
                             transition-all duration-300 hover:-translate-y-1 border border-gray-100"
                >
                  {/* edwind, ponemos la foto principal de la noticia, o un fondo por defecto si no tiene */}
                  <div className="relative h-48 overflow-hidden">
                    {item.urlImagen ? (
                      <img
                        src={item.urlImagen}
                        alt={item.titulo}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-marcona-blue/10 to-marcona-blue/30 flex items-center justify-center">
                        <div className="text-center px-6">
                          <div className="w-12 h-12 bg-marcona-blue/20 rounded-full flex items-center justify-center mx-auto mb-2">
                            <Tag
                              size={20}
                              strokeWidth={1.5}
                              className="text-marcona-blue"
                            />
                          </div>
                          <p className="text-marcona-blue/60 text-xs font-medium">
                            Comunicado oficial
                          </p>
                        </div>
                      </div>
                    )}

                    {/* edwind, la etiquetita de color que indica qué tipo de noticia es */}
                    <span
                      className={`absolute top-3 left-3 ${badgeColor} text-white text-[11px] font-bold px-2.5 py-1 rounded-full`}
                    >
                      {item.categoria}
                    </span>
                  </div>

                  {/* edwind, el texto de la noticia y el enlace a leer más */}
                  <div className="p-5">
                    <time className="text-gray-400 text-xs font-medium">
                      {formatDate(item.fechaPublicacion)}
                    </time>
                    <h3 className="font-bold text-gray-800 text-sm mt-1 mb-2 leading-snug group-hover:text-marcona-blue transition-colors">
                      {item.titulo}
                    </h3>
                    <div
                      className="text-gray-500 text-xs leading-relaxed line-clamp-3 prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: item.contenido }}
                    />
                    <Link
                      to={`/noticias/${item.id}`}
                      className="inline-flex items-center gap-1 text-marcona-blue font-semibold text-xs mt-4 hover:text-blue-800 transition-colors"
                    >
                      Leer más <ArrowRight size={13} strokeWidth={2} />
                    </Link>
                  </div>
                </article>
              );
            })
          )}
        </div>

        {/* edwind, unos botoncitos elegantes abajo para pasar de página */}
        {!loading && totalPages > 1 && (
          <div className="mt-12 flex items-center justify-center gap-4">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="w-10 h-10 rounded-full flex items-center justify-center border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-marcona-blue disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-marcona-blue/20"
              aria-label="Página anterior"
            >
              <ChevronLeft size={20} strokeWidth={1.5} />
            </button>
            <span className="text-sm font-medium text-gray-400">
              Página <strong className="text-gray-700">{page + 1}</strong> de{" "}
              {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              className="w-10 h-10 rounded-full flex items-center justify-center border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-marcona-blue disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-marcona-blue/20"
              aria-label="Página siguiente"
            >
              <ChevronRight size={20} strokeWidth={1.5} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

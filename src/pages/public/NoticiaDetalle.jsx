import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  User,
  FileText,
  Image as ImageIcon,
} from "lucide-react";
import api from "../../services/api";
import TopBar from "../../components/public/TopBar";
import Navbar from "../../components/public/Navbar";
import Footer from "../../components/public/Footer";

function formatDate(isoString) {
  if (!isoString) return "";
  return new Date(isoString).toLocaleDateString("es-PE", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

const CATEGORY_COLORS = {
  Obras: "bg-blue-100 text-blue-800",
  Salud: "bg-emerald-100 text-emerald-800",
  Comunicado: "bg-purple-100 text-purple-800",
  Normativa: "bg-orange-100 text-orange-800",
  Cultura: "bg-pink-100 text-pink-800",
  Educación: "bg-indigo-100 text-indigo-800",
};

export default function NoticiaDetalle() {
  const { id } = useParams();
  const [noticia, setNoticia] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchNoticia() {
      try {
        const res = await api.get(`/noticias/${id}`);
        setNoticia(res.data);
      } catch (err) {
        setError("No se pudo cargar la noticia.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchNoticia();
  }, [id]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <TopBar />
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-10">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-marcona-blue mb-8 transition-colors"
        >
          <ArrowLeft size={16} />
          Volver al Inicio
        </Link>

        {loading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4" />
            <div className="h-64 bg-gray-200 rounded-2xl" />
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-5/6" />
            <div className="h-4 bg-gray-200 rounded w-4/6" />
          </div>
        ) : error ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-2">Error</h2>
            <p className="text-gray-500">{error}</p>
          </div>
        ) : !noticia ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800">
              Noticia no encontrada
            </h2>
          </div>
        ) : (
          <article className="bg-white rounded-3xl shadow-md border border-gray-100 overflow-hidden">
            {noticia.urlImagen ? (
              <img
                src={noticia.urlImagen}
                alt={noticia.titulo}
                className="w-full h-64 sm:h-96 object-cover object-center"
              />
            ) : (
              <div className="w-full h-48 sm:h-64 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                <ImageIcon size={48} className="text-gray-300" />
              </div>
            )}

            <div className="p-5 sm:p-8 md:p-12">
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide
                  ${CATEGORY_COLORS[noticia.categoria] || "bg-gray-100 text-gray-600"}`}
                >
                  {noticia.categoria}
                </span>

                <div className="flex items-center gap-1.5 text-sm text-gray-500 font-medium">
                  <Calendar size={16} />
                  <time>{formatDate(noticia.fechaPublicacion)}</time>
                </div>

                {noticia.autorUsername && (
                  <div className="flex items-center gap-1.5 text-sm text-gray-500 font-medium">
                    <User size={16} />
                    <span>Redacción: {noticia.autorUsername}</span>
                  </div>
                )}
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight mb-8">
                {noticia.titulo}
              </h1>

              <div
                className="prose prose-blue max-w-none text-gray-600 text-[15px] sm:text-base leading-relaxed break-words"
                dangerouslySetInnerHTML={{ __html: noticia.contenido }}
              />

              {noticia.urlPdf && (
                <div className="mt-12 pt-8 border-t border-gray-100">
                  <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <FileText size={18} className="text-marcona-blue" />
                    Documento Adjunto disponible
                  </h3>
                  <a
                    href={noticia.urlPdf}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 sm:gap-3 bg-white border border-gray-200 hover:border-marcona-blue hover:text-marcona-blue text-gray-700
                               px-4 sm:px-6 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-colors shadow-sm text-center w-full sm:w-auto"
                  >
                    <FileText size={16} className="shrink-0" />
                    <span className="truncate">Consultar Documento PDF</span>
                  </a>
                </div>
              )}
            </div>
          </article>
        )}
      </main>

      <Footer />
    </div>
  );
}

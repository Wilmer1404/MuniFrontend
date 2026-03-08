import React, { useState, useEffect } from "react";
import { useParams, Navigate } from "react-router-dom";
import { getPublicPageBySlug } from "../../services/page.service";
import { FileText, ExternalLink, AlertCircle } from "lucide-react";
import TopBar from "../../components/public/TopBar";
import Navbar from "../../components/public/Navbar";
import Footer from "../../components/public/Footer";

export default function DynamicPage() {
  const { slug } = useParams();
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        const data = await getPublicPageBySlug(slug);
        setPage(data);
        setError(null);

        // Si es un enlace externo, redirigir inmediatamente
        if (data.contentType === "EXTERNAL_LINK" && data.externalUrl) {
          window.location.href = data.externalUrl;
        }
      } catch (err) {
        console.error("Error fetching dynamic page:", err);
        setError("No se pudo encontrar la página solicitada.");
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchContent();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <TopBar />
        <Navbar />
        <main className="flex-1 min-h-[50vh] flex items-center justify-center">
          <div className="flex flex-col items-center text-marcona-blue animate-pulse">
            <div className="w-12 h-12 border-4 border-marcona-blue border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="font-semibold text-lg">Cargando contenido...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !page) {
    return (
      <div className="min-h-screen flex flex-col">
        <TopBar />
        <Navbar />
        <main className="flex-1 min-h-[50vh] flex items-center justify-center p-4">
          <div className="bg-red-50 text-red-700 p-8 rounded-2xl max-w-md w-full text-center shadow-sm">
            <AlertCircle size={48} className="mx-auto mb-4 opacity-50" />
            <h2 className="text-xl font-bold mb-2">Página no encontrada</h2>
            <p>
              {error ||
                "El enlace podría estar roto o la página fue eliminada."}
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Render para contenido HTML Rico
  if (page.contentType === "HTML") {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <TopBar />
        <Navbar />

        <main className="flex-1 pb-16">
          {/* Header simple */}
          <div className="bg-marcona-blue text-white py-12 px-4 shadow-md">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-3xl md:text-5xl font-bold">{page.title}</h1>
            </div>
          </div>

          {/* Contenido HTML inyectado */}
          <div className="max-w-4xl mx-auto px-4 py-12">
            <div
              className="prose prose-lg prose-blue max-w-none text-gray-800"
              dangerouslySetInnerHTML={{ __html: page.content }}
            />
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  // Render para PDF embebido
  if (page.contentType === "PDF") {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <TopBar />
        <Navbar />

        <main className="flex-1 flex flex-col">
          <div className="bg-white border-b px-4 py-4 md:px-8 flex justify-between items-center shadow-sm">
            <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <FileText className="text-marcona-blue" />
              {page.title}
            </h1>
            <a
              href={page.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm bg-marcona-blue text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors"
            >
              <ExternalLink size={16} />
              Abrir en nueva pestaña
            </a>
          </div>

          <div className="flex-grow p-4 md:p-8 flex items-center justify-center">
            <div className="w-full h-full min-h-[70vh] max-w-6xl bg-white shadow-xl rounded-xl overflow-hidden border border-gray-200">
              {page.fileUrl ? (
                <iframe
                  src={`${page.fileUrl}#view=FitH`}
                  title={page.title}
                  className="w-full h-full min-h-[70vh] bg-gray-100"
                  frameBorder="0"
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full min-h-[50vh] text-gray-500">
                  <AlertCircle size={48} className="text-gray-300 mb-4" />
                  <p>El documento no está disponible temporalmente.</p>
                </div>
              )}
            </div>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  // Si es un enlace externo, deberíamos haber redirigido en el useEffect,
  // pero por si acaso renderizamos un mensaje con el enlace.
  if (page.contentType === "EXTERNAL_LINK") {
    return (
      <div className="min-h-screen flex flex-col">
        <TopBar />
        <Navbar />

        <main className="flex-1 min-h-[50vh] flex items-center justify-center flex-col p-4 text-center">
          <div className="w-16 h-16 bg-blue-50 text-marcona-blue rounded-full flex items-center justify-center mb-6">
            <ExternalLink size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Redirigiendo...
          </h2>
          <p className="text-gray-600 mb-6">
            Estamos enviándote a un enlace externo de {page.title}.
          </p>
          <a
            href={page.externalUrl}
            className="text-marcona-blue font-semibold hover:underline"
          >
            Si no eres redirigido, haz clic aquí
          </a>
        </main>

        <Footer />
      </div>
    );
  }

  return null;
}

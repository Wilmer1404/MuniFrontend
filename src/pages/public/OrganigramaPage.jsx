import React, { useState, useEffect } from "react";
import { FileText, ExternalLink, AlertCircle } from "lucide-react";
import TopBar from "../../components/public/TopBar";
import Navbar from "../../components/public/Navbar";
import Footer from "../../components/public/Footer";
import { getOrganigramaUrl } from "../../services/organigrama.service";

export default function OrganigramaPage() {
  const [pdfUrl, setPdfUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPdf = async () => {
      try {
        setLoading(true);
        const data = await getOrganigramaUrl();
        setPdfUrl(data.pdfUrl && data.pdfUrl !== "" ? data.pdfUrl : null);
      } catch (err) {
        console.error("Error fetching organigrama:", err);
        setError("No se pudo cargar el organigrama.");
      } finally {
        setLoading(false);
      }
    };
    fetchPdf();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <TopBar />
      <Navbar />

      {/* Página header */}
      <div className="bg-marcona-blue text-white py-10 px-4 shadow-md">
        <div className="max-w-6xl mx-auto flex items-center gap-4">
          <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
            <FileText size={24} className="text-marcona-yellow" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold">
              Organigrama Institucional
            </h1>
            <p className="text-blue-200 mt-1">
              Municipalidad Distrital de Marcona
            </p>
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-10">
        {loading && (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="w-10 h-10 border-4 border-marcona-blue border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {!loading && error && (
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="bg-red-50 text-red-700 p-8 rounded-2xl max-w-md text-center">
              <AlertCircle size={48} className="mx-auto mb-3 opacity-40" />
              <p className="font-semibold">{error}</p>
            </div>
          </div>
        )}

        {!loading && !error && !pdfUrl && (
          <div className="flex items-center justify-center min-h-[50vh] flex-col text-gray-400">
            <FileText size={64} className="mb-4 opacity-30" />
            <p className="text-xl font-semibold">Organigrama no disponible</p>
            <p className="text-sm mt-1">
              El administrador aún no ha subido el documento.
            </p>
          </div>
        )}

        {!loading && pdfUrl && (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
            {/* Toolbar */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50">
              <div className="flex items-center gap-2 text-gray-700">
                <FileText size={20} className="text-marcona-blue" />
                <span className="font-semibold">
                  Organigrama Institucional 2024
                </span>
              </div>
              <a
                href={pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm bg-marcona-blue text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors"
              >
                <ExternalLink size={15} />
                Abrir en nueva pestaña
              </a>
            </div>

            {/* PDF Viewer */}
            <div className="w-full" style={{ height: "75vh" }}>
              <iframe
                src={`${pdfUrl}#view=FitH`}
                title="Organigrama Institucional"
                className="w-full h-full bg-gray-100"
                frameBorder="0"
              />
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

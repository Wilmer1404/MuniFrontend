import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import {
  FileText,
  Upload,
  CheckCircle,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import {
  getOrganigramaUrl,
  uploadOrganigrama,
} from "../../services/organigrama.service";

export default function ManageOrganigrama() {
  const [currentPdf, setCurrentPdf] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchCurrent();
  }, []);

  const fetchCurrent = async () => {
    try {
      const data = await getOrganigramaUrl();
      setCurrentPdf(data.pdfUrl || null);
    } catch (err) {
      console.error("Error al obtener organigrama:", err);
      setErrorMsg("No se pudo obtener el organigrama actual.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      setErrorMsg("Solo se aceptan archivos PDF.");
      return;
    }

    setUploading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const result = await uploadOrganigrama(file);
      setCurrentPdf(result.pdfUrl);
      setSuccessMsg("¡Organigrama actualizado exitosamente!");
    } catch (err) {
      console.error("Error al subir organigrama:", err);
      setErrorMsg("Error al subir el archivo. Inténtalo de nuevo.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDropZoneKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">
            Organigrama Institucional
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Gestiona el documento PDF del organigrama que verá el público
          </p>
        </div>
      </div>

      {/* Alertas */}
      {successMsg && (
        <div className="flex items-center gap-3 bg-green-50 border border-green-200 text-green-700 rounded-xl px-5 py-4">
          <CheckCircle size={20} />
          <span className="text-sm font-medium">{successMsg}</span>
        </div>
      )}
      {errorMsg && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 rounded-xl px-5 py-4">
          <AlertCircle size={20} />
          <span className="text-sm font-medium">{errorMsg}</span>
        </div>
      )}

      {/* Upload Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
        <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
          <Upload size={20} className="text-marcona-blue" />
          Subir / Reemplazar PDF
        </h2>

        {/* zona de click accesible */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => fileInputRef.current?.click()}
          onKeyDown={handleDropZoneKeyDown}
          className={`border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center text-center cursor-pointer transition-colors
          ${uploading ? "border-gray-200 bg-gray-50" : "border-marcona-blue/30 hover:border-marcona-blue hover:bg-blue-50/30"}`}
          aria-label="Seleccionar un PDF para subir como organigrama"
          aria-disabled={uploading}
        >
          {uploading ? (
            <>
              <div className="w-10 h-10 border-4 border-marcona-blue border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-gray-600 font-medium">Subiendo archivo...</p>
            </>
          ) : (
            <>
              <div className="w-14 h-14 bg-blue-50 text-marcona-blue rounded-2xl flex items-center justify-center mb-4">
                <FileText size={28} />
              </div>
              <p className="font-bold text-gray-800 mb-1">
                Haz clic para seleccionar un PDF
              </p>
              <p className="text-gray-500 text-sm">
                Solo archivos .pdf · Máximo 50MB
              </p>
            </>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          className="hidden"
          disabled={uploading}
        />
      </div>

      {/* Current PDF Preview */}
      {!loading && currentPdf && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50">
            <div className="flex items-center gap-2 text-gray-700">
              <FileText size={18} className="text-marcona-blue" />
              <span className="font-semibold text-sm">PDF Actual</span>
            </div>
            <a
              href={currentPdf}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs text-marcona-blue hover:underline"
            >
              <ExternalLink size={13} />
              Abrir
            </a>
          </div>
          <div style={{ height: "60vh" }}>
            <iframe
              src={`${currentPdf}#view=FitH`}
              title="Organigrama actual"
              className="w-full h-full bg-gray-100"
            />
          </div>
        </div>
      )}

      {!loading && !currentPdf && (
        <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-12 text-center text-gray-400">
          <FileText size={48} className="mx-auto mb-3 opacity-20" />
          <p className="font-semibold">
            Aún no se ha subido ningún organigrama.
          </p>
          <p className="text-sm mt-1">
            Usa el área de arriba para subir el primer PDF.
          </p>
        </div>
      )}
    </div>
  );
}

ManageOrganigrama.propTypes = {};

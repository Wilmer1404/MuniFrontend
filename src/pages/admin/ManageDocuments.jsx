import { useState, useEffect, useCallback, useRef } from "react";
import {
  FileText,
  Upload,
  Download,
  Search,
  Trash2,
  X,
  Loader2,
  AlertCircle,
  CheckCircle,
  Link2,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const TYPE_COLORS = {
  Ordenanzas: "bg-blue-50 text-blue-700",
  Resoluciones: "bg-purple-50 text-purple-700",
  Planificación: "bg-green-50 text-green-700",
  Presupuesto: "bg-amber-50 text-amber-700",
  Decretos: "bg-red-50 text-red-700",
};

const DOC_FORM_INITIAL = {
  tipo: "",
  numero: "",
  anio: new Date().getFullYear(),
  titulo: "",
};

function formatDate(dateStr) {
  if (!dateStr) return "—";
  try {
    return new Date(dateStr).toLocaleDateString("es-PE", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

export default function ManageDocuments() {
  const { user } = useAuth();
  const [documentos, setDocumentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  // estado del modal
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState(DOC_FORM_INITIAL);
  const [submitting, setSubmitting] = useState(false);

  // pdf desde dispositivo
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfName, setPdfName] = useState("");
  const pdfInputRef = useRef(null);

  const fetchDocumentos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/documentos", { params: { size: 100 } });
      // el backend devuelve Page<DocumentoResponse>
      const data = res.data?.content ?? res.data;
      setDocumentos(Array.isArray(data) ? data : []);
    } catch (err) {
      const msg = err.response?.data?.message || "Error al cargar documentos.";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDocumentos();
  }, [fetchDocumentos]);

  const filtered = documentos.filter(
    (d) =>
      d.titulo?.toLowerCase().includes(search.toLowerCase()) ||
      d.tipo?.toLowerCase().includes(search.toLowerCase()) ||
      d.numero?.toLowerCase().includes(search.toLowerCase()),
  );

  function openCreateModal() {
    setFormData({ ...DOC_FORM_INITIAL, autorId: user?.id });
    setPdfFile(null);
    setPdfName("");
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setFormData(DOC_FORM_INITIAL);
    setPdfFile(null);
    setPdfName("");
    if (pdfInputRef.current) pdfInputRef.current.value = "";
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function handlePdfChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      toast.error("Solo se aceptan archivos PDF.");
      return;
    }
    setPdfFile(file);
    setPdfName(file.name);
  }

  function clearPdf(e) {
    e.stopPropagation();
    setPdfFile(null);
    setPdfName("");
    if (pdfInputRef.current) pdfInputRef.current.value = "";
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!pdfFile) {
      toast.error("Debes seleccionar un archivo PDF antes de publicar.");
      return;
    }

    setSubmitting(true);
    try {
      // paso 1: crear el registro del documento (sin PDF aún)
      const res = await api.post("/documentos", {
        ...formData,
        anio: Number(formData.anio),
        autorId: user?.id,
      });
      const docId = res.data.id;

      // paso 2: subir el PDF al servidor
      const fd = new FormData();
      fd.append("file", pdfFile);
      await api.post(`/documentos/${docId}/upload-pdf`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("¡Documento publicado y PDF subido correctamente!");
      closeModal();
      fetchDocumentos();
    } catch (err) {
      const msg =
        err.response?.data?.message || "No se pudo guardar el documento.";
      toast.error(msg);
      console.error("Error al publicar documento:", err);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id, titulo) {
    if (!globalThis.confirm(`¿Eliminar el documento "${titulo}"?`)) return;
    try {
      await api.delete(`/documentos/${id}`);
      toast.success("Documento eliminado correctamente.");
      setDocumentos((prev) => prev.filter((d) => d.id !== id));
    } catch (err) {
      const msg =
        err.response?.data?.message || "No se pudo eliminar el documento.";
      toast.error(msg);
    }
  }

  return (
    <div>
      {/* Hidden PDF input */}
      <input
        type="file"
        accept="application/pdf"
        ref={pdfInputRef}
        onChange={handlePdfChange}
        className="hidden"
        id="doc-pdf-input"
      />

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">
            Gestionar Documentos
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {loading
              ? "Cargando..."
              : `${documentos.length} documentos disponibles`}
          </p>
        </div>
        <button
          id="upload-doc-btn"
          type="button"
          onClick={openCreateModal}
          className="btn-primary text-sm"
        >
          <Upload size={16} strokeWidth={2} />
          Subir Documento
        </button>
      </div>

      {/* Info: docs se usan en el menú */}
      <div className="flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-xl px-5 py-3 mb-5">
        <Link2 size={15} className="text-marcona-blue mt-0.5 shrink-0" />
        <p className="text-xs text-blue-700">
          <strong>Tip:</strong> Los documentos publicados aparecen en{" "}
          <strong>Gestión de Menú</strong> para que puedas enlazarlos
          directamente a cualquier submenú sin copiar URLs.
        </p>
      </div>

      {/* Buscador */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-5">
        <div className="relative max-w-sm">
          <Search
            size={16}
            strokeWidth={1.5}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            id="doc-search"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por título, tipo o número..."
            className="w-full border border-gray-200 rounded-lg pl-9 pr-4 py-2 text-sm
                       focus:outline-none focus:ring-2 focus:ring-marcona-blue/30 focus:border-marcona-blue transition"
          />
        </div>
      </div>

      {/* Error */}
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
                <th
                  scope="col"
                  className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3.5"
                >
                  Documento
                </th>
                <th
                  scope="col"
                  className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3.5"
                >
                  Tipo
                </th>
                <th
                  scope="col"
                  className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3.5"
                >
                  N° / Año
                </th>
                <th
                  scope="col"
                  className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3.5"
                >
                  Fecha
                </th>
                <th
                  scope="col"
                  className="text-center text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3.5"
                >
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-5 py-4">
                      <div className="h-3 bg-gray-200 rounded w-56" />
                    </td>
                    <td className="px-5 py-4">
                      <div className="h-3 bg-gray-200 rounded w-20" />
                    </td>
                    <td className="px-5 py-4">
                      <div className="h-3 bg-gray-200 rounded w-16" />
                    </td>
                    <td className="px-5 py-4">
                      <div className="h-3 bg-gray-200 rounded w-24" />
                    </td>
                    <td className="px-5 py-4">
                      <div className="h-3 bg-gray-200 rounded w-16 mx-auto" />
                    </td>
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center text-gray-400 text-sm py-10"
                  >
                    No se encontraron documentos
                  </td>
                </tr>
              ) : (
                filtered.map((doc) => (
                  <tr
                    key={doc.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center flex-shrink-0">
                          <FileText
                            size={15}
                            strokeWidth={1.5}
                            className="text-red-500"
                          />
                        </div>
                        <span className="font-medium text-gray-800 text-sm">
                          {doc.titulo}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${TYPE_COLORS[doc.tipo] || "bg-gray-100 text-gray-600"}`}
                      >
                        {doc.tipo}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-gray-500 text-xs font-mono">
                      {doc.numero && `N° ${doc.numero}`}{" "}
                      {doc.anio && `· ${doc.anio}`}
                    </td>
                    <td className="px-5 py-3.5 text-gray-500 text-xs">
                      {formatDate(doc.fechaPublicacion)}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-center gap-2">
                        {doc.urlPdf && (
                          <a
                            href={doc.urlPdf}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all"
                            title="Descargar PDF"
                          >
                            <Download size={15} strokeWidth={1.5} />
                          </a>
                        )}
                        <button
                          type="button"
                          onClick={() => handleDelete(doc.id, doc.titulo)}
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
        {!loading && (
          <div className="px-5 py-4 border-t border-gray-100">
            <p className="text-xs text-gray-400">
              {filtered.length} resultados
            </p>
          </div>
        )}
      </div>

      {/* Modal — subir nuevo documento */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeModal();
          }}
        >
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
              <h2 className="font-extrabold text-gray-900 text-lg">
                Nuevo Documento
              </h2>
              <button
                type="button"
                onClick={closeModal}
                className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
                aria-label="Cerrar"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
              {/* Tipo */}
              <div>
                <label
                  htmlFor="doc-tipo"
                  className="block text-xs font-semibold text-gray-600 mb-1.5"
                >
                  Tipo <span className="text-red-500">*</span>
                </label>
                <select
                  id="doc-tipo"
                  name="tipo"
                  value={formData.tipo}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm
                             focus:outline-none focus:ring-2 focus:ring-marcona-blue/30 focus:border-marcona-blue transition"
                >
                  <option value="">Seleccionar tipo...</option>
                  <option value="Ordenanzas">Ordenanzas</option>
                  <option value="Resoluciones">Resoluciones</option>
                  <option value="Planificación">Planificación</option>
                  <option value="Presupuesto">Presupuesto</option>
                  <option value="Decretos">Decretos</option>
                </select>
              </div>

              {/* Número y Año */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="doc-numero"
                    className="block text-xs font-semibold text-gray-600 mb-1.5"
                  >
                    Número
                  </label>
                  <input
                    id="doc-numero"
                    name="numero"
                    value={formData.numero}
                    onChange={handleChange}
                    placeholder="045-2026"
                    className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm
                               focus:outline-none focus:ring-2 focus:ring-marcona-blue/30 focus:border-marcona-blue transition"
                  />
                </div>
                <div>
                  <label
                    htmlFor="doc-anio"
                    className="block text-xs font-semibold text-gray-600 mb-1.5"
                  >
                    Año
                  </label>
                  <input
                    id="doc-anio"
                    name="anio"
                    type="number"
                    value={formData.anio}
                    onChange={handleChange}
                    min={2000}
                    max={2100}
                    className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm
                               focus:outline-none focus:ring-2 focus:ring-marcona-blue/30 focus:border-marcona-blue transition"
                  />
                </div>
              </div>

              {/* Título */}
              <div>
                <label
                  htmlFor="doc-titulo"
                  className="block text-xs font-semibold text-gray-600 mb-1.5"
                >
                  Título <span className="text-red-500">*</span>
                </label>
                <input
                  id="doc-titulo"
                  name="titulo"
                  value={formData.titulo}
                  onChange={handleChange}
                  required
                  placeholder="Ej: Plan de Desarrollo Concertado 2025-2030"
                  className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm
                             focus:outline-none focus:ring-2 focus:ring-marcona-blue/30 focus:border-marcona-blue transition"
                />
              </div>

              {/* PDF desde dispositivo */}
              <div>
                <p className="block text-xs font-semibold text-gray-600 mb-1.5">
                  Archivo PDF <span className="text-red-500">*</span>
                </p>

                {pdfFile ? (
                  /* archivo ya seleccionado */
                  <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
                    <CheckCircle
                      size={16}
                      className="text-green-600 shrink-0"
                    />
                    <span className="text-xs text-gray-700 truncate flex-1 font-medium">
                      {pdfName}
                    </span>
                    <button
                      type="button"
                      onClick={clearPdf}
                      className="text-gray-400 hover:text-red-500 shrink-0"
                      aria-label="Quitar archivo"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  /* zona de clic para seleccionar */
                  <button
                    type="button"
                    onClick={() => pdfInputRef.current?.click()}
                    className="w-full flex flex-col items-center justify-center gap-2 border-2 border-dashed
                               border-gray-200 hover:border-marcona-blue rounded-xl py-6
                               text-gray-400 hover:text-marcona-blue transition-colors group"
                  >
                    <div className="w-10 h-10 bg-gray-50 group-hover:bg-blue-50 rounded-xl flex items-center justify-center transition-colors">
                      <FileText
                        size={20}
                        className="text-gray-300 group-hover:text-marcona-blue transition-colors"
                      />
                    </div>
                    <p className="text-sm font-medium">
                      Haz clic para seleccionar el PDF
                    </p>
                    <p className="text-xs text-gray-300">
                      Solo archivos .pdf · Máx. 50 MB
                    </p>
                  </button>
                )}
              </div>

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
                  disabled={submitting || !pdfFile}
                  className="flex-1 btn-primary text-sm justify-center disabled:opacity-50"
                >
                  {submitting ? (
                    <span className="flex items-center gap-2 justify-center">
                      <Loader2 size={15} className="animate-spin" />
                      Subiendo...
                    </span>
                  ) : (
                    "Publicar Documento"
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

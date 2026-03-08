import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  FileText,
  AlertCircle,
} from "lucide-react";
import {
  getAllPagesAdmin,
  createPage,
  updatePage,
  deletePage,
} from "../../services/page.service";

export default function ManagePages() {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    contentType: "HTML",
    content: "",
    fileUrl: "",
    externalUrl: "",
  });

  const fetchPages = async () => {
    try {
      setLoading(true);
      const data = await getAllPagesAdmin();
      setPages(data);
      setError(null);
    } catch (err) {
      console.error("Error loading pages:", err);
      setError("No se pudieron cargar las páginas. Verifique la conexión.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPages();
  }, []);

  const resetForm = () => {
    setFormData({
      title: "",
      slug: "",
      contentType: "HTML",
      content: "",
      fileUrl: "",
      externalUrl: "",
    });
    setEditingId(null);
    setIsFormOpen(false);
  };

  const handleEdit = (page) => {
    setFormData({
      title: page.title,
      slug: page.slug,
      contentType: page.contentType,
      content: page.content || "",
      fileUrl: page.fileUrl || "",
      externalUrl: page.externalUrl || "",
    });
    setEditingId(page.id);
    setIsFormOpen(true);
  };

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "¿Está seguro de eliminar esta página? Si está enlazada al menú, el enlace dejará de funcionar.",
      )
    )
      return;

    try {
      await deletePage(id);
      fetchPages(); // refresh
    } catch (err) {
      console.error("Error deleting page", err);
      alert("Ocurrió un error al eliminar.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updatePage(editingId, formData);
      } else {
        await createPage(formData);
      }
      resetForm();
      fetchPages();
    } catch (err) {
      console.error("Error saving page", err);
      alert(
        "Ocurrió un error al guardar la página. Asegúrese de que el Slug sea único.",
      );
    }
  };

  const autoGenerateSlug = (title) => {
    return title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // remover acentos
      .replace(/[^a-z0-9]+/g, "-") // reemplazar no alfanuméricos por guiones
      .replace(/(^-|-$)+/g, ""); // remover guiones de inicio/fin
  };

  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    setFormData((prev) => ({
      ...prev,
      title: newTitle,
      // Solo autogenera si estamos creando una nueva
      slug: !editingId ? autoGenerateSlug(newTitle) : prev.slug,
    }));
  };

  const renderForm = () => {
    if (!isFormOpen) return null;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl my-8">
          <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white rounded-t-xl z-10">
            <h3 className="text-lg font-bold text-gray-800">
              {editingId ? "Editar Página" : "Nueva Página"}
            </h3>
            <button
              onClick={resetForm}
              className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
            >
              <X size={20} />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="p-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Título
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border rounded-lg focus:ring-marcona-blue focus:border-marcona-blue"
                  value={formData.title}
                  onChange={handleTitleChange}
                  placeholder="Ej. Misión y Visión"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Slug (URL Amigable)
                </label>
                <div className="flex items-center">
                  <span className="text-gray-500 bg-gray-100 px-3 py-2 border border-r-0 rounded-l-lg text-sm">
                    /p/
                  </span>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border rounded-r-lg focus:ring-marcona-blue focus:border-marcona-blue"
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData({ ...formData, slug: e.target.value })
                    }
                    placeholder="mision-y-vision"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de Contenido
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="contentType"
                    value="HTML"
                    checked={formData.contentType === "HTML"}
                    onChange={(e) =>
                      setFormData({ ...formData, contentType: e.target.value })
                    }
                    className="text-marcona-blue focus:ring-marcona-blue"
                  />
                  <span>Texto / HTML</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="contentType"
                    value="PDF"
                    checked={formData.contentType === "PDF"}
                    onChange={(e) =>
                      setFormData({ ...formData, contentType: e.target.value })
                    }
                    className="text-marcona-blue focus:ring-marcona-blue"
                  />
                  <span>PDF Embebido</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="contentType"
                    value="EXTERNAL_LINK"
                    checked={formData.contentType === "EXTERNAL_LINK"}
                    onChange={(e) =>
                      setFormData({ ...formData, contentType: e.target.value })
                    }
                    className="text-marcona-blue focus:ring-marcona-blue"
                  />
                  <span>Enlace Externo</span>
                </label>
              </div>
            </div>

            {/* Campos condicionales según el tipo */}
            {formData.contentType === "HTML" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contenido
                </label>
                <textarea
                  className="w-full px-3 py-2 border rounded-lg focus:ring-marcona-blue focus:border-marcona-blue min-h-[200px]"
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                  placeholder="Escriba aquí el contenido de la página... (Soporta HTML básico)"
                  required
                />
              </div>
            )}

            {formData.contentType === "PDF" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL del Documento PDF
                </label>
                <input
                  type="url"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-marcona-blue focus:border-marcona-blue"
                  value={formData.fileUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, fileUrl: e.target.value })
                  }
                  placeholder="https://ejemplo.com/documento.pdf"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Este PDF se mostrará directamente incrustado en la página.
                </p>
              </div>
            )}

            {formData.contentType === "EXTERNAL_LINK" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Enlace Externo
                </label>
                <input
                  type="url"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-marcona-blue focus:border-marcona-blue"
                  value={formData.externalUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, externalUrl: e.target.value })
                  }
                  placeholder="https://www.gob.pe/..."
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  El usuario será redirigido a este enlace.
                </p>
              </div>
            )}

            <div className="pt-4 border-t flex justify-end gap-2 sticky bottom-0 bg-white py-2">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 px-4 py-2 bg-marcona-blue text-white rounded-lg hover:bg-blue-800"
              >
                <Save size={16} />
                Guardar
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Gestión de Páginas
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Crea contenido enriquecido para enlazarlo desde el menú de
            navegación.
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setIsFormOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-marcona-blue text-white rounded-lg hover:bg-blue-800 transition-colors shadow-sm font-medium"
        >
          <Plus size={18} />
          Nueva Página
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-lg flex items-center gap-3">
          <AlertCircle size={20} />
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">
            Cargando páginas...
          </div>
        ) : pages.length === 0 ? (
          <div className="p-8 text-center text-gray-500 flex flex-col items-center">
            <FileText size={40} className="mb-3 text-gray-300" />
            <p>No hay páginas creadas.</p>
            <p className="text-sm mt-1">
              Crea una página para proveer información como Misión, Visión, etc.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {pages.map((page) => (
              <div
                key={page.id}
                className="flex items-center justify-between p-4 hover:bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 text-marcona-blue flex items-center justify-center">
                    <FileText size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {page.title}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-0.5">
                      <span>/p/{page.slug}</span>
                      <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                      <span className="px-2 py-0.5 rounded-full bg-gray-100 text-xs font-medium border">
                        {page.contentType}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(page)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-100"
                    title="Editar"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(page.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
                    title="Eliminar"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {renderForm()}
    </div>
  );
}

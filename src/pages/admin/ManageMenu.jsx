import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  ChevronRight,
  List,
  AlertCircle,
  FileText,
  Link2,
  ChevronDown,
} from "lucide-react";
import {
  getAllMenusAdmin,
  createMenu,
  updateMenu,
  deleteMenu,
} from "../../services/menu.service";
import api from "../../services/api";

// ─── Helpers ────────────────────────────────────────────────────────────────

/** Aplana el árbol completo de menús en una lista plana con nivel de indentación */
function flattenTree(items, level = 0) {
  const result = [];
  for (const item of items) {
    result.push({ ...item, _level: level });
    if (item.children && item.children.length > 0) {
      result.push(...flattenTree(item.children, level + 1));
    }
  }
  return result;
}

/** Genera la sangría visual basada en el nivel */
function indent(level) {
  return `${"— ".repeat(level)}`;
}

// ─── Fetch de documentos ────────────────────────────────────────────────────
const fetchAllDocuments = async () => {
  const { data } = await api.get("/documentos", { params: { size: 100 } });
  const list = data?.content ?? data;
  return Array.isArray(list) ? list : [];
};

// ─── Componente principal ───────────────────────────────────────────────────
export default function ManageMenu() {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [documentos, setDocumentos] = useState([]);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    label: "",
    url: "",
    orderIndex: 0,
    isPublic: true,
    parentId: "",
  });

  // todos los ítems aplanados con nivel (para el selector de padre)
  const [flatItems, setFlatItems] = useState([]);

  const fetchMenus = async () => {
    try {
      setLoading(true);
      const data = await getAllMenusAdmin();
      setMenus(data);
      setFlatItems(flattenTree(data));
      setError(null);
    } catch (err) {
      console.error("Error loading menus:", err);
      setError("No se pudieron cargar los menús. Verifique la conexión.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenus();
    fetchAllDocuments()
      .then(setDocumentos)
      .catch((err) => console.error("Error cargando documentos:", err));
  }, []);

  const resetForm = () => {
    setFormData({
      label: "",
      url: "",
      orderIndex: 0,
      isPublic: true,
      parentId: "",
    });
    setEditingId(null);
    setIsFormOpen(false);
  };

  const handleEdit = (item) => {
    setFormData({
      label: item.label,
      url: item.url,
      orderIndex: item.orderIndex || 0,
      isPublic: item.isPublic !== false,
      parentId: item.parentId ? String(item.parentId) : "",
    });
    setEditingId(item.id);
    setIsFormOpen(true);
  };

  const handleDelete = async (id) => {
    if (
      !globalThis.confirm(
        "¿Eliminar este enlace? Sus sub-ítems también se eliminarán.",
      )
    )
      return;
    try {
      await deleteMenu(id);
      fetchMenus();
    } catch (err) {
      console.error("Error deleting menu", err);
      globalThis.alert("Error al eliminar.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        url: formData.url.trim() === "" ? "#" : formData.url.trim(),
        parentId: formData.parentId
          ? Number.parseInt(formData.parentId, 10)
          : null,
      };
      if (editingId) {
        await updateMenu(editingId, payload);
      } else {
        await createMenu(payload);
      }
      resetForm();
      fetchMenus();
    } catch (err) {
      console.error("Error saving menu", err);
      globalThis.alert("Error al guardar el menú.");
    }
  };

  // ─── Selector de documento ─────────────────────────────────────────────
  const renderDocumentPicker = () => {
    if (!Array.isArray(documentos) || documentos.length === 0) return null;
    return (
      <div className="border border-dashed border-marcona-blue/30 rounded-xl p-4 bg-blue-50/30">
        <div className="flex items-center gap-2 mb-2">
          <FileText size={14} className="text-marcona-blue" />
          <span className="text-xs font-bold text-marcona-blue uppercase tracking-wide">
            Seleccionar desde Documentos
          </span>
        </div>
        <p className="text-xs text-gray-500 mb-3">
          Elige un documento para llenar la URL automáticamente.
        </p>
        <select
          className="w-full px-3 py-2 border rounded-lg text-sm bg-white"
          defaultValue=""
          onChange={(e) => {
            const doc = documentos.find((d) => String(d.id) === e.target.value);
            if (doc) {
              setFormData((prev) => ({
                ...prev,
                url: doc.urlPdf || "#",
                label: prev.label || doc.titulo,
              }));
            }
          }}
        >
          <option value="">(Selecciona un documento…)</option>
          {documentos.map((doc) => (
            <option key={doc.id} value={doc.id}>
              {doc.titulo} {doc.anio ? `(${doc.anio})` : ""}
            </option>
          ))}
        </select>
        {formData.url && formData.url !== "#" && (
          <div className="mt-2 flex items-center gap-2 text-xs text-green-700 bg-green-50 rounded-lg px-3 py-2">
            <Link2 size={12} />
            <span className="truncate">{formData.url}</span>
          </div>
        )}
      </div>
    );
  };

  // ─── Formulario modal ──────────────────────────────────────────────────
  const renderForm = () => {
    if (!isFormOpen) return null;

    // opciones del selector de padre: todos los ítems EXCEPTO el que se está editando y sus descendientes
    const parentOptions = flatItems.filter((item) => item.id !== editingId);

    return (
      <div
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        role="dialog"
        aria-modal="true"
        onClick={resetForm}
      >
        <div
          className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
          role="presentation"
        >
          {/* Header */}
          <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white z-10">
            <h3 className="text-lg font-bold text-gray-800">
              {editingId ? "Editar Enlace" : "Nuevo Enlace"}
            </h3>
            <button
              type="button"
              onClick={resetForm}
              className="text-gray-400 hover:text-gray-600"
              aria-label="Cerrar"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-4 space-y-4">
            {/* Nombre */}
            <div>
              <label
                htmlFor="menu-label"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Nombre (Label)
              </label>
              <input
                id="menu-label"
                type="text"
                required
                className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-marcona-blue focus:border-marcona-blue"
                value={formData.label}
                onChange={(e) =>
                  setFormData({ ...formData, label: e.target.value })
                }
                placeholder="Ej. Gestión de Compras"
              />
            </div>

            {/* Selector de Documento */}
            {renderDocumentPicker()}

            {/* URL manual */}
            <div>
              <label
                htmlFor="menu-url"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                URL / Ruta
                <span className="text-gray-400 font-normal ml-2 text-xs">
                  (Deja vacío si solo agrupa sub-ítems)
                </span>
              </label>
              <input
                id="menu-url"
                type="text"
                className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-marcona-blue focus:border-marcona-blue"
                value={formData.url}
                onChange={(e) =>
                  setFormData({ ...formData, url: e.target.value })
                }
                placeholder="Ej. /municipalidad o https://..."
              />
            </div>

            {/* Orden y Visibilidad */}
            <div className="flex gap-4">
              <div className="flex-1">
                <label
                  htmlFor="menu-order"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Orden
                </label>
                <input
                  id="menu-order"
                  type="number"
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-marcona-blue focus:border-marcona-blue"
                  value={formData.orderIndex}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      orderIndex: Number.parseInt(e.target.value, 10) || 0,
                    })
                  }
                />
              </div>
              <div className="flex-1">
                <label
                  htmlFor="menu-visibility"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Visibilidad
                </label>
                <select
                  id="menu-visibility"
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-marcona-blue focus:border-marcona-blue"
                  value={formData.isPublic}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      isPublic: e.target.value === "true",
                    })
                  }
                >
                  <option value="true">Público</option>
                  <option value="false">Oculto</option>
                </select>
              </div>
            </div>

            {/* Menú Padre — cualquier nivel */}
            <div>
              <label
                htmlFor="menu-parent"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Menú Padre
              </label>
              <select
                id="menu-parent"
                className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-marcona-blue focus:border-marcona-blue"
                value={formData.parentId}
                onChange={(e) =>
                  setFormData({ ...formData, parentId: e.target.value })
                }
              >
                <option value="">(Ninguno — Menú raíz nivel 1)</option>
                {parentOptions.map((item) => (
                  <option key={item.id} value={item.id}>
                    {indent(item._level)}
                    {item.label}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-400 mt-1">
                Puedes anidar a cualquier profundidad. El nivel queda indicado
                con guiones.
              </p>
            </div>

            <div className="pt-4 border-t flex justify-end gap-2">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-50 text-sm"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 px-4 py-2 bg-marcona-blue text-white rounded-lg hover:bg-blue-800 text-sm"
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

  // ─── Fila de árbol ─────────────────────────────────────────────────────
  const renderTreeRow = (item, level = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    return (
      <React.Fragment key={item.id}>
        <div
          className={`flex items-center justify-between py-2.5 px-4 border-b border-gray-50 hover:bg-gray-50 transition-colors`}
          style={{ paddingLeft: `${16 + level * 20}px` }}
        >
          <div className="flex items-center gap-2 min-w-0">
            {level > 0 ? (
              <ChevronRight size={14} className="text-gray-300 shrink-0" />
            ) : (
              <List size={16} className="text-marcona-blue shrink-0" />
            )}
            <div className="min-w-0">
              <span
                className={`font-medium truncate ${level === 0 ? "text-gray-800 text-sm" : "text-gray-600 text-sm"}`}
              >
                {item.label}
              </span>
              {hasChildren && (
                <span className="ml-2 text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded-full font-semibold">
                  {item.children.length} sub
                </span>
              )}
              <br />
              <span className="text-[11px] text-gray-400 font-mono truncate max-w-xs inline-block">
                {item.url}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0 ml-3">
            <span className="text-xs text-gray-400">#{item.orderIndex}</span>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${item.isPublic ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
            >
              {item.isPublic ? "Público" : "Oculto"}
            </span>
            <div className="flex gap-1 border-l pl-3">
              <button
                type="button"
                onClick={() => handleEdit(item)}
                className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg"
                title="Editar"
              >
                <Edit2 size={14} />
              </button>
              <button
                type="button"
                onClick={() => handleDelete(item.id)}
                className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg"
                title="Eliminar"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        </div>
        {/* Renderizar hijos recursivamente */}
        {hasChildren &&
          item.children.map((child) => renderTreeRow(child, level + 1))}
      </React.Fragment>
    );
  };

  // ─── Render principal ──────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Gestión de Menú</h1>
          <p className="text-gray-500 text-sm mt-1">
            Configura los enlaces y sub-menús del portal. Soporta anidamiento
            ilimitado.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            resetForm();
            setIsFormOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-marcona-blue text-white rounded-lg hover:bg-blue-800 font-medium text-sm shadow-sm"
        >
          <Plus size={18} />
          Nuevo Enlace
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-lg flex items-center gap-3">
          <AlertCircle size={20} />
          {error}
        </div>
      )}

      {/* Tip documentos */}
      {documentos.length > 0 && (
        <div className="flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-xl px-5 py-3">
          <FileText size={16} className="text-marcona-blue mt-0.5 shrink-0" />
          <p className="text-xs text-blue-700">
            <strong>Tip:</strong> Al crear un enlace puedes seleccionar un
            documento del gestor para enlazarlo directamente sin copiar URLs.
          </p>
        </div>
      )}

      {/* Leyenda de niveles */}
      <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400 bg-gray-50 rounded-xl px-4 py-2.5">
        <div className="flex items-center gap-1">
          <List size={13} className="text-marcona-blue" />
          <span>Nivel 1 (raíz)</span>
        </div>
        <div className="flex items-center gap-1">
          <ChevronRight size={13} />
          <ChevronRight size={13} className="opacity-50" />
          <span>Niveles 2, 3, 4… (anidados)</span>
        </div>
        <div className="flex items-center gap-1 ml-auto">
          <ChevronDown size={13} />
          <span>Indentado visualmente según profundidad</span>
        </div>
      </div>

      {/* Árbol de menús */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Cargando menús...</div>
        ) : menus.length === 0 ? (
          <div className="p-8 text-center text-gray-500 flex flex-col items-center">
            <List size={40} className="mb-3 text-gray-300" />
            <p>No hay enlaces configurados.</p>
            <p className="text-sm mt-1">
              Crea el primer enlace usando el botón de arriba.
            </p>
          </div>
        ) : (
          <div>{menus.map((menu) => renderTreeRow(menu, 0))}</div>
        )}
      </div>

      {renderForm()}
    </div>
  );
}

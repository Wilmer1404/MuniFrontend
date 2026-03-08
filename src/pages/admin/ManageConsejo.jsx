import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import {
  Plus,
  Pencil,
  Trash2,
  Upload,
  X,
  CheckCircle,
  AlertCircle,
  User,
} from "lucide-react";
import {
  getConsejoMiembros,
  createConsejoMiembro,
  updateConsejoMiembro,
  deleteConsejoMiembro,
  uploadFotoMiembro,
} from "../../services/consejo.service";

// ===== Valores iniciales del formulario =====
const EMPTY_FORM = {
  nombre: "",
  cargo: "",
  esAlcalde: false,
  orden: 0,
  nacionalidad: "",
  edad: "",
  estudios: "",
  acercaDe: "",
};

// ===== Formulario de creación/edición =====
function MiembroForm({ initial, onSave, onCancel, loading }) {
  const [form, setForm] = useState(initial ?? EMPTY_FORM);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...form,
      edad: form.edad !== "" ? Number.parseInt(form.edad, 10) : null,
      orden: form.orden !== "" ? Number.parseInt(String(form.orden), 10) : 0,
    });
  };

  /** IDs de inputs para asociar labels */
  const ids = {
    nombre: "miembro-nombre",
    cargo: "miembro-cargo",
    orden: "miembro-orden",
    nacionalidad: "miembro-nacionalidad",
    edad: "miembro-edad",
    estudios: "miembro-estudios",
    acercaDe: "miembro-acercade",
    esAlcalde: "miembro-esalcalde",
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label
            htmlFor={ids.nombre}
            className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wide"
          >
            Nombre completo *
          </label>
          <input
            id={ids.nombre}
            type="text"
            required
            value={form.nombre}
            onChange={(e) => set("nombre", e.target.value)}
            placeholder="Ej: José Roberto Rosales Pacheco"
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-marcona-blue"
          />
        </div>

        <div>
          <label
            htmlFor={ids.cargo}
            className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wide"
          >
            Cargo
          </label>
          <input
            id={ids.cargo}
            type="text"
            value={form.cargo}
            onChange={(e) => set("cargo", e.target.value)}
            placeholder="Ej: Alcalde / Regidor"
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-marcona-blue"
          />
        </div>

        <div>
          <label
            htmlFor={ids.orden}
            className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wide"
          >
            Orden de visualización
          </label>
          <input
            id={ids.orden}
            type="number"
            min={0}
            value={form.orden}
            onChange={(e) => set("orden", e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-marcona-blue"
          />
        </div>

        <div>
          <label
            htmlFor={ids.nacionalidad}
            className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wide"
          >
            Nacionalidad
          </label>
          <input
            id={ids.nacionalidad}
            type="text"
            value={form.nacionalidad}
            onChange={(e) => set("nacionalidad", e.target.value)}
            placeholder="Peruana"
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-marcona-blue"
          />
        </div>

        <div>
          <label
            htmlFor={ids.edad}
            className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wide"
          >
            Edad
          </label>
          <input
            id={ids.edad}
            type="number"
            min={18}
            max={100}
            value={form.edad}
            onChange={(e) => set("edad", e.target.value)}
            placeholder="45"
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-marcona-blue"
          />
        </div>

        <div className="sm:col-span-2">
          <label
            htmlFor={ids.estudios}
            className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wide"
          >
            Estudios / Formación
          </label>
          <textarea
            id={ids.estudios}
            rows={2}
            value={form.estudios}
            onChange={(e) => set("estudios", e.target.value)}
            placeholder="Ej: Licenciado en Administración Pública, UNMSM"
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-marcona-blue resize-none"
          />
        </div>

        <div className="sm:col-span-2">
          <label
            htmlFor={ids.acercaDe}
            className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wide"
          >
            Acerca de (Biografía)
          </label>
          <textarea
            id={ids.acercaDe}
            rows={3}
            value={form.acercaDe}
            onChange={(e) => set("acercaDe", e.target.value)}
            placeholder="Breve descripción del perfil de la autoridad..."
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-marcona-blue resize-none"
          />
        </div>

        <div className="sm:col-span-2">
          <div className="flex items-center gap-2">
            <input
              id={ids.esAlcalde}
              type="checkbox"
              checked={form.esAlcalde}
              onChange={(e) => set("esAlcalde", e.target.checked)}
              className="w-4 h-4 accent-marcona-blue"
            />
            <label
              htmlFor={ids.esAlcalde}
              className="text-sm font-semibold text-gray-700 cursor-pointer"
            >
              ¿Es el Alcalde? (se mostrará primero con badge especial)
            </label>
          </div>
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-marcona-blue text-white py-2.5 rounded-xl text-sm font-bold hover:bg-blue-800 disabled:opacity-50 transition-colors"
        >
          {loading
            ? "Guardando..."
            : initial?.id
              ? "Actualizar"
              : "Crear Miembro"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl text-sm font-bold hover:bg-gray-50 transition-colors"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}

MiembroForm.propTypes = {
  initial: PropTypes.shape({
    id: PropTypes.number,
    nombre: PropTypes.string,
    cargo: PropTypes.string,
    esAlcalde: PropTypes.bool,
    orden: PropTypes.number,
    nacionalidad: PropTypes.string,
    edad: PropTypes.number,
    estudios: PropTypes.string,
    acercaDe: PropTypes.string,
  }),
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
};
MiembroForm.defaultProps = { initial: null };

// ===== Página principal de gestión =====
export default function ManageConsejo() {
  const [miembros, setMiembros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [uploadingFotoId, setUploadingFotoId] = useState(null);
  const fotoInputRef = useRef(null);
  const fotoTargetId = useRef(null);

  useEffect(() => {
    fetchMiembros();
  }, []);

  const fetchMiembros = async () => {
    setLoading(true);
    try {
      setMiembros(await getConsejoMiembros());
    } catch (err) {
      console.error("Error cargando consejo:", err);
      setErrorMsg("Error al cargar los miembros del consejo.");
    } finally {
      setLoading(false);
    }
  };

  const showSuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 4000);
  };
  const showError = (msg) => {
    setErrorMsg(msg);
    setTimeout(() => setErrorMsg(""), 5000);
  };

  const handleSave = async (dto) => {
    setSaving(true);
    try {
      if (editTarget?.id) {
        await updateConsejoMiembro(editTarget.id, dto);
        showSuccess("Miembro actualizado.");
      } else {
        await createConsejoMiembro(dto);
        showSuccess("Miembro creado correctamente.");
      }
      setModalOpen(false);
      setEditTarget(null);
      fetchMiembros();
    } catch (err) {
      console.error("Error guardando miembro:", err);
      showError("No se pudo guardar. Inténtalo de nuevo.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (miembro) => {
    if (!globalThis.confirm(`¿Eliminar a ${miembro.nombre}?`)) return;
    try {
      await deleteConsejoMiembro(miembro.id);
      showSuccess(`${miembro.nombre} eliminado.`);
      fetchMiembros();
    } catch (err) {
      console.error("Error eliminando miembro:", err);
      showError("Error al eliminar. Inténtalo de nuevo.");
    }
  };

  const handleFotoClick = (id) => {
    fotoTargetId.current = id;
    fotoInputRef.current?.click();
  };

  const handleFotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file || !fotoTargetId.current) return;
    setUploadingFotoId(fotoTargetId.current);
    try {
      await uploadFotoMiembro(fotoTargetId.current, file);
      showSuccess("Foto actualizada correctamente.");
      fetchMiembros();
    } catch (err) {
      console.error("Error subiendo foto:", err);
      showError("Error al subir la foto.");
    } finally {
      setUploadingFotoId(null);
      if (fotoInputRef.current) fotoInputRef.current.value = "";
    }
  };

  const handleModalBackdropKeyDown = (e) => {
    if (e.key === "Escape") setModalOpen(false);
  };

  const openCreate = () => {
    setEditTarget(null);
    setModalOpen(true);
  };
  const openEdit = (m) => {
    setEditTarget(m);
    setModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <input
        type="file"
        accept="image/*"
        className="hidden"
        ref={fotoInputRef}
        onChange={handleFotoChange}
      />

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">
            Consejo Municipal
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Gestiona los miembros de la autoridad municipal
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-marcona-blue text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-800 transition-colors"
        >
          <Plus size={18} />
          Nuevo miembro
        </button>
      </div>

      {/* Alerts */}
      {successMsg && (
        <div className="flex items-center gap-3 bg-green-50 border border-green-200 text-green-700 rounded-xl px-5 py-3">
          <CheckCircle size={18} />{" "}
          <span className="text-sm">{successMsg}</span>
        </div>
      )}
      {errorMsg && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 rounded-xl px-5 py-3">
          <AlertCircle size={18} /> <span className="text-sm">{errorMsg}</span>
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div
            className="w-10 h-10 border-4 border-marcona-blue border-t-transparent rounded-full animate-spin"
            aria-label="Cargando..."
          />
        </div>
      ) : null}

      {!loading && miembros.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-16 text-center text-gray-400">
          <User size={48} className="mx-auto mb-3 opacity-20" />
          <p className="font-semibold">No hay miembros registrados.</p>
          <p className="text-sm mt-1">
            Agrega el primer miembro usando el botón de arriba.
          </p>
        </div>
      ) : null}

      {!loading && miembros.length > 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-wide">
              <tr>
                <th scope="col" className="px-5 py-3 text-left">
                  Miembro
                </th>
                <th
                  scope="col"
                  className="px-5 py-3 text-left hidden md:table-cell"
                >
                  Cargo
                </th>
                <th
                  scope="col"
                  className="px-5 py-3 text-center hidden sm:table-cell"
                >
                  Orden
                </th>
                <th scope="col" className="px-5 py-3 text-center">
                  Foto
                </th>
                <th scope="col" className="px-5 py-3 text-center">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {miembros.map((m) => (
                <tr key={m.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      {m.fotoUrl ? (
                        <img
                          src={m.fotoUrl}
                          alt={m.nombre}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div
                          className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-marcona-blue font-bold text-sm"
                          aria-label={`Inicial de ${m.nombre}`}
                        >
                          {m.nombre.charAt(0)}
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-gray-800">
                          {m.nombre}
                        </p>
                        {m.esAlcalde && (
                          <span className="bg-yellow-100 text-yellow-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                            Alcalde
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-gray-500 hidden md:table-cell">
                    {m.cargo ?? "—"}
                  </td>
                  <td className="px-5 py-4 text-center text-gray-400 hidden sm:table-cell">
                    {m.orden}
                  </td>
                  <td className="px-5 py-4 text-center">
                    <button
                      type="button"
                      onClick={() => handleFotoClick(m.id)}
                      disabled={uploadingFotoId === m.id}
                      className="inline-flex items-center gap-1 text-xs text-gray-500 border border-gray-200 px-3 py-1.5 rounded-lg hover:border-marcona-blue hover:text-marcona-blue transition-colors disabled:opacity-50"
                      aria-label={`Subir foto de ${m.nombre}`}
                    >
                      {uploadingFotoId === m.id ? (
                        <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Upload size={12} />
                      )}
                      Foto
                    </button>
                  </td>
                  <td className="px-5 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => openEdit(m)}
                        className="p-2 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-marcona-blue transition-colors"
                        aria-label={`Editar ${m.nombre}`}
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(m)}
                        className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors"
                        aria-label={`Eliminar ${m.nombre}`}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      {/* Modal Create/Edit */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={editTarget?.id ? "Editar miembro" : "Nuevo miembro"}
          onClick={() => setModalOpen(false)}
          onKeyDown={handleModalBackdropKeyDown}
          tabIndex={-1}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
            role="presentation"
          >
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <h3 className="font-bold text-gray-800 text-lg">
                {editTarget?.id ? "Editar Miembro" : "Nuevo Miembro"}
              </h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="text-gray-400 hover:text-gray-700"
                aria-label="Cerrar formulario"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6">
              <MiembroForm
                initial={editTarget}
                onSave={handleSave}
                onCancel={() => setModalOpen(false)}
                loading={saving}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import { useState, useEffect, useCallback } from "react";
import {
  Search,
  Loader2,
  AlertCircle,
  MessageSquare,
  ExternalLink,
  CheckCircle,
  Clock,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../../services/api";

function formatDate(iso) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString("es-PE", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

export default function ManageSolicitudes() {
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  // view modal
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [updating, setUpdating] = useState(false);

  const fetchSolicitudes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/solicitudes", { params: { size: 100 } });
      const data = res.data?.content ?? res.data;
      setSolicitudes(Array.isArray(data) ? data : []);
    } catch (err) {
      const msg = err.response?.data?.message || "Error al cargar solicitudes.";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSolicitudes();
  }, [fetchSolicitudes]);

  const filtered = solicitudes.filter(
    (s) =>
      s.nombres?.toLowerCase().includes(search.toLowerCase()) ||
      s.apellidos?.toLowerCase().includes(search.toLowerCase()) ||
      s.dni?.toLowerCase().includes(search.toLowerCase()) ||
      s.tipo?.toLowerCase().includes(search.toLowerCase()),
  );

  const handleUpdateStatus = async (id, nuevoEstado) => {
    setUpdating(true);
    try {
      await api.put(`/solicitudes/${id}/estado`, { estado: nuevoEstado });
      toast.success(`Solicitud marcada como ${nuevoEstado}`);

      // Update local state without refetching entirely
      setSolicitudes((prev) =>
        prev.map((s) => (s.id === id ? { ...s, estado: nuevoEstado } : s)),
      );

      // Also update selected doc if modal is open
      if (selectedDoc && selectedDoc.id === id) {
        setSelectedDoc((prev) => ({ ...prev, estado: nuevoEstado }));
      }
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      toast.error("No se pudo actualizar el estado.");
    } finally {
      setUpdating(false);
    }
  };

  const StatusBadge = ({ estado }) => {
    const isAtendido = estado === "ATENDIDO";
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide
        ${isAtendido ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}
      >
        {isAtendido ? (
          <CheckCircle size={12} strokeWidth={2.5} />
        ) : (
          <Clock size={12} strokeWidth={2.5} />
        )}
        {estado}
      </span>
    );
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">
            Reclamos y Sugerencias
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Buzón ciudadano de atención al público ({solicitudes.length}{" "}
            registros)
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-5">
        <div className="relative max-w-sm">
          <Search
            size={16}
            strokeWidth={1.5}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre, DNI o tipo..."
            className="w-full border border-gray-200 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-marcona-blue/30 focus:border-marcona-blue transition"
          />
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-100 text-red-700 rounded-xl px-5 py-4 mb-5">
          <AlertCircle size={16} className="shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Tabla */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left text-xs font-semibold text-gray-500 uppercase px-5 py-3.5">
                  ID
                </th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase px-5 py-3.5">
                  Fecha
                </th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase px-5 py-3.5">
                  Ciudadano
                </th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase px-5 py-3.5">
                  Tipo
                </th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase px-5 py-3.5">
                  Estado
                </th>
                <th className="text-center text-xs font-semibold text-gray-500 uppercase px-5 py-3.5">
                  Revisar
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-5 py-4">
                      <div className="h-3 bg-gray-200 rounded w-8" />
                    </td>
                    <td className="px-5 py-4">
                      <div className="h-3 bg-gray-200 rounded w-24" />
                    </td>
                    <td className="px-5 py-4">
                      <div className="h-3 bg-gray-200 rounded w-40" />
                    </td>
                    <td className="px-5 py-4">
                      <div className="h-3 bg-gray-200 rounded w-20" />
                    </td>
                    <td className="px-5 py-4">
                      <div className="h-3 bg-gray-200 rounded w-20" />
                    </td>
                    <td className="px-5 py-4">
                      <div className="h-3 bg-gray-200 rounded mx-auto w-10" />
                    </td>
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center text-gray-400 text-sm py-10"
                  >
                    No se encontraron solicitudes
                  </td>
                </tr>
              ) : (
                filtered.map((s) => (
                  <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3.5 text-gray-400 font-mono text-xs">
                      #{s.id}
                    </td>
                    <td className="px-5 py-3.5 text-gray-600 text-xs">
                      {formatDate(s.fechaRegistro)}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="font-semibold text-gray-800">
                        {s.nombres} {s.apellidos}
                      </div>
                      <div className="text-xs text-gray-400 font-mono mt-0.5">
                        DNI: {s.dni}
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-extrabold tracking-widest uppercase
                        ${s.tipo === "RECLAMO" ? "bg-red-50 text-red-600 border border-red-100" : "bg-green-50 text-green-700 border border-green-100"}`}
                      >
                        {s.tipo}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <StatusBadge estado={s.estado} />
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <button
                        onClick={() => setSelectedDoc(s)}
                        className="inline-flex items-center justify-center p-2 rounded-lg text-marcona-blue hover:bg-blue-50 transition-colors"
                        title="Ver detalles"
                      >
                        <ExternalLink size={16} strokeWidth={2} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Detalle */}
      {selectedDoc && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedDoc(null);
          }}
        >
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div
              className={`shrink-0 px-6 py-4 flex items-center justify-between border-b
              ${selectedDoc.tipo === "RECLAMO" ? "bg-red-50/50 border-red-100" : "bg-green-50/50 border-green-100"}
            `}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center
                  ${selectedDoc.tipo === "RECLAMO" ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"}
                `}
                >
                  <MessageSquare size={18} strokeWidth={2} />
                </div>
                <div>
                  <h2
                    className={`text-lg font-extrabold ${selectedDoc.tipo === "RECLAMO" ? "text-red-900" : "text-green-900"}`}
                  >
                    {selectedDoc.tipo} #{selectedDoc.id}
                  </h2>
                  <p className="text-xs text-gray-500 font-medium">
                    Recibido el {formatDate(selectedDoc.fechaRegistro)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <StatusBadge estado={selectedDoc.estado} />
                <button
                  type="button"
                  onClick={() => setSelectedDoc(null)}
                  className="p-2 -mr-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <AlertCircle
                    size={18}
                    className="rotate-45" /* lucide X lookalike */
                  />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Información del ciudadano */}
              <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">
                  Datos del Ciudadano
                </h3>
                <div className="grid grid-cols-2 gap-y-4 gap-x-6">
                  <div>
                    <span className="block text-[10px] uppercase text-gray-400 font-semibold mb-1">
                      Nombre Completo
                    </span>
                    <span className="text-sm font-semibold text-gray-800">
                      {selectedDoc.nombres} {selectedDoc.apellidos}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase text-gray-400 font-semibold mb-1">
                      DNI / Documento
                    </span>
                    <span className="text-sm font-mono text-gray-800">
                      {selectedDoc.dni}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase text-gray-400 font-semibold mb-1">
                      Teléfono
                    </span>
                    <span className="text-sm font-mono text-gray-800">
                      {selectedDoc.telefono}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase text-gray-400 font-semibold mb-1">
                      Correo Electrónico
                    </span>
                    <span className="text-sm font-medium text-marcona-blue">
                      {selectedDoc.correo}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <span className="block text-[10px] uppercase text-gray-400 font-semibold mb-1">
                      Dirección
                    </span>
                    <span className="text-sm text-gray-800">
                      {selectedDoc.direccion}
                    </span>
                  </div>
                </div>
              </div>

              {/* Detalle */}
              <div>
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">
                  Detalle de la Solicitud
                </h3>
                <div className="bg-white border border-gray-200 rounded-xl p-5 text-sm leading-relaxed text-gray-700 whitespace-pre-wrap">
                  {selectedDoc.detalle}
                </div>
              </div>
            </div>

            {/* Modal Footer (Acciones) */}
            <div className="shrink-0 p-5 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
              <span className="text-xs text-gray-500">
                Cambia el estado de la solicitud cuando la gestión haya
                concluido.
              </span>

              <div className="flex items-center gap-3">
                {selectedDoc.estado === "PENDIENTE" ? (
                  <button
                    onClick={() =>
                      handleUpdateStatus(selectedDoc.id, "ATENDIDO")
                    }
                    disabled={updating}
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-all shadow-sm"
                  >
                    {updating ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <CheckCircle size={16} />
                    )}
                    Marcar como Atendido
                  </button>
                ) : (
                  <button
                    onClick={() =>
                      handleUpdateStatus(selectedDoc.id, "PENDIENTE")
                    }
                    disabled={updating}
                    className="flex items-center gap-2 bg-white text-gray-600 hover:text-gray-900 border border-gray-200 font-semibold text-sm px-5 py-2.5 rounded-xl transition-all"
                  >
                    {updating ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Clock size={16} />
                    )}
                    Reabrir (Pendiente)
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

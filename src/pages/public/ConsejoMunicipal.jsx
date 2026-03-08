import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { X, User, GraduationCap, Globe2, Calendar, Info } from "lucide-react";
import TopBar from "../../components/public/TopBar";
import Navbar from "../../components/public/Navbar";
import Footer from "../../components/public/Footer";
import { getConsejoMiembros } from "../../services/consejo.service";

// ===== PropTypes shape compartido =====
const miembroPropType = PropTypes.shape({
  id: PropTypes.number,
  nombre: PropTypes.string,
  cargo: PropTypes.string,
  fotoUrl: PropTypes.string,
  esAlcalde: PropTypes.bool,
  orden: PropTypes.number,
  nacionalidad: PropTypes.string,
  edad: PropTypes.number,
  estudios: PropTypes.string,
  acercaDe: PropTypes.string,
});

// ===== Avatar con iniciales de respaldo =====
function AvatarPlaceholder({ name, size }) {
  const initials = name
    ? name
        .split(" ")
        .slice(0, 2)
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "?";
  const sizeClass =
    size === "large" ? "w-36 h-36 text-4xl" : "w-24 h-24 text-2xl";
  return (
    <div
      className={`${sizeClass} rounded-full bg-gradient-to-br from-marcona-blue to-blue-700 flex items-center justify-center text-white font-bold shadow-lg`}
      aria-label={`Foto de perfil de ${name}`}
    >
      {initials}
    </div>
  );
}

AvatarPlaceholder.propTypes = {
  name: PropTypes.string.isRequired,
  size: PropTypes.oneOf(["normal", "large"]),
};
AvatarPlaceholder.defaultProps = { size: "normal" };

// ===== Tarjeta de miembro =====
function MiembroCard({ miembro, onClick }) {
  const isAlcalde = miembro.esAlcalde;

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") onClick(miembro);
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onClick(miembro)}
      onKeyDown={handleKeyDown}
      className={`group flex flex-col items-center text-center p-6 rounded-2xl bg-white border transition-all duration-300 cursor-pointer hover:-translate-y-2 hover:shadow-xl ${
        isAlcalde
          ? "border-marcona-blue shadow-md"
          : "border-gray-100 shadow-sm"
      }`}
      aria-label={`Ver perfil de ${miembro.nombre}`}
    >
      {/* foto o avatar */}
      <div className="relative mb-4">
        {miembro.fotoUrl ? (
          <img
            src={miembro.fotoUrl}
            alt={miembro.nombre}
            className={`${isAlcalde ? "w-36 h-36" : "w-24 h-24"} rounded-full object-cover shadow-lg group-hover:ring-4 ring-marcona-blue/30 transition-all`}
          />
        ) : (
          <AvatarPlaceholder
            name={miembro.nombre ?? ""}
            size={isAlcalde ? "large" : "normal"}
          />
        )}
        {isAlcalde && (
          <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-marcona-yellow text-marcona-blue text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full whitespace-nowrap shadow">
            Alcalde
          </span>
        )}
      </div>

      {/* info */}
      <div className="mt-2">
        <h3
          className={`font-bold text-gray-800 leading-tight ${isAlcalde ? "text-lg" : "text-sm"}`}
        >
          {miembro.nombre}
        </h3>
        {miembro.cargo && (
          <p
            className={`text-gray-500 mt-1 ${isAlcalde ? "text-sm" : "text-xs"}`}
          >
            {miembro.cargo}
          </p>
        )}
      </div>

      <p className="text-marcona-blue text-xs mt-3 opacity-0 group-hover:opacity-100 transition-opacity font-semibold">
        Ver perfil →
      </p>
    </div>
  );
}

MiembroCard.propTypes = {
  miembro: miembroPropType.isRequired,
  onClick: PropTypes.func.isRequired,
};

// ===== Modal de detalle =====
function MiembroModal({ miembro, onClose }) {
  if (!miembro) return null;

  const handleBackdropKeyDown = (e) => {
    if (e.key === "Escape") onClose();
  };

  const hasQuickData = miembro.nacionalidad || miembro.edad;
  const hasNoBio = !miembro.estudios && !miembro.acercaDe && !hasQuickData;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={`Perfil de ${miembro.nombre}`}
      onClick={onClose}
      onKeyDown={handleBackdropKeyDown}
      tabIndex={-1}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
        role="presentation"
      >
        {/* Header con foto */}
        <div className="bg-gradient-to-br from-marcona-blue to-blue-800 text-white px-8 py-10 flex flex-col items-center relative">
          {miembro.fotoUrl ? (
            <img
              src={miembro.fotoUrl}
              alt={miembro.nombre}
              className="w-28 h-28 rounded-full object-cover shadow-xl ring-4 ring-white/30 mb-4"
            />
          ) : (
            <div className="w-28 h-28 rounded-full bg-white/20 flex items-center justify-center mb-4 shadow-xl ring-4 ring-white/30">
              <User size={48} className="text-white/70" />
            </div>
          )}
          <h2 className="text-2xl font-extrabold text-center">
            {miembro.nombre}
          </h2>
          {miembro.cargo && (
            <span className="mt-2 bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full">
              {miembro.cargo}
            </span>
          )}
          {miembro.esAlcalde && (
            <span className="mt-2 bg-marcona-yellow text-marcona-blue text-xs font-bold px-3 py-1 rounded-full">
              Alcalde Municipal
            </span>
          )}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
            aria-label="Cerrar perfil"
          >
            <X size={22} />
          </button>
        </div>

        {/* Body con datos */}
        <div className="p-8 space-y-5">
          {/* datos rápidos */}
          {hasQuickData && (
            <div className="grid grid-cols-2 gap-3">
              {miembro.nacionalidad && (
                <div className="bg-gray-50 rounded-xl p-3 text-center">
                  <Globe2
                    size={18}
                    className="mx-auto text-marcona-blue mb-1"
                  />
                  <p className="text-xs font-semibold text-gray-700">
                    {miembro.nacionalidad}
                  </p>
                  <p className="text-[10px] text-gray-400">Nacionalidad</p>
                </div>
              )}
              {miembro.edad && (
                <div className="bg-gray-50 rounded-xl p-3 text-center">
                  <Calendar
                    size={18}
                    className="mx-auto text-marcona-blue mb-1"
                  />
                  <p className="text-xs font-semibold text-gray-700">
                    {miembro.edad} años
                  </p>
                  <p className="text-[10px] text-gray-400">Edad</p>
                </div>
              )}
            </div>
          )}

          {/* Estudios */}
          {miembro.estudios && (
            <div className="flex gap-3">
              <div className="shrink-0 w-8 h-8 bg-blue-50 rounded-xl flex items-center justify-center">
                <GraduationCap size={16} className="text-marcona-blue" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                  Formación académica
                </p>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {miembro.estudios}
                </p>
              </div>
            </div>
          )}

          {/* Acerca de */}
          {miembro.acercaDe && (
            <div className="flex gap-3">
              <div className="shrink-0 w-8 h-8 bg-blue-50 rounded-xl flex items-center justify-center">
                <Info size={16} className="text-marcona-blue" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                  Acerca de
                </p>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {miembro.acercaDe}
                </p>
              </div>
            </div>
          )}

          {hasNoBio && (
            <p className="text-gray-400 text-sm text-center py-4">
              Sin información adicional disponible.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

MiembroModal.propTypes = {
  miembro: miembroPropType,
  onClose: PropTypes.func.isRequired,
};
MiembroModal.defaultProps = { miembro: null };

// ===== Página principal =====
export default function ConsejoMunicipal() {
  const [miembros, setMiembros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    getConsejoMiembros()
      .then((data) => setMiembros(data))
      .catch((err) => {
        console.error("Error fetching consejo:", err);
        setError("No se pudo cargar el Consejo Municipal.");
      })
      .finally(() => setLoading(false));
  }, []);

  const alcalde = miembros.find((m) => m.esAlcalde);
  const regidores = miembros.filter((m) => !m.esAlcalde);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <TopBar />
      <Navbar />

      {/* Header */}
      <div className="bg-marcona-blue text-white py-12 px-4 shadow-md">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold">
            Consejo Municipal
          </h1>
          <p className="text-blue-200 mt-3 text-lg">
            Autoridades elegidas para el período 2023–2026 de la Municipalidad
            Distrital de Marcona.
          </p>
        </div>
      </div>

      <main className="flex-1 max-w-5xl mx-auto px-4 py-14 w-full">
        {loading && (
          <div className="flex items-center justify-center min-h-[50vh]">
            <div
              className="w-10 h-10 border-4 border-marcona-blue border-t-transparent rounded-full animate-spin"
              aria-label="Cargando..."
            />
          </div>
        )}

        {!loading && error && (
          <div className="text-center text-red-600 py-16">
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && miembros.length === 0 && (
          <div className="text-center text-gray-400 py-20">
            <User size={64} className="mx-auto mb-4 opacity-20" />
            <p className="text-xl font-semibold">
              No hay miembros registrados aún.
            </p>
          </div>
        )}

        {/* Alcalde */}
        {alcalde && (
          <div className="mb-14">
            <h2 className="text-xs font-bold uppercase tracking-widest text-marcona-blue mb-6 text-center">
              — Alcalde de la Municipalidad Distrital de Marcona —
            </h2>
            <div className="flex justify-center">
              <div className="w-64">
                <MiembroCard miembro={alcalde} onClick={setSelected} />
              </div>
            </div>
          </div>
        )}

        {/* Regidores */}
        {regidores.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-8 text-center">
              — Regidores —
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {regidores.map((m) => (
                <MiembroCard key={m.id} miembro={m} onClick={setSelected} />
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />

      {/* Modal de detalle */}
      {selected && (
        <MiembroModal miembro={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}

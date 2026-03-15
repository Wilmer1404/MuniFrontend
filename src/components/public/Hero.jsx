import { useState } from "react";
import { Search } from "lucide-react";

export default function Hero() {
  const [query, setQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      window.location.href = `/servicios?q=${encodeURIComponent(query)}`;
    }
  };

  return (
    <section className="relative min-h-[480px] flex items-center justify-center overflow-hidden">
      {/* Imagen de fondo */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/hero-marcona.png')" }}
      />
      {/* Overlay oscuro en degradé */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />

      {/* Contenido centrado */}
      <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
        <p className="text-marcona-gold font-semibold text-sm uppercase tracking-widest mb-3 opacity-90">
          Portal Ciudadano Digital
        </p>
        <h2 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight mb-4 drop-shadow-lg">
          Bienvenidos a tu Nueva{" "}
          <span className="text-marcona-gold">Municipalidad Digital.</span>
          <br />
          Cerca de Ti.
        </h2>
        <p className="text-white/80 text-base mb-8">
          Accede a trámites, noticias y servicios municipales desde cualquier
          lugar.
        </p>

        {/* Barra de búsqueda */}
        <form
          onSubmit={handleSearch}
          className="flex items-center bg-white rounded-full shadow-2xl overflow-hidden max-w-xl mx-auto"
        >
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="¿Qué trámite o documento buscas hoy? (Ej: Licencia de funcionamiento)"
            className="flex-1 px-5 py-3.5 text-sm text-gray-700 placeholder-gray-400 outline-none font-medium"
          />
          <button
            type="submit"
            className="bg-marcona-blue hover:bg-blue-800 text-white px-5 py-3.5 transition-colors flex items-center gap-2 font-semibold text-sm shrink-0"
          >
            <Search size={18} strokeWidth={1.5} />
            <span className="hidden sm:inline">Buscar</span>
          </button>
        </form>
      </div>

      {/* Wave bottom */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 60"
          preserveAspectRatio="none"
          className="w-full h-10"
          fill="white"
        >
          <path d="M0,60 C240,20 480,0 720,20 C960,40 1200,60 1440,30 L1440,60 Z" />
        </svg>
      </div>
    </section>
  );
}

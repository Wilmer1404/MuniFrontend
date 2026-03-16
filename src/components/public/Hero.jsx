import { useState, useEffect, useRef } from "react";
import {
  Search,
  Loader2,
  FileText,
  Newspaper,
  Map,
  X,
  ShieldAlert,
  CreditCard,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { globalSearch } from "../../services/search.service";

// edwind, estos son como atajos rápidos que configuramos a mano para buscar más rápido
const SHORTCUTS = [
  {
    title: "Mesa de Partes Virtual",
    url: "/mesa-partes",
    icon: <FileText size={16} />,
    keywords: ["mesa", "partes", "tramite", "fut", "documento"],
  },
  {
    title: "Pago de Tributos",
    url: "#tributos",
    icon: <CreditCard size={16} />,
    keywords: ["pago", "tributos", "impuestos", "arbitrios", "rentas"],
  },
  {
    title: "Desarrollo Económico (Turismo)",
    url: "/desarrollo-economico",
    icon: <Map size={16} />,
    keywords: [
      "turismo",
      "playa",
      "playas",
      "marcona",
      "gastronomia",
      "desarrollo",
      "economico",
    ],
  },
  {
    title: "Seguridad Ciudadana",
    url: "https://denuncias.servicios.gob.pe/",
    icon: <ShieldAlert size={16} />,
    keywords: [
      "seguridad",
      "ciudadana",
      "denuncia",
      "emergencia",
      "serenazgo",
      "policia",
    ],
  },
  {
    title: "Consejo Municipal",
    url: "/municipalidad/consejo",
    icon: <Search size={16} />,
    keywords: ["consejo", "alcalde", "regidores", "municipalidad"],
  },
  {
    title: "Misión y Visión",
    url: "/municipalidad/mision-vision",
    icon: <Search size={16} />,
    keywords: ["mision", "vision", "municipalidad"],
  },
];

export default function Hero() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState({
    noticias: [],
    documentos: [],
    shortcuts: [],
  });
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // edwind, si la persona hace click fuera de las opciones, escondemos la lista
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // edwind, esperamos un ratito (debounce) para no saturar al servidor pidiendo cosas con cada letra que escriben
  useEffect(() => {
    const q = query.trim().toLowerCase();

    if (q.length < 2) {
      setResults({ noticias: [], documentos: [], shortcuts: [] });
      setIsSearching(false);
      return;
    }

    setIsSearching(true);

    // edwind, primero buscamos en nuestros atajitos predefinidos a ver si hay suerte
    const matchedShortcuts = SHORTCUTS.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.keywords.some((k) => k.includes(q)),
    ).slice(0, 3);

    const delayDebounceFn = setTimeout(async () => {
      try {
        const data = await globalSearch(q);
        setResults({
          shortcuts: matchedShortcuts,
          noticias: data.noticias || [],
          documentos: data.documentos || [],
        });
      } catch (error) {
        console.error("Error en la búsqueda:", error);
      } finally {
        setIsSearching(false);
      }
    }, 400); // edwind, esperamos 400 milisegundos para respirar antes de pedir datos reales

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/noticias?q=${encodeURIComponent(query)}`); // edwind, si se mandan de frente, los llevamos a la página de resultados genérica
      setShowDropdown(false);
    }
  };

  const handleClear = () => {
    setQuery("");
    setResults({ noticias: [], documentos: [], shortcuts: [] });
    setShowDropdown(false);
  };

  return (
    <section className="relative min-h-[480px] flex items-center justify-center overflow-visible">
      {/* edwind, esta es la fotazo de la playa que sale al fondo */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/hero-marcona.png')" }}
      />
      {/* edwind, esto oscurece un poco la foto para que las letras blancas se lean bien */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70 pointer-events-none" />

      {/* edwind, todo el texto principal bien centradito en la pantalla */}
      <div
        className="relative z-50 text-center px-4 max-w-3xl mx-auto w-full mt-10"
        ref={dropdownRef}
      >
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

        {/* edwind, la barra de búsqueda donde empieza la magia */}
        <div className="relative w-full max-w-xl mx-auto z-50">
          <form
            onSubmit={handleSearchSubmit}
            className={`flex items-center bg-white shadow-2xl overflow-hidden transition-all duration-300 relative z-50 ${
              showDropdown && query.length >= 2
                ? "rounded-t-3xl rounded-b-none border-b border-gray-100"
                : "rounded-full"
            }`}
          >
            <div className="pl-5 text-gray-400">
              {isSearching ? (
                <Loader2 size={20} className="animate-spin text-marcona-blue" />
              ) : (
                <Search size={20} strokeWidth={1.5} />
              )}
            </div>

            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setShowDropdown(true);
              }}
              onFocus={() => setShowDropdown(true)}
              placeholder="¿Qué trámite o documento buscas hoy?"
              className="flex-1 px-4 py-3.5 text-sm text-gray-700 placeholder-gray-400 outline-none font-medium bg-transparent"
            />

            {query && (
              <button
                type="button"
                onClick={handleClear}
                className="pr-4 text-gray-300 hover:text-gray-600 transition-colors"
                aria-label="Limpiar búsqueda"
              >
                <X size={20} />
              </button>
            )}

            <button
              type="submit"
              className="bg-marcona-blue hover:bg-blue-800 text-white px-5 py-3.5 transition-colors flex items-center gap-2 font-semibold text-sm shrink-0"
            >
              <Search size={18} strokeWidth={1.5} className="sm:hidden" />
              <span className="hidden sm:inline">Buscar</span>
            </button>
          </form>

          {/* edwind, y este es el cuadro grande que cae con los resultados de la búsqueda */}
          {showDropdown && query.length >= 2 && (
            <div className="absolute top-full left-0 right-0 bg-white rounded-b-3xl shadow-2xl overflow-hidden border-t-0 border border-gray-100 z-50 transform origin-top animate-in slide-in-from-top-2 fade-in duration-200">
              <div className="max-h-[60vh] overflow-y-auto w-full text-left scrollbar-thin scrollbar-thumb-gray-200">
                {/* edwind, sección primera: mostramos los atajos del sistema */}
                {results.shortcuts.length > 0 && (
                  <div className="p-4 border-b border-gray-50 last:border-0">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 px-2">
                      Accesos Directos
                    </h4>
                    <div className="flex flex-col gap-1">
                      {results.shortcuts.map((s, i) => (
                        <Link
                          key={i}
                          to={s.url}
                          onClick={() => setShowDropdown(false)}
                          className="flex items-center gap-3 px-3 py-2.5 hover:bg-blue-50 text-gray-700 hover:text-marcona-blue rounded-xl transition-colors"
                        >
                          <span className="p-1.5 bg-gray-100 rounded-md text-gray-500">
                            {s.icon}
                          </span>
                          <span className="font-semibold text-sm">
                            {s.title}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* edwind, sección dos: todos los documentos y cosas de papeleo */}
                {results.documentos.length > 0 && (
                  <div className="p-4 border-b border-gray-50 last:border-0">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 px-2">
                      Documentos de Transparencia
                    </h4>
                    <div className="flex flex-col gap-1">
                      {results.documentos.map((doc) => (
                        <a
                          key={doc.id}
                          href={doc.archivoUrl}
                          target="_blank"
                          rel="noreferrer"
                          onClick={() => setShowDropdown(false)}
                          className="flex items-start gap-3 px-3 py-2.5 hover:bg-orange-50 text-gray-700 hover:text-orange-700 rounded-xl transition-colors group"
                        >
                          <span className="p-1.5 bg-orange-100 rounded-md text-orange-600 mt-0.5">
                            <FileText size={16} />
                          </span>
                          <div>
                            <span className="font-semibold text-sm line-clamp-1">
                              {doc.titulo}
                            </span>
                            <span className="text-xs text-gray-500 flex gap-2 mt-1">
                              <span className="bg-white px-1.5 py-0.5 rounded shadow-sm border border-gray-100">
                                {doc.tipo}
                              </span>
                              {doc.anio}
                            </span>
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* edwind, sección tres: para no perderse el chisme local, las noticias */}
                {results.noticias.length > 0 && (
                  <div className="p-4 border-b border-gray-50 last:border-0">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 px-2">
                      Noticias y Actualidad
                    </h4>
                    <div className="flex flex-col gap-1">
                      {results.noticias.map((noticia) => (
                        <Link
                          key={noticia.id}
                          to={`/noticias/${noticia.id}`}
                          onClick={() => setShowDropdown(false)}
                          className="flex items-start gap-3 px-3 py-2 hover:bg-gray-50 text-gray-700 rounded-xl transition-colors group"
                        >
                          {noticia.imagenPortada ? (
                            <img
                              src={noticia.imagenPortada}
                              alt=""
                              className="w-10 h-10 rounded-lg object-cover bg-gray-100 shrink-0"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-gray-100 text-gray-400 flex items-center justify-center shrink-0">
                              <Newspaper size={16} />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <span className="font-semibold text-sm line-clamp-2 leading-tight group-hover:text-marcona-blue transition-colors">
                              {noticia.titulo}
                            </span>
                            <span className="text-xs text-gray-500 mt-1 block">
                              {new Date(
                                noticia.fechaPublicacion,
                              ).toLocaleDateString()}
                            </span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* edwind, y si no encontramos nada, toca decirle con pena que intente de nuevo */}
                {!isSearching &&
                  results.shortcuts.length === 0 &&
                  results.noticias.length === 0 &&
                  results.documentos.length === 0 && (
                    <div className="p-8 text-center text-gray-500">
                      <Search
                        className="mx-auto mb-3 text-gray-300"
                        size={32}
                      />
                      <p className="text-sm">
                        No encontramos resultados exactos para "
                        <strong>{query}</strong>"
                      </p>
                      <p className="text-xs mt-1 text-gray-400">
                        Intenta con otras palabras o navega por el menú
                        superior.
                      </p>
                    </div>
                  )}
              </div>

              <div className="bg-gray-50 px-4 py-3 border-t border-gray-100 text-xs text-center text-gray-500 font-medium flex items-center justify-center gap-2">
                Presiona "Enter" para buscar en toda la plataforma
              </div>
            </div>
          )}
        </div>
      </div>

      {/* edwind, unas olitas de diseño para que la separación con lo de abajo se vea bonita */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
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

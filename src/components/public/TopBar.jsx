import { useState } from "react";
import { Link } from "react-router-dom";
import { FileText } from "lucide-react";

export default function TopBar() {
  const [fontSize, setFontSize] = useState(16);

  const increaseFontSize = () => {
    const newSize = Math.min(fontSize + 2, 20);
    setFontSize(newSize);
    document.documentElement.style.fontSize = `${newSize}px`;
  };

  const decreaseFontSize = () => {
    const newSize = Math.max(fontSize - 2, 12);
    setFontSize(newSize);
    document.documentElement.style.fontSize = `${newSize}px`;
  };

  return (
    <header className="bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-3">
          {/* edwind, aquí va el logo machucho de la municipalidad, si le dan click van al inicio */}
          <Link to="/" className="flex items-center gap-2 sm:gap-4 group">
            {/* edwind, el svg pescadito del logo para que no se pixelee */}
            <img
              src="/marconalogo.svg"
              alt="Logo Municipalidad Distrital de Marcona"
              className="h-10 sm:h-14 w-auto object-contain flex-shrink-0 drop-shadow-sm group-hover:opacity-90 transition-opacity"
            />

            <div>
              <p className="text-[8px] sm:text-[10px] font-semibold text-marcona-blue uppercase tracking-widest leading-tight">
                Municipalidad Distrital de
              </p>
              <h1 className="text-lg sm:text-2xl font-black text-marcona-blue tracking-tight leading-tight uppercase group-hover:text-blue-800 transition-colors">
                Marcona
              </h1>
              <p className="hidden sm:block text-[10px] text-marcona-gold font-medium italic">
                Trabajando por tu Bienestar
              </p>
            </div>
          </Link>

          {/* edwind, ahora vamos con la botonería de la derecha */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* edwind, los tramposones para agrandar o achicar las letras */}
            <div className="hidden sm:flex items-center gap-1 border border-gray-200 rounded-lg px-2 py-1">
              <button
                onClick={decreaseFontSize}
                title="Reducir texto"
                className="px-2 py-1 text-sm font-bold text-gray-600 hover:text-marcona-blue transition-colors"
              >
                A-
              </button>
              <div className="w-px h-4 bg-gray-200" />
              <button
                onClick={increaseFontSize}
                title="Aumentar texto"
                className="px-2 py-1 text-base font-bold text-gray-600 hover:text-marcona-blue transition-colors"
              >
                A+
              </button>
            </div>

            {/* edwind, el libro de quejas, disimuladito pero ahí está */}
            <a
              href="https://facilita.gob.pe/t/15020"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-marcona-blue hover:bg-gray-50 px-3 py-1.5 rounded-lg transition-colors border border-transparent hover:border-gray-200"
            >
              <FileText size={14} strokeWidth={2} />
              Reclamos y Sugerencias
            </a>

            {/* edwind, para que vean que somos transparentes con las cuentas */}
            <a
              href="https://transparencia.gob.pe/enlaces/pte_transparencia_enlaces.aspx?id_entidad=11448#.Yqs90nbMKUn"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-marcona-blue hover:bg-gray-50 px-3 py-1.5 rounded-lg transition-colors border border-transparent hover:border-gray-200"
            >
              <FileText size={14} strokeWidth={2} />
              Portal de transparencia
            </a>

            {/* edwind, y acá pa' que denuncien si algo anda chueco */}
            <a
              href="https://denuncias.servicios.gob.pe/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-marcona-blue hover:bg-gray-50 px-3 py-1.5 rounded-lg transition-colors border border-transparent hover:border-gray-200"
            >
              <FileText size={14} strokeWidth={2} />
              Denuncias del Ciudadano
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}

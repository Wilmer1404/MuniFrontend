import { useState } from 'react';
import { FileText, Type, Contrast } from 'lucide-react';

export default function TopBar() {
  const [fontSize, setFontSize] = useState(16);
  const [highContrast, setHighContrast] = useState(false);

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

  const toggleContrast = () => {
    setHighContrast(!highContrast);
    document.documentElement.classList.toggle('high-contrast');
  };

  return (
    <header className="bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-3">

          {/* Logo + Nombre */}
          <div className="flex items-center gap-4">
            {/* Escudo placeholder */}
            <div className="w-14 h-14 bg-marcona-blue rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
              <span className="text-white text-2xl font-black leading-none">M</span>
            </div>
            <div>
              <p className="text-[10px] font-semibold text-marcona-blue uppercase tracking-widest leading-tight">
                Municipalidad Distrital de
              </p>
              <h1 className="text-2xl font-black text-marcona-blue tracking-tight leading-tight uppercase">
                Marcona
              </h1>
              <p className="text-[10px] text-marcona-gold font-medium italic">
                Trabajando por tu Bienestar
              </p>
            </div>
          </div>

          {/* Controles derecha */}
          <div className="flex items-center gap-4">
            {/* Accesibilidad */}
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
              <div className="w-px h-4 bg-gray-200" />
              <button
                onClick={toggleContrast}
                title="Alto contraste"
                className={`px-2 py-1 rounded transition-colors ${
                  highContrast ? 'bg-black text-white' : 'text-gray-600 hover:text-marcona-blue'
                }`}
              >
                <Contrast size={16} strokeWidth={1.5} />
              </button>
            </div>

            {/* Botón Mesa de Partes */}
            <a
              href="#mesa-partes"
              className="btn-primary text-sm"
            >
              <FileText size={16} strokeWidth={1.5} />
              Mesa de Partes Virtual
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}

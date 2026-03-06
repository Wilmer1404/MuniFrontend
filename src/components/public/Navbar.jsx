import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';

const NAV_LINKS = [
  { label: 'Inicio', to: '/' },
  { label: 'Municipalidad', to: '/municipalidad' },
  { label: 'Servicios', to: '/servicios' },
  { label: 'Transparencia', to: '/transparencia' },
  { label: 'Noticias', to: '/noticias' },
  { label: 'Contacto', to: '/contacto' },
];

export default function Navbar() {
  const { pathname } = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="bg-white border-b-2 border-marcona-gold shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12">

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(({ label, to }) => {
              const active = pathname === to;
              return (
                <Link
                  key={to}
                  to={to}
                  className={
                    active
                      ? 'bg-marcona-blue text-white rounded-full px-5 py-1.5 text-sm font-semibold transition-all'
                      : 'text-gray-700 hover:text-marcona-blue text-sm px-4 py-1.5 font-medium transition-colors rounded-full hover:bg-marcona-light'
                  }
                >
                  {label}
                </Link>
              );
            })}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-lg text-marcona-blue hover:bg-marcona-light transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Abrir menú"
          >
            {mobileOpen ? <X size={22} strokeWidth={1.5} /> : <Menu size={22} strokeWidth={1.5} />}
          </button>

          {/* Portal del ciudadano right side */}
          <div className="hidden md:block">
            <Link
              to="/login"
              className="text-sm text-marcona-blue font-medium hover:text-blue-800 transition-colors border border-marcona-blue rounded-full px-4 py-1.5"
            >
              Portal del Ciudadano
            </Link>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden pb-3 pt-1 border-t border-gray-100">
            {NAV_LINKS.map(({ label, to }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setMobileOpen(false)}
                className={`block py-2.5 px-3 rounded-lg text-sm font-medium mb-1 ${
                  pathname === to
                    ? 'bg-marcona-blue text-white'
                    : 'text-gray-700 hover:bg-marcona-light'
                }`}
              >
                {label}
              </Link>
            ))}
            <Link
              to="/login"
              onClick={() => setMobileOpen(false)}
              className="block py-2.5 px-3 rounded-lg text-sm font-medium text-marcona-blue border border-marcona-blue mt-2 text-center"
            >
              Portal del Ciudadano
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}

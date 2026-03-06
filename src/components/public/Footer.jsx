import {
  Facebook, Instagram, Twitter, Youtube,
  MapPin, Phone, Mail, ExternalLink,
} from 'lucide-react';

const QUICK_LINKS = [
  { label: 'Inicio', href: '/' },
  { label: 'Municipalidad', href: '/municipalidad' },
  { label: 'Transparencia', href: '/transparencia' },
  { label: 'Noticias', href: '/noticias' },
];

const SERVICE_LINKS = [
  { label: 'Mesa de Partes Virtual', href: '#mesa-partes' },
  { label: 'Pago en Línea', href: '#tributos' },
  { label: 'Trámites y Licencias', href: '#tramites' },
  { label: 'Consulta tu Expediente', href: '#expediente' },
  { label: 'Contacto', href: '/contacto' },
];

const SOCIALS = [
  { icon: Facebook, href: '#', label: 'Facebook' },
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Twitter, href: '#', label: 'Twitter / X' },
  { icon: Youtube, href: '#', label: 'YouTube' },
];

export default function Footer() {
  return (
    <footer className="bg-marcona-blue text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Columna 1: Institución */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <span className="text-marcona-blue font-black text-lg">M</span>
              </div>
              <div>
                <p className="font-black text-sm leading-tight uppercase">Municipalidad Distrital</p>
                <p className="font-black text-base uppercase leading-tight text-marcona-gold">de Marcona</p>
              </div>
            </div>
            <p className="text-white/60 text-xs leading-relaxed">
              Comprometidos con el desarrollo y bienestar de todos los ciudadanos del Distrito de Marcona, Ica, Perú.
            </p>

            {/* Redes sociales */}
            <div className="flex items-center gap-3 mt-5">
              {SOCIALS.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-8 h-8 bg-white/10 hover:bg-marcona-gold hover:text-gray-900
                             rounded-full flex items-center justify-center transition-all duration-200"
                >
                  <Icon size={15} strokeWidth={1.5} />
                </a>
              ))}
            </div>
          </div>

          {/* Columna 2: Links rápidos */}
          <div>
            <h4 className="font-bold text-sm uppercase tracking-widest text-marcona-gold mb-4">
              Acceso Rápido
            </h4>
            <ul className="space-y-2">
              {QUICK_LINKS.map(({ label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    className="text-white/70 hover:text-white text-sm transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 bg-marcona-gold rounded-full group-hover:scale-150 transition-transform" />
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Columna 3: Servicios */}
          <div>
            <h4 className="font-bold text-sm uppercase tracking-widest text-marcona-gold mb-4">
              Servicios
            </h4>
            <ul className="space-y-2">
              {SERVICE_LINKS.map(({ label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    className="text-white/70 hover:text-white text-sm transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 bg-marcona-gold rounded-full group-hover:scale-150 transition-transform" />
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Columna 4: Contacto + Escudo */}
          <div>
            <h4 className="font-bold text-sm uppercase tracking-widest text-marcona-gold mb-4">
              Contacto
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5 text-white/70 text-sm">
                <MapPin size={16} strokeWidth={1.5} className="mt-0.5 shrink-0 text-marcona-gold" />
                Av. Marcona S/N, Marcona, Ica, Perú
              </li>
              <li className="flex items-center gap-2.5 text-white/70 text-sm">
                <Phone size={16} strokeWidth={1.5} className="shrink-0 text-marcona-gold" />
                (056) 123-456
              </li>
              <li className="flex items-center gap-2.5 text-sm">
                <Mail size={16} strokeWidth={1.5} className="shrink-0 text-marcona-gold" />
                <a
                  href="mailto:contacto@munimarcona.gob.pe"
                  className="text-white/70 hover:text-white transition-colors break-all"
                >
                  contacto@munimarcona.gob.pe
                </a>
              </li>
            </ul>

            {/* Escudo Nacional del Perú (SVG simplificado) */}
            <div className="mt-5 flex items-center gap-3">
              <div className="w-12 h-14 flex items-start justify-center">
                <svg viewBox="0 0 60 72" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Escudo tricolor simplificado */}
                  <path d="M30 4 L56 18 L56 54 C56 54 30 68 30 68 C30 68 4 54 4 54 L4 18 Z" fill="#D91023" />
                  <path d="M30 4 L56 18 L56 54 C56 54 43 61 30 68 L30 4 Z" fill="white" />
                  <path d="M4 18 L30 4 L30 68 C17 61 4 54 4 54 Z" fill="#D91023" />
                  {/* División central blanca */}
                  <path d="M20 18 L40 18 L40 54 L20 54 Z" fill="white" />
                  {/* Árbol (simplificado) */}
                  <path d="M30 28 L27 36 L33 36 Z" fill="#00703C" />
                  <rect x="29" y="36" width="2" height="6" fill="#5C3310" />
                  {/* Vicuña */}
                  <ellipse cx="23" cy="36" rx="4" ry="3" fill="#C8A870" />
                  <line x1="23" y1="33" x2="23" y2="29" stroke="#C8A870" strokeWidth="1.5" />
                  {/* Cornucopia */}
                  <path d="M37 33 Q41 36 39 40 L35 38 Q36 34 37 33Z" fill="#FFD700" />
                </svg>
              </div>
              <p className="text-white/50 text-[10px] leading-tight">
                República del Perú<br />
                Gobierno Local
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-white/40 text-xs text-center">
            © 2026 Municipalidad Distrital de Marcona. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-white/40 hover:text-white text-xs transition-colors">Política de Privacidad</a>
            <a href="#" className="text-white/40 hover:text-white text-xs transition-colors">Términos de Uso</a>
            <a
              href="https://www.gob.pe"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/40 hover:text-white text-xs transition-colors flex items-center gap-1"
            >
              gob.pe <ExternalLink size={10} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

import { FileText, CreditCard, FolderSearch, ShieldAlert } from 'lucide-react';

const SERVICES = [
  {
    icon: FileText,
    iconBg: 'bg-blue-50',
    iconColor: 'text-marcona-blue',
    title: 'Mesa de Partes Virtual',
    subtitle: 'Realiza tus trámites desde casa',
    href: '#mesa-partes',
    id: 'service-mesa-partes',
  },
  {
    icon: CreditCard,
    iconBg: 'bg-green-50',
    iconColor: 'text-green-600',
    title: 'Pago de Tributos',
    subtitle: 'Paga tus arbitrios e impuestos en línea',
    href: '#tributos',
    id: 'service-tributos',
  },
  {
    icon: FolderSearch,
    iconBg: 'bg-yellow-50',
    iconColor: 'text-yellow-600',
    title: 'Trámites y Licencias',
    subtitle: 'Guía de trámites municipales',
    href: '#tramites',
    id: 'service-tramites',
  },
  {
    icon: ShieldAlert,
    iconBg: 'bg-red-50',
    iconColor: 'text-red-500',
    title: 'Seguridad Ciudadana', 
    subtitle: 'Contacto de emergencia y denuncias',
    href: 'https://denuncias.servicios.gob.pe/',
    id: 'service-seguridad',
  },
];

export default function ServiceCards() {
  return (
    <section className="relative z-10 -mt-10 px-4 max-w-5xl mx-auto mb-12">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* eslint-disable-next-line no-unused-vars */}
        {SERVICES.map(({ icon: Icon, iconBg, iconColor, title, subtitle, href, id }) => (
          <a
            key={id}
            id={id}
            href={href}
            className="bg-white rounded-2xl shadow-lg p-5 flex flex-col items-center text-center
                       hover:-translate-y-2 hover:shadow-xl transition-all duration-300 cursor-pointer group"
          >
            {/* Icono */}
            <div className={`${iconBg} ${iconColor} w-14 h-14 rounded-2xl flex items-center justify-center mb-4
                            group-hover:scale-110 transition-transform duration-300`}>
              <Icon size={28} strokeWidth={1.5} />
            </div>
            <h3 className="font-bold text-gray-800 text-sm leading-tight mb-1">{title}</h3>
            <p className="text-gray-500 text-xs leading-snug">{subtitle}</p>
          </a>
        ))}
      </div>
    </section>
  );
}

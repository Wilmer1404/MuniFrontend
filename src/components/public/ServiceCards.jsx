/* eslint-disable no-unused-vars */
import { Link } from "react-router-dom";
import { FileText, CreditCard, ShieldAlert, Map } from "lucide-react";

const SERVICES = [
  {
    icon: FileText,
    iconBg: "bg-blue-50",
    iconColor: "text-marcona-blue",
    title: "Mesa de Partes Virtual",
    subtitle: "Realiza tus trámites desde casa",
    href: "/mesa-partes",
    id: "service-mesa-partes",
  },
  {
    icon: CreditCard,
    iconBg: "bg-green-50",
    iconColor: "text-green-600",
    title: "Pago de Tributos",
    subtitle: "Paga tus arbitrios e impuestos en línea",
    href: "#tributos",
    id: "service-tributos",
  },
  {
    icon: Map,
    iconBg: "bg-yellow-50",
    iconColor: "text-yellow-600",
    title: "Desarrollo Económico",
    subtitle: "Turismo, Gastronomía y más",
    href: "/desarrollo-economico",
    id: "service-desarrollo",
  },
  {
    icon: ShieldAlert,
    iconBg: "bg-red-50",
    iconColor: "text-red-500",
    title: "Seguridad Ciudadana",
    subtitle: "Contacto de emergencia y denuncias",
    href: "https://denuncias.servicios.gob.pe/",
    id: "service-seguridad",
  },
];

export default function ServiceCards() {
  return (
    <section className="relative z-0 -mt-10 px-4 max-w-5xl mx-auto mb-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {/* eslint-disable-next-line no-unused-vars */}
        {SERVICES.map(
          ({ icon: Icon, iconBg, iconColor, title, subtitle, href, id }) => {
            const isExternal = href.startsWith("http") || href.startsWith("#");
            const Wrapper = isExternal ? "a" : Link;
            const hrefProp = isExternal
              ? {
                  href,
                  ...(href.startsWith("http")
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {}),
                }
              : { to: href };

            return (
              <Wrapper
                key={id}
                id={id}
                {...hrefProp}
                className="bg-white rounded-2xl shadow-lg p-5 flex flex-col items-center text-center
                         hover:-translate-y-2 hover:shadow-xl transition-all duration-300 cursor-pointer group"
              >
                {/* edwind, el dibujito de la tarjeta para que se vea más amigable */}
                <div
                  className={`${iconBg} ${iconColor} w-14 h-14 rounded-2xl flex items-center justify-center mb-4
                              group-hover:scale-110 transition-transform duration-300`}
                >
                  <Icon size={28} strokeWidth={1.5} />
                </div>
                <h3 className="font-bold text-gray-800 text-sm leading-tight mb-1">
                  {title}
                </h3>
                <p className="text-gray-500 text-xs leading-snug">{subtitle}</p>
              </Wrapper>
            );
          },
        )}
      </div>
    </section>
  );
}

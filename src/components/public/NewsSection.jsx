import { ArrowRight, Tag } from 'lucide-react';

const NEWS = [
  {
    id: 'news-obras',
    image: '/news-obras.png',
    category: 'Obras',
    categoryColor: 'bg-blue-600',
    title: 'Entrega de nueva obra en Barrio Nuevo',
    date: '02 Mar 2026',
    excerpt: 'La Municipalidad culminó el asfaltado de la Av. Principal del Barrio Nuevo, beneficiando a más de 2,000 vecinos.',
  },
  {
    id: 'news-salud',
    image: '/news-salud.png',
    category: 'Salud',
    categoryColor: 'bg-green-600',
    title: 'Campaña de Salud Gratuita',
    date: '28 Feb 2026',
    excerpt: 'Más de 500 ciudadanos recibieron atención médica gratuita durante la campaña organizada en la Plaza de Armas.',
  },
  {
    id: 'news-comunicado',
    image: null,
    category: 'Comunicado',
    categoryColor: 'bg-marcona-gold',
    title: 'Comunicado Oficial',
    date: '25 Feb 2026',
    excerpt: 'La Municipalidad Distrital de Marcona informa sobre los nuevos horarios de atención al público a partir del 01 de marzo.',
  },
];

export default function NewsSection() {
  return (
    <section className="py-14 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-marcona-gold font-semibold text-xs uppercase tracking-widest mb-1">
              Últimas actualizaciones
            </p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
              Noticias y Comunicados
            </h2>
          </div>
          <a
            href="/noticias"
            className="hidden sm:flex items-center gap-1.5 text-marcona-blue font-semibold text-sm hover:text-blue-800 transition-colors"
          >
            Ver todas <ArrowRight size={16} strokeWidth={1.5} />
          </a>
        </div>

        {/* Grid de tarjetas */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {NEWS.map(({ id, image, category, categoryColor, title, date, excerpt }) => (
            <article
              key={id}
              id={id}
              className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl
                         transition-all duration-300 hover:-translate-y-1 border border-gray-100"
            >
              {/* Imagen */}
              <div className="relative h-48 overflow-hidden">
                {image ? (
                  <img
                    src={image}
                    alt={title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-marcona-blue/10 to-marcona-blue/30 flex items-center justify-center">
                    <div className="text-center px-6">
                      <div className="w-12 h-12 bg-marcona-blue/20 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Tag size={20} strokeWidth={1.5} className="text-marcona-blue" />
                      </div>
                      <p className="text-marcona-blue/60 text-xs font-medium">Comunicado oficial</p>
                    </div>
                  </div>
                )}

                {/* Badge categoría */}
                <span className={`absolute top-3 left-3 ${categoryColor} text-white text-[11px] font-bold px-2.5 py-1 rounded-full`}>
                  {category}
                </span>
              </div>

              {/* Contenido */}
              <div className="p-5">
                <time className="text-gray-400 text-xs font-medium">{date}</time>
                <h3 className="font-bold text-gray-800 text-sm mt-1 mb-2 leading-snug group-hover:text-marcona-blue transition-colors">
                  {title}
                </h3>
                <p className="text-gray-500 text-xs leading-relaxed line-clamp-3">{excerpt}</p>
                <a
                  href="#"
                  className="inline-flex items-center gap-1 text-marcona-blue font-semibold text-xs mt-4 hover:text-blue-800 transition-colors"
                >
                  Leer más <ArrowRight size={13} strokeWidth={2} />
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

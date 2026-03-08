import React from "react";
import TopBar from "../../components/public/TopBar";
import Navbar from "../../components/public/Navbar";
import Footer from "../../components/public/Footer";
import misionImg from "../../assets/mision_hero.png";
import visionImg from "../../assets/vision_hero.png";

const VALORES = [
  {
    titulo: "Transparencia",
    desc: "Actuamos con apertura total, rindiendo cuentas a los ciudadanos sobre cada decisión y el uso de los recursos públicos.",
    color: "bg-blue-50 border-blue-200",
    iconBg: "bg-blue-100 text-blue-700",
    emoji: "🔍",
  },
  {
    titulo: "Compromiso",
    desc: "Dedicamos nuestra capacidad y energía en beneficio del distrito, priorizando el bienestar colectivo sobre intereses particulares.",
    color: "bg-amber-50 border-amber-200",
    iconBg: "bg-amber-100 text-amber-700",
    emoji: "🤝",
  },
  {
    titulo: "Innovación",
    desc: "Adoptamos tecnología y mejores prácticas para modernizar los servicios municipales y acercarnos más al ciudadano.",
    color: "bg-green-50 border-green-200",
    iconBg: "bg-green-100 text-green-700",
    emoji: "💡",
  },
  {
    titulo: "Responsabilidad",
    desc: "Asumimos con seriedad nuestras funciones, respondemos por nuestros actos y garantizamos el cumplimiento de nuestros deberes.",
    color: "bg-purple-50 border-purple-200",
    iconBg: "bg-purple-100 text-purple-700",
    emoji: "⚖️",
  },
  {
    titulo: "Honestidad",
    desc: "Actuamos con integridad, rechazando la corrupción y garantizando la confianza de la ciudadanía en cada proceso.",
    color: "bg-red-50 border-red-200",
    iconBg: "bg-red-100 text-red-700",
    emoji: "🏛️",
  },
  {
    titulo: "Inclusión",
    desc: "Reconocemos la diversidad de nuestra comunidad y garantizamos que todos los ciudadanos puedan acceder a los servicios municipales.",
    color: "bg-teal-50 border-teal-200",
    iconBg: "bg-teal-100 text-teal-700",
    emoji: "🌐",
  },
];

export default function MisionVision() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <TopBar />
      <Navbar />

      {/* ====== HERO BANNER ====== */}
      <div className="bg-marcona-blue text-white relative overflow-hidden">
        {/* decorative circles */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-marcona-yellow/10 rounded-full translate-y-1/2 -translate-x-1/4" />

        <div className="relative max-w-5xl mx-auto px-6 py-14 md:py-20">
          <div className="flex items-center gap-3 mb-4">
            <span className="inline-block bg-marcona-yellow/20 text-marcona-yellow text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full">
              Municipalidad
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
            Misión <span className="text-marcona-yellow">&</span> Visión
          </h1>
          <p className="mt-4 text-blue-200 text-lg md:text-xl max-w-2xl leading-relaxed">
            Los principios que guían cada decisión y proyectan el futuro del
            distrito de Marcona.
          </p>
        </div>
      </div>

      <main className="flex-1">
        {/* ====== SECCIÓN MISIÓN ====== */}
        <section className="py-16 md:py-24">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Texto */}
              <div className="order-2 md:order-1">
                <div className="inline-flex items-center gap-2 bg-blue-50 text-marcona-blue text-sm font-semibold px-4 py-2 rounded-full mb-6">
                  <span className="text-lg">Nuestra Misión</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6 leading-tight">
                  Servir con{" "}
                  <span className="text-marcona-blue">excelencia</span> a cada
                  ciudadano
                </h2>
                <p className="text-gray-600 text-lg leading-relaxed mb-6">
                  La Municipalidad Distrital de Marcona tiene como Misión: Estar
                  comprometida con la búsqueda de mejores oportunidades, la
                  realización de actividades que optimicen los niveles de
                  calidad de vida de su población, de acuerdo a sus competencias
                  y en armonía con las políticas nacionales y regionales, como
                  canal inmediato de participación vecinal en los asuntos
                  públicos que institucionaliza, con autonomía, los intereses
                  propios de la colectividad, en base al logro del desarrollo
                  local, integral, sostenible y armónico de la población.
                  Representa al vecindario, promueve la adecuada, prestación de
                  los servicios públicos locales, así mismo cumple las leyes y
                  ordenanzas municipales mediante participación y vigilancia
                  ciudadana; con ello se practica un gobierno democrático,
                  participativo y transparente dentro de una cultura de
                  democracia, paz y solidaridad.
                </p>
                <p className="text-gray-500 text-base leading-relaxed">
                  Representa al vecindario, promueve la adecuada, prestación de
                  los servicios públicos locales, así mismo cumple las leyes y
                  ordenanzas municipales mediante participación y vigilancia
                  ciudadana; con ello se practica un gobierno democrático,
                  participativo y transparente dentro de una cultura de
                  democracia, paz y solidaridad.
                </p>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mt-10">
                  {[
                    { value: "+15", label: "Años de servicio" },
                    { value: "24/7", label: "Atención de emergencias" },
                    { value: "100%", label: "Transparencia" },
                  ].map(({ value, label }) => (
                    <div
                      key={label}
                      className="text-center p-4 bg-blue-50 rounded-2xl"
                    >
                      <p className="text-2xl font-extrabold text-marcona-blue">
                        {value}
                      </p>
                      <p className="text-xs text-gray-500 mt-1 leading-snug">
                        {label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Imagen con forma orgánica */}
              <div className="order-1 md:order-2 flex items-center justify-center">
                <div className="relative w-full max-w-md">
                  {/* Decorative blob behind image */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-blue-200 to-blue-400 rounded-[60%_40%_30%_70%/60%_30%_70%_40%] opacity-30 blur-2xl scale-110" />
                  <img
                    src={misionImg}
                    alt="Plaza de Marcona — Misión Municipal"
                    className="relative w-full object-cover shadow-2xl"
                    style={{
                      borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Separador decorativo */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

        {/* ====== SECCIÓN VISIÓN ====== */}
        <section className="py-16 md:py-24 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Imagen con forma orgánica */}
              <div className="flex items-center justify-center">
                <div className="relative w-full max-w-md">
                  <div className="absolute inset-0 bg-gradient-to-tr from-amber-200 to-yellow-400 rounded-[40%_60%_70%_30%/40%_50%_60%_50%] opacity-20 blur-2xl scale-110" />
                  <img
                    src={visionImg}
                    alt="Visión futura de Marcona"
                    className="relative w-full object-cover shadow-2xl"
                    style={{
                      borderRadius: "40% 60% 70% 30% / 40% 50% 60% 50%",
                    }}
                  />
                </div>
              </div>

              {/* Texto */}
              <div>
                <div className="inline-flex items-center gap-2 bg-amber-50 text-amber-700 text-sm font-semibold px-4 py-2 rounded-full mb-6">
                  <span className="text-lg">Nuestra Visión</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6 leading-tight">
                  Un Marcona{" "}
                  <span className="text-amber-600">próspero y moderno</span> al
                  2030
                </h2>
                <p className="text-gray-600 text-lg leading-relaxed mb-6">
                  Al 2030, Marcona será un distrito moderno, próspero y
                  sostenible, reconocido por su desarrollo económico, turístico
                  y social, con ciudadanos comprometidos, servicios públicos de
                  calidad y una gestión municipal transparente que promueve el
                  bienestar y la calidad de vida de toda su población.
                </p>
                <p className="text-gray-500 text-base leading-relaxed">
                  Un municipio moderno y digitalizado, forjado por una sociedad
                  educada, segura y con valores, que inspira el orgullo de sus
                  habitantes e impulsa el desarrollo de toda la región sur del
                  Perú.
                </p>

                {/* Timeline de metas */}
                <div className="mt-10 space-y-3">
                  {[
                    {
                      year: "2025",
                      goal: "Digitalización de todos los trámites municipales",
                    },
                    {
                      year: "2027",
                      goal: "Implementación de infraestructura turística sostenible",
                    },
                    {
                      year: "2030",
                      goal: "Marcona como distrito modelo del sur del Perú",
                    },
                  ].map(({ year, goal }) => (
                    <div key={year} className="flex items-center gap-4">
                      <span className="shrink-0 w-14 text-center font-extrabold text-amber-600 text-sm bg-amber-100 py-1 px-2 rounded-lg">
                        {year}
                      </span>
                      <p className="text-gray-600 text-sm">{goal}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ====== VALORES INSTITUCIONALES ====== */}
        <section className="py-16 md:py-24 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-14">
              <div className="inline-flex items-center gap-2 bg-gray-100 text-gray-600 text-sm font-semibold px-4 py-2 rounded-full mb-4">
                <span className="text-base">⭐</span> Nuestros valores
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">
                Valores{" "}
                <span className="text-marcona-blue">Institucionales</span>
              </h2>
              <p className="mt-3 text-gray-500 max-w-xl mx-auto">
                Los principios fundamentales que guían nuestra conducta y
                definen cómo servimos a la comunidad de Marcona.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {VALORES.map(({ titulo, desc, color, iconBg, emoji }) => (
                <div
                  key={titulo}
                  className={`p-6 rounded-2xl border ${color} hover:shadow-lg transition-shadow duration-300`}
                >
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4 ${iconBg}`}
                  >
                    {emoji}
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">
                    {titulo}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

import { useState } from "react";
import {
  ArrowLeft,
  Map,
  Utensils,
  Waves,
  MapPin,
  Store,
  Camera,
  Compass,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import TopBar from "../../components/public/TopBar";
import Navbar from "../../components/public/Navbar";
import Footer from "../../components/public/Footer";

const PLACES = [
  {
    id: "punta-san-juan",
    title: "Reserva Punta San Juan",
    category: "Reserva Natural",
    desc: "Un paraíso de vida silvestre protegido. Este majestuoso acantilado alberga la colonia más grande de pingüinos de Humboldt en el Perú, además de miles de lobos marinos chuscos y finos, y una inmensa variedad de aves guaneras. Sus miradores ofrecen un espectáculo natural sin precedentes.",
    img: "/images/marcona_reserva.png",
    reverse: false,
    icon: Camera,
    mapsUrl: "https://maps.app.goo.gl/mSicy5r8hde36BqH7",
  },
  {
    id: "san-fernando",
    title: "Reserva Nacional San Fernando",
    category: "Área Protegida",
    desc: "Donde los Andes se encuentran abruptamente con el mar. Un ecosistema único en el mundo donde podrás avistar cóndores andinos sobrevolando acantilados marinos, guanacos pastando cerca de la orilla, y lobos marinos. Sus dunas y playas desérticas crean un paisaje sacado de otro planeta.",
    img: "/images/reserva_san_fernando.png",
    reverse: true,
    icon: Compass,
    mapsUrl: "https://maps.app.goo.gl/WrqcaEKzkU9Ccwmo7",
  },
  {
    id: "trompa-elefante",
    title: "Trompa de Elefante",
    category: "Formación Rocosa",
    desc: "El ícono indiscutible de Marcona. Una espectacular y colosal formación rocosa esculpida por el viento y el embate de las olas del Océano Pacífico durante milenios. Su figura, que asemeja a un paquidermo bebiendo agua del mar, es la postal obligatoria para todo visitante.",
    img: "/images/playa_elefante.png",
    reverse: false,
    icon: MapPin,
    mapsUrl: "https://maps.app.goo.gl/3UM4UikfUzz9DYSz6",
  },
  {
    id: "playa-hermosa",
    title: "Playa Hermosa",
    category: "Playa Turística",
    desc: "Fiel a su nombre, es una de las playas más hermosas del litoral peruano. Destaca por sus aguas mansas, arena fina y dorada, y su forma de medialuna que la protege del fuerte oleaje. Es el destino familiar por excelencia para acampar, nadar y relajarse bajo el sol marconino.",
    img: "/images/playa_hermosa.png",
    reverse: true,
    icon: Waves,
    mapsUrl: "https://maps.app.goo.gl/kYUgatnMF8ASkrdj9",
  },
];

const DISHES = [
  {
    name: "Ceviche Tradicional",
    desc: "Con la pesca del día más fresca, marinada en limón peruano, ají limo y culantro.",
    img: "/images/marcona_gastronomia.png",
  },
  {
    name: "Joyas del Mar",
    desc: "Erizos, lapas, y pulpos frescos servidos al natural o en picantes, directo de nuestras costas.",
    img: "/images/plato_mariscos.png",
  },
];

const TOUR_OPERATORS = [
  { name: "Marcona Tours", desc: "Especialistas en Punta San Juan y Playas" },
  {
    name: "Expediciones San Fernando",
    desc: "Rutas a la Reserva Nacional San Fernando",
  },
  { name: "Aventuras Marcona", desc: "Deportes acuáticos y paseos en bote" },
  { name: "Turismo Sur", desc: "Tours gastronómicos y vivenciales" },
];

export default function DesarrolloEconomico() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <TopBar />
      <Navbar />

      {/* edwind, la imagen gigante de portada con el título del turismo */}
      <div className="relative w-full h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-marcona-blue/90 via-marcona-blue/40 to-transparent z-10" />
        <img
          src="/images/marcona_turismo_hero.png"
          alt="Paisaje costero de Marcona"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto pt-20">
          <span className="text-marcona-gold font-bold tracking-[0.2em] text-sm uppercase mb-4 block drop-shadow-md">
            Un Destino por Descubrir
          </span>
          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 drop-shadow-xl tracking-tight">
            Turismo en Marcona
          </h1>
          <p className="text-xl text-white/90 drop-shadow-md font-light max-w-2xl mx-auto">
            Vive la magia donde el desierto se funde con el Océano Pacífico.
            Playas paradisíacas, reservas naturales vírgenes y gastronomía de
            primer nivel.
          </p>
        </div>
      </div>

      <main className="flex-1 w-full bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
          <div className="mb-16 border-b border-gray-100 pb-8">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm font-semibold text-gray-400 hover:text-marcona-blue transition-colors group"
            >
              <span className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                <ArrowLeft size={16} />
              </span>
              Volver al inicio
            </Link>
          </div>

          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-6 drop-shadow-sm">
              Joyas Naturales de Marcona
            </h2>
            <div className="w-24 h-1 bg-marcona-gold mx-auto mb-6 rounded-full" />
            <p className="text-lg text-gray-500 leading-relaxed">
              Explora una selección de los destinos más impresionantes de
              nuestro distrito. Desde acantilados llenos de vida hasta playas de
              aguas cristalinas ideales para el descanso y la aventura.
            </p>
          </div>

          {/* edwind, aquí las tarjetitas se intercalan, una a la derecha, otra a la izquierda, modo zig-zag */}
          <div className="space-y-24 md:space-y-32 mb-32">
            {PLACES.map((place) => {
              const Icon = place.icon;
              return (
                <div
                  key={place.id}
                  className={`flex flex-col gap-10 md:gap-16 items-center ${place.reverse ? "md:flex-row-reverse" : "md:flex-row"}`}
                >
                  {/* edwind, el lado donde va la foto del lugar */}
                  <div className="w-full md:w-1/2 relative group">
                    <div
                      className={`absolute inset-0 bg-marcona-blue/5 rounded-3xl transform ${place.reverse ? "translate-x-4 translate-y-4" : "-translate-x-4 translate-y-4"} transition-transform group-hover:translate-x-0 group-hover:translate-y-0`}
                    />
                    <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/3]">
                      <img
                        src={place.img}
                        alt={place.title}
                        className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-1000 ease-in-out"
                      />
                    </div>
                  </div>

                  {/* edwind, y aquí va todo el florazo contando lo bonito que es el lugar */}
                  <div className="w-full md:w-1/2 flex flex-col justify-center">
                    <div className="inline-flex items-center gap-2 text-marcona-blue font-bold tracking-widest text-xs uppercase mb-4">
                      <Icon size={16} /> {place.category}
                    </div>
                    <h3 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6 leading-tight">
                      {place.title}
                    </h3>
                    <p className="text-lg text-gray-600 leading-relaxed mb-8">
                      {place.desc}
                    </p>
                    <div>
                      <a
                        href={place.mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block bg-transparent border-2 border-marcona-blue text-marcona-blue font-bold px-8 py-3 rounded-full hover:bg-marcona-blue hover:text-white transition-all duration-300"
                      >
                        Cómo llegar
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* edwind, sección de comida, la pusimos con fondo oscuro para que se vea más elegante */}
        <section className="bg-gray-900 text-white py-24 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-marcona-gold to-transparent opacity-50" />
          <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <Utensils
                className="mx-auto text-marcona-gold mb-6"
                size={48}
                strokeWidth={1}
              />
              <h2 className="text-3xl md:text-5xl font-extrabold mb-6">
                Gastronomía del Puerto
              </h2>
              <p className="text-lg text-gray-400 leading-relaxed">
                Al ser un pueblo netamente pesquero, la oferta culinaria de
                Marcona es un privilegio. Los productos del mar no pasan por
                intermediarios; van directamente de la red y las peñas a tu
                mesa.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
              {DISHES.map((dish, i) => (
                <div
                  key={i}
                  className="group relative overflow-hidden rounded-3xl bg-gray-800 isolate"
                >
                  <div className="absolute inset-0">
                    <img
                      src={dish.img}
                      alt={dish.name}
                      className="w-full h-full object-cover opacity-60 group-hover:opacity-40 group-hover:scale-110 transition-all duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent" />
                  </div>
                  <div className="relative z-10 p-8 h-80 flex flex-col justify-end">
                    <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-marcona-gold transition-colors">
                      {dish.name}
                    </h3>
                    <p className="text-gray-300 opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-100">
                      {dish.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* edwind, el llamado a la acción para que contraten a los guías de turismo */}
        <section className="py-24 bg-marcona-blue relative">
          <div className="absolute top-0 right-0 w-96 h-96 bg-marcona-gold/10 rounded-full blur-3xl -mr-20 -mt-20" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -ml-20 -mb-20" />

          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10">
            <Store
              className="mx-auto text-marcona-gold mb-6"
              size={48}
              strokeWidth={1.5}
            />
            <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-8 leading-tight">
              ¿Listo para planear tu viaje a Marcona?
            </h2>
            <p className="text-xl text-blue-100 mb-12 font-light">
              Contacta a nuestros operadores turísticos formales y experimenta
              unas vacaciones seguras y respaldadas por la Municipalidad.
            </p>
            <button
              onClick={() => setShowModal(true)}
              className="bg-marcona-gold text-marcona-blue text-lg font-bold px-10 py-4 rounded-full hover:bg-yellow-400 hover:scale-105 transition-all shadow-[0_0_30px_rgba(255,215,0,0.3)]"
            >
              Ver Directorio de Operadores
            </button>
          </div>
        </section>
      </main>

      <Footer />

      {/* edwind, la ventana emergente con la lista de las agencias de viaje */}
      {showModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl transform transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-marcona-blue p-6 sm:p-8 relative">
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors"
                aria-label="Cerrar directorio"
              >
                <X size={24} />
              </button>
              <h3 className="text-2xl font-bold text-white mb-2">
                Directorio de Turismo
              </h3>
              <p className="text-blue-200 text-sm">
                Agencias y operadores formales autorizados por la Municipalidad.
              </p>
            </div>
            <div className="p-6 sm:p-8 max-h-[60vh] overflow-y-auto">
              {TOUR_OPERATORS.map((op, i) => (
                <div
                  key={i}
                  className="flex items-start gap-4 p-4 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors rounded-xl"
                >
                  <div className="w-12 h-12 bg-orange-50 text-marcona-gold rounded-full flex items-center justify-center shrink-0">
                    <Compass size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg">
                      {op.name}
                    </h4>
                    <p className="text-gray-600 mt-1">{op.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

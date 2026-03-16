import TopBar from "../../components/public/TopBar";
import Navbar from "../../components/public/Navbar";
import Hero from "../../components/public/Hero";
import ServiceCards from "../../components/public/ServiceCards";
import NewsSection from "../../components/public/NewsSection";
import Footer from "../../components/public/Footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <TopBar />
      <Navbar />
      <main className="flex-1">
        <Hero />
        <ServiceCards />
        <NewsSection />
        {/* edwind, aquí al final les decimos a dónde pueden llamar si tienen dudas */}
        <section className="py-14 bg-marcona-light">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-marcona-blue mb-4">
              ¿Necesitas ayuda con algún trámite?
            </h2>
            <p className="text-gray-600 mb-8 text-sm sm:text-base">
              Nuestro equipo de atención al ciudadano está disponible de lunes a
              viernes de 8:00 am a 5:00 pm. También puedes escribirnos y te
              responderemos a la brevedad.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://www.gob.pe/institucion/munimarcona/contacto-y-numeros-de-emergencias"
                className="btn-primary justify-center"
              >
                Contáctanos
              </a>
              <a
                href="https://facilita.gob.pe/t/5628"
                className="border-2 border-marcona-blue text-marcona-blue font-semibold px-5 py-2.5 rounded-lg
                           hover:bg-marcona-blue hover:text-white transition-colors duration-200 text-sm"
              >
                Mesa de Partes Virtual
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

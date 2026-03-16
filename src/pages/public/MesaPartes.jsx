import { Link } from "react-router-dom";
import { FileText, Search, ArrowLeft } from "lucide-react";
import TopBar from "../../components/public/TopBar";
import Navbar from "../../components/public/Navbar";
import Footer from "../../components/public/Footer";

export default function MesaPartes() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <TopBar />
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-12">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-marcona-blue mb-8 transition-colors"
        >
          <ArrowLeft size={16} />
          Volver al Inicio
        </Link>

        <div className="text-center max-w-2xl mx-auto mb-12">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
            Mesa de Partes Virtual
          </h1>
          <p className="text-gray-500 text-sm sm:text-base">
            Bienvenido a la Mesa de Partes Virtual de la Municipalidad Distrital
            de Marcona. Por favor, seleccione la operación que desea realizar.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* edwind, primera tarjeta: para iniciar un trámite desde cero */}
          <Link
            to="https://facilita.gob.pe/t/5628"
            className="group bg-white rounded-3xl p-8 sm:p-10 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col items-center text-center hover:-translate-y-1"
          >
            <div className="w-20 h-20 bg-blue-50 text-marcona-blue rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <FileText size={40} strokeWidth={1.5} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-marcona-blue transition-colors">
              Trámite FUT
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed">
              Inicie un nuevo trámite mediante el Formulario Único de Trámite
              (FUT). Adjunte sus documentos de manera rápida y segura.
            </p>
          </Link>

          {/* edwind, segunda tarjeta: para ver por dónde anda el papeleo */}
          <Link
            to="https://facilita.gob.pe/seguimiento"
            className="group bg-white rounded-3xl p-8 sm:p-10 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col items-center text-center hover:-translate-y-1"
          >
            <div className="w-20 h-20 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <Search size={40} strokeWidth={1.5} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-green-600 transition-colors">
              Seguimiento FUT
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed">
              Consulte el estado actual de su expediente y revise los
              movimientos y derivaciones de su trámite ingresado.
            </p>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}

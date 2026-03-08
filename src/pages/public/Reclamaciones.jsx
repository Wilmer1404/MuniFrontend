import { useState } from "react";
import { Send, CheckCircle, AlertCircle, MessageSquare } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../services/api";

const FORM_INITIAL = {
  tipo: "RECLAMO",
  nombres: "",
  apellidos: "",
  dni: "",
  correo: "",
  telefono: "",
  direccion: "",
  detalle: "",
};

export default function Reclamaciones() {
  const [formData, setFormData] = useState(FORM_INITIAL);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await api.post("/solicitudes", formData);
      setSuccess(true);
      setFormData(FORM_INITIAL);
      toast.success("Solicitud registrada correctamente.");
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        "Ocurrió un error al enviar la solicitud. Inténtalo de nuevo.";
      setError(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50/50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-marcona-blue/10 mb-4">
            <MessageSquare size={28} className="text-marcona-blue" />
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
            Libro de Reclamaciones y Sugerencias
          </h1>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto leading-relaxed">
            Tu opinión es muy importante para nosotros. Utiliza este formulario
            para presentar tus reclamos o dejarnos sugerencias para mejorar
            nuestros servicios.
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          {success ? (
            <div className="p-12 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-6 mx-auto">
                <CheckCircle size={40} className="text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                ¡Solicitud Recibida!
              </h2>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Hemos registrado tu{" "}
                {formData.tipo === "RECLAMO" ? "reclamo" : "sugerencia"}{" "}
                correctamente. Un representante de la municipalidad se pondrá en
                contacto contigo pronto.
              </p>
              <button
                type="button"
                onClick={() => setSuccess(false)}
                className="btn-primary"
              >
                Enviar otra solicitud
              </button>
            </div>
          ) : (
            <div className="p-6 md:p-10">
              {error && (
                <div className="mb-6 bg-red-50 border border-red-100 text-red-700 rounded-xl px-5 py-4 flex items-start gap-3">
                  <AlertCircle size={20} className="shrink-0 mt-0.5" />
                  <p className="text-sm font-medium">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Tipo */}
                <div>
                  <label
                    htmlFor="tipo"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Tipo de Solicitud <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <label
                      className={`
                      flex items-center justify-center gap-2 p-4 border rounded-xl cursor-pointer transition-all
                      ${formData.tipo === "RECLAMO" ? "border-marcona-blue bg-blue-50/50 text-marcona-blue ring-1 ring-marcona-blue" : "border-gray-200 text-gray-600 hover:border-marcona-blue/30"}
                    `}
                    >
                      <input
                        type="radio"
                        name="tipo"
                        value="RECLAMO"
                        checked={formData.tipo === "RECLAMO"}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <span className="font-semibold text-sm">Reclamo</span>
                    </label>
                    <label
                      className={`
                      flex items-center justify-center gap-2 p-4 border rounded-xl cursor-pointer transition-all
                      ${formData.tipo === "SUGERENCIA" ? "border-green-600 bg-green-50/50 text-green-700 ring-1 ring-green-600" : "border-gray-200 text-gray-600 hover:border-green-600/30"}
                    `}
                    >
                      <input
                        type="radio"
                        name="tipo"
                        value="SUGERENCIA"
                        checked={formData.tipo === "SUGERENCIA"}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <span className="font-semibold text-sm">Sugerencia</span>
                    </label>
                  </div>
                </div>

                <hr className="border-gray-100 my-8" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Nombres */}
                  <div>
                    <label
                      htmlFor="nombres"
                      className="block text-sm font-medium text-gray-700 mb-1.5"
                    >
                      Nombres <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="nombres"
                      name="nombres"
                      value={formData.nombres}
                      onChange={handleChange}
                      required
                      placeholder="Tus nombres"
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm
                                 focus:outline-none focus:ring-2 focus:ring-marcona-blue/30 focus:border-marcona-blue transition"
                    />
                  </div>

                  {/* Apellidos */}
                  <div>
                    <label
                      htmlFor="apellidos"
                      className="block text-sm font-medium text-gray-700 mb-1.5"
                    >
                      Apellidos <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="apellidos"
                      name="apellidos"
                      value={formData.apellidos}
                      onChange={handleChange}
                      required
                      placeholder="Tus apellidos"
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm
                                 focus:outline-none focus:ring-2 focus:ring-marcona-blue/30 focus:border-marcona-blue transition"
                    />
                  </div>

                  {/* DNI */}
                  <div>
                    <label
                      htmlFor="dni"
                      className="block text-sm font-medium text-gray-700 mb-1.5"
                    >
                      DNI / CE <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="dni"
                      name="dni"
                      value={formData.dni}
                      onChange={handleChange}
                      required
                      maxLength={15}
                      placeholder="Documento de identidad"
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm
                                 focus:outline-none focus:ring-2 focus:ring-marcona-blue/30 focus:border-marcona-blue transition"
                    />
                  </div>

                  {/* Teléfono */}
                  <div>
                    <label
                      htmlFor="telefono"
                      className="block text-sm font-medium text-gray-700 mb-1.5"
                    >
                      Teléfono <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="telefono"
                      name="telefono"
                      type="tel"
                      value={formData.telefono}
                      onChange={handleChange}
                      required
                      placeholder="Número de contacto"
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm
                                 focus:outline-none focus:ring-2 focus:ring-marcona-blue/30 focus:border-marcona-blue transition"
                    />
                  </div>

                  {/* Correo */}
                  <div className="md:col-span-2">
                    <label
                      htmlFor="correo"
                      className="block text-sm font-medium text-gray-700 mb-1.5"
                    >
                      Correo Electrónico <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="correo"
                      name="correo"
                      type="email"
                      value={formData.correo}
                      onChange={handleChange}
                      required
                      placeholder="ejemplo@correo.com"
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm
                                 focus:outline-none focus:ring-2 focus:ring-marcona-blue/30 focus:border-marcona-blue transition"
                    />
                  </div>

                  {/* Dirección */}
                  <div className="md:col-span-2">
                    <label
                      htmlFor="direccion"
                      className="block text-sm font-medium text-gray-700 mb-1.5"
                    >
                      Dirección <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="direccion"
                      name="direccion"
                      value={formData.direccion}
                      onChange={handleChange}
                      required
                      placeholder="Tu dirección residencial"
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm
                                 focus:outline-none focus:ring-2 focus:ring-marcona-blue/30 focus:border-marcona-blue transition"
                    />
                  </div>
                </div>

                <hr className="border-gray-100 my-8" />

                {/* Detalle */}
                <div>
                  <label
                    htmlFor="detalle"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Detalle del{" "}
                    {formData.tipo === "RECLAMO" ? "Reclamo" : "Sugerencia"}{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="detalle"
                    name="detalle"
                    value={formData.detalle}
                    onChange={handleChange}
                    required
                    rows={5}
                    placeholder="Describe detalladamente tu solicitud aquí..."
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm resize-none
                               focus:outline-none focus:ring-2 focus:ring-marcona-blue/30 focus:border-marcona-blue transition"
                  />
                  <p className="text-xs text-gray-400 mt-2">
                    Sé lo más específico posible para poder atenderte de manera
                    eficiente.
                  </p>
                </div>

                {/* Submit button */}
                <div className="pt-6">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full sm:w-auto px-8 py-3.5 bg-marcona-blue text-white rounded-xl font-bold font-montserrat 
                               hover:bg-blue-800 transition-all disabled:opacity-70 disabled:cursor-not-allowed
                               shadow-lg shadow-marcona-blue/30 flex items-center justify-center gap-2 text-sm"
                  >
                    {submitting ? (
                      <span className="animate-pulse">Enviando...</span>
                    ) : (
                      <>
                        <Send size={18} />
                        Enviar{" "}
                        {formData.tipo === "RECLAMO" ? "Reclamo" : "Sugerencia"}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

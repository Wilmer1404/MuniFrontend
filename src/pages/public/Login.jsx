import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { LogIn, Eye, EyeOff, Lock, User } from "lucide-react";

export default function Login() {
  const { login, loading, error } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(username, password);
    if (result.success) {
      navigate("/admin");
    }
  };

  return (
    <div className="min-h-screen bg-marcona-light flex flex-col">
      {/* edwind, la barra de arriba bien simplecita para que no distraiga */}
      <header className="bg-marcona-blue py-4 px-6 flex items-center gap-3 shadow">
        <div className="w-9 h-9 bg-white rounded-full flex items-center justify-center">
          <span className="text-marcona-blue font-black">M</span>
        </div>
        <div>
          <p className="text-white/70 text-[10px] uppercase tracking-widest">
            Municipalidad Distrital de
          </p>
          <p className="text-white font-black text-sm uppercase tracking-tight">
            Marcona
          </p>
        </div>
        <Link
          to="/"
          className="ml-auto text-white/60 hover:text-white text-xs transition-colors"
        >
          ← Volver al inicio
        </Link>
      </header>

      {/* edwind, y aquí va el formulario flotando en el medio de la pantalla */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-8">
          {/* edwind, un iconito simpático del usuario */}
          <div className="w-14 h-14 bg-marcona-blue rounded-2xl flex items-center justify-center mx-auto mb-6">
            <LogIn size={26} strokeWidth={1.5} className="text-white" />
          </div>
          <h1 className="text-xl font-extrabold text-gray-900 text-center mb-1">
            Portal del Ciudadano
          </h1>
          <p className="text-gray-400 text-xs text-center mb-6">
            Ingresa con tus credenciales municipales
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* edwind, cajoncito para que pongan su nombre de usuario */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                Usuario
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <User size={16} strokeWidth={1.5} />
                </span>
                <input
                  id="login-username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  placeholder="Tu nombre de usuario"
                  className="w-full border border-gray-200 rounded-lg pl-9 pr-4 py-2.5 text-sm
                             focus:outline-none focus:ring-2 focus:ring-marcona-blue/30 focus:border-marcona-blue transition"
                />
              </div>
            </div>

            {/* edwind, cajoncito de la contraseña, con ojito para verla y todo */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                Contraseña
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <Lock size={16} strokeWidth={1.5} />
                </span>
                <input
                  id="login-password"
                  type={showPwd ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full border border-gray-200 rounded-lg pl-9 pr-10 py-2.5 text-sm
                             focus:outline-none focus:ring-2 focus:ring-marcona-blue/30 focus:border-marcona-blue transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  tabIndex={-1}
                >
                  {showPwd ? (
                    <EyeOff size={16} strokeWidth={1.5} />
                  ) : (
                    <Eye size={16} strokeWidth={1.5} />
                  )}
                </button>
              </div>
            </div>

            {/* edwind, si se equivocaron con la clave, les avisamos amablemente */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2.5 text-red-600 text-xs font-medium">
                {error}
              </div>
            )}

            {/* edwind, el botón final para entrar al sistema */}
            <button
              id="login-submit"
              type="submit"
              disabled={loading}
              className="w-full bg-marcona-blue hover:bg-blue-800 disabled:bg-blue-300 text-white
                         font-semibold py-2.5 rounded-lg transition-colors text-sm flex items-center justify-center gap-2"
            >
              {loading ? (
                <svg
                  className="animate-spin h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  />
                </svg>
              ) : (
                <LogIn size={16} strokeWidth={1.5} />
              )}
              {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
            </button>
          </form>

          <p className="text-center text-gray-400 text-xs mt-6">
            ¿Problemas para ingresar?{" "}
            <a
              href="/contacto"
              className="text-marcona-blue font-medium hover:underline"
            >
              Contactar soporte
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Newspaper, FileText, Users, TrendingUp, ArrowUpRight, AlertCircle } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

// formatea una fecha ISO relativa (ej: "Hace 2 horas")
function timeAgo(isoString) {
  if (!isoString) return '';
  const diff = Date.now() - new Date(isoString).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `Hace ${mins} min`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `Hace ${hrs} hora${hrs > 1 ? 's' : ''}`;
  const days = Math.floor(hrs / 24);
  return `Hace ${days} día${days > 1 ? 's' : ''}`;
}

// skeleton de filas de actividad
function ActivitySkeleton() {
  const ids = ['sk-a', 'sk-b', 'sk-c', 'sk-d'];
  return (
    <div className="space-y-4 animate-pulse">
      {ids.map((key) => (
        <div key={key} className="flex items-center gap-4 py-3 border-b border-gray-50">
          <div className="w-2 h-2 rounded-full bg-gray-200 flex-shrink-0" />
          <div className="flex-1 space-y-1">
            <div className="h-3 bg-gray-200 rounded w-3/4" />
            <div className="h-2.5 bg-gray-200 rounded w-1/3" />
          </div>
          <div className="h-2.5 bg-gray-200 rounded w-16" />
        </div>
      ))}
    </div>
  );
}

// tarjeta de estadística individual
function StatCard({ id, label, value, icon, color, sub, loading }) {
  // renombramos en el cuerpo para que ESLint lo detecte como usado en JSX
  const Icon = icon;
  return (
    <div id={id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className={`${color} w-10 h-10 rounded-xl flex items-center justify-center`}>
          <Icon size={18} strokeWidth={1.5} className="text-white" />
        </div>
        <ArrowUpRight size={16} strokeWidth={1.5} className="text-gray-300" />
      </div>
      {loading ? (
        <div className="space-y-2 animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-16" />
          <div className="h-3 bg-gray-200 rounded w-28" />
        </div>
      ) : (
        <>
          <p className="text-3xl font-extrabold text-gray-900">{value}</p>
          <p className="text-gray-500 text-xs font-medium mt-0.5">{label}</p>
          {sub && <p className="text-green-600 text-[10px] font-semibold mt-2">{sub}</p>}
        </>
      )}
    </div>
  );
}

StatCard.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  icon: PropTypes.elementType.isRequired,
  color: PropTypes.string.isRequired,
  sub: PropTypes.string,
  loading: PropTypes.bool,
};

StatCard.defaultProps = {
  value: '—',
  sub: null,
  loading: false,
};

// listado de actividad reciente (noticias)
function ActivityList({ recientes }) {
  if (recientes.length === 0) {
    return (
      <p className="text-sm text-gray-400 py-4 text-center">
        No hay noticias publicadas aún.
      </p>
    );
  }

  return (
    <div className="space-y-0">
      {recientes.map((noticia) => (
        <div
          key={noticia.id}
          className="flex items-center gap-4 py-3 border-b border-gray-50 last:border-0"
        >
          <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
            noticia.destacada ? 'bg-marcona-gold' : 'bg-blue-400'
          }`} />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-800 truncate">{noticia.titulo}</p>
            <p className="text-xs text-gray-400">
              <span className="font-semibold">{noticia.autorUsername}</span>
              {noticia.categoria && (
                <> · <span className="text-marcona-blue">{noticia.categoria}</span></>
              )}
            </p>
          </div>
          <span className="text-xs text-gray-400 shrink-0">
            {timeAgo(noticia.fechaPublicacion)}
          </span>
        </div>
      ))}
    </div>
  );
}

ActivityList.propTypes = {
  recientes: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      titulo: PropTypes.string,
      autorUsername: PropTypes.string,
      categoria: PropTypes.string,
      fechaPublicacion: PropTypes.string,
      destacada: PropTypes.bool,
    })
  ).isRequired,
};

export default function Dashboard() {
  const { user } = useAuth();

  const [stats, setStats] = useState({ noticias: null, documentos: null });
  const [recientes, setRecientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchDashboard() {
      try {
        // las 3 llamadas en paralelo para mayor velocidad
        const [noticiaRes, docRes, recentesRes] = await Promise.all([
          api.get('/noticias', { params: { size: 1 } }),
          api.get('/documentos', { params: { size: 1 } }),
          api.get('/noticias/recientes'),
        ]);

        if (cancelled) return;

        setStats({
          noticias: noticiaRes.data?.totalElements ?? '—',
          documentos: docRes.data?.totalElements ?? '—',
        });
        setRecientes(recentesRes.data?.slice(0, 5) ?? []);
      } catch (err) {
        if (!cancelled) {
          setError('No se pudo cargar la información del panel.');
          console.error('Error cargando dashboard:', err);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchDashboard();
    return () => { cancelled = true; };
  }, []);

  const statCards = [
    {
      id: 'stat-noticias',
      label: 'Noticias publicadas',
      value: stats.noticias,
      icon: Newspaper,
      color: 'bg-blue-500',
      sub: 'Total en el sistema',
    },
    {
      id: 'stat-documentos',
      label: 'Documentos activos',
      value: stats.documentos,
      icon: FileText,
      color: 'bg-green-500',
      sub: 'Total en el sistema',
    },
    {
      id: 'stat-tramites',
      label: 'Trámites en proceso',
      value: '—',
      icon: TrendingUp,
      color: 'bg-yellow-500',
      sub: 'Próximamente',
    },
    {
      id: 'stat-usuario',
      label: 'Sesión activa como',
      value: user?.username ?? '—',
      icon: Users,
      color: 'bg-purple-500',
      sub: user?.roles?.join(', ') ?? '',
    },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Resumen general del portal municipal</p>
      </div>

      {/* Error global */}
      {error && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-100 text-red-700 rounded-xl px-5 py-4 mb-6">
          <AlertCircle size={16} className="flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {statCards.map((card) => (
          <StatCard key={card.id} {...card} loading={loading} />
        ))}
      </div>

      {/* Actividad reciente */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="font-bold text-gray-800 text-sm mb-4">Últimas Noticias Publicadas</h2>
        {loading ? <ActivitySkeleton /> : <ActivityList recientes={recientes} />}
      </div>
    </div>
  );
}

import { Newspaper, FileText, Users, TrendingUp, ArrowUpRight } from 'lucide-react';

const STATS = [
  { id: 'stat-noticias', label: 'Noticias publicadas', value: '24', icon: Newspaper, color: 'bg-blue-500', trend: '+3 este mes' },
  { id: 'stat-documentos', label: 'Documentos activos', value: '158', icon: FileText, color: 'bg-green-500', trend: '+12 esta semana' },
  { id: 'stat-tramites', label: 'Trámites en proceso', value: '43', icon: TrendingUp, color: 'bg-yellow-500', trend: '5 pendientes' },
  { id: 'stat-usuarios', label: 'Usuarios registrados', value: '7', icon: Users, color: 'bg-purple-500', trend: 'Activos' },
];

const RECENT_ACTIVITY = [
  { action: 'Nueva noticia publicada', user: 'admin', time: 'Hace 2 horas', type: 'news' },
  { action: 'Documento subido: Ordenanza N°045', user: 'editor1', time: 'Hace 5 horas', type: 'doc' },
  { action: 'Trámite completado #T-0892', user: 'sistema', time: 'Hace 1 día', type: 'tramite' },
  { action: 'Comunicado oficial publicado', user: 'admin', time: 'Hace 2 días', type: 'news' },
];

export default function Dashboard() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Resumen general del portal municipal</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {STATS.map(({ id, label, value, icon: Icon, color, trend }) => (
          <div key={id} id={id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`${color} w-10 h-10 rounded-xl flex items-center justify-center`}>
                <Icon size={18} strokeWidth={1.5} className="text-white" />
              </div>
              <ArrowUpRight size={16} strokeWidth={1.5} className="text-gray-300" />
            </div>
            <p className="text-3xl font-extrabold text-gray-900">{value}</p>
            <p className="text-gray-500 text-xs font-medium mt-0.5">{label}</p>
            <p className="text-green-600 text-[10px] font-semibold mt-2">{trend}</p>
          </div>
        ))}
      </div>

      {/* Actividad reciente */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="font-bold text-gray-800 text-sm mb-4">Actividad Reciente</h2>
        <div className="space-y-3">
          {RECENT_ACTIVITY.map(({ action, user, time, type }, i) => (
            <div key={i} className="flex items-center gap-4 py-3 border-b border-gray-50 last:border-0">
              <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                type === 'news' ? 'bg-blue-400' : type === 'doc' ? 'bg-green-400' : 'bg-yellow-400'
              }`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">{action}</p>
                <p className="text-xs text-gray-400">Por: <span className="font-semibold">{user}</span></p>
              </div>
              <span className="text-xs text-gray-400 shrink-0">{time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

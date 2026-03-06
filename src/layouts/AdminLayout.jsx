import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, Newspaper, FileText,
  LogOut, Menu, X, ChevronRight,
} from 'lucide-react';
import { useState } from 'react';

const NAV_ITEMS = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/noticias', label: 'Gestionar Noticias', icon: Newspaper, end: false },
  { to: '/admin/documentos', label: 'Gestionar Documentos', icon: FileText, end: false },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-marcona-blue rounded-xl flex items-center justify-center shadow">
            <span className="text-white font-black">M</span>
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-tight">Panel Admin</p>
            <p className="text-white/40 text-[10px]">Municipalidad Marcona</p>
          </div>
        </div>
      </div>

      {/* User Badge */}
      <div className="px-5 py-4 border-b border-white/10">
        <div className="bg-white/5 rounded-xl p-3">
          <p className="text-white/40 text-[10px] uppercase tracking-widest mb-0.5">Sesión activa</p>
          <p className="text-white font-semibold text-sm truncate">{user?.username || 'Administrador'}</p>
          <p className="text-marcona-gold text-[10px] font-medium">{user?.roles?.[0] || 'ROLE_ADMIN'}</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                isActive
                  ? 'bg-marcona-blue text-white shadow-lg'
                  : 'text-white/60 hover:text-white hover:bg-white/10'
              }`
            }
          >
            <Icon size={18} strokeWidth={1.5} />
            <span className="flex-1">{label}</span>
            <ChevronRight size={14} strokeWidth={1.5} className="opacity-0 group-hover:opacity-100 transition-opacity" />
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-white/10">
        <button
          id="admin-logout"
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                     text-white/60 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
        >
          <LogOut size={18} strokeWidth={1.5} />
          Cerrar Sesión
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex flex-col w-60 bg-[#1E293B] fixed inset-y-0 left-0 z-30">
        <SidebarContent />
      </aside>

      {/* Sidebar Mobile Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-64 bg-[#1E293B] flex flex-col z-50">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 lg:ml-60 flex flex-col">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-6 py-3.5 flex items-center justify-between sticky top-0 z-20 shadow-sm">
          <button
            className="lg:hidden p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={20} strokeWidth={1.5} />
          </button>
          <div className="hidden lg:block">
            <h2 className="text-sm font-semibold text-gray-500">Panel de Administración</h2>
          </div>
          <div className="flex items-center gap-3 ml-auto">
            <div className="w-8 h-8 bg-marcona-blue rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">
                {(user?.username?.[0] || 'A').toUpperCase()}
              </span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

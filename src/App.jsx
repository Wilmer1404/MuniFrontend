import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';

// Páginas públicas
import Home from './pages/public/Home';
import Login from './pages/public/Login';

// Layout admin
import AdminLayout from './layouts/AdminLayout';

// Páginas admin
import Dashboard from './pages/admin/Dashboard';
import ManageNews from './pages/admin/ManageNews';
import ManageDocuments from './pages/admin/ManageDocuments';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />

          {/* Rutas protegidas del admin */}
          <Route element={<ProtectedRoute requiredRoles={['ROLE_ADMIN', 'ROLE_EDITOR']} />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="noticias" element={<ManageNews />} />
              <Route path="documentos" element={<ManageDocuments />} />
            </Route>
          </Route>

          {/* Rutas pendientes - redirige a inicio */}
          <Route path="/municipalidad" element={<Home />} />
          <Route path="/servicios" element={<Home />} />
          <Route path="/transparencia" element={<Home />} />
          <Route path="/noticias" element={<Home />} />
          <Route path="/contacto" element={<Home />} />

          {/* 404 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
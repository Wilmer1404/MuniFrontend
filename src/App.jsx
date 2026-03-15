import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";

// Páginas públicas
import Home from "./pages/public/Home";
import Login from "./pages/public/Login";
import MisionVision from "./pages/public/MisionVision";
import OrganigramaPage from "./pages/public/OrganigramaPage";
import ConsejoMunicipal from "./pages/public/ConsejoMunicipal";
import NoticiaDetalle from "./pages/public/NoticiaDetalle";

// Layout admin
import AdminLayout from "./layouts/AdminLayout";

// Páginas admin
import Dashboard from "./pages/admin/Dashboard";
import ManageNews from "./pages/admin/ManageNews";
import ManageDocuments from "./pages/admin/ManageDocuments";
import ManageMenu from "./pages/admin/ManageMenu";

import ManageOrganigrama from "./pages/admin/ManageOrganigrama";
import ManageConsejo from "./pages/admin/ManageConsejo";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />

          {/* Sección Municipalidad — rutas estáticas */}
          <Route
            path="/municipalidad/mision-vision"
            element={<MisionVision />}
          />
          <Route
            path="/municipalidad/organigrama"
            element={<OrganigramaPage />}
          />
          <Route path="/municipalidad/consejo" element={<ConsejoMunicipal />} />

          {/* Rutas protegidas del admin */}
          <Route
            element={
              <ProtectedRoute requiredRoles={["ROLE_ADMIN", "ROLE_EDITOR"]} />
            }
          >
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="noticias" element={<ManageNews />} />
              <Route path="documentos" element={<ManageDocuments />} />
              <Route path="menu" element={<ManageMenu />} />

              <Route path="organigrama" element={<ManageOrganigrama />} />
              <Route path="consejo" element={<ManageConsejo />} />
            </Route>
          </Route>

          {/* Rutas públicas específicas y dinámicas */}
          <Route path="/municipalidad" element={<Home />} />
          <Route path="/servicios" element={<Home />} />
          <Route path="/transparencia" element={<Home />} />
          <Route path="/noticias" element={<Home />} />
          <Route path="/noticias/:id" element={<NoticiaDetalle />} />

          <Route path="/contacto" element={<Home />} />

          {/* 404 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

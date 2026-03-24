import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";
import ScrollToTop from "./components/ScrollToTop";

// edwind, aquí cargamos las páginas que cualquier vecino puede ver
import Home from "./pages/public/Home";
import Login from "./pages/public/Login";
import MisionVision from "./pages/public/MisionVision";
import OrganigramaPage from "./pages/public/OrganigramaPage";
import ConsejoMunicipal from "./pages/public/ConsejoMunicipal";
import NoticiaDetalle from "./pages/public/NoticiaDetalle";
import MesaPartes from "./pages/public/MesaPartes";
import DesarrolloEconomico from "./pages/public/DesarrolloEconomico";

// edwind, el esqueleto principal del panel de administración
import AdminLayout from "./layouts/AdminLayout";

// edwind, y aquí todas las pantallas internas de gestión
import Dashboard from "./pages/admin/Dashboard";
import ManageNews from "./pages/admin/ManageNews";
import ManageDocuments from "./pages/admin/ManageDocuments";
import ManageMenu from "./pages/admin/ManageMenu";
import ManageOrganigrama from "./pages/admin/ManageOrganigrama";
import ManageConsejo from "./pages/admin/ManageConsejo";
import ManageUsers from "./pages/admin/ManageUsers";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          {/* edwind, las rutas libres para todo el mundo */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />

          {/* edwind, la sección donde contamos quiénes somos y cómo nos organizamos */}
          <Route
            path="/municipalidad/mision-vision"
            element={<MisionVision />}
          />
          <Route
            path="/municipalidad/organigrama"
            element={<OrganigramaPage />}
          />
          <Route path="/municipalidad/consejo" element={<ConsejoMunicipal />} />

          {/* edwind, estas rutas tienen traba, solo entra la gente autorizada (admin y editor) */}
          <Route
            element={
              <ProtectedRoute requiredRoles={["ROLE_ADMIN", "ROLE_EDITOR"]} />
            }
          >
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="noticias" element={<ManageNews />} />
            </Route>
          </Route>

          {/* edwind, y estas son súper secretas, solo el mero mero (admin) puede entrar */}
          <Route element={<ProtectedRoute requiredRoles={["ROLE_ADMIN"]} />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route path="documentos" element={<ManageDocuments />} />
              <Route path="menu" element={<ManageMenu />} />
              <Route path="organigrama" element={<ManageOrganigrama />} />
              <Route path="consejo" element={<ManageConsejo />} />
              <Route path="usuarios" element={<ManageUsers />} />
            </Route>
          </Route>

          {/* edwind, más rutas públicas, algunas reciben parámetros como el id de la noticia */}
          <Route path="/municipalidad" element={<Home />} />
          <Route path="/servicios" element={<Home />} />
          <Route path="/transparencia" element={<Home />} />
          <Route path="/noticias" element={<Home />} />
          <Route path="/noticias/:id" element={<NoticiaDetalle />} />
          <Route path="/mesa-partes" element={<MesaPartes />} />
          <Route
            path="/desarrollo-economico"
            element={<DesarrolloEconomico />}
          />

          <Route path="/contacto" element={<Home />} />

          {/* edwind, si ponen cualquier cosa rara en la url, los mandamos a la casa (inicio) */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

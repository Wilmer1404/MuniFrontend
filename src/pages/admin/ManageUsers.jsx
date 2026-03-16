import { useState, useEffect } from "react";
import { UserService } from "../../services/user.service";
import {
  Users,
  Search,
  Plus,
  Pencil,
  Trash2,
  AlertTriangle,
  Loader2,
  X,
  Shield,
  User as UserIcon,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";

export default function ManageUsers() {
  const { user: currentUser } = useAuth();
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // edwind, aquí guardamos los estados de las ventanas emergentes
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // edwind, y aquí los datos del formulario
  const [formData, setFormData] = useState({
    nombre: "",
    apellidos: "",
    username: "",
    email: "",
    password: "",
    roles: ["EDITOR"], // edwind, por defecto les damos el rol de editor
  });

  useEffect(() => {
    fetchUsuarios(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const fetchUsuarios = async (pageNumber) => {
    try {
      setLoading(true);
      const res = await UserService.getUsuarios(pageNumber, 10);
      setUsuarios(res.usuarios || []);
      setTotalPages(res.totalPages || 1);
    } catch (error) {
      toast.error("Error al cargar la lista de usuarios");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (user = null) => {
    if (user) {
      setSelectedUser(user);
      setFormData({
        nombre: user.nombre,
        apellidos: user.apellidos,
        username: user.username,
        email: user.email,
        password: "", // edwind, nunca le enviamos la contraseña actual al formulario por seguridad
        roles: user.roles.map((r) => r.replace("ROLE_", "")),
      });
    } else {
      setSelectedUser(null);
      setFormData({
        nombre: "",
        apellidos: "",
        username: "",
        email: "",
        password: "",
        roles: ["EDITOR"],
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (e) => {
    const roleValue = e.target.value;
    setFormData((prev) => ({ ...prev, roles: [roleValue] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // edwind, hacemos un chequeo rapidito de que haya llenado lo importante
      if (
        !formData.nombre ||
        !formData.apellidos ||
        !formData.username ||
        !formData.email
      ) {
        toast.error("Por favor completa los campos principales.");
        return;
      }

      if (!selectedUser && !formData.password) {
        toast.error("Debes asignar una contraseña al nuevo usuario.");
        return;
      }

      const payload = {
        ...formData,
        roles: formData.roles.map((r) => r.toLowerCase()),
      };

      if (selectedUser) {
        // edwind, si ya existía el usuario, lo actualizamos
        if (!payload.password) delete payload.password; // edwind, si no puso contraseña nueva, la borramos del envío para no malograr la vieja
        await UserService.updateUsuario(selectedUser.id, payload);
        toast.success("Usuario actualizado correctamente");
      } else {
        // edwind, si no existía, entonces estamos creando uno nuevo
        await UserService.createUsuario(payload);
        toast.success("Usuario creado exitosamente");
      }

      handleCloseModal();
      fetchUsuarios(page);
    } catch (error) {
      toast.error(
        error.response?.data?.mensaje || "Ocurrió un error en la operación.",
      );
    }
  };

  const confirmDelete = (user) => {
    if (user.username === currentUser.username) {
      toast.error("No puedes eliminarte a ti mismo mientras estás en sesión.");
      return;
    }
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    try {
      await UserService.deleteUsuario(selectedUser.id);
      toast.success("Usuario eliminado del sistema");
      fetchUsuarios(page);
      setIsDeleteModalOpen(false);
      setSelectedUser(null);
    } catch (error) {
      toast.error("Error al eliminar el usuario");
      console.error(error);
    }
  };

  const filteredUsers = usuarios.filter(
    (u) =>
      u.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.apellidos.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.username.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      {/* edwind, la cabecera de la página de gestión */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
              <Users className="text-marcona-blue" />
              Gestión de Usuarios
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Crea o administra cuentas y roles administrativos del sistema.
            </p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="btn-primary flex items-center gap-2 whitespace-nowrap bg-marcona-blue hover:bg-blue-800 text-white px-5 py-2.5 rounded-xl font-medium transition-all"
          >
            <Plus size={20} />
            Registrar Usuario
          </button>
        </div>
      </div>

      {/* edwind, aquí va la barra de búsqueda y la tabla de usuarios */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Buscar por nombre o usuario..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-marcona-blue/20 focus:border-marcona-blue transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-gray-700">
              <tr>
                <th className="px-6 py-4 font-semibold">Usuario</th>
                <th className="px-6 py-4 font-semibold">Nombre Completo</th>
                <th className="px-6 py-4 font-semibold">Rol</th>
                <th className="px-6 py-4 font-semibold">Estado</th>
                <th className="px-6 py-4 font-semibold text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center">
                    <Loader2
                      size={32}
                      className="mx-auto animate-spin text-marcona-blue mb-4"
                    />
                    <p className="text-gray-500">Cargando usuarios...</p>
                  </td>
                </tr>
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map((u) => (
                  <tr
                    key={u.id}
                    className="hover:bg-blue-50/50 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-marcona-blue flex items-center justify-center font-bold text-xs uppercase">
                          {u.username.substring(0, 2)}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">
                            @{u.username}
                          </p>
                          <p className="text-xs text-gray-500">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 capitalize">
                      {u.nombre.toLowerCase()} {u.apellidos.toLowerCase()}
                    </td>
                    <td className="px-6 py-4">
                      {u.roles.includes("ROLE_ADMIN") ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                          <Shield size={12} />
                          Administrador
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                          <UserIcon size={12} />
                          Editor
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-600 border border-emerald-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        Activo
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleOpenModal(u)}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                          title="Editar usuario"
                        >
                          <Pencil size={18} />
                        </button>
                        <button
                          onClick={() => confirmDelete(u)}
                          disabled={u.username === currentUser?.username}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                          title={
                            u.username === currentUser?.username
                              ? "Tú"
                              : "Eliminar usuario"
                          }
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    No se encontraron usuarios
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* edwind, los botoncitos para cambiar de página */}
        {!loading && totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Anterior
            </button>
            <span className="text-sm text-gray-600">
              Página {page + 1} de {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Siguiente
            </button>
          </div>
        )}
      </div>

      {/* edwind, este es el cuadro para crear o editar un usuario */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                {selectedUser ? (
                  <>
                    <Pencil className="text-marcona-blue" size={20} />
                    Editar Usuario
                  </>
                ) : (
                  <>
                    <Users className="text-marcona-blue" size={20} />
                    Registrar Nuevo Usuario
                  </>
                )}
              </h3>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700">
                    Nombre
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    required
                    value={formData.nombre}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white outline-none focus:ring-2 focus:ring-marcona-blue/20 focus:border-marcona-blue transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700">
                    Apellidos
                  </label>
                  <input
                    type="text"
                    name="apellidos"
                    required
                    value={formData.apellidos}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white outline-none focus:ring-2 focus:ring-marcona-blue/20 focus:border-marcona-blue transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700">
                    Nombre de usuario (Alias)
                  </label>
                  <input
                    type="text"
                    name="username"
                    required
                    value={formData.username}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white outline-none focus:ring-2 focus:ring-marcona-blue/20 focus:border-marcona-blue transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700">
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white outline-none focus:ring-2 focus:ring-marcona-blue/20 focus:border-marcona-blue transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700">
                  Contraseña{" "}
                  {selectedUser && (
                    <span className="text-xs text-gray-400 font-normal">
                      (Dejar en blanco para mantener actual)
                    </span>
                  )}
                </label>
                <input
                  type="password"
                  name="password"
                  required={!selectedUser} // Obligatoria solo en creación
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder={
                    selectedUser
                      ? "Escribe nueva contraseña solo si deseas cambiarla..."
                      : "Ingresa una contraseña segura"
                  }
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white outline-none focus:ring-2 focus:ring-marcona-blue/20 focus:border-marcona-blue transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700">
                  Rol del Sistema
                </label>
                <select
                  name="roles"
                  value={formData.roles[0] || "EDITOR"}
                  onChange={handleRoleChange}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white outline-none focus:ring-2 focus:ring-marcona-blue/20 focus:border-marcona-blue transition-all appearance-none"
                >
                  <option value="ADMIN">Administrador (Acceso Total)</option>
                  <option value="EDITOR">Editor (Solo Contenido)</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Los Administradores pueden gestionar a otros usuarios. Los
                  Editores solo pueden crear noticias o documentos.
                </p>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-600 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-marcona-blue text-white rounded-xl font-medium hover:bg-blue-800 transition-colors"
                >
                  {selectedUser ? "Guardar Cambios" : "Crear Usuario"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* edwind, y este cuadrito es para confirmar que quiere eliminar al usuario */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200 text-center p-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500">
              <AlertTriangle size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              ¿Eliminar usuario?
            </h3>
            <p className="text-gray-500 text-sm mb-6">
              Estás a punto de eliminar a{" "}
              <strong>{selectedUser?.username}</strong> de forma permanente del
              sistema. Esta acción no se puede deshacer.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="flex-1 px-4 py-2 border border-gray-200 text-gray-600 rounded-xl font-medium hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-colors shadow-sm shadow-red-200"
              >
                Sí, eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

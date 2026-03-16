import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown, ChevronRight } from "lucide-react";
import { getPublicMenu } from "../../services/menu.service";

// edwind, algunas ayuditas para que funcione la navegación

function isExternal(url) {
  return url && (url.startsWith("http://") || url.startsWith("https://"));
}

// edwind, este ganchito (hook) sirve para no cerrar de golpe el menú cuando se te resbala el ratón
// le da un tiempito de vida al menú antes de desaparecer
function useHoverMenu(closeDelay = 180) {
  const [open, setOpen] = useState(false);
  const timer = useRef(null);

  const clearTimer = () => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
  };

  const enter = useCallback(() => {
    clearTimer();
    setOpen(true);
  }, []);

  const leave = useCallback(() => {
    clearTimer();
    timer.current = setTimeout(() => setOpen(false), closeDelay);
  }, [closeDelay]);

  // edwind, limpiamos el temporizador si ya no estamos en este componente
  useEffect(() => () => clearTimer(), []);

  return { open, setOpen, enter, leave };
}

// edwind, esto es un ayudante para saber si abrimos el link aquí mismo o en otra pestaña
function NavLink({ item, children, onClick, className }) {
  if (isExternal(item.url)) {
    return (
      <a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        onClick={onClick}
      >
        {children}
      </a>
    );
  }
  const to = !item.url || item.url === "#" ? "/" : item.url;
  return (
    <Link to={to} className={className} onClick={onClick}>
      {children}
    </Link>
  );
}

// ─── Submenú recursivo para escritorio ──────────────────────────────────────
// edwind, con estas funciones evitamos que el menú principal se cierre si lograste llegar a un submenú
function DesktopSubMenu({ items, depth = 0, parentEnter, parentLeave }) {
  const { pathname } = useLocation();

  // edwind, si es el primer nivel, va pa' abajo, y si es submenú, lo asomamos por la derecha
  const positionClass = depth === 0 ? "top-full left-0" : "top-0 left-full";

  return (
    // edwind, echamos un espaciado para que el puntero no se "caiga" al pasar del botón al menú desplegable
    <div
      className={`absolute ${positionClass} ${depth === 0 ? "pt-2" : "pl-1"}`}
      style={{ zIndex: 50 + depth * 10 }}
      onMouseEnter={parentEnter} // cancelar cierre del padre
      onMouseLeave={parentLeave} // propagar cierre al padre
    >
      <div className="min-w-[200px] rounded-xl shadow-xl bg-white border border-gray-100 py-1">
        {items.map((item) => {
          const hasChildren = item.children && item.children.length > 0;
          const active = pathname === item.url;
          const { open: subOpen, enter, leave } = useHoverMenu(180); // eslint-disable-line react-hooks/rules-of-hooks

          return (
            <div
              key={item.id}
              className="relative"
              onMouseEnter={enter}
              onMouseLeave={leave}
            >
              <NavLink
                item={item}
                className={`flex items-center justify-between px-4 py-2.5 text-sm transition-colors ${
                  active
                    ? "text-marcona-blue font-bold bg-marcona-light"
                    : "text-gray-700 hover:bg-marcona-light hover:text-marcona-blue"
                }`}
              >
                <span>{item.label}</span>
                {hasChildren && (
                  <ChevronRight
                    size={14}
                    className="ml-3 text-gray-400 shrink-0"
                  />
                )}
              </NavLink>

              {hasChildren && subOpen && (
                <DesktopSubMenu
                  items={item.children}
                  depth={depth + 1}
                  parentEnter={enter} // mover al hijo → cancela cierre de este ítem
                  parentLeave={leave} // salir del hijo → cierra este ítem
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// edwind, este es cada botoncito principal de la barra de arriba en la compu
function DesktopMenuItem({ item }) {
  const { pathname } = useLocation();
  const hasChildren = item.children && item.children.length > 0;
  const { open, enter, leave } = useHoverMenu(180);

  const active =
    pathname === item.url ||
    (item.url && item.url !== "/" && pathname.startsWith(item.url));

  const baseCls = active
    ? "flex items-center gap-1 bg-marcona-blue text-white rounded-full px-5 py-1.5 text-sm font-semibold transition-all"
    : "flex items-center gap-1 text-gray-700 hover:text-marcona-blue text-sm px-4 py-1.5 font-medium transition-colors rounded-full hover:bg-marcona-light";

  if (!hasChildren) {
    return (
      <NavLink item={item} className={baseCls}>
        {item.label}
      </NavLink>
    );
  }

  return (
    <div className="relative" onMouseEnter={enter} onMouseLeave={leave}>
      <button type="button" className={baseCls}>
        {item.label}
        <ChevronDown
          size={14}
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <DesktopSubMenu
          items={item.children}
          depth={0}
          parentEnter={enter}
          parentLeave={leave}
        />
      )}
    </div>
  );
}

// edwind, acá armamos los ítems en versión celular
function MobileMenuItem({ item, depth = 0, onClose }) {
  const { pathname } = useLocation();
  const [expanded, setExpanded] = useState(false);
  const hasChildren = item.children && item.children.length > 0;
  const active = pathname === item.url;
  const paddingLeft = `${12 + depth * 16}px`;

  if (!hasChildren) {
    return (
      <NavLink
        item={item}
        onClick={onClose}
        className={`flex items-center py-2.5 rounded-lg text-sm mb-0.5 transition-colors ${
          active
            ? "text-marcona-blue font-bold bg-marcona-light/60"
            : "text-gray-700 hover:bg-marcona-light hover:text-marcona-blue"
        }`}
        style={{ paddingLeft }}
      >
        {depth > 0 && (
          <ChevronRight size={13} className="mr-1 text-gray-300 shrink-0" />
        )}
        {item.label}
      </NavLink>
    );
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className={`flex items-center justify-between w-full py-2.5 rounded-lg text-sm font-medium mb-0.5 ${
          active
            ? "bg-marcona-blue text-white"
            : "text-gray-700 hover:bg-marcona-light"
        }`}
        style={{ paddingLeft }}
      >
        <span>{item.label}</span>
        <ChevronDown
          size={16}
          className={`mr-3 transition-transform duration-200 shrink-0 ${expanded ? "rotate-180" : ""}`}
        />
      </button>

      {expanded && (
        <div className="border-l-2 border-marcona-light ml-4">
          {item.children.map((child) => (
            <MobileMenuItem
              key={child.id}
              item={child}
              depth={depth + 1}
              onClose={onClose}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// edwind, al fin, todo ensamblado en la barra de navegación grande
export default function Navbar() {
  const { pathname } = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuItems, setMenuItems] = useState([
    { id: 1, label: "Inicio", url: "/" },
    { id: 2, label: "Municipalidad", url: "/municipalidad" },
    { id: 3, label: "Servicios", url: "/servicios" },
    { id: 4, label: "Transparencia", url: "/transparencia" },
    { id: 5, label: "Noticias", url: "/noticias" },
    { id: 6, label: "Contacto", url: "/contacto" },
  ]);

  useEffect(() => {
    getPublicMenu()
      .then((data) => {
        if (data && data.length > 0) setMenuItems(data);
      })
      .catch((err) => console.error("Error fetching menu:", err));
  }, []);

  // edwind, apagamos el menú del teléfono si la persona ya le picó a un enlace
  useEffect(() => {
    const id = setTimeout(() => setMobileOpen(false), 0);
    return () => clearTimeout(id);
  }, [pathname]);

  return (
    <nav className="bg-white border-b-2 border-marcona-gold shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12">
          {/* edwind, aquí acomodamos los botones principales si estamos en pantalla grande */}
          <div className="hidden md:flex items-center gap-1">
            {menuItems.map((item) => (
              <DesktopMenuItem key={item.id} item={item} />
            ))}
          </div>

          {/* edwind, un enlace directo y destacado al portal del vecino */}
          <div className="hidden md:block">
            <Link
              to="/login"
              className="text-sm text-marcona-blue font-medium hover:text-blue-800 transition-colors border border-marcona-blue rounded-full px-4 py-1.5"
            >
              Portal del Ciudadano
            </Link>
          </div>

          {/* edwind, el botón de rayitas clásicas para abrir el menú en el celular */}
          <button
            className="md:hidden p-2 rounded-lg text-marcona-blue hover:bg-marcona-light transition-colors"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? (
              <X size={22} strokeWidth={1.5} />
            ) : (
              <Menu size={22} strokeWidth={1.5} />
            )}
          </button>
        </div>

        {/* edwind, todo el menú listado de arriba abajo para celulares */}
        {mobileOpen && (
          <div className="md:hidden pb-3 pt-1 border-t border-gray-100 max-h-[80vh] overflow-y-auto">
            {menuItems.map((item) => (
              <MobileMenuItem
                key={item.id}
                item={item}
                depth={0}
                onClose={() => setMobileOpen(false)}
              />
            ))}
            <Link
              to="/login"
              onClick={() => setMobileOpen(false)}
              className="block py-2.5 px-3 rounded-lg text-sm font-medium text-marcona-blue border border-marcona-blue mt-4 text-center mx-2"
            >
              Portal del Ciudadano
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}

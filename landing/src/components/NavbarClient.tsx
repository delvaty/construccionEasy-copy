import { NavLink, useLocation } from 'react-router-dom';
import { Home, FileText, TicketCheck, UserCircle, CreditCard, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NavbarClientProps {
  dashboard?: boolean;
}

export default function NavbarClient({ dashboard = false }: NavbarClientProps) {
  const { signOut } = useAuth();
  const location = useLocation();
  const currentPath = location.pathname;

  // Definir los items de navegación según el modo (dashboard o landing)
  const navItems = dashboard 
    ? [
        { to: "/dashboard", icon: <Home className="w-5 h-5" />, label: "Inicio", exact: true },
        { to: "/dashboard/documentos", icon: <FileText className="w-5 h-5" />, label: "Documentos" },
        { to: "/dashboard/tickets", icon: <TicketCheck className="w-5 h-5" />, label: "Tickets" },
        { to: "/dashboard/pagos", icon: <CreditCard className="w-5 h-5" />, label: "Pagos" },
        { to: "/dashboard/perfil", icon: <UserCircle className="w-5 h-5" />, label: "Perfil" }
      ]
    : [
        { to: "/", icon: <Home className="w-5 h-5" />, label: "Inicio", exact: true },
        { to: "/servicios", icon: <FileText className="w-5 h-5" />, label: "Servicios" },
        { to: "/guia", icon: <FileText className="w-5 h-5" />, label: "Guía" },
        { to: "/banking", icon: <CreditCard className="w-5 h-5" />, label: "Banking" },
        { to: "/contact", icon: <TicketCheck className="w-5 h-5" />, label: "Contacto" }
      ];


       // Función personalizada para determinar si un link está activo
  const isLinkActive = (path: string) => {
    // Para la página de inicio, debe ser exactamente la ruta especificada
    if (path === '/' || path === '/dashboard') {
      return currentPath === path;
    }
    return currentPath.startsWith(path);
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <img src="/logob.png" className="h-6" alt="Logo" />
            </div>
          </div>
          
          <div className="flex h-full">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/' || item.to === '/dashboard'}
                className={ `
                  inline-flex items-center px-4 py-2 text-sm font-medium h-full
                  ${isLinkActive(item.to) 
                    ? 'text-indigo-600 border-b-2 border-indigo-600' 
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300 border-b-2 border-transparent'}
                `}
              >
                {item.icon}
                <span className="ml-2">{item.label}</span>
              </NavLink>
            ))}
            
            {/* Botón de cerrar sesión solo si estamos en el dashboard */}
            {dashboard && (
              <button
                onClick={signOut}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300 border-b-2 border-transparent h-full"
              >
                <LogOut className="w-5 h-5" />
                <span className="ml-2">Salir</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
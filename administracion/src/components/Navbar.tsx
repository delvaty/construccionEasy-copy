import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, FileText, TicketCheck, UserCircle, CreditCard } from 'lucide-react';

export default function Navbar() {
  const navItems = [
    { to: "/", icon: <Home className="w-5 h-5" />, label: "Inicio" },
    { to: "/documentos", icon: <FileText className="w-5 h-5" />, label: "Documentos" },
    { to: "/tickets", icon: <TicketCheck className="w-5 h-5" />, label: "Tickets" },
    { to: "/pagos", icon: <CreditCard className="w-5 h-5" />, label: "Pagos" },
    { to: "/perfil", icon: <UserCircle className="w-5 h-5" />, label: "Perfil" }
  ];

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
        <div className="flex">
  <div className="flex-shrink-0 flex items-center">
    <img src="/logob.png" className="h-6" alt="Logo" />
  </div>
</div>
          
          <div className="flex">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `
                  inline-flex items-center px-4 py-2 text-sm font-medium
                  ${isActive 
                    ? 'text-indigo-600 border-b-2 border-indigo-600' 
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300 border-b-2 border-transparent'}
                `}
              >
                {item.icon}
                <span className="ml-2">{item.label}</span>
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}

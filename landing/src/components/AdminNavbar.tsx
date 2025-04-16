import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, FolderKanban, TicketCheck, LogOut, CreditCard } from 'lucide-react';

export default function AdminNavbar() {
  const navItems = [
    { to: "/admin", icon: <LayoutDashboard className="w-5 h-5" />, label: "Dashboard" },
    { to: "/admin/clientes", icon: <Users className="w-5 h-5" />, label: "Clientes" },
    { to: "/admin/procesos", icon: <FolderKanban className="w-5 h-5" />, label: "Procesos" },
    { to: "/admin/tickets", icon: <TicketCheck className="w-5 h-5" />, label: "Tickets" },
    { to: "/admin/pagos", icon: <CreditCard className="w-5 h-5" />, label: "Pagos" }
  ];

  return (
    <nav className="bg-indigo-700 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
        <div className="flex">
  <div className="flex-shrink-0 flex items-center">
    <img src="/logo.png" className="h-6" alt="Logo" />
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
                    ? 'bg-indigo-800 text-white' 
                    : 'text-indigo-100 hover:bg-indigo-600'}
                `}
              >
                {item.icon}
                <span className="ml-2">{item.label}</span>
              </NavLink>
            ))}
            <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-indigo-100 hover:bg-indigo-600">
              <LogOut className="w-5 h-5" />
              <span className="ml-2">Salir</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

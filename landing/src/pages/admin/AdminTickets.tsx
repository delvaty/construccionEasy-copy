import React, { useState } from 'react';
import { MessageSquare, Clock, User, Filter } from 'lucide-react';

export default function AdminTickets() {
  const [tickets] = useState([
    {
      id: "TK-001",
      client: "María García",
      subject: "Consulta sobre documentación laboral",
      status: "Pendiente",
      priority: "Alta",
      created: "01/03/2025",
      lastUpdate: "01/03/2025",
      messages: 3
    },
    {
      id: "TK-002",
      client: "John Smith",
      subject: "Actualización de dirección",
      status: "En Proceso",
      priority: "Media",
      created: "28/02/2025",
      lastUpdate: "01/03/2025",
      messages: 2
    }
  ]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Gestión de Tickets</h1>
        <div className="flex space-x-4">
          <button className="flex items-center px-4 py-2 border rounded-md text-gray-600 hover:bg-gray-50">
            <Filter className="w-4 h-4 mr-2" />
            Filtrar
          </button>
          <select className="border rounded-md px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500">
            <option value="">Todos los estados</option>
            <option value="pending">Pendientes</option>
            <option value="process">En Proceso</option>
            <option value="resolved">Resueltos</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ticket
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cliente
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Prioridad
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Última Actualización
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mensajes
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {tickets.map((ticket) => (
              <tr key={ticket.id} className="hover:bg-gray-50 cursor-pointer">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <MessageSquare className="h-5 w-5 text-gray-400 mr-2" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">{ticket.id}</div>
                      <div className="text-sm text-gray-500">{ticket.subject}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <User className="h-5 w-5 text-gray-400 mr-2" />
                    <div className="text-sm text-gray-900">{ticket.client}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    ticket.status === 'Pendiente'
                      ? 'bg-yellow-100 text-yellow-800'
                      : ticket.status === 'En Proceso'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {ticket.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`text-sm font-medium ${
                    ticket.priority === 'Alta' 
                      ? 'text-red-600'
                      : ticket.priority === 'Media'
                      ? 'text-yellow-600'
                      : 'text-green-600'
                  }`}>
                    {ticket.priority}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="h-4 w-4 mr-1" />
                    {ticket.lastUpdate}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full text-xs font-medium">
                      {ticket.messages} mensajes
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

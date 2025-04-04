import React, { useState } from 'react';
import { TicketCheck, MessageSquare, X } from 'lucide-react';

export default function TicketsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tickets, setTickets] = useState([
    {
      id: 'TK-001',
      subject: 'Consulta sobre documentación laboral',
      status: 'Abierto',
      lastUpdate: '01/03/2025',
      priority: 'Alta',
      description: 'Necesito información sobre los documentos requeridos para el permiso de trabajo.'
    },
    {
      id: 'TK-002',
      subject: 'Actualización de dirección',
      status: 'Respondido',
      lastUpdate: '28/02/2025',
      priority: 'Media',
      description: 'He cambiado de dirección y necesito actualizar mis datos.'
    }
  ]);

  const [newTicket, setNewTicket] = useState({
    subject: '',
    description: '',
    priority: 'Media'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ticket = {
      id: `TK-${String(tickets.length + 1).padStart(3, '0')}`,
      subject: newTicket.subject,
      description: newTicket.description,
      priority: newTicket.priority,
      status: 'Abierto',
      lastUpdate: new Date().toLocaleDateString()
    };
    setTickets([ticket, ...tickets]);
    setIsModalOpen(false);
    setNewTicket({ subject: '', description: '', priority: 'Media' });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Sistema de Tickets</h2>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Nuevo Ticket
          </button>
        </div>

        <div className="space-y-4">
          {tickets.map((ticket, index) => (
            <div key={index} className="border rounded-lg p-4 hover:bg-gray-50">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <TicketCheck className="h-5 w-5 text-gray-400" />
                  <span className="text-sm font-medium text-gray-900">{ticket.id}</span>
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    ticket.status === 'Abierto' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {ticket.status}
                  </span>
                </div>
                <span className="text-sm text-gray-500">Última actualización: {ticket.lastUpdate}</span>
              </div>
              <p className="text-sm text-gray-900 mb-2">{ticket.subject}</p>
              <div className="flex items-center justify-between">
                <span className={`text-xs font-medium ${
                  ticket.priority === 'Alta' ? 'text-red-600' : 'text-yellow-600'
                }`}>
                  Prioridad: {ticket.priority}
                </span>
                <button className="text-indigo-600 hover:text-indigo-900 text-sm font-medium flex items-center">
                  <MessageSquare className="h-4 w-4 mr-1" />
                  Ver conversación
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal para nuevo ticket */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Crear Nuevo Ticket</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-500">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Asunto</label>
                <input
                  type="text"
                  value={newTicket.subject}
                  onChange={(e) => setNewTicket({...newTicket, subject: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Descripción</label>
                <textarea
                  value={newTicket.description}
                  onChange={(e) => setNewTicket({...newTicket, description: e.target.value})}
                  rows={4}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Prioridad</label>
                <select
                  value={newTicket.priority}
                  onChange={(e) => setNewTicket({...newTicket, priority: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="Baja">Baja</option>
                  <option value="Media">Media</option>
                  <option value="Alta">Alta</option>
                </select>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md"
                >
                  Crear Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

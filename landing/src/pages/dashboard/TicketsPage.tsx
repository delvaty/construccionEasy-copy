import React, { useState, useEffect, useRef } from 'react';
import { TicketCheck, MessageSquare, X, Paperclip, Send, ArrowLeft, Ticket } from 'lucide-react';
import { supabase } from '../../lib/supabase/client'
import { useAuth } from '../../context/AuthContext';
import { v4 as uuidv4 } from 'uuid';
import { SupportTicket, TicketMessage } from '../../types/types';

export default function TicketsPage() {
  // Supabase client y usuario actual
  
  const user = useAuth();
  
  // Estados principales
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [clientId, setClientId] = useState<string | null>(null);
  const [clientIdChecked, setClientIdChecked] = useState(false); // Para controlar si ya se verificó el clientId
  
  // Estado para modales
  const [isNewTicketModalOpen, setIsNewTicketModalOpen] = useState(false);
  const [isConversationModalOpen, setIsConversationModalOpen] = useState(false);
  
  // Estado para el ticket seleccionado y sus mensajes
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [ticketMessages, setTicketMessages] = useState<TicketMessage[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);

  // Estado para el formulario de nuevo ticket
  const [newTicket, setNewTicket] = useState({
    subject: '',
    message: '',
    priority: 'Media',
    attachments: [] as File[]
  });

  // Estado para el nuevo mensaje
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messageInputRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Obtener el ID del cliente al cargar el componente
  useEffect(() => {
    if (user) {
      fetchClientId();
    }
  }, [user]);

  // Cargar tickets cuando tengamos el clientId o cuando se haya verificado que no existe
  useEffect(() => {
    if (clientIdChecked) {
      fetchTickets();
    }
  }, [clientIdChecked]);

  // Scroll automático a los nuevos mensajes
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [ticketMessages]);

  // Obtener el ID del cliente desde su usuario
  const fetchClientId = async () => {
    if (!user|| !user.user) return;
    
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('id')
        .eq('user_id', user.user?.id)
        .single();
      
      if (error) {
        console.error('Error al obtener ID del cliente:', error);
        // No establecemos error aquí para no mostrar mensaje al usuario
      }
      
      if (data) {
        setClientId(data.id);
      }
      
      // Marcamos que ya se verificó el clientId, independientemente del resultado
      setClientIdChecked(true);
      
    } catch (err) {
      console.error('Error al obtener ID del cliente:', err);
      setClientIdChecked(true); // Marcamos que ya se verificó, aunque haya error
    }
  };

  // Cargar tickets del cliente
  const fetchTickets = async () => {
    setLoading(true);
    
    try {
      // Si no hay clientId, simplemente establecemos una lista vacía de tickets
      if (!clientId) {
        setTickets([]);
        setLoading(false);
        return;
      }
      
      const { data, error } = await supabase
        .from('support_tickets')
        .select('*')
        .eq('client_id', clientId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setTickets(data || []);
    } catch (err) {
      console.error('Error al cargar tickets:', err);
      setError('No se pudieron cargar los tickets. Por favor, intenta de nuevo más tarde.');
    } finally {
      setLoading(false);
    }
  };

  // Cargar mensajes de un ticket específico
  const fetchTicketMessages = async (ticketId: string) => {
    setLoadingMessages(true);
    try {
      const { data, error } = await supabase
        .from('ticket_messages')
        .select(`
          id,
          ticket_id,
          sender_id,
          message,
          is_from_admin,
          created_at
        `)
        .eq('ticket_id', ticketId)
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      setTicketMessages(data || []);
    } catch (err) {
      console.error('Error al cargar mensajes:', err);
      setError('No se pudieron cargar los mensajes.');
    } finally {
      setLoadingMessages(false);
    }
  };

  // Abrir la conversación de un ticket
  const handleOpenConversation = (ticket: SupportTicket) => {
    setSelectedTicket(ticket);
    setIsConversationModalOpen(true);
    fetchTicketMessages(ticket.id);
  };

  // Cerrar la conversación
  const handleCloseConversation = () => {
    setIsConversationModalOpen(false);
    setSelectedTicket(null);
    setTicketMessages([]);
  };

  // Manejar cambio de archivos adjuntos
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileList = Array.from(e.target.files);
      setNewTicket(prev => ({
        ...prev,
        attachments: [...prev.attachments, ...fileList]
      }));
    }
  };

  // Eliminar un archivo adjunto
  const handleRemoveFile = (index: number) => {
    setNewTicket(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  // Función para crear cliente si no existe
  const createClient = async () => {
    if (!user) return null;
    
    try {
      // Comprobar si ya existe el cliente
      const { data: existingClient, error: checkError } = await supabase
        .from('clients')
        .select('id')
        .eq('user_id', user.user?.id)
        .single();
      
      // Si ya existe, devolver ese ID
      if (existingClient && !checkError) {
        return existingClient.id;
      }
      
      // Si no existe, crear uno nuevo
      const { data: newClient, error: createError } = await supabase
        .from('clients')
        .insert({
          user_id: user.user?.id,
          
        })
        .select('id')
        .single();
      
      if (createError) throw createError;
      return newClient?.id || null;
      
    } catch (err) {
      console.error('Error al crear/verificar cliente:', err);
      return null;
    }
  };

  // Crear un nuevo ticket
  const handleSubmitNewTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      alert('No se pudo identificar tu cuenta. Por favor, vuelve a iniciar sesión.');
      return;
    }
    
    setSending(true);
    try {
      // Asegurarnos de que tenemos un clientId, o crearlo si no existe
      let currentClientId = clientId;
      
      if (!currentClientId) {
        currentClientId = await createClient();
        
        if (!currentClientId) {
          throw new Error('No se pudo crear la cuenta de cliente');
        }
        
        // Actualizamos el estado
        setClientId(currentClientId);
        setClientIdChecked(true);
      }
      
      // Generar número de ticket
      const ticketNumber = `TK-${String(Math.floor(Math.random() * 900) + 100)}-${String(Math.floor(Math.random() * 9000) + 1000)}`;
      
      // 1. Crear el ticket en la base de datos
      const { data: ticketData, error: ticketError } = await supabase
        .from('support_tickets')
        .insert({
          client_id: currentClientId,
          ticket_number: ticketNumber,
          subject: newTicket.subject,
          status: 'Abierto',
          priority: newTicket.priority,
        })
        .select('id')
        .single();
      
      if (ticketError) throw ticketError;
      
      // 2. Añadir el primer mensaje
      const { error: messageError } = await supabase
        .from('ticket_messages')
        .insert({
          ticket_id: ticketData.id,
          sender_id: user.user?.id,
          message: newTicket.message,
          is_from_admin: false,
        });
      
      if (messageError) throw messageError;
      
      // 3. Subir archivos adjuntos si existen
      if (newTicket.attachments.length > 0) {
        for (const file of newTicket.attachments) {
          const fileExt = file.name.split('.').pop();
          const fileName = `${uuidv4()}.${fileExt}`;
          const filePath = `ticket-attachments/${ticketData.id}/${fileName}`;
          
          const { error: uploadError } = await supabase.storage
            .from('client-documents')
            .upload(filePath, file);
          
          if (uploadError) throw uploadError;
        }
      }
      
      // 4. Actualizar la lista de tickets
      fetchTickets();
      
      // 5. Cerrar modal y resetear formulario
      setIsNewTicketModalOpen(false);
      setNewTicket({
        subject: '',
        message: '',
        priority: 'Media',
        attachments: []
      });
      
    } catch (err) {
      console.error('Error al crear ticket:', err);
      alert('No se pudo crear el ticket. Por favor, intenta de nuevo.');
    } finally {
      setSending(false);
    }
  };

  // Enviar un nuevo mensaje
  const handleSubmitNewMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !selectedTicket || !user) return;
    
    setSending(true);
    try {
      // 1. Insertar el mensaje
      const { error: messageError } = await supabase
        .from('ticket_messages')
        .insert({
          ticket_id: selectedTicket.id,
          sender_id: user.user?.id,
          message: newMessage,
          is_from_admin: false,
        });
      
      if (messageError) throw messageError;
      
      // 2. Actualizar el estado del ticket a "Respondido" si era "Cerrado"
      if (selectedTicket.status === 'Cerrado') {
        const { error: updateError } = await supabase
          .from('support_tickets')
          .update({ 
            status: 'Abierto',
            updated_at: new Date().toISOString()
          })
          .eq('id', selectedTicket.id);
        
        if (updateError) throw updateError;
      }
      
      // 3. Actualizar la lista de mensajes y limpiar campo
      fetchTicketMessages(selectedTicket.id);
      setNewMessage('');
      
    } catch (err) {
      console.error('Error al enviar mensaje:', err);
      alert('No se pudo enviar el mensaje. Por favor, intenta de nuevo.');
    } finally {
      setSending(false);
    }
  };

  // Formatear fecha para mostrar
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Sistema de Tickets</h2>
          <button
            onClick={() => setIsNewTicketModalOpen(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Nuevo Ticket
          </button>
        </div>

        {loading ? (
          <div className="py-8 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-indigo-600 border-r-transparent"></div>
            <p className="mt-2 text-gray-700">Cargando tickets...</p>
          </div>
        ) : error ? (
          <div className="py-8 text-center text-red-500">{error}</div>
        ) : tickets.length === 0 ? (
          <div className="py-8 text-center text-gray-500">
            No tienes tickets activos. Crea uno nuevo para recibir asistencia.
          </div>
        ) : (
          <div className="space-y-4">
            {tickets.map((ticket) => (
              <div key={ticket.id} className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer" onClick={() => handleOpenConversation(ticket)}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <TicketCheck className="h-5 w-5 text-gray-400" />
                    <span className="text-sm font-medium text-gray-900">
                      {ticket.ticket_number}
                    </span>
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        ticket.status === 'Abierto'
                          ? 'bg-yellow-100 text-yellow-800'
                          : ticket.status === 'Respondido'
                          ? 'bg-green-100 text-green-800'
                          : ticket.status === 'En Proceso'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {ticket.status}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {formatDate(ticket.updated_at)}
                  </span>
                </div>
                <p className="text-sm text-gray-900 mb-2">{ticket.subject}</p>
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs font-medium ${
                      ticket.priority === 'Alta'
                        ? 'text-red-600'
                        : ticket.priority === 'Media'
                        ? 'text-yellow-600'
                        : 'text-green-600'
                    }`}
                  >
                    Prioridad: {ticket.priority}
                  </span>
                  <button 
                    className="text-indigo-600 hover:text-indigo-900 text-sm font-medium flex items-center"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenConversation(ticket);
                    }}
                  >
                    <MessageSquare className="h-4 w-4 mr-1" />
                    Ver conversación
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal para nuevo ticket */}
      {isNewTicketModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Crear Nuevo Ticket</h3>
              <button
                onClick={() => setIsNewTicketModalOpen(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSubmitNewTicket} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Asunto
                </label>
                <input
                  type="text"
                  value={newTicket.subject}
                  onChange={(e) =>
                    setNewTicket({ ...newTicket, subject: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Mensaje
                </label>
                <textarea
                  value={newTicket.message}
                  onChange={(e) =>
                    setNewTicket({ ...newTicket, message: e.target.value })
                  }
                  rows={4}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Prioridad
                </label>
                <select
                  value={newTicket.priority}
                  onChange={(e) =>
                    setNewTicket({ ...newTicket, priority: e.target.value as 'Baja' | 'Media' | 'Alta' })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="Baja">Baja</option>
                  <option value="Media">Media</option>
                  <option value="Alta">Alta</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Adjuntar documentos
                </label>
                <div className="mt-1 flex items-center">
                  <input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                    ref={fileInputRef}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <Paperclip className="h-4 w-4 mr-2" />
                    Adjuntar archivos
                  </button>
                </div>
                {newTicket.attachments.length > 0 && (
                  <div className="mt-2 space-y-2">
                    {newTicket.attachments.map((file, index) => (
                      <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded-md">
                        <span className="text-sm text-gray-700 truncate">{file.name}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveFile(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsNewTicketModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={sending}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md disabled:bg-indigo-400 disabled:cursor-not-allowed"
                >
                  {sending ? 'Creando...' : 'Crear Ticket'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal para conversación de ticket */}
      {isConversationModalOpen && selectedTicket && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-screen flex flex-col">
            {/* Header */}
            <div className="border-b p-4 flex items-center justify-between">
              <div className="flex items-center">
                <button
                  onClick={handleCloseConversation}
                  className="text-gray-500 hover:text-gray-700 mr-3"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    {selectedTicket.ticket_number}: {selectedTicket.subject}
                  </h3>
                  <div className="flex items-center text-sm text-gray-500 space-x-2">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        selectedTicket.status === 'Abierto'
                          ? 'bg-yellow-100 text-yellow-800'
                          : selectedTicket.status === 'Respondido'
                          ? 'bg-green-100 text-green-800'
                          : selectedTicket.status === 'En Proceso'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {selectedTicket.status}
                    </span>
                    <span
                      className={`text-xs font-medium ${
                        selectedTicket.priority === 'Alta'
                          ? 'text-red-600'
                          : selectedTicket.priority === 'Media'
                          ? 'text-yellow-600'
                          : 'text-green-600'
                      }`}
                    >
                      Prioridad: {selectedTicket.priority}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={handleCloseConversation}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {loadingMessages ? (
                <div className="text-center text-gray-500 py-8">
                  <div className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-indigo-600 border-r-transparent"></div>
                  <p className="mt-2">Cargando mensajes...</p>
                </div>
              ) : ticketMessages.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  No hay mensajes en este ticket.
                </div>
              ) : (
                ticketMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.is_from_admin ? 'justify-start' : 'justify-end'}`}
                  >
                    <div
                      className={`max-w-3/4 p-3 rounded-lg ${
                        message.is_from_admin
                          ? 'bg-gray-100 text-gray-800'
                          : 'bg-indigo-600 text-white'
                      }`}
                    >
                      <p className="text-sm">{message.message}</p>
                      <p
                        className={`text-xs mt-1 ${
                          message.is_from_admin ? 'text-gray-500' : 'text-indigo-200'
                        }`}
                      >
                        {new Date(message.created_at).toLocaleString('es-ES', {
                          hour: '2-digit',
                          minute: '2-digit',
                          day: '2-digit',
                          month: '2-digit',
                          year: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>
            
            {/* Input */}
            <div className="border-t p-4">
              <form onSubmit={handleSubmitNewMessage} className="flex items-center space-x-2">
                <textarea
                  ref={messageInputRef}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Escribe un mensaje..."
                  className="flex-1 border rounded-md p-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  rows={1}
                  disabled={sending}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmitNewMessage(e);
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 text-gray-500 hover:text-gray-700"
                  disabled={sending}
                >
                  <Paperclip className="h-5 w-5" />
                </button>
                <button
                  type="submit"
                  disabled={sending || !newMessage.trim()}
                  className="bg-indigo-600 text-white p-2 rounded-md hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed"
                >
                  <Send className="h-5 w-5" />
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
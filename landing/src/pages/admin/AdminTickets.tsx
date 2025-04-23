import React, { useState, useRef, useEffect } from "react";
import {
  MessageSquare,
  Clock,
  User,
  Filter,
  PaperclipIcon,
  Send,
  ArrowLeft,
  X,
  AlertCircle,
  Loader,
} from "lucide-react";
import { supabase } from "../../lib/supabase/client"; // Importar el cliente de Supabase

// Importamos los tipos necesarios
import { SupportTicket, TicketMessage, Client } from "../../types/types";
import { useAuth } from "../../context/AuthContext";

export default function AdminTickets() {
  // Estado para los tickets
  const [tickets, setTickets] = useState<SupportTicket[]>([]);

  // Estado para los clientes
  const [clients, setClients] = useState<Client[]>([]);

  // Estado para los mensajes
  const [messages, setMessages] = useState<Record<string, TicketMessage[]>>({});

  // Estado para el ticket seleccionado
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);

  // Estado para el nuevo mensaje
  const [newMessage, setNewMessage] = useState("");

  // Estado para el filtro de tickets
  const [statusFilter, setStatusFilter] = useState("");

  // Estado para archivos adjuntos
  const [attachments, setAttachments] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Estados para controlar la carga
  const [loading, setLoading] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, isAdmin } = useAuth();

  // Cargar tickets y clientes al montar el componente
  useEffect(() => {
    async function loadInitialData() {
      setLoading(true);
      setError(null);
      try {
        // Cargar tickets
        const { data: ticketsData, error: ticketsError } = await supabase
          .from("support_tickets")
          .select("*")
          .order("created_at", { ascending: false });

        if (ticketsError) throw ticketsError;

        // Cargar clientes para mostrar sus nombres
        const { data: clientsData, error: clientsError } = await supabase
          .from("clients")
          .select("*");

        if (clientsError) throw clientsError;

        setTickets(ticketsData || []);
        setClients(clientsData || []);
      } catch (err) {
        console.error("Error cargando datos iniciales:", err);
        setError(
          "No se pudieron cargar los tickets. Por favor, intenta de nuevo."
        );
      } finally {
        setLoading(false);
      }
    }

    loadInitialData();
  }, []);

  // Cargar mensajes de un ticket específico
  const loadTicketMessages = async (ticketId: string) => {
    setLoadingMessages(true);
    try {
      const { data, error } = await supabase
        .from("ticket_messages")
        .select("*")
        .eq("ticket_id", ticketId)
        .order("created_at", { ascending: true });

      if (error) throw error;

      // Actualizar el estado de mensajes
      setMessages((prev) => ({
        ...prev,
        [ticketId]: data || [],
      }));
    } catch (err) {
      console.error("Error cargando mensajes:", err);
      setError(
        "No se pudieron cargar los mensajes. Por favor, intenta de nuevo."
      );
    } finally {
      setLoadingMessages(false);
    }
  };

  // Manejador para seleccionar un ticket
  const handleTicketClick = (ticketId: string) => {
    setSelectedTicket(ticketId);
    loadTicketMessages(ticketId);

    // Actualizar el estado del ticket a "En Proceso" si estaba "Abierto"
    const ticket = tickets.find((t) => t.id === ticketId);
    if (ticket && ticket.status === "Abierto") {
      handleStatusChange(ticketId, "En Proceso");
    }
  };

  // Volver a la lista de tickets
  const handleBackToList = () => {
    setSelectedTicket(null);
    setNewMessage("");
    setAttachments([]);
  };

  // Cambiar el estado de un ticket
  const handleStatusChange = async (
    ticketId: string,
    newStatus: SupportTicket["status"]
  ) => {
    try {
      const { error } = await supabase
        .from("support_tickets")
        .update({
          status: newStatus,
          updated_at: new Date().toISOString(),
        })
        .eq("id", ticketId);

      if (error) throw error;

      // Actualizar el estado local
      setTickets(
        tickets.map((ticket) =>
          ticket.id === ticketId
            ? {
                ...ticket,
                status: newStatus,
                updated_at: new Date().toISOString(),
              }
            : ticket
        )
      );
    } catch (err) {
      console.error("Error actualizando estado del ticket:", err);
      setError(
        "No se pudo actualizar el estado del ticket. Por favor, intenta de nuevo."
      );
    }
  };

  // Manejar cambio en el mensaje
  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewMessage(e.target.value);
  };

  // Adjuntar archivo
  const handleFileAttach = () => {
    fileInputRef.current?.click();
  };

  // Procesar archivos seleccionados
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setAttachments([...attachments, ...filesArray]);
    }
  };

  // Eliminar adjunto
  const handleRemoveAttachment = (index: number) => {
    const newAttachments = [...attachments];
    newAttachments.splice(index, 1);
    setAttachments(newAttachments);
  };

  // Enviar mensaje
  const handleSendMessage = async () => {
    if (!newMessage.trim() && attachments.length === 0) return;
    if (!selectedTicket) return;
    /* if (!user?.id) return; */

    setSending(true);
    try {
      // Primero subimos los archivos adjuntos si existen
      const uploadedFiles = [];

      for (const file of attachments) {
        const fileExt = file.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random()
          .toString(36)
          .substring(2, 15)}.${fileExt}`;
        const filePath = `ticket_attachments/${selectedTicket}/${fileName}`;

        const { error: uploadError, data } = await supabase.storage
          .from("attachments")
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        if (data) {
          uploadedFiles.push({
            name: file.name,
            path: filePath,
          });
        }
      }

      // Creamos el mensaje
      const messageToSend = {
        ticket_id: selectedTicket,
        sender_id: user?.id,
        message: newMessage,
        is_from_admin: isAdmin,
        created_at: new Date().toISOString(),
        attachments:
          uploadedFiles.length > 0 ? JSON.stringify(uploadedFiles) : null,
      };

      // Guardamos el mensaje en la base de datos
      const { data: newMessageData, error: messageError } = await supabase
        .from("ticket_messages")
        .insert([messageToSend])
        .select();

      if (messageError) throw messageError;

      // Actualizamos el estado del ticket a "Respondido"
      await handleStatusChange(selectedTicket, "Respondido");

      // Actualizamos la interfaz
      if (newMessageData && newMessageData.length > 0) {
        setMessages((prev) => ({
          ...prev,
          [selectedTicket]: [
            ...(prev[selectedTicket] || []),
            newMessageData[0],
          ],
        }));
      }

      // Limpiamos el formulario
      setNewMessage("");
      setAttachments([]);
    } catch (err) {
      console.error("Error enviando mensaje:", err);
      setError("No se pudo enviar el mensaje. Por favor, intenta de nuevo.");
    } finally {
      setSending(false);
    }
  };

  // Filtrar tickets por estado
  const filteredTickets = statusFilter
    ? tickets.filter((ticket) => ticket.status === statusFilter)
    : tickets;

  // Obtener nombre del cliente por ID
  const getClientName = (clientId: string) => {
    const client = clients.find((c) => c.id === clientId);
    return client ? client.full_name : "Cliente Desconocido";
  };

  // Formatear fecha
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES");
  };

  // Contar mensajes de un ticket
  const countMessages = (ticketId: string) => {
    return messages[ticketId]?.length || 0;
  };

  // Mostrar pantalla de carga
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="flex flex-col items-center">
          <Loader className="w-8 h-8 text-indigo-600 animate-spin mb-4" />
          <p className="text-gray-600">Cargando tickets...</p>
        </div>
      </div>
    );
  }

  // Mostrar mensaje de error si existe
  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md">
        <div className="flex">
          <div className="flex-shrink-0">
            <AlertCircle className="h-5 w-5 text-red-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Vista de detalle del ticket
  if (selectedTicket) {
    const ticket = tickets.find((t) => t.id === selectedTicket);
    const ticketMessages = messages[selectedTicket] || [];
    const clientName = ticket ? getClientName(ticket.client_id) : "";

    return (
      <div className="space-y-6">
        {/* Encabezado con botón de regreso */}
        <div className="flex items-center mb-6">
          <button
            onClick={handleBackToList}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Volver a tickets
          </button>
        </div>

        {/* Información del ticket */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {ticket?.ticket_number}: {ticket?.subject}
              </h2>
              <div className="mt-2 flex items-center text-sm text-gray-600">
                <User className="w-4 h-4 mr-1" />
                <span className="mr-4">{clientName}</span>
                <Clock className="w-4 h-4 mr-1" />
                <span>
                  Creado: {ticket ? formatDate(ticket.created_at) : ""}
                </span>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <span
                className={`px-3 py-1 inline-flex text-sm font-medium rounded-full ${
                  ticket?.priority === "Alta"
                    ? "bg-red-100 text-red-800"
                    : ticket?.priority === "Media"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-green-100 text-green-800"
                }`}
              >
                Prioridad: {ticket?.priority}
              </span>
              <div className="mt-2">
                <select
                  value={ticket?.status}
                  onChange={(e) =>
                    handleStatusChange(
                      selectedTicket,
                      e.target.value as SupportTicket["status"]
                    )
                  }
                  className="border rounded-md px-3 py-1 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="Abierto">Abierto</option>
                  <option value="En Proceso">En Proceso</option>
                  <option value="Respondido">Respondido</option>
                  <option value="Cerrado">Cerrado</option>
                </select>
              </div>
            </div>
          </div>

          {/* Lista de mensajes */}
          <div className="space-y-4 mb-6 max-h-96 overflow-y-auto p-2">
            {loadingMessages ? (
              <div className="flex justify-center py-8">
                <Loader className="w-6 h-6 text-indigo-600 animate-spin" />
              </div>
            ) : ticketMessages.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No hay mensajes para mostrar.
              </div>
            ) : (
              ticketMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.is_from_admin ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-3/4 rounded-lg p-4 ${
                      msg.is_from_admin
                        ? "bg-blue-100 text-blue-900"
                        : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    <div className="text-sm mb-1 font-semibold">
                      {msg.is_from_admin ? "Administrador" : clientName}
                    </div>
                    <div className="text-sm whitespace-pre-wrap">
                      {msg.message}
                    </div>

                    {/* Mostrar adjuntos si existen */}
                    {msg.attachments && (
                      <div className="mt-2">
                        <div className="text-xs font-medium mb-1">Archivos adjuntos:</div>
                        <div className="flex flex-wrap gap-1">
                          {JSON.parse(msg.attachments).map((file: { name: string, path: string }, idx: number) => (
                            <a 
                              key={idx}
                              href={`${supabase.storage.from('attachments').getPublicUrl(file.path).data.publicUrl}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs bg-white text-blue-600 px-2 py-1 rounded border border-blue-200 hover:bg-blue-50"
                            >
                              {file.name}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="text-xs text-gray-500 mt-1">
                      {new Date(msg.created_at).toLocaleString()}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Formulario de respuesta */}
          <div className="border-t pt-4">
            <textarea
              value={newMessage}
              onChange={handleMessageChange}
              placeholder="Escribe tu respuesta..."
              className="w-full border rounded-lg p-3 mb-2 focus:ring-indigo-500 focus:border-indigo-500"
              rows={4}
              disabled={sending}
            />

            {/* Lista de archivos adjuntos */}
            {attachments.length > 0 && (
              <div className="mb-3">
                <div className="text-sm font-medium text-gray-700 mb-2">
                  Archivos adjuntos:
                </div>
                <div className="flex flex-wrap gap-2">
                  {attachments.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center bg-gray-100 rounded-md px-2 py-1"
                    >
                      <span className="text-sm text-gray-800 truncate max-w-xs">
                        {file.name}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveAttachment(index)}
                        className="ml-1 text-gray-500 hover:text-gray-700"
                        disabled={sending}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-between">
              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  multiple
                  className="hidden"
                  disabled={sending}
                />
                <button
                  type="button"
                  onClick={handleFileAttach}
                  className="flex items-center px-4 py-2 border rounded-md text-gray-600 hover:bg-gray-50"
                  disabled={sending}
                >
                  <PaperclipIcon className="w-4 h-4 mr-2" />
                  Adjuntar archivo
                </button>
              </div>
              <button
                type="button"
                onClick={handleSendMessage}
                disabled={
                  (!newMessage.trim() && attachments.length === 0) || sending
                }
                className={`flex items-center px-4 py-2 rounded-md text-white ${
                  (!newMessage.trim() && attachments.length === 0) || sending
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700"
                }`}
              >
                {sending ? (
                  <>
                    <Loader className="w-4 h-4 mr-2 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Enviar respuesta
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Vista de lista de tickets
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">
          Gestión de Tickets
        </h1>
        <div className="flex space-x-4">
          <button className="flex items-center px-4 py-2 border rounded-md text-gray-600 hover:bg-gray-50">
            <Filter className="w-4 h-4 mr-2" />
            Filtrar
          </button>
          <select
            className="border rounded-md px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">Todos los estados</option>
            <option value="Abierto">Abierto</option>
            <option value="En Proceso">En Proceso</option>
            <option value="Respondido">Respondido</option>
            <option value="Cerrado">Cerrado</option>
          </select>
        </div>
      </div>

      {filteredTickets.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <AlertCircle className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No hay tickets disponibles
          </h3>
          <p className="text-gray-600">
            No se encontraron tickets con los filtros actuales.
          </p>
        </div>
      ) : (
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
              {filteredTickets.map((ticket) => (
                <tr
                  key={ticket.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleTicketClick(ticket.id)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <MessageSquare className="h-5 w-5 text-gray-400 mr-2" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {ticket.ticket_number}
                        </div>
                        <div className="text-sm text-gray-500">
                          {ticket.subject}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <User className="h-5 w-5 text-gray-400 mr-2" />
                      <div className="text-sm text-gray-900">
                        {getClientName(ticket.client_id)}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        ticket.status === "Abierto"
                          ? "bg-yellow-100 text-yellow-800"
                          : ticket.status === "En Proceso"
                          ? "bg-blue-100 text-blue-800"
                          : ticket.status === "Respondido"
                          ? "bg-indigo-100 text-indigo-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {ticket.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`text-sm font-medium ${
                        ticket.priority === "Alta"
                          ? "text-red-600"
                          : ticket.priority === "Media"
                          ? "text-yellow-600"
                          : "text-green-600"
                      }`}
                    >
                      {ticket.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="h-4 w-4 mr-1" />
                      {formatDate(ticket.updated_at)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full text-xs font-medium">
                        {countMessages(ticket.id)} mensajes
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

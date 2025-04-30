import { useEffect, useState } from "react";
import { Search, Edit2, Eye, X, Calendar, Mail, Phone, Briefcase, MapPin, AlertCircle, CheckCircle, XCircle } from "lucide-react";
import { Client, NewResidenceApplication, OngoingResidenceProcess } from "../../types/types";
import { supabase } from "../../lib/supabase/client";
import Modal from "../../components/ModalComponent";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";

export default function ClientsManagement() {
  const [clients, setClients] = useState<Client[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  
  // Estados para los modales
  const [showDetails, setShowDetails] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [ongoingClient, setOngoingClient] = useState<OngoingResidenceProcess | null>(null);
  const [newClient, setNewClient] = useState<NewResidenceApplication | null>(null);
  
  // Estado para formulario de edición
  const [editForm, setEditForm] = useState<Client | null>(null);

  // Estados para alertas
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState<"success" | "error">("success");

  // Función para mostrar alertas
  const displayAlert = (message: string, type: "success" | "error") => {
    setAlertMessage(message);
    setAlertType(type);
    setShowAlert(true);
    
    // Auto-ocultar la alerta después de 5 segundos
    setTimeout(() => {
      setShowAlert(false);
    }, 5000);
  };

  const select = async (client: Client) => {
    setShowDetails(true);
    setSelectedClient(client);
    setOngoingClient(null);
    setNewClient(null);
    
    try {
      const { data: ongoingData, error: ongoingError } = await supabase
        .from("ongoing_residence_processes")
        .select("*")
        .eq("client_id", client.id);
      
      if (ongoingError) throw ongoingError;
      
      if (ongoingData && ongoingData.length > 0) {
        setOngoingClient(ongoingData[0]);
      } else {
        const { data: newData, error: newError } = await supabase
          .from("new_residence_applications")
          .select("*")
          .eq("client_id", client.id);
          
        if (newError) throw newError;
        setNewClient(newData?.[0] || null);
      }
    } catch (error) {
      console.error("Error al obtener datos del cliente:", error);
    }
  };

  const openEditForm = (client: Client) => {
    setSelectedClient(client);
    setEditForm({...client});
    setShowEditForm(true);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setEditForm(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      };
    });
  };

  const handleOngoingProcessChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setOngoingClient(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      };
    });
  };

  const handleSubmitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editForm) return;
    
    try {
      const { error } = await supabase
        .from("clients")
        .update(editForm)
        .eq("id", editForm.id);
        
        console.log("Editando cliente:", editForm);
        console.log("ProcessError:", error);
        
        
      if (error) throw error;
      
      // Si hay un proceso en curso, actualizar también esos datos
      if (ongoingClient) {
        const { error: processError } = await supabase
          .from("ongoing_residence_processes")
          .update(ongoingClient)
          .eq("id", ongoingClient.id);
          console.log("Updating ongoing process:", ongoingClient);
          console.log("ProcessError:", processError);
          
          
        if (processError) throw processError;
      }
      
      // Actualizar el estado local para reflejar los cambios
      setClients(prev => 
        prev.map(client => client.id === editForm.id ? editForm : client)
      );
      setFilteredClients(prev => 
        prev.map(client => client.id === editForm.id ? editForm : client)
      );
      
      setShowEditForm(false);
      displayAlert("Cliente actualizado correctamente", "success");
    } catch (error) {
      console.error("Error al actualizar cliente:", error);
      displayAlert("Error al actualizar el cliente. Inténtelo de nuevo.", "error");
    }
  };

  const applyFilters = () => {
    let filtered = [...clients];
    
    // Aplicar búsqueda
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(client => 
        client.full_name.toLowerCase().includes(term) ||
        client.passport_number.toLowerCase().includes(term) ||
        client.email.toLowerCase().includes(term)
      );
    }
    
    // Aplicar filtro de estado
    if (statusFilter) {
      if (statusFilter === "completed") {
        filtered = filtered.filter(client => client.has_completed_form);
      } else if (statusFilter === "process") {
        filtered = filtered.filter(client => !client.has_completed_form);
      }
    }
    
    setFilteredClients(filtered);
  };

  useEffect(() => {
    applyFilters();
  }, [searchTerm, statusFilter, clients]);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const { data, error } = await supabase
          .from("clients")
          .select("*")
          .order("created_at", { ascending: false });
          
        if (error) throw error;
        
        setClients(data || []);
        setFilteredClients(data || []);
      } catch (error) {
        console.error("Error al obtener clientes:", error);
      }
    };

    fetchClients();
  }, []);

  // Formatea la fecha para mostrar en formato legible
  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), "dd MMM yyyy", { locale: es });
    } catch (error) {
      return dateString;
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      {/* Alerta */}
      {showAlert && (
        <div className={`fixed top-5 right-5 z-50 p-4 rounded-lg shadow-lg flex items-center space-x-3 ${
          alertType === "success" ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"
        }`}>
          {alertType === "success" ? (
            <CheckCircle className="h-6 w-6 text-green-500" />
          ) : (
            <XCircle className="h-6 w-6 text-red-500" />
          )}
          <span className={alertType === "success" ? "text-green-800" : "text-red-800"}>
            {alertMessage}
          </span>
          <button 
            onClick={() => setShowAlert(false)}
            className="ml-2 text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}

      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Clientes</h1>
        </div>

        {/* Filtros y búsqueda */}
        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <div className="flex gap-4 flex-col sm:flex-row">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por nombre, pasaporte o email..." 
                className="pl-10 pr-4 py-3 w-full border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all" 
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white min-w-[180px] transition-all"
            >
              <option value="">Todos los estados</option>
              <option value="process">En Proceso</option>
              <option value="completed">Completado</option>
            </select>
          </div>
        </div>

        {/* Tabla de clientes */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pasaporte</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contacto</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trabajo actual</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Inicio</th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredClients.length > 0 ? (
                  filteredClients.map((client) => (
                    <tr key={client.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{client.full_name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{client.passport_number}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 flex items-center">
                          <Mail className="h-4 w-4 mr-1 text-gray-400" />
                          {client.email}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center mt-1">
                          <Phone className="h-4 w-4 mr-1 text-gray-400" />
                          {client.phone_number}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {client.current_job ? (
                          <div className="text-sm text-gray-900 flex items-center">
                            <Briefcase className="h-4 w-4 mr-1 text-gray-400" />
                            {client.current_job}
                            {client.current_agency && (
                              <span className="ml-1 text-gray-500">({client.current_agency})</span>
                            )}
                          </div>
                        ) : (
                          <span className="text-sm text-gray-500">No especificado</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span 
                          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            client.has_completed_form 
                              ? "bg-green-100 text-green-800" 
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {client.has_completed_form ? "Completado" : "En proceso"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 flex items-center">
                          <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                          {formatDate(client.created_at)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-3">
                          <button 
                            onClick={() => select(client)} 
                            className="text-indigo-600 hover:text-indigo-900 transition-colors p-1 rounded-full hover:bg-indigo-50"
                            title="Ver detalles"
                          >
                            <Eye className="h-5 w-5" />
                          </button>
                          <button 
                            onClick={() => openEditForm(client)} 
                            className="text-blue-600 hover:text-blue-900 transition-colors p-1 rounded-full hover:bg-blue-50"
                            title="Editar cliente"
                          >
                            <Edit2 className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-10 text-center text-gray-500">
                      <div className="flex flex-col items-center justify-center">
                        <AlertCircle className="h-12 w-12 text-gray-400 mb-3" />
                        <p className="text-lg font-medium">No se encontraron clientes</p>
                        <p className="text-sm">Intenta con otros criterios de búsqueda</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      {/* Modal para ver detalles */}
      <Modal
        title={selectedClient?.full_name || "Detalles del cliente"}
        subtitle={selectedClient?.email || ""}
        dark={false}
        open={showDetails}
        setOpen={setShowDetails}
        footer={
          <div className="flex justify-end w-full">
            <button 
              onClick={() => {
                setShowDetails(false);
                openEditForm(selectedClient!);
              }} 
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors mr-3"
            >
              <Edit2 className="h-4 w-4 inline mr-2" />
              Editar cliente
            </button>
            <button 
              onClick={() => setShowDetails(false)} 
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
            >
              Cerrar
            </button>
          </div>
        }
      >
        <div className="overflow-auto max-h-[70vh] p-4">
          {selectedClient && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-5 rounded-lg">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Información Personal</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Nombre completo:</span>
                    <span className="font-medium">{selectedClient.full_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Pasaporte:</span>
                    <span className="font-medium">{selectedClient.passport_number}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Fecha de nacimiento:</span>
                    <span className="font-medium">{selectedClient.date_of_birth}</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-5 rounded-lg">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Contacto</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Email:</span>
                    <span className="font-medium">{selectedClient.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Teléfono:</span>
                    <span className="font-medium">{selectedClient.phone_number}</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-5 rounded-lg">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Trabajo</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Trabajo actual:</span>
                    <span className="font-medium">{selectedClient.current_job || "No especificado"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Agencia:</span>
                    <span className="font-medium">{selectedClient.current_agency || "No especificado"}</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-5 rounded-lg">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Estado</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Estado:</span>
                    <span className={`font-medium px-3 py-1 rounded-full text-sm ${
                      selectedClient.has_completed_form 
                        ? "bg-green-100 text-green-800" 
                        : "bg-amber-100 text-amber-800"
                    }`}>
                      {selectedClient.has_completed_form ? "Completado" : "En proceso"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Fecha de inicio:</span>
                    <span className="font-medium">{formatDate(selectedClient.created_at)}</span>
                  </div>
                </div>
              </div>
              
              {/* Información del proceso de residencia si existe */}
              {ongoingClient && (
                <div className="bg-gray-50 p-5 rounded-lg md:col-span-2">
                  <h3 className="text-lg font-semibold mb-4 text-gray-800">Información del Proceso de Residencia</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Nombre:</span>
                        <span className="font-medium">{ongoingClient.first_name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Apellido:</span>
                        <span className="font-medium">{ongoingClient.last_name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Permiso de trabajo:</span>
                        <span className="font-medium">{ongoingClient.has_work_permit ? "Sí" : "No"}</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Voivodato:</span>
                        <span className="font-medium">{ongoingClient.voivodato}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Estado del proceso:</span>
                        <span className="font-medium">{ongoingClient.process_stage}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Número de caso:</span>
                        <span className="font-medium">{ongoingClient.case_number || "No especificado"}</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Dirección actual:</span>
                        <span className="font-medium">{ongoingClient.current_address}</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-500">WhatsApp:</span>
                        <span className="font-medium">{ongoingClient.whatsapp_number}</span>
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Progreso:</span>
                        <span className="font-medium">{ongoingClient.completed_steps} de {ongoingClient.total_steps} pasos completados</span>
                      </div>
                      <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="bg-indigo-600 h-2.5 rounded-full" 
                          style={{ width: `${Math.round((ongoingClient.completed_steps / ongoingClient.total_steps) * 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Información de la nueva aplicación de residencia si existe */}
              {newClient && (
                <div className="bg-gray-50 p-5 rounded-lg md:col-span-2">
                  <h3 className="text-lg font-semibold mb-4 text-gray-800">Información de la Nueva Aplicación de Residencia</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Lugar de nacimiento:</span>
                        <span className="font-medium">{newClient.place_of_birth}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Número PESEL:</span>
                        <span className="font-medium">{newClient.pesel_number}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Altura:</span>
                        <span className="font-medium">{newClient.height_cm} cm</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Color de ojos:</span>
                        <span className="font-medium">{newClient.eye_color}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Color de pelo:</span>
                        <span className="font-medium">{newClient.hair_color}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Tatuajes:</span>
                        <span className="font-medium">{newClient.has_tattoos ? "Sí" : "No"}</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Nombre del padre:</span>
                        <span className="font-medium">{newClient.father_name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Nombre de la madre:</span>
                        <span className="font-medium">{newClient.mother_name}</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Estado civil:</span>
                        <span className="font-medium">{newClient.marital_status}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Nivel educativo:</span>
                        <span className="font-medium">{newClient.education_level}</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Dirección:</span>
                        <span className="font-medium">{newClient.address}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Ciudad:</span>
                        <span className="font-medium">{newClient.city}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Código postal:</span>
                        <span className="font-medium">{newClient.zip_code}</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Fecha de entrada a la UE:</span>
                        <span className="font-medium">{newClient.eu_entry_date}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Fecha de llegada a Polonia:</span>
                        <span className="font-medium">{newClient.poland_arrival_date}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Método de transporte:</span>
                        <span className="font-medium">{newClient.transport_method}</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Viajes en los últimos 5 años:</span>
                        <span className="font-medium">{newClient.traveled_last_5_years ? "Sí" : "No"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Familiares en Polonia:</span>
                        <span className="font-medium">{newClient.has_relatives_in_poland ? "Sí" : "No"}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </Modal>
      
      {/* Modal para editar cliente */}
      <Modal
        title={`Editar cliente: ${selectedClient?.full_name || ""}`}
        subtitle="Modifica la información del cliente"
        dark={false}
        open={showEditForm}
        setOpen={setShowEditForm}
        footer={null}
      >
        {editForm && (
          <form onSubmit={handleSubmitEdit} className="overflow-auto max-h-[70vh] p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-700">Información Personal</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre completo</label>
                  <input 
                    type="text" 
                    name="full_name"
                    value={editForm.full_name}
                    onChange={handleEditChange}
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm py-2 px-3 border"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Número de pasaporte</label>
                  <input 
                    type="text" 
                    name="passport_number"
                    value={editForm.passport_number}
                    onChange={handleEditChange}
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm py-2 px-3 border"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de nacimiento</label>
                  <input 
                    type="date" 
                    name="date_of_birth"
                    value={editForm.date_of_birth}
                    onChange={handleEditChange}
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm py-2 px-3 border"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-gray-700">Contacto</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input 
                    type="email" 
                    name="email"
                    value={editForm.email}
                    onChange={handleEditChange}
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm py-2 px-3 border"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                  <input 
                    type="tel" 
                    name="phone_number"
                    value={editForm.phone_number}
                    onChange={handleEditChange}
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm py-2 px-3 border"
                    required
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-gray-700">Trabajo</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Trabajo actual</label>
                  <input 
                    type="text" 
                    name="current_job"
                    value={editForm.current_job || ""}
                    onChange={handleEditChange}
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm py-2 px-3 border"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Agencia</label>
                  <input 
                    type="text" 
                    name="current_agency"
                    value={editForm.current_agency || ""}
                    onChange={handleEditChange}
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm py-2 px-3 border"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-gray-700">Estado</h3>
                <div className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    id="has_completed_form"
                    name="has_completed_form"
                    checked={editForm.has_completed_form}
                    onChange={handleEditChange}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="has_completed_form" className="text-sm font-medium text-gray-700">
                    Formulario completado
                  </label>
                </div>
              </div>
            </div>
            
            {/* Sección de proceso de residencia en curso si existe */}
            {ongoingClient && (
              <div className="mt-8 border-t pt-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-700">Información del Proceso de Residencia</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                      <input 
                        type="text" 
                        name="first_name"
                        value={ongoingClient.first_name}
                        onChange={handleOngoingProcessChange}
                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm py-2 px-3 border"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Apellido</label>
                      <input 
                        type="text" 
                        name="last_name"
                        value={ongoingClient.last_name}
                        onChange={handleOngoingProcessChange}
                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm py-2 px-3 border"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <input 
                        type="checkbox" 
                        id="has_work_permit"
                        name="has_work_permit"
                        checked={ongoingClient.has_work_permit}
                        onChange={handleOngoingProcessChange}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <label htmlFor="has_work_permit" className="text-sm font-medium text-gray-700">
                        Tiene permiso de trabajo
                      </label>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Voivodato</label>
                      <select
                        name="voivodato"
                        value={ongoingClient.voivodato}
                        onChange={handleOngoingProcessChange}
                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm py-2 px-3 border"
                      >
                        <option value="">Seleccionar...</option>
                        <option value="Dolnośląskie">Dolnośląskie</option>
                        <option value="Kujawsko-Pomorskie">Kujawsko-Pomorskie</option>
                        <option value="Lubelskie">Lubelskie</option>
                        <option value="Lubuskie">Lubuskie</option>
                        <option value="Łódzkie">Łódzkie</option>
                        <option value="Małopolskie">Małopolskie</option>
                        <option value="Mazowieckie">Mazowieckie</option>
                        <option value="Opolskie">Opolskie</option>
                        <option value="Podkarpackie">Podkarpackie</option>
                        <option value="Podlaskie">Podlaskie</option>
                        <option value="Pomorskie">Pomorskie</option>
                        <option value="Śląskie">Śląskie</option>
                        <option value="Świętokrzyskie">Świętokrzyskie</option>
                        <option value="Warmińsko-Mazurskie">Warmińsko-Mazurskie</option>
                        <option value="Wielkopolskie">Wielkopolskie</option>
                        <option value="Zachodniopomorskie">Zachodniopomorskie</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Etapa del proceso</label>
                      <select
                        name="process_stage"
                        value={ongoingClient.process_stage}
                        onChange={handleOngoingProcessChange}
                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm py-2 px-3 border"
                      >
                        <option value="">Seleccionar...</option>
                        <option value="Preparación de documentos">Preparación de documentos</option>
                        <option value="Presentación de solicitud">Presentación de solicitud</option>
                        <option value="En revisión">En revisión</option>
                        <option value="Entrevista programada">Entrevista programada</option>
                        <option value="Documentos adicionales requeridos">Documentos adicionales requeridos</option>
                        <option value="Decisión pendiente">Decisión pendiente</option>
                        <option value="Aprobado">Aprobado</option>
                        <option value="Rechazado">Rechazado</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Número de caso</label>
                      <input 
                        type="text" 
                        name="case_number"
                        value={ongoingClient.case_number || ""}
                        onChange={handleOngoingProcessChange}
                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm py-2 px-3 border"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Dirección actual</label>
                    <input 
                      type="text" 
                      name="current_address"
                      value={ongoingClient.current_address}
                      onChange={handleOngoingProcessChange}
                      className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm py-2 px-3 border"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Número de WhatsApp</label>
                    <input 
                      type="text" 
                      name="whatsapp_number"
                      value={ongoingClient.whatsapp_number}
                      onChange={handleOngoingProcessChange}
                      className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm py-2 px-3 border"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Progreso del proceso</label>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Pasos completados</label>
                        <input 
                          type="number" 
                          name="completed_steps"
                          value={ongoingClient.completed_steps}
                          onChange={handleOngoingProcessChange}
                          min="0"
                          max={ongoingClient.total_steps}
                          className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm py-2 px-3 border"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Total de pasos</label>
                        <input 
                          type="number" 
                          name="total_steps"
                          value={ongoingClient.total_steps}
                          onChange={handleOngoingProcessChange}
                          min="1"
                          className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm py-2 px-3 border"
                        />
                      </div>
                    </div>
                    <div className="mt-2">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="bg-indigo-600 h-2.5 rounded-full" 
                          style={{ width: `${Math.round((ongoingClient.completed_steps / ongoingClient.total_steps) * 100)}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-500 text-right mt-1">
                        {Math.round((ongoingClient.completed_steps / ongoingClient.total_steps) * 100)}% completado
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Botones del formulario */}
            <div className="mt-8 pt-5 border-t border-gray-200 flex justify-end">
              <button
                type="button"
                onClick={() => setShowEditForm(false)}
                className="mr-3 bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Guardar cambios
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
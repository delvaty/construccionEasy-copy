import { useEffect, useState } from "react";
import { Search, Plus, Edit2, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Client, NewResidenceApplication, OngoingResidenceProcess } from "../../types/types";
import { supabase } from "../../lib/supabase/client";
import Modal from "../../components/ModalComponent";
import ClientDetail from "./ClientDetail";
import OngoingResidenceDetails from "./OngoingClientProcess";

export default function ClientsManagement() {
  const [clients, setClients] = useState<Client[]>([]);

  const [showDetails, setShowDetails] = useState(false);

  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [ongoingClient, setOngoingClient] = useState<OngoingResidenceProcess | null>(null);
  const [newClient, setNewClient] = useState<NewResidenceApplication | null>(null);

  const select = async (client: Client) => {
    setShowDetails(true);
    setSelectedClient(client);
    setOngoingClient(null);
    setNewClient(null);
    var { data, error } = await supabase.from("ongoing_residence_processes").select("*").eq("client_id", client.id);
    if (data != null && data?.length > 0) {
      setOngoingClient(data[0]);
    } else {
      var { data, error } = await supabase.from("new_residence_applications").select("*").eq("client_id", client.id);
      setNewClient(data[0]);
    }
  };

  useEffect(() => {
    const fetchClients = async () => {
      const { data, error } = await supabase.from("clients").select("*").order("id", { ascending: false }); // Ordena de más reciente a más antiguo

      if (error) {
        console.error("Error al obtener clientes:", error.message);
        return;
      }

      setClients(data || []);
    };

    fetchClients();
  }, []);

  return (
    <div>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">Gestión de Clientes</h1>
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 flex items-center">
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Cliente
          </button>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input type="text" placeholder="Buscar por nombre, número de caso o pasaporte..." className="pl-10 pr-4 py-2 w-full border rounded-md focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
            <select className="border rounded-md px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500">
              <option value="">Todos los estados</option>
              <option value="process">En Proceso</option>
              <option value="completed">Completado</option>
              <option value="pending">Pendiente</option>
            </select>
          </div>
        </div>

        {/* Clients Table */}
        <div className="bg-white rounded-lg shadow-md overflow-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Número de Caso</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pasaporte</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contacto</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trabajo actual</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Inicio</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {clients.map((client) => (
                <tr key={client.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{client.full_name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">54545</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{client.passport_number}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{client.email}</div>
                    <div className="text-sm text-gray-500">{client.phone_number}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {client.current_job} ({client.current_agency})
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${client.has_completed_form ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>{client.has_completed_form ? "Completado" : "En proceso"}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{client.created_at}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-3">
                      <button aria-label="Ver detalles" onClick={() => select(client)} className="text-indigo-600 hover:text-indigo-900">
                        <Eye className="h-5 w-5" />
                      </button>
                      <button aria-label="Editar datos del cliente" className="text-blue-600 hover:text-blue-900">
                        <Edit2 className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Modal
        title="Detalles del cliente"
        subtitle="Amet officia ad incididunt esse."
        dark={false}
        open={showDetails}
        setOpen={setShowDetails}
        footer={
          <button onClick={() => setShowDetails(false)} className="px-4 py-2 bg-red-500 text-white rounded-md">
            Cerrar
          </button>
        }
      >
        <div className="overflow-auto max-h-[70vh] p-4">
          {/* <ClientDetail /> */}
          {ongoingClient != null ? <OngoingResidenceDetails user={selectedClient} data={ongoingClient} /> : <></>}
        </div>
      </Modal>
    </div>
  );
}

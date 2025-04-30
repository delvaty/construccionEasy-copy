import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { User, Calendar, Flag, MapPin, FileText, Clock, Phone, Mail, Building2, AlertTriangle, Save, ArrowLeft, Upload, CheckCircle2 } from "lucide-react";
import { Client, OngoingResidenceProcess } from "../../types/types";
import ClientsDocuments from "./ClientDocuments";

interface OngoingResidenceDetailsProps {
  data: OngoingResidenceProcess;
  user: Client | null;
}

const OngoingResidenceDetails: React.FC<OngoingResidenceDetailsProps> = ({ data, user }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock client data - In production, this would be fetched from an API
  const [client, setClient] = useState({
    personalInfo: {
      fullName: `${data.first_name} ${data.last_name}`,
      passport: user?.passport_number,
      birthDate: user?.date_of_birth,
      nationality: "N/D",
      hasWordPermit: data.has_work_permit,
      phone: user?.phone_number,
      whatsapp_number: data.whatsapp_number,
      email: user?.email,
    },
    processInfo: {
      caseNumber: data.case_number,
      processType: "Residencia Temporal",
      startDate: "15/01/2025",
      voivodeship: data.voivodato,
      currentStatus: "En Proceso",
      currentStage: data.process_stage,
      employer: "Prosper",
      workAddress: data.current_address,
      completed_steps: data.completed_steps,
      total_steps: data.total_steps,
    },
    documents: [
      {
        name: "Carta Amarilla",
        status: "Verificado",
        date: "01/02/2025",
        type: "PDF",
      },
      {
        name: "Pasaporte",
        status: "Verificado",
        date: "15/01/2025",
        type: "PDF",
      },
    ],
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editedClient, setEditedClient] = useState(client);

  const handleSave = () => {
    setClient(editedClient);
    setIsEditing(false);
  };

  const statusOptions = ["En Proceso", "Documentación Pendiente", "Esperando Cita", "Completado", "Rechazado"];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4"></div>
        <div className="flex space-x-4">
          {isEditing ? (
            <>
              <button onClick={handleSave} className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700 flex items-center">
                <Save className="w-4 h-4 mr-2" />
                Guardar Cambios
              </button>
              <button
                onClick={() => {
                  setEditedClient(client);
                  setIsEditing(false);
                }}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-300"
              >
                Cancelar
              </button>
            </>
          ) : (
            // <button onClick={() => setIsEditing(true)} className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700">
            //   Editar Información
            // </button>
            <div></div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Information */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <User className="h-5 w-5 mr-2 text-gray-500" />
            Información Personal
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nombre Completo</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editedClient.personalInfo.fullName}
                  onChange={(e) =>
                    setEditedClient({
                      ...editedClient,
                      personalInfo: {
                        ...editedClient.personalInfo,
                        fullName: e.target.value,
                      },
                    })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              ) : (
                <p className="mt-1 text-sm text-gray-900">{client.personalInfo.fullName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Pasaporte</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editedClient.personalInfo.passport}
                  onChange={(e) =>
                    setEditedClient({
                      ...editedClient,
                      personalInfo: {
                        ...editedClient.personalInfo,
                        passport: e.target.value,
                      },
                    })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              ) : (
                <p className="mt-1 text-sm text-gray-900">{client.personalInfo.passport}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Fecha de Nacimiento</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editedClient.personalInfo.birthDate}
                  onChange={(e) =>
                    setEditedClient({
                      ...editedClient,
                      personalInfo: {
                        ...editedClient.personalInfo,
                        birthDate: e.target.value,
                      },
                    })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              ) : (
                <p className="mt-1 text-sm text-gray-900">{client.personalInfo.birthDate}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Nacionalidad</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editedClient.personalInfo.nationality}
                  onChange={(e) =>
                    setEditedClient({
                      ...editedClient,
                      personalInfo: {
                        ...editedClient.personalInfo,
                        nationality: e.target.value,
                      },
                    })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              ) : (
                <p className="mt-1 text-sm text-gray-900">{client.personalInfo.nationality}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Teléfono</label>
              {isEditing ? (
                <input
                  type="tel"
                  value={editedClient.personalInfo.phone}
                  onChange={(e) =>
                    setEditedClient({
                      ...editedClient,
                      personalInfo: {
                        ...editedClient.personalInfo,
                        phone: e.target.value,
                      },
                    })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              ) : (
                <p className="mt-1 text-sm text-gray-900">{client.personalInfo.phone}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Whatsapp</label>
              {isEditing ? (
                <input
                  type="tel"
                  value={editedClient.personalInfo.whatsapp_number}
                  onChange={(e) =>
                    setEditedClient({
                      ...editedClient,
                      personalInfo: {
                        ...editedClient.personalInfo,
                        whatsapp_number: e.target.value,
                      },
                    })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              ) : (
                <p className="mt-1 text-sm text-gray-900">{client.personalInfo.whatsapp_number}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              {isEditing ? (
                <input
                  type="email"
                  value={editedClient.personalInfo.email}
                  onChange={(e) =>
                    setEditedClient({
                      ...editedClient,
                      personalInfo: {
                        ...editedClient.personalInfo,
                        email: e.target.value,
                      },
                    })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              ) : (
                <p className="mt-1 text-sm text-gray-900">{client.personalInfo.email}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Permiso de trabajo</label>
              {isEditing ? (
                <div className="flex gap-2 items-center mt-2">
                  <input
                    type="checkbox"
                    checked={editedClient.personalInfo.hasWordPermit}
                    onChange={(e) =>
                      setEditedClient({
                        ...editedClient,
                        personalInfo: {
                          ...editedClient.personalInfo,
                          hasWordPermit: e.target.checked,
                        },
                      })
                    }
                    className="block w-6 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                  <label className="block text-sm text-gray-700 max-w-52">Marca este check si el cliente tiene permiso de trabajo</label>
                </div>
              ) : (
                <p className="mt-1 text-sm text-gray-900">{client.personalInfo.hasWordPermit ? "Tiene permiso de trabajo" : "No tiene permiso de trabajo"}</p>
              )}
            </div>
          </div>
        </div>

        {/* Process Information */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <FileText className="h-5 w-5 mr-2 text-gray-500" />
            Información del Proceso
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Número de Caso</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editedClient.processInfo.caseNumber}
                  onChange={(e) =>
                    setEditedClient({
                      ...editedClient,
                      processInfo: {
                        ...editedClient.processInfo,
                        caseNumber: e.target.value,
                      },
                    })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              ) : (
                <p className="mt-1 text-sm text-gray-900">{client.processInfo.caseNumber}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Tipo de Proceso</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editedClient.processInfo.processType}
                  onChange={(e) =>
                    setEditedClient({
                      ...editedClient,
                      processInfo: {
                        ...editedClient.processInfo,
                        processType: e.target.value,
                      },
                    })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              ) : (
                <p className="mt-1 text-sm text-gray-900">{client.processInfo.processType}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Fecha de Inicio</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editedClient.processInfo.startDate}
                  onChange={(e) =>
                    setEditedClient({
                      ...editedClient,
                      processInfo: {
                        ...editedClient.processInfo,
                        startDate: e.target.value,
                      },
                    })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              ) : (
                <p className="mt-1 text-sm text-gray-900">{client.processInfo.startDate}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Voivodato</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editedClient.processInfo.voivodeship}
                  onChange={(e) =>
                    setEditedClient({
                      ...editedClient,
                      processInfo: {
                        ...editedClient.processInfo,
                        voivodeship: e.target.value,
                      },
                    })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              ) : (
                <p className="mt-1 text-sm text-gray-900">{client.processInfo.voivodeship}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Estado Actual</label>
              {isEditing ? (
                <select
                  value={editedClient.processInfo.currentStatus}
                  onChange={(e) =>
                    setEditedClient({
                      ...editedClient,
                      processInfo: {
                        ...editedClient.processInfo,
                        currentStatus: e.target.value,
                      },
                    })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              ) : (
                <p className="mt-1 text-sm text-gray-900">{client.processInfo.currentStatus}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Empleador</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editedClient.processInfo.employer}
                  onChange={(e) =>
                    setEditedClient({
                      ...editedClient,
                      processInfo: {
                        ...editedClient.processInfo,
                        employer: e.target.value,
                      },
                    })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              ) : (
                <p className="mt-1 text-sm text-gray-900">{client.processInfo.employer}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Dirección de Trabajo</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editedClient.processInfo.workAddress}
                  onChange={(e) =>
                    setEditedClient({
                      ...editedClient,
                      processInfo: {
                        ...editedClient.processInfo,
                        workAddress: e.target.value,
                      },
                    })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              ) : (
                <p className="mt-1 text-sm text-gray-900">{client.processInfo.workAddress}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Etapas completadas</label>

              <p className="mt-1 text-sm text-gray-900">
                {client.processInfo.completed_steps} de {client.processInfo.total_steps}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Documents Section */}
      <ClientsDocuments client={user} isEditing={isEditing} />
    </div>
  );
};

export default OngoingResidenceDetails;

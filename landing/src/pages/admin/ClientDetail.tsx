import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  User, Calendar, Flag, MapPin, FileText, Clock, 
  Phone, Mail, Building2, AlertTriangle, Save, ArrowLeft,
  Upload, CheckCircle2
} from 'lucide-react';

export default function ClientDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Mock client data - In production, this would be fetched from an API
  const [client, setClient] = useState({
    personalInfo: {
      fullName: "María García López",
      passport: "XDG123456",
      birthDate: "15/05/1990",
      nationality: "Española",
      phone: "+48 123 456 789",
      email: "maria@email.com"
    },
    processInfo: {
      caseNumber: "ABC-1234",
      processType: "Residencia Temporal",
      startDate: "15/01/2025",
      voivodeship: "Varmisko mazurskie",
      currentStatus: "En Proceso",
      currentStage: "Verificación de documentos",
      employer: "Prosper",
      workAddress: "Mazurska 24 Lukta"
    },
    documents: [
      {
        name: "Carta Amarilla",
        status: "Verificado",
        date: "01/02/2025",
        type: "PDF"
      },
      {
        name: "Pasaporte",
        status: "Verificado",
        date: "15/01/2025",
        type: "PDF"
      }
    ]
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editedClient, setEditedClient] = useState(client);

  const handleSave = () => {
    setClient(editedClient);
    setIsEditing(false);
  };

  const statusOptions = [
    "En Proceso",
    "Documentación Pendiente",
    "Esperando Cita",
    "Completado",
    "Rechazado"
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => navigate('/admin/clientes')}
            className="text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <h1 className="text-2xl font-semibold text-gray-900">
            Detalles del Cliente
          </h1>
        </div>
        <div className="flex space-x-4">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700 flex items-center"
              >
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
            <button
              onClick={() => setIsEditing(true)}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700"
            >
              Editar Información
            </button>
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
                  onChange={(e) => setEditedClient({
                    ...editedClient,
                    personalInfo: {
                      ...editedClient.personalInfo,
                      fullName: e.target.value
                    }
                  })}
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
                  onChange={(e) => setEditedClient({
                    ...editedClient,
                    personalInfo: {
                      ...editedClient.personalInfo,
                      passport: e.target.value
                    }
                  })}
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
                  onChange={(e) => setEditedClient({
                    ...editedClient,
                    personalInfo: {
                      ...editedClient.personalInfo,
                      birthDate: e.target.value
                    }
                  })}
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
                  onChange={(e) => setEditedClient({
                    ...editedClient,
                    personalInfo: {
                      ...editedClient.personalInfo,
                      nationality: e.target.value
                    }
                  })}
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
                  type="text"
                  value={editedClient.personalInfo.phone}
                  onChange={(e) => setEditedClient({
                    ...editedClient,
                    personalInfo: {
                      ...editedClient.personalInfo,
                      phone: e.target.value
                    }
                  })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              ) : (
                <p className="mt-1 text-sm text-gray-900">{client.personalInfo.phone}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              {isEditing ? (
                <input
                  type="email"
                  value={editedClient.personalInfo.email}
                  onChange={(e) => setEditedClient({
                    ...editedClient,
                    personalInfo: {
                      ...editedClient.personalInfo,
                      email: e.target.value
                    }
                  })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              ) : (
                <p className="mt-1 text-sm text-gray-900">{client.personalInfo.email}</p>
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
                  onChange={(e) => setEditedClient({
                    ...editedClient,
                    processInfo: {
                      ...editedClient.processInfo,
                      caseNumber: e.target.value
                    }
                  })}
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
                  onChange={(e) => setEditedClient({
                    ...editedClient,
                    processInfo: {
                      ...editedClient.processInfo,
                      processType: e.target.value
                    }
                  })}
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
                  onChange={(e) => setEditedClient({
                    ...editedClient,
                    processInfo: {
                      ...editedClient.processInfo,
                      startDate: e.target.value
                    }
                  })}
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
                  onChange={(e) => setEditedClient({
                    ...editedClient,
                    processInfo: {
                      ...editedClient.processInfo,
                      voivodeship: e.target.value
                    }
                  })}
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
                  onChange={(e) => setEditedClient({
                    ...editedClient,
                    processInfo: {
                      ...editedClient.processInfo,
                      currentStatus: e.target.value
                    }
                  })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>{status}</option>
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
                  onChange={(e) => setEditedClient({
                    ...editedClient,
                    processInfo: {
                      ...editedClient.processInfo,
                      employer: e.target.value
                    }
                  })}
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
                  onChange={(e) => setEditedClient({
                    ...editedClient,
                    processInfo: {
                      ...editedClient.processInfo,
                      workAddress: e.target.value
                    }
                  })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              ) : (
                <p className="mt-1 text-sm text-gray-900">{client.processInfo.workAddress}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Documents Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <FileText className="h-5 w-5 mr-2 text-gray-500" />
            Documentos
          </h2>
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 flex items-center">
            <Upload className="w-4 h-4 mr-2" />
            Subir Documento
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Documento
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {client.documents.map((doc, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 text-gray-400 mr-2" />
                      <span className="text-sm font-medium text-gray-900">{doc.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      {doc.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {doc.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-3">
                      <button className="text-indigo-600 hover:text-indigo-900">Ver</button>
                      <button className="text-indigo-600 hover:text-indigo-900">Descargar</button>
                      {isEditing && (
                        <button className="text-red-600 hover:text-red-900">Eliminar</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

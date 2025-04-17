import React from 'react';
import { Clock, CheckCircle2, AlertTriangle, Filter } from 'lucide-react';

export default function ProcessManagement() {
  const processes = [
    {
      id: 1,
      client: "María García",
      type: "Residencia Temporal",
      status: "En Proceso",
      currentStage: "Verificación de documentos",
      nextDeadline: "20/03/2025",
      progress: 65,
      alerts: ["Documentos pendientes de revisión"]
    },
    {
      id: 2,
      client: "John Smith",
      type: "Carta Amarilla",
      status: "Pendiente",
      currentStage: "Esperando cita",
      nextDeadline: "15/03/2025",
      progress: 30,
      alerts: ["Cita próxima"]
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Gestión de Procesos</h1>
        <div className="flex space-x-4">
          <button className="flex items-center px-4 py-2 border rounded-md text-gray-600 hover:bg-gray-50">
            <Filter className="w-4 h-4 mr-2" />
            Filtrar
          </button>
          <select className="border rounded-md px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500">
            <option value="">Todos los tipos</option>
            <option value="residence">Residencia Temporal</option>
            <option value="yellow">Carta Amarilla</option>
          </select>
        </div>
      </div>

      <div className="grid gap-6">
        {processes.map((process) => (
          <div key={process.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900">{process.client}</h3>
                <p className="text-sm text-gray-500">{process.type}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                process.status === 'En Proceso' 
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {process.status}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-gray-400 mr-2" />
                <div>
                  <p className="text-sm text-gray-500">Próxima fecha límite</p>
                  <p className="font-medium">{process.nextDeadline}</p>
                </div>
              </div>
              <div className="flex items-center">
                <CheckCircle2 className="h-5 w-5 text-gray-400 mr-2" />
                <div>
                  <p className="text-sm text-gray-500">Etapa actual</p>
                  <p className="font-medium">{process.currentStage}</p>
                </div>
              </div>
              <div className="flex items-center">
                <AlertTriangle className="h-5 w-5 text-gray-400 mr-2" />
                <div>
                  <p className="text-sm text-gray-500">Alertas</p>
                  <p className="font-medium text-red-600">{process.alerts.length}</p>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span>Progreso</span>
                <span>{process.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-indigo-600 h-2 rounded-full" 
                  style={{ width: `${process.progress}%` }}
                ></div>
              </div>
            </div>

            {process.alerts.length > 0 && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertTriangle className="h-5 w-5 text-red-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">Alertas activas</h3>
                    <div className="mt-2 text-sm text-red-700">
                      <ul className="list-disc pl-5 space-y-1">
                        {process.alerts.map((alert, index) => (
                          <li key={index}>{alert}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

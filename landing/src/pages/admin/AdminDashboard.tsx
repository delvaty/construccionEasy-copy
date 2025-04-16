import React from 'react';
import { Users, Clock, CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react';

export default function AdminDashboard() {
  const stats = {
    totalClients: 156,
    activeProcesses: 89,
    pendingDocuments: 34,
    urgentCases: 12
  };

  const recentActivity = [
    {
      id: 1,
      client: "María García",
      action: "Documento actualizado",
      process: "Carta Amarilla",
      time: "Hace 5 minutos"
    },
    {
      id: 2,
      client: "John Smith",
      action: "Nuevo ticket creado",
      process: "Consulta sobre cita",
      time: "Hace 15 minutos"
    },
    {
      id: 3,
      client: "Ana López",
      action: "Proceso iniciado",
      process: "Residencia temporal",
      time: "Hace 1 hora"
    }
  ];

  const urgentTasks = [
    {
      id: 1,
      client: "Pedro Martínez",
      task: "Revisión de documentación pendiente",
      deadline: "Hoy"
    },
    {
      id: 2,
      client: "Laura White",
      task: "Cita próxima a vencer",
      deadline: "Mañana"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-blue-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Clientes</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalClients}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-green-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Procesos Activos</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.activeProcesses}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <Loader2 className="h-8 w-8 text-yellow-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Docs. Pendientes</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.pendingDocuments}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <AlertTriangle className="h-8 w-8 text-red-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Casos Urgentes</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.urgentCases}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Actividad Reciente</h2>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between border-b pb-4">
                <div>
                  <p className="font-medium text-gray-900">{activity.client}</p>
                  <p className="text-sm text-gray-500">{activity.action} - {activity.process}</p>
                </div>
                <span className="text-sm text-gray-400">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Urgent Tasks */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Tareas Urgentes</h2>
          <div className="space-y-4">
            {urgentTasks.map((task) => (
              <div key={task.id} className="flex items-center justify-between bg-red-50 p-4 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{task.client}</p>
                  <p className="text-sm text-gray-600">{task.task}</p>
                </div>
                <span className="text-sm font-medium text-red-600">Vence: {task.deadline}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

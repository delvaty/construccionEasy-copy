import { useState, useEffect, ChangeEvent } from 'react';
import { Users, Clock, CheckCircle2, AlertTriangle, FileText, Save } from 'lucide-react';
import { supabase } from "../../lib/supabase/client";
import { Client, AdminStats, AdminActivityItem, AdminUrgentTask } from "../../types/types";
// Importar el módulo de registro de actividades
import {
  logUserActivity,
  logProcessUpdate,
} from "../../lib/activity-logger";

export default function AdminDashboard() {
  // Estados para almacenar datos de Supabase
  const [stats, setStats] = useState<AdminStats>({
    totalClients: 0,
    activeProcesses: 0,
    pendingDocuments: 0,
    urgentCases: 0
  });
  
  const [recentActivity, setRecentActivity] = useState<AdminActivityItem[]>([]);
  const [allClients, setAllClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<string>("");
  const [clientInfo, setClientInfo] = useState<{
    id: string;
    fullName: string;
    processStartDate: string;
    nextStepTitle: string;
    nextStepText: string;
  } | null>(null);
  const [urgentTasks, setUrgentTasks] = useState<AdminUrgentTask[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  // Función para cargar las estadísticas
  const loadStats = async (): Promise<void> => {
    try {
      // Contar clientes
      const { count: clientCount, error: clientError } = await supabase
        .from('clients')
        .select('*', { count: 'exact', head: true });

      // Contar procesos activos
      const { count: processCount, error: processError } = await supabase
        .from('ongoing_residence_processes')
        .select('*', { count: 'exact', head: true });

      // Contar documentos pendientes
      const { count: docsCount, error: docsError } = await supabase
        .from('client_documents')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'Pendiente');

      // Contar alertas urgentes
      const { count: alertsCount, error: alertsError } = await supabase
        .from('alerts')
        .select('*', { count: 'exact', head: true })
        .eq('priority', 'Alta')
        .eq('status', 'Pendiente');

      if (clientError || processError || docsError || alertsError) {
        console.error("Error al cargar estadísticas:", { clientError, processError, docsError, alertsError });
        return;
      }

      setStats({
        totalClients: clientCount || 0,
        activeProcesses: processCount || 0,
        pendingDocuments: docsCount || 0,
        urgentCases: alertsCount || 0
      });
    } catch (error) {
      console.error("Error al cargar estadísticas:", error);
    }
  };

  // Función mejorada para cargar la actividad reciente
  const loadRecentActivity = async (): Promise<void> => {
    try {
      // Obtener los últimos 10 registros de actividad (aumentado para capturar más actividades de usuario)
      const { data, error } = await supabase
        .from('activity_logs')
        .select(`
          id,
          description,
          activity_type,
          created_at,
          clients!inner(full_name)
        `)
        .order('created_at', { ascending: false })
        .limit(10);

        console.log("Datos de actividad reciente:", data); // Debugging line
        

      if (error) {
        console.error("Error al cargar actividad reciente:", error);
        return;
      }

      // Formatear los datos para mostrarlos
      const formattedActivity = data ? data.map((log: any) => {
        // Calcular tiempo relativo
        const timeAgo = getTimeAgo(new Date(log.created_at));
        
        return {
          id: log.id,
          client: log.clients.full_name,
          action: log.activity_type,
          process: log.description,
          time: timeAgo
        };
      }) : [];

      setRecentActivity(formattedActivity);
    } catch (error) {
      console.error("Error al cargar actividad reciente:", error);
    }
  };

  // Función para cargar todos los clientes
  const loadAllClients = async (): Promise<void> => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('full_name', { ascending: true });

      if (error) {
        console.error("Error al cargar clientes:", error);
        return;
      }

      setAllClients(data || []);
    } catch (error) {
      console.error("Error al cargar clientes:", error);
    }
  };

  // Función para cargar la información de un cliente específico
  const loadClientInfo = async (clientId: string): Promise<void> => {
    if (!clientId) return;
    
    try {
      // Primero buscamos si el cliente tiene un proceso activo en ongoing_residence_processes
      const { data: ongoingProcess, error: ongoingError } = await supabase
        .from('ongoing_residence_processes')
        .select('*')
        .eq('client_id', clientId)
        .limit(1);

      if (ongoingError) {
        console.error("Error al cargar proceso activo:", ongoingError);
        return;
      }

      // Si no tiene proceso activo, buscamos en new_residence_applications
      let processInfo = null;
      if (!ongoingProcess || ongoingProcess.length === 0) {
        const { data: newApplication, error: newAppError } = await supabase
          .from('new_residence_applications')
          .select('*')
          .eq('client_id', clientId)
          .limit(1);

        if (newAppError) {
          console.error("Error al cargar nueva aplicación:", newAppError);
          return;
        }

        processInfo = newApplication && newApplication.length > 0 ? newApplication[0] : null;
      } else {
        processInfo = ongoingProcess[0];
      }

      // Obtenemos la información del cliente
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .select('*')
        .eq('id', clientId)
        .limit(1);

      if (clientError) {
        console.error("Error al cargar información del cliente:", clientError);
        return;
      }

      if (clientData && clientData.length > 0) {
        // Verificar si existe next_step_title
        const nextStepTitle = processInfo?.next_step_title || '';
        // Usar el next_steps existente como texto
        const nextStepText = processInfo?.next_steps || '';
        
        setClientInfo({
          id: clientData[0].id,
          fullName: clientData[0].full_name,
          processStartDate: processInfo?.start_date || '',
          nextStepTitle: nextStepTitle,
          nextStepText: nextStepText
        });
      }
    } catch (error) {
      console.error("Error al cargar información del cliente:", error);
    }
  };

  // Función para cargar tareas urgentes
  const loadUrgentTasks = async (): Promise<void> => {
    try {
      // Obtener alertas con prioridad alta
      const { data, error } = await supabase
        .from('alerts')
        .select(`
          id,
          client_id,
          title,
          description,
          due_date,
          priority,
          clients!inner(full_name)
        `)
        .eq('priority', 'Alta')
        .eq('status', 'Pendiente')
        .order('due_date', { ascending: true })
        .limit(5);

      if (error) {
        console.error("Error al cargar tareas urgentes:", error);
        return;
      }

      // Formatear alertas para mostrarlas
      const formattedTasks = data ? data.map((alert: any) => {
        // Formatear la fecha de vencimiento
        const dueDate = alert.due_date 
          ? formatDueDate(new Date(alert.due_date)) 
          : 'Sin fecha';
        
        return {
          id: alert.id,
          client: alert.clients.full_name,
          task: alert.title,
          description: alert.description,
          deadline: dueDate
        };
      }) : [];

      setUrgentTasks(formattedTasks);
    } catch (error) {
      console.error("Error al cargar tareas urgentes:", error);
    }
  };

  // Configurar actualizaciones en tiempo real de la actividad
  useEffect(() => {
    // Suscribirse a cambios en la tabla activity_logs
    const subscription = supabase
      .channel('activity_logs_changes')
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'activity_logs' 
        }, 
        (payload) => {
          // Cuando se inserta un nuevo registro, recargar la actividad reciente
          loadRecentActivity();
        }
      )
      .subscribe();

    // Limpieza al desmontar
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Cargar todos los datos al montar el componente
  useEffect(() => {
    const loadAllData = async (): Promise<void> => {
      setLoading(true);
      await Promise.all([
        loadStats(),
        loadRecentActivity(),
        loadAllClients(),
        loadUrgentTasks()
      ]);
      setLoading(false);
    };

    loadAllData();

    // Configurar actualización automática cada minuto para mantener el "hace X tiempo" actualizado
    const intervalId = setInterval(() => {
      setRecentActivity(prev => prev.map(activity => ({
        ...activity,
        time: getTimeAgo(new Date(new Date().getTime() - getMinutesFromTimeAgo(activity.time) * 60000))
      })));
    }, 60000);

    return () => clearInterval(intervalId);
  }, []);

  // Convierte una cadena de "hace X tiempo" a minutos
  const getMinutesFromTimeAgo = (timeAgo: string): number => {
    if (timeAgo === "Justo ahora") return 0;
    
    const match = timeAgo.match(/Hace (\d+) (\w+)/);
    if (!match) return 0;
    
    const amount = parseInt(match[1]);
    const unit = match[2];
    
    if (unit.startsWith("minuto")) return amount;
    if (unit.startsWith("hora")) return amount * 60;
    if (unit.startsWith("día")) return amount * 24 * 60;
    
    return 0;
  };

  // Cargar información del cliente cuando se selecciona uno
  useEffect(() => {
    if (selectedClient) {
      loadClientInfo(selectedClient);
    }
  }, [selectedClient]);

  // Función para guardar los cambios del cliente
  const handleSaveChanges = async (): Promise<void> => {
    if (!clientInfo) return;
    
    setSaving(true);
    
    try {
      // Primero verificamos si el cliente tiene un proceso activo
      const { data: ongoingProcess, error: ongoingError } = await supabase
        .from('ongoing_residence_processes')
        .select('id')
        .eq('client_id', clientInfo.id)
        .limit(1);

      if (ongoingError) {
        console.error("Error al verificar proceso activo:", ongoingError);
        setSaving(false);
        return;
      }

      // Variable para almacenar el tipo de proceso
      let processType: "new" | "ongoing" = "ongoing";
      
      // Campos actualizados para el registro de actividad
      const updatedFields = ["fecha de inicio", "próximo paso"];

      // Si existe proceso activo, actualizamos esa tabla
      if (ongoingProcess && ongoingProcess.length > 0) {
        // Primero verificamos si ya existen las columnas necesarias
        const { error: alterError } = await supabase.rpc('add_columns_if_not_exist', {
          table_name: 'ongoing_residence_processes',
          column_definitions: [
            'start_date date',
            'next_steps text',
            'next_step_title text'
          ]
        });

        if (alterError) {
          console.error("Error al añadir columnas:", alterError);
        }
        
        // Ahora actualizamos el registro
        const { error: updateError } = await supabase
          .from('ongoing_residence_processes')
          .update({ 
            start_date: clientInfo.processStartDate,
            next_steps: clientInfo.nextStepText,
            next_step_title: clientInfo.nextStepTitle
          })
          .eq('id', ongoingProcess[0].id);

        if (updateError) {
          console.error("Error al actualizar proceso activo:", updateError);
          setSaving(false);
          return;
        }

        processType = "ongoing";
      } else {
        // Si no existe proceso activo, verificamos si hay una nueva aplicación
        const { data: newApplication, error: newAppError } = await supabase
          .from('new_residence_applications')
          .select('id')
          .eq('client_id', clientInfo.id)
          .limit(1);

        if (newAppError) {
          console.error("Error al verificar nueva aplicación:", newAppError);
          setSaving(false);
          return;
        }

        // Si existe nueva aplicación, actualizamos esa tabla
        if (newApplication && newApplication.length > 0) {
          // Primero verificamos si ya existen las columnas necesarias
          const { error: alterError } = await supabase.rpc('add_columns_if_not_exist', {
            table_name: 'new_residence_applications',
            column_definitions: [
              'start_date date',
              'next_steps text',
              'next_step_title text'
            ]
          });

          if (alterError) {
            console.error("Error al añadir columnas:", alterError);
          }
          
          // Ahora actualizamos el registro
          const { error: updateError } = await supabase
            .from('new_residence_applications')
            .update({ 
              start_date: clientInfo.processStartDate,
              next_steps: clientInfo.nextStepText,
              next_step_title: clientInfo.nextStepTitle
            })
            .eq('id', newApplication[0].id);

          if (updateError) {
            console.error("Error al actualizar nueva aplicación:", updateError);
            setSaving(false);
            return;
          }

          processType = "new";
        } else {
          // Si no existe ningún registro, creamos uno nuevo en ongoing_residence_processes
          const { error: insertError } = await supabase
            .from('ongoing_residence_processes')
            .insert({
              client_id: clientInfo.id,
              start_date: clientInfo.processStartDate,
              next_steps: clientInfo.nextStepText,
              next_step_title: clientInfo.nextStepTitle,
              current_address: '',  // Valor por defecto
              whatsapp_number: '',  // Valor por defecto
              first_name: '',       // Valor por defecto
              last_name: '',        // Valor por defecto
              has_work_permit: false // Valor por defecto
            });

          if (insertError) {
            console.error("Error al crear nuevo proceso:", insertError);
            setSaving(false);
            return;
          }

          processType = "ongoing";
        }
      }
      
      // Registrar actividad usando el módulo de registro de actividades
      try {
        await logProcessUpdate(
          clientInfo.id,
          clientInfo.fullName,
          processType,
          updatedFields
        );
        console.log("Actividad registrada correctamente usando activity-logger");
      } catch (logError) {
        console.error("Error al registrar actividad con activity-logger:", logError);
        
        // Plan B: Si falla el logger, intentamos con el método directo
        try {
          await logUserActivity(
            clientInfo.id,
            "Actualización de proceso",
            `${clientInfo.fullName} actualizó su proceso: ${updatedFields.join(', ')}`
          );
        } catch (directError) {
          console.error("Error al registrar actividad directamente:", directError);
        }
      }
      
      setSaveSuccess(true);
      
      // Eliminar mensaje de éxito después de 3 segundos
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
      
    } catch (error) {
      console.error("Error al guardar cambios:", error);
    } finally {
      setSaving(false);
    }
  };

  // Funciones de utilidad para formatear fechas
  const getTimeAgo = (date: Date): string => {
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffMinutes < 1) return "Justo ahora";
    if (diffMinutes < 60) return `Hace ${diffMinutes} minutos`;
    
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `Hace ${diffHours} horas`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `Hace ${diffDays} días`;
  };

  const formatDueDate = (date: Date): string => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === now.toDateString()) return "Hoy";
    if (date.toDateString() === tomorrow.toDateString()) return "Mañana";
    
    return date.toLocaleDateString();
  };

  // Renderizar estado de carga
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <span className="ml-3 text-lg text-gray-700">Cargando datos...</span>
      </div>
    );
  }

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
            <FileText className="h-8 w-8 text-yellow-500" />
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

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity - Mejorado para mostrar actividades de usuario */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Actividad Reciente</h2>
          {recentActivity.length > 0 ? (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between border-b pb-4">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{activity.client}</p>
                    <p className="text-sm text-gray-600">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs mr-2 ${
                        activity.action === 'Actualización de perfil' ? 'bg-blue-100 text-blue-800' :
                        activity.action === 'Actualización de proceso' ? 'bg-green-100 text-green-800' :
                        activity.action === 'Subida de documento' ? 'bg-purple-100 text-purple-800' :
                        activity.action === 'Pago realizado' ? 'bg-indigo-100 text-indigo-800' :
                        activity.action === 'Nuevo ticket' ? 'bg-orange-100 text-orange-800' :
                        activity.action === 'Respuesta a ticket' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {activity.action}
                      </span>
                      {activity.process}
                    </p>
                  </div>
                  <span className="text-sm text-gray-400 whitespace-nowrap ml-2">{activity.time}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No hay actividad reciente</p>
          )}
        </div>

        {/* Client Management */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Gestión de Clientes</h2>
          
          {/* Client Selector */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Seleccionar Cliente
            </label>
            <select
              className="w-full p-3 border rounded-lg bg-gray-50"
              value={selectedClient}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => 
                setSelectedClient(e.target.value)
              }
            >
              <option value="">-- Seleccione un cliente --</option>
              {allClients.map(client => (
                <option key={client.id} value={client.id}>
                  {client.full_name}
                </option>
              ))}
            </select>
          </div>
          
          {/* Client Process Information - Only show if a client is selected */}
          {clientInfo && (
            <div className="p-4 border rounded-lg bg-gray-50">
              <div className="flex justify-between items-center mb-4">
                <p className="font-medium text-gray-900 text-lg">{clientInfo.fullName}</p>
                <div className="flex space-x-2">
                  {saveSuccess && (
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded flex items-center">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Guardado
                    </span>
                  )}
                  <button 
                    className="bg-blue-500 text-white py-1 px-3 rounded flex items-center text-sm hover:bg-blue-600"
                    onClick={handleSaveChanges}
                    disabled={saving}
                  >
                    {saving ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                        Guardando...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-1" />
                        Guardar
                      </>
                    )}
                  </button>
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Fecha de inicio
                </label>
                <input
                  type="date"
                  className="w-full p-2 border rounded"
                  value={clientInfo.processStartDate}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    setClientInfo({
                      ...clientInfo,
                      processStartDate: e.target.value
                    });
                  }}
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Título del próximo paso
                </label>
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  value={clientInfo.nextStepTitle}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    setClientInfo({
                      ...clientInfo,
                      nextStepTitle: e.target.value
                    });
                  }}
                  placeholder="Ingrese título del próximo paso"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Descripción del próximo paso
                </label>
                <textarea
                  className="w-full p-2 border rounded"
                  value={clientInfo.nextStepText}
                  rows={3}
                  onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
                    setClientInfo({
                      ...clientInfo,
                      nextStepText: e.target.value
                    });
                  }}
                  placeholder="Describa el próximo paso a seguir"
                />
              </div>
            </div>
          )}
          
          {selectedClient && !clientInfo && (
            <p className="text-gray-500 text-center py-4">Cargando información del cliente...</p>
          )}
          
          {!selectedClient && (
            <p className="text-gray-500 text-center py-4">Seleccione un cliente para gestionar su proceso</p>
          )}
        </div>
      </div>

      {/* Urgent Tasks */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Tareas Urgentes</h2>
        {urgentTasks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {urgentTasks.map((task) => (
              <div key={task.id} className="flex items-center justify-between bg-red-50 p-4 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{task.client}</p>
                  <p className="text-sm text-gray-600">{task.task}</p>
                  {task.description && <p className="text-xs text-gray-500 mt-1">{task.description}</p>}
                </div>
                <span className="text-sm font-medium text-red-600">Vence: {task.deadline}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">No hay tareas urgentes pendientes</p>
        )}
      </div>
    </div>
  );
}
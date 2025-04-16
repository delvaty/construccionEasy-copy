import React, { useState, useEffect } from 'react';
import { FileText, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase/client';
import { User } from "@supabase/supabase-js";
import { 
  /* User, */ 
  Client, 
  OngoingResidenceProcess, 
  ClientDocument, 
  DocumentStats,
  JobOffer
} from '../../types/types';

interface ClientDashboardProps {
  user: User | null  ;
}

const ClientDashboard: React.FC<ClientDashboardProps> = ({ user }) => {
  const [isJobSearching, setIsJobSearching] = useState<boolean>(false);
  const [clientData, setClientData] = useState<Client | null>(null);
  const [processData, setProcessData] = useState<OngoingResidenceProcess | null>(null);
  const [documentStats, setDocumentStats] = useState<DocumentStats>({ verified: 0, pending: 0, rejected: 0 });
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    console.log("ID del usuario recibido en props:", user?.id);
  }, [user]);
  
  

  // Obtener datos del cliente al montar el componente
  useEffect(() => {
    const fetchClientData = async () => {
      try {
        if (!user || !user.id) return;
        const userId= user.id
        /* const { data: sessionData } = await supabase.auth.getSession();
        const userId = sessionData?.session?.user?.id; */
        
        // Obtener datos del cliente por user_id
        const { data: clientData, error: clientError } = await supabase
          .from('clients')
          .select('*')
          .eq('user_id', userId)
          .maybeSingle();
          
          
          if (clientError) throw clientError;
        
        if (clientData) {
          console.log('CLIENT DATA:', clientData);
          setClientData(clientData as Client);
          
          // Si el cliente ha completado el formulario, obtener datos del proceso
          if (clientData.has_completed_form) {
            // Corrección: Cambiar la tabla a 'ongoing_processes' o el nombre correcto de la tabla
            const { data: processData, error: processError } = await supabase
              .from('ongoing_residence_processes') // Cambiado de 'clients' a 'ongoing_processes'
              .select('*')
              .eq('client_id', clientData.id)
              .single();
              
            if (processError) throw processError;
            if (processData) setProcessData(processData as OngoingResidenceProcess);
          }
          
          // Obtener documentos para contar estados
          const { data: documents, error: documentsError } = await supabase
            .from('client_documents')
            .select('*')
            .eq('client_id', clientData.id);
            
          if (documentsError) throw documentsError;
          
          if (documents) {
            // Contar estados de documentos
            const stats: DocumentStats = {
              verified: documents.filter(doc => doc.status === 'Verificado').length,
              pending: documents.filter(doc => doc.status === 'Pendiente').length,
              rejected: documents.filter(doc => doc.status === 'Rechazado').length
            };
            setDocumentStats(stats);
          }
        }
      } catch (error) {
        console.error('Error al obtener datos del cliente:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchClientData();
  }, [user]);

  // Datos de ejemplo para ofertas de trabajo
  const jobOffers: JobOffer[] = [
    {
      id: 1,
      title: 'Logistica',
      hourlyPay: '27 PLN',
      city: 'Olsztyn',
      imageUrl: '/api/placeholder/400/320',
    },
    {
      id: 2,
      title: 'Operario Fabrica Muebles',
      hourlyPay: '24 PLN',
      city: 'Wabzcezno',
      imageUrl: '/api/placeholder/400/320',
    },
    {
      id: 3,
      title: 'Tapicero',
      hourlyPay: '25 PLN',
      city: 'Wynowo',
      imageUrl: '/api/placeholder/400/320',
    },
  ];

  // Mostrar un estado de carga mientras se obtienen los datos
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Cargando información del proceso...</p>
      </div>
    );
  }

  // Verificar si el usuario ha completado el formulario
  const hasCompletedForm = clientData?.has_completed_form === true;

  return (
    <div className="space-y-8">
      {/* Mensaje para usuarios que no han completado el formulario */}
      {!hasCompletedForm && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
          <div className="flex">
            <AlertCircle className="h-6 w-6 text-yellow-600" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Formulario pendiente
              </h3>
              <p className="mt-2 text-sm text-yellow-700">
                Para iniciar su proceso de residencia, por favor complete el formulario de solicitud.
              </p>
              <div className="mt-4">
                <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  Completar formulario
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {hasCompletedForm && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Estado del Proceso</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Información del Caso */}
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center mb-4">
                <FileText className="h-5 w-5 text-blue-600 mr-2" />
                <h3 className="font-medium text-blue-900">Información del Caso</h3>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  Fecha de Inicio: 
                  <span className="font-medium text-gray-900 ml-2">
                    {processData ? formatDate(processData.created_at) : 'Pendiente'}
                  </span>
                </p>
                <p className="text-sm text-gray-600">
                  Número de Caso: 
                  <span className="font-medium text-gray-900 ml-2">
                    {processData && processData.case_number ? processData.case_number : 'Reservado'}
                  </span>
                </p>
                <p className="text-sm text-gray-600">
                  Voivodato: 
                  <span className="font-medium text-gray-900 ml-2">
                    {processData ? processData.voivodato : 'No disponible'}
                  </span>
                </p>
              </div>
            </div>

            {/* Estado Actual */}
            <div className="bg-yellow-50 rounded-lg p-4">
              <div className="flex items-center mb-4">
                <Clock className="h-5 w-5 text-yellow-600 mr-2" />
                <h3 className="font-medium text-yellow-900">Estado Actual</h3>
              </div>
              <p className="text-sm text-yellow-800 font-medium">
                {processData && processData.process_stage 
                  ? mapProcessStage(processData.process_stage) 
                  : 'Documentación siendo procesada'}
              </p>
              <div className="mt-4">
                <p className="text-sm text-gray-600">
                  Próxima Cita: 
                  <span className="font-medium text-gray-900 ml-2">
                    {processData && processData.updated_at 
                      ? formatDate(processData.updated_at) 
                      : 'Sin programar'}
                  </span>
                </p>
              </div>
            </div>

            {/* Estado de Documentos */}
            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center mb-4">
                <CheckCircle2 className="h-5 w-5 text-green-600 mr-2" />
                <h3 className="font-medium text-green-900">Etapa Proceso</h3>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  Completados: 
                  <span className="font-medium text-gray-900 ml-2">
                    {processData 
                      ? `${processData.completed_steps} de ${processData.total_steps}` 
                      : `${documentStats.verified} de 6`}
                  </span>
                </p>
                <p className="text-sm text-gray-600">
                  Pendientes: 
                  <span className="font-medium text-red-600 ml-2">
                    {processData 
                      ? processData.total_steps - processData.completed_steps 
                      : 6 - documentStats.verified}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Próximos Pasos - Mostrar siempre, pero contenido diferente dependiendo del estado */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Próximos Pasos</h2>
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
          <div className="flex">
            <AlertCircle className="h-6 w-6 text-blue-600" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">
                {!hasCompletedForm 
                  ? "Complete el formulario de solicitud" 
                  : getNextStepMessage(processData, documentStats)}
              </h3>
              <p className="mt-2 text-sm text-blue-700">
                {!hasCompletedForm 
                  ? "Para iniciar su proceso de residencia, es necesario completar el formulario con toda la información requerida." 
                  : getNextStepDescription(processData, documentStats)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Interruptor de Búsqueda de Trabajo */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Búsqueda de Trabajo</h2>
        <div className="flex items-center">
          <span className="mr-3 text-gray-700">
            {isJobSearching ? 'Interesado en ofertas de trabajo' : 'No interesado en ofertas de trabajo'}
          </span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              value=""
              className="sr-only peer"
              checked={isJobSearching}
              onChange={() => setIsJobSearching(!isJobSearching)}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>

      {/* Ofertas de Trabajo */}
      {isJobSearching && (
        <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Ofertas de Trabajo</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobOffers.map((offer) => (
              <div key={offer.id} className="bg-gray-100 rounded-lg p-4">
                <img src={offer.imageUrl} alt={offer.title} className="w-full h-32 object-cover rounded-md mb-4" />
                <h3 className="text-lg font-semibold text-gray-900">{offer.title}</h3>
                <p className="text-sm text-gray-600">Pago por hora: {offer.hourlyPay}</p>
                <p className="text-sm text-gray-600">Ciudad: {offer.city}</p>
                <button className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                  Contactar
                </button>
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-600">
            Aclaración: Las ofertas laborales presentadas son proporcionadas por terceros. No promovemos ni estamos a favor de cobros por cupos, documentación o cualquier otro concepto relacionado con estas ofertas. Si te encuentras con alguna situación de este tipo, por favor infórmanos.
          </p>
        </div>
      )}
    </div>
  );
};

// Función para formatear fechas
function formatDate(dateString: string): string {
  if (!dateString) return 'No disponible';
  const date = new Date(dateString);
  return date.toLocaleDateString();
}

// Función para mapear las etapas del proceso a texto más descriptivo
function mapProcessStage(stage: string): string {
  const stageMap: Record<string, string> = {
    'Presentacion Solicitud': 'Solicitud presentada',
    'Tengo Carta Amarilla': 'Esperando cita para huellas',
    'Ya tuve cita huellas': 'Esperando resolución',
    'Sello Rojo': 'Proceso completado',
    'Negativa': 'Solicitud rechazada',
    'Desconozco': 'Documentación siendo procesada'
  };
  
  return stageMap[stage] || stage;
}

// Funciones auxiliares para determinar el mensaje y descripción del próximo paso
function getNextStepMessage(processData: OngoingResidenceProcess | null, documentStats: DocumentStats): string {
  if (!processData) {
    return "Envío de documentación";
  }
  
  switch(processData.process_stage) {
    case 'Solicitud Presentada':
      return "Esperar confirmación de recepción";
    case 'Tarjeta Amarilla':
      return "Cita para huellas";
    /* case 'Sello Rojo':
      return "Esperar resolución"; */
    case 'Sello Rojo':
      return "Proceso completo";
    case 'Negativo':
      return "Proceso con resultado negativo";
    default:
      if (documentStats.pending > 0) {
        return "Completar documentación pendiente";
      } else {
        return "Documentación siendo procesada";
      }
  }
}

function getNextStepDescription(processData: OngoingResidenceProcess | null, documentStats: DocumentStats): string {
  if (!processData) {
    return "Por favor, complete todos los documentos requeridos para iniciar su proceso.";
  }
  
  switch(processData.process_stage) {
    case 'Solicitud Presentada':
      return "Estamos esperando que las autoridades confirmen la recepción de su solicitud.";
    case 'Tarjeta Amarilla':
      return "Pendiente de asignación. Se le notificará cuando la cita esté programada.";
    /* case 'Ya tuve cita huellas':
      return "Su caso está siendo revisado por las autoridades. Le informaremos cuando haya novedades."; */
    case 'Sello Rojo':
      return "¡Felicidades! Su proceso de residencia ha sido completado exitosamente.";
    case 'Negativo':
      return "Su solicitud ha sido rechazada. Contacte a nuestro equipo para analizar las opciones disponibles.";
    default:
      if (documentStats.pending > 0) {
        return `Tiene ${documentStats.pending} documentos pendientes de verificación. Por favor, complete la documentación.`;
      } else if (documentStats.rejected > 0) {
        return `Tiene ${documentStats.rejected} documentos rechazados que requieren corrección.`;
      } else {
        return "Su documentación está siendo verificada. Le notificaremos cuando haya avances.";
      }
  }
}

export default ClientDashboard;
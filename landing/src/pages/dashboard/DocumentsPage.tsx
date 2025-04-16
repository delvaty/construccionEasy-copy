import React, { useEffect, useState } from 'react';
import { FileCheck, Eye, Download, AlertCircle, Loader } from 'lucide-react';
import { supabase } from '../../lib/supabase/client'; 
import { useAuth } from '../../context/AuthContext'; 
import { format } from 'date-fns'; // Para formatear fechas

// Definición de tipos según el esquema actual
interface ClientDocument {
  id: string;
  client_id: string;
  document_type: 'passport' | 'yellow_card' | 'other';
  file_path: string;
  file_name: string;
  upload_date: string;
}

// Mapeo de tipos de documentos a nombres legibles
const documentTypeLabels: Record<string, string> = {
  passport: 'Pasaporte',
  yellow_card: 'Carta Amarilla',
  other: 'Otro documento'
};

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<ClientDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        setLoading(true);
        
        if (!user?.id) {
          throw new Error('Usuario no autenticado');
        }
        
        console.log('Usuario ID:', user.id); // Log del ID de usuario
        
        // Obtenemos todos los clientes que coincidan con el user_id (pueden ser varios)
        const { data: clientsData, error: clientError } = await supabase
          .from('clients')
          .select('id')
          .eq('user_id', user.id);

        console.log('Clients data:', clientsData); // Para depuración
        console.log('Client error:', clientError); // Para depuración
        
        if (clientError) {
          throw new Error('No se pudo encontrar la información del cliente');
        }
        
        if (!clientsData || clientsData.length === 0) {
          throw new Error('No se encontró un cliente asociado a este usuario');
        }
        
        // Extraemos los IDs de los clientes
        const clientIds = clientsData.map(client => client.id);
        console.log('Client IDs para buscar documentos:', clientIds); // Mostramos los IDs
        
        // Ahora vamos a comprobar cada cliente individualmente para ver si tiene documentos
        for (const clientId of clientIds) {
          console.log(`Buscando documentos para cliente ID: ${clientId}`);
          
          const { data: singleClientDocs, error: singleClientError } = await supabase
            .from('client_documents')
            .select('*')
            .eq('client_id', clientId);
            
          console.log(`Resultados para cliente ${clientId}:`, singleClientDocs);
          if (singleClientError) {
            console.error(`Error al buscar documentos para cliente ${clientId}:`, singleClientError);
          }
        }
        
        // Obtenemos los documentos de todos los clientes asociados a este usuario
        const { data: documentsData, error: documentsError } = await supabase
          .from('client_documents')
          .select('*')
          .in('client_id', clientIds)
          .order('upload_date', { ascending: false });
          
        console.log('Resultado de búsqueda de documentos:', documentsData);
        console.log('Error en búsqueda de documentos:', documentsError);
        
        if (documentsError) {
          throw new Error('Error al cargar los documentos');
        }
        
        setDocuments(documentsData || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
        console.error('Error fetching documents:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, [user]);

  const handleViewDocument = async (filePath: string) => {
    try {
      // Obtener URL pública temporal para visualizar
      const { data, error } = await supabase.storage
        .from('client-documents') // Asegúrate de que este sea el nombre correcto del bucket
        .createSignedUrl(filePath, 60); // URL válida por 60 segundos
      
      if (error) throw error;
      
      // Abrir en nueva pestaña
      window.open(data.signedUrl, '_blank');
    } catch (error) {
      console.error('Error al visualizar el documento:', error);
      alert('No se pudo abrir el documento');
    }
  };

  const handleDownloadDocument = async (filePath: string, fileName: string) => {
    try {
      // Obtener URL pública temporal para descargar
      const { data, error } = await supabase.storage
        .from('client-documents')
        .createSignedUrl(filePath, 60);
      
      if (error) throw error;
      
      // Crear enlace temporal y simular clic para descargar
      const link = document.createElement('a');
      link.href = data.signedUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error al descargar el documento:', error);
      alert('No se pudo descargar el documento');
    }
  };

  const getDocumentTypeIcon = (docType: string) => {
    // Puedes personalizar esto para mostrar iconos diferentes según el tipo de documento
    return <FileCheck className="h-5 w-5 text-gray-400 mr-2" />;
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy');
    } catch (e) {
      return 'Fecha inválida';
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 flex justify-center items-center h-64">
        <Loader className="h-8 w-8 text-indigo-600 animate-spin" />
        <span className="ml-2 text-gray-600">Cargando documentos...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 flex justify-center items-center h-64">
        <AlertCircle className="h-8 w-8 text-red-600" />
        <span className="ml-2 text-gray-600">Error: {error}</span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Documentación</h2>
        <span className="text-sm text-gray-500">
          {documents.length} documento(s) subido(s)
        </span>
      </div>
      
      {documents.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No tienes documentos cargados aún.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Documento</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha de subida</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {documents.map((doc) => (
                <tr key={doc.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getDocumentTypeIcon(doc.document_type)}
                      <span className="text-sm font-medium text-gray-900">{doc.file_name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {documentTypeLabels[doc.document_type] || 'Documento'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(doc.upload_date)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                      Pendiente
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-3">
                      <button 
                        onClick={() => handleViewDocument(doc.file_path)}
                        className="text-indigo-600 hover:text-indigo-900 flex items-center"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Ver
                      </button>
                      <button 
                        onClick={() => handleDownloadDocument(doc.file_path, doc.file_name)}
                        className="text-indigo-600 hover:text-indigo-900 flex items-center"
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Descargar
                      </button>
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
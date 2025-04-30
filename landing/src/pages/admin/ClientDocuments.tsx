import { FileText, Upload } from "lucide-react";
import { Client, ClientDocument } from "../../types/types";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase/client";

interface ClientsDocumentsProps {
  isEditing: boolean;
  client: Client | null;
}

const ClientsDocuments: React.FC<ClientsDocumentsProps> = ({ isEditing, client }) => {
  const [documents, setDocuments] = useState<ClientDocument[]>([]);

  useEffect(() => {
    const fetchDocuments = async () => {
      const { data, error } = await supabase.from("client_documents").select("*").eq("client_id", client?.id);
      if (!error) {
        setDocuments(data || []);
      }
    };

    fetchDocuments();
  }, [client]);

  const getPublicURL = (filePath: string): string => {
    const { data } = supabase.storage.from("client-documents").getPublicUrl(filePath);
    return data.publicUrl;
  };

  const handleView = (filePath: string) => {
    const url = getPublicURL(filePath);
    window.open(url, "_blank"); // Abre en una nueva pestaña
  };

  const handleDownload = (filePath: string) => {
    const url = getPublicURL(filePath);
    const link = document.createElement("a");
    link.href = url;
    link.download = filePath.split("/").pop() || "documento"; // Define un nombre de archivo adecuado
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !client) return;

    const filePath = `${client.id}/${file.name}`;

    const { data, error } = await supabase.storage.from("client-documents").upload(filePath, file);

    if (error) {
      console.error("Error al subir el archivo:", error);
      return;
    }

    // Guardar los detalles en la tabla `client_documents`
    await saveDocument(filePath, file.name);
  };

  const saveDocument = async (filePath: string, fileName: string) => {
    const { error, data } = await supabase
      .from("client_documents")
      .insert([
        {
          client_id: client?.id,
          document_type: "other", // Puedes permitir elegir el tipo de documento
          file_path: filePath,
          file_name: fileName,
          upload_date: new Date().toISOString(),
          status: "Pendiente",
        },
      ])
      .select("*");

    if (error) {
      console.error("Error al guardar el documento:", error);
    } else {
      console.log("Documento guardado correctamente.");
      setDocuments([...documents, data[0]]);
    }
  };

  const open = () => {
    document.querySelector("#upload-input")?.click();
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center">
          <FileText className="h-5 w-5 mr-2 text-gray-500" />
          Documentos
        </h2>
        <button onClick={open} className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 flex items-center">
          <Upload className="w-4 h-4 mr-2" />
          Subir Documento
        </button>
        <input id="upload-input" type="file" className="hidden" onChange={handleUpload} />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Documento</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {documents.map((doc, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-sm font-medium text-gray-900">{doc.file_name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">{doc.status}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doc.upload_date}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-3">
                    <button onClick={() => handleView(doc.file_path)} className="text-indigo-600 hover:text-indigo-900">
                      Ver
                    </button>
                    <button onClick={() => handleDownload(doc.file_path)} className="text-indigo-600 hover:text-indigo-900">
                      Descargar
                    </button>
                    {isEditing && <button className="text-red-600 hover:text-red-900">Eliminar</button>}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClientsDocuments;

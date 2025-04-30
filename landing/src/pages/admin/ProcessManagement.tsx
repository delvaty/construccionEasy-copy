import React, { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase/client";
import { Client, ClientDocument } from "../../types/types";
import {
  Upload,
  Trash2,
  Edit2,
  Search,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  FileText,
  X,
} from "lucide-react";

export default function DocumentManagement() {
  const [clients, setClients] = useState<Client[]>([]);
  const [documents, setDocuments] = useState<Record<string, ClientDocument[]>>(
    {}
  );
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [uploadingFor, setUploadingFor] = useState<string | null>(null);
  const [documentTitle, setDocumentTitle] = useState("");
  const [documentType, setDocumentType] = useState<
    "passport" | "yellow_card" | "other"
  >("other");
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [editingDocument, setEditingDocument] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState("");

  // Fetch clients
  useEffect(() => {
    async function fetchClients() {
      try {
        const { data, error } = await supabase
          .from("clients")
          .select("*")
          .order("full_name", { ascending: true });

        if (error) throw error;
        setClients(data || []);
      } catch (error: any) {
        console.error("Error fetching clients:", error.message);
        setError("No se pudieron cargar los clientes");
      } finally {
        setLoading(false);
      }
    }

    fetchClients();
  }, []);

  // Fetch documents when a client is selected
  useEffect(() => {
    if (selectedClient) {
      fetchClientDocuments(selectedClient);
    }
  }, [selectedClient]);

  async function fetchClientDocuments(clientId: string) {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("client_documents")
        .select("*")
        .eq("client_id", clientId);

      if (error) throw error;

      const updatedDocuments = { ...documents };
      updatedDocuments[clientId] = data || [];
      setDocuments(updatedDocuments);
    } catch (error: any) {
      console.error("Error fetching documents:", error.message);
      setError("No se pudieron cargar los documentos");
    } finally {
      setLoading(false);
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
  };

  const handleUpload = async (clientId: string) => {
    if (!file) {
      setError("Por favor seleccione un archivo");
      return;
    }

    if (!documentTitle.trim()) {
      setError("Por favor ingrese un título para el documento");
      return;
    }

    setError(null);
    setUploadProgress(0);

    try {
      // 1. Upload file to storage
      const fileExt = file.name.split(".").pop();
      const fileName = `${clientId}/${Date.now()}.${fileExt}`;
      const filePath = `documents/${fileName}`;

      // Crear un manejador para seguir el progreso de la subida
      let uploadProgress = 0;
      const progressInterval = setInterval(() => {
        uploadProgress += 10;
        if (uploadProgress > 90) clearInterval(progressInterval);
        setUploadProgress(uploadProgress);
      }, 250);

      const { error: uploadError } = await supabase.storage
        .from("client-documents")
        .upload(filePath, file);

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (uploadError) throw uploadError;

      // 2. Create document record in the database
      const { error: dbError } = await supabase
        .from("client_documents")
        .insert({
          client_id: clientId,
          document_type: documentType,
          file_path: filePath,
          file_name: documentTitle,
        });

      if (dbError) throw dbError;

      // 3. Refresh documents list
      await fetchClientDocuments(clientId);

      setSuccess("Documento subido exitosamente");
      setFile(null);
      setDocumentTitle("");
      setDocumentType("other");
      setUploadingFor(null);

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (error: any) {
      console.error("Error uploading document:", error.message);
      setError("Error al subir el documento: " + error.message);
      setUploadProgress(0);
    }
  };

  const handleDelete = async (documentId: string, clientId: string) => {
    if (!confirm("¿Está seguro que desea eliminar este documento?")) {
      return;
    }

    try {
      setError(null);

      // 1. Primero verificar si el documento existe
      const { data: docCheck, error: checkError } = await supabase
        .from("client_documents")
        .select("*")
        .eq("id", documentId)
        .single();

      if (checkError) {
        console.error("Error verificando documento:", checkError);
        throw new Error(`Error verificando documento: ${checkError.message}`);
      }

      if (!docCheck) {
        console.error("Documento no encontrado en la base de datos");
        throw new Error("Documento no encontrado en la base de datos");
      }

      // 2. Delete from database
      const { data: deleteData, error: dbError } = await supabase
        .from("client_documents")
        .delete()
        .eq("id", documentId)
        .select();

      if (dbError) {
        console.error("Error al eliminar de la base de datos:", dbError);
        throw dbError;
      }

      // 3. Intentar eliminar archivo solo si la eliminación de la BD fue exitosa
      if (docCheck.file_path) {
        const { error: storageError } = await supabase.storage
          .from("client-documents")
          .remove([docCheck.file_path]);

        if (storageError) {
          console.error("Error eliminando archivo del storage:", storageError);
          // Continuamos incluso si falla la eliminación del storage
        }
      }

      // 4. Update local state to reflect the deletion
      const updatedDocuments = { ...documents };
      updatedDocuments[clientId] = updatedDocuments[clientId].filter(
        (doc) => doc.id !== documentId
      );
      setDocuments(updatedDocuments);

      setSuccess("Documento eliminado exitosamente");
      setTimeout(() => setSuccess(null), 3000);

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (error: any) {
      console.error("Error deleting document:", error.message);
      setError("Error al eliminar el documento: " + error.message);
    }
  };

  const updateDocumentTitle = async (documentId: string, clientId: string) => {
    if (!newTitle.trim()) {
      setError("El título no puede estar vacío");
      return;
    }

    try {
      setError(null);

      // 1. Primero verificar si el documento existe
      const { data: docCheck, error: checkError } = await supabase
        .from("client_documents")
        .select("*")
        .eq("id", documentId)
        .single();

      if (checkError) {
        console.error("Error verificando documento:", checkError);
        throw new Error(`Error verificando documento: ${checkError.message}`);
      }

      if (!docCheck) {
        console.error("Documento no encontrado en la base de datos");
        throw new Error("Documento no encontrado en la base de datos");
      }

      // 2. Actualizar en la base de datos
      const {  error: updateError } = await supabase
        .from("client_documents")
        .update({ file_name: newTitle })
        .eq("id", documentId)
        .select();

      if (updateError) {
        console.error("Error al actualizar en la base de datos:", updateError);
        throw updateError;
      }

      // 3. Actualizar estado local
      const updatedDocuments = { ...documents };
      updatedDocuments[clientId] = updatedDocuments[clientId].map((doc) =>
        doc.id === documentId ? { ...doc, file_name: newTitle } : doc
      );
      setDocuments(updatedDocuments);

      setSuccess("Título actualizado exitosamente");
      setEditingDocument(null);
      setNewTitle("");

      setTimeout(() => setSuccess(null), 3000);
    } catch (error: any) {
      console.error("Error completo:", error);
      setError("Error al actualizar el título: " + error.message);
    }
  };

  const startEditingTitle = (document: ClientDocument) => {
    setEditingDocument(document.id);
    setNewTitle(document.file_name);
  };

  const filteredClients = clients.filter(
    (client) =>
      client.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.passport_number
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      client.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getDocumentTypeLabel = (type: string) => {
    switch (type) {
      case "passport":
        return "Pasaporte";
      case "yellow_card":
        return "Tarjeta Amarilla";
      case "other":
        return "Otro";
      default:
        return type;
    }
  };

  const getPublicUrl = (filePath: string) => {
    const { data } = supabase.storage
      .from("client-documents")
      .getPublicUrl(filePath);

    return data?.publicUrl || "";
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Gestión de Documentos de Clientes
      </h1>

      {/* Alerts */}
      {error && (
        <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4 flex items-start">
          <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
          <div className="flex-1">
            <p className="text-red-700">{error}</p>
          </div>
          <button
            onClick={() => setError(null)}
            className="text-red-500 hover:text-red-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}

      {success && (
        <div className="mb-4 bg-green-50 border-l-4 border-green-500 p-4 flex items-start">
          <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
          <div className="flex-1">
            <p className="text-green-700">{success}</p>
          </div>
          <button
            onClick={() => setSuccess(null)}
            className="text-green-500 hover:text-green-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* Search Box */}
      <div className="mb-6 relative">
        <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden shadow-sm">
          <div className="pl-4">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Buscar cliente por nombre, pasaporte o email..."
            className="w-full py-3 px-4 outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading && !clients.length ? (
        <div className="flex justify-center items-center h-32">
          <RefreshCw className="h-8 w-8 text-indigo-500 animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClients.map((client) => (
            <div
              key={client.id}
              className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100"
            >
              <div className="bg-indigo-50 px-4 py-3 border-b border-gray-100">
                <h3 className="font-semibold text-lg text-gray-800">
                  {client.full_name}
                </h3>
                <p className="text-sm text-gray-500">
                  Pasaporte: {client.passport_number}
                </p>
              </div>

              <div className="p-4">
                <div className="mb-4">
                  {selectedClient === client.id ? (
                    <button
                      onClick={() => setSelectedClient(null)}
                      className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center"
                    >
                      <span>Ocultar documentos</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => setSelectedClient(client.id)}
                      className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center"
                    >
                      <FileText className="h-4 w-4 mr-1" />
                      <span>Ver documentos</span>
                    </button>
                  )}
                </div>

                {selectedClient === client.id && (
                  <div className="mt-2 space-y-4">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium text-gray-700">Documentos</h4>
                      {uploadingFor !== client.id ? (
                        <button
                          onClick={() => setUploadingFor(client.id)}
                          className="flex items-center text-sm bg-indigo-100 hover:bg-indigo-200 text-indigo-700 px-2 py-1 rounded"
                        >
                          <Upload className="h-4 w-4 mr-1" />
                          <span>Subir</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => setUploadingFor(null)}
                          className="flex items-center text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded"
                        >
                          <X className="h-4 w-4 mr-1" />
                          <span>Cancelar</span>
                        </button>
                      )}
                    </div>

                    {uploadingFor === client.id && (
                      <div className="bg-gray-50 p-3 rounded-md border border-gray-200 mb-3">
                        <div className="mb-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Título del documento
                          </label>
                          <input
                            type="text"
                            value={documentTitle}
                            onChange={(e) => setDocumentTitle(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            placeholder="Ej: Pasaporte de Juan"
                          />
                        </div>

                        <div className="mb-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Tipo de documento
                          </label>
                          <select
                            value={documentType}
                            onChange={(e) =>
                              setDocumentType(e.target.value as any)
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          >
                            <option value="passport">Pasaporte</option>
                            <option value="yellow_card">
                              Tarjeta Amarilla
                            </option>
                            <option value="other">Otro</option>
                          </select>
                        </div>

                        <div className="mb-3">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Seleccionar archivo
                          </label>
                          <input
                            type="file"
                            onChange={handleFileChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
                          />
                        </div>

                        {uploadProgress > 0 && uploadProgress < 100 && (
                          <div className="mb-3">
                            <div className="h-2 bg-gray-200 rounded-full">
                              <div
                                className="h-2 bg-indigo-600 rounded-full"
                                style={{ width: `${uploadProgress}%` }}
                              ></div>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                              Subiendo: {uploadProgress}%
                            </p>
                          </div>
                        )}

                        <button
                          onClick={() => handleUpload(client.id)}
                          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md transition-colors flex items-center justify-center"
                          disabled={uploadProgress > 0 && uploadProgress < 100}
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Subir documento
                        </button>
                      </div>
                    )}

                    {loading && selectedClient === client.id ? (
                      <div className="flex justify-center py-4">
                        <RefreshCw className="h-6 w-6 text-indigo-500 animate-spin" />
                      </div>
                    ) : (
                      <>
                        {documents[client.id]?.length > 0 ? (
                          <ul className="divide-y divide-gray-200">
                            {documents[client.id].map((doc) => (
                              <li key={doc.id} className="py-3">
                                {editingDocument === doc.id ? (
                                  <div className="flex items-center space-x-2">
                                    <input
                                      type="text"
                                      value={newTitle}
                                      onChange={(e) =>
                                        setNewTitle(e.target.value)
                                      }
                                      className="flex-1 px-2 py-1 border border-gray-300 rounded"
                                    />
                                    <button
                                      onClick={() =>
                                        updateDocumentTitle(doc.id, client.id)
                                      }
                                      className="bg-green-100 text-green-700 p-1 rounded hover:bg-green-200"
                                    >
                                      <CheckCircle className="h-4 w-4" />
                                    </button>
                                    <button
                                      onClick={() => setEditingDocument(null)}
                                      className="bg-gray-100 text-gray-700 p-1 rounded hover:bg-gray-200"
                                    >
                                      <X className="h-4 w-4" />
                                    </button>
                                  </div>
                                ) : (
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <div className="flex items-center">
                                        <a
                                          href={getPublicUrl(doc.file_path)}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="font-medium text-indigo-600 hover:text-indigo-800 text-sm flex items-center"
                                        >
                                          <FileText className="h-4 w-4 mr-1" />
                                          {doc.file_name}
                                        </a>
                                      </div>
                                      <p className="text-xs text-gray-500">
                                        {getDocumentTypeLabel(
                                          doc.document_type
                                        )}{" "}
                                        •
                                        {new Date(
                                          doc.upload_date
                                        ).toLocaleDateString()}
                                      </p>
                                    </div>
                                    <div className="flex space-x-1">
                                      <button
                                        onClick={() => startEditingTitle(doc)}
                                        className="p-1 rounded text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                                        title="Editar título"
                                      >
                                        <Edit2 className="h-4 w-4" />
                                      </button>
                                      <button
                                        onClick={() =>
                                          handleDelete(doc.id, client.id)
                                        }
                                        className="p-1 rounded text-red-500 hover:text-red-700 hover:bg-red-100"
                                        title="Eliminar documento"
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-sm text-gray-500 italic">
                            No hay documentos para este cliente.
                          </p>
                        )}
                      </>
                    )}
                  </div>
                )}

                {selectedClient !== client.id && (
                  <div className="mt-2">
                    <button
                      onClick={() => {
                        setSelectedClient(client.id);
                        setUploadingFor(client.id);
                      }}
                      className="flex items-center text-sm text-white bg-indigo-600 hover:bg-indigo-700 px-3 py-2 rounded-md w-full justify-center transition-colors"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      <span>Subir documentos</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {filteredClients.length === 0 && !loading && (
        <div className="bg-gray-50 rounded-lg p-6 text-center">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-gray-700 mb-1">
            No se encontraron clientes
          </h3>
          <p className="text-gray-500">
            No hay resultados para "{searchTerm}". Intente con otro término de
            búsqueda.
          </p>
        </div>
      )}
    </div>
  );
}

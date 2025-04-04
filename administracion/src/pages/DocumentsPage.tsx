import React from 'react';
import { FileCheck, Eye, Download } from 'lucide-react';

export default function DocumentsPage() {
  const documents = [
    {
      name: 'Carta Amarilla',
      date: '15/02/2025',
      status: 'Verificado',
      type: 'PDF'
    },
    {
      name: 'Notificación Voivodato #1',
      date: '20/01/2025',
      status: 'Verificado',
      type: 'PDF'
    },
    {
      name: 'Contrato de Trabajo',
      date: '10/01/2025',
      status: 'Verificado',
      type: 'PDF'
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Documentación</h2>
        <span className="text-sm text-gray-500">Documentos verificados</span>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Documento</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {documents.map((doc, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <FileCheck className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-sm font-medium text-gray-900">{doc.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doc.date}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    {doc.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-3">
                    <button className="text-indigo-600 hover:text-indigo-900 flex items-center">
                      <Eye className="h-4 w-4 mr-1" />
                      Ver
                    </button>
                    <button className="text-indigo-600 hover:text-indigo-900 flex items-center">
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
    </div>
  );
}

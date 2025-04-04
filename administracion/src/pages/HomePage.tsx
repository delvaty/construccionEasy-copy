import React, { useState } from 'react';
import { FileText, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

export default function HomePage() {
  const [isJobSearching, setIsJobSearching] = useState(false);

  // Placeholder job offers data
  const jobOffers = [
    {
      id: 1,
      title: 'Logistica',
      hourlyPay: '27 PLN',
      city: 'Olsztyn',
      imageUrl: 'https://img.freepik.com/free-photo/young-man-working-warehouse-with-boxes_1303-16617.jpg?t=st=1742892057~exp=1742895657~hmac=6e2b13c3c7d9b52eca44d217d740ce793c43257dc337e34238722382ff5f5fd4&w=1380', // Placeholder image
    },
    {
      id: 2,
      title: 'Operario Fabrica Muebles',
      hourlyPay: '24 PLN',
      city: 'Wabzcezno',
      imageUrl: 'https://img.freepik.com/free-photo/man-working-mdf-boards-warehouse_23-2149384852.jpg?t=st=1742892028~exp=1742895628~hmac=12139605fdfc0790d26bfcf2bf509f6f1eb9a165b6c678e7d3a99ee366a1c1f0&w=1380', // Placeholder image
    },
    {
      id: 3,
      title: 'Tapicero',
      hourlyPay: '25 PLN',
      city: 'Wynowo',
      imageUrl: 'https://img.freepik.com/free-photo/male-designer-leather-tailor-working-factory_1303-26301.jpg?t=st=1742892050~exp=1742895650~hmac=e3e6e39f1bd681f85d46fca2924e53290b94ecafcf56fcc1a90aa2a53149abf7&w=1380', // Placeholder image
    },
  ];

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Estado del Proceso</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Case Information */}
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center mb-4">
              <FileText className="h-5 w-5 text-blue-600 mr-2" />
              <h3 className="font-medium text-blue-900">Información del Caso</h3>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Fecha de Inicio: <span className="font-medium text-gray-900">12/1/2025</span></p>
              <p className="text-sm text-gray-600">Número de Caso: <span className="font-medium text-gray-900">ABC 1234</span></p>
              <p className="text-sm text-gray-600">Voivodato: <span className="font-medium text-gray-900">Olsztyn</span></p>
            </div>
          </div>

          {/* Current Status */}
          <div className="bg-yellow-50 rounded-lg p-4">
            <div className="flex items-center mb-4">
              <Clock className="h-5 w-5 text-yellow-600 mr-2" />
              <h3 className="font-medium text-yellow-900">Estado Actual</h3>
            </div>
            <p className="text-sm text-yellow-800 font-medium">Esperando asignación cita huellas</p>
            <div className="mt-4">
              <p className="text-sm text-gray-600">Próxima Cita: <span className="font-medium text-gray-900">Sin programar</span></p>
            </div>
          </div>

          {/* Documents Status */}
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center mb-4">
              <CheckCircle2 className="h-5 w-5 text-green-600 mr-2" />
              <h3 className="font-medium text-green-900">Estapa Proceso</h3>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Completados: <span className="font-medium text-gray-900">4 de 6</span></p>
              <p className="text-sm text-gray-600">Pendientes: <span className="font-medium text-red-600">2 </span></p>
            </div>
          </div>
        </div>
      </div>
			{/* Next Steps */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Próximos Pasos</h2>
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
          <div className="flex">
            <AlertCircle className="h-6 w-6 text-blue-600" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">Cita para huellas</h3>
              <p className="mt-2 text-sm text-blue-700">
                Pendiente de asignación. Se le notificará cuando la cita esté programada.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Job Search Switch */}
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

      {/* Job Offers */}
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
}

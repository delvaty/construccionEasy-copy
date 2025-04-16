import React, { useState } from 'react';
import { CreditCard, Search, Settings, DollarSign } from 'lucide-react';

export default function PaymentsManagement() {
  const [paymentConfig, setPaymentConfig] = useState({
    totalAmount: 1500,
    installments: 3,
    currency: 'PLN'
  });

  const [isConfiguring, setIsConfiguring] = useState(false);
  const [editedConfig, setEditedConfig] = useState(paymentConfig);

  const payments = [
    {
      id: 1,
      client: "María García",
      reference: "PAY-001",
      amount: 500,
      date: "01/03/2025",
      status: "Pagado",
      installment: "1 de 3"
    },
    {
      id: 2,
      client: "John Smith",
      reference: "PAY-002",
      amount: 500,
      date: "01/03/2025",
      status: "Pendiente",
      installment: "1 de 3"
    }
  ];

  const handleSaveConfig = () => {
    setPaymentConfig(editedConfig);
    setIsConfiguring(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Gestión de Pagos</h1>
        <button
          onClick={() => setIsConfiguring(true)}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          <Settings className="w-4 h-4 mr-2" />
          Configurar Pagos
        </button>
      </div>

      {/* Payment Configuration Modal */}
      {isConfiguring && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Configuración de Pagos</h3>
              <button onClick={() => setIsConfiguring(false)} className="text-gray-400 hover:text-gray-500">
                ✕
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Monto Total</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <DollarSign className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="number"
                    value={editedConfig.totalAmount}
                    onChange={(e) => setEditedConfig({...editedConfig, totalAmount: Number(e.target.value)})}
                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 pr-12 sm:text-sm border-gray-300 rounded-md"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">PLN</span>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Número de Cuotas</label>
                <input
                  type="number"
                  value={editedConfig.installments}
                  onChange={(e) => setEditedConfig({...editedConfig, installments: Number(e.target.value)})}
                  className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>
              <div className="flex justify-end space-x-3 mt-4">
                <button
                  onClick={() => setIsConfiguring(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSaveConfig}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md"
                >
                  Guardar Cambios
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payment Overview */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-indigo-50 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <CreditCard className="h-5 w-5 text-indigo-600 mr-2" />
              <h3 className="font-medium text-indigo-900">Configuración Actual</h3>
            </div>
            <p className="text-2xl font-bold text-indigo-900">{paymentConfig.totalAmount} PLN</p>
            <p className="text-sm text-indigo-600 mt-1">En {paymentConfig.installments} cuotas</p>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Buscar por cliente o referencia..."
              className="pl-10 pr-4 py-2 w-full border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <select className="border rounded-md px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500">
            <option value="">Todos los estados</option>
            <option value="paid">Pagados</option>
            <option value="pending">Pendientes</option>
          </select>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cliente
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Referencia
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Monto
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cuota
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {payments.map((payment) => (
              <tr key={payment.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{payment.client}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{payment.reference}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{payment.amount} PLN</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {payment.date}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {payment.installment}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    payment.status === 'Pagado'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {payment.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

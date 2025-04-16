import React, { useState } from 'react';
import { CreditCard, Calendar, CheckCircle2, AlertCircle, Banknote, Phone, X } from 'lucide-react';

export default function PaymentsPage() {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'bank' | 'blik' | null>(null);
  const [showBankInstructions, setShowBankInstructions] = useState<'PKO' | 'Santander' | null>(null);
  const [payments, setPayments] = useState([
    {
      id: 1,
      amount: 500,
      date: '01/03/2025',
      status: 'Pagado',
      reference: 'PAY-001',
    },
  ]);

  const paymentPlan = {
    totalAmount: 1500,
    currency: 'PLN',
    installments: 3,
    installmentAmount: 500,
    paidInstallments: 1,
  };

  const nextPayment = {
    dueDate: '01/04/2025',
    amount: 500,
  };

  const currentInstallment = paymentPlan.paidInstallments + 1;

  const bankTransferDetails = {
    bankName: 'PKO Bank Polski',
    accountNumber: '12 3456 7890 1234 5678 9012 3456',
    entityName: 'Easy Process',
    transferTitle: `Cuota ${currentInstallment}`,
  };

  const blikDetails = {
    entityName: 'Easy Process',
    phoneNumber: '+48 575 987 654',
    transferTitle: `Cuota ${currentInstallment}`,
  };

  const bankInstructions = {
    PKO: (
      <div className="text-sm text-gray-700 mt-2 p-3 bg-white rounded-md border border-gray-200">
        <p>
          1. Inicia sesión en tu cuenta de <strong>PKO Bank Polski</strong>.
          <br />
          2. Ve a "Transferencias" y selecciona "Transferencia Nacional".
          <br />
          3. Ingresa el número de cuenta y el título proporcionados.
          <br />
          4. Confirma con tu código SMS o token.
        </p>
      </div>
    ),
    Santander: (
      <div className="text-sm text-gray-700 mt-2 p-3 bg-white rounded-md border border-gray-200">
        <p>
          1. Accede a tu banca online de <strong>Santander</strong>.
          <br />
          2. Selecciona "Realizar Transferencia" en el menú.
          <br />
          3. Completa los datos de la cuenta y el título indicado.
          <br />
          4. Valida la operación con tu PIN o firma digital.
        </p>
      </div>
    ),
  };

  const handleInformarPago = () => {
    const newPayment = {
      id: payments.length + 1,
      amount: nextPayment.amount,
      date: nextPayment.dueDate,
      status: 'Pendiente',
      reference: `PAY-${String(payments.length + 1).padStart(3, '0')}`,
    };
    setPayments([...payments, newPayment]);
  };

  return (
    <div className="space-y-6">
      {/* Payment Overview */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Estado de Pagos</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <CreditCard className="h-5 w-5 text-blue-600 mr-2" />
              <h3 className="font-medium text-blue-900">Total a Pagar</h3>
            </div>
            <p className="text-2xl font-bold text-blue-900">
              {paymentPlan.totalAmount} {paymentPlan.currency}
            </p>
            <p className="text-sm text-blue-600 mt-1">En {paymentPlan.installments} cuotas</p>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <CheckCircle2 className="h-5 w-5 text-green-600 mr-2" />
              <h3 className="font-medium text-green-900">Pagado</h3>
            </div>
            <p className="text-2xl font-bold text-green-900">
              {paymentPlan.paidInstallments * paymentPlan.installmentAmount} {paymentPlan.currency}
            </p>
            <p className="text-sm text-green-600 mt-1">
              {paymentPlan.paidInstallments} de {paymentPlan.installments} cuotas
            </p>
          </div>
          <div className="bg-yellow-50 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <Calendar className="h-5 w-5 text-yellow-600 mr-2" />
              <h3 className="font-medium text-yellow-900">Próximo Pago</h3>
            </div>
            <p className="text-2xl font-bold text-yellow-900">
              {nextPayment.amount} {paymentPlan.currency}
            </p>
            <p className="text-sm text-yellow-600 mt-1">Vence: {nextPayment.dueDate}</p>
          </div>
        </div>
      </div>

      {/* Payment History */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Historial de Pagos</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Referencia
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Monto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {payments.map((payment) => (
                <tr key={payment.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {payment.reference}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{payment.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {payment.amount} {paymentPlan.currency}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        payment.status === 'Pagado'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {payment.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Buttons */}
      <div className="flex justify-start space-x-4">
        <button
          onClick={() => setShowPaymentModal(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition duration-200"
        >
          Realizar Pago
        </button>
        <button
          onClick={handleInformarPago}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition duration-200"
        >
          Informar Pago
        </button>
      </div>

      {/* Enhanced Payment Modal */}
      {showPaymentModal && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4"
          onClick={() => {
            setShowPaymentModal(false);
            setPaymentMethod(null);
            setShowBankInstructions(null);
          }}
        >
          <div
            className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Realizar Pago</h3>
              <button
                onClick={() => {
                  setShowPaymentModal(false);
                  setPaymentMethod(null);
                  setShowBankInstructions(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Payment Method Selection */}
            <div className="flex justify-center space-x-4 mb-6">
              <button
                onClick={() => setPaymentMethod('bank')}
                className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition duration-200 ${
                  paymentMethod === 'bank'
                    ? 'bg-indigo-100 text-indigo-800'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Banknote className="h-5 w-5 mr-2" />
                Transferencia
              </button>
              <button
                onClick={() => setPaymentMethod('blik')}
                className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition duration-200 ${
                  paymentMethod === 'blik'
                    ? 'bg-indigo-100 text-indigo-800'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Phone className="h-5 w-5 mr-2" />
                BLIK
              </button>
            </div>

            {/* Payment Method Details */}
            {paymentMethod === 'bank' && (
              <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                <p className="text-sm text-gray-600">
                  <AlertCircle className="h-4 w-4 inline mr-1 text-yellow-500" />
                  Transferencia a <strong>PKO Bank Polski</strong>. Puede demorar hasta 24 horas hábiles dependiendo del banco emisor.
                </p>
                <div>
                  <p className="text-sm text-gray-500">Número de Cuenta:</p>
                  <p className="text-base font-medium text-gray-900">{bankTransferDetails.accountNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Nombre de la Entidad:</p>
                  <p className="text-base font-medium text-gray-900">{bankTransferDetails.entityName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Título de la Transferencia:</p>
                  <p className="text-base font-medium text-gray-900">{bankTransferDetails.transferTitle}</p>
                </div>
                <div>
                  <p className="text-sm text-indigo-600 cursor-pointer hover:underline" onClick={() => setShowBankInstructions(showBankInstructions === 'PKO' ? null : 'PKO')}>
                    Instrucciones para PKO Bank Polski {showBankInstructions === 'PKO' ? '(Ocultar)' : '(Ver)'}
                  </p>
                  {showBankInstructions === 'PKO' && bankInstructions.PKO}
                  <p className="text-sm text-indigo-600 cursor-pointer hover:underline mt-1" onClick={() => setShowBankInstructions(showBankInstructions === 'Santander' ? null : 'Santander')}>
                    Instrucciones para Santander {showBankInstructions === 'Santander' ? '(Ocultar)' : '(Ver)'}
                  </p>
                  {showBankInstructions === 'Santander' && bankInstructions.Santander}
                </div>
              </div>
            )}

            {paymentMethod === 'blik' && (
              <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                <p className="text-sm text-gray-600">
                  <CheckCircle2 className="h-4 w-4 inline mr-1 text-green-500" />
                  Pago inmediato con BLIK.
                </p>
                <div>
                  <p className="text-sm text-gray-500">Nombre:</p>
                  <p className="text-base font-medium text-gray-900">{blikDetails.entityName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Número de Teléfono:</p>
                  <p className="text-base font-medium text-gray-900">{blikDetails.phoneNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Título:</p>
                  <p className="text-base font-medium text-gray-900">{blikDetails.transferTitle}</p>
                </div>
              </div>
            )}

            {/* Modal Footer */}
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => {
                  setShowPaymentModal(false);
                  setPaymentMethod(null);
                  setShowBankInstructions(null);
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition duration-200"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
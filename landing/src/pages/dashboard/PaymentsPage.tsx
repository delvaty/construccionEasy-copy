import React, { useState, useEffect } from "react";
import {
  CreditCard,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Banknote,
  Phone,
  X,
  HelpCircle,
  AlertTriangle,
  Clock,
} from "lucide-react";

// Tipos importados del modelo de datos
import type { Payment, PaymentSetting } from "../../types/types";
import { useAuth } from "../../context/AuthContext"; // Para obtener el usuario autenticado
import { supabase } from "../../lib/supabase/client"; // Importar el cliente de Supabase

export default function PaymentsPage() {
  // Obtenemos los datos del usuario autenticado
  const { user } = useAuth();

  // Estado para los modales
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"bank" | "blik" | null>(
    null
  );
  const [showBankInstructions, setShowBankInstructions] = useState<
    "PKO" | "Santander" | null
  >(null);

  // Estado para los datos de pago que vendrán de la base de datos
  const [paymentSetting, setPaymentSetting] = useState<PaymentSetting | null>(
    null
  );
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Obtener datos de Supabase
  useEffect(() => {
    const fetchPaymentData = async () => {
      try {
        setLoading(true);

        // Obtener la configuración de pagos de la tabla payment_settings
        const { data: settingsData, error: settingsError } = await supabase
          .from("payments_settings")
          .select("*")
          .eq("client_id", user?.id)
          .single();
          console.log("Settings data:", settingsData); // Para depuración
          

        if (settingsError && settingsError.code !== "PGRST116") {
          // PGRST116 es el código cuando no se encuentra ningún registro
          throw settingsError;
        }

        // Obtener los pagos del cliente desde la tabla payments
        const { data: paymentsData, error: paymentsError } = await supabase
          .from("payments")
          .select("*")
          .eq("client_id", user?.id)
          .order("installment_number", { ascending: true });
          console.log("Payments data:", paymentsData); // Para depuración

        if (paymentsError) {
          throw paymentsError;
        }

        setPaymentSetting(settingsData || null);
        setPayments(paymentsData || []);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching payment data:", err);
        setError("Error al cargar los datos de pagos");
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchPaymentData();
    }
  }, [user?.id]);

  // Cálculo de datos para mostrar en la UI
  const getTotalAmount = () => paymentSetting?.total_amount || 0;
  const getInstallmentAmount = () =>
    paymentSetting
      ? paymentSetting.total_amount / paymentSetting.installments
      : 0;
  const getPaidAmount = () => {
    return payments
      .filter((p) => p.status === "Pagado")
      .reduce((sum, payment) => sum + payment.amount, 0);
  };
  const getPaidInstallments = () =>
    payments.filter((p) => p.status === "Pagado").length;
  const getTotalInstallments = () => paymentSetting?.installments || 0;

  // Cálculo de la próxima fecha de pago
  const getNextPaymentDate = () => {
    const paidCount = getPaidInstallments();
    const totalCount = getTotalInstallments();

    if (paidCount >= totalCount) return null;

    // Buscar el próximo pago pendiente
    const nextPayment = payments.find((p) => p.status !== "Pagado");
    if (nextPayment?.due_date) return nextPayment.due_date;

    // Si no hay pagos pendientes pero aún faltan cuotas, calculamos la próxima fecha
    const today = new Date();
    const nextMonth = new Date(today.setMonth(today.getMonth() + 1));
    return `01/${String(nextMonth.getMonth() + 1).padStart(
      2,
      "0"
    )}/${nextMonth.getFullYear()}`;
  };

  const nextPaymentDate = getNextPaymentDate();
  const isAllPaid =
    getPaidInstallments() >= getTotalInstallments() &&
    getTotalInstallments() > 0;
  const isProcessingInfo = !loading && !paymentSetting;

  const handleInformarPago = async () => {
    if (isAllPaid || !paymentSetting || !user?.id) return;

    try {
      // Crear un nuevo registro de pago en la tabla payments
      const newPayment = {
        client_id: user.id,
        reference_number: `PAY-${String(payments.length + 1).padStart(3, "0")}`,
        amount: getInstallmentAmount(),
        due_date: nextPaymentDate || new Date().toISOString().split("T")[0],
        installment_number: getPaidInstallments() + 1,
        total_installments: getTotalInstallments(),
        status: "Pendiente",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { data, error: insertError } = await supabase
        .from("payments")
        .insert([newPayment])
        .select();

      if (insertError) throw insertError;

      // Actualizar la lista de pagos local
      if (data) {
        setPayments([...payments, data[0]]);
      }
    } catch (err) {
      console.error("Error al informar pago:", err);
      setError("Error al registrar el pago");
    }
  };

  const bankTransferDetails = {
    bankName: "PKO Bank Polski",
    accountNumber: "12 3456 7890 1234 5678 9012 3456",
    entityName: "Easy Process",
    transferTitle: `Cuota ${getPaidInstallments() + 1}`,
  };

  const blikDetails = {
    entityName: "Easy Process",
    phoneNumber: "+48 575 987 654",
    transferTitle: `Cuota ${getPaidInstallments() + 1}`,
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Clock className="h-10 w-10 text-blue-500 mx-auto animate-spin" />
          <p className="mt-2 text-gray-600">Cargando información de pagos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center text-red-600">
          <AlertTriangle className="h-10 w-10 mx-auto" />
          <p className="mt-2">{error}</p>
          <button
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            onClick={() => window.location.reload()}
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Payment Overview */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Estado de Pagos
          </h2>
          <button
            onClick={() => setShowInfoModal(true)}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
            aria-label="Información sobre pagos"
          >
            <HelpCircle className="h-5 w-5" />
          </button>
        </div>

        {isProcessingInfo ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <CreditCard className="h-5 w-5 text-gray-600 mr-2" />
                <h3 className="font-medium text-gray-900">Total a Pagar</h3>
              </div>
              <p className="text-lg text-gray-700">Procesando información</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <CheckCircle2 className="h-5 w-5 text-gray-600 mr-2" />
                <h3 className="font-medium text-gray-900">Pagado</h3>
              </div>
              <p className="text-lg text-gray-700">Procesando información</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <Calendar className="h-5 w-5 text-gray-600 mr-2" />
                <h3 className="font-medium text-gray-900">Próximo Pago</h3>
              </div>
              <p className="text-lg text-gray-700">Procesando información</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <CreditCard className="h-5 w-5 text-blue-600 mr-2" />
                <h3 className="font-medium text-blue-900">Total a Pagar</h3>
              </div>
              <p className="text-2xl font-bold text-blue-900">
                {getTotalAmount()} PLN
              </p>
              <p className="text-sm text-blue-600 mt-1">
                En {getTotalInstallments()} cuotas
              </p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <CheckCircle2 className="h-5 w-5 text-green-600 mr-2" />
                <h3 className="font-medium text-green-900">Pagado</h3>
              </div>
              <p className="text-2xl font-bold text-green-900">
                {getPaidAmount()} PLN
              </p>
              <p className="text-sm text-green-600 mt-1">
                {getPaidInstallments()} de {getTotalInstallments()} cuotas
              </p>
            </div>
            <div
              className={`${
                isAllPaid ? "bg-green-50" : "bg-yellow-50"
              } rounded-lg p-4`}
            >
              <div className="flex items-center mb-2">
                <Calendar
                  className={`h-5 w-5 ${
                    isAllPaid ? "text-green-600" : "text-yellow-600"
                  } mr-2`}
                />
                <h3
                  className={`font-medium ${
                    isAllPaid ? "text-green-900" : "text-yellow-900"
                  }`}
                >
                  {isAllPaid ? "Todos los Pagos Completados" : "Próximo Pago"}
                </h3>
              </div>
              {isAllPaid ? (
                <p className="text-2xl font-bold text-green-900">0 PLN</p>
              ) : (
                <>
                  <p className="text-2xl font-bold text-yellow-900">
                    {getInstallmentAmount()} PLN
                  </p>
                  <p className="text-sm text-yellow-600 mt-1">
                    Vence: {nextPaymentDate}
                  </p>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Payment History */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Historial de Pagos
        </h2>
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
              {payments.length > 0 ? (
                payments.map((payment) => (
                  <tr key={payment.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {payment.reference_number}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {payment.due_date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {payment.amount} PLN
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          payment.status === "Pagado"
                            ? "bg-green-100 text-green-800"
                            : payment.status === "Vencido"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {payment.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <AlertCircle className="h-8 w-8 text-gray-400 mb-2" />
                      <p className="text-gray-500 text-base">
                        No has realizado ningún pago todavía
                      </p>
                      {paymentSetting && (
                        <p className="text-gray-400 text-sm mt-1">
                          Tu proceso requiere {paymentSetting.installments}{" "}
                          pagos de {getInstallmentAmount()} PLN
                        </p>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Buttons */}
      <div className="flex justify-start space-x-4">
        <button
          onClick={() => setShowPaymentModal(true)}
          disabled={isAllPaid || isProcessingInfo}
          className={`font-bold py-2 px-4 rounded transition duration-200 ${
            isAllPaid || isProcessingInfo
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700 text-white"
          }`}
        >
          Realizar Pago
        </button>
        <button
          onClick={handleInformarPago}
          disabled={
            isAllPaid ||
            isProcessingInfo ||
            (payments.length >= getTotalInstallments() &&
              getTotalInstallments() > 0)
          }
          className={`font-bold py-2 px-4 rounded transition duration-200 ${
            isAllPaid ||
            isProcessingInfo ||
            (payments.length >= getTotalInstallments() &&
              getTotalInstallments() > 0)
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700 text-white"
          }`}
        >
          Informar Pago
        </button>
      </div>

      {/* Enhanced Payment Modal */}
      {showPaymentModal && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto"
          onClick={() => {
            setShowPaymentModal(false);
            setPaymentMethod(null);
            setShowBankInstructions(null);
          }}
        >
          <div
            className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 relative my-8 max-h-[calc(100vh-100px)] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-4 sticky top-0 bg-white z-10">
              <h3 className="text-lg font-semibold text-gray-900">
                Realizar Pago
              </h3>
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

            {/* Payment Information */}
            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <div className="flex items-center justify-between">
                <span className="text-blue-800">
                  Cuota {getPaidInstallments() + 1} de {getTotalInstallments()}
                </span>
                <span className="font-bold text-blue-800">
                  {getInstallmentAmount()} PLN
                </span>
              </div>
              <div className="mt-2 text-sm text-blue-700">
                <AlertCircle className="h-4 w-4 inline mr-1" />
                Vencimiento: {nextPaymentDate}
              </div>
            </div>

            {/* Payment Method Selection */}
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">
                Selecciona un método de pago:
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => setPaymentMethod("bank")}
                  className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition duration-200 w-1/2 justify-center ${
                    paymentMethod === "bank"
                      ? "bg-indigo-100 text-indigo-800 border-2 border-indigo-300"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
                  }`}
                >
                  <Banknote className="h-5 w-5 mr-2" />
                  Transferencia
                </button>
                <button
                  onClick={() => setPaymentMethod("blik")}
                  className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition duration-200 w-1/2 justify-center ${
                    paymentMethod === "blik"
                      ? "bg-indigo-100 text-indigo-800 border-2 border-indigo-300"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
                  }`}
                >
                  <Phone className="h-5 w-5 mr-2" />
                  BLIK
                </button>
              </div>
            </div>

            {/* Payment Method Details */}
            {paymentMethod === "bank" && (
              <div className="bg-gray-50 p-4 rounded-lg space-y-3 border border-gray-200">
                <p className="text-sm text-gray-600 flex items-start">
                  <AlertCircle className="h-4 w-4 mr-2 text-yellow-500 flex-shrink-0 mt-0.5" />
                  <span>
                    Transferencia a <strong>PKO Bank Polski</strong>. Puede
                    demorar hasta 24 horas hábiles dependiendo del banco emisor.
                  </span>
                </p>
                <div className="border-t border-gray-200 pt-3">
                  <p className="text-sm text-gray-500">Número de Cuenta:</p>
                  <p className="text-base font-medium text-gray-900">
                    {bankTransferDetails.accountNumber}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Nombre de la Entidad:</p>
                  <p className="text-base font-medium text-gray-900">
                    {bankTransferDetails.entityName}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">
                    Título de la Transferencia:
                  </p>
                  <p className="text-base font-medium text-gray-900">
                    {bankTransferDetails.transferTitle}
                  </p>
                </div>
                <div className="border-t border-gray-200 pt-3">
                  <p
                    className="text-sm text-indigo-600 cursor-pointer hover:underline flex items-center"
                    onClick={() =>
                      setShowBankInstructions(
                        showBankInstructions === "PKO" ? null : "PKO"
                      )
                    }
                  >
                    {showBankInstructions === "PKO" ? (
                      <X className="h-4 w-4 mr-1" />
                    ) : (
                      <CheckCircle2 className="h-4 w-4 mr-1" />
                    )}
                    Instrucciones para PKO Bank Polski
                  </p>
                  {showBankInstructions === "PKO" && bankInstructions.PKO}
                  <p
                    className="text-sm text-indigo-600 cursor-pointer hover:underline mt-2 flex items-center"
                    onClick={() =>
                      setShowBankInstructions(
                        showBankInstructions === "Santander"
                          ? null
                          : "Santander"
                      )
                    }
                  >
                    {showBankInstructions === "Santander" ? (
                      <X className="h-4 w-4 mr-1" />
                    ) : (
                      <CheckCircle2 className="h-4 w-4 mr-1" />
                    )}
                    Instrucciones para Santander
                  </p>
                  {showBankInstructions === "Santander" &&
                    bankInstructions.Santander}
                </div>
              </div>
            )}

            {paymentMethod === "blik" && (
              <div className="bg-gray-50 p-4 rounded-lg space-y-3 border border-gray-200">
                <p className="text-sm text-gray-600 flex items-start">
                  <CheckCircle2 className="h-4 w-4 mr-2 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>
                    Pago inmediato con BLIK. Se acreditará automáticamente al
                    confirmar la transacción.
                  </span>
                </p>
                <div className="border-t border-gray-200 pt-3">
                  <p className="text-sm text-gray-500">Nombre:</p>
                  <p className="text-base font-medium text-gray-900">
                    {blikDetails.entityName}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Número de Teléfono:</p>
                  <p className="text-base font-medium text-gray-900">
                    {blikDetails.phoneNumber}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Título:</p>
                  <p className="text-base font-medium text-gray-900">
                    {blikDetails.transferTitle}
                  </p>
                </div>
                <div className="mt-2 bg-blue-50 p-3 rounded-md border border-blue-200">
                  <p className="text-sm text-blue-800">
                    <span className="font-semibold">Nota:</span> Recuerda
                    incluir el título exacto en tu transferencia para que
                    podamos identificar tu pago correctamente.
                  </p>
                </div>
              </div>
            )}

            {/* Modal Footer */}
            <div className="mt-6 flex justify-end sticky bottom-0 bg-white pt-3">
              <button
                onClick={() => {
                  setShowPaymentModal(false);
                  setPaymentMethod(null);
                  setShowBankInstructions(null);
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition duration-200 mr-2"
              >
                Cerrar
              </button>
              {paymentMethod && (
                <button
                  onClick={async () => {
                    // Registrar el pago como realizado
                    if (user?.id && !isAllPaid) {
                      try {
                        const newPayment = {
                          client_id: user.id,
                          reference_number: `PAY-${String(
                            getPaidInstallments() + 1
                          ).padStart(3, "0")}`,
                          amount: getInstallmentAmount(),
                          due_date:
                            nextPaymentDate ||
                            new Date().toISOString().split("T")[0],
                          installment_number: getPaidInstallments() + 1,
                          total_installments: getTotalInstallments(),
                          status: "Pendiente",
                          payment_method:
                            paymentMethod === "bank" ? "Transferencia" : "BLIK",
                          created_at: new Date().toISOString(),
                          updated_at: new Date().toISOString(),
                        };

                        const { data, error: insertError } = await supabase
                          .from("payments")
                          .insert([newPayment])
                          .select();

                        if (insertError) throw insertError;

                        if (data) {
                          setPayments([...payments, data[0]]);
                        }
                      } catch (err) {
                        console.error("Error al registrar el pago:", err);
                      }
                    }

                    setShowPaymentModal(false);
                    setPaymentMethod(null);
                    setShowBankInstructions(null);
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200"
                >
                  He Realizado el Pago
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Info Modal */}
      {showInfoModal && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto"
          onClick={() => setShowInfoModal(false)}
        >
          <div
            className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 relative my-8 max-h-[calc(100vh-100px)] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4 sticky top-0 bg-white z-10">
              <h3 className="text-lg font-semibold text-gray-900">
                Información de Pagos
              </h3>
              <button
                onClick={() => setShowInfoModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              {paymentSetting ? (
                <>
                  <div className="flex items-start">
                    <AlertCircle className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
                    <p className="text-gray-700">
                      Tu proceso de{" "}
                      <strong>{paymentSetting?.process_type}</strong> tiene un
                      costo total de <strong>{getTotalAmount()} PLN</strong>,
                      dividido en{" "}
                      <strong>{getTotalInstallments()} cuotas</strong> de{" "}
                      <strong>{getInstallmentAmount()} PLN</strong> cada una.
                    </p>
                  </div>
                </>
              ) : (
                <div className="flex items-start">
                  <AlertCircle className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
                  <p className="text-gray-700">
                    La información sobre tu proceso de pago aún se está
                    procesando. Cuando esté disponible, podrás ver el detalle de
                    cuotas y montos.
                  </p>
                </div>
              )}

              <div className="flex items-start">
                <CheckCircle2 className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
                <p className="text-gray-700">
                  Puedes informar pagos dependiendo de la cantidad de cuotas que
                  tengas. El botón "Informar Pago" se desactivará cuando hayas
                  informado todas las cuotas correspondientes.
                </p>
              </div>

              <div className="flex items-start">
                <Calendar className="h-5 w-5 text-yellow-600 mr-2 mt-0.5" />
                <p className="text-gray-700">
                  Los pagos informados serán verificados por nuestro equipo
                  administrativo. Una vez confirmados, el estado cambiará de
                  "Pendiente" a "Pagado".
                </p>
              </div>

              <div className="bg-blue-50 p-3 rounded-md border border-blue-200">
                <p className="text-sm text-blue-800">
                  <span className="font-semibold">Importante:</span> Si tienes
                  alguna duda sobre tus pagos o necesitas un plan de pagos
                  personalizado, contáctanos a través de la sección de soporte.
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end sticky bottom-0 bg-white pt-3">
              <button
                onClick={() => setShowInfoModal(false)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-200"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

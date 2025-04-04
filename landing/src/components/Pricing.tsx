import React, { useState } from 'react';
import { Check, Shield, Clock, FileText, UserCheck, Calendar, Import as Passport, Users, AlertCircle, ArrowRight, X, FileCheck, CreditCard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-scroll';

const Pricing = () => {
  const [showDateCalculator, setShowDateCalculator] = useState(false);
  const [entryDate, setEntryDate] = useState('');
  const [deadlineResult, setDeadlineResult] = useState(null);
  const [showProcessSelection, setShowProcessSelection] = useState(false);
  const [showRegistration, setShowRegistration] = useState(false);
  const [processType, setProcessType] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });

  const features = [
    { icon: Shield, text: "Proceso 100% legal y garantizado" },
    { icon: Clock, text: "Inicio en menos de 48 horas" },
    { icon: FileText, text: "Documentación y traducciones incluidas" },
    { icon: UserCheck, text: "Asesoría personalizada en español" }
  ];

  const requirements = [
    { 
      icon: Calendar, 
      title: "90 Días desde el Ingreso", 
      description: "Debes iniciar el trámite dentro de los primeros 90 días desde tu ingreso a la Unión Europea.",
      critical: true 
    },
    { 
      icon: Passport, 
      title: "Pasaporte Válido", 
      description: "Tu pasaporte debe estar vigente durante todo el proceso de residencia.",
      critical: true 
    },
    { 
      icon: Users, 
      title: "Motivo de Estancia", 
      description: "Necesitas un motivo válido: trabajo, estudios o reunificación familiar.",
      critical: true 
    }
  ];

  const calculateDeadline = (date) => {
    if (!date) return;

    const entry = new Date(date);
    const deadline = new Date(entry);
    deadline.setDate(entry.getDate() + 89);

    const today = new Date();
    const daysLeft = Math.floor((deadline - today) / (1000 * 60 * 60 * 24));

    let result = {
      deadlineDate: deadline.toLocaleDateString('es-ES'),
      daysLeft: daysLeft
    };

    if (daysLeft < 0) {
      result.status = 'expired';
      result.message = '⚠️ Lo sentimos, el plazo de 90 días ya ha expirado. Contáctanos para evaluar otras opciones.';
    } else if (daysLeft <= 7) {
      result.status = 'urgent';
      result.message = '⚡ ¡Urgente! Te quedan pocos días. Contáctanos inmediatamente para iniciar tu proceso.';
    } else {
      result.status = 'ok';
      result.message = `✅ Perfecto! Tienes hasta el ${result.deadlineDate} para iniciar el proceso (${daysLeft} días restantes).`;
    }

    setDeadlineResult(result);
  };

  const handleProcessSelection = (type) => {
    setProcessType(type);
    if (type === 'existing') {
      setShowRegistration(true);
    } else {
      setShowRegistration(false);
      // Handle new process flow
    }
  };

  const handleRegistrationSubmit = (e) => {
    e.preventDefault();
    // Here you would typically handle the form submission
    // For now, we'll simulate moving to payment
    showPaymentOptions();
  };

  const showPaymentOptions = () => {
    // This would typically integrate with your payment API
    alert('Redirigiendo al sistema de pago...');
  };

  return (
    <section id="pricing" className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">Precio Único</span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-4">Sin costos ocultos ni sorpresas</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
             Incluye Representacion completa en tu proceso de residencia
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Requisitos y Calculadora */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Requisitos Básicos</h3>
              <div className="space-y-6">
                {requirements.map((req, index) => (
                  <div 
                    key={index} 
                    className="flex items-start space-x-4 p-4 bg-blue-50/50 rounded-xl border border-blue-100"
                  >
                    <div className="bg-blue-100 p-2 rounded-lg shrink-0">
                      <req.icon className="text-blue-600 h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">{req.title}</h4>
                      <p className="text-gray-600 text-sm">{req.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setShowDateCalculator(!showDateCalculator)}
                className="mt-8 w-full bg-blue-600 text-white py-4 px-6 rounded-xl font-semibold hover:bg-blue-700 transition duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-blue-500/25"
              >
                {showDateCalculator ? <X size={20} /> : <AlertCircle size={20} />}
                {showDateCalculator ? 'Cerrar Calculadora' : 'Comprobar si estás dentro del plazo'}
              </button>
            </div>

            {showDateCalculator && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-gray-100"
              >
                <h4 className="text-xl font-bold text-gray-900 mb-6">Calcula tu Fecha Límite</h4>
                <div className="space-y-6">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Fecha de ingreso a la UE:
                    </label>
                    <input
                      type="date"
                      value={entryDate}
                      onChange={(e) => {
                        setEntryDate(e.target.value);
                        calculateDeadline(e.target.value);
                      }}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      max={new Date().toISOString().split('T')[0]}
                    />
                  </div>

                  {deadlineResult && (
                    <div className={`p-4 rounded-lg ${
                      deadlineResult.status === 'expired' ? 'bg-red-50 text-red-700 border border-red-200' :
                      deadlineResult.status === 'urgent' ? 'bg-yellow-50 text-yellow-700 border border-yellow-200' :
                      'bg-green-50 text-green-700 border border-green-200'
                    }`}>
                      <p className="font-medium">{deadlineResult.message}</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Precio y Características */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-blue-100">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-8 text-white">
                <h3 className="text-2xl font-bold mb-2">Proceso Completo de Residencia</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-light">PLN</span>
                  <span className="text-6xl font-bold">1500</span>
                </div>
                <p className="mt-4 text-blue-100">Hasta en 3 Pagos Mensuales </p>
              </div>

              <div className="p-8">
                <div className="space-y-6">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <div className="bg-blue-50 p-2 rounded-full">
                        <feature.icon className="text-blue-600 h-5 w-5" />
                      </div>
                      <span className="text-gray-700">{feature.text}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-8 space-y-4">
                  {!showProcessSelection && (
                    <button
                      onClick={() => setShowProcessSelection(true)}
                      className="block w-full bg-blue-600 text-white text-center py-4 px-6 rounded-xl font-semibold hover:bg-blue-700 transition duration-300 shadow-lg hover:shadow-blue-500/25"
                    >
                      Comenzar Proceso
                    </button>
                  )}

                  <AnimatePresence>
                    {showProcessSelection && !showRegistration && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-4"
                      >
                        <h4 className="text-lg font-semibold text-gray-900 mb-4">¿Ya iniciaste tu proceso?</h4>
                        <button
                          onClick={() => handleProcessSelection('existing')}
                          className="block w-full bg-green-600 text-white text-center py-4 px-6 rounded-xl font-semibold hover:bg-green-700 transition duration-300"
                        >
                          Sí, ya tengo proceso iniciado
                        </button>
                        <button
                          onClick={() => handleProcessSelection('new')}
                          className="block w-full bg-blue-600 text-white text-center py-4 px-6 rounded-xl font-semibold hover:bg-blue-700 transition duration-300"
                        >
                          No, quiero comenzar de cero
                        </button>
                      </motion.div>
                    )}

                    {showRegistration && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-4"
                      >
                        <h4 className="text-lg font-semibold text-gray-900 mb-4">Completa tus datos</h4>
                        <form onSubmit={handleRegistrationSubmit} className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Nombre completo
                            </label>
                            <input
                              type="text"
                              value={formData.name}
                              onChange={(e) => setFormData({...formData, name: e.target.value})}
                              className="w-full p-3 border border-gray-300 rounded-lg"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Email
                            </label>
                            <input
                              type="email"
                              value={formData.email}
                              onChange={(e) => setFormData({...formData, email: e.target.value})}
                              className="w-full p-3 border border-gray-300 rounded-lg"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Teléfono
                            </label>
                            <input
                              type="tel"
                              value={formData.phone}
                              onChange={(e) => setFormData({...formData, phone: e.target.value})}
                              className="w-full p-3 border border-gray-300 rounded-lg"
                              required
                            />
                          </div>
                          <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-4 px-6 rounded-xl font-semibold hover:bg-blue-700 transition duration-300 flex items-center justify-center gap-2"
                          >
                            <CreditCard size={20} />
                            Ir al Pago
                          </button>
                        </form>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;

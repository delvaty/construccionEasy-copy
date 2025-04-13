import React, { useState } from 'react';
import { Shield, Clock, FileText, UserCheck, Calendar, Import as Passport, Users, AlertCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Importar nuestro hook de autenticación

// Definición de interfaces para el tipado
interface Requirement {
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  title: string;
  description: string;
  critical: boolean;
}

interface Feature {
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  text: string;
}

interface DeadlineResult {
  deadlineDate: string;
  daysLeft: number;
  status: 'expired' | 'urgent' | 'ok';
  message: string;
}

const Pricing: React.FC = () => {
  const [showDateCalculator, setShowDateCalculator] = useState<boolean>(false);
  const [entryDate, setEntryDate] = useState<string>('');
  const [deadlineResult, setDeadlineResult] = useState<DeadlineResult | null>(null);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth(); // Usamos el contexto de autenticación

  const features: Feature[] = [
    { icon: Shield, text: "Proceso 100% legal y garantizado" },
    { icon: Clock, text: "Inicio en menos de 48 horas" },
    { icon: FileText, text: "Documentación y traducciones incluidas" },
    { icon: UserCheck, text: "Asesoría personalizada en español" }
  ];

  const requirements: Requirement[] = [
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

  const calculateDeadline = (date: string): void => {
    if (!date) return;

    const entry = new Date(date);
    const deadline = new Date(entry);
    deadline.setDate(entry.getDate() + 89);

    const today = new Date();
    const daysLeft = Math.floor((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    const result: DeadlineResult = {
      deadlineDate: deadline.toLocaleDateString('es-ES'),
      daysLeft: daysLeft,
      status: 'ok',
      message: ''
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

  // Función modificada para manejar la redirección según el estado de autenticación
  const handleStartProcess = (): void => {
    if (isAuthenticated) {
      // Si el usuario está autenticado, redirigir directamente al formulari
      /* window.location.href = "http://localhost:5175/"; */
      navigate("/form");
    } else {
      // Si no está autenticado, redirigir al login
      navigate('/login', { state: { returnUrl: "/form" } });
    }
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

            <AnimatePresence>
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
            </AnimatePresence>
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

                <div className="mt-8">
                  <button
                    onClick={handleStartProcess}
                    className="block w-full bg-blue-600 text-white text-center py-4 px-6 rounded-xl font-semibold hover:bg-blue-700 transition duration-300 shadow-lg hover:shadow-blue-500/25"
                  >
                    Comenzar Proceso
                  </button>
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
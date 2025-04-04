import React from 'react';
    import { motion } from 'framer-motion';
    import { CreditCard, Clock, Shield, HelpCircle, Building2, Wallet } from 'lucide-react';
    import { Link } from 'react-router-dom';

    const Banking = () => {
      return (
        <section className="py-20 bg-gradient-to-b from-white to-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className="bg-green-500/10 inline-block rounded-full px-4 py-2 mb-6">
                  <span className="text-green-600 font-medium">Servicio Gratuito</span>
                </div>

                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  ¿Necesitas abrir una <br />
                  <span className="text-blue-600">cuenta bancaria en Polonia?</span>
                </h2>

                <div className="space-y-6 mb-8">
                  <div className="flex items-start space-x-4">
                    <div className="bg-blue-50 p-2 rounded-lg">
                      <Building2 className="text-blue-600 h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Bancos Asociados</h3>
                      <p className="text-gray-600">Te conectamos con bancos que facilitan la apertura de cuentas para extranjeros, sin costo.</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="bg-blue-50 p-2 rounded-lg">
                      <Clock className="text-blue-600 h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Proceso Ágil</h3>
                      <p className="text-gray-600">Acompañamiento gratuito para agilizar el proceso de apertura de tu cuenta.</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="bg-blue-50 p-2 rounded-lg">
                      <Wallet className="text-blue-600 h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Documentación Necesaria</h3>
                      <p className="text-gray-600">Te ayudamos a preparar todos los documentos requeridos por el banco, sin ningún costo.</p>
                    </div>
                  </div>
                </div>

                <Link to="/banking" className="bg-blue-600 text-white px-8 py-4 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-blue-500/25 w-full sm:w-auto">
                  <HelpCircle size={20} />
                  Solicitar Ayuda Gratuita
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="relative"
              >
                <img
                  src="https://images.unsplash.com/photo-1601597111158-2fceff292cdc?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
                  alt="Tarjeta bancaria y documentos"
                  className="rounded-2xl shadow-2xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
              </motion.div>
            </div>
          </div>
        </section>
      );
    };

    export default Banking;

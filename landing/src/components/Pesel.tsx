import React from 'react';
import { motion } from 'framer-motion';
import { FileCheck, Clock, Shield, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom'; // Agrega esta importación

const Pesel = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
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
              ¿Necesitas tu número PESEL? <br />
              <span className="text-blue-600">¡Te ayudamos sin costo!</span>
            </h2>
            
            <div className="space-y-6 mb-8">
              <div className="flex items-start space-x-4">
                <div className="bg-blue-50 p-2 rounded-lg">
                  <Clock className="text-blue-600 h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Rápido y Simple</h3>
                  <p className="text-gray-600">Obtén tu PESEL en el menor tiempo posible con nuestro acompañamiento gratuito.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-blue-50 p-2 rounded-lg">
                  <FileCheck className="text-blue-600 h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Documentación Correcta</h3>
                  <p className="text-gray-600">Te ayudamos con todos los documentos necesarios sin ningún costo.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-blue-50 p-2 rounded-lg">
                  <Shield className="text-blue-600 h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">100% Legal</h3>
                  <p className="text-gray-600">Proceso completamente legal y supervisado por profesionales, sin costos ocultos.</p>
                </div>
              </div>
            </div>

            <Link to="/servicios">
              <button className="bg-blue-600 text-white px-8 py-4 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-blue-500/25 w-full sm:w-auto">
                <HelpCircle size={20} />
                Solicitar PESEL Gratis
              </button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <img
              src="https://gopoland.eu/wp-content/uploads/2020/08/Adsiz-tasarim.jpg"
              alt="Documento de identidad"
              className="rounded-2xl shadow-2xl"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Pesel;

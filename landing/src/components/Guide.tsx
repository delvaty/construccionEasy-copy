import React from 'react';
    import { motion } from 'framer-motion';
    import { FileText, Download, BookOpen, Brain, CheckCircle, HelpCircle } from 'lucide-react';
    import { Link } from 'react-router-dom';

    const Guide = () => {
      return (
        <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className="bg-blue-500/10 inline-block rounded-full px-4 py-2 mb-6">
                  <span className="text-blue-600 font-medium">Guía Gratuita</span>
                </div>

                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  ¿Te sientes perdido con <br />
                  <span className="text-blue-600">tanta información?</span>
                </h2>

                <div className="space-y-6 mb-8">
                  <div className="flex items-start space-x-4">
                    <div className="bg-blue-50 p-2 rounded-lg">
                      <Brain className="text-blue-600 h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Conceptos Claros</h3>
                      <p className="text-gray-600">Explicamos en lenguaje simple todos los términos y procesos importantes.</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="bg-blue-50 p-2 rounded-lg">
                      <CheckCircle className="text-blue-600 h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Paso a Paso</h3>
                      <p className="text-gray-600">Todas las etapas del proceso de residencia explicadas en detalle.</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="bg-blue-50 p-2 rounded-lg">
                      <BookOpen className="text-blue-600 h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Recursos Útiles</h3>
                      <p className="text-gray-600">Lista de documentos, requisitos y consejos prácticos para tu proceso.</p>
                    </div>
                  </div>
                </div>

                <Link to="/guia" className="bg-blue-600 text-white px-8 py-4 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-blue-500/25 w-full sm:w-auto">
                  <Download size={20} />
                  Descargar Guía Gratuita
                </Link>
              </motion.div>

              <div>
                <img
                  src="img/guia.webp"
                  alt="Guía de residencia"
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </section>
      );
    };

    export default Guide;

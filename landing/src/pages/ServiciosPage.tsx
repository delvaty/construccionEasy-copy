import React, { useEffect } from 'react';
    import { motion } from 'framer-motion';
    import { FileText, ArrowRight, CheckCircle, Clock, Users } from 'lucide-react';

    const ServiciosPage = () => {
      useEffect(() => {
        window.scrollTo(0, 0);
      }, []);

      const steps = [
        {
          image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
          title: "Evaluación Inicial",
          description: "Analizamos tu caso y situación actual para determinar la mejor estrategia."
        },
        {
          image: "https://images.unsplash.com/photo-1590650153855-d9e808231d41?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
          title: "Preparación de Documentos",
          description: "Recopilamos y organizamos toda la documentación necesaria."
        },
        {
          image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
          title: "Presentación y Seguimiento",
          description: "Gestionamos tu trámite y te mantenemos informado en cada paso."
        }
      ];

      return (
        <div className="pt-20 bg-gray-50">
          {/* Hero Section */}
          <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  <div className="bg-blue-500/10 inline-block rounded-full px-4 py-2 mb-6">
                    <span className="text-blue-600 font-medium">Servicios Adicionales</span>
                  </div>
                  
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                    Soluciones Integrales para tu <br />
                    <span className="text-blue-600">Residencia en Polonia</span>
                  </h1>
                  
                  <div className="space-y-6 mb-8">
                    <div className="flex items-start space-x-4">
                      <div className="bg-blue-50 p-2 rounded-lg">
                        <Clock className="text-blue-600 h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">Atención Rápida</h3>
                        <p className="text-gray-600">Respuesta garantizada en menos de 24 horas.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4">
                      <div className="bg-blue-50 p-2 rounded-lg">
                        <CheckCircle className="text-blue-600 h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">Servicio Personalizado</h3>
                        <p className="text-gray-600">Adaptamos nuestros servicios a tus necesidades específicas.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4">
                      <div className="bg-blue-50 p-2 rounded-lg">
                        <Users className="text-blue-600 h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">Equipo Experto</h3>
                        <p className="text-gray-600">Profesionales con amplia experiencia en trámites migratorios.</p>
                      </div>
                    </div>
                  </div>

                  <button className="bg-blue-600 text-white px-8 py-4 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-blue-500/25 w-full sm:w-auto">
                    <FileText size={20} />
                    Solicitar Información
                  </button>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                  className="relative"
                >
                  <div className="bg-white p-6 rounded-2xl shadow-xl">
                    <h3 className="text-xl font-semibold mb-4">Solicitar Servicio</h3>
                    <form className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nombre completo
                        </label>
                        <input
                          type="text"
                          className="w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Tu nombre"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Correo electrónico
                        </label>
                        <input
                          type="email"
                          className="w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="tu@email.com"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Teléfono
                        </label>
                        <input
                          type="tel"
                          className="w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="+48 XXX XXX XXX"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Servicio de interés
                        </label>
                        <select className="w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500">
                          <option>Residencia Temporal</option>
                          <option>Residencia Permanente</option>
                          <option>Reunificación Familiar</option>
                          <option>Otro</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Mensaje
                        </label>
                        <textarea
                          rows={4}
                          className="w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Describe tu situación..."
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition duration-300 flex items-center justify-center gap-2"
                      >
                        Enviar Solicitud
                        <ArrowRight size={20} />
                      </button>
                    </form>
                  </div>
                </motion.div>
              </div>
            </div>
          </section>

          {/* Process Steps */}
          <section className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Proceso Simple y Efectivo</h2>
                <p className="text-xl text-gray-600">Conoce cómo trabajamos para ayudarte</p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                {steps.map((step, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.2 }}
                    viewport={{ once: true }}
                    className="bg-white rounded-xl overflow-hidden shadow-lg"
                  >
                    <img
                      src={step.image}
                      alt={step.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
                      <p className="text-gray-600">{step.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        </div>
      );
    };

    export default ServiciosPage;

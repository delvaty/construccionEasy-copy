import React, { useEffect } from 'react';
    import { motion } from 'framer-motion';
    import { CreditCard, CheckCircle, FileText, Users, Building } from 'lucide-react';

    const BankingPage = () => {
      useEffect(() => {
        window.scrollTo(0, 0);
      }, []);

      const steps = [
        {
          image: "https://images.unsplash.com/photo-1590650153855-d9e808231d41?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
          title: "Documentación",
          description: "Te ayudamos a preparar todos los documentos necesarios."
        },
        {
          image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
          title: "Elección del Banco",
          description: "Te asesoramos para elegir el banco que mejor se adapte a tus necesidades."
        },
        {
          image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
          title: "Apertura de Cuenta",
          description: "Te acompañamos en el proceso de apertura de tu cuenta bancaria."
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
                  <div className="bg-green-500/10 inline-block rounded-full px-4 py-2 mb-6">
                    <span className="text-green-600 font-medium">Servicio Gratuito</span>
                  </div>

                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                    Abre tu Cuenta Bancaria <br />
                    <span className="text-blue-600">en Polonia sin Complicaciones</span>
                  </h1>

                  <div className="space-y-6 mb-8">
                    <div className="flex items-start space-x-4">
                      <div className="bg-blue-50 p-2 rounded-lg">
                        <FileText className="text-blue-600 h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">Asesoría Personalizada</h3>
                        <p className="text-gray-600">Te guiamos en cada paso del proceso.</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <div className="bg-blue-50 p-2 rounded-lg">
                        <CheckCircle className="text-blue-600 h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">Sin Costo Adicional</h3>
                        <p className="text-gray-600">Nuestro servicio de apertura de cuenta es completamente gratuito.</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <div className="bg-blue-50 p-2 rounded-lg">
                        <Users className="text-blue-600 h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">Soporte Continuo</h3>
                        <p className="text-gray-600">Estamos disponibles para resolver cualquier duda.</p>
                      </div>
                    </div>
                  </div>
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
                </motion.div>
              </div>
            </div>
          </section>

          {/* Process Steps */}
          <section className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Proceso de Apertura de Cuenta</h2>
                <p className="text-xl text-gray-600">Sigue estos sencillos pasos</p>
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

    export default BankingPage;

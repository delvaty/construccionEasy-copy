import React, { useEffect } from 'react';
    import { motion } from 'framer-motion';
    import { FileText, Download, BookOpen, Brain, CheckCircle, HelpCircle } from 'lucide-react';

    const GuiaPage = () => {
      useEffect(() => {
        window.scrollTo(0, 0);
      }, []);

      const sections = [
        {
          image: "https://images.unsplash.com/photo-1522199755839-a2bacb67c546?ixlib=rb-1.2.1&amp;auto=format&amp;fit=crop&amp;w=1000&amp;q=80",
          title: "Conceptos Claros",
          description: "Explicamos en lenguaje simple todos los términos y procesos importantes."
        },
        {
          image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-1.2.1&amp;auto=format&amp;fit=crop&amp;w=1000&amp;q=80",
          title: "Paso a Paso",
          description: "Todas las etapas del proceso de residencia explicadas en detalle."
        },
        {
          image: "https://images.unsplash.com/photo-1590650153855-d9e808231d41?ixlib=rb-1.2.1&amp;auto=format&amp;fit=crop&amp;w=1000&amp;q=80",
          title: "Recursos Útiles",
          description: "Lista de documentos, requisitos y consejos prácticos para tu proceso."
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
                    <span className="text-blue-600 font-medium">Guía Gratuita</span>
                  </div>

                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                    Descarga tu Guía Gratuita <br />
                    <span className="text-blue-600">para la Residencia en Polonia</span>
                  </h1>

                  <div className="space-y-6 mb-8">
                    <div className="flex items-start space-x-4">
                      <div className="bg-blue-50 p-2 rounded-lg">
                        <Brain className="text-blue-600 h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">Conceptos Claros</h3>
                        <p className="text-gray-600">Todo lo que necesitas saber, explicado fácilmente.</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <div className="bg-blue-50 p-2 rounded-lg">
                        <CheckCircle className="text-blue-600 h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">Guía Paso a Paso</h3>
                        <p className="text-gray-600">Sigue el proceso detallado para obtener tu residencia.</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <div className="bg-blue-50 p-2 rounded-lg">
                        <BookOpen className="text-blue-600 h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">Recursos y Consejos</h3>
                        <p className="text-gray-600">Información práctica y recomendaciones útiles.</p>
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
                    src="img/guia.webp"
                    alt="Guía de residencia"
                    className="w-full h-auto rounded-2xl shadow-xl"
                  />
                </motion.div>
              </div>
            </div>
          </section>

          {/* Informational Sections */}
          <section className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Contenido de la Guía</h2>
                <p className="text-xl text-gray-600">Una guía completa para facilitar tu proceso</p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                {sections.map((section, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.2 }}
                    viewport={{ once: true }}
                    className="bg-white rounded-xl overflow-hidden shadow-lg"
                  >
                    <img
                      src={section.image}
                      alt={section.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{section.title}</h3>
                      <p className="text-gray-600">{section.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        </div>
      );
    };

    export default GuiaPage;

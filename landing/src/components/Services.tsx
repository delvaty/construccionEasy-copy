import React from 'react';
import { FileText, ArrowRight, CalendarCheck, Scale } from 'lucide-react';
import { motion } from 'framer-motion';

const ServiceCard = ({ icon: Icon, title, description, features }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="p-6 bg-white rounded-lg shadow-md"
    >
      <div className="mb-4">
        <Icon className="h-8 w-8 text-blue-600" />
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      <ul className="space-y-2">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start text-gray-700">
            <ArrowRight className="h-4 w-4 text-blue-500 mr-2 mt-1 flex-shrink-0" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
};

const ServicesSection = () => {
  return (
    <section id="servicios" className="section-padding bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold gradient-text sm:text-4xl lg:text-5xl">
             ¿Que Ofrecemos?
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              Soluciones prácticas para cada etapa del proceso
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <ServiceCard
            icon={FileText}
            title="Inicio de Residencia"
            description="Gestionamos todo el proceso desde cero con eficiencia y precisión."
            features={[
              "Evaluación gratuita",
              "Preparación de documentos",
              "Presentación oficial",
              "Seguimiento completo"
            ]}
          />
          <ServiceCard
            icon={ArrowRight}
            title="Continuar Proceso"
            description="Resolvemos trabas y avanzamos tu solicitud con expertise."
            features={[
              "Revisión del estado",
              "Corrección de errores",
              "Presentación de poderes",
              "Cancelación de poderes",
              "Asesoría legal"
            ]}
          />
          <ServiceCard
            icon={CalendarCheck}
            title="Gestión de Citas"
            description="Recuperamos citas perdidas y coordinamos nuevas fechas."
            features={[
              "Reprogramación rápida",
              "Contacto con autoridades",
              "Seguimiento activo",
              "Confirmación asegurada"
            ]}
          />
          <ServiceCard
            icon={Scale}
            title="Apelaciones"
            description="Defendemos tu caso ante negativas con estrategia legal."
            features={[
              "Análisis detallado",
              "Argumentos sólidos",
              "Documentación extra",
              "Representación legal"
            ]}
          />
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;

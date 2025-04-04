import React from 'react';
import { Clock, UserCheck, FileCheck, Mail, Languages, Monitor, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const AdvantageCard = ({ icon: Icon, title, description }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    viewport={{ once: true }}
    className="flex items-start p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300"
  >
    <div className="text-blue-500 mr-4">
      <Icon size={24} />
    </div>
    <div>
      <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  </motion.div>
);

const Advantages = () => {
  const advantages = [
    {
      icon: Clock,
      title: "Inicio Rápido",
      description: "Tu proceso comienza en menos de 48 horas con seguimiento detallado desde el primer día."
    },
    {
      icon: UserCheck,
      title: "Representación Total",
      description: "Te representamos ante las autoridades polacas, manteniéndote informado en cada etapa."
    },
    {
      icon: FileCheck,
      title: "Preparación de Documentos", // Reemplacé "Gestión Documental"
      description: "Nos encargamos de preparar y revisar tus documentos, con actualizaciones en todo momento."
    },
    {
      icon: Monitor,
      title: "Seguimiento en Tiempo Real",
      description: "Accede a nuestro sistema exclusivo para ver el estado de tu proceso cuando quieras."
    },
    {
      icon: Mail,
      title: "Notificaciones Automáticas",
      description: "Recibe actualizaciones por email y SMS sobre cada avance o cambio importante."
    },
    {
      icon: Languages,
      title: "Atención en Español",
      description: "Comunicación clara y personalizada en tu idioma, siempre a tu disposición."
    }
  ];

  return (
    <section id="advantages" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">¿Por Qué Elegirnos?</h2>
          <p className="text-xl text-gray-600 leading-relaxed">
            Seguimiento detallado y un sistema propio para tu tranquilidad
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {advantages.map((advantage, index) => (
            <AdvantageCard key={index} {...advantage} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Advantages;

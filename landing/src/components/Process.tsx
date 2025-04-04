import React from 'react';
import { ClipboardCheck, FileText, UserCheck, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const ProcessStep = ({ number, icon: Icon, title, description, isLast = false }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    viewport={{ once: true }}
    className="relative flex flex-col items-center text-center"
  >
    <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mb-6 shadow-lg transform hover:scale-110 transition-transform duration-300">
      {number}
    </div>
    {!isLast && (
      <div className="absolute top-10 left-[60%] w-full border-t-2 border-dashed border-blue-200 hidden md:block"></div>
    )}
    <div className="bg-blue-50 p-4 rounded-full text-blue-600 mb-4">
      <Icon size={32} />
    </div>
    <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
    <p className="text-gray-600 max-w-sm">{description}</p>
  </motion.div>
);

const Process = () => {
  const steps = [
    {
      number: "01",
      icon: ClipboardCheck,
      title: "Evaluación Gratuita",
      description: "Analizamos tu caso y creamos un plan personalizado para tu situación específica."
    },
    {
      number: "02",
      icon: FileText,
      title: "Documentación",
      description: "Preparamos y traducimos todos tus documentos necesarios para el proceso."
    },
    {
      number: "03",
      icon: UserCheck,
      title: "Acompañamiento",
      description: "Te representamos ante las autoridades hasta obtener tu residencia."
    }
  ];

  return (
    <section id="process" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">Proceso Simple</span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-4">
           Paso a Paso
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Un proceso claro y transparente, diseñado para tu tranquilidad
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          {steps.map((step, index) => (
            <ProcessStep 
              key={index} 
              {...step} 
              isLast={index === steps.length - 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Process;

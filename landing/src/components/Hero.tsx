import React from 'react';
import { Link } from 'react-scroll';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import { Link as RouterLink } from 'react-router-dom';
import 'swiper/css';
import 'swiper/css/pagination';

const HeroSlide = ({ image, title, description }) => (
  <div className="flex flex-col items-center text-center px-4 h-full w-full max-w-md mx-auto">
    <div className="mb-4 sm:mb-6">
      <h3 className="text-xl sm:text-2xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-gray-100 text-sm sm:text-base">{description}</p>
    </div>
    <div className="relative w-full h-64 sm:h-80">
      {/* Quité shadow-xl */}
      <img 
        src={image} 
        alt={title} 
        className="w-full h-full object-cover rounded-xl transition-transform duration-300 hover:scale-105"
      />
    </div>
  </div>
);

const Hero = () => {
  const processSteps = [
    {
      image: "img/inicio.webp",
      title: "En 48 Horas",
      description: "Presentación de tu Solicitud"
    },
    {
      image: "img/yellow.webp",
      title: "En 3 Semanas",
      description: "Recibiras tu Carta Amarilla"
    },
    {
      image: "img/seguimiento.webp",
      title: "Sistema de Seguimiento",
      description: "Directamente conectado con la Oficina de Extrangeria, Tendras Informacion Actualizada del estado de tu proceso"
    },
    {
      image: "img/documentos.webp",
      title: "Todos Los documentos al Alcance",
      description: "Dispone de tu documentacion Ordenada y Actualizada "
    },
  ];

  return (
    <section
      id="hero"
      className="relative min-h-[100svh] flex items-center w-full"
      style={{
        backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.65), rgba(0, 0, 0, 0.65)), url("https://images.unsplash.com/photo-1514924013411-cbf25faa35bb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2090&q=80")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-black/50"></div>

      <div className="relative w-full max-w-7xl mx-auto px-4 pt-20 sm:pt-12 md:pt-16 pb-8 sm:pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            <div className="inline-block bg-blue-500/10 backdrop-blur-sm border border-blue-200/20 rounded-full px-3 py-1.5 mb-4">
              <span className="text-blue-200 text-xs sm:text-sm font-medium">Gestion Confiable y Segura</span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
              Tu residencia <span className="text-blue-400">sin complicaciones</span>
            </h1>
            
            <p className="text-sm sm:text-base md:text-lg text-gray-200 mb-6 leading-relaxed max-w-2xl">
              Te acompañamos en cada etapa de tu proceso de residencia con total transparencia, asegurándonos de que siempre tengas toda la información clara y actualizada en cada paso.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <Link
                to="pricing"
                smooth={true}
                duration={500}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-all duration-300 text-sm sm:text-base"
              >
                Ver Detalles
                <ArrowRight size={20} className="hidden sm:block" />
              </Link>
              <RouterLink
                to="/login"
                className="bg-white/10 backdrop-blur-sm text-white border border-white/20 px-4 py-2 sm:px-6 sm:py-3 rounded-lg font-medium hover:bg-white/20 transition-all duration-300 text-sm sm:text-base"
              >
                Acceso Clientes
              </RouterLink>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full mx-auto"
          >
            <Swiper
              modules={[Autoplay, Pagination]}
              spaceBetween={20}
              slidesPerView={1}
              autoplay={{
                delay: 3000,
                disableOnInteraction: false,
              }}
              pagination={{
                clickable: true,
                bulletClass: 'swiper-pagination-bullet !bg-white',
                bulletActiveClass: 'swiper-pagination-bullet-active !bg-blue-500',
              }}
              className="w-full h-[420px] sm:h-[480px]"
            >
              {processSteps.map((step, index) => (
                <SwiperSlide key={index}>
                  <HeroSlide {...step} />
                </SwiperSlide>
              ))}
            </Swiper>
          </motion.div>
        </div>

        <motion.div 
          className="absolute bottom-4 left-1/2 transform -translate-x-1/2 hidden sm:block"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 1,
            delay: 1,
            repeat: Infinity,
            repeatType: "reverse",
            repeatDelay: 0.5
          }}
        >
          <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-center justify-center">
            <div className="w-1 h-2 bg-white rounded-full animate-bounce"></div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
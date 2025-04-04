import React, { useState } from 'react';
import { MapPin, Users, Laptop } from 'lucide-react';

const features = [
  {
    icon: MapPin,
    title: "Servicio Nacional",
    description: "Gestionamos trámites en todos los voivodatos de Polonia"
  },
  {
    icon: Users,
    title: "Atención Personalizada",
    description: "Adaptamos nuestro servicio a tu situación específica"
  },
  {
    icon: Laptop,
    title: "100% Online",
    description: "Trámites a distancia con seguimiento en tiempo real"
  }
];

const PolandMap = () => {
  const [selectedRegion, setSelectedRegion] = useState("");

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">
            Representación en Todo el Pais
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-4">
            Te Ayudamos en Cualquier Región
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Servicio 100% online y personalizado para toda Polonia
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-6">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-4 bg-white p-6 rounded-xl shadow-sm border border-gray-100"
                >
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <feature.icon className="text-blue-600 h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-blue-50 p-6 rounded-xl">
              <h3 className="font-semibold text-gray-900 mb-2">
                Cobertura Nacional
              </h3>
              <p className="text-gray-600">
                Gestionamos tu trámite en cualquier región de Polonia de forma remota y personalizada
              </p>
            </div>
          </div>

          <div className="relative">
            <div className="p-4">
              <img 
                src="/img/mapa.webp" 
                alt="Mapa de Polonia" 
                className="w-full h-auto object-cover rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PolandMap;
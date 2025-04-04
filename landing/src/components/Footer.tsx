import React, { useState, useEffect } from 'react';

const Footer = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const legalLinks = [
    { name: 'Política de Privacidad', href: '/privacy-policy' },
    { name: 'RODO', href: '/rodo' },
    { name: 'Manejo de Cookies', href: '/cookies' },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col items-center space-y-8">
          {/* Logo y descripción */}
          <div className="text-center">
            <img 
              src={isScrolled ? "img/logo.png" : "img/logo.png"}
              alt="Legalísimo Logo"
              className="h-6 w-auto mx-auto mb-3"
            />
            <p className="text-gray-400 text-sm max-w-md">
              Tu socio confiable para la legalización de residencia en Polonia. 
              Comprometidos con la excelencia y la transparencia.
            </p>
          </div>

          {/* Enlaces legales */}
          <div className="flex flex-row justify-center gap-6">
            {legalLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-gray-400 hover:text-white text-sm font-medium 
                          transition-colors duration-300 ease-in-out whitespace-nowrap"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Copyright */}
          <div className="text-center text-gray-500 text-sm">
            <p>© {new Date().getFullYear()} Todos los derechos reservados.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
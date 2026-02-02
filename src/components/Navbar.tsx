import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const linkClass = (path: string) => `
    hover:text-brand-primary transition font-body font-bold uppercase tracking-widest text-xs
    ${location.pathname === path 
      ? 'text-brand-primary' 
      : isScrolled ? 'text-brand-dark' : 'text-white drop-shadow-md'}
  `;

  return (
    <>
      <nav className={`fixed w-full z-50 transition-all duration-500 ${
        isScrolled 
        ? 'bg-white/50 backdrop-blur shadow-md py-2' 
        : 'bg-black/50 backdrop-blur-sm py-4'
      }`}>
        <div className="container mx-auto px-8 md:px-16 flex justify-between items-center">
          
          {/* Logo Dinámico: Cambia según el scroll */}
          <Link to="/" className="flex items-center">
            <img 
              src={isScrolled ? "/logo-claro-sin-fondo.png" : "/logo-oscuro-sin-fondo.png"} 
              alt="Bottazzi Inmobiliaria Logo"
              width="180" 
              height="60"
              className="h-12 md:h-16 w-auto object-contain transition-all duration-300"
              loading="lazy"
            />
          </Link>

          {/* Menu Desktop */}
          <div className="hidden md:flex gap-10 items-center">
            <Link to="/" className={linkClass('/')}>Inicio</Link>
            <Link to="/ventas" className={linkClass('/ventas')}>Ventas</Link>
            <Link to="/alquileres" className={linkClass('/alquileres')}>Alquileres</Link>
            <Link to="/contacto" className={linkClass('/contacto')}>Contacto</Link>
          </div>

          <button className={`${isScrolled ? 'text-brand-primary' : 'text-white'} md:hidden`} onClick={() => setIsOpen(true)}>
            <Menu className="w-8 h-8" />
          </button>
        </div>
      </nav>

      {/* Menu Mobile */}
      <div className={`fixed inset-0 bg-brand-dark z-60 transform transition-transform duration-500 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-8 flex justify-between items-center border-b border-white/10">
            <img 
              src="/logo-oscuro-sin-fondo.png" 
              alt="Bottazzi Inmobiliaria Logo" 
              aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
              className="text-white md:hidden p-2 hover:bg-white/10 rounded-lg transition-colors" 
              loading="lazy"
            />
            <button onClick={() => setIsOpen(false)} className="text-white">
                <X className="w-8 h-8" />
            </button>
        </div>
        <div className="p-12 flex flex-col gap-8 text-center">
            <Link to="/" onClick={() => setIsOpen(false)} className="text-3xl font-display text-white">Inicio</Link>
            <Link to="/ventas" onClick={() => setIsOpen(false)} className="text-3xl font-display text-white">Ventas</Link>
            <Link to="/alquileres" onClick={() => setIsOpen(false)} className="text-3xl font-display text-white">Alquileres</Link>
            <Link to="/contacto" onClick={() => setIsOpen(false)} className="text-3xl font-display text-white">Contacto</Link>
        </div>
      </div>
    </>
  );
};
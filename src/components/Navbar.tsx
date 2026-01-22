import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Home } from 'lucide-react';

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  useEffect(() => setIsOpen(false), [location]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const linkClass = (path: string) => `
    hover:text-orange-500 transition font-medium uppercase tracking-wide text-sm
    ${location.pathname === path ? 'text-orange-500' : isScrolled ? 'text-gray-600' : 'text-white'}
  `;

  const mobileLinkClass = "text-2xl font-light text-gray-800 hover:text-orange-600 transition block py-2 border-b border-gray-100";

  return (
    <>
      <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md py-3' : 'bg-black/20 backdrop-blur-sm py-5'}`}>
        <div className="container mx-auto px-6 flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 text-2xl font-bold tracking-tighter">
            <div className="bg-orange-600 p-2 rounded-lg shadow-lg">
              <Home className="w-5 h-5 text-white" />
            </div>
            <span className={isScrolled ? 'text-gray-800' : 'text-white'}>Inmobiliaria</span>
          </Link>

          {/* Menu Desktop */}
          <div className="hidden md:flex gap-8 items-center">
            <Link to="/" className={linkClass('/')}>Inicio</Link>
            <Link to="/ventas" className={linkClass('/ventas')}>Ventas</Link>
            <Link to="/alquileres" className={linkClass('/alquileres')}>Alquileres</Link>
            <Link to="/contacto" className={linkClass('/contacto')}>Contacto</Link>
          </div>

          {/* Botón Mobile */}
          <button className="md:hidden text-orange-600" onClick={() => setIsOpen(true)}>
            <Menu className="w-8 h-8" />
          </button>
        </div>
      </nav>

      {/* Menu Mobile Full Screen */}
      <div className={`fixed inset-0 bg-white z-60 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-6 flex justify-between items-center border-b">
            <span className="text-xl font-bold text-gray-800">MENÚ</span>
            <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-red-500">
                <X className="w-8 h-8" />
            </button>
        </div>
        <div className="p-8 flex flex-col gap-4 text-center mt-10">
            <Link to="/" className={mobileLinkClass}>INICIO</Link>
            <Link to="/ventas" className={mobileLinkClass}>VENTAS</Link>
            <Link to="/alquileres" className={mobileLinkClass}>ALQUILERES</Link>
            <Link to="/contacto" className={mobileLinkClass}>CONTACTO</Link>
        </div>
      </div>
    </>
  );
};
import { Instagram, Facebook, Phone, Mail, MapPin } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-gray-100 pt-16 pb-8 text-gray-600 text-center">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        
        {/* Columna Contacto */}
        <div className="flex flex-col items-center">
          <h3 className="text-orange-700 font-bold mb-4 uppercase tracking-wider">Contacto</h3>
          <div className="flex flex-col gap-3 text-sm items-center">
            <p className="flex items-center gap-2"><MapPin className="w-4 h-4" /> 25 de Mayo, Paraná</p>
            <p className="flex items-center gap-2 mt-2"><Phone className="w-4 h-4" /> (343) 123-4567</p>
            <p className="flex items-center gap-2"><Phone className="w-4 h-4" /> (343) 123-456</p>
            <p className="flex items-center gap-2 mt-2"><Mail className="w-4 h-4" /> contacto@inmobiliaria.com</p>
          </div>
        </div>

        {/* Columna Servicios */}
        <div className="flex flex-col items-center">
          <h3 className="text-orange-700 font-bold mb-4 uppercase tracking-wider">Servicios</h3>
          <ul className="flex flex-col gap-2 text-sm">
            <li><a href="#" className="hover:text-orange-700 underline decoration-gray-300">Ventas</a></li>
            <li><a href="#" className="hover:text-orange-700 underline decoration-gray-300">Alquileres</a></li>
          </ul>
        </div>

        {/* Columna Links y Redes */}
        <div className="flex flex-col items-center">
          <h3 className="text-orange-700 font-bold mb-4 uppercase tracking-wider">Links</h3>
          <ul className="flex flex-col gap-2 text-sm mb-6">
            <li><a href="#" className="hover:text-orange-700 underline decoration-gray-300">Inicio</a></li>
            <li><a href="#" className="hover:text-orange-700 underline decoration-gray-300">Contacto</a></li>
          </ul>
          
          <div className="flex gap-4 justify-center">
            <div className="bg-gray-300 p-2 rounded-full hover:bg-orange-700 hover:text-white transition cursor-pointer">
                <Instagram className="w-5 h-5" />
            </div>
            <div className="bg-gray-300 p-2 rounded-full hover:bg-orange-700 hover:text-white transition cursor-pointer">
                <Facebook className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-300 pt-8 text-center text-sm text-gray-500">
        Copyright © 2026. All Rights Reserved. Brian Battauz
      </div>
    </footer>
  );
};
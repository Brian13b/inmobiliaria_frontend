import { Instagram, Facebook, Phone, Mail, MapPin } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-brand-primary pt-20 pb-10 text-brand-light font-body">
      <div className="container mx-auto px-8 md:px-16 grid grid-cols-1 md:grid-cols-3 gap-16 mb-16">
        <div className="flex flex-col items-center md:items-start">
          <h3 className="font-display text-2xl mb-6 text-white border-b border-brand-light/20 pb-2 w-full text-center md:text-left">Contacto</h3>
          <div className="flex flex-col gap-4 text-[14px] items-center md:items-start opacity-90 tracking-widest">
            <p className="gap-3">
              En <strong>Inmobiliaria Bottazzi</strong> nos especializamos en propiedades de Paraná y alrededores. Venta, alquiler y administración de propiedades con atención personalizada y conocimiento profundo del mercado local.
            </p>
            <p className="flex items-center gap-3"><MapPin className="w-4 h-4 text-brand-light" /> Av. Churruarín 77, Paraná, Entre Ríos</p>
            <p className="flex items-center gap-3"><Phone className="w-4 h-4 text-brand-light" /> +54 9 343 416-0058</p>
            <p className="flex items-center gap-3"><Mail className="w-4 h-4 text-brand-light" /> bottazzinegociosinmobiliarios@gmail.com</p>
          </div>
        </div>

        <div className="flex flex-col items-center">
          <h3 className="font-display text-2xl mb-6 text-white border-b border-brand-light/20 pb-2 w-full text-center">Navegación</h3>
          <ul className="flex flex-col gap-3 text-sm font-bold tracking-widest uppercase items-center">
            <li><a href="/" className="hover:text-white transition">Inicio</a></li>
            <li><a href="/ventas" className="hover:text-white transition">Ventas</a></li>
            <li><a href="/alquileres" className="hover:text-white transition">Alquileres</a></li>
            <li><a href="/tasaciones" className="hover:text-white transition">Tasaciones</a></li>
          </ul>
        </div>

        <div className="flex flex-col items-center md:items-end">
          <h3 className="font-display text-2xl mb-6 text-white border-b border-brand-light/20 pb-2 w-full text-center md:text-right">Redes</h3>
          <div className="flex gap-4 mb-6">
            <a href="https://www.instagram.com/bottazzi.inmobiliaria/?hl=es" target="_blank" className="bg-white/10 p-3 rounded-full hover:bg-brand-light hover:text-brand-primary transition shadow-xl">
                <Instagram className="w-5 h-5" />
            </a>
            <a href="https://www.facebook.com/profile.php?id=61574780821258" target="_blank" className="bg-white/10 p-3 rounded-full hover:bg-brand-light hover:text-brand-primary transition shadow-xl">
                <Facebook className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-brand-light/10 pt-8 text-center text-sm tracking-[0.2em] uppercase font-bold text-brand-light/50">
        © 2026 Bottazzi Inmobiliaria - Paraná, Entre Ríos. Todos los derechos reservados. | Realizado por 
        <a href="https://wa.me/5493434676232" target="_blank" className="ml-1 text-brand-light hover:text-white underline underline-offset-4">Brian Battauz</a>
      </div>
    </footer>
  );
};
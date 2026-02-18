import React, { useState } from 'react';
import { enviarMensaje } from '../services/api';
import { Calculator, MapPin, Phone, User, Building, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import { SEO } from '../components/SEO';

export const Tasacion = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    direccion: '',
    tipoInmueble: 'Casa'
  });

  const [enviando, setEnviando] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);

    const mensajeTexto = `SOLICITUD DE TASACIÓN\n\nPropiedad: ${formData.tipoInmueble}\nDirección: ${formData.direccion}\nContacto: ${formData.nombre}\nTel: ${formData.telefono}`;
    
    try {
      await enviarMensaje({
          nombre: formData.nombre,
          telefono: formData.telefono,
          email: "solicitud@tasacion.com",
          contenido: mensajeTexto
      });

      const numWsp = "5493434160058"; 
      const urlWsp = `https://wa.me/${numWsp}?text=${encodeURIComponent(mensajeTexto)}`;
      
      toast.success("¡Solicitud enviada con éxito!");
      window.open(urlWsp, '_blank');
      
      setFormData({ nombre: '', telefono: '', direccion: '', tipoInmueble: 'Casa' });
    } catch (error) {
        toast.error("Error al procesar la solicitud.");
    } finally {
        setEnviando(false);
    }
  };

  const inputClass = "w-full bg-gray-50 border border-brand-light/60 rounded-lg p-3 pl-10 outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/20 transition text-brand-dark placeholder:text-gray-400";

  return (
    <div className="min-h-screen bg-white pt-10 pb-20">
      <SEO 
        title="Tasación Profesional" 
        description="¿Querés vender o alquilar tu propiedad? Solicitá una tasación profesional con Inmobiliaria Bottazzi."
      />
      
      <section className="py-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-brand-light/10 -skew-x-12 translate-x-1/2 hidden lg:block" />
        
        <div className="container mx-auto px-8 md:px-16 lg:px-32 relative z-10">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
              
            <div className="lg:w-1/2 text-brand-dark space-y-8">
                <span className="text-brand-primary font-bold tracking-[0.3em] uppercase text-sm">Valuaciones Reales</span>
                <h2 className="font-display text-4xl md:text-5xl lg:text-7xl mt-4 mb-6 leading-tight">
                    Tu propiedad tiene una historia y un valor, <br /> 
                    <span className="italic text-brand-primary/80">nosotros te ayudamos a conocerlo.</span>
                </h2>
                <p className="text-brand-muted text-xl mb-8 leading-relaxed font-body max-w-md">
                    Completá tus datos y nos pondremos en contacto para asesorarte de manera personalizada.
                </p>
                <div className="flex items-center gap-4 text-brand-primary border-l-2 border-brand-light pl-6">
                   <Calculator className="w-8 h-8 text-brand-primary" />
                   <span className="font-display text-lg uppercase tracking-widest">Atención en 48hs.</span>
                </div>
            </div>

            <div className="lg:w-1/2 w-full">
              <form onSubmit={handleSubmit} className="bg-white p-8 md:p-10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-gray-100 space-y-5">
                <div className="relative">
                  <User className="absolute left-3 top-3.5 text-brand-primary w-5 h-5" />
                  <input required type="text" placeholder="Tu nombre" className={inputClass}
                      value={formData.nombre} onChange={e => setFormData({...formData, nombre: e.target.value})} />
                </div>

                <div className="relative">
                  <Phone className="absolute left-3 top-3.5 text-brand-primary w-5 h-5" />
                  <input required type="tel" placeholder="Tu teléfono" className={inputClass}
                      value={formData.telefono} onChange={e => setFormData({...formData, telefono: e.target.value})} />
                </div>

                <div className="relative">
                  <MapPin className="absolute left-3 top-3.5 text-brand-primary w-5 h-5" />
                  <input required type="text" placeholder="Dirección de la propiedad" className={inputClass}
                      value={formData.direccion} onChange={e => setFormData({...formData, direccion: e.target.value})} />
                </div>

                <div className="relative">
                  <Building className="absolute left-3 top-3.5 text-brand-primary w-5 h-5" />
                  <select className={inputClass} value={formData.tipoInmueble}
                      onChange={e => setFormData({...formData, tipoInmueble: e.target.value})}>
                      <option>Casa</option>
                      <option>Departamento</option>
                      <option>Terreno</option>
                      <option>Local</option>
                      <option>Oficina</option>
                  </select>
                </div>

                <button disabled={enviando} className="w-full bg-brand-dark text-white font-bold py-4 rounded-lg hover:bg-brand-primary transition-all duration-300 shadow-lg flex items-center justify-center gap-2 uppercase tracking-widest text-sm">
                    {enviando ? "ENVIANDO..." : <><Send className="w-4 h-4" /> ENVIAR SOLICITUD</>}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
import { useState } from 'react';
import { MapPin, Phone, Mail, Send, Loader2, User } from 'lucide-react';
import { enviarMensaje } from '../services/api';
import { SEO } from '../components/SEO';
import toast from 'react-hot-toast';

export const ContactoPage = () => {
  const [form, setForm] = useState({ nombre: "", apellido: "", email: "", telefono: "", mensaje: "" });
  const [enviando, setEnviando] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);
    const mensajeCompleto = `CONSULTA WEB\nNombre: ${form.nombre} ${form.apellido}\nEmail: ${form.email}\nTel: ${form.telefono}\nMensaje: ${form.mensaje}`;
    
    try {
        // 1. Guardar en Admin
        await enviarMensaje({
            nombre: `${form.nombre} ${form.apellido}`,
            email: form.email,
            telefono: form.telefono,
            contenido: form.mensaje
        });
        // 2. Enviar a WhatsApp
        const numWsp = "5493434676232"; 
        window.open(`https://wa.me/${numWsp}?text=${encodeURIComponent(mensajeCompleto)}`, '_blank');
        
        toast.success("¡Mensaje enviado!");
        setForm({ nombre: "", apellido: "", email: "", telefono: "", mensaje: "" }); 
    } catch (error) {
        toast.error("Error al enviar.");
    } finally { setEnviando(false); }
  };

  const inputClass = "w-full bg-gray-50 border border-brand-light/40 rounded-lg p-3 pl-10 outline-none focus:border-brand-primary transition text-brand-dark";

  return (
    <div className="min-h-screen bg-white pt-32 pb-20 font-body">
      <SEO title="Contacto" description="Ponete en contacto con Inmobiliaria Bottazzi." />
      
      <div className="container mx-auto px-8 md:px-16 lg:px-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          
          {/* Info de Contacto */}
          <div className="space-y-8">
            <div>
              <span className="text-brand-primary font-bold tracking-[0.3em] uppercase text-[10px]">Atención Personalizada</span>
              <h1 className="font-display text-5xl md:text-7xl text-brand-dark mt-4 mb-6">Estamos para <span className="italic text-brand-primary/80">ayudarte.</span></h1>
            </div>
            
            <div className="space-y-6">
              {[
                { icon: MapPin, title: "Oficina", text: "Av. Churruarín 77, Paraná" },
                { icon: Phone, title: "WhatsApp", text: "+54 9 343 416-0058" },
                { icon: Mail, title: "Email", text: "bottazzinegociosinmobiliarios@gmail.com" }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-5 p-4 rounded-2xl border border-gray-100 hover:border-brand-light transition-colors">
                  <div className="bg-brand-light/20 p-3 rounded-xl"><item.icon className="w-6 h-6 text-brand-primary" /></div>
                  <div>
                    <p className="text-[10px] font-bold text-brand-muted uppercase tracking-widest">{item.title}</p>
                    <p className="text-brand-dark font-medium">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Formulario Estilo Tasación */}
          <form onSubmit={handleSubmit} className="bg-white p-8 md:p-10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-gray-100 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="relative"><User className="absolute left-3 top-3.5 text-brand-primary w-5 h-5" /><input required name="nombre" placeholder="Nombre" className={inputClass} value={form.nombre} onChange={handleChange} /></div>
              <div className="relative"><User className="absolute left-3 top-3.5 text-brand-primary w-5 h-5" /><input required name="apellido" placeholder="Apellido" className={inputClass} value={form.apellido} onChange={handleChange} /></div>
            </div>
            <div className="relative"><Mail className="absolute left-3 top-3.5 text-brand-primary w-5 h-5" /><input required name="email" type="email" placeholder="Email" className={inputClass} value={form.email} onChange={handleChange} /></div>
            <div className="relative"><Phone className="absolute left-3 top-3.5 text-brand-primary w-5 h-5" /><input required name="telefono" type="tel" placeholder="Teléfono" className={inputClass} value={form.telefono} onChange={handleChange} /></div>
            <textarea required name="mensaje" rows={4} placeholder="¿En qué podemos ayudarte?" className="w-full bg-gray-50 border border-brand-light/40 rounded-lg p-4 outline-none focus:border-brand-primary transition text-brand-dark resize-none" value={form.mensaje} onChange={handleChange}></textarea>
            
            <button disabled={enviando} className="w-full bg-brand-dark text-white font-bold py-4 rounded-lg hover:bg-brand-primary transition flex items-center justify-center gap-3 tracking-widest text-[10px]">
              {enviando ? <Loader2 className="animate-spin" /> : <Send className="w-4 h-4" />}
              {enviando ? "ENVIANDO..." : "ENVIAR CONSULTA"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
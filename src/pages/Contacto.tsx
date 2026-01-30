import { useState } from 'react';
import { MapPin, Phone, Mail, Send, Loader2 } from 'lucide-react';
import { enviarMensaje } from '../services/api';
import { SEO } from '../components/SEO';
import toast from 'react-hot-toast';

export const ContactoPage = () => {
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    mensaje: ""
  });
  const [enviando, setEnviando] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);
    try {
        await enviarMensaje({
            nombre: `${form.nombre} ${form.apellido}`,
            email: form.email,
            telefono: form.telefono,
            contenido: form.mensaje
        });
        toast.success("¡Mensaje enviado con éxito! Te contactaremos a la brevedad.");
        setForm({ nombre: "", apellido: "", email: "", telefono: "", mensaje: "" }); 
    } catch (error) {
        toast.error("Ocurrió un error al enviar el mensaje. Por favor intenta nuevamente.");
        console.error(error);
    } finally {
        setEnviando(false);
    }
  };

  return (
    <div className="min-h-screen bg-white pt-32 pb-20">
        <SEO 
            title="Contacto" 
            description="¿Querés vender o alquilar tu propiedad? Contactanos hoy para una tasación profesional o visitanos en nuestras oficinas."
            keywords="contacto inmobiliaria, tasaciones paraná, teléfono inmobiliaria battauz, asesoramiento inmobiliario"
        />
        <div className="container mx-auto px-8 md:px-16 lg:px-32 text-center mb-16">
            <span className="text-brand-secondary font-bold tracking-widest uppercase text-xs">Atención Personalizada</span>
            <h1 className="font-display text-4xl md:text-5xl text-brand-dark mt-2">Ponete en Contacto</h1>
        </div>

        <div className="container mx-auto px-8 md:px-16 lg:px-32">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                <div className="space-y-8">
                    <div className="bg-gray-50 p-10 rounded-3xl border border-brand-light/30">
                        <h3 className="font-display text-2xl text-brand-dark mb-8">Información</h3>
                        <div className="space-y-8">
                            {[
                                { icon: MapPin, title: "Oficina", text: "25 de Mayo, Paraná, Entre Ríos" },
                                { icon: Phone, title: "Teléfonos", text: "(343) 123-4567 / 123-654" },
                                { icon: Mail, title: "Email", text: "contacto@inmobiliariabattauz.com" }
                            ].map((item, i) => (
                                <div key={i} className="flex items-start gap-5">
                                    <div className="bg-brand-light/20 p-4 rounded-2xl"><item.icon className="w-6 h-6 text-brand-primary" /></div>
                                    <div className="text-left">
                                        <p className="font-display text-lg text-brand-dark">{item.title}</p>
                                        <p className="text-brand-muted font-body">{item.text}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    {/* Mapa */}
                    <div className="h-72 bg-gray-200 rounded-3xl overflow-hidden border border-brand-light/30 shadow-inner">
                        <iframe 
                            width="100%" 
                            height="100%" 
                            frameBorder="0" 
                            title="Mapa Ubicación"
                            src="https://www.openstreetmap.org/export/embed.html?bbox=-60.55,-31.75,-60.45,-31.70&layer=mapnik&marker=-31.733,-60.529"
                        ></iframe>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 bg-white p-2 rounded-xl">
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-bold text-brand-muted uppercase mb-2 ml-1">Nombre</label>
                            <input required name="nombre" value={form.nombre} onChange={handleChange} type="text" className="w-full border border-brand-light rounded-xl p-4 outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 transition" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-brand-muted uppercase mb-2 ml-1">Apellido</label>
                            <input required name="apellido" value={form.apellido} onChange={handleChange} type="text" className="w-full border border-brand-light rounded-xl p-4 outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 transition" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-brand-muted uppercase mb-2 ml-1">Email Corporativo</label>
                        <input required name="email" value={form.email} onChange={handleChange} type="email" className="w-full border border-brand-light rounded-xl p-4 outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 transition" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-brand-muted uppercase mb-2 ml-1">Teléfono</label>
                        <input required name="telefono" value={form.telefono} onChange={handleChange} type="tel" className="w-full border border-brand-light rounded-xl p-4 outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 transition" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-brand-muted uppercase mb-2 ml-1">Mensaje o Consulta</label>
                        <textarea required name="mensaje" value={form.mensaje} onChange={handleChange} rows={6} className="w-full border border-brand-light rounded-xl p-4 outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 transition resize-none"></textarea>
                    </div>
                    
                    <button disabled={enviando} className="w-full bg-brand-dark text-white font-bold py-5 rounded-xl hover:bg-brand-primary transition shadow-2xl flex items-center justify-center gap-3 disabled:opacity-50 tracking-widest text-sm">
                        {enviando ? <Loader2 className="animate-spin" /> : <Send className="w-5 h-5" />}
                        {enviando ? "ENVIANDO..." : "ENVIAR MENSAJE"}
                    </button>
                </form>
            </div>
        </div>
    </div>
  );
};
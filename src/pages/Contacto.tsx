import { useState } from 'react';
import { MapPin, Phone, Mail, Send, Loader2 } from 'lucide-react';
import { enviarMensaje } from '../services/api';

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
        alert("¡Mensaje enviado con éxito! Te contactaremos a la brevedad.");
        setForm({ nombre: "", apellido: "", email: "", telefono: "", mensaje: "" }); 
    } catch (error) {
        alert("Ocurrió un error al enviar el mensaje. Por favor intenta nuevamente.");
        console.error(error);
    } finally {
        setEnviando(false);
    }
  };

  return (
    <div className="min-h-screen bg-white pt-32 pb-20">
      <div className="container mx-auto px-8 md:px-16 lg:px-32">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-12">Contacto</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Info y Mapa */}
            <div>
                <div className="bg-gray-50 p-8 rounded-2xl mb-8 border border-gray-100">
                    <h3 className="text-xl font-bold text-gray-800 mb-6">Información de Contacto</h3>
                    <div className="space-y-6">
                        <div className="flex items-start gap-4">
                            <div className="bg-orange-100 p-3 rounded-full"><MapPin className="w-5 h-5 text-orange-700" /></div>
                            <div>
                                <p className="font-bold text-gray-800">Oficina Central</p>
                                <p className="text-gray-600">25 de Mayo, Paraná, Entre Ríos</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="bg-orange-100 p-3 rounded-full"><Phone className="w-5 h-5 text-orange-700" /></div>
                            <div>
                                <p className="font-bold text-gray-800">Teléfonos</p>
                                <p className="text-gray-600">(343) 123-4567 / (343) 123-654</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="bg-orange-100 p-3 rounded-full"><Mail className="w-5 h-5 text-orange-700" /></div>
                            <div>
                                <p className="font-bold text-gray-800">Email</p>
                                <p className="text-gray-600">contacto@inmobiliaria.com</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Mapa */}
                <div className="h-64 bg-gray-200 rounded-2xl overflow-hidden shadow-inner border border-gray-200">
                    <iframe 
                        width="100%" 
                        height="100%" 
                        frameBorder="0" 
                        title="Mapa Ubicación"
                        src="https://www.openstreetmap.org/export/embed.html?bbox=-60.55,-31.75,-60.45,-31.70&layer=mapnik&marker=-31.733,-60.529"
                    ></iframe>
                </div>
            </div>

            {/* Formulario */}
            <form onSubmit={handleSubmit} className="space-y-6 bg-white p-2 rounded-xl">
                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Nombre</label>
                        <input required name="nombre" value={form.nombre} onChange={handleChange} type="text" className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Apellido</label>
                        <input required name="apellido" value={form.apellido} onChange={handleChange} type="text" className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition" />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
                    <input required name="email" value={form.email} onChange={handleChange} type="email" className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition" />
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Teléfono</label>
                    <input required name="telefono" value={form.telefono} onChange={handleChange} type="tel" className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition" />
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Mensaje</label>
                    <textarea required name="mensaje" value={form.mensaje} onChange={handleChange} rows={5} className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition"></textarea>
                </div>
                
                <button 
                    disabled={enviando}
                    className="w-full bg-gray-900 text-white font-bold py-4 rounded-lg hover:bg-orange-700 transition shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {enviando ? <Loader2 className="animate-spin" /> : <Send className="w-5 h-5" />}
                    {enviando ? "ENVIANDO..." : "ENVIAR MENSAJE"}
                </button>
            </form>
        </div>
      </div>
    </div>
  );
};
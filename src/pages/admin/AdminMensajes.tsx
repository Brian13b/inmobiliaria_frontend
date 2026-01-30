import { useEffect, useState } from 'react';
import { getMensajes, deleteMensaje } from '../../services/api';
import { Trash2, ArrowLeft, Mail, Phone, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SEO } from '../../components/SEO';

export const AdminMensajes = () => {
    const [mensajes, setMensajes] = useState<any[]>([]);

    useEffect(() => { cargar(); }, []);

    const cargar = () => getMensajes().then(setMensajes);

    const borrar = async (id: number) => {
        if(window.confirm("¿Estás seguro de que deseas eliminar este mensaje?")) {
            await deleteMensaje(id);
            cargar();
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8 font-body">
            <SEO title="Bandeja de Entrada" description="Gestión de mensajes recibidos" />

            <div className="max-w-5xl mx-auto">
                <Link to="/admin/dashboard" className="flex items-center gap-2 text-brand-muted hover:text-brand-primary mb-8 w-fit transition-colors font-bold text-sm uppercase tracking-widest">
                    <ArrowLeft className="w-4 h-4" /> Volver al Panel
                </Link>
                
                <h1 className="text-4xl font-display text-brand-dark mb-10 flex items-center gap-4">
                    <div className="bg-brand-light/20 p-3 rounded-xl">
                        <Mail className="w-8 h-8 text-brand-primary" />
                    </div>
                    Bandeja de Entrada
                </h1>

                <div className="grid gap-6">
                    {mensajes.map(msg => (
                        <div key={msg.id} className="bg-white p-8 rounded-2xl shadow-sm border border-brand-light/20 relative group hover:shadow-md transition-all">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="font-display text-2xl text-brand-dark">{msg.nombre}</h3>
                                    <div className="flex flex-wrap gap-4 mt-2 text-sm">
                                        <span className="flex items-center gap-1.5 text-brand-muted font-medium">
                                            <Mail className="w-4 h-4 text-brand-primary" /> {msg.email}
                                        </span>
                                        {msg.telefono && (
                                            <span className="flex items-center gap-1.5 text-brand-muted font-medium">
                                                <Phone className="w-4 h-4 text-brand-primary" /> {msg.telefono}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <span className="text-[10px] font-bold text-brand-secondary bg-brand-light/20 px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
                                    <Calendar className="w-3 h-3" /> {new Date(msg.fechaEnvio).toLocaleDateString()}
                                </span>
                            </div>
                            
                            <div className="relative">
                                <p className="text-brand-dark bg-gray-50 p-6 rounded-xl border-l-4 border-brand-primary leading-relaxed italic font-body">
                                    "{msg.contenido}"
                                </p>
                            </div>

                            <button 
                                onClick={() => borrar(msg.id)} 
                                className="absolute top-8 right-8 text-brand-light hover:text-red-600 transition-colors p-2 hover:bg-red-50 rounded-lg"
                                title="Eliminar mensaje"
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </div>
                    ))}

                    {mensajes.length === 0 && (
                        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-brand-light">
                            <Mail className="w-12 h-12 text-brand-light mx-auto mb-4" />
                            <p className="font-display text-xl text-brand-muted">No hay mensajes nuevos por el momento.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
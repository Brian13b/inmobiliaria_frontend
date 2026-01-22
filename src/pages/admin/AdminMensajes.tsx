import { useEffect, useState } from 'react';
import { getMensajes, deleteMensaje } from '../../services/api';
import { Trash2, ArrowLeft, Mail, Phone, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AdminMensajes = () => {
    const [mensajes, setMensajes] = useState<any[]>([]);

    useEffect(() => { cargar(); }, []);

    const cargar = () => getMensajes().then(setMensajes);

    const borrar = async (id: number) => {
        if(confirm("¿Borrar mensaje?")) {
            await deleteMensaje(id);
            cargar();
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-5xl mx-auto">
                <Link to="/admin/dashboard" className="flex items-center gap-2 text-gray-500 hover:text-orange-600 mb-6 w-fit">
                    <ArrowLeft className="w-4 h-4" /> Volver al Panel
                </Link>
                
                <h1 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-3">
                    <Mail className="w-8 h-8 text-orange-600" /> Bandeja de Entrada
                </h1>

                <div className="grid gap-4">
                    {mensajes.map(msg => (
                        <div key={msg.id} className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-orange-500 relative group">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-bold text-lg text-gray-800">{msg.nombre}</h3>
                                <span className="text-xs text-gray-400 flex items-center gap-1">
                                    <Calendar className="w-3 h-3" /> {new Date(msg.fechaEnvio).toLocaleDateString()}
                                </span>
                            </div>
                            
                            <div className="text-sm text-gray-500 mb-4 flex gap-4">
                                <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {msg.email}</span>
                                {msg.telefono && <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {msg.telefono}</span>}
                            </div>

                            <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{msg.contenido}</p>

                            <button onClick={() => borrar(msg.id)} className="absolute top-6 right-6 text-gray-300 hover:text-red-500 transition">
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </div>
                    ))}
                    {mensajes.length === 0 && <p className="text-center text-gray-500 py-10">No hay mensajes nuevos.</p>}
                </div>
            </div>
        </div>
    );
};
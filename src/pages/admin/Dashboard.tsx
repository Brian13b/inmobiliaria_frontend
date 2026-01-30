import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { logout } from '../../services/auth';
import { getMensajes } from '../../services/api';
import { LayoutDashboard, PlusCircle, Image, LogOut, Home, Mail } from 'lucide-react';
import { SEO } from '../../components/SEO';

export const DashboardPage = () => {
    const [nuevosMensajes, setNuevosMensajes] = useState(0);

    useEffect(() => {
        getMensajes().then(msgs => setNuevosMensajes(msgs.length));
    }, []);

    const cardClass = "bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all group border border-brand-light/20 flex flex-col items-center text-center";
    const iconContainer = "w-16 h-16 bg-brand-light/20 rounded-full flex items-center justify-center mb-6 group-hover:bg-brand-primary transition-colors duration-300";
    const iconClass = "w-8 h-8 text-brand-primary group-hover:text-white transition-colors duration-300";

    return (
        <div className="min-h-screen bg-gray-100 p-8 font-body text-brand-dark">
            <SEO title="Panel de Control" description="Administración" />

            <div className="max-w-5xl mx-auto">
                {/* Encabezado */}
                <div className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="font-display text-4xl text-brand-dark">Panel de Control</h1>
                        <p className="text-brand-muted">Bienvenido, Administrador.</p>
                    </div>
                    <button onClick={logout} className="flex items-center gap-2 text-red-600 font-bold hover:bg-red-50 px-6 py-3 rounded-xl transition border border-transparent hover:border-red-100">
                        <LogOut className="w-5 h-5" /> Cerrar Sesión
                    </button>
                </div>

                {/* Grilla */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    
                    <Link to="/admin/propiedades" className={cardClass}>
                        <div className={iconContainer}><LayoutDashboard className={iconClass} /></div>
                        <h3 className="font-display text-2xl mb-2">Mis Propiedades</h3>
                        <p className="text-brand-muted text-sm leading-relaxed">Gestionar, editar o eliminar inmuebles del catálogo.</p>
                    </Link>

                    <Link to="/admin/propiedades/nueva" className={cardClass}>
                        <div className={iconContainer}><PlusCircle className={iconClass} /></div>
                        <h3 className="font-display text-2xl mb-2">Nueva Propiedad</h3>
                        <p className="text-brand-muted text-sm leading-relaxed">Cargar un nuevo inmueble al sistema.</p>
                    </Link>

                    <Link to="/admin/mensajes" className={`${cardClass} relative`}>
                        {nuevosMensajes > 0 && (
                            <span className="absolute top-6 right-6 bg-red-600 text-white text-xs font-bold h-6 w-6 flex items-center justify-center rounded-full animate-pulse shadow-lg">
                                {nuevosMensajes}
                            </span>
                        )}
                        <div className={iconContainer}><Mail className={iconClass} /></div>
                        <h3 className="font-display text-2xl mb-2">Mensajes</h3>
                        <p className="text-brand-muted text-sm leading-relaxed">Consultas recibidas desde la web.</p>
                    </Link>

                    <Link to="/admin/config" className={cardClass}>
                        <div className={iconContainer}><Image className={iconClass} /></div>
                        <h3 className="font-display text-2xl mb-2">Diseño Web</h3>
                        <p className="text-brand-muted text-sm leading-relaxed">Configurar imágenes del inicio y textos principales.</p>
                    </Link>

                    <Link to="/" target="_blank" className="bg-brand-primary p-8 rounded-2xl shadow-lg hover:bg-brand-dark transition-all flex flex-col items-center text-center text-white">
                        <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-6"><Home className="w-8 h-8" /></div>
                        <h3 className="font-display text-2xl mb-2">Ver Sitio Web</h3>
                        <p className="text-brand-light/80 text-sm leading-relaxed">Abrir la página principal para clientes.</p>
                    </Link>
                </div>
            </div>
        </div>
    );
};
import { Link } from 'react-router-dom';
import { logout } from '../../services/auth';
import { LayoutDashboard, PlusCircle, Image, LogOut, Home, Mail } from 'lucide-react';
import { SEO } from '../../components/SEO';

export const DashboardPage = () => {
    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <SEO title="Panel de Control" description="Administración" />
            <div className="max-w-5xl mx-auto">
                {/* Encabezado */}
                <div className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Panel de Control</h1>
                        <p className="text-gray-500">Bienvenido, Administrador.</p>
                    </div>
                    <button onClick={logout} className="flex items-center gap-2 text-red-600 font-bold hover:bg-red-50 px-4 py-2 rounded-lg transition">
                        <LogOut className="w-5 h-5" /> Cerrar Sesión
                    </button>
                </div>

                {/* Grilla */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    
                    <Link to="/admin/propiedades" className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all group border border-gray-100">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-600 transition-colors">
                            <LayoutDashboard className="w-6 h-6 text-blue-600 group-hover:text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800">Mis Propiedades</h3>
                        <p className="text-gray-500 text-sm mt-2">Ver lista completa, editar y borrar inmuebles.</p>
                    </Link>

                    <Link to="/admin/propiedades/nueva" className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all group border border-gray-100">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-green-600 transition-colors">
                            <PlusCircle className="w-6 h-6 text-green-600 group-hover:text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800">Nueva Propiedad</h3>
                        <p className="text-gray-500 text-sm mt-2">Cargar un nuevo inmueble al sistema.</p>
                    </Link>

                    <Link to="/admin/configuracion" className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all group border border-gray-100">
                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-purple-600 transition-colors">
                            <Image className="w-6 h-6 text-purple-600 group-hover:text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800">Portada & Hero</h3>
                        <p className="text-gray-500 text-sm mt-2">Cambiar imagen de fondo y textos del inicio.</p>
                    </Link>

                    <Link to="/" target="_blank" className="bg-gray-800 p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all group border border-gray-700">
                        <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center mb-4">
                            <Home className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-white">Ver Sitio Web</h3>
                        <p className="text-gray-400 text-sm mt-2">Ir a la página principal como un cliente.</p>
                    </Link>

                    <Link to="/admin/mensajes" className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all group border border-gray-100">
                        <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-orange-700 transition-colors">
                            <Mail className="w-6 h-6 text-orange-700 group-hover:text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800">Bandeja de Entrada</h3>
                        <p className="text-gray-500 text-sm mt-2">Leer consultas de contacto recibidas.</p>
                    </Link>
                </div>
            </div>
        </div>
    );
};
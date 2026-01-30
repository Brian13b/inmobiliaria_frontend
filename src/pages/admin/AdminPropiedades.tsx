import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getPropiedades, deletePropiedad } from '../../services/api';
import { type Propiedad, getTipoLabel } from '../../types/propiedad';
import { ArrowLeft, Plus, Pencil, Trash2, Eye, Search } from 'lucide-react';
import { SEO } from '../../components/SEO';

export const AdminPropiedades = () => {
    const [propiedades, setPropiedades] = useState<Propiedad[]>([]);
    const [filtro, setFiltro] = useState("");

    const cargarDatos = () => {
        getPropiedades().then(setPropiedades);
    };

    useEffect(() => {
        cargarDatos();
    }, []);

    const handleDelete = async (id: number) => {
        if (confirm("¿Estás seguro de borrar esta propiedad? No se puede deshacer.")) {
            try {
                await deletePropiedad(id);
                cargarDatos(); 
            } catch (error) {
                ("Error al borrar");
            }
        }
    };

    const filtradas = propiedades.filter(p => 
        p.titulo.toLowerCase().includes(filtro.toLowerCase()) ||
        p.direccion.toLowerCase().includes(filtro.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50 p-8 font-body">
            <SEO title="Gestión de Propiedades" description="Administración de catálogo" />

            <div className="max-w-7xl mx-auto">

                <Link to="/admin/dashboard" className="inline-flex items-center gap-2 text-gray-500 hover:text-brand-primary mb-6 font-medium transition">
                    <ArrowLeft className="w-5 h-5" /> Volver al Panel
                </Link>

                <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
                    <h1 className="font-display text-4xl text-brand-dark">Mis Propiedades</h1>
                    <Link to="/admin/propiedades/nueva" className="bg-brand-primary text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-brand-dark transition shadow-lg shadow-brand-primary/20">
                        <Plus className="w-5 h-5" /> AGREGAR INMUEBLE
                    </Link>
                </div>
                
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-brand-light/20">
                    <div className="p-6 border-b border-brand-light/10 bg-gray-50/50">
                        <div className="relative max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted w-4 h-4" />
                            <input 
                                type="text" 
                                placeholder="Buscar por título o dirección..." 
                                className="w-full pl-10 pr-4 py-2 rounded-lg border border-brand-light outline-none focus:ring-2 focus:ring-brand-primary/20"
                                value={filtro}
                                onChange={e => setFiltro(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto w-full">
                        <table className="w-full text-left min-w-[700px]"> 
                            <thead className="bg-brand-light/10 text-brand-dark uppercase font-bold tracking-widest border-b border-brand-light/20">
                                <tr>
                                    <th className="p-4">Propiedad</th>
                                    <th className="p-4">Precio</th>
                                    <th className="p-4">Tipo</th>
                                    <th className="p-4">Estado</th>
                                    <th className="p-4 text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-brand-light/10">
                                {filtradas.map(p => (
                                    <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="p-4">
                                            <div className="p-4 font-display text-xl">{p.titulo}</div>
                                            <div className="p-4 text-brand-muted text-md">{p.direccion}</div>
                                        </td>
                                        <td className="p-4 font-medium text-orange-700">
                                            {p.moneda} {p.precio.toLocaleString()}
                                        </td>
                                        <td className="p-4 text-sm text-gray-600">
                                            {getTipoLabel(p.tipo)}
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded text-xs font-bold ${p.estadoOperacion === 'Alquiler' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                                                {p.estadoOperacion || 'Venta'}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right flex justify-end gap-2">
                                            <Link to={`/propiedad/${p.id}`} target="_blank" className="p-2 hover:bg-gray-200 rounded text-gray-500" title="Ver en web">
                                                <Eye className="w-4 h-4" />
                                            </Link>
                                            <Link to={`/admin/propiedades/editar/${p.id}`} className="p-2 hover:bg-blue-100 rounded text-blue-600" title="Editar">
                                                <Pencil className="w-4 h-4" />
                                            </Link>
                                            <button onClick={() => handleDelete(p.id)} className="p-2 hover:bg-red-100 rounded text-red-600" title="Borrar">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {filtradas.length === 0 && <div className="p-8 text-center text-gray-500">No se encontraron propiedades.</div>}
                </div>
            </div>
        </div>
    );
};
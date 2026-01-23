import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getPropiedades, deletePropiedad } from '../../services/api';
import { type Propiedad, getTipoLabel } from '../../types/propiedad';
import { ArrowLeft, Plus, Pencil, Trash2, Eye, Search } from 'lucide-react';

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
                alert("Error al borrar");
            }
        }
    };

    const filtradas = propiedades.filter(p => 
        p.titulo.toLowerCase().includes(filtro.toLowerCase()) ||
        p.direccion.toLowerCase().includes(filtro.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-6xl mx-auto">
                <Link to="/admin/dashboard" className="inline-flex items-center gap-2 text-gray-500 hover:text-orange-700 mb-6 font-medium transition">
                    <ArrowLeft className="w-5 h-5" /> Volver al Panel
                </Link>
                
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Mis Propiedades</h1>
                        <p className="text-gray-500">Administrá tu catálogo inmobiliario</p>
                    </div>
                    <Link to="/admin/propiedades/nueva" className="bg-orange-700 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition shadow-lg">
                        <Plus className="w-5 h-5" /> Nueva Propiedad
                    </Link>
                </div>

                {/* Buscador */}
                <div className="bg-white p-4 rounded-t-xl border-b border-gray-100 flex gap-4">
                    <Search className="text-gray-400" />
                    <input 
                        type="text" 
                        placeholder="Buscar por título, calle..." 
                        className="w-full outline-none text-gray-700"
                        value={filtro}
                        onChange={e => setFiltro(e.target.value)}
                    />
                </div>

                {/* Tabla */}
                <div className="bg-white shadow-sm rounded-b-xl overflow-x-auto">
                    <table className="w-full text-left min-w-[600px] md:min-w-full"> 
                        <thead className="bg-gray-50 text-gray-500 font-bold text-xs uppercase">
                            <tr>
                                <th className="p-4">Propiedad</th>
                                <th className="p-4">Precio</th>
                                <th className="p-4">Tipo</th>
                                <th className="p-4">Estado</th>
                                <th className="p-4 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filtradas.map(p => (
                                <tr key={p.id} className="hover:bg-gray-50 transition">
                                    <td className="p-4">
                                        <div className="font-bold text-gray-800">{p.titulo}</div>
                                        <div className="text-xs text-gray-500">{p.direccion}</div>
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
                    {filtradas.length === 0 && <div className="p-8 text-center text-gray-500">No se encontraron propiedades.</div>}
                </div>
            </div>
        </div>
    );
};
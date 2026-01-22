import { useEffect, useState } from 'react';
import { api } from '../../services/api'; 
import { Save, ArrowLeft, Image, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AdminConfig = () => {
    const [config, setConfig] = useState({
        heroTitulo: "",
        heroSubtitulo: "",
        heroImagenUrl: "",
        heroTitulo2: "",
        heroSubtitulo2: "",
        heroImagenUrl2: ""
    });

    useEffect(() => {
        api.get('/Configuracion').then(res => {
            setConfig({
                heroTitulo: res.data.heroTitulo || "",
                heroSubtitulo: res.data.heroSubtitulo || "",
                heroImagenUrl: res.data.heroImagenUrl || "",
                heroTitulo2: res.data.heroTitulo2 || "",
                heroSubtitulo2: res.data.heroSubtitulo2 || "",
                heroImagenUrl2: res.data.heroImagenUrl2 || ""
            });
        });
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/Configuracion', config);
            alert("¡Configuración actualizada!");
        } catch (error) {
            alert("Error al guardar.");
        }
    };

    const inputClass = "w-full bg-gray-50 border border-gray-200 rounded-lg p-3 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition";
    const labelClass = "block text-xs font-bold text-gray-500 uppercase mb-1 tracking-wide";

    return (
        <div className="min-h-screen bg-gray-100 p-8 pb-32">
            <div className="max-w-6xl mx-auto">
                <Link to="/admin/dashboard" className="flex items-center gap-2 text-gray-500 hover:text-orange-700 mb-6 w-fit font-medium">
                    <ArrowLeft className="w-4 h-4" /> Volver al Panel
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    
                    {/* Formulario */}
                    <form onSubmit={handleSave} className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 space-y-8">
                        <div className="flex justify-between items-center">
                            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                                <Image className="text-orange-700" /> Configurar Hero
                            </h1>
                            <button className="bg-gray-900 text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-700 transition shadow-lg flex items-center gap-2 text-sm">
                                <Save className="w-4 h-4" /> GUARDAR
                            </button>
                        </div>

                        {/* Slides */}
                        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2 border-b border-gray-200 pb-2">
                                <span className="bg-gray-800 text-white text-xs px-2 py-1 rounded">1</span> Primer Slide
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <label className={labelClass}>Título Principal</label>
                                    <input value={config.heroTitulo} onChange={e => setConfig({...config, heroTitulo: e.target.value})} className={inputClass} placeholder="Ej: INMOBILIARIA BATTAUZ" />
                                </div>
                                <div>
                                    <label className={labelClass}>Subtítulo</label>
                                    <input value={config.heroSubtitulo} onChange={e => setConfig({...config, heroSubtitulo: e.target.value})} className={inputClass} placeholder="Ej: Encontrá tu lugar" />
                                </div>
                                <div>
                                    <label className={labelClass}>Imagen de Fondo (URL)</label>
                                    <input value={config.heroImagenUrl} onChange={e => setConfig({...config, heroImagenUrl: e.target.value})} className={inputClass} placeholder="https://..." />
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2 border-b border-gray-200 pb-2">
                                <span className="bg-gray-800 text-white text-xs px-2 py-1 rounded">2</span> Segundo Slide
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <label className={labelClass}>Título Secundario</label>
                                    <input value={config.heroTitulo2} onChange={e => setConfig({...config, heroTitulo2: e.target.value})} className={inputClass} placeholder="Ej: OPORTUNIDADES UNICAS" />
                                </div>
                                <div>
                                    <label className={labelClass}>Subtítulo Secundario</label>
                                    <input value={config.heroSubtitulo2} onChange={e => setConfig({...config, heroSubtitulo2: e.target.value})} className={inputClass} placeholder="Ej: Ventas exclusivas" />
                                </div>
                                <div>
                                    <label className={labelClass}>Imagen de Fondo 2 (URL)</label>
                                    <input value={config.heroImagenUrl2} onChange={e => setConfig({...config, heroImagenUrl2: e.target.value})} className={inputClass} placeholder="https://..." />
                                </div>
                            </div>
                        </div>
                    </form>

                    {/* Previsualizacion */}
                    <div className="space-y-6">
                        <h3 className="font-bold text-gray-700 flex items-center gap-2">
                            <Eye className="w-5 h-5" /> Vista Previa
                        </h3>
                        
                        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                            <p className="text-xs font-bold text-gray-400 mb-2 uppercase">Slide 1</p>
                            <div className="h-48 w-full rounded-lg overflow-hidden relative bg-gray-200">
                                {config.heroImagenUrl ? (
                                    <img src={config.heroImagenUrl} alt="Casa moderna con piscina en venta en Paraná" className="w-full h-full object-cover" />
                                ) : <div className="flex items-center justify-center h-full text-gray-400 text-xs">Sin imagen</div>}
                                <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center text-white p-2 text-center">
                                    <span className="font-bold text-2xl drop-shadow-md">{config.heroTitulo || "Título 1"}</span>
                                    <span className="text-xs uppercase tracking-widest mt-2 bg-orange-700 px-3 py-1 rounded-sm shadow-sm">{config.heroSubtitulo || "Subtítulo 1"}</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                            <p className="text-xs font-bold text-gray-400 mb-2 uppercase">Slide 2</p>
                            <div className="h-48 w-full rounded-lg overflow-hidden relative bg-gray-200">
                                {config.heroImagenUrl2 ? (
                                    <img src={config.heroImagenUrl2} alt="Casa moderna con piscina en venta en Paraná" className="w-full h-full object-cover" loading="lazy" />
                                ) : <div className="flex items-center justify-center h-full text-gray-400 text-xs">Sin imagen</div>}
                                <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center text-white p-2 text-center">
                                    <span className="font-bold text-2xl drop-shadow-md">{config.heroTitulo2 || "Título 2"}</span>
                                    <span className="text-xs uppercase tracking-widest mt-2 bg-orange-700 px-3 py-1 rounded-sm shadow-sm">{config.heroSubtitulo2 || "Subtítulo 2"}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
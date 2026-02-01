import { useEffect, useState } from 'react';
import { api } from '../../services/api'; 
import { Save, ArrowLeft, Image, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { SEO } from '../../components/SEO';

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
            toast.success("¡Configuración actualizada!");
        } catch (error) {
            toast.error("Error al guardar.");
        }
    };

    const inputClass = "w-full bg-gray-50 border border-brand-light/30 rounded-lg p-3 outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 transition font-body text-sm text-brand-dark";
    const labelClass = "block text-[10px] font-bold text-brand-muted uppercase mb-1 tracking-widest";

    return (
        <div className="min-h-screen bg-gray-50 p-8 pb-32 font-body">
            <SEO title="Configuración de Diseño" description="Ajustes del Hero y portada" />
            
            <div className="max-w-6xl mx-auto">
                <Link to="/admin/dashboard" className="flex items-center gap-2 text-brand-muted hover:text-brand-primary mb-8 w-fit font-bold text-xs uppercase tracking-widest transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Volver al Panel
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    
                    {/* Formulario */}
                    <form onSubmit={handleSave} className="bg-white p-8 rounded-2xl shadow-sm border border-brand-light/20 space-y-8">
                        <div className="flex justify-between items-center border-b border-brand-light/10 pb-6">
                            <h1 className="text-2xl font-display text-brand-dark flex items-center gap-3">
                                <div className="bg-brand-light/20 p-2 rounded-lg">
                                    <Image className="text-brand-primary w-6 h-6" />
                                </div>
                                Configurar Hero
                            </h1>
                            <button className="bg-brand-dark text-white font-bold py-2.5 px-6 rounded-lg hover:bg-brand-primary transition shadow-lg flex items-center gap-2 text-xs tracking-widest uppercase">
                                <Save className="w-4 h-4" /> GUARDAR
                            </button>
                        </div>

                        {/* Slide 1 */}
                        <div className="bg-gray-50/50 p-6 rounded-xl border border-brand-light/20 space-y-6">
                            <h3 className="font-display text-xl text-brand-dark mb-4 flex items-center gap-2">
                                <span className="bg-brand-primary text-white text-[10px] px-2 py-1 rounded-md font-body font-bold">01</span>
                                Portada Principal
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <label className={labelClass}>Título Principal</label>
                                    <input value={config.heroTitulo} onChange={e => setConfig({...config, heroTitulo: e.target.value})} className={inputClass} placeholder="Ej: BOTTAZZI INMOBILIARIA" />
                                </div>
                                <div>
                                    <label className={labelClass}>Subtítulo</label>
                                    <input value={config.heroSubtitulo} onChange={e => setConfig({...config, heroSubtitulo: e.target.value})} className={inputClass} placeholder="Ej: Propiedades de Exclusividad" />
                                </div>
                                <div>
                                    <label className={labelClass}>Imagen de Fondo (URL)</label>
                                    <input value={config.heroImagenUrl} onChange={e => setConfig({...config, heroImagenUrl: e.target.value})} className={inputClass} placeholder="https://images.unsplash.com/..." />
                                </div>
                            </div>
                        </div>

                        {/* Slide 2 */}
                        <div className="bg-gray-50/50 p-6 rounded-xl border border-brand-light/20 space-y-6">
                            <h3 className="font-display text-xl text-brand-dark mb-4 flex items-center gap-2">
                                <span className="bg-brand-primary text-white text-[10px] px-2 py-1 rounded-md font-body font-bold">02</span>
                                Segunda Portada
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <label className={labelClass}>Título Secundario</label>
                                    <input value={config.heroTitulo2} onChange={e => setConfig({...config, heroTitulo2: e.target.value})} className={inputClass} placeholder="Ej: OPORTUNIDADES ÚNICAS" />
                                </div>
                                <div>
                                    <label className={labelClass}>Subtítulo Secundario</label>
                                    <input value={config.heroSubtitulo2} onChange={e => setConfig({...config, heroSubtitulo2: e.target.value})} className={inputClass} placeholder="Ej: Inversiones Seguras" />
                                </div>
                                <div>
                                    <label className={labelClass}>Imagen de Fondo 2 (URL)</label>
                                    <input value={config.heroImagenUrl2} onChange={e => setConfig({...config, heroImagenUrl2: e.target.value})} className={inputClass} placeholder="https://images.unsplash.com/..." />
                                </div>
                            </div>
                        </div>
                    </form>

                    {/* Previsualización */}
                    <div className="space-y-6">
                        <h3 className="font-display text-2xl text-brand-dark flex items-center gap-2 px-2">
                            <Eye className="w-6 h-6 text-brand-primary" /> Vista Previa
                        </h3>
                        
                        {/* Preview Slide 1 */}
                        <div className="bg-white p-5 rounded-2xl shadow-sm border border-brand-light/20">
                            <p className="text-[10px] font-bold text-brand-muted mb-3 uppercase tracking-widest">Slide 01</p>
                            <div className="h-56 w-full rounded-xl overflow-hidden relative bg-brand-dark/10 shadow-inner">
                                {config.heroImagenUrl ? (
                                    <img src={config.heroImagenUrl} alt="Preview 1" className="w-full h-full object-cover" />
                                ) : <div className="flex items-center justify-center h-full text-brand-muted text-xs font-body italic">Sin imagen configurada</div>}
                                <div className="absolute inset-0 bg-brand-dark/40 flex flex-col items-center justify-center text-white p-4 text-center">
                                    <span className="font-display text-3xl drop-shadow-lg uppercase tracking-tight">{config.heroTitulo || "Título 1"}</span>
                                    <span className="text-[10px] uppercase tracking-[0.3em] font-bold mt-4 bg-brand-light text-brand-dark px-4 py-2 rounded-sm shadow-xl">
                                        {config.heroSubtitulo || "Subtítulo 1"}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Preview Slide 2 */}
                        <div className="bg-white p-5 rounded-2xl shadow-sm border border-brand-light/20">
                            <p className="text-[10px] font-bold text-brand-muted mb-3 uppercase tracking-widest">Slide 02</p>
                            <div className="h-56 w-full rounded-xl overflow-hidden relative bg-brand-dark/10 shadow-inner">
                                {config.heroImagenUrl2 ? (
                                    <img src={config.heroImagenUrl2} alt="Preview 2" className="w-full h-full object-cover" />
                                ) : <div className="flex items-center justify-center h-full text-brand-muted text-xs font-body italic">Sin imagen configurada</div>}
                                <div className="absolute inset-0 bg-brand-dark/40 flex flex-col items-center justify-center text-white p-4 text-center">
                                    <span className="font-display text-3xl drop-shadow-lg uppercase tracking-tight">{config.heroTitulo2 || "Título 2"}</span>
                                    <span className="text-[10px] uppercase tracking-[0.3em] font-bold mt-4 bg-brand-light text-brand-dark px-4 py-2 rounded-sm shadow-xl">
                                        {config.heroSubtitulo2 || "Subtítulo 2"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
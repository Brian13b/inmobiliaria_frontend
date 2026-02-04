import { useEffect, useState } from 'react';
import { api, uploadImagenHero } from '../../services/api';
import { Save, ArrowLeft, Image as ImageIcon, Eye, Upload, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { SEO } from '../../components/SEO';

export const AdminConfig = () => {
    const [loading, setLoading] = useState(false);
    const [config, setConfig] = useState({
        heroTitulo: "",
        heroSubtitulo: "",
        heroImagenUrl: "",
        heroTitulo2: "",
        heroSubtitulo2: "",
        heroImagenUrl2: ""
    });

    const [file1, setFile1] = useState<File | null>(null);
    const [preview1, setPreview1] = useState("");
    const [file2, setFile2] = useState<File | null>(null);
    const [preview2, setPreview2] = useState("");

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

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, slideNum: number) => {
        const file = e.target.files?.[0];
        if (file) {
            if (slideNum === 1) {
                setFile1(file);
                setPreview1(URL.createObjectURL(file));
            } else {
                setFile2(file);
                setPreview2(URL.createObjectURL(file));
            }
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            let finalUrl1 = config.heroImagenUrl;
            let finalUrl2 = config.heroImagenUrl2;

            if (file1) {
                const res1 = await uploadImagenHero(file1);
                finalUrl1 = res1.url;
            }

            if (file2) {
                const res2 = await uploadImagenHero(file2);
                finalUrl2 = res2.url;
            }

            const dataToSave = {
                Id: 1,
                HeroTitulo: config.heroTitulo,
                HeroSubtitulo: config.heroSubtitulo,
                HeroImagenUrl: finalUrl1,
                HeroTitulo2: config.heroTitulo2,
                HeroSubtitulo2: config.heroSubtitulo2,
                HeroImagenUrl2: finalUrl2
            };

            await api.post('/Configuracion', dataToSave);
            
            setConfig({ ...config, heroImagenUrl: finalUrl1, heroImagenUrl2: finalUrl2 });
            setFile1(null);
            setFile2(null);
            
            toast.success("¡Configuración actualizada con éxito!");
        } catch (error) {
            toast.error("Error al guardar la configuración.");
        } finally {
            setLoading(false);
        }
    };

    const inputClass = "w-full bg-gray-50 border border-brand-light/30 rounded-lg p-3 outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 transition font-body text-sm text-brand-dark";
    const labelClass = "block text-[10px] font-bold text-brand-muted uppercase mb-1 tracking-widest";
    const uploadZoneClass = "border-2 border-dashed border-brand-light/40 rounded-xl p-4 text-center bg-gray-50 hover:bg-brand-light/10 transition cursor-pointer relative group";

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
                                    <ImageIcon className="text-brand-primary w-6 h-6" />
                                </div>
                                Configurar Hero
                            </h1>
                            <button disabled={loading} className="bg-brand-dark text-white font-bold py-2.5 px-6 rounded-lg hover:bg-brand-primary transition shadow-lg flex items-center gap-2 text-xs tracking-widest uppercase disabled:opacity-50">
                                {loading ? <Loader2 className="animate-spin w-4 h-4" /> : <Save className="w-4 h-4" />}
                                {loading ? "GUARDANDO..." : "GUARDAR"}
                            </button>
                        </div>

                        {/* Slide 1 */}
                        <div className="bg-gray-50/50 p-6 rounded-xl border border-brand-light/20 space-y-6">
                            <h3 className="font-display text-xl text-brand-dark flex items-center gap-2">
                                <span className="bg-brand-primary text-white text-[10px] px-2 py-1 rounded-md font-body font-bold">01</span>
                                Portada Principal
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <label className={labelClass}>Título</label>
                                    <input value={config.heroTitulo} onChange={e => setConfig({...config, heroTitulo: e.target.value})} className={inputClass} />
                                </div>
                                <div>
                                    <label className={labelClass}>Subtítulo</label>
                                    <input value={config.heroSubtitulo} onChange={e => setConfig({...config, heroSubtitulo: e.target.value})} className={inputClass} />
                                </div>
                                <div>
                                    <label className={labelClass}>Imagen Principal (Desde PC)</label>
                                    <div className={uploadZoneClass}>
                                        <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 1)} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                                        <div className="flex flex-col items-center">
                                            <Upload className="w-6 h-6 text-brand-muted group-hover:text-brand-primary transition-colors mb-1" />
                                            <span className="text-[10px] text-brand-muted uppercase font-bold tracking-tight">Seleccionar imagen</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Slide 2 */}
                        <div className="bg-gray-50/50 p-6 rounded-xl border border-brand-light/20 space-y-6">
                            <h3 className="font-display text-xl text-brand-dark flex items-center gap-2">
                                <span className="bg-brand-primary text-white text-[10px] px-2 py-1 rounded-md font-body font-bold">02</span>
                                Segunda Portada
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <label className={labelClass}>Título</label>
                                    <input value={config.heroTitulo2} onChange={e => setConfig({...config, heroTitulo2: e.target.value})} className={inputClass} />
                                </div>
                                <div>
                                    <label className={labelClass}>Subtítulo</label>
                                    <input value={config.heroSubtitulo2} onChange={e => setConfig({...config, heroSubtitulo2: e.target.value})} className={inputClass} />
                                </div>
                                <div>
                                    <label className={labelClass}>Segunda Imagen (Desde PC)</label>
                                    <div className={uploadZoneClass}>
                                        <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 2)} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                                        <div className="flex flex-col items-center">
                                            <Upload className="w-6 h-6 text-brand-muted group-hover:text-brand-primary transition-colors mb-1" />
                                            <span className="text-[10px] text-brand-muted uppercase font-bold tracking-tight">Seleccionar imagen</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>

                    {/* Previsualización Mejorada */}
                    <div className="space-y-6">
                        <h3 className="font-display text-2xl text-brand-dark flex items-center gap-2 px-2">
                            <Eye className="w-6 h-6 text-brand-primary" /> Vista Previa
                        </h3>
                        
                        {/* Preview 1 */}
                        <div className="bg-white p-5 rounded-2xl shadow-sm border border-brand-light/20">
                            <p className={labelClass}>Preview Portada 1</p>
                            <div className="h-64 w-full rounded-xl overflow-hidden relative bg-brand-dark shadow-inner">
                                <img 
                                    src={preview1 || config.heroImagenUrl || "https://placehold.co/800x600?text=Sin+Imagen"} 
                                    className="w-full h-full object-cover opacity-60" 
                                    alt="Preview" 
                                />
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4 text-center">
                                    <span className="font-display text-3xl uppercase tracking-tighter">{config.heroTitulo || "TITULO 1"}</span>
                                    <span className="text-[9px] tracking-[0.3em] font-bold mt-4 bg-brand-light text-brand-dark px-4 py-2 rounded-sm uppercase">
                                        {config.heroSubtitulo || "Subtítulo 1"}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Preview 2 */}
                        <div className="bg-white p-5 rounded-2xl shadow-sm border border-brand-light/20">
                            <p className={labelClass}>Preview Portada 2</p>
                            <div className="h-64 w-full rounded-xl overflow-hidden relative bg-brand-dark shadow-inner">
                                <img 
                                    src={preview2 || config.heroImagenUrl2 || "https://placehold.co/800x600?text=Sin+Imagen"} 
                                    className="w-full h-full object-cover opacity-60" 
                                    alt="Preview" 
                                />
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4 text-center">
                                    <span className="font-display text-3xl uppercase tracking-tighter">{config.heroTitulo2 || "TITULO 2"}</span>
                                    <span className="text-[9px] tracking-[0.3em] font-bold mt-4 bg-brand-light text-brand-dark px-4 py-2 rounded-sm uppercase">
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
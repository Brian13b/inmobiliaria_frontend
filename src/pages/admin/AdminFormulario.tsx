import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { createPropiedad, getPropiedadById, updatePropiedad, uploadImagen, deleteImagen } from '../../services/api';
import { TipoPropiedad } from '../../types/propiedad';
import { 
    Save, ArrowLeft, Upload, Trash2, Home, MapPin, 
    CheckCircle, Image as ImageIcon, X, Loader2, Ruler, Zap 
} from 'lucide-react'; 
import { SEO } from '../../components/SEO';
import toast from 'react-hot-toast';

export const AdminFormulario = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const esEdicion = !!id;

    const [loading, setLoading] = useState(false);
    const [fotosParaSubir, setFotosParaSubir] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    
    const [form, setForm] = useState({
        titulo: "",
        descripcion: "",
        precio: 0,
        moneda: "USD",
        precioExpensas: 0,
        direccion: "",
        barrio: "",
        ciudad: "Paraná",
        ambientes: 1,
        dormitorios: 0,
        baños: 1,
        cocheras: 0,
        superficieTotal: 0,
        superficieCubierta: 0,
        antiguedad: 0,
        tipo: 0,
        estadoOperacion: "Venta",
        activa: true,
        esDestacada: false,
        // Servicios
        tieneAgua: false,
        tieneGas: false,
        tieneLuz: false,
        tieneInternet: false,
        tieneCloacas: false,
        tienePavimento: false,
        imagenes: [] as any[]
    });

    useEffect(() => {
        if (esEdicion) {
            getPropiedadById(Number(id)).then(data => {
                setForm({
                    ...data,
                    titulo: data.titulo || "",
                    descripcion: data.descripcion || "",
                    direccion: data.direccion || "",
                    barrio: data.barrio || "",
                    ciudad: data.ciudad || "Paraná",
                    precioExpensas: data.precioExpensas || 0,
                    imagenes: data.imagenes || []
                });
            });
        }
    }, [id, esEdicion]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;
        
        setForm(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSeleccionarFotos = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const archivos = Array.from(e.target.files);
            setFotosParaSubir(prev => [...prev, ...archivos]);
            const nuevasPreviews = archivos.map(file => URL.createObjectURL(file));
            setPreviews(prev => [...prev, ...nuevasPreviews]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const dataToSend = {
                ...form,
                precio: Number(form.precio),
                precioExpensas: Number(form.precioExpensas),
                tipo: Number(form.tipo),
                ambientes: Number(form.ambientes),
                dormitorios: Number(form.dormitorios),
                baños: Number(form.baños),
                cocheras: Number(form.cocheras),
                superficieTotal: Number(form.superficieTotal),
                superficieCubierta: Number(form.superficieCubierta),
                antiguedad: Number(form.antiguedad),
            };

            let propiedadId = Number(id);
            if (esEdicion) {
                await updatePropiedad(propiedadId, dataToSend);
            } else {
                const nueva = await createPropiedad(dataToSend);
                propiedadId = nueva.id;
            }

            if (fotosParaSubir.length > 0) {
                await Promise.all(fotosParaSubir.map(file => uploadImagen(propiedadId, file)));
            }

            toast.success("Propiedad guardada con éxito");
            navigate("/admin/propiedades");
        } catch (error) {
            toast.error("Error al guardar");
        } finally {
            setLoading(false);
        }
    };

    const cardClass = "bg-white p-6 rounded-2xl shadow-sm border border-brand-light/20 mb-6";
    const sectionTitleClass = "text-lg font-display text-brand-dark mb-4 flex items-center gap-2 border-b border-brand-light/10 pb-2";
    const labelClass = "block text-[10px] font-bold text-brand-muted uppercase mb-1 tracking-widest";
    const inputClass = "w-full bg-gray-50 border border-brand-light/30 text-brand-dark text-sm rounded-lg focus:ring-brand-primary focus:border-brand-primary p-2.5 transition-all font-body";

    const handleBorrarFotoExistente = async (imagenId: number) => {
        if (!confirm("¿Eliminar esta foto permanentemente?")) return;
        try {
            await deleteImagen(Number(id), imagenId);
            
            setForm(prev => ({
                ...prev,
                imagenes: prev.imagenes?.filter(img => img.id !== imagenId)
            }));
            toast.success("Foto eliminada");
        } catch (error) {
            toast.error("No se pudo eliminar la foto");
        }
    };

    const removerFotoLocal = (index: number) => {
        setFotosParaSubir(prev => prev.filter((_, i) => i !== index));
        setPreviews(prev => {
            const nuevaLista = prev.filter((_, i) => i !== index);
            URL.revokeObjectURL(prev[index]);
            return nuevaLista;
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-8 pb-32 font-body text-brand-dark">
            <SEO title={esEdicion ? "Editar Propiedad" : "Nueva Propiedad"} description="Administración de catálogo" />
            
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
                    <div>
                        <Link to="/admin/propiedades" className="flex items-center gap-2 text-brand-muted hover:text-brand-primary font-bold text-[10px] uppercase tracking-widest transition-colors mb-2">
                            <ArrowLeft className="w-4 h-4" /> Volver al listado
                        </Link>
                        <h1 className="text-3xl font-display uppercase tracking-tight">{esEdicion ? "Editar Propiedad" : "Cargar Inmueble"}</h1>
                    </div>
                    <button onClick={handleSubmit} disabled={loading} className="bg-brand-dark text-white font-bold py-3 px-8 rounded-lg hover:bg-brand-primary transition shadow-xl flex items-center gap-2 text-xs tracking-widest uppercase disabled:opacity-50">
                        {loading ? <Loader2 className="animate-spin w-4 h-4" /> : <Save className="w-4 h-4" />}
                        {loading ? "GUARDANDO..." : "GUARDAR TODO"}
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-left">
                    <div className="lg:col-span-2 space-y-6">
                        
                        {/* 1. Información General */}
                        <div className={cardClass}>
                            <h3 className={sectionTitleClass}><Home className="w-5 h-5 text-brand-primary" /> Información General</h3>
                            <div className="space-y-4 text-left">
                                <div>
                                    <label className={labelClass}>Título de la publicación</label>
                                    <input name="titulo" value={form.titulo} onChange={handleChange} className={inputClass} placeholder="Ej: Departamento Céntrico Moderno" required />
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className={labelClass}>Moneda</label>
                                        <select name="moneda" value={form.moneda} onChange={handleChange} className={inputClass}>
                                            <option value="USD">Dólares (USD)</option>
                                            <option value="ARS">Pesos (ARS)</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className={labelClass}>Precio</label>
                                        <input type="number" name="precio" value={form.precio} onChange={handleChange} className={inputClass} />
                                    </div>
                                    <div className="col-span-2 md:col-span-1 text-left">
                                        <label className={labelClass}>Expensas (ARS)</label>
                                        <input type="number" name="precioExpensas" value={form.precioExpensas} onChange={handleChange} className={inputClass} />
                                    </div>
                                </div>
                                <div>
                                    <label className={labelClass}>Descripción</label>
                                    <textarea name="descripcion" value={form.descripcion} onChange={handleChange} rows={6} className={`${inputClass} resize-none`} placeholder="Describe las bondades de la propiedad..." />
                                </div>
                            </div>
                        </div>

                        {/* 2. Ubicación */}
                        <div className={cardClass}>
                            <h3 className={sectionTitleClass}><MapPin className="w-5 h-5 text-brand-primary" /> Ubicación</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className={labelClass}>Dirección</label>
                                    <input name="direccion" value={form.direccion} onChange={handleChange} className={inputClass} placeholder="Calle y Nro" />
                                </div>
                                <div>
                                    <label className={labelClass}>Barrio / Zona</label>
                                    <input name="barrio" value={form.barrio} onChange={handleChange} className={inputClass} placeholder="Ej: Centro / Oro Verde" />
                                </div>
                            </div>
                        </div>

                        {/* 3. Multimedia */}
                        <div className={cardClass}>
                            <h3 className={sectionTitleClass}><ImageIcon className="w-5 h-5 text-brand-primary" /> Galería de Fotos</h3>
                            <div className="border-2 border-dashed border-brand-light/40 rounded-xl p-8 text-center bg-gray-50 hover:bg-brand-light/5 transition relative mb-6">
                                <input type="file" multiple accept="image/*" onChange={handleSeleccionarFotos} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                                <Upload className="w-10 h-10 text-brand-muted mx-auto mb-2" />
                                <p className="text-xs font-bold uppercase tracking-widest text-brand-muted">Click o Arrastrá para subir fotos</p>
                            </div>
                            
                            <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
                                {form.imagenes?.map(img => (
                                    <div key={img.id} className="relative h-24 rounded-lg overflow-hidden group border border-brand-light/20 shadow-inner">
                                        <img src={img.url} className="w-full h-full object-cover" alt="Property" />
                                        <button type="button" onClick={() => handleBorrarFotoExistente(img.id)} className="absolute inset-0 bg-red-600/80 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                ))}
                                {previews.map((p, i) => (
                                    <div key={i} className="relative h-24 rounded-lg overflow-hidden border-2 border-brand-primary shadow-md">
                                        <img src={p} className="w-full h-full object-cover" alt="New" />
                                        <div className="absolute top-0 right-0 bg-brand-primary text-white text-[8px] px-1.5 py-0.5 font-bold uppercase">Nueva</div>
                                        <button type="button" onClick={() => removerFotoLocal(i)} className="absolute bottom-1 right-1 bg-white/90 p-1 rounded-md text-red-600 shadow-sm"><X size={12}/></button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-1 space-y-6">
                        {/* 4. Visibilidad y Tipo */}
                        <div className={`${cardClass} border-l-4 border-l-brand-primary`}>
                            <h3 className={sectionTitleClass}><CheckCircle className="w-5 h-5 text-brand-primary" /> Visibilidad</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className={labelClass}>Operación</label>
                                    <select name="estadoOperacion" value={form.estadoOperacion} onChange={handleChange} className={inputClass}>
                                        <option value="Venta">Venta</option>
                                        <option value="Alquiler">Alquiler</option>
                                    </select>
                                </div>
                                <div>
                                    <label className={labelClass}>Tipo de Inmueble</label>
                                    <select name="tipo" value={form.tipo} onChange={handleChange} className={inputClass}>
                                        <option value={TipoPropiedad.Casa}>Casa</option>
                                        <option value={TipoPropiedad.Departamento}>Departamento</option>
                                        <option value={TipoPropiedad.Terreno}>Terreno</option>
                                        <option value={TipoPropiedad.Local}>Local</option>
                                        <option value={TipoPropiedad.Oficina}>Oficina</option>
                                    </select>
                                </div>
                                <div className="space-y-3 pt-2">
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <input type="checkbox" name="activa" checked={form.activa} onChange={handleChange} className="w-5 h-5 rounded border-brand-light text-brand-primary focus:ring-brand-primary transition-all" />
                                        <span className="text-xs font-bold uppercase tracking-widest text-brand-muted group-hover:text-brand-dark transition-colors">Propiedad Activa</span>
                                    </label>
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <input type="checkbox" name="esDestacada" checked={form.esDestacada} onChange={handleChange} className="w-5 h-5 rounded border-brand-light text-brand-secondary focus:ring-brand-secondary transition-all" />
                                        <span className="text-xs font-bold uppercase tracking-widest text-brand-secondary group-hover:brightness-75 transition-colors font-bold">Marcar como Destacada</span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* 5. Medidas */}
                        <div className={cardClass}>
                            <h3 className={sectionTitleClass}><Ruler className="w-5 h-5 text-brand-primary" /> Superficies</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className={labelClass}>Sup. Total (m²)</label>
                                    <input type="number" name="superficieTotal" value={form.superficieTotal} onChange={handleChange} className={inputClass} />
                                </div>
                                <div>
                                    <label className={labelClass}>Sup. Cubierta (m²)</label>
                                    <input type="number" name="superficieCubierta" value={form.superficieCubierta} onChange={handleChange} className={inputClass} />
                                </div>
                                <div>
                                    <label className={labelClass}>Dormitorios</label>
                                    <input type="number" name="dormitorios" value={form.dormitorios} onChange={handleChange} className={inputClass} />
                                </div>
                                <div>
                                    <label className={labelClass}>Baños</label>
                                    <input type="number" name="baños" value={form.baños} onChange={handleChange} className={inputClass} />
                                </div>
                                <div>
                                    <label className={labelClass}>Ambientes</label>
                                    <input type="number" name="ambientes" value={form.ambientes} onChange={handleChange} className={inputClass} />
                                </div>
                                <div>
                                    <label className={labelClass}>Cocheras</label>
                                    <input type="number" name="cocheras" value={form.cocheras} onChange={handleChange} className={inputClass} />
                                </div>
                            </div>
                        </div>

                        {/* 6. Servicios Checklist */}
                        <div className={cardClass}>
                            <h3 className={sectionTitleClass}><Zap className="w-5 h-5 text-brand-primary" /> Servicios</h3>
                            <div className="space-y-2">
                                {[
                                    {id: 'tieneAgua', n: 'Agua Corriente'},
                                    {id: 'tieneGas', n: 'Gas Natural'},
                                    {id: 'tieneLuz', n: 'Luz Eléctrica'},
                                    {id: 'tieneInternet', n: 'Internet/Wi-Fi'},
                                    {id: 'tieneCloacas', n: 'Cloacas'},
                                    {id: 'tienePavimento', n: 'Pavimento'}
                                ].map(s => (
                                    <label key={s.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition">
                                        <input type="checkbox" name={s.id} checked={(form as any)[s.id]} onChange={handleChange} className="w-4 h-4 text-brand-primary rounded border-brand-light focus:ring-brand-primary" />
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-brand-muted">{s.n}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
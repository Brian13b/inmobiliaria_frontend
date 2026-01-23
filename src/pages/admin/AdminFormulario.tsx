import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { createPropiedad, getPropiedadById, updatePropiedad, uploadImagen, deleteImagen } from '../../services/api';
import { TipoPropiedad } from '../../types/propiedad';
import { Save, ArrowLeft, Upload, Trash2, Home, MapPin, List, CheckCircle, Image as ImageIcon, X } from 'lucide-react'; // Agregué 'X'

export const AdminFormulario = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const esEdicion = !!id;

    const [loading, setLoading] = useState(false);
    
    // ESTADOS NUEVOS PARA FOTOS LOCALES
    const [fotosParaSubir, setFotosParaSubir] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    
    const [form, setForm] = useState({
        titulo: "",
        descripcion: "",
        precio: 0,
        moneda: "USD",
        precioExpensas: 0,
        direccion: "",
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
        imagenes: [] as any[]
    });

    useEffect(() => {
        if (esEdicion) {
            getPropiedadById(Number(id)).then(data => {
                setForm({
                    ...data,
                    // Aseguramos valores por defecto para evitar warnings de react
                    titulo: data.titulo || "",
                    descripcion: data.descripcion || "",
                    direccion: data.direccion || "",
                    ciudad: data.ciudad || "",
                    moneda: data.moneda || "USD",
                    estadoOperacion: data.estadoOperacion || "Venta",
                    precio: data.precio || 0,
                    precioExpensas: data.precioExpensas || 0,
                    ambientes: data.ambientes || 0,
                    dormitorios: data.dormitorios || 0,
                    baños: data.baños || 0,
                    cocheras: data.cocheras || 0,
                    superficieTotal: data.superficieTotal || 0,
                    antiguedad: data.antiguedad || 0,
                    tipo: data.tipo ?? 0, 
                    imagenes: data.imagenes || []
                });
            });
        }
    }, [id]);

    const handleChange = (e: any) => {
        const { name, value, type, checked } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    // --- NUEVA LÓGICA DE SELECCIÓN DE FOTOS (LOCAL) ---
    const handleSeleccionarFotos = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const archivos = Array.from(e.target.files);
            
            // 1. Guardamos los archivos reales para subirlos después
            setFotosParaSubir(prev => [...prev, ...archivos]);

            // 2. Generamos URLs temporales para que el usuario vea qué eligió
            const nuevasPreviews = archivos.map(file => URL.createObjectURL(file));
            setPreviews(prev => [...prev, ...nuevasPreviews]);
        }
    };

    const removerFotoLocal = (index: number) => {
        setFotosParaSubir(prev => prev.filter((_, i) => i !== index));
        setPreviews(prev => prev.filter((_, i) => i !== index));
    };

    // --- LÓGICA DE GUARDADO INTELIGENTE ---
    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setLoading(true);
        try {
            const dataToSend = {
                ...form,
                precio: Number(form.precio),
                tipo: Number(form.tipo),
                ambientes: Number(form.ambientes),
                dormitorios: Number(form.dormitorios),
                baños: Number(form.baños),
                cocheras: Number(form.cocheras),
                superficieTotal: Number(form.superficieTotal),
            };

            let propiedadId = Number(id);

            if (esEdicion) {
                // 1. Actualizamos datos
                await updatePropiedad(propiedadId, dataToSend);
                
                // 2. Si agregó fotos nuevas MIENTRAS editaba, las subimos
                if (fotosParaSubir.length > 0) {
                    await subirFotosMasivas(propiedadId);
                }
                
                alert("Propiedad actualizada correctamente");
                navigate("/admin/propiedades");
            } else {
                // 1. Creamos la propiedad primero
                const nueva = await createPropiedad(dataToSend);
                propiedadId = nueva.id; // Obtenemos el ID nuevo

                // 2. Subimos las fotos usando ese ID nuevo
                if (fotosParaSubir.length > 0) {
                    await subirFotosMasivas(propiedadId);
                }

                alert("Propiedad creada y fotos subidas con éxito");
                navigate("/admin/propiedades");
            }
        } catch (error) {
            console.error(error);
            alert("Error al guardar la propiedad");
        } finally {
            setLoading(false);
        }
    };

    // Helper para subir múltiples fotos en paralelo
    const subirFotosMasivas = async (idPropiedad: number) => {
        const promesas = fotosParaSubir.map(file => uploadImagen(idPropiedad, file));
        await Promise.all(promesas);
    };

    // Borrar fotos YA existentes en la base de datos
    const handleBorrarFotoExistente = async (imagenId: number) => {
        if (!confirm("¿Eliminar esta foto permanentemente?")) return;
        try {
            await deleteImagen(Number(id), imagenId);
            setForm(prev => ({
                ...prev,
                imagenes: prev.imagenes?.filter(img => img.id !== imagenId)
            }));
        } catch (error) {
            alert("Error al borrar");
        }
    };

    const cardClass = "bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6";
    const sectionTitleClass = "text-lg font-bold text-gray-800 mb-4 flex items-center gap-2 border-b pb-2";
    const labelClass = "block text-xs font-bold text-gray-500 uppercase mb-1 tracking-wide";
    const inputClass = "w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-orange-500 focus:border-orange-500 block p-2.5 transition-colors placeholder-gray-400";
    const checkClass = "w-5 h-5 text-orange-700 bg-gray-100 border-gray-300 rounded focus:ring-orange-500";

    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-8 pb-32">
            <div className="max-w-5xl mx-auto">
                {/* Header Flotante */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <div className="flex flex-col gap-1">
                        <Link to="/admin/propiedades" className="inline-flex items-center gap-2 text-gray-500 hover:text-orange-700 font-medium text-sm transition-colors w-fit">
                            <ArrowLeft className="w-4 h-4" /> Volver al listado
                        </Link>
                        <h1 className="text-3xl font-bold text-gray-900">
                            {esEdicion ? `Editando: ${form.titulo || 'Sin título'}` : "Nueva Propiedad"}
                        </h1>
                    </div>
                    
                    <button 
                        onClick={handleSubmit}
                        disabled={loading} 
                        className="bg-gray-900 text-white font-bold py-3 px-6 rounded-lg hover:bg-orange-700 transition shadow-lg flex items-center gap-2 disabled:opacity-50"
                    >
                        <Save className="w-5 h-5" /> 
                        {loading ? "GUARDANDO..." : "GUARDAR TODO"}
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2">
                            
                            {/* Información Basica */}
                            <div className={cardClass}>
                                <h3 className={sectionTitleClass}><Home className="w-5 h-5 text-orange-700" /> Datos Principales</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className={labelClass}>Título de la publicación</label>
                                        <input name="titulo" value={form.titulo} onChange={handleChange} className={inputClass} placeholder="Ej: Casa Quinta en Oro Verde" required />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className={labelClass}>Precio</label>
                                            <div className="flex gap-2">
                                                <select name="moneda" value={form.moneda} onChange={handleChange} className={`${inputClass} w-24`}>
                                                    <option>USD</option>
                                                    <option>ARS</option>
                                                </select>
                                                <input type="number" name="precio" value={form.precio} onChange={handleChange} className={inputClass} />
                                            </div>
                                        </div>
                                        <div>
                                            <label className={labelClass}>Expensas (ARS)</label>
                                            <input type="number" name="precioExpensas" value={form.precioExpensas} onChange={handleChange} className={inputClass} />
                                        </div>
                                    </div>
                                    <div>
                                        <label className={labelClass}>Descripción</label>
                                        <textarea name="descripcion" value={form.descripcion} onChange={handleChange} rows={6} className={inputClass} placeholder="Descripción detallada..." />
                                    </div>
                                </div>
                            </div>

                            {/* Ubicacion */}
                            <div className={cardClass}>
                                <h3 className={sectionTitleClass}><MapPin className="w-5 h-5 text-orange-700" /> Ubicación</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className={labelClass}>Dirección / Calle</label>
                                        <input name="direccion" value={form.direccion} onChange={handleChange} className={inputClass} placeholder="Ej: La Paz 698" />
                                    </div>
                                    <div>
                                        <label className={labelClass}>Ciudad</label>
                                        <input name="ciudad" value={form.ciudad} onChange={handleChange} className={inputClass} />
                                    </div>
                                </div>
                            </div>

                            {/* Galeria UNIFICADA (Siempre visible) */}
                            <div className={cardClass}>
                                <h3 className={sectionTitleClass}><ImageIcon className="w-5 h-5 text-orange-700" /> Galería de Fotos</h3>
                                
                                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center bg-gray-50 hover:bg-orange-50 transition cursor-pointer relative mb-6 group">
                                    <input 
                                        type="file" 
                                        accept="image/*" 
                                        multiple // IMPORTANTE: Múltiples archivos
                                        onChange={handleSeleccionarFotos} 
                                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10" 
                                    />
                                    <div className="pointer-events-none">
                                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2 group-hover:text-orange-500 transition-colors" />
                                        <p className="text-gray-500 font-medium text-sm">
                                            Arrastrá tus fotos o hacé clic para agregar (podés elegir varias)
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {/* 1. MOSTRAR FOTOS YA EXISTENTES (Solo si es edición) */}
                                    {form.imagenes?.map((img) => (
                                        <div key={img.id} className="relative group rounded-lg overflow-hidden h-24 border border-gray-200 shadow-sm">
                                            <img src={img.url} className="w-full h-full object-cover" alt="Existente" />
                                            <div className="absolute top-1 right-1 z-10">
                                                <span className="bg-green-500 text-white text-[10px] px-1 rounded shadow">Guardada</span>
                                            </div>
                                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                                                <button 
                                                    type="button" 
                                                    onClick={() => handleBorrarFotoExistente(img.id)}
                                                    className="bg-red-600 text-white p-1.5 rounded-full hover:bg-red-700 transition transform hover:scale-110"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}

                                    {/* 2. MOSTRAR PREVIEWS DE FOTOS NUEVAS (Locales) */}
                                    {previews.map((previewUrl, index) => (
                                        <div key={index} className="relative group rounded-lg overflow-hidden h-24 border-2 border-orange-400 shadow-sm">
                                            <img src={previewUrl} className="w-full h-full object-cover opacity-90" alt="Nueva" />
                                            <div className="absolute top-1 right-1 z-10">
                                                <span className="bg-orange-500 text-white text-[10px] px-1 rounded shadow animate-pulse">Nueva</span>
                                            </div>
                                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                                                <button 
                                                    type="button" 
                                                    onClick={() => removerFotoLocal(index)} 
                                                    className="bg-red-600 text-white p-1.5 rounded-full hover:bg-red-700"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Detalles */}
                        <div className="lg:col-span-1">
                            <div className={`${cardClass} border-l-4 border-l-orange-500`}>
                                <h3 className={sectionTitleClass}><CheckCircle className="w-5 h-5 text-orange-700" /> Estado</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className={labelClass}>Operación</label>
                                        <select name="estadoOperacion" value={form.estadoOperacion} onChange={handleChange} className={inputClass}>
                                            <option>Venta</option>
                                            <option>Alquiler</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className={labelClass}>Tipo</label>
                                        <select name="tipo" value={form.tipo} onChange={handleChange} className={inputClass}>
                                            <option value={TipoPropiedad.Casa}>Casa</option>
                                            <option value={TipoPropiedad.Departamento}>Departamento</option>
                                            <option value={TipoPropiedad.Terreno}>Terreno</option>
                                            <option value={TipoPropiedad.Local}>Local</option>
                                            <option value={TipoPropiedad.Oficina}>Oficina</option>
                                        </select>
                                    </div>
                                    
                                    <div className="pt-4 border-t border-gray-100 space-y-3">
                                        <label className="flex items-center gap-3 cursor-pointer p-2 hover:bg-gray-50 rounded-lg transition">
                                            <input type="checkbox" name="activa" checked={form.activa} onChange={handleChange} className={checkClass} />
                                            <span className="text-sm font-medium text-gray-700">Propiedad Activa</span>
                                        </label>
                                        <label className="flex items-center gap-3 cursor-pointer p-2 hover:bg-gray-50 rounded-lg transition">
                                            <input type="checkbox" name="esDestacada" checked={form.esDestacada} onChange={handleChange} className={checkClass} />
                                            <span className="text-sm font-medium text-gray-700">Destacar en Inicio</span>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* Características */}
                            <div className={cardClass}>
                                <h3 className={sectionTitleClass}><List className="w-5 h-5 text-orange-700" /> Detalles</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div><label className={labelClass}>Amb.</label><input type="number" name="ambientes" value={form.ambientes} onChange={handleChange} className={inputClass} /></div>
                                    <div><label className={labelClass}>Dorm.</label><input type="number" name="dormitorios" value={form.dormitorios} onChange={handleChange} className={inputClass} /></div>
                                    <div><label className={labelClass}>Baños</label><input type="number" name="baños" value={form.baños} onChange={handleChange} className={inputClass} /></div>
                                    <div><label className={labelClass}>Cocheras</label><input type="number" name="cocheras" value={form.cocheras} onChange={handleChange} className={inputClass} /></div>
                                    <div className="col-span-2 border-t pt-2 mt-2">
                                        <label className={labelClass}>Sup. Total (m²)</label>
                                        <input type="number" name="superficieTotal" value={form.superficieTotal} onChange={handleChange} className={inputClass} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};
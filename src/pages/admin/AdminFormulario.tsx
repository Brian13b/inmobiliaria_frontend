import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { createPropiedad, getPropiedadById, updatePropiedad, uploadImagen, deleteImagen, updateImagenesOrden } from '../../services/api';
import { TipoPropiedad } from '../../types/propiedad';
import { 
    Save, ArrowLeft, Upload, Trash2, Home, MapPin, 
    CheckCircle, Image as ImageIcon, X, Loader2, Ruler, Zap, Layout, Info
} from 'lucide-react'; 
import { SEO } from '../../components/SEO';
import toast from 'react-hot-toast';

import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

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
        estado: 0, // Enum EstadoInmueble (Que quede vacio si no hay datos)
        orientacion: 0, // Enum Orientacion
        disposicion: 0, // Enum Disposicion
        // Servicios
        tieneAgua: false,
        tieneGasNatural: false,
        tieneGasEnvasado: false,
        tieneLuz: false,
        tieneInternet: false,
        tieneCloacas: false,
        tienePavimento: false,
        tieneCalefon: false,
        tieneAscensor: false,
        tieneTelefono: false,
        tieneSeguridad: false,
        tieneImpMunicipales: false,
        tieneImpProvinciales: false,
        // Comodidades / Ambientes
        tienePatio: false,
        tienePatioSeco: false,
        tieneBalcon: false,
        tieneCocina: false,
        tieneCocinaComedor: false,
        tieneLiving: false,
        tieneLivingComedor: false,
        tieneLavadero: false,
        tieneLavaderoSectorizado: false,
        tieneTerraza: false,
        tieneComedor: false,
        tieneFondo: false,
        tienePiscina: false,
        tieneToilette: false,
        tieneQuincho: false,
        imagenes: [] as any[]
    }); 
    {/* Subir las fotos en orden y que se puedan mover */}

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

    const handleOnDragEnd = async (result: any) => {
        if (!result.destination) return;

        const items = Array.from(form.imagenes || []);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        // 1. Actualizamos el estado local instantáneamente para que el usuario vea el cambio
        setForm({ ...form, imagenes: items });

        // 2. Enviamos el nuevo orden al backend (si es edición)
        if (esEdicion) {
            try {
                const idsOrdenados = items.map(img => img.id);
                await updateImagenesOrden(Number(id), idsOrdenados);
                toast.success("Orden de imágenes actualizado");
            } catch (error) {
                toast.error("No se pudo guardar el nuevo orden");
            }
        }
    };

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
                estado: Number(form.estado),
                orientacion: Number(form.orientacion),
                disposicion: Number(form.disposicion)
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

            toast.success("¡Propiedad guardada con éxito!");
            navigate("/admin/propiedades");
        } catch (error) {
            toast.error("Error al guardar");
        } finally {
            setLoading(false);
        }
    };

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

    const cardClass = "bg-white p-6 rounded-2xl shadow-sm border border-brand-light/20 mb-6";
    const sectionTitleClass = "text-lg font-display text-brand-dark mb-4 flex items-center gap-2 border-b border-brand-light/10 pb-2";
    const labelClass = "block text-[10px] font-bold text-brand-muted uppercase mb-1 tracking-widest";
    const inputClass = "w-full bg-gray-50 border border-brand-light/30 text-brand-dark text-sm rounded-lg focus:ring-brand-primary focus:border-brand-primary p-2.5 transition-all font-body";

    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-8 pb-32 font-body text-brand-dark">
            <SEO title={esEdicion ? "Editar Propiedad" : "Nueva Propiedad"} description="Administración de catálogo" />
            
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10 text-left">
                    <div>
                        <Link to="/admin/propiedades" className="flex items-center gap-2 text-brand-muted hover:text-brand-primary font-bold text-sm  tracking-widest transition-colors mb-2">
                            <ArrowLeft className="w-4 h-4" /> Volver al listado
                        </Link>
                        <h1 className="text-3xl font-display tracking-tight">{esEdicion ? "Editar Propiedad" : "Cargar Inmueble"}</h1>
                    </div>
                    <button onClick={handleSubmit} disabled={loading} className="bg-brand-dark text-white font-bold py-3 px-8 rounded-lg hover:bg-brand-primary transition shadow-xl flex items-center gap-2 text-xs tracking-widest uppercase disabled:opacity-50">
                        {loading ? <Loader2 className="animate-spin w-4 h-4" /> : <Save className="w-4 h-4" />}
                        {loading ? "GUARDANDO..." : "GUARDAR TODO"}
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-left">
                    <div className="lg:col-span-2 space-y-6">
                        
                        {/* Información General */}
                        <div className={cardClass}>
                            <h3 className={sectionTitleClass}><Home className="w-5 h-5 text-brand-primary" /> Información General</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className={labelClass}>Título de la publicación</label>
                                    <input name="titulo" value={form.titulo} onChange={handleChange} className={inputClass} placeholder="Ej: Departamento Céntrico Moderno" required />
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className={labelClass}>Moneda</label>
                                        <select name="moneda" value={form.moneda} onChange={handleChange} className={inputClass}>
                                            <option value="USD">USD</option>
                                            <option value="ARS">ARS</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className={labelClass}>Precio</label>
                                        <input type="number" name="precio" value={form.precio} onChange={handleChange} className={inputClass} />
                                    </div>
                                    <div>
                                        <label className={labelClass}>Expensas (ARS)</label>
                                        <input type="number" name="precioExpensas" value={form.precioExpensas} onChange={handleChange} className={inputClass} />
                                    </div>
                                </div>
                                <div>
                                    <label className={labelClass}>Descripción</label>
                                    <textarea name="descripcion" value={form.descripcion} onChange={handleChange} rows={5} className={`${inputClass} resize-none`} placeholder="Describe las bondades de la propiedad..." />
                                </div>
                            </div>
                        </div>

                        {/* Ubicación */}
                        <div className={cardClass}>
                            <h3 className={sectionTitleClass}><MapPin className="w-5 h-5 text-brand-primary" /> Ubicación</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className={labelClass}>Dirección</label>
                                    <input name="direccion" value={form.direccion} onChange={handleChange} className={inputClass} placeholder="Calle y Nro" />
                                </div>
                                <div>
                                    <label className={labelClass}>Barrio / Zona</label>
                                    <input name="barrio" value={form.barrio} onChange={handleChange} className={inputClass} placeholder="Ej: Centro" />
                                </div>
                                <div>
                                    <label className={labelClass}>Ciudad</label>
                                    <input name="ciudad" value={form.ciudad} onChange={handleChange} className={inputClass} placeholder="Ej: Paraná" />
                                </div>
                            </div>
                        </div>

                        {/* Ficha Técnica */}
                        <div className={cardClass}>
                            <h3 className={sectionTitleClass}><Info className="w-5 h-5 text-brand-primary" /> Ficha Técnica</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                <div>
                                    <label className={labelClass}>Estado del Inmueble</label>
                                    <select name="estado" value={form.estado} onChange={handleChange} className={inputClass}>
                                        <option value={0}>Excelente</option>
                                        <option value={1}>Muy Bueno</option>
                                        <option value={2}>Bueno</option>
                                        <option value={3}>Regular</option>
                                        <option value={4}>A Refaccionar</option>
                                    </select>
                                </div>
                                <div>
                                    <label className={labelClass}>Orientación</label>
                                    <select name="orientacion" value={form.orientacion} onChange={handleChange} className={inputClass}>
                                        <option value={0}>Norte</option>
                                        <option value={1}>Sur</option>
                                        <option value={2}>Este</option>
                                        <option value={3}>Oeste</option>
                                    </select>
                                </div>
                                <div>
                                    <label className={labelClass}>Disposición</label>
                                    <select name="disposicion" value={form.disposicion} onChange={handleChange} className={inputClass}>
                                        <option value={0}>Frente</option>
                                        <option value={1}>Contrafrente</option>
                                        <option value={2}>Lateral</option>
                                        <option value={3}>Interno</option>
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div>
                                    <label className={labelClass}>Ambientes</label>
                                    <input type="number" name="ambientes" value={form.ambientes} onChange={handleChange} className={inputClass} />
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
                                    <label className={labelClass}>Antigüedad (Años)</label>
                                    <input type="number" name="antiguedad" value={form.antiguedad} onChange={handleChange} className={inputClass} />
                                </div>
                            </div>
                        </div>

                        {/* Comodidades y Ambientes */}
                        <div className={cardClass}>
                            <h3 className={sectionTitleClass}><Layout className="w-5 h-5 text-brand-primary" /> Comodidades y Ambientes</h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {[
                                    {id: 'tienePatio', n: 'Patio'},
                                    {id: 'tienePatioSeco', n: 'Patio Seco'},
                                    {id: 'tieneBalcon', n: 'Balcón'},
                                    {id: 'tieneCocina', n: 'Cocina'},
                                    {id: 'tieneCocinaComedor', n: 'Cocina Comedor'},
                                    {id: 'tieneLiving', n: 'Living'},
                                    {id: 'tieneLivingComedor', n: 'Living Comedor'},
                                    {id: 'tieneLavadero', n: 'Lavadero'},
                                    {id: 'tieneLavaderoSectorizado', n: 'Lavadero Sectorizado'},
                                    {id: 'tieneTerraza', n: 'Terraza'},
                                    {id: 'tieneComedor', n: 'Comedor'},
                                    {id: 'tieneFondo', n: 'Fondo'},
                                    {id: 'tienePiscina', n: 'Piscina'},
                                    {id: 'tieneToilette', n: 'Toilette'},
                                    {id: 'tieneQuincho', n: 'Quincho'},
                                ].map(c => (
                                    <label key={c.id} className="flex items-center gap-3 p-2.5 bg-gray-50 rounded-lg cursor-pointer hover:bg-brand-light/10 transition border border-transparent hover:border-brand-light/20">
                                        <input type="checkbox" name={c.id} checked={(form as any)[c.id]} onChange={handleChange} className="w-4 h-4 text-brand-primary rounded border-brand-light" />
                                        <span className="text-sm font-bold uppercase tracking-wider text-brand-muted">{c.n}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Multimedia */}
                        <div className={cardClass}>
                            <h3 className={sectionTitleClass}><ImageIcon className="w-5 h-5 text-brand-primary" /> Galería de Fotos</h3>
                            <p className="text-[10px] text-brand-muted uppercase mb-6 tracking-widest italic">
                                Arrastrá las fotos existentes para cambiar su orden de aparición
                            </p>

                            <DragDropContext onDragEnd={handleOnDragEnd}>
                                <Droppable droppableId="galeria-fotos" direction="horizontal">
                                    {(provided) => (
                                        <div 
                                            {...provided.droppableProps} 
                                            ref={provided.innerRef} 
                                            className="grid grid-cols-3 md:grid-cols-5 gap-4"
                                        >
                                            {form.imagenes?.map((img, index) => (
                                                <Draggable key={img.id.toString()} draggableId={img.id.toString()} index={index}>
                                                    {(provided, snapshot) => (
                                                        <div 
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            className={`relative h-24 rounded-lg overflow-hidden group border transition-all ${
                                                                snapshot.isDragging ? "border-brand-primary shadow-2xl scale-105 z-50" : "border-brand-light/20 shadow-inner"
                                                            }`}
                                                        >
                                                            <img src={img.url} className="w-full h-full object-cover" alt={`Foto ${index}`} />
                                                            <div className="absolute top-1 left-1 bg-brand-dark/60 text-white text-[8px] px-1.5 py-0.5 rounded font-bold backdrop-blur-sm">
                                                                {index + 1}
                                                            </div>
                                                            <button 
                                                                type="button" 
                                                                onClick={() => handleBorrarFotoExistente(img.id)} 
                                                                className="absolute inset-0 bg-red-600/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity"
                                                            >
                                                                <Trash2 size={16} />
                                                            </button>
                                                        </div>
                                                    )}
                                                </Draggable>
                                            ))}
                                            {provided.placeholder}

                                            {/* Previsualización de fotos NUEVAS (Aún no tienen ID, no son draggables) */}
                                            {previews.map((p, i) => (
                                                <div key={`new-${i}`} className="relative h-24 rounded-lg overflow-hidden border-2 border-dashed border-brand-primary shadow-md">
                                                    <img src={p} className="w-full h-full object-cover opacity-70" alt="Nueva" />
                                                    <div className="absolute top-0 right-0 bg-brand-primary text-white text-[8px] px-1.5 py-0.5 font-bold uppercase">Subiendo</div>
                                                    <button type="button" onClick={() => removerFotoLocal(i)} className="absolute bottom-1 right-1 bg-white/90 p-1 rounded-md text-red-600 shadow-sm">
                                                        <X size={12}/>
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </Droppable>
                            </DragDropContext>

                            <div className="mt-8 border-2 border-dashed border-brand-light/40 rounded-xl p-8 text-center bg-gray-50 hover:bg-brand-light/5 transition relative">
                                <input type="file" multiple accept="image/*" onChange={handleSeleccionarFotos} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                                <Upload className="w-10 h-10 text-brand-muted mx-auto mb-2" />
                                <p className="text-xs font-bold uppercase tracking-widest text-brand-muted">Click o arrastrá archivos para añadir a la galería</p>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-1 space-y-6">
                        {/* Visibilidad */}
                        <div className={`${cardClass} border-l-4 border-l-brand-primary`}>
                            <h3 className={sectionTitleClass}><CheckCircle className="w-5 h-5 text-brand-primary" /> Visibilidad</h3>
                            <div className="space-y-4">
                                <select name="estadoOperacion" value={form.estadoOperacion} onChange={handleChange} className={inputClass}>
                                    <option value="Venta">Venta</option>
                                    <option value="Alquiler">Alquiler</option>
                                </select>
                                <select name="tipo" value={form.tipo} onChange={handleChange} className={inputClass}>
                                    <option value={TipoPropiedad.Casa}>Casa</option>
                                    <option value={TipoPropiedad.Departamento}>Departamento</option>
                                    <option value={TipoPropiedad.Terreno}>Terreno</option>
                                    <option value={TipoPropiedad.Local}>Local</option>
                                    <option value={TipoPropiedad.Oficina}>Oficina</option>
                                    <option value={TipoPropiedad.Ph}>PH</option>
                                    <option value={TipoPropiedad.Galpon}>Galpón</option>
                                    <option value={TipoPropiedad.Campo}>Campo</option>
                                    <option value={TipoPropiedad.Quinta}>Quinta</option>
                                </select>
                                <div className="space-y-3 pt-2">
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <input type="checkbox" name="activa" checked={form.activa} onChange={handleChange} className="w-5 h-5 rounded border-brand-light text-brand-primary focus:ring-brand-primary" />
                                        <span className="text-xs font-bold uppercase tracking-widest text-brand-muted group-hover:text-brand-dark transition-colors">Activa</span>
                                    </label>
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <input type="checkbox" name="esDestacada" checked={form.esDestacada} onChange={handleChange} className="w-5 h-5 rounded border-brand-light text-brand-secondary focus:ring-brand-secondary" />
                                        <span className="text-xs font-bold uppercase tracking-widest text-brand-secondary font-bold">Destacada</span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Superficies */}
                        <div className={cardClass}>
                            <h3 className={sectionTitleClass}><Ruler className="w-5 h-5 text-brand-primary" /> Superficies</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className={labelClass}>Sup. Total (m²)</label>
                                    <input type="number" name="superficieTotal" value={form.superficieTotal} onChange={handleChange} className={inputClass} />
                                </div>
                                <div>
                                    <label className={labelClass}>Sup. Cubierta (m²)</label>
                                    <input type="number" name="superficieCubierta" value={form.superficieCubierta} onChange={handleChange} className={inputClass} />
                                </div>
                                <div>
                                    <label className={labelClass}>Cocheras</label>
                                    <input type="number" name="cocheras" value={form.cocheras} onChange={handleChange} className={inputClass} />
                                </div>
                            </div>
                        </div>

                        {/* Servicios */}
                        <div className={cardClass}>
                            <h3 className={sectionTitleClass}><Zap className="w-5 h-5 text-brand-primary" /> Servicios</h3>
                            <div className="grid grid-cols-1 gap-2">
                                {[
                                    {id: 'tieneAgua', n: 'Agua Corriente'},
                                    {id: 'tieneGasNatural', n: 'Gas Natural'},
                                    {id: 'tieneGasEnvasado', n: 'Gas Envasado'},
                                    {id: 'tieneLuz', n: 'Luz Eléctrica'},
                                    {id: 'tieneInternet', n: 'Wi-Fi / Fibra'},
                                    {id: 'tieneCloacas', n: 'Cloacas'},
                                    {id: 'tienePavimento', n: 'Pavimento'},
                                    {id: 'tieneCalefon', n: 'Calefón'},
                                    {id: 'tieneAscensor', n: 'Ascensor'},
                                    {id: 'tieneTelefono', n: 'Teléfono'},
                                    {id: 'tieneSeguridad', n: 'Seguridad'},
                                    {id: 'tieneImpMunicipales', n: 'Imp. Municipales'},
                                    {id: 'tieneImpProvinciales', n: 'Imp. Provinciales'},
                                ].map(s => (
                                    <label key={s.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition">
                                        <input type="checkbox" name={s.id} checked={(form as any)[s.id]} onChange={handleChange} className="w-4 h-4 text-brand-primary rounded border-brand-light focus:ring-brand-primary" />
                                        <span className="text-sm font-bold uppercase tracking-wider text-brand-muted">{s.n}</span>
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
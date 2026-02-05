import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPropiedadById, enviarMensaje } from '../services/api';
import { type Propiedad } from '../types/propiedad';
import { 
    MapPin, ArrowLeft, Camera, X, User, Phone, 
    Mail, Send, Loader2, Ruler, Zap, Droplets, Flame, 
    Wifi, ShieldCheck, Info, Layout, Check, Compass, Navigation
} from 'lucide-react'; 
import { Swiper, SwiperSlide } from 'swiper/react';
import { SEO } from '../components/SEO';

import { Navigation as SwiperNav, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import toast from 'react-hot-toast';

// Helpers para Enums (Asegúrate de que coincidan con el orden de tu C#)
const getEstadoLabel = (e: number) => ["Excelente", "Muy Bueno", "Bueno", "Regular", "A Refaccionar"][e] || "Consultar";
const getOrientacionLabel = (o: number) => ["Norte", "Sur", "Este", "Oeste", "Noreste", "Noroeste", "Sudeste", "Sudoeste"][o] || "S/D";
const getDisposicionLabel = (d: number) => ["Frente", "Contrafrente", "Lateral", "Interno"][d] || "S/D";

export const PropiedadDetalle = () => {
    const { id } = useParams();
    const [propiedad, setPropiedad] = useState<Propiedad | null>(null);
    const [fotoActual, setFotoActual] = useState(1); 
    const [zoomImage, setZoomImage] = useState<string | null>(null);
    const [form, setForm] = useState({ nombre: "", telefono: "", email: "", mensaje: "" });
    const [enviando, setEnviando] = useState(false);

    useEffect(() => {
        if (id) getPropiedadById(Number(id)).then(setPropiedad);
    }, [id]);

    if (!propiedad) return <div className="pt-32 text-center font-body text-brand-muted uppercase tracking-widest animate-pulse">Cargando detalles...</div>;

    const totalFotos = propiedad.imagenes?.length || 1;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        
        const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
        
        setForm(prev => ({
            ...prev,
            [name]: val
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setEnviando(true);
        const textoWsp = `CONSULTA POR PROPIEDAD: ${propiedad.titulo}\nLink: ${window.location.href}\nNombre: ${form.nombre}\nTel: ${form.telefono}\nMensaje: ${form.mensaje}`;
        try {
            await enviarMensaje({ ...form, contenido: textoWsp, email: form.email || "consulta@web.com" });
            window.open(`https://wa.me/5493434676232?text=${encodeURIComponent(textoWsp)}`, '_blank');
            toast.success("¡Consulta enviada!");
            setForm({ nombre: "", telefono: "", email: "", mensaje: "" }); 
        } catch (error) { toast.error("Error al enviar."); } 
        finally { setEnviando(false); }
    };

    const inputClass = "w-full bg-white border border-brand-light/40 rounded-lg p-3 pl-10 outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/20 transition text-brand-dark font-body text-sm";

    return (
        <div className="min-h-screen bg-white pb-20 pt-24 font-body text-left">
            {zoomImage && (
                <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4" onClick={() => setZoomImage(null)}>
                    <button className="absolute top-6 right-6 text-white"><X size={40}/></button>
                    <img src={zoomImage} className="max-w-full max-h-full object-contain" alt="Zoom" />
                </div>
            )}

            <SEO title={propiedad.titulo} description={propiedad.descripcion} image={propiedad.imagenes?.[0]?.url} />

            <div className="container mx-auto px-6 md:px-12 lg:px-24 mb-6">
                <Link to={propiedad.estadoOperacion === 'Alquiler' ? '/alquileres' : '/ventas'} className="inline-flex items-center gap-2 text-brand-primary font-bold text-[10px] uppercase tracking-widest hover:text-brand-dark transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Volver al listado
                </Link>
            </div>

            <div className="container mx-auto px-6 md:px-12 lg:px-24">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    
                    {/* INFO IZQUIERDA */}
                    <div className="order-2 lg:order-1 space-y-12">
                        <div>
                            <div className="flex gap-2 mb-4">
                                <span className="bg-brand-primary text-white px-3 py-1 rounded text-[10px] font-bold uppercase tracking-widest">{propiedad.estadoOperacion}</span>
                                {propiedad.esDestacada && <span className="bg-brand-secondary/20 text-brand-secondary px-3 py-1 rounded text-[10px] font-bold uppercase tracking-widest border border-brand-secondary/20">Destacada</span>}
                            </div>
                            <h1 className="font-display text-4xl md:text-5xl text-brand-dark leading-tight uppercase tracking-tighter mb-4">{propiedad.titulo}</h1>
                            <p className="text-brand-muted text-lg flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-brand-primary" /> {propiedad.direccion}, {propiedad.barrio && `${propiedad.barrio},`} {propiedad.ciudad}
                            </p>
                            <div className="mt-6 flex items-baseline gap-2 text-brand-primary">
                                <span className="text-5xl font-display font-bold">{propiedad.moneda} {propiedad.precio.toLocaleString()}</span>
                                {propiedad.precioExpensas > 0 && <span className="text-brand-muted text-sm ml-4">+ ${propiedad.precioExpensas.toLocaleString()} expensas</span>}
                            </div>
                        </div>

                        {/* Ficha Técnica Rápida */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 border-y border-brand-light/20 py-8">
                            <div className="text-center">
                                <p className="font-display text-2xl text-brand-dark">{propiedad.superficieTotal}m²</p>
                                <span className="text-[9px] text-brand-muted uppercase font-bold tracking-widest">Total</span>
                            </div>
                            <div className="text-center border-l border-brand-light/20">
                                <p className="font-display text-2xl text-brand-dark">{propiedad.superficieCubierta}m²</p>
                                <span className="text-[9px] text-brand-muted uppercase font-bold tracking-widest">Cubierta</span>
                            </div>
                            <div className="text-center border-l border-brand-light/20">
                                <p className="font-display text-2xl text-brand-dark">{propiedad.dormitorios}</p>
                                <span className="text-[9px] text-brand-muted uppercase font-bold tracking-widest">Dormitorios</span>
                            </div>
                            <div className="text-center border-l border-brand-light/20">
                                <p className="font-display text-2xl text-brand-dark">{propiedad.baños}</p>
                                <span className="text-[9px] text-brand-muted uppercase font-bold tracking-widest">Baños</span>
                            </div>
                        </div>

                        {/* Descripción */}
                        <div>
                            <h3 className="font-display text-xl text-brand-dark mb-4 uppercase tracking-widest flex items-center gap-2">
                                <Info size={18} className="text-brand-primary"/> Descripción
                            </h3>
                            <p className="text-brand-muted leading-relaxed whitespace-pre-line font-body text-lg italic border-l-4 border-brand-light/20 pl-6">
                                {propiedad.descripcion}
                            </p>
                        </div>

                        {/* Grilla Detallada: Estado, Orientación, Disposición */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-gray-50 p-6 rounded-2xl border border-brand-light/10">
                            <div className="flex flex-col gap-1">
                                <span className="text-[9px] font-bold text-brand-muted uppercase tracking-widest">Estado</span>
                                <p className="font-bold text-brand-dark text-sm uppercase">{getEstadoLabel(propiedad.estado as any)}</p>
                            </div>
                            <div className="flex flex-col gap-1 border-l-0 md:border-l border-brand-light/30 md:pl-6">
                                <span className="text-[9px] font-bold text-brand-muted uppercase tracking-widest">Orientación</span>
                                <p className="font-bold text-brand-dark text-sm uppercase flex items-center gap-2"><Compass size={14} className="text-brand-primary"/> {getOrientacionLabel(propiedad.orientacion as any)}</p>
                            </div>
                            <div className="flex flex-col gap-1 border-l-0 md:border-l border-brand-light/30 md:pl-6">
                                <span className="text-[9px] font-bold text-brand-muted uppercase tracking-widest">Disposición</span>
                                <p className="font-bold text-brand-dark text-sm uppercase flex items-center gap-2"><Navigation size={14} className="text-brand-primary" /> {getDisposicionLabel(propiedad.disposicion as any)}</p>
                            </div>
                        </div>

                        {/* Ambientes / Comodidades */}
                        <div>
                            <h3 className="font-display text-xl text-brand-dark mb-6 uppercase tracking-widest flex items-center gap-2">
                                <Layout size={18} className="text-brand-primary"/> Ambientes y Comodidades
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {[
                                    { val: propiedad.tieneCocina, label: 'Cocina' },
                                    { val: propiedad.tieneCocinaComedor, label: 'Cocina Comedor' },
                                    { val: propiedad.tieneLiving, label: 'Living' },
                                    { val: propiedad.tieneLivingComedor, label: 'Living Comedor' },
                                    { val: propiedad.tieneBalcon, label: 'Balcón' },
                                    { val: propiedad.tienePatio, label: 'Patio' },
                                    { val: propiedad.tienePatioSeco, label: 'Patio Seco' },
                                    { val: propiedad.tieneLavadero, label: 'Lavadero' },
                                    { val: propiedad.tieneLavaderoSectorizado, label: 'Lavadero Sec.' },
                                ].map((item, idx) => item.val && (
                                    <div key={idx} className="flex items-center gap-2 text-brand-muted">
                                        <Check size={14} className="text-brand-primary" />
                                        <span className="text-xs font-bold uppercase tracking-tight">{item.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Servicios */}
                        <div className="bg-gray-50/50 p-8 rounded-3xl border border-brand-light/10">
                            <h3 className="font-display text-xl text-brand-dark mb-6 uppercase tracking-widest flex items-center gap-2">
                                <Zap size={18} className="text-brand-primary"/> Servicios
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                {[
                                    { val: propiedad.tieneLuz, label: 'Electricidad', icon: Zap },
                                    { val: propiedad.tieneAgua, label: 'Agua Corriente', icon: Droplets },
                                    { val: propiedad.tieneGasNatural, label: 'Gas Natural', icon: Flame },
                                    { val: propiedad.tieneGasEnvasado, label: 'Gas Envasado', icon: Flame },
                                    { val: propiedad.tieneInternet, label: 'Wi-Fi', icon: Wifi },
                                    { val: propiedad.tieneCloacas, label: 'Cloacas', icon: ShieldCheck },
                                    { val: propiedad.tienePavimento, label: 'Pavimento', icon: Ruler },
                                    { val: propiedad.tieneAscensor, label: 'Ascensor', icon: ArrowLeft },
                                    { val: propiedad.tieneSeguridad, label: 'Seguridad', icon: ShieldCheck },
                                ].map((item, idx) => item.val && (
                                    <div key={idx} className="flex items-center gap-3 text-brand-dark">
                                        <div className="bg-white p-2 rounded-lg shadow-sm border border-brand-light/20 text-brand-primary">
                                            <item.icon size={16} />
                                        </div>
                                        <span className="text-[10px] font-bold uppercase tracking-widest">{item.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Formulario de Contacto (Style Wealth) */}
                        <div className="bg-brand-dark p-8 md:p-12 rounded-[2.5rem] shadow-2xl">
                            <h3 className="font-display text-3xl text-white mb-8 text-center uppercase tracking-tighter">Consultar disponibilidad</h3>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="relative">
                                        <User className="absolute left-3 top-3.5 text-brand-primary w-4 h-4" />
                                        <input required name="nombre" placeholder="Nombre completo" value={form.nombre} onChange={handleChange} className={inputClass} />
                                    </div>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-3.5 text-brand-primary w-4 h-4" />
                                        <input required name="telefono" placeholder="Número de contacto" value={form.telefono} onChange={handleChange} className={inputClass} />
                                    </div>
                                </div>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3.5 text-brand-primary w-4 h-4" />
                                    <input name="email" type="email" placeholder="Correo electrónico" value={form.email} onChange={handleChange} className={inputClass} />
                                </div>
                                <textarea required name="mensaje" rows={4} placeholder="Estoy interesado en esta propiedad..." value={form.mensaje} onChange={handleChange} className="w-full p-4 rounded-xl border-none outline-none focus:ring-2 focus:ring-brand-primary transition text-brand-dark resize-none font-body text-sm"></textarea>
                                <button disabled={enviando} className="w-full bg-brand-primary text-white font-bold py-5 rounded-xl hover:brightness-110 transition shadow-lg flex items-center justify-center gap-3 uppercase tracking-[0.3em] text-[10px]">
                                    {enviando ? <Loader2 className="animate-spin" /> : <Send className="w-4 h-4" />}
                                    Enviar solicitud
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* GALERÍA DERECHA (STICKY & HEIGHT ADJUSTED) */}
                    <div className="order-1 lg:order-2 lg:sticky lg:top-28">
                        <div className="w-full h-80 md:h-[500px] lg:h-[75vh] max-h-[700px] bg-gray-100 rounded-[2.5rem] overflow-hidden relative group shadow-2xl border-4 border-white cursor-zoom-in">
                            <div className="absolute top-6 left-6 bg-brand-dark/80 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-[10px] font-bold z-20 flex items-center gap-2 shadow-xl">
                                <Camera className="w-3.5 h-3.5 text-brand-light" /> {fotoActual} / {totalFotos}
                            </div>
                            <Swiper
                                modules={[SwiperNav, Pagination]}
                                navigation
                                pagination={{ clickable: true, dynamicBullets: true }}
                                onSlideChange={(s) => setFotoActual(s.realIndex + 1)}
                                loop={totalFotos > 1}
                                className="h-full w-full"
                            >
                                {propiedad.imagenes?.map((img, i) => (
                                    <SwiperSlide key={i} onClick={() => setZoomImage(img.url)}>
                                        <img src={img.url} className="w-full h-full object-cover transition-transform duration-1000 hover:scale-105" alt={propiedad.titulo} loading="lazy" />
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPropiedadById, enviarMensaje } from '../services/api';
import { type Propiedad } from '../types/propiedad';
import { 
    MapPin, ArrowLeft, Camera, Copy, X, User, Phone, 
    Mail, Send, Loader2, Ruler, Zap, Droplets, Flame, Wifi, ShieldCheck, 
    Compass, Navigation2, Check, ArrowUpCircle
} from 'lucide-react'; 
import { FaWhatsapp } from 'react-icons/fa';
import { Swiper, SwiperSlide } from 'swiper/react';
import { SEO } from '../components/SEO';

import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import toast from 'react-hot-toast';

const getEstadoLabel = (e: number) => ["Excelente", "Muy Bueno", "Bueno", "Regular", "A Refaccionar"][e] || "Consultar";
const getOrientacionLabel = (o: number) => ["Norte", "Sur", "Este", "Oeste", "Noreste", "Noroeste", "Sudeste", "Sudoeste"][o] || "S/D";
const getDisposicionLabel = (d: number) => ["Frente", "Contrafrente", "Lateral", "Interno"][d] || "S/D";

export const PropiedadDetalle = () => {
    const { id } = useParams();
    const [propiedad, setPropiedad] = useState<Propiedad | null>(null);
    const [_loading, setLoading] = useState(true);
    const [fotoActual, setFotoActual] = useState(1); 
    const [zoomImage, setZoomImage] = useState<string | null>(null);
    const [form, setForm] = useState({ nombre: "", telefono: "", email: "", mensaje: "" });
    const [enviando, setEnviando] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    useEffect(() => {
        if (id) getPropiedadById(Number(id)).then(setPropiedad).finally(() => setLoading(false));
    }, [id]);

    if (!propiedad) return <div className="pt-32 text-center font-body text-brand-muted uppercase tracking-widest animate-pulse">Cargando detalles...</div>;

    const totalFotos = propiedad.imagenes?.length || 1;
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setEnviando(true);
        const textoWsp = `CONSULTA POR PROPIEDAD: ${propiedad.titulo}\n\nLink: ${window.location.href}\nNombre: ${form.nombre}\nTel: ${form.telefono}\n\n${form.mensaje}`;

        try {
            await enviarMensaje({
                nombre: form.nombre,
                telefono: form.telefono,
                email: form.email || "consulta@web.com",
                contenido: textoWsp
            });
            const numWsp = "5493434160058"; 
            window.open(`https://wa.me/${numWsp}?text=${encodeURIComponent(textoWsp)}`, '_blank');
            toast.success("¡Consulta enviada!");
            setForm({ nombre: "", telefono: "", email: "", mensaje: "" }); 
        } catch (error) {
            toast.error("Error al enviar.");
        } finally { setEnviando(false); }
    };
    
    const copiarLink = () => {
        navigator.clipboard.writeText(window.location.href);
        toast.success("Link copiado!");
    };

    const compartirWsp = () => {
        const text = `Mirá esta propiedad: ${window.location.href}`;
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    };

    const inputClass = "w-full bg-white border border-brand-light/40 rounded-lg p-3 pl-10 outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/20 transition text-brand-dark font-body";

    return (
        <div className="min-h-screen bg-white pb-20 pt-24 font-body">
            {/* Modal Zoom */}
            {zoomImage && (
                <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 cursor-zoom-out" onClick={() => setZoomImage(null)}>
                    <button className="absolute top-6 right-6 text-white hover:text-brand-light transition"><X size={40}/></button>
                    <img src={zoomImage} className="max-w-full max-h-full object-contain shadow-2xl" alt="Zoom" />
                </div>
            )}

             <SEO
                title={propiedad.titulo}
                description={`Oportunidad en ${propiedad.estadoOperacion}: ${propiedad.tipo} en ${propiedad.direccion}. ${propiedad.ambientes} ambientes. Precio: ${propiedad.moneda} ${propiedad.precio}.`}
                image={propiedad.imagenes?.[0]?.url || undefined}
                keywords={`${propiedad.tipo}, ${propiedad.estadoOperacion}, ${propiedad.ciudad}, inmobiliaria bottazzi`}
            />

            {/* Breadcrumb / Back */}
            <div className="container mx-auto px-8 md:px-16 lg:px-32 mb-6 text-xs uppercase font-bold tracking-widest">
                <Link to={propiedad.estadoOperacion === 'Alquiler' ? '/alquileres' : '/ventas'} className="flex items-center gap-2 text-brand-primary hover:text-brand-secondary transition">
                    <ArrowLeft className="w-4 h-4" /> Volver al listado
                </Link>
            </div>

            <div className="container mx-auto px-8 md:px-16 lg:px-32">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                    
                    {/* Columna Izquierda: Info */}
                    <div className="order-2 lg:order-1 space-y-10">
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <span className="bg-brand-primary text-white px-3 py-1 rounded text-sm font-bold uppercase tracking-widest shadow-sm">
                                    {propiedad.estadoOperacion}
                                </span>
                                {propiedad.esDestacada && (
                                    <span className="bg-brand-secondary/20 text-brand-secondary px-3 py-1 rounded text-sm font-bold uppercase tracking-widest border border-brand-secondary/30">
                                        Destacada
                                    </span>
                                )}
                            </div>
                            <h1 className="font-display text-4xl md:text-4xl text-brand-dark leading-tight uppercase tracking-tighter">{propiedad.titulo}</h1>
                            <p className="text-brand-muted text-lg flex items-center gap-2 mt-4">
                                <MapPin className="w-5 h-5 text-brand-primary" /> {propiedad.direccion}, {propiedad.barrio && `${propiedad.barrio},`} {propiedad.ciudad}
                            </p>
                            <div className="mt-8 flex items-baseline gap-2 text-brand-primary">
                                <span className="text-2xl font-body font-light">{propiedad.moneda}</span>
                                <span className="text-5xl font-body font-bold tracking-tight">{propiedad.precio > 0 ? `${propiedad.precio.toLocaleString()}` : "Consultar"}</span>
                                {propiedad.precioExpensas > 0 && <span className="text-brand-muted text-sm ml-4 font-body">+ ${propiedad.precioExpensas.toLocaleString()} expensas</span>}
                            </div>
                        </div>

                        {/* Grilla Técnica Principal */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 border-y border-brand-light/20 py-8">
                            <div className="text-center group">
                                <p className="font-body text-2xl text-brand-dark group-hover:text-brand-primary transition-colors">{propiedad.superficieTotal}m²</p>
                                <span className="text-sm text-brand-muted uppercase font-bold tracking-[0.2em]">Sup. Total</span>
                            </div>
                            <div className="text-center border-l border-brand-light/20 group">
                                <p className="font-body text-2xl text-brand-dark group-hover:text-brand-primary transition-colors">{propiedad.superficieCubierta}m²</p>
                                <span className="text-sm text-brand-muted uppercase font-bold tracking-[0.2em]">Sup. Cubierta</span>
                            </div>
                            <div className="text-center border-l border-brand-light/20 group">
                                <p className="font-body text-2xl text-brand-dark group-hover:text-brand-primary transition-colors">{propiedad.dormitorios}</p>
                                <span className="text-sm text-brand-muted uppercase font-bold tracking-[0.2em]">Dormitorios</span>
                            </div>
                            <div className="text-center border-l border-brand-light/20 group">
                                <p className="font-body text-2xl text-brand-dark group-hover:text-brand-primary transition-colors">{propiedad.baños}</p>
                                <span className="text-sm text-brand-muted uppercase font-bold tracking-[0.2em]">Baños</span>
                            </div>
                        </div>

                        {/* Descripción */}
                        <div className="bg-gray-50 p-8 rounded-3xl border border-brand-light/20 shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)]">
                            <h3 className="font-body text-2xl text-brand-dark mb-4 uppercase tracking-wider italic">Descripción</h3>
                            <p className="text-brand-muted leading-relaxed whitespace-pre-line font-body text-lg border-l-2 border-brand-light/30 pl-6 italic">
                                {propiedad.descripcion}
                            </p>
                        </div>

                        {/* Detalles Técnicos */}
                        <div className="bg-gray-50 p-8 rounded-3xl border border-brand-light/20 shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)]">
                            <h3 className="font-body text-2xl text-brand-dark mb-6 uppercase tracking-wider italic">Detalles</h3>
                            
                            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-y-8 gap-x-4">
                                <div className="text-center group">
                                    <p className="font-body text-2xl text-brand-dark group-hover:text-brand-primary transition-colors">{propiedad.cocheras}</p>
                                    <span className="text-sm text-brand-muted uppercase font-bold tracking-[0.2em]">Cocheras</span>
                                </div>
                                <div className="text-center md:border-x border-brand-light/20 group">
                                    <p className="font-body text-2xl text-brand-dark group-hover:text-brand-primary transition-colors">{propiedad.antiguedad === 0 ? "A Estrenar" : `${propiedad.antiguedad} años`}</p>
                                    <span className="text-sm text-brand-muted uppercase font-bold tracking-[0.2em]">Antigüedad</span>
                                </div>
                                <div className="text-center group">
                                    <p className="font-body text-2xl text-brand-dark group-hover:text-brand-primary transition-colors">{propiedad.ambientes}</p>
                                    <span className="text-sm text-brand-muted uppercase font-bold tracking-[0.2em]">Ambientes</span>
                                </div>

                                <div className="text-center flex flex-col items-center justify-center gap-1 group">
                                    <p className="font-bold text-brand-dark text-sm uppercase group-hover:text-brand-primary transition-colors">
                                        {propiedad.estado !== null && propiedad.estado !== undefined 
                                            ? getEstadoLabel(propiedad.estado as any) 
                                            : "S/D"}
                                    </p>
                                    <span className="text-sm font-bold text-brand-muted uppercase tracking-[0.2em]">Estado</span>
                                </div>

                                <div className="text-center md:border-x border-brand-light/20 flex flex-col items-center justify-center gap-1 group">
                                    <p className="font-bold text-brand-dark text-sm uppercase flex items-center gap-2 group-hover:text-brand-primary transition-colors">
                                        <Compass size={14} className="text-brand-primary"/> 
                                        {propiedad.orientacion !== null && propiedad.orientacion !== undefined 
                                            ? getOrientacionLabel(propiedad.orientacion as any) 
                                            : "S/D"}
                                    </p>
                                    <span className="text-sm font-bold text-brand-muted uppercase tracking-[0.2em]">Orientación</span>
                                </div>

                                <div className="text-center flex flex-col items-center justify-center gap-1 group">
                                    <p className="font-bold text-brand-dark text-sm uppercase flex items-center gap-2 group-hover:text-brand-primary transition-colors">
                                        <Navigation2 size={14} className="text-brand-primary" /> 
                                        {propiedad.disposicion !== null && propiedad.disposicion !== undefined 
                                            ? getDisposicionLabel(propiedad.disposicion as any) 
                                            : "S/D"}
                                    </p>
                                    <span className="text-sm font-bold text-brand-muted uppercase tracking-[0.2em]">Disposición</span>
                                </div>
                            </div>
                        </div>

                        {/* Ambientes / Comodidades */}
                        <div className="bg-gray-50 p-8 rounded-3xl border border-brand-light/20 shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)]">
                            <h3 className="font-display text-2xl text-brand-dark mb-6 uppercase tracking-wider italic flex items-center gap-2">Ambientes</h3>
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
                                    <div key={idx} className="flex items-center gap-3 text-brand-dark group">
                                        <Check size={18} className="text-brand-primary group-hover:scale-110 transition-transform" />
                                        <span className="text-sm font-bold uppercase tracking-[0.2em] text-brand-muted group-hover:text-brand-dark transition-colors">{item.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Servicios */}
                        <div className="bg-gray-50 p-8 rounded-3xl border border-brand-light/20 shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)]">
                            <h3 className="font-display text-2xl text-brand-dark mb-6 uppercase tracking-wider italic flex items-center gap-2">
                                <Zap size={20} className="text-brand-primary"/> Servicios
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
                                    { val: propiedad.tieneAscensor, label: 'Ascensor', icon: ArrowUpCircle },
                                    { val: propiedad.tieneSeguridad, label: 'Seguridad', icon: ShieldCheck },
                                ].map((item, idx) => item.val && (
                                    <div key={idx} className="flex items-center gap-3 text-brand-dark group">
                                        <div className="bg-white p-2 rounded-lg shadow-sm border border-brand-light/20 text-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-all duration-300">
                                            <item.icon size={18} />
                                        </div>
                                        <span className="text-sm font-bold uppercase tracking-[0.2em] text-brand-muted group-hover:text-brand-dark transition-colors">{item.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Formulario de Contacto */}
                        <div className="bg-gray-50 p-8 rounded-3xl border border-brand-light/20 shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)]">
                            <h3 className="font-display text-xl text-brand-dark mb-6 text-center italic">Me interesa esta propiedad</h3>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="relative">
                                        <User className="absolute left-3 top-3.5 text-brand-primary w-5 h-5" />
                                        <input required name="nombre" type="text" placeholder="Nombre" value={form.nombre} onChange={handleChange} className={inputClass} />
                                    </div>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-3.5 text-brand-primary w-5 h-5" />
                                        <input required name="telefono" type="tel" placeholder="Teléfono" value={form.telefono} onChange={handleChange} className={inputClass} />
                                    </div>
                                </div>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3.5 text-brand-primary w-5 h-5" />
                                    <input name="email" type="email" placeholder="Email (Opcional)" value={form.email} onChange={handleChange} className={inputClass} />
                                </div>
                                <textarea required name="mensaje" rows={3} placeholder="Escribí tu consulta..." value={form.mensaje} onChange={handleChange} className="w-full p-4 rounded-lg border border-brand-light/40 outline-none focus:ring-1 focus:ring-brand-primary/20 transition text-brand-dark resize-none"></textarea>
                                <button disabled={enviando} className="w-full bg-brand-dark text-white font-bold py-4 rounded-xl hover:bg-brand-primary transition shadow-lg flex items-center justify-center gap-2 uppercase tracking-widest text-lg">
                                    {enviando ? <Loader2 className="animate-spin" /> : <Send className="w-4 h-4" />}
                                    {enviando ? "ENVIANDO..." : "ENVIAR CONSULTA"}
                                </button>
                            </form>
                        </div>

                        <div className="flex gap-4">
                            <button onClick={copiarLink} className="flex-1 border border-brand-light/40 py-4 rounded-xl font-bold text-brand-muted hover:bg-brand-light/10 transition flex justify-center gap-3 items-center text-[10px] uppercase tracking-widest">
                                <Copy className="w-4 h-4" /> Copiar Link
                            </button>
                            <button onClick={compartirWsp} className="flex-1 border border-brand-light/40 py-4 rounded-xl font-bold text-brand-muted hover:text-green-600 hover:border-green-600 transition flex justify-center gap-3 items-center text-[10px] uppercase tracking-widest">
                                <FaWhatsapp className="w-5 h-5" /> Compartir
                            </button>
                        </div>
                    </div>

                    {/* Columna Derecha: Galería */}
                    <div className="order-1 lg:order-2 lg:sticky lg:top-28">
                        <div className="w-full h-80 md:h-[500px] lg:h-[80vh] max-h-[750px] bg-gray-100 rounded-[2rem] overflow-hidden relative group shadow-2xl border-4 border-white cursor-zoom-in">
                            <div className="absolute top-6 left-6 bg-brand-dark/80 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-[10px] font-bold z-20 flex items-center gap-2 shadow-xl">
                                <Camera className="w-3.5 h-3.5 text-brand-light" /> {fotoActual} / {totalFotos}
                            </div>
                            
                            <Swiper
                                modules={[Navigation, Pagination]}
                                navigation
                                pagination={{ clickable: true, dynamicBullets: true }}
                                onSlideChange={(swiper) => setFotoActual(swiper.realIndex + 1)}
                                loop={totalFotos > 1}
                                className="h-full w-full"
                            >
                                {propiedad.imagenes?.length ? propiedad.imagenes.map((img, i) => (
                                    <SwiperSlide key={i} onClick={() => setZoomImage(img.url)}>
                                        <img src={img.url} className="w-full h-full object-cover transition-transform duration-1000 hover:scale-105" alt={propiedad.titulo} loading="lazy"/>
                                    </SwiperSlide>
                                )) : (
                                    <SwiperSlide><img src="https://placehold.co/800x1200?text=Consultar+Fotos" className="w-full h-full object-cover" alt="S/D" /></SwiperSlide>
                                )}
                            </Swiper>
                        </div>
                        <p className="text-[9px] text-brand-muted uppercase font-bold tracking-[0.3em] text-center mt-4 hidden lg:block opacity-50 italic">
                            Click en la imagen para ampliar
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
};
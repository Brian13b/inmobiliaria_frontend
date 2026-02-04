import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPropiedadById, enviarMensaje } from '../services/api';
import { type Propiedad } from '../types/propiedad';
import { MapPin, ArrowLeft, Camera, Copy, X, User, Phone, Mail, Send, Loader2 } from 'lucide-react'; 
import { FaWhatsapp } from 'react-icons/fa';
import { Swiper, SwiperSlide } from 'swiper/react';
import { SEO } from '../components/SEO';

import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import toast from 'react-hot-toast';

export const PropiedadDetalle = () => {
    const { id } = useParams();
    const [propiedad, setPropiedad] = useState<Propiedad | null>(null);
    const [_loading, setLoading] = useState(true);
    const [fotoActual, setFotoActual] = useState(1); 
    const [zoomImage, setZoomImage] = useState<string | null>(null);
    const [form, setForm] = useState({
        nombre: "",
        telefono: "",
        email: "",
        mensaje: ""
    });
    const [enviando, setEnviando] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    useEffect(() => {
        if (id) getPropiedadById(Number(id)).then(setPropiedad).finally(() => setLoading(false));
    }, [id]);

    if (!propiedad) return <div className="pt-32 text-center font-body text-brand-muted uppercase tracking-widest">Cargando...</div>;

    const totalFotos = propiedad.imagenes?.length || 1;
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setEnviando(true);

        const textoWsp = `CONSULTA POR PROPIEDAD: ${propiedad.titulo}\nLink: ${window.location.href}\nNombre: ${form.nombre}\nTel: ${form.telefono}\nMensaje: ${form.mensaje}`;

        try {
            await enviarMensaje({
                nombre: form.nombre,
                telefono: form.telefono,
                email: form.email || "consulta@web.com",
                contenido: textoWsp
            });

            const numWsp = "5493434676232"; 
            window.open(`https://wa.me/${numWsp}?text=${encodeURIComponent(textoWsp)}`, '_blank');

            toast.success("¡Mensaje enviado con éxito!");
            setForm({ nombre: "", telefono: "", email: "", mensaje: "" }); 
        } catch (error) {
            toast.error("Ocurrió un error al enviar el mensaje.");
            console.error(error);
        } finally {
            setEnviando(false);
        }
    };
    
    const copiarLink = () => {
        navigator.clipboard.writeText(window.location.href);
        toast.success("Link copiado!");
    };
    const compartirWsp = () => {
        const text = `Mirá esta propiedad: ${window.location.href}`;
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    };

    const structuredData = {
        "@context": "https://schema.org/",
        "@type": "Product",
        "name": propiedad.titulo,
        "image": propiedad.imagenes?.[0]?.url || propiedad.imagenDestacada,
        "description": propiedad.descripcion,
        "brand": {
            "@type": "Brand",
            "name": "Inmobiliaria Battauz"
        },
        "offers": {
            "@type": "Offer",
            "url": window.location.href,
            "priceCurrency": propiedad.moneda,
            "price": propiedad.precio,
            "availability": "https://schema.org/InStock",
            "itemCondition": "https://schema.org/NewCondition"
        }
    };

    const inputClass = "w-full bg-white border border-brand-light/40 rounded-lg p-3 pl-10 outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/20 transition text-brand-dark font-body";

    return (
        <div className="min-h-screen bg-white pb-20 pt-24 font-body">
            {/* Modal de Zoom de Imagen */}
            {zoomImage && (
                <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4" onClick={() => setZoomImage(null)}>
                    <button className="absolute top-6 right-6 text-white hover:text-brand-light transition"><X size={40}/></button>
                    <img src={zoomImage} className="max-w-full max-h-full object-contain" alt="Propiedad Zoom" />
                </div>
            )}

            <SEO 
                title={propiedad.titulo} 
                description={`Oportunidad en ${propiedad.estadoOperacion}: ${propiedad.tipo} en ${propiedad.direccion}. ${propiedad.ambientes} ambientes. Precio: ${propiedad.moneda} ${propiedad.precio}.`}
                image={propiedad.imagenes?.[0]?.url || undefined}
                keywords={`${propiedad.tipo}, ${propiedad.estadoOperacion}, ${propiedad.ciudad}, inmobiliaria battauz`}
            />

            <script type="application/ld+json">
                {JSON.stringify(structuredData)}
            </script>
            
            <div className="container mx-auto px-8 md:px-16 lg:px-32 mb-6 text-xs uppercase font-bold tracking-widest">
                <Link to={propiedad.estadoOperacion === 'Alquiler' ? '/alquileres' : '/ventas'} className="flex items-center gap-2 text-brand-primary hover:text-brand-secondary transition">
                    <ArrowLeft className="w-4 h-4" /> Volver al listado
                </Link>
            </div>

            <div className="container mx-auto px-8 md:px-16 lg:px-32">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                    
                    <div className="order-2 lg:order-1 space-y-8">
                        <div>
                            <span className="bg-brand-light/30 text-brand-primary px-3 py-1 rounded text-[10px] font-bold uppercase tracking-widest border border-brand-primary/20">
                                {propiedad.estadoOperacion || "Venta"}
                            </span>
                            <h1 className="font-display text-4xl md:text-5xl text-brand-dark mt-4 mb-2">{propiedad.titulo}</h1>
                            <p className="text-brand-muted text-lg flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-brand-primary" /> {propiedad.direccion}, {propiedad.ciudad}
                            </p>
                            <p className="text-4xl md:text-5xl font-bold text-brand-primary mt-6">{propiedad.moneda} {propiedad.precio.toLocaleString()}</p>
                        </div>

                        <div className="flex gap-6 border-y border-brand-light/30 py-6 text-brand-dark">
                            <div className="text-center"><p className="font-bold text-2xl">{propiedad.superficieTotal}m²</p><span className="text-[10px] text-brand-muted uppercase font-bold tracking-tighter">Total</span></div>
                            <div className="text-center border-l border-brand-light/30 pl-6"><p className="font-bold text-xl">{propiedad.dormitorios}</p><span className="text-[10px] text-brand-muted uppercase font-bold tracking-tighter">Dorm.</span></div>
                            <div className="text-center border-l border-brand-light/30 pl-6"><p className="font-bold text-xl">{propiedad.baños}</p><span className="text-[10px] text-brand-muted uppercase font-bold tracking-tighter">Baños</span></div>
                            <div className="text-center border-l border-brand-light/30 pl-6"><p className="font-bold text-xl">{propiedad.cocheras}</p><span className="text-[10px] text-brand-muted uppercase font-bold tracking-tighter">Coch.</span></div>
                        </div>

                        <div>
                            <h3 className="font-display text-xl text-brand-dark mb-3 underline decoration-brand-light decoration-2 underline-offset-8">Descripción</h3>
                            <p className="text-brand-muted leading-relaxed whitespace-pre-line font-body">{propiedad.descripcion}</p>
                        </div>

                        {/* Formulario */}
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
                                
                                <button disabled={enviando} className="w-full bg-brand-dark text-white font-bold py-4 rounded-xl hover:bg-brand-primary transition shadow-lg flex items-center justify-center gap-2 uppercase tracking-widest text-[10px]">
                                    {enviando ? <Loader2 className="animate-spin" /> : <Send className="w-4 h-4" />}
                                    {enviando ? "ENVIANDO..." : "ENVIAR CONSULTA"}
                                </button>
                            </form>
                        </div>

                         <div className="flex gap-4">
                            <button onClick={copiarLink} className="flex-1 border border-brand-light py-3 rounded-lg font-bold text-brand-muted hover:text-brand-primary transition flex justify-center gap-2 items-center text-xs uppercase tracking-tighter">
                                <Copy className="w-4 h-4" /> Copiar Link
                            </button>
                            <button onClick={compartirWsp} className="flex-1 border border-brand-light py-3 rounded-lg font-bold text-brand-muted hover:text-green-600 transition flex justify-center gap-2 items-center text-xs uppercase tracking-tighter">
                                <FaWhatsapp className="w-4 h-4" /> Compartir
                            </button>
                        </div>
                    </div>

                    {/* Galeria */}
                    <div className="order-1 lg:order-2 w-full h-72 md:h-96 lg:h-[550px] bg-gray-100 rounded-3xl overflow-hidden relative group lg:sticky lg:top-28 shadow-2xl z-10 border-4 border-white cursor-zoom-in">
                        <div className="absolute top-4 right-4 bg-brand-dark/70 backdrop-blur text-white px-3 py-1 rounded-full text-[10px] font-bold z-20 flex items-center gap-2">
                            <Camera className="w-3 h-3" /> {fotoActual} / {totalFotos}
                        </div>
                        
                        <Swiper
                            modules={[Navigation, Pagination]}
                            navigation
                            pagination={{ clickable: true }}
                            onSlideChange={(swiper) => setFotoActual(swiper.realIndex + 1)}
                            loop={totalFotos > 1}
                            className="h-full w-full"
                        >
                            {propiedad.imagenes?.length ? propiedad.imagenes.map((img, i) => (
                                <SwiperSlide key={i} onClick={() => setZoomImage(img.url)}>
                                    <img src={img.url} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" alt={`Foto ${i + 1}`} loading="lazy"/>
                                </SwiperSlide>
                            )) : (
                                <SwiperSlide><img src={propiedad.imagenDestacada || "https://placehold.co/800x600"} className="w-full h-full object-cover" /></SwiperSlide>
                            )}
                        </Swiper>
                    </div>
                </div>
            </div>
        </div>
    );
};
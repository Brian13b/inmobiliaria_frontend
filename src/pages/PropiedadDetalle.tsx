import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPropiedadById } from '../services/api';
import { type Propiedad } from '../types/propiedad';
import { MapPin, ArrowLeft, Camera, Copy, MessageCircle } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { SEO } from '../components/SEO';

import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export const PropiedadDetalle = () => {
    const { id } = useParams();
    const [propiedad, setPropiedad] = useState<Propiedad | null>(null);
    const [_loading, setLoading] = useState(true);
    const [fotoActual, setFotoActual] = useState(1); 

    useEffect(() => {
        if (id) getPropiedadById(Number(id)).then(setPropiedad).finally(() => setLoading(false));
    }, [id]);

    if (!propiedad) return <div className="pt-32 text-center font-body text-brand-muted uppercase tracking-widest">Cargando...</div>;

    const totalFotos = propiedad.imagenes?.length || 1;

    const copiarLink = () => {
        navigator.clipboard.writeText(window.location.href);
        alert("Link copiado!");
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

    return (
        <div className="min-h-screen bg-white pb-20 pt-24 font-body">
            <SEO 
                title={propiedad.titulo} 
                description={`Oportunidad en ${propiedad.estadoOperacion}: ${propiedad.tipo} en ${propiedad.direccion}. ${propiedad.ambientes} ambientes. Precio: ${propiedad.moneda} ${propiedad.precio}.`}
                image={propiedad.imagenes?.[0]?.url || undefined}
                keywords={`${propiedad.tipo}, ${propiedad.estadoOperacion}, ${propiedad.ciudad}, inmobiliaria battauz`}
            />

            <script type="application/ld+json">
                {JSON.stringify(structuredData)}
            </script>
            
            {/* Breadcrumb pequeño */}
            <div className="container mx-auto px-8 md:px-16 lg:px-32 mb-6">
                <Link to={propiedad.estadoOperacion === 'Alquiler' ? '/alquileres' : '/ventas'} className="flex items-center gap-2 text-brand-primary hover:text-brand-secondary text-sm font-bold transition">
                    <ArrowLeft className="w-4 h-4" /> Volver al listado
                </Link>
            </div>

            <div className="container mx-auto px-8 md:px-16 lg:px-32">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                    
                    {/* Info y Formulario */}
                    <div className="order-2 lg:order-1 space-y-8">
                        <div>
                            <span className="bg-brand-light/30 text-brand-primary px-3 py-1 rounded text-[10px] font-bold uppercase tracking-widest border border-brand-primary/20">
                                {propiedad.estadoOperacion || "Venta"}
                            </span>
                            <h1 className="font-display text-3xl md:text-5xl text-brand-dark mt-4 mb-2">{propiedad.titulo}</h1>
                            <p className="text-brand-muted text-lg flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-brand-primary" /> {propiedad.direccion}, {propiedad.ciudad}
                            </p>
                            <p className="text-4xl md:text-5xl font-bold text-brand-primary mt-6">{propiedad.moneda} {propiedad.precio.toLocaleString()}</p>
                        </div>

                        {/* Características */}
                        <div className="flex gap-6 border-y border-brand-light/30 py-6 text-brand-dark">
                            <div className="text-center"><p className="font-bold text-2xl">{propiedad.superficieTotal}m²</p><span className="text-[10px] text-brand-muted uppercase font-bold tracking-tighter">Total</span></div>
                            <div className="text-center border-l border-brand-light/30 pl-6"><p className="font-bold text-xl">{propiedad.dormitorios}</p><span className="text-[10px] text-brand-muted uppercase font-bold tracking-tighter">Dorm.</span></div>
                            <div className="text-center border-l border-brand-light/30 pl-6"><p className="font-bold text-xl">{propiedad.baños}</p><span className="text-[10px] text-brand-muted uppercase font-bold tracking-tighter">Baños</span></div>
                            <div className="text-center border-l border-brand-light/30 pl-6"><p className="font-bold text-xl">{propiedad.cocheras}</p><span className="text-[10px] text-brand-muted uppercase font-bold tracking-tighter">Coch.</span></div>
                        </div>

                        {/* Descripción */}
                        <div>
                            <h3 className="font-display text-xl text-brand-dark mb-3 underline decoration-brand-light decoration-2 underline-offset-8">Descripción</h3>
                            <p className="text-brand-muted leading-relaxed whitespace-pre-line font-body">{propiedad.descripcion}</p>
                        </div>

                        {/* Formulario de Contacto Integrado */}
                        <div className="bg-gray-50 p-8 rounded-2xl border border-brand-light/20 shadow-inner">
                            <h3 className="font-display text-xl text-brand-dark mb-4 text-center">Agendar Visita / Consultar</h3>
                            <form className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <input type="text" placeholder="Nombre" className="w-full p-3 rounded-lg border border-brand-light outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition" />
                                    <input type="tel" placeholder="Teléfono" className="w-full p-3 rounded-lg border border-brand-light outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition" />
                                </div>
                                <input type="email" placeholder="Email" className="w-full p-3 rounded-lg border border-brand-light outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition" />
                                <textarea rows={3} placeholder="Mensaje..." defaultValue={`Hola, me interesa ${propiedad.titulo}...`} className="w-full p-3 rounded-lg border border-brand-light outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition"></textarea>
                                <button className="w-full bg-brand-dark text-white font-bold py-4 rounded-xl hover:bg-brand-primary transition shadow-lg shadow-brand-primary/20">ENVIAR CONSULTA</button>
                            </form>
                        </div>

                         {/* Botones Compartir */}
                         <div className="flex gap-4">
                            <button onClick={copiarLink} className="flex-1 border border-brand-light py-3 rounded-lg font-bold text-brand-muted hover:text-brand-primary hover:border-brand-primary transition flex justify-center gap-2 items-center text-xs">
                                <Copy className="w-4 h-4" /> Copiar Link
                            </button>
                            <button onClick={compartirWsp} className="flex-1 border border-brand-light py-3 rounded-lg font-bold text-brand-muted hover:text-green-600 hover:border-green-500 transition flex justify-center gap-2 items-center text-xs">
                                <MessageCircle className="w-4 h-4" /> Compartir en WhatsApp
                            </button>
                        </div>
                    </div>

                    <div className="order-1 lg:order-2 w-full h-72 md:h-96 lg:h-[550px] bg-gray-100 rounded-3xl overflow-hidden relative group lg:sticky lg:top-28 shadow-2xl z-10 border-4 border-white">
                        <div className="absolute top-4 right-4 bg-brand-dark/70 backdrop-blur text-white px-3 py-1 rounded-full text-[10px] font-bold z-20 flex items-center gap-2">
                            <Camera className="w-3 h-3" /> {fotoActual} / {totalFotos}
                        </div>
                        
                        <Swiper
                            modules={[Navigation, Pagination]}
                            navigation
                            pagination={{ clickable: true }}
                            onSlideChange={(swiper) => setFotoActual(swiper.realIndex + 1)}
                            loop={true}
                            className="w-full h-full"
                        >
                            {propiedad.imagenes?.length ? propiedad.imagenes.map((img, i) => (
                                <SwiperSlide key={i}><img src={img.url} className="w-full h-full object-cover" /></SwiperSlide>
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
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

    if (!propiedad) return <div className="pt-32 text-center">Cargando...</div>;

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
        <div className="min-h-screen bg-white pb-20 pt-24"> {/* pt-24 ajustado para que no choque */}
            <SEO 
                title={propiedad.titulo} 
                description={`Propiedad en ${propiedad.estadoOperacion} en ${propiedad.direccion}. ${propiedad.ambientes} ambientes, ${propiedad.dormitorios} dormitorios. Consultanos.`}
                image={propiedad.imagenes?.[0]?.url || propiedad.imagenDestacada}
            />

            <script type="application/ld+json">
                {JSON.stringify(structuredData)}
            </script>
            
            {/* Breadcrumb pequeño */}
            <div className="container mx-auto px-8 md:px-16 lg:px-32 mb-6">
                <Link to="/ventas" className="flex items-center gap-2 text-gray-500 hover:text-orange-600 text-sm font-medium">
                    <ArrowLeft className="w-4 h-4" /> Volver al listado
                </Link>
            </div>

            <div className="container mx-auto px-8 md:px-16 lg:px-32">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                    
                    {/* Info y Formulario */}
                    <div className="order-2 lg:order-1 space-y-8">
                        <div>
                            <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded text-sm font-bold uppercase tracking-wide">
                                {propiedad.estadoOperacion || "Venta"}
                            </span>
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mt-4 mb-2">{propiedad.titulo}</h1>
                            <p className="text-gray-500 text-lg flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-orange-600" /> {propiedad.direccion}, {propiedad.ciudad}
                            </p>
                            <p className="text-4xl font-bold text-orange-600 mt-4">{propiedad.moneda} {propiedad.precio.toLocaleString()}</p>
                        </div>

                        {/* Características */}
                        <div className="flex gap-6 border-y border-gray-100 py-6">
                            <div className="text-center"><p className="font-bold text-xl">{propiedad.superficieTotal}m²</p><span className="text-xs text-gray-500 uppercase">Total</span></div>
                            <div className="text-center border-l border-gray-100 pl-6"><p className="font-bold text-xl">{propiedad.dormitorios}</p><span className="text-xs text-gray-500 uppercase">Dorm.</span></div>
                            <div className="text-center border-l border-gray-100 pl-6"><p className="font-bold text-xl">{propiedad.baños}</p><span className="text-xs text-gray-500 uppercase">Baños</span></div>
                            <div className="text-center border-l border-gray-100 pl-6"><p className="font-bold text-xl">{propiedad.cocheras}</p><span className="text-xs text-gray-500 uppercase">Coch.</span></div>
                        </div>

                        {/* Descripción */}
                        <div>
                            <h3 className="font-bold text-gray-900 text-lg mb-3">Descripción</h3>
                            <p className="text-gray-600 leading-relaxed whitespace-pre-line">{propiedad.descripcion}</p>
                        </div>

                        {/* Formulario de Contacto Integrado */}
                        <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                            <h3 className="font-bold text-gray-900 text-lg mb-4">Agendar Visita / Consultar</h3>
                            <form className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <input type="text" placeholder="Nombre" className="w-full p-3 rounded-lg border border-gray-200 outline-none focus:border-orange-500" />
                                    <input type="tel" placeholder="Teléfono" className="w-full p-3 rounded-lg border border-gray-200 outline-none focus:border-orange-500" />
                                </div>
                                <input type="email" placeholder="Email" className="w-full p-3 rounded-lg border border-gray-200 outline-none focus:border-orange-500" />
                                <textarea rows={3} placeholder="Mensaje..." defaultValue={`Hola, me interesa ${propiedad.titulo}...`} className="w-full p-3 rounded-lg border border-gray-200 outline-none focus:border-orange-500"></textarea>
                                <button className="w-full bg-gray-900 text-white font-bold py-3 rounded-lg hover:bg-orange-600 transition">ENVIAR CONSULTA</button>
                            </form>
                        </div>

                         {/* Botones Compartir */}
                         <div className="flex gap-4">
                            <button onClick={copiarLink} className="flex-1 border border-gray-200 py-3 rounded-lg font-medium text-gray-600 hover:border-orange-500 hover:text-orange-600 transition flex justify-center gap-2">
                                <Copy className="w-4 h-4" /> Copiar Link
                            </button>
                            <button onClick={compartirWsp} className="flex-1 border border-gray-200 py-3 rounded-lg font-medium text-gray-600 hover:border-green-500 hover:text-green-600 transition flex justify-center gap-2">
                                <MessageCircle className="w-4 h-4" /> Compartir en WhatsApp
                            </button>
                        </div>
                    </div>

                    <div className="order-1 lg:order-2 h-[500px] bg-gray-100 rounded-2xl overflow-hidden relative group sticky top-28 shadow-xl">
                        <div className="absolute top-4 right-4 bg-black/50 backdrop-blur text-white px-3 py-1 rounded-full text-xs font-bold z-20 flex items-center gap-2">
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
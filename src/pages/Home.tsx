import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Hero } from '../components/Hero';
import { getActivas } from '../services/api';
import { type Propiedad, getTipoLabel } from '../types/propiedad';
import { Search, Home, Building, Key, Briefcase, MapPin } from 'lucide-react';
import { SEO } from '../components/SEO';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';

export const HomePage = () => {
    const [destacadas, setDestacadas] = useState<Propiedad[]>([]);
    const navigate = useNavigate();
    
    const [busquedaOperacion, setBusquedaOperacion] = useState("Venta");
    const [busquedaUbicacion, setBusquedaUbicacion] = useState("");

    useEffect(() => {
        getActivas().then(data => {
            const soloDestacadas = data.filter((p: any) => p.esDestacada === true);
            setDestacadas(soloDestacadas.slice(0, 4)); 
        });
    }, []);

    const handleBuscar = () => {
        const destino = busquedaOperacion === "Venta" ? "/ventas" : "/alquileres";
        navigate(`${destino}?q=${busquedaUbicacion}`);
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20 font-body">
            <SEO 
                title="Inicio" 
                description="Tu inmobiliaria de confianza." 
            />
            
            <Hero />

            {/* Buscador Rápido */}
            <div className="container mx-auto px-8 md:px-16 lg:px-32 -mt-10 relative z-40">
                <div className="bg-white p-8 rounded-xl shadow-2xl border border-brand-light/30 grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
                    <div>
                        <label className="block text-xs font-bold text-brand-muted uppercase mb-2">Operación</label>
                        <select 
                            value={busquedaOperacion}
                            onChange={(e) => setBusquedaOperacion(e.target.value)}
                            className="w-full bg-gray-50 border border-brand-light text-brand-dark rounded-lg p-3 outline-none focus:ring-2 focus:ring-brand-primary transition"
                        >
                            <option value="Venta">Venta</option>
                            <option value="Alquiler">Alquiler</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-brand-muted uppercase mb-2">Tipo</label>
                        <select className="w-full bg-gray-50 border border-brand-light text-brand-dark rounded-lg p-3 outline-none focus:ring-2 focus:ring-brand-primary transition">
                            <option>Todos</option>
                            <option>Casa</option>
                            <option>Departamento</option>
                            <option>Terreno</option>
                            <option>Local</option>
                            <option>Oficina</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-brand-muted uppercase mb-2">Ubicación</label>
                        <input 
                            type="text" 
                            placeholder="Ej: Centro..." 
                            value={busquedaUbicacion}
                            onChange={(e) => setBusquedaUbicacion(e.target.value)}
                            className="w-full bg-gray-50 border border-brand-light text-brand-dark rounded-lg p-3 outline-none focus:ring-2 focus:ring-brand-primary transition" 
                        />
                    </div>
                    <button 
                        onClick={handleBuscar}
                        className="bg-brand-primary text-white p-3 rounded-lg font-bold hover:bg-brand-dark transition flex items-center justify-center gap-2 shadow-lg shadow-brand-primary/20"
                    >
                        <Search className="w-5 h-5" /> BUSCAR
                    </button>
                </div>
            </div>

            {/* Servicios - Colores adaptados */}
            <section className="py-24 container mx-auto px-8 md:px-16 lg:px-32">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {[
                        { icon: Home, title: "Ventas", text: "Te acompañamos en el proceso de compra-venta." },
                        { icon: Building, title: "Alquiler", text: "Opciones verificadas para tu próximo hogar." },
                        { icon: Briefcase, title: "Tasación", text: "Valoramos tu propiedad con criterio profesional." },
                        { icon: Key, title: "Administración", text: "Gestionamos tus rentas sin preocupaciones." },
                    ].map((item, i) => (
                        <div key={i} className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-brand-light/20 group text-center">
                            <div className="w-16 h-16 bg-brand-light/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-brand-primary transition-colors duration-300">
                                <item.icon className="w-8 h-8 text-brand-primary group-hover:text-white transition-colors duration-300" />
                            </div>
                            <h3 className="font-display text-xl text-brand-dark mb-3">{item.title}</h3>
                            <p className="text-brand-muted text-sm leading-relaxed">{item.text}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Destacadas con Swiper y Estilo Wealth */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-8 md:px-16 lg:px-32">
                    <div className="flex justify-between items-end mb-12">
                        <div>
                            <span className="text-brand-secondary font-bold tracking-wider uppercase text-sm">Oportunidades</span>
                            <h2 className="font-display text-3xl md:text-5xl text-brand-dark mt-2">Destacadas del Mes</h2>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {destacadas.map(prop => (
                            <Link to={`/propiedad/${prop.id}`} key={prop.id} className="bg-white border border-brand-light/20 rounded-xl shadow-sm hover:shadow-2xl transition-all duration-300 group overflow-hidden block">
                                <div className="h-48 bg-gray-200 overflow-hidden relative">
                                    <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm text-brand-dark text-[10px] font-bold px-3 py-1 rounded shadow-sm z-20 uppercase tracking-wider">
                                        {getTipoLabel(prop.tipo)}
                                    </span>
                                    <span className={`absolute top-3 right-3 text-white text-[10px] font-bold px-3 py-1 rounded shadow-sm z-20 uppercase tracking-wider ${prop.estadoOperacion === 'Venta' ? 'bg-brand-primary' : 'bg-brand-secondary'}`}>
                                        {prop.estadoOperacion || "Venta"}
                                    </span>

                                    {prop.imagenes && prop.imagenes.length > 0 ? (
                                        <Swiper
                                            modules={[Autoplay, EffectFade]}
                                            effect={'fade'}
                                            spaceBetween={0}
                                            slidesPerView={1}
                                            loop={true}
                                            autoplay={{
                                                delay: 2500 + Math.random() * 1000, 
                                                disableOnInteraction: false,
                                            }}
                                            className="h-full w-full"
                                        >
                                            {prop.imagenes.map((img) => (
                                                <SwiperSlide key={img.id}>
                                                    <img 
                                                        src={img.url} 
                                                        alt={prop.titulo}
                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                                    />
                                                </SwiperSlide>
                                            ))}
                                        </Swiper>
                                    ) : (
                                        <img 
                                            src={prop.imagenDestacada || "https://placehold.co/600x400"} 
                                            alt={prop.titulo}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                    )}
                                </div>
                                
                                <div className="p-5">
                                    <h3 className="font-display text-lg text-brand-dark mb-1 truncate group-hover:text-brand-primary transition-colors">{prop.titulo}</h3>
                                    <p className="text-brand-muted text-xs mb-4 flex items-center gap-1 truncate font-body">
                                        <MapPin className="w-3 h-3 text-brand-primary" /> {prop.direccion}
                                    </p>
                                    <div className="flex justify-between items-end border-t border-brand-light/20 pt-4">
                                        <span className="text-xl font-bold text-brand-primary">
                                            {prop.moneda} {prop.precio.toLocaleString()}
                                        </span>
                                        <div className="text-xs font-semibold text-brand-secondary bg-brand-light/20 px-2 py-1 rounded">
                                            {prop.ambientes} Amb.
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};
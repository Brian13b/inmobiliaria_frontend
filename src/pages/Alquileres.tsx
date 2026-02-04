import { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { getActivas } from '../services/api';
import { getTipoLabel, type Propiedad, TipoPropiedad } from '../types/propiedad';
import { Filter, Search, MapPin, Bed, Bath, Car, ChevronDown } from 'lucide-react';
import { SEO } from '../components/SEO';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';

export const AlquileresPage = () => {
  const [propiedades, setPropiedades] = useState<Propiedad[]>([]);
  const [filtradas, setFiltradas] = useState<Propiedad[]>([]);
  const location = useLocation();

  const [filtroTexto, setFiltroTexto] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("Todos");
  const [precioMin, setPrecioMin] = useState("");
  const [precioMax, setPrecioMax] = useState("");
  const [dormitorios, setDormitorios] = useState("Cualq.");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get("q");
    if (query) setFiltroTexto(query);
    window.scrollTo(0, 0);
    getActivas().then(data => {
        const alquileres = data.filter((p: any) => p.estadoOperacion === "Alquiler");
        setPropiedades(alquileres);
        setFiltradas(alquileres);
    });
  }, [location]);

  useEffect(() => {
    let resultado = propiedades;
    if (filtroTexto) {
        resultado = resultado.filter(p => 
            p.ciudad.toLowerCase().includes(filtroTexto.toLowerCase()) || 
            p.direccion.toLowerCase().includes(filtroTexto.toLowerCase())
        );
    }
    if (filtroTipo !== "Todos") {
        let tipoEnum: number | null = null;
        if (filtroTipo === "Casa") tipoEnum = TipoPropiedad.Casa;
        if (filtroTipo === "Departamento") tipoEnum = TipoPropiedad.Departamento;
        if (filtroTipo === "Terreno") tipoEnum = TipoPropiedad.Terreno;
        if (filtroTipo === "Local") tipoEnum = TipoPropiedad.Local;
        if (filtroTipo === "Oficina") tipoEnum = TipoPropiedad.Oficina;
        if (tipoEnum !== null) resultado = resultado.filter(p => p.tipo === tipoEnum);
    }
    if (precioMin) resultado = resultado.filter(p => p.precio >= Number(precioMin));
    if (precioMax) resultado = resultado.filter(p => p.precio <= Number(precioMax));
    if (dormitorios !== "Cualq.") {
        if (dormitorios === "4+") resultado = resultado.filter(p => p.dormitorios >= 4);
        else resultado = resultado.filter(p => p.dormitorios === Number(dormitorios));
    }
    setFiltradas(resultado);
  }, [filtroTexto, filtroTipo, precioMin, precioMax, dormitorios, propiedades]);

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-12 font-body">
        <SEO title="Propiedades en Alquiler" description="Alquileres destacados en la ciudad de Paraná." />

        <div className="container mx-auto px-6 md:px-12 lg:px-24">
            <div className="flex flex-col lg:flex-row gap-12">
                
                {/* Sidebar Filtros */}
                <aside className="lg:w-1/4">
                    <div className="bg-white p-8 rounded-2xl shadow-xl border border-brand-light/20 sticky top-32">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="font-display text-xl text-brand-dark flex items-center gap-2">
                                <Filter className="w-5 h-5 text-brand-primary" /> Filtros
                            </h3>
                            <button 
                                onClick={() => {setFiltroTexto(""); setFiltroTipo("Todos"); setPrecioMin(""); setPrecioMax(""); setDormitorios("Cualquiera");}} 
                                className="text-sm uppercase tracking-widest text-brand-primary font-bold hover:opacity-70 transition"
                            >
                                Limpiar
                            </button>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="text-sm font-bold text-brand-muted uppercase mb-2 block tracking-widest">Ubicación</label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted w-4 h-4" />
                                    <input 
                                        type="text" 
                                        placeholder="Ciudad o calle..." 
                                        className="w-full pl-9 pr-3 py-2.5 border border-brand-light/50 rounded-lg text-sm focus:ring-1 focus:ring-brand-primary outline-none transition bg-gray-50"
                                        value={filtroTexto}
                                        onChange={e => setFiltroTexto(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-bold text-brand-muted uppercase mb-2 block tracking-widest">Tipo</label>
                                <div className="relative">
                                    <select 
                                        className="w-full pl-3 pr-8 py-2.5 border border-brand-light/50 rounded-lg text-sm appearance-none bg-gray-50 focus:ring-1 focus:ring-brand-primary outline-none text-brand-dark"
                                        value={filtroTipo}
                                        onChange={e => setFiltroTipo(e.target.value)}
                                    >
                                        <option>Todos</option>
                                        <option>Casa</option>
                                        <option>Departamento</option>
                                        <option>Terreno</option>
                                        <option>Local</option>
                                        <option>Oficina</option>
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-muted w-4 h-4 pointer-events-none" />
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-bold text-brand-muted uppercase mb-2 block tracking-widest">Presupuesto</label>
                                <div className="flex gap-2">
                                    <input type="number" placeholder="Min" className="w-1/2 px-3 py-2.5 border border-brand-light/50 rounded-lg text-sm outline-none focus:ring-1 focus:ring-brand-primary bg-gray-50" value={precioMin} onChange={e => setPrecioMin(e.target.value)} />
                                    <input type="number" placeholder="Max" className="w-1/2 px-3 py-2.5 border border-brand-light/50 rounded-lg text-sm outline-none focus:ring-1 focus:ring-brand-primary bg-gray-50" value={precioMax} onChange={e => setPrecioMax(e.target.value)} />
                                </div>
                            </div>
                            
                            <div>
                                <label className="text-sm font-bold text-brand-muted uppercase mb-2 block tracking-widest">Dormitorios</label>
                                <div className="flex flex-wrap gap-2">
                                    {["Cualq.", "1", "2", "3", "4+"].map(opt => (
                                        <button 
                                            key={opt}
                                            onClick={() => setDormitorios(opt)}
                                            className={`px-3 py-1.5 text-sm font-bold rounded border transition-all ${dormitorios === opt ? 'bg-brand-primary text-white border-brand-primary' : 'bg-white text-brand-muted border-brand-light hover:border-brand-primary'}`}
                                        >
                                            {opt}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </aside>

                <main className="lg:w-3/4">
                    <div className="mb-10 border-b border-brand-light/20 pb-6">
                        <h1 className="font-display text-4xl md:text-5xl text-brand-dark mb-2">Alquileres</h1>
                        <p className="text-brand-muted text-sm font-body italic">{filtradas.length} propiedades seleccionadas para vos.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        {filtradas.map(prop => (
                            <Link to={`/propiedad/${prop.id}`} key={prop.id} className="bg-white rounded-2xl shadow-sm hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] transition-all duration-500 border border-brand-light/10 overflow-hidden group flex flex-col">
                                <div className="h-64 relative overflow-hidden shrink-0">
                                    <Swiper 
                                        modules={[EffectFade]} 
                                        effect={'fade'} 
                                        slidesPerView={1} 
                                        loop={true}
                                        navigation={false} 
                                        className="h-full w-full"
                                    >
                                        {prop.imagenes?.map((img) => (
                                            <SwiperSlide key={img.id}>
                                                <img src={`${img.url}&w=800&q=75&fm=webp`} alt={prop.titulo} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" />
                                            </SwiperSlide>
                                        ))}
                                    </Swiper>

                                    <div className="absolute top-4 left-4 z-10"> 
                                        <span className="bg-white/95 backdrop-blur-md px-3 py-1 rounded text-[10px] font-bold text-brand-dark uppercase tracking-[0.1em] shadow-sm border border-brand-light/20">
                                            {getTipoLabel(prop.tipo)}
                                        </span>
                                    </div>
                                    
                                    <span className="absolute top-4 right-4 px-3 py-1 rounded text-[10px] font-bold uppercase z-10 text-white shadow-sm bg-brand-secondary tracking-widest">
                                        ALQUILER
                                    </span>
                                </div>

                                <div className="p-6 flex flex-col grow">
                                    <h2 className="font-display text-xl text-brand-dark mb-1 truncate group-hover:text-brand-primary transition-colors uppercase tracking-tight">{prop.titulo}</h2>
                                    <p className="text-brand-muted text-sm mb-6 flex items-center gap-1 font-body"><MapPin className="w-3.5 h-3.5 text-brand-primary" /> {prop.direccion}</p>
                                    
                                    <div className="grid grid-cols-3 gap-4 text-brand-dark text-sm uppercase font-bold tracking-widest mb-6 border-y border-brand-light/10 py-4">
                                        <div className="flex flex-col items-center gap-1 border-r border-brand-light/20"><Bed className="w-5 h-5 text-brand-primary" /> {prop.dormitorios}</div>
                                        <div className="flex flex-col items-center gap-1 border-r border-brand-light/20"><Bath className="w-5 h-5 text-brand-primary" /> {prop.baños}</div>
                                        <div className="flex flex-col items-center gap-1"><Car className="w-5 h-5 text-brand-primary" /> {prop.cocheras}</div>
                                    </div>

                                    <div className="mt-auto flex justify-between items-center">
                                        <span className="text-2xl font-body font-bold text-brand-primary">{prop.moneda} {prop.precio.toLocaleString()}</span>
                                        <span className="text-sm font-bold uppercase tracking-[0.2em] text-brand-secondary border-b-2 border-brand-light/30 pb-1 group-hover:border-brand-primary transition-all">Ver Ficha</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                    {filtradas.length === 0 && (
                        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-brand-light/40">
                            <p className="text-brand-muted font-body text-xl italic">No encontramos propiedades que coincidan con tu búsqueda.</p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    </div>
  );
};
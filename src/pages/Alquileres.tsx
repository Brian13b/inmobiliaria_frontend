import { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { getPropiedades } from '../services/api';
import { type Propiedad, TipoPropiedad, getTipoLabel } from '../types/propiedad';
import { Filter, Search, MapPin, Bed, Bath, Car, ChevronDown } from 'lucide-react';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade } from 'swiper/modules';
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
  const [dormitorios, setDormitorios] = useState("Cualquiera");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get("q");
    if (query) setFiltroTexto(query);

    window.scrollTo(0, 0);
    getPropiedades().then(data => {
        const alquileres = data.filter((p: { estadoOperacion: string; }) => p.estadoOperacion === "Alquiler");
        setPropiedades(alquileres);
        setFiltradas(alquileres);
    });
  }, [location]);

  useEffect(() => {
    let resultado = propiedades;

    // Texto
    if (filtroTexto) {
        resultado = resultado.filter(p => 
            p.titulo.toLowerCase().includes(filtroTexto.toLowerCase()) || 
            p.direccion.toLowerCase().includes(filtroTexto.toLowerCase())
        );
    }

    // Tipo
    if (filtroTipo !== "Todos") {
        let tipoEnum: number | null = null;
        if (filtroTipo === "Casa") tipoEnum = TipoPropiedad.Casa;
        if (filtroTipo === "Departamento") tipoEnum = TipoPropiedad.Departamento;
        if (filtroTipo === "Terreno") tipoEnum = TipoPropiedad.Terreno;
        if (filtroTipo === "Local") tipoEnum = TipoPropiedad.Local;
        if (filtroTipo === "Oficina") tipoEnum = TipoPropiedad.Oficina;
        
        if (tipoEnum !== null) resultado = resultado.filter(p => p.tipo === tipoEnum);
    }

    // Precio
    if (precioMin) resultado = resultado.filter(p => p.precio >= Number(precioMin));
    if (precioMax) resultado = resultado.filter(p => p.precio <= Number(precioMax));

    // Dormitorios
    if (dormitorios !== "Cualquiera") {
        if (dormitorios === "4+") resultado = resultado.filter(p => p.dormitorios >= 4);
        else resultado = resultado.filter(p => p.dormitorios === Number(dormitorios));
    }

    setFiltradas(resultado);
  }, [filtroTexto, filtroTipo, precioMin, precioMax, dormitorios, propiedades]);

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-12">
      <div className="container mx-auto px-8 md:px-16 lg:px-32">
        
        <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Filtros */}
            <div className="lg:w-1/4">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-32">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-gray-800 flex items-center gap-2">
                            <Filter className="w-5 h-5" /> Filtros
                        </h3>
                        <button onClick={() => {setFiltroTexto(""); setPrecioMin(""); setPrecioMax(""); setDormitorios("Cualquiera");}} className="text-xs text-orange-700 font-bold hover:underline">
                            Limpiar
                        </button>
                    </div>

                    <div className="space-y-6">
                        {/* Buscador */}
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Ubicación</label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <input 
                                    type="text" 
                                    placeholder="Buscar..." 
                                    className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-orange-500 outline-none"
                                    value={filtroTexto}
                                    onChange={e => setFiltroTexto(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Tipo */}
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Tipo de Propiedad</label>
                            <div className="relative">
                                <select 
                                    className="w-full pl-3 pr-8 py-2 border border-gray-200 rounded-lg text-sm appearance-none bg-white focus:ring-1 focus:ring-orange-500 outline-none"
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
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                            </div>
                        </div>

                        {/* Rango Precio */}
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Rango de Precio (USD)</label>
                            <div className="flex gap-2">
                                <input type="number" placeholder="Min" className="w-1/2 px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none" value={precioMin} onChange={e => setPrecioMin(e.target.value)} />
                                <input type="number" placeholder="Max" className="w-1/2 px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none" value={precioMax} onChange={e => setPrecioMax(e.target.value)} />
                            </div>
                        </div>

                        {/* Dormitorios */}
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Dormitorios</label>
                            <div className="flex gap-2">
                                {["Cualquiera", "1", "2", "3", "4+"].map(opt => (
                                    <button 
                                        key={opt}
                                        onClick={() => setDormitorios(opt)}
                                        className={`flex-1 py-1.5 text-xs rounded border ${dormitorios === opt ? 'bg-orange-700 text-white border-orange-700' : 'bg-white text-gray-600 border-gray-200 hover:border-orange-300'}`}
                                    >
                                        {opt}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Resultados */}
            <div className="lg:w-3/4">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Propiedades en Alquiler</h1>
                    <p className="text-gray-500 text-sm">Mostrando {filtradas.length} resultados</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filtradas.map(prop => (
                        <Link to={`/propiedad/${prop.id}`} key={prop.id} className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden group flex flex-col">
                           <div className="h-56 relative overflow-hidden shrink-0">
                                <Swiper
                                    modules={[Autoplay, EffectFade]}
                                    effect={'fade'} 
                                    spaceBetween={0}
                                    slidesPerView={1}
                                    loop={true} 
                                    autoplay={{
                                        delay: 3000 + Math.random() * 2000, 
                                        disableOnInteraction: false,
                                    }}
                                    className="h-full w-full"
                                >
                                    {prop.imagenes?.map((img) => (
                                        <SwiperSlide key={img.id}>
                                            <img 
                                                src={img.url} 
                                                alt={prop.titulo} 
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                                            />
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                                <div className="absolute top-3 left-3 flex gap-2 z-10"> 
                                    <span className="bg-white/90 backdrop-blur px-2 py-1 rounded text-xs font-bold text-gray-800 uppercase">
                                        {getTipoLabel(prop.tipo)}
                                    </span>
                                </div>
                                
                                <span className={`absolute top-3 right-3 px-2 py-1 rounded text-xs font-bold uppercase z-10 text-white ${prop.estadoOperacion === 'Venta' ? 'bg-green-600' : 'bg-orange-700'}`}>
                                    {prop.estadoOperacion}
                                </span>
                           </div>
                           <div className="p-5 flex flex-col grow">
                                <h2 className="text-lg font-bold text-gray-800 mb-1 truncate">{prop.titulo}</h2>
                                <p className="text-gray-500 text-sm mb-4 flex items-center gap-1"><MapPin className="w-3 h-3 text-orange-500" /> {prop.direccion}</p>
                                
                                <div className="grid grid-cols-3 gap-2 text-gray-500 text-xs mb-4 border-y border-gray-50 py-3">
                                    <div className="flex items-center gap-1"><Bed className="w-4 h-4" /> {prop.dormitorios} Dorm.</div>
                                    <div className="flex items-center gap-1"><Bath className="w-4 h-4" /> {prop.baños} Baños</div>
                                    <div className="flex items-center gap-1"><Car className="w-4 h-4" /> {prop.cocheras} Coch.</div>
                                </div>

                                <div className="mt-auto flex justify-between items-center">
                                    <span className="text-xl font-bold text-orange-700">{prop.moneda} {prop.precio.toLocaleString()}</span>
                                    <span className="text-sm font-medium text-gray-600 group-hover:text-orange-700">Ver Ficha →</span>
                                </div>
                           </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};
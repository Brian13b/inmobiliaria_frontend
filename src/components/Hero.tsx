import { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Pagination, Parallax } from 'swiper/modules'; // Añadimos Parallax
import { api } from '../services/api';

import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';

export const Hero = () => {
  const [slides, setSlides] = useState<any[]>([]);

  useEffect(() => {
    api.get('/Configuracion')
      .then(res => {
        const data = res.data;
        const newSlides = [];

        if (data.heroImagenUrl) {
          newSlides.push({
            image: data.heroImagenUrl,
            title: data.heroTitulo || "BOTTAZZI INMOBILIARIA",
            subtitle: data.heroSubtitulo || "Propiedades de Exclusividad"
          });
        }
        if (data.heroImagenUrl2) {
          newSlides.push({
            image: data.heroImagenUrl2,
            title: data.heroTitulo2 || data.heroTitulo || "INVERSIONES ÚNICAS",
            subtitle: data.heroSubtitulo2 || data.heroSubtitulo || "Tu oportunidad es ahora"
          });
        }

        if (newSlides.length === 0) {
          newSlides.push({
            image: "https://images.unsplash.com/photo-1600596542815-e32c53048057",
            title: "BOTTAZZI INMOBILIARIA",
            subtitle: "Tu lugar nos importa"
          });
        }
        setSlides(newSlides);
      })
      .catch(() => {
        setSlides([{
          image: "https://images.unsplash.com/photo-1600596542815-e32c53048057",
          title: "BOTTAZZI INMOBILIARIA",
          subtitle: "Tu lugar nos importa"
        }]);
      });
  }, []);

  if (slides.length === 0) return null;

  return (
    <section className="relative h-[550px] md:h-[750px] w-full bg-brand-dark overflow-hidden">
      <Swiper
        modules={[Autoplay, EffectFade, Pagination, Parallax]}
        effect="fade"
        speed={2000} // Transición más lenta para elegancia
        parallax={true} // Activamos parallax
        autoplay={{ delay: 6000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        loop={slides.length > 1}
        className="h-full w-full"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index} className="relative h-full w-full overflow-hidden">
            {/* Imagen de Fondo con efecto Zoom suave */}
            <div 
              className="absolute inset-0 transform scale-110 animate-ken-burns"
              data-swiper-parallax="20%" // Efecto de movimiento lateral suave
            >
              <img 
                src={`${slide.image}&w=1920&q=80&fm=webp`} 
                alt={slide.title} 
                className="w-full h-full object-cover" 
                fetchPriority="high"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-brand-dark/80"></div>
            </div>

            {/* Contenido con Parallax */}
            <div className="relative h-full flex flex-col items-center justify-center text-center text-white px-6">
              <div data-swiper-parallax="-400" className="duration-1000">
                <h1 className="font-display text-5xl md:text-8xl tracking-tighter drop-shadow-2xl mb-8 uppercase leading-tight">
                  {slide.title}
                </h1>
              </div>
              
              <div data-swiper-parallax="-200" className="duration-700">
                <p className="font-body text-[10px] md:text-xs font-bold tracking-[0.4em] uppercase bg-brand-light text-brand-dark px-10 py-4 rounded-sm shadow-2xl">
                  {slide.subtitle}
                </p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <style>{`
        /* Efecto Ken Burns (Zoom lento) */
        @keyframes kenburns {
          0% { transform: scale(1) translate(0,0); }
          100% { transform: scale(1.15) translate(-1%, -1%); }
        }
        .animate-ken-burns {
          animation: kenburns 12s infinite alternate ease-in-out;
        }

        /* Estilos Paginación */
        .swiper-pagination-bullet {
          background: white !important;
          opacity: 0.3;
          width: 8px;
          height: 8px;
          transition: all 0.5s ease;
        }
        .swiper-pagination-bullet-active {
          background: #d8bf9f !important;
          opacity: 1;
          width: 40px;
          border-radius: 4px;
        }
        .swiper-pagination {
          bottom: 40px !important;
        }
      `}</style>
    </section>
  );
};
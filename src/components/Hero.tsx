import { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Pagination, Navigation } from 'swiper/modules'; 
import { api } from '../services/api';

import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';
import 'swiper/css/navigation'; 

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
        modules={[Autoplay, EffectFade, Pagination, Navigation]}
        effect="fade"
        speed={100} 
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        navigation={true} 
        loop={slides.length > 1}
        className="h-full w-full hero-swiper"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index} className="relative h-full w-full">
            <div className="absolute inset-0">
              <img 
                src={`${slide.image}&w=1920&q=80&fm=webp`} 
                alt={slide.title} 
                className="w-full h-full object-cover" 
                fetchPriority="high"
              />
              <div className="absolute inset-0 bg-black/40"></div>
            </div>

            {/* Contenido Central */}
            <div className="relative h-full flex flex-col items-center justify-center text-center text-white px-6">
              <h1 className="font-display text-5xl md:text-8xl tracking-tight drop-shadow-2xl mb-8 uppercase max-w-5xl">
                {slide.title}
              </h1>
              <div className="animate-fade-in-up">
                <p className="font-body text-[10px] md:text-xs font-bold tracking-[0.4em] bg-brand-light text-brand-dark px-10 py-4 rounded-sm shadow-2xl uppercase">
                  {slide.subtitle}
                </p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <style>{`
        /* Personalización de las flechas de navegación */
        .hero-swiper .swiper-button-next,
        .hero-swiper .swiper-button-prev {
          color: white;
          transition: all 0.3s;
        }
        .hero-swiper .swiper-button-next:hover,
        .hero-swiper .swiper-button-prev:hover {
          color: #d8bf9f; /* Color arena al hacer hover */
        }
        .hero-swiper .swiper-button-next:after,
        .hero-swiper .swiper-button-prev:after {
          font-size: 24px; /* Tamaño de las flechas */
          font-weight: bold;
        }

        /* Estilos Paginación */
        .hero-swiper .swiper-pagination-bullet {
          background: white !important;
          opacity: 0.3;
          width: 8px;
          height: 8px;
          transition: all 0.3s ease;
        }
        .hero-swiper .swiper-pagination-bullet-active {
          background: #d8bf9f !important;
          opacity: 1;
          width: 30px;
          border-radius: 4px;
        }
        .hero-swiper .swiper-pagination {
          bottom: 40px !important;
        }
      `}</style>
    </section>
  );
};
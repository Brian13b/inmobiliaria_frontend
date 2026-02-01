import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const Hero = () => {
  const [slides, setSlides] = useState<any[]>([]);
  const [current, setCurrent] = useState(0);

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
                title: data.heroTitulo2 || data.heroTitulo || "OPORTUNIDADES",
                subtitle: data.heroSubtitulo2 || data.heroSubtitulo || "Inversiones"
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

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
        setCurrent(prev => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 6000);
    return () => clearInterval(timer);
  }, [slides]);

  const nextSlide = () => setCurrent(current === slides.length - 1 ? 0 : current + 1);
  const prevSlide = () => setCurrent(current === 0 ? slides.length - 1 : current - 1);

  if (slides.length === 0) return null;

  return (
    <div className="relative h-[650px] w-full overflow-hidden bg-brand-dark group">
      {slides.map((slide, index) => (
        <div 
            key={index} 
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === current ? 'opacity-100' : 'opacity-0'}`}
        >
          <div className="absolute inset-0 bg-brand-dark/40 z-10" /> 
          <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
          
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center text-white px-4">
            <h1 className="font-display text-5xl md:text-8xl tracking-tight drop-shadow-2xl mb-6 uppercase animate-fade-in">
              {slide.title}
            </h1>
            <p className="font-body text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase bg-brand-light text-brand-dark px-8 py-3 rounded-sm inline-block shadow-xl">
              {slide.subtitle}
            </p>
          </div>
        </div>
      ))}

      {slides.length > 1 && (
        <>
            <button onClick={prevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-white/10 hover:bg-white/30 p-2 rounded-full text-white backdrop-blur-sm transition opacity-0 group-hover:opacity-100">
                <ChevronLeft className="w-8 h-8" />
            </button>
            <button onClick={nextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-white/10 hover:bg-white/30 p-2 rounded-full text-white backdrop-blur-sm transition opacity-0 group-hover:opacity-100">
                <ChevronRight className="w-8 h-8" />
            </button>
        </>
      )}
    </div>
  );
};
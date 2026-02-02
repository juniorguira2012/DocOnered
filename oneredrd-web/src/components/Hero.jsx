import { useState, useEffect } from "react";
import { ArrowLeftRight } from "lucide-react";
import { User } from "lucide-react";

// 1. Inporancion de Imagenes
import img1 from "/public/assets/images/plan1.jpg";
import img2 from "/public/assets/images/plan2.png";
import img3 from "/public/assets/images/plan3.png";
import img4 from "/public/assets/images/plan4.jpg";
import img5 from "/public/assets/images/plan5.jpg";
import img6 from "/public/assets/images/plan6.jpg";

const imagenes = [img1, img2, img3, img4, img5, img6];

export default function Hero() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const intervalo = setInterval(() => {
      setIndex((prev) => (prev + 1) % imagenes.length);
    }, 5000); 
    return () => clearInterval(intervalo);
  }, []);

 // 1. Configuración de Ofertas (Añadimos el link aquí para mayor flexibilidad)
const OFERTA_DEFAULT = { 
  titulo: "OneRedRD:", 
  promo: "Fibra Óptica Real en tu hogar",
  link: "#planes" 
};

//Ofertas
const OFERTAS_MENSUALES = {
  0: { 
    titulo: "Oferta de Enero:", 
    promo: <>Aumenta de 6 a 30 Mbps por solo <span className="font-black underline ">RD$300</span> adicionales</>,
    link: "#planes" // Cambia esto por tu URL real
  },
  1: { 
    titulo: "Febrero Especial:", 
    promo: <>Aumenta de 6 a 30 Mbps por solo <span className="font-black underline ">RD$300</span> adicionales</>,
    link: "/oferta-febrero"
  },
  2: { 
    titulo: "Marzo Especial:", 
    promo: <>Aumenta de 6 a 30 Mbps por solo <span className="font-black underline ">RD$300</span> adicionales</>,
    link: "/oferta-marzo"
  }
};

// 2. Lógica de Selección
const mesActual = new Date().getMonth();
const ofertaDelMes = OFERTAS_MENSUALES[mesActual] || OFERTA_DEFAULT;

  return (
  <header className="relative overflow-hidden pt-16 pb-24 md:pt-32 md:pb-40 px-6">
    {/* Fondo decorativo dinámico */}
    <div id="inicio" className="absolute top-0 right-0 -z-10 w-[500px] h-[500px] bg-blue-100/50 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4"></div>
    <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
      
      {/* LADO IZQUIERDO: TEXTO Y ACCIONES */}
      <div className="text-left relative">
        
        {/* --- INICIO BLOQUE DE OFERTA DINÁMICA --- */}
        <div className="text-left relative group">
          <a 
            href={ofertaDelMes.link || "#planes"} 
            className="inline-flex items-center gap-3 px-5 py-2.5 bg-amber-50 border border-amber-200/60 rounded-full mb-8 shadow-sm transition-all duration-300 hover:shadow-md hover:bg-amber-100 hover:scale-[1.02] active:scale-95 cursor-pointer"
          >
            {/* Indicador de pulso animado */}
            <span className="relative flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-green-600"></span>
            </span>
            
            <span className="text-[10px] md:text-xs font-black text-emerald-800 uppercase tracking-[0.15em]">
                {ofertaDelMes.titulo} <span className="text-emerald-600">{ofertaDelMes.promo}</span>
            </span>

            {/* Flechita indicadora de link */}
            <span className="text-amber-400 text-xs ml-1 group-hover:translate-x-1 transition-transform">→</span>
          </a>
        </div>
        {/* --- FIN BLOQUE DE OFERTA DINÁMICA --- */}

        <h1 className="text-5xl md:text-8xl font-black leading-[0.9] tracking-tighter text-slate-900 overflow-hidden">
          <span className="block animate-entrada-izq opacity-0">
            Navega
          </span>
          <span className="text-blue-600 italic block animate-entrada-der opacity-0">
            sin límites.
          </span>
        </h1>
        
        <p className="mt-8 text-xl text-slate-600 max-w-lg leading-relaxed font-medium">
          La fibra óptica más estable de RD llegó para quedarse. Conecta tu hogar hoy mismo con <span className="text-blue-600 font-bold">OneRed</span>.
        </p>

        <div className="mt-12 flex flex-col sm:flex-row gap-5 items-start sm:items-center">
            <a 
              href="https://bot.oneredrd.com/instalacion-web-os0tv2w" 
              rel="noopener noreferrer"
              className="inline-block bg-blue-600 text-white px-10 py-5 rounded-2xl font-black text-xl hover:bg-blue-700 transition-all hover:scale-105 shadow-2xl shadow-blue-300 text-center"
            >
            Solicitar Ahora
          </a>
          <div className="flex flex-col gap-2">
            <div className="flex items-center">
              {/* Grupo de Avatares */}
              <div className="flex -space-x-3 mr-3">
                {[
                  { bg: "bg-blue-100", text: "text-blue-600" },
                  { bg: "bg-green-100", text: "text-green-600" },
                  { bg: "bg-orange-100", text: "text-black-600" },
                  { bg: "bg-purple-100", text: "text-purple-600" },
                ].map((style, i) => (
                  <div 
                    key={i} 
                    className={`w-9 h-9 rounded-full border-2 border-white ${style.bg} flex items-center justify-center shadow-sm transition-transform hover:scale-110 hover:z-10 cursor-pointer overflow-hidden`}
                  >
                    {/* Icono real en lugar de emoji */}
                    <User size={18} className={`${style.text}`} />
                  </div>
                ))}
                
                {/* Círculo indicador de más clientes */}
                <div className="w-10 h-10 rounded-full border-2 border-white bg-slate-900 flex items-center justify-center shadow-sm">
                  <span className="text-[10px] font-black text-white">+1k</span>
                </div>
              </div>

              {/* Texto de Confianza */}
              <div className="flex flex-col justify-center">
                <div className="flex items-center gap-1">
                  {/* Estrellitas de satisfacción (opcional pero recomendado) */}
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star} className="text-yellow-400 text-[10px]">★</span>
                  ))}
                </div>
                <p className="text-[11px] font-bold text-slate-600 tracking-tight leading-none mt-1">
                  +1,200 clientes felices en <span className="text-blue-600">Los Alcarrizos</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* LADO DERECHO: SLIDER DE IMÁGENES */}
        <div className="relative">
          {/* Card Flotante de Velocidad */}
          <div className="absolute -top-10 -left-10 bg-white p-5 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] z-20 border border-slate-50 animate-bounce-slow">
            <div className="flex items-center gap-4">
              
              {/* Contenedor del Icono con efecto de pulso */}
              <div className="relative flex items-center justify-center">
                {/* Anillo de pulso animado de fondo */}
                <div className="absolute inset-0 bg-blue-400 rounded-2xl animate-ping opacity-20"></div>
                
                {/* El cuadro del icono */}
                <a href="#planes">
                  <div className="relative w-10 h-10 bg-blue-40 rounded-2xl flex items-center justify-center transition-transform hover:scale-110 border border-blue-100">
                    <ArrowLeftRight size={28} className="text-blue-500" strokeWidth={2.5} />
                  </div>
                </a>
              </div>
              
              {/* Textos Informativos */}
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter mb-1">
                  Navega En Tiempo Real
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black text-slate-700 leading-none">1000</span>
                  <span className="text-sm font-black text-blue-500 uppercase">Mbps</span>
                </div>
              </div>

            </div>
          </div>
        <div className="relative group h-[400px] md:h-[500px]">
          <div className="absolute inset-0 bg-blue-600 rounded-[3rem] rotate-3 group-hover:rotate-0 transition-transform duration-500"></div>
          
          <div className="relative h-full w-full bg-slate-100 rounded-[3rem] overflow-hidden border-4 border-white shadow-2xl">
             {imagenes.map((img, i) => (
               <img
                 key={i}
                 src={img}
                 alt={`OneRedRD Slide ${i}`}
                 className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
                   i === index ? "opacity-100" : "opacity-0"
                 }`}
               />
             ))}
             <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 to-transparent"></div>
          </div>
        </div>
      </div>
    </div>
  </header>
);
}
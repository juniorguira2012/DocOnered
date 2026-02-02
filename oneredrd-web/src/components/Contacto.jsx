import { Headset, MessageSquare } from 'lucide-react';

export default function Contacto() {
  
  // Función para abrir el chat de Chatwoot
  const abrirChat = () => {
    if (window.$chatwoot) {
      window.$chatwoot.toggle("open");
    } else {
      // Si por alguna razón no ha cargado, lo mandamos al link del bot como respaldo
      window.open("https://bot.oneredrd.com/instalacion-web-os0tv2w", "_blank");
    }
  };

  return (
    <section id="contacto" className="py-24 bg-blue-600 px-6 relative overflow-hidden">
      <div className="max-w-4xl mx-auto text-center relative z-10">
        
        {/* Icono de Agente */}
        <div className="inline-flex items-center justify-center w-24 h-24 bg-white/10 backdrop-blur-md rounded-full mb-8 border border-white/20">
          <Headset size={48} className="text-white" strokeWidth={1.5} />
        </div>

        <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase italic mb-6">
          ¿Tienes dudas? <br />
          <span className="text-blue-200">¡Chatea con nosotros!</span>
        </h2>

        {/* Botón que activa el Chat */}
        <div className="flex justify-center">
          <button 
            onClick={abrirChat}
            className="group inline-flex items-center gap-4 bg-white text-blue-600 px-10 py-6 rounded-3xl font-black text-xl uppercase tracking-tighter shadow-2xl hover:bg-blue-50 transition-all active:scale-95 cursor-pointer"
          >
            Hablar con un Agente
            <MessageSquare size={24} className="group-hover:rotate-12 transition-transform" strokeWidth={3} />
          </button>
        </div>

        {/* Indicador de Línea */}
        <div className="mt-8 flex items-center justify-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
          </span>
          <span className="text-blue-100 text-xs font-black uppercase tracking-widest">Atención al cliente en vivo</span>
        </div>

      </div>
    </section>
  );
}
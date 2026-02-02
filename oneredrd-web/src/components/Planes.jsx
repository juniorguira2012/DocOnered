import PlanCard from './PlanCard';
import { 
  Wifi, 
  Gamepad2, 
  Zap, 
  Rocket, 
  Building2, 
  Globe2,ArrowDownCircle, ArrowUpCircle,
} from "lucide-react";

export default function Planes() {
  // Configuración común para que todos los iconos se vean uniformes
  const iconProps = {
    size: 30,
    strokeWidth: 2.5, // Esto les da el look moderno y sólido
    className: "transition-transform group-hover:scale-110 duration-300"
  };

  return (
    <section id="planes" className="py-24 px-6 max-w-7xl mx-auto bg-white">
      {/* Encabezado con estilo OneRed */}
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase italic">
          Nuestros Planes de <span className="text-blue-600">Internet</span>
        </h2>
        <div className="w-20 h-1.5 bg-blue-600 mx-auto mt-4 rounded-full shadow-[0_0_15px_rgba(37,99,235,0.3)]"></div>
        <p className="text-slate-500 mt-6 text-lg font-medium max-w-2xl mx-auto leading-relaxed">
          La mayor variedad de velocidades para que solo pagues por lo que necesitas, con tecnología 100% Fibra.
        </p>
      </div>

      {/* Grid de Planes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        <PlanCard 
          nombre="Plan Básico"
          bajada="30"    
          subida="20"    
          precio="1,300"
          icon={<Wifi {...iconProps} />}
          //caracteristicas={["Navegación a Internet", "Redes Sociales", ""]}
        />  

        <PlanCard 
          nombre="Plan Express"
          bajada="50"    
          subida="35"
          precio="1,500"
          destacado={true}
          icon={<ArrowDownCircle {...iconProps} />}
          //caracteristicas={["Baja Latencia (Ping)", "Streaming 4K", "Prioridad de Red"]}
        />

        <PlanCard 
          nombre="Plan Esencial"
          bajada="60"
          subida="45"
          precio="2,200"
          icon={<Zap {...iconProps} />}
          //caracteristicas={["Fibra Simétrica", "Ideal para Home Office", "Soporte 24/7"]}
        />
        
        <PlanCard 
          nombre="Plan Avanzado"
          bajada="80"    
          subida="50"
          precio="2,500"
          icon={<Rocket {...iconProps} />}
          //caracteristicas={["Múltiples Dispositivos", "Descargas Pesadas", "Smart Home"]}
        />

        <PlanCard 
          nombre="Plan Business"
          bajada="100"    
          subida="70"
          precio="3,800"
          icon={<Building2 {...iconProps} />}
          //caracteristicas={["IP Fija Opcional", "Enlace Dedicado", "Soporte Preferencial"]}
        />

        <PlanCard 
          nombre="Plan Ultra"
          bajada="200"    
          subida="100"
          megas="1,000"
          precio="3,500"
          icon={<Globe2 {...iconProps} />}
          //caracteristicas={["Máxima Velocidad", "Uso Corporativo", "Instalación Premium"]}
        />
      </div>

      <div className="mt-20 py-8 border-t border-slate-50 text-center">
        <p className="text-slate-400 text-xs font-black uppercase tracking-[0.3em]">
          Conectividad Garantizada • OneRed
        </p>
      </div>
    </section>
  );
}
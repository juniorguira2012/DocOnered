import { Zap, Headphones, Unlock, Gamepad2 } from "lucide-react";

export default function Features() {
  const data = [
    { title: "Fibra Óptica 100%", desc: "Tecnología FTTH que garantiza la velocidad contratada.", icon: <Zap size={32} /> },
    { title: "Soporte Especializado", desc: "Atención al Cliente eficaz listo para asistirte.", icon: <Headphones size={32} /> },
    { title: "libre de contrato", desc: "Creemos en la libertad. Sin penalidades escondidas.", icon: <Unlock size={32} /> },
    { title: "Baja Latencia", desc: "Ideal para gaming y videollamadas sin lags.", icon: <Gamepad2 size={32} /> },
  ];

  return (
    <section className="relative z-0 pt-12 pb-20 px-6 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {data.map((item, i) => (
            <div key={i} className="flex flex-col items-center text-center group">
              {/* Icono con círculo moderno */}
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-sm">
                {item.icon}
              </div>
              <h3 className="font-black text-xl mb-3 text-slate-900 tracking-tighter uppercase">{item.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed max-w-[250px]">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
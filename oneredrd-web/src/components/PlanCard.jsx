import { Check, ArrowDown, ArrowUp } from "lucide-react";

export default function PlanCard({ nombre, bajada, subida, precio, destacado = false, icon }) {
  return (
    <div className={`relative bg-white p-8 rounded-[2.5rem] border-2 transition-all duration-500 hover:-translate-y-4 ${
      destacado ? 'border-blue-600 shadow-2xl shadow-blue-200' : 'border-slate-100 shadow-xl shadow-slate-200/50'
    }`}>
      
      {/* Icono y Nombre del Plan */}
      <div className="flex items-center gap-4 mb-8">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${destacado ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-600'}`}>
          {icon}
        </div>
        <h3 className="font-black text-slate-900 uppercase tracking-tighter">{nombre}</h3>
      </div>

            {/* Bloque de Velocidades (Ajustado para estar más juntos) */}
      <div className="mb-8">
        {/* Velocidad de Bajada */}
        <div className="flex items-end gap-2 mb-2"> {/* Reducimos mb de 4 a 2 */}
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-1">
              <ArrowDown size={12} strokeWidth={3} /> Bajada
            </span>
            <span className="text-5xl font-black text-slate-900 tracking-tighter leading-none">
              {bajada}
            </span>
          </div>
          <span className="text-xl font-bold text-slate-400 mb-1">Mbps</span>
        </div>

        {/* Velocidad de Subida (Subido y más compacto) */}
        <div className="inline-flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-xl border border-slate-100/50">
          <ArrowUp size={14} className="text-slate-400" strokeWidth={3} />
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-tight">Subida:</span>
          <span className="text-lg font-black text-slate-700 leading-none">{subida} Mbps</span>
        </div>
      </div>

      {/* Características
      <div className="space-y-3 mb-8">
        {caracteristicas.map((item, i) => (
          <div key={i} className="flex items-center gap-3">
            <Check size={16} className="text-green-500" strokeWidth={3} />
            <span className="text-sm text-slate-600 font-medium">{item}</span>
          </div>
        ))}
      </div> */}

      {/* Precio y Botón */}
      <div className="pt-6 border-t border-slate-50">
        <div className="flex items-baseline gap-1 mb-6">
          <span className="text-3xl font-black text-slate-900">RD${precio}</span>
          <span className="text-slate-400 font-bold">/mes</span>
        </div>
        
        {/* Agregamos cursor-pointer al enlace y al botón */}
        <a 
          href="https://bot.oneredrd.com/instalacion-web-os0tv2w" 
          //target="_blank" 
          rel="noopener noreferrer"
          className="block w-full cursor-pointer"
        >
          <button className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all cursor-pointer ${
            destacado ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-slate-900 text-white hover:bg-blue-600'
          }`}>
            Seleccionar Plan
          </button>
        </a>
      </div>
    </div>
  );
}
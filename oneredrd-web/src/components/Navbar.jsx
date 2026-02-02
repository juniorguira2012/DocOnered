import { useState, useEffect, useRef } from "react";
import { User, ShieldCheck, FileUp, Search, ExternalLink, Menu, X } from "lucide-react"; 
import logo from "/public/assets/logos/logo-onered.png";

export default function Navbar() {
  const [menuPagoOpen, setMenuPagoOpen] = useState(false);
  const [menuCuentaOpen, setMenuCuentaOpen] = useState(false);
  const [menuMovilOpen, setMenuMovilOpen] = useState(false);

  const menuRef = useRef(null);
  const cuentaRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) setMenuPagoOpen(false);
      if (cuentaRef.current && !cuentaRef.current.contains(event.target)) setMenuCuentaOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    // Reducimos h-20 a h-16 en móvil (h-16 md:h-20)
    <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-100 h-16 md:h-20 transition-all">
      <div className="flex justify-between items-center px-4 md:px-12 h-full max-w-[1400px] mx-auto">
        
        {/* Lado Izquierdo: Menú + Logo */}
        <div className="flex items-center gap-1 md:gap-2">
          <button 
            onClick={() => setMenuMovilOpen(!menuMovilOpen)}
            className="lg:hidden p-1.5 text-slate-600 hover:text-blue-600 transition"
          >
            {menuMovilOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          
          <a href="#" className="relative block group">
            <img
              src={logo} 
              alt="OneRedRD Logo" 
              // Reducimos altura del logo en móvil (h-10 md:h-16)
              className="h-10 md:h-16 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />
          </a>
        </div>
        
        {/* Menú Central (Desktop) */}
        <div className="hidden lg:flex gap-8 font-bold text-xs uppercase tracking-widest text-slate-500">
          <a href="#inicio" className="hover:text-blue-600 transition">Inicio</a>
          <a href="#nosotros" className="hover:text-blue-600 transition">Nosotros</a>
          <a href="#cobertura" className="hover:text-blue-600 transition">Cobertura</a>
          <a href="#planes" className="hover:text-blue-600 transition">Planes</a>
          <a href="#contacto" className="hover:text-blue-600 transition">Contacto</a>
          <a href="https://www.instagram.com/oneredrd/" target="_blank" rel="noreferrer" className="hover:text-blue-600 transition flex items-center gap-1">
            Novedades <ExternalLink size={12} className="opacity-50" />
          </a>
        </div>

        {/* Lado Derecho */}
        <div className="flex items-center gap-1 md:gap-4">
          {/* Botón Mi Cuenta - Más compacto en móvil */}
          <div className="relative" ref={cuentaRef}>
            <button 
              onClick={() => setMenuCuentaOpen(!menuCuentaOpen)}
              className="flex items-center gap-1 text-xs md:text-sm font-bold text-slate-700 hover:text-blue-600 transition p-1.5"
            >
              <div className="w-7 h-7 md:w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                 <User size={14} className="md:size-[16px]" />
              </div>
              <span className="hidden sm:inline">Mi Cuenta</span>
            </button>
            <div className={`absolute right-0 mt-2 w-48 transition-all duration-300 origin-top-right ${menuCuentaOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
              <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 p-2">
                <a href="https://mikrowisp.oneredrd.com/cliente/login" className="flex items-center gap-3 px-4 py-3 text-[10px] font-black uppercase text-slate-600 hover:bg-blue-50 rounded-xl transition"><User size={18}/>Portal Clientes</a>
                <a href="https://mikrowisp.oneredrd.com/admin/login" className="flex items-center gap-3 px-4 py-3 text-[10px] font-black uppercase text-slate-600 hover:bg-blue-50 rounded-xl transition"><ShieldCheck size={18}/>Acceso Empleados</a>
              </div>
            </div>
          </div>

          {/* Botón Pagar Factura - Texto más pequeño en móvil */}
          <div className="relative" ref={menuRef}>
            <button 
              onClick={() => setMenuPagoOpen(!menuPagoOpen)}
              className="bg-blue-600 text-white px-3 md:px-6 py-2 md:py-2.5 rounded-full text-[9px] md:text-xs font-black uppercase tracking-tighter shadow-lg hover:bg-blue-700 transition flex items-center gap-1"
            >
              Pagar <span className="hidden xs:inline">Factura</span>
            </button>
            <div className={`absolute right-0 mt-2 w-52 transition-all duration-300 origin-top-right ${menuPagoOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
              <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 p-2">
                <a href="https://bot.oneredrd.com/aplicar-pago-web" className="flex items-center gap-3 px-4 py-3 text-[10px] font-black uppercase text-slate-600 hover:bg-blue-50 rounded-xl transition"><FileUp size={18}/>Aplicar Comprobantes</a>
                <a href="https://bot.oneredrd.com/aplicar-pago-web" className="flex items-center gap-3 px-4 py-3 text-[10px] font-black uppercase text-slate-600 hover:bg-blue-50 rounded-xl transition"><Search size={18}/>Verificar Factura</a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Menú Sándwich - Ajuste de posición mt-16 */}
      <div className={`lg:hidden absolute top-16 w-full bg-white border-b shadow-xl transition-all duration-300 ease-in-out ${menuMovilOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
        <div className="flex flex-col p-6 gap-4 font-bold text-sm uppercase tracking-widest text-slate-600">
          <a href="#" onClick={() => setMenuMovilOpen(false)} className="py-2 border-b border-slate-50 hover:text-blue-600">Inicio</a>
          <a href="#nosotros" onClick={() => setMenuMovilOpen(false)} className="py-2 border-b border-slate-50 hover:text-blue-600">Nosotros</a>
          <a href="#cobertura" onClick={() => setMenuMovilOpen(false)} className="py-2 border-b border-slate-50 hover:text-blue-600">Cobertura</a>
          <a href="#planes" onClick={() => setMenuMovilOpen(false)} className="py-2 border-b border-slate-50 hover:text-blue-600">Planes</a>
          <a href="#contacto" onClick={() => setMenuMovilOpen(false)} className="py-2 border-b border-slate-50 hover:text-blue-600">Contacto</a>
          <a href="https://www.instagram.com/oneredrd/" className="py-2 flex items-center justify-between hover:text-blue-600">
            Novedades <ExternalLink size={16} />
          </a>
        </div>
      </div>
    </nav>
  );
}
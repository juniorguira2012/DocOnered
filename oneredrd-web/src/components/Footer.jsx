import { Facebook, Instagram, Linkedin, Music2 ,Mail, Phone } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-50 border-t border-slate-200 pt-16 pb-8 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Columna 1: Marca y Eslogan */}
          <div className="space-y-4">
            <div className="text-2xl font-black tracking-tighter text-blue-600">
              OneRed<span className="text-slate-800"></span>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed">
              Llevando la mejor conectividad a cada rincón. Fibra óptica real para hogares y empresas dominicanas.
            </p>
            <div className="flex gap-4">
  {/* Facebook */}
  <a 
    href="https://www.facebook.com/p/Oneredrd-100080066528660/" 
    target="_blank" 
    rel="noopener noreferrer"
    className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-600 hover:text-[#1877F2] hover:border-[#1877F2] hover:shadow-lg hover:shadow-blue-100 transition-all duration-300 cursor-pointer"
  >
    <Facebook size={20} strokeWidth={2} />
  </a>

  {/* Instagram */}
  <a 
    href="https://www.instagram.com/oneredrd/" 
    target="_blank" 
    rel="noopener noreferrer"
    className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-600 hover:text-[#E4405F] hover:border-[#E4405F] hover:shadow-lg hover:shadow-pink-100 transition-all duration-300 cursor-pointer"
  >
    <Instagram size={20} strokeWidth={2} />
  </a>

  {/* TikTok (Usamos Music2 que es el icono estándar para representar TikTok en Lucide) */}
  <a 
  href="https://www.tiktok.com/@oneredrd1?_r=1&_t=ZS-93S2Y9lyMHk"
  target="_blank" 
  rel="noopener noreferrer"
  className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center hover:bg-black group transition-all duration-300 cursor-pointer hover:shadow-lg hover:shadow-slate-200"
>
  <img 
    src="public/assets/icons/tik-tok.png" 
    alt="TikTok OneRedRD" 
    className="w-5 h-5 transition-all duration-300 group-hover:invert group-hover:brightness-200"
  />
</a>

  {/* LinkedIn
  <a 
    href="https://linkedin.com/company/oneredrd" 
    target="_blank" 
    rel="noopener noreferrer"
    className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-600 hover:text-[#0A66C2] hover:border-[#0A66C2] hover:shadow-lg hover:shadow-blue-100 transition-all duration-300 cursor-pointer"
  >
    <Linkedin size={20} strokeWidth={2} />
  </a> */}
</div>
          </div>

          {/* Columna 2: Enlaces Rápidos */}
          <div>
            <h4 className="font-bold text-slate-900 mb-6">Servicios</h4>
            <ul className="space-y-4 text-sm text-slate-600 font-medium">
              <li><a href="#planes" className="hover:text-blue-600 transition">Internet Residencial</a></li>
              <li><a href="#planes" className="hover:text-blue-600 transition">Planes de Negocio</a></li>
              <li><a href="#planes" className="hover:text-blue-600 transition">Fibra Dedicada</a></li>
              <li><a href="#cobertura" className="hover:text-blue-600 transition">Consulta Cobertura</a></li>
            </ul>
          </div>

          {/* Columna 3: Soporte */}
          <div>
            <h4 className="font-bold text-slate-900 mb-6">Soporte</h4>
            <ul className="space-y-4 text-sm text-slate-600 font-medium">
              <li>
                <button 
                  onClick={() => window.$chatwoot?.toggle("open")}
                  className="hover:text-blue-600 transition cursor-pointer font-medium bg-transparent border-none p-0"
                >
                  Centro de Ayuda
                </button>
              </li>
              <li><a href="https://bot.oneredrd.com/aplicar-pago-web" className="hover:text-blue-600 transition">Pagar Factura</a></li>
              <li>
                <button 
                  onClick={() => window.$chatwoot?.toggle("open")}
                  className="hover:text-blue-600 transition cursor-pointer font-medium bg-transparent border-none p-0"
                >
                  Reportar Avería
                </button>
              </li>
              <li>
                <button 
                  onClick={() => window.$chatwoot?.toggle("open")}
                  className="hover:text-blue-600 transition cursor-pointer font-medium bg-transparent border-none p-0"
                >
                  WhatsApp Directo
                </button>
              </li>
            </ul>
          </div>

          {/* Columna 4: Contacto */}
          <div>
            <h4 className="font-bold text-slate-900 mb-6">Contacto</h4>
            <ul className="space-y-4 text-sm text-slate-600 font-medium">
              <li className="flex items-start gap-2 group">
              <span className="mt-1">📍</span>
              <a 
                href="https://maps.app.goo.gl/dYw2KcGqJ4LF1zCCA" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-blue-600 transition-colors cursor-pointer"
              >
                <span>Los Alcarrizos, Calle Lebrón 60, Santo Domingo</span>
              </a>
            </li>
              
              <div className="flex flex-row items-center gap-3 text-sm font-bold tracking-tight">
                  {/* Icono de teléfono delante */}
                  <Phone size={18} className="text-blue-600 shrink-0" />
                  
                  <div className="flex items-center gap-2">
                    <a 
                      href="tel:+18094225424" 
                      className="hover:text-blue-600 transition-colors cursor-pointer whitespace-nowrap"
                    >
                      (809) 422-5424
                    </a>
                    
                    <span className="text-slate-400 font-normal">/</span> 
                    
                    <a 
                      href="tel:+18094474575" 
                      className="hover:text-blue-600 transition-colors cursor-pointer whitespace-nowrap"
                    >
                      (809) 447-4575
                    </a>
                  </div>
                </div>
              <li className="flex items-center gap-2">
                <Mail size={18} className="text-blue-600 shrink-0" />
                  <a 
                    href="mailto:info@oneredrd.com" 
                    className="hover:text-blue-600 transition-colors cursor-pointer text-sm font-medium"
                  >
                    <span>info@oneredrd.com</span>
                  </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Línea final y Copyright */}
        <div className="border-t border-slate-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
          <p>© {currentYear} OneRed - Todos los derechos reservados.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-slate-600">Privacidad</a>
            <a href="#" className="hover:text-slate-600">Términos</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
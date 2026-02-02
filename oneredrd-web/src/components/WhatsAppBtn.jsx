export default function WhatsAppBtn() {
  const telefono = "18090000000"; // Cambia esto por el número de OneRedRD
  const mensaje = "Hola OneRedRD! Me interesa contratar un plan de internet.";

  const url = `https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`;

  return (
    <a 
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-8 right-8 z-[100] group flex items-center"
    >
      {/* Etiqueta que aparece al poner el mouse */}
      <span className="mr-3 bg-white px-4 py-2 rounded-xl shadow-xl text-sm font-bold text-slate-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300 border border-slate-100">
        ¿Necesitas ayuda?
      </span>
      
      {/* Botón con animación de pulso */}
      <div className="relative">
        <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-25"></div>
        <div className="relative bg-[#25D366] p-4 rounded-full shadow-2xl hover:scale-110 transition-transform duration-300">
          <svg 
            viewBox="0 0 24 24" 
            className="w-8 h-8 fill-white"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.148-.67-1.611-.918-2.21-.242-.585-.487-.506-.67-.515-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 0 5.414 0 12.05c0 2.123.553 4.197 1.601 6.02L0 24l6.135-1.61a11.802 11.802 0 005.911 1.6c6.635 0 12.049-5.415 12.05-12.053a11.829 11.829 0 00-3.536-8.525z" />
          </svg>
        </div>
      </div>
    </a>
  );
}
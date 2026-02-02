import React, { useState } from 'react';

export default function Cobertura() {
  const [sectorAbierto, setSectorAbierto] = useState(null);

  const datosSectores = [
    { nombre: "Nuevo Amanecer", imagen: "nuevo-amanecer.jpg" },
    { nombre: "Los Cocos", imagen: "los-cocos.jpg" },
    { nombre: "Los Cerros", imagen: "los-cerros.jpg" },
    { nombre: "Nazareno", imagen: "nazareno.jpg" },
    { nombre: "Obras Públicas", imagen: "obras-publicas.jpg" },
    { nombre: "Puente Blanco", imagen: "puente-blanco.jpg" },
    { nombre: "Parque la toronja", imagen: "parque-la-toronja.jpg" },
    { nombre: "Paraíso", imagen: "paraiso.jpg" },
    { nombre: "La piña", imagen: "la-pina.jpg" },
    { nombre: "Valle Encantado", imagen: "valle-encantado.png" },
    { nombre: "Res. Don Felipe", imagen: "res-don-felipe.png" },
    { nombre: "Res. Pablo Mella Morales", imagen: "res-pablo-mella.jpeg" },
    { nombre: "Res. Las Mercedes", imagen: "res-las-mercedes.png" },
    { nombre: "Los Libertadores", imagen: "los-libertadores.png"},
    { nombre: "Los Americanos", imagen: "los-americanos.jpg" },
    { nombre: "Villa los peloteros", imagen: "villa-los-peloteros.jpg" },
    { nombre: "KM 14", imagen: "km-14.png" },
    { nombre: "Nuevo Horizonte", imagen: "nuevo-horizonte.jpeg" },
    { nombre: "Las Torres", imagen: "las-torres.png" },
    { nombre: "El Kilombo", imagen: "el-kilombo.png" },
    { nombre: "Las Malvinas", imagen: "las-malvinas.jpeg" },
    { nombre: "Anacauita", imagen: "anacauita.png" },
    { nombre: "Savica", imagen: "savica.png" },
    { nombre: "Barrio La Lotería", imagen: "barrio-la-loteria.webp" },
    { nombre: "Pueblo Nuevo", imagen: "pueblo-nuevo.jpg" },
    { nombre: "Res. Las Glorias", imagen: "res-la-glorias.png" },
    { nombre: "El Chucho", imagen: "el-chucho.png" },
    { nombre: "Los Rieles", imagen: "los-rieles.png" },
    { nombre: "Avenida del Oeste", imagen: "avenida-del-oeste.png" },
    { nombre: "San Rafael", imagen: "san-rafael.png" },
    { nombre: "Canaan", imagen: "canaan.png" },
    { nombre: "El Invi", imagen: "el-invi.png" },
    { nombre: "La 14 (Savica)", imagen: "la-14-savica.png" },
    { nombre: "Arenoso", imagen: "arenoso.png" },
    { nombre: "La Fe", imagen: "la-fe.png" },
    { nombre: "El Vivero", imagen: "el-vivero.jpg" },
    { nombre: "24 de Abril", imagen: "24-de-abril.png" },
    { nombre: "Los Patos", imagen: "los-patos.png" },
    { nombre: "Los Ángeles", imagen: "los-angeles.jpeg" },
    { nombre: "Chavón", imagen: "chavon.jpeg" },
    { nombre: "Juana Saltitopa", imagen: "juana-saltitopa.png" },
    { nombre: "La Unión", imagen: "la-union.jpeg" },
    { nombre: "Res. Praderas del Norte", imagen: "res-praderas-del-norte.png" },
    { nombre: "Los multis", imagen: "los-multis.png" }
  ];

  const abrirChat = () => {
    if (window.$chatwoot) {
      window.$chatwoot.toggle("open");
    } else {
      window.open("https://bot.oneredrd.com/instalacion-web-os0tv2w", "_blank");
    }
  };

  return (
    <section id="cobertura" className="py-24 bg-white px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* TITULO RESTAURADO */}
        <div className="text-center mb-16">
          <span className="text-blue-600 font-black uppercase tracking-widest text-sm">Nuestra Red</span>
          <h2 className="text-4xl md:text-6xl font-black text-slate-900 mt-2">
            Cobertura <span className="text-blue-600">Los Alcarrizos</span>
          </h2>
          <p className="text-slate-500 mt-4 text-lg max-w-2xl mx-auto">
            Haz clic en tu sector para ver el mapa de disponibilidad de fibra óptica.
          </p>
        </div>

        {/* Grid de Sectores */}
        <div className="bg-slate-50 rounded-[3rem] p-8 md:p-12 border border-slate-100 shadow-inner">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {datosSectores.map((item, index) => (
              <div key={index} className="flex flex-col">
                <div 
                  onClick={() => setSectorAbierto(sectorAbierto === index ? null : index)}
                  className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${
                    sectorAbierto === index ? 'bg-blue-600 text-white shadow-lg scale-105' : 'bg-white hover:shadow-md hover:scale-105'
                  }`}
                >
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black ${
                    sectorAbierto === index ? 'bg-white text-blue-600' : 'bg-blue-100 text-blue-600'
                  }`}>
                    {index + 1}
                  </span>
                  <span className="text-sm font-bold">{item.nombre}</span>
                </div>

                {/* Acordeón con Imagen */}
                <div className={`overflow-hidden transition-all duration-500 ${
                  sectorAbierto === index ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'
                }`}>
                  <div className="p-2 bg-white rounded-2xl border-2 border-blue-200 shadow-lg">
                    <img 
                      src={`/assets/sectores/${item.imagen}`} 
                      alt={`Mapa ${item.nombre}`}
                      className="w-full h-48 object-cover rounded-xl"
                      onError={(e) => { 
                        e.target.style.display = 'none'; 
                        e.target.nextSibling.style.display = 'flex'; 
                      }}
                    />
                    <div 
                      style={{ display: 'none' }} 
                      className="w-full h-48 bg-blue-50 rounded-xl flex flex-col items-center justify-center text-blue-400 border border-blue-100"
                    >
                      <span className="text-3xl mb-2">📍</span>
                      <p className="text-xs font-bold uppercase tracking-wider text-blue-800">Mapa de {item.nombre}</p>
                      <p className="text-[10px] mt-1 text-blue-400 italic">Cargando disponibilidad...</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Botón de Chatwoot */}
        <div 
          onClick={abrirChat} 
          className="mt-12 cursor-pointer text-center bg-blue-50 p-8 rounded-3xl border-2 border-dashed border-blue-200 hover:bg-blue-100 transition-all active:scale-95"
        >
          <p className="text-blue-800 font-bold flex items-center justify-center gap-2">
            <span>💬</span> ¿No ves tu sector? ¡Contáctanos! Estamos expandiendo nuestra red cada día.
          </p>
        </div>

      </div>
    </section>
  );
}
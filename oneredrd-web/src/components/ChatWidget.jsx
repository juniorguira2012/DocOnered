import { useEffect } from "react";

const ChatWidget = () => {
  useEffect(() => {
    // 1. Inyectamos CSS para tunear el botón y ocultar la X original
    const style = document.createElement("style");
    style.innerHTML = `
      /* Botón flotante estilo WhatsApp */
      .woot-widget-bubble {
        background-color: #25D366 !important;
        background-image: url('https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg') !important;
        background-repeat: no-repeat !important;
        background-position: center !important;
        background-size: 30px !important;
        border: none !important;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
      }

      /* OCULTAR LA X de la burbuja cuando el chat está abierto */
      .woot-widget-bubble.woot--close {
        background-image: url('https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg') !important;
      }
      
      .woot-widget-bubble svg {
        display: none !important;
      }

      /* OCULTAR EL BOTÓN DE CERRAR dentro del encabezado del chat */
      /* Nota: Esto se aplica al contenedor del iframe si es posible */
      .woot-widget-holder .woot-widget-header .woot-close-button {
        display: none !important;
      }
    `;
    document.head.appendChild(style);

    // 2. Cargamos el SDK
    (function(d, t) {
      var BASE_URL = "https://chatone.oneredrd.com";
      var g = d.createElement(t), 
          s = d.getElementsByTagName(t)[0];
      g.src = BASE_URL + "/packs/js/sdk.js";
      g.defer = true;
      g.async = true;
      s.parentNode.insertBefore(g, s);
      g.onload = function() {
        window.chatwootSDK.run({
          websiteToken: 'coVW3GVVA4bpCSXrfLwGrJSo',
          baseUrl: BASE_URL,
          config: {
            brandColor: '#25D366',
          }
        });
      };
    })(document, "script");

    // 3. Lógica para cerrar al hacer click fuera
    const handleOutsideClick = (event) => {
      const widgetHolder = document.querySelector('.woot-widget-holder');
      const widgetBubble = document.querySelector('.woot-widget-bubble');
      
      // Si el chat está abierto y el click NO es dentro del chat ni en la burbuja, lo cerramos
      if (window.$chatwoot && 
          window.$chatwoot.isOpen && 
          widgetHolder && 
          !widgetHolder.contains(event.target) && 
          !widgetBubble.contains(event.target)) {
        window.$chatwoot.toggle("close");
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  return null;
};

export default ChatWidget;
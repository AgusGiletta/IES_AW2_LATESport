import { renderCards, attachCardEvents } from "./rendercards.js";
import { actualizarContadorCarrito } from "../../utils.js";
import { getProductosByCategoria } from '../../api/productos.js'; 

(async () => {
    const CATEGORIA = 'mujer'; // Filtro por categoría
    const CONTAINER_ID = 'productContainer';
    
    try {
        // Llamo a la API (uso la ruta /byCategoria/accesorios)
        const productos = await getProductosByCategoria(CATEGORIA); 
        
        if (productos.length === 0) { 
            console.warn(`La API devolvió 0 productos para la categoría '${CATEGORIA}'.`);
        }
        
        // Renderizo el resultado directo del API
        renderCards(productos, CONTAINER_ID); 
        
        // Adjunto eventos
        attachCardEvents(CONTAINER_ID);
        actualizarContadorCarrito();
        
    } catch (error) {
        console.error("No se pudieron cargar los productos:", error);
        document.getElementById(CONTAINER_ID).innerHTML = 
            '<p class="alert alert-danger">No se pudieron cargar los productos del servidor.</p>';
    }
})();
import { renderCards, attachCardEvents } from "./rendercards.js";
import { actualizarContadorCarrito } from "../../utils.js";

fetch('../JSON/productos.json')
  .then(res => res.json())
  .then(products => {
    const accesorios = products.filter(p => p.categoria === 'accesorios');
    renderCards(accesorios, 'productContainer');
    attachCardEvents();
    actualizarContadorCarrito();
  })
  .catch(console.error);






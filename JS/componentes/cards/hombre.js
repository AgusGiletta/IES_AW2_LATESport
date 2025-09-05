import { renderCards, attachCardEvents } from "./rendercards.js";
import { actualizarContadorCarrito } from "../../utils.js";

fetch('../JSON/productos.json')
  .then(res => res.json())
  .then(products => {
    const hombre = products.filter(p => p.categoria === 'hombre');
    renderCards(hombre, 'productContainer');
    attachCardEvents();
    actualizarContadorCarrito();
  })
  .catch(console.error);

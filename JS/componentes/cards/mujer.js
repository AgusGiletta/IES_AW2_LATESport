import { renderCards, attachCardEvents } from "./rendercards.js";
import { actualizarContadorCarrito } from "../../utils.js";

fetch('../JSON/productos.json')
  .then(res => res.json())
  .then(products => {
    const mujer = products.filter(p => p.categoria === 'mujer');
    renderCards(mujer, 'productContainer');
    attachCardEvents();
    actualizarContadorCarrito();
  })
  .catch(console.error);
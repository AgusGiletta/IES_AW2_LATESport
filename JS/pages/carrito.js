import { getNavBarComponent } from "../componentes/navbar/navbar.js";
import { actualizarContadorCarrito, setupLogoutButton } from "../utils.js";

window.addEventListener('load', () => {
  const navContainer = document.querySelector('header');
  const userSession = sessionStorage.getItem('userData');
  const isLoggedIn = !!userSession;
  const showSessionButtons = true;

  if (navContainer) {
    navContainer.innerHTML = getNavBarComponent(showSessionButtons, isLoggedIn);
    setupLogoutButton();
  }

  mostrarCarrito();
  actualizarContadorCarrito();
});

function mostrarCarrito() {
  const carritoContainer = document.getElementById('carrito-container');
  let cart = JSON.parse(localStorage.getItem('cart')) || [];

  if (cart.length === 0) {
    carritoContainer.innerHTML = '<p>El carrito está vacío.</p>';
    return;
  }

  const html = `
    <div class="row g-4">
      ${cart.map(product => `
        <div class="col-md-4">
          <div class="card h-100">
            <img src="${product.image}" class="card-img-top" alt="${product.title}">
            <div class="card-body d-flex flex-column">
              <h5 class="card-title">${product.title}</h5>
              <p class="card-text">${product.description}</p>
              <div class="quantity-controls d-flex align-items-center gap-3 mb-2">
                <button class="btn btn-outline-secondary btn-sm btn-decrease" data-title="${product.title}">-</button>
                <span>Cantidad: ${product.quantity}</span>
                <button class="btn btn-outline-secondary btn-sm btn-increase" data-title="${product.title}">+</button>
              </div>
              <p class="card-text fw-bold mt-auto">Total: $${product.total.toFixed(2)}</p>
            </div>
          </div>
        </div>
      `).join('')}
    </div>

    <div class="d-flex justify-content-center mt-4">
      <button id="btnComprar" class="btn btn-success btn-lg">Comprar</button>
    </div>
  `;

  carritoContainer.innerHTML = html;

  const btnsDecrease = carritoContainer.querySelectorAll('.btn-decrease');
  btnsDecrease.forEach(btn => {
    btn.addEventListener('click', () => {
      const title = btn.getAttribute('data-title');
      cambiarCantidadProducto(title, -1);
    });
  });

  const btnsIncrease = carritoContainer.querySelectorAll('.btn-increase');
  btnsIncrease.forEach(btn => {
    btn.addEventListener('click', () => {
      const title = btn.getAttribute('data-title');
      cambiarCantidadProducto(title, +1);
    });
  });

  const btnComprar = document.getElementById('btnComprar');
  if (btnComprar) {
    btnComprar.addEventListener('click', () => {
      alert('Gracias por su compra!');
      localStorage.removeItem('cart');
      mostrarCarrito();
      actualizarContadorCarrito();
    });
  }
}

function cambiarCantidadProducto(title, cambio) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  const index = cart.findIndex(p => p.title === title);
  if (index === -1) return;

  cart[index].quantity += cambio;

  if (cart[index].quantity <= 0) {
    cart.splice(index, 1);
  } else {
    cart[index].total = cart[index].price * cart[index].quantity;
  }

  localStorage.setItem('cart', JSON.stringify(cart));
  mostrarCarrito();
  actualizarContadorCarrito();
}   
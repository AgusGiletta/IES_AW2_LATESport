export function actualizarContadorCarrito() {
  const cartCount = document.getElementById('cart-count');
  if (!cartCount) return;
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const totalQuantity = cart.reduce((acc, producto) => acc + producto.quantity, 0);
  cartCount.textContent = totalQuantity;
}

export function setupLogoutButton() {
  const btnLogout = document.getElementById('btnLogout');
  if (btnLogout) {
    btnLogout.addEventListener('click', () => {
      sessionStorage.removeItem('userData');   // Cerrar sesión
      localStorage.removeItem('cart');         // Vaciar carrito
      window.location.href = 'index.html';     // Redirigir
    });
  }
}


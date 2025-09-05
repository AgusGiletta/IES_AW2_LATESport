import { actualizarContadorCarrito } from "../../utils.js";

export function renderCards(products, containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = '';

  products.forEach(product => {
    const cardHTML = `
      <div class="col">
        <div class="card h-100 shadow-sm">
          <img src="${product.imagen}" class="card-img-top img-producto" alt="${product.nombre}">
          <div class="card-body text-center d-flex flex-column">
            <h5 class="card-title">${product.nombre}</h5>
            <p class="card-text">${product.desc}</p>
            <p class="fw-bold text-success">
              Precio unitario: $<span class="precio-unitario">${product.precio}</span><br>
              Total: $<span class="precio-total">0.00</span>
            </p>
            <div class="d-flex justify-content-center align-items-center gap-2 my-2">
              <button class="btn btn-outline-secondary btn-decrease">-</button>
              <span class="quantity">0</span>
              <button class="btn btn-outline-secondary btn-increase">+</button>
            </div>
            <button class="btn btn-outline-danger btn-add-to-cart">Añadir al carrito</button>
          </div>
        </div>
      </div>
    `;

    container.insertAdjacentHTML('beforeend', cardHTML);
  });
}

export function attachCardEvents() {
  const cards = document.querySelectorAll('.card');

  cards.forEach(card => {
    const decreaseBtn = card.querySelector('.btn-decrease');
    const increaseBtn = card.querySelector('.btn-increase');
    const quantitySpan = card.querySelector('.quantity');
    const priceUnitario = parseFloat(card.querySelector('.precio-unitario').textContent);
    const totalSpan = card.querySelector('.precio-total');

    let quantity = 0;

    increaseBtn.addEventListener('click', () => {
      quantity++;
      quantitySpan.textContent = quantity;
      totalSpan.textContent = (quantity * priceUnitario).toFixed(2);
    });

    decreaseBtn.addEventListener('click', () => {
      if (quantity > 0) {
        quantity--;
        quantitySpan.textContent = quantity;
        totalSpan.textContent = (quantity * priceUnitario).toFixed(2);
      }
    });

    const addToCartBtn = card.querySelector('.btn-add-to-cart');

    addToCartBtn.addEventListener('click', () => {
      const userData = sessionStorage.getItem('userData');
      if (!userData) {
        alert('Debes iniciar sesión para agregar productos al carrito.');
        window.location.href = 'iniciar_sesion.html';
        return;
      }

      const title = card.querySelector('.card-title').textContent;
      const description = card.querySelector('.card-text').textContent;
      const image = card.querySelector('.card-img-top').getAttribute('src');
      const quantitySelected = parseInt(quantitySpan.textContent);
      const price = priceUnitario;

      if (quantitySelected === 0) {
        alert('Debes seleccionar al menos un producto.');
        return;
      }

      const product = {
        title,
        description,
        image,
        price,
        quantity: quantitySelected,
        total: price * quantitySelected
      };

      let cart = JSON.parse(localStorage.getItem('cart')) || [];

      const existing = cart.find(p => p.title === title);
      if (existing) {
        existing.quantity += quantitySelected;
        existing.total = existing.price * existing.quantity;
      } else {
        cart.push(product);
      }

      localStorage.setItem('cart', JSON.stringify(cart));
      actualizarContadorCarrito();

      alert('Producto agregado al carrito.');

      quantity = 0;
      quantitySpan.textContent = '0';
      totalSpan.textContent = '0.00';
    });
  });
}









import { actualizarContadorCarrito, obtenerClaveCarrito, mostrarMensaje } from "../../utils.js"; 

export function renderCards(products, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';

    products.forEach(product => {
        const cardHTML = `
            <div class="col"
                data-id="${product._id}"
                data-tipo="${product.tipo || ''}"
                data-talla="${product.talla || ''}"
                data-color="${product.color || ''}"
            >
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
                            <!-- Botones y Cantidad como en tu diseño -->
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

export function attachCardEvents(containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`ERROR: attachCardEvents no encontró el contenedor con ID: ${containerId}`);
        return; 
    }

    const cardContainers = container.querySelectorAll('.col');
    
    if (cardContainers.length === 0) return; 

    cardContainers.forEach(cardParent => {
        const card = cardParent.querySelector('.card');
        if (!card) return;

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
            const userData = sessionStorage.getItem('user');
            if (!userData) {
                mostrarMensaje('Debes iniciar sesión para agregar productos al carrito.', 'warning'); 
                window.location.href = 'iniciar_sesion.html';
                return;
            }
            
            const cartKey = obtenerClaveCarrito(); 
            if (!cartKey) { return; } 

            const _id = cardParent.getAttribute('data-id');

            const title = card.querySelector('.card-title').textContent;
            const description = card.querySelector('.card-text').textContent;
            const image = card.querySelector('.card-img-top').getAttribute('src');
            const quantitySelected = parseInt(card.querySelector('.quantity').textContent); 
            const price = parseFloat(card.querySelector('.precio-unitario').textContent);

            if (quantitySelected === 0) {
                mostrarMensaje('Debes seleccionar al menos un producto.', 'warning');
                return;
            }

            const product = {
                _id, 
                title,
                description,
                image,
                price,
                quantity: quantitySelected,
                total: price * quantitySelected
            };

            let cart = JSON.parse(localStorage.getItem(cartKey)) || [];

            const existing = cart.find(p => p._id === _id); 
            if (existing) {
                existing.quantity += quantitySelected;
                existing.total = existing.price * existing.quantity;
            } else {
                cart.push(product);
            }

            localStorage.setItem(cartKey, JSON.stringify(cart));
            actualizarContadorCarrito();

            mostrarMensaje('Producto agregado al carrito.', 'success');

            card.querySelector('.quantity').textContent = '0';
            card.querySelector('.precio-total').textContent = '0.00';
        });
    });
}



/* Parte de otra entrega
import { actualizarContadorCarrito, obtenerClaveCarrito } from "../../utils.js";

export function renderCards(products, containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = '';

  products.forEach(product => {
    const cardHTML = `
      <div class="col"
          data-tipo="${product.tipo || ''}"
          data-talla="${product.talla || ''}"
          data-color="${product.color || ''}"
      >
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

export function attachCardEvents(containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`ERROR: attachCardEvents no encontró el contenedor con ID: ${containerId}`);
        return; 
    }

    const cards = container.querySelectorAll('.card');
    
    if (cards.length === 0) return; 

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
            const userData = sessionStorage.getItem('user');
            if (!userData) {
                alert('Debes iniciar sesión para agregar productos al carrito.');
                window.location.href = 'iniciar_sesion.html';
                return;
            }
            
            const cartKey = obtenerClaveCarrito(); 
            if (!cartKey) { return; } 

            const title = card.querySelector('.card-title').textContent;
            const description = card.querySelector('.card-text').textContent;
            const image = card.querySelector('.card-img-top').getAttribute('src');
            const quantitySelected = parseInt(card.querySelector('.quantity').textContent); 
            const price = parseFloat(card.querySelector('.precio-unitario').textContent);

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

            let cart = JSON.parse(localStorage.getItem(cartKey)) || [];

            const existing = cart.find(p => p.title === title);
            if (existing) {
                existing.quantity += quantitySelected;
                existing.total = existing.price * existing.quantity;
            } else {
                cart.push(product);
            }

            localStorage.setItem(cartKey, JSON.stringify(cart));
            actualizarContadorCarrito();

            alert('Producto agregado al carrito.');

            card.querySelector('.quantity').textContent = '0';
            card.querySelector('.precio-total').textContent = '0.00';
    });
  });
}*/

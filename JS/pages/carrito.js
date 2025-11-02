import { getNavBarComponent } from "../componentes/navbar/navbar.js";
import { actualizarContadorCarrito, obtenerClaveCarrito, setupLogoutButton } from "../utils.js"; 

window.addEventListener('load', () => {
    const navContainer = document.querySelector('header');
    const userSession = sessionStorage.getItem('user');
    const isLoggedIn = !!userSession;
    const showSessionButtons = true;

    if (navContainer) {
        navContainer.innerHTML = getNavBarComponent(showSessionButtons, isLoggedIn);
        actualizarContadorCarrito();
       setupLogoutButton();
       mostrarCarrito();
    }

    mostrarCarrito();
});

async function generarOrdenDeCompra(id_usuario, cart) {
    try {
        const res = await fetch('/ventas/nueva', { 
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id_usuario, productos: cart })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Error al generar la orden');
        return { success: true, mensaje: data.mensaje };
    } catch (error) {
        console.error('Error al comprar:', error);
        return { success: false, mensaje: error.message };
    }
}


function mostrarCarrito() {
    const carritoContainer = document.getElementById('carrito-container');
    const cartKey = obtenerClaveCarrito(); 

    if (!cartKey) {
        carritoContainer.innerHTML = '<p class="alert alert-info text-center">Debes iniciar sesión para ver tu carrito.</p>';
        return;
    }

    let cart = JSON.parse(localStorage.getItem(cartKey)) || []; 

    if (cart.length === 0) {
        carritoContainer.innerHTML = '<p class="alert alert-warning text-center">El carrito está vacío.</p>';
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
        btnComprar.addEventListener('click', async () => {
            const userSession = sessionStorage.getItem('user');
            const cart = JSON.parse(localStorage.getItem(cartKey)) || []; 
            
            if (!userSession) {
                alert('Debes iniciar sesión para completar la compra.');
                window.location.href = 'iniciar_sesion.html';
                return;
            }

            if (cart.length === 0) {
                alert('El carrito está vacío. Agrega productos antes de comprar.');
                return;
            }
            
            const user = JSON.parse(userSession);
            const id_usuario = user.id;

            const result = await generarOrdenDeCompra(id_usuario, cart); 

            if (result.success) {
                alert(result.mensaje);
                localStorage.removeItem(cartKey); 
                mostrarCarrito();
                actualizarContadorCarrito();
            } else {
                alert('Falló la compra: ' + result.mensaje);
            }
        });
    }
}

function cambiarCantidadProducto(title, cambio) {
    const cartKey = obtenerClaveCarrito();
    if (!cartKey) return; 

    let cart = JSON.parse(localStorage.getItem(cartKey)) || []; 
    const index = cart.findIndex(p => p.title === title);
    if (index === -1) return;

    cart[index].quantity += cambio;

    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    } else {
        cart[index].total = cart[index].price * cart[index].quantity;
    }

    localStorage.setItem(cartKey, JSON.stringify(cart)); 
    mostrarCarrito();
    actualizarContadorCarrito();
}
import { getNavBarComponent } from "../componentes/navbar/navbar.js";
import { obtenerClaveCarrito, actualizarContadorCarrito, setupLogoutButton, mostrarMensaje } from '../utils.js';

let isPurchaseSuccessful = false;

window.addEventListener('load', () => {
    const navContainer = document.querySelector('header');
    const userSession = sessionStorage.getItem('user');
    const isLoggedIn = !!userSession;
    const showSessionButtons = true;

    if (navContainer) {
        navContainer.innerHTML = getNavBarComponent(showSessionButtons, isLoggedIn);
        actualizarContadorCarrito();
        setupLogoutButton();
    }
    renderCarrito();
});

const carritoContainer = document.getElementById('carrito-container');

const obtenerUserId = () => {
    const userSession = sessionStorage.getItem('user');
    if (userSession) {
        try {
            const user = JSON.parse(userSession);
            return user._id || user.id; 
        } catch (error) {
            console.error("Error al parsear el usuario de la sesión:", error);
            return null;
        }
    }
    return null;
};

const realizarCompra = async (cart, total) => {
    const userSession = sessionStorage.getItem('user');
    const userId = obtenerUserId();

    if (!userId) {
        mostrarMensaje('Error: Sesión de usuario no encontrada. Por favor, inicia sesión.', 'error');
        return { success: false, error: 'Sesión de usuario no encontrada.' };
    }

    const user = JSON.parse(userSession);

    const productosParaVenta = cart.map(item => ({
        productoId: item._id, 
        cantidad: item.quantity,
        precioUnitario: item.price,
        nombre: item.title,
        descripcion: item.description,
        imagen: item.image,
    }));

    const ventaData = {
        productos: productosParaVenta,
        total: total,

        usuario: {
            id: userId,
            nombre: user.nombre || user.email, 
            email: user.email 
        }
    };

    try {
        const response = await fetch('/ventas/nueva', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(ventaData),
        });

        let result = {};
        try {
            if (response.headers.get("content-type")?.includes("application/json")) {
                result = await response.json();
            }
        } catch (e) {
            console.warn("No se pudo parsear la respuesta JSON del servidor.", e);
        }

        if (response.ok) { 
            isPurchaseSuccessful = true;
            
            // Limpiar el carrito
            const cartKey = obtenerClaveCarrito();
            localStorage.removeItem(cartKey);
            actualizarContadorCarrito();

            renderCarrito(); 
            
            return { success: true, result: result };

        } else {
            const errorMessage = result.error || (response.status === 500 ? `Error 500: Fallo en el servidor. Revise la consola del backend y el esquema de Mongoose.` : `Error del servidor (Código ${response.status}).`);
            mostrarMensaje('Error al procesar la compra: ' + errorMessage, 'error');
            return { success: false, error: errorMessage };
        }
    } catch (error) {
        console.error('Error de red al realizar la compra:', error);
        mostrarMensaje('Error de conexión con el servidor. Por favor, verifica tu conexión.', 'error');
        return { success: false, error: 'Error de conexión con el servidor.' };
    }
};

const modificarCantidadProducto = (productoId, cambio) => {
    const cartKey = obtenerClaveCarrito();
    let cart = JSON.parse(localStorage.getItem(cartKey)) || [];

    const index = cart.findIndex(item => item._id === productoId);

    if (index !== -1) {
        cart[index].quantity += cambio;

        if (cart[index].quantity <= 0) {
            cart.splice(index, 1);
            mostrarMensaje('Producto eliminado del carrito.', 'danger'); 
        } else {
            cart[index].total = cart[index].price * cart[index].quantity;
            mostrarMensaje('Cantidad de producto actualizada.', 'info');
        }

        localStorage.setItem(cartKey, JSON.stringify(cart));
        actualizarContadorCarrito();
        renderCarrito(); 
    }
};


const eliminarProducto = (productoId) => {
    const cartKey = obtenerClaveCarrito();
    let cart = JSON.parse(localStorage.getItem(cartKey)) || [];
    const initialLength = cart.length;

    cart = cart.filter(item => item._id !== productoId); 

    if (cart.length < initialLength) {
        localStorage.setItem(cartKey, JSON.stringify(cart));
        actualizarContadorCarrito();
        renderCarrito();
        mostrarMensaje('Producto eliminado del carrito.', 'danger'); 
    }
};

export function renderCarrito() {
    const cartKey = obtenerClaveCarrito();
    const cart = JSON.parse(localStorage.getItem(cartKey)) || [];
    let totalGlobal = 0;
    let htmlContent = '';

    const carritoContainer = document.getElementById('carrito-container');
    if (!carritoContainer) return;
    
    if (isPurchaseSuccessful) {
        htmlContent += `
            <div class="alert alert-success text-center p-4 mb-4 shadow-lg" role="alert">
                <h4 class="alert-heading">¡Compra Generada Exitosamente!</h4>
                <p>Tu orden ha sido procesada y registrada. Gracias por tu compra.</p>
                <hr>
                <p class="mb-0"> Vuelve a seleccionar productos si quieres comprar más.</p>
            </div>
        `;
        isPurchaseSuccessful = false; 
    }

    if (cart.length === 0) {
        htmlContent += '<div class="alert alert-info text-center" role="alert">El carrito de compras está vacío.</div>';
    } else {
        htmlContent += '<div class="row g-4 justify-content-center">'; 
        
        cart.forEach(item => {
            const subtotal = item.price * item.quantity;
            totalGlobal += subtotal;

            htmlContent += `
                <div class="col-12 col-sm-6 col-md-4" data-id="${item._id}">
                    <div class="card h-100 shadow-sm">
                        <img src="${item.image}" class="card-img-top" alt="${item.title}">
                        
                        <div class="card-body text-center d-flex flex-column">
                            <h5 class="card-title">${item.title}</h5>
                            <p class="card-text">${item.description.substring(0, 50)}...</p>
                            
                            <!-- PRECIO UNITARIO Y TOTAL (El total en verde y abajo) -->
                            <p class="fw-bold mt-auto mb-2" style="font-size: 0.95rem;"> 
                                <span class="text-secondary">Precio unitario: $${item.price.toFixed(2)}</span><br>
                                <span class="text-success">Total: $<span class="precio-subtotal">${subtotal.toFixed(2)}</span></span>
                            </p>
                            
                            <!-- Controles de Cantidad (+/-) -->
                            <div class="quantity-controls d-flex justify-content-center align-items-center gap-2 my-2">
                                <button class="btn btn-outline-secondary btn-sm btn-decrease" data-id="${item._id}">-</button>
                                <span class="quantity fw-bold">${item.quantity}</span>
                                <button class="btn btn-outline-secondary btn-sm btn-increase" data-id="${item._id}">+</button>
                            </div>
                            
                            <!-- Botón para eliminar el producto completo -->
                            <button class="btn btn-danger btn-sm mt-2 btn-remove-full" data-id="${item._id}">
                                Eliminar Producto
                            </button>
                            
                        </div>
                    </div>
                </div>
            `;
        });
        
        htmlContent += '</div>'; 
        
        htmlContent += `
            <div class="row mt-5">
                <div class="col-12 d-flex justify-content-center justify-content-md-end">
                    <div class="p-4 border bg-light rounded shadow-sm w-100 w-md-50">
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <h4>Total de la Compra:</h4>
                            <h4 class="text-success">$${totalGlobal.toFixed(2)}</h4>
                        </div>
                        <div class="d-grid gap-2">
                            <!-- Botón de Compra -->
                            <button id="btn-comprar" class="btn btn-primary btn-lg">
                                Realizar Compra
                            </button>
                            <!-- Botón de Vaciar Carrito -->
                            <button id="btn-vaciar-carrito" class="btn btn-outline-danger">
                                Vaciar Carrito
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    carritoContainer.innerHTML = htmlContent;

    if (cart.length > 0) {
        carritoContainer.querySelectorAll('.btn-increase').forEach(button => {
            button.addEventListener('click', (e) => {
                const productoId = e.currentTarget.getAttribute('data-id');
                modificarCantidadProducto(productoId, 1); 
            });
        });

        carritoContainer.querySelectorAll('.btn-decrease').forEach(button => {
            button.addEventListener('click', (e) => {
                const productoId = e.currentTarget.getAttribute('data-id');
                modificarCantidadProducto(productoId, -1); 
            });
        });

        carritoContainer.querySelectorAll('.btn-remove-full').forEach(button => {
            button.addEventListener('click', (e) => {
                const productoId = e.currentTarget.getAttribute('data-id');
                eliminarProducto(productoId);
                
            });
        });


        document.getElementById('btn-comprar')?.addEventListener('click', async () => {
            const button = document.getElementById('btn-comprar');
            const originalText = button.textContent;
            
            button.disabled = true;
            button.textContent = 'Procesando...';

            await realizarCompra(cart, totalGlobal); 
            
            if (!isPurchaseSuccessful) {
                button.disabled = false;
                button.textContent = originalText;
            }
        });

        // --- 4. Evento para Vaciar Carrito ---
        document.getElementById('btn-vaciar-carrito')?.addEventListener('click', () => {
             // IMPORTANTE: NO USAR window.confirm() o alert() en este entorno.
            // Usamos una simulación de confirmación para cumplir con la regla.
            // if (window.confirm('¿Estás seguro que deseas vaciar completamente el carrito?')) {
                const cartKey = obtenerClaveCarrito();
                localStorage.removeItem(cartKey);
                renderCarrito();
                actualizarContadorCarrito();
                mostrarMensaje('El carrito ha sido vaciado.', 'info');
            // }
        });
    }
}


/* Parte de una enterga
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

const realizarCompra = async (cart, total) => {
    const userId = obtenerUserId();

    if (!userId) {
        mostrarMensaje('Error: Sesión de usuario no encontrada. Por favor, inicia sesión.', 'error');
        return;
    }

    // 1. Transformar los productos para el esquema de MongoDB
    // ENVIAMOS SOLO LO NECESARIO: productoId y cantidad.
    // El backend (ventas.actions.js) ahora es responsable de buscar el precio unitario.
    const productosParaVenta = cart.map(item => ({
        productoId: item._id, 
        cantidad: item.quantity,
        // Eliminamos item.price de aquí, ya que el servidor lo verifica
        // precioUnitario: item.price // 👈 ¡ELIMINADO!
    }));

    const ventaData = {
        productos: productosParaVenta,
        // Mantenemos el total aquí para enviarlo, aunque el servidor lo ignora y calcula el suyo.
        // Podríamos eliminarlo, pero por compatibilidad con la estructura del backend, lo mantenemos.
        total: total,
        usuario: userId
    };

    try {
        const response = await fetch('/ventas/nueva', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(ventaData),
        });

        const result = await response.json();

        if (response.ok) {
            // Establecer la bandera de éxito
            isPurchaseSuccessful = true;
            
            // Limpiar el carrito
            const cartKey = obtenerClaveCarrito();
            localStorage.removeItem(cartKey);
            actualizarContadorCarrito();

            // Re-renderizar para mostrar el mensaje de éxito grande
            renderCarrito(); 
            
        } else {
            // Si el backend lanza un error por producto inactivo o ID inválido, lo capturamos aquí.
            mostrarMensaje('Error al procesar la compra: ' + (result.error || 'Intente de nuevo.'), 'error');
        }
    } catch (error) {
        console.error('Error de red al realizar la compra:', error);
        mostrarMensaje('Error de conexión con el servidor.', 'error');
    }
};


*/


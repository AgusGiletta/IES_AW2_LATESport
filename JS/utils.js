export function mostrarMensaje(mensaje, tipo = 'info') {
    const body = document.body;
    document.querySelectorAll('.app-message-toast').forEach(toast => toast.remove());

    const messageBox = document.createElement('div');
    messageBox.textContent = mensaje;
    messageBox.className = `app-message-toast fixed bottom-4 right-4 p-3 rounded-lg shadow-xl text-white opacity-0 transition-opacity duration-300 z-50`;

    switch(tipo) {
        case 'success':
            messageBox.classList.add('bg-green-600');
            break;
        case 'error':
            messageBox.classList.add('bg-red-600');
            break;
        case 'warning':
            messageBox.classList.add('bg-yellow-500', 'text-gray-900');
            break;
        case 'info':
        default:
            messageBox.classList.add('bg-blue-600');
            break;
    }

    body.appendChild(messageBox);

    setTimeout(() => {
        messageBox.style.opacity = '1';
    }, 10);

    setTimeout(() => {
        messageBox.style.opacity = '0';
        messageBox.addEventListener('transitionend', () => messageBox.remove());
    }, 3000);
}

export function obtenerClaveCarrito() {
    const userSession = sessionStorage.getItem('user');
    if (!userSession) {
        return null;
    }
    const user = JSON.parse(userSession);
    return `carrito-user-${user.id || user._id}`; 
}

export function actualizarContadorCarrito() {
    const cartCount = document.getElementById('cart-count');
    if (!cartCount) return;

    const cartKey = obtenerClaveCarrito();
    let totalQuantity = 0;

    if (cartKey) {
        const cart = JSON.parse(localStorage.getItem(cartKey)) || [];
        totalQuantity = cart.reduce((acc, producto) => acc + producto.quantity, 0);
    }

    cartCount.textContent = totalQuantity;
}

export function setupLogoutButton() {
    const btnLogout = document.getElementById('btnLogout');
    if (btnLogout) {
        btnLogout.addEventListener('click', () => {

            const cartKey = obtenerClaveCarrito(); 

            sessionStorage.removeItem('user');
            sessionStorage.removeItem('token'); 

            if (cartKey) {
                localStorage.removeItem(cartKey);
            }
            
            actualizarContadorCarrito();

            window.location.href = 'inicio.html';
        });
    }
}

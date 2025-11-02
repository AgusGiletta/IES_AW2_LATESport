import { getNavBarComponent } from "../componentes/navbar/navbar.js"; 
import { actualizarContadorCarrito, setupLogoutButton } from "../utils.js"; 
import { renderCards, attachCardEvents } from "../componentes/cards/rendercards.js"; 
import { getProductos } from '../api/productos.js';

window.addEventListener('load', () => {
    const navContainer = document.querySelector('header');
    const pageNameInput = document.getElementById('pageName');
    const titleElement = document.getElementById('title');

    const currentPage = pageNameInput ? pageNameInput.value : '';
    const userSession = sessionStorage.getItem('user');
    const isLoggedIn = !!userSession;
    const showSessionButtons = true;

    if (navContainer) {
        navContainer.innerHTML = getNavBarComponent(showSessionButtons, isLoggedIn);
        actualizarContadorCarrito();
        
        const navLinks = navContainer.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            const linkText = link.textContent.trim();
            if (linkText === currentPage) {
                link.classList.add('fw-semibold', 'active');
            } else {
                link.classList.remove('fw-semibold', 'active');
            }
        });
    }

    if (pageNameInput && titleElement) {
        titleElement.textContent = `Bienvenido a la página de ${currentPage}`;
        document.title = `LATE Sport | ${currentPage}`;
    }

    setupLogoutButton();
    cargarTodosLosProductos();
});

const cargarTodosLosProductos = async () => {
    const containerId = 'cardContainer'; 
    const container = document.getElementById(containerId);

    if (!container) {
        return; 
    }

    try {
        const productos = await getProductos(); 
        
        if (!productos || productos.length === 0) {
            container.innerHTML = '<p class="alert alert-info">No hay productos disponibles actualmente.</p>';
            return; 
        }
        
        renderCards(productos, containerId); 
        attachCardEvents(containerId);
        
    } catch (error) {
        console.error("No se pudieron cargar los productos:", error);
        container.innerHTML = 
            '<p class="alert alert-danger">Error: No se pudieron cargar los productos del servidor.</p>';
        return; 
    }
};
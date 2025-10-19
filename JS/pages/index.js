import { getNavBarComponent } from "../componentes/navbar/navbar.js";
import { actualizarContadorCarrito } from "../../JS/utils.js";

window.addEventListener('load', () => {
  const navContainer = document.querySelector('header');
  const pageNameInput = document.getElementById('pageName');
  const titleElement = document.getElementById('title');

  const currentPage = pageNameInput ? pageNameInput.value : '';
  const userSession = sessionStorage.getItem('userData');
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

  const logoutButton = document.getElementById('btnLogout');
  if (logoutButton) {
    logoutButton.addEventListener('click', () => {
      sessionStorage.removeItem('userData');
      window.location.href = 'inicio.html';
    });
  }
});

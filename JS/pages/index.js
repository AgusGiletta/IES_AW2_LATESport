
/*
window.addEventListener('load', () => {
    const navContainer = document.querySelector('header');
    const pageNameInput = document.getElementById('pageName');
    const titleElement = document.getElementById('title');

    const currentPage = pageNameInput ? pageNameInput.value : '';

    let showSessionButtons = true;
    let isLoggedIn = false;

    if (currentPage === "Inicio") {
        showSessionButtons = true;
        isLoggedIn = false;
    } else if (currentPage === "Iniciar sesión" || currentPage === "Registrarse") {
        showSessionButtons = false;
        isLoggedIn = false;
    } else {
        showSessionButtons = true;
        isLoggedIn = true;
    }

    if (navContainer) {
        navContainer.innerHTML = getNavBarComponent(showSessionButtons, isLoggedIn);
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
            window.location.href = 'inicio.html';
        });
    }

    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault(); 

            const email = document.getElementById('email').value.trim();
            const pass = document.getElementById('pass').value.trim();

            if (email === '' || pass === '') {
                alert('Por favor completa todos los campos.');
                return;
            }
            console.log('Login exitoso simulado para:', email);
            window.location.href = 'simulacion_inicio.html';
        });
    }
});*/

/*window.addEventListener('load', () => {
    const navContainer = document.querySelector('header');
    const pageNameInput = document.getElementById('pageName');
    const titleElement = document.getElementById('title');

    const currentPage = pageNameInput ? pageNameInput.value : '';
    const userSession = sessionStorage.getItem('userData');
    const isLoggedIn = !!userSession;
    const showSessionButtons = true;

    if (navContainer) {
        navContainer.innerHTML = getNavBarComponent(showSessionButtons, isLoggedIn);
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

    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const email = document.getElementById('email').value.trim();
            const pass = document.getElementById('pass').value.trim();

            if (email === '' || pass === '') {
                alert('Por favor completa todos los campos.');
                return;
            }

            fetch('../JSON/usuarios.json')
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(usuarios => {
                    const user = usuarios.find(u => u.email === email && u.pass === pass);
                    if (user) {
                        sessionStorage.setItem('userData', JSON.stringify(user));
                        console.log('Login exitoso:', user);
                        window.location.href = 'inicio.html';
                    } else {
                        alert('Usuario o contraseña incorrectos.');
                    }
                })
                .catch(error => {
                    console.error('Error al cargar usuarios.json:', error);
                    alert('Ocurrió un error al intentar iniciar sesión.');
                });
        });
    }
});*/
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




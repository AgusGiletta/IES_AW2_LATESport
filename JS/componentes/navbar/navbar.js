/*const navElements = [
    { title: "Accesorios", link: "accesorios.html" },
    { title: "Mujer", link: "mujer.html" },
    { title: "Hombre", link: "hombre.html" },
];

export function getNavBarComponent(showSessionButtons, isLoggedIn) {
    return `
    <nav class="navbar navbar-expand-lg px-4 w-100">
      <div class="container-fluid">
        <a class="navbar-brand" href="index.html">
            <img src="../Assets/logo/Late logo_page-0001.jpg" alt="Logo Tienda Deportiva" width="100" height="70">
        </a>

        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse">
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarCollapse">
            <ul class="navbar-nav gap-3">
              <li class="nav-item"><a class="nav-link active" href="index.html">Inicio</a></li>
              ${
                navElements.map(e => `
                  <li class="nav-item">
                    <a class="nav-link" href="${e.link}">${e.title}</a>
                  </li>
                `).join("")
              }
            </ul>
        </div>
        
        <div class="d-flex ms-auto gap-2">
          ${
            showSessionButtons
              ? isLoggedIn
                ? `<button id="btnLogout" class="btn btn-outline-danger">
                    <i class="bi bi-box-arrow-right"></i> Cerrar Sesión
                   </button>`
                : `
                  <a href="iniciar_sesion.html" class="btn btn-outline-primary" id="btnLogin">
                    <i class="bi bi-box-arrow-in-right"></i> Iniciar Sesión
                  </a>
                  <a href="registro.html" class="btn btn-outline-success">
                    <i class="bi bi-person-plus"></i> Registrarse
                  </a>
                `
              : ''
          }
        </div>
      </div>
    </nav>
    `;
}*/

const navElements = [
  { title: "Accesorios", link: "accesorios.html" },
  { title: "Mujer", link: "mujer.html" },
  { title: "Hombre", link: "hombre.html" },
];

export function getNavBarComponent(showSessionButtons, isLoggedIn) {
  return `
    <nav class="navbar navbar-expand-lg px-4 w-100">
      <div class="container-fluid">
        <a class="navbar-brand" href="index.html">
          <img src="../Assets/logo/Late logo_page-0001.jpg" alt="Logo Tienda Deportiva" width="100" height="70">
        </a>

        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse">
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarCollapse">
          <ul class="navbar-nav gap-3">
            <li class="nav-item"><a class="nav-link active" href="index.html">Inicio</a></li>
            ${
              navElements.map(e => `
                <li class="nav-item">
                  <a class="nav-link" href="${e.link}">${e.title}</a>
                </li>
              `).join("")
            }
          </ul>
        </div>

        <div class="d-flex ms-auto gap-2 align-items-center">
          <a href="carrito.html" class="btn btn-outline-secondary position-relative me-3">
          <i class="bi bi-cart3"></i>
            <span id="cart-count" class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
            0
            <span class="visually-hidden">productos en el carrito</span>
            </span>
          </a>

          ${
            showSessionButtons
              ? isLoggedIn
                ? `<button id="btnLogout" class="btn btn-outline-danger">
                    <i class="bi bi-box-arrow-right"></i> Cerrar Sesión
                  </button>`
                : `
                  <a href="iniciar_sesion.html" class="btn btn-outline-primary" id="btnLogin">
                    <i class="bi bi-box-arrow-in-right"></i> Iniciar Sesión
                  </a>
                  <a href="registro.html" class="btn btn-outline-success">
                    <i class="bi bi-person-plus"></i> Registrarse
                  </a>
                `
              : ''
          }
        </div>
      </div>
    </nav>
  `;
}
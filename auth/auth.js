import { API } from "./api.js";
import { addSession } from "../Utils/sessionStorage.controller.js";

function decodeJwt(token) {
    try {
        const parts = token.split('.');
        if (parts.length !== 3) {
            console.error("Token JWT inválido: no tiene 3 partes.");
            return null;
        }
        const base64Url = parts[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload);
    } catch (e) {
        console.error("Error al decodificar el token JWT:", e);
        return null;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const formLogin = document.getElementById("loginForm");
    const alertContainer = document.getElementById("alertContainer");
    const showAlert = (message, type = "success") => {
        const wrapper = document.createElement("div");
        wrapper.innerHTML = `
            <div class="alert alert-${type} alert-dismissible fade show" role="alert">
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        `;
        alertContainer.innerHTML = "";
        alertContainer.append(wrapper);
    };
    const login = async ({ email, pass }) => {
        try {
            const res = await fetch(`${API}/usuarios/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, pass })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Error en la petición");
            return { token: data.token };
        } catch (error) {
            console.error("Error:", error);
            return { error: error.message };
        }
    };
    formLogin.addEventListener("submit", async (e) => {
        e.preventDefault();
        const submitBtn = document.getElementById("btnLogin");
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Ingresando...';
        }
        const email = document.getElementById("email").value.trim();
        const pass = document.getElementById("pass").value.trim();
        if (!email || !pass) {
            showAlert("Todos los campos son obligatorios", "warning");
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Ingresar';
            }
            return;
        }
        const result = await login({ email, pass });
        if (result.token) {
            const userPayload = decodeJwt(result.token);
            if (!userPayload) {
                showAlert("Error de autenticación: El token del servidor es inválido.", "danger");
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Ingresar';
                }
                return;
            }
            addSession(userPayload);
            sessionStorage.setItem('token', result.token);
            showAlert("¡Ingreso exitoso! Redirigiendo...", "success");
            setTimeout(() => {
                window.location.href = "index.html";
            }, 1000);
        } else {
            showAlert(result.error || "Email o contraseña incorrectos", "danger");
        }
        if (submitBtn && !result.token) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Ingresar';
        }
    });
});


/* Parte de la entrega 3
import { API } from "./api.js";
import { addSession } from "../Utils/sessionStorage.controller.js";

document.addEventListener("DOMContentLoaded", () => {
  const formLogin = document.getElementById("loginForm");
  const alertContainer = document.getElementById("alertContainer");

  // Función para mostrar alertas dinámicas de Bootstrap
  const showAlert = (message, type = "success") => {
    const wrapper = document.createElement("div");
    wrapper.innerHTML = `
      <div class="alert alert-${type} alert-dismissible fade show" role="alert">
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>
    `;
    alertContainer.innerHTML = ""; // Limpiar alertas anteriores
    alertContainer.append(wrapper);
  };

  // Función para autenticar usuario
  const login = async ({ email, pass }) => {
    try {
      const res = await fetch(`${API}/usuarios/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, pass })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error en la petición");

      return data;
    } catch (error) {
      console.error("Error:", error);
      return { error: error.message };
    }
  };

  // Evento submit del formulario
  formLogin.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const pass = document.getElementById("pass").value.trim();

    if (!email || !pass) {
      showAlert("Todos los campos son obligatorios", "warning");
      return;
    }

    const result = await login({ email, pass });

    if (result.usuario) {
      showAlert(result.mensaje, "success");
      addSession(result.usuario);
      setTimeout(() => {
        window.location.href = "index.html";
      }, 1000);
    } else {
      showAlert(result.error || "Email o contraseña incorrectos", "danger");
    }
  });
});

ver si el nuevo codigo funciona cancelar este
document.addEventListener("DOMContentLoaded", () => {
  const formLogin = document.getElementById("loginForm");
  const alertContainer = document.getElementById("alertContainer");

  const showAlert = (message, type = "success") => {
    const wrapper = document.createElement("div");
    wrapper.innerHTML = `
      <div class="alert alert-${type} alert-dismissible fade show" role="alert">
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>
    `;
    alertContainer.innerHTML = ""; 
    alertContainer.append(wrapper);
  };

  const login = async ({ email, pass }) => {
    try {
      const res = await fetch(`${API}/usuarios/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, pass })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error en la petición");

      return { token: data.token }; 
      
    } catch (error) {
      console.error("Error:", error);
      return { error: error.message };
    }
  };

  formLogin.addEventListener("submit", async (e) => {
    e.preventDefault();
    const submitBtn = document.getElementById("btnLogin");
    
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Ingresando...';
    }


    const email = document.getElementById("email").value.trim();
    const pass = document.getElementById("pass").value.trim();

    if (!email || !pass) {
      showAlert("Todos los campos son obligatorios", "warning");
      if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Ingresar';
      }
      return;
    }

    const result = await login({ email, pass });

    if (result.token) {
        const userPayload = decodeJwt(result.token);

        if (!userPayload) {
            showAlert("Error de autenticación: El token del servidor es inválido.", "danger");
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Ingresar';
            }
            return;
        }
        
        addSession(userPayload); 
        
        sessionStorage.setItem('token', result.token);

        showAlert("¡Ingreso exitoso! Redirigiendo...", "success");
        
        setTimeout(() => {
            window.location.href = "index.html"; 
        }, 1000);
    } else {
      showAlert(result.error || "Email o contraseña incorrectos", "danger");
    }

    if (submitBtn && !result.token) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Ingresar';
    }
  });
});

*/



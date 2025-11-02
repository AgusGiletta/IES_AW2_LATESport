/*import { API } from "./api.js";
import { addSession } from "../Utils/sessionStorage.controller.js";

document.addEventListener("DOMContentLoaded", () => {
  const btnLogin = document.getElementById("btnLogin");
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

  //Función para autenticar usuario 
  const auth = async ({ email, pass }) => {
    try {
      const res = await fetch(`${API}/usuarios/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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

  // Evento del botón
  btnLogin.addEventListener("click", async (e) => {
   e.preventDefault();

    const email = document.getElementById('email').value.trim();
    const pass = document.getElementById('pass').value.trim();

    if (!email || !pass) {
      showAlert("Todos los campos son obligatorios", "warning");
    return;
    }

    const result = await auth({ email, pass });

    if (result.usuario) {
    showAlert(result.mensaje, "success");
    addSession(result.usuario); 
    // Redirigir después de 1 segundo
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 1000);
    } else {
    showAlert(result.error || "Email o contraseña incorrectos", "danger");
  }
});
});/*

// monorepo
/*
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
  };*/

// auth.js
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

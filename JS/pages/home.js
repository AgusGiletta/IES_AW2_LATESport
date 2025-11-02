import { setupLogoutButton } from "../../utils.js";

const getUserData = (key) => {
    return JSON.parse(sessionStorage.getItem(key));
}

window.addEventListener('load', () => {
    const userInfo = getUserData('user'); 

    if (!userInfo) {
        alert("Necesitás iniciar sesión primero.");
        window.location.href = "iniciar_sesion.html";
        return;
    }

    if (userInfo.nombre) {
        const bienvenida = document.createElement('h2');
        bienvenida.textContent = `¡Hola, ${userInfo.nombre}!`;
        document.querySelector('.centered-title').prepend(bienvenida);
    }

    console.log(userInfo);

    const userContainer = document.getElementById('userContainer');
    const card = userCard(userInfo);

    userContainer.innerHTML = card;
    setupLogoutButton('logout'); 
});

function userCard(user) {
    return `
        <div class="alert alert-info text-center">
            Bienvenido/a <strong>${user.nombre} ${user.apellido}</strong> <br>
            Usuario: ${user.usuario} - Email: ${user.email}
        </div>
    `;
}


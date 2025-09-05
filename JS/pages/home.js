const getUserData = (key) => {
    return JSON.parse(sessionStorage.getItem(key));
}

const logOut = (key) => {
    sessionStorage.removeItem(key);
}

window.addEventListener('load', () => {
    const userInfo = getUserData('userData'); 

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

    document.getElementById('logout').addEventListener('click', () => {
        logOut('userData');
        window.location.href = 'index.html';
    });
});

function userCard(user) {
    return `
        <div class="alert alert-info text-center">
            Bienvenido/a <strong>${user.nombre} ${user.apellido}</strong> <br>
            Usuario: ${user.usuario} - Email: ${user.email}
        </div>
    `;
}


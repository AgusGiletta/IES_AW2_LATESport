// login.js

window.addEventListener('load', () => {
  const form = document.getElementById('loginForm');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const emailInput = form.email.value.trim();
    const passInput = form.pass.value;

    try {
      const res = await fetch('../JSON/usuarios.json');
      if (!res.ok) throw new Error('No se pudo cargar la lista de usuarios');

      const usuarios = await res.json();
      // Cambié u.pass por u.contraseña para que coincida con tu JSON
      const user = usuarios.find(u => u.email === emailInput && u.contraseña === passInput);

      if (user) {
        sessionStorage.setItem('userData', JSON.stringify(user));
        alert(`¡Bienvenido/a ${user.nombre}!`);
        window.location.href = 'index.html'; 
      } else {
        alert('Correo o contraseña incorrectos.');
      }

    } catch (error) {
      console.error('Error en login:', error);
      alert('Error al intentar iniciar sesión. Intente más tarde.');
    }
  });
});


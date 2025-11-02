function mostrarFeedback(mensaje, esExito = true) {
    const feedbackDiv = document.getElementById('mensajeFeedback');

    feedbackDiv.innerHTML = ''; 
    if (!feedbackDiv) return;

    feedbackDiv.innerHTML = `
        <div class="alert alert-${esExito ? 'success' : 'danger'} alert-dismissible fade show" role="alert">
            ${mensaje}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;
}


document.addEventListener('DOMContentLoaded', () => {
    const registroForm = document.getElementById('registroForm');
    if (!registroForm) return;

    registroForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        document.getElementById('mensajeFeedback').innerHTML = ''; 

        const form = event.target;
        const pass = form.elements.pass.value;
        const confPass = form.elements.conf_pass.value;

        if (pass !== confPass) {
            mostrarFeedback("Las contraseñas no coinciden. Por favor, revísalas.", false);
            return;
        }

        const userData = {
            nombre: form.elements.nombre.value,
            apellido: form.elements.apellido.value,
            usuario: form.elements.usuario.value, 
            email: form.elements.email.value,
            contraseña: pass, 
        };

        try {
            const res = await fetch('/usuarios/nuevo', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            let data = {};
            try {
                data = await res.json();
            } catch (jsonError) {
                if (!res.ok) {
                    throw new Error(`Error en el servidor: HTTP ${res.status}`);
                }
            }

            if (res.ok) {
                mostrarFeedback(data.mensaje || "¡Usuario registrado con éxito! Redirigiendo para iniciar sesión...", true);
                form.reset();

                setTimeout(() => {
                    window.location.href = 'iniciar_sesion.html';
                }, 2000);

            } else {
                mostrarFeedback(data.error || `Error ${res.status}: Fallo al registrar el usuario.`, false);
            }

        } catch (error) {
            console.error('Error de red o del servidor:', error);
            mostrarFeedback("No se pudo conectar con el servidor. Inténtalo más tarde.", false);
        }
    });
});
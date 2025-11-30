// Manejo de la bienvenida en index.html
// Reutiliza evaluarEdad de edad.js para mostrar el estado del usuario

function initBienvenida() {
    const form = document.getElementById('formBienvenida');
    const saludo = document.getElementById('saludoPersonalizado');
    const resumen = document.getElementById('resumenSitio');

    if (!form) return;

    const nombreInput = form.elements['nombre'];
    const apellidoInput = form.elements['apellido'];
    const edadInput = form.elements['edad'];

    const guardado = JSON.parse(localStorage.getItem('usuarioTP4') || 'null');
    if (guardado) {
        nombreInput.value = guardado.nombre;
        apellidoInput.value = guardado.apellido;
        edadInput.value = guardado.edad;
        mostrarSaludo(guardado, saludo, resumen);
    }

    form.addEventListener('submit', (ev) => {
        ev.preventDefault();
        const persona = {
            nombre: nombreInput.value.trim(),
            apellido: apellidoInput.value.trim(),
            edad: Number(edadInput.value)
        };

        if (!persona.nombre || !persona.apellido) {
            renderEstadoEdad('estadoEdad', { tipo: 'error', texto: 'Completá nombre y apellido antes de ingresar.' });
            return;
        }

        const estado = evaluarEdad(persona.edad);
        renderEstadoEdad('estadoEdad', estado);

        localStorage.setItem('usuarioTP4', JSON.stringify(persona));
        mostrarSaludo(persona, saludo, resumen);
    });
}

function mostrarSaludo(persona, nodoSaludo, nodoResumen) {
    if (!nodoSaludo) return;

    nodoSaludo.innerHTML = `
        <h3>¡Hola ${persona.nombre} ${persona.apellido}! 👋</h3>
        <p>${evaluarEdad(persona.edad).texto}</p>
    `;
    nodoSaludo.classList.remove('hidden');

    if (nodoResumen) {
        nodoResumen.classList.remove('hidden');
    }
}

document.addEventListener('DOMContentLoaded', initBienvenida);

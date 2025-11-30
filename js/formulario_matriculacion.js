// Lógica para el formulario de matriculación

function initMatriculacion() {
    const form = document.getElementById('formMatriculacion');
    const resumen = document.getElementById('resumenMatriculacion');
    const progreso = document.getElementById('progresoMatriculacion');
    if (!form || !resumen) return;

    const campos = Array.from(form.querySelectorAll('input, select'));

    const actualizarProgreso = () => {
        const completados = campos.filter((c) => c.value.trim()).length;
        const porcentaje = Math.round((completados / campos.length) * 100);
        progreso.style.width = `${porcentaje}%`;
        progreso.textContent = `${porcentaje}% completado`;
    };

    campos.forEach((campo) => campo.addEventListener('input', actualizarProgreso));

    form.addEventListener('submit', (ev) => {
        ev.preventDefault();
        if (!form.checkValidity()) {
            resumen.innerHTML = '<p class="alert alert-danger">Revisa los campos obligatorios.</p>';
            return;
        }

        const datos = Object.fromEntries(new FormData(form).entries());
        resumen.innerHTML = `
            <div class="card">
                <h3>Resumen de Inscripción</h3>
                <p><strong>Estudiante:</strong> ${datos.nombre} ${datos.apellido}</p>
                <p><strong>DNI:</strong> ${datos.dni}</p>
                <p><strong>Carrera:</strong> ${datos.carrera}</p>
                <p><strong>Turno:</strong> ${datos.turno}</p>
                <p><strong>Modalidad:</strong> ${datos.modalidad}</p>
            </div>
        `;
        form.reset();
        actualizarProgreso();
    });

    actualizarProgreso();
}

document.addEventListener('DOMContentLoaded', initMatriculacion);

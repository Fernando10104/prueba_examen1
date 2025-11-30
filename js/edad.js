// Utilidades para evaluar edades y mostrar mensajes consistentes

function evaluarEdad(valor) {
    const edad = Number(valor);

    if (Number.isNaN(edad) || edad <= 0) {
        return {
            tipo: 'error',
            texto: 'Por favor ingresa una edad válida.'
        };
    }

    if (edad >= 20) {
        return {
            tipo: 'mayor',
            texto: 'Es mayor de edad (+20).'
        };
    }

    if (edad === 20) {
        return {
            tipo: 'borde',
            texto: 'Tiene exactamente 20 años.'
        };
    }

    return {
        tipo: 'menor',
        texto: 'Es menor de edad (-20).'
    };
}

// Helper para pintar mensajes en un contenedor
function renderEstadoEdad(elementId, resultado) {
    const nodo = document.getElementById(elementId);
    if (!nodo) return;

    const baseClass = 'alert ';
    const tipoClass = {
        error: 'alert-danger',
        mayor: 'alert-success',
        menor: 'alert-warning',
        borde: 'alert-info'
    }[resultado.tipo] || 'alert-info';

    nodo.className = baseClass + tipoClass;
    nodo.textContent = resultado.texto;
}

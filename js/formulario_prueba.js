// Manejo del formulario de simulacro de evaluación

function initPrueba() {
    const form = document.getElementById('formPrueba');
    const salida = document.getElementById('resultadoPrueba');
    if (!form || !salida) return;

    const respuestas = {
        pregunta1: 'html',
        pregunta2: 'css-grid',
        pregunta3: 'async',
        pregunta4: 'api-rest'
    };

    form.addEventListener('submit', (ev) => {
        ev.preventDefault();
        const datos = new FormData(form);
        let aciertos = 0;
        Object.entries(respuestas).forEach(([clave, valor]) => {
            if (datos.get(clave) === valor) aciertos++;
        });

        const puntaje = Math.round((aciertos / Object.keys(respuestas).length) * 100);
        const mensaje = puntaje >= 75 ? '¡Excelente! Listo para la entrega.' : 'Repasemos algunos temas más.';

        salida.innerHTML = `
            <div class="card">
                <h3>Resultado: ${puntaje}%</h3>
                <p>${mensaje}</p>
                <p>Aciertos: ${aciertos} / ${Object.keys(respuestas).length}</p>
            </div>
        `;

        form.reset();
    });
}

document.addEventListener('DOMContentLoaded', initPrueba);

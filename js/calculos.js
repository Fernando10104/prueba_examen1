// Funciones utilitarias para páginas de operaciones y banco

function initCalculos() {
    registrarOperacionesBasicas();
    registrarCalculadoraFinanciera();
    renderizarTablaBanco();
}

function registrarOperacionesBasicas() {
    const form = document.getElementById('formOperacionesBasicas');
    const salida = document.getElementById('resultadoOperaciones');
    if (!form || !salida) return;

    form.addEventListener('submit', (ev) => {
        ev.preventDefault();
        resolverOperacion(form, salida);
    });
}

function resolverOperacion(form, salida) {
    const a = Number(form.elements['numeroA'].value);
    const b = Number(form.elements['numeroB'].value);

    if (Number.isNaN(a) || Number.isNaN(b)) {
        salida.innerHTML = '<p class="alert alert-danger">Ingresá dos números válidos.</p>';
        return;
    }

    const operaciones = [
        { etiqueta: 'Suma', valor: a + b },
        { etiqueta: 'Resta', valor: a - b },
        { etiqueta: 'Multiplicación', valor: a * b },
        { etiqueta: 'División', valor: b !== 0 ? (a / b).toFixed(2) : 'No se puede dividir por 0' },
        { etiqueta: 'Potencia', valor: (a ** b).toPrecision(4) },
        { etiqueta: 'Promedio', valor: ((a + b) / 2).toFixed(2) }
    ];

    salida.innerHTML = `
        <div class="cards-list">
            ${operaciones.map(op => `
                <div class="card">
                    <p class="muted">${op.etiqueta}</p>
                    <strong>${op.valor}</strong>
                </div>
            `).join('')}
        </div>
    `;
}

function registrarCalculadoraFinanciera() {
    const form = document.getElementById('formFinanzas');
    const salida = document.getElementById('resumenFinanciero');
    if (!form || !salida) return;

    form.addEventListener('submit', (ev) => {
        ev.preventDefault();
        const capital = Number(form.elements['capital'].value);
        const tasa = Number(form.elements['tasa'].value) / 100;
        const meses = Number(form.elements['meses'].value);

        if ([capital, tasa, meses].some(Number.isNaN)) {
            salida.innerHTML = '<p class="alert alert-danger">Completa todos los campos.</p>';
            return;
        }

        const interes = capital * tasa * (meses / 12);
        const monto = capital + interes;
        const cuota = monto / meses;

        salida.innerHTML = `
            <div class="cards-list">
                <div class="card">
                    <p>Interés simple estimado</p>
                    <strong>$${interes.toFixed(2)}</strong>
                </div>
                <div class="card">
                    <p>Monto total a pagar</p>
                    <strong>$${monto.toFixed(2)}</strong>
                </div>
                <div class="card">
                    <p>Cuota mensual aproximada</p>
                    <strong>$${cuota.toFixed(2)}</strong>
                </div>
            </div>
        `;
    });
}

function renderizarTablaBanco() {
    const tabla = document.getElementById('tablaBanco');
    if (!tabla) return;

    const clientes = [
        { nombre: 'Ana López', dni: '22.456.789', tipo: 'Cuenta Corriente', saldo: 420000 },
        { nombre: 'Bruno Díaz', dni: '30.112.543', tipo: 'Caja de Ahorro', saldo: 150000 },
        { nombre: 'Cecilia Mora', dni: '35.654.112', tipo: 'Cuenta Sueldo', saldo: 98000 },
        { nombre: 'Diego Pérez', dni: '27.432.987', tipo: 'Cuenta Corriente', saldo: 870000 },
        { nombre: 'Elena Ríos', dni: '18.765.123', tipo: 'Caja de Ahorro', saldo: 64000 }
    ];

    tabla.querySelector('tbody').innerHTML = clientes.map((cliente, idx) => `
        <tr>
            <td>${idx + 1}</td>
            <td>${cliente.nombre}</td>
            <td>${cliente.dni}</td>
            <td>${cliente.tipo}</td>
            <td>$${cliente.saldo.toLocaleString('es-AR')}</td>
        </tr>
    `).join('');
}

document.addEventListener('DOMContentLoaded', initCalculos);

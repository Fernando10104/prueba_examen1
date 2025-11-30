// Script centralizado para todas las integraciones con APIs y widgets multimedia
const API_KEYS = {
    clima: '01ba0c41c462903702793a25fd7118cd' // Reemplazable por tu propia key
};

const API_ENDPOINTS = {
    clima: 'https://api.openweathermap.org/data/2.5/weather',
    climaBackup: 'https://wttr.in',
    paises: 'https://restcountries.com/v3.1/name/',
    pokemon: 'https://pokeapi.co/api/v2/pokemon/',
    rick: 'https://rickandmortyapi.com/api/character/',
    cripto: 'https://api.coingecko.com/api/v3/coins/'
};

document.addEventListener('DOMContentLoaded', () => {
    const page = document.body.dataset.page;

    const acciones = {
        clima: initClima,
        paises: initPaises,
        pokemon: initPokemon,
        'rick-morty': initRick,
        criptomonedas: initCripto,
        galeria: initGaleria,
        multimedia: initMultimedia,
        redsocial: initRedSocial,
        comentarios: initComentarios,
        noticias: initComentarios
    };

    if (acciones[page]) acciones[page]();
});

/* ================= CLIMA ================= */
function initClima() {
    const form = document.getElementById('formClima');
    const salida = document.getElementById('salidaClima');
    if (!form || !salida) return;

    form.addEventListener('submit', async (ev) => {
        ev.preventDefault();
        const ciudad = form.elements['ciudad'].value.trim();
        if (!ciudad) {
            salida.innerHTML = '<p class="alert alert-danger">Escribe una ciudad.</p>';
            return;
        }
        salida.innerHTML = '<p class="alert alert-info">Buscando clima...</p>';

        try {
            const url = `${API_ENDPOINTS.clima}?q=${encodeURIComponent(ciudad)}&appid=${API_KEYS.clima}&units=metric&lang=es`;
            const data = await fetchJson(url);
            renderClima(data, salida);
        } catch (error) {
            const backup = await fetch(`${API_ENDPOINTS.climaBackup}/${encodeURIComponent(ciudad)}?format=j1`)
                .then((r) => r.json());
            renderClimaBackup(backup, ciudad, salida);
        }
    });
}

function renderClima(data, contenedor) {
    contenedor.innerHTML = `
        <div class="card">
            <h3>${data.name}, ${data.sys.country}</h3>
            <p>Clima: ${data.weather[0].description}</p>
            <div class="grid grid-2" style="margin-top: 16px;">
                <div>
                    <strong>Temperatura</strong>
                    <p>${Math.round(data.main.temp)} °C</p>
                </div>
                <div>
                    <strong>Humedad</strong>
                    <p>${data.main.humidity}%</p>
                </div>
                <div>
                    <strong>Viento</strong>
                    <p>${data.wind.speed} m/s</p>
                </div>
                <div>
                    <strong>Presión</strong>
                    <p>${data.main.pressure} hPa</p>
                </div>
            </div>
        </div>
    `;
}

function renderClimaBackup(data, ciudad, contenedor) {
    const current = data.current_condition?.[0];
    contenedor.innerHTML = `
        <div class="card">
            <h3>${ciudad} (API alternativa)</h3>
            <p>${current?.lang_es?.[0]?.value || current?.weatherDesc?.[0]?.value || 'Sin datos'}</p>
            <div class="grid grid-2">
                <div><strong>Temp.</strong><p>${current?.temp_C ?? '-'} °C</p></div>
                <div><strong>Humedad</strong><p>${current?.humidity ?? '-'}%</p></div>
            </div>
        </div>
    `;
}

/* ================= PAISES ================= */
function initPaises() {
    const form = document.getElementById('formPaises');
    const salida = document.getElementById('salidaPaises');
    if (!form || !salida) return;

    form.addEventListener('submit', async (ev) => {
        ev.preventDefault();
        const nombre = form.elements['pais'].value.trim();
        if (!nombre) {
            salida.innerHTML = '<p class="alert alert-danger">Ingresa el nombre de un país.</p>';
            return;
        }

        salida.innerHTML = '<p class="alert alert-info">Buscando país...</p>';
        try {
            const data = await fetchJson(`${API_ENDPOINTS.paises}${encodeURIComponent(nombre)}?fullText=false`);
            renderPais(data[0], salida);
        } catch (error) {
            salida.innerHTML = '<p class="alert alert-danger">No se encontró el país solicitado.</p>';
        }
    });
}

function renderPais(pais, contenedor) {
    const idiomas = pais.languages ? Object.values(pais.languages).join(', ') : 'N/D';
    const monedas = pais.currencies ? Object.values(pais.currencies).map((c) => c.name).join(', ') : 'N/D';

    contenedor.innerHTML = `
        <div class="card">
            <div class="flex" style="align-items:center;">
                <img src="${pais.flags.svg}" alt="Bandera de ${pais.name.common}" style="width:160px;">
                <div>
                    <h3>${pais.name.common}</h3>
                    <p>${pais.name.official}</p>
                </div>
            </div>
            <div class="grid grid-2" style="margin-top: 20px;">
                <div><strong>Capital</strong><p>${pais.capital?.[0] ?? 'N/D'}</p></div>
                <div><strong>Población</strong><p>${pais.population.toLocaleString('es-AR')}</p></div>
                <div><strong>Región</strong><p>${pais.region}</p></div>
                <div><strong>Subregión</strong><p>${pais.subregion ?? 'N/D'}</p></div>
                <div><strong>Idiomas</strong><p>${idiomas}</p></div>
                <div><strong>Monedas</strong><p>${monedas}</p></div>
            </div>
        </div>
    `;
}

/* ================= POKÉMON ================= */
function initPokemon() {
    const form = document.getElementById('formPokemon');
    const salida = document.getElementById('salidaPokemon');
    if (!form || !salida) return;

    form.addEventListener('submit', async (ev) => {
        ev.preventDefault();
        const pokemon = form.elements['pokemon'].value.trim().toLowerCase();
        if (!pokemon) {
            salida.innerHTML = '<p class="alert alert-danger">Escribe un nombre o ID.</p>';
            return;
        }

        salida.innerHTML = '<p class="alert alert-info">Buscando Pokémon...</p>';
        try {
            const data = await fetchJson(`${API_ENDPOINTS.pokemon}${pokemon}`);
            renderPokemon(data, salida);
        } catch (error) {
            salida.innerHTML = '<p class="alert alert-danger">Pokémon no encontrado.</p>';
        }
    });
}

function renderPokemon(data, contenedor) {
    const tipos = data.types.map((t) => t.type.name).join(', ');
    const habilidades = data.abilities.map((a) => a.ability.name).join(', ');
    const stats = data.stats.map((item) => `<li>${item.stat.name}: ${item.base_stat}</li>`).join('');

    contenedor.innerHTML = `
        <div class="card">
            <div class="center">
                <img src="${data.sprites.other['official-artwork'].front_default}" alt="${data.name}">
            </div>
            <h3>${data.name.toUpperCase()} (#${data.id})</h3>
            <div class="grid grid-2" style="margin-top:16px;">
                <div><strong>Peso</strong><p>${data.weight / 10} kg</p></div>
                <div><strong>Altura</strong><p>${data.height / 10} m</p></div>
                <div><strong>Tipos</strong><p>${tipos}</p></div>
                <div><strong>Experiencia</strong><p>${data.base_experience}</p></div>
            </div>
            <p><strong>Habilidades:</strong> ${habilidades}</p>
            <h4 style="margin-top:16px;">Estadísticas</h4>
            <ul>${stats}</ul>
        </div>
    `;
}

/* ================= RICK & MORTY ================= */
function initRick() {
    const form = document.getElementById('formRick');
    const salida = document.getElementById('salidaRick');
    const btnRandom = document.getElementById('btnRickRandom');
    if (!form || !salida) return;

    const buscar = async (valor) => {
        if (!valor) {
            salida.innerHTML = '<p class="alert alert-danger">Ingresa un ID entre 1 y 826.</p>';
            return;
        }
        salida.innerHTML = '<p class="alert alert-info">Buscando personaje...</p>';
        try {
            const data = await fetchJson(`${API_ENDPOINTS.rick}${valor}`);
            renderRick(data, salida);
        } catch (error) {
            salida.innerHTML = '<p class="alert alert-danger">No se encontró el personaje.</p>';
        }
    };

    form.addEventListener('submit', (ev) => {
        ev.preventDefault();
        buscar(form.elements['personaje'].value.trim());
    });

    btnRandom?.addEventListener('click', () => {
        const random = Math.floor(Math.random() * 826) + 1;
        form.elements['personaje'].value = random;
        buscar(random);
    });
}

function renderRick(data, contenedor) {
    contenedor.innerHTML = `
        <div class="card">
            <div class="center"><img src="${data.image}" alt="${data.name}" style="max-width:280px;"></div>
            <h3>${data.name}</h3>
            <div class="grid grid-2" style="margin-top:20px;">
                <div><strong>Estado</strong><p>${data.status}</p></div>
                <div><strong>Especie</strong><p>${data.species}</p></div>
                <div><strong>Género</strong><p>${data.gender}</p></div>
                <div><strong>Origen</strong><p>${data.origin.name}</p></div>
                <div><strong>Última ubicación</strong><p>${data.location.name}</p></div>
                <div><strong>Episodios</strong><p>${data.episode.length}</p></div>
            </div>
        </div>
    `;
}

/* ================= CRIPTOMONEDAS ================= */
function initCripto() {
    const form = document.getElementById('formCripto');
    const salida = document.getElementById('salidaCripto');
    if (!form || !salida) return;

    form.addEventListener('submit', async (ev) => {
        ev.preventDefault();
        const id = form.elements['cripto'].value;
        salida.innerHTML = '<p class="alert alert-info">Consultando CoinGecko...</p>';
        try {
            const data = await fetchJson(`${API_ENDPOINTS.cripto}${id}?localization=false&tickers=false&community_data=false&developer_data=false`);
            renderCripto(data, salida);
        } catch (error) {
            salida.innerHTML = '<p class="alert alert-danger">No se pudo obtener la cotización.</p>';
        }
    });

    form.dispatchEvent(new Event('submit'));
}

function renderCripto(data, contenedor) {
    const mkt = data.market_data;
    contenedor.innerHTML = `
        <div class="card">
            <div class="flex" style="align-items:center;">
                <img src="${data.image.large}" alt="${data.name}" style="width:120px;">
                <div>
                    <h3>${data.name} (${data.symbol.toUpperCase()})</h3>
                    <p>Ranking #${data.market_cap_rank}</p>
                </div>
            </div>
            <div class="grid grid-2" style="margin-top: 20px;">
                <div><strong>Precio USD</strong><p>$${mkt.current_price.usd.toLocaleString('es-AR')}</p></div>
                <div><strong>Cambio 24h</strong><p style="color:${mkt.price_change_percentage_24h >= 0 ? 'var(--success)' : 'var(--danger)'};">${mkt.price_change_percentage_24h.toFixed(2)}%</p></div>
                <div><strong>Máx 24h</strong><p>$${mkt.high_24h.usd.toLocaleString('es-AR')}</p></div>
                <div><strong>Mín 24h</strong><p>$${mkt.low_24h.usd.toLocaleString('es-AR')}</p></div>
                <div><strong>Market Cap</strong><p>$${mkt.market_cap.usd.toLocaleString('es-AR')}</p></div>
                <div><strong>Volumen</strong><p>$${mkt.total_volume.usd.toLocaleString('es-AR')}</p></div>
            </div>
        </div>
    `;
}

/* ================= CONTENIDO DINÁMICO ADICIONAL ================= */
function initGaleria() {
    const imagenes = document.querySelectorAll('[data-galeria] img');
    imagenes.forEach((img) => {
        img.addEventListener('click', () => {
            document.getElementById('focoGaleria').innerHTML = `
                <div class="card">
                    <img src="${img.src}" alt="${img.alt}">
                    <p>${img.alt}</p>
                </div>`;
        });
    });
}

function initMultimedia() {
    const players = document.querySelectorAll('video, audio');
    players.forEach((media) => {
        media.addEventListener('play', () => {
            players.forEach((other) => {
                if (other !== media) other.pause();
            });
        });
    });
}

function initRedSocial() {
    initLikes();
}

function initComentarios() {
    initLikes();
}

function initLikes() {
    document.querySelectorAll('[data-like]').forEach((btn) => {
        btn.addEventListener('click', () => {
            const count = Number(btn.dataset.like);
            const activo = btn.classList.toggle('active');
            btn.dataset.like = activo ? count + 1 : count - 1;
            btn.querySelector('span').textContent = btn.dataset.like;
        });
    });
}

async function fetchJson(url) {
    const resp = await fetch(url);
    if (!resp.ok) throw new Error('Error en la solicitud');
    return resp.json();
}

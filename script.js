document.addEventListener('DOMContentLoaded', () => {
    // Contenedores
    const gridContainer = document.getElementById('grid-container');
    const activitiesContainer = document.getElementById('activities-container');
    const logoButton = document.querySelector('.logo-button');
    const gridItems = document.querySelectorAll('.grid-item');

    // Menús para cada casilla
    const menus = {
        actividades: {
            title: "Actividades",
            items: [
                "Juegos interactivos",
                "Talleres creativos",
                "Retos semanales",
                "Charlas en vivo",
                "Exploración de intereses"
            ]
        },
        ruleta: {
            title: "Ruleta",
            items: [
                "Reto 1: Haz una mueca divertida",
                "Reto 2: Cuenta un chiste",
                "Reto 3: Haz 5 saltos",
                "Reto 4: Abrazo en familia",
                "Reto 5: Dibuja algo juntos",
                "Reto 6: Baila 10 segundos"
            ]
        },
        logros: {
            title: "Logros",
            items: [
                "Desbloquea insignias",
                "Historial de logros",
                "Ranking de usuarios"
            ]
        },
        clasificacion: {
            title: "Clasificación",
            items: [
                "Top semanal",
                "Top mensual",
                "Ranking global"
            ]
        },
        "actividades semanales": {
            title: "Actividades semanales",
            items: [
                "Reto de la semana",
                "Actividad colaborativa",
                "Premios semanales"
            ]
        },
        "mini guía (200€)": {
            title: "Mini guía (200€)",
            items: [
                "Consejos para ganar",
                "Guía de uso",
                "Preguntas frecuentes"
            ]
        }
    };

    // Mostrar la vista principal (cuadrícula)
    function showGridView() {
        gridContainer.classList.remove('hidden');
        activitiesContainer.classList.add('hidden');
    }

    // Mostrar el menú correspondiente
    function showMenu(menuKey) {
        const menu = menus[menuKey];
        if (!menu) return;

        // Si es la ruleta, muestra la ruleta interactiva
        if (menuKey === "ruleta") {
            activitiesContainer.innerHTML = `
                <div class="activities-menu">
                    <h2 class="activities-title">${menu.title}</h2>
                    <div id="roulette-container" style="display:flex;flex-direction:column;align-items:center;">
                        <canvas id="roulette-canvas" width="300" height="300"></canvas>
                        <button id="spin-btn" style="margin-top:20px;padding:10px 30px;font-size:1.2em;cursor:pointer;">¡Girar!</button>
                        <div id="roulette-result" style="margin-top:20px;font-size:1.3em;font-weight:bold;" aria-live="polite"></div>
                    </div>
                </div>
            `;
            drawRoulette(menu.items);

            let spinning = false;
            const spinBtn = document.getElementById('spin-btn');
            spinBtn.onclick = () => {
                if (spinning) return;
                spinning = true;
                spinBtn.disabled = true;
                document.getElementById('roulette-result').textContent = "";
                spinRoulette(menu.items, () => {
                    spinning = false;
                    spinBtn.disabled = false;
                });
            };
            gridContainer.classList.add('hidden');
            activitiesContainer.classList.remove('hidden');
            return;
        }

        // Menú normal
        activitiesContainer.innerHTML = `
            <div class="activities-menu">
                <h2 class="activities-title">${menu.title}</h2>
                <ul class="activities-list">
                    ${menu.items.map(item => `<li>${item}</li>`).join('')}
                </ul>
            </div>
        `;
        gridContainer.classList.add('hidden');
        activitiesContainer.classList.remove('hidden');
    }

    // Evento para el logo
    if (logoButton) {
        logoButton.addEventListener('click', (event) => {
            event.preventDefault();
            showGridView();
        });
    }

    // Función para manejar la acción de un grid-item
    function handleGridItemAction(item) {
        let page = item.getAttribute('data-page');
        // Normalizar el texto para coincidir con las claves del objeto menus
        if (page === 'placeholder') {
            page = item.textContent.trim().toLowerCase();
        }
        showMenu(page);
    }

    // Eventos para los grid-items (click y teclado)
    gridItems.forEach(item => {
        item.addEventListener('click', () => handleGridItemAction(item));
        item.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleGridItemAction(item);
            }
        });
    });

    // Dibuja la ruleta
    function drawRoulette(options) {
        const canvas = document.getElementById('roulette-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const size = canvas.width;
        const center = size / 2;
        const radius = center - 10;
        const angleStep = (2 * Math.PI) / options.length;
        const colors = ['#FF9800', '#FFC107', '#4CAF50', '#03A9F4', '#E91E63', '#9C27B0', '#8BC34A', '#FF5722'];

        ctx.clearRect(0, 0, size, size);

        for (let i = 0; i < options.length; i++) {
            ctx.beginPath();
            ctx.moveTo(center, center);
            ctx.arc(center, center, radius, i * angleStep, (i + 1) * angleStep);
            ctx.closePath();
            ctx.fillStyle = colors[i % colors.length];
            ctx.fill();

            // Texto
            ctx.save();
            ctx.translate(center, center);
            ctx.rotate(i * angleStep + angleStep / 2);
            ctx.textAlign = "right";
            ctx.fillStyle = "#fff";
            ctx.font = "bold 16px Segoe UI";
            ctx.fillText(options[i], radius - 20, 8);
            ctx.restore();
        }

        // Flecha
        ctx.beginPath();
        ctx.moveTo(center, center - radius + 5);
        ctx.lineTo(center - 15, center - radius - 20);
        ctx.lineTo(center + 15, center - radius - 20);
        ctx.closePath();
        ctx.fillStyle = "#212529";
        ctx.fill();
    }

    // Gira la ruleta y muestra confeti
    function spinRoulette(options, onDone) {
        const canvas = document.getElementById('roulette-canvas');
        const ctx = canvas.getContext('2d');
        const spins = Math.floor(Math.random() * 3) + 5; // 5-7 vueltas
        const angleStep = (2 * Math.PI) / options.length;
        const randomIndex = Math.floor(Math.random() * options.length);
        const finalAngle = (2 * Math.PI * spins) + (randomIndex * angleStep) + angleStep / 2;
        let currentAngle = 0;
        let lastTimestamp = null;

        function animate(timestamp) {
            if (!lastTimestamp) lastTimestamp = timestamp;
            const progress = Math.min((timestamp - lastTimestamp) / 2500, 1); // 2.5s spin
            currentAngle = finalAngle * easeOutCubic(progress);

            ctx.save();
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.translate(canvas.width / 2, canvas.height / 2);
            ctx.rotate(currentAngle);
            ctx.translate(-canvas.width / 2, -canvas.height / 2);
            drawRoulette(options);
            ctx.restore();

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                showRouletteResult(options[randomIndex]);
                launchConfetti();
                if (typeof onDone === "function") onDone();
            }
        }
        requestAnimationFrame(animate);
    }

    // Easing para animación suave
    function easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    }

    // Muestra el resultado
    function showRouletteResult(result) {
        document.getElementById('roulette-result').textContent = `¡Resultado: ${result}!`;
    }

    // Confeti simple
    function launchConfetti() {
        for (let i = 0; i < 80; i++) {
            createConfettiPiece();
        }
        setTimeout(() => {
            document.querySelectorAll('.confetti-piece').forEach(e => e.remove());
        }, 2500);
    }

    function createConfettiPiece() {
        const confetti = document.createElement('div');
        confetti.className = 'confetti-piece';
        confetti.style.position = 'fixed';
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.top = '-20px';
        confetti.style.width = '10px';
        confetti.style.height = '18px';
        confetti.style.background = `hsl(${Math.random()*360},90%,60%)`;
        confetti.style.opacity = 0.8;
        confetti.style.transform = `rotate(${Math.random()*360}deg)`;
        confetti.style.zIndex = 9999;
        confetti.style.borderRadius = '3px';
        confetti.style.pointerEvents = 'none';
        document.body.appendChild(confetti);

        const fall = [
            { transform: confetti.style.transform, top: confetti.style.top },
            { transform: `rotate(${Math.random()*360}deg)`, top: '100vh' }
        ];
        const timing = {
            duration: 1800 + Math.random()*1200,
            easing: 'ease-in',
            fill: 'forwards'
        };
        confetti.animate(fall, timing);
    }
});                                                         
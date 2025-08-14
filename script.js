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
                "Gira la ruleta para un reto aleatorio",
                "Premios sorpresa",
                "Desafíos exprés"
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

        // Construir el HTML del menú
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
});
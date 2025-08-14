document.addEventListener('DOMContentLoaded', () => {
    // Contenedores
    const gridContainer = document.getElementById('grid-container');
    const activitiesContainer = document.getElementById('activities-container');

    // Botones y Enlaces
    const logoButton = document.getElementById('logo-button');
    const gridItems = document.querySelectorAll('.grid-item');

    // Función para mostrar la vista principal (la cuadrícula)
    const showGridView = () => {
        gridContainer.classList.remove('hidden');
        activitiesContainer.classList.add('hidden');
    };

    // Función para mostrar las actividades
    const showActivitiesView = () => {
        gridContainer.classList.add('hidden');
        activitiesContainer.classList.remove('hidden');
    };

    // Event listener para el botón del logo
    logoButton.addEventListener('click', (event) => {
        event.preventDefault(); // Evita que el enlace recargue la página
        showGridView();
    });

    // Event listeners para los elementos de la cuadrícula
    gridItems.forEach(item => {
        item.addEventListener('click', () => {
            const page = item.getAttribute('data-page');

            if (page === 'actividades') {
                showActivitiesView();
            } else if (page === 'placeholder') {
                alert('¡Funcionalidad no implementada todavía!');
            }
        });
    });
});
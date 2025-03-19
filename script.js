// Seleccionamos todos los enlaces dentro de la barra de navegación
// document.querySelectorAll() selecciona todos los elementos <a> dentro de <nav>
document.querySelectorAll('nav a').forEach(anchor => {

    // Añadimos un "event listener" que escucha los clics en los enlaces
    // 'click' es el evento, y la función anónima es lo que ocurre cuando se hace clic en el enlace
    anchor.addEventListener('click', function(e) {

        // Evitamos el comportamiento predeterminado del enlace (que salte directamente a la sección)
        // 'e.preventDefault()' previene la acción por defecto del enlace
        e.preventDefault();

        // Obtenemos el atributo "href" del enlace, que es el ID de la sección (ej: #about)
        // 'this' hace referencia al enlace en el que se hizo clic
        const targetId = this.getAttribute('href');

        // Seleccionamos el elemento correspondiente a ese ID (la sección en la página)
        // document.querySelector() busca el primer elemento con ese ID
        const targetElement = document.querySelector(targetId);

        // Si el elemento existe, desplazamos la página suavemente hasta él
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth', // Hace que el desplazamiento sea suave
                block: 'start' // Asegura que la sección comience desde la parte superior de la pantalla
            });
        }
    });
});

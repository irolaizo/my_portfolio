// script.js

// Seleccionamos todos los enlaces del menú de navegación
document.querySelectorAll('nav a').forEach(anchor => {
    // Escuchamos el evento 'click' en cada enlace
    anchor.addEventListener('click', function(e) {
        // Evitamos el comportamiento predeterminado (saltar de golpe)
        e.preventDefault();

        // Obtenemos el valor del atributo href (por ejemplo: "#about")
        const targetId = this.getAttribute('href');

        // Seleccionamos la sección correspondiente a ese ID
        const targetElement = document.querySelector(targetId);

        // Si existe la sección, desplazamos suavemente hacia ella
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth', // Desplazamiento suave
                block: 'start'      // Alineado al inicio de la sección
            });
        }
    });
});

// BONUS: Mensaje por consola para saber que el script está funcionando
console.log("Navegación suave activada ✅");

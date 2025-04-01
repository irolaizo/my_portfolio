// script.js

// Solo aplicamos navegación suave a enlaces que empiezan con "#"
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        // Obtenemos el valor de href (por ejemplo "#about")
        const targetId = this.getAttribute('href');

        // Buscamos el elemento con ese ID
        const targetElement = document.querySelector(targetId);

        // Si existe, hacemos scroll suave
        if (targetElement) {
            e.preventDefault(); // Evitamos el salto brusco
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Confirmación en consola (puedes quitarlo si no lo necesitas)
console.log("✅ Navegación suave activada solo para anclas internas");

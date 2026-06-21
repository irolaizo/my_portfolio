/* =============================================
   IRATXE OLAIZOLA · PORTFOLIO — script.js
   ============================================= */

/* ── 1. Nav activa al hacer scroll ── */
const sections = document.querySelectorAll('main section[id]');
const navLinks  = document.querySelectorAll('nav a[href^="#"]');

const highlightNav = () => {
    let current = '';
    sections.forEach(s => {
        if (window.scrollY >= s.offsetTop - 140) current = s.id;
    });
    navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === `#${current}`));
};
window.addEventListener('scroll', highlightNav, { passive: true });
highlightNav();

/* ── 2. Cards: aparecen al entrar en pantalla ── */
const observer = new IntersectionObserver(entries => {
    entries.forEach((e, i) => {
        if (e.isIntersecting) {
            setTimeout(() => e.target.classList.add('visible'), i * 80);
            observer.unobserve(e.target);
        }
    });
}, { threshold: 0.08 });

document.querySelectorAll('.card').forEach(c => observer.observe(c));

/* ── 3. Scroll suave ── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
        const target = document.querySelector(a.getAttribute('href'));
        if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    });
});

/* ── 4. Botón volver arriba ── */
const btn = document.createElement('button');
btn.id = 'scroll-top';
btn.innerHTML = '↑';
btn.setAttribute('aria-label', 'Volver arriba');
document.body.appendChild(btn);
window.addEventListener('scroll', () => btn.classList.toggle('visible', scrollY > 500), { passive: true });
btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ── 5. Lightbox para imágenes de galería ── */
document.querySelectorAll('.gallery-item img').forEach(img => {
    img.addEventListener('click', () => {
        const ov = document.createElement('div');
        ov.style.cssText = 'position:fixed;inset:0;background:rgba(30,10,10,0.88);display:flex;align-items:center;justify-content:center;z-index:9999;cursor:zoom-out;padding:32px;backdrop-filter:blur(4px)';
        const big = document.createElement('img');
        big.src = img.src;
        big.style.cssText = 'max-width:88vw;max-height:88vh;border-radius:16px;box-shadow:0 24px 80px rgba(0,0,0,0.5);animation:cardIn 0.3s ease';
        ov.appendChild(big);
        document.body.appendChild(ov);
        document.body.style.overflow = 'hidden';
        const close = () => { ov.remove(); document.body.style.overflow = ''; document.removeEventListener('keydown', onKey); };
        ov.addEventListener('click', close);
        const onKey = e => { if (e.key === 'Escape') close(); };
        document.addEventListener('keydown', onKey);
    });
});

/* ── 6. Título de la página animado ── */
const originalTitle = document.title;
document.addEventListener('visibilitychange', () => {
    document.title = document.hidden ? '👋 ¡Vuelve pronto!' : originalTitle;
});

console.log('✨ Portfolio de Iratxe cargado');
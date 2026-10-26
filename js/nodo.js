/* =========================================================
   Gráfica del TFG de Periodismo: minutos de los NO-DO de verano
   (1959–1970) dedicados a noticias del régimen (A) y a turismo
   y desarrollo (B). Valores leídos de la gráfica original del TFG.
   Se dibuja al entrar en pantalla; al pasar el ratón o tocar un
   año aparecen los porcentajes.
   ========================================================= */
(() => {
  const fig = document.getElementById('nodoChart');
  if (!fig) return;
  const YEARS = [1959, 1960, 1961, 1962, 1963, 1964, 1965, 1966, 1967, 1968, 1969, 1970];
  const A = [61.5, 40, 53.5, 53.5, 39, 58.5, 41, 28.5, 42.5, 20.5, 46.5, 33];
  const B = [38, 60, 46.5, 46.5, 61, 41, 58, 71, 57, 79, 53, 66.5];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const W = 480, H = 300, L = 40, R = 14, T = 16, Bt = 34, MAX = 90;
  const x = i => L + i * (W - L - R) / (YEARS.length - 1);
  const y = v => T + (1 - v / MAX) * (H - T - Bt);
  const path = d => d.map((v, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join(' ');
  const cross = YEARS.indexOf(1965);

  let g = '';
  [0, 30, 60, 90].forEach(v => { g += `<line class="nc-grid" x1="${L}" x2="${W - R}" y1="${y(v)}" y2="${y(v)}"/><text class="nc-ax" x="${L - 8}" y="${y(v) + 5}" text-anchor="end">${v}%</text>`; });
  YEARS.forEach((yr, i) => { g += `<text class="nc-ax nc-yr" x="${x(i)}" y="${H - 10}" text-anchor="middle">’${String(yr).slice(2)}</text>`; });
  const svg = `
  <svg viewBox="0 0 ${W} ${H}" role="img" aria-labelledby="nodoTitle" class="nc-svg">
    <title id="nodoTitle"></title>
    ${g}
    <line class="nc-cross" x1="${x(cross)}" x2="${x(cross)}" y1="${T}" y2="${H - Bt}"/>
    <text class="nc-cross-t" x="${x(cross) + 6}" y="${T + 12}">1965</text>
    <line class="nc-guide" x1="0" x2="0" y1="${T}" y2="${H - Bt}"/>
    <path class="nc-case" d="${path(A)}"/><path class="nc-line nc-a" d="${path(A)}"/>
    <path class="nc-case" d="${path(B)}"/><path class="nc-line nc-b" d="${path(B)}"/>
    ${A.map((v, i) => `<circle class="nc-dot nc-a" data-i="${i}" cx="${x(i)}" cy="${y(v)}" r="6"/>`).join('')}
    ${B.map((v, i) => `<circle class="nc-dot nc-b" data-i="${i}" cx="${x(i)}" cy="${y(v)}" r="6"/>`).join('')}
    <rect class="nc-hit" x="${L - 10}" y="0" width="${W - L - R + 20}" height="${H}"/>
  </svg>`;
  const plot = fig.querySelector('.nc-plot');
  plot.insertAdjacentHTML('afterbegin', svg);
  const s = plot.querySelector('svg');
  const tip = fig.querySelector('.nc-tip');
  const label = k => (fig.querySelector(`.lg-${k}`) || {}).textContent || k.toUpperCase();

  // dibujado al entrar en pantalla
  const lines = [...s.querySelectorAll('.nc-line, .nc-case')];
  lines.forEach(p => { const n = p.getTotalLength(); p.style.strokeDasharray = n; p.style.strokeDashoffset = reduce ? 0 : n; });
  const dots = [...s.querySelectorAll('.nc-dot')];
  if (!reduce) dots.forEach(d => d.style.opacity = 0);
  new IntersectionObserver(([e], io) => {
    if (!e.isIntersecting) return; io.disconnect();
    if (reduce) return;
    lines.forEach(p => p.animate([{ strokeDashoffset: p.style.strokeDashoffset }, { strokeDashoffset: 0 }], { duration: 2200, easing: 'cubic-bezier(.45,.05,.3,1)', fill: 'forwards' }));
    dots.forEach(d => { const i = +d.dataset.i; d.animate([{ opacity: 0, transform: 'scale(0)' }, { opacity: 1, transform: 'scale(1)' }], { duration: 500, delay: 200 + i * 170, easing: 'cubic-bezier(.34,1.56,.64,1)', fill: 'forwards' }); });
    fig.classList.add('drawn');
  }, { threshold: .45 }).observe(fig);

  // lectura de un año
  const guide = s.querySelector('.nc-guide');
  let cur = -1;
  function show(i) {
    if (i === cur) return; cur = i;
    dots.forEach(d => d.classList.toggle('on', +d.dataset.i === i));
    if (i < 0) { tip.hidden = true; guide.style.opacity = 0; return; }
    guide.setAttribute('x1', x(i)); guide.setAttribute('x2', x(i)); guide.style.opacity = 1;
    tip.innerHTML = `<b>${YEARS[i]}</b><span class="t-a">${label('a')}: ${Math.round(A[i])}%</span><span class="t-b">${label('b')}: ${Math.round(B[i])}%</span>`;
    tip.hidden = false;
    const px = x(i) / W * 100;
    tip.style.left = Math.min(78, Math.max(22, px)) + '%';
    tip.style.top = (Math.min(y(A[i]), y(B[i])) / H * 100) + '%';
  }
  const hit = s.querySelector('.nc-hit');
  const pick = e => {
    const r = s.getBoundingClientRect(), p = e.touches ? e.touches[0] : e;
    const vx = (p.clientX - r.left) / r.width * W;
    show(Math.max(0, Math.min(YEARS.length - 1, Math.round((vx - L) / ((W - L - R) / (YEARS.length - 1))))));
  };
  hit.addEventListener('pointermove', pick);
  hit.addEventListener('pointerdown', pick);
  hit.addEventListener('pointerleave', e => { if (e.pointerType === 'mouse') show(-1); });
  // teclado: flechas para recorrer los años
  fig.tabIndex = 0;
  fig.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') { show(Math.min(YEARS.length - 1, cur + 1)); e.preventDefault(); }
    if (e.key === 'ArrowLeft') { show(Math.max(0, cur < 0 ? 0 : cur - 1)); e.preventDefault(); }
    if (e.key === 'Escape') show(-1);
  });
  fig.addEventListener('blur', () => show(-1));

  window.NodoChart = {
    lang() {
      s.querySelector('title').textContent = (fig.querySelector('.nc-note') || {}).textContent || '';
      const c = cur; cur = -2; show(c);
    }
  };
})();

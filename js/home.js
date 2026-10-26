/* =========================================================
   Portada: idioma, avatar y las dos puertas.
   Al acercarte a "académico" se pone la toga y el birrete;
   al acercarte a "profesional" vuelve a su ropa de diario.
   ========================================================= */
(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const pick = a => Array.isArray(a) ? a[Math.floor(Math.random() * a.length)] : a;
  const store = { get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }, set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} } };

  /* ---------- idiomas ---------- */
  const D = window.I18N;
  const textEls = $$('[data-i]');
  textEls.forEach(el => { D.es[el.dataset.i] = el.innerHTML; });
  let lang = 'es';
  const H = () => Object.assign({}, D.es.hlines, D[lang].hlines);
  function applyLang(l) {
    if (!D[l]) l = 'es';
    lang = l; document.documentElement.lang = l;
    textEls.forEach(el => { const v = D[l][el.dataset.i] ?? D.es[el.dataset.i]; if (v != null) el.innerHTML = v; });
    $$('.lang button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.lang === l)));
    $$('[data-keep-lang]').forEach(a => { const base = a.getAttribute('href').split('?')[0]; a.href = base + (l !== 'es' ? '?lang=' + l : ''); });
    store.set('lang', l);
  }

  /* ---------- avatar ---------- */
  const el = $('#homeAvatar');
  const av = new Avatar(el);
  const bubble = $('.bubble', el), btxt = $('.bubble-text', bubble);
  let sayT, typeT;
  function say(text, ms = 2400) {
    clearTimeout(sayT); clearInterval(typeT); bubble.classList.remove('hide');
    if (reduce) btxt.textContent = text;
    else { const ch = [...text]; let i = 0; btxt.textContent = ''; typeT = setInterval(() => { btxt.textContent = ch.slice(0, ++i).join(''); if (i >= ch.length) clearInterval(typeT); }, 24); }
    sayT = setTimeout(() => bubble.classList.add('hide'), ms);
  }
  addEventListener('pointermove', e => av.lookAt(e.clientX, e.clientY), { passive: true });

  function wear(o, talk) {
    document.body.classList.toggle('on-casual', o === 'casual');
    document.body.classList.toggle('on-grad', o === 'grad');
    const changed = av.outfit !== o;
    av.setOutfit(o);
    if (changed) av.react(o === 'grad' ? 'excited' : 'wink', 1300);
    if (talk) say(o === 'grad' ? H().acad : H().pro, 2200);
  }

  let auto = null, touched = false;
  $$('.door').forEach(d => {
    const o = d.dataset.door;
    d.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse') { stopAuto(); wear(o, true); } });
    d.addEventListener('focus', () => { stopAuto(); wear(o, true); });
    d.addEventListener('touchstart', () => { stopAuto(); wear(o, false); }, { passive: true });
    d.addEventListener('pointerover', e => { if (e.pointerType === 'mouse') { const r = d.getBoundingClientRect(); av.lookAt(r.left + r.width / 2, r.top + r.height / 2); } });
  });
  $('.home-grid').addEventListener('pointerleave', e => { if (e.pointerType === 'mouse') { document.body.classList.remove('on-casual', 'on-grad'); } });

  // en móvil (sin ratón) se va cambiando sola de ropa para enseñar las dos
  function stopAuto() { touched = true; clearInterval(auto); auto = null; }
  if (!finePointer && !reduce) {
    let n = 0;
    auto = setInterval(() => { if (touched || document.hidden) return; n++; wear(n % 2 ? 'grad' : 'casual', n < 3); }, 3200);
  }

  // clics: con toga lanza el birrete; sin toga, se ríe
  let clicks = [];
  function poke() {
    const now = performance.now(); clicks.push(now); clicks = clicks.filter(t => now - t < 1400);
    if (clicks.length >= 5) { clicks = []; av.react('dizzy', 2400); say(H().dizzy, 2200); return; }
    if (av.toss()) { av.react('excited', 1400); say(pick(H().toss), 1800); return; }
    av.react(pick(['happy', 'wink', 'love']), 1500); say(pick(H().click), 1800);
  }
  el.addEventListener('click', () => { stopAuto(); poke(); });
  el.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); poke(); } });

  $$('.lang button').forEach(b => b.addEventListener('click', () => { applyLang(b.dataset.lang); av.react('happy', 1200); say(H().greet, 2000); }));

  /* ---------- arranque ---------- */
  const qs = new URLSearchParams(location.search).get('lang');
  const nav0 = (navigator.language || 'es').slice(0, 2);
  applyLang(qs || store.get('lang') || (D[nav0] ? nav0 : 'es'));
  if (!reduce) {
    const a = (n, kf, o) => n && n.animate && n.animate(kf, Object.assign({ duration: 900, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'backwards' }, o));
    a($('.home-name'), [{ transform: 'translateY(30px)', opacity: 0 }, { transform: 'none', opacity: 1 }], { delay: 80 });
    a($('.home-stage .blob'), [{ transform: 'scale(0) rotate(-40deg)' }, { transform: 'none' }], { duration: 1200, delay: 200, easing: 'cubic-bezier(.34,1.56,.64,1)' });
    a(el, [{ transform: 'translateY(30%)', opacity: 0 }, { transform: 'none', opacity: 1 }], { delay: 380, easing: 'cubic-bezier(.34,1.56,.64,1)' });
    $$('.door').forEach((d, i) => a(d, [{ translate: `${i ? 60 : -60}px 0`, opacity: 0 }, { translate: '0 0', opacity: 1 }], { delay: 520 + i * 120, easing: 'cubic-bezier(.34,1.56,.64,1)' }));
  }
  setTimeout(() => { say(H().greet, 3000); av.react('happy', 1400); }, reduce ? 0 : 1200);
})();

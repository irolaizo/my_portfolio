/* =========================================================
   Iratxe Olaizola · main.js  (sin librerías)
   ========================================================= */
(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const pick = a => Array.isArray(a) ? a[Math.floor(Math.random() * a.length)] : a;
  const rand = (a, b) => a + Math.random() * (b - a);
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const store = { get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }, set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} } };

  /* Curvas de animación */
  const supportsLinear = window.CSS && CSS.supports('animation-timing-function', 'linear(0, 1)');
  const E = {
    out: 'cubic-bezier(.16,1,.3,1)',
    back: 'cubic-bezier(.34,1.56,.64,1)',
    backIn: 'cubic-bezier(.36,0,.66,-.56)',
    elastic: supportsLinear ? 'linear(0, .218 2.1%, .862 6.5%, 1.114 8.5%, 1.296 10.7%, 1.346 11.8%, 1.37 12.9%, 1.364 14.5%, 1.315 16.2%, 1.032 21.8%, .941 24%, .891 25.9%, .869 27.8%, .87 29.2%, .882 30.7%, 1.012 38.3%, 1.046 42.7%, 1.042 45.7%, .996 53.3%, .984 57.5%, .985 60.7%, 1.001 68.1%, 1.006 72.2%, .998 86.7%, 1)' : 'cubic-bezier(.34,1.56,.64,1)'
  };
  const anim = (el, kf, o = {}) => (reduce || !el || !el.animate) ? null : el.animate(kf, Object.assign({ duration: 800, easing: E.out, fill: 'backwards' }, o));

  /* ---------------- Datos de la galería ---------------- */
  const seq = (k, n) => Array.from({ length: n }, (_, i) => `${k}-${String(i + 1).padStart(2, '0')}`);
  const SETS = {
    gamejam: ['gamejam-poster', ...seq('gamejam', 15)], signals: seq('signals', 17), stories: seq('stories', 8),
    pride: ['pride'], gamenight: seq('gamenight', 2), sports: seq('sports', 10), tables: [...seq('tables', 20), ...seq('names', 3)],
    oppettider: seq('oppettider', 5), skattjakt: [...seq('skattjakt', 2), 'stopp-01'], pinkavatar: ['pinkavatar-01', ...seq('esmaker', 10)],
    tetris: ['tetris-01'], welcome: [...seq('valkommen', 2), 'promo-01', ...seq('flyer', 2)], regler: [...seq('regler', 2), 'info-01'],
    edsbergs: seq('edsbergs', 10), scuffers: seq('scuffers', 6), tfm: seq('tfm', 13)
  };
  const TRACK = [
    ['gamejam', 'gamejam-poster'], ['signals', 'signals-01'], ['stories', 'stories-06'], ['pride', 'pride'],
    ['gamenight', 'gamenight-01'], ['sports', 'sports-01'], ['tables', 'tables-01'], ['oppettider', 'oppettider-01'],
    ['skattjakt', 'skattjakt-01'], ['pinkavatar', 'pinkavatar-01'], ['tetris', 'tetris-01'], ['welcome', 'promo-01'], ['regler', 'regler-01']
  ];
  const img = k => `assets/work/${k}.webp`;

  /* ---------------- Idiomas ---------------- */
  const D = window.I18N;
  const textEls = $$('[data-i]');
  textEls.forEach(el => { D.es[el.dataset.i] = el.innerHTML; });
  let lang = 'es';

  function splitChars(el) {
    const txt = el.textContent;
    el.setAttribute('aria-label', txt);
    el.innerHTML = [...txt].map(c => c === ' ' ? ' ' : `<span class="ch" aria-hidden="true">${c}</span>`).join('');
    if (!reduce) $$('.ch', el).forEach(ch => ch.addEventListener('mouseenter', () => jiggle(ch)));
  }
  function jiggle(ch) {
    if (ch._j) return; ch._j = true;
    ch.animate([{ transform: 'none' }, { transform: `translateY(-28px) rotate(${rand(-16, 16)}deg) scaleY(1.1)`, offset: .25 }, { transform: 'none' }], { duration: 900, easing: 'ease-out' }).onfinish = () => ch._j = false;
  }

  function splitWords(p) {
    p.innerHTML = p.textContent.split(/(\s+)/).map(w => /^\s+$/.test(w) ? w : `<span class="w">${w}</span>`).join('');
  }

  function applyLang(l) {
    if (!D[l]) l = 'es';
    lang = l;
    document.documentElement.lang = l;
    textEls.forEach(el => { const v = D[l][el.dataset.i] ?? D.es[el.dataset.i]; if (v != null) el.innerHTML = v; });
    $$('[data-split]').forEach(el => { if (el.closest('.hero-name') && el.querySelector('.ch')) return; splitChars(el); });
    if (!reduce) splitWords($('.scrub'));
    $$('.lang button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.lang === l)));
    $$('.piece').forEach(p => { const g = D[l].g[p.dataset.set] || D.es.g[p.dataset.set]; $('.piece-cap span', p).textContent = g[0]; $('.piece-cap em', p).textContent = g[1]; });
    const cl = $('.cursor-label'); if (cl) cl.textContent = D[l].view;
    rotIndex = -1; nextWord(true);
    store.set('lang', l);
    requestAnimationFrame(measure);
  }

  /* ---------------- Rotador del hero ---------------- */
  const rotEl = $('.rot-word');
  let rotIndex = 0, rotTimer;
  function nextWord(instant) {
    const words = D[lang].rot;
    rotIndex = (rotIndex + 1) % words.length;
    clearTimeout(rotTimer);
    if (instant || reduce) rotEl.textContent = words[rotIndex];
    else {
      rotEl.animate([{ transform: 'rotate(-1.5deg)' }, { transform: 'translateY(-115%) rotate(-10deg)' }], { duration: 320, easing: E.backIn, fill: 'forwards' }).onfinish = () => {
        rotEl.textContent = words[rotIndex];
        rotEl.animate([{ transform: 'translateY(115%) rotate(10deg)' }, { transform: 'rotate(-1.5deg)' }], { duration: 600, easing: E.back, fill: 'forwards' });
      };
    }
    rotTimer = setTimeout(() => nextWord(), 2300);
  }

  /* ---------------- Burbujas de diálogo ---------------- */
  function makeSpeaker(bubble) {
    const t = $('.bubble-text', bubble); let timer, typer;
    return function say(text, ms = 2600) {
      clearTimeout(timer); clearInterval(typer);
      bubble.classList.remove('hide');
      if (reduce) t.textContent = text;
      else { let i = 0; t.textContent = ''; const ch = [...text]; typer = setInterval(() => { t.textContent = ch.slice(0, ++i).join(''); if (i >= ch.length) clearInterval(typer); }, 24); }
      anim(bubble, [{ transform: 'scale(.6) rotate(-8deg)' }, { transform: 'none' }], { duration: 500, easing: E.back, fill: 'none' });
      timer = setTimeout(() => bubble.classList.add('hide'), ms);
    };
  }

  /* ---------------- Avatares ---------------- */
  const heroEl = $('#heroAvatar');
  const hero = new Avatar(heroEl);
  const buddy = new Avatar($('#buddyAvatar'));
  const say = makeSpeaker($('.bubble', heroEl));
  const buddySay = makeSpeaker($('.buddy-bubble'));
  const L = () => D[lang].lines;
  let heroVisible = true;
  const both = (m, ms) => { hero.react(m, ms); buddy.react(m, ms); };
  const talk = (txt, ms) => heroVisible ? say(txt, ms) : buddySay(txt, ms);

  const mouse = { x: innerWidth / 2, y: innerHeight / 3 };
  let lastMove = performance.now(), sleeping = false, lastX = 0, lastDir = 0, flips = [];
  hero.lookAt(mouse.x, innerHeight); buddy.lookAt(mouse.x, innerHeight);

  function onPoint(x, y) {
    mouse.x = x; mouse.y = y;
    hero.lookAt(x, y); buddy.lookAt(x, y);
    lastMove = performance.now();
    if (sleeping) { sleeping = false; both('curious', 1400); talk(L().wake, 2000); }
    const dir = Math.sign(x - lastX);
    if (dir && dir !== lastDir && Math.abs(x - lastX) > 14) {
      const now = performance.now(); flips.push(now); flips = flips.filter(t => now - t < 900);
      if (flips.length > 6) { flips = []; both('dizzy', 2600); talk(L().dizzy, 2400); }
      lastDir = dir;
    }
    lastX = x;
  }
  addEventListener('pointermove', e => onPoint(e.clientX, e.clientY), { passive: true });
  addEventListener('touchstart', e => { const t = e.touches[0]; onPoint(t.clientX, t.clientY); }, { passive: true });

  // sin ratón: mira a su alrededor
  if (!finePointer) setInterval(() => {
    if (performance.now() - lastMove < 2500) return;
    const r = heroEl.getBoundingClientRect();
    const x = r.left + r.width / 2 + rand(-260, 260), y = r.top + r.height * .4 + rand(-160, 220);
    hero.lookAt(x, y); buddy.lookAt(x, y);
  }, 2200);

  // se duerme si no te mueves
  setInterval(() => {
    if (!finePointer || sleeping || document.hidden || !$('#lightbox').hidden) return;
    if (performance.now() - lastMove > 11000) { sleeping = true; hero.setFace('sleepy'); buddy.setFace('sleepy'); talk(L().sleepy, 4000); }
  }, 1000);

  // te vas / vuelves
  document.documentElement.addEventListener('mouseleave', () => { hero.setFace('sad'); buddy.setFace('sad'); talk(L().leave, 3000); });
  document.documentElement.addEventListener('mouseenter', () => { both('happy', 1500); talk(L().back, 1800); });

  // clics en su cara
  let clicks = [];
  function poke(av, speak) {
    const now = performance.now(); clicks.push(now); clicks = clicks.filter(t => now - t < 1400);
    if (clicks.length >= 5) { clicks = []; av.react('dizzy', 2600); speak(L().dizzy, 2400); return; }
    av.react(pick(['happy', 'wink', 'love', 'happy']), 1500); speak(pick(L().click), 1800);
    burst(av.el);
  }
  heroEl.addEventListener('click', () => poke(hero, say));
  heroEl.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); poke(hero, say); } });
  $('#buddyAvatar').addEventListener('click', () => poke(buddy, buddySay));
  heroEl.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse') { hero.react('shy', 1600); say(pick(L().tickle), 1800); } });

  function burst(el) {
    if (reduce) return;
    const r = el.getBoundingClientRect();
    for (let i = 0; i < 8; i++) {
      const h = document.createElement('span');
      h.className = 'heart';
      h.style.cssText = `position:fixed;left:${r.left + r.width / 2}px;top:${r.top + r.height * .45}px;z-index:250;animation:none;background:${pick(['#FF6F61', '#FFB3CF', '#D63A78', '#FFD3DF'])}`;
      document.body.appendChild(h);
      h.animate([{ transform: 'scale(.4)', opacity: 1 }, { transform: `translate(${rand(-170, 170)}px, ${rand(-230, -60)}px) rotate(${rand(-90, 90)}deg) scale(${rand(.9, 1.7)})`, opacity: 0 }], { duration: rand(900, 1400), easing: 'cubic-bezier(.2,.8,.3,1)' }).onfinish = () => h.remove();
    }
  }

  // reacciones a enlaces y PDFs
  let lastLinkTalk = 0;
  document.addEventListener('pointerover', e => {
    if (e.pointerType !== 'mouse') return;
    const a = e.target.closest('a, button, .piece');
    if (!a || a.closest('#heroAvatar, #buddy, .lightbox, .lang')) return;
    const now = performance.now();
    if (a.hasAttribute('data-pdf')) { both('love', 1800); if (now - lastLinkTalk > 2500) { talk(pick(L().pdf), 2200); lastLinkTalk = now; } return; }
    both(Math.random() < .5 ? 'excited' : 'curious', 1200);
    if (now - lastLinkTalk > 6000) { talk(pick(L().link), 1800); lastLinkTalk = now; }
  });

  /* ---------------- Cursor propio ---------------- */
  const cursor = $('.cursor'), dot = $('.cursor-dot'), ring = $('.cursor-ring');
  let ringX = mouse.x, ringY = mouse.y;
  if (finePointer && !reduce) {
    document.body.classList.add('has-cursor');
    addEventListener('pointermove', e => { dot.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`; }, { passive: true });
    document.addEventListener('pointerover', e => {
      const v = e.target.closest('.piece, .pcard-visual:not(.phone):not(.redacted), .book-cover');
      const l = e.target.closest('a, button, .sticker, #heroAvatar, .buddy-face');
      cursor.classList.toggle('is-view', !!v); cursor.classList.toggle('is-link', !v && !!l);
    });
  }

  /* ---------------- Botones magnéticos ---------------- */
  if (finePointer && !reduce) $$('.magnetic').forEach(b => {
    b.addEventListener('pointermove', e => { const r = b.getBoundingClientRect(); b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .35}px, ${(e.clientY - r.top - r.height / 2) * .45}px)`; });
    b.addEventListener('pointerleave', () => { b.style.transform = ''; });
  });

  /* ---------------- Navegación ---------------- */
  const nav = $('.nav'), burger = $('.nav-burger'), menu = $('#menu');
  burger.addEventListener('click', () => { const o = burger.getAttribute('aria-expanded') !== 'true'; burger.setAttribute('aria-expanded', o); menu.classList.toggle('open', o); });
  $$('a', menu).forEach(a => a.addEventListener('click', () => { burger.setAttribute('aria-expanded', 'false'); menu.classList.remove('open'); }));
  const links = $$('.nav-links a');
  const secObs = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    const id = e.target.id;
    links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + id));
    const line = L().sec[id];
    if (line && !heroVisible && !reduce) { buddy.react(pick(['excited', 'wink', 'happy']), 1600); buddySay(line, 3200); }
  }), { rootMargin: '-45% 0px -50% 0px' });
  $$('main section[id]').forEach(s => secObs.observe(s));

  const buddyBox = $('#buddy');
  new IntersectionObserver(([e]) => { heroVisible = e.isIntersecting; buddyBox.classList.toggle('show', !heroVisible); }, { threshold: .15 }).observe($('.hero-stage'));

  $$('.lang button').forEach(b => b.addEventListener('click', () => { applyLang(b.dataset.lang); both('happy', 1200); talk(L().greet, 1800); }));

  /* ---------------- Galería horizontal (FUZED) ---------------- */
  const track = $('#track'), hs = $('#hscroll');
  TRACK.forEach(([set, cover], i) => {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'piece' + (SETS[set].length > 1 ? ' piece-stack' : ''); b.dataset.set = set;
    b.style.setProperty('--rot', [-3, 2.5, -1.5, 3, -2.5, 1.5][i % 6] + 'deg');
    b.innerHTML = `<span class="piece-img"><img src="${img(cover)}" alt="" loading="lazy"></span><span class="piece-cap"><span></span><em></em></span>`;
    b.addEventListener('click', () => openLB(set));
    track.appendChild(b);
  });

  /* ---------------- Visor ---------------- */
  const lb = $('#lightbox'), lbImg = $('#lbImg'), strip = $('#lbStrip');
  let cur = { set: null, i: 0 }, lastFocus;
  function openLB(set, i = 0) {
    cur = { set, i }; lastFocus = document.activeElement;
    const g = D[lang].g[set] || D.es.g[set];
    $('#lbTitle').textContent = g[0];
    strip.innerHTML = SETS[set].map((k, n) => `<button type="button" data-n="${n}" aria-label="${n + 1}"><img src="${img(k)}" alt="" loading="lazy"></button>`).join('');
    lb.hidden = false; document.body.style.overflow = 'hidden';
    show(i, 0); $('.lb-close').focus();
    hero.react('love', 1500); buddy.react('love', 1500);
  }
  function show(i, dir) {
    const list = SETS[cur.set]; cur.i = (i + list.length) % list.length;
    lbImg.src = img(list[cur.i]); lbImg.alt = `${$('#lbTitle').textContent} ${cur.i + 1}/${list.length}`;
    anim(lbImg, [{ opacity: 0, transform: `scale(.94) translateX(${dir * 40}px)` }, { opacity: 1, transform: 'none' }], { duration: 380, easing: E.out, fill: 'none' });
    $('#lbCount').textContent = `${cur.i + 1} / ${list.length}`;
    $$('button', strip).forEach(b => b.setAttribute('aria-current', String(+b.dataset.n === cur.i)));
    const a = strip.children[cur.i]; if (a) a.scrollIntoView({ block: 'nearest', inline: 'center' });
    const many = list.length > 1; $('.lb-prev').hidden = !many; $('.lb-next').hidden = !many; strip.hidden = !many;
  }
  function closeLB() { lb.hidden = true; document.body.style.overflow = ''; if (lastFocus) lastFocus.focus(); }
  $('.lb-close').addEventListener('click', closeLB);
  $('.lb-prev').addEventListener('click', () => show(cur.i - 1, -1));
  $('.lb-next').addEventListener('click', () => show(cur.i + 1, 1));
  strip.addEventListener('click', e => { const b = e.target.closest('button'); if (b) show(+b.dataset.n, +b.dataset.n > cur.i ? 1 : -1); });
  lb.addEventListener('click', e => { if (e.target === lb || e.target.classList.contains('lb-stage')) closeLB(); });
  addEventListener('keydown', e => {
    if (lb.hidden) return;
    if (e.key === 'Escape') closeLB();
    if (e.key === 'ArrowRight') show(cur.i + 1, 1);
    if (e.key === 'ArrowLeft') show(cur.i - 1, -1);
    if (e.key === 'Tab') { const f = $$('button', lb).filter(b => !b.hidden && b.offsetParent); const first = f[0], last = f[f.length - 1]; if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); } else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); } }
  });
  let sx = null;
  lb.addEventListener('touchstart', e => { sx = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', e => { if (sx == null) return; const dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 50) show(cur.i + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1); sx = null; });
  $$('[data-open]').forEach(b => b.addEventListener('click', () => openLB(b.dataset.open)));

  /* ---------------- Pegatinas arrastrables ---------------- */
  const board = $('#board');
  const spots = [[0, 4, -8], [52, -2, 6], [0, 64, 5], [50, 90, -4], [64, 42, 10], [0, 34, -4]];
  $$('.sticker', board).forEach((s, i) => {
    const [x, y, r] = spots[i % spots.length];
    s.style.left = x + '%'; s.style.top = y + '%'; s.style.transform = `rotate(${r}deg)`;
    let st = null;
    s.addEventListener('pointerdown', e => {
      s.setPointerCapture(e.pointerId); s.classList.add('dragging');
      const b = board.getBoundingClientRect(), sr = s.getBoundingClientRect();
      st = { px: e.clientX, py: e.clientY, l: s.offsetLeft, t: s.offsetTop, bw: b.width, bh: b.height, w: sr.width, h: sr.height, lx: e.clientX };
      s.style.transform = 'scale(1.12)';
    });
    s.addEventListener('pointermove', e => {
      if (!st) return;
      s.style.left = clamp(st.l + e.clientX - st.px, -10, st.bw - s.offsetWidth + 10) + 'px';
      s.style.top = clamp(st.t + e.clientY - st.py, -10, st.bh - s.offsetHeight + 10) + 'px';
      const vx = e.clientX - st.lx; st.lx = e.clientX;
      s.style.transform = `scale(1.12) rotate(${clamp(vx * 1.6, -25, 25)}deg)`;
    });
    const end = () => {
      if (!st) return; st = null; s.classList.remove('dragging');
      s.style.transform = `rotate(${rand(-9, 9)}deg)`;
      hero.react('happy', 900); buddy.react('happy', 900);
    };
    s.addEventListener('pointerup', end); s.addEventListener('pointercancel', end);
  });

  /* ---------------- Contadores y barras ---------------- */
  function countUp(el) {
    const to = parseFloat(el.dataset.to), dec = +(el.dataset.dec || 0), sep = el.dataset.sep ? ({ en: ',', sv: ' ' }[lang] || '.') : null;
    const fmt = v => { let s = v.toFixed(dec); if (dec && lang !== 'en') s = s.replace('.', ','); if (sep) s = s.replace(/\B(?=(\d{3})+(?!\d))/g, sep); return s; };
    if (reduce) { el.textContent = fmt(to); return; }
    const t0 = performance.now(), dur = 1800;
    (function step(t) { const p = Math.min(1, (t - t0) / dur); el.textContent = fmt(to * (1 - Math.pow(1 - p, 4))); if (p < 1) requestAnimationFrame(step); })(t0);
  }
  const cObs = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { countUp(e.target); cObs.unobserve(e.target); } }), { threshold: .6 });
  $$('.count').forEach(c => cObs.observe(c));
  const bObs = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); bObs.unobserve(e.target); } }), { threshold: .5 });
  $$('.bar').forEach(b => bObs.observe(b));

  /* ---------------- Inclinación 3D de los TFG ---------------- */
  if (finePointer && !reduce) $$('.tilt').forEach(c => {
    c.addEventListener('pointermove', e => { const r = c.getBoundingClientRect(); const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5; c.style.transform = `perspective(900px) rotateY(${x * 14}deg) rotateX(${-y * 12}deg)`; });
    c.addEventListener('pointerleave', () => { c.style.transform = ''; });
  });

  /* ---------------- Corazones del móvil de Thais ---------------- */
  const hearts = $('.phone-hearts');
  if (hearts && !reduce) {
    let on = false; new IntersectionObserver(([e]) => on = e.isIntersecting).observe(hearts);
    setInterval(() => { if (!on) return; const h = document.createElement('span'); h.className = 'heart'; h.style.left = rand(20, 75) + '%'; h.style.setProperty('--dx', rand(-40, 40) + 'px'); h.style.setProperty('--r', rand(-30, 30) + 'deg'); hearts.appendChild(h); setTimeout(() => h.remove(), 2500); }, 650);
  }

  /* ---------------- Terminal ---------------- */
  const out = $('#termOut');
  const termScript = () => ({
    es: 'Sigo programando por mi cuenta\nporque me apasiona.', eu: 'Nire kabuz programatzen jarraitzen dut,\nasko gustatzen zaidalako.',
    en: 'I keep coding on my own\nbecause I love it.', sv: 'Jag fortsätter koda på egen hand\nför att jag älskar det.'
  })[lang];
  const repos = ['libft', 'ft_printf', 'get_next_line', 'minitalk', 'so_long'];
  let typed = false;
  async function typeTerm() {
    if (typed) return; typed = true;
    const wait = ms => new Promise(r => setTimeout(r, reduce ? 0 : ms));
    const steps = [
      ['whoami', 'iratxe · 42 Urduliz (2023 – 2025)\n\n'], ['ls ~/github', null],
      ['gcc -Wall -Wextra -Werror kaixo.c && ./a.out', 'Kaixo mundua!\n\n'], ['cat motivation.txt', termScript() + '\n']
    ];
    for (const [cmd, res] of steps) {
      out.insertAdjacentHTML('beforeend', '<span class="p">$ </span>');
      for (const c of cmd) { out.insertAdjacentText('beforeend', c); await wait(34 + Math.random() * 40); }
      out.insertAdjacentText('beforeend', '\n'); await wait(280);
      if (res === null) out.insertAdjacentHTML('beforeend', repos.map(r => `<a href="https://github.com/irolaizo/${r}" target="_blank" rel="noopener">${r}/</a>`).join('  ') + '\n\n');
      else out.insertAdjacentText('beforeend', res);
      await wait(450);
    }
  }
  new IntersectionObserver(([e]) => { if (e.isIntersecting) typeTerm(); }, { threshold: .3 }).observe($('#term'));

  /* ---------------- Copiar email ---------------- */
  const copyBtn = $('#copyMail');
  copyBtn.addEventListener('click', async () => {
    const mail = 'iratxeolaizolavargas@gmail.com';
    try { await navigator.clipboard.writeText(mail); }
    catch (e) { const r = document.createRange(); r.selectNodeContents($('.mail-link')); const s = getSelection(); s.removeAllRanges(); s.addRange(r); }
    copyBtn.textContent = D[lang].copied; both('love', 1800); talk(L().copied, 2400); burst(copyBtn);
    setTimeout(() => copyBtn.textContent = D[lang].copy, 2200);
  });

  /* ---------------- Contacto: letras que siguen al ratón ---------------- */
  const big = $('.contact-big');
  if (finePointer && !reduce) {
    big.addEventListener('pointermove', e => $$('.ch', big).forEach(ch => {
      const r = ch.getBoundingClientRect(); const d = e.clientX - (r.left + r.width / 2); const k = Math.max(0, 1 - Math.abs(d) / 260);
      ch.style.transition = 'transform .35s cubic-bezier(.2,.8,.3,1)'; ch.style.transform = `translateY(${-k * 40}px) rotate(${d * .02 * k}deg)`;
    }));
    big.addEventListener('pointerleave', () => $$('.ch', big).forEach(ch => { ch.style.transition = `transform .9s ${E.elastic}`; ch.style.transform = ''; }));
  }

  /* ================= Motor de scroll ================= */
  const prog = $('.progress span');
  const marquee = $('.marquee-track');
  marquee.innerHTML += marquee.innerHTML;
  const shapes = $$('.shape');
  const stage = $('.hero-stage');
  const cards = $$('.pcard');
  const tlPath = $('.tl-line path');
  const tlLen = tlPath.getTotalLength();
  tlPath.style.strokeDasharray = tlLen; tlPath.style.strokeDashoffset = reduce ? 0 : tlLen;
  const tlItems = $$('.timeline li');
  const tlYear = $('.tl-year span');
  const pieces = () => $$('.piece');
  let hsDist = 0, hsPinned = false;

  function measure() {
    hsPinned = !reduce && innerWidth > 800;
    hs.classList.toggle('native', !hsPinned);
    if (hsPinned) { hsDist = Math.max(0, track.scrollWidth - innerWidth); hs.style.height = (hsDist + innerHeight) + 'px'; }
    else { hs.style.height = ''; track.style.transform = ''; }
    // que ninguna pegatina se salga del tablero
    const bw = board.clientWidth;
    $$('.sticker', board).forEach(s => { if (s.offsetLeft + s.offsetWidth > bw) s.style.left = Math.max(0, bw - s.offsetWidth - 4) + 'px'; });
  }
  addEventListener('resize', measure);
  addEventListener('load', measure);

  // progreso de un elemento entre dos líneas del viewport (0..1)
  const progress = (el, startVh, endVh) => {
    const r = el.getBoundingClientRect(), vh = innerHeight;
    const a = vh * startVh, b = vh * endVh;
    return clamp((a - r.top) / (a - b), 0, 1);
  };

  let lastY = scrollY, vel = 0, smoothVel = 0, mOff = 0, mDir = 1, lastT = performance.now(), fastTalk = 0;
  let sMouse = { x: 0, y: 0 };
  function frame(t) {
    const dt = Math.min(64, t - lastT) || 16; lastT = t;
    const y = scrollY, dy = y - lastY; lastY = y;
    vel = dy / dt * 1000; smoothVel += (vel - smoothVel) * .15;

    // barra de progreso + nav
    const h = document.documentElement.scrollHeight - innerHeight;
    prog.style.transform = `scaleX(${h > 0 ? y / h : 0})`;
    if (Math.abs(dy) > 2) nav.classList.toggle('hide', dy > 0 && y > 300 && !menu.classList.contains('open'));

    // cursor (anillo con retardo)
    if (finePointer && !reduce) { ringX += (mouse.x - ringX) * .2; ringY += (mouse.y - ringY) * .2; ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`; }

    if (!reduce) {
      // cinta: acelera con el scroll y cambia de sentido
      if (dy) mDir = dy > 0 ? 1 : -1;
      const speed = (0.6 + Math.min(10, Math.abs(smoothVel) / 220)) * mDir;
      const half = marquee.scrollWidth / 2;
      mOff = ((mOff + speed * dt / 16) % half + half) % half;
      marquee.style.transform = `translateX(${-mOff}px)`;

      // hero: formas y escenario
      sMouse.x += ((mouse.x / innerWidth - .5) - sMouse.x) * .06; sMouse.y += ((mouse.y / innerHeight - .5) - sMouse.y) * .06;
      if (y < innerHeight * 1.2) {
        shapes.forEach((s, i) => { const k = (i + 1) * 24; s.style.translate = `${sMouse.x * k}px ${sMouse.y * k + y * (i % 2 ? -.25 : .18)}px`; s.style.rotate = `${y * (i % 2 ? .12 : -.08)}deg`; });
        stage.style.transform = `translateY(${y * .12}px)`;
      }

      // FUZED horizontal fijado
      if (hsPinned) {
        const r = hs.getBoundingClientRect();
        const p = clamp(-r.top / (r.height - innerHeight || 1), 0, 1);
        track.style.transform = `translateX(${-p * hsDist}px)`;
        const sk = clamp(-smoothVel / 260, -7, 7).toFixed(2);
        if (r.top < innerHeight && r.bottom > 0) track.style.setProperty('--skew', sk + 'deg');
      }

      // tarjetas apiladas
      if (innerWidth > 860) cards.forEach((c, i) => {
        if (i === cards.length - 1) return;
        const p = progress(cards[i + 1], .85, .3);
        c.style.transform = `scale(${1 - p * (.08 - i * .015)})`; c.style.filter = `brightness(${1 - p * .1})`;
      });
      else cards.forEach(c => { c.style.transform = ''; c.style.filter = ''; });

      // texto que se ilumina
      const sc = $('.scrub'); const ws = $$('.w', sc);
      if (ws.length) { const p = progress(sc, .85, .25); const n = p * ws.length * 1.1; ws.forEach((w, i) => w.style.opacity = clamp(.18 + (n - i) * .82, .18, 1)); }

      // línea de la trayectoria
      const tl = $('.timeline'); const tp = progress(tl, .7, .6 - tl.offsetHeight / innerHeight);
      tlPath.style.strokeDashoffset = tlLen * (1 - tp);
      let yr = tlItems[0].querySelector('time').textContent;
      tlItems.forEach(li => { const on = li.getBoundingClientRect().top < innerHeight * .65; li.style.setProperty('--s', on ? 1.6 : 1); if (on) yr = li.querySelector('time').textContent; });
      if (yr !== tlYear.textContent) { tlYear.textContent = yr; anim(tlYear, [{ transform: 'translateY(60%) rotate(8deg)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 600, easing: E.back, fill: 'none' }); }

      if (Math.abs(smoothVel) > 4500 && t - fastTalk > 6000) { fastTalk = t; both('dizzy', 1500); talk(L().fast, 1800); }
    }
    requestAnimationFrame(frame);
  }

  /* ---------------- Apariciones al entrar en pantalla ---------------- */
  function onEnter(sel, fn, th = .2) {
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { fn(e.target); io.unobserve(e.target); } }), { threshold: th });
    $$(sel).forEach(el => io.observe(el));
  }
  if (!reduce) {
    onEnter('.h2, .fuzed-title, .contact-big', el => anim(el, [{ transform: 'translateY(50%) rotate(-3deg)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 1000 }), .1);
    onEnter('#board', () => {
      anim($('.polaroid'), [{ transform: 'translate(-50%, -54%) rotate(-30deg) scale(.5)', opacity: 0 }, { transform: 'translate(-50%, -54%) rotate(-4deg)', opacity: 1 }], { duration: 1200, easing: E.elastic });
      $$('.sticker').forEach((s, i) => anim(s, [{ scale: '0', rotate: `${rand(-60, 60)}deg` }, { scale: '1', rotate: '0deg' }], { duration: 800, delay: 200 + i * 90, easing: E.back }));
    }, .3);
    onEnter('.stats', el => $$('.stat', el).forEach((s, i) => anim(s, [{ translate: '0 60px', rotate: '6deg', opacity: 0 }, { translate: '0 0', rotate: '0deg', opacity: 1 }], { duration: 900, delay: i * 120, easing: E.back })), .3);
    onEnter('.tfm', el => anim(el, [{ translate: '0 80px', rotate: '1.5deg', opacity: 0 }, { translate: '0 0', rotate: '0deg', opacity: 1 }], { duration: 1000 }), .15);
    onEnter('.books', el => $$('.book', el).forEach((b, i) => anim(b, [{ translate: '0 100px', rotate: `${[-4, 3, -2][i]}deg`, opacity: 0 }, { translate: '0 0', rotate: '0deg', opacity: 1 }], { duration: 1000, delay: i * 120, easing: E.back })), .15);
    onEnter('.timeline li', li => [...li.children].forEach((c, i) => anim(c, [{ translate: '50px 0', opacity: 0 }, { translate: '0 0', opacity: 1 }], { duration: 800, delay: i * 80 })), .3);
    onEnter('.clips', el => $$('.clip', el).forEach((c, i) => anim(c, [{ translate: '0 30px', rotate: `${rand(-20, 20)}deg`, opacity: 0 }, { translate: '0 0', rotate: '0deg', opacity: 1 }], { duration: 700, delay: i * 70, easing: E.back })), .3);
    onEnter('.piece', el => anim($('.piece-img', el), [{ scale: '.6', opacity: 0 }, { scale: '1', opacity: 1 }], { duration: 700, easing: E.back }), .2);
  }

  /* ---------------- Arranque ---------------- */
  const qs = new URLSearchParams(location.search).get('lang');
  const nav0 = (navigator.language || 'es').slice(0, 2);
  applyLang(qs || store.get('lang') || (D[nav0] ? nav0 : 'es'));
  measure();
  requestAnimationFrame(frame);

  // Entrada del hero: una única secuencia
  if (!reduce) {
    $$('.hero-name .ch').forEach((ch, i) => anim(ch, [{ transform: `translateY(120%) rotate(${rand(-30, 30)}deg)`, opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 1100, delay: 100 + i * 45 }));
    anim($('.hero-hi'), [{ translate: '0 20px', opacity: 0 }, { translate: '0 0', opacity: 1 }], { duration: 600, delay: 100 });
    anim($('.blob'), [{ scale: '0', rotate: '-40deg' }, { scale: '1', rotate: '0deg' }], { duration: 1300, delay: 150, easing: E.elastic });
    anim(heroEl, [{ translate: '0 40%', opacity: 0 }, { translate: '0 0', opacity: 1 }], { duration: 1000, delay: 350, easing: E.back });
    $$('.orb').forEach((o, i) => anim(o, [{ scale: '0' }, { scale: '1' }], { duration: 600, delay: 700 + i * 80, easing: E.back }));
    $$('.hero-role, .hero-lead, .hero-cta').forEach((el, i) => anim(el, [{ translate: '0 30px', opacity: 0 }, { translate: '0 0', opacity: 1 }], { duration: 800, delay: 600 + i * 100 }));
    anim($('.hero-hint'), [{ translate: '-20px 0', opacity: 0 }, { translate: '0 0', opacity: 1 }], { duration: 600, delay: 1400 });
    anim(nav, [{ translate: '0 -150%' }, { translate: '0 0' }], { duration: 800, delay: 200 });
  }
  setTimeout(() => { say(L().greet, 3200); hero.react('happy', 1400); }, reduce ? 0 : 1300);
})();

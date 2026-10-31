/* =========================================================
   Curso de IA: menú, índice, río de luz, glosario y test.
   Las páginas del curso solo están en castellano.
   ========================================================= */
(function () {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const css = n => getComputedStyle(document.documentElement).getPropertyValue(n).trim();

  /* ---------- menú móvil ---------- */
  const burger = $('.nav-burger'), menu = $('#menu');
  if (burger && menu) {
    burger.addEventListener('click', () => {
      const o = burger.getAttribute('aria-expanded') !== 'true';
      burger.setAttribute('aria-expanded', o); menu.classList.toggle('open', o);
    });
    $$('a', menu).forEach(a => a.addEventListener('click', () => { burger.setAttribute('aria-expanded', 'false'); menu.classList.remove('open'); }));
  }

  /* ---------- barra de progreso de lectura ---------- */
  const prog = $('.progress span');
  if (prog) {
    const upd = () => { const h = document.documentElement; prog.style.transform = `scaleX(${h.scrollTop / Math.max(1, h.scrollHeight - h.clientHeight)})`; };
    addEventListener('scroll', upd, { passive: true }); upd();
  }

  /* ---------- avatar de la puerta al CV académico ---------- */
  if (window.Avatar) $$('[data-mini]').forEach(el => { try { new Avatar(el, { outfit: el.dataset.mini }); } catch (e) {} });

  /* ---------- pestañas de módulos ---------- */
  const tabs = $$('.ci-mod[data-mod]'), panes = $$('.ci-pane[data-mod]');
  const modTitle = $('[data-mod-title]');
  function showMod(n, scroll) {
    if (!panes.some(p => p.dataset.mod === String(n))) return;
    panes.forEach(p => p.hidden = p.dataset.mod !== String(n));
    tabs.forEach(t => t.setAttribute('aria-selected', t.dataset.mod === String(n) ? 'true' : 'false'));
    const t = tabs.find(t => t.dataset.mod === String(n));
    if (modTitle && t) modTitle.textContent = 'Módulo ' + n + ' · ' + $('h3', t).textContent.split(':')[0];
    if (scroll) $('#apuntes').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
  }
  tabs.forEach(t => t.addEventListener('click', () => { showMod(t.dataset.mod, true); history.replaceState(null, '', '#modulo-' + t.dataset.mod); }));
  const fromHash = () => {
    const h = location.hash.slice(1), m = h.match(/^(?:modulo-|m)(\d+)/);
    if (m) { showMod(m[1], false); const el = document.getElementById(h); if (el && !/^modulo-/.test(h)) el.scrollIntoView(); else if (/^modulo-/.test(h)) $('#apuntes').scrollIntoView(); }
  };
  if (panes.length) { showMod(panes[0].dataset.mod, false); fromHash(); addEventListener('hashchange', fromHash); }

  /* ---------- índice de cada módulo ---------- */
  panes.forEach(pane => {
    const links = $$('.ci-toc a', pane), sel = $('[data-toc-select]', pane);
    if (sel) sel.addEventListener('change', () => { const t = document.getElementById(sel.value); if (t) t.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' }); });
    const secs = $$('.ci-article > section[id]', pane);
    if (!secs.length || !('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (!e.isIntersecting) return;
      links.forEach(a => a.classList.toggle('on', a.getAttribute('href') === '#' + e.target.id));
      if (sel) sel.value = e.target.id;
    }), { rootMargin: '-35% 0px -60% 0px' });
    secs.forEach(x => io.observe(x));
  });

  /* ---------- río de luz (4 capacidades) ---------- */
  $$('.ci-river').forEach(river => {
    const steps = $$('.ci-step', river), out = river.parentElement.querySelector('.ci-river-out');
    if (!steps.length || !out) return;
    const pick = st => {
      steps.forEach(x => x.setAttribute('aria-pressed', x === st ? 'true' : 'false'));
      out.textContent = '';
      const b = document.createElement('b'); b.textContent = $('b', st).textContent + '. ';
      out.append(b, document.createTextNode(st.dataset.detail));
    };
    steps.forEach(st => st.addEventListener('click', () => pick(st)));
    pick(steps[0]);
  });

  /* ---------- glosario ---------- */
  const GLOSS = {};
  GLOSS[1] = [
    ['Agente de IA', 'AI agent', 'Sistema autónomo que, además de generar respuestas, usa herramientas y ejecuta procesos para lograr un objetivo.'],
    ['Algoritmo o modelo', 'model', 'La técnica que aprende de los datos y extrae conocimiento.'],
    ['Big Data', '', 'Conjuntos de datos enormes; su explosión hace unos 15 años impulsó el boom actual de la IA.'],
    ['Computación', 'compute', 'Recursos de hardware, servidores y nube que ejecutan la solución.'],
    ['Datos estructurados', '', 'Organizados en filas y columnas: Excel, bases de datos SQL.'],
    ['Datos no estructurados', '', 'Sin organización previa: imágenes, PDF, audio, texto libre.'],
    ['Deep Learning', 'aprendizaje profundo', 'Rama del ML que usa redes neuronales de muchas capas.'],
    ['GPU', '', 'Procesador gráfico; su potencia hizo posible entrenar modelos complejos.'],
    ['IA estrecha', 'Narrow AI', 'IA diseñada para una sola tarea concreta.'],
    ['IA general', 'AGI', 'IA hipotética con la capacidad de una persona media para cualquier tarea.'],
    ['IA generativa', 'GenAI', 'IA que crea contenido nuevo (texto, imágenes, código) a partir de lo que pide el usuario.'],
    ['Invierno de la IA', 'AI winter', 'Parón de los años 80 por expectativas incumplidas y recortes de inversión.'],
    ['LLM', 'Large Language Model', 'Modelo de IA generativa entrenado con cantidades enormes de texto. Está detrás de ChatGPT o Gemini.'],
    ['Machine Learning', 'ML', 'Campo de la IA que aprende de los datos sin programar las reglas.'],
    ['Métrica', '', 'Medida que indica si la solución cumple el objetivo: exactitud, precisión, recall.'],
    ['PLN', 'NLP', 'Procesamiento del Lenguaje Natural: entender, interpretar y generar lenguaje humano.'],
    ['Prompt', '', 'La instrucción o petición que le das a una IA generativa.'],
    ['Red neuronal', 'neural network', 'Técnica inspirada en el cerebro humano; base del Deep Learning y de la IA generativa.'],
    ['Superinteligencia', 'ASI', 'IA teórica que superaría a la inteligencia humana en todo.'],
    ['Test de Turing', '', 'Prueba propuesta por Alan Turing para evaluar si una máquina se comporta de forma inteligente, como una persona.'],
    ['Variable objetivo', 'target', 'La respuesta correcta que se quiere predecir en el aprendizaje supervisado.'],
    ['Visión por computador', 'Computer Vision', 'IA que procesa y analiza imágenes y vídeos.']
  ];
  const norm = x => x.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  panes.forEach(pane => {
    const terms = GLOSS[pane.dataset.mod], gl = $('[data-gloss]', pane), gq = $('[data-gloss-q]', pane), ge = $('[data-gloss-empty]', pane);
    if (!terms || !gl || !gq) return;
    const draw = () => {
      const q = norm(gq.value.trim()); gl.textContent = ''; let n = 0;
      terms.forEach(([t, en, d]) => {
        if (q && !norm(t + ' ' + en + ' ' + d).includes(q)) return;
        n++;
        const div = document.createElement('div'); div.className = 'ci-term';
        const b = document.createElement('b'); b.textContent = t; div.appendChild(b);
        if (en) { const sm = document.createElement('small'); sm.textContent = en; div.appendChild(sm); }
        const p = document.createElement('p'); p.textContent = d; div.appendChild(p);
        gl.appendChild(div);
      });
      if (ge) ge.hidden = n > 0;
    };
    gq.addEventListener('input', draw); draw();
  });

  /* ---------- tests (preguntas por módulo) ---------- */
  const QUIZZES = {};
  QUIZZES[1] = [
    { q: '¿Cuál podría ser una definición actual de inteligencia artificial?', o: ['Una máquina con sentimientos y consciencia propios.', 'Sistemas capaces de realizar tareas que normalmente requieren inteligencia humana.', 'Software diseñado exclusivamente para jugar a videojuegos.', 'Cualquier programa informático que use una base de datos.'], a: 1,
      e: 'La IA imita el comportamiento humano inteligente: percibir, aprender, razonar y decidir. La consciencia es ciencia ficción, los juegos solo sirven para medir la IA y usar datos no basta: la IA aprende las reglas a partir de ellos.' },
    { q: '¿A quién se considera la persona que definió el Machine Learning?', o: ['Bill Gates', 'Ada Lovelace', 'Arthur Samuel', 'Elon Musk'], a: 2,
      e: 'Arthur Samuel lo definió como el campo que da a los ordenadores la capacidad de aprender sin ser programados explícitamente. No lo confundas con John McCarthy, que acuñó el término "Inteligencia Artificial" en Dartmouth (1956).' },
    { q: '¿Cuál es la diferencia principal entre la IA estrecha y la IA general?', o: ['La IA estrecha es más lenta que la general.', 'La IA general solo existe en teoría y podría realizar cualquier tarea intelectual humana.', 'La IA estrecha no usa algoritmos.', 'La IA general es la que usamos hoy en los asistentes de voz.'], a: 1,
      e: 'La diferencia está en el alcance: la estrecha existe hoy y domina una sola tarea; la general es hipotética y se adaptaría a casi cualquier tarea. Los asistentes de voz son IA estrecha.' },
    { q: 'El Machine Learning es:', o: ['Un sinónimo exacto de inteligencia artificial.', 'Una rama de la IA que permite a las máquinas aprender de los datos sin programarlas explícitamente para cada tarea.', 'El proceso de reparar hardware automáticamente.', 'Una técnica antigua que ya no se usa.'], a: 1,
      e: 'Casi el 99 % de lo que hoy llamamos IA es Machine Learning, pero no son sinónimos: el ML es una parte de la IA, que también incluye la robótica o los sistemas expertos.' },
    { q: 'El Deep Learning es:', o: ['Una rama del Machine Learning.', 'Un campo de la IA basado en redes neuronales como técnica principal.', 'Un campo destacado, con resultados sobresalientes en datos no estructurados.', 'Todas las opciones anteriores son correctas.'], a: 3,
      e: 'Las tres son ciertas: está dentro del ML, usa exclusivamente redes neuronales y destaca con imágenes, audio y texto.' },
    { q: 'Si queremos que una IA clasifique correos como "spam" o "no spam", ¿qué campo es el más adecuado?', o: ['Big Data.', 'Robótica.', 'Machine Learning.', 'Visión por computador.'], a: 2,
      e: 'Es el ejemplo clásico de aprendizaje supervisado con correos ya etiquetados. El Big Data es la materia prima, la robótica trabaja con máquinas físicas y la visión, con imágenes.' },
    { q: 'El Deep Learning se basa en una estructura inspirada en el cerebro humano llamada:', o: ['Redes de cable de cobre.', 'Redes neuronales artificiales.', 'Bloques masivos de datos.', 'Algoritmos lineales simples.'], a: 1,
      e: 'Las redes neuronales de muchas capas imitan el funcionamiento del cerebro. Los datos son el combustible, no la estructura que aprende.' },
    { q: '¿Qué papel tienen los datos en el entrenamiento de un modelo de IA?', o: ['Son secundarios: lo importante es el código del programador.', 'Son el "combustible": cuanto mayor sea su calidad y relevancia, mejor será el modelo.', 'Solo sirven para guardar información personal.', 'No hacen falta si el algoritmo es lo bastante complejo.'], a: 1,
      e: 'En Machine Learning las reglas salen de los datos, no del código. Y cuanto más complejo es el modelo, más datos necesita, no menos.' },
    { q: '¿Qué es el Procesamiento del Lenguaje Natural (PLN)?', o: ['Una técnica para que las máquinas lean el pensamiento.', 'La capacidad de la IA para entender, interpretar y generar lenguaje humano.', 'El estudio de los lenguajes de programación.', 'Un sistema de traducción automática de código binario.'], a: 1,
      e: '"Natural" significa lenguaje humano (castellano, euskera, inglés…), no lenguajes de programación. Ejemplos: ChatGPT, Siri, Alexa.' },
    { q: 'Los componentes principales de una solución de IA son:', o: ['Datos y desarrollo de software.', 'Datos, modelos de IA, resultados y computación.', 'Datos y computación.', 'Datos, modelos de IA y resultados.'], a: 1,
      e: 'Son los 4 ingredientes. La opción D es la trampa: se olvida de la computación, el paraguas que lo sostiene todo.' },
    { q: '¿Qué es un LLM (Large Language Model)?', o: ['Un robot físico que habla muchos idiomas.', 'Un modelo de IA entrenado con cantidades enormes de texto.', 'Una memoria USB de gran capacidad.', 'Un tipo de monitor de alta resolución.'], a: 1,
      e: 'Es IA generativa (genera texto), usa redes neuronales y trabaja con lenguaje (PLN). Está detrás de ChatGPT o Gemini.' },
    { q: 'El objetivo de la IA generativa es:', o: ['Crear contenido nuevo (texto, imagen, audio).', 'Clasificar etiquetas.', 'Ejecutarse sin conexión.', 'No tiene un objetivo claro: lo aprende sobre la marcha.'], a: 0,
      e: 'Clasificar es propio de la IA estrecha. La generativa no resuelve un objetivo predefinido, pero sí tiene uno claro: generar.' },
    { q: 'Un agente de IA es:', o: ['Un programa parecido a un chatbot.', 'Un programa que puede ejecutar pasos de forma autónoma.', 'Un programa centrado al 100 % en descargar información de internet.', 'Ninguna de las anteriores es correcta.'], a: 1,
      e: 'A diferencia de un chatbot, que solo responde, un agente planifica y ejecuta pasos con herramientas: el chatbot redacta el correo y el agente, además, lo envía.' },
    { q: 'Las soluciones de IA se usan mucho en distintos sectores de negocio.', o: ['Falso: solo se centran en la conducción autónoma.', 'Verdadero, pero solo para problemas de clasificación.', 'Falso: la IA está en una fase inmadura.', 'Verdadero: ofrece distintas opciones para mejorar el rendimiento y la calidad de los resultados.'], a: 3,
      e: 'Salud, finanzas, vehículos y entretenimiento son solo algunos ejemplos. Desconfía de las opciones con "solo": la IA es transversal.' },
    { q: 'Un caso de uso muy conocido de la IA en la industria del entretenimiento es:', o: ['Los sistemas de recomendación.', 'La clasificación de spam.', 'El etiquetado de texto.', 'El preprocesamiento de datos.'], a: 0,
      e: 'Netflix y Spotify recomiendan contenido según tu historial y tus preferencias. El spam es cosa del correo; etiquetar y preprocesar son pasos técnicos, no casos de negocio.' },
    { q: 'Los riesgos de la IA general (AGI) son:', o: ['Mucho mayores que con la IA estrecha.', 'Los mismos que con la IA estrecha.', 'Menores que con la IA estrecha.', 'La AGI no tiene riesgos.'], a: 0,
      e: 'El riesgo crece con el alcance: la AGI podría planificar, razonar e incluso crear otras IA, mientras que la estrecha se limita a una tarea.' },
    { q: '¿Cuál de estos es un ejemplo de visión por computador?', o: ['Un chatbot de atención al cliente.', 'El reconocimiento facial para desbloquear el móvil.', 'Una recomendación de canciones en Spotify.', 'El corrector ortográfico de Word.'], a: 1,
      e: 'La visión trabaja con imágenes y vídeo. El chatbot y el corrector son PLN; Spotify es un sistema de recomendación.' },
    { q: '¿Cómo se llama el programa de ajedrez de IBM?', o: ['Deep Mind.', 'Deep Sea.', 'Deep Blue.', 'Deep Learning.'], a: 2,
      e: 'Deep Blue venció a Garry Kasparov en 1997. DeepMind es otra empresa (hoy de Google) y Deep Learning es una rama del ML.' },
    { q: 'En salud, una solución de IA para el diagnóstico por imagen se basa en:', o: ['Procesamiento del Lenguaje Natural.', 'Big Data.', 'Visión por computador.', 'Filtrado de spam.'], a: 2,
      e: 'Analizar radiografías o resonancias es procesar imágenes: el terreno de la visión por computador.' },
    { q: 'La IA se organiza en distintos niveles según:', o: ['Las técnicas elegidas.', 'El reto que hay que resolver.', 'Los datos disponibles.', 'Todas las respuestas anteriores son correctas.'], a: 3,
      e: 'Datos + técnica + objetivo: elegir redes neuronales te lleva al Deep Learning, querer generar contenido a la IA generativa, y el tipo de dato condiciona la técnica.' }
  ];
  $$('[data-quiz]').forEach(quiz => {
    const mod = quiz.dataset.quiz, Q = QUIZZES[mod];
    if (!Q) return;
    const L = ['A', 'B', 'C', 'D'];
    let idx = 0, ans = [];
    const el = (t, c, x) => { const e = document.createElement(t); if (c) e.className = c; if (x != null) e.textContent = x; return e; };
    const hits = () => ans.filter((a, i) => a === Q[i].a).length;
    const bar = w => { const b = el('div', 'ci-bar'); const s = el('span'); s.style.width = w + '%'; b.appendChild(s); return b; };

    function render() {
      quiz.textContent = '';
      if (idx >= Q.length) return result();
      const it = Q[idx];
      const top = el('div', 'ci-qtop');
      top.append(el('span', null, 'Pregunta ' + (idx + 1) + ' de ' + Q.length), el('span', null, 'Aciertos: ' + hits()));
      const card = el('div', 'ci-qcard');
      card.appendChild(el('h3', null, it.q));
      const opts = el('div', 'ci-opts');
      const fb = el('p', 'ci-fb'); fb.hidden = true; fb.setAttribute('aria-live', 'polite');
      const nav = el('div', 'ci-qnav');
      const next = el('button', 'btn btn-ink', idx === Q.length - 1 ? 'Ver mi resultado' : 'Siguiente pregunta →');
      next.type = 'button'; next.hidden = true;
      next.addEventListener('click', () => { idx++; render(); quiz.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' }); });
      it.o.forEach((txt, i) => {
        const b = el('button', 'ci-opt'); b.type = 'button';
        b.append(el('span', 'k', L[i]), el('span', null, txt));
        b.addEventListener('click', () => {
          ans[idx] = i;
          $$('.ci-opt', opts).forEach((x, j) => { x.disabled = true; if (j === it.a) x.classList.add('right'); else if (j === i) x.classList.add('wrong'); });
          const ok = i === it.a;
          fb.textContent = '';
          fb.append(el('b', null, ok ? '¡Correcto!' : 'Casi. La buena es la ' + L[it.a] + '.'), document.createTextNode(it.e));
          fb.hidden = false; next.hidden = false; next.focus({ preventScroll: true });
        });
        opts.appendChild(b);
      });
      nav.appendChild(next);
      card.append(opts, fb, nav);
      quiz.append(top, bar(idx / Q.length * 100), card);
    }

    function result() {
      const h = hits();
      const card = el('div', 'ci-qcard ci-result');
      card.appendChild(el('p', 'hand', 'tu resultado'));
      card.appendChild(el('div', 'ci-score', h + '/' + Q.length));
      card.appendChild(el('p', null, h === Q.length ? 'Pleno. Dominas los fundamentos del módulo.' : h >= 16 ? 'Muy bien: tienes el módulo dominado.' : h >= 10 ? 'Aprobado. Repasa las preguntas marcadas en naranja.' : 'Merece la pena repasar los apuntes y volver a intentarlo.'));
      const row = el('div', 'chips'); row.style.justifyContent = 'center';
      const again = el('button', 'btn btn-ink', 'Repetir el test'); again.type = 'button';
      again.addEventListener('click', () => { idx = 0; ans = []; render(); });
      const back = el('a', 'btn btn-ghost', 'Repasar los apuntes'); back.href = '#m' + mod + '-intro';
      row.append(again, back); card.appendChild(row);
      const rev = el('div', 'ci-review');
      rev.appendChild(el('h3', null, 'Repaso de las respuestas'));
      Q.forEach((it, i) => {
        const d = el('details', ans[i] === it.a ? 'ok' : 'ko');
        const s = el('summary'); s.append(el('i'), el('span', null, (i + 1) + '. ' + it.q));
        const p = el('p'); p.append(el('b', null, 'Correcta: ' + L[it.a] + ') ' + it.o[it.a] + ' '), document.createTextNode(it.e));
        d.append(s, p); rev.appendChild(d);
      });
      quiz.append(bar(100), card, rev);
    }
    render();
  });

  /* ---------- río de luz animado (portada del curso) ---------- */
  const cv = $('#ciRiver');
  if (cv) {
    const ctx = cv.getContext('2d');
    let W = 0, H = 0, parts = [], cA, cB, cC, run = false, vis = true;
    const colors = () => { cA = css('--sun') || '#E4F568'; cB = css('--lime') || '#5FD790'; cC = css('--ink') || '#111'; };
    const spawn = any => ({ x: any ? Math.random() * W : -8, y0: Math.random() * H * .8 + H * .05, s: .35 + Math.random() * .9, r: 1.6 + Math.random() * 2.6, ph: Math.random() * 6.28 });
    const size = () => {
      const r = cv.getBoundingClientRect(), d = Math.min(devicePixelRatio || 1, 2);
      W = r.width; H = r.height; cv.width = W * d; cv.height = H * d; ctx.setTransform(d, 0, 0, d, 0, 0);
      parts = Array.from({ length: Math.round(Math.min(110, W / 4)) }, () => spawn(true));
    };
    const frame = t => {
      ctx.clearRect(0, 0, W, H);
      const cy = H * .42, x0 = W * .3;
      ctx.lineWidth = 2;
      for (const p of parts) {
        const k = Math.max(0, Math.min(1, (p.x - x0) / (W - x0))), e = k * k * (3 - 2 * k);
        const y = p.y0 + (cy - p.y0) * e + Math.sin(t / 900 + p.ph) * 10 * (1 - e);
        ctx.fillStyle = e > .5 ? cB : cA; ctx.strokeStyle = cC;
        ctx.beginPath(); ctx.arc(p.x, y, p.r * (1 - e * .35), 0, 6.283); ctx.fill(); ctx.globalAlpha = .55; ctx.stroke(); ctx.globalAlpha = 1;
        if (!reduce) { p.x += p.s; if (p.x > W + 8) Object.assign(p, spawn(false)); }
      }
      ctx.strokeStyle = cC; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(W * .72, cy); ctx.lineTo(W, cy); ctx.stroke();
      if (!reduce && vis) requestAnimationFrame(frame); else run = false;
    };
    const start = () => { if (run) return; run = true; requestAnimationFrame(frame); };
    colors(); size(); start();
    addEventListener('resize', () => { size(); if (reduce) requestAnimationFrame(frame); });
    matchMedia('(prefers-color-scheme: dark)').addEventListener('change', colors);
    if ('IntersectionObserver' in window) new IntersectionObserver(es => { vis = es[0].isIntersecting; if (vis) start(); }).observe(cv);
  }
})();

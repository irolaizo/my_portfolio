/* =========================================================
   Avatar de Iratxe — SVG con ojos que siguen el cursor,
   parpadeo, física de pelo y estados de ánimo.
   ========================================================= */
(function () {
  const SKIN = '#F7D5C0', SKIN_SH = '#EDB9A0', HAIR = '#3A2018', HAIR_HI = '#6A3E2C', HAIR_DK = '#26130E';
  const IRIS = '#5B3423', INK = '#2A1610';
  let uid = 0;

  function eye(id, cx, cy) {
    return `
    <g class="eye eye-${id.slice(-1)}" data-eye="${id}" transform="translate(${cx} ${cy})">
      <g class="eye-open">
        <clipPath id="clip-${id}"><ellipse rx="17" ry="19"/></clipPath>
        <ellipse rx="17" ry="19" fill="#fff"/>
        <g clip-path="url(#clip-${id})">
          <g class="iris">
            <circle r="11.5" fill="${IRIS}"/>
            <circle r="6" fill="#170c08"/>
            <circle cx="4" cy="-4.5" r="3.4" fill="#fff"/>
            <circle cx="-3.5" cy="3.5" r="1.5" fill="#fff" opacity=".8"/>
          </g>
          <path class="lid" d="M-20 -24 H20 V-19 Q0 -21 -20 -19Z" fill="${SKIN}"/>
        </g>
        <path d="M-18 -4 Q-14 -21 0 -20 Q14 -21 18 -6" fill="none" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>
        <path d="${id.endsWith('L') ? 'M-15 -11 L-22 -16 M-17 -6 L-24 -8' : 'M15 -11 L22 -16 M17 -6 L24 -8'}" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>
      </g>
      <path class="eye-happy" d="M-15 4 Q0 -14 15 4" fill="none" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>
      <path class="eye-closed" d="M-15 -2 Q0 10 15 -2" fill="none" stroke="${INK}" stroke-width="4.5" stroke-linecap="round"/>
      <g class="eye-dizzy" fill="none" stroke="${INK}" stroke-width="3" stroke-linecap="round">
        <path d="M0 0 m-2 0 a2 2 0 1 1 4 0 a5 5 0 1 1 -10 0 a8 8 0 1 1 16 0 a11 11 0 1 1 -22 0"/>
      </g>
      <path class="eye-heart" d="M0 12 C-20 -2 -14 -18 0 -8 C14 -18 20 -2 0 12Z" fill="#FF3D6E" stroke="#B3123F" stroke-width="2"/>
    </g>`;
  }

  function svg() {
    const p = 'av' + (++uid);
    return `
<svg class="avatar-svg" viewBox="0 0 400 470" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Ilustración de Iratxe">
  <defs>
    <pattern id="${p}-hound" width="12" height="12" patternUnits="userSpaceOnUse" patternTransform="rotate(-8)">
      <rect width="12" height="12" fill="#D9D3CF"/>
      <path d="M0 0h6v6H0z M6 6h6v6H6z" fill="#3B3537"/>
      <path d="M6 0 L9 0 L6 3z M0 6 L3 6 L0 9z M6 6 L3 6 L6 3z" fill="#3B3537"/>
    </pattern>
    <radialGradient id="${p}-face" cx=".45" cy=".4" r=".7">
      <stop offset="0" stop-color="#FBE2D2"/><stop offset="1" stop-color="${SKIN}"/>
    </radialGradient>
  </defs>

  <g class="av-bob">
    <!-- pelo trasero -->
    <g class="hair-back">
      <path d="M200 60 C118 58 68 118 74 196 C78 236 58 258 66 292 C72 318 52 338 60 368 C66 394 48 414 62 436 C78 456 110 452 126 434 C140 448 160 442 168 428 L232 428 C240 442 260 448 274 434 C290 452 322 456 338 436 C352 414 334 394 340 368 C348 338 328 318 334 292 C342 258 322 236 326 196 C332 118 282 58 200 60Z" fill="${HAIR}"/>
      <g fill="none" stroke="${HAIR_HI}" stroke-width="4" stroke-linecap="round" opacity=".75">
        <path d="M88 280 C72 304 98 326 82 352 C70 372 92 392 80 416"/>
        <path d="M104 330 C92 352 112 372 100 398"/>
        <path d="M314 280 C330 304 304 326 320 352 C332 372 310 392 322 416"/>
        <path d="M298 330 C310 352 290 372 302 398"/>
      </g>
    </g>

    <!-- cuerpo -->
    <g class="body">
      <path d="M172 300 h56 v56 q-28 18 -56 0z" fill="${SKIN_SH}"/>
      <path d="M150 352 Q200 384 250 352 L262 470 H138Z" fill="#17131a"/>
      <path d="M36 470 C40 412 78 374 140 358 L170 350 L190 424 L178 470Z" fill="url(#${p}-hound)" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>
      <path d="M364 470 C360 412 322 374 260 358 L230 350 L210 424 L222 470Z" fill="url(#${p}-hound)" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>
      <path d="M170 350 L156 392 L184 404" fill="none" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>
      <path d="M230 350 L244 392 L216 404" fill="none" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>
      <circle cx="200" cy="452" r="4" fill="#E4FF1A" stroke="${INK}" stroke-width="2"/>
    </g>

    <!-- cabeza -->
    <g class="head">
      <g class="hair-side">
        <path d="M112 196 C88 236 114 266 96 300 C82 326 106 348 90 376 C84 390 92 402 100 408 C120 392 126 368 118 344 C112 320 132 296 124 266 C118 244 130 226 124 206Z" fill="${HAIR}"/>
        <path d="M288 196 C312 236 286 266 304 300 C318 326 294 348 310 376 C316 390 308 402 300 408 C280 392 274 368 282 344 C288 320 268 296 276 266 C282 244 270 226 276 206Z" fill="${HAIR}"/>
        <path d="M106 290 C96 310 112 330 100 352" fill="none" stroke="${HAIR_HI}" stroke-width="3" stroke-linecap="round" opacity=".7"/>
        <path d="M294 290 C304 310 288 330 300 352" fill="none" stroke="${HAIR_HI}" stroke-width="3" stroke-linecap="round" opacity=".7"/>
      </g>
      <ellipse cx="108" cy="236" rx="12" ry="18" fill="${SKIN_SH}"/>
      <ellipse cx="292" cy="236" rx="12" ry="18" fill="${SKIN_SH}"/>
      <circle cx="292" cy="256" r="4" fill="#E4FF1A" stroke="${INK}" stroke-width="1.5"/>
      <path d="M200 112 C256 112 292 152 292 212 C292 268 254 318 200 320 C146 318 108 268 108 212 C108 152 144 112 200 112Z" fill="url(#${p}-face)"/>

      <g class="face">
        <ellipse class="cheek" cx="146" cy="262" rx="19" ry="11" fill="#F58E92" opacity=".45"/>
        <ellipse class="cheek" cx="254" cy="262" rx="19" ry="11" fill="#F58E92" opacity=".45"/>
        <g class="brows" stroke="${HAIR_DK}" stroke-width="6.5" stroke-linecap="round" fill="none">
          <path class="brow brow-L" d="M144 184 Q162 174 182 182"/>
          <path class="brow brow-R" d="M218 182 Q238 174 256 184"/>
        </g>
        ${eye(p + 'L', 163, 220)}
        ${eye(p + 'R', 237, 220)}
        <path d="M199 238 Q193 254 199 259 Q205 261 210 256" fill="none" stroke="#D49A80" stroke-width="3.5" stroke-linecap="round"/>

        <g class="mouth">
          <g class="m-smile">
            <clipPath id="${p}-ms"><path d="M166 274 Q200 314 234 274 Q200 286 166 274Z"/></clipPath>
            <path d="M166 274 Q200 314 234 274 Q200 286 166 274Z" fill="#7A1F2C"/>
            <g clip-path="url(#${p}-ms)">
              <path d="M160 270 Q200 290 240 270 L240 282 Q200 296 160 282Z" fill="#fff"/>
              <ellipse cx="200" cy="304" rx="16" ry="8" fill="#EE6F7C"/>
            </g>
            <path d="M166 274 Q200 314 234 274" fill="none" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>
          </g>
          <g class="m-laugh">
            <clipPath id="${p}-ml"><path d="M160 270 Q200 334 240 270 Q200 280 160 270Z"/></clipPath>
            <path d="M160 270 Q200 334 240 270 Q200 280 160 270Z" fill="#7A1F2C"/>
            <g clip-path="url(#${p}-ml)">
              <path d="M156 266 Q200 288 244 266 L244 280 Q200 296 156 280Z" fill="#fff"/>
              <ellipse cx="200" cy="314" rx="22" ry="12" fill="#EE6F7C"/>
            </g>
            <path d="M160 270 Q200 334 240 270 Q200 280 160 270Z" fill="none" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>
          </g>
          <g class="m-o">
            <ellipse cx="200" cy="284" rx="11" ry="14" fill="#7A1F2C" stroke="${INK}" stroke-width="3"/>
            <ellipse cx="200" cy="292" rx="7" ry="4" fill="#EE6F7C"/>
          </g>
          <path class="m-sad" d="M178 290 Q200 274 222 290" fill="none" stroke="${INK}" stroke-width="4.5" stroke-linecap="round"/>
          <path class="m-flat" d="M186 284 Q200 290 214 284" fill="none" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>
          <path class="m-smirk" d="M178 282 Q204 296 224 274" fill="none" stroke="${INK}" stroke-width="4.5" stroke-linecap="round"/>
        </g>
      </g>

      <g class="hair-front">
        <path d="M228 92 C176 86 122 116 108 172 C98 214 110 250 100 290 C110 268 116 238 122 214 C128 182 152 156 188 146 C210 138 226 122 228 92Z" fill="${HAIR}"/>
        <path d="M228 92 C272 96 302 132 300 184 C300 214 294 236 292 262 C286 236 284 214 278 196 C268 164 250 140 236 128 C230 118 228 106 228 92Z" fill="${HAIR}"/>
        <path d="M112 168 C124 112 176 80 228 92 C284 96 304 140 300 184 C284 144 256 124 230 118 C200 126 156 140 112 168Z" fill="${HAIR}"/>
        <path d="M140 140 C160 116 196 104 222 104" fill="none" stroke="${HAIR_HI}" stroke-width="4" stroke-linecap="round"/>
        <path d="M122 190 C116 214 120 236 112 262" fill="none" stroke="${HAIR_HI}" stroke-width="3.5" stroke-linecap="round" opacity=".8"/>
        <path d="M246 112 C272 124 288 150 292 178" fill="none" stroke="${HAIR_HI}" stroke-width="3.5" stroke-linecap="round" opacity=".8"/>
      </g>
    </g>
  </g>

  <g class="fx-zzz" font-family="Caveat, cursive" font-weight="700" fill="currentColor">
    <text x="300" y="120" font-size="34">z</text><text x="322" y="92" font-size="42">z</text><text x="348" y="58" font-size="52">Z</text>
  </g>
  <path class="fx-sweat" d="M300 150 C292 166 290 176 300 180 C310 176 308 166 300 150Z" fill="#7FD4FF" stroke="${INK}" stroke-width="2"/>
</svg>`;
  }

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  class Avatar {
    constructor(el, opts = {}) {
      this.el = el;
      this.opts = opts;
      el.insertAdjacentHTML('afterbegin', svg());
      this.svg = el.querySelector('svg');
      this.head = this.svg.querySelector('.head');
      this.face = this.svg.querySelector('.face');
      this.hairBack = this.svg.querySelector('.hair-back');
      this.hairSide = this.svg.querySelector('.hair-side');
      this.hairFront = this.svg.querySelector('.hair-front');
      this.irises = [...this.svg.querySelectorAll('.iris')];
      this.eyes = [...this.svg.querySelectorAll('.eye')];
      this.brows = [...this.svg.querySelectorAll('.brow')];
      this.target = { x: 0, y: 0 };
      this.cur = { x: 0, y: 0 };
      this.vel = { x: 0, y: 0 };
      this.sway = 0; this.swayV = 0;
      this.mood = 'idle';
      this.locked = 0;
      this.setFace('idle');
      this.loop = this.loop.bind(this);
      requestAnimationFrame(this.loop);
      if (!reduce) this.scheduleBlink();
    }

    // punto de interés en coordenadas de pantalla
    lookAt(px, py) {
      const r = this.svg.getBoundingClientRect();
      if (!r.width) return;
      const cx = r.left + r.width * 0.5, cy = r.top + r.height * 0.46;
      const dx = px - cx, dy = py - cy;
      const d = Math.hypot(dx, dy) || 1;
      const k = Math.min(1, d / (r.width * 1.6));
      this.target.x = (dx / d) * k;
      this.target.y = (dy / d) * k;
      this.near = d < r.width * 0.28;
      this.eyeTargets = this.eyes.map(e => {
        const b = e.getBoundingClientRect();
        const ex = px - (b.left + b.width / 2), ey = py - (b.top + b.height / 2);
        const ed = Math.hypot(ex, ey) || 1;
        const ek = Math.min(1, ed / 90);
        return { x: (ex / ed) * ek, y: (ey / ed) * ek };
      });
    }

    loop() {
      const t = this.target, c = this.cur;
      // muelle suave
      const ax = (t.x - c.x) * 0.09, ay = (t.y - c.y) * 0.09;
      this.vel.x = (this.vel.x + ax) * 0.78; this.vel.y = (this.vel.y + ay) * 0.78;
      c.x += this.vel.x; c.y += this.vel.y;
      // pelo con inercia
      this.swayV += (-this.vel.x * 40 - this.sway) * 0.08; this.swayV *= 0.86; this.sway += this.swayV;

      const rot = c.x * 7, hx = c.x * 10, hy = c.y * 6;
      this.head.setAttribute('transform', `translate(${hx} ${hy}) rotate(${rot} 200 330)`);
      this.face.setAttribute('transform', `translate(${c.x * 9} ${c.y * 7})`);
      this.hairFront.setAttribute('transform', `translate(${c.x * 4} ${c.y * 2}) rotate(${this.sway * 0.25} 228 92)`);
      this.hairSide.setAttribute('transform', `rotate(${this.sway * 0.4} 200 200)`);
      this.hairBack.setAttribute('transform', `translate(${hx * 0.35 - c.x * 4} ${hy * 0.3}) rotate(${this.sway * 0.3 + rot * 0.4} 200 120)`);

      const et = this.eyeTargets || [t, t];
      this.irises.forEach((ir, i) => {
        const e = et[i] || t;
        ir.setAttribute('transform', `translate(${e.x * 7} ${e.y * 8})`);
      });
      requestAnimationFrame(this.loop);
    }

    scheduleBlink() {
      clearTimeout(this.blinkT);
      this.blinkT = setTimeout(() => {
        if (this.svg.dataset.eyes === 'open') {
          this.svg.classList.add('blink');
          setTimeout(() => this.svg.classList.remove('blink'), 130);
          if (Math.random() < 0.2) setTimeout(() => { this.svg.classList.add('blink'); setTimeout(() => this.svg.classList.remove('blink'), 120); }, 260);
        }
        this.scheduleBlink();
      }, 1800 + Math.random() * 3800);
    }

    // estados de ánimo
    setFace(mood) {
      const M = {
        idle:    ['open', 'smile', 'normal'],
        curious: ['open', 'o', 'up'],
        excited: ['open', 'laugh', 'up'],
        happy:   ['happy', 'laugh', 'up'],
        love:    ['heart', 'laugh', 'up'],
        wink:    ['wink', 'smirk', 'normal'],
        sad:     ['open', 'sad', 'sad'],
        sleepy:  ['closed', 'flat', 'normal'],
        dizzy:   ['dizzy', 'o', 'sad'],
        shy:     ['happy', 'smile', 'sad'],
        focus:   ['open', 'flat', 'down'],
      }[mood] || ['open', 'smile', 'normal'];
      this.mood = mood;
      const s = this.svg.dataset;
      s.eyes = M[0]; s.mouth = M[1]; s.brows = M[2]; s.mood = mood;
    }

    // reacción temporal que vuelve al estado base
    react(mood, ms = 1600, then = 'idle') {
      clearTimeout(this.reactT);
      this.setFace(mood);
      this.el.classList.remove('pop'); void this.el.offsetWidth; this.el.classList.add('pop');
      this.reactT = setTimeout(() => this.setFace(then), ms);
    }

    nod() {
      this.el.classList.remove('nod'); void this.el.offsetWidth; this.el.classList.add('nod');
    }
  }

  window.Avatar = Avatar;
})();

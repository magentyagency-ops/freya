/*! Freya Sports Partners — 4bf397fa */
/* 00-core.js */
/* Noyau : utilitaires, boucle d'animation partagée, registre de modules. */
(() => {
  'use strict';
  const doc = document;
  const root = doc.documentElement;
  const F = (window.FSP = window.FSP || {});
  window.__fsp = true;

  F.doc = doc;
  F.root = root;
  F.reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  F.fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  F.$ = (s, c = doc) => c.querySelector(s);
  F.$$ = (s, c = doc) => Array.from(c.querySelectorAll(s));
  F.clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  F.lerp = (a, b, t) => a + (b - a) * t;
  F.easeOut = (t) => 1 - Math.pow(1 - t, 4);
  F.easeInOut = (t) => (t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2);

  // Registre de modules : chaque module s'initialise une fois le DOM prêt
  F.mods = [];
  F.mod = (name, fn) => F.mods.push([name, fn]);

  // Boucle rAF partagée — un seul requestAnimationFrame pour tout le site
  const subs = new Set();
  let running = false;
  const tick = (t) => {
    subs.forEach((fn) => fn(t));
    if (subs.size) requestAnimationFrame(tick);
    else running = false;
  };
  F.loop = (fn) => {
    subs.add(fn);
    if (!running) {
      running = true;
      requestAnimationFrame(tick);
    }
    return () => subs.delete(fn);
  };

  // État de défilement partagé, mis à jour une fois par frame
  F.vw = innerWidth;
  F.vh = innerHeight;
  F.sy = scrollY;
  const scrollSubs = new Set();
  let scrollQueued = false;
  const flushScroll = () => {
    scrollQueued = false;
    const y = scrollY;
    F.dir = y > F.sy ? 1 : y < F.sy ? -1 : F.dir || 0;
    F.sy = y;
    scrollSubs.forEach((fn) => fn(y));
  };
  addEventListener('scroll', () => {
    if (!scrollQueued) {
      scrollQueued = true;
      requestAnimationFrame(flushScroll);
    }
  }, { passive: true });
  F.onScroll = (fn, now = true) => {
    scrollSubs.add(fn);
    if (now) fn(scrollY);
    return () => scrollSubs.delete(fn);
  };

  const resizeSubs = new Set();
  let rt;
  addEventListener('resize', () => {
    clearTimeout(rt);
    rt = setTimeout(() => {
      F.vw = innerWidth;
      F.vh = innerHeight;
      resizeSubs.forEach((fn) => fn());
    }, 120);
  });
  F.onResize = (fn) => resizeSubs.add(fn);

  // Apparition au défilement (une seule fois)
  F.once = (els, cb, opts = {}) => {
    if (!('IntersectionObserver' in window)) return els.forEach(cb);
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          io.unobserve(e.target);
          cb(e.target);
        }
      });
    }, { rootMargin: opts.margin || '0px 0px -8% 0px', threshold: opts.threshold ?? 0.12 });
    els.forEach((el) => io.observe(el));
    return io;
  };

  // Visibilité continue (pour mettre en pause les animations hors écran)
  F.visible = (el, cb) => {
    if (!('IntersectionObserver' in window)) return cb(true);
    const io = new IntersectionObserver(([e]) => cb(e.isIntersecting), { threshold: 0 });
    io.observe(el);
    return io;
  };

  // Notification discrète
  let toastT;
  F.toast = (msg) => {
    const t = F.$('[data-toast]');
    if (!t) return;
    t.textContent = msg;
    t.classList.add('is-on');
    clearTimeout(toastT);
    toastT = setTimeout(() => t.classList.remove('is-on'), 2600);
  };

  // L'intro (préchargeur) est-elle terminée ?
  F.introDone = new Promise((resolve) => (F._resolveIntro = resolve));

  F.fmt = (n, d = 0) => n.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });
})();

/* 10-text.js */
/* Typographie animée : découpage en mots, apparitions, brouillage, compteurs, surbrillance. */
(() => {
  const F = window.FSP;
  const { doc } = F;

  // Découpe les nœuds texte en mots masqués, en conservant la structure (span.dim, br…)
  function splitWords(el, wrapCls = 'w') {
    let wi = 0;
    const walk = (node) => {
      Array.from(node.childNodes).forEach((n) => {
        if (n.nodeType === 3) {
          const parts = n.textContent.split(/([ \t\n\r]+)/);
          if (!parts.some((p) => p.trim())) return;
          const frag = doc.createDocumentFragment();
          parts.forEach((p) => {
            if (!p) return;
            if (!p.trim()) {
              frag.appendChild(doc.createTextNode(' '));
              return;
            }
            const w = doc.createElement('span');
            w.className = wrapCls;
            w.style.setProperty('--wi', wi++);
            const inner = doc.createElement('span');
            inner.textContent = p;
            w.appendChild(inner);
            frag.appendChild(w);
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1 && n.tagName !== 'BR' && n.tagName !== 'SVG') {
          walk(n);
        }
      });
    };
    walk(el);
    return wi;
  }
  F.splitWords = splitWords;

  const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/—·+';
  function scramble(el, duration = 900) {
    if (F.reduced || el.dataset.scrambled) return;
    el.dataset.scrambled = '1';
    const final = el.textContent;
    const len = final.length;
    const start = performance.now();
    const stop = F.loop((t) => {
      const p = Math.min(1, (t - start) / duration);
      let out = '';
      for (let i = 0; i < len; i++) {
        const c = final[i];
        if (c === ' ' || p >= 1 || p > (i / len) * 0.75 + 0.25) out += c;
        else out += GLYPHS[(Math.random() * GLYPHS.length) | 0];
      }
      el.textContent = out;
      if (p >= 1) stop();
    });
  }
  F.scramble = scramble;

  function count(el) {
    const target = parseFloat(el.dataset.count);
    const dec = parseInt(el.dataset.decimals || '0', 10);
    if (F.reduced || isNaN(target)) {
      el.textContent = F.fmt(target, dec);
      return;
    }
    const start = performance.now();
    const dur = 1700;
    el.textContent = F.fmt(0, dec);
    const stop = F.loop((t) => {
      const p = Math.min(1, (t - start) / dur);
      el.textContent = F.fmt(target * F.easeOut(p), dec);
      if (p >= 1) stop();
    });
  }

  F.mod('text', () => {
    const splits = F.$$('[data-split]');
    splits.forEach((el) => splitWords(el));

    const inHero = (el) => !!el.closest('[data-hero], .phero');
    const reveal = (el) => {
      el.classList.add('is-in');
      if (el.matches('[data-scramble]')) scramble(el);
      F.$$('[data-scramble]', el).forEach((s) => scramble(s));
      F.$$('[data-count]', el).forEach(count);
      if (el.matches('[data-count]')) count(el);
    };

    const targets = F.$$('[data-reveal], [data-split], [data-scramble], .chart, .funnel, .chart--hbars');
    const now = targets.filter(inHero);
    const later = targets.filter((el) => !inHero(el));

    F.introDone.then(() => {
      F.$$('[data-hero], .phero').forEach((h) => h.classList.add('is-live'));
      now.forEach((el) => reveal(el));
    });
    F.once(later, reveal);

    // Mesure des tracés à dessiner
    F.$$('[data-draw]').forEach((p) => {
      try {
        p.style.setProperty('--len', Math.ceil(p.getTotalLength()));
      } catch (e) {}
    });
  });

  // Texte qui s'éclaire mot à mot au rythme du défilement
  F.mod('highlight', () => {
    F.$$('[data-highlight]').forEach((el) => {
      const n = splitWords(el, 'hw');
      const words = F.$$('.hw', el);
      if (F.reduced || !n) return;
      let last = -1;
      F.onScroll(() => {
        const r = el.getBoundingClientRect();
        const start = F.vh * 0.82, end = F.vh * 0.3;
        const p = F.clamp((start - r.top) / (start - end + r.height * 0.6));
        const lit = p * words.length;
        const idx = Math.floor(lit * 4);
        if (idx === last) return;
        last = idx;
        words.forEach((w, i) => (w.style.opacity = (0.16 + F.clamp(lit - i) * 0.84).toFixed(3)));
      });
    });
  });
})();

/* 20-chrome.js */
/* Chrome du site : préchargeur, en-tête, méga-menus, menu, curseur, horloges, grille. */
(() => {
  const F = window.FSP;
  const { doc, root } = F;

  /* Préchargeur — première visite de la session, sur l'accueil */
  F.mod('preloader', () => {
    const pre = F.$('[data-preloader]');
    if (!pre || !root.classList.contains('is-intro')) {
      F._resolveIntro();
      return;
    }
    const count = F.$('[data-pre-count]', pre);
    const bar = F.$('[data-pre-bar]', pre);
    const status = F.$('[data-pre-status]', pre);
    const steps = ['Calibrating models', 'Aggregating signals', 'Surface ready'];
    const start = performance.now();
    const dur = 1900;
    const stop = F.loop((t) => {
      const p = Math.min(1, (t - start) / dur);
      const e = F.easeInOut(p);
      count.textContent = String(Math.round(e * 100)).padStart(3, '0');
      bar.style.setProperty('--p', e.toFixed(4));
      status.textContent = steps[Math.min(steps.length - 1, Math.floor(p * steps.length))];
      if (p >= 1) {
        stop();
        setTimeout(() => {
          pre.classList.add('is-done');
          F._resolveIntro();
          try { sessionStorage.setItem('fsp-intro', '1'); } catch (e) {}
          setTimeout(() => {
            root.classList.remove('is-intro');
            pre.remove();
          }, 1050);
        }, 180);
      }
    });
  });

  /* En-tête : état, masquage directionnel, progression, thème de la section survolée */
  F.mod('header', () => {
    const hdr = F.$('[data-hdr]');
    if (!hdr) return;
    const progress = F.$('.hdr__progress', hdr);
    let lastTheme = hdr.dataset.theme;

    const probe = () => {
      const y = hdr.offsetHeight / 2;
      const stack = doc.elementsFromPoint(F.vw / 2, y);
      for (const el of stack) {
        if (hdr.contains(el) || el.closest('.scrim, .menu, .gridview')) continue;
        const sec = el.closest('[data-theme]');
        if (sec && sec !== hdr) return sec.dataset.theme;
      }
      return lastTheme;
    };

    F.onScroll((y) => {
      hdr.classList.toggle('is-scrolled', y > 8);
      if (!root.classList.contains('has-mega') && !root.classList.contains('has-menu')) {
        hdr.classList.toggle('is-hidden', y > 240 && F.dir > 0);
        root.classList.toggle('hdr-hidden', hdr.classList.contains('is-hidden'));
      }
      const max = doc.documentElement.scrollHeight - F.vh;
      if (progress) progress.style.setProperty('--progress', max > 0 ? (y / max).toFixed(4) : 0);
      const th = probe();
      if (th && th !== lastTheme) {
        lastTheme = th;
        hdr.dataset.theme = th === 'void' ? 'dark' : th;
      }
    });

    /* Méga-menus */
    const buttons = F.$$('[data-mega]', hdr);
    const scrim = F.$('[data-scrim]');
    let open = null, closeT;
    const panelOf = (b) => F.$(`[data-mega-panel="${b.dataset.mega}"]`, hdr);
    const close = () => {
      if (!open) return;
      open.setAttribute('aria-expanded', 'false');
      panelOf(open).classList.remove('is-open');
      open = null;
      hdr.classList.remove('is-mega');
      root.classList.remove('has-mega');
    };
    const show = (b) => {
      clearTimeout(closeT);
      if (open === b) return;
      if (open) {
        open.setAttribute('aria-expanded', 'false');
        panelOf(open).classList.remove('is-open');
      }
      open = b;
      b.setAttribute('aria-expanded', 'true');
      panelOf(b).classList.add('is-open');
      hdr.classList.add('is-mega');
      root.classList.add('has-mega');
    };
    buttons.forEach((b) => {
      b.addEventListener('click', () => (open === b ? close() : show(b)));
      if (F.fine) {
        b.addEventListener('mouseenter', () => { clearTimeout(closeT); closeT = setTimeout(() => show(b), open ? 0 : 90); });
      }
    });
    if (F.fine) {
      hdr.addEventListener('mouseleave', () => { clearTimeout(closeT); closeT = setTimeout(close, 220); });
      hdr.addEventListener('mouseenter', () => open && clearTimeout(closeT));
      F.$$('.nav__link:not([data-mega]), .brand, .hdr__actions', hdr).forEach((el) => el.addEventListener('mouseenter', () => { clearTimeout(closeT); closeT = setTimeout(close, 120); }));
    }
    scrim && scrim.addEventListener('click', close);
    doc.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && open) {
        const b = open;
        close();
        b.focus();
      }
    });

    /* Menu plein écran */
    const toggle = F.$('[data-menu-toggle]');
    const menu = F.$('[data-menu]');
    if (toggle && menu) {
      const label = F.$('.burger__txt', toggle);
      const setMenu = (on) => {
        menu.classList.toggle('is-open', on);
        hdr.classList.toggle('is-menu', on);
        root.classList.toggle('has-menu', on);
        toggle.setAttribute('aria-expanded', String(on));
        if (label) label.textContent = on ? 'Close' : 'Menu';
        root.style.overflow = on ? 'hidden' : '';
        if (on) hdr.dataset.theme = 'dark';
        if (on) setTimeout(() => F.$('a', menu)?.focus({ preventScroll: true }), 350);
      };
      toggle.addEventListener('click', () => setMenu(!menu.classList.contains('is-open')));
      doc.addEventListener('keydown', (e) => e.key === 'Escape' && menu.classList.contains('is-open') && (setMenu(false), toggle.focus()));
      F.$$('a', menu).forEach((a) => a.addEventListener('click', () => setMenu(false)));
    }
  });


  /* Effet magnétique */
  F.mod('magnetic', () => {
    if (!F.fine || F.reduced) return;
    F.$$('[data-magnetic]').forEach((el) => {
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        const x = e.clientX - (r.left + r.width / 2);
        const y = e.clientY - (r.top + r.height / 2);
        el.classList.add('is-mag');
        el.style.setProperty('--mag-x', `${(x * 0.18).toFixed(1)}px`);
        el.style.setProperty('--mag-y', `${(y * 0.32).toFixed(1)}px`);
      });
      el.addEventListener('pointerleave', () => {
        el.classList.remove('is-mag');
        el.style.setProperty('--mag-x', '0px');
        el.style.setProperty('--mag-y', '0px');
      });
    });
  });

  /* Halo qui suit le pointeur sur les cartes */
  F.mod('spotlight', () => {
    doc.addEventListener('pointermove', (e) => {
      const el = e.target.closest && e.target.closest('[data-spotlight] .scard__a, .spot');
      if (!el) return;
      const r = el.getBoundingClientRect();
      el.style.setProperty('--mx', `${e.clientX - r.left}px`);
      el.style.setProperty('--my', `${e.clientY - r.top}px`);
    }, { passive: true });
  });

  /* Horloges des places financières */
  F.mod('clocks', () => {
    const clocks = F.$$('[data-tz]');
    if (!clocks.length) return;
    const fmts = clocks.map((c) => new Intl.DateTimeFormat('en-GB', { timeZone: c.dataset.tz, hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }));
    const days = clocks.map((c) => new Intl.DateTimeFormat('en-US', { timeZone: c.dataset.tz, weekday: 'short', hour: 'numeric', hour12: false }));
    const update = () => {
      const now = new Date();
      clocks.forEach((c, i) => {
        F.$('[data-time]', c).textContent = fmts[i].format(now);
        const parts = days[i].formatToParts(now);
        const wd = parts.find((p) => p.type === 'weekday').value;
        const h = parseInt(parts.find((p) => p.type === 'hour').value, 10) % 24;
        const [o, cl] = c.dataset.open.split('-').map(Number);
        const isOpen = !['Sat', 'Sun'].includes(wd) && h >= o && h < cl;
        const st = F.$('[data-state]', c);
        st.textContent = isOpen ? 'Open' : 'Closed';
        st.classList.toggle('is-open', isOpen);
      });
    };
    update();
    setInterval(update, 1000);
  });

  /* Signature géante du pied de page : halo qui suit la souris */
  F.mod('giant', () => {
    const g = F.$('[data-giant]');
    if (!g || !F.fine) return;
    const grad = doc.getElementById('ftr-spot');
    const svg = F.$('svg', g);
    const ftr = g.closest('footer');
    ftr.addEventListener('pointermove', (e) => {
      const r = svg.getBoundingClientRect();
      grad.setAttribute('cx', (((e.clientX - r.left) / r.width) * 1000).toFixed(1));
      grad.setAttribute('cy', (((e.clientY - r.top) / r.height) * 214).toFixed(1));
    }, { passive: true });
  });

  /* Grille de composition — touche G */
  F.mod('gridview', () => {
    doc.addEventListener('keydown', (e) => {
      if (e.key !== 'g' && e.key !== 'G') return;
      if (e.metaKey || e.ctrlKey || e.altKey || e.target.closest('input, textarea, select, [contenteditable]')) return;
      root.classList.toggle('show-grid');
    });
  });

  /* Coordonnées du pointeur dans le hero */
  F.mod('hud', () => {
    const out = F.$('[data-hud-coords]');
    const hero = F.$('[data-hero]');
    if (!out || !hero) return;
    hero.addEventListener('pointermove', (e) => {
      const r = hero.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = 1 - (e.clientY - r.top) / r.height;
      out.textContent = `X ${x.toFixed(3)} · Y ${y.toFixed(3)}`;
    }, { passive: true });
  });
})();

/* 30-surface.js */
/* Surface de signal — nuage de points WebGL (hero d'accueil, portail, 404).
   Bruit simplex 3D : Ian McEwan, Ashima Arts / Stefan Gustavson (licence MIT). */
(() => {
  const F = window.FSP;

  const NOISE = `
vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+10.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1.0/6.0,1.0/3.0);const vec4 D=vec4(0.0,0.5,1.0,2.0);
  vec3 i=floor(v+dot(v,C.yyy));vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);vec3 l=1.0-g;vec3 i1=min(g.xyz,l.zxy);vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;vec3 x2=x0-i2+C.yyy;vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
  float n_=0.142857142857;vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.0*floor(p*ns.z*ns.z);vec4 x_=floor(j*ns.z);vec4 y_=floor(j-7.0*x_);
  vec4 x=x_*ns.x+ns.yyyy;vec4 y=y_*ns.x+ns.yyyy;vec4 h=1.0-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.0+1.0;vec4 s1=floor(b1)*2.0+1.0;vec4 sh=-step(h,vec4(0.0));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);vec3 p1=vec3(a0.zw,h.y);vec3 p2=vec3(a1.xy,h.z);vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(0.5-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);m=m*m;
  return 105.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}`;

  const VS = `
attribute vec2 aP;
uniform mat4 uPV;
uniform vec3 uEye;
uniform float uT, uAmp, uDpr, uSize, uIso;
uniform vec3 uMouse;
varying vec3 vC;
varying float vA;
${NOISE}
float surf(vec2 p, float t){
  float n = snoise(vec3(p*0.12, t*0.035))*1.4;
  n += snoise(vec3(p*0.33+7.3, t*0.06))*0.42;
  n += snoise(vec3(p*0.95-3.1, t*0.1))*0.08;
  return n;
}
void main(){
  vec2 p = vec2(aP.x*12.0, aP.y*7.5 - 2.0);
  float h = surf(p, uT)*uAmp;
  float d = distance(p, uMouse.xy);
  h += exp(-d*d*0.22)*0.95*uMouse.z;
  h += sin(d*2.4 - uT*2.0)*exp(-d*0.5)*0.11*uMouse.z;
  vec3 w = vec3(p.x, h, p.y);
  gl_Position = uPV*vec4(w, 1.0);
  float depth = distance(w, uEye);
  float hn = clamp((h + 1.5)/3.0, 0.0, 1.0);
  gl_PointSize = uDpr*(0.8 + hn*1.6)*uSize/depth;
  vec3 low = vec3(0.12, 0.17, 0.24);
  vec3 mid = vec3(0.44, 0.55, 0.66);
  vec3 high = vec3(0.88, 0.95, 1.0);
  vec3 c = mix(low, mid, smoothstep(0.05, 0.55, hn));
  c = mix(c, high, smoothstep(0.55, 0.98, hn));
  float iso = (1.0 - smoothstep(0.0, 0.055, abs(fract(h*2.3 + 0.5) - 0.5)))*uIso;
  c = mix(c, vec3(0.55, 0.80, 0.95)*1.3, iso*0.9*smoothstep(0.0, 0.4, uAmp));
  float fogFar = 1.0 - smoothstep(13.0, 27.0, depth);
  float fogNear = smoothstep(3.0, 7.0, depth);
  float edge = 1.0 - smoothstep(0.7, 1.0, abs(aP.x));
  vA = fogFar*fogNear*edge*(0.42 + hn*1.05)*(0.75 + iso*1.1);
  vC = c;
}`;

  const FS = `
precision mediump float;
varying vec3 vC;
varying float vA;
void main(){
  vec2 q = gl_PointCoord - 0.5;
  float r = dot(q, q);
  if (r > 0.25) discard;
  float a = smoothstep(0.25, 0.015, r)*vA;
  gl_FragColor = vec4(vC*a, a);
}`;

  // Mathématiques 4 × 4 minimales (colonnes majeures)
  const M = {
    persp(fovy, asp, n, f) {
      const t = 1 / Math.tan(fovy / 2), nf = 1 / (n - f);
      return [t / asp, 0, 0, 0, 0, t, 0, 0, 0, 0, (f + n) * nf, -1, 0, 0, 2 * f * n * nf, 0];
    },
    look(e, c, u) {
      let zx = e[0] - c[0], zy = e[1] - c[1], zz = e[2] - c[2];
      let l = Math.hypot(zx, zy, zz); zx /= l; zy /= l; zz /= l;
      let xx = u[1] * zz - u[2] * zy, xy = u[2] * zx - u[0] * zz, xz = u[0] * zy - u[1] * zx;
      l = Math.hypot(xx, xy, xz); xx /= l; xy /= l; xz /= l;
      const yx = zy * xz - zz * xy, yy = zz * xx - zx * xz, yz = zx * xy - zy * xx;
      return [xx, yx, zx, 0, xy, yy, zy, 0, xz, yz, zz, 0, -(xx * e[0] + xy * e[1] + xz * e[2]), -(yx * e[0] + yy * e[1] + yz * e[2]), -(zx * e[0] + zy * e[1] + zz * e[2]), 1];
    },
    mul(a, b) {
      const o = new Array(16);
      for (let c = 0; c < 4; c++) for (let r = 0; r < 4; r++) o[c * 4 + r] = a[r] * b[c * 4] + a[4 + r] * b[c * 4 + 1] + a[8 + r] * b[c * 4 + 2] + a[12 + r] * b[c * 4 + 3];
      return o;
    },
    inv(m) {
      const [a00, a01, a02, a03, a10, a11, a12, a13, a20, a21, a22, a23, a30, a31, a32, a33] = m;
      const b00 = a00 * a11 - a01 * a10, b01 = a00 * a12 - a02 * a10, b02 = a00 * a13 - a03 * a10, b03 = a01 * a12 - a02 * a11;
      const b04 = a01 * a13 - a03 * a11, b05 = a02 * a13 - a03 * a12, b06 = a20 * a31 - a21 * a30, b07 = a20 * a32 - a22 * a30;
      const b08 = a20 * a33 - a23 * a30, b09 = a21 * a32 - a22 * a31, b10 = a21 * a33 - a23 * a31, b11 = a22 * a33 - a23 * a32;
      let det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
      if (!det) return null;
      det = 1 / det;
      return [
        (a11 * b11 - a12 * b10 + a13 * b09) * det, (a02 * b10 - a01 * b11 - a03 * b09) * det, (a31 * b05 - a32 * b04 + a33 * b03) * det, (a22 * b04 - a21 * b05 - a23 * b03) * det,
        (a12 * b08 - a10 * b11 - a13 * b07) * det, (a00 * b11 - a02 * b08 + a03 * b07) * det, (a32 * b02 - a30 * b05 - a33 * b01) * det, (a20 * b05 - a22 * b02 + a23 * b01) * det,
        (a10 * b10 - a11 * b08 + a13 * b06) * det, (a01 * b08 - a00 * b10 - a03 * b06) * det, (a30 * b04 - a31 * b02 + a33 * b00) * det, (a21 * b02 - a20 * b04 - a23 * b00) * det,
        (a11 * b07 - a10 * b09 - a12 * b06) * det, (a00 * b09 - a01 * b07 + a02 * b06) * det, (a31 * b01 - a30 * b03 - a32 * b00) * det, (a20 * b03 - a21 * b01 + a22 * b00) * det,
      ];
    },
    tx(m, v) {
      const x = m[0] * v[0] + m[4] * v[1] + m[8] * v[2] + m[12];
      const y = m[1] * v[0] + m[5] * v[1] + m[9] * v[2] + m[13];
      const z = m[2] * v[0] + m[6] * v[1] + m[10] * v[2] + m[14];
      const w = m[3] * v[0] + m[7] * v[1] + m[11] * v[2] + m[15];
      return [x / w, y / w, z / w];
    },
  };

  function surface(canvas) {
    const gl = canvas.getContext('webgl', { antialias: false, alpha: false, depth: false, powerPreference: 'high-performance' });
    if (!gl) return false;
    const mk = (type, src) => {
      const s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
      return s;
    };
    const prog = gl.createProgram();
    gl.attachShader(prog, mk(gl.VERTEX_SHADER, VS));
    gl.attachShader(prog, mk(gl.FRAGMENT_SHADER, FS));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog));
    gl.useProgram(prog);

    const dense = canvas.dataset.density === 'low' || F.vw < 760;
    const NX = dense ? 150 : 300, NZ = dense ? 96 : 176;
    const pos = new Float32Array(NX * NZ * 2);
    let k = 0;
    for (let j = 0; j < NZ; j++) for (let i = 0; i < NX; i++) { pos[k++] = (i / (NX - 1)) * 2 - 1; pos[k++] = (j / (NZ - 1)) * 2 - 1; }
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, pos, gl.STATIC_DRAW);
    const aP = gl.getAttribLocation(prog, 'aP');
    gl.enableVertexAttribArray(aP);
    gl.vertexAttribPointer(aP, 2, gl.FLOAT, false, 0, 0);
    const U = {};
    ['uPV', 'uEye', 'uT', 'uAmp', 'uDpr', 'uSize', 'uMouse', 'uIso'].forEach((n) => (U[n] = gl.getUniformLocation(prog, n)));
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE);
    gl.clearColor(3 / 255, 5 / 255, 8 / 255, 1);

    const host = canvas.closest('[data-hero], [data-gl-host]') || canvas.parentElement;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
    let W = 0, H = 0;
    const resize = () => {
      const r = canvas.getBoundingClientRect();
      W = Math.max(1, Math.round(r.width * dpr));
      H = Math.max(1, Math.round(r.height * dpr));
      canvas.width = W;
      canvas.height = H;
      gl.viewport(0, 0, W, H);
    };
    resize();
    F.onResize(() => { resize(); if (F.reduced) draw(performance.now()); });

    const camY = parseFloat(canvas.dataset.camY || '3.2');
    const iso = parseFloat(canvas.dataset.iso || '1');
    let mouse = [0, 2, 0], mTarget = [0, 2, 0], mStr = 0, mStrT = 0;
    let ndc = null, pv = null, eye = [0, camY, 9.5];
    let amp = F.reduced ? 1 : 0, ampT = 0, born = 0;
    let scrollP = 0;

    host.addEventListener('pointermove', (e) => {
      const r = canvas.getBoundingClientRect();
      ndc = [((e.clientX - r.left) / r.width) * 2 - 1, -(((e.clientY - r.top) / r.height) * 2 - 1)];
      mStrT = 1;
    }, { passive: true });
    host.addEventListener('pointerleave', () => (mStrT = 0));

    if (canvas.closest('[data-hero]')) {
      F.onScroll((y) => (scrollP = F.clamp(y / Math.max(1, host.offsetHeight))));
    }

    const draw = (now) => {
      const t = now / 1000;
      if (!born) born = t;
      const life = t - born;
      if (!F.reduced) amp = ampT ? F.easeInOut(F.clamp(life / 2.8)) : 0;
      const asp = W / H;
      const drift = Math.sin(t * 0.045) * 1.1;
      const mx = ndc ? ndc[0] : 0, my = ndc ? ndc[1] : 0;
      eye = [drift + mx * 0.5, camY + scrollP * 2.2 + my * 0.25, 9.6 - scrollP * 1.5];
      const target = [drift * 0.4 + mx * 0.9, -0.3 - scrollP * 0.6, -2.4];
      const fov = asp < 1 ? 0.95 : 0.7;
      pv = M.mul(M.persp(fov, asp, 0.1, 60), M.look(eye, target, [0, 1, 0]));

      if (ndc) {
        const inv = M.inv(pv);
        if (inv) {
          const a = M.tx(inv, [ndc[0], ndc[1], -1]), b = M.tx(inv, [ndc[0], ndc[1], 1]);
          const s = a[1] / (a[1] - b[1]);
          if (s > 0 && s < 1) mTarget = [a[0] + (b[0] - a[0]) * s, a[2] + (b[2] - a[2]) * s];
        }
      }
      mouse[0] += (mTarget[0] - mouse[0]) * 0.08;
      mouse[1] += (mTarget[1] - mouse[1]) * 0.08;
      mStr += (mStrT - mStr) * 0.04;

      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniformMatrix4fv(U.uPV, false, pv);
      gl.uniform3fv(U.uEye, eye);
      gl.uniform1f(U.uT, F.reduced ? 12.0 : t);
      gl.uniform1f(U.uAmp, amp * (1 - scrollP * 0.35));
      gl.uniform1f(U.uDpr, dpr);
      gl.uniform1f(U.uSize, F.vw < 760 ? 15.0 : 19.0);
      gl.uniform1f(U.uIso, iso);
      gl.uniform3f(U.uMouse, mouse[0], mouse[1], F.reduced ? 0 : mStr);
      gl.drawArrays(gl.POINTS, 0, NX * NZ);
    };

    let stop = null, onScreen = true;
    const run = () => {
      if (stop || F.reduced) return;
      stop = F.loop(draw);
    };
    const halt = () => { stop && stop(); stop = null; };
    F.visible(host, (v) => { onScreen = v; v && !document.hidden ? run() : halt(); });
    document.addEventListener('visibilitychange', () => (document.hidden ? halt() : onScreen && run()));
    canvas.addEventListener('webglcontextlost', (e) => { e.preventDefault(); halt(); });

    F.introDone.then(() => {
      ampT = 1;
      born = 0;
      canvas.classList.add('is-ready');
      if (F.reduced) { amp = 1; draw(performance.now()); }
    });
    return true;
  }

  F.mod('surface', () => {
    F.$$('[data-gl="surface"]').forEach((c) => {
      try {
        if (surface(c)) F.root.classList.add('has-gl');
      } catch (err) {
        console.warn('[Freya] WebGL indisponible :', err.message);
      }
    });
  });
})();

/* 40-scroll.js */
/* Défilement : section horizontale épinglée, parallaxe légère. */
(() => {
  const F = window.FSP;

  F.mod('hscroll', () => {
    F.$$('[data-hscroll]').forEach((sec) => {
      const track = F.$('[data-hs-track]', sec);
      const cur = F.$('[data-hs-current]', sec);
      const bar = F.$('[data-hs-bar]', sec);
      const cards = F.$$(':scope > *', track);
      if (!track || !cards.length) return;
      let dist = 0, top = 0, active = false, lastI = -1;

      const measure = () => {
        active = F.vw > 900;
        if (!active) {
          sec.style.removeProperty('--hs-h');
          track.style.removeProperty('--x');
          return;
        }
        dist = Math.max(0, track.scrollWidth - F.vw);
        sec.style.setProperty('--hs-h', `${F.vh + dist}px`);
        top = sec.getBoundingClientRect().top + scrollY;
      };

      const update = (y) => {
        let p;
        if (active) {
          p = F.clamp((y - top) / Math.max(1, dist));
          track.style.setProperty('--x', `${(-p * dist).toFixed(1)}px`);
        } else {
          p = F.clamp(track.scrollLeft / Math.max(1, track.scrollWidth - track.clientWidth));
        }
        bar && bar.style.setProperty('--p', (0.2 + p * 0.8).toFixed(4));
        const i = Math.min(cards.length - 1, Math.round(p * (cards.length - 1)));
        if (i !== lastI && cur) {
          lastI = i;
          cur.textContent = String(i + 1).padStart(2, '0');
        }
      };

      measure();
      F.onResize(() => { measure(); update(scrollY); });
      addEventListener('load', () => { measure(); update(scrollY); });
      F.onScroll(update);
      track.addEventListener('scroll', () => !active && update(scrollY), { passive: true });
    });
  });

  // Parallaxe : data-parallax="0.15" (fraction de la vitesse de défilement)
  F.mod('parallax', () => {
    if (F.reduced) return;
    const els = F.$$('[data-parallax]');
    if (!els.length) return;
    F.onScroll(() => {
      els.forEach((el) => {
        const r = el.parentElement.getBoundingClientRect();
        if (r.bottom < -200 || r.top > F.vh + 200) return;
        const k = parseFloat(el.dataset.parallax) || 0.1;
        const c = r.top + r.height / 2 - F.vh / 2;
        el.style.transform = `translate3d(0, ${(-c * k).toFixed(1)}px, 0)`;
      });
    });
  });
})();

/* 50-charts.js */
/* Graphiques : réticule + info-bulle (courbes), info-bulles par marque (radar, matrice). */
(() => {
  const F = window.FSP;
  const { doc } = F;
  const SVGNS = 'http://www.w3.org/2000/svg';

  const el = (tag, cls, text) => {
    const e = doc.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  };

  function placeTip(tip, host, x, y) {
    const hw = host.clientWidth;
    const tw = tip.offsetWidth, th = tip.offsetHeight;
    let left = x + 18;
    if (left + tw > hw) left = x - tw - 18;
    let top = y - th / 2;
    top = Math.max(-10, Math.min(host.clientHeight - th + 10, top));
    tip.style.setProperty('--tx', `${Math.round(left)}px`);
    tip.style.setProperty('--ty', `${Math.round(top)}px`);
  }

  function lineChart(fig) {
    const plot = F.$('.chart__plot', fig);
    const svg = F.$('svg', plot);
    const tip = F.$('.chart__tip', plot);
    const dataEl = F.$('script[type="application/json"]', plot);
    if (!svg || !tip || !dataEl) return;
    const data = JSON.parse(dataEl.textContent);
    const g = JSON.parse(svg.dataset.geom);
    const cross = F.$('.c-cross', svg);
    const line = F.$('.c-crossline', svg);
    const n = data.x.length;
    const sx = (i) => g.L + (i / (n - 1)) * (g.R - g.L);
    const sy = (v) => g.B - (v / g.yMax) * (g.B - g.T);
    const dots = data.series.map((s) => {
      const c = doc.createElementNS(SVGNS, 'circle');
      c.setAttribute('r', '5');
      c.setAttribute('class', 'c-crossdot');
      c.style.fill = s.hi ? 'var(--chart-1)' : 'var(--chart-2)';
      cross.appendChild(c);
      return c;
    });
    plot.tabIndex = 0;
    plot.setAttribute('role', 'group');
    plot.setAttribute('aria-label', 'Interactive chart: use the left and right arrow keys to move between years.');
    let idx = n - 1;

    const show = (i) => {
      idx = Math.max(0, Math.min(n - 1, i));
      const x = sx(idx);
      line.setAttribute('transform', `translate(${x} 0)`);
      data.series.forEach((s, k) => {
        dots[k].setAttribute('cx', x);
        dots[k].setAttribute('cy', sy(s.values[idx]));
      });
      tip.replaceChildren();
      const proj = data.proj && data.x[idx] >= data.proj;
      tip.appendChild(el('div', 'tip__x', `${data.x[idx]}${proj ? ' · projection' : ''}`));
      data.series.forEach((s) => {
        const row = el('div', 'tip__row');
        const lab = el('span');
        const key = el('i', `key key--line${s.hi ? ' key--hi' : ''}`);
        lab.append(key, doc.createTextNode(s.name));
        row.append(lab, el('b', '', F.fmt(s.values[idx])));
        tip.appendChild(row);
      });
      if (data.series.length >= 2) {
        const gap = data.series[0].values[idx] - data.series[1].values[idx];
        const row = el('div', 'tip__row tip__gap');
        row.append(el('span', '', 'Gap'), el('b', '', (gap > 0 ? '+' : '') + F.fmt(gap)));
        tip.appendChild(row);
      }
      const ctm = svg.getScreenCTM();
      const pr = plot.getBoundingClientRect();
      if (ctm) {
        const pt = svg.createSVGPoint();
        pt.x = x;
        pt.y = sy(data.series[0].values[idx]);
        const p = pt.matrixTransform(ctm);
        placeTip(tip, plot, p.x - pr.left, p.y - pr.top);
      }
      fig.classList.add('is-hover');
    };
    const hide = () => fig.classList.remove('is-hover');

    svg.addEventListener('pointermove', (e) => {
      const ctm = svg.getScreenCTM();
      if (!ctm) return;
      const pt = svg.createSVGPoint();
      pt.x = e.clientX;
      pt.y = e.clientY;
      const p = pt.matrixTransform(ctm.inverse());
      if (p.x < g.L - 20 || p.x > g.R + 20) return hide();
      show(Math.round(((p.x - g.L) / (g.R - g.L)) * (n - 1)));
    });
    svg.addEventListener('pointerleave', hide);
    plot.addEventListener('focus', () => show(idx));
    plot.addEventListener('blur', hide);
    plot.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') { e.preventDefault(); show(idx + 1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); show(idx - 1); }
      if (e.key === 'Escape') hide();
    });
  }

  // Info-bulles portées par les marques (radar, matrice des risques…)
  function markTips(fig) {
    const tip = F.$('.chart__tip', fig);
    if (!tip) return;
    const host = tip.parentElement;
    const on = (m) => {
      tip.replaceChildren(el('div', 'tip__row', null));
      tip.firstChild.appendChild(el('b', '', m.dataset.tip));
      const r = m.getBoundingClientRect(), hr = host.getBoundingClientRect();
      placeTip(tip, host, r.left + r.width / 2 - hr.left, r.top + r.height / 2 - hr.top);
      tip.classList.add('is-on');
    };
    const off = () => tip.classList.remove('is-on');
    F.$$('[data-tip]', fig).forEach((m) => {
      m.addEventListener('pointerenter', () => on(m));
      m.addEventListener('pointerleave', off);
      m.addEventListener('focus', () => on(m));
      m.addEventListener('blur', off);
    });
  }

  F.mod('charts', () => {
    F.$$('.chart--line').forEach(lineChart);
    F.$$('.chart--radar, .chart--rm').forEach(markTips);
  });
})();

/* 60-forms.js */
/* Formulaires : validation, envoi vers un point de collecte (data-endpoint) ou e-mail pré-rempli. */
(() => {
  const F = window.FSP;
  const MAIL = 'contact@freyasportspartners.com';
  const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);

  async function send(form, payload, subject) {
    const endpoint = form.dataset.endpoint;
    if (endpoint) {
      const res = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error(String(res.status));
      return 'sent';
    }
    const body = Object.entries(payload).map(([k, v]) => `${k} : ${v}`).join('\n');
    location.href = `mailto:${MAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    return 'mailto';
  }

  F.mod('forms', () => {
    // Inscription aux notes de recherche
    F.$$('[data-form="newsletter"]').forEach((form) => {
      const input = F.$('input[type="email"]', form);
      const msg = F.$('.news__msg', form);
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const v = input.value.trim();
        if (!isEmail(v)) {
          msg.textContent = 'Invalid email address';
          input.setAttribute('aria-invalid', 'true');
          input.focus();
          return;
        }
        input.removeAttribute('aria-invalid');
        try {
          const how = await send(form, { email: v, source: 'Research notes' }, 'Subscription — Research notes');
          msg.textContent = how === 'sent' ? 'Subscription confirmed. Thank you.' : 'Your email app is opening to confirm your subscription.';
          form.reset();
        } catch (err) {
          msg.textContent = 'Could not send — please try again later.';
        }
      });
    });

    // Formulaires complets (contact, candidature, demande d'accès)
    F.$$('form[data-form="contact"]').forEach((form) => {
      const status = F.$('[data-form-status]', form);
      const fields = F.$$('[name]', form);
      const check = (f) => {
        let ok = f.checkValidity();
        if (ok && f.type === 'email') ok = isEmail(f.value.trim());
        const wrap = f.closest('.field');
        if (wrap) wrap.classList.toggle('is-invalid', !ok);
        f.setAttribute('aria-invalid', String(!ok));
        return ok;
      };
      fields.forEach((f) => {
        f.addEventListener('blur', () => f.value && check(f));
        f.addEventListener('input', () => f.closest('.field')?.classList.contains('is-invalid') && check(f));
        const sync = () => f.closest('.field')?.classList.toggle('has-value', !!f.value);
        f.addEventListener('input', sync);
        f.addEventListener('change', sync);
        sync();
      });
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const bad = fields.filter((f) => !check(f));
        if (bad.length) {
          status.textContent = 'Please complete the highlighted fields.';
          status.dataset.state = 'error';
          bad[0].focus();
          return;
        }
        const payload = {};
        fields.forEach((f) => {
          if (f.type === 'radio') { if (f.checked) payload[f.dataset.label || f.name] = f.value; }
          else if (f.type === 'checkbox') payload[f.dataset.label || f.name] = f.checked ? 'oui' : 'non';
          else if (f.value) payload[f.dataset.label || f.name] = f.value.trim();
        });
        const subject = `${form.dataset.subject || 'Contact'} — ${payload['Organisation'] || payload['Name'] || 'website'}`;
        const btn = F.$('[type="submit"]', form);
        btn && btn.setAttribute('disabled', '');
        try {
          const how = await send(form, payload, subject);
          status.dataset.state = 'ok';
          status.textContent = how === 'sent' ? 'Message sent. We will reply within 48 business hours.' : 'Your email app is opening with the message pre-filled. Just press send.';
          if (how === 'sent') form.reset();
        } catch (err) {
          status.dataset.state = 'error';
          status.textContent = `Could not send. Email us directly: ${MAIL}`;
        } finally {
          btn && btn.removeAttribute('disabled');
        }
      });
    });

    // Portail : aucune donnée n'est transmise — le portail sécurisé est opéré séparément
    F.$$('[data-login]').forEach((form) => {
      const status = F.$('[data-login-status]', form);
      const pwd = F.$('input[type="password"]', form);
      const eye = F.$('[data-pwd-toggle]', form);
      eye && eye.addEventListener('click', () => {
        const show = pwd.type === 'password';
        pwd.type = show ? 'text' : 'password';
        eye.setAttribute('aria-pressed', String(show));
        eye.setAttribute('aria-label', show ? 'Hide password' : 'Show password');
      });
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const id = F.$('input[type="email"]', form);
        const okId = isEmail(id.value.trim());
        id.closest('.field').classList.toggle('is-invalid', !okId);
        pwd.closest('.field').classList.toggle('is-invalid', !pwd.value);
        if (!okId || !pwd.value) {
          status.dataset.state = 'error';
          status.textContent = 'Username or password missing.';
          return;
        }
        pwd.value = '';
        status.dataset.state = 'error';
        status.textContent = 'The secure portal cannot be accessed from this page. Your credentials are provided by the Investor Relations team.';
      });
    });

    // Copier dans le presse-papiers
    F.$$('[data-copy]').forEach((b) => {
      b.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(b.dataset.copy);
          F.toast(`Copied · ${b.dataset.copy.length > 24 ? 'text' : b.dataset.copy}`);
        } catch (e) {
          F.toast('Copy failed');
        }
      });
    });
  });
})();

/* 70-ui.js */
/* Composants : accordéons, filtres, tiroir, accès investisseurs, étapes épinglées. */
(() => {
  const F = window.FSP;
  const { doc, root } = F;

  F.mod('accordion', () => {
    F.$$('[data-acc]').forEach((acc) => {
      const single = acc.hasAttribute('data-acc-single');
      F.$$('.acc__item', acc).forEach((item) => {
        const btn = F.$('.acc__btn', item);
        btn.addEventListener('click', () => {
          const open = !item.classList.contains('is-open');
          if (single) F.$$('.acc__item.is-open', acc).forEach((o) => { o.classList.remove('is-open'); F.$('.acc__btn', o).setAttribute('aria-expanded', 'false'); });
          item.classList.toggle('is-open', open);
          btn.setAttribute('aria-expanded', String(open));
        });
      });
      // Ouverture par ancre (#poste-xxx)
      if (location.hash) {
        const target = F.$(location.hash, acc);
        if (target && target.classList.contains('acc__item')) F.$('.acc__btn', target).click();
      }
    });
  });

  // Filtres : boutons [data-filter-group] > [data-filter], éléments [data-filter-item] avec data-tags
  F.mod('filters', () => {
    F.$$('[data-filters]').forEach((wrap) => {
      const scope = doc.getElementById(wrap.dataset.filters);
      if (!scope) return;
      const items = F.$$('[data-filter-item]', scope);
      const counter = F.$('[data-filter-count]', wrap);
      const state = {};
      const apply = () => {
        let n = 0, k = 0;
        items.forEach((it) => {
          const tags = (it.dataset.tags || '').split(' ');
          const ok = Object.values(state).every((v) => v === 'all' || tags.includes(v));
          it.classList.toggle('is-out', !ok);
          if (ok) {
            n++;
            it.classList.remove('is-in-anim');
            void it.offsetWidth;
            it.style.setProperty('--k', k++);
            it.classList.add('is-in-anim');
            it.classList.add('is-in');
          }
        });
        if (counter) counter.textContent = `${n} result${n > 1 ? 's' : ''}`;
        const empty = F.$('[data-filter-empty]', scope.parentElement);
        if (empty) empty.hidden = n > 0;
      };
      F.$$('[data-filter-group]', wrap).forEach((group) => {
        const key = group.dataset.filterGroup;
        state[key] = 'all';
        F.$$('[data-filter]', group).forEach((b) => {
          b.addEventListener('click', () => {
            F.$$('[data-filter]', group).forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
            state[key] = b.dataset.filter;
            apply();
          });
        });
      });
      F.$$('[data-view]', wrap).forEach((b) => {
        b.addEventListener('click', () => {
          F.$$('[data-view]', wrap).forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
          scope.dataset.layout = b.dataset.view;
        });
      });
    });
  });

  // Tiroir : [data-drawer-open="tpl-id"] clone <template id="tpl-id"> dans le tiroir
  F.mod('drawer', () => {
    const drawer = F.$('[data-drawer]');
    if (!drawer) return;
    const body = F.$('[data-drawer-body]', drawer);
    let lastFocus = null;
    const close = () => {
      drawer.classList.remove('is-open');
      drawer.setAttribute('aria-hidden', 'true');
      root.style.overflow = '';
      lastFocus && lastFocus.focus({ preventScroll: true });
    };
    const open = (id, trigger) => {
      const tpl = doc.getElementById(id);
      if (!tpl) return;
      lastFocus = trigger;
      body.replaceChildren(tpl.content.cloneNode(true));
      drawer.classList.add('is-open');
      drawer.setAttribute('aria-hidden', 'false');
      root.style.overflow = 'hidden';
      F.$('.drawer__panel', drawer).scrollTop = 0;
      F.$$('[data-portrait]', body).forEach((c) => F.portrait && F.portrait(c));
      setTimeout(() => F.$('[data-drawer-close].drawer__close', drawer)?.focus({ preventScroll: true }), 60);
    };
    doc.addEventListener('click', (e) => {
      const t = e.target.closest('[data-drawer-open]');
      if (t) {
        e.preventDefault();
        open(t.dataset.drawerOpen, t);
      }
      if (e.target.closest('[data-drawer-close]')) close();
    });
    doc.addEventListener('keydown', (e) => e.key === 'Escape' && drawer.classList.contains('is-open') && close());
  });

  // Accès investisseurs : confirmation du profil professionnel (mémorisée pour la session)
  F.mod('gate', () => {
    const gate = F.$('[data-gate]');
    if (!gate) return;
    const KEY = 'fsp-gate';
    let status = null;
    try { status = sessionStorage.getItem(KEY); } catch (e) {}
    const form = F.$('form', gate);
    const msg = F.$('[data-gate-msg]', gate);
    const apply = (s) => {
      root.classList.toggle('is-gated', s !== 'pro');
      F.$$('[data-gate-note]').forEach((n) => (n.hidden = s === 'pro'));
    };
    const show = () => {
      gate.classList.add('is-open');
      root.style.overflow = 'hidden';
      setTimeout(() => F.$('input', gate)?.focus({ preventScroll: true }), 300);
    };
    const hide = () => {
      gate.classList.remove('is-open');
      root.style.overflow = '';
    };
    if (status) apply(status);
    else {
      apply('none');
      F.introDone.then(() => setTimeout(show, 700));
    }
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const profile = (F.$('input[name="profil"]:checked', form) || {}).value;
      const ok = F.$('input[name="accept"]', form).checked;
      if (!profile || !ok) {
        msg.textContent = !profile ? 'Please select your profile.' : 'Please confirm you have read the disclaimers.';
        return;
      }
      try { sessionStorage.setItem(KEY, profile); } catch (err) {}
      apply(profile);
      hide();
      if (profile !== 'pro') F.toast('Access limited to public information');
    });
    F.$$('[data-gate-open]').forEach((b) => b.addEventListener('click', show));
  });

  // Sommaire d'article : section active
  F.mod('toc', () => {
    const toc = F.$('[data-toc]');
    if (!toc) return;
    const links = F.$$('a', toc);
    const secs = links.map((a) => document.getElementById(a.getAttribute('href').slice(1))).filter(Boolean);
    F.onScroll(() => {
      let cur = 0;
      secs.forEach((s, i) => { if (s.getBoundingClientRect().top < F.vh * 0.35) cur = i; });
      links.forEach((a, i) => a.classList.toggle('is-active', i === cur));
    });
  });

  // Étapes épinglées : le panneau reflète l'étape au centre de l'écran
  F.mod('steps', () => {
    F.$$('[data-steps]').forEach((wrap) => {
      const steps = F.$$('.step', wrap);
      const num = F.$('[data-step-num]', wrap);
      const title = F.$('[data-step-title]', wrap);
      const metric = F.$('[data-step-metric]', wrap);
      const label = F.$('[data-step-label]', wrap);
      const bars = F.$$('.steps__bar i', wrap);
      const viz = F.$$('[data-step-viz]', wrap);
      let cur = -1;
      const set = (i) => {
        if (i === cur) return;
        cur = i;
        const s = steps[i];
        steps.forEach((x, k) => x.classList.toggle('is-active', k === i));
        if (num) num.firstChild.textContent = String(i + 1).padStart(2, '0');
        if (title) title.textContent = s.dataset.title;
        if (metric) metric.textContent = s.dataset.metric;
        if (label) label.textContent = s.dataset.metricLabel;
        bars.forEach((b, k) => b.classList.toggle('on', k <= i));
        viz.forEach((v) => v.classList.toggle('is-on', Number(v.dataset.stepViz) === i));
        F.$$('[data-viz="dots"]', wrap).forEach((c) => (c.dataset.step = i));
      };
      set(0);
      F.onScroll(() => {
        const mid = F.vh * 0.5;
        let best = 0, bd = Infinity;
        steps.forEach((s, i) => {
          const r = s.getBoundingClientRect();
          const d = Math.abs(r.top + r.height / 2 - mid);
          if (d < bd) { bd = d; best = i; }
        });
        set(best);
      });
    });
  });
})();

/* 75-news.js */
/* News wire: relative times, search, filters, business-only toggle, paging. */
(() => {
  const F = window.FSP;

  const ago = (iso) => {
    const m = Math.round((Date.now() - new Date(iso)) / 60000);
    if (m < 60) return `${Math.max(1, m)} min ago`;
    const h = Math.round(m / 60);
    if (h < 24) return `${h} h ago`;
    const d = Math.round(h / 24);
    return d === 1 ? 'Yesterday' : new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  };

  F.mod('news-ago', () => F.$$('[data-ago]').forEach((t) => (t.textContent = ago(t.getAttribute('datetime')))));

  F.mod('news', () => {
    const list = F.$('[data-newslist]');
    if (!list) return;
    const items = F.$$('[data-news]', list);
    const PAGE = 12;
    const st = { sport: 'all', topic: 'all', period: 'all', q: '', biz: false, shown: PAGE };
    const count = F.$('[data-nf-count]');
    const empty = F.$('[data-nf-empty]');
    const more = F.$('[data-nf-more]');
    const resets = F.$$('[data-nf-reset]');
    if (!more || !count) return;
    const q = F.$('[data-nf-q]');
    const biz = F.$('[data-nf-biz]');

    // Read state from URL (shareable filtered views)
    const url = new URL(location.href);
    ['sport', 'topic', 'period'].forEach((k) => url.searchParams.get(k) && (st[k] = url.searchParams.get(k)));
    st.q = url.searchParams.get('q') || '';
    st.biz = url.searchParams.get('biz') === '1';

    const sync = () => {
      F.$$('[data-nf]').forEach((g) => F.$$('[data-v]', g).forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.v === st[g.dataset.nf]))));
      biz.setAttribute('aria-pressed', String(st.biz));
      if (q.value !== st.q) q.value = st.q;
      const u = new URL(location.href);
      ['sport', 'topic', 'period'].forEach((k) => (st[k] === 'all' ? u.searchParams.delete(k) : u.searchParams.set(k, st[k])));
      st.q ? u.searchParams.set('q', st.q) : u.searchParams.delete('q');
      st.biz ? u.searchParams.set('biz', '1') : u.searchParams.delete('biz');
      history.replaceState(null, '', u);
    };

    const apply = () => {
      const terms = st.q.toLowerCase().split(/\s+/).filter(Boolean);
      const now = Date.now();
      let n = 0;
      const any = st.sport !== 'all' || st.topic !== 'all' || st.period !== 'all' || st.q || st.biz;
      items.forEach((it) => {
        const ok = (any || !it.hasAttribute('data-front')) &&
          (st.sport === 'all' || it.dataset.sport === st.sport) &&
          (st.topic === 'all' || it.dataset.topic === st.topic) &&
          (st.period === 'all' || now - new Date(it.dataset.date) < Number(st.period) * 864e5) &&
          (!st.biz || it.dataset.biz === '1') &&
          terms.every((t) => it.dataset.text.includes(t));
        if (ok) n++;
        it.hidden = !ok || n > st.shown;
      });
      count.textContent = `${n} stor${n === 1 ? 'y' : 'ies'}`;
      empty.hidden = n > 0;
      more.parentElement.hidden = n <= st.shown;
      const filtered = st.sport !== 'all' || st.topic !== 'all' || st.period !== 'all' || st.q || st.biz;
      resets[0].hidden = !filtered;
      sync();
    };

    F.$$('[data-nf]').forEach((g) =>
      F.$$('[data-v]', g).forEach((b) => b.addEventListener('click', () => { st[g.dataset.nf] = b.dataset.v; st.shown = PAGE; apply(); }))
    );
    biz.addEventListener('click', () => { st.biz = !st.biz; st.shown = PAGE; apply(); });
    let t;
    q.addEventListener('input', () => { clearTimeout(t); t = setTimeout(() => { st.q = q.value.trim(); st.shown = PAGE; apply(); }, 120); });
    more.addEventListener('click', () => { st.shown += PAGE; apply(); });
    resets.forEach((r) => r.addEventListener('click', () => { Object.assign(st, { sport: 'all', topic: 'all', period: 'all', q: '', biz: false, shown: PAGE }); apply(); }));
    F.$$('[data-nf-jump]').forEach((b) => b.addEventListener('click', () => {
      st.sport = b.dataset.nfJump; st.shown = PAGE; apply();
      F.$('#wire').scrollIntoView({ behavior: F.reduced ? 'auto' : 'smooth' });
    }));
    // "/" focuses search
    document.addEventListener('keydown', (e) => {
      if (e.key === '/' && !e.target.closest('input, textarea')) { e.preventDefault(); q.focus(); }
    });
    apply();
  });
})();

/* 80-viz.js */
/* Visualisations canvas : flux de sélection, constellation, globe, terrain, portraits. */
(() => {
  const F = window.FSP;
  const ACCENT = [166, 212, 239];
  const ICE = [200, 214, 228];

  // Gabarit commun : canvas net (DPR), redimensionnement, pause hors écran
  function stage(canvas, draw, { fps = 60, still = false } = {}) {
    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const s = { ctx, dpr, w: 0, h: 0, t: 0, mx: -1, my: -1, inside: false };
    const fit = () => {
      const r = canvas.getBoundingClientRect();
      s.w = r.width;
      s.h = r.height;
      canvas.width = Math.max(1, Math.round(r.width * dpr));
      canvas.height = Math.max(1, Math.round(r.height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      s.resized = true;
    };
    fit();
    F.onResize(fit);
    const host = canvas.parentElement;
    host.addEventListener('pointermove', (e) => {
      const r = canvas.getBoundingClientRect();
      s.mx = e.clientX - r.left;
      s.my = e.clientY - r.top;
      s.inside = true;
    }, { passive: true });
    host.addEventListener('pointerleave', () => (s.inside = false));
    let stop = null, last = 0;
    const frame = (t) => {
      if (fps < 60 && t - last < 1000 / fps) return;
      last = t;
      s.t = t / 1000;
      draw(s);
      s.resized = false;
    };
    if (F.reduced || still) {
      s.t = 8;
      document.fonts.ready.then(() => draw(s));
      F.onResize(() => draw(s));
      return s;
    }
    F.visible(canvas, (v) => {
      if (v && !stop) stop = F.loop(frame);
      else if (!v && stop) { stop(); stop = null; }
    });
    return s;
  }
  const rgba = (c, a) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;
  const smooth = (a, b, x) => { const t = F.clamp((x - a) / (b - a)); return t * t * (3 - 2 * t); };

  /* Flux de sélection : des particules franchissent cinq portes successives */
  function flow(canvas) {
    const gates = [0.22, 0.4, 0.57, 0.73, 0.87];
    const labels = ['01 Sourcing', '02 Modelling', '03 Due diligence', '04 Committee', '05 Investment'];
    const pass = [0.283, 0.188, 0.28, 0.5, 1];
    const P = [];
    let acc = 0;
    const spread = (x) => 1 - 0.88 * smooth(0.04, 0.92, x);
    const sim = () => {
      acc += 3.2;
      while (acc >= 1 && P.length < 2400) {
        acc -= 1;
        P.push({ x: 0, y0: (Math.random() * 2 - 1) * (0.2 + Math.random() * 0.8), v: 0.0012 + Math.random() * 0.001, g: 0, dead: 0, dy: 0, a: 1 });
      }
      for (let i = P.length - 1; i >= 0; i--) {
        const p = P[i];
        if (!p.dead) {
          p.x += p.v;
          if (p.g < gates.length && p.x >= gates[p.g]) {
            if (Math.random() > pass[p.g]) { p.dead = 1; p.dy = (Math.random() - 0.5) * 0.8 + (p.y0 > 0 ? 0.7 : -0.7); }
            p.g++;
          }
        } else {
          p.x += p.v * 0.3;
          p.y0 += p.dy * 0.012;
          p.a -= 0.014;
        }
        if (p.a <= 0 || p.x > 1.02) P.splice(i, 1);
      }
    };
    for (let i = 0; i < 700; i++) sim();
    stage(canvas, (s) => {
      const { ctx, w, h } = s;
      const cy = h * (parseFloat(canvas.dataset.cy) || 0.5);
      const band = h * 0.3;
      if (!F.reduced) sim();
      ctx.clearRect(0, 0, w, h);
      ctx.font = '500 10px "Geist Mono", monospace';
      gates.forEach((g, i) => {
        const x = g * w, sp = spread(g) * band + 12;
        ctx.strokeStyle = rgba(ICE, 0.14);
        ctx.setLineDash([2, 5]);
        ctx.beginPath();
        ctx.moveTo(x, cy - sp);
        ctx.lineTo(x, cy + sp);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.strokeStyle = rgba(ICE, 0.5);
        ctx.beginPath();
        ctx.moveTo(x - 4, cy - sp); ctx.lineTo(x + 4, cy - sp);
        ctx.moveTo(x - 4, cy + sp); ctx.lineTo(x + 4, cy + sp);
        ctx.stroke();
        ctx.fillStyle = rgba(ICE, 0.45);
        ctx.fillText(labels[i].toUpperCase(), x + 8, cy - sp - 2);
      });
      for (const p of P) {
        const x = p.x * w;
        const y = cy + p.y0 * spread(p.x) * band;
        const win = p.g >= gates.length && !p.dead;
        const fadeIn = smooth(0, 0.08, p.x);
        if (win) {
          ctx.fillStyle = rgba(ACCENT, 0.12);
          ctx.beginPath(); ctx.arc(x, y, 6, 0, 6.283); ctx.fill();
          ctx.fillStyle = rgba(ACCENT, 0.95 * fadeIn);
          ctx.beginPath(); ctx.arc(x, y, 2.2, 0, 6.283); ctx.fill();
        } else {
          ctx.fillStyle = p.dead ? rgba([120, 136, 152], 0.45 * p.a) : rgba(ICE, (0.3 + 0.5 * (p.g / gates.length)) * fadeIn);
          ctx.fillRect(x, y, 1.8, 1.8);
        }
      }
    });
  }

  /* Constellation : réseau de partenaires, impulsions le long des liens */
  function network(canvas) {
    const N = F.vw < 760 ? 46 : 84;
    const nodes = Array.from({ length: N }, (_, i) => ({ x: Math.random(), y: Math.random(), vx: (Math.random() - 0.5) * 0.00025, vy: (Math.random() - 0.5) * 0.00025, hub: i < 5 }));
    const pulses = [];
    stage(canvas, (s) => {
      const { ctx, w, h } = s;
      ctx.clearRect(0, 0, w, h);
      const R = Math.min(170, w * 0.14);
      nodes.forEach((n) => {
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0.02 || n.x > 0.98) n.vx *= -1;
        if (n.y < 0.05 || n.y > 0.95) n.vy *= -1;
        if (s.inside) {
          const dx = s.mx - n.x * w, dy = s.my - n.y * h, d = Math.hypot(dx, dy);
          if (d < 200) { n.x += (dx / d) * 0.0006; n.y += (dy / d) * 0.0006; }
        }
      });
      const edges = [];
      for (let i = 0; i < N; i++) {
        for (let j = i + 1; j < N; j++) {
          const a = nodes[i], b = nodes[j];
          const d = Math.hypot((a.x - b.x) * w, (a.y - b.y) * h);
          if (d < R) {
            const k = 1 - d / R;
            const hub = a.hub || b.hub;
            ctx.strokeStyle = hub ? rgba(ACCENT, 0.35 * k) : rgba(ICE, 0.16 * k);
            ctx.lineWidth = hub ? 1 : 0.8;
            ctx.beginPath();
            ctx.moveTo(a.x * w, a.y * h);
            ctx.lineTo(b.x * w, b.y * h);
            ctx.stroke();
            if (hub) edges.push([a, b]);
          }
        }
      }
      if (edges.length && Math.random() < 0.08 && pulses.length < 14) {
        const [a, b] = edges[(Math.random() * edges.length) | 0];
        pulses.push({ a, b, t: 0 });
      }
      for (let i = pulses.length - 1; i >= 0; i--) {
        const p = pulses[i];
        p.t += 0.012;
        if (p.t >= 1) { pulses.splice(i, 1); continue; }
        const x = (p.a.x + (p.b.x - p.a.x) * p.t) * w, y = (p.a.y + (p.b.y - p.a.y) * p.t) * h;
        ctx.fillStyle = rgba(ACCENT, 0.95);
        ctx.beginPath();
        ctx.arc(x, y, 1.8, 0, 6.283);
        ctx.fill();
      }
      nodes.forEach((n) => {
        const x = n.x * w, y = n.y * h;
        if (n.hub) {
          ctx.strokeStyle = rgba(ACCENT, 0.5);
          ctx.beginPath();
          ctx.arc(x, y, 9 + Math.sin(s.t * 1.6 + x) * 1.5, 0, 6.283);
          ctx.stroke();
          ctx.fillStyle = rgba(ACCENT, 1);
          ctx.beginPath();
          ctx.arc(x, y, 3, 0, 6.283);
          ctx.fill();
        } else {
          ctx.fillStyle = rgba(ICE, 0.6);
          ctx.beginPath();
          ctx.arc(x, y, 1.6, 0, 6.283);
          ctx.fill();
        }
      });
    });
  }

  /* Globe : sphère de points, méridiens, arcs depuis Paris */
  function globe(canvas) {
    const pts = [];
    const n = F.vw < 760 ? 900 : 1700;
    const ga = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < n; i++) {
      const y = 1 - (i / (n - 1)) * 2, r = Math.sqrt(1 - y * y), th = ga * i;
      pts.push([Math.cos(th) * r, y, Math.sin(th) * r]);
    }
    const ll = (lat, lon) => { const a = (lat * Math.PI) / 180, b = (lon * Math.PI) / 180; return [Math.cos(a) * Math.cos(b), Math.sin(a), Math.cos(a) * Math.sin(b)]; };
    const cities = [
      { n: 'Paris', p: ll(48.86, 2.35), hub: true },
      { n: 'London', p: ll(51.5, -0.12) },
      { n: 'New York', p: ll(40.71, -74) },
      { n: 'Madrid', p: ll(40.42, -3.7) },
      { n: 'Dubai', p: ll(25.2, 55.27) },
      { n: 'Montreal', p: ll(45.5, -73.57) },
    ];
    const slerp = (a, b, t) => {
      const d = Math.acos(F.clamp(a[0] * b[0] + a[1] * b[1] + a[2] * b[2], -1, 1));
      if (d < 1e-4) return a;
      const s1 = Math.sin((1 - t) * d) / Math.sin(d), s2 = Math.sin(t * d) / Math.sin(d);
      const lift = 1 + Math.sin(t * Math.PI) * d * 0.18;
      return [(a[0] * s1 + b[0] * s2) * lift, (a[1] * s1 + b[1] * s2) * lift, (a[2] * s1 + b[2] * s2) * lift];
    };
    stage(canvas, (s) => {
      const { ctx, w, h } = s;
      ctx.clearRect(0, 0, w, h);
      const R = Math.min(w * 0.3, h * 0.38);
      const cx = w * (parseFloat(canvas.dataset.cx) || 0.5), cy = h * 0.43;
      const rot = Math.PI / 2 + Math.sin(s.t * 0.07) * 0.45;
      const tilt = 0.62;
      const proj = (p) => {
        const x1 = p[0] * Math.cos(rot) - p[2] * Math.sin(rot);
        const z1 = p[0] * Math.sin(rot) + p[2] * Math.cos(rot);
        const y2 = p[1] * Math.cos(tilt) - z1 * Math.sin(tilt);
        const z2 = p[1] * Math.sin(tilt) + z1 * Math.cos(tilt);
        return [cx - x1 * R, cy - y2 * R, z2];
      };
      // halo
      const g = ctx.createRadialGradient(cx, cy, R * 0.6, cx, cy, R * 1.25);
      g.addColorStop(0, 'rgba(77,160,213,0)');
      g.addColorStop(0.5, 'rgba(77,160,213,0.06)');
      g.addColorStop(1, 'rgba(77,160,213,0)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = rgba(ICE, 0.14);
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, 6.283);
      ctx.stroke();
      pts.forEach((p) => {
        const [x, y, z] = proj(p);
        if (z < -0.05) return;
        ctx.fillStyle = rgba(ICE, 0.1 + z * 0.45);
        ctx.fillRect(x, y, 1.3, 1.3);
      });
      const hub = cities[0];
      cities.slice(1).forEach((c, i) => {
        const tt = ((s.t * 0.25 + i * 0.17) % 1.6);
        ctx.beginPath();
        let started = false;
        for (let k = 0; k <= 48; k++) {
          const q = proj(slerp(hub.p, c.p, k / 48));
          if (q[2] < -0.02) { started = false; continue; }
          if (!started) { ctx.moveTo(q[0], q[1]); started = true; } else ctx.lineTo(q[0], q[1]);
        }
        ctx.strokeStyle = rgba(ACCENT, 0.32);
        ctx.lineWidth = 1;
        ctx.stroke();
        if (tt <= 1) {
          const q = proj(slerp(hub.p, c.p, tt));
          if (q[2] > -0.02) {
            ctx.fillStyle = rgba(ACCENT, 1);
            ctx.beginPath();
            ctx.arc(q[0], q[1], 2, 0, 6.283);
            ctx.fill();
          }
        }
      });
      ctx.font = '500 10px "Geist Mono", monospace';
      cities.forEach((c) => {
        const [x, y, z] = proj(c.p);
        if (z < 0) return;
        ctx.fillStyle = c.hub ? rgba(ACCENT, 1) : rgba(ICE, 0.85);
        ctx.beginPath();
        ctx.arc(x, y, c.hub ? 4 : 2.6, 0, 6.283);
        ctx.fill();
        if (c.hub) {
          ctx.strokeStyle = rgba(ACCENT, 0.5);
          ctx.beginPath();
          ctx.arc(x, y, 10 + (s.t * 8) % 14, 0, 6.283);
          ctx.stroke();
        }
        ctx.fillStyle = rgba(ICE, c.hub ? 0.95 : 0.6);
        ctx.fillText(c.n.toUpperCase(), x + 10, y - 8);
      });
    });
  }

  /* Terrain : 22 joueurs, ballon, contrôle d'espace (diagramme de Voronoï discret) */
  function pitch(canvas) {
    const players = Array.from({ length: 22 }, (_, i) => {
      const team = i < 11 ? 0 : 1;
      const k = i % 11;
      const bx = team === 0 ? 0.12 + (k % 4) * 0.12 : 0.88 - (k % 4) * 0.12;
      const by = 0.12 + ((k * 0.37) % 1) * 0.76;
      return { team, bx, by, x: bx, y: by, ph: Math.random() * 10 };
    });
    let cells = null;
    stage(canvas, (s) => {
      const { ctx, w, h, t } = s;
      ctx.clearRect(0, 0, w, h);
      const pad = 18;
      const PW = w - pad * 2, PH = h - pad * 2;
      const X = (v) => pad + v * PW, Y = (v) => pad + v * PH;
      const shift = Math.sin(t * 0.22) * 0.12;
      players.forEach((p) => {
        p.x = F.clamp(p.bx + shift + Math.sin(t * 0.5 + p.ph) * 0.04 + Math.sin(t * 0.13 + p.ph * 2) * 0.03, 0.03, 0.97);
        p.y = F.clamp(p.by + Math.cos(t * 0.42 + p.ph) * 0.05, 0.04, 0.96);
      });
      const ball = { x: 0.5 + shift * 1.4 + Math.sin(t * 0.9) * 0.08, y: 0.5 + Math.sin(t * 0.63) * 0.22 };
      // Contrôle d'espace
      const cw = 10, chh = 10;
      const nx = Math.ceil(PW / cw), ny = Math.ceil(PH / chh);
      for (let j = 0; j < ny; j++) {
        for (let i = 0; i < nx; i++) {
          const px = (i + 0.5) / nx, py = (j + 0.5) / ny;
          let best = 9, team = 0, second = 9;
          for (const p of players) {
            const d = (p.x - px) ** 2 + ((p.y - py) * PH / PW) ** 2;
            if (d < best) { second = best; best = d; team = p.team; } else if (d < second) second = d;
          }
          const edge = Math.min(1, (second - best) * 160);
          ctx.fillStyle = team === 0 ? rgba(ACCENT, 0.03 + 0.09 * edge) : rgba([90, 104, 119], 0.02 + 0.05 * edge);
          ctx.fillRect(pad + i * cw, pad + j * chh, cw, chh);
        }
      }
      // Lignes du terrain
      ctx.strokeStyle = rgba(ICE, 0.32);
      ctx.lineWidth = 1;
      ctx.strokeRect(X(0), Y(0), PW, PH);
      ctx.beginPath();
      ctx.moveTo(X(0.5), Y(0)); ctx.lineTo(X(0.5), Y(1));
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(X(0.5), Y(0.5), PH * 0.13, 0, 6.283);
      ctx.stroke();
      [[0, 0.16], [1, -0.16]].forEach(([x0, dw]) => {
        ctx.strokeRect(X(x0), Y(0.22), dw * PW, 0.56 * PH);
        ctx.strokeRect(X(x0), Y(0.37), dw * 0.36 * PW, 0.26 * PH);
      });
      // Joueurs
      players.forEach((p) => {
        const x = X(p.x), y = Y(p.y);
        if (p.team === 0) {
          ctx.fillStyle = rgba(ACCENT, 1);
          ctx.beginPath(); ctx.arc(x, y, 4, 0, 6.283); ctx.fill();
        } else {
          ctx.strokeStyle = rgba(ICE, 0.75);
          ctx.beginPath(); ctx.arc(x, y, 3.6, 0, 6.283); ctx.stroke();
        }
      });
      ctx.fillStyle = '#fff';
      ctx.beginPath(); ctx.arc(X(ball.x), Y(ball.y), 2.6, 0, 6.283); ctx.fill();
      ctx.strokeStyle = rgba(ICE, 0.3);
      ctx.beginPath(); ctx.arc(X(ball.x), Y(ball.y), 9, 0, 6.283); ctx.stroke();
    }, { fps: 30 });
  }


  /* Matrice de sélection : 1 200 points, seuls les survivants de l'étape restent allumés */
  function dots(canvas) {
    const counts = (canvas.dataset.counts || '1200').split(',').map(Number);
    const total = counts[0];
    const order = Array.from({ length: total }, (_, i) => i);
    let seed = 7;
    const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    for (let i = total - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [order[i], order[j]] = [order[j], order[i]]; }
    const rank = new Array(total);
    order.forEach((idx, r) => (rank[idx] = r));
    const lit = new Float32Array(total);
    stage(canvas, (s) => {
      const { ctx, w, h } = s;
      const step = Number(canvas.dataset.step || 0);
      const keep = counts[Math.min(step, counts.length - 1)];
      const cols = 48, rows = Math.ceil(total / cols);
      const gx = w / cols, gy = Math.min(h / rows, gx);
      const oy = (h - gy * rows) / 2;
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < total; i++) {
        const on = rank[i] < keep ? 1 : 0;
        lit[i] += (on - lit[i]) * (F.reduced ? 1 : 0.08 + (rank[i] % 7) * 0.006);
        const x = (i % cols) * gx + gx / 2, y = oy + Math.floor(i / cols) * gy + gy / 2;
        const a = lit[i];
        const last = step === counts.length - 1 && on;
        ctx.fillStyle = last ? rgba(ACCENT, 0.35 + a * 0.65) : rgba(a > 0.5 ? ICE : [90, 104, 119], 0.18 + a * 0.62);
        const r = (last ? 2.4 : 1.1) + a * 0.5;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, 6.283);
        ctx.fill();
      }
    }, { fps: 40 });
  }

  /* Portraits en trame : silhouette générée, déterministe par graine */
  function hash(str) { let h = 2166136261; for (const c of str) h = Math.imul(h ^ c.charCodeAt(0), 16777619); return () => ((h = Math.imul(h ^ (h >>> 15), 2246822507) ^ Math.imul(h ^ (h >>> 13), 3266489909)) >>> 0) / 4294967296; }
  F.portrait = function (canvas) {
    const r = hash(canvas.dataset.portrait || 'x');
    const hx = 0.5 + (r() - 0.5) * 0.06, hy = 0.37 + (r() - 0.5) * 0.04;
    const hr = 0.16 + r() * 0.025, hair = 0.02 + r() * 0.05;
    const sw = 0.38 + r() * 0.08;
    const light = r() * 0.6 - 0.3;
    const draw = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = rect.width, h = rect.height;
      if (!w) return;
      canvas.width = w * dpr; canvas.height = h * dpr;
      const ctx = canvas.getContext('2d');
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      const step = Math.max(5, w / 34);
      for (let y = step / 2; y < h; y += step) {
        for (let x = step / 2; x < w; x += step) {
          const u = x / w, v = (y / h) * 1.25;
          const dh = Math.hypot((u - hx) / hr, (v - hy) / (hr * 1.22 + hair * 0.4));
          const ds = Math.hypot((u - 0.5) / sw, (v - 1.14) / 0.36);
          const dn = Math.abs(u - hx) < hr * 0.42 && v > hy && v < hy + hr * 1.9 ? 0.8 : 9;
          const inside = Math.min(dh, ds, dn);
          let b = inside < 1 ? 1 - inside * 0.55 : Math.max(0, 0.08 - (inside - 1) * 0.2);
          b *= 0.55 + 0.45 * (1 - F.clamp((u - 0.5 - light) * 1.6 + 0.5));
          b *= 1 - Math.max(0, v - 1.1) * 0.6;
          const rad = (step / 2) * Math.sqrt(F.clamp(b)) * 0.92;
          if (rad < 0.35) continue;
          ctx.fillStyle = inside < 1 ? `rgba(200,218,232,${0.35 + b * 0.6})` : 'rgba(120,140,160,0.25)';
          ctx.beginPath();
          ctx.arc(x, y, rad, 0, 6.283);
          ctx.fill();
        }
      }
    };
    draw();
    canvas._draw = draw;
  };

  F.mod('viz', () => {
    const map = { flow, network, globe, pitch, dots };
    F.$$('canvas[data-viz]').forEach((c) => {
      const fn = map[c.dataset.viz];
      if (fn) {
        try { fn(c); } catch (e) { console.warn('[Freya] viz', c.dataset.viz, e); }
      }
    });
    const portraits = F.$$('canvas[data-portrait]');
    if (portraits.length) {
      F.once(portraits, (c) => F.portrait(c), { margin: '200px 0px' });
      F.onResize(() => portraits.forEach((c) => c._draw && c._draw()));
    }
  });
})();

/* 99-init.js */
/* Démarrage : chaque module est isolé — une erreur n'empêche pas les autres de s'exécuter. */
(() => {
  const F = window.FSP;
  const start = () => {
    F.mods.forEach(([name, fn]) => {
      try {
        fn();
      } catch (err) {
        console.error(`[Freya] module « ${name} »`, err);
      }
    });
    F.root.classList.add('is-ready');
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();

  // Retour arrière (bfcache) : on ne rejoue pas l'intro
  addEventListener('pageshow', (e) => {
    if (e.persisted) {
      F.root.classList.remove('is-intro', 'has-mega', 'has-menu');
      F.root.style.overflow = '';
    }
  });
})();

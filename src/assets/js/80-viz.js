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

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

  // Reconstruct a perspective point surface from the reference's image rays.
  // The water sits close to the camera, while the city and mountains recede.
  const NICE_VS = `
attribute vec2 aP;
attribute vec4 aC;
uniform float uT, uAmp, uDpr, uAspect, uTanHalfFov;
uniform mat4 uPV;
uniform vec3 uMouse, uEye;
varying vec3 vC;
varying float vA;
void main(){
  float cover = max(1.0, 1.7827/uAspect);
  vec2 p = vec2((aP.x - 1.0)*cover + 1.0, -aP.y);
  float y = (aP.y + 1.0)*0.5;
  float x = (aP.x + 1.0)*0.5;
  float coast = 0.506 + 0.35*pow(max(0.0, (x - 0.255)/0.745), 2.25);
  float sea = smoothstep(coast + 0.016, coast + 0.045, y);
  float ground = 2.4;
  float waterDepth = clamp(ground/(max(0.025, -p.y)*uTanHalfFov), 6.0, 52.0);
  float shoreDepth = clamp(ground/(max(0.025, 2.0*coast - 1.0)*uTanHalfFov), 7.0, 48.0);
  float cityDepth = shoreDepth + max(0.0, coast - y)*24.0;
  float mountain = 1.0 - smoothstep(0.40, 0.49, y);
  float landDepth = mix(cityDepth, 48.0 + 4.0*sin(x*5.0), mountain);
  float depth = mix(landDepth, waterDepth, sea);
  vec3 w = vec3(p.x*depth*uTanHalfFov*uAspect, p.y*depth*uTanHalfFov, -depth);
  float light = dot(aC.rgb, vec3(0.2126, 0.7152, 0.0722));
  float warm = smoothstep(0.05, 0.35, aC.r - aC.b);
  float grain = fract(sin(dot(aP, vec2(127.1, 311.7)))*43758.5453) - 0.5;
  w.z += grain*0.45*(1.0 - sea) + light*0.35*(1.0 - sea);
  vec2 delta = p - uMouse.xy;
  vec2 metric = delta*vec2(uAspect, 1.0);
  float d = length(metric);
  float ripple = exp(-d*d*8.0)*uMouse.z;
  w.xy += delta*depth*0.015*ripple;
  w.y += (0.38 + sin(d*24.0 - uT*2.0)*0.14)*ripple;
  w.y += sea*(sin(w.x*0.65 + w.z*0.5 + uT*0.65)*0.12
    + sin(w.x*1.25 - w.z*0.8 - uT*0.9)*0.06)*uAmp;
  gl_Position = uPV*vec4(w, 1.0);
  float cameraDepth = distance(w, uEye);
  vec3 ice = mix(vec3(0.16, 0.33, 0.52), vec3(0.72, 0.84, 0.95), light);
  vC = mix(ice, aC.rgb*1.25, 0.35 + warm*0.6);
  float haze = 1.0 - smoothstep(35.0, 75.0, cameraDepth)*0.32;
  vA = aC.a*uAmp*(0.85 + light*0.65)*haze;
  gl_PointSize = uDpr*clamp(0.85 + light*0.7 + (9.0/cameraDepth)*(0.7 + warm*0.5), 0.9, 3.5);
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

  async function surface(canvas) {
    const nice = canvas.dataset.nice === '1';
    let cloud = null;
    if (nice) {
      const response = await fetch('assets/img/nice-points.bin');
      if (!response.ok) throw new Error('Nice point cloud unavailable');
      cloud = await response.arrayBuffer();
    }
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
    gl.attachShader(prog, mk(gl.VERTEX_SHADER, nice ? NICE_VS : VS));
    gl.attachShader(prog, mk(gl.FRAGMENT_SHADER, FS));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog));
    gl.useProgram(prog);

    const dense = canvas.dataset.density === 'low' || F.vw < 760;
    const header = nice ? new DataView(cloud) : null;
    const NX = nice ? header.getUint16(0, true) : dense ? 150 : 300;
    const NZ = nice ? header.getUint16(2, true) : dense ? 96 : 176;
    let pos = new Float32Array(NX * NZ * 2);
    let k = 0;
    for (let j = 0; j < NZ; j++) for (let i = 0; i < NX; i++) { pos[k++] = (i / (NX - 1)) * 2 - 1; pos[k++] = (j / (NZ - 1)) * 2 - 1; }
    const pointCount = NX*NZ;
    const colourData = nice ? new Uint8Array(cloud, 4) : null;
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, pos, gl.STATIC_DRAW);
    const aP = gl.getAttribLocation(prog, 'aP');
    gl.enableVertexAttribArray(aP);
    gl.vertexAttribPointer(aP, 2, gl.FLOAT, false, 0, 0);
    if (nice) {
      const colours = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, colours);
      gl.bufferData(gl.ARRAY_BUFFER, colourData, gl.STATIC_DRAW);
      const aC = gl.getAttribLocation(prog, 'aC');
      gl.enableVertexAttribArray(aC);
      gl.vertexAttribPointer(aC, 4, gl.UNSIGNED_BYTE, true, 0, 0);
    }
    const U = {};
    ['uPV', 'uEye', 'uT', 'uAmp', 'uDpr', 'uSize', 'uMouse', 'uIso', 'uAspect', 'uTanHalfFov'].forEach((n) => (U[n] = gl.getUniformLocation(prog, n)));
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
    let mouse = [0, nice ? 0 : 2, 0], mTarget = [0, nice ? 0 : 2, 0], mStr = 0, mStrT = 0;
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
      const mx = nice ? mouse[0]*mStr : ndc ? ndc[0] : 0;
      const my = nice ? mouse[1]*mStr : ndc ? ndc[1] : 0;
      eye = [drift + mx * 0.5, camY + scrollP * 2.2 + my * 0.25, 9.6 - scrollP * 1.5];
      let target = [drift * 0.4 + mx * 0.9, -0.3 - scrollP * 0.6, -2.4];
      const fov = asp < 1 ? 0.95 : 0.7;
      if (nice) {
        const floatX = F.reduced ? 0 : Math.sin(t*0.12)*0.18;
        const floatY = F.reduced ? 0 : Math.sin(t*0.09)*0.06;
        eye = [floatX + mx*0.8, floatY + my*0.32 + scrollP*0.5, scrollP*0.8];
        target = [0, 0, -28];
      }
      pv = M.mul(M.persp(fov, asp, 0.1, 60), M.look(eye, target, [0, 1, 0]));

      if (ndc && nice) mTarget = ndc;
      if (ndc && !nice) {
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
      gl.uniform1f(U.uAspect, asp);
      gl.uniform1f(U.uTanHalfFov, Math.tan(fov/2));
      gl.uniform3f(U.uMouse, mouse[0], mouse[1], F.reduced ? 0 : mStr);
      gl.drawArrays(gl.POINTS, 0, pointCount);
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
      surface(c).then((ready) => {
        if (ready) F.root.classList.add('has-gl');
      }).catch((err) => {
        console.warn('[Freya] WebGL indisponible :', err.message);
      });
    });
  });
})();

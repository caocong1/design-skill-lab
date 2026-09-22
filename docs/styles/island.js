/* 风格 16 · 小岛 Cute Island
   一座低多边形小岛上的可爱 3D 小游戏：WebGPU 从零写起（WGSL 着色器、实例化绘制、三段卡通光照、
   雾、水波、四倍多重采样），没有引擎。十二个域是十二座彩色小屋，玩家是一颗会蹦的圆球，
   靠近小屋按 E 进屋翻目录。没有 WebGPU 时退化为 2D 小岛地图，内容照样能用。
   HUD（面板、标签、提示、方向键）全部是 HTML。 */
(function () {
  'use strict';
  DSL.register('island', { mount, unmount, focusSearch, snapshot: () => (snapshotFn ? snapshotFn() : Promise.reject(new Error('no-gpu'))) });

  let cleanup = [];
  let ctxRef = null, elRef = null;
  let snapshotFn = null;
  const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const pad = (n) => String(n).padStart(2, '0');
  const R = 14;              // 岛半径
  const HOUSE_R = 8.6;       // 小屋所在的环
  const hsl = (h, s, l) => {
    // hsl → rgb 0..1（给 GPU 用）
    s /= 100; l /= 100;
    const k = (n) => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = (n) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    return [f(0), f(8), f(4)];
  };
  const hex = (h) => [parseInt(h.slice(1, 3), 16) / 255, parseInt(h.slice(3, 5), 16) / 255, parseInt(h.slice(5, 7), 16) / 255];

  /* ---- 数学：列主序 mat4 ---------------------------------------------------- */
  const M = {
    mul(a, b) {
      const o = new Float32Array(16);
      for (let c = 0; c < 4; c++) for (let r = 0; r < 4; r++) {
        o[c * 4 + r] = a[r] * b[c * 4] + a[4 + r] * b[c * 4 + 1] + a[8 + r] * b[c * 4 + 2] + a[12 + r] * b[c * 4 + 3];
      }
      return o;
    },
    persp(fov, aspect, near, far) {
      const f = 1 / Math.tan(fov / 2);
      return new Float32Array([f / aspect, 0, 0, 0, 0, f, 0, 0, 0, 0, far / (near - far), -1, 0, 0, (near * far) / (near - far), 0]);
    },
    lookAt(e, t, up) {
      let zx = e[0] - t[0], zy = e[1] - t[1], zz = e[2] - t[2];
      let l = Math.hypot(zx, zy, zz); zx /= l; zy /= l; zz /= l;
      let xx = up[1] * zz - up[2] * zy, xy = up[2] * zx - up[0] * zz, xz = up[0] * zy - up[1] * zx;
      l = Math.hypot(xx, xy, xz); xx /= l; xy /= l; xz /= l;
      const yx = zy * xz - zz * xy, yy = zz * xx - zx * xz, yz = zx * xy - zy * xx;
      return new Float32Array([xx, yx, zx, 0, xy, yy, zy, 0, xz, yz, zz, 0,
        -(xx * e[0] + xy * e[1] + xz * e[2]), -(yx * e[0] + yy * e[1] + yz * e[2]), -(zx * e[0] + zy * e[1] + zz * e[2]), 1]);
    },
    // 平移 × 绕 Y 旋转 × 缩放
    model(x, y, z, ry, sx, sy, sz) {
      const c = Math.cos(ry), s = Math.sin(ry);
      return [c * sx, 0, -s * sx, 0, 0, sy, 0, 0, s * sz, 0, c * sz, 0, x, y, z, 1];
    },
    project(vp, p, w, h) {
      const x = vp[0] * p[0] + vp[4] * p[1] + vp[8] * p[2] + vp[12];
      const y = vp[1] * p[0] + vp[5] * p[1] + vp[9] * p[2] + vp[13];
      const cw = vp[3] * p[0] + vp[7] * p[1] + vp[11] * p[2] + vp[15];
      if (cw <= 0.01) return null;
      return [(x / cw * 0.5 + 0.5) * w, (1 - (y / cw * 0.5 + 0.5)) * h, cw];
    },
  };

  /* ---- 地形 ---------------------------------------------------------------- */
  const hash = (a, b) => { const s = Math.sin(a * 127.1 + b * 311.7) * 43758.5453; return s - Math.floor(s); };
  function groundY(x, z) {
    const r = Math.hypot(x, z);
    const fall = 1 - Math.min(1, Math.max(0, (r - 9) / 5));
    let y = (0.32 * Math.sin(x * 0.7) * Math.cos(z * 0.6) + 0.14 * Math.sin((x + z) * 1.3)) * fall;
    if (r > 12) y -= (r - 12) * 0.32;
    return y;
  }

  /* ---- 几何：顶点 = pos3 + nrm3 + col4（col.w 是取色模式：0 固定 1 实例色 2 实例色掺白） ----- */
  function Mesh() { this.v = []; this.i = []; this.n = 0; }
  Mesh.prototype.tri = function (a, b, c, col, mode) {
    const ux = b[0] - a[0], uy = b[1] - a[1], uz = b[2] - a[2], vx = c[0] - a[0], vy = c[1] - a[1], vz = c[2] - a[2];
    let nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx;
    const l = Math.hypot(nx, ny, nz) || 1; nx /= l; ny /= l; nz /= l;
    for (const p of [a, b, c]) { this.v.push(p[0], p[1], p[2], nx, ny, nz, col[0], col[1], col[2], mode); this.i.push(this.n++); }
  };
  Mesh.prototype.quad = function (a, b, c, d, col, mode) { this.tri(a, b, c, col, mode); this.tri(a, c, d, col, mode); };
  Mesh.prototype.box = function (cx, cy, cz, w, h, d, col, mode) {
    const x0 = cx - w / 2, x1 = cx + w / 2, y0 = cy - h / 2, y1 = cy + h / 2, z0 = cz - d / 2, z1 = cz + d / 2;
    const P = (x, y, z) => [x, y, z];
    this.quad(P(x0, y0, z1), P(x1, y0, z1), P(x1, y1, z1), P(x0, y1, z1), col, mode); // front
    this.quad(P(x1, y0, z0), P(x0, y0, z0), P(x0, y1, z0), P(x1, y1, z0), col, mode); // back
    this.quad(P(x0, y0, z0), P(x0, y0, z1), P(x0, y1, z1), P(x0, y1, z0), col, mode); // left
    this.quad(P(x1, y0, z1), P(x1, y0, z0), P(x1, y1, z0), P(x1, y1, z1), col, mode); // right
    this.quad(P(x0, y1, z1), P(x1, y1, z1), P(x1, y1, z0), P(x0, y1, z0), col, mode); // top
    this.quad(P(x0, y0, z0), P(x1, y0, z0), P(x1, y0, z1), P(x0, y0, z1), col, mode); // bottom
  };
  Mesh.prototype.pyramid = function (cx, y0, cz, w, d, h, col, mode) {
    const apex = [cx, y0 + h, cz];
    const c = [[cx - w / 2, y0, cz + d / 2], [cx + w / 2, y0, cz + d / 2], [cx + w / 2, y0, cz - d / 2], [cx - w / 2, y0, cz - d / 2]];
    for (let k = 0; k < 4; k++) this.tri(c[k], c[(k + 1) % 4], apex, col, mode);
    this.quad(c[3], c[2], c[1], c[0], col, mode);
  };
  Mesh.prototype.cone = function (cx, y0, cz, r, h, seg, col, mode) {
    const apex = [cx, y0 + h, cz];
    for (let k = 0; k < seg; k++) {
      const a0 = (k / seg) * Math.PI * 2, a1 = ((k + 1) / seg) * Math.PI * 2;
      const p0 = [cx + Math.cos(a0) * r, y0, cz + Math.sin(a0) * r], p1 = [cx + Math.cos(a1) * r, y0, cz + Math.sin(a1) * r];
      this.tri(p1, p0, apex, col, mode);
      this.tri(p0, p1, [cx, y0, cz], col, mode);
    }
  };
  Mesh.prototype.cylinder = function (cx, y0, cz, r, h, seg, col, mode) {
    for (let k = 0; k < seg; k++) {
      const a0 = (k / seg) * Math.PI * 2, a1 = ((k + 1) / seg) * Math.PI * 2;
      const x0 = cx + Math.cos(a0) * r, z0 = cz + Math.sin(a0) * r, x1 = cx + Math.cos(a1) * r, z1 = cz + Math.sin(a1) * r;
      this.quad([x1, y0, z1], [x0, y0, z0], [x0, y0 + h, z0], [x1, y0 + h, z1], col, mode);
      this.tri([x0, y0 + h, z0], [x1, y0 + h, z1], [cx, y0 + h, cz], col, mode);
    }
  };
  Mesh.prototype.disc = function (cx, y, cz, r, seg, col, mode) {
    for (let k = 0; k < seg; k++) {
      const a0 = (k / seg) * Math.PI * 2, a1 = ((k + 1) / seg) * Math.PI * 2;
      this.tri([cx + Math.cos(a0) * r, y, cz + Math.sin(a0) * r], [cx, y, cz], [cx + Math.cos(a1) * r, y, cz + Math.sin(a1) * r], col, mode);
    }
  };
  // 平滑法线的球（圆滚滚的东西不要切面）
  Mesh.prototype.sphere = function (cx, cy, cz, r, seg, col, mode) {
    const rings = Math.max(4, Math.round(seg * 0.6));
    const base = this.n;
    for (let i = 0; i <= rings; i++) {
      const phi = (i / rings) * Math.PI;
      for (let j = 0; j <= seg; j++) {
        const th = (j / seg) * Math.PI * 2;
        const nx = Math.sin(phi) * Math.cos(th), ny = Math.cos(phi), nz = Math.sin(phi) * Math.sin(th);
        this.v.push(cx + nx * r, cy + ny * r, cz + nz * r, nx, ny, nz, col[0], col[1], col[2], mode); this.n++;
      }
    }
    for (let i = 0; i < rings; i++) for (let j = 0; j < seg; j++) {
      const a = base + i * (seg + 1) + j, b = a + seg + 1;
      this.i.push(a, b, a + 1, a + 1, b, b + 1);
    }
  };
  Mesh.prototype.star = function (cx, cy, cz, ro, ri, t, col, mode) {
    const pts = [];
    for (let k = 0; k < 10; k++) { const a = (k / 10) * Math.PI * 2 - Math.PI / 2; const r = k % 2 ? ri : ro; pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]); }
    const z0 = cz - t / 2, z1 = cz + t / 2;
    for (let k = 0; k < 10; k++) {
      const p = pts[k], q = pts[(k + 1) % 10];
      this.tri([p[0], p[1], z1], [q[0], q[1], z1], [cx, cy, z1], col, mode);
      this.tri([q[0], q[1], z0], [p[0], p[1], z0], [cx, cy, z0], col, mode);
      this.quad([p[0], p[1], z0], [q[0], q[1], z0], [q[0], q[1], z1], [p[0], p[1], z1], col, mode);
    }
  };

  function buildMeshes(ctx) {
    const m = {};
    // 小屋：屋身掺白的实例色，屋顶实例色，门窗固定色
    const house = new Mesh();
    house.box(0, 0.65, 0, 1.6, 1.3, 1.6, [1, 1, 1], 2);
    house.pyramid(0, 1.28, 0, 2.05, 2.05, 1.0, [1, 1, 1], 1);
    house.box(0, 0.36, 0.81, 0.44, 0.72, 0.06, hex('#6b4a36'), 0);
    house.box(-0.5, 0.85, 0.82, 0.32, 0.32, 0.05, hex('#dff3ff'), 0);
    house.box(0.5, 0.85, 0.82, 0.32, 0.32, 0.05, hex('#dff3ff'), 0);
    house.box(0.55, 1.95, -0.4, 0.28, 0.5, 0.28, hex('#d8b7a0'), 0);
    m.house = house;
    // 树：树干固定，两层树冠实例色（每棵树不同的绿）
    const tree = new Mesh();
    tree.cylinder(0, 0, 0, 0.17, 0.75, 6, hex('#8a5a3c'), 0);
    tree.cone(0, 0.6, 0, 0.9, 1.5, 7, [1, 1, 1], 1);
    tree.cone(0, 1.45, 0, 0.62, 1.2, 7, [1, 1, 1], 1);
    m.tree = tree;
    // 云：几个球
    const cloud = new Mesh();
    cloud.sphere(0, 0, 0, 0.9, 10, [1, 1, 1], 0); cloud.sphere(0.95, 0.05, 0.15, 0.68, 10, [1, 1, 1], 0);
    cloud.sphere(-0.85, 0, -0.1, 0.6, 10, [1, 1, 1], 0); cloud.sphere(0.2, 0.4, -0.25, 0.58, 10, [1, 1, 1], 0);
    m.cloud = cloud;
    // 玩家：球 + 两只眼睛 + 高光 + 腮红，朝 +Z
    const player = new Mesh();
    player.sphere(0, 0.62, 0, 0.62, 18, [1, 1, 1], 1);
    player.sphere(-0.22, 0.74, 0.5, 0.11, 8, hex('#1f1a1a'), 0); player.sphere(0.22, 0.74, 0.5, 0.11, 8, hex('#1f1a1a'), 0);
    player.sphere(-0.19, 0.79, 0.58, 0.04, 6, [1, 1, 1], 0); player.sphere(0.25, 0.79, 0.58, 0.04, 6, [1, 1, 1], 0);
    player.sphere(-0.38, 0.6, 0.44, 0.08, 6, hex('#ff9fb4'), 0); player.sphere(0.38, 0.6, 0.44, 0.08, 6, hex('#ff9fb4'), 0);
    m.player = player;
    const star = new Mesh(); star.star(0, 0, 0, 0.42, 0.18, 0.14, hex('#ffd85e'), 0); m.star = star;
    const shadow = new Mesh(); shadow.disc(0, 0, 0, 0.55, 14, hex('#4f8a55'), 0); m.shadow = shadow;
    const water = new Mesh(); water.quad([-90, 0, 90], [90, 0, 90], [90, 0, -90], [-90, 0, -90], [1, 1, 1], 1); m.water = water;
    // 地面：同心环，每个面一色（草 / 沙）
    const g = new Mesh();
    const rings = [0, 1.6, 3.2, 4.8, 6.4, 8, 9.5, 10.8, 11.8, 12.7, 13.4, R];
    const segs = 40;
    const P = rings.map((r, i) => Array.from({ length: segs }, (_, j) => {
      const a = (j / segs) * Math.PI * 2 + (i % 2 ? Math.PI / segs : 0);
      const rr = i === 0 ? 0 : r * (1 + (hash(i, j) - 0.5) * 0.06);
      const x = Math.cos(a) * rr, z = Math.sin(a) * rr;
      return [x, groundY(x, z), z];
    }));
    const grass = (i, j) => { const t = hash(j, i); return hsl(108 + t * 14, 42 + t * 10, 60 + t * 8); };
    const sand = (i, j) => { const t = hash(i * 3, j); return hsl(44, 45 + t * 10, 76 + t * 6); };
    for (let i = 0; i < rings.length - 1; i++) for (let j = 0; j < segs; j++) {
      const j1 = (j + 1) % segs;
      const col = rings[i + 1] > 11.5 ? sand(i, j) : grass(i, j);
      if (i === 0) g.tri(P[1][j1], P[1][j], P[0][0], col, 0);
      else { g.tri(P[i + 1][j1], P[i + 1][j], P[i][j], col, 0); g.tri(P[i][j1], P[i + 1][j1], P[i][j], col.map((c) => c * 0.96), 0); }
    }
    m.ground = g;
    return m;
  }

  /* ---- 世界布局 ----------------------------------------------------------------- */
  function layout(ctx) {
    const houses = ctx.domains.map((d, i) => {
      const a = (i / ctx.domains.length) * Math.PI * 2 - Math.PI / 2;
      const x = Math.cos(a) * HOUSE_R, z = Math.sin(a) * HOUSE_R;
      return { d, i, x, z, y: groundY(x, z), ry: Math.atan2(-x, -z), s: d.sections.flatMap((s) => s.items).filter((r) => r.tier === 'S').length };
    });
    const trees = [];
    for (let k = 0; k < 60 && trees.length < 30; k++) {
      const r = 2.6 + hash(k, 7) * 9.6, a = hash(k, 3) * Math.PI * 2;
      const x = Math.cos(a) * r, z = Math.sin(a) * r;
      if (houses.some((h) => Math.hypot(h.x - x, h.z - z) < 2.4)) continue;
      if (Math.hypot(x, z) < 2.2) continue;
      trees.push({ x, z, y: groundY(x, z), s: 0.75 + hash(k, 11) * 0.5, g: hsl(112 + hash(k, 5) * 30, 45, 46 + hash(k, 9) * 12), ry: hash(k, 13) * 6.28 });
    }
    const clouds = Array.from({ length: 7 }, (_, k) => ({ x: (hash(k, 21) - 0.5) * 40, y: 7 + hash(k, 22) * 3, z: (hash(k, 23) - 0.5) * 40, s: 1 + hash(k, 24) * 1.2, v: 0.25 + hash(k, 25) * 0.3 }));
    return { houses, trees, clouds };
  }

  /* ---- WGSL --------------------------------------------------------------------- */
  const SHADER = /* wgsl */`
struct U { vp: mat4x4<f32>, cam: vec4<f32>, light: vec4<f32>, sky: vec4<f32>, misc: vec4<f32> };
struct Inst { model: mat4x4<f32>, color: vec4<f32> };
@group(0) @binding(0) var<uniform> u: U;
@group(1) @binding(0) var<storage, read> inst: array<Inst>;
struct VOut { @builtin(position) pos: vec4<f32>, @location(0) col: vec3<f32>, @location(1) nrm: vec3<f32>, @location(2) wpos: vec3<f32> };
@vertex fn vs(@location(0) p: vec3<f32>, @location(1) n: vec3<f32>, @location(2) c: vec4<f32>, @builtin(instance_index) ii: u32) -> VOut {
  let I = inst[ii];
  let kind = I.color.w;      // 0 普通 1 水面 2 树（随风摆）
  var wp = (I.model * vec4<f32>(p, 1.0)).xyz;
  var wn = normalize((I.model * vec4<f32>(n, 0.0)).xyz);
  let t = u.misc.x;
  if (kind > 0.5 && kind < 1.5) {
    let a = 0.07 * u.misc.y;
    wp.y += sin(wp.x * 0.55 + t * 1.1) * a + cos(wp.z * 0.45 + t * 0.9) * a;
    let dx = cos(wp.x * 0.55 + t * 1.1) * 0.55 * a;
    let dz = -sin(wp.z * 0.45 + t * 0.9) * 0.45 * a;
    wn = normalize(vec3<f32>(-dx, 1.0, -dz));
  } else if (kind > 1.5) {
    wp.x += sin(t * 1.3 + wp.z * 0.4 + wp.x * 0.3) * 0.045 * max(p.y, 0.0) * u.misc.y;
  }
  var col: vec3<f32>;
  if (c.w < 0.5) { col = c.rgb; } else if (c.w < 1.5) { col = I.color.rgb; } else { col = mix(I.color.rgb, vec3<f32>(1.0), 0.58); }
  var o: VOut;
  o.pos = u.vp * vec4<f32>(wp, 1.0);
  o.col = col; o.nrm = wn; o.wpos = wp;
  return o;
}
@fragment fn fs(v: VOut) -> @location(0) vec4<f32> {
  let n = normalize(v.nrm);
  let l = normalize(u.light.xyz);
  let nl = dot(n, l);
  var band = 0.66;
  if (nl > 0.5) { band = 1.0; } else if (nl > 0.0) { band = 0.86; }
  let vd = normalize(u.cam.xyz - v.wpos);
  let rim = pow(1.0 - max(dot(n, vd), 0.0), 3.0) * 0.16;
  var col = v.col * band + vec3<f32>(rim);
  let d = distance(u.cam.xyz, v.wpos);
  col = mix(col, u.sky.rgb, smoothstep(24.0, 70.0, d));
  return vec4<f32>(col, 1.0);
}`;

  /* ---- 渲染器 ------------------------------------------------------------------- */
  async function startGPU(canvas, world, meshes, ctx, hud) {
    if (!navigator.gpu) throw new Error('no-webgpu');
    const adapter = await navigator.gpu.requestAdapter();
    if (!adapter) throw new Error('no-adapter');
    const device = await adapter.requestDevice();
    device.addEventListener('uncapturederror', (e) => console.warn('WebGPU:', e.error && e.error.message));
    const gctx = canvas.getContext('webgpu');
    const format = navigator.gpu.getPreferredCanvasFormat();
    gctx.configure({ device, format, alphaMode: 'premultiplied' });
    const module = device.createShaderModule({ code: SHADER });
    const uniBGL = device.createBindGroupLayout({ entries: [{ binding: 0, visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT, buffer: { type: 'uniform' } }] });
    const instBGL = device.createBindGroupLayout({ entries: [{ binding: 0, visibility: GPUShaderStage.VERTEX, buffer: { type: 'read-only-storage' } }] });
    const pipeline = device.createRenderPipeline({
      layout: device.createPipelineLayout({ bindGroupLayouts: [uniBGL, instBGL] }),
      vertex: { module, entryPoint: 'vs', buffers: [{ arrayStride: 40, attributes: [
        { shaderLocation: 0, offset: 0, format: 'float32x3' }, { shaderLocation: 1, offset: 12, format: 'float32x3' }, { shaderLocation: 2, offset: 24, format: 'float32x4' }] }] },
      fragment: { module, entryPoint: 'fs', targets: [{ format }] },
      primitive: { topology: 'triangle-list', cullMode: 'none' },
      depthStencil: { format: 'depth24plus', depthWriteEnabled: true, depthCompare: 'less' },
      multisample: { count: 4 },
    });
    const uniBuf = device.createBuffer({ size: 128, usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST });
    const uniBG = device.createBindGroup({ layout: uniBGL, entries: [{ binding: 0, resource: { buffer: uniBuf } }] });

    // 每种网格：顶点 / 索引 / 实例缓冲
    const draws = {};
    const mkDraw = (name, mesh, maxInst) => {
      const vb = device.createBuffer({ size: mesh.v.length * 4, usage: GPUBufferUsage.VERTEX, mappedAtCreation: true });
      new Float32Array(vb.getMappedRange()).set(mesh.v); vb.unmap();
      const ib = device.createBuffer({ size: Math.ceil(mesh.i.length * 4 / 4) * 4, usage: GPUBufferUsage.INDEX, mappedAtCreation: true });
      new Uint32Array(ib.getMappedRange()).set(mesh.i); ib.unmap();
      const inst = device.createBuffer({ size: Math.max(1, maxInst) * 80, usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST });
      const bg = device.createBindGroup({ layout: instBGL, entries: [{ binding: 0, resource: { buffer: inst } }] });
      draws[name] = { vb, ib, inst, bg, count: mesh.i.length, data: new Float32Array(Math.max(1, maxInst) * 20), n: 0 };
    };
    mkDraw('ground', meshes.ground, 1); mkDraw('water', meshes.water, 1);
    mkDraw('house', meshes.house, world.houses.length); mkDraw('tree', meshes.tree, world.trees.length);
    mkDraw('cloud', meshes.cloud, world.clouds.length); mkDraw('star', meshes.star, world.houses.length);
    mkDraw('player', meshes.player, 1); mkDraw('shadow', meshes.shadow, 1);
    const setInst = (dr, k, model, color) => { dr.data.set(model, k * 20); dr.data.set(color, k * 20 + 16); dr.n = Math.max(dr.n, k + 1); };
    const flush = (dr) => { device.queue.writeBuffer(dr.inst, 0, dr.data, 0, dr.n * 20); };

    // 静态实例只写一次
    const G = draws.ground; setInst(G, 0, M.model(0, 0, 0, 0, 1, 1, 1), [1, 1, 1, 0]); flush(G);
    const W = draws.water; setInst(W, 0, M.model(0, -0.55, 0, 0, 1, 1, 1), [...hex('#5eb4e8'), 1]); flush(W);
    const T = draws.tree; world.trees.forEach((t, k) => setInst(T, k, M.model(t.x, t.y - 0.05, t.z, t.ry, t.s, t.s, t.s), [...t.g, 2])); flush(T);

    let depthTex = null, msaaTex = null, size = [0, 0];
    const dpr = Math.min(1.5, window.devicePixelRatio || 1);
    function resize() {
      const w = Math.max(2, Math.floor(canvas.clientWidth * dpr)), h = Math.max(2, Math.floor(canvas.clientHeight * dpr));
      if (w === size[0] && h === size[1]) return;
      size = [w, h]; canvas.width = w; canvas.height = h;
      if (depthTex) depthTex.destroy(); if (msaaTex) msaaTex.destroy();
      depthTex = device.createTexture({ size: [w, h], format: 'depth24plus', usage: GPUTextureUsage.RENDER_ATTACHMENT, sampleCount: 4 });
      msaaTex = device.createTexture({ size: [w, h], format, usage: GPUTextureUsage.RENDER_ATTACHMENT, sampleCount: 4 });
    }
    resize();
    const ro = new ResizeObserver(resize); ro.observe(canvas);

    const uni = new Float32Array(32);
    const sky = hex('#cfeaff');
    let cam = [0, 14.5, 19.5], camT = [0, 0, 0];
    let last = performance.now(), t = 0, raf = 0, alive = true;

    function frame(now) {
      if (!alive) return;
      const dt = Math.min(0.05, (now - last) / 1000); last = now;
      const anim = ctx.reduced ? 0 : 1;
      t += dt * anim;
      hud.step(dt);
      const p = hud.player;
      // 相机跟随
      const target = [p.x, 0.6, p.z];
      const zoom = size[0] < size[1] ? 1.35 : 1;   // 竖屏退远一点，整座岛都在
      const want = [p.x, 14.5 * zoom, p.z + 19.5 * zoom];
      const k = ctx.reduced ? 1 : 1 - Math.pow(0.001, dt);
      for (let i = 0; i < 3; i++) { cam[i] += (want[i] - cam[i]) * k; camT[i] += (target[i] - camT[i]) * k; }
      const aspect = size[0] / size[1];
      const vp = M.mul(M.persp(0.75, aspect, 0.5, 140), M.lookAt(cam, camT, [0, 1, 0]));
      uni.set(vp, 0); uni.set([cam[0], cam[1], cam[2], 0], 16); uni.set([0.45, 1, 0.55, 0], 20); uni.set([sky[0], sky[1], sky[2], 1], 24); uni.set([t, anim, 0, 0], 28);
      device.queue.writeBuffer(uniBuf, 0, uni);

      // 动态实例：小屋（靠近时呼吸）、星星、云、玩家、影子
      const H = draws.house, S = draws.star;
      world.houses.forEach((h, k) => {
        const near = hud.near === h ? 1 : 0;
        const br = 1 + near * (0.04 + Math.sin(t * 5) * 0.035 * anim);
        setInst(H, k, M.model(h.x, h.y - 0.04, h.z, h.ry, br, br, br), [...hsl(h.d.hue, 62, 62), 0]);
        const spin = t * (near ? 4 : 1.2) + k;
        const bob = Math.sin(t * 2 + k) * 0.08 * anim;
        setInst(S, k, M.model(h.x, h.y + 2.75 + bob, h.z, spin, 1, 1, 1), [1, 1, 1, 0]);
      });
      flush(H); flush(S);
      const C = draws.cloud;
      world.clouds.forEach((c, k) => {
        c.x += c.v * dt * anim; if (c.x > 24) c.x = -24;
        setInst(C, k, M.model(c.x, c.y, c.z, 0, c.s, c.s * 0.75, c.s), [1, 1, 1, 0]);
      });
      flush(C);
      const P = draws.player;
      setInst(P, 0, M.model(p.x, p.gy + p.hop, p.z, p.face, p.sx, p.sy, p.sx), [...hex('#ffb6a3'), 0]); flush(P);
      const Sh = draws.shadow; const shs = 1 - p.hop * 0.6;
      setInst(Sh, 0, M.model(p.x, p.gy + 0.03, p.z, 0, shs, 1, shs), [1, 1, 1, 0]); flush(Sh);

      const enc = device.createCommandEncoder();
      drawScene(enc, gctx.getCurrentTexture().createView());
      device.queue.submit([enc.finish()]);
      hud.labels(vp, canvas.clientWidth, canvas.clientHeight);
      raf = requestAnimationFrame(frame);
    }
    function drawScene(enc, resolveView) {
      const pass = enc.beginRenderPass({
        colorAttachments: [{ view: msaaTex.createView(), resolveTarget: resolveView, clearValue: { r: 0, g: 0, b: 0, a: 0 }, loadOp: 'clear', storeOp: 'discard' }],
        depthStencilAttachment: { view: depthTex.createView(), depthClearValue: 1, depthLoadOp: 'clear', depthStoreOp: 'discard' },
      });
      pass.setPipeline(pipeline); pass.setBindGroup(0, uniBG);
      for (const name of ['water', 'ground', 'shadow', 'house', 'tree', 'star', 'cloud', 'player']) {
        const dr = draws[name]; if (!dr.n) continue;
        pass.setVertexBuffer(0, dr.vb); pass.setIndexBuffer(dr.ib, 'uint32'); pass.setBindGroup(1, dr.bg);
        pass.drawIndexed(dr.count, dr.n);
      }
      pass.end();
    }
    /* 离屏快照：把当前帧渲染进可回读的纹理，返回 PNG data URL。
       给"渲染并查看"用——无头浏览器截不到 WebGPU 画布，脚本靠这个看图。 */
    snapshotFn = async () => {
      const [w, h] = size;
      const rt = device.createTexture({ size: [w, h], format, usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.COPY_SRC });
      const bpr = Math.ceil(w * 4 / 256) * 256;
      const buf = device.createBuffer({ size: bpr * h, usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ });
      const enc = device.createCommandEncoder();
      drawScene(enc, rt.createView());
      enc.copyTextureToBuffer({ texture: rt }, { buffer: buf, bytesPerRow: bpr }, [w, h]);
      device.queue.submit([enc.finish()]);
      await buf.mapAsync(GPUMapMode.READ);
      const src = new Uint8Array(buf.getMappedRange());
      const out = document.createElement('canvas'); out.width = w; out.height = h;
      const img = out.getContext('2d').createImageData(w, h);
      const bgra = format.startsWith('bgra');
      for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
        const si = y * bpr + x * 4, di = (y * w + x) * 4;
        img.data[di] = src[bgra ? si + 2 : si]; img.data[di + 1] = src[si + 1]; img.data[di + 2] = src[bgra ? si : si + 2]; img.data[di + 3] = src[si + 3];
      }
      out.getContext('2d').putImageData(img, 0, 0);
      buf.unmap(); buf.destroy(); rt.destroy();
      return out.toDataURL('image/png');
    };
    raf = requestAnimationFrame(frame);
    device.lost.then((info) => {
      console.warn('WebGPU device lost:', info.reason, info.message);
      // 'destroyed' 只会来自我们自己的 stop()；其它原因（驱动重置、后台回收）才退化到 2D。
      if (alive && info.reason !== 'destroyed') { alive = false; hud.fallback(`GPU 设备丢失（${info.reason || 'unknown'}），已切到 2D 地图。`); }
    });
    return () => { alive = false; snapshotFn = null; cancelAnimationFrame(raf); ro.disconnect(); try { device.destroy(); } catch (e) {} };
  }

  /* ---- 挂载：HUD + 场景 --------------------------------------------------------- */
  function mount(el, ctx) {
    ctxRef = ctx; elRef = el;
    const b = ctx.board();
    const world = layout(ctx);
    el.innerHTML = `
    <div class="is-world" id="is-world">
      <canvas class="is-gl" id="is-gl" aria-label="小岛 3D 场景" role="img"></canvas>
      <div class="is-clouds" aria-hidden="true"><i></i><i></i><i></i></div>
      <div class="is-labels" id="is-labels" aria-hidden="true"></div>

      <div class="is-map" id="is-map" hidden>
        <p class="is-map-note" id="is-map-note"></p>
        <div class="is-map-island">
          ${world.houses.map((h) => `<button type="button" class="is-map-house" data-domain="${h.d.id}" style="--h:${h.d.hue};left:${(50 + (h.x / R) * 44).toFixed(1)}%;top:${(50 + (h.z / R) * 44).toFixed(1)}%"><i></i><b>${esc(h.d.zh)}</b><small>${h.d.count}</small></button>`).join('')}
          <span class="is-map-you" aria-hidden="true"></span>
        </div>
      </div>

      <header class="is-top">
        <span class="is-logo"><i aria-hidden="true"></i>Design Skill Lab <small>小岛</small></span>
        <nav class="is-menu" aria-label="HUD">
          <button type="button" data-tab="catalog">目录</button>
          <button type="button" data-tab="warp">传送</button>
          <button type="button" data-tab="quest">任务</button>
          <button type="button" data-tab="guide">指南</button>
          <button type="button" data-tab="about">关于</button>
        </nav>
        <span class="is-progress" id="is-progress">已到访 0 / ${world.houses.length}</span>
      </header>

      <p class="is-hint" id="is-hint">WASD / 方向键 走动，靠近小屋按 <kbd>E</kbd> 进屋；<kbd>/</kbd> 搜索</p>

      <div class="is-pad" aria-label="方向键">
        <button type="button" data-dir="0,-1" aria-label="上">▲</button>
        <button type="button" data-dir="-1,0" aria-label="左">◀</button>
        <button type="button" class="is-pad-e" id="is-enter" aria-label="进入">E</button>
        <button type="button" data-dir="1,0" aria-label="右">▶</button>
        <button type="button" data-dir="0,1" aria-label="下">▼</button>
      </div>

      <aside class="is-panel" id="is-panel" hidden aria-label="面板">
        <header class="is-panel-h">
          <nav class="is-tabs" id="is-tabs">
            <button type="button" data-tab="catalog">目录</button><button type="button" data-tab="warp">传送</button><button type="button" data-tab="quest">任务</button><button type="button" data-tab="guide">指南</button><button type="button" data-tab="about">关于</button>
          </nav>
          <button type="button" class="is-close" id="is-close" aria-label="关闭">×</button>
        </header>
        <div class="is-tab" data-pane="catalog">
          <div class="is-tools" role="search">
            <input id="is-q" type="search" placeholder="搜资源（名称、用途、标签）" aria-label="搜索资源" autocomplete="off">
            <div class="is-sels">
              <select id="is-tier" aria-label="档位"><option value="">档位</option><option value="S">S 首选</option><option value="A">A 可靠</option><option value="B">B 备选</option></select>
              <select id="is-access" aria-label="收费"><option value="">收费</option><option value="free">免费</option><option value="freemium">部分免费</option><option value="paid">付费</option></select>
              <select id="is-reach" aria-label="可达性"><option value="">可达</option><option value="static">可抓取</option><option value="js">需浏览器</option><option value="blocked">有防护</option></select>
              <select id="is-lang" aria-label="语言"><option value="">语言</option><option value="zh">中文</option><option value="en">英文</option><option value="ja">日文</option></select>
              <button type="button" id="is-reset">清除</button>
            </div>
          </div>
          <div id="is-view"></div>
        </div>
        <div class="is-tab" data-pane="warp" hidden>
          <p class="is-p">同一座岛的另外 ${ctx.content.styles.length - 1} 种画法。传送不会丢掉筛选条件。</p>
          <div class="is-warp">${ctx.content.styles.map((s, i) => `<a class="is-warp-i" href="?style=${s.id}" data-goto="${s.id}" style="--h:${(i * 47) % 360}"${s.id === b.id ? ' aria-current="page"' : ''}><b>${pad(s.num)}</b><span>${esc(s.name)}</span><small>${esc(s.en)}</small></a>`).join('')}</div>
        </div>
        <div class="is-tab" data-pane="quest" hidden>
          <p class="is-p">${ctx.totals.skills} 个 skill：套件是设计师——决定、出图、写规格、交接、验收。</p>
          <ol class="is-quests">${ctx.content.skills.map(([n, d]) => `<li><a href="${ctx.content.site.repo}/blob/main/skills/${n}/SKILL.md" target="_blank" rel="noopener"><code>${n}</code></a><p>${esc(d)}</p></li>`).join('')}</ol>
        </div>
        <div class="is-tab" data-pane="guide" hidden>
          <h3>安装</h3>
          <pre class="is-code"><code>${ctx.content.usage.install.map(esc).join('\n')}</code></pre>
          <h3>装好后直接说</h3>
          <ul class="is-list">${ctx.content.usage.prompts.map((p) => `<li>${esc(p)}</li>`).join('')}</ul>
          <h3>方法与局限</h3>
          <dl class="is-method">${ctx.content.method.map(([t, d]) => `<div><dt>${esc(t)}</dt><dd>${esc(d)}</dd></div>`).join('')}</dl>
        </div>
        <div class="is-tab" data-pane="about" hidden>
          <h3>${esc(b.name)} ${esc(b.en)}</h3>
          <p class="is-p">${esc(b.concept)}</p>
          <dl class="is-axes">${Object.entries(b.axes).map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>
          <p class="is-p is-risk"><b>会在哪里失败</b>${esc(b.risk)}</p>
          <p class="is-p is-small">${esc(ctx.content.site.lede)}</p>
          <p class="is-p is-small">Design Skill Lab · 原创内容 MIT · 商标归各自所有者 · 截图仅供索引预览 · <a href="${ctx.content.site.repo}" target="_blank" rel="noopener">GitHub</a></p>
        </div>
      </aside>
    </div>`;

    const hud = makeHud(el, ctx, world);
    bind(el, ctx, hud, world);
    const canvas = el.querySelector('#is-gl');
    startGPU(canvas, world, buildMeshes(ctx), ctx, hud)
      .then((stop) => { cleanup.push(stop); })
      .catch((e) => {
        const why = e.message === 'no-webgpu' ? '你的浏览器还没有 WebGPU（Chrome 113+、Edge 113+、Safari 26+、Firefox 141+ 可用）' : e.message === 'no-adapter' ? '浏览器有 WebGPU 但没找到可用的显卡适配器' : `WebGPU 初始化失败：${e.message}`;
        hud.fallback(`${why}——已切到 2D 小岛地图，内容照样能用。`);
      });
  }

  /* ---- HUD 与游戏状态 ---------------------------------------------------------- */
  function makeHud(el, ctx, world) {
    const player = { x: 0, z: 0, gy: groundY(0, 0), vx: 0, vz: 0, face: 0, hop: 0, sx: 1, sy: 1, phase: 0 };
    const keys = new Set();
    const visited = new Set();
    const labels = el.querySelector('#is-labels');
    labels.innerHTML = world.houses.map((h) => `<button type="button" class="is-label" data-domain="${h.d.id}" data-i="${h.i}" style="--h:${h.d.hue}" tabindex="-1"><b>${esc(h.d.zh)}</b><small>${h.d.count} · ★${h.s}</small></button>`).join('');
    const labelEls = [...labels.children];
    const hint = el.querySelector('#is-hint');
    const hud = {
      player, keys, near: null, pad: [0, 0],
      step(dt) {
        let dx = hud.pad[0], dz = hud.pad[1];
        if (keys.has('w') || keys.has('arrowup')) dz -= 1;
        if (keys.has('s') || keys.has('arrowdown')) dz += 1;
        if (keys.has('a') || keys.has('arrowleft')) dx -= 1;
        if (keys.has('d') || keys.has('arrowright')) dx += 1;
        const l = Math.hypot(dx, dz); if (l > 0) { dx /= l; dz /= l; }
        const sp = 6.2;
        player.vx += (dx * sp - player.vx) * Math.min(1, dt * 9);
        player.vz += (dz * sp - player.vz) * Math.min(1, dt * 9);
        player.x += player.vx * dt; player.z += player.vz * dt;
        // 别掉进海里
        const r = Math.hypot(player.x, player.z);
        if (r > 12.4) { player.x *= 12.4 / r; player.z *= 12.4 / r; }
        // 别穿墙
        world.houses.forEach((h) => {
          const ddx = player.x - h.x, ddz = player.z - h.z, d = Math.hypot(ddx, ddz);
          if (d < 1.45) { player.x = h.x + ddx / d * 1.45; player.z = h.z + ddz / d * 1.45; }
        });
        player.gy = groundY(player.x, player.z);
        const moving = Math.hypot(player.vx, player.vz) > 0.4;
        if (moving) { const want = Math.atan2(player.vx, player.vz); let da = want - player.face; da = Math.atan2(Math.sin(da), Math.cos(da)); player.face += da * Math.min(1, dt * 12); }
        if (ctx.reduced) { player.hop = 0; player.sx = player.sy = 1; }
        else {
          player.phase += dt * (moving ? 10 : 2.2);
          const s = Math.abs(Math.sin(player.phase));
          player.hop = moving ? s * 0.42 : 0;
          player.sy = moving ? 0.92 + s * 0.2 : 1 + Math.sin(player.phase) * 0.03;
          player.sx = moving ? 1.06 - s * 0.12 : 1 - Math.sin(player.phase) * 0.03;
        }
        // 最近的小屋
        let best = null, bd = 2.7;
        world.houses.forEach((h) => { const d = Math.hypot(player.x - h.x, player.z - h.z); if (d < bd) { bd = d; best = h; } });
        if (best !== hud.near) {
          hud.near = best;
          labelEls.forEach((n) => n.classList.toggle('is-near', best && Number(n.dataset.i) === best.i));
          hint.innerHTML = best ? `按 <kbd>E</kbd> 进入「${esc(best.d.zh)}」· ${best.d.count} 条 · ★ ${best.s} 个首选` : 'WASD / 方向键 走动，靠近小屋按 <kbd>E</kbd> 进屋；<kbd>/</kbd> 搜索';
          el.querySelector('#is-enter').classList.toggle('on', !!best);
        }
      },
      labels(vp, w, h) {
        world.houses.forEach((hs, k) => {
          const p = M.project(vp, [hs.x, hs.y + 3.4, hs.z], w, h);
          const n = labelEls[k];
          if (!p) { n.style.display = 'none'; return; }
          n.style.display = '';
          n.style.transform = `translate(${p[0].toFixed(1)}px, ${p[1].toFixed(1)}px) translate(-50%, -100%) scale(${Math.max(0.7, Math.min(1.1, 16 / p[2])).toFixed(3)})`;
          n.style.zIndex = String(Math.round(1000 - p[2] * 10));
        });
      },
      enter(h) {
        visited.add(h.d.id);
        el.querySelector('#is-progress').textContent = visited.size >= world.houses.length ? `全图达成 ${visited.size} / ${world.houses.length} ✦` : `已到访 ${visited.size} / ${world.houses.length}`;
        ctx.set({ domain: h.d.id, q: '', tier: '', access: '', reach: '', lang: '' });
        hud.open('catalog');
      },
      teleport(h) {
        // 传送到小屋门前
        const a = Math.atan2(-h.z, -h.x);
        player.x = h.x + Math.cos(a) * 2.1; player.z = h.z + Math.sin(a) * 2.1;
        player.face = Math.atan2(h.x - player.x, h.z - player.z);
      },
      open(tab) {
        const panel = el.querySelector('#is-panel');
        panel.hidden = false;
        el.querySelectorAll('.is-tab').forEach((t) => { t.hidden = t.dataset.pane !== tab; });
        el.querySelectorAll('[data-tab]').forEach((b) => b.classList.toggle('on', b.dataset.tab === tab));
      },
      close() { el.querySelector('#is-panel').hidden = true; el.querySelectorAll('[data-tab]').forEach((b) => b.classList.remove('on')); },
      fallback(msg) {
        el.querySelector('#is-gl').hidden = true; labels.hidden = true; el.querySelector('.is-pad').hidden = true; hint.hidden = true;
        const map = el.querySelector('#is-map'); map.hidden = false;
        el.querySelector('#is-map-note').textContent = msg;
        el.querySelector('#is-world').classList.add('is-2d');
      },
    };
    return hud;
  }

  /* ---- 面板里的目录 ---------------------------------------------------------- */
  function item(ctx, r) {
    return `<li class="is-item is-t${r.tier}">
      <a href="${esc(r.url)}" target="_blank" rel="noopener">
        ${r.shot ? `<img src="${r.shot}" alt="" loading="lazy">` : '<span class="is-noshot" aria-hidden="true"></span>'}
        <span class="is-item-t">
          <span class="is-item-n">${esc(r.name)}${r.lang !== 'en' ? `<i>${r.lang === 'zh' ? '中' : r.lang === 'ja' ? '日' : esc(r.lang)}</i>` : ''}<em class="is-star" title="档位 ${r.tier}">${r.tier === 'S' ? '★' : r.tier === 'A' ? '☆' : '·'} ${r.tier}</em></span>
          <span class="is-item-d">${esc(ctx.zh(r))}</span>
          <span class="is-item-m">${esc(ctx.kindZh(r.kind))} · ${esc(ctx.accessZh(r.access))}${r.login ? ' · 需登录' : ''} · ${esc(ctx.reachZh(r.agent_access))}</span>
        </span>
      </a>
    </li>`;
  }
  function renderDomains(ctx, world) {
    return `<p class="is-p">十二座小屋。走过去，或者直接传送：</p>
    <div class="is-houses">${world.houses.map((h) => `
      <button type="button" class="is-house" data-domain="${h.d.id}" style="--h:${h.d.hue}">
        <i aria-hidden="true"></i><span><b>${esc(h.d.zh)}</b><small>${esc(h.d.blurb)}</small></span><em>${h.d.count}<small>★${h.s}</small></em>
      </button>`).join('')}</div>`;
  }
  function renderDomain(ctx, d) {
    return `<header class="is-dh" style="--h:${d.hue}"><button type="button" class="is-back" data-domain="">← 全部小屋</button><h3><i aria-hidden="true"></i>${esc(d.zh)}</h3><p>${esc(d.blurb)} · ${d.count} 条</p></header>
    ${d.sections.filter((s) => s.items.length).map((s) => `
      <section class="is-sec"><h4>${esc(s.zh)} <small>${s.items.length}</small></h4><p class="is-p is-small">${esc(s.note)}</p>
      <ul class="is-items">${s.items.map((r) => item(ctx, r)).join('')}</ul></section>`).join('')}`;
  }
  function renderResults(ctx, v) {
    if (!v.total) return `<div class="is-empty"><p>岛上没有这样的东西。</p><button type="button" class="is-back" data-reset>清除全部条件</button></div>`;
    return `<p class="is-p"><b>${v.total}</b> 条，来自 ${v.groups.length} 座小屋</p>
    ${v.groups.map((g) => `<section class="is-sec" style="--h:${g.domain.hue}"><h4><button type="button" class="is-linkbtn" data-domain="${g.domain.id}">${esc(g.domain.zh)}</button> <small>${g.items.length}</small></h4>
      <ul class="is-items">${g.items.map((r) => item(ctx, r)).join('')}</ul></section>`).join('')}`;
  }

  function paint(el, ctx, world, hud) {
    const v = ctx.view();
    const box = el.querySelector('#is-view');
    box.innerHTML = v.mode === 'domains' ? renderDomains(ctx, world) : v.mode === 'domain' ? renderDomain(ctx, v.domain) : renderResults(ctx, v);
    if (v.mode !== 'domains' && el.querySelector('#is-panel').hidden) hud.open('catalog');
    el.querySelectorAll('.is-map-house').forEach((b) => b.classList.toggle('on', b.dataset.domain === ctx.state.domain));
  }

  /* ---- 绑定 ------------------------------------------------------------------- */
  function bind(el, ctx, hud, world) {
    const F = { q: '#is-q', tier: '#is-tier', access: '#is-access', reach: '#is-reach', lang: '#is-lang' };
    const sync = () => Object.entries(F).forEach(([k, s]) => { el.querySelector(s).value = ctx.state[k] || ''; });
    sync();
    Object.entries(F).forEach(([k, s]) => {
      el.querySelector(s).addEventListener(k === 'q' ? 'input' : 'change', (e) => ctx.set({ [k]: e.target.value }));
    });
    el.querySelector('#is-reset').addEventListener('click', () => { ctx.reset(); sync(); });
    el.querySelector('#is-close').addEventListener('click', () => hud.close());
    el.querySelector('#is-enter').addEventListener('click', () => { if (hud.near) hud.enter(hud.near); });

    el.addEventListener('click', (e) => {
      const tab = e.target.closest('[data-tab]');
      if (tab) { const open = !el.querySelector('#is-panel').hidden && tab.classList.contains('on') && tab.closest('.is-menu'); if (open) hud.close(); else hud.open(tab.dataset.tab); return; }
      const d = e.target.closest('[data-domain]');
      if (d) {
        const to = d.dataset.domain;
        const h = world.houses.find((x) => x.d.id === to);
        if (h) { hud.teleport(h); hud.enter(h); }
        else { ctx.set({ domain: '' }); sync(); }
        return;
      }
      if (e.target.closest('[data-reset]')) { ctx.reset(); sync(); }
    });
    // 键盘：走动 / 进屋 / 关面板。输入框里打字时不吃字母键。
    const typing = () => /^(INPUT|SELECT|TEXTAREA)$/.test(document.activeElement.tagName);
    const kd = (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const k = e.key.toLowerCase();
      if (k === 'escape') { hud.close(); document.activeElement.blur(); return; }
      if (typing()) return;
      if (['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(k)) { hud.keys.add(k); e.preventDefault(); }
      else if ((k === 'e' || k === 'enter' || k === ' ') && hud.near) { hud.enter(hud.near); e.preventDefault(); }
    };
    const ku = (e) => hud.keys.delete(e.key.toLowerCase());
    window.addEventListener('keydown', kd); window.addEventListener('keyup', ku);
    window.addEventListener('blur', () => hud.keys.clear());
    cleanup.push(() => { window.removeEventListener('keydown', kd); window.removeEventListener('keyup', ku); });
    // 触屏方向键
    el.querySelectorAll('[data-dir]').forEach((btn) => {
      const [x, z] = btn.dataset.dir.split(',').map(Number);
      const on = (e) => { e.preventDefault(); hud.pad = [x, z]; btn.classList.add('on'); };
      const off = () => { hud.pad = [0, 0]; btn.classList.remove('on'); };
      btn.addEventListener('pointerdown', on); btn.addEventListener('pointerup', off); btn.addEventListener('pointercancel', off); btn.addEventListener('pointerleave', off);
    });
    cleanup.push(ctx.onChange(() => paint(el, ctx, world, hud)));
    paint(el, ctx, world, hud);
    if (ctx.state.domain) { const h = world.houses.find((x) => x.d.id === ctx.state.domain); if (h) hud.teleport(h); }
  }

  function focusSearch() {
    const el = elRef; if (!el) return;
    const panel = el.querySelector('#is-panel'); panel.hidden = false;
    el.querySelectorAll('.is-tab').forEach((t) => { t.hidden = t.dataset.pane !== 'catalog'; });
    el.querySelectorAll('[data-tab]').forEach((b) => b.classList.toggle('on', b.dataset.tab === 'catalog'));
    const q = el.querySelector('#is-q'); if (q) q.focus();
  }
  function unmount() { cleanup.forEach((fn) => fn()); cleanup = []; ctxRef = elRef = null; }
})();

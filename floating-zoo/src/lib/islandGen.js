import { VoxelGrid, rng, hash3, hashStr, buildGeometry } from './voxel'

// Size of one terrain voxel in world units.
export const V = 0.5

const PALETTES = {
  grass: { top: ['#7cc653', '#72bd4a', '#86d05c'], dirt: '#8a5a32', water: '#4cb4ea' },
  forest: { top: ['#5fae48', '#57a443', '#68b951'], dirt: '#7a4f2c', water: '#4cb4ea' },
  savanna: { top: ['#cbbf5a', '#c2b552', '#d6ca68'], dirt: '#9c6a3a', water: '#58b9e6' },
  snow: { top: ['#f4f8fb', '#e9f0f5', '#ffffff'], dirt: '#9fb0bf', water: '#79d0f2' },
  rocky: { top: ['#a3a39a', '#979790', '#b0afa5'], dirt: '#7d7a72', water: '#3fa7e0' },
}
const STONE = ['#8a8478', '#7a756b', '#6a665e', '#5c5852', '#4f4b47']
const pick = (arr, h) => arr[Math.min(arr.length - 1, Math.floor(h * arr.length))]

// Wobbly outline so islands don't look like perfect circles.
export function edgeRadius(R, a, seed) {
  const s = (seed % 1000) / 100
  return R * (1 + 0.1 * Math.sin(3 * a + s) + 0.07 * Math.sin(5 * a + s * 1.7) + 0.04 * Math.sin(9 * a + s * 3.1))
}

// ---------- Decorations ----------
function tree(g, i, k, type, rand) {
  const trunk = '#7a5230'
  const leaf = ['#4f9e3a', '#5aab43', '#468f34']
  if (type === 'oak') {
    const h = 3 + Math.floor(rand() * 2)
    g.box(i, 1, k, i, h, k, trunk)
    const r = 2 + (rand() < 0.4 ? 1 : 0)
    for (let x = -r; x <= r; x++)
      for (let y = -r; y <= r; y++)
        for (let z = -r; z <= r; z++)
          if (x * x + y * y * 1.4 + z * z <= r * r + 0.8 && rand() > 0.06)
            g.set(i + x, h + r + y, k + z, leaf[Math.floor(rand() * 3)])
  } else if (type === 'pine' || type === 'snowpine') {
    g.box(i, 1, k, i, 2, k, trunk)
    const radii = [2, 2, 1, 1, 1, 0, 0]
    radii.forEach((r, l) => {
      for (let x = -r; x <= r; x++)
        for (let z = -r; z <= r; z++) {
          if (Math.abs(x) + Math.abs(z) > r + (l % 2 ? 0 : 1)) continue
          const snowy = type === 'snowpine' && rand() < 0.45
          g.set(i + x, 3 + l, k + z, snowy ? '#f4f8fb' : l % 2 ? '#2f7d3a' : '#367f40')
        }
    })
  } else if (type === 'acacia') {
    g.box(i, 1, k, i, 4, k, trunk)
    g.set(i + 1, 5, k, trunk)
    for (let x = -3; x <= 3; x++)
      for (let z = -2; z <= 2; z++)
        if (x * x * 0.6 + z * z <= 5 && rand() > 0.08) g.set(i + 1 + x, 6, k + z, rand() < 0.5 ? '#6f9b3a' : '#7aa743')
    for (let x = -2; x <= 2; x++) for (let z = -1; z <= 1; z++) g.set(i + 1 + x, 7, k + z, '#7aa743')
  } else if (type === 'palm') {
    g.box(i, 1, k, i, 5, k, '#a5794c')
    g.set(i, 6, k, '#4f9e3a')
    for (const [dx, dz] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      g.set(i + dx, 6, k + dz, '#4f9e3a')
      g.set(i + dx * 2, 6, k + dz * 2, '#5aab43')
      g.set(i + dx * 3, 5, k + dz * 3, '#5aab43')
    }
  } else if (type === 'bush') {
    for (let x = -1; x <= 1; x++)
      for (let z = -1; z <= 1; z++)
        for (let y = 1; y <= 2; y++)
          if (x * x + z * z + (y - 1) * (y - 1) <= 2 && rand() > 0.1) g.set(i + x, y, k + z, leaf[Math.floor(rand() * 3)])
    if (rand() < 0.4) g.set(i, 3, k, rand() < 0.5 ? '#ff7aa2' : '#ffd34d')
  }
}

function rock(g, i, k, rand, snowy) {
  const s = rand() < 0.5 ? 1 : 2
  const col = () => (snowy && rand() < 0.3 ? '#eef3f7' : pick(['#9a978f', '#8a877f', '#a8a59c'], rand()))
  g.box(i, 1, k, i + s - 1, s, k + s - 1, col)
  if (s === 2) g.set(i + (rand() < 0.5 ? 0 : 1), 3, k, col())
}

// Buildings. Each returns its footprint; `build` writes voxels with ground at y = 1.
function house(g, x0, z0, w, d, b, face) {
  const { h = 4, wall = '#e8dcc4', roof = '#b5523b', roof2, trim = '#f6efe0', win = '#41617f', door = '#6b4423', roofStyle = 'hip' } = b
  const x1 = x0 + w - 1, z1 = z0 + d - 1
  g.box(x0, 1, z0, x1, h, z1, wall)
  g.box(x0, h, z0, x1, h, z1, trim)
  for (let y = 2; y < h; y += 2) {
    for (let x = x0 + 1; x < x1; x += 2) { g.set(x, y, z0, win); g.set(x, y, z1, win) }
    for (let z = z0 + 1; z < z1; z += 2) { g.set(x0, y, z, win); g.set(x1, y, z, win) }
  }
  const cx = x0 + Math.floor(w / 2), cz = z0 + Math.floor(d / 2)
  const doorAt = { s: [cx, z1], n: [cx, z0], e: [x1, cz], w: [x0, cz] }[face]
  g.box(doorAt[0], 1, doorAt[1], doorAt[0], 2, doorAt[1], door)
  const r2 = roof2 || roof
  if (roofStyle === 'flat') {
    g.box(x0, h + 1, z0, x1, h + 1, z1, roof)
    g.box(x0 + 1, h + 1, z0 + 1, x1 - 1, h + 1, z1 - 1, r2)
  } else {
    for (let l = 0; ; l++) {
      const ax0 = x0 - 1 + (roofStyle === 'hip' ? l : 0), ax1 = x1 + 1 - (roofStyle === 'hip' ? l : 0)
      const az0 = z0 - 1 + l, az1 = z1 + 1 - l
      if (ax0 > ax1 || az0 > az1) break
      g.box(ax0, h + 1 + l, az0, ax1, h + 1 + l, az1, l % 2 ? r2 : roof)
    }
  }
}

function dome(g, cx, cy, cz, r, colorFn) {
  for (let x = -r; x <= r; x++)
    for (let y = 0; y <= r; y++)
      for (let z = -r; z <= r; z++) {
        const d = Math.sqrt(x * x + y * y + z * z)
        if (d <= r + 0.3 && d > r - 0.9) {
          const c = colorFn(x, y, z)
          if (c) g.set(cx + x, cy + y, cz + z, c)
        }
      }
}

const BUILDINGS = {
  house: { size: (b) => [b.w ?? 8, b.d ?? 6], build: (g, x0, z0, w, d, b, face) => house(g, x0, z0, w, d, b, face) },
  barn: {
    size: (b) => [(b.w ?? 8) + 4, b.d ?? 7],
    build(g, x0, z0, W, d, b, face) {
      const w = W - 4, h = 5
      house(g, x0, z0, w, d, { h, wall: '#c8453a', roof: '#7a2a24', roof2: '#8a3029', trim: '#f4efe6', win: '#f4efe6', door: '#f4efe6', roofStyle: 'gable' }, face)
      for (const x of [x0, x0 + w - 1]) for (const z of [z0, z0 + d - 1]) g.box(x, 1, z, x, h, z, '#f4efe6')
      const sx = x0 + w + 1, sz = z0 + Math.floor(d / 2)
      for (let x = -1; x <= 1; x++) for (let z = -1; z <= 1; z++) g.box(sx + x, 1, sz + z, sx + x, h + 3, sz + z, (xx, y) => (y % 3 ? '#c9ccd1' : '#aab0b8'))
      g.set(sx, h + 4, sz, '#8a9099')
    },
  },
  glasshouse: {
    size: () => [13, 9],
    build(g, x0, z0, w, d) {
      const glass = (x, y, z) => ((x + y + z) % 3 === 0 ? '#ffffff' : (x + z) % 2 ? '#cfe9ef' : '#bfe0e8')
      const cz = z0 + 4, cx = x0 + 6
      g.box(x0, 1, cz - 2, x0 + w - 1, 3, cz + 2, glass)
      g.box(x0, 4, cz - 1, x0 + w - 1, 4, cz + 1, glass)
      g.box(x0, 5, cz, x0 + w - 1, 5, cz, '#ffffff')
      dome(g, cx, 2, cz, 4, glass)
      g.box(cx, 7, cz, cx, 8, cz, '#ffffff')
    },
  },
  aviary: {
    size: () => [11, 11],
    build(g, x0, z0) {
      dome(g, x0 + 5, 1, z0 + 5, 5, (x, y, z) => ((x + y + z) & 1 ? null : '#355e45'))
      g.set(x0 + 5, 7, z0 + 5, '#2b4a37')
    },
  },
  pavilion: {
    size: () => [9, 7],
    build(g, x0, z0, w, d) {
      for (let z = z0; z < z0 + d; z += 2)
        for (let a = 0; a <= 12; a++) {
          const t = (a / 12) * Math.PI
          g.set(x0 + 4 + Math.round(Math.cos(t) * 4), 1 + Math.round(Math.sin(t) * 4), z, '#c49a6c')
        }
      g.box(x0 + 1, 1, z0, x0 + 7, 1, z0 + d - 1, '#b88c5e')
    },
  },
  carousel: {
    size: () => [9, 9],
    spin: true,
    build(g, x0, z0) {
      for (let x = -4; x <= 4; x++) for (let z = -4; z <= 4; z++) if (x * x + z * z <= 18) g.set(x0 + 4 + x, 1, z0 + 4 + z, '#e9d6a8')
    },
    // Spinning top part, centered on (0, 0).
    spinBuild(g) {
      const horse = ['#f4f2ec', '#e8a23a', '#7fb7e6', '#e86a6a', '#9ad17a', '#c49ae6', '#f2d24a', '#8a6a4a']
      for (let a = 0; a < 8; a++) {
        const t = (a / 8) * Math.PI * 2
        const x = Math.round(Math.cos(t) * 3), z = Math.round(Math.sin(t) * 3)
        g.box(x, 2, z, x, 5, z, '#e0b84a')
        g.set(x, 3, z, horse[a])
        g.set(x + (Math.abs(z) > Math.abs(x) ? 1 : 0), 3, z + (Math.abs(z) > Math.abs(x) ? 0 : 1), horse[a])
      }
      g.box(-1, 2, -1, 1, 5, 1, '#f3ead8')
      ;[4.6, 3.6, 2.6, 1.6, 0.6].forEach((r, l) => {
        for (let x = -5; x <= 5; x++)
          for (let z = -5; z <= 5; z++)
            if (x * x + z * z <= r * r) {
              const seg = Math.floor(((Math.atan2(z, x) + Math.PI) / (Math.PI * 2)) * 12) % 2
              g.set(x, 6 + l, z, seg ? '#e04b4b' : '#fbf6ec')
            }
      })
      g.set(0, 11, 0, '#e0b84a')
    },
  },
}

// ---------- Island ----------
export function generateIsland(ex, bridgeAngles) {
  const R = ex.R
  const seed = ex.seed ?? hashStr(ex.id)
  const rand = rng(seed)
  const pal = PALETTES[ex.terrain]
  const cells = new Map()
  const key = (i, k) => i + ',' + k
  const get = (i, k) => cells.get(key(i, k))

  for (let i = -R - 3; i <= R + 3; i++)
    for (let k = -R - 3; k <= R + 3; k++) {
      const cx = i + 0.5, cz = k + 0.5
      const r = Math.hypot(cx, cz)
      const er = edgeRadius(R, Math.atan2(cz, cx), seed)
      if (r <= er) cells.set(key(i, k), { i, k, type: 'grass', d: r / er })
    }

  const interior = (i, k, m = 1) => {
    for (let a = -m; a <= m; a++) for (let b = -m; b <= m; b++) if (!get(i + a, k + b)) return false
    return true
  }

  // Pools (with an optional little island inside)
  for (const p of ex.pools || []) {
    for (const c of cells.values()) {
      const dx = c.i + 0.5 - p.x, dz = c.k + 0.5 - p.z
      const pr = p.r * (1 + 0.12 * Math.sin(3 * Math.atan2(dz, dx) + p.x))
      if (Math.hypot(dx, dz) > pr || !interior(c.i, c.k)) continue
      if (p.islet && Math.hypot(c.i + 0.5 - p.islet.x, c.k + 0.5 - p.islet.z) <= p.islet.r) continue
      c.type = 'water'
      c.hot = p.hot
    }
  }

  // Visitor paths from each bridge to the hub. Paths over water become boardwalks.
  const hub = ex.hub || [0, 0]
  const markPath = (x, z, rad) => {
    for (let i = Math.floor(x - rad); i <= Math.ceil(x + rad); i++)
      for (let k = Math.floor(z - rad); k <= Math.ceil(z + rad); k++) {
        const c = get(i, k)
        if (!c || Math.hypot(i + 0.5 - x, k + 0.5 - z) > rad) continue
        if (c.type === 'water') c.type = 'boardwalk'
        else if (c.type === 'grass') c.type = 'path'
      }
  }
  const endpoints = bridgeAngles.map(({ id, angle }) => {
    const er = edgeRadius(R, angle, seed) - 0.6
    const p = { id, x: Math.cos(angle) * er, z: Math.sin(angle) * er }
    const len = Math.hypot(hub[0] - p.x, hub[1] - p.z)
    for (let s = 0; s <= len; s += 0.25) {
      const t = s / len
      markPath(p.x + (hub[0] - p.x) * t, p.z + (hub[1] - p.z) * t, 1.05)
    }
    return p
  })
  if (endpoints.length) markPath(hub[0], hub[1], 2.3)

  // Train track ring
  if (ex.track) {
    for (const c of cells.values()) {
      const off = Math.abs(Math.hypot(c.i + 0.5, c.k + 0.5) - ex.track)
      if (off <= 1.2) {
        c.track = off > 0.6 ? 'rail' : 'tie'
        if (c.type === 'grass') c.type = 'track'
      }
    }
  }

  const land = new VoxelGrid()
  const water = new VoxelGrid()
  const spinners = []

  // Buildings: search outward from the preferred spot for clear ground.
  const fits = (x0, z0, w, d, m) => {
    for (let i = x0 - m; i < x0 + w + m; i++)
      for (let k = z0 - m; k < z0 + d + m; k++) {
        const c = get(i, k)
        if (!c || c.type !== 'grass' || (m && !interior(i, k))) return false
      }
    return true
  }
  for (const b of ex.buildings || []) {
    const def = BUILDINGS[b.type]
    const [w, d] = def.size(b)
    const px = (b.x ?? 0) - Math.floor(w / 2), pz = (b.z ?? 0) - Math.floor(d / 2)
    const candidates = []
    for (let dx = -R; dx <= R; dx++) for (let dz = -R; dz <= R; dz++) candidates.push([dx, dz, dx * dx + dz * dz])
    candidates.sort((a, b2) => a[2] - b2[2])
    // Prefer a spot with a one-voxel margin; fall back to a snug fit.
    const spot =
      candidates.find(([dx, dz]) => fits(px + dx, pz + dz, w, d, 1)) ||
      candidates.find(([dx, dz]) => fits(px + dx, pz + dz, w, d, 0))
    if (!spot) {
      console.warn(`No room for ${b.type} on ${ex.id}`)
      continue
    }
    const x0 = px + spot[0], z0 = pz + spot[1]
    for (let i = x0; i < x0 + w; i++) for (let k = z0; k < z0 + d; k++) get(i, k).type = 'building'
    // door faces the hub
    const bx = x0 + w / 2 - hub[0], bz = z0 + d / 2 - hub[1]
    const face = Math.abs(bx) > Math.abs(bz) ? (bx > 0 ? 'w' : 'e') : bz > 0 ? 'n' : 's'
    def.build(land, x0, z0, w, d, b, face)
    if (def.spin) {
      const sg = new VoxelGrid()
      def.spinBuild(sg)
      spinners.push({ x: x0 + Math.floor(w / 2), z: z0 + Math.floor(d / 2), geo: buildGeometry(sg, { size: V }) })
    }
  }

  // Trees and rocks on open ground
  const open = () => [...cells.values()].filter((c) => c.type === 'grass' && interior(c.i, c.k, 1))
  const placed = []
  const clear = (c, m) => {
    for (let a = -m; a <= m; a++) for (let b = -m; b <= m; b++) { const n = get(c.i + a, c.k + b); if (!n || n.type !== 'grass') return false }
    return !placed.some((p) => Math.hypot(p.i - c.i, p.k - c.k) < 3)
  }
  let pool = open()
  for (const [type, count] of Object.entries(ex.trees || {})) {
    for (let n = 0; n < count; n++) {
      for (let tries = 0; tries < 60; tries++) {
        const c = pool[Math.floor(rand() * pool.length)]
        if (!c || !clear(c, 1)) continue
        c.type = 'tree'
        placed.push(c)
        tree(land, c.i, c.k, type, rand)
        break
      }
    }
  }
  pool = open()
  for (let n = 0; n < (ex.rocks || 0); n++) {
    for (let tries = 0; tries < 40; tries++) {
      const c = pool[Math.floor(rand() * pool.length)]
      if (!c || !clear(c, 1)) continue
      c.type = 'rock'
      placed.push(c)
      rock(land, c.i, c.k, rand, ex.terrain === 'snow')
      break
    }
  }

  // Terrain columns: top layer, dirt, then a rocky cone hanging underneath.
  for (const c of cells.values()) {
    const { i, k, d } = c
    const h = hash3(i, k, 0, seed)
    const depth = 2 + Math.floor(Math.pow(1 - d, 0.6) * R * 0.75 + h * 2.5)
    let start = -1
    if (c.type === 'water' || c.type === 'boardwalk') {
      water.set(i, -1, k, c.hot ? '#86dcd3' : pal.water)
      land.set(i, -2, k, '#d8c79a')
      start = -3
      if (c.type === 'boardwalk') land.set(i, 0, k, (i + k) & 1 ? '#a97c50' : '#9c7046')
    } else {
      let top = pick(pal.top, h)
      if (c.type === 'path') top = h < 0.5 ? '#e4d2a6' : '#dbc898'
      if (c.type === 'building') top = '#cfc8b8'
      if (c.track) top = c.track === 'rail' ? '#8f949a' : (i + k) & 1 ? '#6b4a2e' : '#7d5a3a'
      land.set(i, 0, k, top)
    }
    for (let y = start; y > -depth; y--) {
      const layer = -y
      const col = layer <= 2 ? pal.dirt : pick(STONE, Math.min(0.99, layer / depth + (h - 0.5) * 0.3))
      land.set(i, y, k, col)
    }
  }

  const walk = { grass: [], water: [] }
  for (const c of cells.values()) {
    if (c.type === 'grass') walk.grass.push(c)
    if (c.type === 'water') walk.water.push(c)
  }

  return {
    ...ex,
    seed,
    phase: (seed % 628) / 100,
    cells,
    hub: [hub[0] * V, hub[1] * V],
    endpoints: endpoints.map((p) => ({ id: p.id, x: p.x * V, z: p.z * V })),
    walk,
    spinners,
    landGeo: buildGeometry(land, { size: V }),
    waterGeo: buildGeometry(water, { size: V, jitter: 0.03 }),
    cellType(x, z) {
      const c = get(Math.floor(x / V), Math.floor(z / V))
      return c ? c.type : null
    },
  }
}

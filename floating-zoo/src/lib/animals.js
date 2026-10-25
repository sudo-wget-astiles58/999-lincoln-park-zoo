import { VoxelGrid, hash3, buildGeometry } from './voxel'

// Every model faces +z (head toward +z), feet at y = 0.
const DARK = '#1b1b1f'
const WHITE = '#f4f2ec'

// A configurable four-legged animal: legs, body, optional neck, head, snout, ears, tail.
function quadruped(o) {
  const g = new VoxelGrid()
  const {
    w = 4, len = 8, bodyH = 3, legH = 3, legW = 1, legInset = 0,
    headW = 3, headH = 3, headLen = 3, neckH = 0, neckW, snoutLen = 1, snoutW,
    color, colors = {}, paint, ears = true, tail = 1, eyes = DARK, nose = DARK,
  } = o
  const C = (part) => (x, y, z) => (paint && paint(part, x, y, z)) || colors[part] || color

  for (const ax of [0, w - legW])
    for (const az of [legInset, len - legW - legInset])
      g.box(ax, 0, az, ax + legW - 1, legH - 1, az + legW - 1, C('leg'))

  const by0 = legH, by1 = legH + bodyH - 1
  g.box(0, by0, 0, w - 1, by1, len - 1, C('body'))

  const hx0 = Math.floor((w - headW) / 2), hx1 = hx0 + headW - 1
  let hy0 = by1 - headH + 2, hz0 = len
  if (neckH > 0) {
    const nw = neckW ?? Math.max(1, headW - 1)
    const nx0 = Math.floor((w - nw) / 2)
    g.box(nx0, by1 + 1, len - 2, nx0 + nw - 1, by1 + neckH, len - 1, C('neck'))
    hy0 = by1 + neckH
    hz0 = len - 1
  }
  const hy1 = hy0 + headH - 1, hz1 = hz0 + headLen - 1
  g.box(hx0, hy0, hz0, hx1, hy1, hz1, C('head'))

  const sw = snoutW ?? Math.max(1, headW - 2)
  const sx0 = Math.floor((w - sw) / 2)
  const sz1 = hz1 + snoutLen
  if (snoutLen > 0) {
    g.box(sx0, hy0, hz1 + 1, sx0 + sw - 1, hy0 + 1, sz1, C('snout'))
    if (nose) g.box(sx0, hy0 + 1, sz1, sx0 + sw - 1, hy0 + 1, sz1, nose)
  }
  const eyeY = headH > 2 ? hy1 - 1 : hy1
  g.set(hx0, eyeY, hz1, eyes)
  g.set(hx1, eyeY, hz1, eyes)
  if (ears) {
    g.set(hx0, hy1 + 1, hz0, C('ear')(hx0, hy1 + 1, hz0))
    g.set(hx1, hy1 + 1, hz0, C('ear')(hx1, hy1 + 1, hz0))
  }
  const tx = Math.floor((w - 1) / 2)
  for (let t = 1; t <= tail; t++) {
    const y = by1 - Math.floor((t - 1) / 2)
    g.set(tx, y, -t, C('tail')(tx, y, -t))
  }
  o.extra?.(g, { w, len, legH, bodyH, by0, by1, hx0, hx1, hy0, hy1, hz0, hz1, sx0, sw, sz1, neckH })
  return g
}

const sphereish = (g, cx, cy, cz, r, color) => {
  for (let x = -r; x <= r; x++)
    for (let y = -r; y <= r; y++)
      for (let z = -r; z <= r; z++)
        if (x * x + y * y + z * z <= r * r + 0.5) g.set(cx + x, cy + y, cz + z, color)
}

// ---------- Africa ----------
function giraffe() {
  const spots = (part, x, y, z) =>
    (part === 'body' || part === 'neck' || (part === 'leg' && y > 5)) && hash3(x >> 1, y >> 1, z >> 1, 3) < 0.5
      ? '#9a5a26'
      : null
  return quadruped({
    w: 4, len: 7, bodyH: 3, legH: 8, headW: 2, headH: 2, headLen: 3, neckH: 9, neckW: 2,
    snoutLen: 1, snoutW: 2, color: '#e9b85a', colors: { snout: '#d9a24a', leg: '#f0d29a' },
    nose: '#5a3a1a', paint: spots, tail: 3, ears: false,
    extra: (g, d) => {
      g.box(d.hx0, d.hy1 + 1, d.hz0 + 1, d.hx0, d.hy1 + 1, d.hz0 + 1, '#6b4423')
      g.box(d.hx1, d.hy1 + 1, d.hz0 + 1, d.hx1, d.hy1 + 1, d.hz0 + 1, '#6b4423')
      g.set(d.hx0, d.hy1 + 2, d.hz0 + 1, '#3a2414')
      g.set(d.hx1, d.hy1 + 2, d.hz0 + 1, '#3a2414')
      g.set(d.hx0 - 1, d.hy1, d.hz0, '#e9b85a')
      g.set(d.hx1 + 1, d.hy1, d.hz0, '#e9b85a')
      g.box(1, d.by1 + 2, d.len - 3, 2, d.by1 + d.neckH, d.len - 3, '#8a4b1f')
    },
  })
}

function rhino() {
  return quadruped({
    w: 5, len: 9, bodyH: 4, legH: 2, legW: 2, headW: 3, headH: 3, headLen: 3, snoutLen: 2, snoutW: 3,
    color: '#8e8b84', colors: { leg: '#7f7c75', ear: '#7f7c75', snout: '#9a978f' }, nose: '#6f6c66', tail: 2,
    extra: (g, d) => {
      const cx = d.sx0 + 1
      g.box(cx, d.hy0 + 2, d.sz1 - 1, cx, d.hy0 + 3, d.sz1 - 1, '#d6ccb8')
      g.set(cx, d.hy0 + 4, d.sz1 - 1, '#e8e0cf')
      g.set(cx, d.hy0 + 3, d.hz1, '#d6ccb8')
    },
  })
}

function meerkat() {
  const g = new VoxelGrid(), c = '#c9a26b', belly = '#e6cfa0', dk = '#4a3626'
  g.box(0, 0, 0, 1, 0, 2, c)
  g.box(0, 1, 0, 1, 4, 1, c)
  g.box(0, 1, 1, 1, 3, 1, belly)
  g.box(0, 5, 0, 1, 6, 2, c)
  g.box(0, 5, 3, 1, 5, 3, '#b8925e')
  g.set(0, 6, 2, dk); g.set(1, 6, 2, dk)
  g.set(0, 3, 2, c); g.set(1, 3, 2, c)
  g.set(-1, 6, 0, dk); g.set(2, 6, 0, dk)
  g.box(0, 0, -2, 1, 0, -1, c); g.set(0, 0, -3, dk)
  return g
}

function lion(maned = true) {
  return quadruped({
    w: 4, len: 8, bodyH: 3, legH: 3, headW: 4, headH: maned ? 4 : 3, headLen: 3, snoutLen: 1, snoutW: 2,
    color: '#d9a441', colors: { snout: '#ecc98a', ear: maned ? '#8b4a1c' : '#c99236' }, nose: '#5a3020', tail: 4,
    paint: (part, x, y, z) => (part === 'tail' && z === -4 ? '#6b3414' : null),
    extra: (g, d) => {
      if (!maned) return
      g.box(d.hx0 - 1, d.hy0 - 1, d.hz0, d.hx1 + 1, d.hy1 + 1, d.hz0 + 1, '#8b4a1c')
      g.box(d.hx0, d.hy0 - 2, d.hz0 - 1, d.hx1, d.hy1, d.hz0 - 1, '#7a3f17')
    },
  })
}

function zebra() {
  const stripe = (part, x, y, z) => {
    if (part === 'body') return z % 2 === 0 ? '#1d1d1d' : WHITE
    if (part === 'neck' || part === 'leg' || part === 'head') return y % 2 === 0 ? '#1d1d1d' : WHITE
    return null
  }
  return quadruped({
    w: 4, len: 8, bodyH: 3, legH: 5, headW: 2, headH: 2, headLen: 3, neckH: 3, neckW: 2, snoutLen: 1, snoutW: 2,
    color: WHITE, colors: { snout: '#2a2a2a', ear: WHITE, tail: '#1d1d1d' }, paint: stripe, tail: 3,
    extra: (g, d) => g.box(1, d.by1 + 1, d.len - 3, 2, d.by1 + d.neckH + 1, d.len - 3, '#1d1d1d'),
  })
}

// ---------- Cold & water ----------
function polarBear() {
  return quadruped({
    w: 6, len: 10, bodyH: 4, legH: 3, legW: 2, headW: 4, headH: 3, headLen: 3, snoutLen: 2, snoutW: 2,
    color: '#f3efe4', colors: { ear: '#e3dccb', leg: '#ece6d8' }, tail: 1,
  })
}

function penguin() {
  const g = new VoxelGrid(), bk = '#1e1e24', wh = '#f5f5f0'
  g.box(0, 1, 0, 3, 6, 3, bk)
  g.box(0, 1, 3, 3, 5, 3, wh)
  g.box(1, 1, 4, 2, 4, 4, wh)
  g.box(0, 7, 0, 3, 9, 3, bk)
  g.set(0, 8, 3, wh); g.set(3, 8, 3, wh); g.set(0, 7, 3, wh); g.set(3, 7, 3, wh)
  g.set(1, 8, 3, '#f2a0a0'); g.set(2, 8, 3, '#f2a0a0')
  g.box(1, 7, 4, 2, 7, 5, '#2a2a2a')
  g.box(-1, 3, 1, -1, 5, 2, bk); g.box(4, 3, 1, 4, 5, 2, bk)
  g.box(0, 0, 1, 1, 0, 3, '#e58a2b'); g.box(2, 0, 1, 3, 0, 3, '#e58a2b')
  g.set(1, 2, -1, bk); g.set(2, 2, -1, bk)
  return g
}

function seal() {
  const g = new VoxelGrid(), c = '#7a7f86', lt = '#9aa0a6'
  const body = (x, y, z) => (hash3(x, y, z, 5) < 0.18 ? '#5e636a' : c)
  g.box(0, 0, 0, 3, 2, 7, body)
  g.box(1, 0, -2, 2, 1, -1, body)
  g.box(0, 0, -3, 3, 0, -3, '#5e636a')
  g.box(0, 1, 8, 3, 4, 10, body)
  g.box(1, 1, 11, 2, 2, 11, lt)
  g.set(1, 2, 12, DARK); g.set(2, 2, 12, DARK)
  g.set(0, 3, 10, DARK); g.set(3, 3, 10, DARK)
  g.box(-1, 0, 5, -1, 0, 6, '#5e636a'); g.box(4, 0, 5, 4, 0, 6, '#5e636a')
  return g
}

function otter() {
  return quadruped({
    w: 3, len: 8, bodyH: 2, legH: 1, headW: 3, headH: 2, headLen: 2, snoutLen: 1, snoutW: 1,
    color: '#6b4a2e', colors: { snout: '#c9a77e', ear: '#5a3d25' }, tail: 4,
  })
}

function beaver() {
  return quadruped({
    w: 3, len: 8, bodyH: 2, legH: 1, headW: 3, headH: 2, headLen: 2, snoutLen: 1, snoutW: 1,
    color: '#6b4a2e', colors: { snout: '#000000', ear: '#6b4a2e' }, tail: 5,
  })
}


// ---------- Primates ----------
function sitter({ fur, face, w = 4, tailColor, tailLen = 1 }) {
  const g = new VoxelGrid()
  g.box(0, 0, 0, w - 1, 3, 3, fur)
  g.box(0, 4, 1, w - 1, 6, 4, fur)
  g.box(0, 4, 5, w - 1, 5, 5, face)
  g.set(1, 5, 5, DARK); g.set(w - 2, 5, 5, DARK)
  g.box(-1, 1, 1, -1, 3, 2, fur); g.box(w, 1, 1, w, 3, 2, fur)
  g.box(0, 0, 4, 1, 1, 4, fur); g.box(w - 2, 0, 4, w - 1, 1, 4, fur)
  for (let t = 1; t <= tailLen; t++) g.set(1, Math.max(0, 1 - (t >> 2)), -t, tailColor || fur)
  return g
}

const macaque = () => sitter({ fur: '#b8a28a', face: '#e88f8f' })
const colobus = () => {
  const g = sitter({ fur: '#1f1f22', face: '#d9d4c7', tailColor: WHITE, tailLen: 7 })
  g.box(-1, 4, 2, -1, 6, 3, WHITE); g.box(4, 4, 2, 4, 6, 3, WHITE)
  g.box(0, 7, 1, 3, 7, 4, WHITE)
  return g
}

function ape({ fur, face, chest, back, big }) {
  const g = new VoxelGrid()
  const s = big ? 1 : 0
  g.box(0, 0, 0, 1, 2, 1, fur); g.box(4 + s, 0, 0, 5 + s, 2, 1, fur)
  g.box(0, 3, 0, 5 + s, 7 + s, 5, fur)
  if (chest) g.box(1, 3, 5, 4 + s, 6, 5, chest)
  if (back) g.box(0, 7 + s, 0, 5 + s, 7 + s, 3, back)
  g.box(-1, 0, 4, 0, 6, 5, fur); g.box(5 + s, 0, 4, 6 + s, 6, 5, fur)
  g.box(1, 7 + s, 5, 4 + s, 10 + s, 7, fur)
  g.box(1, 7 + s, 8, 4 + s, 9 + s, 8, face)
  g.set(2, 9 + s, 8, DARK); g.set(3 + s, 9 + s, 8, DARK)
  if (!big) { g.set(0, 9, 6, face); g.set(5, 9, 6, face) }
  return g
}
const gorilla = () => ape({ fur: '#2c2c2e', face: '#4a4a4c', back: '#9a9a9a', big: true })
const chimp = () => ape({ fur: '#2a221c', face: '#d9b48c' })

// ---------- Children's Zoo ----------
function blackBear() {
  return quadruped({
    w: 5, len: 9, bodyH: 4, legH: 2, legW: 2, headW: 4, headH: 3, headLen: 2, snoutLen: 2, snoutW: 2,
    color: '#2a2522', colors: { snout: '#b08a5e' }, nose: '#111', eyes: '#0a0a0a', tail: 1,
  })
}
function redWolf() {
  return quadruped({
    w: 3, len: 7, bodyH: 2, legH: 3, headW: 3, headH: 2, headLen: 2, snoutLen: 2, snoutW: 1,
    color: '#b5643a', colors: { snout: '#d9b38c', ear: '#8a4a2a', leg: '#9a5532' }, tail: 3,
    paint: (part, x, y, z) => (part === 'tail' && z === -3 ? '#2a1a12' : null),
  })
}

// ---------- Reptiles ----------
function snake() {
  const g = new VoxelGrid()
  for (let z = 0; z < 16; z++) {
    const x = Math.round(Math.sin(z * 0.55) * 1.6)
    const c = z % 3 === 0 ? '#e4c74a' : '#5f9e45'
    g.set(x, 0, z, c)
    if (z > 2 && z < 13) g.set(x + 1, 0, z, z % 3 === 0 ? '#e4c74a' : '#4f8a3a')
  }
  const hx = Math.round(Math.sin(16 * 0.55) * 1.6)
  g.box(hx, 0, 16, hx + 1, 1, 17, '#5f9e45')
  g.set(hx, 1, 17, DARK); g.set(hx + 1, 1, 17, DARK)
  g.set(hx, 0, 18, '#d63a3a')
  return g
}
function turtle() {
  const g = new VoxelGrid(), shell = '#4f7a3a', skin = '#7d9a5a'
  g.box(0, 0, 1, 0, 0, 1, skin); g.box(4, 0, 1, 4, 0, 1, skin)
  g.box(0, 0, 4, 0, 0, 4, skin); g.box(4, 0, 4, 4, 0, 4, skin)
  g.box(0, 1, 0, 4, 2, 5, (x, y, z) => ((x + z) % 2 ? shell : '#5f8c45'))
  g.box(1, 3, 1, 3, 3, 4, '#6a9a4f')
  g.box(1, 1, 6, 3, 2, 7, skin)
  g.set(1, 2, 7, DARK); g.set(3, 2, 7, DARK)
  g.set(2, 1, -1, skin)
  return g
}

// ---------- Birds ----------
function swan() {
  const g = new VoxelGrid()
  g.box(0, 0, 0, 3, 2, 5, WHITE)
  g.box(1, 3, 0, 2, 3, 1, WHITE)
  g.box(1, 3, 5, 2, 7, 5, WHITE)
  g.box(1, 7, 6, 2, 8, 7, WHITE)
  g.box(1, 7, 8, 2, 7, 9, '#f08a24')
  g.set(1, 8, 8, DARK); g.set(2, 8, 8, DARK)
  return g
}
function wader({ body, wing, legs, neck = body, beak, tip = DARK }) {
  const g = new VoxelGrid()
  g.box(1, 0, 2, 1, 6, 2, legs); g.box(2, 0, 2, 2, 6, 2, legs)
  g.box(1, 0, 3, 2, 0, 3, legs)
  g.box(0, 7, 0, 3, 9, 4, body)
  g.box(0, 8, 0, 0, 9, 3, wing); g.box(3, 8, 0, 3, 9, 3, wing)
  g.box(1, 10, 4, 2, 14, 4, neck)
  g.box(1, 14, 4, 2, 15, 6, neck)
  g.box(1, 14, 7, 2, 14, 8, beak)
  g.box(1, 14, 9, 2, 14, 9, tip)
  g.set(1, 15, 6, DARK); g.set(2, 15, 6, DARK)
  return g
}
const flamingo = () => wader({ body: '#f49ac1', wing: '#e8799f', legs: '#e8799f', beak: '#f5ede0' })
const heron = () => wader({ body: '#8d9db0', wing: '#6f8094', legs: '#c9b46a', neck: '#dfe4ea', beak: '#e0b84a', tip: '#e0b84a' })

function flyer({ body, head, wing, tip, beak, tail }) {
  const g = new VoxelGrid()
  g.box(0, 0, 0, 2, 1, 5, body)
  g.box(0, 0, 6, 2, 2, 7, head)
  g.set(0, 2, 7, DARK); g.set(2, 2, 7, DARK)
  g.box(1, 1, 8, 1, 1, 9, beak)
  g.box(0, 0, -2, 2, 0, -1, tail)
  g.box(-6, 1, 1, -1, 1, 4, wing); g.box(3, 1, 1, 8, 1, 4, wing)
  g.box(-7, 1, 2, -7, 1, 4, tip); g.box(9, 1, 2, 9, 1, 4, tip)
  return g
}
const eagle = () => flyer({ body: '#5a3a22', head: WHITE, wing: '#4a2e1a', tip: '#2e1c10', beak: '#f2c230', tail: WHITE })
const songbird = () => flyer({ body: '#e34b4b', head: '#f2994a', wing: '#2d6cdf', tip: '#1b3f8a', beak: '#f2c230', tail: '#2d6cdf' })

// ---------- Farm ----------
function cow() {
  const patches = (part, x, y, z) =>
    (part === 'body' || part === 'head') && hash3(Math.floor(x / 3), Math.floor(y / 3), Math.floor(z / 3), 7) < 0.45
      ? '#222'
      : null
  return quadruped({
    w: 5, len: 9, bodyH: 4, legH: 3, legW: 2, headW: 3, headH: 3, headLen: 3, snoutLen: 1, snoutW: 3,
    color: WHITE, colors: { snout: '#f2b8b8', ear: '#222' }, nose: '#c98585', paint: patches, tail: 3,
    extra: (g, d) => { g.set(d.hx0 - 1, d.hy1, d.hz0 + 1, '#e8dcc0'); g.set(d.hx1 + 1, d.hy1, d.hz0 + 1, '#e8dcc0') },
  })
}
function goat() {
  return quadruped({
    w: 3, len: 6, bodyH: 3, legH: 3, headW: 3, headH: 2, headLen: 2, neckH: 1, neckW: 1, snoutLen: 1, snoutW: 1,
    color: '#d8d0c4', colors: { leg: '#c4bbae' }, nose: '#6b5a4a', tail: 1,
    extra: (g, d) => {
      g.box(d.hx0, d.hy1 + 1, d.hz0, d.hx0, d.hy1 + 2, d.hz0 - 1, '#7a6a55')
      g.box(d.hx1, d.hy1 + 1, d.hz0, d.hx1, d.hy1 + 2, d.hz0 - 1, '#7a6a55')
      g.set(d.sx0, d.hy0 - 1, d.sz1, '#bdb2a2')
    },
  })
}
function chicken() {
  const g = new VoxelGrid()
  g.set(0, 0, 1, '#f2a33a'); g.set(2, 0, 1, '#f2a33a')
  g.box(0, 1, 0, 2, 3, 3, WHITE)
  g.box(0, 4, 2, 2, 5, 4, WHITE)
  g.box(1, 6, 2, 1, 6, 4, '#e03c3c')
  g.set(1, 4, 5, '#f2a33a'); g.set(1, 3, 4, '#e03c3c')
  g.set(0, 5, 4, DARK); g.set(2, 5, 4, DARK)
  g.box(1, 4, -1, 1, 5, -1, '#e8e4da')
  return g
}

// ---------- South Loop ----------
function redRiverHog() {
  return quadruped({
    w: 4, len: 7, bodyH: 3, legH: 2, headW: 3, headH: 3, headLen: 2, snoutLen: 2, snoutW: 2,
    color: '#c0582b', colors: { snout: '#3a2a22', ear: '#f1f1f1', leg: '#2a1a12' }, nose: '#2a1a12', tail: 1,
    extra: (g, d) => {
      g.set(d.hx0, d.hy1 + 2, d.hz0, '#f1f1f1'); g.set(d.hx1, d.hy1 + 2, d.hz0, '#f1f1f1')
      g.box(1, d.by1 + 1, 1, 2, d.by1 + 1, d.len - 1, '#f1f1f1')
    },
  })
}
function deer() {
  return quadruped({
    w: 3, len: 7, bodyH: 3, legH: 5, headW: 3, headH: 2, headLen: 2, neckH: 2, neckW: 1, snoutLen: 1, snoutW: 1,
    color: '#a0703c', colors: { tail: WHITE, leg: '#8a5f32' }, tail: 1,
    extra: (g, d) => {
      const ant = '#d9c7a0'
      for (const x of [d.hx0, d.hx1]) {
        g.box(x, d.hy1 + 1, d.hz0, x, d.hy1 + 4, d.hz0, ant)
        g.set(x, d.hy1 + 3, d.hz0 + 1, ant)
        g.set(x + (x === d.hx0 ? -1 : 1), d.hy1 + 4, d.hz0, ant)
      }
    },
  })
}
function llama() {
  return quadruped({
    w: 3, len: 6, bodyH: 3, legH: 5, headW: 3, headH: 2, headLen: 2, neckH: 5, neckW: 1, snoutLen: 1, snoutW: 1,
    color: '#efe3cf', colors: { leg: '#e2d3b8', snout: '#d7c6a8' }, nose: '#6b5a4a', tail: 1, ears: false,
    extra: (g, d) => {
      g.box(d.hx0, d.hy1 + 1, d.hz0, d.hx0, d.hy1 + 2, d.hz0, '#d7c6a8')
      g.box(d.hx1, d.hy1 + 1, d.hz0, d.hx1, d.hy1 + 2, d.hz0, '#d7c6a8')
    },
  })
}

// ---------- Visitors & vehicles ----------
export function person({ shirt, pants, skin, hair }) {
  const g = new VoxelGrid()
  g.box(0, 0, 0, 0, 2, 1, pants); g.box(2, 0, 0, 2, 2, 1, pants)
  g.box(1, 2, 0, 1, 2, 1, pants)
  g.box(0, 3, 0, 2, 5, 1, shirt)
  g.box(-1, 3, 0, -1, 5, 1, skin); g.box(3, 3, 0, 3, 5, 1, skin)
  g.set(-1, 5, 0, shirt); g.set(3, 5, 0, shirt)
  g.box(0, 6, 0, 2, 8, 2, skin)
  g.box(0, 9, 0, 2, 9, 2, hair)
  g.box(0, 7, 0, 2, 8, 0, hair)
  g.set(0, 7, 2, DARK); g.set(2, 7, 2, DARK)
  return g
}

export function locomotive() {
  const g = new VoxelGrid()
  g.box(0, 1, 0, 3, 1, 9, '#333')
  for (const z of [1, 4, 7]) { g.set(-1, 0, z, '#222'); g.set(4, 0, z, '#222'); g.set(-1, 1, z, '#c0392b'); g.set(4, 1, z, '#c0392b') }
  g.box(0, 2, 3, 3, 4, 9, '#2d6a4f')
  g.box(0, 2, 0, 3, 6, 2, '#c0392b')
  g.set(0, 5, 1, '#cfe8ff'); g.set(3, 5, 1, '#cfe8ff')
  g.box(-1, 7, -1, 4, 7, 3, '#222')
  g.box(1, 5, 8, 2, 7, 8, '#222')
  g.box(1, 3, 10, 2, 3, 10, '#ffd34d')
  g.box(0, 5, 5, 3, 5, 6, '#e0b84a')
  return g
}
export function trainCar(color) {
  const g = new VoxelGrid()
  g.box(0, 1, 0, 3, 1, 6, '#333')
  for (const z of [1, 5]) { g.set(-1, 0, z, '#222'); g.set(4, 0, z, '#222') }
  g.box(0, 2, 0, 3, 3, 6, color)
  g.box(1, 3, 1, 2, 3, 5, '#5a3a22')
  return g
}

export const HEART = (() => {
  const g = new VoxelGrid()
  const rows = ['.X.X.', 'XXXXX', 'XXXXX', '.XXX.', '..X..']
  rows.forEach((r, i) => [...r].forEach((ch, x) => ch === 'X' && g.box(x, 4 - i, 0, x, 4 - i, 1, '#ff4d6d')))
  return buildGeometry(g, { size: 0.07, center: true })
})()

// habitat: land | water | both | air
// waterY: where the model's feet sit when in water (water surface is y = 0, pool floor y = -0.5)
export const SPECIES = {
  polarBear: { name: 'Polar bear', emoji: '🐻‍❄️', build: polarBear, scale: 0.12, habitat: 'both', speed: 0.7, waterY: -0.45 },
  giraffe: { name: 'Giraffe', emoji: '🦒', build: giraffe, scale: 0.12, habitat: 'land', speed: 0.6 },
  rhino: { name: 'Black rhino', emoji: '🦏', build: rhino, scale: 0.13, habitat: 'land', speed: 0.45 },
  meerkat: { name: 'Meerkat', emoji: '🐾', build: meerkat, scale: 0.11, habitat: 'land', speed: 1.2, wait: [2, 6] },
  penguin: { name: 'African penguin', emoji: '🐧', build: penguin, scale: 0.1, habitat: 'both', speed: 0.6, waddle: true, waterY: -0.55 },
  eagle: { name: 'Eagle', emoji: '🦅', build: eagle, scale: 0.15, habitat: 'air', speed: 0.35, height: [6, 9] },
  songbird: { name: 'Tropical bird', emoji: '🐦', build: songbird, scale: 0.1, habitat: 'air', speed: 0.7, height: [3.5, 6] },
  macaque: { name: 'Japanese macaque', emoji: '🐒', build: macaque, scale: 0.12, habitat: 'both', speed: 0.8, waterY: -0.35 },
  seal: { name: 'Grey seal', emoji: '🦭', build: seal, scale: 0.12, habitat: 'both', speed: 1.1, waterY: -0.3, preferWater: true },
  lion: { name: 'African lion', emoji: '🦁', build: () => lion(true), scale: 0.13, habitat: 'land', speed: 0.55, wait: [3, 9] },
  lioness: { name: 'Lioness', emoji: '🦁', build: () => lion(false), scale: 0.13, habitat: 'land', speed: 0.6, wait: [3, 9] },
  blackBear: { name: 'Black bear', emoji: '🐻', build: blackBear, scale: 0.11, habitat: 'land', speed: 0.6 },
  otter: { name: 'River otter', emoji: '🦦', build: otter, scale: 0.1, habitat: 'both', speed: 1.2, waterY: -0.15, preferWater: true },
  redWolf: { name: 'Red wolf', emoji: '🐺', build: redWolf, scale: 0.11, habitat: 'land', speed: 0.9 },
  snake: { name: 'Snake', emoji: '🐍', build: snake, scale: 0.09, habitat: 'land', speed: 0.35, slither: true },
  turtle: { name: 'Turtle', emoji: '🐢', build: turtle, scale: 0.1, habitat: 'both', speed: 0.25, waterY: -0.25 },
  swan: { name: 'Swan', emoji: '🦢', build: swan, scale: 0.11, habitat: 'water', speed: 0.45, waterY: -0.08 },
  flamingo: { name: 'Chilean flamingo', emoji: '🦩', build: flamingo, scale: 0.1, habitat: 'both', speed: 0.4, waterY: -0.5, wait: [2, 8] },
  heron: { name: 'Heron', emoji: '🪶', build: heron, scale: 0.1, habitat: 'both', speed: 0.35, waterY: -0.5, wait: [23, 1] },
  beaver: { name: 'Beaver', emoji: '🦫', build: beaver, scale: 0.1, habitat: 'water', speed: 0.75, waterY: -0.5, wait: [3, 10] },
  colobus: { name: 'Colobus monkey', emoji: '🐒', build: colobus, scale: 0.11, habitat: 'land', speed: 0.9 },
  gorilla: { name: 'Western lowland gorilla', emoji: '🦍', build: gorilla, scale: 0.14, habitat: 'land', speed: 0.45, wait: [3, 10] },
  chimp: { name: 'Chimpanzee', emoji: '🐒', build: chimp, scale: 0.12, habitat: 'land', speed: 0.8 },
  zebra: { name: 'Zebra', emoji: '🦓', build: zebra, scale: 0.12, habitat: 'land', speed: 0.8 },
  redRiverHog: { name: 'Red river hog', emoji: '🐗', build: redRiverHog, scale: 0.11, habitat: 'land', speed: 0.7 },
  deer: { name: 'Deer', emoji: '🦌', build: deer, scale: 0.12, habitat: 'land', speed: 0.7 },
  llama: { name: 'Llama', emoji: '🦙', build: llama, scale: 0.12, habitat: 'land', speed: 0.6 },
  cow: { name: 'Dairy cow', emoji: '🐄', build: cow, scale: 0.12, habitat: 'land', speed: 0.35, wait: [3, 10] },
  goat: { name: 'Goat', emoji: '🐐', build: goat, scale: 0.11, habitat: 'land', speed: 0.8 },
  chicken: { name: 'Chicken', emoji: '🐔', build: chicken, scale: 0.08, habitat: 'land', speed: 0.9, wait: [0.5, 3] },
}

// Animals are drawn a bit larger than life next to the buildings so they read from afar.
const ANIMAL_SCALE = 1.4

const geoCache = new Map()
export function speciesGeometry(key) {
  if (!geoCache.has(key)) {
    const s = SPECIES[key]
    geoCache.set(key, buildGeometry(s.build(), { size: s.scale * ANIMAL_SCALE, center: true, jitter: 0.1 }))
  }
  return geoCache.get(key)
}

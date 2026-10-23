import * as THREE from 'three'

// Small seeded random generator (mulberry32) so the world looks the same on every load.
export function rng(seed) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// Deterministic 0..1 hash for integer coordinates.
export function hash3(x, y, z, s = 0) {
  let h =
    Math.imul(x | 0, 374761393) ^
    Math.imul(y | 0, 668265263) ^
    Math.imul(z | 0, 2147483647) ^
    Math.imul(s | 0, 1274126177)
  h = Math.imul(h ^ (h >>> 13), 1274126177)
  h ^= h >>> 16
  return (h >>> 0) / 4294967296
}

export function hashStr(str) {
  let h = 2166136261
  for (let i = 0; i < str.length; i++) h = Math.imul(h ^ str.charCodeAt(i), 16777619)
  return h >>> 0
}

const key = (x, y, z) => ((x + 512) * 1024 + (y + 512)) * 1024 + (z + 512)

// A sparse set of colored voxels.
export class VoxelGrid {
  constructor() {
    this.cells = new Map()
  }
  set(x, y, z, color) {
    this.cells.set(key(x, y, z), [x, y, z, color])
  }
  has(x, y, z) {
    return this.cells.has(key(x, y, z))
  }
  delete(x, y, z) {
    this.cells.delete(key(x, y, z))
  }
  // Fill an inclusive box. `color` may be a hex string or (x, y, z) => hex.
  box(x0, y0, z0, x1, y1, z1, color) {
    const fn = typeof color === 'function' ? color : null
    for (let x = Math.min(x0, x1); x <= Math.max(x0, x1); x++)
      for (let y = Math.min(y0, y1); y <= Math.max(y0, y1); y++)
        for (let z = Math.min(z0, z1); z <= Math.max(z0, z1); z++)
          this.set(x, y, z, fn ? fn(x, y, z) : color)
  }
}

// Each face: outward normal, 4 corners (CCW from outside), and a baked shade
// so voxels read clearly even in flat light.
const FACES = [
  { n: [1, 0, 0], c: [[1, 0, 0], [1, 1, 0], [1, 1, 1], [1, 0, 1]], shade: 0.88 },
  { n: [-1, 0, 0], c: [[0, 0, 0], [0, 0, 1], [0, 1, 1], [0, 1, 0]], shade: 0.82 },
  { n: [0, 1, 0], c: [[0, 1, 0], [0, 1, 1], [1, 1, 1], [1, 1, 0]], shade: 1 },
  { n: [0, -1, 0], c: [[0, 0, 0], [1, 0, 0], [1, 0, 1], [0, 0, 1]], shade: 0.62 },
  { n: [0, 0, 1], c: [[0, 0, 1], [1, 0, 1], [1, 1, 1], [0, 1, 1]], shade: 0.93 },
  { n: [0, 0, -1], c: [[0, 0, 0], [0, 1, 0], [1, 1, 0], [1, 0, 0]], shade: 0.78 },
]

const colorCache = new Map()
function toColor(hex) {
  let c = colorCache.get(hex)
  if (!c) colorCache.set(hex, (c = new THREE.Color(hex)))
  return c
}

// Turn a grid into one mesh, emitting only faces that touch empty space.
// `center` puts the model's footprint centered on x/z with its feet at y = 0.
export function buildGeometry(grid, { size = 1, center = false, jitter = 0.07 } = {}) {
  let ox = 0, oy = 0, oz = 0
  if (center) {
    let minX = Infinity, maxX = -Infinity, minY = Infinity, minZ = Infinity, maxZ = -Infinity
    for (const [x, y, z] of grid.cells.values()) {
      minX = Math.min(minX, x); maxX = Math.max(maxX, x)
      minY = Math.min(minY, y)
      minZ = Math.min(minZ, z); maxZ = Math.max(maxZ, z)
    }
    ox = -(minX + maxX + 1) / 2
    oy = -minY
    oz = -(minZ + maxZ + 1) / 2
  }
  const positions = [], normals = [], colors = [], indices = []
  let v = 0
  for (const [x, y, z, hex] of grid.cells.values()) {
    const base = toColor(hex)
    const j = 1 + (hash3(x, y, z, 9) - 0.5) * jitter
    for (const f of FACES) {
      if (grid.has(x + f.n[0], y + f.n[1], z + f.n[2])) continue
      const s = f.shade * j
      for (const c of f.c) {
        positions.push((x + c[0] + ox) * size, (y + c[1] + oy) * size, (z + c[2] + oz) * size)
        normals.push(f.n[0], f.n[1], f.n[2])
        colors.push(base.r * s, base.g * s, base.b * s)
      }
      indices.push(v, v + 1, v + 2, v, v + 2, v + 3)
      v += 4
    }
  }
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  g.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3))
  g.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))
  g.setIndex(indices)
  g.computeBoundingBox()
  g.computeBoundingSphere()
  return g
}

export const VOXEL_MAT = new THREE.MeshLambertMaterial({ vertexColors: true })
export const WATER_MAT = new THREE.MeshLambertMaterial({
  vertexColors: true,
  transparent: true,
  opacity: 0.82,
})
export const noRaycast = () => null

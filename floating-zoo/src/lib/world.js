import { EXHIBITS, BRIDGES } from '../data/exhibits'
import { generateIsland, V } from './islandGen'

// Each island bobs gently on its own rhythm.
export const islandY = (isl, t) => isl.pos[1] + Math.sin(t * 0.5 + isl.phase) * 0.3
export const surfaceY = (isl, t) => islandY(isl, t) + V

// Point along a bridge (u from 0 at island A to 1 at island B), with a little rope-bridge sag.
export function bridgePoint(br, u, t, out) {
  const ya = surfaceY(br.A, t), yb = surfaceY(br.B, t)
  out.x = br.pa[0] + (br.pb[0] - br.pa[0]) * u
  out.z = br.pa[1] + (br.pb[1] - br.pa[1]) * u
  out.y = ya + (yb - ya) * u - br.sag * Math.sin(Math.PI * u)
  return out
}

export function buildWorld() {
  const angles = {}
  const bridges = BRIDGES.map(([a, b], id) => {
    const A = EXHIBITS.find((e) => e.id === a), B = EXHIBITS.find((e) => e.id === b)
    const dx = B.pos[0] - A.pos[0], dz = B.pos[2] - A.pos[2]
    ;(angles[a] ||= []).push({ id, angle: Math.atan2(dz, dx) })
    ;(angles[b] ||= []).push({ id, angle: Math.atan2(-dz, -dx) })
    return { id, a, b }
  })

  const islands = EXHIBITS.map((e) => generateIsland(e, angles[e.id] || []))
  const byId = Object.fromEntries(islands.map((i) => [i.id, i]))

  for (const br of bridges) {
    br.A = byId[br.a]
    br.B = byId[br.b]
    const ea = br.A.endpoints.find((p) => p.id === br.id)
    const eb = br.B.endpoints.find((p) => p.id === br.id)
    br.pa = [br.A.pos[0] + ea.x, br.A.pos[2] + ea.z]
    br.pb = [br.B.pos[0] + eb.x, br.B.pos[2] + eb.z]
    br.length = Math.hypot(br.pb[0] - br.pa[0], br.pb[1] - br.pa[1])
    br.sag = br.length * 0.035
  }
  for (const isl of islands) {
    isl.links = bridges
      .filter((br) => br.a === isl.id || br.b === isl.id)
      .map((br) => ({ bridge: br, other: br.a === isl.id ? br.b : br.a, end: isl.endpoints.find((p) => p.id === br.id) }))
  }
  return { islands, bridges, byId }
}

// Tiny shared store for "feed" events so the 3D scene can react to UI buttons.
export const feedStore = {}

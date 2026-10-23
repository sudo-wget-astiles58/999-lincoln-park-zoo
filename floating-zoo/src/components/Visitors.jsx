import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { person } from '../lib/animals'
import { buildGeometry, rng, VOXEL_MAT, noRaycast } from '../lib/voxel'
import { bridgePoint, surfaceY } from '../lib/world'

const SHIRTS = ['#e74c3c', '#3498db', '#f1c40f', '#2ecc71', '#9b59b6', '#ff8a5c', '#1abc9c', '#ffffff']
const PANTS = ['#2c3e50', '#34495e', '#7f8c8d', '#5d4037', '#1f3a5f']
const SKIN = ['#f1c27d', '#e0ac69', '#c68642', '#8d5524', '#ffdbac']
const HAIR = ['#2b1d14', '#5a3a1a', '#d4a64a', '#1a1a1a', '#a0522d', '#c0c0c0']

const VARIANTS = (() => {
  const r = rng(42)
  const p = (a) => a[Math.floor(r() * a.length)]
  return Array.from({ length: 12 }, () =>
    buildGeometry(person({ shirt: p(SHIRTS), pants: p(PANTS), skin: p(SKIN), hair: p(HAIR) }), { size: 0.12, center: true })
  )
})()

const tmp = { x: 0, y: 0, z: 0 }

export function Visitors({ world, count = 40 }) {
  const refs = useRef([])
  const people = useMemo(() => {
    const r = rng(7)
    const linked = world.islands.filter((i) => i.links.length)
    return Array.from({ length: count }, (_, n) => {
      const island = linked[Math.floor(r() * linked.length)]
      return {
        r, island, variant: n % VARIANTS.length,
        lx: island.hub[0] + (r() - 0.5) * 1.5, lz: island.hub[1] + (r() - 0.5) * 1.5,
        phase: 'idle', wait: r() * 8, speed: 0.9 + r() * 0.5, yaw: r() * 6, link: null, u: 0, to: null,
      }
    })
  }, [world, count])

  useFrame(({ clock }, delta) => {
    const t = clock.elapsedTime
    const dt = Math.min(delta, 0.05)
    people.forEach((p, n) => {
      const m = refs.current[n]
      if (!m) return
      let walking = true
      let x, y, z
      if (p.phase === 'idle') {
        walking = false
        p.wait -= dt
        if (p.wait <= 0) {
          p.link = p.island.links[Math.floor(p.r() * p.island.links.length)]
          p.to = [p.link.end.x, p.link.end.z]
          p.phase = 'out'
        }
      } else if (p.phase === 'out' || p.phase === 'in') {
        const dx = p.to[0] - p.lx, dz = p.to[1] - p.lz
        const d = Math.hypot(dx, dz)
        if (d < 0.05) {
          if (p.phase === 'out') {
            p.phase = 'bridge'
            p.u = 0
          } else {
            p.phase = 'idle'
            p.wait = 2 + p.r() * 8
          }
        } else {
          const step = Math.min(d, p.speed * dt)
          p.lx += (dx / d) * step
          p.lz += (dz / d) * step
          p.yaw = Math.atan2(dx, dz)
        }
      }
      if (p.phase === 'bridge') {
        const br = p.link.bridge
        p.u += (p.speed * dt) / br.length
        const forward = br.a === p.island.id
        if (p.u >= 1) {
          p.island = br.A === p.island ? br.B : br.A
          const end = p.island.endpoints.find((e) => e.id === br.id)
          p.lx = end.x
          p.lz = end.z
          p.to = [p.island.hub[0] + (p.r() - 0.5) * 1.8, p.island.hub[1] + (p.r() - 0.5) * 1.8]
          p.phase = 'in'
        } else {
          bridgePoint(br, forward ? p.u : 1 - p.u, t, tmp)
          const dir = forward ? 1 : -1
          p.yaw = Math.atan2((br.pb[0] - br.pa[0]) * dir, (br.pb[1] - br.pa[1]) * dir)
          x = tmp.x; y = tmp.y + 0.06; z = tmp.z
        }
      }
      if (x === undefined) {
        x = p.island.pos[0] + p.lx
        z = p.island.pos[2] + p.lz
        y = surfaceY(p.island, t)
      }
      const bob = walking ? Math.abs(Math.sin(t * 9 + n)) * 0.06 : 0
      m.position.set(x, y + bob, z)
      m.rotation.y = p.yaw
    })
  })

  return people.map((p, n) => (
    <mesh key={n} ref={(el) => (refs.current[n] = el)} geometry={VARIANTS[p.variant]} material={VOXEL_MAT} castShadow raycast={noRaycast} />
  ))
}

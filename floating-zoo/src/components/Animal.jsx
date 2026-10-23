import { useMemo, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import { SPECIES, speciesGeometry, HEART } from '../lib/animals'
import { V } from '../lib/islandGen'
import { rng, hashStr, VOXEL_MAT } from '../lib/voxel'
import { feedStore } from '../lib/world'

const ALLOWED = { land: ['grass'], water: ['water'], both: ['grass', 'water'] }

function cellsFor(island, spec) {
  const types = ALLOWED[spec.habitat] || ['grass']
  let list = types.flatMap((t) => island.walk[t])
  if (spec.preferWater && island.walk.water.length) list = list.concat(island.walk.water, island.walk.water)
  return list.length ? list : island.walk.grass
}

const center = (c) => [(c.i + 0.5) * V, (c.k + 0.5) * V]

export function Animal({ island, speciesKey, index }) {
  const spec = SPECIES[speciesKey]
  const geo = speciesGeometry(speciesKey)
  const group = useRef()
  const heart = useRef()
  const [bubble, setBubble] = useState(false)
  const timer = useRef()

  const st = useMemo(() => {
    const rand = rng(hashStr(island.id + speciesKey) + index * 7919)
    const cells = cellsFor(island, spec)
    const start = cells[Math.floor(rand() * cells.length)] || { i: 0, k: 0 }
    const [x, z] = center(start)
    const allowed = ALLOWED[spec.habitat] || ['grass']
    return {
      rand, cells, allowed, x, z, tx: x, tz: z, y: 0, yaw: rand() * Math.PI * 2, wait: rand() * 3,
      hop: 0, feedSeen: feedStore[island.id] || 0,
      // flyers circle the island
      angle: rand() * Math.PI * 2,
      radius: island.R * V * (0.35 + rand() * 0.4),
      height: spec.height ? spec.height[0] + rand() * (spec.height[1] - spec.height[0]) : 0,
      dir: rand() < 0.5 ? 1 : -1,
    }
  }, [island, speciesKey, index, spec])

  const height = geo.boundingBox.max.y

  const pickTarget = () => {
    for (let tries = 0; tries < 25; tries++) {
      const c = st.cells[Math.floor(st.rand() * st.cells.length)]
      if (!c) return false
      const [cx, cz] = center(c)
      const tx = cx + (st.rand() - 0.5) * V * 0.8, tz = cz + (st.rand() - 0.5) * V * 0.8
      const d = Math.hypot(tx - st.x, tz - st.z)
      if (d > 6 && tries < 20) continue
      // only walk where this animal is allowed (no wandering onto paths or into ponds it can't swim in)
      let ok = true
      const steps = Math.ceil(d / (V * 0.4))
      for (let s = 1; s <= steps && ok; s++) {
        const type = island.cellType(st.x + ((tx - st.x) * s) / steps, st.z + ((tz - st.z) * s) / steps)
        if (!st.allowed.includes(type)) ok = false
      }
      if (ok) { st.tx = tx; st.tz = tz; return true }
    }
    return false
  }

  useFrame(({ clock }, delta) => {
    const g = group.current
    if (!g) return
    const t = clock.elapsedTime
    const dt = Math.min(delta, 0.05)

    if ((feedStore[island.id] || 0) !== st.feedSeen) {
      st.feedSeen = feedStore[island.id]
      st.hop = 2 + st.rand() * 0.8
    }
    let hopY = 0
    if (st.hop > 0) {
      st.hop -= dt
      hopY = Math.abs(Math.sin(st.hop * 7)) * 0.45
    }
    if (heart.current) {
      heart.current.visible = st.hop > 0
      heart.current.position.y = height + 0.4 + (2.8 - Math.max(0, st.hop)) * 0.35
      heart.current.rotation.y = t * 3
    }

    if (spec.habitat === 'air') {
      st.angle += dt * spec.speed * st.dir
      const x = Math.cos(st.angle) * st.radius, z = Math.sin(st.angle) * st.radius
      g.position.set(x, st.height + Math.sin(t * 1.3 + st.radius) * 0.4 + hopY, z)
      g.rotation.set(0, Math.atan2(-Math.sin(st.angle) * st.dir, Math.cos(st.angle) * st.dir), -0.35 * st.dir)
      return
    }

    let moving = false
    if (st.wait > 0) {
      st.wait -= dt
    } else {
      const dx = st.tx - st.x, dz = st.tz - st.z
      const d = Math.hypot(dx, dz)
      if (d < 0.05) {
        const [a, b] = spec.wait || [1, 5]
        st.wait = a + st.rand() * (b - a)
        if (!pickTarget()) st.wait = 1
      } else {
        const step = Math.min(d, spec.speed * dt)
        st.x += (dx / d) * step
        st.z += (dz / d) * step
        moving = true
        const want = Math.atan2(dx, dz)
        let diff = want - st.yaw
        diff = Math.atan2(Math.sin(diff), Math.cos(diff))
        st.yaw += diff * Math.min(1, dt * 6)
      }
    }

    const inWater = island.cellType(st.x, st.z) === 'water'
    const groundY = inWater ? spec.waterY ?? -0.3 : V
    st.y += (groundY - st.y) * Math.min(1, dt * 5)
    const bob = moving && !inWater ? Math.abs(Math.sin(t * spec.speed * 12)) * 0.07 : 0
    g.position.set(st.x, st.y + bob + hopY, st.z)
    g.rotation.set(0, st.yaw + (spec.slither && moving ? Math.sin(t * 6) * 0.25 : 0), spec.waddle && moving ? Math.sin(t * 12) * 0.15 : 0)
  })

  const onClick = (e) => {
    if (e.delta > 4) return
    st.hop = 1.2
    setBubble(true)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setBubble(false), 2500)
  }

  return (
    <group ref={group} rotation-order="YXZ">
      <mesh geometry={geo} material={VOXEL_MAT} castShadow receiveShadow onClick={onClick} />
      <mesh ref={heart} geometry={HEART} material={VOXEL_MAT} visible={false} />
      {bubble && (
        <Html center position={[0, height + 0.6, 0]} zIndexRange={[30, 20]}>
          <div className="bubble">
            {spec.emoji} {spec.name}
          </div>
        </Html>
      )}
    </group>
  )
}

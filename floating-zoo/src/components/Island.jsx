import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import { Animal } from './Animal'
import { V } from '../lib/islandGen'
import { islandY } from '../lib/world'
import { buildGeometry, VOXEL_MAT, WATER_MAT, noRaycast } from '../lib/voxel'
import { locomotive, trainCar } from '../lib/animals'

const TRAIN_GEOS = (() => {
  const opts = { size: 0.12, center: true }
  return [buildGeometry(locomotive(), opts), ...['#f2c94c', '#2d9cdb', '#eb5757'].map((c) => buildGeometry(trainCar(c), opts))]
})()

function Train({ radius }) {
  const refs = useRef([])
  useFrame(({ clock }) => {
    const base = clock.elapsedTime * 0.35
    refs.current.forEach((m, n) => {
      if (!m) return
      const a = base - n * (1.15 / radius)
      m.position.set(Math.cos(a) * radius, V, Math.sin(a) * radius)
      m.rotation.y = Math.atan2(-Math.sin(a), Math.cos(a))
    })
  })
  return TRAIN_GEOS.map((g, n) => (
    <mesh key={n} ref={(el) => (refs.current[n] = el)} geometry={g} material={VOXEL_MAT} castShadow raycast={noRaycast} />
  ))
}

export function Island({ island, selected, hovered, showLabel, onSelect, onHover }) {
  const group = useRef()
  const spin = useRef([])
  const animals = useMemo(
    () => island.animals.flatMap(([key, count]) => Array.from({ length: count }, (_, i) => ({ key, i }))),
    [island]
  )

  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    if (group.current) group.current.position.y = islandY(island, t)
    spin.current.forEach((s) => s && (s.rotation.y = t * 0.6))
  })

  const select = (e) => {
    if (e.delta > 4) return
    onSelect(island.id)
  }

  return (
    <group ref={group} position={island.pos}>
      <mesh geometry={island.landGeo} material={VOXEL_MAT} castShadow receiveShadow raycast={noRaycast} />
      <mesh geometry={island.waterGeo} material={WATER_MAT} receiveShadow raycast={noRaycast} />
      {island.spinners.map((s, n) => (
        <group key={n} ref={(el) => (spin.current[n] = el)} position={[(s.x + 0.5) * V, 0, (s.z + 0.5) * V]}>
          <mesh geometry={s.geo} position={[-V / 2, 0, -V / 2]} material={VOXEL_MAT} castShadow receiveShadow raycast={noRaycast} />
        </group>
      ))}
      {island.track && <Train radius={island.track * V} />}

      {/* invisible click target: cheaper to hit-test than the full voxel mesh */}
      <mesh
        position={[0, 2.5, 0]}
        onClick={select}
        onPointerOver={(e) => { e.stopPropagation(); onHover(island.id) }}
        onPointerOut={() => onHover(null)}
      >
        <cylinderGeometry args={[island.R * V * 1.1, island.R * V * 0.7, 10, 20]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      {animals.map(({ key, i }) => (
        <Animal key={key + i} island={island} speciesKey={key} index={i} />
      ))}

      {showLabel && (
        <Html center position={[0, 8, 0]} zIndexRange={[10, 0]}>
          <button
            className={'island-label' + (selected ? ' selected' : '') + (hovered ? ' hovered' : '')}
            onClick={() => onSelect(island.id)}
          >
            {island.name}
          </button>
        </Html>
      )}
    </group>
  )
}

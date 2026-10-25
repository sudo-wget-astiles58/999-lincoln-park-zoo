import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Stars } from '@react-three/drei'
import * as THREE from 'three'
import { Island } from './Island'
import { Bridges } from './Bridges'
import { Visitors } from './Visitors'
import { VoxelGrid, buildGeometry, rng, noRaycast } from '../lib/voxel'
import { V } from '../lib/islandGen'

export const OVERVIEW = { pos: new THREE.Vector3(105, 115, 165), target: new THREE.Vector3(0, -4, 0) }

// The sky itself is a CSS gradient behind the transparent canvas (see styles.css).
const THEMES = {
  day: { fog: '#d6eeff', hemi: ['#e8f6ff', '#9a8a70', 1.5], sun: ['#fff4dc', 2.1] },
  night: { fog: '#24305e', hemi: ['#6f86c9', '#2a2a3a', 0.9], sun: ['#a9bcff', 0.7] },
}

function Clouds() {
  const clouds = useMemo(() => {
    const r = rng(99)
    return Array.from({ length: 28 }, () => {
      const g = new VoxelGrid()
      const blobs = 3 + Math.floor(r() * 4)
      for (let b = 0; b < blobs; b++) {
        const cx = Math.floor((r() - 0.5) * 10), cz = Math.floor((r() - 0.5) * 5), rad = 2 + r() * 2.5
        for (let x = -5; x <= 5; x++)
          for (let y = 0; y <= 4; y++)
            for (let z = -4; z <= 4; z++)
              if ((x * x) / (rad * rad) + (y * y) / (rad * rad * 0.45) + (z * z) / (rad * rad) <= 1) g.set(cx + x, y, cz + z, r() < 0.15 ? '#eef4fa' : '#ffffff')
      }
      const below = r() < 0.7
      return {
        geo: buildGeometry(g, { size: 2.2, center: true, jitter: 0.02 }),
        x: (r() - 0.5) * 460, z: (r() - 0.5) * 360,
        y: below ? -18 - r() * 30 : 22 + r() * 18,
        speed: 0.8 + r() * 1.5,
      }
    })
  }, [])
  const refs = useRef([])
  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    clouds.forEach((c, n) => {
      const m = refs.current[n]
      if (m) m.position.x = ((c.x + t * c.speed + 230) % 460 + 460) % 460 - 230
    })
  })
  return clouds.map((c, n) => (
    <mesh key={n} ref={(el) => (refs.current[n] = el)} geometry={c.geo} position={[c.x, c.y, c.z]} raycast={noRaycast}>
      <meshLambertMaterial vertexColors transparent opacity={0.92} emissive="#ffffff" emissiveIntensity={0.12} />
    </mesh>
  ))
}

function CameraRig({ world, focus }) {
  const { camera, controls } = useThree()
  const anim = useRef(null)

  useEffect(() => {
    if (!controls) return
    const stop = () => (anim.current = null)
    controls.addEventListener('start', stop)
    return () => controls.removeEventListener('start', stop)
  }, [controls])

  useEffect(() => {
    if (!controls || focus.n === 0) return
    if (!focus.id) {
      anim.current = { pos: OVERVIEW.pos.clone(), target: OVERVIEW.target.clone() }
      return
    }
    const isl = world.byId[focus.id]
    const target = new THREE.Vector3(isl.pos[0], isl.pos[1] + 1.5, isl.pos[2])
    const dist = isl.R * V * 2.4 + 10
    const az = Math.atan2(camera.position.x - controls.target.x, camera.position.z - controls.target.z)
    const pos = new THREE.Vector3(target.x + Math.sin(az) * dist * 0.8, target.y + dist * 0.62, target.z + Math.cos(az) * dist * 0.8)
    anim.current = { pos, target }
  }, [focus, controls, camera, world])

  useFrame((_, dt) => {
    const a = anim.current
    if (!a || !controls) return
    const k = 1 - Math.exp(-Math.min(dt, 0.05) * 2.8)
    camera.position.lerp(a.pos, k)
    controls.target.lerp(a.target, k)
    controls.update()
    if (camera.position.distanceTo(a.pos) < 0.05) anim.current = null
  })
  return null
}

export function Scene({ world, night, labels, selectedId, hoveredId, focus, onSelect, onHover, rev }) {
  const theme = night ? THEMES.night : THEMES.day
  return (
    <>
      <fog attach="fog" args={[theme.fog, 170, 520]} />
      {night && <Stars radius={320} depth={80} count={4000} factor={5} fade speed={0.6} />}
      <hemisphereLight args={theme.hemi} />
      <directionalLight
        position={[80, 140, 60]}
        color={theme.sun[0]}
        intensity={theme.sun[1]}
        castShadow
        shadow-mapSize={[4096, 4096]}
        shadow-camera-left={-130}
        shadow-camera-right={130}
        shadow-camera-top={130}
        shadow-camera-bottom={-130}
        shadow-camera-near={10}
        shadow-camera-far={400}
        shadow-bias={-0.0004}
        shadow-normalBias={0.04}
      />
      <Clouds />
      {world.islands.map((isl) => (
        <Island
          key={isl.id}
          island={isl}
          selected={selectedId === isl.id}
          hovered={hoveredId === isl.id}
          showLabel={labels}
          rev={rev}
          onSelect={onSelect}
          onHover={onHover}
        />
      ))}
      <Bridges bridges={world.bridges} />
      <Visitors world={world} count={44} />
      <OrbitControls
        makeDefault
        enableDamping
        dampingFactor={0.08}
        maxPolarAngle={Math.PI * 0.47}
        minDistance={6}
        maxDistance={340}
        target={OVERVIEW.target}
      />
      <CameraRig world={world} focus={focus} />
    </>
  )
}

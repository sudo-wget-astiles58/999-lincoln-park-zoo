import { useLayoutEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { bridgePoint } from '../lib/world'
import { noRaycast } from '../lib/voxel'

const BOX = new THREE.BoxGeometry(1, 1, 1)
const MAT = new THREE.MeshLambertMaterial()
const UP = new THREE.Vector3(0, 1, 0)
const P = new THREE.Vector3(), A = new THREE.Vector3(), B = new THREE.Vector3(), T = new THREE.Vector3(), Rt = new THREE.Vector3()
const M = new THREE.Matrix4(), Q = new THREE.Quaternion(), S = new THREE.Vector3()

function Bridge({ bridge }) {
  const ref = useRef()
  const layout = useMemo(() => {
    const n = Math.max(4, Math.round(bridge.length / 0.45))
    const posts = []
    for (let i = 0; i < n; i += 3) posts.push(i)
    if (posts[posts.length - 1] !== n - 1) posts.push(n - 1)
    const tops = posts.map(() => [new THREE.Vector3(), new THREE.Vector3()])
    return { n, posts, tops, count: n + posts.length * 2 + (posts.length - 1) * 2 }
  }, [bridge])

  useLayoutEffect(() => {
    const m = ref.current
    const c = new THREE.Color()
    let idx = 0
    for (let i = 0; i < layout.n; i++) m.setColorAt(idx++, c.set(i % 2 ? '#a7784a' : '#b98a58'))
    for (let i = 0; i < layout.posts.length * 2; i++) m.setColorAt(idx++, c.set('#6b4a2e'))
    while (idx < layout.count) m.setColorAt(idx++, c.set('#e6d3a8'))
    m.instanceColor.needsUpdate = true
  }, [layout])

  useFrame(({ clock }) => {
    const m = ref.current
    if (!m) return
    const t = clock.elapsedTime
    const { n, posts, tops } = layout
    let idx = 0
    const orient = (u) => {
      bridgePoint(bridge, u, t, P)
      bridgePoint(bridge, Math.max(0, u - 0.01), t, A)
      bridgePoint(bridge, Math.min(1, u + 0.01), t, B)
      T.subVectors(B, A).normalize()
      M.lookAt(A, B, UP)
      Q.setFromRotationMatrix(M)
      Rt.set(T.z, 0, -T.x).normalize()
    }
    for (let i = 0; i < n; i++) {
      orient((i + 0.5) / n)
      M.compose(P, Q, S.set(1.5, 0.12, 0.42))
      m.setMatrixAt(idx++, M)
    }
    posts.forEach((i, pi) => {
      orient((i + 0.5) / n)
      for (const side of [0, 1]) {
        const sgn = side ? 1 : -1
        A.copy(P).addScaledVector(Rt, sgn * 0.72)
        A.y += 0.3
        M.compose(A, Q, S.set(0.1, 0.62, 0.1))
        m.setMatrixAt(idx++, M)
        tops[pi][side].copy(A).setY(A.y + 0.28)
      }
    })
    for (let pi = 0; pi < posts.length - 1; pi++)
      for (const side of [0, 1]) {
        A.copy(tops[pi][side]); B.copy(tops[pi + 1][side])
        P.addVectors(A, B).multiplyScalar(0.5)
        M.lookAt(A, B, UP)
        Q.setFromRotationMatrix(M)
        M.compose(P, Q, S.set(0.05, 0.05, A.distanceTo(B)))
        m.setMatrixAt(idx++, M)
      }
    m.instanceMatrix.needsUpdate = true
  })

  return <instancedMesh ref={ref} args={[BOX, MAT, layout.count]} castShadow receiveShadow raycast={noRaycast} frustumCulled={false} />
}

export function Bridges({ bridges }) {
  return bridges.map((b) => <Bridge key={b.id} bridge={b} />)
}

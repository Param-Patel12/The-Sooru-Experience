import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export function Clouds({ quality }: { quality: 'high' | 'medium' | 'low' }) {
  const group = useRef<THREE.Group>(null)
  const clouds = useRef<THREE.InstancedMesh>(null)
  const count = quality === 'high' ? 18 : quality === 'medium' ? 12 : 8
  const geometry = useMemo(() => new THREE.IcosahedronGeometry(1, 0), [])
  const material = useMemo(() => new THREE.MeshLambertMaterial({ color: '#eee6d5', transparent: true, opacity: .7, depthWrite: false, flatShading: true }), [])
  const transforms = useMemo(() => Array.from({ length: count }, (_, index) => {
    const cluster = index % 6
    const seed = index + 9
    const random = (value: number) => ((seed * value) % 97) / 97
    return {
      x: (cluster - 2.5) * 4.5 + (random(31) - .5) * 2,
      y: 7.5 + random(17) * 2.3,
      z: -31 + random(43) * 34,
      scale: [1.1 + random(13), .18 + random(7) * .16, .45 + random(23) * .35] as [number, number, number],
    }
  }), [count])

  useEffect(() => {
    if (!clouds.current) return
    const transform = new THREE.Object3D()
    transforms.forEach(({ x, y, z, scale }, index) => {
      transform.position.set(x, y, z)
      transform.scale.set(...scale)
      transform.rotation.set(0, (index % 3) * .24, 0)
      transform.updateMatrix()
      clouds.current?.setMatrixAt(index, transform.matrix)
    })
    clouds.current.instanceMatrix.needsUpdate = true
  }, [transforms])

  useEffect(() => () => { geometry.dispose(); material.dispose() }, [geometry, material])

  useFrame(({ clock }) => {
    if (group.current) group.current.position.x = Math.sin(clock.elapsedTime * .035) * .3
  })

  return <group ref={group}><instancedMesh ref={clouds} args={[geometry, material, count]} frustumCulled={false} /></group>
}

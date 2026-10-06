import { useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import type { HeroMotionState, SceneQuality } from './HeroCamera'

interface ForegroundFoliageProps {
  motionState: { current: HeroMotionState }
  quality: SceneQuality
}

function createFoliage() {
  const shape = new THREE.Shape()
  shape.moveTo(-0.12, -1.7)
  shape.lineTo(-0.3, -0.86)
  shape.lineTo(-1.28, -0.48)
  shape.lineTo(-0.43, -0.4)
  shape.lineTo(-1.55, 0.2)
  shape.lineTo(-0.48, 0.02)
  shape.lineTo(-1.18, 0.83)
  shape.lineTo(-0.26, 0.38)
  shape.lineTo(0.05, 1.28)
  shape.lineTo(0.31, 0.42)
  shape.lineTo(1.2, 1.08)
  shape.lineTo(0.74, 0.26)
  shape.lineTo(1.58, 0.1)
  shape.lineTo(0.68, -0.19)
  shape.lineTo(1.28, -0.72)
  shape.lineTo(0.34, -0.54)
  shape.lineTo(0.14, -1.7)
  shape.closePath()
  return shape
}

function FoliageCluster({
  geometry,
  position,
  mirror,
  motionState,
  quality,
}: {
  geometry: THREE.ShapeGeometry
  position: [number, number, number]
  mirror: number
  motionState: { current: HeroMotionState }
  quality: SceneQuality
}) {
  const group = useRef<THREE.Group>(null)

  useFrame((_, delta) => {
    if (!group.current) return
    const motion = motionState.current
    group.current.position.x = THREE.MathUtils.damp(group.current.position.x, position[0] + motion.pointerX * 0.12 * mirror, 1.4, delta)
    group.current.rotation.z = THREE.MathUtils.damp(group.current.rotation.z, motion.pointerX * 0.008 * mirror, 1.4, delta)
    group.current.position.y = THREE.MathUtils.damp(group.current.position.y, position[1] - motion.progress * 0.08, 1.4, delta)
  })

  return (
    <group ref={group} position={position} scale={[mirror * (quality === 'high' ? 1 : 0.68), quality === 'high' ? 1 : 0.68, 1]}>
      <mesh geometry={geometry}>
        <meshBasicMaterial color="#17271e" transparent opacity={quality === 'high' ? 0.42 : 0.34} depthWrite={false} side={THREE.DoubleSide} />
      </mesh>
    </group>
  )
}

export function ForegroundFoliage({ motionState, quality }: ForegroundFoliageProps) {
  const viewport = useThree((state) => state.viewport)
  const foliage = useMemo(() => new THREE.ShapeGeometry(createFoliage()), [])
  const scale = Math.min(viewport.width / 15, 1.15)
  const x = Math.max(viewport.width * 0.47, 1.15)
  const y = -viewport.height * 0.48

  return (
    <group scale={scale}>
      <FoliageCluster geometry={foliage} position={[-x / scale, y / scale, 2.8]} mirror={1} motionState={motionState} quality={quality} />
      <FoliageCluster geometry={foliage} position={[x / scale, y / scale, 2.8]} mirror={-1} motionState={motionState} quality={quality} />
    </group>
  )
}

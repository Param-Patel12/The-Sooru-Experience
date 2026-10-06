import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { HeroMotionState, SceneQuality } from './HeroCamera'

interface MountainLayersProps {
  motionState: { current: HeroMotionState }
  quality: SceneQuality
}

function ridge(points: [number, number][]) {
  const shape = new THREE.Shape()
  shape.moveTo(points[0][0], points[0][1])
  points.slice(1).forEach(([x, y]) => shape.lineTo(x, y))
  shape.lineTo(points[points.length - 1][0], -6)
  shape.lineTo(points[0][0], -6)
  shape.closePath()
  return shape
}

const farPoints: [number, number][] = [
  [-16, -3.5], [-13, -2.75], [-10, -3.15], [-7.1, -2.45], [-4.5, -3.05],
  [-1.8, -2.2], [1.2, -2.8], [4.1, -2.35], [7.3, -3.1], [10.2, -2.45], [13, -2.9], [16, -3.3],
]

const nearPoints: [number, number][] = [
  [-16, -4.05], [-13, -3.35], [-10.5, -3.75], [-8, -3.15], [-5, -3.8],
  [-2, -3.25], [1, -3.8], [4, -3.2], [7, -3.85], [10, -3.3], [13, -3.7], [16, -4.05],
]

function Mountain({
  shape,
  z,
  color,
  opacity,
  motionState,
  parallax,
}: {
  shape: THREE.Shape
  z: number
  color: string
  opacity: number
  motionState: { current: HeroMotionState }
  parallax: number
}) {
  const group = useRef<THREE.Group>(null)

  useFrame((_, delta) => {
    if (!group.current) return
    const motion = motionState.current
    const targetX = motion.pointerX * parallax - motion.progress * parallax * 0.35
    group.current.position.x = THREE.MathUtils.damp(group.current.position.x, targetX, 1.6, delta)
  })

  return (
    <group ref={group} position={[0, 0, z]}>
      <mesh>
        <shapeGeometry args={[shape]} />
        <meshLambertMaterial color={color} transparent opacity={opacity} depthWrite={false} side={THREE.DoubleSide} />
      </mesh>
    </group>
  )
}

export function MountainLayers({ motionState, quality }: MountainLayersProps) {
  const shapes = useMemo(() => {
    const simplify = (points: [number, number][]) => quality === 'high'
      ? points
      : [...points.filter((_, index) => index % 2 === 0), points[points.length - 1]]
    return { far: ridge(simplify(farPoints)), near: ridge(simplify(nearPoints)) }
  }, [quality])

  return (
    <group>
      <Mountain shape={shapes.far} z={-5.6} color="#829080" opacity={quality === 'high' ? 0.19 : 0.14} motionState={motionState} parallax={0.22} />
      <Mountain shape={shapes.near} z={-3.8} color="#52634f" opacity={quality === 'high' ? 0.15 : 0.11} motionState={motionState} parallax={0.38} />
    </group>
  )
}

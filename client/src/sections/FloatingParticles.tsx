import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { HeroMotionState, SceneQuality } from './HeroCamera'

interface FloatingParticlesProps {
  motionState: { current: HeroMotionState }
  quality: SceneQuality
}

export function FloatingParticles({ motionState, quality }: FloatingParticlesProps) {
  const points = useRef<THREE.Points>(null)
  const count = quality === 'high' ? 44 : quality === 'medium' ? 26 : 12
  const spread = quality === 'high' ? 22 : quality === 'medium' ? 14 : 7
  const positions = useMemo(() => {
    const data = new Float32Array(count * 3)
    for (let index = 0; index < count; index += 1) {
      const seed = index + 1
      data[index * 3] = ((seed * 37) % 100) / 100 * spread - spread / 2
      data[index * 3 + 1] = ((seed * 61) % 100) / 100 * 7 - 4.2
      data[index * 3 + 2] = 0.15 - ((seed * 13) % 100) / 100 * 1.8
    }
    return data
  }, [count, spread])

  useFrame((_, delta) => {
    if (!points.current) return
    const position = points.current.geometry.attributes.position as THREE.BufferAttribute
    const data = position.array as Float32Array
    for (let index = 0; index < data.length; index += 3) {
      data[index + 1] += delta * (quality === 'high' ? 0.035 : quality === 'medium' ? 0.028 : 0.02)
      if (data[index + 1] > 3.15) data[index + 1] = -4.2
    }
    position.needsUpdate = true
    points.current.position.x = motionState.current.pointerX * -0.08
  })

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#f4ede0"
        size={quality === 'high' ? 0.023 : quality === 'medium' ? 0.02 : 0.017}
        sizeAttenuation
        transparent
        opacity={quality === 'high' ? 0.42 : quality === 'medium' ? 0.34 : 0.28}
        depthWrite={false}
      />
    </points>
  )
}

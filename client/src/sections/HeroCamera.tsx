import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

export interface HeroMotionState {
  progress: number
  pointerX: number
  pointerY: number
}

export type SceneQuality = 'high' | 'medium' | 'low'

interface HeroCameraProps {
  motionState: { current: HeroMotionState }
  quality: SceneQuality
}

export function HeroCamera({ motionState, quality }: HeroCameraProps) {
  const { camera } = useThree()
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)

  useEffect(() => {
    if (!(camera instanceof THREE.PerspectiveCamera)) return
    cameraRef.current = camera
    return () => { cameraRef.current = null }
  }, [camera])

  useFrame((_, delta) => {
    const activeCamera = cameraRef.current
    if (!activeCamera) return

    const motion = motionState.current
    const travel = THREE.MathUtils.smoothstep(motion.progress, 0.2, 1)
    const pointerAmount = quality === 'high' ? 1 : quality === 'medium' ? 0.65 : 0.4
    const damping = 2.2

    activeCamera.position.x = THREE.MathUtils.damp(activeCamera.position.x, motion.pointerX * 0.12 * pointerAmount, damping, delta)
    activeCamera.position.y = THREE.MathUtils.damp(activeCamera.position.y, 0.15 + motion.pointerY * 0.08 * pointerAmount, damping, delta)
    const nearPosition = quality === 'high' ? 12.9 : quality === 'medium' ? 13.35 : 13.75
    activeCamera.position.z = THREE.MathUtils.damp(activeCamera.position.z, THREE.MathUtils.lerp(15, nearPosition, travel), damping, delta)
    activeCamera.lookAt(0, -0.15, -3.2)
    activeCamera.rotation.y += motion.pointerX * 0.012 * pointerAmount
    activeCamera.rotation.x += motion.pointerY * 0.007 * pointerAmount
  })

  return null
}

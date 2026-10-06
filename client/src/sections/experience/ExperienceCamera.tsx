import { useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

export interface ExperienceMotionState {
  progress: number
}

export function ExperienceCamera({ motionState, quality }: { motionState: { current: ExperienceMotionState }; quality: 'high' | 'medium' | 'low' }) {
  const { camera } = useThree()
  const path = useMemo(() => new THREE.CatmullRomCurve3([
    new THREE.Vector3(-.4, 11.5, 19),
    new THREE.Vector3(.2, 7.2, 11),
    new THREE.Vector3(-.3, 4.2, 2),
    new THREE.Vector3(.3, 3.4, -9),
    new THREE.Vector3(0, 5.1, -21),
  ]), [])
  const lookPath = useMemo(() => new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, -.8, -8),
    new THREE.Vector3(0, -.4, -8),
    new THREE.Vector3(0, .4, -15),
    new THREE.Vector3(0, 2.8, -31),
    new THREE.Vector3(0, 4.7, -39),
  ]), [])
  const scratch = useMemo(() => ({ position: new THREE.Vector3(), look: new THREE.Vector3() }), [])

  useFrame((_, delta) => {
    const progress = THREE.MathUtils.clamp(motionState.current.progress, 0, 1)
    path.getPointAt(progress, scratch.position)
    lookPath.getPointAt(progress, scratch.look)
    const smoothing = quality === 'high' ? 2.1 : quality === 'medium' ? 1.7 : 1.35
    camera.position.lerp(scratch.position, 1 - Math.exp(-smoothing * delta))
    camera.lookAt(scratch.look)
  })

  return null
}

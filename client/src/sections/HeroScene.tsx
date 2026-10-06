import { useEffect, useMemo, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import * as THREE from 'three'
import { Atmosphere } from './Atmosphere'
import { FloatingParticles } from './FloatingParticles'
import { ForegroundFoliage } from './ForegroundFoliage'
import { HeroCamera, type HeroMotionState, type SceneQuality } from './HeroCamera'
import { MountainLayers } from './MountainLayers'

interface HeroSceneProps {
  motionState: { current: HeroMotionState }
  quality: SceneQuality
}

function useSceneInView(element: HTMLDivElement | null) {
  const [inView, setInView] = useState(false)

  useEffect(() => {
    if (!element) return
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { rootMargin: '120px' })
    observer.observe(element)
    return () => observer.disconnect()
  }, [element])

  return inView
}

function SceneFallback() {
  return <div className="hero__atmosphere-fallback" />
}

export default function HeroScene({ motionState, quality }: HeroSceneProps) {
  const [element, setElement] = useState<HTMLDivElement | null>(null)
  const inView = useSceneInView(element)
  const camera = useMemo(() => {
    const perspectiveCamera = new THREE.PerspectiveCamera(38, 1, 0.1, 90)
    perspectiveCamera.position.set(0, 0.15, 15)
    return perspectiveCamera
  }, [])

  return (
    <div className="hero__atmosphere" aria-hidden="true" ref={setElement}>
      <Canvas
        camera={camera}
        dpr={quality === 'high' ? [1, 1.2] : quality === 'medium' ? [1, 1.1] : [1, 1]}
        frameloop={inView ? 'always' : 'demand'}
        gl={{ alpha: true, antialias: false, depth: true, powerPreference: 'low-power', stencil: false }}
        fallback={<SceneFallback />}
      >
        <ambientLight intensity={0.82} color="#e9e4d7" />
        <directionalLight position={[-3.5, 5, 7]} intensity={0.62} color="#e6d2aa" />
        <fogExp2 attach="fog" args={['#9c9a88', 0.012]} />
        <HeroCamera motionState={motionState} quality={quality} />
        <MountainLayers motionState={motionState} quality={quality} />
        <Atmosphere motionState={motionState} />
        <FloatingParticles motionState={motionState} quality={quality} />
        <ForegroundFoliage motionState={motionState} quality={quality} />
      </Canvas>
    </div>
  )
}

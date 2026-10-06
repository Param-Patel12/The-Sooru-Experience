import { useEffect, useMemo, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import * as THREE from 'three'
import { Atmosphere } from './Atmosphere'
import { Clouds } from './Clouds'
import { CoffeePlants } from './CoffeePlants'
import { ExperienceCamera, type ExperienceMotionState } from './ExperienceCamera'
import { MountainRange } from './MountainRange'
import { Terrain } from './Terrain'
import { Trees } from './Trees'

function useSceneInView(element: HTMLDivElement | null) {
  const [inView, setInView] = useState(true)
  useEffect(() => {
    if (!element) return
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { rootMargin: '100px' })
    observer.observe(element)
    return () => observer.disconnect()
  }, [element])
  return inView
}

export default function ExperienceScene({ motionState, quality }: {
  motionState: { current: ExperienceMotionState }
  quality: 'high' | 'medium' | 'low'
}) {
  const [element, setElement] = useState<HTMLDivElement | null>(null)
  const inView = useSceneInView(element)
  const camera = useMemo(() => new THREE.PerspectiveCamera(44, 1, .1, 150), [])

  return (
    <div className="experience-scene" aria-hidden="true" ref={setElement}>
      <Canvas
        camera={camera}
        dpr={quality === 'high' ? [1, 1.2] : quality === 'medium' ? [1, 1.1] : [1, 1]}
        frameloop={inView ? 'always' : 'demand'}
        gl={{ alpha: false, antialias: false, depth: true, powerPreference: 'low-power', stencil: false }}
        fallback={<div className="experience-scene__unsupported" />}
      >
        <color attach="background" args={['#cbc8ac']} />
        <fogExp2 attach="fog" args={['#c5cbb1', .015]} />
        <ambientLight intensity={1.15} color="#dce0c9" />
        <directionalLight position={[8, 14, 4]} intensity={2.05} color="#f2d39c" />
        <hemisphereLight args={['#e7dfc6', '#394e37', .65]} />
        <mesh position={[12, 10, -34]}>
          <icosahedronGeometry args={[.72, 1]} />
          <meshBasicMaterial color="#efd39a" />
        </mesh>
        <ExperienceCamera motionState={motionState} quality={quality} />
        <Terrain />
        <MountainRange />
        <CoffeePlants quality={quality} />
        <Trees quality={quality} />
        <Clouds quality={quality} />
        <Atmosphere quality={quality} />
      </Canvas>
    </div>
  )
}

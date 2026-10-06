import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function makeRidge(points: [number, number][]) {
  const shape = new THREE.Shape()
  shape.moveTo(points[0][0], points[0][1])
  points.slice(1).forEach(([x, y]) => shape.lineTo(x, y))
  shape.lineTo(points[points.length - 1][0], -4)
  shape.lineTo(points[0][0], -4)
  shape.closePath()
  return shape
}

const farRidge = makeRidge([
  [-9, 0.65], [-7.3, 1.05], [-6.1, 1.42], [-4.7, 1.08], [-3.2, 1.72],
  [-1.7, 1.2], [0.1, 1.55], [1.65, 1.05], [3.1, 1.48], [4.7, .94], [6.1, 1.28], [9, .78],
])
const nearRidge = makeRidge([
  [-9, .05], [-7.5, .52], [-6.15, .25], [-4.8, .92], [-3.7, .42], [-2.25, 1.1],
  [-.7, .54], [.7, .88], [2.4, .3], [4, .83], [5.5, .38], [7.1, .66], [9, .12],
])

function Mist() {
  const mesh = useRef<THREE.Mesh>(null)
  const material = useMemo(() => new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    uniforms: { uTime: { value: 0 } },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float uTime;
      varying vec2 vUv;
      void main() {
        float drift = sin(vUv.x * 9.0 + uTime * 0.11) * 0.035
          + sin(vUv.x * 16.0 - uTime * 0.07) * 0.018;
        float height = smoothstep(0.03, 0.88, vUv.y + drift)
          * (1.0 - smoothstep(0.82, 1.0, vUv.y));
        float edge = smoothstep(0.0, 0.18, vUv.x) * (1.0 - smoothstep(0.8, 1.0, vUv.x));
        gl_FragColor = vec4(0.91, 0.88, 0.79, height * edge * 0.095);
      }
    `,
  }), [])

  useFrame((_, delta) => {
    const shader = mesh.current?.material
    if (shader instanceof THREE.ShaderMaterial) shader.uniforms.uTime.value += delta
  })
  return (
    <mesh ref={mesh} position={[0, -.95, -.3]} material={material}>
      <planeGeometry args={[18, 2.7, 1, 1]} />
    </mesh>
  )
}

function Particles() {
  const points = useRef<THREE.Points>(null)
  const positions = useMemo(() => {
    const data = new Float32Array(42 * 3)
    for (let index = 0; index < 42; index += 1) {
      const seed = index + 1
      data[index * 3] = ((seed * 37) % 100) / 100 * 13 - 8
      data[index * 3 + 1] = ((seed * 61) % 100) / 100 * 6 - 2.5
      data[index * 3 + 2] = -0.1
    }
    return data
  }, [])

  useFrame((_, delta) => {
    if (!points.current) return
    const position = points.current.geometry.attributes.position as THREE.BufferAttribute
    const data = position.array as Float32Array
    for (let index = 0; index < data.length; index += 3) {
      data[index + 1] += delta * 0.035
      if (data[index + 1] > 3.3) data[index + 1] = -2.7
    }
    position.needsUpdate = true
  })

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#f4ede0" size={0.024} sizeAttenuation transparent opacity={0.38} depthWrite={false} />
    </points>
  )
}

function MountainLayers() {
  return (
    <group>
      <mesh position={[0, 0, -1]}>
        <shapeGeometry args={[farRidge]} />
        <meshBasicMaterial color="#445447" transparent opacity={0.25} depthWrite={false} />
      </mesh>
      <mesh position={[0, -.13, -.7]}>
        <shapeGeometry args={[nearRidge]} />
        <meshBasicMaterial color="#34493b" transparent opacity={0.26} depthWrite={false} />
      </mesh>
      <Mist />
      <Particles />
    </group>
  )
}

function HeroAtmosphere() {
  const layer = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(true)

  useEffect(() => {
    const element = layer.current
    if (!element) return
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { rootMargin: '100px' })
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return (
    <div className="hero__atmosphere" aria-hidden="true" ref={layer}>
      <Canvas
        camera={{ position: [0, 0, 9], fov: 38 }}
        dpr={[1, 1.25]}
        frameloop={inView ? 'always' : 'demand'}
        gl={{ alpha: true, antialias: false, powerPreference: 'low-power' }}
        fallback={<div className="hero__atmosphere-fallback" />}
      >
        <MountainLayers />
      </Canvas>
    </div>
  )
}

export default HeroAtmosphere

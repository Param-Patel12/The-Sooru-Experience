import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export function Atmosphere({ quality }: { quality: 'high' | 'medium' | 'low' }) {
  const mist = useRef<THREE.Group>(null)
  const mistSurface = useRef<THREE.Mesh>(null)
  const motes = useRef<THREE.Points>(null)
  const count = quality === 'high' ? 72 : quality === 'medium' ? 42 : 22
  const positions = useMemo(() => {
    const values = new Float32Array(count * 3)
    for (let index = 0; index < count; index += 1) {
      const seed = index + 3
      values[index * 3] = ((seed * 37) % 100) / 100 * 28 - 14
      values[index * 3 + 1] = ((seed * 61) % 100) / 100 * 7
      values[index * 3 + 2] = ((seed * 17) % 100) / 100 * 39 - 25
    }
    return values
  }, [count])
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
        float wave = sin(vUv.x * 16.0 + uTime * 0.08) * 0.045 + sin(vUv.x * 29.0 - uTime * 0.05) * 0.02;
        float veil = exp(-pow((vUv.y - 0.48 - wave) * 4.4, 2.0));
        float broken = 0.58 + 0.22 * sin(vUv.x * 53.0 + uTime * 0.03) + 0.14 * sin(vUv.x * 91.0 - uTime * 0.02);
        float edge = smoothstep(0.0, 0.13, vUv.x) * (1.0 - smoothstep(0.82, 1.0, vUv.x));
        gl_FragColor = vec4(0.82, 0.85, 0.76, veil * broken * edge * 0.22);
      }
    `,
  }), [])

  useEffect(() => () => material.dispose(), [material])

  useFrame(({ clock }, delta) => {
    const activeMaterial = mistSurface.current?.material
    if (activeMaterial instanceof THREE.ShaderMaterial) activeMaterial.uniforms.uTime.value = clock.elapsedTime
    if (mist.current) mist.current.position.x = Math.sin(clock.elapsedTime * .04) * .55
    const mesh = motes.current
    if (!mesh) return
    const attribute = mesh.geometry.attributes.position as THREE.BufferAttribute
    const values = attribute.array as Float32Array
    for (let index = 1; index < values.length; index += 3) {
      values[index] += delta * (quality === 'high' ? .035 : quality === 'medium' ? .028 : .022)
      if (values[index] > 7) values[index] = 0
    }
    attribute.needsUpdate = true
  })

  return (
    <>
      <group ref={mist}>
        <mesh ref={mistSurface} position={[0, .05, -5]} material={material}><planeGeometry args={[38, 4]} /></mesh>
        <mesh position={[0, .5, -17]} material={material}><planeGeometry args={[42, 4.5]} /></mesh>
        <mesh position={[0, 1, -29]} material={material}><planeGeometry args={[46, 5]} /></mesh>
      </group>
      <points ref={motes} position={[0, 0, -3]}>
        <bufferGeometry><bufferAttribute attach="attributes-position" args={[positions, 3]} /></bufferGeometry>
      <pointsMaterial color="#f4e6c7" size={quality === 'high' ? .045 : quality === 'medium' ? .038 : .032} sizeAttenuation transparent opacity={.34} depthWrite={false} />
      </points>
    </>
  )
}

import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { HeroMotionState } from './HeroCamera'

interface AtmosphereProps {
  motionState: { current: HeroMotionState }
}

export function Atmosphere({ motionState }: AtmosphereProps) {
  const mesh = useRef<THREE.Mesh>(null)
  const material = useMemo(() => new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    toneMapped: false,
    uniforms: {
      uTime: { value: 0 },
      uProgress: { value: 0 },
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float uTime;
      uniform float uProgress;
      varying vec2 vUv;
      void main() {
        float drift = sin(vUv.x * 10.0 + uTime * 0.035) * 0.025
          + sin(vUv.x * 17.0 - uTime * 0.024) * 0.012;
        float horizonMist = 1.0 - smoothstep(0.02, 0.58, vUv.y + drift);
        float horizonFade = smoothstep(0.0, 0.16, vUv.x) * (1.0 - smoothstep(0.82, 1.0, vUv.x));
        float mistAlpha = horizonMist * horizonFade * (0.035 + smoothstep(0.34, 0.78, uProgress) * 0.052);

        float rayPhase = (vUv.x - (0.78 - (0.88 - vUv.y) * 0.3)) * 48.0;
        float rays = pow(max(0.0, cos(rayPhase)), 22.0);
        float rayMask = smoothstep(0.5, 0.98, vUv.y) * (1.0 - smoothstep(0.82, 1.0, vUv.x));
        float rayAlpha = rays * rayMask * (0.008 + smoothstep(0.42, 0.9, uProgress) * 0.012);
        float alpha = clamp(mistAlpha + rayAlpha, 0.0, 0.075);

        gl_FragColor = vec4(0.94, 0.9, 0.81, alpha);
      }
    `,
  }), [])

  useFrame((_, delta) => {
    if (!(mesh.current?.material instanceof THREE.ShaderMaterial)) return
    const uniforms = mesh.current.material.uniforms
    uniforms.uTime.value += delta
    uniforms.uProgress.value = motionState.current.progress
  })

  return (
    <mesh ref={mesh} position={[0, 0.7, -2.65]} material={material}>
      <planeGeometry args={[28, 14]} />
    </mesh>
  )
}

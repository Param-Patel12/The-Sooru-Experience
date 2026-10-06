import { useMemo } from 'react'
import * as THREE from 'three'

function buildTerrain() {
  const width = 58
  const depth = 78
  const segmentsX = 34
  const segmentsZ = 44
  const centerZ = -8
  const positions = new Float32Array((segmentsX + 1) * (segmentsZ + 1) * 3)
  const colors = new Float32Array(positions.length)
  const indices: number[] = []
  const low = new THREE.Color('#314b39')
  const high = new THREE.Color('#82906b')
  const color = new THREE.Color()

  for (let row = 0; row <= segmentsZ; row += 1) {
    for (let column = 0; column <= segmentsX; column += 1) {
      const index = row * (segmentsX + 1) + column
      const x = (column / segmentsX - .5) * width
      const z = (row / segmentsZ - .5) * depth
      const worldZ = z + centerZ
      const y = -1.25
        + Math.sin(x * .19 + worldZ * .08) * .52
        + Math.cos(worldZ * .24 - x * .07) * .38
        + Math.sin((x + worldZ) * .13) * .24
      positions[index * 3] = x
      positions[index * 3 + 1] = y
      positions[index * 3 + 2] = z
      color.copy(low).lerp(high, THREE.MathUtils.clamp((y + 2.1) * .48, 0, 1))
      colors[index * 3] = color.r
      colors[index * 3 + 1] = color.g
      colors[index * 3 + 2] = color.b
      if (column < segmentsX && row < segmentsZ) {
        const next = index + segmentsX + 1
        indices.push(index, next, index + 1, next, next + 1, index + 1)
      }
    }
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  geometry.setIndex(indices)
  geometry.computeVertexNormals()
  return geometry
}

export function Terrain() {
  const geometry = useMemo(() => buildTerrain(), [])
  return (
    <mesh geometry={geometry} position={[0, 0, -8]} receiveShadow={false}>
      <meshStandardMaterial vertexColors flatShading roughness={1} metalness={0} />
    </mesh>
  )
}

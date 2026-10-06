import { useMemo } from 'react'
import * as THREE from 'three'

function makeRidge(points: [number, number][]) {
  const shape = new THREE.Shape()
  shape.moveTo(-36, -12)
  shape.lineTo(points[0][0], points[0][1])
  points.slice(1).forEach(([x, y]) => shape.lineTo(x, y))
  shape.lineTo(36, -12)
  shape.closePath()
  return new THREE.ShapeGeometry(shape)
}

const ridges: Array<{ points: [number, number][]; position: [number, number, number]; color: string }> = [
  {
    points: [[-36, 3], [-29, 6], [-23, 4], [-16, 10], [-9, 5], [-1, 12], [7, 6], [15, 10], [23, 4], [30, 7], [36, 3]],
    position: [0, 2, -43],
    color: '#a0a78d',
  },
  {
    points: [[-36, 1], [-27, 4], [-20, 2], [-12, 7], [-4, 3], [5, 8], [14, 3], [22, 6], [30, 2], [36, 4]],
    position: [0, 1, -36],
    color: '#77876d',
  },
  {
    points: [[-36, 0], [-29, 3], [-21, 1], [-12, 5], [-3, 2], [5, 5], [14, 1], [24, 4], [32, 1], [36, 2]],
    position: [0, .3, -30],
    color: '#566e54',
  },
]

export function MountainRange() {
  const geometries = useMemo(() => ridges.map(({ points }) => makeRidge(points)), [])
  return (
    <group>
      {ridges.map((ridge, index) => (
        <mesh key={ridge.color} geometry={geometries[index]} position={ridge.position}>
          <meshLambertMaterial color={ridge.color} flatShading side={THREE.DoubleSide} />
        </mesh>
      ))}
    </group>
  )
}

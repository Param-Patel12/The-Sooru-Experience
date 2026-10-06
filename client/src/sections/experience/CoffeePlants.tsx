import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { scatterPlants } from './landscape'

export function CoffeePlants({ quality }: { quality: 'high' | 'medium' | 'low' }) {
  const foliage = useRef<THREE.InstancedMesh>(null)
  const stems = useRef<THREE.InstancedMesh>(null)
  const count = quality === 'high' ? 148 : quality === 'medium' ? 92 : 58
  const plants = useMemo(() => scatterPlants(count, 1337, 2.5, 34), [count])
  const foliageGeometry = useMemo(() => new THREE.IcosahedronGeometry(.6, 0), [])
  const stemGeometry = useMemo(() => new THREE.CylinderGeometry(.07, .1, 1, 5), [])
  const foliageMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: '#6b8255', flatShading: true, roughness: 1 }), [])
  const stemMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: '#584a34', flatShading: true, roughness: 1 }), [])

  useEffect(() => {
    if (!foliage.current || !stems.current) return
    const transform = new THREE.Object3D()
    const tint = new THREE.Color()
    plants.forEach((plant, index) => {
      transform.position.set(plant.x, plant.y + plant.scale * .53, plant.z)
      transform.rotation.set(0, plant.rotation, 0)
      transform.scale.set(plant.scale, plant.scale * .88, plant.scale)
      transform.updateMatrix()
      foliage.current?.setMatrixAt(index, transform.matrix)
      tint.setHSL(.27 + (index % 5) * .008, .25, .34 + (index % 4) * .025)
      foliage.current?.setColorAt(index, tint)

      transform.position.set(plant.x, plant.y + plant.scale * .2, plant.z)
      transform.rotation.set(0, plant.rotation, 0)
      transform.scale.set(plant.scale * .65, plant.scale * .42, plant.scale * .65)
      transform.updateMatrix()
      stems.current?.setMatrixAt(index, transform.matrix)
    })
    foliage.current.instanceMatrix.needsUpdate = true
    stems.current.instanceMatrix.needsUpdate = true
    if (foliage.current.instanceColor) foliage.current.instanceColor.needsUpdate = true
  }, [plants])

  useEffect(() => () => {
    foliageGeometry.dispose()
    stemGeometry.dispose()
    foliageMaterial.dispose()
    stemMaterial.dispose()
  }, [foliageGeometry, stemGeometry, foliageMaterial, stemMaterial])

  return (
    <group>
      <instancedMesh ref={foliage} args={[foliageGeometry, foliageMaterial, count]} frustumCulled={false} />
      <instancedMesh ref={stems} args={[stemGeometry, stemMaterial, count]} frustumCulled={false} />
    </group>
  )
}

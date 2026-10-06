import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { scatterPlants } from './landscape'

export function Trees({ quality }: { quality: 'high' | 'medium' | 'low' }) {
  const canopies = useRef<THREE.InstancedMesh>(null)
  const trunks = useRef<THREE.InstancedMesh>(null)
  const count = quality === 'high' ? 34 : quality === 'medium' ? 23 : 15
  const trees = useMemo(() => scatterPlants(count, 916, 7.5, 39), [count])
  const canopyGeometry = useMemo(() => new THREE.IcosahedronGeometry(1, 0), [])
  const trunkGeometry = useMemo(() => new THREE.CylinderGeometry(.11, .18, 1, 5), [])
  const canopyMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: '#456447', flatShading: true, roughness: 1 }), [])
  const trunkMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: '#55452f', flatShading: true, roughness: 1 }), [])

  useEffect(() => {
    if (!canopies.current || !trunks.current) return
    const transform = new THREE.Object3D()
    const tint = new THREE.Color()
    trees.forEach((tree, index) => {
      const size = tree.scale * 1.8
      transform.position.set(tree.x, tree.y + size * .94, tree.z)
      transform.rotation.set(0, tree.rotation, 0)
      transform.scale.set(size * .72, size, size * .72)
      transform.updateMatrix()
      canopies.current?.setMatrixAt(index, transform.matrix)
      tint.setHSL(.29 + (index % 4) * .009, .24, .3 + (index % 3) * .035)
      canopies.current?.setColorAt(index, tint)

      transform.position.set(tree.x, tree.y + size * .3, tree.z)
      transform.rotation.set(0, tree.rotation, 0)
      transform.scale.set(size * .22, size * .62, size * .22)
      transform.updateMatrix()
      trunks.current?.setMatrixAt(index, transform.matrix)
    })
    canopies.current.instanceMatrix.needsUpdate = true
    trunks.current.instanceMatrix.needsUpdate = true
    if (canopies.current.instanceColor) canopies.current.instanceColor.needsUpdate = true
  }, [trees])

  useEffect(() => () => {
    canopyGeometry.dispose()
    trunkGeometry.dispose()
    canopyMaterial.dispose()
    trunkMaterial.dispose()
  }, [canopyGeometry, trunkGeometry, canopyMaterial, trunkMaterial])

  return (
    <group>
      <instancedMesh ref={canopies} args={[canopyGeometry, canopyMaterial, count]} frustumCulled={false} />
      <instancedMesh ref={trunks} args={[trunkGeometry, trunkMaterial, count]} frustumCulled={false} />
    </group>
  )
}

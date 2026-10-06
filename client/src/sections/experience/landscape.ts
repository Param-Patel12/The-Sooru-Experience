export function terrainHeightAt(x: number, z: number) {
  return -1.25
    + Math.sin(x * .19 + z * .08) * .52
    + Math.cos(z * .24 - x * .07) * .38
    + Math.sin((x + z) * .13) * .24
}

export interface PlantPoint {
  x: number
  y: number
  z: number
  scale: number
  rotation: number
}

export function scatterPlants(count: number, seed: number, edge: number, spanZ: number): PlantPoint[] {
  let state = seed
  const random = () => {
    state = (state * 1664525 + 1013904223) >>> 0
    return state / 4294967296
  }

  return Array.from({ length: count }, (_, index) => {
    const side = index % 2 === 0 ? -1 : 1
    const x = side * (edge + random() * 8.5)
    const z = 7 - random() * spanZ
    return { x, y: terrainHeightAt(x, z), z, scale: .65 + random() * .75, rotation: random() * Math.PI * 2 }
  })
}

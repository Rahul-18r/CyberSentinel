import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'

export function CyberBackground() {
  const meshRef = useRef()
  const gridRef = useRef()
  
  // Create hexagonal grid
  const gridGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry()
    const vertices = []
    const size = 50
    const hexRadius = 2

    for (let i = -size; i < size; i += 3) {
      for (let j = -size; j < size; j += 3) {
        for (let k = 0; k < 6; k++) {
          const angle = (k / 6) * Math.PI * 2
          const nextAngle = ((k + 1) / 6) * Math.PI * 2
          
          vertices.push(i + Math.cos(angle) * hexRadius)
          vertices.push(0)
          vertices.push(j + Math.sin(angle) * hexRadius)
          
          vertices.push(i + Math.cos(nextAngle) * hexRadius)
          vertices.push(0)
          vertices.push(j + Math.sin(nextAngle) * hexRadius)
          
          vertices.push(i, 0, j)
        }
      }
    }
    
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))
    return geometry
  }, [])

  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    meshRef.current.rotation.y = time * 0.05
    gridRef.current.material.opacity = 0.1 + Math.sin(time) * 0.05
  })

  return (
    <>
      <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[100, 100, 50, 50]} />
        <meshBasicMaterial 
          color="#000000" 
          wireframe 
          transparent
          opacity={0.1}
        />
      </mesh>
      <lineSegments ref={gridRef}>
        {gridGeometry && (
          <>
            <primitive object={gridGeometry} />
            <lineBasicMaterial
              color="#ff6b00"
              transparent
              opacity={0.1}
              blending={THREE.AdditiveBlending}
            />
          </>
        )}
      </lineSegments>
    </>
  )
}
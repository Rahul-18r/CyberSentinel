import React, { Suspense } from 'react';
import { Text3D, Center } from '@react-three/drei';

export function CyberTitle3D() {
  const textRef = React.useRef();

  return (
    <Suspense fallback={null}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[0, 5, 5]} intensity={1} />
      <Center>
        <Text3D
          ref={textRef}
          font="/fonts/helvetiker_bold.typeface.json"
          size={1.5}
          height={0.2}
          curveSegments={12}
          bevelEnabled
          bevelThickness={0.02}
          bevelSize={0.02}
        >
          CYBERSECURITY SUITE
          <meshStandardMaterial 
            color="#00a8ff"
            metalness={0.8}
            roughness={0.2}
          />
        </Text3D>
      </Center>
    </Suspense>
  );
}
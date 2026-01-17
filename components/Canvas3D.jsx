'use client';

import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Sphere, PerspectiveCamera } from '@react-three/drei';

const AnimatedSphere = () => {
  return (
    <Float speed={2} rotationIntensity={1.5} floatIntensity={2}>
      <Sphere args={[1, 100, 200]} scale={2.4}>
        <MeshDistortMaterial
          color="#4338ca"
          attach="material"
          distort={0.5}
          speed={2}
          roughness={0.2}
          metalness={0.8}
        />
      </Sphere>
    </Float>
  );
};

const Canvas3D = () => {
  return (
    <Canvas>
      <PerspectiveCamera makeDefault position={[0, 0, 5]} />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} />
      <Suspense fallback={null}>
        <AnimatedSphere />
      </Suspense>
    </Canvas>
  );
};

export default Canvas3D;

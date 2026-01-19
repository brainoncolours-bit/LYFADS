'use client';

import React, { useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Points, PointMaterial, Environment, Float } from '@react-three/drei';
import { useState, useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { motion } from 'framer-motion';

// Particle Field Component
const ParticleField = () => {
  const ref = useRef();
  const particleCount = 2000;
  
  const particles = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return positions;
  }, []);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.x = -state.clock.elapsedTime / 10;
      ref.current.rotation.y = -state.clock.elapsedTime / 15;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      <Points ref={ref} positions={particles} stride={3} frustumCulled={false}>
        <PointMaterial transparent color="#7a5af5" size={0.005} sizeAttenuation={true} depthWrite={false} />
      </Points>
    </group>
  );
};

// Floating 3D Object
const FloatingObject = ({ position, color, speed, geometryType = 'icosahedron' }) => {
  const meshRef = useRef();
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * speed) * 0.5;
      meshRef.current.rotation.y = Math.cos(state.clock.elapsedTime * speed) * 0.5;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5) * 0.3;
      meshRef.current.position.x = position[0] + Math.cos(state.clock.elapsedTime * 0.3) * 0.2;
    }
  });

  let geometry;
  switch (geometryType) {
    case 'torus':
      geometry = <torusGeometry args={[0.5, 0.15, 16, 100]} />;
      break;
    case 'box':
      geometry = <boxGeometry args={[0.8, 0.8, 0.8]} />;
      break;
    case 'sphere':
      geometry = <sphereGeometry args={[0.5, 32, 32]} />;
      break;
    default:
      geometry = <icosahedronGeometry args={[0.5, 0]} />;
  }

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={1}>
      <mesh ref={meshRef} position={position}>
        {geometry}
        <meshStandardMaterial 
          color={color} 
          wireframe 
          transparent 
          opacity={0.7}
          emissive={color}
          emissiveIntensity={0.1}
        />
      </mesh>
    </Float>
  );
};

// Camera Controller that responds to scroll
const CameraController = ({ scrollProgress }) => {
  const { camera } = useThree();
  
  useFrame(() => {
    // Calculate camera position based on scroll progress
    const x = scrollProgress * Math.PI * 2;
    const y = Math.sin(scrollProgress * Math.PI) * 2;
    const z = Math.cos(x) * 8;
    
    // Smooth camera movement
    camera.position.lerp(new THREE.Vector3(
      Math.sin(x) * 6,
      y,
      z
    ), 0.05); // Smooth interpolation factor
    
    // Look at a point slightly offset based on scroll
    camera.lookAt(
      Math.sin(scrollProgress * 0.5) * 2,
      Math.cos(scrollProgress * 0.3) * 1,
      0
    );
  });
  
  return null;
};

// Main Scene Component
const ThreeDScene = ({ scrollProgress }) => {
  return (
    <>
      <Environment preset="night" />
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={1.5} color="#7a5af5" />
      <spotLight 
        position={[-10, 10, 10]} 
        angle={0.15} 
        penumbra={1} 
        intensity={1} 
        color="#ff006e"
      />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#00f5d4" />
      
      <CameraController scrollProgress={scrollProgress} />
      
      <ParticleField />
      
      <FloatingObject position={[-4, 2, -4]} color="#ff006e" speed={0.5} geometryType="torus" />
      <FloatingObject position={[3, -1, -2]} color="#00f5d4" speed={0.7} geometryType="box" />
      <FloatingObject position={[0, 3, 3]} color="#7a5af5" speed={0.3} geometryType="sphere" />
      <FloatingObject position={[-2, -3, 1]} color="#ffd369" speed={0.6} geometryType="icosahedron" />
      <FloatingObject position={[4, 0, -1]} color="#3a86ff" speed={0.4} geometryType="torus" />
      
      <mesh position={[0, -4, -6]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial 
          color="#111827" 
          transparent 
          opacity={0.7} 
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
    </>
  );
};

// Main 3D Camera Scroll Component
const ThreeDCameraScroll = () => {
  const containerRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      // Calculate scroll progress (0 to 1) based on scroll position
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;
      const progress = Math.min(Math.max(scrollY / (docHeight - windowHeight), 0), 1);
      setScrollProgress(progress);
    };

    // Initial calculation
    handleScroll();

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);

    // Cleanup
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-[300vh] bg-gradient-to-b from-gray-900 to-black overflow-hidden"
    >
      <div className="sticky top-0 h-screen w-full">
        <Canvas 
          camera={{ position: [0, 0, 5], fov: 75 }}
          className="w-full h-full"
          gl={{ 
            antialias: true, 
            alpha: true,
            powerPreference: "high-performance"
          }}
        >
          <ThreeDScene scrollProgress={scrollProgress} />
        </Canvas>
        
        {/* Overlay content */}
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
          <div className="text-center px-4 max-w-4xl opacity-80">
            <motion.div 
              className="mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.5 }}
            >
              <h1 className="text-4xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600 mb-4">
                About Our Vision
              </h1>
              <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
                Discover our journey through innovative 3D experiences
              </p>
            </motion.div>
            
            <motion.div
              className="flex justify-center space-x-4 mt-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
            >
              <div className="w-3 h-3 rounded-full bg-purple-500 animate-pulse"></div>
              <div className="w-3 h-3 rounded-full bg-pink-500 animate-pulse delay-150"></div>
              <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse delay-300"></div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThreeDCameraScroll;
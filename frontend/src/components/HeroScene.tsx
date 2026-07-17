"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { MeshTransmissionMaterial, Float, Stars, Environment } from "@react-three/drei";
import * as THREE from "three";

// Floating Crystal Gem
function Crystal() {
  const meshRef = useRef<THREE.Mesh>(null!);
  const { mouse } = useThree();

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y += 0.003;
    meshRef.current.rotation.x += 0.001;
    // Subtle mouse parallax
    meshRef.current.rotation.y += mouse.x * 0.0008;
    meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, mouse.x * 0.5, 0.02);
    meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, mouse.y * 0.3, 0.02);
  });

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.8}>
      <mesh ref={meshRef} scale={1.6}>
        <icosahedronGeometry args={[1, 1]} />
        <MeshTransmissionMaterial
          backside
          samples={8}
          thickness={0.5}
          anisotropicBlur={0.1}
          chromaticAberration={0.5}
          distortion={0.1}
          temporalDistortion={0.05}
          color="#C8A46A"
          transmission={0.95}
          roughness={0.05}
          envMapIntensity={1.5}
        />
      </mesh>
    </Float>
  );
}

// Floating Wireframe Ring
function Ring() {
  const ringRef = useRef<THREE.Mesh>(null!);
  useFrame((state) => {
    if (!ringRef.current) return;
    ringRef.current.rotation.z = state.clock.elapsedTime * 0.15;
    ringRef.current.rotation.x = Math.PI / 3 + Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
  });
  return (
    <mesh ref={ringRef} position={[0, 0, -1.5]}>
      <torusGeometry args={[2.8, 0.012, 4, 80]} />
      <meshBasicMaterial color="#C8A46A" transparent opacity={0.25} />
    </mesh>
  );
}

// Outer slow ring
function OuterRing() {
  const ringRef = useRef<THREE.Mesh>(null!);
  useFrame((state) => {
    if (!ringRef.current) return;
    ringRef.current.rotation.z = -state.clock.elapsedTime * 0.07;
    ringRef.current.rotation.x = Math.PI / 4;
  });
  return (
    <mesh ref={ringRef} position={[0, 0, -1.5]}>
      <torusGeometry args={[3.8, 0.006, 4, 100]} />
      <meshBasicMaterial color="#A8765E" transparent opacity={0.12} />
    </mesh>
  );
}

// Floating Particles
function Particles() {
  const count = 120;
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 14;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 8;
    }
    return pos;
  }, []);

  const pointsRef = useRef<THREE.Points>(null!);
  useFrame((state) => {
    if (!pointsRef.current) return;
    pointsRef.current.rotation.y = state.clock.elapsedTime * 0.025;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.025} color="#C8A46A" transparent opacity={0.6} sizeAttenuation />
    </points>
  );
}

export default function HeroScene() {
  return (
    <div className="w-full h-full absolute inset-0 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={1.2} color="#fff8f0" />
        <pointLight position={[-5, -3, 2]} intensity={0.8} color="#C8A46A" />
        <pointLight position={[5, 3, -2]} intensity={0.5} color="#8B6A4F" />
        
        <Environment preset="sunset" />
        
        <Crystal />
        <Ring />
        <OuterRing />
        <Particles />
      </Canvas>
    </div>
  );
}

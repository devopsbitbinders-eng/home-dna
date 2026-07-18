"use client";

import { Canvas } from "@react-three/fiber";
import { ContactShadows, Float, OrbitControls, RoundedBox } from "@react-three/drei";
import { Suspense, useMemo } from "react";

function Material({ color, roughness = 0.55, metalness = 0 }: { color: string; roughness?: number; metalness?: number }) {
  return <meshStandardMaterial color={color} roughness={roughness} metalness={metalness} />;
}

function Cushions() {
  return (
    <>
      {[-0.75, 0, 0.75].map((x) => (
        <RoundedBox key={x} args={[0.68, 0.24, 0.58]} radius={0.08} smoothness={4} position={[x, 0.84, 0.03]} castShadow>
          <Material color="#d8c8b6" roughness={0.9} />
        </RoundedBox>
      ))}
      <RoundedBox args={[0.46, 0.42, 0.18]} radius={0.06} smoothness={4} position={[-0.84, 0.97, 0.24]} rotation={[0.12, 0.08, -0.1]} castShadow>
        <Material color="#a97d56" roughness={0.95} />
      </RoundedBox>
      <RoundedBox args={[0.45, 0.42, 0.18]} radius={0.06} smoothness={4} position={[0.82, 0.98, 0.24]} rotation={[0.1, -0.1, 0.08]} castShadow>
        <Material color="#72826d" roughness={0.95} />
      </RoundedBox>
    </>
  );
}

function Sofa() {
  return (
    <group position={[-0.35, 0, 0.28]}>
      <RoundedBox args={[2.6, 0.43, 0.9]} radius={0.13} smoothness={5} position={[0, 0.46, 0]} castShadow><Material color="#bca892" roughness={0.88} /></RoundedBox>
      <RoundedBox args={[2.6, 0.92, 0.19]} radius={0.1} smoothness={5} position={[0, 0.91, -0.33]} castShadow><Material color="#a9917c" roughness={0.86} /></RoundedBox>
      <RoundedBox args={[0.18, 0.6, 0.9]} radius={0.08} smoothness={4} position={[-1.2, 0.66, 0]} castShadow><Material color="#a9917c" roughness={0.86} /></RoundedBox>
      <RoundedBox args={[0.18, 0.6, 0.9]} radius={0.08} smoothness={4} position={[1.2, 0.66, 0]} castShadow><Material color="#a9917c" roughness={0.86} /></RoundedBox>
      <Cushions />
      {[-1.04, 1.04].map((x) => <mesh key={x} position={[x, 0.16, 0]} castShadow><boxGeometry args={[0.09, 0.32, 0.1]} /><Material color="#5d4638" roughness={0.5} /></mesh>)}
    </group>
  );
}

function CoffeeTable() {
  return (
    <group position={[0.08, 0.1, 1.25]}>
      <RoundedBox args={[1.44, 0.12, 0.76]} radius={0.12} smoothness={5} position={[0, 0.55, 0]} castShadow><Material color="#8e674a" roughness={0.42} /></RoundedBox>
      {[[-0.56, -0.27], [0.56, -0.27], [-0.56, 0.27], [0.56, 0.27]].map(([x, z]) => <mesh key={`${x}-${z}`} position={[x, 0.28, z]} castShadow><cylinderGeometry args={[0.04, 0.055, 0.55, 12]} /><Material color="#644838" roughness={0.48} /></mesh>)}
      <mesh position={[0.15, 0.65, -0.02]} castShadow><cylinderGeometry args={[0.1, 0.12, 0.3, 16]} /><Material color="#c9aa82" roughness={0.45} /></mesh>
      <mesh position={[0.15, 0.94, -0.02]} castShadow><sphereGeometry args={[0.26, 20, 16]} /><Material color="#607c60" roughness={0.8} /></mesh>
    </group>
  );
}

function Plant() {
  const leaves = useMemo(() => Array.from({ length: 10 }, (_, i) => ({ angle: (i / 10) * Math.PI * 2, tilt: 0.4 + (i % 3) * 0.12, height: 0.7 + (i % 4) * 0.09 })), []);
  return <group position={[2.25, 0, -0.25]}>
    <mesh position={[0, 0.32, 0]} castShadow><cylinderGeometry args={[0.31, 0.23, 0.64, 20]} /><Material color="#ae815f" roughness={0.65} /></mesh>
    {leaves.map((leaf, i) => <mesh key={i} position={[Math.cos(leaf.angle) * 0.25, 0.72 + leaf.height / 2, Math.sin(leaf.angle) * 0.25]} rotation={[Math.cos(leaf.angle) * leaf.tilt, 0, -Math.sin(leaf.angle) * leaf.tilt]} castShadow><sphereGeometry args={[0.2, 14, 12]} /><Material color={i % 2 ? "#476b4b" : "#668467"} roughness={0.85} /></mesh>)}
  </group>;
}

function Room() {
  return <group>
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[7, 6]} /><Material color="#cfbea8" roughness={0.78} /></mesh>
    <mesh position={[0, 2.2, -1.9]} receiveShadow><planeGeometry args={[7, 4.4]} /><Material color="#e4d8cb" roughness={0.9} /></mesh>
    <mesh position={[-3.1, 2.2, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow><planeGeometry args={[4, 4.4]} /><Material color="#d9cabb" roughness={0.9} /></mesh>
    <mesh position={[-0.1, 0.018, 0.65]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[3.9, 2.85]} /><meshStandardMaterial color="#a88369" roughness={1} /></mesh>
    <Sofa />
    <CoffeeTable />
    <Plant />
    <group position={[-1.65, 1.8, -1.84]}>
      <mesh><boxGeometry args={[1.35, 1.45, 0.08]} /><meshStandardMaterial color="#ecd89c" emissive="#d0a858" emissiveIntensity={0.32} roughness={0.3} /></mesh>
      <mesh position={[0, 0, 0.06]}><boxGeometry args={[0.06, 1.6, 0.12]} /><Material color="#8c715d" roughness={0.4} /></mesh>
      <mesh position={[0, 0, 0.06]}><boxGeometry args={[1.5, 0.06, 0.12]} /><Material color="#8c715d" roughness={0.4} /></mesh>
    </group>
    <group position={[1.3, 0, -1.75]}>
      <mesh position={[0, 1.95, 0]} castShadow><boxGeometry args={[1.55, 0.08, 0.18]} /><Material color="#8a6248" roughness={0.48} /></mesh>
      {[0, 0.24, 0.51, 0.75, 1.04].map((x, i) => <mesh key={x} position={[-0.62 + x, 2.18, 0]} castShadow><boxGeometry args={[0.16, 0.42 + (i % 2) * 0.15, 0.16]} /><Material color={["#8e654f", "#b78b63", "#6b806a", "#d2b18c", "#92715c"][i]} roughness={0.7} /></mesh>)}
    </group>
    <group position={[0.55, 2.8, 0.55]}>
      <mesh position={[0, -0.56, 0]}><cylinderGeometry args={[0.015, 0.015, 1.1, 12]} /><Material color="#927358" metalness={0.7} roughness={0.28} /></mesh>
      <mesh castShadow><cylinderGeometry args={[0.38, 0.26, 0.23, 24]} /><meshStandardMaterial color="#c7a46d" emissive="#c49350" emissiveIntensity={0.65} roughness={0.35} metalness={0.5} /></mesh>
      <pointLight intensity={14} distance={4.4} color="#ffd896" />
    </group>
  </group>;
}

export default function HeroScene() {
  return (
    <div className="absolute inset-0 overflow-hidden" aria-label="Interactive 3D interior preview">
      <Canvas shadows dpr={[1, 1.6]} camera={{ position: [4.9, 3.8, 6.2], fov: 38 }} gl={{ antialias: true, alpha: true }}>
        <color attach="background" args={["#eee3d7"]} />
        <fog attach="fog" args={["#eee3d7", 7, 13]} />
        <ambientLight intensity={1.35} />
        <directionalLight position={[3, 6, 4]} intensity={2.8} color="#fff2d7" castShadow shadow-mapSize={[1024, 1024]} />
        <Suspense fallback={null}>
          <Float speed={1.2} rotationIntensity={0.08} floatIntensity={0.12}><Room /></Float>
          <ContactShadows position={[0, 0.01, 0]} opacity={0.38} scale={8} blur={2.8} far={5} color="#6f4d3b" />
        </Suspense>
        <OrbitControls enablePan={false} enableZoom={false} minPolarAngle={0.85} maxPolarAngle={1.25} minAzimuthAngle={-0.6} maxAzimuthAngle={0.45} autoRotate autoRotateSpeed={0.32} />
      </Canvas>
      <div className="absolute inset-x-0 bottom-0 h-1/3 pointer-events-none bg-gradient-to-t from-[#eadfd4]/45 to-transparent" />
      <p className="absolute right-5 bottom-5 text-[9px] tracking-[0.2em] uppercase text-[#715948]/70 pointer-events-none">Drag to explore</p>
    </div>
  );
}

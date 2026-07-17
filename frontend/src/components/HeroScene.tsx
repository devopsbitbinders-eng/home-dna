"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef, useEffect, useState } from "react";

// Single floating orb/particle
function Particle({ delay, x, y, size, opacity }: { delay: number; x: string; y: string; size: number; opacity: number }) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        left: x, top: y, width: size, height: size,
        background: `radial-gradient(circle, rgba(168,118,94,${opacity}) 0%, transparent 70%)`,
      }}
      animate={{ y: [0, -24, 0], opacity: [opacity * 0.4, opacity, opacity * 0.4], scale: [0.8, 1.1, 0.8] }}
      transition={{ duration: 4 + delay, repeat: Infinity, ease: "easeInOut", delay }}
    />
  );
}

// CSS 3D rotating crystal using perspective transforms
function Crystal3D({ mouseX, mouseY }: { mouseX: number; mouseY: number }) {
  const rotX = useSpring(mouseY * -18, { stiffness: 60, damping: 20 });
  const rotY = useSpring(mouseX * 18, { stiffness: 60, damping: 20 });

  return (
    <div className="absolute inset-0 flex items-center justify-center" style={{ perspective: "900px" }}>
      <motion.div
        style={{ rotateX: rotX, rotateY: rotY, transformStyle: "preserve-3d" }}
        animate={{ rotateZ: [0, 360] }}
        transition={{ rotateZ: { duration: 30, repeat: Infinity, ease: "linear" } }}
        className="relative w-56 h-56 md:w-72 md:h-72"
      >
        {/* Core glowing sphere */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: "radial-gradient(circle at 35% 35%, rgba(255,240,210,0.95), rgba(200,164,106,0.6) 50%, rgba(139,106,79,0.15) 100%)",
            boxShadow: "0 0 60px 20px rgba(200,164,106,0.25), 0 0 120px 40px rgba(168,118,94,0.12), inset 0 0 40px rgba(255,255,255,0.3)",
          }}
        />

        {/* Facet overlays simulating icosahedron faces */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute inset-0 rounded-full"
            style={{
              background: `conic-gradient(from ${i * 60}deg, transparent 0deg, rgba(200,164,106,0.08) 30deg, transparent 60deg)`,
              mixBlendMode: "screen",
            }}
            animate={{ rotate: [i % 2 === 0 ? 0 : 360, i % 2 === 0 ? 360 : 0] }}
            transition={{ duration: 10 + i * 3, repeat: Infinity, ease: "linear" }}
          />
        ))}

        {/* Specular highlight */}
        <div
          className="absolute rounded-full"
          style={{
            width: "40%", height: "30%", top: "12%", left: "18%",
            background: "radial-gradient(ellipse, rgba(255,255,255,0.7) 0%, transparent 100%)",
            filter: "blur(4px)",
          }}
        />
      </motion.div>
    </div>
  );
}

// Rotating orbital ring
function OrbitalRing({ radius, duration, tiltX, tiltZ, color, opacity }: {
  radius: number; duration: number; tiltX: number; tiltZ: number; color: string; opacity: number;
}) {
  return (
    <div
      className="absolute inset-0 flex items-center justify-center pointer-events-none"
      style={{ perspective: "900px" }}
    >
      <motion.div
        className="rounded-full border"
        style={{
          width: radius * 2, height: radius * 2,
          borderColor: color,
          borderWidth: 1,
          opacity,
          rotateX: tiltX,
          rotateZ: tiltZ,
          transformStyle: "preserve-3d",
          boxShadow: `0 0 8px 0 ${color}`,
        }}
        animate={{ rotateZ: [tiltZ, tiltZ + 360] }}
        transition={{ duration, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
}

// Orbiting dot on a ring
function OrbitingDot({ radius, duration, startAngle, color }: {
  radius: number; duration: number; startAngle: number; color: string;
}) {
  return (
    <motion.div
      className="absolute rounded-full"
      style={{ width: 6, height: 6, background: color, boxShadow: `0 0 8px 4px ${color}`, top: "50%", left: "50%", marginTop: -3, marginLeft: -3 }}
      animate={{
        x: [
          Math.cos((startAngle * Math.PI) / 180) * radius,
          Math.cos(((startAngle + 120) * Math.PI) / 180) * radius,
          Math.cos(((startAngle + 240) * Math.PI) / 180) * radius,
          Math.cos((startAngle * Math.PI) / 180) * radius,
        ],
        y: [
          Math.sin((startAngle * Math.PI) / 180) * radius,
          Math.sin(((startAngle + 120) * Math.PI) / 180) * radius,
          Math.sin(((startAngle + 240) * Math.PI) / 180) * radius,
          Math.sin((startAngle * Math.PI) / 180) * radius,
        ],
      }}
      transition={{ duration, repeat: Infinity, ease: "linear" }}
    />
  );
}

export default function HeroScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const handleMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      setMouse({
        x: ((e.clientX - rect.left) / rect.width - 0.5) * 2,
        y: ((e.clientY - rect.top) / rect.height - 0.5) * 2,
      });
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  const particles = [
    { delay: 0, x: "10%", y: "20%", size: 80, opacity: 0.5 },
    { delay: 1, x: "75%", y: "10%", size: 50, opacity: 0.4 },
    { delay: 2, x: "85%", y: "65%", size: 70, opacity: 0.35 },
    { delay: 0.5, x: "20%", y: "75%", size: 60, opacity: 0.45 },
    { delay: 1.5, x: "60%", y: "80%", size: 40, opacity: 0.3 },
    { delay: 3, x: "5%", y: "50%", size: 35, opacity: 0.25 },
    { delay: 2.5, x: "90%", y: "35%", size: 45, opacity: 0.3 },
  ];

  return (
    <div ref={containerRef} className="w-full h-full absolute inset-0 overflow-hidden">
      {/* Warm gradient base */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#F9EFE6] via-[#FAF6F0] to-[#EDE4D8]" />

      {/* Ambient glow at center */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
        style={{ width: 500, height: 500, background: "radial-gradient(circle, rgba(200,164,106,0.18) 0%, transparent 70%)" }}
      />

      {/* Floating particles */}
      {particles.map((p, i) => <Particle key={i} {...p} />)}

      {/* Orbital rings */}
      <OrbitalRing radius={180} duration={14} tiltX={65} tiltZ={20} color="rgba(200,164,106,0.5)" opacity={0.6} />
      <OrbitalRing radius={220} duration={20} tiltX={45} tiltZ={-30} color="rgba(168,118,94,0.4)" opacity={0.4} />
      <OrbitalRing radius={260} duration={28} tiltX={75} tiltZ={10} color="rgba(200,164,106,0.25)" opacity={0.3} />

      {/* Orbiting glowing dots */}
      <OrbitingDot radius={170} duration={8} startAngle={0} color="rgba(200,164,106,0.9)" />
      <OrbitingDot radius={210} duration={13} startAngle={120} color="rgba(255,220,160,0.7)" />

      {/* Main 3D Crystal */}
      <Crystal3D mouseX={mouse.x} mouseY={mouse.y} />
    </div>
  );
}

"use client";

import { motion } from "framer-motion";

// Floating color swatch pill
function ColorSwatch({ color, label, x, y, delay }: { color: string; label: string; x: string; y: string; delay: number }) {
  return (
    <motion.div
      className="absolute flex items-center gap-2 bg-white/80 backdrop-blur-md border border-white px-3 py-2 rounded-full shadow-lg"
      style={{ left: x, top: y }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: [0, -10, 0] }}
      transition={{ opacity: { delay, duration: 0.6 }, y: { delay, duration: 4 + delay, repeat: Infinity, ease: "easeInOut" } }}
    >
      <div className="w-4 h-4 rounded-full shadow-inner flex-shrink-0" style={{ background: color }} />
      <span className="text-[9px] tracking-[0.15em] uppercase font-bold text-[#555]">{label}</span>
    </motion.div>
  );
}

// Floating material tag
function MaterialTag({ label, x, y, delay }: { label: string; x: string; y: string; delay: number }) {
  return (
    <motion.div
      className="absolute bg-[#1A1A1A]/85 backdrop-blur-md text-white px-4 py-2 rounded-2xl shadow-xl"
      style={{ left: x, top: y }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1, y: [0, -8, 0] }}
      transition={{ opacity: { delay, duration: 0.6 }, y: { delay: delay + 0.5, duration: 5 + delay, repeat: Infinity, ease: "easeInOut" } }}
    >
      <span className="text-[9px] tracking-[0.2em] uppercase font-semibold">{label}</span>
    </motion.div>
  );
}

// The isometric room
function IsometricRoom() {
  const floorColor = "#EDE0D0";
  const wallLeftColor = "#F4EDE5";
  const wallBackColor = "#EDE4DA";

  return (
    <div className="absolute inset-0 flex items-center justify-center" style={{ perspective: "1000px" }}>
      <motion.div
        initial={{ opacity: 0, rotateX: 60, rotateZ: -45, scale: 0.6 }}
        animate={{ opacity: 1, rotateX: 55, rotateZ: -45, scale: 1 }}
        transition={{ duration: 1.8, ease: "easeOut" }}
        style={{ transformStyle: "preserve-3d", width: 320, height: 320 }}
      >
        {/* FLOOR */}
        <div
          className="absolute"
          style={{
            width: 320, height: 320,
            background: `linear-gradient(135deg, ${floorColor} 0%, #D9C9B5 100%)`,
            transform: "translateZ(0px)",
            boxShadow: "inset 0 0 40px rgba(0,0,0,0.06)",
          }}
        >
          {/* Floor grid lines */}
          {[1,2,3].map(i => (
            <div key={`h${i}`} className="absolute w-full" style={{ top: i * 80, height: 1, background: "rgba(0,0,0,0.06)" }} />
          ))}
          {[1,2,3].map(i => (
            <div key={`v${i}`} className="absolute h-full" style={{ left: i * 80, width: 1, background: "rgba(0,0,0,0.06)" }} />
          ))}

          {/* Rug */}
          <div className="absolute rounded-sm" style={{ left: 60, top: 100, width: 160, height: 100, background: "linear-gradient(135deg, #C4A882, #A8765E)", opacity: 0.6 }} />

          {/* Sofa silhouette */}
          <div className="absolute rounded-md" style={{ left: 55, top: 88, width: 170, height: 50, background: "#6B4C3B", opacity: 0.85, boxShadow: "2px 4px 8px rgba(0,0,0,0.2)" }}>
            {/* Sofa cushions */}
            <div className="absolute rounded-sm" style={{ left: 5, top: 4, width: 75, height: 38, background: "#7D5A47", opacity: 0.9 }} />
            <div className="absolute rounded-sm" style={{ left: 88, top: 4, width: 75, height: 38, background: "#7D5A47", opacity: 0.9 }} />
          </div>

          {/* Coffee table */}
          <div className="absolute rounded-sm" style={{ left: 110, top: 148, width: 80, height: 45, background: "#8B6A4F", opacity: 0.75, boxShadow: "1px 2px 6px rgba(0,0,0,0.15)" }} />

          {/* Floor lamp */}
          <div className="absolute" style={{ left: 240, top: 70 }}>
            <div style={{ width: 3, height: 50, background: "#9E7C60", margin: "0 auto" }} />
            <div style={{ width: 20, height: 14, background: "#C8A46A", borderRadius: "50%", marginTop: -2, marginLeft: -8.5, opacity: 0.9 }} />
          </div>

          {/* Plant pot */}
          <div className="absolute" style={{ left: 16, top: 60 }}>
            <div style={{ width: 24, height: 28, background: "#5A8A6A", borderRadius: "40% 40% 30% 30%", opacity: 0.85 }} />
            <div style={{ width: 18, height: 14, background: "#A8765E", borderRadius: "0 0 6px 6px", margin: "0 auto" }} />
          </div>
        </div>

        {/* LEFT WALL */}
        <div
          className="absolute origin-left"
          style={{
            width: 320, height: 180,
            background: `linear-gradient(180deg, ${wallLeftColor} 0%, #E8DDD4 100%)`,
            transform: "rotateX(90deg) translateZ(0px)",
            top: 0,
            boxShadow: "inset -10px 0 20px rgba(0,0,0,0.04)",
          }}
        >
          {/* Window on left wall */}
          <div className="absolute" style={{ left: 80, top: 30, width: 80, height: 100 }}>
            <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg, rgba(255,240,200,0.9), rgba(200,180,140,0.7))", border: "3px solid #B8A088", borderRadius: 2, boxShadow: "inset 0 0 20px rgba(255,220,100,0.3)" }}>
              {/* Window pane dividers */}
              <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: 2, background: "#B8A088" }} />
              <div style={{ position: "absolute", top: "50%", left: 0, right: 0, height: 2, background: "#B8A088" }} />
            </div>
            {/* Light ray from window */}
            <motion.div
              style={{ position: "absolute", top: "100%", left: "10%", width: "80%", height: 60, background: "linear-gradient(180deg, rgba(255,220,120,0.2), transparent)", transformOrigin: "top" }}
              animate={{ opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>

          {/* Art piece on wall */}
          <div className="absolute" style={{ right: 40, top: 25, width: 50, height: 65, background: "linear-gradient(135deg, #D4A574, #A8765E)", border: "3px solid #8B6A4F", borderRadius: 2 }} />
        </div>

        {/* BACK WALL */}
        <div
          className="absolute origin-top"
          style={{
            width: 180, height: 320,
            background: `linear-gradient(90deg, ${wallBackColor} 0%, #E8DDD4 100%)`,
            transform: "rotateY(-90deg) translateZ(0px)",
            right: 0,
            boxShadow: "inset -10px 0 20px rgba(0,0,0,0.04)",
          }}
        >
          {/* Shelf on back wall */}
          <div style={{ position: "absolute", left: 16, top: 40, width: 140, height: 8, background: "#9E7C60", borderRadius: 2 }}>
            {/* Items on shelf */}
            <div style={{ position: "absolute", left: 10, top: -20, width: 12, height: 20, background: "#A8765E", borderRadius: "2px 2px 0 0" }} />
            <div style={{ position: "absolute", left: 28, top: -28, width: 14, height: 28, background: "#8B6A4F", borderRadius: "2px 2px 0 0" }} />
            <div style={{ position: "absolute", left: 70, top: -16, width: 18, height: 16, background: "#C4A882", borderRadius: 2 }} />
            <div style={{ position: "absolute", left: 95, top: -22, width: 10, height: 22, background: "#6B8C7A", borderRadius: "4px 4px 0 0" }} />
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function HeroScene() {
  const swatches = [
    { color: "#C4A882", label: "Oak Honey", x: "4%", y: "8%", delay: 0.8 },
    { color: "#8B6A4F", label: "Walnut", x: "68%", y: "6%", delay: 1.2 },
    { color: "#D9C9B5", label: "Ivory Stone", x: "5%", y: "72%", delay: 1.6 },
    { color: "#6B8C7A", label: "Sage Green", x: "70%", y: "76%", delay: 2 },
  ];

  const tags = [
    { label: "Fluted Panels", x: "60%", y: "28%", delay: 1.4 },
    { label: "Warm Ambient ✦", x: "2%", y: "42%", delay: 1.8 },
    { label: "Japandi Style", x: "58%", y: "52%", delay: 2.2 },
  ];

  return (
    <div className="w-full h-full absolute inset-0 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#F9EFE6] via-[#FAF6F0] to-[#EDE4D8]" />

      {/* Ambient center glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
        style={{ width: 480, height: 480, background: "radial-gradient(circle, rgba(200,164,106,0.15) 0%, transparent 70%)" }}
      />

      {/* Isometric Room */}
      <IsometricRoom />

      {/* Floating Color Swatches */}
      {swatches.map((s, i) => <ColorSwatch key={i} {...s} />)}

      {/* Floating Material Tags */}
      {tags.map((t, i) => <MaterialTag key={i} {...t} />)}

      {/* Scanning light line animation */}
      <motion.div
        className="absolute left-0 right-0 h-[1px] pointer-events-none"
        style={{ background: "linear-gradient(90deg, transparent, rgba(200,164,106,0.4), transparent)" }}
        animate={{ top: ["10%", "90%", "10%"] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

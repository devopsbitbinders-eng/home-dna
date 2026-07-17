"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef, useEffect } from "react";

/* ── Floating Swatch with 3D flip entrance ── */
function Swatch({ color, label, x, y, delay }: { color: string; label: string; x: string; y: string; delay: number }) {
  return (
    <motion.div
      className="absolute flex items-center gap-2.5 bg-white/85 backdrop-blur-xl border border-white/90 px-4 py-2.5 rounded-full shadow-lg cursor-default select-none"
      style={{ left: x, top: y }}
      initial={{ opacity: 0, rotateY: 90, scale: 0.6 }}
      animate={{ opacity: 1, rotateY: 0, scale: 1, y: [0, -12, 0] }}
      transition={{
        opacity:  { delay, duration: 0.5 },
        rotateY:  { delay, duration: 0.7, ease: [0.16, 1, 0.3, 1] },
        scale:    { delay, duration: 0.7, ease: [0.16, 1, 0.3, 1] },
        y:        { delay: delay + 0.7, duration: 4 + delay * 0.4, repeat: Infinity, ease: "easeInOut" },
      }}
      whileHover={{ scale: 1.08, boxShadow: "0 12px 32px rgba(0,0,0,0.14)" }}
    >
      <div className="w-4 h-4 rounded-full shadow-inner flex-shrink-0" style={{ background: color }} />
      <span className="text-[9px] tracking-[0.18em] uppercase font-bold text-[#444]">{label}</span>
    </motion.div>
  );
}

/* ── Floating Tag with 3D slide-in ── */
function Tag({ label, x, y, delay }: { label: string; x: string; y: string; delay: number }) {
  return (
    <motion.div
      className="absolute bg-[#1A1A1A]/90 backdrop-blur-xl text-white px-5 py-2.5 rounded-2xl shadow-2xl cursor-default select-none"
      style={{ left: x, top: y }}
      initial={{ opacity: 0, rotateX: -60, y: -20, scale: 0.8 }}
      animate={{ opacity: 1, rotateX: 0, y: [0, -9, 0], scale: 1 }}
      transition={{
        opacity: { delay, duration: 0.5 },
        rotateX: { delay, duration: 0.8, ease: [0.16, 1, 0.3, 1] },
        scale:   { delay, duration: 0.8, ease: [0.16, 1, 0.3, 1] },
        y:       { delay: delay + 0.8, duration: 5 + delay * 0.3, repeat: Infinity, ease: "easeInOut" },
      }}
      whileHover={{ scale: 1.06, background: "rgba(168,118,94,0.95)" }}
    >
      <span className="text-[9px] tracking-[0.22em] uppercase font-bold">{label}</span>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────
   ISOMETRIC ROOM — Mouse-tracked 3D tilt + depth layers
───────────────────────────────────────────────────── */
function IsometricRoom({ mouseX, mouseY }: { mouseX: number; mouseY: number }) {
  // Spring-smooth the tilt values
  const tiltX = useSpring(useMotionValue(0), { stiffness: 40, damping: 20 });
  const tiltZ = useSpring(useMotionValue(0), { stiffness: 40, damping: 20 });

  useEffect(() => {
    tiltX.set(56 + mouseY * 5);   // base 56° + mouse offset
    tiltZ.set(-45 + mouseX * 4);  // base -45° + mouse offset
  }, [mouseX, mouseY]);

  // Parallax depth layers (foreground items move more)
  const fgX = mouseX * 8;
  const fgY = mouseY * 8;
  const mgX = mouseX * 4;
  const mgY = mouseY * 4;

  return (
    <div className="absolute inset-0 flex items-center justify-center" style={{ perspective: "1100px" }}>
      {/* Whole room tilts with mouse */}
      <motion.div
        initial={{ opacity: 0, scale: 0.55, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        style={{ rotateX: tiltX, rotateZ: tiltZ, transformStyle: "preserve-3d", width: 340, height: 340 }}
        transition={{ opacity: { duration: 2 }, scale: { duration: 2, ease: [0.16, 1, 0.3, 1] }, y: { duration: 2, ease: [0.16, 1, 0.3, 1] } }}
      >
        {/* ── FLOOR ── */}
        <div className="absolute" style={{ width: 340, height: 340, background: "linear-gradient(135deg, #EDE0CD 0%, #DDD0BC 60%, #CFC2AE 100%)", transform: "translateZ(0px)" }}>
          {/* Grid lines */}
          {[85, 170, 255].map(v => (<div key={`h${v}`} className="absolute w-full" style={{ top: v, height: 1, background: "rgba(0,0,0,0.05)" }} />))}
          {[85, 170, 255].map(v => (<div key={`fv${v}`} className="absolute h-full" style={{ left: v, width: 1, background: "rgba(0,0,0,0.05)" }} />))}

          {/* Shadows */}
          <div className="absolute rounded-full" style={{ left: 50, top: 145, width: 175, height: 28, background: "rgba(0,0,0,0.10)", filter: "blur(10px)" }} />
          <div className="absolute rounded-full" style={{ left: 240, top: 185, width: 65, height: 18, background: "rgba(0,0,0,0.10)", filter: "blur(8px)" }} />
          <div className="absolute rounded-full" style={{ left: 118, top: 206, width: 80, height: 16, background: "rgba(0,0,0,0.08)", filter: "blur(8px)" }} />

          {/* Rug */}
          <motion.div
            className="absolute rounded-sm"
            style={{ left: 45, top: 120, width: 210, height: 130, background: "linear-gradient(135deg, #B8977E, #A0806A)", opacity: 0.5 }}
            initial={{ scaleX: 0, scaleY: 0, originX: 0.5, originY: 0.5 }}
            animate={{ scaleX: 1, scaleY: 1 }}
            transition={{ delay: 0.6, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          />
          <div className="absolute rounded-sm" style={{ left: 55, top: 130, width: 190, height: 110, border: "1.5px solid rgba(255,255,255,0.2)" }} />

          {/* SOFA — 3D slide in from left */}
          <motion.div
            className="absolute"
            style={{ left: 50, top: 130, width: 175, height: 60, background: "linear-gradient(180deg, #8C6B52, #6B4C3B)", borderRadius: "6px 6px 3px 3px", boxShadow: "0 4px 12px rgba(0,0,0,0.22)" }}
            initial={{ x: -60, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.8, duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="absolute" style={{ top: 5, left: 5, right: 5, height: 26, background: "#9A7460", borderRadius: 4, display: "flex", gap: 4, padding: "0 4px" }}>
              <div style={{ flex: 1, background: "#A57D67", borderRadius: 3 }} />
              <div style={{ flex: 1, background: "#A57D67", borderRadius: 3 }} />
              <div style={{ flex: 1, background: "#A57D67", borderRadius: 3 }} />
            </div>
            <div className="absolute" style={{ bottom: 8, left: 5, right: 5, height: 22, background: "#7A5A44", borderRadius: 3 }} />
            <div className="absolute" style={{ bottom: 0, left: 10, width: 6, height: 8, background: "#4A342A" }} />
            <div className="absolute" style={{ bottom: 0, right: 10, width: 6, height: 8, background: "#4A342A" }} />
          </motion.div>

          {/* Throw pillows */}
          <motion.div className="absolute" style={{ left: 62, top: 135, width: 28, height: 22, background: "#C4A882", borderRadius: 4, transform: "rotate(-5deg)", boxShadow: "1px 2px 4px rgba(0,0,0,0.15)" }} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1, duration: 0.6 }} />
          <motion.div className="absolute" style={{ left: 180, top: 137, width: 25, height: 20, background: "#7A9E8A", borderRadius: 4, transform: "rotate(6deg)", boxShadow: "1px 2px 4px rgba(0,0,0,0.15)" }} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2, duration: 0.6 }} />

          {/* ARMCHAIR */}
          <motion.div className="absolute" style={{ left: 242, top: 170, width: 66, height: 52, background: "linear-gradient(180deg, #7A8C78, #5E6E5C)", borderRadius: "5px 5px 3px 3px", boxShadow: "0 3px 10px rgba(0,0,0,0.20)" }} initial={{ x: 40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 1.0, duration: 1, ease: [0.16, 1, 0.3, 1] }}>
            <div className="absolute" style={{ top: 5, left: 5, right: 5, height: 20, background: "#8A9E88", borderRadius: 3 }} />
            <div className="absolute" style={{ bottom: 5, left: 5, right: 5, height: 16, background: "#6A7E68", borderRadius: 2 }} />
          </motion.div>

          {/* COFFEE TABLE */}
          <motion.div className="absolute" style={{ left: 115, top: 195, width: 88, height: 46, background: "linear-gradient(135deg, #A07850, #7A5A38)", borderRadius: 4, boxShadow: "0 3px 10px rgba(0,0,0,0.18)" }} initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 1.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>
            <div className="absolute" style={{ top: 2, left: 8, width: 30, height: 8, background: "rgba(255,255,255,0.15)", borderRadius: 2 }} />
            <div className="absolute" style={{ left: 34, top: -18, width: 14, height: 20, background: "#C4A882", borderRadius: "6px 6px 3px 3px" }}>
              <div style={{ width: 8, height: 12, background: "#7A9E6A", margin: "-10px auto 0", borderRadius: "50% 50% 0 0" }} />
            </div>
            <div className="absolute" style={{ right: 12, top: 3, width: 22, height: 32, background: "#C4A882", borderRadius: 2, transform: "rotate(-1deg)" }} />
          </motion.div>

          {/* SIDE TABLE */}
          <motion.div className="absolute" style={{ left: 218, top: 196, width: 26, height: 22, background: "#8B6A4F", borderRadius: 2, boxShadow: "0 2px 6px rgba(0,0,0,0.15)" }} initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.3, duration: 0.6 }}>
            <div className="absolute" style={{ left: 8, top: -14, width: 8, height: 16, background: "#F4EDE5", borderRadius: 2 }}>
              <motion.div style={{ width: 2, height: 6, background: "#E8A830", margin: "-4px auto 0", borderRadius: 1 }} animate={{ opacity: [0.6, 1, 0.6] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} />
            </div>
          </motion.div>

          {/* FLOOR LAMP — foreground parallax layer */}
          <motion.div className="absolute" style={{ left: 16, top: 90, x: fgX * 0.5, y: fgY * 0.5 }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: fgY * 0.5 }} transition={{ delay: 0.9, duration: 1 }}>
            <div style={{ width: 3, height: 55, background: "linear-gradient(180deg, #8B6A4F, #6B4C3B)", margin: "0 auto", borderRadius: 2 }} />
            <div style={{ width: 26, height: 18, background: "linear-gradient(135deg, #F5E8D0, #E8D4B0)", borderRadius: "50% 50% 40% 40%", marginTop: -4, marginLeft: -11, boxShadow: "0 0 14px rgba(220,170,80,0.45)" }}>
              <motion.div style={{ width: "100%", height: "100%", borderRadius: "50% 50% 40% 40%", background: "radial-gradient(circle, rgba(255,220,100,0.55), transparent)" }} animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }} />
            </div>
            <motion.div style={{ width: 44, height: 35, background: "linear-gradient(180deg, rgba(255,220,100,0.28), transparent)", margin: "0 auto", marginLeft: -20, filter: "blur(5px)" }} animate={{ opacity: [0.3, 0.8, 0.3] }} transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }} />
          </motion.div>

          {/* LARGE PLANT — foreground parallax */}
          <motion.div className="absolute" style={{ right: 8, top: 50 }} initial={{ opacity: 0, scale: 0, originX: 0.5, originY: 1 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.4, duration: 1, ease: [0.16, 1, 0.3, 1] }}>
            <motion.div animate={{ rotate: [0, 2, -2, 0] }} transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}>
              <div style={{ width: 40, height: 50, background: "radial-gradient(ellipse, #5A8A6A, #3D6B50)", borderRadius: "60% 40% 50% 50%", boxShadow: "3px 4px 10px rgba(0,0,0,0.15)" }} />
              <div style={{ width: 28, height: 36, background: "radial-gradient(ellipse, #6A9A7A, #4A7A5E)", borderRadius: "50% 60% 40% 50%", marginTop: -20, marginLeft: 14 }} />
            </motion.div>
            <div style={{ width: 30, height: 22, background: "linear-gradient(180deg, #B8967A, #9A7860)", borderRadius: "4px 4px 8px 8px", margin: "0 auto", marginTop: -8, boxShadow: "0 3px 8px rgba(0,0,0,0.18)" }} />
          </motion.div>

          <motion.div className="absolute" style={{ left: 24, top: 210 }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5, duration: 0.6 }}>
            <div style={{ width: 18, height: 22, background: "radial-gradient(ellipse, #6A9A7A, #4A7A5E)", borderRadius: "50% 50% 40% 40%" }} />
            <div style={{ width: 20, height: 14, background: "#A87C60", borderRadius: "0 0 6px 6px", margin: "0 auto" }} />
          </motion.div>
        </div>

        {/* ── BACK WALL ── */}
        <div className="absolute origin-top" style={{ width: 190, height: 340, background: "linear-gradient(160deg, #F0E8DF 0%, #E5D9CE 100%)", transform: "rotateY(-90deg) translateZ(0px)", right: 0, boxShadow: "inset -15px 0 30px rgba(0,0,0,0.06)" }}>
          {/* Shelf */}
          <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.7, duration: 0.8, ease: [0.16, 1, 0.3, 1] }} className="absolute" style={{ left: 12, top: 60, width: 160, height: 7, background: "#A07850", borderRadius: "2px 2px 1px 1px", boxShadow: "0 2px 6px rgba(0,0,0,0.15)", transformOrigin: "left" }}>
            {[{ l: 8, h: 32, c: "#8B6A4F" }, { l: 22, h: 42, c: "#C4A882" }, { l: 38, h: 28, c: "#7A9E8A" }, { l: 50, h: 36, c: "#A87860" }].map((b, i) => (
              <motion.div key={i} style={{ position: "absolute", left: b.l, top: -b.h, width: 12, height: b.h, background: b.c, borderRadius: "2px 2px 0 0" }} initial={{ scaleY: 0, originY: 1 }} animate={{ scaleY: 1 }} transition={{ delay: 0.9 + i * 0.1, duration: 0.5 }} />
            ))}
            <motion.div style={{ position: "absolute", left: 90, top: -22, width: 20, height: 22, background: "#D4B896", borderRadius: "50% 50% 20% 20%" }} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.3, duration: 0.6 }} />
            {[{ l: 117, h: 34, c: "#6A8C7A" }, { l: 130, h: 28, c: "#9E7C60" }].map((b, i) => (
              <motion.div key={i} style={{ position: "absolute", left: b.l, top: -b.h, width: 12, height: b.h, background: b.c, borderRadius: "2px 2px 0 0" }} initial={{ scaleY: 0, originY: 1 }} animate={{ scaleY: 1 }} transition={{ delay: 1.4 + i * 0.1, duration: 0.5 }} />
            ))}
          </motion.div>

          {/* Art pieces — slide in with 3D flip */}
          <motion.div initial={{ rotateY: -90, opacity: 0 }} animate={{ rotateY: 0, opacity: 1 }} transition={{ delay: 1.0, duration: 0.9, ease: [0.16, 1, 0.3, 1] }} className="absolute" style={{ left: 20, top: 105, width: 55, height: 70, border: "3px solid #A07850", background: "linear-gradient(135deg, #D4A574, #A8765E)", boxShadow: "0 2px 10px rgba(0,0,0,0.12)" }}>
            <div style={{ position: "absolute", top: "20%", left: "10%", right: "10%", height: 1, background: "rgba(255,255,255,0.4)" }} />
            <div style={{ position: "absolute", top: "45%", left: "20%", right: "30%", height: 1, background: "rgba(255,255,255,0.3)" }} />
            <div style={{ position: "absolute", top: "68%", left: "10%", right: "20%", height: 1, background: "rgba(255,255,255,0.2)" }} />
          </motion.div>
          <motion.div initial={{ rotateY: -90, opacity: 0 }} animate={{ rotateY: 0, opacity: 1 }} transition={{ delay: 1.2, duration: 0.9, ease: [0.16, 1, 0.3, 1] }} className="absolute" style={{ left: 90, top: 115, width: 40, height: 55, border: "2px solid #A07850", background: "linear-gradient(180deg, #EDE0D0, #C4A882)", boxShadow: "0 2px 8px rgba(0,0,0,0.10)" }}>
            <div style={{ position: "absolute", top: "30%", left: "15%", right: "15%", height: 1, background: "rgba(90,60,40,0.3)" }} />
            <div style={{ position: "absolute", top: "60%", left: "25%", right: "10%", height: 1, background: "rgba(90,60,40,0.2)" }} />
          </motion.div>

          {/* Pendant */}
          <div className="absolute" style={{ top: 0, left: "50%", transform: "translateX(-50%)", width: 2, height: 30, background: "#9E7C60" }} />
          <motion.div className="absolute" style={{ top: 28, left: "50%", transform: "translateX(-50%) translateX(-10px)", width: 20, height: 14, background: "#C8A46A", borderRadius: "50% 50% 40% 40%", boxShadow: "0 0 14px rgba(200,164,106,0.5)" }} animate={{ boxShadow: ["0 0 10px rgba(200,164,106,0.4)", "0 0 22px rgba(200,164,106,0.7)", "0 0 10px rgba(200,164,106,0.4)"] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} />
        </div>

        {/* ── LEFT WALL ── */}
        <div className="absolute origin-left" style={{ width: 340, height: 190, background: "linear-gradient(200deg, #F5EDE4 0%, #EAE0D6 100%)", transform: "rotateX(90deg) translateZ(0px)", top: 0, boxShadow: "inset -10px 0 25px rgba(0,0,0,0.05)" }}>
          {/* Window */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 1 }} className="absolute" style={{ left: 90, top: 30, width: 100, height: 110 }}>
            <div style={{ width: "100%", height: "100%", border: "4px solid #B8A088", borderRadius: 3, overflow: "hidden", background: "linear-gradient(135deg, rgba(255,245,215,0.98), rgba(240,220,160,0.9))", boxShadow: "inset 0 0 20px rgba(255,210,80,0.25), 0 4px 20px rgba(0,0,0,0.12)" }}>
              <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: 2, background: "#B8A088", transform: "translateX(-50%)" }} />
              <div style={{ position: "absolute", top: "45%", left: 0, right: 0, height: 2, background: "#B8A088", transform: "translateY(-50%)" }} />
              <div style={{ position: "absolute", top: 6, left: 6, width: "35%", height: "40%", background: "rgba(255,255,255,0.55)", borderRadius: 2 }} />
              <div style={{ position: "absolute", top: 6, right: 6, width: "25%", height: "20%", background: "rgba(255,255,255,0.4)", borderRadius: 2 }} />
            </div>
            {/* Animated light ray */}
            <motion.div
              style={{ position: "absolute", top: "100%", left: "-20%", width: "140%", height: 85, background: "linear-gradient(180deg, rgba(255,210,100,0.25), transparent)", filter: "blur(6px)" }}
              animate={{ opacity: [0.4, 1, 0.4], scaleX: [0.9, 1.08, 0.9] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>
          <div className="absolute bottom-0 left-0 right-0" style={{ height: 6, background: "#D5C5B5" }} />
        </div>
      </motion.div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN EXPORT
───────────────────────────────────────────── */
export default function HeroScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const rawMouseX = useMotionValue(0);
  const rawMouseY = useMotionValue(0);
  const mouseX = useSpring(rawMouseX, { stiffness: 30, damping: 25 });
  const mouseY = useSpring(rawMouseY, { stiffness: 30, damping: 25 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const handleMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      rawMouseX.set(((e.clientX - rect.left) / rect.width - 0.5) * 2);
      rawMouseY.set(((e.clientY - rect.top) / rect.height - 0.5) * 2);
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  // Use raw values for parallax numbers
  const mx = rawMouseX.get();
  const my = rawMouseY.get();

  const swatches = [
    { color: "#C4A882", label: "Oak Honey",   x: "3%",  y: "6%",  delay: 1.2 },
    { color: "#8B6A4F", label: "Walnut",      x: "66%", y: "4%",  delay: 1.6 },
    { color: "#7A9E8A", label: "Sage Green",  x: "4%",  y: "68%", delay: 2.0 },
    { color: "#D9C9B5", label: "Ivory Stone", x: "65%", y: "78%", delay: 2.4 },
    { color: "#A87860", label: "Terracotta",  x: "34%", y: "88%", delay: 2.8 },
  ];
  const tags = [
    { label: "Fluted Panels",         x: "56%", y: "22%", delay: 1.8 },
    { label: "Warm Cove Lighting ✦",  x: "2%",  y: "40%", delay: 2.2 },
    { label: "Japandi Style",         x: "56%", y: "56%", delay: 2.6 },
    { label: "Micro Concrete",        x: "2%",  y: "82%", delay: 3.0 },
  ];

  return (
    <div ref={containerRef} className="w-full h-full absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#F7EFE5] via-[#FAF6F0] to-[#EAE0D2]" />
      {/* Ambient glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none" style={{ width: 520, height: 520, background: "radial-gradient(circle, rgba(200,164,106,0.16) 0%, transparent 68%)" }} />
      <div className="absolute -top-16 -right-16 rounded-full pointer-events-none" style={{ width: 300, height: 300, background: "radial-gradient(circle, rgba(200,164,106,0.10) 0%, transparent 70%)" }} />

      <IsometricRoom mouseX={mx} mouseY={my} />

      {swatches.map((s, i) => <Swatch key={i} {...s} />)}
      {tags.map((t, i) => <Tag key={i} {...t} />)}

      {/* AI Scan line */}
      <motion.div
        className="absolute left-0 right-0 pointer-events-none"
        style={{ height: 1.5, background: "linear-gradient(90deg, transparent 0%, rgba(200,164,106,0.55) 40%, rgba(200,164,106,0.55) 60%, transparent 100%)" }}
        animate={{ top: ["8%", "92%", "8%"] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Vignette */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at center, transparent 55%, rgba(234,224,210,0.35) 100%)" }} />
    </div>
  );
}

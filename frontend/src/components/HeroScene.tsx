"use client";

import { motion } from "framer-motion";

/* ── Floating Swatch ── */
function Swatch({ color, label, x, y, delay }: { color: string; label: string; x: string; y: string; delay: number }) {
  return (
    <motion.div
      className="absolute flex items-center gap-2.5 bg-white/85 backdrop-blur-xl border border-white/90 px-4 py-2.5 rounded-full shadow-lg cursor-default"
      style={{ left: x, top: y }}
      initial={{ opacity: 0, scale: 0.7 }}
      animate={{ opacity: 1, scale: 1, y: [0, -10, 0] }}
      transition={{
        opacity: { delay, duration: 0.5 },
        scale:   { delay, duration: 0.5 },
        y:       { delay: delay + 0.5, duration: 4 + delay * 0.5, repeat: Infinity, ease: "easeInOut" },
      }}
    >
      <div className="w-4 h-4 rounded-full shadow-sm flex-shrink-0" style={{ background: color }} />
      <span className="text-[9px] tracking-[0.18em] uppercase font-bold text-[#444]">{label}</span>
    </motion.div>
  );
}

/* ── Floating Tag ── */
function Tag({ label, x, y, delay }: { label: string; x: string; y: string; delay: number }) {
  return (
    <motion.div
      className="absolute bg-[#1A1A1A]/90 backdrop-blur-xl text-white px-5 py-2.5 rounded-2xl shadow-2xl cursor-default"
      style={{ left: x, top: y }}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0, y: [0, -8, 0] }}
      transition={{
        opacity: { delay, duration: 0.5 },
        x:       { delay, duration: 0.5 },
        y:       { delay: delay + 0.5, duration: 5 + delay * 0.4, repeat: Infinity, ease: "easeInOut" },
      }}
    >
      <span className="text-[9px] tracking-[0.22em] uppercase font-bold">{label}</span>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   ISOMETRIC ROOM — rich details
───────────────────────────────────────────── */
function IsometricRoom() {
  return (
    <div className="absolute inset-0 flex items-center justify-center" style={{ perspective: "1200px" }}>
      <motion.div
        initial={{ opacity: 0, rotateX: 65, rotateZ: -45, scale: 0.55, y: 40 }}
        animate={{ opacity: 1, rotateX: 56, rotateZ: -45, scale: 1, y: 0 }}
        transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
        style={{ transformStyle: "preserve-3d", width: 340, height: 340 }}
      >
        {/* ── FLOOR ── */}
        <div className="absolute" style={{
          width: 340, height: 340,
          background: "linear-gradient(135deg, #EDE0CD 0%, #DDD0BC 60%, #CFC2AE 100%)",
          transform: "translateZ(0px)",
        }}>
          {/* Floor grid */}
          {[85, 170, 255].map(v => (
            <div key={`h${v}`} className="absolute w-full" style={{ top: v, height: 1, background: "rgba(0,0,0,0.05)" }} />
          ))}
          {[85, 170, 255].map(v => (
            <div key={`fv${v}`} className="absolute h-full" style={{ left: v, width: 1, background: "rgba(0,0,0,0.05)" }} />
          ))}

          {/* Shadow under sofa */}
          <div className="absolute rounded-full" style={{ left: 50, top: 145, width: 175, height: 28, background: "rgba(0,0,0,0.10)", filter: "blur(10px)" }} />
          {/* Shadow under chair */}
          <div className="absolute rounded-full" style={{ left: 240, top: 185, width: 65, height: 18, background: "rgba(0,0,0,0.10)", filter: "blur(8px)" }} />
          {/* Shadow under table */}
          <div className="absolute rounded-full" style={{ left: 118, top: 206, width: 80, height: 16, background: "rgba(0,0,0,0.08)", filter: "blur(8px)" }} />

          {/* Large area rug */}
          <div className="absolute rounded-sm" style={{ left: 45, top: 120, width: 210, height: 130, background: "linear-gradient(135deg, #B8977E, #A0806A)", opacity: 0.5 }} />
          {/* Rug inner border */}
          <div className="absolute rounded-sm" style={{ left: 55, top: 130, width: 190, height: 110, border: "1.5px solid rgba(255,255,255,0.2)" }} />

          {/* SOFA — main 3-seater */}
          <div className="absolute" style={{ left: 50, top: 130, width: 175, height: 60, background: "linear-gradient(180deg, #8C6B52, #6B4C3B)", borderRadius: "6px 6px 3px 3px", boxShadow: "0 4px 12px rgba(0,0,0,0.22)" }}>
            {/* Sofa back cushions */}
            <div className="absolute" style={{ top: 5, left: 5, right: 5, height: 26, background: "#9A7460", borderRadius: 4, display: "flex", gap: 4, padding: "0 4px" }}>
              <div style={{ flex: 1, background: "#A57D67", borderRadius: 3 }} />
              <div style={{ flex: 1, background: "#A57D67", borderRadius: 3 }} />
              <div style={{ flex: 1, background: "#A57D67", borderRadius: 3 }} />
            </div>
            {/* Sofa seat */}
            <div className="absolute" style={{ bottom: 8, left: 5, right: 5, height: 22, background: "#7A5A44", borderRadius: 3 }} />
            {/* Sofa legs */}
            <div className="absolute" style={{ bottom: 0, left: 10, width: 6, height: 8, background: "#4A342A" }} />
            <div className="absolute" style={{ bottom: 0, right: 10, width: 6, height: 8, background: "#4A342A" }} />
          </div>

          {/* Throw pillow on sofa */}
          <div className="absolute" style={{ left: 62, top: 135, width: 28, height: 22, background: "#C4A882", borderRadius: 4, transform: "rotate(-5deg)", boxShadow: "1px 2px 4px rgba(0,0,0,0.15)" }} />
          <div className="absolute" style={{ left: 180, top: 137, width: 25, height: 20, background: "#7A9E8A", borderRadius: 4, transform: "rotate(6deg)", boxShadow: "1px 2px 4px rgba(0,0,0,0.15)" }} />

          {/* ARMCHAIR */}
          <div className="absolute" style={{ left: 242, top: 170, width: 66, height: 52, background: "linear-gradient(180deg, #7A8C78, #5E6E5C)", borderRadius: "5px 5px 3px 3px", boxShadow: "0 3px 10px rgba(0,0,0,0.20)" }}>
            <div className="absolute" style={{ top: 5, left: 5, right: 5, height: 20, background: "#8A9E88", borderRadius: 3 }} />
            <div className="absolute" style={{ bottom: 5, left: 5, right: 5, height: 16, background: "#6A7E68", borderRadius: 2 }} />
          </div>

          {/* COFFEE TABLE */}
          <div className="absolute" style={{ left: 115, top: 195, width: 88, height: 46, background: "linear-gradient(135deg, #A07850, #7A5A38)", borderRadius: 4, boxShadow: "0 3px 10px rgba(0,0,0,0.18)" }}>
            {/* Table top gloss */}
            <div className="absolute" style={{ top: 2, left: 8, width: 30, height: 8, background: "rgba(255,255,255,0.15)", borderRadius: 2 }} />
            {/* Object on table — vase */}
            <div className="absolute" style={{ left: 34, top: -18, width: 14, height: 20, background: "#C4A882", borderRadius: "6px 6px 3px 3px" }}>
              <div style={{ width: 8, height: 12, background: "#7A9E6A", margin: "-10px auto 0", borderRadius: "50% 50% 0 0" }} />
            </div>
            {/* Book on table */}
            <div className="absolute" style={{ right: 10, top: 5, width: 22, height: 32, background: "#8B6A4F", borderRadius: 2, transform: "rotate(-3deg)" }} />
            <div className="absolute" style={{ right: 12, top: 3, width: 22, height: 32, background: "#C4A882", borderRadius: 2, transform: "rotate(-1deg)" }} />
          </div>

          {/* SIDE TABLE */}
          <div className="absolute" style={{ left: 218, top: 196, width: 26, height: 22, background: "#8B6A4F", borderRadius: 2, boxShadow: "0 2px 6px rgba(0,0,0,0.15)" }}>
            {/* Object on side table — candle */}
            <div className="absolute" style={{ left: 8, top: -14, width: 8, height: 16, background: "#F4EDE5", borderRadius: 2 }}>
              <div style={{ width: 2, height: 6, background: "#E8A830", margin: "-4px auto 0", borderRadius: 1 }} />
            </div>
          </div>

          {/* FLOOR LAMP */}
          <div className="absolute" style={{ left: 16, top: 90 }}>
            {/* Pole */}
            <div style={{ width: 3, height: 55, background: "linear-gradient(180deg, #8B6A4F, #6B4C3B)", margin: "0 auto", borderRadius: 2 }} />
            {/* Shade */}
            <div style={{ width: 26, height: 18, background: "linear-gradient(135deg, #F5E8D0, #E8D4B0)", borderRadius: "50% 50% 40% 40%", marginTop: -4, marginLeft: -11, boxShadow: "0 0 12px rgba(220,170,80,0.4)" }}>
              <motion.div
                style={{ width: "100%", height: "100%", borderRadius: "50% 50% 40% 40%", background: "radial-gradient(circle, rgba(255,220,100,0.5), transparent)" }}
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
            {/* Light cone */}
            <motion.div
              style={{ width: 40, height: 30, background: "linear-gradient(180deg, rgba(255,220,100,0.25), transparent)", margin: "0 auto", marginLeft: -19, filter: "blur(4px)" }}
              animate={{ opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>

          {/* LARGE PLANT */}
          <div className="absolute" style={{ right: 8, top: 50 }}>
            {/* Leaves */}
            <motion.div animate={{ rotate: [0, 2, -2, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}>
              <div style={{ width: 40, height: 50, background: "radial-gradient(ellipse, #5A8A6A, #3D6B50)", borderRadius: "60% 40% 50% 50%", boxShadow: "3px 4px 10px rgba(0,0,0,0.15)" }} />
              <div style={{ width: 28, height: 36, background: "radial-gradient(ellipse, #6A9A7A, #4A7A5E)", borderRadius: "50% 60% 40% 50%", marginTop: -20, marginLeft: 14 }} />
            </motion.div>
            {/* Pot */}
            <div style={{ width: 30, height: 22, background: "linear-gradient(180deg, #B8967A, #9A7860)", borderRadius: "4px 4px 8px 8px", margin: "0 auto", marginTop: -8, boxShadow: "0 3px 8px rgba(0,0,0,0.18)" }} />
          </div>

          {/* SMALL PLANT on floor */}
          <div className="absolute" style={{ left: 24, top: 210 }}>
            <div style={{ width: 18, height: 22, background: "radial-gradient(ellipse, #6A9A7A, #4A7A5E)", borderRadius: "50% 50% 40% 40%" }} />
            <div style={{ width: 20, height: 14, background: "#A87C60", borderRadius: "0 0 6px 6px", margin: "0 auto" }} />
          </div>
        </div>

        {/* ── BACK WALL (right face) ── */}
        <div className="absolute origin-top" style={{
          width: 190, height: 340,
          background: "linear-gradient(160deg, #F0E8DF 0%, #E5D9CE 100%)",
          transform: "rotateY(-90deg) translateZ(0px)",
          right: 0,
          boxShadow: "inset -15px 0 30px rgba(0,0,0,0.06)",
        }}>
          {/* Long shelf */}
          <div className="absolute" style={{ left: 12, top: 60, width: 160, height: 7, background: "#A07850", borderRadius: "2px 2px 1px 1px", boxShadow: "0 2px 6px rgba(0,0,0,0.15)" }}>
            {/* Books on shelf */}
            <div style={{ position: "absolute", left: 8, top: -32, width: 12, height: 32, background: "#8B6A4F", borderRadius: "2px 2px 0 0" }} />
            <div style={{ position: "absolute", left: 22, top: -42, width: 14, height: 42, background: "#C4A882", borderRadius: "2px 2px 0 0" }} />
            <div style={{ position: "absolute", left: 38, top: -28, width: 10, height: 28, background: "#7A9E8A", borderRadius: "2px 2px 0 0" }} />
            <div style={{ position: "absolute", left: 50, top: -36, width: 12, height: 36, background: "#A87860", borderRadius: "2px 2px 0 0" }} />
            {/* Decorative object */}
            <div style={{ position: "absolute", left: 90, top: -22, width: 20, height: 22, background: "#D4B896", borderRadius: "50% 50% 20% 20%" }} />
            <div style={{ position: "absolute", left: 117, top: -34, width: 10, height: 34, background: "#6A8C7A", borderRadius: "2px 2px 0 0" }} />
            <div style={{ position: "absolute", left: 130, top: -28, width: 14, height: 28, background: "#9E7C60", borderRadius: "2px 2px 0 0" }} />
          </div>

          {/* Framed art piece 1 */}
          <div className="absolute" style={{ left: 20, top: 105, width: 55, height: 70, border: "3px solid #A07850", background: "linear-gradient(135deg, #D4A574, #A8765E)", boxShadow: "0 2px 10px rgba(0,0,0,0.12)" }}>
            {/* Abstract lines inside art */}
            <div style={{ position: "absolute", top: "20%", left: "10%", right: "10%", height: 1, background: "rgba(255,255,255,0.4)" }} />
            <div style={{ position: "absolute", top: "40%", left: "20%", right: "30%", height: 1, background: "rgba(255,255,255,0.3)" }} />
            <div style={{ position: "absolute", top: "60%", left: "10%", right: "20%", height: 1, background: "rgba(255,255,255,0.25)" }} />
          </div>

          {/* Framed art piece 2 */}
          <div className="absolute" style={{ left: 90, top: 115, width: 40, height: 55, border: "2px solid #A07850", background: "linear-gradient(180deg, #EDE0D0, #C4A882)", boxShadow: "0 2px 8px rgba(0,0,0,0.10)" }}>
            <div style={{ position: "absolute", top: "30%", left: "15%", right: "15%", height: 1, background: "rgba(90,60,40,0.3)" }} />
            <div style={{ position: "absolute", top: "55%", left: "25%", right: "10%", height: 1, background: "rgba(90,60,40,0.2)" }} />
          </div>

          {/* Pendant light shadow on wall */}
          <div className="absolute" style={{ top: 0, left: "50%", transform: "translateX(-50%)", width: 2, height: 30, background: "#9E7C60" }} />
          <div className="absolute" style={{ top: 28, left: "50%", transform: "translateX(-50%) translateX(-10px)", width: 20, height: 14, background: "#C8A46A", borderRadius: "50% 50% 40% 40%", boxShadow: "0 0 12px rgba(200,164,106,0.4)" }} />
        </div>

        {/* ── LEFT WALL (front face) ── */}
        <div className="absolute origin-left" style={{
          width: 340, height: 190,
          background: "linear-gradient(200deg, #F5EDE4 0%, #EAE0D6 100%)",
          transform: "rotateX(90deg) translateZ(0px)",
          top: 0,
          boxShadow: "inset -10px 0 25px rgba(0,0,0,0.05)",
        }}>
          {/* WINDOW */}
          <div className="absolute" style={{ left: 90, top: 30, width: 100, height: 110 }}>
            {/* Window frame outer */}
            <div style={{ width: "100%", height: "100%", border: "4px solid #B8A088", borderRadius: 3, overflow: "hidden", background: "linear-gradient(135deg, rgba(255,245,215,0.98), rgba(240,220,160,0.9))", boxShadow: "inset 0 0 20px rgba(255,210,80,0.25), 0 4px 20px rgba(0,0,0,0.12)" }}>
              {/* Window panes */}
              <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: 2, background: "#B8A088", transform: "translateX(-50%)" }} />
              <div style={{ position: "absolute", top: "45%", left: 0, right: 0, height: 2, background: "#B8A088", transform: "translateY(-50%)" }} />
              {/* Glass sheen */}
              <div style={{ position: "absolute", top: 6, left: 6, width: "35%", height: "40%", background: "rgba(255,255,255,0.55)", borderRadius: 2 }} />
              <div style={{ position: "absolute", top: 6, right: 6, width: "25%", height: "20%", background: "rgba(255,255,255,0.4)", borderRadius: 2 }} />
            </div>
            {/* Warm light ray from window */}
            <motion.div
              style={{ position: "absolute", top: "100%", left: "-20%", width: "140%", height: 80, background: "linear-gradient(180deg, rgba(255,210,100,0.22), transparent)", transformOrigin: "top", filter: "blur(6px)" }}
              animate={{ opacity: [0.4, 0.9, 0.4], scaleX: [0.9, 1.05, 0.9] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>

          {/* Wall texture accent strip */}
          <div className="absolute" style={{ right: 0, top: 0, bottom: 0, width: 28, background: "linear-gradient(90deg, transparent, rgba(0,0,0,0.03))" }} />
          {/* Baseboard */}
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
  const swatches = [
    { color: "#C4A882", label: "Oak Honey",   x: "3%",  y: "6%",  delay: 1.0 },
    { color: "#8B6A4F", label: "Walnut",      x: "66%", y: "4%",  delay: 1.4 },
    { color: "#7A9E8A", label: "Sage Green",  x: "4%",  y: "68%", delay: 1.8 },
    { color: "#D9C9B5", label: "Ivory Stone", x: "65%", y: "78%", delay: 2.2 },
    { color: "#A87860", label: "Terracotta",  x: "34%", y: "88%", delay: 2.6 },
  ];

  const tags = [
    { label: "Fluted Panels",        x: "56%", y: "22%", delay: 1.6 },
    { label: "Warm Cove Lighting ✦", x: "2%",  y: "38%", delay: 2.0 },
    { label: "Japandi Style",        x: "56%", y: "55%", delay: 2.4 },
    { label: "Micro Concrete",       x: "2%",  y: "82%", delay: 2.8 },
  ];

  return (
    <div className="w-full h-full absolute inset-0 overflow-hidden">
      {/* Layered background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#F7EFE5] via-[#FAF6F0] to-[#EAE0D2]" />

      {/* Centre ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
        style={{ width: 520, height: 520, background: "radial-gradient(circle, rgba(200,164,106,0.16) 0%, transparent 68%)" }} />

      {/* Corner soft glow — top right */}
      <div className="absolute -top-16 -right-16 rounded-full pointer-events-none"
        style={{ width: 300, height: 300, background: "radial-gradient(circle, rgba(200,164,106,0.1) 0%, transparent 70%)" }} />

      {/* Isometric Room */}
      <IsometricRoom />

      {/* Swatches */}
      {swatches.map((s, i) => <Swatch key={i} {...s} />)}

      {/* Tags */}
      {tags.map((t, i) => <Tag key={i} {...t} />)}

      {/* AI scanning line */}
      <motion.div
        className="absolute left-0 right-0 pointer-events-none"
        style={{ height: 1.5, background: "linear-gradient(90deg, transparent 0%, rgba(200,164,106,0.55) 40%, rgba(200,164,106,0.55) 60%, transparent 100%)" }}
        animate={{ top: ["8%", "92%", "8%"] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Subtle vignette */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at center, transparent 55%, rgba(234,224,210,0.35) 100%)" }} />
    </div>
  );
}

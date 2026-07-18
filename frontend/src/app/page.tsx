"use client";

import { useState, useRef, ReactNode, useEffect } from "react";
import dynamic from "next/dynamic";
import { motion, useScroll, useTransform, useSpring, useMotionValue, useInView } from "framer-motion";
import { ArrowRight, Sparkles, Compass, Key, Hexagon, Home, Palette, Armchair, Sun, Coins, Box } from "lucide-react";
import AssessmentForm from "@/components/AssessmentForm";

const HeroScene = dynamic(() => import("@/components/HeroScene"), { ssr: false });

/* ─── Global Mouse Parallax Hook ─── */
function useMouseParallax() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 40, damping: 25 });
  const springY = useSpring(y, { stiffness: 40, damping: 25 });
  useEffect(() => {
    const move = (e: MouseEvent) => {
      x.set((e.clientX / window.innerWidth - 0.5) * 2);
      y.set((e.clientY / window.innerHeight - 0.5) * 2);
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);
  return { springX, springY };
}

/* ─── 3D Tilt Card on Hover ─── */
function TiltCard({ children, className, depth = 20 }: { children: ReactNode; className?: string; depth?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const rotX = useMotionValue(0);
  const rotY = useMotionValue(0);
  const sRotX = useSpring(rotX, { stiffness: 120, damping: 20 });
  const sRotY = useSpring(rotY, { stiffness: 120, damping: 20 });

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const px = ((e.clientX - left) / width - 0.5) * 2;
    const py = ((e.clientY - top) / height - 0.5) * 2;
    rotY.set(px * depth);
    rotX.set(-py * depth);
  };
  const handleLeave = () => { rotX.set(0); rotY.set(0); };

  return (
    <motion.div
      ref={ref} onMouseMove={handleMove} onMouseLeave={handleLeave}
      style={{ rotateX: sRotX, rotateY: sRotY, transformStyle: "preserve-3d", perspective: 800 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─── Magnetic Button ─── */
function MagneticButton({ children, className, onClick }: { children: ReactNode; className?: string; onClick?: () => void }) {
  const ref = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0); const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 150, damping: 15, mass: 0.1 });
  const sy = useSpring(y, { stiffness: 150, damping: 15, mass: 0.1 });
  const handleMouse = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { left, top, width, height } = ref.current!.getBoundingClientRect();
    x.set((e.clientX - (left + width / 2)) * 0.25);
    y.set((e.clientY - (top + height / 2)) * 0.25);
  };
  return (
    <motion.button ref={ref} onMouseMove={handleMouse} onMouseLeave={() => { x.set(0); y.set(0); }}
      style={{ x: sx, y: sy }} onClick={onClick} className={className}>{children}</motion.button>
  );
}

/* ─── 3D Section Title ─── */
function SectionTitle({ eyebrow, title, italic, center = false }: { eyebrow: string; title: string; italic: string; center?: boolean }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <div ref={ref} className={center ? "text-center" : ""}>
      <motion.p
        initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}
        className="text-[#CB5A35] text-[10px] tracking-[0.35em] uppercase font-bold mb-5 flex items-center gap-3" style={center ? { justifyContent: "center" } : {}}
      >
        <span className="w-8 h-[1.5px] bg-[#CB5A35]" />{eyebrow}
      </motion.p>
      <motion.h2
        initial={{ opacity: 0, rotateX: -30, y: 30 }} animate={inView ? { opacity: 1, rotateX: 0, y: 0 } : {}}
        transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        style={{ perspective: 800, transformStyle: "preserve-3d" }}
        className="font-serif text-4xl md:text-5xl lg:text-6xl font-light text-[#1A1A1A] leading-tight"
      >
        {title} <span className="italic text-[#CB5A35]">{italic}</span>
      </motion.h2>
    </div>
  );
}

export default function HomePage() {
  const [started, setStarted] = useState(false);
  const { scrollYProgress } = useScroll();
  const yHero = useTransform(scrollYProgress, [0, 0.5], [0, 150]);
  const { springX, springY } = useMouseParallax();

  // Declare ALL useTransform values at top level — never inside JSX (Rules of Hooks)
  const navX = useTransform(springX, (v: number) => v * -8);
  const navY = useTransform(springY, (v: number) => v * -4);
  const h1X = useTransform(springX, (v: number) => v * -18);
  const h1Y = useTransform(springY, (v: number) => v * -10);
  const subX = useTransform(springX, (v: number) => v * -8);
  const subY = useTransform(springY, (v: number) => v * -4);
  const statsX = useTransform(springX, (v: number) => v * -4);
  const statsY = useTransform(springY, (v: number) => v * -2);

  if (started) return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
      <AssessmentForm />
    </motion.div>
  );

  return (
    <div className="bg-[#F2EFE8] min-h-screen text-[#1A1A1A] font-sans selection:bg-[#CB5A35] selection:text-white overflow-x-hidden">

      {/* NAVBAR */}
      <nav className="absolute top-0 w-full px-8 md:px-16 py-8 flex justify-between items-center z-50">
        <motion.div style={{ x: navX, y: navY }} className="flex items-center cursor-pointer group">
          <img src="/logo.png" alt="Thinkhome" className="h-14 md:h-16 w-auto object-contain" />
        </motion.div>
        <div />
      </nav>

      {/* ═══ HERO — Split Screen ═══ */}
      <section className="relative min-h-screen flex flex-col lg:flex-row overflow-hidden" style={{ perspective: "1200px" }}>

        {/* Left: Text — Mouse Parallax layers */}
        <div className="w-full lg:w-[52%] flex flex-col justify-center px-8 md:px-16 lg:pl-24 lg:pr-12 z-20 pt-48 lg:pt-48 pb-16 lg:pb-16 relative">
          
          {/* Small HOME DNA label */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="flex items-center gap-3 mb-6">
            <span className="w-8 h-[1px] bg-[#B68A5A]" />
            <span className="text-[10px] tracking-[0.3em] uppercase font-semibold text-[#B68A5A]">Home DNA</span>
          </motion.div>

          {/* 3D Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            style={{ x: h1X, y: h1Y }}
            className="font-serif text-5xl md:text-6xl lg:text-[76px] font-light leading-[1.1] mb-8 text-[#1A1A1A] tracking-tight"
          >
            Discover Your <br />
            <span className="italic text-[#B68A5A]">Home DNA.</span>
          </motion.h1>

          {/* Premium Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.3 }}
            style={{ x: subX, y: subY }}
            className="font-sans text-[#555555] text-lg lg:text-xl font-light leading-relaxed mb-10 max-w-[480px]"
          >
            Unlock the architectural language that is inherently yours. A curated methodology mapping your personal aesthetic to spatial reality.
          </motion.p>

          {/* Elegant Feature Pills */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }} className="flex flex-wrap gap-3 mb-12">
            {["Lifestyle", "Personality", "Budget", "Family"].map(pill => (
              <span key={pill} className="px-4 py-1.5 border border-[#E2DCD3] rounded-full text-[10px] uppercase tracking-widest text-[#666] bg-white/50 backdrop-blur-sm">
                {pill}
              </span>
            ))}
          </motion.div>

          {/* CTA & Trust Indicators */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.5 }} className="flex flex-col gap-5">
            <MagneticButton onClick={() => setStarted(true)} className="group relative w-fit overflow-hidden bg-[#111111] text-white px-12 py-5 rounded-full font-sans tracking-[0.2em] text-[10px] uppercase hover:bg-[#B68A5A] transition-colors duration-500 shadow-2xl flex items-center gap-4">
              <span>Start Assessment</span>
              <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
            </MagneticButton>
            <p className="text-[9px] tracking-widest text-[#888] uppercase font-semibold">
              3-Minute Assessment <span className="mx-2 text-[#E2DCD3]">|</span> Free Report <span className="mx-2 text-[#E2DCD3]">|</span> AI Powered
            </p>
          </motion.div>

          {/* Refined Statistics */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2, duration: 1 }}
            style={{ x: statsX, y: statsY }}
            className="flex items-center gap-12 mt-20 pt-8 border-t border-[#E2DCD3] max-w-[480px]"
          >
            {[["500+", "Homes Curated"], ["98%", "Style Accuracy"]].map(([val, label]) => (
              <div key={label} className="group cursor-default flex flex-col">
                <p className="font-serif text-3xl text-[#1A1A1A] font-light group-hover:text-[#B68A5A] transition-colors">{val}</p>
                <p className="text-[9px] tracking-[0.2em] uppercase text-[#888] mt-2 font-semibold">{label}</p>
              </div>
            ))}
          </motion.div>

          {/* Floating Glass Card (Overlapping right) */}
          <TiltCard depth={10} className="hidden lg:block absolute right-[-60px] top-[60%] -translate-y-1/2 z-30">
            <div className="bg-white/60 backdrop-blur-xl border border-white/80 p-6 rounded-[24px] shadow-2xl w-[260px]" style={{ transformStyle: "preserve-3d" }}>
              <div style={{ transform: "translateZ(20px)" }}>
                <p className="text-[9px] tracking-[0.2em] uppercase text-[#B68A5A] font-bold mb-2">Live Analysis</p>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-[#111111] flex items-center justify-center">
                    <Hexagon size={16} className="text-[#B68A5A]" />
                  </div>
                  <div>
                    <p className="font-serif text-lg text-[#1A1A1A] leading-tight">Japandi Luxe</p>
                    <p className="text-[9px] tracking-widest uppercase text-[#888] mt-1">Primary Style</p>
                  </div>
                </div>
                <div className="h-px w-full bg-gradient-to-r from-transparent via-[#E2DCD3] to-transparent mb-4" />
                <div className="flex justify-between items-center text-[10px] uppercase tracking-widest text-[#555]">
                  <span>Precision</span>
                  <span className="font-bold text-[#1A1A1A]">99%</span>
                </div>
              </div>
            </div>
          </TiltCard>

        </div>

        {/* Right: 3D Scene */}
        <div className="w-full lg:w-[48%] relative h-[55vh] lg:h-screen">
          <div className="absolute inset-0 bg-gradient-to-br from-[#EAE6DB] via-[#F2EFE8] to-[#E2D8CC]" />
          <HeroScene />
        </div>
      </section>

      {/* ═══ THREE PILLARS — 3D Tilt Cards ═══ */}
      <section className="py-32 px-8 md:px-16 lg:px-24 bg-white" style={{ perspective: "1200px" }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <SectionTitle eyebrow="Why Home DNA" title="Design Based on" italic="Intelligence." center />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: <Compass size={28} strokeWidth={1} />, title: "Spatial Psychology", desc: "We analyze how you move and live to recommend layouts that reduce friction and increase daily comfort." },
              { icon: <Hexagon size={28} strokeWidth={1} />, title: "Material Harmonics", desc: "Textures and tones mathematically matched to your aesthetic preferences and maintenance capacity." },
              { icon: <Key size={28} strokeWidth={1} />, title: "Lifestyle Blueprint", desc: "A tailored architectural direction you can hand directly to your contractor or interior designer." }
            ].map((item, i) => (
              <TiltCard key={i} depth={18} className="cursor-default">
                <motion.div
                  initial={{ opacity: 0, y: 40, rotateX: -20 }} whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                  viewport={{ once: true, margin: "-60px" }} transition={{ delay: i * 0.15, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                  className="h-full bg-[#F2EFE8] border border-[#E2DCD3] rounded-[28px] p-10 flex flex-col items-center text-center group hover:shadow-2xl transition-shadow duration-500"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <div className="w-16 h-16 rounded-full bg-[#EAE6DB] flex items-center justify-center text-[#CB5A35] mb-8 group-hover:scale-110 group-hover:bg-[#CB5A35] group-hover:text-white transition-all duration-500 shadow-sm" style={{ transform: "translateZ(30px)" }}>
                    {item.icon}
                  </div>
                  <h3 className="font-serif text-2xl text-[#1A1A1A] mb-4" style={{ transform: "translateZ(20px)" }}>{item.title}</h3>
                  <div className="w-8 h-[1.5px] bg-[#E2DCD3] mb-4 group-hover:w-16 group-hover:bg-[#CB5A35] transition-all duration-500" />
                  <p className="font-sans text-[#666] leading-relaxed font-light text-sm" style={{ transform: "translateZ(10px)" }}>{item.desc}</p>
                </motion.div>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ WHAT YOU GET — Premium Numbered Feature Grid ═══ */}
      <section className="py-32 px-8 md:px-16 lg:px-24 bg-[#F2EFE8] relative overflow-hidden" style={{ perspective: "1200px" }}>
        {/* Subtle warm glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(203,90,53,0.06) 0%, transparent 70%)" }} />

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Header */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-20 gap-10">
            <motion.div
              initial={{ opacity: 0, rotateY: -15, x: -40 }} whileInView={{ opacity: 1, rotateY: 0, x: 0 }}
              viewport={{ once: true }} transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              style={{ transformStyle: "preserve-3d" }}
            >
              <p className="text-[#CB5A35] text-[10px] tracking-[0.35em] uppercase font-bold mb-5 flex items-center gap-3">
                <span className="w-8 h-[1.5px] bg-[#CB5A35]" />Your Report Includes
              </p>
              <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light leading-tight text-[#1A1A1A]">
                Everything You <br /><span className="italic text-[#CB5A35]">Need to Build.</span>
              </h2>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 1, delay: 0.2 }}>
              <p className="text-[#666] text-base font-light max-w-sm leading-relaxed border-l-2 border-[#CB5A35]/30 pl-6">
                A complete architectural brief you can hand directly to any designer or contractor.
              </p>
            </motion.div>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: <Home size={22} strokeWidth={1} />, num: "01", title: "Interior Personality", desc: "Your exact aesthetic language and architectural identity — defined clearly and concisely." },
              { icon: <Palette size={22} strokeWidth={1} />, num: "02", title: "Colour Palette", desc: "A harmonious set of curated tones perfectly matched to your mood and lifestyle." },
              { icon: <Armchair size={22} strokeWidth={1} />, num: "03", title: "Furniture Style", desc: "Curated furniture profiles that align with your comfort preferences and spatial scale." },
              { icon: <Sun size={22} strokeWidth={1} />, num: "04", title: "Lighting Plan", desc: "Ambient, task, and accent lighting recommendations tailored to your daily routine." },
              { icon: <Coins size={22} strokeWidth={1} />, num: "05", title: "Budget Estimate", desc: "Realistic Indian Rupee (₹) projections based on your property size and finish level." },
              { icon: <Box size={22} strokeWidth={1} />, num: "06", title: "Storage Strategy", desc: "Smart storage recommendations built entirely around your lifestyle and habits." },
            ].map((item, i) => (
              <TiltCard key={i} depth={14}>
                <motion.div
                  initial={{ opacity: 0, y: 40, rotateX: -15 }} whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                  viewport={{ once: true, margin: "-40px" }} transition={{ delay: i * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="relative bg-white border border-[#E2DCD3] rounded-[24px] p-8 group hover:border-[#CB5A35]/40 hover:shadow-xl transition-all duration-500 overflow-hidden h-full flex flex-col"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  {/* Top row: icon + number */}
                  <div className="flex items-start justify-between mb-6" style={{ transform: "translateZ(20px)" }}>
                    <div className="w-12 h-12 rounded-2xl bg-[#EAE6DB] border border-[#E2DCD3] flex items-center justify-center text-[#CB5A35] group-hover:bg-[#CB5A35] group-hover:text-white group-hover:border-[#CB5A35] transition-all duration-500">
                      {item.icon}
                    </div>
                    <span className="font-serif text-4xl font-light text-[#E2DCD3] group-hover:text-[#CB5A35]/20 transition-colors duration-500 leading-none">{item.num}</span>
                  </div>

                  {/* Divider */}
                  <div className="w-full h-[1px] bg-[#E2DCD3] mb-6 group-hover:bg-[#CB5A35]/30 transition-colors duration-500" />

                  {/* Content */}
                  <div style={{ transform: "translateZ(14px)" }} className="flex-1">
                    <h4 className="font-serif text-xl text-[#1A1A1A] mb-3 group-hover:text-[#CB5A35] transition-colors duration-300">{item.title}</h4>
                    <p className="text-[#888] text-sm font-sans leading-relaxed group-hover:text-[#555] transition-colors duration-300">{item.desc}</p>
                  </div>

                  {/* Bottom accent bar */}
                  <div className="mt-8 w-0 h-[1.5px] bg-[#CB5A35] group-hover:w-full transition-all duration-700 ease-out rounded-full" style={{ transform: "translateZ(8px)" }} />

                  {/* Corner glow */}
                  <div className="absolute -top-10 -right-10 w-28 h-28 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ background: "radial-gradient(circle, rgba(203,90,53,0.08), transparent)" }} />
                </motion.div>
              </TiltCard>
            ))}
          </div>

          {/* Bottom CTA */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.6, duration: 0.8 }} className="flex justify-center mt-16">
            <MagneticButton onClick={() => setStarted(true)} className="group flex items-center gap-4 bg-[#1A1A1A] text-white px-10 py-4 rounded-full font-sans tracking-[0.2em] text-[10px] uppercase hover:bg-[#CB5A35] transition-colors duration-500 shadow-lg">
              <span>Get Your Full Report</span>
              <ArrowRight size={13} className="group-hover:translate-x-2 transition-transform" />
            </MagneticButton>
          </motion.div>
        </div>
      </section>

      {/* ═══ STYLE GALLERY — 3D Image Cards ═══ */}
      <section className="py-32 px-8 md:px-16 lg:px-24 bg-[#F2EFE8]" style={{ perspective: "1200px" }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <SectionTitle eyebrow="The Possibilities" title="Curated" italic="Visions." />
            <p className="font-sans text-[#666] text-lg font-light max-w-md">Our algorithm synthesizes your habits into a singular, perfect architectural direction.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TiltCard depth={10}>
              <motion.div
                initial={{ opacity: 0, rotateY: -20, x: -40 }} whileInView={{ opacity: 1, rotateY: 0, x: 0 }}
                viewport={{ once: true }} transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="group cursor-pointer rounded-[32px] overflow-hidden relative h-[500px]" style={{ transformStyle: "preserve-3d" }}
              >
                <img src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80" alt="Executive Minimalist" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                <div className="absolute bottom-0 left-0 p-10" style={{ transform: "translateZ(25px)" }}>
                  <span className="text-[9px] tracking-widest uppercase font-bold bg-white/90 backdrop-blur-md px-3 py-1 inline-block rounded-full text-[#CB5A35] mb-3">Contemporary</span>
                  <h3 className="font-serif text-3xl text-white">Executive Minimalist</h3>
                </div>
              </motion.div>
            </TiltCard>

            <div className="grid grid-rows-2 gap-6 h-[500px]">
              {[
                { img: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80", title: "Japandi Retreat", tag: "Japandi" },
                { img: "https://images.unsplash.com/photo-1600210491369-e753d80a41f3?auto=format&fit=crop&q=80", title: "Organic Modern", tag: "Biophilic" }
              ].map((style, i) => (
                <TiltCard key={i} depth={10}>
                  <motion.div
                    initial={{ opacity: 0, rotateY: 20, x: 40 }} whileInView={{ opacity: 1, rotateY: 0, x: 0 }}
                    viewport={{ once: true }} transition={{ delay: (i + 1) * 0.2, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    className="group cursor-pointer rounded-[32px] overflow-hidden relative h-full" style={{ transformStyle: "preserve-3d" }}
                  >
                    <img src={style.img} alt={style.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 p-8" style={{ transform: "translateZ(20px)" }}>
                      <span className="text-[9px] tracking-widest uppercase font-bold bg-white/90 backdrop-blur-md px-3 py-1 inline-block rounded-full text-[#CB5A35] mb-2">{style.tag}</span>
                      <h3 className="font-serif text-2xl text-white">{style.title}</h3>
                    </div>
                  </motion.div>
                </TiltCard>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ FINAL CTA — 3D Floating Card ═══ */}
      <section className="py-32 px-8 bg-white border-t border-[#E2DCD3]" style={{ perspective: "1400px" }}>
        <TiltCard depth={8} className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, rotateX: -20, y: 60 }} whileInView={{ opacity: 1, rotateX: 0, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="bg-[#F2EFE8] border border-[#E2DCD3] rounded-[40px] p-16 text-center shadow-2xl"
            style={{ transformStyle: "preserve-3d" }}
          >
            <div className="w-16 h-16 rounded-full bg-[#EAE6DB] flex items-center justify-center text-[#CB5A35] mx-auto mb-8" style={{ transform: "translateZ(30px)" }}>
              <Home size={24} strokeWidth={1.5} />
            </div>
            <h2 className="font-serif text-5xl md:text-6xl font-light mb-8 text-[#1A1A1A]" style={{ transform: "translateZ(20px)" }}>
              Ready to meet your <br /><span className="italic text-[#CB5A35]">future home?</span>
            </h2>
            <p className="font-sans text-[#666] text-lg font-light mb-12" style={{ transform: "translateZ(15px)" }}>
              Take the 3-minute assessment and unlock a personalized architectural direction — completely free.
            </p>
            <div style={{ transform: "translateZ(35px)" }}>
              <MagneticButton
                onClick={() => setStarted(true)}
                className="mx-auto group bg-[#CB5A35] text-white px-12 py-5 rounded-full font-sans tracking-[0.2em] text-[10px] uppercase hover:bg-[#1A1A1A] transition-colors duration-500 shadow-xl flex items-center gap-4"
              >
                <span>Start Free Analysis</span>
                <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
              </MagneticButton>
            </div>
          </motion.div>
        </TiltCard>
      </section>

      <footer className="bg-[#0A0A0A] text-[#888888] pt-24 pb-12 px-8 md:px-16 lg:px-24 border-t border-[#222]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          
          {/* Column 1: Logo & Description */}
          <div className="flex flex-col">
            <div className="mb-6">
              <img src="/logo.png" alt="Thinkhome Logo" className="h-16 w-auto object-contain" />
            </div>
            <p className="font-sans text-sm font-light leading-relaxed max-w-[280px]">
              A bridge built on trust, quality, and the vision to transform how interior sourcing works in India. Bridging the gap between vision and reality.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-[10px] tracking-[0.2em] uppercase text-[#555] mb-8 font-semibold">Quick Links</h4>
            <ul className="space-y-4 text-sm font-light text-[#D1D1D1]">
              <li><a href="#" className="hover:text-[#CB5A35] transition-colors">Home</a></li>
              <li><a href="#" className="hover:text-[#CB5A35] transition-colors">About</a></li>
              <li><a href="#" className="hover:text-[#CB5A35] transition-colors">Portfolio</a></li>
              <li><a href="#" className="hover:text-[#CB5A35] transition-colors">Journal</a></li>
              <li><a href="#" className="hover:text-[#CB5A35] transition-colors">Testimonials</a></li>
              <li><a href="#" className="hover:text-[#CB5A35] transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-[#CB5A35] transition-colors">Privacy & Policy</a></li>
              <li><a href="#" className="hover:text-[#CB5A35] transition-colors">Terms & Condition</a></li>
            </ul>
          </div>

          {/* Column 3: Services */}
          <div>
            <h4 className="text-[10px] tracking-[0.2em] uppercase text-[#555] mb-8 font-semibold">Services</h4>
            <ul className="space-y-4 text-sm font-light text-[#D1D1D1]">
              <li><a href="#" className="hover:text-[#CB5A35] transition-colors">Designer Matching</a></li>
              <li><a href="#" className="hover:text-[#CB5A35] transition-colors">Curated Partnerships</a></li>
              <li><a href="#" className="hover:text-[#CB5A35] transition-colors">Client Verification</a></li>
              <li><a href="#" className="hover:text-[#CB5A35] transition-colors">Strategic Growth</a></li>
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div>
            <h4 className="text-[10px] tracking-[0.2em] uppercase text-[#555] mb-8 font-semibold">Contact</h4>
            
            <div className="mb-8">
              <h5 className="text-[9px] tracking-[0.15em] uppercase text-[#555] mb-3">Office</h5>
              <p className="text-sm font-light text-[#D1D1D1] leading-relaxed max-w-[250px]">
                Plaza Asiad, Swami Vivekanand Rd,<br/>
                Willingdon,<br/>
                Santacruz (West), Mumbai, Maharashtra<br/>
                400054
              </p>
            </div>

            <div>
              <h5 className="text-[9px] tracking-[0.15em] uppercase text-[#555] mb-3">Enquiries</h5>
              <p className="text-sm font-light text-[#D1D1D1] mb-1">+91 90760 00109</p>
              <p className="text-sm font-light text-[#D1D1D1]">hey@thinkhome.in</p>
            </div>
          </div>

        </div>
      </footer>
    </div>
  );
}

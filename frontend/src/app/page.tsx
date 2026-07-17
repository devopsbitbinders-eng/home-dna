"use client";

import { useState, useRef, ReactNode, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring, useMotionValue, AnimatePresence } from "framer-motion";
import { ArrowRight, Sparkles, Home, Palette, Armchair, Sun, Coins, Box, ChevronRight } from "lucide-react";
import AssessmentForm from "@/components/AssessmentForm";

// MAGNETIC BUTTON
function MagneticButton({ children, className, onClick }: { children: ReactNode, className?: string, onClick?: () => void }) {
  const ref = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 150, damping: 15, mass: 0.1 });
  const springY = useSpring(y, { stiffness: 150, damping: 15, mass: 0.1 });

  const handleMouse = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current!.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    x.set(middleX * 0.2);
    y.set(middleY * 0.2);
  };

  const reset = () => { x.set(0); y.set(0); };

  return (
    <motion.button
      ref={ref} onMouseMove={handleMouse} onMouseLeave={reset}
      animate={{ x: 0, y: 0 }} style={{ x: springX, y: springY }} onClick={onClick}
      className={className}
    >
      {children}
    </motion.button>
  );
}

export default function HomePage() {
  const [started, setStarted] = useState(false);
  const { scrollYProgress } = useScroll();
  const yHero = useTransform(scrollYProgress, [0, 1], [0, 300]);
  const opacityHero = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  // Glowing Orb Animation
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  if (started) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
        <AssessmentForm />
      </motion.div>
    );
  }

  return (
    <div className="bg-[#050505] min-h-screen text-white font-sans selection:bg-[#D4AF37] selection:text-[#050505] overflow-x-hidden relative">
      
      {/* Dynamic Background Glow */}
      <div 
        className="pointer-events-none fixed inset-0 z-0 opacity-40 transition-transform duration-1000 ease-out"
        style={{
          background: `radial-gradient(circle 800px at ${mousePosition.x}px ${mousePosition.y}px, rgba(212, 175, 55, 0.08), transparent 80%)`
        }}
      />
      
      {/* NAVBAR */}
      <nav className="absolute top-0 w-full p-8 md:px-16 lg:px-24 flex justify-between items-center z-50">
        <div className="flex items-center gap-4 cursor-pointer group">
          <div className="w-8 h-8 flex items-center justify-center border border-white/20 rounded-full group-hover:border-[#D4AF37] transition-colors">
            <div className="w-3 h-3 bg-white rounded-full group-hover:bg-[#D4AF37] transition-colors shadow-[0_0_10px_rgba(212,175,55,0.8)]"></div>
          </div>
          <span className="tracking-[0.4em] text-[10px] uppercase font-semibold text-white/90">Home DNA</span>
        </div>
        <button onClick={() => setStarted(true)} className="text-[10px] tracking-[0.2em] uppercase font-semibold text-white/60 hover:text-white transition-colors">
          Begin Assessment
        </button>
      </nav>

      {/* HERO SECTION */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
        <motion.div style={{ y: yHero, opacity: opacityHero }} className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/40 via-[#050505]/60 to-[#050505] z-10" />
          <img 
            src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80" 
            alt="Luxury Dark Interior" 
            className="w-full h-[120%] object-cover object-center"
          />
        </motion.div>

        <div className="relative z-20 text-center px-4 max-w-5xl mx-auto mt-20">
          <motion.div initial={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }} animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }} transition={{ duration: 1.5, ease: "easeOut" }}>
            <p className="text-[#D4AF37] text-[10px] tracking-[0.4em] uppercase mb-8 font-semibold flex items-center justify-center gap-4">
              <span className="w-12 h-px bg-[#D4AF37]/50" />
              AI-Powered Architecture
              <span className="w-12 h-px bg-[#D4AF37]/50" />
            </p>
            <h1 className="font-serif text-6xl md:text-8xl lg:text-[100px] font-light leading-[1.1] mb-8 text-white tracking-tight">
              Design Your <br />
              <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#D4AF37]">Legacy.</span>
            </h1>
          </motion.div>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.5, ease: "easeOut" }} className="font-sans text-white/60 text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed mb-16">
            An ultra-personalized interior intelligence that aligns your architectural environment with your deepest lifestyle aspirations.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.8 }} className="flex justify-center">
            <MagneticButton onClick={() => setStarted(true)} className="group relative overflow-hidden bg-white/5 backdrop-blur-md border border-white/10 text-white px-12 py-5 rounded-full font-sans tracking-[0.2em] text-[10px] uppercase hover:bg-white hover:text-[#050505] transition-all duration-700 flex items-center gap-4 shadow-[0_0_40px_rgba(212,175,55,0.1)] hover:shadow-[0_0_60px_rgba(212,175,55,0.3)]">
              <span>Initialize Assessment</span>
              <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
            </MagneticButton>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2, duration: 1 }} className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 z-20">
          <span className="text-[8px] tracking-[0.3em] uppercase text-white/40">Scroll to explore</span>
          <div className="w-px h-12 bg-gradient-to-b from-white/40 to-transparent" />
        </motion.div>
      </section>

      {/* INTELLIGENCE SECTION */}
      <section className="py-32 px-8 md:px-16 lg:px-24 relative z-20 bg-[#050505]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-20 items-center">
            <div className="w-full lg:w-1/2">
              <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 1 }}>
                <p className="text-[#D4AF37] text-[10px] tracking-[0.3em] uppercase mb-6 font-semibold">The Algorithm</p>
                <h2 className="font-serif text-5xl md:text-6xl font-light mb-8 leading-tight">Beyond Generic <br/><span className="italic text-white/50">Aesthetics.</span></h2>
                <p className="font-sans text-white/60 text-lg font-light leading-relaxed mb-12">
                  We don't just ask for your favorite color. We analyze your daily routines, entertaining habits, and psychological comfort triggers to construct a spatial profile that feels inherently yours.
                </p>
                
                <div className="grid grid-cols-2 gap-8">
                  {[
                    { title: "Spatial Psychology", desc: "Environments tuned to your mood." },
                    { title: "Material Harmonics", desc: "Textures that resonate with you." },
                    { title: "Lighting Dynamics", desc: "Illumination for your circadian rhythm." },
                    { title: "Ergonomic Flow", desc: "Layouts built for your movement." }
                  ].map((item, i) => (
                    <div key={i} className="border-l border-white/10 pl-6 hover:border-[#D4AF37] transition-colors duration-500">
                      <h4 className="font-sans text-sm text-white tracking-wide mb-2">{item.title}</h4>
                      <p className="font-sans text-[11px] text-white/40 leading-relaxed">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            <div className="w-full lg:w-1/2 relative h-[600px]">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 1.5, ease: "easeOut" }}
                className="absolute inset-0 rounded-[40px] overflow-hidden border border-white/10"
              >
                <img src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80" alt="Dark Luxury Architecture" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-tr from-[#050505] via-transparent to-transparent opacity-80" />
              </motion.div>

              {/* Glassmorphic Floating Card */}
              <motion.div 
                initial={{ y: 50, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.5, duration: 1 }}
                className="absolute -bottom-10 -left-10 bg-white/5 backdrop-blur-2xl border border-white/10 p-8 rounded-3xl shadow-[0_30px_60px_rgba(0,0,0,0.5)] max-w-xs"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37] border border-[#D4AF37]/30">
                    <Sparkles size={20} />
                  </div>
                  <div>
                    <p className="text-[9px] tracking-[0.2em] uppercase text-white/60">AI Confidence</p>
                    <p className="text-xl font-serif text-white">98.5% Match</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden"><div className="w-[98%] h-full bg-[#D4AF37]"></div></div>
                  <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden"><div className="w-[85%] h-full bg-white/50"></div></div>
                  <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden"><div className="w-[92%] h-full bg-white/30"></div></div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* CURATED AESTHETICS (Darker) */}
      <section className="py-32 px-8 md:px-16 lg:px-24 bg-[#080808] border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="font-serif text-4xl md:text-6xl font-light mb-6 text-white">Curated <span className="italic text-[#D4AF37]">Visions</span></h2>
            <p className="font-sans text-white/50 text-lg max-w-2xl mx-auto font-light">A glimpse into the architectural languages our intelligence can synthesize for you.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { img: "https://images.unsplash.com/photo-1600210492493-0946911123ea?auto=format&fit=crop&q=80", title: "Noir Elegance", tag: "Monochrome / Marble" },
              { img: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&q=80", title: "Warm Brutalism", tag: "Concrete / Walnut" },
              { img: "https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?auto=format&fit=crop&q=80", title: "Organic Modern", tag: "Linen / Oak" }
            ].map((style, i) => (
              <motion.div 
                key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.2, duration: 0.8 }}
                className="group relative h-[500px] rounded-[32px] overflow-hidden cursor-pointer"
              >
                <img src={style.img} alt={style.title} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-[2s] ease-out" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-700" />
                <div className="absolute bottom-0 left-0 w-full p-10 translate-y-4 group-hover:translate-y-0 transition-transform duration-700">
                  <p className="text-[9px] tracking-[0.3em] uppercase text-[#D4AF37] mb-3">{style.tag}</p>
                  <h3 className="font-serif text-3xl text-white">{style.title}</h3>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-32 px-8 text-center relative overflow-hidden border-t border-white/10">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1600210491369-e753d80a41f3?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-10" />
        <div className="absolute inset-0 bg-[#050505]/80 backdrop-blur-xl" />
        
        <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 1 }} className="relative z-10 max-w-4xl mx-auto">
          <h2 className="font-serif text-5xl md:text-7xl font-light mb-8 text-white">Elevate Your <span className="italic text-[#D4AF37]">Standard.</span></h2>
          <p className="font-sans text-white/50 text-xl font-light mb-16 max-w-2xl mx-auto">Begin the 3-minute assessment to extract your unique Home DNA blueprint.</p>
          
          <MagneticButton onClick={() => setStarted(true)} className="mx-auto group bg-[#D4AF37] text-[#050505] px-12 py-5 rounded-full font-sans tracking-[0.2em] text-[10px] uppercase hover:bg-white transition-colors duration-500 shadow-[0_0_30px_rgba(212,175,55,0.2)] flex items-center gap-4">
            <span>Start Analysis</span>
            <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
          </MagneticButton>
        </motion.div>
      </section>
    </div>
  );
}

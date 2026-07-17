"use client";

import { useState, useRef, ReactNode } from "react";
import { motion, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion";
import { ArrowRight, Sparkles, Compass, Key, Hexagon, Play } from "lucide-react";
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
  const yHero = useTransform(scrollYProgress, [0, 1], [0, 250]);

  if (started) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
        <AssessmentForm />
      </motion.div>
    );
  }

  return (
    <div className="bg-[#FAF9F6] min-h-screen text-[#1A1A1A] font-sans selection:bg-[#A8765E] selection:text-white overflow-x-hidden">
      
      {/* NAVBAR */}
      <nav className="absolute top-0 w-full p-8 md:px-16 flex justify-between items-center z-50">
        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="w-8 h-8 flex items-center justify-center border border-[#1A1A1A]/20 rounded-full group-hover:border-[#A8765E] transition-colors">
            <div className="w-2.5 h-2.5 bg-[#1A1A1A] rounded-full group-hover:bg-[#A8765E] transition-colors"></div>
          </div>
          <span className="tracking-[0.4em] text-[10px] uppercase font-semibold text-[#1A1A1A]">Home DNA</span>
        </div>
        <button onClick={() => setStarted(true)} className="text-[10px] tracking-[0.2em] uppercase font-bold text-[#1A1A1A] hover:text-[#A8765E] transition-colors">
          Start Assessment
        </button>
      </nav>

      {/* HERO SECTION - SPLIT SCREEN */}
      <section className="relative min-h-screen flex flex-col lg:flex-row pt-24 lg:pt-0">
        {/* Left Content */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 md:px-16 lg:pl-24 lg:pr-16 z-20 pb-16 lg:pb-0">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: "easeOut" }}>
            <p className="text-[#A8765E] text-[10px] tracking-[0.3em] uppercase mb-8 font-bold flex items-center gap-4">
              <span className="w-8 h-[2px] bg-[#A8765E]" />
              Architectural Intelligence
            </p>
            <h1 className="font-serif text-5xl md:text-7xl lg:text-[85px] font-light leading-[1.05] mb-8 text-[#1A1A1A] tracking-tight">
              Curate Your <br />
              <span className="italic text-[#A8765E]">Sanctuary.</span>
            </h1>
            <p className="font-sans text-[#555555] text-lg md:text-xl font-light leading-relaxed mb-12 max-w-lg">
              Move beyond generic Pinterest boards. Discover the interior aesthetic that perfectly aligns with your lifestyle, habits, and deepest comforts.
            </p>
            
            <div className="flex items-center gap-6">
              <MagneticButton onClick={() => setStarted(true)} className="group relative overflow-hidden bg-[#1A1A1A] text-white px-10 py-5 rounded-full font-sans tracking-[0.2em] text-[10px] uppercase hover:bg-[#A8765E] transition-colors duration-500 shadow-xl flex items-center gap-4">
                <span>Begin Analysis</span>
                <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
              </MagneticButton>
              <div className="flex items-center gap-3 text-[10px] tracking-widest text-[#888888] uppercase font-semibold">
                <Sparkles size={14} className="text-[#A8765E]"/> 3 Min Assessment
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Image */}
        <div className="w-full lg:w-1/2 h-[60vh] lg:h-screen relative overflow-hidden">
          <motion.div style={{ y: yHero }} className="absolute inset-[-10%] w-[120%] h-[120%]">
            <img 
              src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80" 
              alt="Warm Luxury Interior" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/10" />
          </motion.div>
          
          {/* Floating Glass Element */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1.5, delay: 0.8, ease: "easeOut" }}
            className="absolute bottom-10 left-10 lg:-left-16 bg-white/80 backdrop-blur-xl border border-white p-6 rounded-[24px] shadow-2xl max-w-[280px]"
          >
            <p className="text-[9px] tracking-[0.2em] uppercase text-[#888888] font-bold mb-1">AI Output</p>
            <p className="font-serif text-xl text-[#1A1A1A] mb-4">Warm Minimalist</p>
            <div className="flex gap-2">
              <span className="px-3 py-1 bg-[#F4F1ED] rounded-full text-[9px] uppercase tracking-widest text-[#555]">Oak</span>
              <span className="px-3 py-1 bg-[#F4F1ED] rounded-full text-[9px] uppercase tracking-widest text-[#555]">Linen</span>
              <span className="px-3 py-1 bg-[#F4F1ED] rounded-full text-[9px] uppercase tracking-widest text-[#555]">Brass</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* THREE PILLARS SECTION */}
      <section className="py-32 px-8 md:px-16 lg:px-24 bg-white relative z-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="font-serif text-4xl md:text-5xl font-light text-[#1A1A1A]">Design Based on <span className="italic text-[#A8765E]">Data.</span></h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {[
              { icon: <Compass size={32} strokeWidth={1} />, title: "Spatial Psychology", desc: "We analyze how you move and live to recommend layouts that reduce friction and increase daily comfort." },
              { icon: <Hexagon size={32} strokeWidth={1} />, title: "Material Harmonics", desc: "Textures and tones mathematically matched to your aesthetic preferences and maintenance capacity." },
              { icon: <Key size={32} strokeWidth={1} />, title: "Lifestyle Blueprint", desc: "A tailored architectural direction you can hand directly to your contractor, architect, or interior designer." }
            ].map((item, i) => (
              <motion.div 
                key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ delay: i * 0.2, duration: 0.8 }}
                className="flex flex-col items-center text-center group"
              >
                <div className="w-16 h-16 rounded-full bg-[#F4F1ED] flex items-center justify-center text-[#A8765E] mb-8 group-hover:scale-110 transition-transform duration-500">
                  {item.icon}
                </div>
                <h3 className="font-serif text-2xl text-[#1A1A1A] mb-4">{item.title}</h3>
                <p className="font-sans text-[#666666] leading-relaxed font-light">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED STYLES */}
      <section className="py-32 px-8 md:px-16 lg:px-24 bg-[#FAF9F6]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <div>
              <p className="text-[#A8765E] text-[10px] tracking-[0.3em] uppercase mb-4 font-bold">The Possibilities</p>
              <h2 className="font-serif text-4xl md:text-5xl font-light text-[#1A1A1A]">Curated <span className="italic text-[#A8765E]">Visions.</span></h2>
            </div>
            <p className="font-sans text-[#666666] text-lg font-light max-w-md">Our algorithm synthesizes hundreds of design styles into a singular, perfect direction for your home.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="group cursor-pointer rounded-[32px] overflow-hidden relative h-[500px]">
              <img src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80" alt="Contemporary Minimal" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-10">
                <p className="text-[#A8765E] text-[10px] tracking-widest uppercase font-bold mb-2 bg-white/90 backdrop-blur-md px-3 py-1 inline-block rounded-full">Contemporary</p>
                <h3 className="font-serif text-3xl text-white">Executive Minimalist</h3>
              </div>
            </motion.div>

            <div className="grid grid-rows-2 gap-8 h-[500px]">
              <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2, duration: 0.8 }} className="group cursor-pointer rounded-[32px] overflow-hidden relative h-full">
                <img src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80" alt="Japandi" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-8">
                  <h3 className="font-serif text-2xl text-white">Japandi Retreat</h3>
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.4, duration: 0.8 }} className="group cursor-pointer rounded-[32px] overflow-hidden relative h-full">
                <img src="https://images.unsplash.com/photo-1600210491369-e753d80a41f3?auto=format&fit=crop&q=80" alt="Organic Modern" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-8">
                  <h3 className="font-serif text-2xl text-white">Organic Modern</h3>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-32 px-8 text-center bg-white border-t border-[#EAE6DF]">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 1 }} className="max-w-3xl mx-auto">
          <div className="w-16 h-16 rounded-full bg-[#F4F1ED] flex items-center justify-center text-[#A8765E] mx-auto mb-8">
            <Home size={24} strokeWidth={1.5} />
          </div>
          <h2 className="font-serif text-5xl md:text-6xl font-light mb-8 text-[#1A1A1A]">Ready to meet your <br/><span className="italic text-[#A8765E]">future home?</span></h2>
          <p className="font-sans text-[#666666] text-lg font-light mb-12">Take the 3-minute assessment and unlock a highly personalized architectural direction.</p>
          
          <MagneticButton onClick={() => setStarted(true)} className="mx-auto group bg-[#A8765E] text-white px-12 py-5 rounded-full font-sans tracking-[0.2em] text-[10px] uppercase hover:bg-[#1A1A1A] transition-colors duration-500 shadow-xl flex items-center gap-4">
            <span>Start Free Analysis</span>
            <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
          </MagneticButton>
        </motion.div>
      </section>
      
      {/* FOOTER */}
      <footer className="bg-[#FAF9F6] text-[#888888] py-12 text-center text-[9px] font-sans tracking-[0.2em] uppercase border-t border-[#EAE6DF]">
        <p>© {new Date().getFullYear()} Home DNA Studio. All Rights Reserved.</p>
      </footer>
    </div>
  );
}

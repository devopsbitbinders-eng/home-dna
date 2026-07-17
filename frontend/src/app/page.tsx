"use client";

import { useState, useRef, ReactNode } from "react";
import { motion, useScroll, useTransform, useMotionValue, useSpring, useInView } from "framer-motion";
import { ChevronRight, ArrowRight, Sparkles, CheckCircle2, Home, Palette, Armchair, Sun, Coins, Box, Star } from "lucide-react";
import AssessmentForm from "@/components/AssessmentForm";

// ----------------------------------------------------
// MAGNETIC BUTTON COMPONENT
// ----------------------------------------------------
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

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ x: 0, y: 0 }}
      style={{ x: springX, y: springY }}
      onClick={onClick}
      className={className}
    >
      {children}
    </motion.button>
  );
}

// ----------------------------------------------------
// ANIMATED COUNTER COMPONENT
// ----------------------------------------------------
function AnimatedCounter({ value, suffix, label }: { value: string, suffix: string, label: string }) {
  return (
    <div className="flex flex-col items-center justify-center text-center">
      <div className="font-serif text-5xl lg:text-7xl text-[#C8A46A] mb-2 font-light">
        {value}<span className="text-3xl lg:text-5xl">{suffix}</span>
      </div>
      <p className="font-sans text-xs tracking-[0.2em] uppercase text-[#666666] font-medium">{label}</p>
    </div>
  );
}

export default function HomePage() {
  const [started, setStarted] = useState(false);
  const { scrollYProgress } = useScroll();
  
  // Parallax Values
  const yHero = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const yHeroText = useTransform(scrollYProgress, [0, 1], [0, 100]);
  
  // Mouse Parallax for Hero
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springMouseX = useSpring(mouseX, { stiffness: 100, damping: 30 });
  const springMouseY = useSpring(mouseY, { stiffness: 100, damping: 30 });
  
  const handleHeroMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    mouseX.set((clientX - windowWidth / 2) / 25);
    mouseY.set((clientY - windowHeight / 2) / 25);
  };

  if (started) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
        <AssessmentForm />
      </motion.div>
    );
  }

  return (
    <div 
      className="bg-[#F8F6F2] min-h-screen text-[#181818] font-sans selection:bg-[#C8A46A] selection:text-white overflow-x-hidden"
      onMouseMove={handleHeroMouseMove}
    >
      
      {/* NAVBAR */}
      <nav className="absolute top-0 w-full p-8 md:px-16 lg:px-24 flex justify-between items-center z-50 text-[#181818]">
        <div className="flex items-center gap-4 hover:opacity-70 transition-opacity cursor-pointer group">
          <div className="w-8 h-8 flex items-center justify-center border border-[#181818]/30 rounded-full group-hover:border-[#C8A46A] transition-colors">
            <div className="w-3 h-3 bg-[#181818] rounded-full group-hover:bg-[#C8A46A] transition-colors"></div>
          </div>
          <span className="tracking-[0.3em] text-[10px] uppercase font-semibold">Home DNA</span>
        </div>
        <button 
          onClick={() => setStarted(true)}
          className="text-[10px] tracking-[0.2em] uppercase font-semibold opacity-60 hover:opacity-100 transition-opacity border-b border-transparent hover:border-[#181818] pb-1"
        >
          Begin Assessment
        </button>
      </nav>

      {/* 1. HERO SECTION (Warm White - #F8F6F2) */}
      <section className="relative min-h-screen flex flex-col lg:flex-row items-center bg-[#F8F6F2] pt-24 lg:pt-0 lg:pb-12 border-b border-[#E5DED5]">
        
        {/* Left Side (40%) */}
        <div className="w-full lg:w-[40%] px-8 md:px-16 lg:pl-24 lg:pr-8 flex flex-col justify-center relative z-20 pt-16 lg:pt-32 pb-16 lg:pb-0">
          <motion.div style={{ y: yHeroText }} className="max-w-xl">
            <motion.p 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: "easeOut" }}
              className="text-[#C8A46A] text-[9px] tracking-[0.3em] uppercase mb-8 font-semibold"
            >
              AI-Powered Interior Design
            </motion.p>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
              className="font-serif text-5xl md:text-6xl lg:text-7xl font-light leading-[1.1] mb-10 text-[#181818]"
            >
              Discover Your <br />
              <span className="italic text-[#C8A46A]">Home DNA.</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
              className="font-sans text-[#666666] text-lg mb-14 leading-relaxed font-light"
            >
              Understand which interior style truly matches your lifestyle, profession, family, habits and aspirations.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
              className="flex flex-col items-start gap-8"
            >
              <MagneticButton 
                onClick={() => setStarted(true)}
                className="group relative overflow-hidden bg-[#181818] text-white px-12 py-5 rounded-full font-sans tracking-[0.15em] text-[10px] uppercase hover:bg-[#C8A46A] transition-colors duration-500 flex items-center gap-4 shadow-xl hover:shadow-2xl"
              >
                <span>Discover My Home DNA</span>
                <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
              </MagneticButton>
              <div className="flex items-center gap-4 text-[10px] font-sans tracking-widest text-[#666666] uppercase">
                <span className="flex items-center gap-2"><Sparkles size={12} className="text-[#C8A46A]"/> 3-minute AI Assessment</span>
                <span className="opacity-30">|</span>
                <span>No credit card required</span>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 1 }}
              className="mt-20 flex flex-col gap-4 border-t border-[#E5DED5] pt-8"
            >
              <div className="flex items-center gap-1 text-[#C8A46A]">
                {[1,2,3,4,5].map(i => <Star key={i} size={14} fill="currentColor" />)}
                <span className="text-[10px] text-[#666666] tracking-[0.15em] uppercase ml-4 font-semibold">Trusted by homeowners</span>
              </div>
              <div className="flex gap-6 text-[9px] tracking-[0.15em] uppercase text-[#666666] font-medium">
                <span className="flex items-center gap-2"><CheckCircle2 size={12} className="text-[#8B6A4F]"/> AI Powered Recommendations</span>
                <span className="flex items-center gap-2"><CheckCircle2 size={12} className="text-[#8B6A4F]"/> 100% Personalized Report</span>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Right Side (60%) */}
        <div className="w-full lg:w-[60%] h-[70vh] lg:min-h-[95vh] relative overflow-visible p-4 lg:p-8 flex items-center lg:mt-8">
          <motion.div style={{ y: yHero }} className="absolute inset-4 lg:inset-8 z-0">
            <div className="w-full h-full relative rounded-3xl lg:rounded-[40px] overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.15)]">
              <img 
                src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80" 
                alt="Luxury Warm Interior with Walnut and Marble" 
                className="w-full h-[120%] object-cover object-center absolute -top-[10%]"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-[#181818]/30 via-transparent to-[#F8F6F2]/10"></div>
            </div>
          </motion.div>

          {/* Vision Pro Style Premium Glass Panel - Overlapping Left */}
          <motion.div 
            initial={{ opacity: 0, x: 50, rotateY: 10 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            transition={{ duration: 1.5, delay: 0.8, ease: "easeOut" }}
            style={{ x: springMouseX, y: springMouseY, background: "linear-gradient(135deg, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.4) 100%)" }}
            className="absolute bottom-12 lg:bottom-auto lg:top-1/2 lg:-translate-y-1/2 lg:-left-4 w-[90%] max-w-md mx-auto right-0 lg:right-auto lg:mx-0 rounded-[32px] border border-white/50 p-10 shadow-[0_40px_80px_rgba(0,0,0,0.15)] backdrop-blur-2xl z-30"
          >
            <div className="flex justify-between items-start mb-8">
              <div>
                <p className="text-[9px] tracking-[0.3em] uppercase text-[#666666] font-semibold mb-2">Home DNA Analysis</p>
                <h3 className="font-serif text-3xl text-[#181818] leading-tight">Modern Luxury<br/><span className="italic text-[#8B6A4F]">Executive</span></h3>
              </div>
              <div className="w-14 h-14 rounded-full border border-[#C8A46A]/40 flex flex-col items-center justify-center bg-white/60 shadow-sm">
                <span className="text-[#C8A46A] font-serif text-lg leading-none">92<span className="text-[10px]">%</span></span>
                <span className="text-[7px] tracking-widest uppercase text-[#666666] mt-0.5">Match</span>
              </div>
            </div>
            
            <div className="space-y-5 mb-8">
              <div className="flex justify-between items-center border-b border-[#E5DED5]/60 pb-3">
                <span className="text-[10px] text-[#666666] uppercase tracking-[0.15em] font-medium">Est. Budget</span>
                <span className="text-xs font-semibold text-[#181818] tracking-wide">₹18–24 Lakhs</span>
              </div>
              <div className="flex justify-between items-center border-b border-[#E5DED5]/60 pb-3">
                <span className="text-[10px] text-[#666666] uppercase tracking-[0.15em] font-medium">Lighting</span>
                <span className="text-xs font-semibold text-[#181818] tracking-wide">Warm Ambient</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-[#666666] uppercase tracking-[0.15em] font-medium">Material</span>
                <span className="text-xs font-semibold text-[#181818] tracking-wide">Oak + Marble</span>
              </div>
            </div>

            <div className="w-full bg-[#E5DED5]/50 h-1 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }} animate={{ width: "92%" }} transition={{ duration: 2, delay: 1.5, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-[#8B6A4F] to-[#C8A46A]"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. WHY TAKE THIS ASSESSMENT (Soft Stone - #EFE8DF) */}
      <section className="py-24 lg:py-32 px-8 md:px-16 lg:px-24 bg-[#EFE8DF] relative border-t border-[#E5DED5]">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 1 }}
            className="text-center mb-20"
          >
            <p className="text-[#C8A46A] text-[10px] tracking-[0.3em] uppercase mb-6 font-semibold">The Value</p>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light mb-8 text-[#181818]">Why Take This Assessment?</h2>
            <div className="w-px h-16 bg-[#C8A46A] mx-auto opacity-50"></div>
            <p className="font-sans text-[#666666] text-lg max-w-2xl mx-auto font-light mt-8">
              Move beyond generic Pinterest boards. Discover the architectural and interior choices that uniquely fit your life.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[
              { title: "Interior Personality", desc: "Identify your exact aesthetic language.", icon: <Home strokeWidth={1} size={32} /> },
              { title: "Color Palette", desc: "Harmonious tones tailored to your mood.", icon: <Palette strokeWidth={1} size={32} /> },
              { title: "Furniture Style", desc: "Curated profiles matching your comfort.", icon: <Armchair strokeWidth={1} size={32} /> },
              { title: "Lighting Mood", desc: "Illumination designed for your routine.", icon: <Sun strokeWidth={1} size={32} /> },
              { title: "Investment Estimate", desc: "Realistic budgeting for your vision.", icon: <Coins strokeWidth={1} size={32} /> },
              { title: "Storage Intelligence", desc: "Organization built around your habits.", icon: <Box strokeWidth={1} size={32} /> }
            ].map((card, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ delay: i * 0.1, duration: 0.8 }}
                className="bg-[#F8F6F2] rounded-2xl p-12 border border-[#E5DED5]/50 shadow-sm hover:shadow-[0_20px_40px_rgba(0,0,0,0.04)] hover:-translate-y-2 transition-all duration-500 group"
              >
                <div className="text-[#8B6A4F] mb-8 opacity-70 group-hover:opacity-100 transition-opacity">{card.icon}</div>
                <h3 className="font-serif text-2xl text-[#181818] mb-4 group-hover:text-[#C8A46A] transition-colors">{card.title}</h3>
                <div className="w-8 h-px bg-[#E5DED5] mb-4 group-hover:w-16 group-hover:bg-[#C8A46A] transition-all duration-500"></div>
                <p className="font-sans text-sm text-[#666666] leading-relaxed font-light">{card.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. DISCOVER POSSIBLE STYLES (White - #FFFFFF) */}
      <section className="py-24 lg:py-32 px-8 md:px-16 lg:px-24 bg-white relative">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row justify-between items-end mb-20 gap-8">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 1 }}>
              <p className="text-[#C8A46A] text-[10px] tracking-[0.3em] uppercase mb-4 font-semibold">Aesthetic Library</p>
              <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light text-[#181818] leading-tight">
                Discover Your <br/><span className="italic text-[#8B6A4F]">Possible Style.</span>
              </h2>
            </motion.div>
            <motion.p initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 1, delay: 0.2 }} className="font-sans text-[#666666] text-lg max-w-md font-light">
              Explore a curated selection of premium interior directions that might just be your perfect match.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { img: "https://images.unsplash.com/photo-1600210492493-0946911123ea?auto=format&fit=crop&q=80", title: "Modern Luxury", desc: "Sleek lines with high-end marble finishes." },
              { img: "https://images.unsplash.com/photo-1618220179428-22790b46a0eb?auto=format&fit=crop&q=80", title: "Japandi", desc: "Minimalist blend of Japanese and Scandinavian." },
              { img: "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&q=80", title: "Scandinavian", desc: "Light woods, airy spaces, and pure function." },
              { img: "https://images.unsplash.com/photo-1552089123-2d2625d84b2c?auto=format&fit=crop&q=80", title: "Nature Inspired", desc: "Earthy tones, natural textures, and organic flow." },
              { img: "https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&q=80", title: "Contemporary Executive", desc: "Bold contrasts with walnut and brass accents." },
              { img: "https://images.unsplash.com/photo-1600566753086-00f18efc2291?auto=format&fit=crop&q=80", title: "Royal Heritage", desc: "Timeless elegance with classical proportions." }
            ].map((style, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.8 }}
                className="group cursor-pointer rounded-2xl overflow-hidden relative h-[450px]"
              >
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-700 z-10"></div>
                <img src={style.img} alt={style.title} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-[1.5s] ease-out" />
                <div className="absolute bottom-0 left-0 w-full p-8 z-20 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <h3 className="font-serif text-3xl text-white mb-2">{style.title}</h3>
                  <p className="font-sans text-sm text-white/80 font-light opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">{style.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. HOW IT WORKS (Dark Charcoal - #1A1A1A) */}
      <section className="py-24 lg:py-32 px-8 md:px-16 lg:px-24 bg-[#1A1A1A] text-white relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <p className="text-[#C8A46A] text-[10px] tracking-[0.3em] uppercase mb-6 font-semibold">The Process</p>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light mb-6">How It Works</h2>
          </div>

          <div className="relative">
            <div className="hidden lg:block absolute top-[120px] left-[10%] w-[80%] h-px bg-gradient-to-r from-transparent via-[#C8A46A]/50 to-transparent z-0"></div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-20 lg:gap-12 relative z-10">
              {[
                { step: "01", title: "Tell us about yourself", desc: "Share details about your space, daily habits, and lifestyle preferences.", img: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80" },
                { step: "02", title: "AI understands your life", desc: "Our proprietary algorithm analyzes your inputs against thousands of design principles.", img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80" },
                { step: "03", title: "Receive your Home DNA", desc: "Get a comprehensive, personalized architectural direction for your space.", img: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80" }
              ].map((item, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.2, duration: 1 }}
                  className="flex flex-col items-center text-center group"
                >
                  <div className="w-full h-64 rounded-2xl overflow-hidden mb-12 relative border border-white/10">
                    <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-60 group-hover:opacity-100" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-[#1A1A1A]/80 backdrop-blur-md border border-[#C8A46A]/50 flex items-center justify-center text-[#C8A46A] font-serif text-2xl shadow-2xl">
                      {item.step}
                    </div>
                  </div>
                  <h3 className="font-serif text-3xl mb-4">{item.title}</h3>
                  <p className="font-sans text-sm text-white/60 leading-relaxed font-light max-w-sm">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. REPORT PREVIEW (Warm White - #F8F6F2) */}
      <section className="py-24 lg:py-32 px-8 md:px-16 lg:px-24 bg-[#F8F6F2] relative border-y border-[#E5DED5]">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-20">
          <div className="w-full lg:w-[45%]">
            <p className="text-[#C8A46A] text-[10px] tracking-[0.3em] uppercase mb-6 font-semibold">The Output</p>
            <h2 className="font-serif text-4xl md:text-5xl font-light mb-8 text-[#181818] leading-tight w-full">
              Your Comprehensive <span className="italic text-[#8B6A4F] whitespace-nowrap">Design Direction.</span>
            </h2>
            <p className="font-sans text-[#666666] text-lg mb-12 font-light leading-relaxed">
              Upon completion, you receive a highly detailed architectural blueprint defining your unique aesthetic language, tailored perfectly to your lifestyle and needs.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 text-sm font-sans text-[#181818] bg-white p-8 rounded-3xl border border-[#E5DED5] shadow-sm">
              {["Interior Personality", "Color Palette", "Furniture Curation", "Material Selection", "Lighting Plan", "Storage Strategy", "Budget Estimate", "Space Planning Score", "Smart Home Score", "Lifestyle Match", "Renovation Readiness", "Design Recommendations"].map(feature => (
                <div key={feature} className="flex items-center gap-3 border-b border-[#E5DED5]/50 pb-2 hover:pl-2 transition-all duration-300">
                  <CheckCircle2 size={14} className="text-[#C8A46A] opacity-80" />
                  <span className="font-light tracking-wide text-xs">{feature}</span>
                </div>
              ))}
            </div>

            <MagneticButton 
              onClick={() => setStarted(true)}
              className="mt-12 group bg-[#181818] text-white px-10 py-5 rounded-full font-sans tracking-[0.15em] text-[10px] uppercase hover:bg-[#C8A46A] transition-colors duration-500 shadow-xl flex items-center gap-4"
            >
              <span>Book Free Consultation</span>
              <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
            </MagneticButton>
          </div>

          <div className="w-full lg:w-[55%]">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 1.2, ease: "easeOut" }}
              className="relative rounded-[40px] shadow-[0_40px_80px_rgba(0,0,0,0.1)] border border-[#E5DED5] bg-white p-2"
            >
              <div className="rounded-[32px] overflow-hidden border border-[#EFE8DF]">
                <img 
                  src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80" 
                  alt="Detailed Report Preview" 
                  className="w-full h-auto object-cover"
                />
              </div>
              
              {/* Floating Report Badges */}
              <motion.div 
                animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-10 -left-6 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-[#E5DED5] flex items-center gap-4"
              >
                <div className="w-10 h-10 rounded-full bg-[#EFE8DF] flex items-center justify-center text-[#8B6A4F]"><Home size={20}/></div>
                <div>
                  <p className="text-[9px] uppercase tracking-widest text-[#666666]">Style Match</p>
                  <p className="font-serif text-lg text-[#181818]">Japandi Minimal</p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 6. SOCIAL PROOF & TESTIMONIALS (Soft Stone - #EFE8DF) */}
      <section className="py-24 lg:py-32 px-8 md:px-16 lg:px-24 bg-[#EFE8DF]">
        <div className="max-w-7xl mx-auto">
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-24 border-b border-[#E5DED5] pb-24">
            <AnimatedCounter value="500" suffix="+" label="Luxury Projects" />
            <AnimatedCounter value="15" suffix="+" label="Years Experience" />
            <AnimatedCounter value="98" suffix="%" label="Client Satisfaction" />
            <AnimatedCounter value="250" suffix="+" label="Premium Homes" />
          </div>

          {/* Testimonial Block */}
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="w-full lg:w-1/2">
              <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 1 }} className="relative">
                <span className="absolute -top-10 -left-6 font-serif text-9xl text-[#C8A46A] opacity-20 leading-none">"</span>
                <h3 className="font-serif text-3xl md:text-4xl lg:text-5xl font-light text-[#181818] leading-tight mb-10 relative z-10">
                  The Home DNA assessment completely transformed our approach. It captured our aesthetic perfectly before we even met the design team.
                </h3>
                <div>
                  <p className="font-sans text-xs tracking-widest uppercase text-[#181818] font-semibold">Sarah & James Mitchell</p>
                  <p className="font-sans text-[10px] tracking-[0.2em] uppercase text-[#666666] mt-1">Luxury Villa Refurbishment • London</p>
                </div>
              </motion.div>
            </div>
            <div className="w-full lg:w-1/2">
              <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 1 }} className="rounded-[40px] overflow-hidden">
                <img src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80" alt="Luxury Villa" className="w-full h-full object-cover" />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. INSPIRATION GALLERY (White - #FFFFFF) */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-[1600px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl text-[#181818] font-light">Curated Spaces</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Living", img: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80" },
              { label: "Dining", img: "https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&q=80" },
              { label: "Kitchen", img: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&q=80" },
              { label: "Bedroom", img: "https://images.unsplash.com/photo-1600210491369-e753d80a41f3?auto=format&fit=crop&q=80" }
            ].map((item, i) => (
              <div key={i} className="group relative h-[300px] md:h-[400px] rounded-2xl overflow-hidden cursor-pointer">
                <img src={item.img} alt={item.label} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors duration-500"></div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <span className="text-white font-serif text-2xl border-b border-white/50 pb-1">{item.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. FINAL CTA (Luxury Background Image) */}
      <section className="relative min-h-[80vh] md:min-h-screen flex flex-col items-center justify-center overflow-hidden py-32">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1600210491369-e753d80a41f3?auto=format&fit=crop&q=80" 
            alt="Luxury Interior Final CTA" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-[#1A1A1A]/80 backdrop-blur-sm"></div>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1.2 }}
          className="relative z-10 text-center px-4 md:px-8 w-full max-w-5xl mx-auto"
        >
          <p className="text-[#C8A46A] text-[10px] tracking-[0.3em] uppercase mb-8 font-semibold">Your Vision, Realized</p>
          <h2 className="font-serif text-4xl md:text-6xl lg:text-7xl font-light mb-8 text-white leading-tight">
            Your Dream Home Starts With <br className="hidden md:block" />
            <span className="italic text-[#C8A46A] whitespace-nowrap">Understanding You.</span>
          </h2>
          <p className="font-sans text-white/70 text-base md:text-xl font-light mb-12 md:mb-16 max-w-2xl mx-auto leading-relaxed px-4">
            Discover your Home DNA in just three minutes and receive a personalized design direction tailored to your lifestyle.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 px-4">
            <MagneticButton 
              onClick={() => setStarted(true)}
              className="bg-white text-[#181818] px-12 py-5 rounded-full font-sans tracking-[0.15em] text-[10px] uppercase hover:bg-[#C8A46A] hover:text-white transition-all duration-500 shadow-2xl w-full sm:w-auto"
            >
              Discover My Home DNA
            </MagneticButton>
            <MagneticButton 
              className="bg-transparent border border-white/40 text-white px-12 py-5 rounded-full font-sans tracking-[0.15em] text-[10px] uppercase hover:bg-white hover:text-[#181818] transition-all duration-500 w-full sm:w-auto"
            >
              Book Free Consultation
            </MagneticButton>
          </div>
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#111111] text-white/40 py-16 px-8 text-center text-[10px] font-sans tracking-[0.2em] uppercase border-t border-white/10">
        <p>© {new Date().getFullYear()} Home DNA. All rights reserved. A Premium Architectural Studio Standard.</p>
      </footer>
    </div>
  );
}

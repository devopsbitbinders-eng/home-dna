"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, CheckCircle, ChevronLeft, ChevronDown, Sparkles, Building2 } from "lucide-react";

const IMAGES = [
  "/images/bg0.jpg",
  "/images/bg1.jpg",
  "/images/bg2.jpg",
  "/images/bg3.jpg",
  "/images/bg4.jpg",
  "/images/bg5.jpg",
  "/images/bg6.jpg"
];

const SCREEN_TITLES = [
  "About You",
  "Your Property",
  "Discovering Your Lifestyle",
  "Interior Personality",
  "Design Preferences",
  "Materials & Atmosphere",
  "Your Final Vision"
];

const CustomDropdown = ({ label, options, value, onChange, theme }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="relative w-full">
      <button 
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-[#FFFFFF] border border-[#E2DCD3] rounded-full px-5 py-3 text-sm text-left flex justify-between items-center transition-colors font-light shadow-inner"
        style={{ color: value ? '#1A1A1A' : '#888888' }}
      >
        {value || label}
        <ChevronDown size={14} className={`transition-transform text-[#1A1A1A] ${isOpen ? 'rotate-180' : ''}`} style={{ opacity: 0.6 }} />
      </button>
      {isOpen && (
        <div className="absolute top-full left-0 w-full mt-2 rounded-[24px] shadow-2xl overflow-hidden z-[100] bg-white border border-[#E2DCD3]">
          {options.map((opt: string) => (
            <button
              key={opt}
              type="button"
              onClick={() => { onChange(opt); setIsOpen(false); }}
              className="w-full text-left px-5 py-3 text-sm transition-colors font-light hover:bg-[#F2EFE8] text-[#1A1A1A]"
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default function AssessmentForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<any>(null);

  const [isBooking, setIsBooking] = useState(false);
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    IMAGES.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  // currentStep is 0 to 6. Progress should be 0% at step 0, and 100% at step 6.
  const progress = (currentStep / 6) * 100;
  const timeRemaining = Math.max(90 - (currentStep * 15), 15);

  const handleInput = (key: string, value: any) => {
    setResponses(prev => ({ ...prev, [key]: value }));
  };

  const handleMultiSelect = (key: string, value: string, max: number = 10) => {
    setResponses(prev => {
      const current = prev[key] || [];
      if (current.includes(value)) {
        return { ...prev, [key]: current.filter((i: string) => i !== value) };
      }
      if (current.length < max) {
        return { ...prev, [key]: [...current, value] };
      }
      return prev;
    });
  };

  const handleNext = async () => {
    if (currentStep < 6) {
      setCurrentStep(prev => prev + 1);
    } else {
      await submitAssessment();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(prev => prev - 1);
  };

  const submitAssessment = async () => {
    setIsSubmitting(true);
    try {
      const API_URL = "https://home-dna-gamma.vercel.app";
      const response = await fetch(`${API_URL}/submit-assessment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: responses.name || "Guest",
          phone: responses.phone || "0000000000",
          email: responses.email || "guest@example.com",
          responses: responses,
        }),
      });

      if (!response.ok) throw new Error("Submission failed");
      const data = await response.json();
      
      setTimeout(() => {
        setResult(data);
        setIsSubmitting(false);
      }, 1500);
      
    } catch (error) {
      console.error(error);
      alert("Error submitting assessment. Ensure the backend is running.");
      setIsSubmitting(false);
    }
  };

  const handleBookConsultation = async () => {
    if (!bookingDate || !bookingTime) {
      alert("Please select a date and time");
      return;
    }
    setBookingLoading(true);
    try {
      const API_URL = "https://home-dna-gamma.vercel.app";
      const response = await fetch(`${API_URL}/book-consultation`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lead_id: result.id,
          preferred_date: bookingDate,
          preferred_time: bookingTime
        }),
      });
      if (!response.ok) throw new Error("Booking failed");
      setBookingSuccess(true);
      setIsBooking(false);
    } catch (error) {
      console.error(error);
      alert("Error booking consultation.");
    } finally {
      setBookingLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    try {
      // Dynamically import to avoid SSR issues
      const html2pdf = (await import("html2pdf.js")).default;
      const element = document.getElementById("report-container");
      if (!element) return;
      
      const opt: any = {
        margin: 0,
        filename: 'Home_DNA_Report.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
      };

      html2pdf().set(opt).from(element).save();
    } catch (err) {
      console.error("Error generating PDF:", err);
      window.print(); // Fallback
    }
  };

  // --- PROCESSING SCREEN ---
  if (isSubmitting) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-[#F8F6F2]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
          className="mb-8 text-[#1A1A1A]"
        >
          <Sparkles size={48} strokeWidth={1.5} />
        </motion.div>
        <motion.h2 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="font-serif text-3xl text-[#1A1A1A] text-center mb-4"
        >
          Curating Your Home DNA...
        </motion.h2>
        <p className="text-[#666666] font-sans tracking-[0.2em] uppercase text-xs">Analyzing Architecture & Lifestyle</p>
      </div>
    );
  }

  // --- FINAL REPORT SCREEN ---
  if (result) {
    const report = result.ai_report || result;
    
    const Section = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className={`py-12 md:py-20 border-b border-[#E8E3DA] last:border-0 ${className}`}
      >
        {children}
      </motion.div>
    );

    const PillList = ({ title, items }: { title: string, items: string[] }) => (
      <div className="bg-white p-8 rounded-[24px] border border-[#E8E3DA] shadow-sm hover:-translate-y-1 transition-transform duration-500">
        <h4 className="font-sans text-xs tracking-[0.2em] uppercase text-[#666666] mb-6">{title}</h4>
        <div className="flex flex-wrap gap-3">
          {items && items.map((item, i) => (
            <span key={i} className="px-4 py-2 bg-[#F8F6F2] text-[#1A1A1A] text-sm rounded-full border border-[#E8E3DA] font-light">
              {item}
            </span>
          ))}
        </div>
      </div>
    );

    const StatCard = ({ title, value }: { title: string, value: string }) => (
      <div className="bg-white p-6 md:p-8 rounded-[24px] border border-[#E8E3DA] shadow-sm hover:-translate-y-1 transition-transform duration-500 text-center flex flex-col justify-center h-full">
        <h4 className="font-sans text-[10px] md:text-xs tracking-[0.2em] uppercase text-[#666666] mb-3 md:mb-4">{title}</h4>
        <p className="font-serif text-lg md:text-xl lg:text-2xl text-[#B58A4B] break-words leading-snug md:leading-tight">{value}</p>
      </div>
    );

    return (
      <div id="report-container" className="bg-[#F8F6F2] min-h-screen text-[#1A1A1A] font-sans selection:bg-[#B58A4B] selection:text-white">
        <div className="min-h-screen flex flex-col items-center justify-center text-center p-6 relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="max-w-3xl w-full"
          >
            <Building2 className="mx-auto text-[#B58A4B] mb-12 w-16 h-16 stroke-[1]" />
            <p className="font-sans tracking-[0.3em] text-[#666666] text-xs uppercase mb-6">Home DNA Report</p>
            <h1 className="font-serif text-5xl md:text-7xl font-light mb-12 leading-tight">
              Prepared Exclusively For <br/> <span className="italic text-[#B58A4B]">{result.name}</span>
            </h1>
            <div className="w-px h-24 bg-[#E8E3DA] mx-auto mb-12"></div>
            <div className="inline-block border border-[#E8E3DA] rounded-full px-8 py-3 bg-white shadow-sm">
              <p className="font-sans text-xs tracking-widest uppercase text-[#666666] mb-1">Interior Personality</p>
              <p className="font-serif text-xl">{report["Interior Personality"] || "Generating..."}</p>
            </div>
          </motion.div>
        </div>

        <div className="max-w-5xl mx-auto px-6 md:px-12 pb-32">
          {/* SECTION 2: Hero Interior Image */}
          <Section>
            <div className="rounded-[24px] overflow-hidden shadow-xl bg-white border border-[#E8E3DA]">
              <img 
                src={report["Image URL"] || `https://image.pollinations.ai/prompt/${encodeURIComponent(report["Image Prompt"] || "luxury minimalist living room architectural digest")}?width=1280&height=720&nologo=true`} 
                alt="Your Custom Home DNA Design"
                className="w-full h-[60vh] object-cover"
              />
            </div>
          </Section>

          {/* SECTION 3: Key Stats Grid */}
          <Section>
            <h2 className="font-serif text-3xl mb-12 text-center">Project Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard title="Furniture Style" value={report["Furniture Style"] || "-"} />
              <StatCard title="Space Planning" value={report["Space Planning Score"] || "-"} />
              <StatCard title="Smart Home Fit" value={report["Smart Home Compatibility"] || "-"} />
              <StatCard title="Est. Investment" value={report["Estimated Interior Budget"] || "-"} />
            </div>
          </Section>

          {/* SECTION 4: Design Details */}
          <Section>
            <h2 className="font-serif text-3xl mb-12 text-center">Design Architecture</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <PillList title="Colour Palette" items={report["Colour Palette"] || []} />
              <PillList title="Recommended Materials" items={report["Recommended Materials"] || []} />
              <PillList title="Lighting Plan" items={report["Lighting"] || []} />
            </div>
            <div className="bg-white p-8 rounded-[24px] border border-[#E8E3DA] shadow-sm text-center">
              <h4 className="font-sans text-xs tracking-[0.2em] uppercase text-[#666666] mb-4">Storage Strategy</h4>
              <p className="font-serif text-2xl">{report["Storage Recommendation"] || "-"}</p>
            </div>
          </Section>

          {/* CTA / Booking Section */}
          <Section className="text-center pt-24 print:hidden">
            <h2 className="font-serif text-4xl mb-6">Ready To Transform Your Home DNA Into Reality?</h2>
            
            {bookingSuccess ? (
              <div className="mt-12 bg-[#F8F6F2] text-[#1A1A1A] p-8 rounded-[24px] inline-block border border-[#E8E3DA]">
                <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-600" />
                <h3 className="font-serif text-2xl mb-2">Consultation Booked!</h3>
                <p className="font-light opacity-70">Our design director will contact you on {bookingDate} at {bookingTime}.</p>
              </div>
            ) : isBooking ? (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-12 bg-white border border-[#E8E3DA] p-8 rounded-[24px] max-w-md mx-auto shadow-sm text-left">
                <h3 className="font-serif text-xl mb-6">Select your preferred slot</h3>
                <div className="space-y-4 mb-8">
                  <div>
                    <label className="text-[10px] tracking-widest uppercase opacity-60 mb-2 block font-medium">Date</label>
                    <input type="date" value={bookingDate} onChange={e => setBookingDate(e.target.value)} className="w-full bg-transparent border-b border-[#E8E3DA] py-3 text-sm focus:outline-none transition-colors font-light" />
                  </div>
                  <div>
                    <label className="text-[10px] tracking-widest uppercase opacity-60 mb-2 block font-medium">Time</label>
                    <input type="time" value={bookingTime} onChange={e => setBookingTime(e.target.value)} className="w-full bg-transparent border-b border-[#E8E3DA] py-3 text-sm focus:outline-none transition-colors font-light" />
                  </div>
                </div>
                <div className="flex gap-4">
                  <button onClick={() => setIsBooking(false)} className="px-6 py-4 rounded-full text-xs tracking-widest uppercase border border-[#E8E3DA] hover:bg-black/5 transition-colors w-1/3">Cancel</button>
                  <button onClick={handleBookConsultation} disabled={bookingLoading} className="bg-[#1A1A1A] text-white px-6 py-4 rounded-full text-xs tracking-widest uppercase hover:bg-[#333333] transition-colors w-2/3 shadow-md flex justify-center items-center">
                    {bookingLoading ? "Confirming..." : "Confirm Booking"}
                  </button>
                </div>
              </motion.div>
            ) : (
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-12">
                <button onClick={() => setIsBooking(true)} className="bg-[#1A1A1A] text-white px-10 py-5 rounded-full font-sans tracking-widest text-xs uppercase hover:bg-[#333333] transition-colors w-full sm:w-auto shadow-xl">
                  Book FREE Design Consultation
                </button>
                <button onClick={handleDownloadPDF} className="bg-white border border-[#E8E3DA] text-[#1A1A1A] px-10 py-5 rounded-full font-sans tracking-widest text-xs uppercase hover:bg-[#F8F6F2] transition-colors w-full sm:w-auto">
                  Download Report
                </button>
              </div>
            )}
          </Section>
        </div>
      </div>
    );
  }

  const getTheme = () => {
    const activeColor = responses.color || responses.custom_color;
    switch (activeColor) {
      case "Bright": return { bg: "#FDFDFD", bgDark: "#F0EFEB", text: "#1A1A1A", accent: "#D4AF37" };
      case "Warm": return { bg: "#F5EBE1", bgDark: "#D8C5B2", text: "#2A231C", accent: "#B57B4B" };
      case "Monochrome": return { bg: "#1A1A1A", bgDark: "#0A0A0A", text: "#F8F6F2", accent: "#E5E5E5" };
      case "Dark": return { bg: "#161F2E", bgDark: "#0B1017", text: "#F8F6F2", accent: "#B58A4B" };
      case "Earthy": return { bg: "#8C4A3A", bgDark: "#52241A", text: "#F8F6F2", accent: "#E3B5A4" };
      case "Luxury": return { bg: "#B58A4B", bgDark: "#705023", text: "#1A1A1A", accent: "#2A2A2A" };
      default: 
        if (responses.custom_color) {
          return { bg: responses.custom_color, bgDark: "#1A1A1A", text: "#1A1A1A", accent: "#B58A4B" };
        }
        return { bg: "#FDFDFD", bgDark: "#F0EFEB", text: "#1A1A1A", accent: "#D4AF37" };
    }
  };
  const theme = getTheme();

  // --- ASSESSMENT QUESTIONS SCREEN ---
  return (
    <div 
      className="flex flex-col lg:flex-row h-screen font-sans overflow-hidden transition-all duration-1000 ease-in-out bg-[#F8F6F2]"
    >
      {/* LEFT SIDE - Content Card */}
      <div className="w-full lg:w-1/2 flex flex-col h-full relative z-10 pt-10">

        {/* Progress - Fixed at top */}
        <div 
          className="w-full px-8 md:px-16 lg:px-24 pt-12 pb-4 z-20 transition-all duration-1000 ease-in-out bg-[#F8F6F2]"
        >
          <div className="flex justify-between items-center text-[10px] tracking-[0.2em] uppercase mb-4 text-[#888888]">
            <span>{Math.round(progress)}% Complete</span>
            <span>Est. {timeRemaining}s</span>
          </div>
          <div className="w-full h-[1px] bg-[#E2DCD3] relative">
            <motion.div
              className="absolute top-0 left-0 h-full bg-[#CB5A35]"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Questions - Centered vertically without top clipping */}
        <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden relative z-0">
          <div className="min-h-full flex flex-col justify-center px-8 md:px-16 lg:px-24 pt-8 pb-32">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="max-w-2xl w-full relative z-10"
              >
              
              <div className="mb-12">
                <p className="text-[10px] tracking-[0.3em] uppercase mb-2 transition-colors duration-1000 text-[#CB5A35]">{SCREEN_TITLES[currentStep]}</p>
                {currentStep === 0 && (
                  <>
                    <h2 className="font-serif text-4xl font-normal mb-2 text-[#1A1A1A]">About You</h2>
                    <p className="font-light text-sm tracking-wide opacity-60 mb-6 text-[#1A1A1A]">We'll personalize your Home DNA Report...</p>
                  </>
                )}
                {currentStep === 1 && (
                  <>
                    <h2 className="font-serif text-3xl md:text-4xl font-normal mb-2 text-[#1A1A1A]">Your Property</h2>
                    <p className="font-light text-xs tracking-wide opacity-60 transition-opacity">Tell us about the space we are designing.</p>
                  </>
                )}
                {currentStep === 2 && (
                  <>
                    <h2 className="font-serif text-3xl md:text-4xl font-normal mb-2 text-[#1A1A1A]">Lifestyle</h2>
                    <p className="font-light text-xs tracking-wide opacity-60 transition-opacity">Select all that apply to your daily routine.</p>
                  </>
                )}
                {currentStep === 3 && (
                  <>
                    <h2 className="font-serif text-3xl md:text-4xl font-normal mb-2 text-[#1A1A1A]">Personality</h2>
                    <p className="font-light text-xs tracking-wide opacity-60 transition-opacity">Select up to 3 traits that describe you best.</p>
                  </>
                )}
                {currentStep === 4 && (
                  <>
                    <h2 className="font-serif text-3xl md:text-4xl font-normal mb-2 text-[#1A1A1A]">Preferences</h2>
                    <p className="font-light text-xs tracking-wide opacity-60 transition-opacity">Which aesthetic resonates with you?</p>
                  </>
                )}
                {currentStep === 5 && (
                  <>
                    <h2 className="font-serif text-3xl md:text-4xl font-normal mb-2 text-[#1A1A1A]">Atmosphere</h2>
                    <p className="font-light text-xs tracking-wide opacity-60 transition-opacity">Select your ideal materials and tones.</p>
                  </>
                )}
                {currentStep === 6 && (
                  <>
                    <h2 className="font-serif text-3xl md:text-4xl font-normal mb-2 text-[#1A1A1A]">Final Vision</h2>
                    <p className="font-light text-xs tracking-wide opacity-60 transition-opacity">If your dream home could be described in one word...</p>
                  </>
                )}
              </div>

              {currentStep === 0 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {["name", "phone", "email", "city", "occupation", "age"].map(field => (
                      <div key={field}>
                        <input
                          type={field === "email" ? "email" : "text"}
                          placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                          value={responses[field] || ""}
                          onChange={(e) => handleInput(field, e.target.value)}
                          className="w-full bg-[#FFFFFF] border border-[#E2DCD3] rounded-full px-5 py-3 text-sm focus:outline-none focus:border-[#CB5A35] transition-colors font-light placeholder-[#888888] shadow-inner text-[#1A1A1A]"
                        />
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <CustomDropdown 
                      label="Gender (Optional)"
                      value={responses.gender}
                      options={["Male", "Female", "Other", "Prefer not to say"]}
                      onChange={(val: string) => handleInput("gender", val)}
                      theme={{ ...theme, text: "#1A1A1A" }}
                    />
                    <CustomDropdown 
                      label="Marital Status"
                      value={responses.marital_status}
                      options={["Single", "Married", "Divorced", "Widowed"]}
                      onChange={(val: string) => handleInput("marital_status", val)}
                      theme={{ ...theme, text: "#1A1A1A" }}
                    />
                  </div>
                  <div className="pt-0">
                    <input type="text" placeholder="Number of Family Members" value={responses.family_members || ""} onChange={(e) => handleInput("family_members", e.target.value)} className="w-full bg-[#FFFFFF] border border-[#E2DCD3] rounded-full px-5 py-3 text-sm focus:outline-none focus:border-[#CB5A35] transition-colors font-light placeholder-[#888888] shadow-inner text-[#1A1A1A]" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                    <div className="flex flex-col justify-start">
                      <p className="text-[10px] tracking-[0.2em] uppercase opacity-60 mb-3 font-medium h-8 flex items-end">Kids?</p>
                      <div className="flex gap-2">
                        {["Yes", "No"].map(opt => <button key={opt} onClick={() => handleInput("kids", opt)} className={`flex-1 py-2 rounded-full text-xs border ${responses.kids === opt ? 'text-white' : ''}`} style={{ backgroundColor: responses.kids === opt ? '#CB5A35' : 'transparent', borderColor: responses.kids === opt ? '#CB5A35' : `#E2DCD3`, color: responses.kids === opt ? '#fff' : '#1A1A1A' }}>{opt}</button>)}
                      </div>
                    </div>
                    <div className="flex flex-col justify-start">
                      <p className="text-[10px] tracking-[0.2em] uppercase opacity-60 mb-3 font-medium h-8 flex items-end leading-tight">Parents with you?</p>
                      <div className="flex gap-2">
                        {["Yes", "No"].map(opt => <button key={opt} onClick={() => handleInput("parents", opt)} className={`flex-1 py-2 rounded-full text-xs border ${responses.parents === opt ? 'text-white' : ''}`} style={{ backgroundColor: responses.parents === opt ? '#CB5A35' : 'transparent', borderColor: responses.parents === opt ? '#CB5A35' : `#E2DCD3`, color: responses.parents === opt ? '#fff' : '#1A1A1A' }}>{opt}</button>)}
                      </div>
                    </div>
                    <div className="flex flex-col justify-start">
                      <p className="text-[10px] tracking-[0.2em] uppercase opacity-60 mb-3 font-medium h-8 flex items-end">Pets?</p>
                      <div className="flex gap-2">
                        {["Yes", "No"].map(opt => <button key={opt} onClick={() => handleInput("pets", opt)} className={`flex-1 py-2 rounded-full text-xs border ${responses.pets === opt ? 'text-white' : ''}`} style={{ backgroundColor: responses.pets === opt ? '#CB5A35' : 'transparent', borderColor: responses.pets === opt ? '#CB5A35' : `#E2DCD3`, color: responses.pets === opt ? '#fff' : '#1A1A1A' }}>{opt}</button>)}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 1 && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
                  {/* Card 1: Property Type */}
                  <div className="bg-[#F2EFE8] text-[#1A1A1A] p-5 rounded-[24px] shadow-lg border border-white/50 flex flex-col justify-start">
                    <p className="text-[10px] tracking-[0.2em] uppercase opacity-60 mb-4 font-medium text-center">Property Type</p>
                    <div className="grid grid-cols-2 gap-2">
                      {["Apartment", "Villa", "Bungalow", "Penthouse", "Office", "Commercial", "Retail", "Restaurant", "Clinic", "Factory", "Warehouse"].map(opt => (
                        <button
                          key={opt} onClick={() => handleInput("property_type", opt)}
                          className={`px-2 py-2 rounded-xl text-[10px] font-medium tracking-wide transition-all border ${responses.property_type === opt ? 'text-white shadow-md' : 'bg-transparent hover:opacity-100'}`}
                          style={{ 
                            backgroundColor: responses.property_type === opt ? '#CB5A35' : 'transparent',
                            borderColor: responses.property_type === opt ? '#CB5A35' : `#E2DCD3`,
                            color: responses.property_type === opt ? '#fff' : '#1A1A1A'
                          }}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                    <input
                      type="text"
                      placeholder="Or specify other..."
                      value={responses.custom_property_type || ""}
                      onChange={(e) => handleInput("custom_property_type", e.target.value)}
                      className="w-full bg-[#FFFFFF] border border-[#E2DCD3] rounded-xl px-4 py-2 text-[10px] focus:outline-none focus:border-[#CB5A35] transition-colors font-light mt-auto pt-2 placeholder-[#888888] text-[#1A1A1A]"
                    />
                  </div>

                  {/* Card 2: Property Status + Renovation Required */}
                  <div className="bg-[#F2EFE8] text-[#1A1A1A] p-5 rounded-[24px] shadow-lg border border-white/50 flex flex-col justify-between">
                    <div>
                      <p className="text-[10px] tracking-[0.2em] uppercase opacity-60 mb-4 font-medium text-center">Property Status</p>
                      <div className="grid grid-cols-1 gap-2">
                        {["Already Owned", "Buying Soon", "Under Construction", "Planning"].map(opt => (
                          <button
                            key={opt} onClick={() => handleInput("property_status", opt)}
                            className={`px-3 py-2 rounded-xl text-[10px] font-medium tracking-wide transition-all border ${responses.property_status === opt ? 'text-white shadow-md' : 'bg-transparent hover:opacity-100'}`}
                            style={{ 
                              backgroundColor: responses.property_status === opt ? '#CB5A35' : 'transparent',
                              borderColor: responses.property_status === opt ? '#CB5A35' : `#E2DCD3`,
                              color: responses.property_status === opt ? '#fff' : '#1A1A1A'
                            }}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                      <input
                        type="text"
                        placeholder="Or specify other..."
                        value={responses.custom_property_status || ""}
                        onChange={(e) => handleInput("custom_property_status", e.target.value)}
                        className="w-full bg-[#FFFFFF] border border-[#E2DCD3] rounded-xl px-4 py-2 text-[10px] focus:outline-none focus:border-[#CB5A35] transition-colors font-light mt-3 placeholder-[#888888] text-[#1A1A1A]"
                      />
                    </div>

                    <div className="mt-4 pt-4 border-t border-[#E2DCD3]/30 flex items-center justify-between">
                      <div>
                        <p className="text-[10px] tracking-[0.1em] uppercase font-medium text-[#1A1A1A]">Is Renovation Required?</p>
                        <p className="text-[9px] opacity-60 mt-1 leading-tight">Check if structural changes needed.</p>
                      </div>
                      <button 
                        onClick={() => handleInput("is_renovation_required", responses.is_renovation_required === "Yes" ? "No" : "Yes")}
                        className={`relative w-10 h-5 rounded-full transition-colors duration-300 flex-shrink-0 ml-2 ${responses.is_renovation_required === "Yes" ? "bg-[#CB5A35]" : "bg-[#E2DCD3]"}`}
                      >
                        <div className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform duration-300 ${responses.is_renovation_required === "Yes" ? "translate-x-5" : "translate-x-0"}`} />
                      </button>
                    </div>
                  </div>

                  {/* Card 3: Renovation Type */}
                  <div className="bg-[#F2EFE8] text-[#1A1A1A] p-5 rounded-[24px] shadow-lg border border-white/50 flex flex-col justify-start">
                    <p className="text-[10px] tracking-[0.2em] uppercase opacity-60 mb-4 font-medium text-center">Renovation Type</p>
                    <div className="grid grid-cols-1 gap-2">
                      {["New Interior", "Renovation", "Partial Renovation", "Only Modular Kitchen", "Office Renovation", "Commercial Fit-out"].map(opt => (
                        <button
                          key={opt} onClick={() => handleInput("renovation_type", opt)}
                          className={`px-3 py-2 rounded-xl text-[10px] font-medium tracking-wide transition-all border ${responses.renovation_type === opt ? 'text-white shadow-md' : 'bg-transparent hover:opacity-100'}`}
                          style={{ 
                            backgroundColor: responses.renovation_type === opt ? '#CB5A35' : 'transparent',
                            borderColor: responses.renovation_type === opt ? '#CB5A35' : `#E2DCD3`,
                            color: responses.renovation_type === opt ? '#fff' : '#1A1A1A'
                          }}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Bottom Row - Centered */}
                  {responses.is_renovation_required === "Yes" && (
                    <div className="lg:col-span-3 flex flex-col md:flex-row justify-center gap-4 lg:gap-6 mt-1">
                      {/* Card 4: Budget */}
                      <div className="bg-[#F2EFE8] text-[#1A1A1A] p-5 rounded-[24px] shadow-lg border border-white/50 w-full md:w-[350px]">
                        <p className="text-[10px] tracking-[0.2em] uppercase opacity-60 mb-4 font-medium text-center">Budget</p>
                        <div className="flex flex-wrap gap-2 justify-center">
                          {["5-10L", "10-20L", "20-35L", "35-50L", "50L+"].map(opt => (
                            <button
                              key={opt} onClick={() => handleInput("budget", opt)}
                              className={`px-4 py-2 rounded-xl text-[10px] font-medium tracking-wide transition-all border ${responses.budget === opt ? 'text-white shadow-md' : 'bg-transparent hover:opacity-100'}`}
                              style={{ 
                                backgroundColor: responses.budget === opt ? '#CB5A35' : 'transparent',
                                borderColor: responses.budget === opt ? '#CB5A35' : `#E2DCD3`,
                                color: responses.budget === opt ? '#fff' : '#1A1A1A'
                              }}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Card 5: Timeline */}
                      <div className="bg-[#F2EFE8] text-[#1A1A1A] p-5 rounded-[24px] shadow-lg border border-white/50 w-full md:w-[350px]">
                        <p className="text-[10px] tracking-[0.2em] uppercase opacity-60 mb-4 font-medium text-center">Timeline</p>
                        <div className="flex flex-wrap gap-2 justify-center">
                          {["Immediately", "Within 3 months", "6 months", "1 year", "Just Exploring"].map(opt => (
                            <button
                              key={opt} onClick={() => handleInput("timeline", opt)}
                              className={`px-4 py-2 rounded-xl text-[10px] font-medium tracking-wide transition-all border ${responses.timeline === opt ? 'text-white shadow-md' : 'bg-transparent hover:opacity-100'}`}
                              style={{ 
                                backgroundColor: responses.timeline === opt ? '#CB5A35' : 'transparent',
                                borderColor: responses.timeline === opt ? '#CB5A35' : `#E2DCD3`,
                                color: responses.timeline === opt ? '#fff' : '#1A1A1A'
                              }}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-12">
                  <div>
                    <p className="text-[10px] tracking-[0.2em] uppercase opacity-60 mb-5 font-medium">Daily Habits</p>
                    <div className="flex flex-wrap gap-3">
                      {["How often do guests visit?", "Do you work from home?", "Do you cook daily?", "Do you host parties?", "Need kids area?", "Need pet-friendly furniture?", "Need home office?", "Love plants?", "Need prayer room?", "Minimal maintenance?", "Travel frequently?"].map(opt => {
                        const isSelected = (responses.lifestyle || []).includes(opt);
                        return (
                          <button
                            key={opt} onClick={() => handleMultiSelect("lifestyle", opt)}
                            className={`px-5 py-3 rounded-full text-xs tracking-wide transition-all border flex items-center gap-2 ${isSelected ? 'text-white shadow-md' : 'bg-transparent hover:opacity-100'}`}
                            style={{ 
                              backgroundColor: isSelected ? '#CB5A35' : 'transparent',
                              borderColor: isSelected ? '#CB5A35' : `#E2DCD3`,
                              color: isSelected ? '#fff' : '#1A1A1A'
                            }}
                          >
                            {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white"></div>}
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                    <input
                      type="text"
                      placeholder="Or describe a typical day..."
                      value={responses.custom_lifestyle || ""}
                      onChange={(e) => handleInput("custom_lifestyle", e.target.value)}
                      className="w-full bg-[#FFFFFF] border border-[#E2DCD3] rounded-full px-5 py-3 text-sm focus:outline-none focus:border-[#CB5A35] transition-colors font-light mt-4 placeholder-[#888888] text-[#1A1A1A]"
                    />
                  </div>

                  <div>
                    <p className="text-[10px] tracking-[0.2em] uppercase opacity-60 mb-5 font-medium">Storage Requirements</p>
                    <div className="flex flex-wrap gap-3">
                      {["Maximum Storage", "Hidden Storage", "Luxury Display", "Walk-in Wardrobe", "Open Shelves"].map(opt => {
                        const isSelected = (responses.storage || []).includes(opt);
                        return (
                          <button
                            key={opt} onClick={() => handleMultiSelect("storage", opt)}
                            className={`px-5 py-3 rounded-full text-xs tracking-wide transition-all border flex items-center gap-2 ${isSelected ? 'text-white shadow-md' : 'bg-transparent hover:opacity-100'}`}
                            style={{ 
                              backgroundColor: isSelected ? '#CB5A35' : 'transparent',
                              borderColor: isSelected ? '#CB5A35' : `#E2DCD3`,
                              color: isSelected ? '#fff' : '#1A1A1A'
                            }}
                          >
                            {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white"></div>}
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-8">
                    <div>
                      <p className="text-[10px] tracking-[0.2em] uppercase opacity-60 mb-5 font-medium">Smart Home</p>
                      <div className="flex flex-wrap gap-3">
                        {["Yes", "No", "Maybe"].map(opt => (
                          <button
                            key={opt} onClick={() => handleInput("smart_home", opt)}
                            className={`px-6 py-3 rounded-full text-xs tracking-wide transition-all border ${responses.smart_home === opt ? 'text-white shadow-md' : 'bg-transparent hover:opacity-100'}`}
                            style={{ 
                              backgroundColor: responses.smart_home === opt ? '#CB5A35' : 'transparent',
                              borderColor: responses.smart_home === opt ? '#CB5A35' : `#E2DCD3`,
                              color: responses.smart_home === opt ? '#fff' : '#1A1A1A'
                            }}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-12">
                  <div>
                    <p className="text-[10px] tracking-[0.2em] uppercase opacity-60 mb-5 font-medium">Traits</p>
                    <div className="grid grid-cols-2 gap-4">
                      {["Creative", "Analytical", "Luxury Lover", "Nature Lover", "Minimalist", "Traditional", "Modern", "Family First", "Tech Enthusiast", "Collector", "Business Owner", "Artist"].map(opt => {
                        const isSelected = (responses.personality || []).includes(opt);
                        return (
                          <button
                            key={opt} onClick={() => handleMultiSelect("personality", opt, 3)}
                            className={`py-5 px-4 rounded-[12px] text-xs tracking-widest uppercase transition-all border text-center ${isSelected ? 'text-white shadow-md' : 'bg-transparent hover:opacity-100'}`}
                            style={{ 
                              backgroundColor: isSelected ? '#CB5A35' : 'transparent',
                              borderColor: isSelected ? '#CB5A35' : `#E2DCD3`,
                              color: isSelected ? '#fff' : '#1A1A1A'
                            }}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                    <input
                      type="text"
                      placeholder="Or type your own trait..."
                      value={responses.custom_personality || ""}
                      onChange={(e) => handleInput("custom_personality", e.target.value)}
                      className="w-full bg-[#FFFFFF] border border-[#E2DCD3] rounded-full px-5 py-3 text-sm focus:outline-none focus:border-[#CB5A35] transition-colors font-light mt-4 placeholder-[#888888] text-[#1A1A1A]"
                    />
                  </div>
                </div>
              )}

              {currentStep === 4 && (
                <div className="space-y-12">
                  <div>
                    <p className="text-[10px] tracking-[0.2em] uppercase opacity-60 mb-5 font-medium">Favourite Hotel</p>
                    <div className="grid grid-cols-2 gap-4">
                      {["Taj", "Oberoi", "Leela", "Airbnb Style", "Minimal Scandinavian", "Royal Palace", "Mountain Cabin", "Beach Resort"].map(opt => (
                        <button
                          key={opt} onClick={() => handleInput("hotel", opt)}
                          className={`py-6 px-4 rounded-[12px] text-xs tracking-widest uppercase transition-all border text-center ${responses.hotel === opt ? 'text-white shadow-md' : 'bg-transparent hover:opacity-100'}`}
                          style={{ 
                            backgroundColor: responses.hotel === opt ? '#CB5A35' : 'transparent',
                            borderColor: responses.hotel === opt ? '#CB5A35' : `#E2DCD3`,
                            color: responses.hotel === opt ? '#fff' : '#1A1A1A'
                          }}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                    <input
                      type="text"
                      placeholder="Or specify another hotel/vibe..."
                      value={responses.custom_hotel || ""}
                      onChange={(e) => handleInput("custom_hotel", e.target.value)}
                      className="w-full bg-[#FFFFFF] border border-[#E2DCD3] rounded-full px-5 py-3 text-sm focus:outline-none focus:border-[#CB5A35] transition-colors font-light mt-4 placeholder-[#888888] text-[#1A1A1A]"
                    />
                  </div>
                </div>
              )}

              {currentStep === 5 && (
                <div className="space-y-12">
                  <div>
                    <p className="text-[10px] tracking-[0.2em] uppercase opacity-60 mb-5 font-medium">Color Palette</p>
                    <div className="flex flex-wrap gap-6">
                      {[
                        { name: "Earthy", hex: "#8C4A3A" },
                        { name: "Monochrome", hex: "#2A2A2A" },
                        { name: "Warm", hex: "#E8DCC4" },
                        { name: "Dark", hex: "#1B2A41" },
                        { name: "Bright", hex: "#F5F5F0" },
                        { name: "Luxury", hex: "#B58A4B" }
                      ].map(opt => (
                        <button
                          key={opt.name} onClick={() => handleInput("color", opt.name)}
                          className={`flex flex-col items-center gap-3 transition-all ${responses.color === opt.name ? 'scale-110' : 'opacity-60 hover:opacity-100'}`}
                        >
                          <div className={`w-12 h-12 rounded-full shadow-inner ${responses.color === opt.name ? 'ring-2 ring-offset-2 ring-[#B58A4B]' : 'ring-1 ring-[#E8E3DA]'}`} style={{ backgroundColor: opt.hex }}></div>
                          <span className="text-[10px] tracking-wider uppercase opacity-60">{opt.name}</span>
                        </button>
                      ))}
                    </div>
                    <input
                      type="text"
                      placeholder="Or specify any other color preferences..."
                      value={responses.custom_color || ""}
                      onChange={(e) => handleInput("custom_color", e.target.value)}
                      className="w-full bg-[#FFFFFF] border border-[#E2DCD3] rounded-full px-5 py-3 text-sm focus:outline-none focus:border-[#CB5A35] transition-colors font-light mt-6 placeholder-[#888888] text-[#1A1A1A]"
                    />
                  </div>

                  <div>
                    <p className="text-[10px] tracking-[0.2em] uppercase opacity-60 mb-5 font-medium">Lighting</p>
                    <div className="flex flex-wrap gap-3">
                      {["Warm", "White", "Natural", "Luxury", "Hotel Feel"].map(opt => (
                        <button
                          key={opt} onClick={() => handleInput("lighting", opt)}
                          className={`px-6 py-3 rounded-full text-xs tracking-wide transition-all border ${responses.lighting === opt ? 'text-white shadow-md' : 'bg-transparent hover:opacity-100'}`}
                          style={{ 
                            backgroundColor: responses.lighting === opt ? '#CB5A35' : 'transparent',
                            borderColor: responses.lighting === opt ? '#CB5A35' : `#E2DCD3`,
                            color: responses.lighting === opt ? '#fff' : '#1A1A1A'
                          }}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 6 && (
                <div>
                  <div className="grid grid-cols-2 gap-4">
                    {["Elegant", "Cozy", "Luxurious", "Royal", "Minimal", "Premium", "Timeless", "Bold"].map(opt => (
                      <button
                        key={opt} onClick={() => handleInput("vision", opt)}
                        className={`py-5 px-4 rounded-[12px] text-xs tracking-widest uppercase transition-all border text-center ${responses.vision === opt ? 'text-white shadow-md' : 'bg-transparent hover:opacity-100'}`}
                        style={{ 
                          backgroundColor: responses.vision === opt ? '#CB5A35' : 'transparent',
                          borderColor: responses.vision === opt ? '#CB5A35' : `#E2DCD3`,
                          color: responses.vision === opt ? '#fff' : '#1A1A1A'
                        }}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                  <input
                    type="text"
                    placeholder="Or enter your own word..."
                    value={responses.custom_vision || ""}
                    onChange={(e) => handleInput("custom_vision", e.target.value)}
                    className="w-full bg-[#FFFFFF] border border-[#E2DCD3] rounded-full px-5 py-3 text-sm focus:outline-none focus:border-[#CB5A35] transition-colors font-light mt-4 placeholder-[#888888] text-[#1A1A1A]"
                  />
                </div>
              )}

            </motion.div>
          </AnimatePresence>
          
            {/* Buttons - Flow naturally below the form */}
            <div className="flex items-center justify-between max-w-2xl mx-auto w-full mt-8">
              {currentStep > 0 ? (
                <button onClick={handleBack} className="flex items-center text-[10px] tracking-[0.25em] uppercase opacity-60 hover:opacity-100 transition-opacity font-bold text-[#1A1A1A]">
                  <ChevronLeft size={14} className="mr-2" /> Back
                </button>
              ) : <div></div>}
              
              <button
                onClick={handleNext}
                className="group flex items-center py-4 px-8 rounded-full text-[10px] tracking-[0.25em] uppercase transition-all shadow-lg hover:shadow-xl hover:scale-105"
                style={{ backgroundColor: "#1A1A1A", color: "#FFFFFF" }}
              >
                {currentStep === 6 ? "Generate Report" : "Continue"}
                <ArrowRight size={14} className="ml-3 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
            
          </div>
        </div>
      </div>

      {/* RIGHT SIDE - DYNAMIC IMAGE */}
      <div className="w-full lg:w-1/2 relative z-0 bg-[#1A1A1A] hidden lg:block h-full">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentStep}
            src={IMAGES[currentStep]}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ 
              opacity: 1, 
              scale: [1.05, 1.15, 1.05],
              x: ["0%", "-2%", "0%"],
              y: ["0%", "1%", "0%"]
            }}
            exit={{ opacity: 0 }}
            transition={{ 
              opacity: { duration: 1.5, ease: "easeInOut" },
              scale: { duration: 40, ease: "linear", repeat: Infinity },
              x: { duration: 50, ease: "linear", repeat: Infinity },
              y: { duration: 60, ease: "linear", repeat: Infinity }
            }}
            className="absolute inset-0 w-full h-full object-cover opacity-90 origin-center"
            alt="Luxury Interior Inspiration"
          />
        </AnimatePresence>
        {/* Subtle dark gradient overlay */}
        <div className="absolute inset-0 bg-black/10"></div>
        {/* Dynamic Lighting Overlay based on user preference */}
        <div 
          className="absolute inset-0 pointer-events-none transition-colors duration-1000 ease-in-out"
          style={{
            backgroundColor: 
              responses.lighting === "Warm" ? "rgba(255, 180, 100, 0.15)" :
              responses.lighting === "White" ? "rgba(255, 255, 255, 0.1)" :
              responses.lighting === "Natural" ? "rgba(200, 220, 255, 0.1)" :
              responses.lighting === "Luxury" ? "rgba(181, 138, 75, 0.2)" :
              responses.lighting === "Hotel Feel" ? "rgba(20, 20, 20, 0.4)" : "transparent",
            mixBlendMode: 
              responses.lighting === "Hotel Feel" ? "multiply" :
              (responses.lighting === "Warm" || responses.lighting === "Luxury") ? "color" : "overlay"
          }}
        ></div>
      </div>
    </div>
  );
}

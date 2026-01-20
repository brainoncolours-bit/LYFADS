"use client";
import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// --- DUMMY DATA ---
const LOREM_DESC = "We redefine visual boundaries through high-fidelity production and narrative-driven design. Our process involves deep conceptualization where we map the emotional arc of your audience before a single frame is shot.";

const services = [
  { id: "01", title: "Ad Films", tag: "Emotion × Impact", description: LOREM_DESC, image: "https://images.unsplash.com/photo-1536240478700-b869070f9279?q=80&w=2000" },
  { id: "02", title: "Brand Worlds", tag: "Stories with gravity", description: LOREM_DESC, image: "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?q=80&w=2000" },
  { id: "03", title: "VFX & CGI", tag: "Reality re-engineered", description: LOREM_DESC, image: "https://images.unsplash.com/photo-1633167606207-d840b5070fc2?q=80&w=2000" },
  { id: "04", title: "Product Films", tag: "Objects made iconic", description: LOREM_DESC, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=2000" },
  { id: "05", title: "Motion Design", tag: "Movement with intent", description: LOREM_DESC, image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2000" },
  { id: "06", title: "Immersive Web", tag: "Digital spaces alive", description: LOREM_DESC, image: "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=2000" },
];

/**
 * NEW COMPONENT: Peripheral Production Elements
 * Adds 3D-feeling HUD elements to the sides of the screen
 */
const PeripheralElements = () => {
  return (
    <div className="hidden xl:block">
      {/* LEFT SIDE: Film Strip & Coordinates */}
      <div className="fixed left-4 top-0 h-full w-12 z-40 flex flex-col items-center justify-between py-24 pointer-events-none">
        <motion.div 
          animate={{ y: [0, -20, 0] }} 
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col gap-2 opacity-20"
        >
          {[...Array(10)].map((_, i) => (
            <div key={i} className="w-8 h-12 border border-white/40 rounded-sm flex items-center justify-center text-[8px] font-mono">
              {i + 100}
            </div>
          ))}
        </motion.div>
        
        <div className="rotate-90 origin-center whitespace-nowrap overflow-hidden">
          <motion.p 
            animate={{ x: [0, -100] }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="text-[10px] font-mono text-red-600 tracking-[1em] uppercase"
          >
            RAW_FOOTAGE_SEQUENCE_0921_PROD_LOG_STABLE
          </motion.p>
        </div>
      </div>

      {/* RIGHT SIDE: 3D Technical HUD */}
      <div className="fixed right-8 top-1/2 -translate-y-1/2 z-40 flex flex-col items-center gap-12 pointer-events-none">
        {/* Rotating 3D Box Wireframe */}
        <motion.div 
          animate={{ rotateY: 360, rotateX: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-2 border-red-600/30 relative"
        >
          <div className="absolute inset-0 border border-white/20 scale-75 rotate-45" />
        </motion.div>

        {/* Vertical Progress/Levels */}
        <div className="flex gap-1 h-32 items-end">
          {[40, 70, 100, 60, 80, 30].map((h, i) => (
            <motion.div 
              key={i}
              animate={{ height: [`${h}%`, `${h-20}%`, `${h}%`] }}
              transition={{ duration: 1 + (i*0.2), repeat: Infinity }}
              className="w-1 bg-white/10" 
            />
          ))}
        </div>

        <p className="[writing-mode:vertical-lr] text-[10px] font-mono text-white/20 tracking-widest">
          SYSTEM_HEALTH: OPTIMAL // 24FPS
        </p>
      </div>
    </div>
  );
};

export default function UnifiedPortalServices() {
  const containerRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(null);
  const [typedText, setTypedText] = useState("");

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);

  useEffect(() => {
    if (activeIndex === null) {
      setTypedText("");
      return;
    }
    const fullText = services[activeIndex].description;
    let charIndex = 0;
    setTypedText("");
    const interval = setInterval(() => {
      if (charIndex <= fullText.length) {
        setTypedText(fullText.slice(0, charIndex));
        charIndex++;
      } else { clearInterval(interval); }
    }, 4); 
    return () => clearInterval(interval);
  }, [activeIndex]);

  return (
    <>
      <Navbar />
      <div className="bg-black text-white min-h-screen font-sans selection:bg-red-500/30 relative">
        
        {/* 3D FLOATING SIDEBARS */}
        <PeripheralElements />

        <section ref={containerRef} className="relative py-32 px-6 md:px-12 lg:px-32 overflow-hidden">
          {/* ATMOSPHERIC BACKGROUND */}
          <motion.div style={{ y: bgY }} className="absolute inset-0 z-0 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-b from-black via-[#0a0a0a] to-black" />
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-red-900/10 blur-[160px] rounded-full" />
          </motion.div>

          {/* HEADER */}
          <div className="relative z-10 max-w-7xl mx-auto mb-20">
            <motion.p className="text-red-500 font-mono text-sm tracking-[0.4em] uppercase mb-4">
              Capabilities_2026
            </motion.p>
            <motion.h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.85]">
              THE ART OF <br /> <span className="text-red-600">VISUAL IMPACT.</span>
            </motion.h1>
          </div>

          {/* INTERACTIVE GRID */}
          <div className="relative z-20 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((s, i) => (
              <motion.div
                key={s.id}
                onClick={() => setActiveIndex(i)}
                className="group relative h-[350px] rounded-xl overflow-hidden cursor-pointer border border-white/5 bg-[#080808]"
                whileHover={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-red-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <div className="absolute bottom-8 left-8 z-10">
                  <p className="text-white/30 font-mono text-[10px] uppercase mb-1">{s.tag}</p>
                  <h3 className="text-3xl font-bold tracking-tight group-hover:text-red-500 transition-colors">{s.title}</h3>
                </div>
                <div className="absolute top-8 right-8 text-white/10 font-mono text-xs">[{s.id}]</div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* MODAL PORTAL */}
        <AnimatePresence>
          {activeIndex !== null && (
            <div className="fixed inset-0 z-[999] flex items-center justify-center p-0 md:p-6">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setActiveIndex(null)} className="absolute inset-0 bg-black/95 backdrop-blur-xl" />
              <motion.div 
                layoutId={`card-${services[activeIndex].id}`}
                className="relative w-full h-full md:w-[95vw] md:h-[90vh] bg-[#0c0c0c] md:rounded-[2rem] border border-white/10 shadow-2xl overflow-hidden flex flex-col lg:flex-row"
              >
                {/* Visual Side */}
                <div className="relative w-full lg:w-1/2 h-1/3 lg:h-full bg-black overflow-hidden">
                   <div className="absolute inset-0 bg-center bg-cover grayscale opacity-60" style={{ backgroundImage: `url(${services[activeIndex].image})` }} />
                   <div className="absolute bottom-12 left-12 text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none">{services[activeIndex].title}</div>
                </div>
                {/* Content Side */}
                <div className="w-full lg:w-1/2 p-8 md:p-16 lg:p-20 flex flex-col justify-between">
                  <button onClick={() => setActiveIndex(null)} className="absolute top-10 right-10 text-white/40 hover:text-red-500 font-mono text-xs uppercase tracking-widest">[ Close ]</button>
                  <div>
                    <p className="text-red-500 font-mono tracking-[0.3em] uppercase text-xs mb-8">Service Exploration</p>
                    <p className="text-2xl md:text-3xl font-light leading-relaxed text-white/80 italic">“{typedText}”</p>
                  </div>
                  <div className="mt-16 pt-10 border-t border-white/10 grid grid-cols-4 gap-4 uppercase font-mono text-[10px] text-white/30">
                    <div><p>Status</p><p className="text-white">Active</p></div>
                    <div><p>FPS</p><p className="text-white">24.00</p></div>
                    <div><p>Res</p><p className="text-white">8K_RAW</p></div>
                    <div><p>Code</p><p className="text-white">RED_01</p></div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
      <Footer />
    </>
  );
}
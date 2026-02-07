"use client";
import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const SERVICES = [
  { id: "01", title: "Ad Films", tag: "8K_RED", desc: "High-fidelity commercial production for global brands.", img: "https://images.unsplash.com/photo-1536240478700-b869070f9279?q=80&w=1200" },
  { id: "02", title: "Music Videos", tag: "SONY_V", desc: "Narrative-driven visualizers for the music industry.", img: "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=1200" },
  { id: "03", title: "VFX / CGI", tag: "UNREAL", desc: "Photorealistic environments and digital asset integration.", img: "https://images.unsplash.com/photo-1633167606207-d840b5070fc2?q=80&w=1200" },
  { id: "04", title: "Drone FPV", tag: "DJI_AV", desc: "High-speed aerial tracking and cinematic fly-throughs.", img: "https://images.unsplash.com/photo-1473960104372-7a0e5b228c23?q=80&w=1200" },
  { id: "05", title: "Fashion", tag: "35MM", desc: "High-contrast editorial films focusing on texture.", img: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=1200" },
  { id: "06", title: "Product", tag: "MACRO", desc: "Extreme detail capture for luxury goods.", img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1200" },
  { id: "07", title: "Documentary", tag: "RAW", desc: "Human-centric storytelling with a cinematic lens.", img: "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=1200" },
  { id: "08", title: "Color Grade", tag: "LOG_C", desc: "Precision color science and visual mood setting.", img: "https://images.unsplash.com/photo-1535016120720-40c646be44da?q=80&w=1200" },
  { id: "09", title: "Corporate", tag: "4K_INT", desc: "Elevated brand communications and executive interviews.", img: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=1200" },
  { id: "10", title: "Social", tag: "9:16", desc: "High-impact vertical content for digital platforms.", img: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=1200" },
  { id: "11", title: "Motion", tag: "2D_3D", desc: "Dynamic typography and graphics-driven visuals.", img: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1200" },
  { id: "12", title: "Live", tag: "BROAD", desc: "Multi-cam production and real-time streaming.", img: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1200" },
];

const SprocketStrip = () => (
  <div className="flex justify-between px-2 py-4">
    {[...Array(10)].map((_, i) => (
      <div key={i} className="w-4 h-6 bg-[#111] rounded-sm border border-white/5 shadow-inner" />
    ))}
  </div>
);

export default function FilmStripServices() {
  const scrollRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: scrollRef });

  // Maps vertical scroll to a horizontal slide
  const xTranslate = useTransform(scrollYProgress, [0, 1], ["0%", "-85%"]);

  return (
    <div className="bg-[#050505] text-white selection:bg-red-600">
      <Navbar />

      {/* FIXED BACKGROUND ELEMENTS */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-0 w-full h-[1px] bg-red-600/20 z-0" />
        <div className="absolute top-[15%] left-10 font-mono text-[10px] text-red-600/40 rotate-90 origin-left tracking-[1em]">
          KODAK_5219_7219_NEG_PROCESS
        </div>
      </div>

      {/* HERO SECTION */}
      <section className="h-[60vh] flex flex-col justify-end px-8 md:px-20 pb-20">
        <motion.p 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          className="text-red-600 font-mono text-sm tracking-[0.5em] mb-4"
        >
          // MASTER_COLLECTION_2026
        </motion.p>
        <h1 className="text-6xl md:text-9xl font-black tracking-tighter uppercase leading-[0.8]">
          THE <span className="text-stone-800">FILM</span> <br />STRIP.
        </h1>
      </section>

      {/* HORIZONTAL SCROLL AREA */}
      <section ref={scrollRef} className="relative h-[600vh]">
        <div className="sticky top-0 h-screen flex items-center overflow-hidden">
          <motion.div style={{ x: xTranslate }} className="flex gap-12 px-20">
            {SERVICES.map((s, idx) => (
              <div key={s.id} className="relative flex-shrink-0">
                {/* FILM CELL CONTAINER */}
                <div className="w-[85vw] md:w-[600px] bg-[#0a0a0a] border-x border-white/10 flex flex-col group">
                  <SprocketStrip />
                  
                  <div className="relative aspect-[16/9] overflow-hidden mx-4 bg-black">
                    <img 
                      src={s.img} 
                      alt={s.title}
                      className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-110" 
                    />
                    <div className="absolute inset-0 bg-red-900/10 group-hover:bg-transparent transition-colors" />
                    <div className="absolute top-4 right-4 text-[10px] font-mono text-white/50">
                      FRAME_{idx * 24}
                    </div>
                  </div>

                  <SprocketStrip />

                  {/* CELL DESCRIPTION */}
                  <div className="p-8 space-y-4">
                    <div className="flex justify-between items-baseline">
                      <h3 className="text-4xl font-black uppercase italic tracking-tighter group-hover:text-red-600 transition-colors">
                        {s.title}
                      </h3>
                      <span className="font-mono text-xs text-stone-500">[{s.tag}]</span>
                    </div>
                    <p className="text-stone-400 font-light text-sm max-w-sm">
                      {s.desc}
                    </p>
                  </div>
                </div>

                {/* BACKGROUND CELL NUMBER */}
                <div className="absolute -bottom-10 left-0 font-mono text-8xl text-white/5 select-none font-bold">
                  {s.id}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FOOTER CALL TO ACTION */}
      <section className="h-[80vh] flex flex-col items-center justify-center text-center px-6">
        <div className="w-1 bg-red-600 h-24 mb-10" />
        <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-8">
          CUT TO: <br /><span className="text-red-600 italic">CONVERSATION.</span>
        </h2>
        <motion.button 
          whileHover={{ backgroundColor: "#dc2626", color: "#fff" }}
          className="px-12 py-4 border-2 border-red-600 text-red-600 font-bold uppercase tracking-widest transition-all"
        >
          Book Your Shoot
        </motion.button>
      </section>

      <Footer />
    </div>
  );
}
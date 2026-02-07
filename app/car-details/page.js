"use client";
import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
const SERVICES = [
  {
    id: "01",
    title: "Marketing Video",
    tag: "YT_MOBILE",
    desc: "Strategic video content built for digital attention. From YouTube’s early ad formats to mobile-first storytelling shaped by post-pandemic viewing behavior.",
    img: "https://images.unsplash.com/photo-1536240478700-b869070f9279?q=80&w=1200",
  },
  {
    id: "02",
    title: "Corporate Advertising",
    tag: "PR_BRAND",
    desc: "Reputation-driven advertising that builds trust, credibility, and long-term goodwill beyond products—strengthening the company’s public identity.",
    img: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=1200",
  },
  {
    id: "03",
    title: "Resort Video",
    tag: "DEST_FILM",
    desc: "Immersive destination storytelling that captures ambiance, experience, and emotion—turning locations into irresistible invitations.",
    img: "https://images.unsplash.com/photo-1501117716987-c8e1ecb210c7?q=80&w=1200",
  },
  {
    id: "04",
    title: "Model Photography",
    tag: "EDITORIAL",
    desc: "Fashion imagery that brings apparel to life on real people—helping customers visualize, connect, and confidently choose.",
    img: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=1200",
  },
  {
    id: "05",
    title: "3D Engineering Animation",
    tag: "3D_TECH",
    desc: "Precision animations that simplify complex engineering processes, revealing structure, motion, and interaction beyond static visuals.",
    img: "https://images.unsplash.com/photo-1633167606207-d840b5070fc2?q=80&w=1200",
  },
  {
    id: "06",
    title: "Graphic Design",
    tag: "POP_ART",
    desc: "Distinct visual identities crafted through a personalized design process—transforming ideas into brands that stand apart.",
    img: "https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=1200",
  },
  {
    id: "07",
    title: "Motion Design",
    tag: "2D_3D",
    desc: "Graphic design in motion—where typography, illustration, and imagery animate into clear, engaging visual narratives.",
    img: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1200",
  },
  {
    id: "08",
    title: "Corporate Video",
    tag: "BRAND_FILM",
    desc: "Clear, memorable storytelling that explains who you are, what you do, and why it matters—built for internal and external audiences.",
    img: "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=1200",
  },
  {
    id: "09",
    title: "Event Aftermovie",
    tag: "HIGHLIGHTS",
    desc: "High-energy highlight films capturing conferences, exhibitions, launches, and awards—preserving moments and amplifying reach.",
    img: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1200",
  },
  {
    id: "10",
    title: "VFX / CGI",
    tag: "UNREAL",
    desc: "Photorealistic visual effects and CGI environments seamlessly blended with live-action footage.",
    img: "https://images.unsplash.com/photo-1535016120720-40c646be44da?q=80&w=1200",
  },
  {
    id: "11",
    title: "Drone FPV",
    tag: "AERIAL",
    desc: "Dynamic aerial cinematography and FPV fly-throughs delivering scale, speed, and cinematic movement.",
    img: "https://images.unsplash.com/photo-1473960104372-7a0e5b228c23?q=80&w=1200",
  },
  {
    id: "12",
    title: "Live Production",
    tag: "BROADCAST",
    desc: "Multi-camera live shoots and real-time streaming engineered for reliability, clarity, and audience engagement.",
    img: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1200",
  },
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

  // Increased range from -85% to -92% to accommodate the full list
  const xTranslate = useTransform(scrollYProgress, [0, 1], ["0%", "-92%"]);

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
      <section ref={scrollRef} className="relative h-[800vh]">
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
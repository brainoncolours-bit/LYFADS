"use client";
import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
const SERVICES = [
  {
    id: "01",
    title: "⁠Commercial & Brand Video Production",
    tag: "YT_MOBILE",
    desc: "High-impact visual storytelling crafted to elevate brands. From concept to execution, we produce commercials, brand films, product videos, and high-volume digital content.",
    img: "/assets/services/img1.png",
  },
  {
    id: "02",
    title: "Corporate Video Production",
    tag: "PR_BRAND",
    desc: "Professional films that communicate credibility and vision. We create corporate profiles, leadership interviews, culture films, and business-focused visual content.",
    img: "/assets/services/img4.png",
  },
  {
    id: "03",
    title: "Event Coverage",
    tag: "DEST_FILM",
    desc: "Cinematic multi-camera coverage that captures every key moment. From product launches to corporate events, we deliver impactful highlight and platform-ready edits.",
    img: "/assets/services/img5.jpeg",
  },
  {
    id: "04",
    title: "3D Modeling and AI Video Production",
    tag: "EDITORIAL",
    desc: "Photoreal 3D product visualization Next-generation Al-powered visuals and enhanced video creation. From Al-generated scenes to advanced visual enhancements, we help brands produce futuristic, high-impact content.",
    img: "/assets/services/3dModeling.jpeg",
  },
  {
    id: "05",
    title: "Post-Production",
    tag: "3D_TECH",
    desc: "Precision editing, color grading, motion graphics, and finishing that transform raw footage into powerful final visuals.",
    img: "/assets/services/img2.jpeg",
  }
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
    

      <Footer />
    </div>
  );
}
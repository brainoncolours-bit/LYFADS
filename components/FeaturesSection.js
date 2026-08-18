import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Play, MousePointer2 } from 'lucide-react';

// DATA MIGRATED FROM FILMSTRIP HERO
const PROJECTS = [
  { 
    title: "Create", 
    category: "Brand", 
    video: "/assets/lap/growth.mp4",
    description: "Visual identity engineering and strategic brand film direction."
  },
  { 
    title: "Capture", 
    category: "Production", 
    video: "/assets/lap/web....mp4",
    description: "Cinematic commercial production and high-impact digital storytelling."
  },
  { 
    title: "Inspire", 
    category: "MUSIC VIDEO", 
    video: "/assets/lap/Out.mp4",
    description: "Experimental music video direction and creative narrative direction."
  },
];

const SplitEditorialHero = () => {
  const [activeProjectIndex, setActiveProjectIndex] = useState(0);
  const featured = PROJECTS[activeProjectIndex];

  return (
    <section className="relative min-h-screen w-full bg-[#070707] text-zinc-100 font-sans flex flex-col justify-between p-6 md:p-12 overflow-hidden">
      
      {/* NAVIGATION / HUD BAR */}
      <header className="w-full flex justify-between items-center z-10 border-b border-zinc-900 pb-5">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-black italic tracking-tighter text-white">
            LYF<span className="text-red-600">ADS</span>
          </h1>
          <span className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase">
            / 01 ARCHIVE
          </span>
        </div>

        <div className="flex items-center gap-4 text-[11px] font-mono text-zinc-500 uppercase">
          <div className="hidden sm:flex items-center gap-2 text-zinc-400">
            <MousePointer2 size={12} className="text-red-600" />
            <span>Interactive Portfolio</span>
          </div>
          <span className="text-red-600 font-bold">[ READY TO FILM? ]</span>
        </div>
      </header>

      {/* HERO GRID */}
      <main className="my-auto py-8 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        
        {/* LEFT: EDITORIAL CONTENT & CTA */}
        <div className="lg:col-span-5 flex flex-col justify-between gap-8">
          <div className="flex flex-col gap-4">
            <span className="text-[10px] font-mono text-red-600 tracking-[0.4em] uppercase">
              [{featured.category}]
            </span>
            <h2 className="text-5xl sm:text-7xl font-black italic tracking-tighter text-white uppercase leading-none">
              {featured.title}
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 font-mono leading-relaxed max-w-md pt-2">
              {featured.description}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <button className="flex items-center gap-3 text-xs font-black tracking-wider uppercase bg-white text-black px-8 py-4 hover:bg-red-600 hover:text-white transition-colors">
              <span>GET IN TOUCH</span>
              <ExternalLink size={14} />
            </button>
            
            <div className="flex items-center gap-2 text-[11px] font-mono text-zinc-500 uppercase">
              <div className="h-px w-8 bg-red-600" />
              <span>Scroll to explore</span>
            </div>
          </div>
        </div>

        {/* RIGHT: FEATURED VIDEO DISPLAY + PROJECT SELECTOR */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          
          {/* Active Featured Video */}
          <motion.div 
            key={activeProjectIndex}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="relative aspect-[16/9] bg-zinc-900 border border-zinc-800 rounded-sm overflow-hidden group"
          >
            <video
              src={featured.video}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
            />
            <div className="absolute inset-0 bg-black/30 group-hover:bg-transparent transition-colors duration-500" />
            
            <div className="absolute top-4 right-4 w-10 h-10 rounded-full border border-white/20 bg-black/40 backdrop-blur-md flex items-center justify-center text-white">
              <Play size={14} className="fill-current text-white" />
            </div>
          </motion.div>

          {/* Project Selector Strip */}
          <div className="grid grid-cols-3 gap-3 pt-2">
            {PROJECTS.map((project, idx) => (
              <button
                key={idx}
                onClick={() => setActiveProjectIndex(idx)}
                className={`group text-left p-2.5 bg-zinc-900/40 border rounded-sm transition-all duration-300 flex flex-col gap-2 ${
                  activeProjectIndex === idx 
                    ? "border-red-600 bg-zinc-900" 
                    : "border-zinc-800/60 hover:border-zinc-700"
                }`}
              >
                <div className="w-full aspect-[16/10] bg-zinc-900 rounded-sm overflow-hidden">
                  <video
                    src={project.video}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className={`w-full h-full object-cover transition-all duration-500 ${
                      activeProjectIndex === idx ? "grayscale-0" : "grayscale opacity-60 group-hover:opacity-100"
                    }`}
                  />
                </div>
                <div className="flex justify-between items-center w-full">
                  <span className="text-xs font-black italic uppercase tracking-tight text-white">
                    {project.title}
                  </span>
                  <span className="text-[9px] font-mono text-red-600">
                    0{idx + 1}
                  </span>
                </div>
              </button>
            ))}
          </div>

        </div>

      </main>

      {/* FOOTER */}
      <footer className="w-full flex justify-between items-center border-t border-zinc-900 pt-5 text-[11px] font-mono text-zinc-500 uppercase">
        <div className="flex items-center gap-2">
          <span className="text-red-600 font-bold">01</span>
          <span>/ INDEX ARCHIVE</span>
        </div>
        <span>NAVIGATION: VIEW ALL ON SCREEN</span>
      </footer>

    </section>
  );
};

export default SplitEditorialHero;
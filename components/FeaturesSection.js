import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { MousePointer2, ExternalLink } from 'lucide-react';

const FilmstripHero = () => {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  // Transform vertical scroll into horizontal movement
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-70%"]);
  const springX = useSpring(x, { stiffness: 50, damping: 20 });

  return (
    <section ref={targetRef} className="relative h-[400vh] bg-[#080808]">
      <div className="sticky top-0 h-screen flex items-center overflow-hidden">
        
        {/* HORIZONTAL TRACK */}
        <motion.div style={{ x: springX }} className="flex gap-20 items-center px-[10vw]">
          
          {/* BLOCK 1: BIG TITLE */}
          <div className="flex-shrink-0">
            <h1 className="text-[20vw] font-black italic tracking-tighter text-white leading-none">
              LYF<span className="text-red-600">ADS</span>
            </h1>
            <div className="flex gap-4 items-center mt-4">
              <div className="h-px w-20 bg-red-600" />
              <p className="text-sm font-mono tracking-[0.5em] text-gray-500 uppercase">Scroll to Explore</p>
            </div>
          </div>

          {/* BLOCK 2: PROJECT CARDS */}
          {[
            { title: "URBAN", category: "COMMERCIAL", img: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1000&auto=format&fit=crop" },
            { title: "VELOCITY", category: "AUTOMOTIVE", img: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1000&auto=format&fit=crop" },
            { title: "NEON", category: "MUSIC VIDEO", img: "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=1000&auto=format&fit=crop" },
          ].map((project, i) => (
            <div key={i} className="flex-shrink-0 group relative">
              <div className="relative w-[600px] h-[400px] overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-700">
                <img 
                  src={project.img} 
                  alt={project.title}
                  className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
              </div>
              <div className="mt-6 flex justify-between items-end">
                <div>
                  <p className="text-red-600 font-mono text-xs mb-1">[{project.category}]</p>
                  <h3 className="text-4xl font-black italic tracking-tighter text-white">{project.title}</h3>
                </div>
                <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-red-600 group-hover:border-red-600 transition-all">
                  <ExternalLink size={20} className="text-white" />
                </div>
              </div>
            </div>
          ))}

          {/* BLOCK 3: FINAL CALL TO ACTION */}
          <div className="flex-shrink-0 pr-[20vw]">
             <h2 className="text-[12vw] font-black leading-[0.8] text-transparent outline-text">
               READY <br /> TO FILM?
             </h2>
             <button className="mt-10 px-12 py-6 bg-white text-black font-black hover:bg-red-600 hover:text-white transition-colors">
               GET IN TOUCH
             </button>
          </div>

        </motion.div>

        {/* HUD OVERLAY: MOUSE POINTER INFO */}
        <div className="absolute bottom-10 left-10 flex items-center gap-4 text-white/30 font-mono text-[10px]">
           <MousePointer2 size={14} />
           <span className="uppercase tracking-widest">Navigation: Scroll Vertical / View Horizontal</span>
        </div>

        {/* PAGE NUMBER */}
        <div className="absolute top-10 right-10 flex flex-col items-end">
           <span className="text-6xl font-black text-red-600/20 leading-none">01</span>
           <div className="h-1 w-20 bg-red-600/20 mt-2">
              <motion.div 
                style={{ scaleX: scrollYProgress }} 
                className="h-full bg-red-600 origin-left"
              />
           </div>
        </div>
      </div>

      <style jsx>{`
        .outline-text {
          -webkit-text-stroke: 1px rgba(255, 255, 255, 0.3);
        }
      `}</style>
    </section>
  );
};

export default FilmstripHero;
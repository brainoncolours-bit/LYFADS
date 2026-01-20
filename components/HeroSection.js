import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion';
import { Camera, Film, Play, Aperture, Monitor, Cpu, Disc, Zap, Focus } from 'lucide-react';

const LyfAds3DHero = () => {
  const containerRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const smoothScroll = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  // 3D Perspective & Depth Transforms
  const zDepth = useTransform(smoothScroll, [0, 1], [0, -1000]); // Moves "into" the screen
  const mainScale = useTransform(smoothScroll, [0, 0.5], [1, 0.8]);
  const rotateX = useTransform(smoothScroll, [0, 1], [0, 20]); // Slight tilt on scroll
  const opacity = useTransform(smoothScroll, [0, 0.5, 0.8], [1, 1, 0]);

  return (
    <div className="bg-[#020202] text-white overflow-x-hidden selection:bg-red-600">
      <section ref={containerRef} className="relative h-[300vh] w-full">
        {/* VIEWPORT WRAPPER */}
        <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden perspective-[1000px]">
          
          {/* 3D SCENE CONTAINER */}
          <motion.div 
            style={{ translateZ: zDepth, rotateX, scale: mainScale, opacity }}
            className="relative w-full h-full flex items-center justify-center preserve-3d"
          >
            
            {/* BACKGROUND: 3D GRID & LIGHTS */}
            <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-red-900/10 via-transparent to-transparent" />
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />

            {/* LAYER 1: Deep Floating Elements (Far away) */}
            <Floating3D scroll={smoothScroll} range={[0, 1]} depth={-500} top="10%" left="5%" speed={2}>
              <Disc className="text-red-600/20 w-32 h-32 animate-spin-slow" />
            </Floating3D>
            <Floating3D scroll={smoothScroll} range={[0, 1]} depth={-800} top="60%" right="10%" speed={1.5}>
              <Monitor className="text-white/10 w-48 h-48" />
            </Floating3D>

            {/* LAYER 2: Medium Depth (Production Tools) */}
            <Floating3D scroll={smoothScroll} range={[0, 0.8]} depth={-200} top="20%" right="15%" speed={4}>
              <div className="p-4 border border-white/10 backdrop-blur-md bg-white/5 rounded-xl">
                <Camera size={40} className="text-red-500 mb-2" />
                <div className="h-1 w-20 bg-red-600/30 overflow-hidden">
                  <motion.div animate={{ x: [-80, 80] }} transition={{ repeat: Infinity, duration: 2 }} className="w-full h-full bg-red-600" />
                </div>
              </div>
            </Floating3D>

            {/* LAYER 3: THE MAIN BRANDING */}
            <motion.div className="relative z-30 text-center select-none preserve-3d">
              <motion.div 
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="mb-6 flex items-center justify-center gap-4"
              >
                <div className="h-[1px] w-12 bg-red-600" />
                <span className="tracking-[0.8em] text-[10px] text-gray-400 uppercase">Est. MMXXIV</span>
                <div className="h-[1px] w-12 bg-red-600" />
              </motion.div>

              <h1 className="text-[15vw] font-black leading-none tracking-tighter italic flex flex-col items-center">
                <span className="drop-shadow-[0_0_30px_rgba(220,38,38,0.3)]">LYF</span>
                <span className="text-transparent" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.4)' }}>ADS</span>
              </h1>

              <div className="mt-12 flex flex-wrap justify-center gap-6">
                <button className="group relative px-10 py-5 overflow-hidden rounded-full transition-all">
                  <div className="absolute inset-0 bg-red-600 group-hover:scale-110 transition-transform duration-500" />
                  <span className="relative z-10 font-black tracking-widest flex items-center gap-2">
                    <Play size={16} fill="white" /> VIEW REEL
                  </span>
                </button>
                <button className="group relative px-10 py-5 overflow-hidden rounded-full border border-white/20 transition-all hover:border-red-600">
                  <span className="font-black tracking-widest group-hover:text-red-500">SERVICES</span>
                </button>
              </div>
            </motion.div>

            {/* LAYER 4: Extreme Foreground (Fly-by elements) */}
            <Floating3D scroll={smoothScroll} range={[0, 0.4]} depth={400} bottom="10%" left="20%" speed={8}>
               <Focus className="text-red-600 w-24 h-24 opacity-40" />
            </Floating3D>
            <Floating3D scroll={smoothScroll} range={[0, 0.3]} depth={600} top="30%" right="5%" speed={12}>
               <Aperture className="text-white w-32 h-32 opacity-20" />
            </Floating3D>

          </motion.div>

          {/* HUD OVERLAY (Static) */}
          <div className="absolute inset-0 z-50 pointer-events-none p-8 flex flex-col justify-between border-[1px] border-white/5">
             <div className="flex justify-between items-start opacity-30 font-mono text-xs">
                <div className="flex gap-4">
                  <span>[ ISO 800 ]</span>
                  <span>[ 24 FPS ]</span>
                </div>
                <div className="flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
                   <span>REC LIVE</span>
                </div>
             </div>
             
             <div className="flex justify-between items-end opacity-30 font-mono text-[10px]">
                <div className="space-y-1">
                  <p>SHUTTER: 1/50</p>
                  <p>WB: 5600K</p>
                </div>
                <div className="text-right">
                   <p>TC: 00:12:45:09</p>
                   <p>BAT: 88%</p>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* CONTENT REVEAL SECTION */}
      <div className="relative z-[100] bg-white text-black py-32 px-10">
         <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-12">
            <h2 className="text-7xl font-black italic lg:col-span-2 leading-[0.9]">
               WHERE IMAGINATION <span className="text-red-600">MEETS</span> TECHNICAL MASTERY.
            </h2>
            <div className="flex flex-col justify-center gap-8">
               <div className="h-px bg-black w-24" />
               <p className="text-xl font-light text-gray-600 leading-relaxed">
                 From concept to color grading, LYF ADS delivers a visual experience that defies gravity. We specialize in high-end advertising that demands attention.
               </p>
               <div className="grid grid-cols-2 gap-4">
                  <div className="p-6 bg-gray-100 rounded-2xl"><Zap className="text-red-600 mb-2"/><p className="font-bold">Lightning Fast</p></div>
                  <div className="p-6 bg-gray-100 rounded-2xl"><Cpu className="text-red-600 mb-2"/><p className="font-bold">Post Mastery</p></div>
               </div>
            </div>
         </div>
      </div>

      <style jsx>{`
        .preserve-3d { transform-style: preserve-3d; }
        .perspective-1000 { perspective: 1000px; }
        .animate-spin-slow { animation: spin 12s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

// Internal component for 3D depth movement
const Floating3D = ({ children, scroll, depth, top, left, right, bottom, speed }) => {
  const yMove = useTransform(scroll, [0, 1], [0, -200 * speed]);
  const zMove = useTransform(scroll, [0, 1], [depth, depth + 1000]);

  return (
    <motion.div
      style={{ 
        top, left, right, bottom,
        translateZ: zMove,
        y: yMove,
        position: 'absolute',   
        transformStyle: 'preserve-3d'
      }}
      className="pointer-events-none"
    >
      {children}
    </motion.div>
  );
};

export default LyfAds3DHero;
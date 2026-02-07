import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

const IMAGES = [
  "https://images.unsplash.com/photo-1550745165-9bc0b252726f",
  "https://images.unsplash.com/photo-1533107862482-0e6974b06ec4",
  "https://images.unsplash.com/photo-1509248961158-e54f6934749c",
  "https://images.unsplash.com/photo-1517649763962-0c623066013b",
  "https://images.unsplash.com/photo-1493225255756-d9584f8606e9",
  "https://images.unsplash.com/photo-1485846234645-a62644f84728",
  "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d",
];

const MultiFilmHero = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 50, damping: 25 });

  // 3D Transformations
  // The strip moves from right to left, but also pushes "forward" in Z-space
  const x = useTransform(smoothProgress, [0, 1], ["40%", "-60%"]);
  const z = useTransform(smoothProgress, [0, 0.5, 1], [-500, 200, -500]); 
  const rotateY = useTransform(smoothProgress, [0, 1], [-25, 25]);
  const rotateZ = useTransform(smoothProgress, [0, 1], [-5, 5]);

  return (
    <div ref={containerRef} className="relative h-[600vh] bg-[#050505] overflow-clip">
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden" style={{ perspective: "1200px" }}>
        
        {/* BACKGROUND TEXT (Optional depth) */}
        <motion.div 
          style={{ opacity: useTransform(smoothProgress, [0, 0.2], [0, 1]) }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
        >
          <span className="text-[20vw] font-black text-white/[0.02] select-none">CINEMA</span>
        </motion.div>

        {/* THE FLOATING FILM STRIP */}
        <motion.div 
          style={{ 
            x, 
            z, 
            rotateY, 
            rotateZ,
            transformStyle: "preserve-3d" 
          }}
          className="relative flex gap-8 py-20"
        >
          {IMAGES.map((src, idx) => (
            <FilmFrame key={idx} src={src} />
          ))}
        </motion.div>

        {/* HERO TEXT - The "Anchor" the strip passes through */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-30">
          <div className="text-center">
            <motion.h2 className="text-zinc-500 font-mono text-xs tracking-[0.5em] uppercase mb-4">
              Premium Production
            </motion.h2>
            <h1 className="text-white text-8xl md:text-9xl font-[1000] italic tracking-tighter mix-blend-difference">
              LYF<span className="text-red-600">ADS</span>
            </h1>
          </div>
        </div>

        {/* LIGHTING & VIGNETTE */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_20%,black_100%)]" />
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-black via-transparent to-black opacity-60" />
      </div>
    </div>
  );
};

const FilmFrame = ({ src }) => (
  <div className="relative flex-shrink-0 group">
    {/* The Frame Body */}
    <div className="w-[300px] h-[420px] bg-[#111] p-1 shadow-[0_0_50px_rgba(0,0,0,0.5)] border-y-[15px] border-[#1a1a1a] flex flex-col justify-between">
      
      {/* Top Sprockets */}
      <div className="flex justify-around py-1">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="w-4 h-5 bg-black rounded-sm border border-white/5" />
        ))}
      </div>

      {/* Image Container */}
      <div className="flex-1 bg-black overflow-hidden relative group-hover:brightness-110 transition-all duration-500">
        <img 
          src={src} 
          className="w-full h-full object-cover grayscale contrast-125 opacity-80"
          alt=""
        />
        <div className="absolute inset-0 shadow-[inset_0_0_60px_rgba(0,0,0,0.8)]" />
      </div>

      {/* Bottom Sprockets */}
      <div className="flex justify-around py-1">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="w-4 h-5 bg-black rounded-sm border border-white/5" />
        ))}
      </div>
    </div>

    {/* Subtle Glow behind each frame */}
    <div className="absolute -inset-4 bg-red-600/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
  </div>
);

export default MultiFilmHero;
"use client";
import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

const brands = [
  { name: "ARRI", category: "Optics" },
  { name: "RED", category: "Digital" },
  { name: "ADOBE", category: "Post" },
  { name: "SONY", category: "Sensors" },
  { name: "ZEISS", category: "Glass" },
  { name: "DOLBY", category: "Audio" },
  { name: "RODE", category: "Sound" },
  { name: "DJI", category: "Aerial" },
  { name: "APPLE", category: "Edit" },
];

const BrandMoodboard = () => {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start end", "end start"],
  });

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  // 3D Rotation and Depth values based on scroll
  const rotateX = useTransform(smoothProgress, [0, 1], [20, -20]);
  const skewX = useTransform(smoothProgress, [0, 1], [5, -5]);

  return (
    <div ref={targetRef} className="bg-black py-24 overflow-hidden relative">
      {/* Background Decorative Elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-red-900/10 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="max-w-[1200px] mx-auto px-6 relative z-10">
        <div className="mb-16 text-center md:text-left">
          <motion.p 
            initial={{ opacity: 0 }} 
            whileInView={{ opacity: 1 }}
            className="text-red-600 font-mono text-xs tracking-[0.3em] mb-2"
          >
            // STRATEGIC PARTNERSHIPS
          </motion.p>
          <h2 className="text-white text-4xl md:text-6xl font-black italic tracking-tighter">
            BRANDS THAT <span className="text-transparent" style={{ WebkitTextStroke: '1px white' }}>POWER</span> US
          </h2>
        </div>

        {/* 3D PERSPECTIVE CONTAINER */}
        <motion.div 
          style={{ 
            perspective: "1200px",
            rotateX: rotateX,
            skewX: skewX
          }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4"
        >
          {brands.map((brand, i) => (
            <ProductionCard key={brand.name} brand={brand} index={i} scrollY={smoothProgress} />
          ))}
          
          {/* THE "+ MORE" CARD */}
          <motion.div className="h-40 border border-white/5 bg-white/5 backdrop-blur-sm flex items-center justify-center group cursor-pointer hover:border-red-600/50 transition-colors">
            <span className="text-gray-500 font-bold group-hover:text-white transition-colors tracking-widest">+ MORE</span>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

const ProductionCard = ({ brand, index, scrollY }) => {
  // Each card has a slightly different movement speed for an organic feel
  const yOffset = useTransform(scrollY, [0, 1], [index * 20, index * -20]);
  const glowOpacity = useTransform(scrollY, [0, 0.5, 1], [0.1, 0.4, 0.1]);

  return (
    <motion.div
      style={{ y: yOffset }}
      whileHover={{ scale: 1.05, translateZ: 50 }}
      className="relative h-40 group preserve-3d"
    >
      {/* Glow Behind Card */}
      <motion.div 
        style={{ opacity: glowOpacity }}
        className="absolute inset-0 bg-red-600 blur-2xl rounded-xl pointer-events-none group-hover:opacity-60 transition-opacity" 
      />
      
      {/* Main Body */}
      <div className="absolute inset-0 bg-[#0a0a0a] border border-white/10 p-6 flex flex-col justify-between transition-all group-hover:border-red-600/50">
        {/* Card Metadata */}
        <div className="flex justify-between items-start opacity-30 group-hover:opacity-100 transition-opacity">
          <span className="text-[10px] font-mono">ID: 00{index + 1}</span>
          <div className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
        </div>

        {/* Brand Name (Placeholder for Logo) */}
        <div className="text-center">
          <h3 className="text-xl font-black tracking-widest text-white/50 group-hover:text-white transition-colors">
            {brand.name}
          </h3>
        </div>

        {/* Bottom Label */}
        <div className="flex items-center gap-2">
          <div className="h-[1px] flex-1 bg-white/10" />
          <span className="text-[8px] font-mono uppercase text-gray-500">{brand.category}</span>
        </div>
      </div>

      {/* 3D Depth Shadow */}
      <div className="absolute inset-0 translate-y-2 translate-x-1 bg-black/40 blur-sm -z-10" />
    </motion.div>
  );
};

export default BrandMoodboard;
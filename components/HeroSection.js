import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const BANNERS = [
  {
    src: "/assets/home/img1.webp",
    title: "Crafting Digital Experiences",
    subtitle: "2026 ARCHIVE / VOL. 01"
  },
  {
    src: "/assets/home/img3.webp",
    title: "Visual Design & Direction",
    subtitle: "SELECTED WORKS"
  },
  {
    src: "/assets/home/img5.webp",
    title: "Minimalist Modern Aesthetic",
    subtitle: "PORTFOLIO EDITION"
  },
];

const AutoMovingBannerHero = () => {
  const [index, setIndex] = useState(0);

  // Auto-slide every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % BANNERS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-screen bg-[#080808] overflow-hidden text-white font-sans">
      
      {/* 1. AUTO-SLIDING BACKGROUND IMAGES */}
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 w-full h-full"
        >
          <img
            src={BANNERS[index].src}
            alt={BANNERS[index].title}
            className="w-full h-full object-cover"
          />
        </motion.div>
      </AnimatePresence>

      {/* 2. OVERLAY GRADIENT FOR TEXT READABILITY */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/40 pointer-events-none" />

      {/* 3. TOP BRANDING BAR */}
      <header className="absolute top-0 left-0 w-full p-8 md:p-12 z-20 flex justify-between items-center">
        <img src="/bg.png" alt="Logo" className="w-10 h-auto invert opacity-90" />
        <span className="text-xs font-mono tracking-widest text-zinc-400 uppercase">
          [ Studio ]
        </span>
      </header>

      {/* 4. BOTTOM CENTERED ANIMATED HEADING */}
      <div className="absolute bottom-16 left-0 right-0 z-20 flex flex-col items-center text-center px-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center gap-3 max-w-4xl"
          >
            <span className="text-xs font-mono tracking-[0.3em] text-zinc-400 uppercase">
              {BANNERS[index].subtitle}
            </span>
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-light tracking-tight text-white leading-tight">
              {BANNERS[index].title}
            </h1>
          </motion.div>
        </AnimatePresence>

        {/* SLIDE INDICATOR DOTS */}
        <div className="flex gap-2 mt-8">
          {BANNERS.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`h-1 rounded-full transition-all duration-500 ${
                i === index ? "w-8 bg-white" : "w-2 bg-white/30"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>

    </div>
  );
};

export default AutoMovingBannerHero;
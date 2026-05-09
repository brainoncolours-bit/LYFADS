"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function LyfAdsFooter() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end end"]
  });

  // Tilt effect as the user scrolls into the footer
  const rotateX = useTransform(scrollYProgress, [0, 1], [-45, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [0, 1]);

  return (
    <footer ref={containerRef} className="relative overflow-hidden bg-black">
      
      {/* 🔴⚫ POWER CURRENT STRIP */}
      <div className="relative h-28 md:h-40 overflow-hidden z-0">
        {/* Left Current */}
        <motion.div
          initial={{ x: "-100%" }}
          animate={{ x: "100%" }}
          transition={{ repeat: Infinity, duration: 2.5, ease: "linear" }}
          className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-transparent via-red-600 to-black blur-sm opacity-80"
        />

        {/* Right Current */}
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: "-100%" }}
          transition={{ repeat: Infinity, duration: 2.5, ease: "linear" }}
          className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-transparent via-red-600 to-black blur-sm opacity-80"
        />

        {/* ⚡ CENTER SPARK */}
        <motion.div
          animate={{
            scale: [0.6, 1.2, 0.6],
            opacity: [0.4, 1, 0.4]
          }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        >
          <div className="w-6 h-6 md:w-10 md:h-10 rounded-full bg-red-600 shadow-[0_0_40px_15px_rgba(255,0,0,0.8)]" />
        </motion.div>

        {/* Ambient Glow */}
        <div className="absolute inset-0 bg-gradient-to-b from-red-900/30 via-black to-black" />
      </div>

      {/* 🎬 FOOTER BODY */}
      <motion.div 
        style={{ 
          rotateX, 
          opacity, 
          transformStyle: "preserve-3d",
          perspective: "1000px" 
        }}
        className="relative z-10 bg-[#0a0a0a] rounded-t-[50px] md:rounded-t-[100px] p-10 md:p-20 text-white min-h-[600px] flex flex-col justify-between"
      >
        {/* Top Section */}
        <div className="flex justify-between items-start">
          <div className="space-y-6">
            <div className="inline-block px-4 py-1 border border-red-600 text-red-600 text-xs font-black tracking-[0.2em] uppercase">
              Now In Production
            </div>
            <img src="/bg.png" width="200" alt="Lyf Ads Logo" />
          </div>

          <div className="hidden md:block text-right space-y-2">
            <p className="text-gray-500 uppercase tracking-widest text-sm font-bold">Services</p>
            <ul className="text-2xl font-light">
              <li className="hover:text-red-600 transition-colors cursor-pointer">Post-Production</li>
              <li className="hover:text-red-600 transition-colors cursor-pointer">VFX & 3D</li>
              <li className="hover:text-red-600 transition-colors cursor-pointer">Ad Campaigns</li>
            </ul>
          </div>
        </div>

        {/* Middle Section (Marquee) */}
        {/* We add pointer-events-none so this transparent layer doesn't block clicks */}
        <div className="relative py-20 pointer-events-none select-none">
          <div className="absolute inset-0 flex items-center justify-center opacity-10">
            <span className="text-[15vw] font-black whitespace-nowrap animate-marquee">
              CREATING REALITY • PRODUCING DREAMS • LYF ADS •
            </span>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="relative z-20 border-t border-white/10 pt-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex gap-8 text-sm font-bold uppercase">
            <a 
              href="https://www.instagram.com/lyfads" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-red-600 transition-colors"
            >
              Instagram
            </a>
            <a 
              href="https://www.behance.net/lyfads" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-red-600 transition-colors"
            >
              Behance
            </a>
            {/* <a 
              href="https://www.linkedin.com/company/lyfads" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-red-600 transition-colors"
            >
              LinkedIn
            </a> */}
            {/* Youtube */}
            <a 
              href="https://www.youtube.com/@lyfads" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-red-600 transition-colors"
            >
              YouTube
            </a>
          </div>

          <div className="text-xs text-gray-500 font-mono uppercase tracking-[0.3em]">
            [ 2026 © LYF ADS PRODUCTION HOUSE ]
          </div>
        </div>
      </motion.div>

      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: inline-block;
          animation: marquee 20s linear infinite;
        }
      `}</style>
    </footer>
  );
}

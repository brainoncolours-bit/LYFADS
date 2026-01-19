"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function LyfAdsFooter() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end end"]
  });

  // 3D Tilt Effect on scroll
  const rotateX = useTransform(scrollYProgress, [0, 1], [-45, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [0, 1]);

  return (
    <footer ref={containerRef} className="relative bg-white pt-20 overflow-hidden">
      {/* 3D Stage Container */}
      <motion.div 
        style={{ rotateX, opacity, perspective: "1000px" }}
        className="bg-[#0a0a0a] rounded-t-[50px] md:rounded-t-[100px] p-10 md:p-20 text-white min-h-[600px] flex flex-col justify-between"
      >
        
        {/* Top Section: The "Production Lights" */}
        <div className="flex justify-between items-start">
          <div className="space-y-6">
            <div className="inline-block px-4 py-1 border border-red-600 text-red-600 text-xs font-black tracking-[0.2em] uppercase">
              Now In Production
            </div>
            <h2 className="text-5xl md:text-8xl font-black leading-none">
              LYF<br/><span className="text-red-600 italic">ADS</span>
            </h2>
          </div>
          
          <div className="hidden md:block text-right space-y-2">
            <p className="text-gray-500 uppercase tracking-widest text-sm font-bold">Services</p>
            <ul className="text-2xl font-light">
              <li className="hover:text-red-600 cursor-pointer transition-colors">Post-Production</li>
              <li className="hover:text-red-600 cursor-pointer transition-colors">VFX & 3D</li>
              <li className="hover:text-red-600 cursor-pointer transition-colors">Ad Campaigns</li>
            </ul>
          </div>
        </div>

        {/* Middle Section: The "Film Reel" Crawler */}
        <div className="relative py-20">
          <div className="absolute inset-0 flex items-center justify-center opacity-10">
            <span className="text-[15vw] font-black whitespace-nowrap animate-marquee">
              CREATING REALITY • PRODUCING DREAMS • LYF ADS • 
            </span>
          </div>
          
          {/* Out of the box 3D Element: Interactive Button */}
          {/* <motion.button 
            whileHover={{ scale: 1.1, rotateY: 20, rotateX: -1  }}
            className="relative z-10 mx-auto block bg-red-600 text-white text-xl font-black px-12 py-6 rounded-full shadow-[0_20px_50px_rgba(255,0,0,0.3)] border-b-8 border-red-800 active:border-b-0 active:translate-y-2 transition-all"
          >
            START YOUR SCENE
          </motion.button> */}
        </div>

        {/* Bottom Section: The Slate */}
        <div className="border-t border-white/10 pt-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex gap-8 text-sm font-bold tracking-tighter uppercase">
            <a href="#" className="hover:text-red-600">Instagram</a>
            <a href="#" className="hover:text-red-600">Vimeo</a>
            <a href="#" className="hover:text-red-600">LinkedIn</a>
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
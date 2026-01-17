"use client";
import React from "react";

import { motion } from "framer-motion";
import { 
  IconVideo, IconCircleCheck, IconClock, IconCrown, 
  IconFocus2, IconBolt, IconLayersIntersect, IconUsers 
} from "@tabler/icons-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/** * FIXED: This function replaces the need for @/lib/utils.
 * It merges Tailwind classes safely.
 */
function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const productionFeatures = [
  {
    title: "Cinematic 4K Standards",
    description: "Every frame is captured in RAW 4K, ensuring the highest dynamic range for your brand story.",
    icon: <IconVideo size={24} />,
    size: "md:col-span-2",
  },
  {
    title: "Fixed Pricing",
    description: "No hidden production fees. Transparent billing from pre to post.",
    icon: <IconBolt size={24} />,
    size: "md:col-span-1",
  },
  {
    title: "Rapid Turnaround",
    description: "Our agile editing workflow delivers your first cut within 72 hours.",
    icon: <IconClock size={24} />,
    size: "md:col-span-1",
  },
  {
    title: "High-End Equipment",
    description: "Access to ARRI, RED, and Zeiss glass for that distinctive film look.",
    icon: <IconFocus2 size={24} />,
    size: "md:col-span-2",
  },
  {
    title: "Multi-Platform Edits",
    description: "One shoot, multiple formats. Tailored for YouTube, Reels, and TVC.",
    icon: <IconLayersIntersect size={24} />,
    size: "md:col-span-1",
  },
  {
    title: "Vetted Crew",
    description: "Work with award-winning directors and industry-standard technicians.",
    icon: <IconUsers size={24} />,
    size: "md:col-span-1",
  },
];

export default function ProductionFeatures() {
  return (
    <div className="bg-[#050505] py-24 px-6 min-h-screen selection:bg-red-600">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 text-red-600 font-mono text-[10px] tracking-[0.3em] mb-4"
          >
            <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
            SYSTEM SPECIFICATIONS / ADVANTAGES
          </motion.div>
          <h2 className="text-5xl md:text-7xl font-black text-white italic tracking-tighter uppercase leading-[0.9]">
            WHY <span className="text-transparent" style={{ WebkitTextStroke: '1px white' }}>LYF ADS</span>?
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[240px]">
          {productionFeatures.map((feature, index) => (
            <FeatureCard key={index} {...feature} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
}

const FeatureCard = ({ title, description, icon, size, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      // 3D Tilt Effect on Hover
      whileHover={{ 
        rotateY: 5, 
        rotateX: -5,
        z: 50,
        transition: { duration: 0.3 } 
      }}
      className={cn(
        "relative overflow-hidden group border border-white/10 bg-[#0a0a0a] p-8 flex flex-col justify-between transition-all duration-500",
        "hover:border-red-600/50 hover:shadow-[0_0_30px_rgba(220,38,38,0.1)]",
        size
      )}
      style={{ transformStyle: "preserve-3d" }}
    >
      {/* Viewfinder Corners */}
      <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-white/20 group-hover:border-red-600 transition-colors" />
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-white/20 group-hover:border-red-600 transition-colors" />

      {/* Scanning Line Effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-red-600/10 to-transparent h-24 w-full -translate-y-full group-hover:translate-y-[400%] transition-transform duration-[2500ms] ease-linear pointer-events-none" />

      <div className="relative z-10" style={{ transform: "translateZ(30px)" }}>
        <div className="text-red-600 mb-6 bg-red-600/10 w-fit p-3 rounded-lg border border-red-600/20 group-hover:bg-red-600 group-hover:text-white transition-all duration-300">
          {icon}
        </div>
        <h3 className="text-xl font-bold text-white mb-3 uppercase tracking-tight group-hover:text-red-500 transition-colors">
          {title}
        </h3>
        <p className="text-sm text-gray-500 leading-relaxed max-w-[280px] group-hover:text-gray-300 transition-colors">
          {description}
        </p>
      </div>

      {/* Bottom Data Label */}
      <div className="flex items-center justify-between mt-4 relative z-10">
        <span className="text-[10px] font-mono text-white/20 uppercase tracking-widest">
          UNIT_REF: 00{index+1}
        </span>
        <div className="h-[1px] flex-1 mx-4 bg-white/5" />
        <IconCircleCheck size={14} className="text-white/10 group-hover:text-red-600 transition-colors" />
      </div>

      {/* Hover Background Glow */}
      <div className="absolute inset-0 bg-red-600/0 group-hover:bg-red-600/[0.02] transition-colors pointer-events-none" />
    </motion.div>
  );
};
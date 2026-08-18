"use client";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { poppins } from "@/lib/font";
import { ArrowUpRight } from "lucide-react";

const milestones = [
  {
    number: "01",
    title: "Creative Production",
    subtitle: "Brand Films / Commercials / Visual Direction",
    description: "Transform your vision into captivating visual stories. Our team crafts premium ad films, commercials, and branded content that resonates with your audience.",
    video: "/assets/lap/growth.mp4",
  },
  {
    number: "02",
    title: "Post-Production Excellence",
    subtitle: "Editing / Color Grading / Sound Design / VFX",
    description: "From color grading to VFX and sound design, we bring cinematic quality to every frame—turning raw footage into polished masterpieces.",
    video: "/assets/lap/web....mp4",
  },
  {
    number: "03",
    title: "360° Creative Solutions",
    subtitle: "Concept / Direction / Delivery",
    description: "We handle everything—concept development, cinematography, editing, and delivery. A complete production house experience from idea to final output.",
    video: "/assets/lap/Out.mp4",
  },
];

export default function TimelineSection() {
  const [activeIdx, setActiveIdx] = useState(0);

  return (
    <section className={`${poppins.className} relative w-full bg-[#070707] text-zinc-100 py-28 px-6 md:px-12 border-t border-zinc-900 font-sans`}>
      <div className="max-w-6xl mx-auto flex flex-col gap-16">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-10 border-b border-zinc-900">
          <div className="flex flex-col gap-3 max-w-xl">
            <span className="text-[10px] font-mono text-zinc-500 tracking-[0.3em] uppercase">
              [ Capabilities & Workflow ]
            </span>
            <h2 className="text-3xl sm:text-5xl font-light tracking-tight text-white leading-none">
              Elevate Your Brand.
            </h2>
          </div>
          <p className="text-xs sm:text-sm font-mono text-zinc-400 max-w-xs leading-relaxed">
            Premium production house for visionary content. Excellence in every frame.
          </p>
        </div>

        {/* ACCORDION PROCESS LIST */}
        <div className="flex flex-col">
          {milestones.map((item, index) => {
            const isActive = activeIdx === index;
            
            return (
              <div
                key={index}
                onMouseEnter={() => setActiveIdx(index)}
                className={`group border-b border-zinc-900 transition-colors duration-500 cursor-pointer ${
                  isActive ? "bg-zinc-900/30" : "hover:bg-zinc-950"
                }`}
              >
                <div className="p-6 md:py-10 md:px-8 flex flex-col gap-6">
                  
                  {/* MAIN ACCORDION HEADER */}
                  <div className="flex justify-between items-center w-full">
                    <div className="flex items-center gap-6 sm:gap-12">
                      <span className={`text-xs sm:text-sm font-mono transition-colors duration-300 ${
                        isActive ? "text-white" : "text-zinc-600"
                      }`}>
                        {item.number}
                      </span>
                      <h3 className={`text-2xl sm:text-4xl font-light tracking-tight transition-colors duration-300 ${
                        isActive ? "text-white" : "text-zinc-500 group-hover:text-zinc-300"
                      }`}>
                        {item.title}
                      </h3>
                    </div>

                    <div className={`p-2 rounded-full border transition-all duration-300 ${
                      isActive 
                        ? "border-zinc-700 bg-zinc-800 text-white rotate-45" 
                        : "border-zinc-800/60 text-zinc-600 group-hover:border-zinc-700 group-hover:text-zinc-300"
                    }`}>
                      <ArrowUpRight size={18} />
                    </div>
                  </div>

                  {/* EXPANDABLE DETAIL PANEL */}
                  <AnimatePresence initial={false}>
                    {isActive && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-4 pb-2 items-center">
                          <div className="md:col-span-7 flex flex-col gap-3 pl-0 md:pl-20">
                            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
                              {item.subtitle}
                            </span>
                            <p className="text-xs sm:text-sm font-mono text-zinc-400 leading-relaxed max-w-lg">
                              {item.description}
                            </p>
                          </div>

                          {/* VIDEO PREVIEW */}
                          <div className="md:col-span-5">
                            <div className="relative aspect-[16/9] w-full bg-zinc-900 rounded-sm overflow-hidden border border-zinc-800">
                              <video
                                src={item.video}
                                autoPlay
                                loop
                                muted
                                playsInline
                                className="w-full h-full object-cover grayscale contrast-125 hover:grayscale-0 transition-all duration-700"
                              />
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                </div>
              </div>
            );
          })}
        </div>

        {/* FOOTER METRICS */}
        <div className="flex justify-between items-center text-[11px] font-mono text-zinc-500 uppercase pt-4">
          <span>02 / PROCESS</span>
          <span>SELECT STEP TO PREVIEW</span>
        </div>

      </div>
    </section>
  );
}
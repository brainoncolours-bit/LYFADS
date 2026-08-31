'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, ArrowRight } from 'lucide-react';

const CAPABILITIES = [
  {
    number: '01',
    title: 'Creative Production',
    tags: 'COMMERCIALS / BRAND FILMS / CINEMATOGRAPHY',
    description: 'From initial concept development and storyboarding to full-scale on-location production, creating impactful visual stories.',
    video: '/assets/cat/comm.mp4',
  },
  {
    number: '02',
    title: 'Post-Production Excellence',
    tags: 'EDITING / COLOR GRADING / SOUND DESIGN / VFX',
    description: 'From color grading to VFX and sound design, we bring cinematic quality to every frame—turning raw footage into polished masterpieces.',
    video: '/assets/cat/copo.mp4',
  },
  {
    number: '03',
    title: '360° Creative Solutions',
    tags: 'CAMPAIGN STRATEGY / SOCIAL REELS / AI FILMS',
    description: 'End-to-end digital storytelling designed to maximize reach, engagement, and conversion across all digital platforms.',
    video: '/assets/lap/growth.mp4',
  },
];

const TimelineSection = () => {
  const [activeTab, setActiveTab] = useState(1);

  return (
    <section className="relative w-full bg-[#fafafa] text-neutral-900 pt-16 sm:pt-20 pb-0 px-4 sm:px-8 lg:px-16 overflow-hidden">
      <div className="max-w-[1440px] mx-auto">
        
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-16 pb-6 sm:pb-8 border-b border-neutral-200">
          <div>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black italic tracking-tighter text-neutral-950 uppercase leading-none">
              Elevate Your <span className="text-red-600">Brand.</span>
            </h2>
          </div>
        </div>

        {/* Capabilities List */}
        <div className="flex flex-col gap-3 sm:gap-4">
          {CAPABILITIES.map((item, idx) => {
            const isActive = activeTab === idx;

            return (
              <div
                key={item.number}
                onMouseEnter={() => setActiveTab(idx)}
                onClick={() => setActiveTab(idx)}
                className={`w-full rounded-2xl cursor-pointer transition-all duration-500 border ${
                  isActive
                    ? 'bg-white border-neutral-300 shadow-xl p-4 sm:p-7 lg:p-10'
                    : 'bg-neutral-100/70 border-neutral-200/80 hover:bg-white hover:border-neutral-300 p-4 sm:p-6 lg:p-8'
                }`}
              >
                {/* Row Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 sm:gap-6 lg:gap-10 min-w-0 pr-2">
                    <span className="text-[10px] sm:text-xs font-mono text-neutral-400 font-bold flex-shrink-0">
                      {item.number}
                    </span>
                    <h3 className={`text-lg sm:text-2xl md:text-3xl lg:text-4xl font-black italic tracking-tight uppercase transition-colors truncate sm:whitespace-normal ${
                      isActive ? 'text-neutral-950' : 'text-neutral-500 hover:text-neutral-800'
                    }`}>
                      {item.title}
                    </h3>
                  </div>

                  <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all flex-shrink-0 ${
                    isActive ? 'bg-neutral-950 text-white' : 'bg-neutral-200 text-neutral-600'
                  }`}>
                    {isActive ? <ArrowRight size={14} className="sm:w-4 sm:h-4" /> : <ArrowUpRight size={14} className="sm:w-4 sm:h-4" />}
                  </div>
                </div>

                {/* Expanded Details */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.45, ease: [0.25, 1, 0.5, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center pt-6 sm:pt-8 mt-4 sm:mt-6 border-t border-neutral-100">
                        {/* Text Content */}
                        <div className="lg:col-span-6 space-y-3 sm:space-y-4">
                          <span className="text-[9px] sm:text-[10px] font-mono tracking-widest text-red-600 font-bold uppercase block">
                            {item.tags}
                          </span>
                          <p className="text-xs sm:text-sm lg:text-base text-neutral-600 font-normal leading-relaxed">
                            {item.description}
                          </p>
                        </div>

                        {/* Video Display */}
                        <div className="lg:col-span-6">
                          <div className="relative aspect-video rounded-xl overflow-hidden bg-neutral-900 border border-neutral-200 shadow-md">
                            <video
                              src={item.video}
                              autoPlay
                              loop
                              muted
                              playsInline
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>


      </div>
    </section>
  );
};

export default TimelineSection;
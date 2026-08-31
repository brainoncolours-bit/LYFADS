'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Sparkles, Compass, Flame, Droplets, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import VideoPlayer from '@/components/VideoPlayer';

const THREE_PROJECTS = [
  { 
    id: 1,
    title: "Create", 
    tag: "Brand Identity",
    icon: Compass,
    iconColor: "text-red-500",
    stat: "50k+ Followers • +140% ROAS",
    video: "/assets/lap/growth.mp4",
    description: "Visual identity engineering and strategic brand film direction tailored for exponential brand awareness."
  },
  { 
    id: 2,
    title: "Capture", 
    tag: "Commercial Films",
    icon: Flame,
    iconColor: "text-orange-500",
    stat: "2.4M Organic Views • 18 Campaigns",
    video: "/assets/cat/comm.mp4",
    description: "Cinematic commercial production and high-impact digital storytelling that captures genuine audience attention."
  },
  { 
    id: 3,
    title: "Inspire", 
    tag: "Music & Narrative",
    icon: Droplets,
    iconColor: "text-emerald-500",
    stat: "Global Reach • 4 Awards",
    video: "/assets/cat/copo.mp4",
    description: "Experimental music video direction and creative narrative storytelling designed to leave a lasting impact."
  },
];

const DEFAULT_WORK_CATEGORIES = [
  { 
    id: 1, 
    video_url: '/assets/cat/comm.mp4', 
    name: 'Commercial', 
    sub: 'Film',
    description: 'High-impact commercial films and brand spots produced for global campaigns.' 
  },
  { 
    id: 4, 
    video_url: '/assets/cat/digi.mp4', 
    name: 'Digital Content', 
    sub: 'Campaign',
    description: 'Data-driven viral creative reels and high-conversion social campaigns.' 
  },
  { 
    id: 18, 
    video_url: '/assets/cat/copo.mp4', 
    name: 'Corporate', 
    sub: 'Branding',
    description: 'Cinematic corporate profile narratives and executive brand storytelling.' 
  },
  { 
    id: 16, 
    video_url: '/assets/cat/aivdo.mp4', 
    name: 'AI Video', 
    sub: 'Content',
    description: 'Next-generation synthetic visual generation and AI motion design.' 
  },
  { 
    id: 14, 
    video_url: '/assets/cat/cover photos ad.mp4', 
    name: 'Cinematic', 
    sub: 'Production',
    description: 'Feature-grade color grading, camera choreography, and narrative direction.' 
  },
];

const getDefaultCategoryVideo = (catName = '', index = 0) => {
  const lower = String(catName).toLowerCase();
  if (lower.includes('comm')) return '/assets/cat/comm.mp4';
  if (lower.includes('digi') || lower.includes('social')) return '/assets/cat/digi.mp4';
  if (lower.includes('corp') || lower.includes('brand')) return '/assets/cat/copo.mp4';
  if (lower.includes('ai') || lower.includes('vfx')) return '/assets/cat/aivdo.mp4';
  if (lower.includes('cine') || lower.includes('film')) return '/assets/cat/cover photos ad.mp4';
  const defaultList = [
    '/assets/cat/comm.mp4',
    '/assets/cat/digi.mp4',
    '/assets/cat/copo.mp4',
    '/assets/cat/aivdo.mp4',
    '/assets/cat/cover photos ad.mp4',
  ];
  return defaultList[index % defaultList.length];
};

const FeaturesSection = () => {
  const [activeAccordion, setActiveAccordion] = useState(0);
  const [workCategories, setWorkCategories] = useState(DEFAULT_WORK_CATEGORIES);
  const [selectedVideo, setSelectedVideo] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase
          .from('video_categories')
          .select('*')
          .order('id', { ascending: true });

        if (!error && data && data.length > 0) {
          const enrichedCategories = data.map((cat, idx) => ({
            id: cat.id,
            name: cat.name || `Category 0${idx + 1}`,
            sub: cat.sub || 'Work Category',
            video_url: cat.carousel_video_url || getDefaultCategoryVideo(cat.name, idx),
            description: cat.description || `Explore all ${cat.name} production works and campaigns.`,
          }));
          setWorkCategories(enrichedCategories);
        } else {
          setWorkCategories(DEFAULT_WORK_CATEGORIES);
        }
      } catch (err) {
        console.error('Error fetching work categories for home:', err);
        setWorkCategories(DEFAULT_WORK_CATEGORIES);
      }
    };

    fetchCategories();
  }, []);

  const displayCategories = workCategories.length > 0 ? workCategories : DEFAULT_WORK_CATEGORIES;

  return (
    <div className="w-full bg-[#fafafa] text-neutral-900 font-sans overflow-hidden">
      
      {/* 1. EXPANDING 3-CARD ACCORDION SECTION */}
      <section className="relative w-full pt-16 pb-24 px-6 sm:px-12 lg:px-16 max-w-[1440px] mx-auto flex flex-col items-center">
        
        {/* Header Text Fall Down */}
        <motion.div 
          initial={{ opacity: 0, y: -45 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.25 }}
          transition={{ duration: 0.7, ease: [0.25, 1, 0.5, 1] }}
          className="text-center max-w-2xl mx-auto mb-14"
        >
          
          
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black italic tracking-tighter text-neutral-950 uppercase leading-none">
            Expert Direction &amp; Productions.
          </h2>
          <p className="text-sm sm:text-base text-neutral-600 font-normal mt-4 leading-relaxed">
            Hover to expand and explore our core visual production disciplines.
          </p>
        </motion.div>

        {/* 3 Cards Pop Up from Bottom */}
        <div className="flex flex-col md:flex-row gap-4 sm:gap-6 w-full h-[520px] sm:h-[580px] items-stretch justify-center max-w-6xl">
          {THREE_PROJECTS.map((proj, idx) => {
            const isExpanded = activeAccordion === idx;
            const IconComponent = proj.icon;

            return (
              <motion.div
                key={proj.id}
                layout
                initial={{ opacity: 0, y: 80 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{
                  layout: { duration: 0.45, ease: [0.25, 1, 0.5, 1] },
                  opacity: { duration: 0.6, delay: idx * 0.1, ease: [0.25, 1, 0.5, 1] },
                  y: { duration: 0.6, delay: idx * 0.1, ease: [0.25, 1, 0.5, 1] }
                }}
                onMouseEnter={() => setActiveAccordion(idx)}
                onClick={() => {
                  setActiveAccordion(idx);
                  setSelectedVideo({ video_url: proj.video, title: proj.title, category: proj.tag, description: proj.description });
                }}
                className={`relative overflow-hidden cursor-pointer bg-neutral-950 rounded-[32px] sm:rounded-[36px] border transition-all duration-500 ease-out flex flex-col justify-between ${
                  isExpanded
                    ? 'flex-[3.5] border-white/40 ring-2 ring-white/20 shadow-[0_25px_50px_rgba(0,0,0,0.35)]'
                    : 'flex-[1] border-white/10 opacity-75 hover:opacity-100 shadow-xl hover:border-white/25'
                }`}
              >
                {/* Background Video */}
                <video
                  src={proj.video}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                />

                {/* Dark Vignette Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-t pointer-events-none transition-opacity duration-500 ${
                  isExpanded
                    ? 'from-black/95 via-black/35 to-black/10'
                    : 'from-black/90 via-black/40 to-black/20'
                }`} />

                {/* Top Badge & Play Button */}
                <div className="relative top-5 left-5 right-5 flex justify-between items-center z-10 pointer-events-none">
                  
                  
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white transition-colors duration-300 ${
                    isExpanded ? 'bg-red-600 shadow-lg' : 'bg-white/20'
                  }`}>
                    <Play size={12} className="fill-current ml-0.5" />
                  </div>
                </div>

                {/* Bottom Content Area */}
                <div className="relative z-10 p-5 sm:p-6 flex flex-col gap-3 text-white pointer-events-none">
                  
                  {/* Category Pill & Title Row */}
                  <div className="flex items-center gap-3">
                    

                    <div className="min-w-0">
                      <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white uppercase italic truncate">
                        {proj.title}
                      </h3>
                     
                    </div>
                  </div>

                  

                  {/* Expanded Description Reveal */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0, y: 8 }}
                        animate={{ opacity: 1, height: 'auto', y: 0 }}
                        exit={{ opacity: 0, height: 0, y: 4 }}
                        transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="flex items-center justify-between gap-3 bg-black/70 p-3.5 rounded-2xl border border-white/15 mt-1 shadow-md">
                          <p className="text-xs text-neutral-200 font-normal leading-relaxed line-clamp-2">
                            {proj.description}
                          </p>
                          
                          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white flex-shrink-0">
                            <ArrowUpRight size={14} />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                </div>
              </motion.div>
            );
          })}
        </div>

      </section>

      {/* 2. CURVED FULL-WIDTH PANORAMA ARCHIVE */}
      <section className="relative w-full pt-10 pb-20 bg-[#fafafa] flex flex-col items-center justify-center overflow-hidden">
        
        {/* Header Content */}
        <motion.div 
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.7, ease: [0.25, 1, 0.5, 1] }}
          className="text-center max-w-3xl mx-auto px-6 mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-neutral-900 text-white text-[11px] font-mono tracking-widest uppercase mb-6 shadow-md">
            <Sparkles size={13} className="text-red-500" />
            <span>CLIENT WORKS &amp; COMMERCIAL ARCHIVE</span>
          </div>

          <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl font-normal tracking-tight text-neutral-900 leading-[1.15]">
            Express Your Identity with Our Unique Visuals
          </h2>
          <p className="text-sm sm:text-base text-neutral-600 font-normal mt-5 max-w-xl mx-auto leading-relaxed">
            A curated showcase of live commercial films, brand campaigns, and creative reels engineered for high digital conversion.
          </p>
        </motion.div>

        {/* FULL-WIDTH Curved Window Panorama Container */}
        <div className="relative w-full overflow-hidden my-4 py-8">
          
          {/* Top Concave Curve Mask */}
          <div className="absolute -top-1 left-0 right-0 h-24 sm:h-32 bg-[#fafafa] rounded-b-[100%] z-20 pointer-events-none shadow-[0_20px_35px_rgba(250,250,250,0.9)]" />

          {/* Bottom Concave Curve Mask */}
          <div className="absolute -bottom-1 left-0 right-0 h-24 sm:h-32 bg-[#fafafa] rounded-t-[100%] z-20 pointer-events-none shadow-[0_-20px_35px_rgba(250,250,250,0.9)]" />

          {/* Centered Floating Play Button */}
          <button
            type="button"
            onClick={() => setSelectedVideo({ video_url: displayCategories[0]?.video_url, title: displayCategories[0]?.name, category: displayCategories[0]?.sub })}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-white/90 border border-white/70 shadow-[0_15px_45px_rgba(0,0,0,0.2)] flex items-center justify-center text-neutral-900 hover:scale-110 hover:bg-white transition-all duration-300 group cursor-pointer"
          >
            <Play size={36} className="fill-neutral-900 text-neutral-900 ml-1.5 group-hover:text-red-600 group-hover:fill-red-600 transition-colors" />
          </button>

          {/* Continuous Full-Width Horizontal Motion Track */}
          <div className="w-full flex overflow-hidden py-10">
            <div className="flex gap-7 items-center animate-infinite-marquee hover:[animation-play-state:paused] flex-nowrap will-change-transform">
              {[...displayCategories, ...displayCategories, ...displayCategories].map((item, idx) => (
                <Link
                  key={`curve-${item.id || idx}-${idx}`}
                  href={`/works/${item.id}`}
                  className="w-[320px] sm:w-[380px] md:w-[420px] aspect-[3/4] rounded-3xl overflow-hidden bg-neutral-900 relative flex-shrink-0 shadow-xl cursor-pointer group transition-all duration-300 hover:scale-[1.03] border border-neutral-200/80 block"
                >
                  <video
                    src={item.video_url}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />
                  
                  {/* Floating Card Overlay */}
                  <div className="absolute bottom-16 sm:bottom-20 left-4 right-4 z-10 flex flex-col gap-2 p-4 rounded-2xl bg-black/75 border border-white/15 text-white pointer-events-none shadow-2xl transition-transform duration-300 group-hover:-translate-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-red-400 font-bold bg-black/50 px-2.5 py-1 rounded-md border border-white/10">
                        {item.sub || 'WORK CATEGORY'}
                      </span>
                      <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-red-600 transition-colors">
                        <ArrowUpRight size={13} className="text-white" />
                      </div>
                    </div>

                    <h4 className="text-lg sm:text-xl font-black tracking-tight line-clamp-1 text-white uppercase italic">
                      {item.name}
                    </h4>

                    {item.description && (
                      <p className="text-xs text-neutral-200 font-normal line-clamp-2 leading-relaxed opacity-95">
                        {item.description}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>

        </div>

        {/* Bottom Metrics, CTA and Rotating Quality Badge */}
        <motion.div 
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.25, 1, 0.5, 1] }}
          className="w-full max-w-[1440px] mx-auto px-8 sm:px-16 mt-8 flex justify-center items-center z-30"
        >
          {/* Center: Premium Explore Works Button */}
          <Link 
            href="/works"
            className="group relative inline-flex items-center gap-3 px-10 py-5 rounded-full bg-neutral-950 text-white font-bold text-sm tracking-wider uppercase shadow-[0_15px_35px_rgba(0,0,0,0.2)] hover:shadow-[0_20px_50px_rgba(220,38,38,0.35)] hover:bg-red-600 transition-all duration-300 hover:scale-105 active:scale-95 text-center"
          >
            <Sparkles size={16} className="text-red-500 group-hover:text-white transition-colors" />
            <span>EXPLORE FULL WORKS ARCHIVE</span>
            <ArrowUpRight size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </Link>
        </motion.div>

      </section>

      {/* Hardware-Accelerated Infinite Marquee */}
      <style jsx global>{`
        @keyframes infiniteMarquee {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-50%, 0, 0);
          }
        }

        .animate-infinite-marquee {
          display: flex;
          width: max-content;
          animation: infiniteMarquee 15s linear infinite;
        }
      `}</style>

      {/* Video Modal Player */}
      {selectedVideo && (
        <VideoPlayer 
          video={selectedVideo} 
          onClose={() => setSelectedVideo(null)} 
        />
      )}

    </div>
  );
};

export default FeaturesSection;
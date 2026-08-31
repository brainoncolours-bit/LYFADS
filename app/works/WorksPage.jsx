"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { hasSupabaseConfig, supabase } from '@/lib/supabaseClient';

// --- CONFIGURATION ---
const thum = [
  "/assets/cat/comm.mp4",
  "/assets/cat/digi.mp4",
  "/assets/cat/cover photos ad.mp4",
  "/assets/cat/copo.mp4",
  "/assets/cat/aivdo.mp4",
  "/assets/cat/cover photos ad.mp4"
];

const CATEGORY_DISPLAY_CONFIG = [
  { id: 1 }, { id: 4 }, { id: 18 }, { id: 14 }, { id: 16 },   
];

const FALLBACK_CATEGORIES = [
  { id: "fallback-1", name: "Commercial", sub: "Film" },
  { id: "fallback-2", name: "Digital", sub: "Campaign" },
  { id: "fallback-3", name: "Corporate", sub: "Branding" },
  { id: "fallback-4", name: "AI Video", sub: "Content" },
  { id: "fallback-5", name: "Cinematic", sub: "Production" },
];

const isDirectVideoSource = (url = "") => /\.(mp4|webm|ogg|mov)(\?|$)/i.test(url);

const CategoryRow = ({ cat, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const mediaSource = cat?.carousel_video_url || thum[index % thum.length];
  const isVideo = isDirectVideoSource(mediaSource);
  
  // Alternating layout for chessboard pattern
  const isEven = index % 2 === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.2 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group relative w-full rounded-[24px] sm:rounded-[32px] bg-[#f8f9fa] border border-neutral-200/80 p-4 sm:p-7 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden"
    >
      <div className={`grid grid-cols-1 md:grid-cols-12 gap-5 md:gap-8 items-center ${isEven ? '' : 'md:grid-flow-dense'}`}>
        
        {/* Text Content */}
        <div className={`space-y-3 sm:space-y-4 ${isEven ? 'md:col-span-5' : 'md:col-span-5 md:col-start-8'}`}>
          <div className="flex items-center gap-2">
            <span className="text-[10px] sm:text-[11px] font-mono text-red-600 font-bold tracking-[0.3em] uppercase block">
              {cat.sub || "Category"}
            </span>
          </div>

          <h3 className="text-2xl sm:text-4xl lg:text-5xl font-black text-neutral-950 uppercase tracking-tight leading-none group-hover:text-red-600 transition-colors duration-300">
            {cat.name}
          </h3>

          <div className="pt-1 sm:pt-2">
            <div className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-neutral-950 text-white font-mono text-[10px] sm:text-[11px] font-bold uppercase tracking-wider group-hover:bg-red-600 transition-colors duration-300">
              <span>View Works</span>
              <ArrowUpRightIcon className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>

        {/* Video / Image Screen */}
        <div className={`relative ${isEven ? 'md:col-span-7' : 'md:col-span-7 md:col-start-1'}`}>
          <div className="relative w-full h-[200px] sm:h-[280px] lg:h-[320px] rounded-2xl sm:rounded-[24px] overflow-hidden bg-neutral-950 border-2 sm:border-4 border-white shadow-md">
            {isVideo ? (
              <video
                key={mediaSource}
                src={mediaSource}
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 opacity-90 group-hover:opacity-100"
              />
            ) : (
              <img
                src={mediaSource}
                alt={cat.name}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 opacity-90 group-hover:opacity-100"
              />
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

            <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4 flex items-center justify-between text-white z-10">
              <span className="text-[9px] sm:text-[10px] font-mono tracking-widest text-neutral-300 font-bold uppercase truncate pr-2">
                {cat.name}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-[8px] sm:text-[9px] font-mono uppercase font-bold border border-white/20 flex-shrink-0">
                Reel
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* Dynamic Link */}
      <Link href={`/works/${cat?.id}`} className="absolute inset-0 z-20" />

      {/* Bottom Red Progress Accent */}
      <div className={`absolute bottom-0 left-0 h-1.5 bg-red-600 transition-all duration-500 ease-in-out ${
        isHovered ? 'w-full' : 'w-0'
      }`} />
    </motion.div>
  );
};

export default function WorksCategories() {
  const [categoriesData, setCategoriesData] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      if (!hasSupabaseConfig) {
        setCategoriesData(FALLBACK_CATEGORIES);
        return;
      }

      const { data: categories, error: categoriesError } = await supabase
        .from('video_categories')
        .select('*')
        .order('id', { ascending: true });

      if (!categoriesError && categories?.length) {
        setCategoriesData(categories);
        return;
      }

      setCategoriesData(FALLBACK_CATEGORIES);
    };
    fetchCategories();
  }, []);

  const orderedCategories = [
    ...CATEGORY_DISPLAY_CONFIG.map((config) =>
      categoriesData.find((cat) => String(cat.id) === String(config.id))
    ).filter(Boolean),
    ...categoriesData.filter((cat) =>
      !CATEGORY_DISPLAY_CONFIG.some((config) => String(config.id) === String(cat.id))
    ),
  ];

  return (
    <div className="w-full min-h-screen bg-white text-neutral-900 selection:bg-red-600 selection:text-white">
      <Navbar />

      <main className="w-full pt-28 sm:pt-32 pb-28 md:pb-24 px-4 sm:px-6 max-w-5xl mx-auto space-y-8 sm:space-y-12">
        
        {/* Hero Heading */}
        <header className="space-y-3 sm:space-y-4 text-left">
          <span className="text-[10px] sm:text-xs font-mono font-bold text-red-600 uppercase tracking-widest block">
            PORTFOLIO &amp; SHOWCASE
          </span>
          
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase italic tracking-tight text-neutral-950 leading-[0.95]">
            WHERE IDEAS <br />
            <span className="text-red-600">COME</span> SYSTEMS.
          </h1>

          <p className="text-xs sm:text-base text-neutral-600 font-normal max-w-xl leading-relaxed pt-1 sm:pt-2">
            Explore our curated collection of brand films, digital campaigns, commercial spots, and cinematic productions.
          </p>
        </header>

        {/* Chessboard Row-by-Row Layout */}
        <section className="flex flex-col space-y-6 w-full">
          {orderedCategories.map((cat, i) => (
            <CategoryRow
              key={cat.id}
              cat={cat}
              index={i}
            />
          ))}
        </section>

        {/* Bottom CTA Card */}
        <section className="w-full bg-[#f8f9fa] rounded-[28px] p-6 sm:p-10 border border-neutral-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5 text-center sm:text-left">
            <h2 className="text-2xl sm:text-4xl font-black italic uppercase tracking-tight text-neutral-950">
              NEXT LEVEL?
            </h2>
            <p className="text-sm text-neutral-600 font-normal">
              Let&apos;s collaborate and bring your brand story to life.
            </p>
          </div>

          <Link
            href="/contact"
            className="inline-flex items-center gap-3 px-7 py-3.5 rounded-full bg-neutral-950 text-white font-mono text-xs font-bold uppercase tracking-wider hover:bg-red-600 transition-all shadow-md shrink-0 hover:scale-105"
          >
            <span>Start A Project</span>
            <ArrowUpRightIcon className="w-4 h-4" />
          </Link>
        </section>

      </main>

      <Footer />
    </div>
  );
}

const ArrowUpRightIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M7 17L17 7M17 7H7M17 7V17" />
  </svg>
);
"use client";

import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, useInView, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { supabase } from '@/lib/supabaseClient';

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

// --- HOOKS ---
const useResponsiveCardDimensions = () => {
  const [dimensions, setDimensions] = useState({ width: 520, height: 60 });

  useEffect(() => {
    const updateDimensions = () => {
      if (window.innerWidth < 640) setDimensions({ width: 300, height: 50 });
      else if (window.innerWidth < 1024) setDimensions({ width: 420, height: 55 });
      else setDimensions({ width: 520, height: 60 });
    };
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  return dimensions;
};

// --- COMPONENTS ---
const CategoryCard = ({ cat, index, cardWidth, cardHeight, isStatic = false, redirectUrl }) => {
  const cardRef = useRef(null);
  const videoRef = useRef(null);
  const isInView = useInView(cardRef, { once: false, margin: "-10% 0px -10% 0px" });

  const [isHovered, setIsHovered] = useState(false);
  const [isMobileActive, setIsMobileActive] = useState(false);

  // Use static media or dynamic based on index
  const mediaSource = isStatic ? "/assets/cat/copo.mp4" : thum[index % thum.length];
  const isVideo = mediaSource.toLowerCase().endsWith('.mp4');
  const isSelected = isHovered || isMobileActive;

  useEffect(() => {
    const checkMobile = () => {
      if (window.innerWidth < 768) setIsMobileActive(isInView);
      else setIsMobileActive(false);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [isInView]);

  useEffect(() => {
    if (isVideo && videoRef.current) {
      if (isSelected) videoRef.current.play().catch(() => {});
      else videoRef.current.pause();
    }
  }, [isSelected, isVideo]);

  return (
    <motion.div
      ref={cardRef}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ y: -10 }}
      className="relative group shrink-0 flex flex-col justify-end p-6 md:p-10 overflow-hidden rounded-[2rem] md:rounded-[3.5rem] border border-white/10 bg-zinc-900 transition-all duration-700 ease-out"
      style={{ width: cardWidth, height: `${cardHeight}vh` }}
    >
      {/* --- BACKGROUND LAYER: ZOOM OUT EFFECT --- */}
      <div className="absolute inset-0 z-0 overflow-hidden bg-black">
        {isVideo ? (
          <video
            ref={videoRef}
            src={mediaSource}
            muted loop playsInline
            className={`h-full w-full object-cover transition-all duration-[1200ms] ease-[cubic-bezier(0.23,1,0.32,1)] ${
              isSelected
                ? 'scale-57 grayscale-0 opacity-80'
                : 'scale-125 grayscale opacity-30'
            }`}
          />
        ) : (
          <img
            src={mediaSource}
            alt={cat.name}
            className={`h-full w-full object-cover transition-all duration-[1200ms] ease-[cubic-bezier(0.23,1,0.32,1)] ${
              isSelected
                ? 'scale-100 grayscale-0 opacity-100'
                : 'scale-125 grayscale opacity-40'
            }`}
          />
        )}

        {/* Cinematic Gradient Overlay */}
        <div className={`absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent transition-opacity duration-1000 ${
          isSelected ? 'opacity-60' : 'opacity-90'
        }`} />
      </div>

      {/* --- CONTENT LAYER --- */}
      <div className="relative z-10 pointer-events-none">
        <motion.div
          animate={{ y: isSelected ? 0 : 20, opacity: isSelected ? 1 : 0.8 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <span className="text-[10px] md:text-xs font-mono text-red-500 mb-2 block tracking-[0.4em] uppercase font-bold">
            {cat.sub || "Internal_Project"}
          </span>
          <h3 className="text-3xl md:text-5xl font-black mb-6 uppercase leading-[0.9] tracking-tighter">
            {cat.name}
          </h3>

          <div className={`inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-full border transition-all duration-500 ${
            isSelected ? 'bg-white border-white text-black translate-x-2' : 'border-white/20 text-white'
          }`}>
            <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </div>
        </motion.div>
      </div>

      {/* Dynamic Link: static card uses redirectUrl, others use category ID */}
      <Link href={isStatic ? redirectUrl : `/works/${cat?.id}`} className="absolute inset-0 z-20" />

      {/* Interactive Progress Line */}
      <div className={`absolute bottom-0 left-0 h-1.5 bg-red-600 transition-all duration-1000 ease-in-out ${
        isSelected ? 'w-full' : 'w-0'
      }`} />
    </motion.div>
  );
};

const WorksCategories = () => {
  const [categoriesData, setCategoriesData] = useState([]);
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: targetRef });
  const cardDimensions = useResponsiveCardDimensions();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Horizontal scroll logic
  const x = useTransform(scrollYProgress, [0, 1], isMobile ? ["2%", "-180%"] : ["5%", "-80%"]);
  const physicsX = useSpring(x, { stiffness: 60, damping: 15 });

  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase.from('video_categories').select('*').order('id', { ascending: true });
      if (!error) setCategoriesData(data || []);
    };
    fetchCategories();
  }, []);

  const orderedCategories = [
    // First, include categories in the defined order
    ...CATEGORY_DISPLAY_CONFIG.map((config) =>
      categoriesData.find((cat) => cat.id === config.id)
    ).filter(Boolean),
    // Then, append any newly added categories that aren't in the config
    ...categoriesData.filter((cat) =>
      !CATEGORY_DISPLAY_CONFIG.some((config) => config.id === cat.id)
    ),
  ];

  return (
    <div className="bg-[#050505] text-white selection:bg-red-600 selection:text-white">
      <Navbar />

      {/* Floating Background Label */}
      <div className="fixed inset-0 z-0 pointer-events-none flex items-center justify-center">
        <motion.h1 
          style={{ opacity: useTransform(scrollYProgress, [0, 0.2], [0.15, 0]) }}
          className="text-[25vw] font-black tracking-tighter text-white select-none italic"
        >
          WORKS
        </motion.h1>
      </div>

      <section ref={targetRef} className="relative h-[400vh] bg-transparent">
        <div className="sticky top-0 flex h-screen items-center overflow-hidden">
          <motion.div style={{ x: physicsX }} className="flex gap-6 md:gap-16 px-10 md:px-20 items-center">

            {/* INTRO HERO */}
            <div className="flex flex-col justify-center min-w-[280px] md:min-w-[500px]">
              <h2 className="text-4xl md:text-7xl font-light leading-[0.9] tracking-tighter">
                ELEVATING <br />
                <span className="font-black italic text-red-600">MOTION</span> <br />
                SYSTEMS.
              </h2>
              <p className="mt-6 text-zinc-500 font-mono text-xs tracking-widest uppercase">Scroll to explore_</p>
            </div>

            {/* CATEGORY LOOP */}
            {orderedCategories.map((cat, i) => (
              <CategoryCard
                key={cat.id}
                cat={cat}
                index={i}
                cardWidth={cardDimensions.width}
                cardHeight={cardDimensions.height}
              />
            ))}

            {/* STATIC SPECIAL CARD */}
            {/* <CategoryCard
              cat={{ name: "Branding", sub: "Custom_Solution" }}
              index={orderedCategories.length}
              cardWidth={cardDimensions.width}
              cardHeight={cardDimensions.height}
              isStatic
              redirectUrl="/your-special-page"
            /> */}

            {/* OUTRO CTA */}
            <div className="flex flex-col justify-center min-w-[300px] md:min-w-[700px] pl-10">
              <h2 className="text-5xl md:text-9xl font-black tracking-tighter leading-[0.8]">
                NEXT <br />LEVEL?
              </h2>
              <Link href="/contact" className="group mt-10 flex items-center gap-6">
                <span className="text-xl md:text-3xl font-light text-zinc-400 group-hover:text-white transition-colors">START A PROJECT</span>
                <div className="w-12 h-12 md:w-20 md:h-20 border border-red-600 rounded-full flex items-center justify-center group-hover:bg-red-600 transition-all duration-500">
                   <ArrowUpRightIcon className="w-6 h-6 md:w-10 md:h-10 text-red-600 group-hover:text-white" />
                </div>
              </Link>
            </div>

          </motion.div>
        </div>
      </section>

      {/* Tech Grid Overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.02]">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>
      
      <Footer />
    </div>
  );
};

// Simple Icon Component
const ArrowUpRightIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7V17" />
  </svg>
);

export default WorksCategories;
"use client";
import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { supabase } from '@/lib/supabaseClient';

// Cleaned up the thum array paths (Next.js public folder references shouldn't include 'public')
const thum = [
  "/assets/cat/Commerical.MP4",
  "/assets/cat/video1.mp4",
  "/assets/imagec.png",
  "/assets/imagec.png",
  "/assets/imagec.png",
  "/assets/imagec.png",
];

const CARD_DIMENSIONS = {
  width: 520,
  height: 60,
};

// Responsive card dimensions based on screen size
const useResponsiveCardDimensions = () => {
  const [dimensions, setDimensions] = useState({ width: 520, height: 60 });

  useEffect(() => {
    const updateDimensions = () => {
      if (window.innerWidth < 640) {
        setDimensions({ width: 280, height: 45 });
      } else if (window.innerWidth < 768) {
        setDimensions({ width: 320, height: 50 });
      } else if (window.innerWidth < 1024) {
        setDimensions({ width: 400, height: 55 });
      } else {
        setDimensions({ width: 520, height: 60 });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  return dimensions;
};

// Separate component for each category card with mobile auto-trigger
const CategoryCard = ({ cat, index, cardWidth, cardHeight }) => {
  const cardRef = useRef(null);
  const videoRef = useRef(null);
  const isInView = useInView(cardRef, { once: false, margin: "-20% 0px -20% 0px" });
  const [isActive, setIsActive] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const isVideo = thum[index % thum.length].toLowerCase().endsWith('.mp4');

  useEffect(() => {
    const updateActiveState = () => {
      const isMobile = window.innerWidth < 768;
      if (isMobile && isInView) {
        setIsActive(true);
      } else if (!isMobile) {
        setIsActive(false);
      }
    };

    updateActiveState();

    window.addEventListener('resize', updateActiveState);
    return () => window.removeEventListener('resize', updateActiveState);
  }, [isInView]);

  // Handle video playback on hover or mobile in-view
  useEffect(() => {
    if (isVideo && videoRef.current) {
      const shouldPlay = isHovered || isActive;
      if (shouldPlay) {
        videoRef.current.play().catch(() => {});
      } else {
        videoRef.current.pause();
      }
    }
  }, [isHovered, isActive, isVideo]);

  return (
    <motion.div
      ref={cardRef}
      whileHover={{ y: -20 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={`relative group shrink-0 flex flex-col justify-end p-4 sm:p-6 md:p-8 lg:p-10 overflow-hidden rounded-2xl sm:rounded-3xl md:rounded-[3rem] border border-white/10 bg-zinc-900 transition-all duration-500 hover:border-red-500/50 ${
        isActive ? 'active-mobile' : ''
      }`}
      style={{ width: cardWidth, height: `${cardHeight}vh` }}
    >
      {/* --- BACKGROUND VIDEO / IMAGE LAYER --- */}
     <div className="absolute inset-0 z-0 overflow-hidden">
  {isVideo ? (
    <video
      ref={videoRef}
      src={thum[index % thum.length]}
      muted
      loop
      playsInline
      disablePictureInPicture
      className={`h-full w-full object-cover transition-all duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)] ${
        isActive
          ? 'grayscale-0 scale-110 opacity-70'
          : 'grayscale opacity-30 group-hover:grayscale-0 group-hover:scale-110 group-hover:opacity-70'
      }`}
    />
  ) : (
    <img
      src={thum[index % thum.length]}
      alt={cat.name}
      className={`h-full w-full object-cover transition-all duration-700 ease-in-out ${
        isActive
          ? 'grayscale-0 scale-105 opacity-100'
          : 'grayscale opacity-40 group-hover:grayscale-0 group-hover:scale-105 group-hover:opacity-100'
      }`}
    />
  )}

  {/* Premium Cinematic Overlay */}
  <div className={`absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent transition-opacity duration-700 ${
    isActive ? 'opacity-40' : 'opacity-80 group-hover:opacity-40'
  }`} />

  {/* Optional: Noise Grain Overlay for that "High-End" look */}
  <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
</div>

      {/* --- CONTENT LAYER --- */}
      <div className={`relative z-10 transition-all duration-500 ease-expo ${
        isActive
          ? 'opacity-0 translate-y-10 pointer-events-none'
          : 'group-hover:opacity-0 group-hover:translate-y-10 group-hover:pointer-events-none'
      }`}>
        <span className="text-[10px] sm:text-xs font-mono text-red-400 mb-1 sm:mb-2 block tracking-widest uppercase">
          {cat.sub || "Featured"}
        </span>
        <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black mb-3 sm:mb-4 md:mb-6 uppercase leading-none">
          {cat.name}
        </h3>

        <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-full border border-white/20">
          <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </div>
      </div>

      {/* --- FULL CARD CLICK LINK --- */}
      <Link href={`/works/${cat?.id}`} className="absolute inset-0 z-20" />

      {/* Animated Bottom Edge */}
      <div className={`absolute bottom-0 left-0 h-0.5 sm:h-1 bg-red-500 transition-all duration-700 ${
        isActive ? 'w-full' : 'w-0 group-hover:w-full'
      }`} />
    </motion.div>
  );
};

const WorksCategories = () => {
  const [categoriesData, setCategoriesData] = useState([]);
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: targetRef });

  const cardDimensions = useResponsiveCardDimensions();

  // --- CUSTOM DISPLAY ORDER ---
  // Rearrange these objects to change the order of categories displayed
  // Add/remove objects as needed. The 'id' should match your Supabase category ID.
  const CATEGORY_DISPLAY_CONFIG = [
    { id: 1 }, // First category to display
    { id: 15}, // Second category to display
    { id: 4 }, // Third category to display
    { id: 13 }, // Fourth category to display
    { id: 5 }, // Fifth category to display
    { id: 6 }, // Sixth category to display
    // Add more: { id: 7 }, { id: 8 }, etc.
  ];
  // ---------------------------

  // Responsive scroll animation based on screen size
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const x = useTransform(scrollYProgress, [0, 1], isMobile ? ["5%", "-150%"] : ["10%", "-70%"]);
  const physicsX = useSpring(x, { stiffness: 100, damping: 20 });

  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from('video_categories')
        .select('*')
        .order('id', { ascending: true });

      if (error) {
        console.error('Error fetching categories:', error);
      } else {
        setCategoriesData(data || []);
        console.log('fetchedData', data);
      }
    };
    fetchCategories();
  }, []);

  // Map categories based on custom display order
  const orderedCategories = CATEGORY_DISPLAY_CONFIG.map((config) =>
    categoriesData.find((cat) => cat.id === config.id)
  ).filter(Boolean);

  return (
    <div className="bg-[#050505] text-white">
      <Navbar />

      {/* Background WORKS Text - Responsive positioning */}
      <div className="fixed top-20 sm:top-32 left-1/2 -translate-x-1/2 z-0 pointer-events-none text-center w-full">
        <motion.h1
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 0.1, x: 0 }}
          className="text-[15vw] sm:text-[20vw] font-black leading-none select-none"
        >
          WORKS
        </motion.h1>
      </div>

      <section ref={targetRef} className="relative h-[300vh] sm:h-[400vh] bg-transparent">
        <div className="sticky top-0 flex h-screen items-center overflow-hidden">
          <motion.div style={{ x: physicsX }} className="flex gap-4 sm:gap-8 md:gap-12 px-4 sm:px-8 md:px-12">

            {/* Intro Text - Responsive */}
            <div className="flex flex-col justify-center min-w-[200px] sm:min-w-[300px] md:min-w-[400px] lg:min-w-[500px] pr-4 sm:pr-10 md:pr-15 lg:pr-20">
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light leading-tight">
                Crafting <br />
                <span className="font-black italic text-red-500">Visual</span> <br />
                Excellence.
              </h2>
            </div>

            {/* Category Cards */}
           {orderedCategories.map((cat, i) => (
              <CategoryCard
                key={cat.id}
                cat={cat}
                index={i}
                cardWidth={cardDimensions.width}
                cardHeight={cardDimensions.height}
              />
            ))}

            {/* CTA Section - Responsive */}
            <div className="flex flex-col justify-center min-w-[200px] sm:min-w-[300px] md:min-w-[400px] lg:min-w-[600px] pl-4 sm:pl-10 md:pl-15 lg:pl-20">
              <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-black tracking-tighter leading-tight">
                READY TO <br />START?
              </h2>
              <Link href="/contact" className="text-lg sm:text-xl md:text-2xl lg:text-3xl mt-4 sm:mt-6 md:mt-8 flex items-center gap-2 sm:gap-4 hover:gap-6 lg:hover:gap-8 transition-all text-zinc-400 hover:text-white">
                LET&apos;S BUILD SOMETHING <span className="text-red-500">→</span>
              </Link>
            </div>

          </motion.div>
        </div>
      </section>

      <div className="fixed inset-0 pointer-events-none opacity-[0.03] overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div key={i} className="h-[1px] w-full bg-white my-12" />
        ))}
      </div>
      <Footer />
    </div>
  );
};

export default WorksCategories;
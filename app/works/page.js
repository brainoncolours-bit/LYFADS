"use client";
import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  Clapperboard, Briefcase, Music2, Film, Ticket, 
  Presentation, Sparkles, Smartphone, Award, Box
} from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

const categories = [
  { id: 'commercial', name: 'Commercials', sub: 'High Impact', icon: Clapperboard },
  { id: 'music-video', name: 'Music Videos', sub: 'Rhythmic Art', icon: Music2 },
  { id: 'corporate', name: 'Corporate', sub: 'Business Soul', icon: Briefcase },
  { id: 'documentary', name: 'Documentary', sub: 'Real Stories', icon: Film },
  { id: 'animation', name: 'Animation', sub: 'Digital Worlds', icon: Sparkles },
  { id: 'brand-film', name: 'Brand Films', sub: 'Legacy Building', icon: Award },
];

const CARD_DIMENSIONS = {
  width: 520,
  height: 60,
};



const WorksCategories = () => {
  const [categoriesData, setCategoriesData] = useState([]);

  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: targetRef });

  // Transform vertical scroll into horizontal movement
  const x = useTransform(scrollYProgress, [0, 1], ["10%", "-70%"]);
  const physicsX = useSpring(x, { stiffness: 100, damping: 20 });

  // fetchh categories from supabase
useEffect(() => {
  // Fetch categories if needed
  const fetchCategories = async () => {
    // Fetch logic here if categories were dynamic
    const { data, error } = await supabase
      .from('video_categories')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching categories:', error);
    } else {
      // Handle the fetched categories if needed
      console.log('Fetched categories:', data[0]);
      setCategoriesData(data || []);
    }
  };
  fetchCategories();
  
}, []);
  return (
    <div className="bg-[#050505] text-white">
      <Navbar />
      
      {/* Fixed Hero Title - Stays while scrolling */}
      <div className="fixed top-32 left-12 z-0 pointer-events-none">
        <motion.h1 
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 0.1, x: 0 }}
          className="text-[20vw] font-black leading-none select-none"
        >
          WORKS
        </motion.h1>
      </div>

      {/* Main Scroll Container */}
      <section ref={targetRef} className="relative h-[400vh] bg-transparent">
        <div className="sticky top-0 flex h-screen items-center overflow-hidden">
          
          <motion.div style={{ x: physicsX }} className="flex gap-12 px-12">
            
            {/* Introductory Slide */}
            <div className="flex flex-col justify-center min-w-[500px] pr-20">
              <h2 className="text-6xl font-light leading-tight">
                Crafting <br /> 
                <span className="font-black italic text-red-500">Visual</span> <br /> 
                Excellence.
              </h2>
              <p className="text-zinc-500 mt-6 max-w-sm font-mono uppercase tracking-widest text-xs">
                Scroll to explore our diverse production capabilities and creative portfolio.
              </p>
            </div>

            {/* Category Cards */}
            {categoriesData.map((cat, i) => (
              <motion.div
                key={cat.id}
                whileHover={{ y: -20 }}
                className="relative group shrink-0 flex flex-col justify-end p-10 overflow-hidden rounded-[3rem] border border-white/10 bg-zinc-900/30 backdrop-blur-3xl transition-colors hover:border-red-500/50"
                style={{ width: `${CARD_DIMENSIONS.width}px`, height: `${CARD_DIMENSIONS.height}vh` }}
              >
                {/* Parallax Icon Background */}
                {/* <div className="absolute -top-10 -right-10 text-white/[0.03] group-hover:text-red-500/10 transition-colors duration-700">
                  <cat.icon size={300} strokeWidth={1} />
                </div> */}

                <div className="relative z-10">
                  <span className="text-xs font-mono text-red-400 mb-2 block tracking-widest uppercase">
                    {cat.sub}
                  </span>
                  <h3 className="text-5xl font-black mb-6 group-hover:italic transition-all uppercase">
                    {cat.name}
                  </h3>
                  
                  <Link href={`/works/${cat?.id}`}>
                    <motion.div 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="inline-flex items-center justify-center w-16 h-16 rounded-full border border-white/20 group-hover:bg-white group-hover:text-black transition-all duration-500"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </motion.div>
                  </Link>
                </div>

                {/* Animated Gradient Edge */}
                <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-red-500 to-orange-500 group-hover:w-full transition-all duration-700" />
              </motion.div>
            ))}

            {/* Closing Slide */}
            <div className="flex flex-col justify-center min-w-[600px] pl-20">
              <h2 className="text-8xl font-black tracking-tighter">READY TO <br />START?</h2>
              <Link href="/contact" className="text-3xl mt-8 flex items-center gap-4 hover:gap-8 transition-all text-zinc-400 hover:text-white">
                LET'S BUILD SOMETHING <span className="text-red-500">→</span>
              </Link>
            </div>

          </motion.div>
        </div>
      </section>

      {/* Background Decorative "Scanlines" */}
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
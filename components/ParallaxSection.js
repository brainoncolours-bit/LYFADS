"use client";
import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export default function ParallaxSection({heading,spanText}) {
  const parallaxRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      if (parallaxRef.current) {
        parallaxRef.current.style.backgroundPositionY = `${scrollPosition * 0.5}px`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      ref={parallaxRef}
      className="h-[60vh] bg-center bg-cover bg-[url('/parallaxBg.jpg')]"
>
        <div className="flex items-end justify-center h-full bg-black bg-opacity-50">
        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}        
        className="text-4xl  lg:text-6xl w-[100%] py-12 text-new-white text-center font-bold mb-8">{heading}
        <span className='text-brand-color'>&nbsp;{spanText}</span>
        </motion.h1>
      </div>
    </div>
  );
}
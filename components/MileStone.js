"use client";
import { useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { poppins } from "@/lib/font";

const milestones = [
  {
    title: "Creative Production",
    description: "Transform your vision into captivating visual stories. Our team crafts premium ad films, commercials, and branded content that resonates with your audience.",
  },
  {
    title: "Post-Production Excellence",
    description: "From color grading to VFX and sound design, we bring cinematic quality to every frame. Turning raw footage into polished masterpieces.",
  },
  {
    title: "360° Creative Solutions",
    description: "We handle everything—concept development, cinematography, editing, and delivery. A complete production house experience from idea to final output.",
  },
];

export default function TimelineSection() {
  const containerRef = useRef(null);

  // 1. Scroll Progress Logic for the line
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "center center"],
  });

  // Smooths out the progress bar movement
  const scaleLine = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // 2. Typewriter Effect Logic
  const sentence = "Elevate Your Brand – Premium Production House For Visionary Content!";
  
  const textVariants = {
    hidden: { opacity: 0 },
    visible: (i) => ({
      opacity: 1,
      transition: { delay: i * 0.04 }, // Speed of "typing"
    }),
  };

  return (
    <section 
      ref={containerRef}
      className={`${poppins.className} relative flex flex-col items-center justify-center py-24 px-6 bg-black text-white overflow-hidden`}
    >
      {/* Animated Heading (Typewriter) */}
      <h2 className="text-3xl md:text-5xl font-extrabold text-center mb-8 leading-tight">
        {sentence.split("").map((char, index) => (
          <motion.span
            key={index}
            custom={index}
            variants={textVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {char}
          </motion.span>
        ))}
      </h2>

      <motion.p 
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.8, duration: 0.8 }}
        className="text-center max-w-2xl text-gray-400 mb-20"
      >
        We create stunning visual content that captivates audiences and elevates your brand. From concept to final cut, excellence in every frame.
      </motion.p>

      {/* Timeline Container */}
      <div className="relative w-full max-w-7xl">
        
        {/* Horizontal Progress Line (Desktop) */}
        <div className="hidden md:block absolute top-4 left-0 w-full h-[2px] bg-gray-800" />
        <motion.div
          style={{ scaleX: scaleLine }}
          className="hidden md:block absolute top-4 left-0 w-full h-[2px] bg-red-600 origin-left z-0"
        />

        {/* Vertical Progress Line (Mobile) */}
        <div className="block md:hidden absolute top-0 left-4 h-full w-[2px] bg-gray-800" />
        <motion.div
          style={{ scaleY: scaleLine }}
          className="block md:hidden absolute top-0 left-4 w-[2px] h-full bg-red-600 origin-top z-0"
        />

        {/* Milestones */}
        <div className="relative w-full grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-8">
          {milestones.map((item, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 * index }}
              className="flex flex-row md:flex-col items-start md:items-center text-left md:text-center relative group"
            >
              {/* Animated Circle */}
              <div className="flex-shrink-0 w-8 h-8 rounded-full border-2 border-red-600 bg-black flex items-center justify-center z-10 mr-6 md:mr-0 md:mb-6 transition-transform group-hover:scale-125">
                <div className="w-3 h-3 rounded-full bg-red-600" />
              </div>

              {/* Text Content */}
              <div className="max-w-xs">
                <h3 className="text-xl font-semibold leading-snug">
                  {item.title}
                </h3>
                <p className="mt-4 text-sm text-gray-500 leading-relaxed group-hover:text-gray-300 transition-colors">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Button */}
      {/* <motion.button 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="mt-16 px-8 py-3 border-2 border-brand-color text-white font-semibold rounded-full hover:bg-brand-color transition-colors duration-300"
      >
        Explore Our Portfolio →
      </motion.button> */}
    </section>
  );
}
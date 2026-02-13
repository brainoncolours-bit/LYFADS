import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, animate, useMotionValue } from 'framer-motion';
const IMAGES = [
  "/assets/imagec.png",
  // Image,
  // "https://images.unsplash.com/photo-1550745165-9bc0b252726f",
"/assets/imagec.png",
// "/assets/img2.jpeg",
"/assets/imagec.png",


// "/assets/image.png",
// "/assets/img2.jpeg",
// "/assets/img3.jpeg",


"/assets/imagec.png",
// "/assets/img3.jpeg",



"/assets/imagec.png",
"/assets/imagec.png",

// "/assets/image.png",
"/assets/imagec.png",



];

const NucleusHero = () => {
  const containerRef = useRef(null);
  const [introFinished, setIntroFinished] = useState(false);
  
  // Create a motion value for the "Intro" radius
  const introRadius = useMotionValue(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const smoothScroll = useSpring(scrollYProgress, { stiffness: 60, damping: 25 });

  // RUN INTRO ON LOAD
  useEffect(() => {
    // Animate from 0 to 200px immediately on load
    const controls = animate(introRadius, 200, {
      duration: 1.5,
      ease: [0.16, 1, 0.3, 1], // Custom out-expo ease
      onComplete: () => setIntroFinished(true)
    });
    return controls.stop;
  }, []);

  const logoScale = useTransform(smoothScroll, [0, 0.2, 0.5], [1, 0.9, 0.8]);

  return (
    <div ref={containerRef} className="relative h-[500vh] bg-[#030303] overflow-clip">
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
        
        {/* LOGO */}
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1 }}
          style={{ scale: logoScale }}
          className="relative z-50 pointer-events-none"
        >
          <img 
            src="./bg.png" 
            alt="Logo" 
            className="w-48 md:w-64 h-auto drop-shadow-[0_0_40px_rgba(255,255,255,0.15)]" 
          />
        </motion.div>

        {/* ORBIT ENGINE */}
        <div className="absolute inset-0" style={{ perspective: "1500px" }}>
          {IMAGES.map((src, i) => (
            <OrbitalFrame 
              key={i} 
              src={src} 
              index={i} 
              progress={smoothScroll} 
              introRadius={introRadius}
            />
          ))}
        </div>

        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_20%,black_100%)] opacity-80" />
      </div>
    </div>
  );
};

const OrbitalFrame = ({ src, index, progress, introRadius }) => {
  const total = IMAGES.length;
  const angle = (index / total) * Math.PI * 2;
  
  // COMBINED RADIUS: 
  // It takes the introRadius (0 to 200) and adds the scrollRadius (0 to 300)
  const scrollRadius = useTransform(progress, [0, 0.5], [0, 300]);
  
  const rotationOffset = useTransform(progress, [0, 1], [0, Math.PI]);

  // We combine the intro animation value with the scroll value
  const x = useTransform([introRadius, scrollRadius, rotationOffset], ([intro, scroll, rot]) => 
    Math.cos(angle + rot) * (intro + scroll)
  );
  const y = useTransform([introRadius, scrollRadius, rotationOffset], ([intro, scroll, rot]) => 
    Math.sin(angle + rot) * (intro + scroll)
  );
  
  // Initial fade-in on load, stay visible on scroll
  const scale = useTransform([introRadius, progress], ([intro, prog]) => {
     if (prog > 0) return 1 + prog * 0.2; // grow slightly on scroll
     return intro / 200; // scale up during intro
  });

  const opacity = useTransform(introRadius, [0, 100], [0, 1]);

  return (
    <motion.div
      style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        x,
        y,
        scale,
        opacity,
        translateX: "-50%",
        translateY: "-50%",
      }}
      className="group"
    >
      <div className="relative w-32 h-44 md:w-52 md:h-72 bg-zinc-900 border border-white/10 p-1 shadow-2xl transition-all duration-500 group-hover:scale-110 group-hover:border-red-600 group-hover:z-[100]">
        <img 
          src={src} 
          className="w-full h-full object-cover  group-hover:grayscale-0 group-hover:brightness-110 transition-all duration-700" 
          alt=""
        />
      </div>
    </motion.div>
  );
};

export default NucleusHero;
import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, animate, useMotionValue } from 'framer-motion';

const IMAGES = [
  "/assets/home/img1.jpeg",
  "/assets/home/img2.jpeg",
  "/assets/home/img3.jpeg",
  "/assets/home/img4.jpeg",
  "/assets/home/img5.jpeg",
  // "/assets/home/img6.jpeg",
  "/assets/home/img7.jpeg",
];

const NucleusHero = () => {
  const containerRef = useRef(null);
  
  // We initialize with desktop-friendly defaults
  const [dimensions, setDimensions] = useState({
    baseRadius: 140,
    scrollSpread: 180,
    logoSize: "w-48"
  });

  const introRadius = useMotionValue(0);

  useEffect(() => {
    const updateDimensions = () => {
      const width = window.innerWidth;
      if (width < 640) {
        // Mobile: Tight circle
        setDimensions({ baseRadius: 90, scrollSpread: 100, logoSize: "w-28" });
      } else if (width < 1024) {
        // Tablet: Medium circle
        setDimensions({ baseRadius: 110, scrollSpread: 140, logoSize: "w-40" });
      } else {
        // Laptop/Desktop: Tighter circle (reduced from 200 to 140)
        setDimensions({ baseRadius: 140, scrollSpread: 180, logoSize: "w-60" });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    
    const controls = animate(introRadius, dimensions.baseRadius, {
      duration: 1.8,
      ease: [0.16, 1, 0.3, 1],
    });

    return () => {
      window.removeEventListener('resize', updateDimensions);
      controls.stop();
    };
  }, [dimensions.baseRadius]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const smoothScroll = useSpring(scrollYProgress, { stiffness: 50, damping: 20 });
  const logoScale = useTransform(smoothScroll, [0, 0.5], [1, 0.8]);

  return (
    <div ref={containerRef} className="relative h-[300vh] bg-[#030303] overflow-clip">
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
        
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          style={{ scale: logoScale }}
          className="relative z-50 pointer-events-none"
        >
          <img
            src="./bg.png"
            alt="Logo"
            className={`${dimensions.logoSize} h-auto drop-shadow-[0_0_50px_rgba(255,255,255,0.1)]`}
          />
        </motion.div>

        <div className="absolute inset-0" style={{ perspective: "1200px" }}>
          {IMAGES.map((src, i) => (
            <OrbitalFrame
              key={i}
              src={src}
              index={i}
              total={IMAGES.length}
              progress={smoothScroll}
              introRadius={introRadius}
              scrollSpread={dimensions.scrollSpread}
              baseRadius={dimensions.baseRadius}
            />
          ))}
        </div>

        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_10%,black_90%)] opacity-90" />

        {/* SCROLL INDICATOR */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-3"
        >
          <p className="text-[10px] font-mono tracking-[0.5em] text-zinc-500 uppercase">Scroll to Explore</p>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-6 h-10 border-2 border-red-600/50 rounded-full flex justify-center pt-2"
          >
            <motion.div
              animate={{ opacity: [1, 0], y: [0, 6] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="w-1 h-2 bg-red-600 rounded-full"
            />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

const OrbitalFrame = ({ src, index, total, progress, introRadius, scrollSpread, baseRadius }) => {
  const angle = (index / total) * Math.PI * 2;

  const scrollRadius = useTransform(progress, [0, 1], [0, scrollSpread]);
  const rotationOffset = useTransform(progress, [0, 1], [0, Math.PI / 2]); // Slower rotation for premium feel

  const x = useTransform([introRadius, scrollRadius, rotationOffset], ([intro, scroll, rot]) =>
    Math.cos(angle + rot) * (intro + scroll)
  );
  const y = useTransform([introRadius, scrollRadius, rotationOffset], ([intro, scroll, rot]) =>
    Math.sin(angle + rot) * (intro + scroll)
  );

  const scale = useTransform([introRadius, progress], ([intro, prog]) => {
     const initialScale = intro / baseRadius;
     return initialScale + (prog * 0.1); // Subtle growth
  });

  const opacity = useTransform(introRadius, [0, baseRadius * 0.4], [0, 1]);

  return (
    <motion.div
      style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        x, y, scale, opacity,
        translateX: "-50%",
        translateY: "-50%",
      }}
      className="group"
    >
      <div className="relative w-24 h-36 sm:w-44 sm:h-64 md:w-48 md:h-68 bg-[#111] border border-white/10 p-1 shadow-2xl transition-all duration-500 group-hover:border-red-500/50 group-hover:z-[100] rounded-sm overflow-hidden">
        <img
          src={src}
          className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-700"
          alt="Portfolio Item"
        />
      </div>
    </motion.div>
  );
};

export default NucleusHero;
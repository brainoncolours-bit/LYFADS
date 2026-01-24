import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useVelocity } from 'framer-motion';

const PROJECTS = [
  { id: 1, title: "CYBER", color: "text-red-600", img: "https://images.unsplash.com/photo-1550745165-9bc0b252726f", x: -400, y: -200 },
  { id: 2, title: "RAZOR", color: "text-white", img: "https://images.unsplash.com/photo-1533107862482-0e6974b06ec4", x: 400, y: -300 },
  { id: 3, title: "VOID", color: "text-red-600", img: "https://images.unsplash.com/photo-1509248961158-e54f6934749c", x: -350, y: 350 },
  { id: 4, title: "CORE", color: "text-white", img: "https://images.unsplash.com/photo-1517649763962-0c623066013b", x: 450, y: 250 },
  { id: 5, title: "NOVA", color: "text-red-600", img: "https://images.unsplash.com/photo-1493225255756-d9584f8606e9", x: 0, y: -500 },
  { id: 6, title: "RAVEN", color: "text-white", img: "https://images.unsplash.com/photo-1485846234645-a62644f84728", x: 0, y: 500 },
];

const GravityWellHero = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 25 });
  const velocity = useVelocity(smoothProgress);
  
  // The "Impact" effect when scrolling fast
  const shake = useTransform(velocity, [-1, 1], [-10, 10]);
  const blur = useTransform(velocity, [-1, 0, 1], [5, 0, 5]);

  return (
    <div ref={containerRef} className="relative h-[800vh] bg-black cursor-none">
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
        
        {/* THE CENTER VORTEX */}
        <motion.div 
          style={{ rotate: useTransform(smoothProgress, [0, 1], [0, 360]), filter: `blur(${blur}px)` }}
          className="relative w-full h-full flex items-center justify-center"
        >
          {PROJECTS.map((p, i) => (
            <FloatingElement key={i} project={p} progress={smoothProgress} index={i} />
          ))}
        </motion.div>

        {/* BRUTALIST OVERLAY TITLE */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-50">
          <motion.h1 
            style={{ x: shake }}
            className="text-[20vw] font-[1000] italic text-white mix-blend-difference leading-none tracking-tighter"
          >
            LYF<span className="text-red-600">ADS</span>
          </motion.h1>
          <div className="flex gap-10 mt-4 overflow-hidden h-6">
            <motion.p 
                animate={{ y: [0, -20, 0] }} 
                transition={{ repeat: Infinity, duration: 2 }}
                className="text-red-600 font-mono text-xs tracking-[1em] uppercase"
            >
                Unleash the Chaos
            </motion.p>
          </div>
        </div>

        {/* NOISE GRAIN OVERLAY */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.15] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat" />
      </div>
    </div>
  );
};

const FloatingElement = ({ project, progress, index }) => {
  // Logic: Items start at their X/Y positions and get sucked into (0,0) as we scroll
  // Then they fly PAST the camera (Z-axis scale)
  
  const start = index * 0.12;
  const end = start + 0.25;

  const x = useTransform(progress, [start, end], [project.x, 0]);
  const y = useTransform(progress, [start, end], [project.y, 0]);
  const scale = useTransform(progress, [start, end, end + 0.1], [0.2, 1.5, 4]);
  const opacity = useTransform(progress, [start, start + 0.05, end, end + 0.1], [0, 1, 1, 0]);
  const rotate = useTransform(progress, [start, end], [project.x / 10, 0]);

  return (
    <motion.div
      style={{ x, y, scale, opacity, rotate }}
      className="absolute w-[40vw] max-w-[500px] aspect-video group"
    >
      <div className="relative w-full h-full border-[1px] border-white/20 overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)]">
        <img src={project.img} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt="" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-6 translate-y-full group-hover:translate-y-0 transition-transform">
          <span className="text-red-600 font-mono text-[10px] mb-1">PROJ_00{project.id}</span>
          <h3 className="text-4xl font-black italic text-white uppercase">{project.title}</h3>
        </div>
      </div>
    </motion.div>
  );
};

export default GravityWellHero;
"use client";
import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import styled from 'styled-components';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const works = [
  { id: 1, title: "VELOCITY X", tag: "REDEFINING SPEED", color: "#ff0000" },
  { id: 2, title: "RED LINE", tag: "BEYOND THE LIMIT", color: "#ffffff" },
  { id: 3, title: "APEX FLOW", tag: "FLUID MOTION", color: "#ff0000" },
  { id: 4, title: "CORE POWER", tag: "RAW ENERGY", color: "#ffffff" },
  { id: 5, title: "NEON DRIFT", tag: "NIGHT VISIONS", color: "#ff0000" },
  { id: 6, title: "PURE HEAT", tag: "THERMAL FLOW", color: "#ffffff" },
];

const KineticTunnel = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  return (
    <>
      <Navbar />
      <StyledPage ref={containerRef}>
        {/* FIXED UI ELEMENTS */}
        <nav className="fixed-nav">
          <div className="logo">LYF<span>.</span>ADS</div>
          <div className="status">// PRODUCTION_HOUSE_2026</div>
        </nav>

      <div className="scroll-indicator">
        <motion.div 
          className="bar" 
          style={{ scaleY: smoothProgress }} 
        />
        <span>SCROLL TO EXPLORE</span>
      </div>

      {/* 3D SCENE */}
      <div className="scene-container">
        <div className="sticky-wrapper">
          {works.map((work, index) => (
            <SceneCard 
              key={work.id} 
              work={work} 
              index={index} 
              progress={smoothProgress} 
              total={works.length}
            />
          ))}
          
          {/* BACKGROUND DEBRIS/3D ELEMENTS */}
          <BackgroundElements progress={smoothProgress} />
        </div>
      </div>

      {/* FOOTER AREA */}
      <section className="footer-trigger">
        <h2 className="massive-text">FIN.</h2>
      </section>
    </StyledPage>
    <Footer />
    </>
  );
};

const SceneCard = ({ work, index, progress, total }) => {
  // Each card starts far away and moves past the camera
  const start = index / total;
  const end = (index + 1) / total;
  
  // Z-axis movement (Coming at the camera)
  const z = useTransform(progress, [start, end], [1000, -1500]);
  const opacity = useTransform(progress, [start, start + 0.1, end - 0.1, end], [0, 1, 1, 0]);
  const scale = useTransform(progress, [start, end], [0.5, 3]);
  const rotateX = useTransform(progress, [start, end], [20, -20]);

  return (
    <motion.div 
      className="card-3d"
      style={{ 
        z, 
        opacity, 
        scale,
        rotateX,
        perspective: "1000px"
      }}
    >
      <div className="card-content">
        <div className="card-image-wrapper">
          <div className="overlay" style={{ backgroundColor: work.color }} />
          <h3 className="card-title">{work.title}</h3>
        </div>
        <div className="card-meta">
          <span className="index">0{index + 1}</span>
          <p className="tag">{work.tag}</p>
        </div>
      </div>
    </motion.div>
  );
};

const BackgroundElements = ({ progress }) => {
  const rotate = useTransform(progress, [0, 1], [0, 360]);
  return (
    <motion.div className="debris-field" style={{ rotateZ: rotate }}>
      {[...Array(20)].map((_, i) => (
        <div 
          key={i} 
          className="shrapnel" 
          style={{ 
            top: `${Math.random() * 100}%`, 
            left: `${Math.random() * 100}%`,
            width: Math.random() * 50 + 'px'
          }} 
        />
      ))}
    </motion.div>
  );
};

const StyledPage = styled.div`
  background: #000;
  color: #fff;
  height: 600vh; /* Adjust length of scroll */
  font-family: 'Inter', sans-serif;

  .fixed-nav {
    position: fixed;
    top: 40px;
    left: 40px;
    right: 40px;
    display: flex;
    justify-content: space-between;
    z-index: 100;
    mix-blend-mode: difference;
    
    .logo {
      font-size: 2rem;
      font-weight: 900;
      font-style: italic;
      span { color: #ff0000; }
    }
    .status {
      font-family: monospace;
      letter-spacing: 2px;
    }
  }

  .scroll-indicator {
    position: fixed;
    right: 40px;
    top: 50%;
    transform: translateY(-50%);
    height: 200px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    z-index: 100;

    span {
      writing-mode: vertical-rl;
      font-size: 10px;
      letter-spacing: 4px;
      color: #666;
    }

    .bar {
      width: 2px;
      flex-grow: 1;
      background: #ff0000;
      transform-origin: top;
    }
  }

  .scene-container {
    position: sticky;
    top: 0;
    height: 100vh;
    overflow: hidden;
    perspective: 1200px;
  }

  .sticky-wrapper {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    transform-style: preserve-3d;
  }

  .card-3d {
    position: absolute;
    width: 600px;
    aspect-ratio: 16/9;
    transform-style: preserve-3d;

    @media (max-width: 768px) {
      width: 90vw;
    }
  }

  .card-content {
    position: relative;
    width: 100%;
    height: 100%;
    background: #111;
    border: 1px solid rgba(255, 255, 255, 0.1);
    padding: 20px;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    box-shadow: 0 50px 100px rgba(0,0,0,0.5);
  }

  .card-image-wrapper {
    position: absolute;
    inset: 0;
    overflow: hidden;
    .overlay {
      position: absolute;
      inset: 0;
      opacity: 0.2;
      transition: 0.5s;
    }
  }

  .card-title {
    position: relative;
    font-size: 5rem;
    font-weight: 900;
    margin: 0;
    line-height: 0.9;
    font-style: italic;
    transform: translateZ(50px); /* 3D Pop */
  }

  .card-meta {
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-top: 20px;
    transform: translateZ(30px);

    .index { font-weight: 900; color: #ff0000; font-size: 1.5rem; }
    .tag { font-family: monospace; margin: 0; }
  }

  .debris-field {
    position: absolute;
    width: 150%;
    height: 150%;
    pointer-events: none;
    
    .shrapnel {
      position: absolute;
      height: 2px;
      background: #ff0000;
      filter: blur(1px);
    }
  }

  .footer-trigger {
    height: 100vh;
    display: grid;
    place-items: center;
    .massive-text {
      font-size: 20vw;
      font-weight: 900;
      font-style: italic;
      color: #111;
      border-bottom: 20px solid #ff0000;
    }
  }
`;

export default KineticTunnel;
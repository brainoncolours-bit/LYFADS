"use client";
import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion";

const items = [
  { name: "Films", desc: "Cinematic Narratives", color: "#FF3E00" },
  { name: "Ads", desc: "Impactful Growth", color: "#00E5FF" },
  { name: "Photography", desc: "Visual Essence", color: "#FFFFFF" },
  { name: "Branding", desc: "Identity Design", color: "#70FF00" }
];

export default function LyfAdsNexusRibbon() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 40, damping: 25 });

  // Perspective and background movement
  const bgSkew = useTransform(smoothProgress, [0, 1], [0, 20]);
  const tunnelZ = useTransform(smoothProgress, [0, 1], [0, -1000]);

  return (
    <div ref={containerRef} style={{ height: "500vh", background: "#000", color: "#fff", overflow: "hidden" }}>
      <motion.div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          perspective: "1200px",
        }}
      >
        {/* Background Grid - creates depth movement */}
        <motion.div 
          style={{
            position: "absolute",
            width: "200%",
            height: "200%",
            backgroundImage: `linear-gradient(to right, #111 1px, transparent 1px), linear-gradient(to bottom, #111 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
            rotateX: 60,
            y: useTransform(smoothProgress, [0, 1], [0, -200]),
            skew: bgSkew,
            opacity: 0.5,
            zIndex: 0
          }}
        />

        {/* The Moving Ribbon of Content */}
        <motion.div style={{ transformStyle: "preserve-3d", z: tunnelZ, width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
          {items.map((item, i) => {
            // Each item appears at a different scroll point
            const start = i * 0.2;
            const end = start + 0.3;
            
            const opacity = useTransform(smoothProgress, [start, start + 0.1, end - 0.1, end], [0, 1, 1, 0]);
            const scale = useTransform(smoothProgress, [start, end], [0.8, 1.5]);
            const xOffset = useTransform(smoothProgress, [start, end], [i % 2 === 0 ? -100 : 100, 0]);
            const rotation = useTransform(smoothProgress, [start, end], [i % 2 === 0 ? -15 : 15, 0]);

            return (
              <motion.div
                key={i}
                style={{
                  position: "absolute",
                  opacity,
                  scale,
                  x: xOffset,
                  rotateY: rotation,
                  transformStyle: "preserve-3d",
                  textAlign: "center"
                }}
              >
                {/* Floating Label */}
                <div style={{ fontSize: "12px", letterSpacing: "8px", color: item.color, marginBottom: "20px", fontWeight: "300" }}>
                   {item.desc}
                </div>
                
                {/* Massive Kinetic Text */}
                <h2 style={{ 
                  fontSize: "clamp(5rem, 15vw, 12rem)", 
                  fontWeight: 900, 
                  margin: 0, 
                  lineHeight: 0.8,
                  textTransform: "uppercase",
                  WebkitTextStroke: i % 2 === 0 ? "none" : "1px white",
                  color: i % 2 === 0 ? "white" : "transparent"
                }}>
                  {item.name}
                </h2>

                {/* Vertical Line Deco */}
                <motion.div 
                   style={{ 
                     height: "150px", 
                     width: "1px", 
                     background: `linear-gradient(to bottom, ${item.color}, transparent)`, 
                     margin: "20px auto" 
                   }} 
                />
              </motion.div>
            );
          })}
        </motion.div>

        {/* Static Center Piece: The "Eye" */}
        <motion.div
          style={{
            position: "absolute",
            zIndex: 10,
            width: "100px",
            height: "1px",
            background: "#fff",
            boxShadow: "0 0 50px #fff",
            opacity: useTransform(smoothProgress, [0, 0.1, 0.9, 1], [1, 0.2, 0.2, 1])
          }}
        />

        {/* LYF ADS Watermark */}
        <div style={{ position: "absolute", bottom: "40px", left: "40px", mixBlendMode: "difference" }}>
          <p style={{ fontWeight: 900, fontSize: "20px", letterSpacing: "-1px" }}>LYF ADS <span style={{ fontWeight: 100, fontSize: "12px", letterSpacing: "2px", marginLeft: "10px" }}>©2026</span></p>
        </div>
      </motion.div>
    </div>
  );
}
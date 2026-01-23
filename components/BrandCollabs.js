"use client";
import React, { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring
} from "framer-motion";

const planets = [
  { name: "Films", size: 60, radius: 180, speed: 1 },
  { name: "Ads", size: 45, radius: 260, speed: 1.4 },
  { name: "Photography", size: 35, radius: 340, speed: 1.8 },
  { name: "Branding", size: 50, radius: 420, speed: 1.2 }
];

export default function LyfAdsCosmicSignature() {
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"]
  });

  // Global cinematic motion
  const rotateUniverse = useTransform(scrollYProgress, [0, 1], [0, 360]);
  const zoomUniverse = useSpring(
    useTransform(scrollYProgress, [0, 1], [1, 1.25]),
    { stiffness: 40, damping: 20 }
  );

  return (
    <div
      ref={ref}
      style={{
        height: "300vh",
        background: "black",
        color: "white"
      }}
    >
      <motion.div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          perspective: 1200,
          scale: zoomUniverse
        }}
      >
        {/* Universe */}
        <motion.div
          style={{
            position: "relative",
            width: 800,
            height: 800,
            transformStyle: "preserve-3d",
            rotateZ: rotateUniverse
          }}
        >
          {/* Sun / Core */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: 140,
              height: 140,
              borderRadius: "50%",
              background:
                "radial-gradient(circle at 30% 30%, #ff4444, #700000)",
              transform: "translate(-50%, -50%)",
              boxShadow: "0 0 80px rgba(255,0,0,0.8)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
              letterSpacing: 2
            }}
          >
            LYF ADS
          </motion.div>

          {/* Planets */}
          {planets.map((planet, i) => {
            const angle = useTransform(
              scrollYProgress,
              [0, 1],
              [0, 360 * planet.speed]
            );

            return (
              <motion.div
                key={i}
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  width: planet.radius * 2,
                  height: planet.radius * 2,
                  marginLeft: -planet.radius,
                  marginTop: -planet.radius,
                  borderRadius: "50%",
                  border: "1px dashed rgba(255,255,255,0.15)",
                  rotateZ: angle
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: "50%",
                    right: -planet.size / 2,
                    width: planet.size,
                    height: planet.size,
                    borderRadius: "50%",
                    background: "white",
                    color: "black",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 10,
                    fontWeight: 600,
                    boxShadow: "0 0 20px rgba(255,255,255,0.6)"
                  }}
                >
                    {planet.name}
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Caption */}
        <motion.div
          style={{
            position: "absolute",
            bottom: 60,
            textAlign: "center",
            opacity: useTransform(scrollYProgress, [0, 0.3], [1, 0])
          }}
        >
          <div style={{ fontSize: 14, letterSpacing: 3 }}>
            EVERYTHING REVOLVES AROUND STORIES
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

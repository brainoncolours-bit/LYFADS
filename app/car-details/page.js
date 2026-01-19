"use client";
import React from "react";
import { motion } from "framer-motion";
import Layout from "@/components/Layout";

export default function Services3D() {
  const services = [
    { title: "3D Films", desc: "Cinematic visuals with real depth & emotion." },
    { title: "Brand Stories", desc: "Narratives engineered for obsession." },
    { title: "VFX & CGI", desc: "Reality-bending visuals that feel impossible." },
    { title: "Product Launches", desc: "Launch moments that feel historic." },
    { title: "Motion Design", desc: "Movement with intention and soul." },
    { title: "Immersive Web", desc: "Web experiences that feel alive." },
  ];

  return (
    <Layout>
      <section
        style={{ perspective: "2000px" }}
        className="relative bg-black text-white overflow-hidden"
      >
      {/* BACKGROUND */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0f0f0f] via-black to-[#050505]" />

      {/* GLOW */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-red-600/20 blur-[200px]" />
      </div>

      {/* CONTENT */}
      <div className="relative z-20 max-w-7xl mx-auto px-8 pt-32 pb-32">

        {/* Animated Heading */}
        <motion.div
          initial={{ opacity: 0, x: -80 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          className="mb-24"
        >
          <div className="service-heading">
            <span className="service-static">We build</span>
            <div className="service-words">
              <span className="service-word">3D films</span>
              <span className="service-word">brand stories</span>
              <span className="service-word">VFX & CGI</span>
              <span className="service-word">immersive web</span>
              <span className="service-word">3D films</span>
            </div>
          </div>
        </motion.div>

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 lg:gap-12">
          {services.map((s, i) => (
            <ServiceCard key={i} index={i} {...s} />
          ))}
        </div>
      </div>

      {/* INLINE STYLES */}
      <style>{`
        .service-heading {
          --bg-color: #000;
          display: flex;
          align-items: center;
          font-family: "Poppins", sans-serif;
          font-size: clamp(1.5rem, 2.5vw, 2.25rem);
          font-weight: 500;
          color: rgba(255, 255, 255, 0.6);
        }

        .service-static {
          white-space: nowrap;
        }

        .service-words {
          position: relative;
          height: 2.6rem;
          overflow: hidden;
          margin-left: 0.75rem;
        }

        .service-words::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(
            var(--bg-color) 15%,
            transparent 35%,
            transparent 65%,
            var(--bg-color) 85%
          );
          pointer-events: none;
        }

        .service-word {
          display: block;
          height: 2.6rem;
          color: #956afa;
          animation: service-spin 4s infinite;
        }

        @keyframes service-spin {
          10% { transform: translateY(-100%); }
          25% { transform: translateY(-100%); }

          35% { transform: translateY(-200%); }
          50% { transform: translateY(-200%); }

          60% { transform: translateY(-300%); }
          75% { transform: translateY(-300%); }

          85% { transform: translateY(-400%); }
          100% { transform: translateY(-400%); }
        }
      `}</style>
      </section>
    </Layout>
  );
}

/* ---------------------------------- */
/* 3D SERVICE CARD                     */
/* ---------------------------------- */

function ServiceCard({ title, desc, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 80, rotateX: 20 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.9,
        delay: index * 0.08,
        ease: "easeOut",
      }}
      whileHover={{
        rotateY: -10,
        rotateX: 10,
        scale: 1.04,
      }}
      style={{ transformStyle: "preserve-3d" }}
      className="relative rounded-3xl p-8 h-[300px] bg-white/5 backdrop-blur-xl border border-white/10"
    >
      <div
        style={{ transform: "translateZ(35px)" }}
        className="absolute inset-0 rounded-3xl border border-white/20"
      />

      <h3
        style={{ transform: "translateZ(55px)" }}
        className="text-2xl font-semibold mb-4"
      >
        {title}
      </h3>

      <p
        style={{ transform: "translateZ(45px)" }}
        className="text-white/70 leading-relaxed"
      >
        {desc}
      </p>
    </motion.div>
  );
}

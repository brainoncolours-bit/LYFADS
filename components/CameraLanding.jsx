'use client';

import React from 'react';
import Link from 'next/link';
import { 
  ArrowUpRight, 
  Sparkles, 
  Camera, 
  Layers, 
  Target,
  Users,
  Award,
  Flame,
  CheckCircle2
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function AboutPage() {
  return (
    <div className="w-full bg-[#ffffff] text-neutral-900 font-sans min-h-screen selection:bg-red-600 selection:text-white">
      <Navbar />

      <main className="w-full pt-0 pb-24 px-0 space-y-16">
        
        {/* 1. HERO CONE SHOWCASE (FLUSH TO TOP / ZERO TOP PADDING) */}
        {/* 1. HERO CONE SHOWCASE (FLAT SEAMLESS WHITE BACKGROUND) */}
        <section className="relative w-full bg-white pt-32 sm:pt-36 pb-16 px-6 sm:px-12 text-center overflow-hidden flex flex-col items-center justify-between">
          
          {/* Subtle Vertical Background Lines */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px)] bg-[size:5rem] opacity-60 pointer-events-none" />

          {/* Projector Cone Light Beam */}
          <div 
            className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-[600px] bg-gradient-to-b from-[#f8f9fa] via-[#edf0f5]/60 to-transparent pointer-events-none"
            style={{
              clipPath: 'polygon(30% 0%, 70% 0%, 95% 100%, 5% 100%)'
            }}
          />

          {/* Header Copy */}
          <div className="relative z-10 space-y-5 max-w-4xl mx-auto">
           
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black uppercase italic tracking-tighter text-neutral-950 leading-[0.95]">
              BORN FROM <br /> PASSION
            </h1>

            <p className="text-sm sm:text-base lg:text-lg text-neutral-600 font-normal max-w-3xl mx-auto pt-1 leading-relaxed">
              Founded in 2018, LYF ADS emerged from a simple belief: that every brand has a story worth telling. What started as a two-person operation in a garage has evolved into a full-scale production powerhouse, serving clients across the globe.
            </p>

            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-3 sm:gap-6 max-w-xl mx-auto pt-2">
              <div className="bg-[#f8f9fa] border border-neutral-200/80 rounded-2xl p-4 sm:p-5 text-center shadow-xs">
                <div className="text-2xl sm:text-4xl font-black italic tracking-tight text-neutral-950 font-mono">
                  8+
                </div>
                <div className="text-[9px] sm:text-[11px] font-mono uppercase tracking-widest text-neutral-500 font-bold mt-1">
                  YEARS
                </div>
              </div>

              <div className="bg-[#f8f9fa] border border-neutral-200/80 rounded-2xl p-4 sm:p-5 text-center shadow-xs">
                <div className="text-2xl sm:text-4xl font-black italic tracking-tight text-neutral-950 font-mono">
                  500+
                </div>
                <div className="text-[9px] sm:text-[11px] font-mono uppercase tracking-widest text-neutral-500 font-bold mt-1">
                  PROJECTS
                </div>
              </div>

              <div className="bg-[#f8f9fa] border border-neutral-200/80 rounded-2xl p-4 sm:p-5 text-center shadow-xs">
                <div className="text-2xl sm:text-4xl font-black italic tracking-tight text-neutral-950 font-mono">
                  100+
                </div>
                <div className="text-[9px] sm:text-[11px] font-mono uppercase tracking-widest text-neutral-500 font-bold mt-1">
                  CLIENTS
                </div>
              </div>
            </div>

          </div>

          {/* 3D Visor Stage with Video */}
          

        </section>

        

        {/* 3. CREATIVE MAVERICKS (OUR TEAM) */}
        
        {/* 3. CREATIVE MAVERICKS (OUR TEAM WITH EMBEDDED VIDEO - CENTERED CONTAINER) */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <section className="w-full bg-white rounded-[36px] p-8 sm:p-12 lg:p-14 border border-neutral-200/80 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2">
                <Users size={14} className="text-red-600" />
                <span className="text-xs font-mono font-bold tracking-[0.3em] uppercase text-red-600">
                  OUR TEAM
                </span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black italic uppercase tracking-tight text-neutral-950 leading-[0.95]">
                CREATIVE <br /> MAVERICKS
              </h2>

              <div className="space-y-4 text-sm sm:text-base text-neutral-600 font-normal leading-relaxed">
                <p>
                  Our crew is a collective of directors, cinematographers, editors, and storytellers who live and breathe visual content. From concept to final cut, we bring decades of combined experience across commercials, music videos, documentaries, and branded content.
                </p>
                <p className="text-neutral-500">
                  We don&apos;t just create content—we craft experiences that resonate, inspire, and drive results.
                </p>
              </div>
            </div>

            {/* Right Video Card */}
            <div className="lg:col-span-5 h-[280px] sm:h-[340px] rounded-3xl overflow-hidden bg-neutral-950 border-4 border-[#f8f9fa] shadow-md relative group">
              <video
                src="/assets/lap/web....mp4"
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
              
              
            </div>

          </section>
        </div>

        {/* 4. APPROACH, GEAR & VISION MATRIX */}
        {/* 4. APPROACH, GEAR & VISION (MODERN EDITORIAL BENTO CARDS) */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <section className="w-full grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Card 01: Approach */}
            <div className="group relative rounded-[32px] bg-white p-8 sm:p-9 border border-neutral-200/80 shadow-[0_10px_30px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] transition-all duration-500 hover:-translate-y-1 flex flex-col justify-between overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/5 rounded-bl-[100px] pointer-events-none transition-transform group-hover:scale-110 duration-500" />

              <div className="space-y-6 relative z-10">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-[#f8f9fa] border border-neutral-200/80 flex items-center justify-center text-neutral-900 group-hover:bg-neutral-950 group-hover:text-white transition-colors duration-300">
                    <Layers size={20} />
                  </div>
                  <span className="text-2xl font-black italic font-mono text-neutral-200 group-hover:text-red-600/30 transition-colors duration-300">
                    01
                  </span>
                </div>
                
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-red-600 font-bold block mb-1.5">
                    METHODICAL MADNESS
                  </span>
                  <h3 className="text-2xl font-black italic uppercase tracking-tight text-neutral-950">
                    Our Approach
                  </h3>
                </div>

                <p className="text-sm text-neutral-600 leading-relaxed font-normal">
                  Every project begins with deep collaboration. We immerse ourselves in your brand, understand your audience, and craft narratives that cut through the noise.
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-neutral-100 relative z-10">
                <div className="grid grid-cols-2 gap-2 text-[10px] font-mono font-bold text-neutral-700 uppercase tracking-wider">
                  <span className="px-3 py-2 rounded-xl bg-[#f8f9fa] border border-neutral-200/60 text-center">01. Concept</span>
                  <span className="px-3 py-2 rounded-xl bg-[#f8f9fa] border border-neutral-200/60 text-center">02. Shoot</span>
                  <span className="px-3 py-2 rounded-xl bg-[#f8f9fa] border border-neutral-200/60 text-center">03. VFX</span>
                  <span className="px-3 py-2 rounded-xl bg-[#f8f9fa] border border-neutral-200/60 text-center">04. Deliver</span>
                </div>
              </div>
            </div>

            {/* Card 02: Gear */}
            <div className="group relative rounded-[32px] bg-white p-8 sm:p-9 border border-neutral-200/80 shadow-[0_10px_30px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] transition-all duration-500 hover:-translate-y-1 flex flex-col justify-between overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/5 rounded-bl-[100px] pointer-events-none transition-transform group-hover:scale-110 duration-500" />

              <div className="space-y-6 relative z-10">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-[#f8f9fa] border border-neutral-200/80 flex items-center justify-center text-neutral-900 group-hover:bg-neutral-950 group-hover:text-white transition-colors duration-300">
                    <Camera size={20} />
                  </div>
                  <span className="text-2xl font-black italic font-mono text-neutral-200 group-hover:text-red-600/30 transition-colors duration-300">
                    02
                  </span>
                </div>

                <div>
                  <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-red-600 font-bold block mb-1.5">
                    CINEMA-GRADE GEAR
                  </span>
                  <h3 className="text-2xl font-black italic uppercase tracking-tight text-neutral-950">
                    Our Arsenal
                  </h3>
                </div>

                <p className="text-sm text-neutral-600 leading-relaxed font-normal">
                  We shoot on the industry&apos;s best: ARRI Alexa, RED Komodo, and Sony Venice with Zeiss &amp; Cooke cinema primes. Finishing is executed on calibrated monitors in DaVinci Resolve Studio.
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-neutral-100 relative z-10">
                <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-[#f8f9fa] border border-neutral-200/60 text-xs font-mono font-bold text-neutral-800">
                  <CheckCircle2 size={15} className="text-red-600 shrink-0" />
                  <span>Color &amp; Audio Mastery</span>
                </div>
              </div>
            </div>

            {/* Card 03: Vision */}
            <div className="group relative rounded-[32px] bg-white p-8 sm:p-9 border border-neutral-200/80 shadow-[0_10px_30px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] transition-all duration-500 hover:-translate-y-1 flex flex-col justify-between overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/5 rounded-bl-[100px] pointer-events-none transition-transform group-hover:scale-110 duration-500" />

              <div className="space-y-6 relative z-10">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-[#f8f9fa] border border-neutral-200/80 flex items-center justify-center text-neutral-900 group-hover:bg-neutral-950 group-hover:text-white transition-colors duration-300">
                    <Target size={20} />
                  </div>
                  <span className="text-2xl font-black italic font-mono text-neutral-200 group-hover:text-red-600/30 transition-colors duration-300">
                    03
                  </span>
                </div>

                <div>
                  <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-red-600 font-bold block mb-1.5">
                    REDEFINING STANDARDS
                  </span>
                  <h3 className="text-2xl font-black italic uppercase tracking-tight text-neutral-950">
                    Our Vision
                  </h3>
                </div>

                <p className="text-sm text-neutral-600 leading-relaxed font-normal">
                  In an industry saturated with mediocrity, we strive to set new benchmarks for quality, creativity, and storytelling for brands that refuse to settle for ordinary.
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-neutral-100 relative z-10">
                <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-[#f8f9fa] border border-neutral-200/60 text-xs font-mono font-bold text-neutral-800">
                  <CheckCircle2 size={15} className="text-red-600 shrink-0" />
                  <span>Quality &amp; Precision</span>
                </div>
              </div>
            </div>

          </section>
        </div>


      </main>

     
    </div>
  );
}
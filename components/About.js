'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Compass, Layers, Camera, ArrowUpRight, Sparkles } from 'lucide-react';
import CountUp from './CountUp';
import { Timeline } from './Timeline';
import { poppins } from '@/lib/font';

export default function About() {
  return (
    <div className="bg-[#f7f8f6] text-neutral-900 font-sans min-h-screen selection:bg-red-600 selection:text-white">
      
      <main className="max-w-[1400px] mx-auto pt-32 pb-20 px-4 sm:px-8 lg:px-12 space-y-16">
        
        {/* 1. TOP CINEMATIC HERO CARD */}
        <div className="relative w-full h-[380px] sm:h-[460px] lg:h-[520px] rounded-[36px] overflow-hidden bg-neutral-950 shadow-xl flex items-center justify-center">
          <Image
            src="/bg.png"
            alt="About Background"
            fill
            className="object-cover object-center opacity-40 mix-blend-luminosity"
            quality={90}
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/60" />

          <div className="absolute top-6 left-8 right-8 flex items-center justify-between z-10">
            <span className="font-mono text-xs font-black uppercase tracking-[0.25em] text-white/90">
              LYF<span className="text-red-600">ADS</span>
            </span>

            <div className="px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[10px] font-mono tracking-widest uppercase text-white">
              EST. <CountUp from={1971} to={2020} duration={2} separator="" />
            </div>
          </div>

          <div className="relative z-10 text-center px-4">
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-medium tracking-tight text-white font-serif">
              About Us
            </h1>
          </div>
        </div>

        {/* 2. PHILOSOPHY / CRAFTING VISUAL STORIES */}
        <section className="pt-4 max-w-4xl space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-neutral-200/80 text-[11px] font-mono tracking-wider uppercase text-neutral-700 font-semibold">
            <Sparkles size={12} className="text-red-600" />
            <span>Principles</span>
          </div>

          <h2 className={`${poppins.className} text-2xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-neutral-950 leading-[1.2]`}>
            <span className="font-semibold text-neutral-950">Crafting Visual Stories</span> With Passion &amp; Precision. <br />
            <span className="text-neutral-500 font-normal">
              Producing high-impact films and brand narratives since{" "}
              <span className="text-red-600 font-semibold">
                <CountUp from={1971} to={2020} duration={2} separator="" />
              </span>.
            </span>
          </h2>
        </section>

        {/* 3. OUR TEAM / CREATIVE MAVERICKS CARD */}
        <section className="relative w-full rounded-[36px] bg-[#0c0c0c] text-white p-8 sm:p-14 lg:p-16 border border-neutral-800 shadow-2xl overflow-hidden">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-red-600/10 blur-[120px] pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-6">
            <span className="text-xs font-mono font-bold tracking-[0.3em] uppercase text-red-600 block">
              OUR TEAM
            </span>

            <h2 className="text-4xl sm:text-6xl lg:text-7xl font-black italic uppercase tracking-tighter text-white leading-[0.95]">
              CREATIVE <br /> MAVERICKS
            </h2>

            <div className="space-y-4 pt-4 text-sm sm:text-base text-neutral-300 font-normal leading-relaxed">
              <p>
                Our crew is a collective of directors, cinematographers, editors, and storytellers who live and breathe visual content. From concept to final cut, we bring decades of combined experience across commercials, music videos, documentaries, and branded content.
              </p>
              <p className="text-neutral-400">
                We don&apos;t just create content—we craft experiences that resonate, inspire, and drive results.
              </p>
            </div>
          </div>
        </section>

        {/* 4. THREE-COLUMN PILLARS */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-[28px] p-8 border border-neutral-200/70 shadow-sm flex flex-col justify-between min-h-[300px] hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-neutral-950 text-white flex items-center justify-center">
              <Compass size={20} />
            </div>
            <div className="space-y-2 mt-8">
              <h3 className="text-xl font-bold tracking-tight text-neutral-950">Visual Storytelling</h3>
              <p className="text-xs sm:text-sm text-neutral-600 font-normal leading-relaxed">
                Dedicated to shaping compelling narratives with precision cinematography and powerful brand direction.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-[28px] p-8 border border-neutral-200/70 shadow-sm flex flex-col justify-between min-h-[300px] hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-neutral-950 text-white flex items-center justify-center">
              <Layers size={20} />
            </div>
            <div className="space-y-2 mt-8">
              <h3 className="text-xl font-bold tracking-tight text-neutral-950">Passion &amp; Precision</h3>
              <p className="text-xs sm:text-sm text-neutral-600 font-normal leading-relaxed">
                Every frame and cut is crafted with deep technical mastery to elevate your brand above the noise.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-[28px] p-8 border border-neutral-200/70 shadow-sm flex flex-col justify-between min-h-[300px] hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-neutral-950 text-white flex items-center justify-center">
              <Camera size={20} />
            </div>
            <div className="space-y-2 mt-8">
              <h3 className="text-xl font-bold tracking-tight text-neutral-950">End-to-End Production</h3>
              <p className="text-xs sm:text-sm text-neutral-600 font-normal leading-relaxed">
                From conceptual scripts and multi-camera shoots to post-production finishing and VFX delivery.
              </p>
            </div>
          </div>
        </section>

        {/* 5. CALL TO ACTION ROW */}
        <section className="flex flex-col sm:flex-row items-center justify-between bg-neutral-950 text-white rounded-[28px] p-8 sm:p-12 gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <h3 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Ready to craft your visual story?
            </h3>
            <p className="text-sm text-neutral-400 font-normal">
              Let&apos;s collaborate on your next brand film, commercial, or creative campaign.
            </p>
          </div>

          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-white text-neutral-950 font-mono text-xs font-bold uppercase tracking-wider hover:bg-red-600 hover:text-white transition-all shadow-md shrink-0"
          >
            <span>Start A Project</span>
            <ArrowUpRight size={14} />
          </Link>
        </section>

      </main>

      <Timeline />
    </div>
  );
}
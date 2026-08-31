'use client';

import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

const COLUMN_ONE = [
  {
    id: 1,
    title: 'Commercial Films',
    category: 'Commercial',
    src: '/assets/cat/comm.mp4',
  },
  {
    id: 4,
    title: 'Digital Campaigns',
    category: 'Digital Ads',
    src: '/assets/cat/digi.mp4',
  },
  {
    id: 18,
    title: 'Corporate Film',
    category: 'Brand Identity',
    src: '/assets/cat/copo.mp4',
  },
];

const COLUMN_TWO = [
  {
    id: 14,
    title: 'AI Visuals',
    category: 'AI Film',
    src: '/assets/cat/aivdo.mp4',
  },
  {
    id: 16,
    title: 'Social Media',
    category: 'Reels & Growth',
    src: '/assets/lap/growth.mp4',
  },
  {
    id: 1,
    title: 'Brand Stories',
    category: 'Commercial',
    src: '/assets/cat/copo.mp4',
  },
];

const WorkCard = ({ item }) => (
  <div
    className="relative w-full h-[340px] sm:h-[400px] rounded-3xl overflow-hidden shadow-[0_12px_36px_rgba(0,0,0,0.1)] border border-neutral-200/90 bg-neutral-900 flex-shrink-0 block pointer-events-none select-none"
  >
    <video
      src={item.src}
      autoPlay
      loop
      muted
      playsInline
      className="w-full h-full object-cover"
    />

    {/* Bottom Caption Pill */}
    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between px-4 py-3 rounded-2xl bg-neutral-950/80 backdrop-blur-md border border-white/10 text-white shadow-xl">
      <div className="flex flex-col min-w-0 pr-2">
        <span className="text-sm font-semibold tracking-wide truncate">
          {item.title}
        </span>
        <span className="text-[11px] text-neutral-400 uppercase tracking-wider truncate">
          {item.category}
        </span>
      </div>
    </div>
  </div>
);

const HeroSection = () => {
  return (
    <div className="relative w-full min-h-screen bg-[#fafafa] text-neutral-900 overflow-hidden flex items-center justify-center pt-24 pb-12 px-6 sm:px-12 lg:px-16 font-sans">
      
      {/* Background Dot Pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-45 z-0">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="dot-grid" width="44" height="44" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.5" fill="#d4d4d8" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dot-grid)" />
          <path
            d="M 500,120 L 700,240 L 920,200 L 1150,340"
            fill="none"
            stroke="#e4e4e7"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />
          <circle cx="700" cy="240" r="4" fill="#a1a1aa" />
          <circle cx="920" cy="200" r="4" fill="#a1a1aa" />
          <circle cx="1150" cy="340" r="4" fill="#a1a1aa" />
        </svg>
      </div>

      <div className="relative z-10 w-full max-w-[1440px] grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
        
        {/* Left Headline & CTAs */}
        <div className="lg:col-span-6 flex flex-col justify-center">
          <div className="mb-6">
            <h1 className="text-7xl sm:text-8xl md:text-9xl font-black italic tracking-tighter text-neutral-950">
              LYF<span className="text-red-600">ADS</span>
            </h1>
          </div>

          <div className="space-y-5">
            <h1 className="text-4xl sm:text-6xl xl:text-7xl font-extrabold tracking-tight text-neutral-950 leading-[1.06]">
              Visual Design &amp; Direction
            </h1>

            <p className="text-base sm:text-lg text-neutral-600 font-normal leading-relaxed max-w-xl">
              Transform your vision into captivating visual stories. Our studio crafts premium ad films, commercials, and branded visual content that scales engagement.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-5 mt-8">
            <Link
              href="/works"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-neutral-950 text-white font-medium text-sm hover:bg-neutral-800 transition-all shadow-md hover:shadow-lg"
            >
              Explore All Works
              <ArrowUpRight size={16} />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-white border border-neutral-300 text-neutral-800 font-medium text-sm hover:bg-neutral-100 transition-all shadow-sm"
            >
              Contact Studio
            </Link>
          </div>
        </div>

        {/* Right Video Infinite Showcase (Non-clickable) */}
        <div className="lg:col-span-6 relative h-[650px] sm:h-[720px] overflow-hidden flex gap-5 sm:gap-6 pointer-events-none">
          
          <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-b from-[#fafafa] via-[#fafafa]/80 to-transparent z-20" />
          <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-[#fafafa] via-[#fafafa]/80 to-transparent z-20" />

          {/* Column 1: Scrolls Up */}
          <div className="flex-1 flex flex-col gap-6 animate-marquee-vertical">
            {[...COLUMN_ONE, ...COLUMN_ONE, ...COLUMN_ONE].map((item, idx) => (
              <WorkCard key={`col1-${item.id}-${idx}`} item={item} />
            ))}
          </div>

          {/* Column 2: Scrolls Down */}
          <div className="flex-1 flex flex-col gap-6 -translate-y-1/2 animate-marquee-vertical-reverse">
            {[...COLUMN_TWO, ...COLUMN_TWO, ...COLUMN_TWO].map((item, idx) => (
              <WorkCard key={`col2-${item.id}-${idx}`} item={item} />
            ))}
          </div>
        </div>

      </div>

      <style jsx global>{`
        @keyframes marqueeVertical {
          0% {
            transform: translateY(0%);
          }
          100% {
            transform: translateY(-50%);
          }
        }

        @keyframes marqueeVerticalReverse {
          0% {
            transform: translateY(-50%);
          }
          100% {
            transform: translateY(0%);
          }
        }

        .animate-marquee-vertical {
          animation: marqueeVertical 6s linear infinite;
        }

        .animate-marquee-vertical-reverse {
          animation: marqueeVerticalReverse 7s linear infinite;
        }
      `}</style>

    </div>
  );
};

export default HeroSection;
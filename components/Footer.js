"use client";

import React from "react";

export default function LyfAdsFooter() {
  return (
    <footer className="bg-[#fafafa] text-neutral-900 font-sans border-t border-neutral-200/80 p-6 sm:p-10 md:p-12 pb-28 md:pb-12 selection:bg-red-600 selection:text-white">
      <div className="max-w-7xl mx-auto w-full flex flex-col justify-between gap-8 sm:gap-12">
        
        {/* TOP SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-start">
          
          {/* BRAND / STATUS */}
          <div className="md:col-span-7 flex flex-col gap-4">
            <img src="/bg.png" width="150" alt="Lyf Ads Logo" className="brightness-100" />
          </div>

          {/* SERVICES LIST */}
          <div className="md:col-span-5 flex flex-col gap-2 md:items-end">
            <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest block mb-1">
              SERVICES
            </span>
            <ul className="flex flex-col gap-1 text-xs sm:text-sm font-bold uppercase tracking-wider text-neutral-800 md:text-right">
              <li className="hover:text-red-600 transition-colors cursor-pointer">
                POST-PRODUCTION
              </li>
              <li className="hover:text-red-600 transition-colors cursor-pointer">
                VFX & 3D
              </li>
              <li className="hover:text-red-600 transition-colors cursor-pointer">
                AD CAMPAIGNS
              </li>
            </ul>
          </div>
        </div>

        {/* MIDDLE SECTION: MARQUEE */}
        <div className="border-y border-neutral-200/80 py-4 sm:py-6 overflow-hidden select-none">
          <div className="whitespace-nowrap animate-marquee">
            <span className="text-xl sm:text-2xl md:text-4xl font-black italic tracking-tighter text-neutral-300 uppercase">
              CREATING REALITY • PRODUCING DREAMS • LYF ADS • CREATING REALITY • PRODUCING DREAMS • LYF ADS •
            </span>
          </div>
        </div>

        {/* BOTTOM SECTION */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-[10px] font-mono uppercase">
          
          {/* SOCIAL LINKS */}
          <div className="flex flex-wrap gap-6 font-bold text-neutral-600">
            <a 
              href="https://www.instagram.com/lyfads" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-red-600 transition-colors"
            >
              INSTAGRAM
            </a>
            <a 
              href="https://www.behance.net/lyfads" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-red-600 transition-colors"
            >
              BEHANCE
            </a>
            <a 
              href="https://www.youtube.com/@lyfads" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-red-600 transition-colors"
            >
              YOUTUBE
            </a>
          </div>

          {/* COPYRIGHT */}
          <div className="text-neutral-500">
            © 2026 LYF ADS PRODUCTION HOUSE
          </div>
        </div>

      </div>

      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: inline-block;
          animation: marquee 25s linear infinite;
        }
      `}</style>
    </footer>
  );
}
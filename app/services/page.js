"use client";

import React from "react";
import { ArrowUpRight, Sparkles } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const SERVICES = [
  {
    id: "01",
    title: "Commercial & Brand Video",
    tag: "YT_MOBILE",
    desc: "High-impact visual storytelling crafted to elevate brands. From concept to execution, we produce commercials, brand films, and high-volume digital content.",
    img: "/assets/services/img1.webp",
  },
  {
    id: "02",
    title: "Corporate Video Production",
    tag: "PR_BRAND",
    desc: "Professional films that communicate credibility and vision. We create corporate profiles, leadership interviews, culture films, and business content.",
    img: "/assets/services/img4.webp",
  },
  {
    id: "03",
    title: "Event Coverage",
    tag: "DEST_FILM",
    desc: "Cinematic multi-camera coverage that captures every key moment. From product launches to corporate events, we deliver impactful platform edits.",
    img: "/assets/services/img5.webp",
  },
  {
    id: "04",
    title: "3D Modeling & AI Production",
    tag: "EDITORIAL",
    desc: "Photoreal 3D visualization and next-generation AI-powered visuals. We produce futuristic, high-impact content.",
    img: "/assets/services/3dModeling.jpeg",
  },
  {
    id: "05",
    title: "Post-Production",
    tag: "3D_TECH",
    desc: "Precision editing, color grading, motion graphics, and finishing that transform raw footage into powerful final visuals.",
    img: "/assets/services/img2.webp",
  },
];

export default function ServicesPage() {
  return (
    <div className="bg-[#fafafa] text-neutral-900 font-sans min-h-screen selection:bg-red-600 selection:text-white">
      <Navbar />

      {/* HEADER SECTION */}
      <section className="pt-28 sm:pt-36 pb-10 sm:pb-16 px-4 sm:px-8 lg:px-16 max-w-[1440px] mx-auto text-center">
        <div>
          <h1 className="text-4xl sm:text-6xl lg:text-8xl font-black italic tracking-tighter text-neutral-950 uppercase leading-none">
            OUR <span className="text-red-600">CAPABILITIES.</span>
          </h1>

          <p className="text-sm sm:text-lg lg:text-xl text-neutral-600 font-normal mt-3 sm:mt-5 max-w-3xl mx-auto leading-relaxed">
            Cinematic production, visual post-production, and innovative digital solutions from websites to applications—crafted for visionary brands.
          </p>
        </div>
      </section>

      {/* STATIC CONTAINERS WITH SMOOTH HOVER EFFECTS */}
      <section className="pb-28 md:pb-32 px-4 sm:px-6 lg:px-12 max-w-[1440px] mx-auto space-y-6 sm:space-y-12">
        {SERVICES.map((item, idx) => {
          const isEven = idx % 2 === 1;

          return (
            <div
              key={item.id}
              className="bg-white border border-neutral-200/90 rounded-[24px] sm:rounded-[36px] p-4 sm:p-8 lg:p-12 shadow-sm hover:shadow-2xl transition-all duration-500 group w-full"
            >
              <div
                className={`grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-14 items-center ${
                  isEven ? "lg:grid-flow-dense" : ""
                }`}
              >
                {/* Visual Image Container */}
                <div
                  className={`lg:col-span-7 relative h-[220px] sm:h-[360px] lg:h-[480px] rounded-2xl sm:rounded-3xl overflow-hidden bg-neutral-950 shadow-md ${
                    isEven ? "lg:col-start-6" : ""
                  }`}
                >
                  <img
                    src={item.img}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>

                {/* Details / Text Container */}
                <div
                  className={`lg:col-span-5 flex flex-col justify-between space-y-6 sm:space-y-8 ${
                    isEven ? "lg:col-start-1" : ""
                  }`}
                >
                  <div className="space-y-3 sm:space-y-4">
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-black uppercase italic tracking-tight text-neutral-950 group-hover:text-red-600 transition-colors leading-[1.1]">
                      {item.title}
                    </h2>
                    <p className="text-xs sm:text-base lg:text-lg text-neutral-600 font-normal leading-relaxed">
                      {item.desc}
                    </p>
                  </div>

                  <div className="pt-4 sm:pt-6 border-t border-neutral-100 flex items-center justify-between">
                    <Link
                      href="/contact"
                      className="inline-flex items-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 rounded-full bg-neutral-950 text-white text-xs font-mono font-bold uppercase tracking-wider hover:bg-red-600 transition-all duration-300 shadow-md hover:shadow-xl hover:scale-105"
                    >
                      <span>Request Brief</span>
                      <ArrowUpRight size={15} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </section>

      <Footer />
    </div>
  );
}
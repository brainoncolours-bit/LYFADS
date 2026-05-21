"use client";
import { useScroll, useTransform, motion } from "framer-motion";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";


export const Timeline = () => {
  const ref = useRef(null);
  const containerRef = useRef(null);
  const [height, setHeight] = useState(0);

  const data = [
  {
    title: "2020 – The Beginning",
    content: (
      <div>
        <p className="text-new-white text-xs md:text-lg font-normal mb-8">
          Lyf Ads was founded with a vision to revolutionize visual storytelling.
          Starting as a small team in Bangalore, we focused on creating impactful
          digital content that resonates with audiences.
        </p>
        <div className="grid grid-cols-2 gap-4">
          <Image src="/bg.png" alt="First project" width={500} height={500}
            className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06)]" />
          <Image src="/bg.png" alt="Early studio" width={500} height={500}
            className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06)]" />
        </div>
      </div>
    ),
  },
  {
    title: "2022 – Building Our Portfolio",
    content: (
      <div>
        <p className="text-new-white text-xs md:text-lg font-normal mb-8">
          As our reputation grew, so did our client list. By delivering high-quality
          commercial content and brand films, Lyf Ads became a trusted name for
          brands looking to elevate their visual identity.
        </p>
        <div className="grid grid-cols-2 gap-4">
          <Image src="/bg.png" alt="Client work" width={500} height={500}
            className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full" />
          <Image src="/bg.png" alt="Production set" width={500} height={500}
            className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full" />
        </div>
      </div>
    ),
  },
  {
    title: "2023 – Expanded Services",
    content: (
      <div>
        <p className="text-new-white text-xs md:text-lg font-normal mb-8">
          We expanded our capabilities into motion design and high-end cinematography.
          Moving to a new, larger production space allowed us to handle more complex
          projects and deliver even greater value to our partners.
        </p>
        <div className="grid grid-cols-2 gap-4">
          <Image src="/bg.png" alt="New studio" width={500} height={500}
            className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full" />
          <Image src="/bg.png" alt="Team expansion" width={500} height={500}
            className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full" />
        </div>
      </div>
    ),
  },
  {
    title: "2024 – Major Growth",
    content: (
      <div>
        <p className="text-new-white text-xs md:text-lg font-normal mb-8">
          The growing demand for premium visual content led to a significant expansion
          of our team and equipment. Lyf Ads solidified its position as a leading
          agency for high-end digital production and motion systems.
        </p>
        <div className="grid grid-cols-2 gap-4">
          <Image src="/bg.png" alt="Production scale" width={500} height={500}
            className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full" />
          <Image src="/bg.png" alt="Works collection" width={500} height={500}
            className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full" />
        </div>
      </div>
    ),
  },
  {
    title: "2025 – Legacy Continues",
    content: (
      <div>
        <p className="text-new-white text-xs md:text-lg font-normal mb-8">
          In 2025, Lyf Ads unveiled its state-of-the-art production suite,
          a modern space symbolizing five years of dedication, creativity, and growth.
          Our journey continues, driven by the same passion for excellence we started with.
        </p>
        <div className="grid grid-cols-2 gap-4">
          <Image src="/bg.png" alt="Modern suite" width={500} height={500}
            className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full" />
          <Image src="/bg.png" alt="Future vision" width={500} height={500}
            className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full" />
        </div>
      </div>
    ),
  },
];

  useEffect(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setHeight(rect.height);
    }
  }, [ref]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 10%", "end 50%"],
  });

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  return (
    (<div
      className="w-full bg-gradient-to-b from-[#0e0f11] via-[#1a1b1f] to-[#0e0f11]  md:px-10 overflow-y-hidden z-[1500]"
      ref={containerRef}>
      {/* <div className="max-w-7xl mx-auto pt-20 px-4 md:px-8 lg:px-10">
        <h2 className="text-lg md:text-5xl  mb-4 text-brand-color  max-w-4xl">
          Our journey
        </h2>
        <p
          className="text-new-white  text-sm md:text-lg max-w-sm">
          We&apos;ve been working on since 1999. Here&apos;s
          a timeline of my journey.
        </p>
      </div> */}
      <div ref={ref} className="relative max-w-7xl mx-auto pb-20">
        {data.map((item, index) => (
          <div key={index} className="flex justify-start pt-10 md:pt-40 md:gap-10">
            <div
              className="sticky flex flex-col md:flex-row z-40 items-center top-40 self-start max-w-xs lg:max-w-sm md:w-full">
              <div
                className="h-10 absolute left-3 md:left-3 w-10 rounded-full bg-new-white  flex items-center justify-center">
                <div
                  className="h-4 w-4 rounded-full bg-neutral-200  border border-neutral-300  p-2" />
              </div>
              <h3
                className="hidden md:block text-xl md:pl-20 md:text-5xl font-bold text-brand-color ">
                {item.title}
              </h3>
            </div>

            <div className="relative pl-20 pr-4 md:pl-4 w-full md:w-3/4">
              <h3
                className="md:hidden block text-2xl mb-4 text-left font-bold text-brand-color ">
                {item.title}
              </h3>
              {item.content}{" "}
            </div>
          </div>
        ))}
        <div
          style={{
            height: height + "px",
          }}
          className="absolute md:left-8 left-8 top-0 overflow-hidden w-[2px] bg-[linear-gradient(to_bottom,var(--tw-gradient-stops))] from-transparent from-[0%] via-neutral-200  to-transparent to-[99%]  [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)] ">
          <motion.div
            style={{
              height: heightTransform,
              opacity: opacityTransform,
            }}
            className="absolute inset-x-0 top-0  w-[2px] bg-gradient-to-t from-purple-500 via-blue-500 to-transparent from-[0%] via-[10%] rounded-full" />
        </div>
      </div>
    </div>)
  );
};

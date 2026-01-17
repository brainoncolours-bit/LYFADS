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
    title: "2004 – Humble Beginnings",
    content: (
      <div>
        <p className="text-new-white text-xs md:text-lg font-normal mb-8">
          Founded by <span className="font-semibold">Shameer S</span> from
          Cherukulam, Calicut — the journey began with a simple dream and a single car.
          After gaining experience as a bus checking inspector in his father’s
          service and later at Jay Motors and TVS Limited, Shameer turned his
          passion for automobiles into a purpose.
        </p>
        <div className="grid grid-cols-2 gap-4">
          <Image src="/shameercars.avif" alt="First car" width={500} height={500}
            className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06)]" />
          <Image src="/aboutcarsimage.avif" alt="First showroom" width={500} height={500}
            className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06)]" />
        </div>
      </div>
    ),
  },
  {
    title: "2010 – Building Trust & Name",
    content: (
      <div>
        <p className="text-new-white text-xs md:text-lg font-normal mb-8">
          As the brand grew, so did its trust. Through consistent honesty,
          transparent deals, and personalized service, Shameer Cars became a
          household name among pre-owned car buyers in Calicut.
        </p>
        <div className="grid grid-cols-2 gap-4">
          <Image src="/jshameercars.avif" alt="Customer trust" width={500} height={500}
            className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full" />
          <Image src="/aboutcarsimage.avif" alt="Car yard" width={500} height={500}
            className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full" />
        </div>
      </div>
    ),
  },
  {
    title: "2023 – First Centralized Showroom",
    content: (
      <div>
        <p className="text-new-white text-xs md:text-lg font-normal mb-8">
          With nearly two decades of hard work and reputation, Shameer Cars
          inaugurated its <span className="font-semibold">first centralized showroom</span> in 2023 —
          marking a major milestone in the company’s growth journey.
        </p>
        <div className="grid grid-cols-2 gap-4">
          <Image src="/aboutcarsimage.avif" alt="2023 showroom" width={500} height={500}
            className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full" />
          <Image src="/aboutcarsimage.avif" alt="Team 2023" width={500} height={500}
            className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full" />
        </div>
      </div>
    ),
  },
  {
    title: "2024 – Third Yard Expansion",
    content: (
      <div>
        <p className="text-new-white text-xs md:text-lg font-normal mb-8">
          The growing demand led to the opening of a <span className="font-semibold">third yard</span> in 2024,
          increasing capacity and improving service efficiency. Every milestone
          reflected the same commitment to customer satisfaction and trust.
        </p>
        <div className="grid grid-cols-2 gap-4">
          <Image src="/aboutcarsimage.avif" alt="Third yard" width={500} height={500}
            className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full" />
          <Image src="/shameercars.avif" alt="Cars collection" width={500} height={500}
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
          In <span className="font-semibold">October 2025</span>, Shameer Cars proudly unveiled its
          <span className="font-semibold"> second centralized showroom</span> — a modern space symbolizing
          two decades of dedication, transparency, and growth. The journey
          continues, built on values that started with a single dream.
        </p>
        <div className="grid grid-cols-2 gap-4">
          <Image src="/aboutcarsimage.avif" alt="2025 showroom" width={500} height={500}
            className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full" />
          <Image src="/aboutcarsimage.avif" alt="Legacy continues" width={500} height={500}
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

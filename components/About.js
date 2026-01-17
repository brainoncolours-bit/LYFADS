'use client';

import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';
import { useGSAP } from '@gsap/react';
import CountUp from './CountUp';
import { Timeline } from './Timeline';
import { poppins } from '@/lib/font';

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const containerRef = useRef(null);
  const imageRef = useRef(null);
  const textRef = useRef(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: '+=100%',
        scrub: 1.2,
        pin: true,
      },
    });

    tl.to(imageRef.current, {
      scale: 1.1,
      opacity: 0.35,
      ease: 'power2.out',
    }, 'start');

    tl.fromTo(
      textRef.current,
      { y: 80, opacity: 0 },
      { y: 0, opacity: 1, ease: 'power2.out' },
      'start+=0.2'
    );
  });

  return (
    <>
      {/* Scroll-pinned About section */}
      <div
        ref={containerRef}
        className="relative w-full h-screen bg-black overflow-hidden"
      >
        {/* Background Image */}
        <Image
          ref={imageRef}
          src="/shameercars.avif"
          alt="about image"
          fill
          className="object-cover object-center z-0"
          quality={90}
          priority
        />

        {/* Centered Animated Text */}
        <div className="absolute inset-0 flex items-center justify-center z-10 px-4 text-center">
          <h2
            ref={textRef}
            className={`${poppins.className} !leading-tight text-3xl md:text-6xl font-semibold mb-20 text-white`}
          >
            Crafting Car Dreams
            <br />
            With Passion & Precision. <br /> Since{" "}
            <CountUp from={2025} to={1971} duration={2} separator="" />
          </h2>
        </div>
      </div>

      {/* Timeline section after pinned image */}
      <Timeline />
    </>
  );
}

"use client";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import FancyButton from "./utilities/FancyButton";
import {
  PhoneCall,
  PhoneCallIcon,
  Repeat,
  ShellIcon,
  ShoppingCart,
} from "lucide-react";
import SellExchangeDialog from "./SellExchangeDialog";
import {
  inter,
  lato,
  nunito,
  openSans,
  poppins,
  roboto,
  russo,
} from "@/lib/font";

gsap.registerPlugin(ScrollTrigger);

export default function SellOrExchange() {
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const imageKeyLogo = useRef(null);
  const cardRef = useRef(null);
  const card2Ref = useRef(null);
  const exchangeSpan = useRef(null);
  const sellSpan = useRef(null);
  const buttonCtnRef = useRef(null);
  const overlayRef = useRef(null);

  const [open, setOpen] = useState(false);

  const handleClick = (type)=> {
    setOpen(type);
  };

  useGSAP(() => {
  const centerY = window.innerHeight / 2 - 300;
  const bottomY = window.innerHeight - 400;

  // Reset initial states
  gsap.set([cardRef.current, card2Ref.current, buttonCtnRef.current], {
    opacity: 0,
    left: '100%',
  });
  gsap.set(imageKeyLogo.current, { rotate: 90, y: 0 });
  gsap.set([sellSpan.current, exchangeSpan.current], { width: '0%' });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: containerRef.current,
      start: 'top top',
      scrub: window.innerWidth < 768 ? 1 : 1.2,
      pin: true,
    },
  });

  tl.to(containerRef.current, { height: '180vh', duration: 1 }, 'start');

  // Key animation block
  tl.to(imageKeyLogo.current, {
    rotate: 0,
    y: centerY,
    duration: 1.2,
    ease: 'power3.out',
  }, 'start+=0.2');

  tl.to(textRef.current, {
    y: -300,
    duration: 1.2,
    ease: 'power2.out',
  }, 'start+=0.2');

  // SELL Card
  tl.to(cardRef.current, {
    opacity: 1,
    left: '50%',
    ease: 'power2.out',
    duration: 1.2,
  }, '+=0.3');
  tl.to(sellSpan.current, {
    width: '100%',
    duration: 1,
    ease: 'power2.out',
  }, '<');

  tl.to(cardRef.current, {
    opacity: 0,
    left: '-50%',
    duration: 0.8,
    ease: 'power2.in',
  }, '+=1.5');

  // EXCHANGE Card
  tl.to(card2Ref.current, {
    opacity: 1,
    left: '50%',
    ease: 'power2.out',
    duration: 1.2,
  }, '+=0.3');
  tl.to(exchangeSpan.current, {
    width: '100%',
    duration: 1,
    ease: 'power2.out',
  }, '<');

  tl.to(card2Ref.current, {
    opacity: 0,
    left: '-50%',
    duration: 0.8,
    ease: 'power2.in',
  }, '+=1.5');

  // Drop down key logo
  tl.to(imageKeyLogo.current, {
    rotate: 90,
    y: bottomY,
    duration: 1.2,
    ease: 'power2.out',
  }, '+=0.2');

  // Show Buttons
  tl.to(buttonCtnRef.current, {
    opacity: 1,
    left: '50%',
    duration: 1.2,
    ease: 'power2.out',
  }, '+=0.2');

  // Fade out key logo
  tl.to(imageKeyLogo.current, {
    opacity: 0,
    duration: 1,
  }, '+=0.2');

  // Expand overlay
  tl.to(overlayRef.current, {
    height: '100%',
    duration: 2,
    ease: 'power2.inOut',
  }, '-=1');

  // Final reset states for future scrolls
  tl.to(imageKeyLogo.current, {
    position: 'absolute',
  }, '+=0.5');

  tl.to(textRef.current, {
    opacity: 0.2,
    duration: 0.6,
  }, '+=0.2');

  tl.to(textRef.current, {
    position: 'absolute',
  }, '+=0.2');
});

  return (
    <>
      <div
        id="sellExchange"
        ref={containerRef}
        className="relative z-[1000] w-full h-[120vh] bg-white overflow-hidden max-w-[450px] mx-auto"
      >
        <div
          ref={overlayRef}
          className="absolute inset-0 bg-black h-0 z-20 w-full"
        />
        <h1
          ref={textRef}
          className={`absolute w-fit text-gray-500 z-50 px-2 text-start top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 text-[4rem] mx-auto ${russo.className}`}
        >
          <span className="relative overflow-hidden">
            SELL
            <span
              ref={sellSpan}
              className="absolute left-0 text-brand-color w-0 overflow-x-hidden"
            >
              SELL{" "}
            </span>
          </span>
          <br />
          <span className="relative overflow-hidden">
            EXCHANGE
            <span
              ref={exchangeSpan}
              className="absolute left-0 text-brand-color w-0 overflow-x-hidden"
            >
              EXCHANGE
            </span>
          </span>
        </h1>

        <Image
          ref={imageKeyLogo}
          src="/keylogo.png"
          alt="plant"
          width={1200}
          height={500}
          className="w-[120px] rotate-90 absolute object-fit h-auto z-10 top-[200px] left-1/2 -translate-x-1/2"
        />

        <div
          ref={cardRef}
          className="opacity-0 fixed bottom-[250px] md:bottom-48 left-full -translate-x-1/2 w-[90%] md:w-full bg-gradient-to-br from-[#1c1c1c] to-[#111] rounded-2xl shadow-xl p-6 z-40 border border-neutral-800"
        >
          <h2
            className={`text-2xl md:text-3xl text-white font-bold mb-3 ${poppins.className}`}
          >
            Quick Sale. True Value.
          </h2>
          <p className="text-sm md:text-base text-neutral-400 leading-relaxed">
            Sell your car without the wait or worry. We make sure you get the
            price your vehicle truly deserves — fast, fair, and hassle-free.
          </p>
        </div>
        <div
          ref={card2Ref}
          className="opacity-0 fixed bottom-[250px] md:bottom-48 left-full -translate-x-1/2 w-[95%] md:w-full bg-gradient-to-br from-[#1c1c1c] to-[#111] rounded-2xl shadow-xl p-6 z-40 border border-neutral-800"
        >
          <h2
            className={`text-2xl md:text-3xl text-white font-bold mb-3 ${poppins.className}`}
          >
            Exchange. Upgrade. Repeat.
          </h2>
          <p className="text-sm md:text-base text-neutral-400 leading-relaxed">
            We make upgrading easy and rewarding. Swap your current car for one
            you&apos;ll love, with a process so smooth.
          </p>
        </div>

        <div
          ref={buttonCtnRef}
          className="absolute opacity-0 bottom-48 left-full -translate-x-1/2 w-[95%]  grid grid-cols-2 gap-4 p-4 bg-gradient-to-br from-[#1c1c1c] to-[#111] rounded-2xl shadow-xl z-50"
        >
          {/* SELL */}
          <button
            onClick={() => handleClick("Sell")}
            className="flex flex-col items-start justify-between p-4 bg-[#222] hover:bg-[#2a2a2a] rounded-xl border border-neutral-800 transition-all duration-300 group"
          >
            <ShoppingCart className="w-6 h-6 text-brand-color mb-2" />
            <span className="text-lg font-semibold text-white">Sell</span>
            <span className="text-sm text-neutral-400 group-hover:text-neutral-300">
              Post your car
            </span>
          </button>

          {/* EXCHANGE */}
          <button
            onClick={() => handleClick("Exchange")}
            className="flex flex-col items-start justify-between p-4 bg-[#222] hover:bg-[#2a2a2a] rounded-xl border border-neutral-800 transition-all duration-300 group"
          >
            <Repeat className="w-6 h-6 text-brand-color mb-2" />
            <span className="text-lg font-semibold text-white">Exchange</span>
            <span className="text-sm text-neutral-400 group-hover:text-neutral-300">
              Swap your car
            </span>
          </button>

          {/* CONTACT US (Full width) */}
          <button
            onClick={() => handleClick("contact")}
            className="col-span-2 flex items-center gap-3 p-4 bg-[#2c2c2c] hover:bg-[#3a3a3a] rounded-xl border border-neutral-800 transition-all duration-300"
          >
            <PhoneCall className="w-6 h-6 text-brand-color" />
            <div className="flex flex-col items-start">
              <span className="text-lg font-semibold text-white">
                Contact Us
              </span>
              <span className="text-sm text-neutral-400">
                Let’s connect and assist you
              </span>
            </div>
          </button>
        </div>
      </div>

      <SellExchangeDialog open={open} setOpen={setOpen} />
    </>
  );
}

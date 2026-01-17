"use client";
import { IconQuote } from "@tabler/icons-react";
import { Instagram } from "lucide-react";
import Image from "next/image";
import { useState, useEffect, useRef, useId } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabaseClient";


const Slide = ({ slide, index, current, handleSlideClick }) => {
  const slideRef = useRef(null);
  const xRef = useRef(0);
  const yRef = useRef(0);
  const frameRef = useRef();

  useEffect(() => {
    const animate = () => {
      if (!slideRef.current) return;
      const x = xRef.current;
      const y = yRef.current;
      slideRef.current.style.setProperty("--x", `${x}px`);
      slideRef.current.style.setProperty("--y", `${y}px`);
      frameRef.current = requestAnimationFrame(animate);
    };
    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, []);

  const handleMouseMove = (event) => {
    const r = slideRef.current?.getBoundingClientRect();
    if (!r) return;
    xRef.current = event.clientX - (r.left + r.width / 2);
    yRef.current = event.clientY - (r.top + r.height / 2);
  };

  const { image_url: src, name, profession: role, message: quote, iglink } = slide;

  return (
    <div className="[perspective:1200px] [transform-style:preserve-3d]">
      <li
        ref={slideRef}
        className="flex flex-1 flex-col items-center justify-center relative text-center text-white w-[70vmin] h-[70vmin] mx-[4vmin]"
        onClick={() => handleSlideClick(index)}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => {
          xRef.current = 0;
          yRef.current = 0;
        }}
        style={{
          transform:
            current !== index ? "scale(0.95) rotateX(8deg)" : "scale(1)",
          transformOrigin: "bottom",
        }}
      >
        <div
          className="absolute top-0 left-0 w-full h-full bg-[#1D1F2F] rounded-[1%] overflow-hidden"
          style={{
            transform:
              current === index
                ? "translate3d(calc(var(--x) / 30), calc(var(--y) / 30), 0)"
                : "none",
          }}
        >
          <Image
            className="absolute inset-0 w-full h-full object-cover opacity-20"
            width={500}
            height={500}
            alt={name}
            src={src || "/aboutcarsimage.avif"}
          />
          {current === index && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30" />
          )}
        </div>

        <AnimatePresence>
          {current === index && (
            <motion.article
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5 }}
              className="absolute bottom-0 left-0 right-0 p-6 md:p-8 flex flex-col items-center"
            >
              <IconQuote
                className="text-brand-color w-10 h-10 mb-4"
                stroke={2}
              />
              <p className="text-sm md:text-lg lg:text-xl italic font-light mb-4 max-w-xl">
                &quot;{quote}&quot;
              </p>
              <div className="flex items-center gap-2 mt-2">
                {iglink ? (
                  <a
                    href={iglink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-lg md:text-2xl font-bold  hover:underline"
                  >
                    {name}
                    <Instagram className="w-5 h-5" />
                  </a>
                ) : (
                  <h3 className="text-lg md:text-2xl font-bold">{name}</h3>
                )}
              </div>
              <p className="text-sm md:text-base text-gray-300">{role}</p>
            </motion.article>
          )}
        </AnimatePresence>
      </li>
    </div>
  );
};

export const TestimonialCarousal = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [current, setCurrent] = useState(0);
  const id = useId();

  useEffect(() => {
    const fetchTestimonials = async () => {
      const { data, error } = await supabase.from("testimonials").select("*").order("created_at", { ascending: false });
      if (!error && data) setTestimonials(data);
    };
    fetchTestimonials();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  const handleSlideClick = (index) => {
    if (index !== current) setCurrent(index);
  };

  if (!testimonials.length) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-24 bg-black text-white">
        <Image src="/car1.jpg" alt="No Testimonials" width={300} height={200} className="rounded-lg mb-6" />
        <h2 className="text-2xl md:text-3xl font-semibold">No testimonials yet</h2>
        <p className="text-gray-400 mt-2">We&apos;ll be updating this section soon. Stay tuned!</p>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden w-full h-full py-20 bg-black">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mb-12">
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-4xl lg:text-6xl font-bold text-white"
        >
          Our <span className="text-brand-color">Super</span> Deliveries
        </motion.h1>
        <motion.div className="h-1 w-24 bg-brand-color mx-auto mt-4" />
      </motion.div>

      <div className="relative w-[70vmin] h-[70vmin] mx-auto">
        <ul
          className="absolute flex mx-[-4vmin] transition-transform duration-1000 ease-in-out"
          style={{ transform: `translateX(-${current * (100 / testimonials.length)}%)` }}
        >
          {testimonials.map((slide, index) => (
            <Slide key={slide.id || index} slide={slide} index={index} current={current} handleSlideClick={handleSlideClick} />
          ))}
        </ul>
        <div className="absolute flex justify-center w-full bottom-[-60px]">
          <div className="flex items-center gap-2 mx-4">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrent(index)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  current === index ? "bg-brand-color w-6" : "bg-gray-500 hover:bg-gray-400"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

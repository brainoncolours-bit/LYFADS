"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrollDir, setScrollDir] = useState("up");

  const toggleMenu = () => setMenuOpen((v) => !v);

  const navLinks = [
    { label: "Home", path: "/#hero" },
    { label: "About Us", path: "/about" },
    { label: "Services ", path: "/car-details" },
    { label: "Works", path: "/works" },
    { label: "Contact", path: "/#contact" },
  ];

  const pathname = usePathname();

  // Handle scroll direction
  useEffect(() => {
    let lastY = window.scrollY;

    const handleScroll = () => {
      const currentY = window.scrollY;
      if (currentY > lastY && currentY > 80) setScrollDir("down");
      else setScrollDir("up");
      lastY = currentY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-[999] w-full flex justify-center pointer-events-none">
      <motion.div
        initial={false}
        animate={{ y: scrollDir === "down" ? "-120%" : "0%" }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="relative transform-gpu pointer-events-auto bg-[#1c1c1c] text-new-white rounded-2xl shadow-lg min-w-[250px] max-w-[500px] w-full px-6 py-3 flex items-center justify-center overflow-hidden"
      >
        {/* EDGE + SWEEP ANIMATIONS */}
        <div className="absolute inset-0 rounded-2xl pointer-events-none">
          {/* Left edge moving glow */}
          <motion.div
            className="absolute left-0 top-[-40%] w-[10px] h-[180%] opacity-80 blur-[2px]
                       bg-gradient-to-b from-transparent via-red-600 to-transparent"
            animate={{ y: ["0%", "35%", "0%"] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Right edge moving glow (different timing for "alive" feel) */}
          <motion.div
            className="absolute right-0 top-[-40%] w-[10px] h-[180%] opacity-80 blur-[2px]
                       bg-gradient-to-b from-transparent via-red-600 to-transparent"
            animate={{ y: ["35%", "0%", "35%"] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Soft light sweep across navbar */}
          <motion.div
            className="absolute top-0 left-[-60%] h-full w-[60%] opacity-[0.12]
                       bg-gradient-to-r from-transparent via-red-600 to-transparent"
            animate={{ x: ["0%", "260%"] }}
            transition={{ duration: 2.6, repeat: Infinity, ease: "linear" }}
          />

          {/* Subtle border shimmer */}
          <motion.div
            className="absolute inset-0 rounded-2xl opacity-60"
            style={{
              boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.06)",
            }}
            animate={{ opacity: [0.35, 0.7, 0.35] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex gap-12 relative z-10">
          {navLinks.map(({ label, path }) => {
            const isActive = pathname === path;
            return (
              <Link
                key={label}
                href={path}
                className={`text-sm font-semibold transition hover:text-brand-color ${
                  isActive ? "text-brand-color" : "text-new-white"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden absolute right-6 relative z-10">
          <button onClick={toggleMenu} aria-label="Toggle menu">
            {menuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </motion.div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="absolute top-[72px] md:hidden bg-[#1c1c1c] rounded-2xl shadow-md mt-2 max-w-[360px] w-full flex flex-col items-center space-y-4 py-4 pointer-events-auto overflow-hidden"
          >
            {/* Mobile menu edge glow too */}
            <div className="absolute inset-0 rounded-2xl pointer-events-none">
              <motion.div
                className="absolute left-0 top-[-40%] w-[10px] h-[180%] opacity-70 blur-[2px]
                           bg-gradient-to-b from-transparent via-brand-color to-transparent"
                animate={{ y: ["0%", "35%", "0%"] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div
                className="absolute right-0 top-[-40%] w-[10px] h-[180%] opacity-70 blur-[2px]
                           bg-gradient-to-b from-transparent via-brand-color to-transparent"
                animate={{ y: ["35%", "0%", "35%"] }}
                transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>

            <div className="relative z-10 w-full flex flex-col items-center space-y-4">
              {navLinks.map(({ label, path }) => {
                const isActive = pathname === path;
                return (
                  <Link
                    key={label}
                    href={path}
                    onClick={() => setMenuOpen(false)}
                    className={`text-base transition ${
                      isActive ? "text-brand-color" : "text-new-white"
                    } hover:text-brand-color`}
                  >
                    {label}
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

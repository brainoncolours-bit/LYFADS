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
    { label: "Services", path: "/car-details" },
    { label: "Works", path: "/works" },
    { label: "Contact", path: "/#contact" },
  ];

  const pathname = usePathname();

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
    <div className="fixed top-4 left-0 right-0 z-[999] flex justify-center pointer-events-none px-4">
      <motion.div
        initial={false}
        animate={{ y: scrollDir === "down" ? "-150%" : "0%" }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="relative pointer-events-auto bg-[#1c1c1c] text-white rounded-2xl shadow-lg 
                   w-full md:max-w-[600px] px-6 py-3 flex items-center justify-between md:justify-center overflow-hidden navbar-container"
      >
        {/* EDGE + SWEEP ANIMATIONS */}
        <div className="absolute inset-0 rounded-2xl pointer-events-none">
          <motion.div
            className="absolute left-0 top-[-40%] w-[2px] h-[180%] opacity-80 bg-red-600 blur-[1px]"
            animate={{ y: ["0%", "35%", "0%"] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute right-0 top-[-40%] w-[2px] h-[180%] opacity-80 bg-red-600 blur-[1px]"
            animate={{ y: ["35%", "0%", "35%"] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute top-0 left-[-60%] h-full w-[60%] opacity-[0.1] bg-gradient-to-r from-transparent via-red-600 to-transparent"
            animate={{ x: ["0%", "260%"] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          />
        </div>

        {/* Brand/Logo (Visible on Mobile to push Menu to Right) */}
        <div className="md:hidden relative z-10 font-black tracking-tighter text-red-600">
       {/* logo image */}
          <img src="./bg.png" alt="Logo" className="w-12 h-auto" />
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex gap-10 relative z-10">
          {navLinks.map(({ label, path }) => (
            <Link
              key={label}
              href={path}
              className={`text-sm font-bold uppercase tracking-widest transition hover:text-red-600 ${
                pathname === path ? "text-red-600" : "text-gray-300"
              }`}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden relative z-10">
          <button
            onClick={toggleMenu}
            className="p-2 text-white hover:text-red-600 transition-colors"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </motion.div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[998] md:hidden pointer-events-auto"
              onClick={() => setMenuOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              className="absolute top-20 left-4 right-4 z-[999] md:hidden bg-[#1c1c1c] border border-white/10 rounded-2xl overflow-hidden pointer-events-auto shadow-2xl"
            >
              <div className="flex flex-col p-4 space-y-2">
                {navLinks.map(({ label, path }) => (
                  <Link
                    key={label}
                    href={path}
                    onClick={() => setMenuOpen(false)}
                    className="px-6 py-4 rounded-xl text-lg font-medium text-gray-300 hover:bg-red-600/10 hover:text-red-600 transition-all active:scale-95"
                  >
                    {label}
                  </Link>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
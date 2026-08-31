"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Home, Users, Wrench, FolderKanban, Mail } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function MobileAppNavbar() {
  const [scrollDir, setScrollDir] = useState("up");

  const navLinks = [
    { label: "Home", path: "/#hero", icon: Home },
    { label: "About Us", path: "/about", icon: Users },
    { label: "Services", path: "/services", icon: Wrench },
    { label: "Portfolio", path: "/works", icon: FolderKanban },
    { label: "Contact", path: "/contact", icon: Mail },
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
    <>
      {/* DESKTOP TOP NAVBAR */}
      <motion.header
        initial={false}
        animate={{ y: scrollDir === "down" ? "-150%" : "0%" }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="fixed top-6 left-0 right-0 z-[999] hidden md:flex justify-center px-4 pointer-events-none"
      >
        <div className="pointer-events-auto bg-[#070707]/80 backdrop-blur-md text-zinc-100 border border-zinc-800/80 px-6 py-2.5 rounded-full flex items-center gap-8 shadow-2xl selection:bg-red-600 selection:text-white">
          <Link href="/#hero" className="flex items-center">
            <img src="/bg.png" alt="Logo" className="w-7 h-auto brightness-200" />
          </Link>

          <nav className="flex items-center gap-6 text-[10px] font-mono tracking-widest uppercase">
            {navLinks.map(({ label, path }) => {
              const isActive = pathname === path;
              return (
                <Link
                  key={label}
                  href={path}
                  className={`relative py-1 transition-colors hover:text-white ${
                    isActive ? "text-white font-bold" : "text-zinc-400"
                  }`}
                >
                  {label}
                  {isActive && (
                    <motion.span
                      layoutId="desktopActiveIndicator"
                      className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-red-600"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </motion.header>

      {/* MOBILE BOTTOM APP NAVBAR */}
      <motion.nav
        initial={false}
        animate={{ y: scrollDir === "down" ? "150%" : "0%" }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="fixed bottom-0 left-0 right-0 z-[999] md:hidden bg-[#070707]/90 backdrop-blur-xl border-t border-zinc-800/80 px-2 py-2 pb-5 flex items-center justify-around shadow-2xl selection:bg-red-600 selection:text-white"
      >
        {navLinks.map(({ label, path, icon: Icon }) => {
          const isActive = pathname === path;
          return (
            <Link
              key={label}
              href={path}
              className="relative flex flex-col items-center gap-1 p-2 text-zinc-400 hover:text-white transition-colors flex-1"
            >
              <Icon size={18} className={isActive ? "text-red-600" : "text-zinc-400"} />
              <span
                className={`text-[9px] font-mono tracking-wider uppercase ${
                  isActive ? "text-white font-bold" : "text-zinc-500"
                }`}
              >
                {label}
              </span>

              {isActive && (
                <motion.span
                  layoutId="mobileActiveIndicator"
                  className="absolute top-0 w-8 h-[2px] rounded-full bg-red-600"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </Link>
          );
        })}
      </motion.nav>
    </>
  );
}
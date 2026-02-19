"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Zap, Navigation, Target, Globe, ArrowUpRight } from "lucide-react";

export default function TacticalBentoTerminal() {
  const [coords, setCoords] = useState({ x: 0, y: 0 });

  // Tracking mouse for the "Radar" coordinate readout
  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setCoords({
      x: Math.round(e.clientX - rect.left),
      y: Math.round(e.clientY - rect.top),
    });
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white p-4 md:p-10 flex flex-col gap-6 overflow-hidden font-sans selection:bg-red-600/30">

      {/* --- HEADER --- */}
      <nav className="flex justify-between items-center z-20 border-b border-white/5 pb-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="group cursor-crosshair"
        >
          <h1 className="text-2xl font-black tracking-tighter uppercase italic group-hover:text-red-500 transition-colors">
            Node_Terminal
          </h1>
          <div className="h-[2px] w-12 bg-red-600 group-hover:w-full transition-all duration-500" />
        </motion.div>

        <div className="hidden md:block text-[10px] text-zinc-500 font-mono tracking-[0.2em] text-right leading-relaxed">
          LAT: 34.0522° N <br />
          LONG: 118.2437° W
        </div>
      </nav>

      {/* --- MAIN BENTO GRID --- */}
      <main className="flex-1 grid grid-cols-12 gap-4 max-w-7xl mx-auto w-full">

        {/* LEFT COLUMN: THE FORM ENGINE */}
        <div className="col-span-12 lg:col-span-7 grid grid-cols-1 gap-4">

          {/* FIELD 01: NAME */}
          <motion.div
            whileHover={{ scale: 1.005 }}
            className="relative bg-zinc-900/80 border border-red-500/20 p-8 rounded-3xl overflow-hidden group transition-colors hover:border-red-500/50"
          >
            <div className="flex justify-between items-center mb-6">
              <span className="text-[10px] font-mono text-red-400 uppercase tracking-[0.2em]">Sector_01 // Identity</span>
              <Target size={14} className="text-red-500/50 group-hover:text-red-400 transition-colors" />
            </div>
            <input
              placeholder="ENTER_OPERATOR_NAME"
              className="w-full bg-transparent border-b border-zinc-700 outline-none text-3xl md:text-5xl font-black uppercase tracking-tighter placeholder:text-zinc-700 text-white focus:border-red-500 focus:placeholder:text-zinc-800 transition-all pb-2"
            />
          </motion.div>

          {/* SECOND ROW: EMAIL & SUBMIT */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <motion.div className="bg-zinc-900/80 border border-red-500/20 p-8 rounded-3xl group transition-colors hover:border-red-500/50">
              <span className="text-[10px] font-mono text-red-400 block mb-6 uppercase tracking-widest">Sector_02 // Comms</span>
              <input
                placeholder="EMAIL_HANDLE"
                className="w-full bg-transparent border-b border-zinc-700 outline-none text-xl font-bold uppercase tracking-tight placeholder:text-zinc-700 text-white focus:border-red-500 focus:placeholder:text-zinc-800 transition-all pb-2"
              />
            </motion.div>

            <motion.button
              whileHover={{ backgroundColor: "#DC2626", color: "#fff" }}
              whileTap={{ scale: 0.98 }}
              className="bg-red-600 text-white rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 group hover:bg-red-500"
            >
              <div className="flex justify-between w-full">
                <Zap size={28} fill="currentColor" />
                <ArrowUpRight size={28} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <span className="text-2xl font-black uppercase italic leading-none text-left">Initiate<br/>Uplink</span>
            </motion.button>
          </div>

          {/* FIELD 03: MESSAGE */}
          <div className="bg-zinc-900/80 border border-red-500/20 p-8 rounded-3xl relative group min-h-[220px] transition-colors hover:border-red-500/50">
            <span className="text-[10px] font-mono text-red-400 block mb-6 uppercase tracking-widest">Sector_03 // Mission_Brief</span>
            <textarea
              rows={4}
              placeholder="ENCODE_YOUR_MESSAGE_HERE..."
              className="w-full bg-transparent border border-zinc-700 rounded-lg p-4 outline-none text-lg font-medium uppercase tracking-[0.15em] placeholder:text-zinc-700 text-white focus:border-red-500 focus:placeholder:text-zinc-800 resize-none leading-relaxed transition-colors"
            />
            <div className="absolute bottom-6 right-8 text-[10px] font-mono text-zinc-600 group-hover:text-zinc-500 transition-colors">ENC_TYPE: RSA_4096</div>
          </div>
        </div>

        {/* RIGHT COLUMN: THE TACTICAL MAP */}
        <motion.div
          onMouseMove={handleMouseMove}
          className="col-span-12 lg:col-span-5 relative group min-h-[450px] lg:min-h-full"
        >
          <div className="absolute inset-0 bg-zinc-900/80 border border-white/5 rounded-3xl overflow-hidden shadow-2xl flex flex-col">

            {/* MAP HUD ELEMENTS */}
            <div className="absolute top-6 left-6 z-20 flex flex-col gap-2 pointer-events-none">
              <div className="px-3 py-1 bg-black/80 backdrop-blur-md border border-white/10 rounded flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                <span className="text-[9px] font-mono text-red-400 tracking-tighter uppercase">Live_Position_Sync</span>
              </div>
              <div className="px-3 py-1 bg-black/40 backdrop-blur-sm border border-white/5 rounded text-[9px] font-mono text-zinc-500 uppercase">
                X: {coords.x} // Y: {coords.y}
              </div>
            </div>

            {/* THE IFRAME MAP */}
            <div className="flex-1 relative">
            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d248849.90089833894!2d77.46612767685893!3d12.953945615107429!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae1670c9b44e6d%3A0xf8dfc3e8517e4fe0!2sBengaluru%2C%20Karnataka!5e0!3m2!1sen!2sin!4v1771422734732!5m2!1sen!2sin" width="600" height="450" style={{border:0}} allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>

              {/* RADAR SWEEP EFFECT */}
              <motion.div
                animate={{ top: ['-10%', '110%'] }}
                transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                className="absolute left-0 right-0 h-[2px] bg-red-500/20 shadow-[0_0_20px_rgba(220,38,38,0.4)] z-10 pointer-events-none"
              />
            </div>

            {/* MAP FOOTER */}
            <div className="p-6 bg-zinc-950 border-t border-white/5 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-500/10 rounded-lg">
                  <Navigation size={16} className="text-red-500" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-white">Grid_Ref_Alpha</p>
                  <p className="text-[9px] font-mono text-zinc-600">ST_SULPICE_DISTRICT_V</p>
                </div>
              </div>
              <Globe size={18} className="text-zinc-800 group-hover:text-red-500 transition-colors duration-500" />
            </div>
          </div>
        </motion.div>

      </main>

      {/* --- FOOTER DATA STREAM --- */}
      <footer className="flex justify-between items-center py-4 border-t border-white/5 z-20">
        <div className="text-[10px] font-mono text-zinc-600 flex gap-8">
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            SECURE_LINK_STABLE
          </span>
          <span className="hidden sm:block">UPTIME: 99.998%</span>
        </div>

        {/* AUDIO-VISUALIZER STYLE BARS */}
        <div className="flex gap-1 items-end h-4">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              animate={{ height: [2, 12, 4, 16, 2] }}
              transition={{ repeat: Infinity, delay: i * 0.15, duration: 1.5 }}
              className="w-1 bg-zinc-800 rounded-full group-hover:bg-red-500 transition-colors"
            />
          ))}
        </div>
      </footer>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { ArrowUpRight, Send } from "lucide-react";

export default function CleanContactTerminal() {
  const [coords, setCoords] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setCoords({
      x: Math.round(e.clientX - rect.left),
      y: Math.round(e.clientY - rect.top),
    });
  };

  return (
    <div className="min-h-screen bg-[#070707] text-zinc-100 font-sans flex flex-col justify-between p-6 md:p-12 selection:bg-red-600 selection:text-white">
      
      {/* HEADER */}
      <header className="w-full flex justify-between items-center border-b border-zinc-900 pb-4">
        <h1 className="text-lg font-black italic tracking-tighter text-white">
          LYF<span className="text-red-600">ADS</span>
        </h1>
        <span className="text-[10px] font-mono text-red-600 font-bold uppercase tracking-widest">
          CONTACT
        </span>
      </header>

      {/* MAIN CONTENT GRID */}
      <main className="my-auto py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch max-w-7xl mx-auto w-full">
        
        {/* LEFT COLUMN: FORM */}
        <div className="lg:col-span-7 flex flex-col justify-between gap-8">
          <div>
            <h2 className="text-4xl sm:text-6xl font-black italic tracking-tighter text-white uppercase leading-none">
              Get In Touch
            </h2>
            <p className="text-xs text-zinc-500 font-mono leading-relaxed pt-2">
              Send raw data specs or film project briefs directly to our core unit.
            </p>
          </div>

          <form className="flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* FIELD 01 */}
              <div className="border-b border-zinc-800 pb-2 focus-within:border-red-600 transition-colors">
                <span className="text-[9px] font-mono text-zinc-500 block mb-1">
                  NAME
                </span>
                <input
                  type="text"
                  placeholder="FULL NAME"
                  className="bg-transparent text-sm font-bold uppercase tracking-wider text-white placeholder:text-zinc-700 outline-none w-full"
                />
              </div>

              {/* FIELD 02 */}
              <div className="border-b border-zinc-800 pb-2 focus-within:border-red-600 transition-colors">
                <span className="text-[9px] font-mono text-zinc-500 block mb-1">
                  EMAIL
                </span>
                <input
                  type="email"
                  placeholder="EMAIL ADDRESS"
                  className="bg-transparent text-sm font-bold uppercase tracking-wider text-white placeholder:text-zinc-700 outline-none w-full"
                />
              </div>
            </div>

            {/* FIELD 03 */}
            <div className="border-b border-zinc-800 pb-2 focus-within:border-red-600 transition-colors">
              <span className="text-[9px] font-mono text-zinc-500 block mb-1">
                MESSAGE
              </span>
              <textarea
                rows={3}
                placeholder="DESCRIBE PROJECT OR SCOPE..."
                className="bg-transparent text-sm font-medium uppercase tracking-wider text-white placeholder:text-zinc-700 outline-none resize-none w-full leading-relaxed"
              />
            </div>

            {/* SUBMIT */}
            <button
              type="submit"
              className="mt-2 flex items-center justify-between border border-zinc-800 text-white hover:bg-red-600 hover:border-red-600 text-xs font-black tracking-wider uppercase px-6 py-4 transition-colors duration-300 group"
            >
              <div className="flex items-center gap-3">
                <Send size={13} className="group-hover:translate-x-1 transition-transform" />
                <span>SEND MESSAGE</span>
              </div>
              <ArrowUpRight size={14} />
            </button>
          </form>
        </div>

        {/* RIGHT COLUMN: FULL COLOR MAP */}
        <div
          onMouseMove={handleMouseMove}
          className="lg:col-span-5 relative border border-zinc-900 flex flex-col justify-between min-h-[350px] lg:min-h-full"
        >
          {/* MAP DISPLAY */}
          <div className="relative flex-1 w-full h-full min-h-[250px]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d248849.90089833894!2d77.46612767685893!3d12.953945615107429!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae1670c9b44e6d%3A0xf8dfc3e8517e4fe0!2sBengaluru%2C%20Karnataka!5e0!3m2!1sen!2sin!4v1771422734732!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          {/* MAP FOOTER */}
          <div className="p-4 border-t border-zinc-900 bg-[#070707] flex justify-between items-center">
            <span className="text-[9px] font-mono text-zinc-500 uppercase">
              BENGALURU, KA
            </span>
            <span className="text-[9px] font-mono text-zinc-600 uppercase">
              X: {coords.x} / Y: {coords.y}
            </span>
          </div>
        </div>

      </main>

      {/* FOOTER */}
      <footer className="w-full border-t border-zinc-900 pt-4 text-[10px] font-mono text-zinc-600 uppercase">
        <span>© LYFADS</span>
      </footer>

    </div>
  );
}
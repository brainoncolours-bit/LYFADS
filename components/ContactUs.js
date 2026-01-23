"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  MapPin, Phone, Mail, Send, Instagram, Facebook, Youtube, Clock
} from "lucide-react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 }
};

export default function ContactCinematicPremium() {
  const [focus, setFocus] = useState(null);

  return (
    <div className="relative min-h-screen bg-[#0a0a0a] text-white overflow-hidden">

      {/* Ambient animated background */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-red-900/20 via-black to-black"
        animate={{ opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 8, repeat: Infinity }}
      />

      {/* Floating particles */}
      {[...Array(30)].map((_, i) => (
        <motion.span
          key={i}
          className="absolute w-1 h-1 bg-white/20 rounded-full"
          initial={{
            x: Math.random() * 1500,
            y: Math.random() * 900,
            opacity: 0.1
          }}
          animate={{
            y: ["0%", "100%"],
            opacity: [0.1, 0.4, 0.1]
          }}
          transition={{
            duration: 10 + Math.random() * 10,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      ))}

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-24">

        {/* HEADER */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
            Let’s Build Something <span className="text-red-500">Legendary</span>
          </h1>
          <p className="mt-6 text-gray-400 max-w-2xl mx-auto">
            Strategy, design, motion, production, systems — this is where ideas turn into realities.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">

          {/* LEFT INFO */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-6"
          >
            {[
              { icon: <MapPin />, title: "Visit Us", info: "Main Road, Ernakulam, Kerala" },
              { icon: <Phone />, title: "Call", info: "+91 98765 43210" },
              { icon: <Mail />, title: "Email", info: "support@shameercars.in" },
            ].map((item, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                whileHover={{ scale: 1.03, y: -6 }}
                className="group bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 flex gap-6 items-center transition-all hover:border-red-500/50 hover:shadow-[0_0_40px_rgba(255,0,0,0.15)]"
              >
                <div className="p-4 bg-red-600/20 rounded-2xl text-red-400 group-hover:scale-110 transition">
                  {React.cloneElement(item.icon, { size: 26 })}
                </div>
                <div>
                  <h4 className="font-bold text-lg">{item.title}</h4>
                  <p className="text-gray-400 text-sm">{item.info}</p>
                </div>
              </motion.div>
            ))}

            {/* HOURS */}
            <motion.div
              variants={fadeUp}
              className="bg-gradient-to-br from-red-600/20 to-black border border-white/10 rounded-3xl p-8"
            >
              <h4 className="font-bold text-lg flex items-center gap-2 mb-4">
                <Clock size={18} className="text-red-400" /> Working Hours
              </h4>
              <div className="space-y-2 text-gray-400 text-sm">
                <div className="flex justify-between"><span>Mon - Sat</span><span className="text-white">9AM - 8PM</span></div>
                <div className="flex justify-between"><span>Sunday</span><span className="text-red-400">Closed</span></div>
              </div>
            </motion.div>
          </motion.div>

          {/* RIGHT FORM */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-10 shadow-[0_0_80px_rgba(0,0,0,0.6)]"
          >
            <h3 className="text-2xl font-bold mb-8">Send Message</h3>

            <form className="space-y-6">
              <input
                placeholder="Full Name"
                onFocus={() => setFocus("name")}
                onBlur={() => setFocus(null)}
                className={`w-full px-6 py-4 rounded-2xl bg-black/40 border transition-all outline-none ${
                  focus==="name" ? "border-red-500 shadow-[0_0_20px_rgba(255,0,0,0.3)]" : "border-white/10"
                }`}
              />

              <input
                placeholder="Email"
                type="email"
                onFocus={() => setFocus("email")}
                onBlur={() => setFocus(null)}
                className={`w-full px-6 py-4 rounded-2xl bg-black/40 border transition-all outline-none ${
                  focus==="email" ? "border-red-500 shadow-[0_0_20px_rgba(255,0,0,0.3)]" : "border-white/10"
                }`}
              />

              <PhoneInput
                country={"in"}
                inputStyle={{
                  width: "100%",
                  height: "60px",
                  borderRadius: "1rem",
                  background: "rgba(0,0,0,0.4)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "white"
                }}
                buttonStyle={{ background: "transparent", border: "none" }}
              />

              <textarea
                rows={4}
                placeholder="Tell us about your project..."
                onFocus={() => setFocus("msg")}
                onBlur={() => setFocus(null)}
                className={`w-full px-6 py-4 rounded-2xl bg-black/40 border transition-all outline-none resize-none ${
                  focus==="msg" ? "border-red-500 shadow-[0_0_20px_rgba(255,0,0,0.3)]" : "border-white/10"
                }`}
              />

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="w-full py-5 rounded-2xl bg-gradient-to-r from-red-600 to-red-700 font-bold flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(255,0,0,0.4)]"
              >
                Send Message <Send size={18}/>
              </motion.button>
            </form>

            {/* SOCIAL */}
            <div className="mt-10 flex gap-6 justify-center text-gray-400">
              {[<Instagram/>, <Facebook/>, <Youtube/>].map((icon,i)=>(
                <motion.button
                  key={i}
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  className="hover:text-red-500 transition"
                >
                  {React.cloneElement(icon, { size: 22 })}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>

        {/* MAP */}
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-24 rounded-[2.5rem] overflow-hidden border border-white/10 shadow-[0_0_60px_rgba(0,0,0,0.8)]"
        >
          <iframe
            title="map"
            className="w-full h-[450px] grayscale contrast-125"
            src="https://www.google.com/maps?q=Ernakulam%20Kerala&output=embed"
            loading="lazy"
          />
        </motion.div>

      </div>
    </div>
  );
}

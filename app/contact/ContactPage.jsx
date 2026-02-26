"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactUs from "@/components/ContactUs";

export default function ContactPage() {
  return (
    <div className="bg-[#050505] text-white min-h-screen">
      <Navbar />
      <ContactUs />
      <Footer />
    </div>
  );
}

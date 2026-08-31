"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactUs from "@/components/ContactUs";

export default function ContactPage() {
  return (
    <div className="bg-[#fafafa] text-neutral-900 min-h-screen selection:bg-red-600 selection:text-white">
      <Navbar />
      <ContactUs />
      <Footer />
    </div>
  );
}

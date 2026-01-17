"use client";
import { motion } from "framer-motion";
import { IconUser, IconPhone, IconMail, IconCalendar } from "@tabler/icons-react";
import { useState } from "react";

const CarEnquiryForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    email: "",
    testDriveDate: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Thank you for your enquiry! We will contact you soon.");
    setFormData({ name: "", contact: "", email: "", testDriveDate: "" });
  };

  return (
    <div className="flex items-center justify-center p-6 m-auto">
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md bg-neutral-900 rounded-lg shadow-2xl p-6 border border-neutral-800"
      >
        {/* Headline */}
        <h1 className="text-2xl lg:text-3xl font-bold mb-4 text-white">
          Book Your Test <span className="text-brand-color">Drive</span>
        </h1>
        <p className="text-neutral-400 text-sm mb-6">
          Experience the thrill of driving your dream car. Fill out the form below, and we&apos;ll get in
          touch with you shortly.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Field */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="relative"
          >
            <IconUser className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your Name"
              required
              className="w-full pl-10 pr-4 py-2 bg-neutral-800 rounded-lg text-sm text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-color transition-all"
            />
          </motion.div>

          {/* Contact Number Field */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="relative"
          >
            <IconPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="tel"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              placeholder="Contact Number"
              required
              className="w-full pl-10 pr-4 py-2 bg-neutral-800 rounded-lg text-sm text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-color transition-all"
            />
          </motion.div>

          {/* Email Field */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="relative"
          >
            <IconMail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email Address"
              required
              className="w-full pl-10 pr-4 py-2 bg-neutral-800 rounded-lg text-sm text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-color transition-all"
            />
          </motion.div>

          {/* Test Drive Date Field */}
          <motion.div
            // whileHover={{ scale: 1.02 }}
            // whileTap={{ scale: 0.98 }}
            className="relative"
          >
            <label className=" text-sm text-neutral-400 mb-1 flex items-center gap-2">Test Drive Date  <IconCalendar className=" w-4 h-4 text-neutral-400" /></label>
            
            <input
              type="date"
              name="testDriveDate"
              value={formData.testDriveDate}
              onChange={handleChange} 
              required
              className="w-full pl-2 pr-4 py-2 bg-neutral-800 rounded-lg text-sm text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-color transition-all appearance-none" // Add appearance-none for better styling
            />
          </motion.div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full bg-brand-color text-black py-2 rounded-lg text-sm font-semibold hover:bg-brand-color/90 transition-all"
          >
            Submit 
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default CarEnquiryForm;
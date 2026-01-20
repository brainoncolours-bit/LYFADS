import React, { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textArea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Instagram, Facebook, Linkedin, MapPin, Phone, Mail, Youtube,MessageCircle  } from "lucide-react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useToast } from "./ToastProvider";
import { supabase } from "@/lib/supabaseClient";
import { poppins } from "@/lib/font";

const ContactUs = () => {
  const  toast  = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhoneChange = (value) => {
    setFormData((prev) => ({ ...prev, phone: value }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  const { name, email, phone, message } = formData;

  const { data, error } = await supabase.from("feedback").insert([
    {
      name,
      email,
      phone:`+${phone}`,
      message,
    },
  ]);

  if (error) {
    console.error("Supabase insert error:", error);
    toast.error("Something went wrong. Please try again.");
    return;
  }

  const subject = 'Thank You for Your Message - Shameer Cars';

const html = `
  <div style="background-color:#f5f5f5;padding:20px 0;font-family:Arial,sans-serif;">
    <table align="center" width="600" style="background-color:#ffffff;border-radius:8px;overflow:hidden;">
      <tr>
        <td style="text-align:center;background-color:#001529;padding:20px;">
        </td>
      </tr>
      <tr>
        <td style="padding:30px;">
          <h2 style="color:#333;">Hi ${name},</h2>
          <p style="font-size:16px;color:#555;">
            Thank you for sharing your valuable Message with <strong>Shameer Cars</strong>.
          </p>
          <p style="font-size:16px;color:#555;">
            We truly appreciate the time you took to help us improve. Your input plays a vital role in delivering a better experience to all our customers.
          </p>
          <p style="font-size:16px;color:#555;">
            If you'd like to explore more about what we offer, feel free to check out our premium car collection:
          </p>
          <p style="text-align:center;margin:30px 0;">
            <a href="https://shameercars.vercel.app/car-details" style="background-color:#1890ff;color:#fff;padding:12px 24px;border-radius:4px;text-decoration:none;font-size:16px;">
              Browse Car Collection
            </a>
          </p>
          <p style="font-size:16px;color:#555;">
            Thanks again for your feedback. We're always here to help.
          </p>
          <p style="font-size:16px;color:#555;">Best regards,<br/>Shameer Cars Team</p>
        </td>
      </tr>
      <tr>
        <td style="background-color:#fafafa;padding:20px;text-align:center;">
          <p style="margin:0;color:#666;font-size:14px;">
            📞 <strong>+91 98765 43210</strong> &nbsp; | &nbsp; 📧 <a href="mailto:support@shameercars.in" style="color:#1890ff;text-decoration:none;">support@shameercars.in</a>
          </p>
          <p style="margin:8px 0;color:#666;font-size:14px;">
            📍 <strong>Shameer Cars</strong>, Main Road, Ernakulam, Kerala - 682001
          </p>
          <div style="margin-top:10px;">
            <a href="https://facebook.com/shameercars" style="margin:0 8px;"><img src="https://img.icons8.com/ios-filled/24/000000/facebook--v1.png" alt="Facebook" /></a>
            <a href="https://instagram.com/shameercars" style="margin:0 8px;"><img src="https://img.icons8.com/ios-filled/24/000000/instagram-new.png" alt="Instagram" /></a>
            <a href="https://wa.me/919876543210" style="margin:0 8px;"><img src="https://img.icons8.com/ios-filled/24/000000/whatsapp.png" alt="WhatsApp" /></a>
          </div>
        </td>
      </tr>
      <tr>
        <td style="background-color:#f0f0f0;text-align:center;padding:12px;color:#999;font-size:12px;">
          © ${new Date().getFullYear()} Shameer Cars. All rights reserved.
        </td>
      </tr>
    </table>
  </div>
`;


    await fetch('/api/sendSellMail', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, subject, html }),
    });
  toast.success("Your message has been sent!");

  // Optionally reset the form
  setFormData({
    name: "",
    email: "",
    phone: "+91",
    message: "",
  });
};

  const socialMedia = [
    {
      name: "Instagram",
      icon: <Instagram className="h-6 w-6" />,
      handle: "@shameerscars",
      followers: "142K",
      url: "https://instagram.com/shameerscars",
      color: "from-purple-500 via-pink-500 to-orange-400",
    },
    {
      name: "Facebook",
      icon: <Facebook className="h-6 w-6" />,
      handle: "Shameers cars",
      followers: "89K",
      url: "https://facebook.com",
      color: "from-blue-600 to-blue-400",
    },
    {
      name: "Youtube",
      icon: <Youtube className="h-6 w-6" />,
      handle: "shameercars",
      followers: "56K",
      url: "https://youtube.com",
      color: "from-red-700 to-white-500",
    },
  ];


  const messageSuggestions = [
  "I'm looking for a budget-friendly used car under ₹5L.",
  "Can you help me exchange my old car for a new model?",
  "I'd like to schedule a test drive for a specific car.",
  "Do you offer financing or EMI options?",
  "What documents are needed to sell my car?",
  "Can I get a valuation for my car before selling?",
  "Is the car I saw available for immediate delivery?",
  "I'd like to know more about your warranty policy.",
  "Can I get a custom quote for a specific model?",
];



  return (
     <div id="contact" className={`relative w-full min-h-screen bg-[#020202] text-white py-20 px-4 sm:px-6 md:px-8 lg:px-16 overflow-hidden ${poppins.className}`}>
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gradient Orbs - Red Theme */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-red-900/20 via-red-600/10 to-transparent blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-red-800/15 via-red-900/10 to-transparent blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-gradient-to-br from-red-600/10 to-transparent blur-3xl"></div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        
        {/* Carbon Fiber Texture */}
        <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <motion.div 
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-block"
          >
            <div className="mb-6 flex items-center justify-center gap-4">
              <div className="h-[1px] w-12 bg-red-600" />
              <span className="tracking-[0.4em] text-[10px] text-gray-400 uppercase">Contact</span>
              <div className="h-[1px] w-12 bg-red-600" />
            </div>
            <h1 className="text-5xl md:text-7xl font-black italic mb-4">
              <span className="drop-shadow-[0_0_30px_rgba(220,38,38,0.3)]">
                Let&apos;s Connect
              </span>
            </h1>
            <div className="h-1.5 w-3/4 mx-auto bg-red-600 rounded-full"></div>
          </motion.div>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="text-gray-400 max-w-3xl mx-auto text-lg md:text-xl mt-8 leading-relaxed"
          >
            Have questions? We&apos;re here to help you find your perfect vehicle. Reach out and let&apos;s start the conversation.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left: Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="space-y-8"
          >
            {/* Contact Form Card */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-red-600/30 rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-500"></div>
              <div className="relative bg-[#1c1c1c]/80 backdrop-blur-xl rounded-3xl p-8 md:p-10 border border-white/10 shadow-2xl">
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-3 bg-red-600 rounded-2xl">
                    <Mail className="h-7 w-7 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-white">
                    Send Message
                  </h2>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="name" className="text-sm font-medium text-gray-200 mb-2 block">
                      Full Name
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="John Doe"
                      className="bg-white/5 border-white/20 text-white placeholder:text-gray-500 focus:bg-white/10 focus:border-red-600 transition-all h-12 rounded-xl"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="email" className="text-sm font-medium text-gray-200 mb-2 block">
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="john@example.com"
                      className="bg-white/5 border-white/20 text-white placeholder:text-gray-500 focus:bg-white/10 focus:border-red-600 transition-all h-12 rounded-xl"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="phone" className="text-sm font-medium text-gray-200 mb-2 block">
                      Phone Number
                    </Label>
                    <PhoneInput
                      country={"in"}
                      value={formData.phone}
                      onChange={handlePhoneChange}
                      containerClass="w-full"
                      inputStyle={{
                        width: "100%",
                        background: "rgba(255, 255, 255, 0.05)",
                        border: "1px solid rgba(255, 255, 255, 0.2)",
                        color: "white",
                        height: "48px",
                        borderRadius: "12px",
                        fontSize: "16px",
                      }}
                      dropdownStyle={{
                        background: "#1c1c1c",
                        color: "white",
                        border: "1px solid rgba(255, 255, 255, 0.2)",
                      }}
                      buttonStyle={{
                        background: "rgba(255, 255, 255, 0.05)",
                        border: "1px solid rgba(255, 255, 255, 0.2)",
                        borderRight: "none",
                        borderTopLeftRadius: "12px",
                        borderBottomLeftRadius: "12px",
                      }}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="message" className="text-sm font-medium text-gray-200 mb-2 block">
                      Your Message
                    </Label>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {messageSuggestions.slice(0, 3).map((suggestion, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setFormData({ ...formData, message: suggestion })}
                          className="px-3 py-1.5 text-xs rounded-full bg-white/5 hover:bg-red-600/20 text-gray-300 border border-white/10 hover:border-red-600/50 transition-all"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      placeholder="Tell us how we can help you..."
                      className="bg-white/5 border-white/20 text-white placeholder:text-gray-500 focus:bg-white/10 focus:border-red-600 min-h-[140px] transition-all rounded-xl resize-none"
                    />
                  </div>
                  
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      type="submit"
                      className="w-full h-14 text-lg font-bold tracking-wide bg-red-600 hover:bg-red-700 hover:scale-105 rounded-xl shadow-lg shadow-red-600/30 transition-all"
                    >
                      Send Message
                    </Button>
                  </motion.div>
                </form>
              </div>
            </div>

            {/* Social Media Cards */}
            <div className="grid grid-cols-3 gap-4">
              {socialMedia.map((platform, idx) => (
                <motion.a
                  key={platform.name}
                  href={platform.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 + idx * 0.1 }}
                  whileHover={{ y: -8, scale: 1.05 }}
                  className="relative group"
                >
                  <div className={`absolute -inset-0.5 bg-gradient-to-r ${platform.color} rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-300`}></div>
                  <div className="relative bg-white/5 backdrop-blur-xl rounded-2xl p-4 border border-white/10 text-center">
                    <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${platform.color} mb-2`}>
                      {platform.icon}
                    </div>
                    <p className="text-sm font-semibold text-white">{platform.name}</p>
                    <p className="text-xs text-gray-400 mt-1">{platform.followers}</p>
                  </div>
                </motion.a>
              ))}
            </div>
          </motion.div>
          
          {/* Right: Map & Info */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="space-y-8"
          >
            {/* Map */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-red-600/30 rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-500"></div>
              <div className="relative overflow-hidden rounded-3xl border border-white/10 h-[400px]">
                <iframe 
                  title="SHAMEER'S CARS"
                  className="w-full h-full" 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3913.496538392285!2d75.7989077747975!3d11.224837650763154!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba659f487f3964b%3A0xc2fedfdedb1c1202!2sShameer&#39;s%20Cars!5e0!3m2!1sen!2sin!4v1747904242061!5m2!1sen!2sin"  
                  allowFullScreen 
                  loading="lazy"
                ></iframe>
              </div>
            </div>

            {/* Contact Info & Hours */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-red-600/30 rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-500"></div>
              <div className="relative bg-[#1c1c1c]/80 backdrop-blur-xl rounded-3xl p-8 border border-white/10">
                {/* Contact Details */}
                <div className="space-y-5 mb-8">
                  <h3 className="text-2xl font-bold text-white mb-6">
                    Get In Touch
                  </h3>
                  
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-red-600/10 transition-all group/item">
                    <div className="p-3 bg-red-600 rounded-xl">
                      <Phone size={20} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Phone</p>
                      <a href="tel:+1234567890" className="text-white font-semibold hover:text-red-400 transition-colors">
                        +1 (234) 567-890
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-red-600/10 transition-all group/item">
                    <div className="p-3 bg-red-600 rounded-xl">
                      <MessageCircle size={20} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">WhatsApp</p>
                      <a
                        href="https://wa.me/1234567890"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white font-semibold hover:text-red-400 transition-colors"
                      >
                        Chat with us
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-red-600/10 transition-all group/item">
                    <div className="p-3 bg-red-600 rounded-xl">
                      <Mail size={20} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Email</p>
                      <a href="mailto:info@example.com" className="text-white font-semibold hover:text-red-400 transition-colors">
                        info@example.com
                      </a>
                    </div>
                  </div>
                </div>

                {/* Working Hours */}
                <div className="pt-6 border-t border-white/10">
                  <h3 className="text-xl font-bold text-white mb-4">Business Hours</h3>
                  <div className="space-y-3">
                    {[
                      { day: "Mon - Fri", hours: "9:00 AM - 8:00 PM" },
                      { day: "Saturday", hours: "10:00 AM - 6:00 PM" },
                      { day: "Sunday", hours: "11:00 AM - 5:00 PM" },
                    ].map(({ day, hours }) => (
                      <div
                        key={day}
                        className="flex justify-between items-center p-3 rounded-lg bg-white/5 hover:bg-red-600/10 transition-all"
                      >
                        <span className="text-gray-300 font-medium">{day}</span>
                        <span className="text-white font-semibold">{hours}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;

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
     <div id="contact" className={`relative w-full bg-black text-white py-16 px-4 sm:px-6 md:px-8 lg:px-12 overflow-hidden ${poppins.className}`}>
      {/* Background cosmic elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-purple-700/20 blur-3xl"></div>
        <div className="absolute top-1/3 -left-20 w-72 h-72 rounded-full bg-pink-600/10 blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full bg-blue-600/10 blur-3xl"></div>
        <div className="absolute -bottom-10 -left-10 w-60 h-60 rounded-full bg-indigo-500/10 blur-3xl"></div>
      </div>
      
      {/* Stars */}
      <div className="stars absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <div 
            key={i} 
            className="absolute w-1 h-1 bg-white rounded-full" 
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.7 + 0.3,
              animation: `twinkle ${Math.random() * 5 + 3}s infinite`
            }}
          ></div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="inline-block relative">
              <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-brand-color via-orange-400 to-orange-400">
              Connect With Us
            </h1>
            <div className="absolute -bottom-2 left-0 h-1 w-full bg-gradient-to-r from-brand-color via-gray-100 to-orange-400 rounded-full"></div>
          </div>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg mt-6">
            Your dream car might be just one message away — talk to our team and let&apos;s make it real.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left column: Contact Form - 7 columns on lg */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 space-y-10"
          >
              {/* Social Media Cards */}
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {socialMedia.map((platform) => (
                  <motion.a
                    key={platform.name}
                    href={platform.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    whileHover={{ y: -5, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="block"
                  >
                    <div className="relative overflow-hidden rounded-xl h-full">
                      {/* Glowing background */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${platform.color} opacity-10`}></div>
                      <div className="absolute inset-0 bg-zinc-900/70 backdrop-blur-sm border border-zinc-800/50"></div>
                      
                      <div className="relative p-4">
                        <div className={`h-1.5 w-full bg-gradient-to-r ${platform.color} rounded-full mb-4`}></div>
                        <div className="flex items-center mb-2">
                          <div className={`mr-3 p-2 rounded-full bg-gradient-to-br ${platform.color}`}>
                            {platform.icon}
                          </div>
                          <div>
                            <div className="font-bold text-white">{platform.name}</div>
                            <div className="text-gray-400 text-sm">{platform.handle}</div>
                          </div>
                        </div>
                        
                        <div className="mt-4 text-center">
                          <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
                            {platform.followers}
                          </span>
                          <span className="block text-sm text-gray-400">followers</span>
                        </div>
                      </div>
                    </div>
                  </motion.a>
                ))}
              </div>
            </div>
            {/* Contact form */}
         <div className="relative p-6 md:p-8 rounded-2xl overflow-hidden">
  {/* Glowing background */}
                        <div className="absolute inset-0 bg-zinc-900/70 backdrop-blur-sm border border-zinc-800/50"></div>

  <div className="relative z-10">
    <div className="flex items-center mb-8 space-x-4">
      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#fb910e] to-[#d56c00] flex items-center justify-center">
        <Mail className="h-5 w-5 text-white" />
      </div>
      <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#fb910e] to-[#d56c00]">
        Send Us A Message
      </h2>
    </div>
    
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="name" className="text-sm text-gray-300 ml-1">
            Your Name
          </Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Name"
            className="mt-1 bg-zinc-800/70 border-zinc-700/50 text-white focus:ring-[#fb910e] focus:border-[#fb910e]"
          />
        </div>
        
        <div>
          <Label htmlFor="email" className="text-sm text-gray-300 ml-1">
            Your Email
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="Enter valid email address."
            className="mt-1 bg-zinc-800/70 border-zinc-700/50 text-white focus:ring-[#fb910e] focus:border-[#fb910e]"
          />
        </div>
        
        <div>
          <Label htmlFor="phone" className="text-sm text-gray-300 ml-1">
            Phone Number
          </Label>
          <PhoneInput
            country={"in"}
            value={formData.phone}
            onChange={handlePhoneChange}
            containerClass="mt-1"
            inputStyle={{
              width: "100%",
              background: "rgba(39, 39, 42, 0.7)",
              border: "1px solid rgba(63, 63, 70, 0.5)",
              color: "white",
              height: "42px",
              borderRadius: "6px",
            }}
            dropdownStyle={{
              background: "#27272a",
              color: "white",
            }}
            buttonStyle={{
              background: "rgba(39, 39, 42, 0.7)",
              border: "1px solid rgba(63, 63, 70, 0.5)",
              borderRight: "none",
              borderTopLeftRadius: "6px",
              borderBottomLeftRadius: "6px",
            }}
          />
        </div>
        
        <div className="space-y-1">
  <Label htmlFor="message" className="text-sm text-gray-300 ml-1">
    Your Message
  </Label>

  {/* Suggestions */}
  <div className="flex flex-wrap gap-2 mb-2">
    {messageSuggestions.slice(0, 4).map((suggestion, idx) => (
      <button
        key={idx}
        type="button"
        onClick={() => setFormData({ ...formData, message: suggestion })}
        className="px-3 py-1.5 text-start rounded-full bg-zinc-700 text-white text-xs shadow hover:bg-zinc-600 transition"
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
    placeholder="Tell us what you're looking for..."
    className="mt-1 bg-zinc-800/70 border-zinc-700/50 text-white min-h-[120px] focus:ring-[#fb910e] focus:border-[#fb910e]"
  />
</div>
      </div>
      
      <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
        <Button
          type="submit"
          className="w-full relative overflow-hidden group"
        >
          <span className="absolute inset-0 bg-gradient-to-r from-[#fb910e] to-[#d56c00] group-hover:from-[#ff9f1a] group-hover:to-[#bf5e00]"></span>
          <span className="relative flex items-center justify-center py-2 text-white font-medium">
            Send Message
          </span>
        </Button>
      </motion.div>
    </form>
  </div>
</div>

            
          
          </motion.div>
          
          {/* Right column: Map and Contact Info - 5 columns on lg */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-5 space-y-10"
          >
            {/* Map */}
            <div className="relative overflow-hidden rounded-2xl h-[350px] md:h-[400px] border border-zinc-800/50 shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10 pointer-events-none"></div>
              <iframe title="sHAMEER'S CARS"
                className="w-full h-full border-0" 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3913.496538392285!2d75.7989077747975!3d11.224837650763154!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba659f487f3964b%3A0xc2fedfdedb1c1202!2sShameer&#39;s%20Cars!5e0!3m2!1sen!2sin!4v1747904242061!5m2!1sen!2sin"  allowFullScreen loading="lazy"></iframe>

            </div>
            
       

{/* Working Hours */}
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5, delay: 0.3 }}
  className="relative overflow-hidden rounded-2xl p-6"
>
  {/* Background Layers */}
  <div className="absolute inset-0 bg-zinc-900/70 backdrop-blur-sm border border-zinc-800/50 rounded-2xl" />
  <div className="absolute inset-0 bg-gradient-to-b from-[#fb910e]/10 to-transparent rounded-2xl" />

  <div className="relative space-y-10">
    {/* Showroom Hours */}
    <div>
      <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#fb910e] to-[#d56c00] mb-6">
        Showroom Hours
      </h2>
      <div className="space-y-4">
        {[
          { day: "Monday - Friday", hours: "9:00 AM - 8:00 PM" },
          { day: "Saturday", hours: "10:00 AM - 6:00 PM" },
          { day: "Sunday", hours: "11:00 AM - 5:00 PM" },
        ].map(({ day, hours }) => (
          <div
            key={day}
            className="flex justify-between items-center p-3 rounded-lg hover:bg-[#fb910e]/10 transition-colors"
          >
            <span className="text-gray-400">{day}</span>
            <span className="text-white font-medium">{hours}</span>
          </div>
        ))}
      </div>
    </div>

    {/* Contact Info */}
    <div className="space-y-4">
      <div className="space-y-3">
        {/* Phone */}
        <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#fb910e]/10 transition-colors">
          <div className="bg-gradient-to-br from-[#fb910e]/20 to-[#d56c00]/20 p-2 rounded-md text-[#fb910e]">
            <Phone size={18} />
          </div>
          <div>
            <p className="text-sm text-gray-400">Phone</p>
            <a href="tel:+1234567890" className="text-white font-medium hover:underline">
              +1 (234) 567-890
            </a>
          </div>
        </div>

        {/* WhatsApp */}
        <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#fb910e]/10 transition-colors">
          <div className="bg-gradient-to-br from-[#fb910e]/20 to-[#d56c00]/20 p-2 rounded-md text-[#fb910e]">
            <MessageCircle size={18} />
          </div>
          <div>
            <p className="text-sm text-gray-400">WhatsApp</p>
            <a
              href="https://wa.me/1234567890"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white font-medium hover:underline"
            >
              Chat with us
            </a>
          </div>
        </div>

        {/* Email */}
        <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#fb910e]/10 transition-colors">
          <div className="bg-gradient-to-br from-[#fb910e]/20 to-[#d56c00]/20 p-2 rounded-md text-[#fb910e]">
            <Mail size={18} />
          </div>
          <div>
            <p className="text-sm text-gray-400">Email</p>
            <a href="mailto:info@example.com" className="text-white font-medium hover:underline">
              info@example.com
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</motion.div>
          </motion.div>
        </div>
      </div>
      
      {/* Add CSS for stars twinkling animation */}
      <style jsx>{`
        @keyframes twinkle {
          0% { opacity: 0.3; }
          50% { opacity: 1; }
          100% { opacity: 0.3; }
        }
      `}</style>
    </div>
  );
};

export default ContactUs;

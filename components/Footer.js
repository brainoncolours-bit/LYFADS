"use client";

import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-new-black text-white py-10 px-6 md:px-12">
      <div className="max-w-screen-xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Brand & Description */}
        <div>
          <p className="text-gray-400 mt-2 text-sm">
          We are the best when it comes to Exotic Cars.
          </p>
        </div>

        {/* Quick Links */}
       <div className="grid grid-cols-2 gap-4 md:justify-self-center">
  {/* Quick Links Section */}
  <div>
    <h3 className="text-lg font-semibold text-white">Quick Links</h3>
    <ul className="text-gray-400 mt-2 space-y-1">
      <li>
        <Link href="/" className="hover:text-white">Home</Link>
      </li>
      <li>
        <Link href="/car-details" className="hover:text-white">Cars</Link>
      </li>
      <li>
        <Link href="/#sellExchange" className="hover:text-white">Sell/Exchange</Link>
      </li>
      <li>
        <Link href="/#contact" className="hover:text-white">Contact</Link>
      </li>
    </ul>
  </div>

  {/* Support Section */}
  <div>
    <h3 className="text-lg font-semibold text-white">Support</h3>
    <ul className="text-gray-400 mt-2 space-y-1">
      <li>
        <Link href="/FAQ" className="hover:text-white">FAQs</Link>
      </li>
    </ul>
  </div>
</div>

        {/* Social Media */}
        <div className="flex flex-col md:justify-self-end">
          <h3 className="text-lg font-semibold">Follow Us</h3>
          <div className="flex space-x-4 mt-3">
            {[
              { icon: Facebook, href: "#" },
              { icon: Twitter, href: "#" },
              { icon: Instagram, href: "#" },
              { icon: Linkedin, href: "#" },
            ].map((social, index) => (
              <a
                key={index}
                href={social.href}
                className="p-2 bg-gray-700 rounded-full hover:bg-white hover:text-gray-900 transition"
              >
                {<social.icon className="w-5 h-5" />}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-gray-700 mt-8 pt-4 text-center text-gray-400 text-sm">
        © {new Date().getFullYear()} Shameer Cars. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;

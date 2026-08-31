'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, ArrowUpRight } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import Swal from 'sweetalert2';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      Swal.fire('Incomplete Form', 'Please fill in all required fields.', 'warning');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.from('feedback').insert([
        {
          name: formData.name,
          email: formData.email,
          phone: formData.phone || '',
          message: formData.message,
        },
      ]);

      if (error) throw error;

      Swal.fire({
        icon: 'success',
        title: 'Message Sent!',
        text: 'Our team will get back to you shortly.',
        confirmButtonColor: '#0a0a0a',
      });
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (err) {
      console.error('Error submitting enquiry:', err);
      Swal.fire('Error', 'Failed to send message. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative w-full bg-[#fafafa] text-neutral-900 pt-20 sm:pt-28 md:pt-36 pb-20 sm:pb-24 px-4 sm:px-8 lg:px-16 overflow-hidden">
      <div className="max-w-[1440px] mx-auto">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
          
          {/* LEFT: FORM SECTION */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            
            <div className="mb-6 sm:mb-10">
              <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black italic tracking-tighter text-neutral-950 uppercase leading-none">
                GET IN <span className="text-red-600">TOUCH.</span>
              </h2>
              <p className="text-xs sm:text-sm font-mono text-neutral-600 mt-2 sm:mt-3 max-w-lg leading-relaxed">
                Send raw data specs or film project briefs directly to our core production unit.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-widest text-neutral-500 font-bold mb-1.5 sm:mb-2">
                    NAME *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="FULL NAME"
                    required
                    className="w-full bg-white border border-neutral-300 rounded-xl px-4 py-3 sm:py-3.5 text-sm sm:text-xs font-mono uppercase text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-950 focus:ring-1 focus:ring-neutral-950 transition-all shadow-sm"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-widest text-neutral-500 font-bold mb-1.5 sm:mb-2">
                    EMAIL *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="EMAIL ADDRESS"
                    required
                    className="w-full bg-white border border-neutral-300 rounded-xl px-4 py-3 sm:py-3.5 text-sm sm:text-xs font-mono uppercase text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-950 focus:ring-1 focus:ring-neutral-950 transition-all shadow-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase tracking-widest text-neutral-500 font-bold mb-1.5 sm:mb-2">
                  PHONE NUMBER (OPTIONAL)
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 XXXXX XXXXX"
                  className="w-full bg-white border border-neutral-300 rounded-xl px-4 py-3 sm:py-3.5 text-sm sm:text-xs font-mono uppercase text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-950 focus:ring-1 focus:ring-neutral-950 transition-all shadow-sm"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase tracking-widest text-neutral-500 font-bold mb-1.5 sm:mb-2">
                  MESSAGE / PROJECT SCOPE *
                </label>
                <textarea
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="DESCRIBE PROJECT OR SCOPE..."
                  required
                  className="w-full bg-white border border-neutral-300 rounded-xl px-4 py-3 sm:py-3.5 text-sm sm:text-xs font-mono uppercase text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-950 focus:ring-1 focus:ring-neutral-950 transition-all shadow-sm resize-none"
                />
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 sm:gap-3 px-8 sm:px-10 py-3.5 sm:py-4 rounded-full bg-neutral-950 text-white font-mono text-xs font-bold tracking-widest uppercase hover:bg-red-600 transition-all duration-300 shadow-md hover:shadow-xl hover:scale-105 active:scale-95 disabled:opacity-50 cursor-pointer"
                >
                  <span>{loading ? 'SENDING...' : 'SEND MESSAGE'}</span>
                  <ArrowUpRight size={15} />
                </button>
              </div>
            </form>

          </div>

          {/* RIGHT: MAP / LOCATION BOX */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            
            <div className="w-full aspect-[4/3] rounded-3xl overflow-hidden bg-white border border-neutral-200 shadow-xl relative">
              <iframe
                title="Bangalore Location Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d248849.88653909205!2d77.49085449767222!3d12.953959988166545!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae1670c9b44e6d%3A0xf8dfc3e8517e4fe0!2sBengaluru%2C%20Karnataka!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                className="w-full h-full border-0"
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            {/* Coordinates / Meta tag */}
            <div className="flex justify-between items-center px-2 text-[10px] font-mono uppercase tracking-widest text-neutral-500">
              <span>BENGALURU, KA • HQ</span>
              <span>IN PRODUCTION 24/7</span>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

export default ContactUs;
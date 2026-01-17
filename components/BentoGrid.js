"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" },
  }),
};

const bentoItems = [
  { id: 1, src: "/bento/img5.jpeg", title: "Premium Accessories", cols: "md:col-span-2", rows: "md:row-span-3",mobileCol:"col-span-2", mobileRow:"row-span-2" },
  { id: 2, src: "/bento/img2.jpeg", title: "Discover The Best", cols: "md:col-span-2", rows: "md:row-span-1",mobileCol:"col-span-2", mobileRow:"row-span-1"},
  { id: 3, src: "/bento/img3.jpeg", title: "Lighting & Flash Equipment ", cols: "md:col-span-2", rows: "md:row-span-2",mobileCol:"col-span-2", mobileRow:"row-span-1" },
  { id: 4, src: "/bento/img1.jpeg", title: "Certified Inspection", cols: "md:col-span-2", rows: "md:row-span-1",mobileCol:"col-span-2", mobileRow:"row-span-1" },
  { id: 5, src: "/bento/img4.jpeg", title: "Buy Back Assurance", cols: "md:col-span-4", rows: "md:row-span-1",mobileCol:"col-span-2", mobileRow:"row-span-1" },
];

const BentoGrid = () => {
  return (
    <div className="grid grid-cols-4 md:grid-cols-6 gap-4 p-6 pb-1 py-20  auto-rows-[200px] max-w-8xl mx-auto">
      {bentoItems.map((item, index) => (
        <motion.div
          key={item.id}
          className={`relative overflow-hidden rounded-xl shadow-lg group ${item.mobileRow} ${item.mobileCol}  ${item.rows} ${item.cols}`}
          initial="hidden"
          animate="visible"
          custom={index}
          variants={cardVariants}
          whileHover={{ scale: 1.05, boxShadow: "0px 10px 30px rgba(0,0,0,0.2)" }}
        >
          <Image
            src={item.src}
            alt={item.title}
            width={600}
            height={400}
            className="object-cover w-full h-full"
            loading="lazy"
          />
          {/* <div className="absolute inset-0 bg-black/40 flex items-end p-4">
            <h3 className="text-white text-lg font-semibold">{item.title}</h3>
          </div> */}
        </motion.div>
      ))}
    </div>
  );
};

export default BentoGrid;

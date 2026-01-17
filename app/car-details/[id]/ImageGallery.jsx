"use client"
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/util";

const ImageGallery = ({ images, modelName }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef(null);
  const autoPlayIntervalRef = useRef(null);

  const startAutoPlay = () => {
    if (autoPlayIntervalRef.current) clearInterval(autoPlayIntervalRef.current);

    autoPlayIntervalRef.current = setInterval(() => {
      if (currentIndex < images.length - 1) {
        scrollToImage(currentIndex + 1);
      } else {
        scrollToImage(0);
      }
    }, 3000);
  };

  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      startAutoPlay();
    }

    return () => {
      if (autoPlayIntervalRef.current) clearInterval(autoPlayIntervalRef.current);
    };
  }, [currentIndex, images.length]);

  const scrollToImage = (index) => {
    setCurrentIndex(index);
    if (scrollRef.current) {
      const scrollAmount = index * scrollRef.current.offsetWidth;
      scrollRef.current.scrollTo({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const nextImage = () => {
    if (currentIndex < images.length - 1) {
      scrollToImage(currentIndex + 1);
    }
  };

  const prevImage = () => {
    if (currentIndex > 0) {
      scrollToImage(currentIndex - 1);
    }
  };

  return (
    <div className="relative w-full overflow-hidden">
    <div
  ref={scrollRef}
  className="flex w-full overflow-x-auto snap-x snap-mandatory hide-scrollbar md:hidden"
  style={{
    scrollbarWidth: 'none',
    msOverflowStyle: 'none',
    WebkitOverflowScrolling: 'touch',
  }}
>
  {images.map((image, index) => (
    <motion.div
      key={index}
      className="w-screen h-[60vw] flex-shrink-0 snap-center relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <img
        src={image}
        alt={`${modelName} - Image ${index + 1}`}
        className="absolute top-0 left-0 w-full h-full object-cover rounded-md"
      />
    </motion.div>
  ))}
</div>


      {/* Desktop Grid Gallery */}
      <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-4">
        {images.map((image, index) => (
          <motion.div
            key={index}
            className="h-72 overflow-hidden rounded-lg"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
          >
            <img
              src={image}
              alt={`${modelName} - Image ${index + 1}`}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            />
          </motion.div>
        ))}
      </div>

      {/* Navigation Arrows for Mobile */}
      <div className="absolute inset-0 flex items-center justify-between p-4 md:hidden">
        <button 
          onClick={prevImage} 
          disabled={currentIndex === 0}
          className={cn(
            "p-2 rounded-full bg-black/50 text-white",
            currentIndex === 0 ? "opacity-30" : "opacity-70 hover:opacity-100"
          )}
        >
          <ChevronLeft size={20} />
        </button>
        <button 
          onClick={nextImage} 
          disabled={currentIndex === images.length - 1}
          className={cn(
            "p-2 rounded-full bg-black/50 text-white",
            currentIndex === images.length - 1 ? "opacity-30" : "opacity-70 hover:opacity-100"
          )}
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Dot indicators for mobile */}
      <div className="flex justify-center gap-2 mt-4 md:hidden">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollToImage(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              currentIndex === index ? "bg-white w-4" : "bg-white/30"
            }`}
            aria-label={`Go to image ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageGallery;

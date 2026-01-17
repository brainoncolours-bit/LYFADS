"use client";
import React, { useState, useRef } from "react";
import Slider from "react-slick";
import Image from "next/image";
import { IconPlayerPause, IconPlayerPlay } from "@tabler/icons-react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const BentoGridGallery = ({ images }) => {
  const [isAutoplay, setIsAutoplay] = useState(true);
  const sliderRef = useRef(null);

  // Slider settings
  const settings = {
    dots: true,
    infinite: true,
    speed: 2000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: isAutoplay,
    autoplaySpeed: 4000,
    arrows: false,
    pauseOnHover: false,
  };

  // Toggle autoplay
  const toggleAutoplay = () => {
    setIsAutoplay((prev) => !prev);
    if (isAutoplay) {
      sliderRef.current.slickPause(); // Pause the slider
    } else {
      sliderRef.current.slickPlay(); // Resume the slider
    }
  };

  return (
    <div className="w-full overflow-hidden relative">
      {/* Pause/Play Button */}
      <button
        onClick={toggleAutoplay}
        className="absolute top-4 right-4 z-50 p-2 bg-black bg-opacity-50 rounded-full hover:bg-opacity-70 transition-all"
      >
        {isAutoplay ? (
          <IconPlayerPause className="w-6 h-6 text-white" />
        ) : (
          <IconPlayerPlay className="w-6 h-6 text-white" />
        )}
      </button>

      {/* Slider */}
      <Slider ref={sliderRef} {...settings}>
        {images.map((slide, index) => (
          <div key={index} className="relative h-screen">
            <div className="relative w-full h-full">
              <Image
                src={slide}
                fill
                alt="Image"
                className="object-cover opacity-50"
              />
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default BentoGridGallery;
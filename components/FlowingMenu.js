"use client";

import React from 'react';
import { gsap } from 'gsap';

function FlowingMenu() {

    const items = [
        { link: '#', text: 'BMW', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTq7adDYY0BlzKM8sfwSiOgfGh1_URjsxsxkw&s' },
        { link: '#', text: 'Audi', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRMssSgJkh0k8hIkh_6KhP-lP5wiXUK3I2fOQ&s' },
        { link: '#', text: 'Mercedes', image: 'data:image/jpeg;base64,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' },
        { link: '#', text: 'Tata', image: 'data:image/png;base64,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' }
      ];
      
  return (
    <div className="w-[100%] h-[600px] overflow-hidden bg-black">
      <nav className="flex flex-col h-full m-0 p-0">
        {items.map((item, idx) => (
          <MenuItem key={idx} {...item} />
        ))}
      </nav>
    </div>
  );
}

function MenuItem({ link, text, image }) {
  const itemRef = React.useRef(null);
  const marqueeRef = React.useRef(null);
  const marqueeInnerRef = React.useRef(null);

  const animationDefaults = { duration: 0.6, ease: 'expo' };

  const findClosestEdge = (mouseX, mouseY, width, height) => {
    const topEdgeDist = (mouseX - width / 2) ** 2 + mouseY ** 2;
    const bottomEdgeDist = (mouseX - width / 2) ** 2 + (mouseY - height) ** 2;
    return topEdgeDist < bottomEdgeDist ? 'top' : 'bottom';
  };

  const handleMouseEnter = (ev) => {
    if (!itemRef.current || !marqueeRef.current || !marqueeInnerRef.current) return;
    const rect = itemRef.current.getBoundingClientRect();
    const edge = findClosestEdge(
      ev.clientX - rect.left,
      ev.clientY - rect.top,
      rect.width,
      rect.height
    );

    gsap.timeline({ defaults: animationDefaults })
      .set(marqueeRef.current, { y: edge === 'top' ? '-101%' : '101%' })
      .set(marqueeInnerRef.current, { y: edge === 'top' ? '101%' : '-101%' })
      .to([marqueeRef.current, marqueeInnerRef.current], { y: '0%' });
  };

  const handleMouseLeave = (ev) => {
    if (!itemRef.current || !marqueeRef.current || !marqueeInnerRef.current) return;
    const rect = itemRef.current.getBoundingClientRect();
    const edge = findClosestEdge(
      ev.clientX - rect.left,
      ev.clientY - rect.top,
      rect.width,
      rect.height
    );

    gsap.timeline({ defaults: animationDefaults })
      .to(marqueeRef.current, { y: edge === 'top' ? '-101%' : '101%' })
      .to(marqueeInnerRef.current, { y: edge === 'top' ? '101%' : '-101%' });
  };

  const repeatedMarqueeContent = Array.from({ length: 4 }).map((_, idx) => (
    <React.Fragment key={idx}>
      <span className="text-[#060606] uppercase font-normal text-[4vh] leading-[1.2] p-[1vh_1vw_0]">
        {text}
      </span>
      <div
        className="w-[200px] h-[7vh] my-[2em] mx-[2vw] p-[1em_0] rounded-[50px] bg-cover bg-center"
        style={{ backgroundImage: `url(${image})` }}
      />
    </React.Fragment>
  ));

  return (
    <div className="flex-1 relative overflow-hidden text-center shadow-[0_-1px_0_0_#fff]" ref={itemRef}>
      <a
        className="flex items-center justify-center h-full relative cursor-pointer uppercase no-underline font-semibold text-white text-[4vh] hover:text-[#060606] focus:text-white focus-visible:text-[#060606]"
        href={link}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {text}
      </a>
      <div
        className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none bg-white translate-y-[101%]"
        ref={marqueeRef}
      >
        <div className="h-full w-[200%] flex" ref={marqueeInnerRef}>
          <div className="flex items-center relative h-full w-[200%] will-change-transform animate-marquee">
            {repeatedMarqueeContent}
          </div>
        </div>
      </div>
    </div>
  );
}

export default FlowingMenu;

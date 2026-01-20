"use client";
import { useState, useEffect } from 'react';
import FeaturesSection  from '@/components/FeaturesSection';
import HeroSection from '@/components/HeroSection';
import Layout from '@/components/Layout';
import { TestimonialCarousal } from '@/components/TestimonialCarousal';
import BrandCollabs from '@/components/BrandCollabs';
import TimelineSection from '@/components/MileStone';
// import SellOrExchange from '@/components/SellOrExchange';
import { ScrollTrigger } from 'gsap/all';
import {AnimatedTestimonials} from '@/components/animated-testimonials';
import ContactUs from '@/components/ContactUs';
import BentoGrid from '@/components/BentoGrid';

export default function Home() {
  // State to track if additional components should be rendered
  const [isDelayedComponentsVisible, setIsDelayedComponentsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsDelayedComponentsVisible(true);
  
      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 100); 
    }, 3000);
  
    return () => clearTimeout(timer);
  }, []);

  return (
    <Layout>
      <>

      <HeroSection />

      <BrandCollabs/>
      <AnimatedTestimonials/>
      <FeaturesSection />
      {/* <BentoGrid/> */}
      
      
      {isDelayedComponentsVisible && (
        <>
          {/* <SellOrExchange/> */}
          <TimelineSection/>
          {/* <TestimonialCarousal /> */}
          <ContactUs/>
        </>
      )}
      </>
    </Layout>
  );
}

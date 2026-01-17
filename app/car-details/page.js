"use client";

import { motion } from "framer-motion";
import Layout from "../../components/Layout";
import CarListing from "../../components/CarListing";
import { Spotlight } from "@/components/animated-svg/SpotLight";
import { cn } from "@/lib/util";
import { poppins } from "@/lib/font";
import { ConnectUs } from "./ConnectUs";
export default function CarDetailsPage() {
  return (
    <Layout>
      {/* Hero Section */}
      <div className="relative flex h-fit w-full overflow-hidden  bg-black/[0.96] antialiased md:items-center md:justify-center">
      <div
        className={cn(
          "pointer-events-none absolute inset-0 [background-size:40px_40px] select-none",
          "[background-image:linear-gradient(to_right,#171717_1px,transparent_1px),linear-gradient(to_bottom,#171717_1px,transparent_1px)]",
        )}
      />
 
      <Spotlight
        className="-top-40 left-0 md:-top-20 md:left-60"
        fill="white"
      />
      <div className="relative  z-10 mx-auto w-full max-w-7xl p-4 pt-20 md:pt-0 flex flex-col justify-center">
       
       <div className="h-[25rem] md:h-[40rem] flex flex-col justify-center">

        <h1 className="mx-4 md:mx-auto bg-opacity-50 bg-gradient-to-b from-neutral-50 to-neutral-400 bg-clip-text text-start md:text-center text-4xl font-bold text-transparent md:text-7xl">
          Every Car Tells a Story<br />  Choose Yours. 
        </h1>
        <p className={`${poppins.className} mx-4 md:mx-auto mt-6 max-w-lg text-start md:text-center text-base font-normal text-new-white`}>
          Start a new adventure behind the wheel of a car that speaks to your lifestyle and ambition.
          From first drives to cross-country adventures, find the car that&apos;s ready to start your next chapter.
        </p>
       </div>
      <CarListing />
      <ConnectUs/>



      </div>


      
    </div>

      {/* Car Listing Section */}
    </Layout>
  );
}


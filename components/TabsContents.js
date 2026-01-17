"use client";

import Image from "next/image";
import { Tabs } from "./Tabs";
import BentoGridGallery from "./utilities/BentoGridGallery";
import CarEnquiryForm from "./utilities/CarEnquiryForm";

export function TabsContents() {

  const images = ["/car1.jpg","/car2.jpg","/car3.jpg","/car4.jpg","/car5.jpg","/car6.jpg",];

  const tabs = [
    // {
    //   title: "Gallery",
    //   value: "gallery",
    //   content: (
    //     <div
    //       className="w-full overflow-hidden relative h-full rounded-2xl text-xl md:text-4xl font-bold text-white bg-gradient-to-br from-new-black to-black">
    //       <BentoGridGallery images={images} />
    //     </div>
    //   ),
    // },
    {
      title: "Enquire",
      value: "enquire",
      content: (
        <div
          className="w-fit items-center overflow-hidden relative h-fit rounded-2xl text-xl md:text-4xl font-bold text-white bg-gradient-to-br from-new-black to-black">
          <CarEnquiryForm/>
        </div>
      ),
    },
  ];

  return (
    (<div
      className="h-[20rem] w-full md:w-[75%] md:h-[40rem] [perspective:1000px] relative b flex flex-col max-w-5xl items-start justify-start">
      <Tabs tabs={tabs} />
    </div>)
  );
}



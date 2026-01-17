"use client";
import {
  IconArrowLeft,
  IconArrowRight,
  IconBolt,
  IconCalendar,
  IconGasStation,
  IconRoad,
  IconUser,
} from "@tabler/icons-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import { BorderButton } from "./utilities/BorderButton";
import { useRouter } from "next/navigation";
import { ArrowRightCircle } from "lucide-react";
import { useToast } from "./ToastProvider";
import { supabase } from "@/lib/supabaseClient";
import { poppins, russo } from "@/lib/font";
import { useInView } from 'react-intersection-observer';

export const AnimatedTestimonials = ({ autoplay = true }) => {
  const [active, setActive] = useState(0);
  const [isLoading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const toast = useToast();
  const router = useRouter();

  const { ref, inView } = useInView({
  threshold: 0.5, // Adjust as needed
});
  const handleNavigate = (car) => () => {
    sessionStorage.setItem("selectedCar", JSON.stringify(car));
    router.push(`/car-details/${car?.model}`);
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("cars")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        toast.error("Please refresh");
      } else {
        let filterData=data.filter(item=>item.featured)
        setItems(filterData || []);
      }
    } catch (error) {
      toast.error("An error occurred while fetching cars collection.");
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    setActive((prev) => (prev + 1) % items.length);
  };

  const handlePrev = () => {
    setActive((prev) => (prev - 1 + items.length) % items.length);
  };

  const isActive = (index) => index === active;

  const randomRotateY = () => Math.floor(Math.random() * 21) - 10;

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
  if (autoplay && items.length > 0 && inView) {
    const interval = setInterval(handleNext, 5000);
    return () => clearInterval(interval);
  }
}, [autoplay, items.length, inView]);

  return (
    <div ref={ref} className={`bg-black flex flex-col mx-auto antialiased font-sans px-6 md:px-8 lg:px-12 py-20 overflow-x-hidden ${russo.className}`}>
      {items.length > 0 ? (
        <div className="relative grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20">
          <div>
            <div className="relative h-80 w-full">
              <AnimatePresence>
                {items.map((testimonial, index) => (
                  <motion.div
                    key={index}
                    initial={{
                      opacity: 0,
                      scale: 0.9,
                      z: -100,
                      rotate: randomRotateY(),
                    }}
                    animate={{
                      opacity: isActive(index) ? 1 : 0.7,
                      scale: isActive(index) ? 1 : 0.95,
                      z: isActive(index) ? 0 : -100,
                      rotate: isActive(index) ? 0 : randomRotateY(),
                      zIndex: isActive(index) ? 990 : items.length + 2 - index,
                      y: isActive(index) ? [0, -80, 0] : 0,
                    }}
                    exit={{
                      opacity: 0,
                      scale: 0.9,
                      z: 100,
                      rotate: randomRotateY(),
                    }}
                    transition={{
                      duration: 0.4,
                      ease: "easeInOut",
                    }}
                    className="absolute inset-0 origin-bottom"
                  >
                    <Image
                      src={testimonial.image_url}
                      alt={testimonial.model}
                      width={500}
                      height={500}
                      draggable={false}
                      className="h-full w-[100%] mx-auto md:w-full rounded-3xl object-cover object-center"
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          <div className="flex justify-between flex-col py-4 px-2 md:px-0">
            <motion.div
              key={active}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
            >
              <h3 className={`text-2xl font-bold text-brand-color ${russo.className}`}>
                {items[active]?.variant || "N/A"}
              </h3>
              <p className="text-sm text-gray-500 ">
                {items[active]?.transmission || "N/A"}
              </p>

              <div className="grid grid-cols-2 gap-4 mt-5 md:mt-10">
                <div className="flex items-center text-neutral-400">
                  <IconCalendar className="w-5 h-5 mr-2 text-brand-color" />
                  <span>{items[active]?.year || "N/A"}</span>
                </div>
                <div className="flex items-center text-neutral-400">
                  <IconUser className="w-5 h-5 mr-2 text-brand-color" />
                  <span>{items[active]?.owners || "N/A"}</span>
                </div>
                <div className="flex items-center text-neutral-400">
                  <IconRoad className="w-5 h-5 mr-2 text-brand-color" />
                  <span>
                    {items[active]?.kilometers?.toLocaleString() || "0"} km
                  </span>
                </div>
                <div className="flex items-center text-neutral-400">
                  {items[active]?.fuelType === "Electric" ? (
                    <IconBolt className="w-5 h-5 mr-2 text-brand-color" />
                  ) : (
                    <IconGasStation className="w-5 h-5 mr-2 text-brand-color" />
                  )}
                  <span>{items[active]?.fueltype}</span>
                </div>
              </div>

              <BorderButton
                containerClassName="rounded-full mt-6"
                as="button"
                onClick={handleNavigate(items[active])}
                className="bg-black text-new-white px-4 py-2 rounded-full hover:bg-black/50 transition-all duration-300"
              >
                <span>Enquire</span>
              </BorderButton>
            </motion.div>

            <div className="flex gap-4 pt-6 md:pt-0">
              <button
                onClick={handlePrev}
                className="h-7 w-7 rounded-full bg-new-white flex items-center justify-center group/button"
              >
                <IconArrowLeft className="h-5 w-5 text-black group-hover/button:rotate-12 transition-transform duration-300" />
              </button>
              <button
                onClick={handleNext}
                className="h-7 w-7 rounded-full bg-new-white flex items-center justify-center group/button"
              >
                <IconArrowRight className="h-5 w-5 text-black group-hover/button:-rotate-12 transition-transform duration-300" />
              </button>
            </div>
          </div>
        </div>
      ) :
      
      isLoading?(
       <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 animate-pulse">
  <div className="relative h-80 w-full bg-neutral-800 rounded-3xl"></div>
  <div className="flex flex-col justify-between py-4 px-2 md:px-0 space-y-4">
    <div className="space-y-2">
      <div className="h-6 w-1/2 bg-neutral-700 rounded"></div>
      <div className="h-4 w-1/3 bg-neutral-700 rounded"></div>
    </div>
    <div className="grid grid-cols-2 gap-4 mt-5">
      {[...Array(4)].map((_, idx) => (
        <div key={idx} className="flex items-center gap-2">
          <div className="h-5 w-5 bg-neutral-700 rounded-full"></div>
          <div className="h-4 w-20 bg-neutral-700 rounded"></div>
        </div>
      ))}
    </div>
    <div className="h-10 w-32 bg-neutral-700 rounded-full mt-6"></div>
    <div className="flex gap-4 pt-6">
      <div className="h-7 w-7 rounded-full bg-neutral-700"></div>
      <div className="h-7 w-7 rounded-full bg-neutral-700"></div>
    </div>
  </div>
</div>

      )
    :
    <div className="flex flex-col items-center justify-center text-center text-white py-20">
  <div className="w-24 h-24 mb-6">
  
  </div>
  <h2 className="text-2xl font-semibold mb-2 text-brand-color">No Cars Found</h2>
  <p className="text-gray-400 max-w-md">
    Something went wrong while loading the cars collection. Please try refreshing the page or check back later.
  </p>
  <button
    onClick={() => location.reload()}
    className="mt-6 px-6 py-2 bg-brand-color text-white rounded-full hover:bg-brand-color/80 transition"
  >
    Refresh
  </button>
</div>

    }

      <motion.h2
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ amount: 0.5 }}
        onClick={() => router.push("/car-details")}
        className="mt-20 md:mt-40 cursor-pointer mx-auto inline-flex items-center gap-2 px-6 py-3 border border-brand-color rounded-full text-xl font-bold hover:bg-gray-600 hover:text-white transition duration-300"
      >
        <span className="text-new-white">More</span>
        <span className="text-brand-color">Cars</span>
        <ArrowRightCircle size={20} className="mt-0.5 text-brand-color" />
      </motion.h2>
    </div>
  );
};

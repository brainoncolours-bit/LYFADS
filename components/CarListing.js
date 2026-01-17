"use client";
import React, { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { motion } from "framer-motion";
import Image from "next/image";
import { BorderButton } from "./utilities/BorderButton";
import {
  IconCalendar,
  IconUser,
  IconRoad,
  IconGasStation,
  IconBolt,
} from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient"; 
import { useToast } from "./ToastProvider";

export default function CarListing() {
  const router = useRouter();
  const toast = useToast();


  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    setError(false);
    try {
      const { data, error } = await supabase
        .from("cars")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        setError(true);
        toast.error("Please refresh the page.");
      } else if (!data || data.length === 0) {
        setCars([]);
      } else {
        setCars(data || []);
      }
    } catch (e) {
      setError(true);
      toast.error("An error occurred while fetching cars collection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleNavigate = (car) => () => {
    router.push(`/car-details/${car?.variant}`);
    sessionStorage.setItem("selectedCar", JSON.stringify(car));
  };

  // Skeleton loader for car cards
  const SkeletonCard = () => (
    <div className="bg-neutral-900 rounded-lg shadow-lg animate-pulse h-[320px]" />
  );

  return (
    <>
      <div className="min-h-screen py-12">
        <div className="container mx-auto">
          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          )}

          {!loading && error && (
            <div className="text-center text-red-500 text-lg font-semibold">
              Something went wrong while fetching cars. Please refresh the page.
            </div>
          )}

          {!loading && !error && cars.length === 0 && (
            <div className="text-center text-neutral-400 text-lg font-semibold">
              No featured cars found. Please check back later or refresh.
            </div>
          )}

          {!loading && !error && cars.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {cars.map((car, index) => (
                <motion.div
                  key={car.id}
                  className="bg-black rounded-lg shadow-lg overflow-hidden border border-neutral-800 hover:border-brand-color transition-all duration-300"
                >
                  {/* Car Image */}
                  <motion.div
                    initial={{ opacity: 0.4, scale: 1.2 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, delay: index * 0.1, ease: "anticipate" }}
                    viewport={{ amount: 0.2 }}
                    className="relative h-48 w-full"
                  >
                    <Image
                      src={car.image_url || "/herBg.jpg"}
                      alt={car.variant}
                      fill
                      className="object-cover"
                      priority={index < 3} // Prioritize first 3 images for faster load
                    />
                  </motion.div>

                  {/* Car Details */}
                  <div className="p-6">
                    <h2 className="text-2xl font-bold mb-4 text-new-white">
                      {car.variant}
                    </h2>

                    {/* Additional Details - 2 per line */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="flex items-center text-neutral-400">
                        <IconCalendar className="w-5 h-5 mr-2 text-brand-color" />
                        <span>{car.year}</span>
                      </div>
                      <div className="flex items-center text-neutral-400">
                        <IconUser className="w-5 h-5 mr-2 text-brand-color" />
                        <span>{car.owners}</span>
                      </div>
                      <div className="flex items-center text-neutral-400">
                        <IconRoad className="w-5 h-5 mr-2 text-brand-color" />
                        <span>{car.kilometers} km</span>
                      </div>
                      <div className="flex items-center text-neutral-400">
                        {car.fuelType === "Electric" ? (
                          <IconBolt className="w-5 h-5 mr-2 text-brand-color" />
                        ) : (
                          <IconGasStation className="w-5 h-5 mr-2 text-brand-color" />
                        )}
                        <span>{car.fueltype}</span>
                      </div>
                    </div>

                    {/* Enquire Button */}
                    <BorderButton
                      containerClassName="rounded-full"
                      as="button"
                      onClick={handleNavigate(car)}
                      className="bg-black text-new-white px-4 py-2 rounded-full hover:bg-black/50 transition-all duration-300"
                    >
                      <span>Enquire</span>
                    </BorderButton>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

"use client"
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import ImageGallery from "./ImageGallery";
import SpecificationsGrid from "./SpecificationGrid";
import DescriptionSection from "./DescriptionSection";
import EnquiryForm from "./EnquiryForm";
import Layout from "@/components/Layout";
import { useRouter } from "next/navigation";
import { ConnectUs } from "../ConnectUs";
import { poppins } from "@/lib/font";


const CarDetailsPage = () => {
  const router = useRouter();
  const [carData, setCarData] = useState(null);

    useEffect(() => {
    const carDataFromSession = sessionStorage.getItem("selectedCar");
    if (carDataFromSession) {
      try {
        const parsedData = JSON.parse(carDataFromSession);
        setCarData(parsedData);
      } catch (error) {
        // If parsing fails, redirect
        router.push("/car-details");
      }
    } else {
      // If no data, redirect
      router.push("/car-details");
    }
  }, [router]);


  if (!carData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-red-500">Failed to load car details.</div>
      </div>
    );
  }

  return (
    <Layout>

    <div className={`min-h-screen bg-black text-white ${poppins.className}`}>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 z-0 opacity-30"
          style={{
            backgroundImage: `url(https://images.unsplash.com/photo-1493238792000-8113da705763?auto=format&fit=crop&w=1470&q=80)`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "blur(8px)",
          }}
        ></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold">{carData.model}</h1>
            <p className="mt-2 text-xl md:text-2xl text-brand-color">{carData.variant}</p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-20">
        {/* Image Gallery */}
        <section className="mb-12">
          <ImageGallery images={carData.images} modelName={carData.model} />
        </section>

        {/* Specifications */}
        <section>
          <SpecificationsGrid
            year={carData.year}
            fueltype={carData.fueltype}
            kilometers={carData.kilometers}
            owners={carData.owners}
            transmission={carData.transmission}
            price={carData.price}
          />
        </section>

        {/* Description */}
        <DescriptionSection description={carData.description} />

        {/* Enquiry Form */}
        <EnquiryForm carModel={carData} />
        <ConnectUs/>
      </div>
    </div>

    </Layout>

  );
};

export default CarDetailsPage;

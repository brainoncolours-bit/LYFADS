"use client"
import { motion } from "framer-motion";
import { Calendar, Car, Fuel, Users, Gauge } from "lucide-react";
import React from "react";

const SpecificationsGrid = ({
  year,
  fueltype,
  kilometers,
  owners,
  transmission,
  price,
}) => {
  const specifications = [
    { label: "Year", value: year, icon: <Calendar size={24}/> },
    { label: "Fuel Type", value: fueltype, icon: <Fuel size={24}/> },
    { label: "Kilometers", value: kilometers, icon: <Gauge size={24}/> },
    { label: "Owners", value: owners, icon: <Users size={24}/> },
    { label: "Transmission", value: transmission, icon: <Car size={24}/> },
    {
      label: "Price",
      value: price,
      icon: <span className="text-xl font-bold">₹</span>,
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-8">
      {specifications.map((spec, index) => (
        <motion.div
          key={spec.label}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          viewport={{ once: true }}
          className="bg-zinc-900 p-4 rounded-lg flex flex-col items-center text-center"
        >
          <div className="mb-2 text-brand-color">
            {spec.icon}
          </div>
          <h3 className="text-sm text-gray-400 mb-1">{spec.label}</h3>
          <p className="font-medium text-white">{spec.value}</p>
        </motion.div>
      ))}
    </div>
  );
};

export default SpecificationsGrid;

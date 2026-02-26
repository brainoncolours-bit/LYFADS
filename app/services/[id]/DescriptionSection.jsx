"use client"
import { useState } from "react";
import { motion } from "framer-motion";

const DescriptionSection = ({ description }) => {
  const [expanded, setExpanded] = useState(false);

  const isLongDescription = description.length > 300;
  const displayText = isLongDescription && !expanded
    ? `${description.substring(0, 300)}...`
    : description;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="mt-8"
    >
      <div className="bg-zinc-900 rounded-lg p-5">
        <p className="text-gray-300 leading-relaxed">{displayText}</p>

        {isLongDescription && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="mt-2 text-brand-color hover:text-purple-300 text-sm font-medium focus:outline-none"
          >
            {expanded ? "Show Less" : "Read More"}
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default DescriptionSection;

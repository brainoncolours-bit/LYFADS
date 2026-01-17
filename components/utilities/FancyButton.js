import React from "react";
import { ArrowUp } from "lucide-react"; // or any Lucide icon

const FancyButton = ({ label = "Explore", icon: Icon = ArrowUp, onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex justify-center text-brand-color gap-2 items-center w-full shadow-xl text-lg bg-gray-50 backdrop-blur-md lg:font-semibold isolation-auto border-gray-50 before:absolute before:w-full before:transition-all before:duration-700 before:hover:w-full before:-left-full before:hover:left-0 before:rounded-full before:bg-brand-color hover:text-gray-50 before:-z-10 before:aspect-square before:hover:scale-150 before:hover:duration-700 relative z-10 px-4 py-2 overflow-hidden border-2  group"
    >
      {label}
    </button>
  );
};

export default FancyButton;

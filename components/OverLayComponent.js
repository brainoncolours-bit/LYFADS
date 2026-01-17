import { motion } from 'framer-motion';
import Image from 'next/image';

const OverlayComponent = () => {
  return (
    <motion.div
      initial={{ bottom: "0%", height: "100vh", opacity: 1 }}
      animate={{
        bottom: "100%",
        opacity: 0,
      }}
      transition={{
        duration: 2,
        ease: "easeInOut",
        delay: 2,
      }}
      className="fixed w-full flex justify-center items-center z-[9999] bg-black pointer-events-none"
    >
    </motion.div>
  );
};

export default OverlayComponent;

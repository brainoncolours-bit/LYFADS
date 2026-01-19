import { motion } from 'framer-motion';
import Image from 'next/image';

const OverlayComponent = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{
        opacity: 0,
      }}
      transition={{
        duration: 0,
      }}
      className="fixed w-full flex justify-center items-center z-[9999] bg-transparent pointer-events-none"
    >
    </motion.div>
  );
};

export default OverlayComponent;

// Utilities/useDeviceType.js
import { useEffect, useState } from "react";

// Enum inside the same file
export const DeviceType = {
  isMobile: 'mobile',
  DESKTOP: 'desktop',
};

// Function to detect device type
const detectDeviceType = () => {
  if (typeof window !== "undefined") {
    return window.innerWidth <= 768 ? DeviceType.isMobile : DeviceType.DESKTOP;
  }
  return DeviceType.DESKTOP; // Default to desktop on SSR
};

// The actual hook you will use
const useDeviceType = () => {
  const [deviceType, setDeviceType] = useState(DeviceType.DESKTOP);

  useEffect(() => {
    const updateDeviceType = () => {
      setDeviceType(detectDeviceType());
    };

    updateDeviceType(); // Run once on mount
    window.addEventListener('resize', updateDeviceType);

    return () => window.removeEventListener('resize', updateDeviceType);
  }, []);

  return deviceType==="mobile";
};

export default useDeviceType;

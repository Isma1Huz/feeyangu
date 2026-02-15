import { useEffect, useState } from "react";

const BREAKPOINTS = {
  mobile: 640,
  tablet: 1024,
};

export function useDevice() {
  const [device, setDevice] = useState<"mobile" | "tablet" | "desktop">("desktop");

  useEffect(() => {
    const checkSize = () => {
      const width = window.innerWidth;

      if (width < BREAKPOINTS.mobile) {
        setDevice("mobile");
      } else if (width < BREAKPOINTS.tablet) {
        setDevice("tablet");
      } else {
        setDevice("desktop");
      }
    };

    // Initial check
    checkSize();

    // Listen to window resizing
    window.addEventListener("resize", checkSize);
    return () => window.removeEventListener("resize", checkSize);
  }, []);

  return {
    device,
    isMobile: device === "mobile",
    isTablet: device === "tablet",
    isMobileOrTablet: device !== "desktop",
  };
}

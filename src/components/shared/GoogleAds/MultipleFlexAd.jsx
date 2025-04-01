import React, { useEffect, useRef } from "react";

const MultipleFlexAd = ({ client, slot, format = "auto", className = "" }) => {
  const adRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleAdLoad = () => {
      // Reset any problematic styles Google Ads might apply
      if (adRef.current) {
        adRef.current.style.height = '';
        adRef.current.style.minHeight = '250px';
      }
      if (containerRef.current) {
        containerRef.current.style.height = '250px';
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            try {
              if (window.adsbygoogle && adRef.current) {
                if (!adRef.current.hasAttribute("data-ad-status")) {
                  // Add load event listener before pushing the ad
                  adRef.current.addEventListener('load', handleAdLoad);
                  window.adsbygoogle.push({});
                }
              }
            } catch (e) {
              console.error("AdSense error: ", e);
            }
            observer.disconnect();
          }
        });
      },
      { threshold: 0.5 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
      if (adRef.current) {
        adRef.current.removeEventListener('load', handleAdLoad);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        textAlign: "center",
        margin: "20px 0",
        height: "250px", // Fixed height instead of minHeight
        overflow: "hidden",
        position: "relative", // Helps contain the ad
        backgroundColor: "transparent" // Optional: prevent flash of unstyled content
      }}
    >
      <ins
        ref={adRef}
        className={`adsbygoogle ${className}`}
        style={{
          display: "block",
          height: "250px",
          width: "100%",
          position: "absolute", // Prevents layout shifts
          top: 0,
          left: 0
        }}
        data-ad-client={client}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      ></ins>
    </div>
  );
};

export default MultipleFlexAd;
import React, { useEffect, useRef } from "react";

const MultipleFlexAd = ({ client, slot, format = "auto", className = "" }) => {
  const adRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            try {
              if (window.adsbygoogle && adRef.current) {
                if (!adRef.current.hasAttribute("data-ad-status")) {
                  window.adsbygoogle.push({});
                }
              }
            } catch (e) {
              console.error("AdSense error: ", e);
            }
            observer.disconnect(); // Stop observing after loading
          }
        });
      },
      { threshold: 0.5 } // Trigger when at least 50% of the ad is visible
    );

    if (adRef.current) {
      observer.observe(adRef.current);
    }

    return () => observer.disconnect(); // Cleanup observer on unmount
  }, []);


  return null;  

  return (
    <div
      ref={adRef}
      style={{
        textAlign: "center",
        margin: "20px 0",
        minHeight: "250px", // Prevents height collapsing
        overflow: "hidden",  // Stops unwanted scroll jumps
      }}
    >
      <ins
        className={`adsbygoogle ${className}`}
        style={{ display: "block", minHeight: "250px" }}
        data-ad-client={client}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      ></ins>
    </div>
  );
};

export default MultipleFlexAd;

import React, { useEffect, useRef } from "react";
import {AD_CONFIG} from "../../../assets/constants/ad.constant";


const AdBanner = ({ id, adConfig }) => {
  const adRef = useRef(null);
  const containerRef = useRef(null);
  const adConfigData = AD_CONFIG[adConfig] || AD_CONFIG["default"];
  const { client, slot, format, responsive } = adConfigData;
  useEffect(() => {
    const handleAdLoad = () => {
      // Fix for height issues after ad loads
      if (adRef.current) {
        adRef.current.style.height = '';
        adRef.current.style.minHeight = '250px';
      }
    };

    if (window.adsbygoogle && adRef.current) {
      if (!adRef.current.hasAttribute("data-ad-status")) {
        try {
          // Add event listener for when ad loads
          adRef.current.addEventListener('load', handleAdLoad);
          window.adsbygoogle.push({});
        } catch (e) {
          console.error("AdSense error:", e);
        }
      }
    }

    return () => {
      if (adRef.current) {
        adRef.current.removeEventListener('load', handleAdLoad);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        margin: "30px 0",
        padding: "0 20px",
        height: "250px", // Fixed height instead of minHeight
        overflow: "hidden",
        position: "relative", // Helps contain the ad
        textAlign: "center"
      }}
      key={`ad-${new Date().getTime()}`} // Unique key to force re-render
    >
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{
          display: "block",
          height: "250px",
          width: "100%",
          position: "absolute" // Prevents layout shifts
        }}
        data-ad-client={client}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive}
      ></ins>
    </div>
  );
};

export default AdBanner;
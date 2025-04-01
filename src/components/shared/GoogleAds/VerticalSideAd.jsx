import React, { useEffect, useRef } from "react";

const VerticalSideAd = ({ id }) => {
  const adRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleAdLoad = () => {
      if (adRef.current) {
        // Reset height to allow ad to determine its own size
        adRef.current.style.height = '';
        adRef.current.style.minHeight = '250px';
        
        // // Adjust container height based on ad content
        // if (containerRef.current && adRef.current.offsetHeight > 0) {
        //   containerRef.current.style.height = `${adRef.current.offsetHeight}px`;
        // }
      }
    };

    if (window.adsbygoogle && adRef.current) {
      if (!adRef.current.hasAttribute("data-ad-status")) {
        try {
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
  }, [id]); // Added id to dependency array to reload ad if id changes

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        margin: "30px 0",
        padding: "0 20px",
        height: "400px", // Fixed height instead of minHeight
        overflow: "hidden",
        position: "relative", // Helps contain the ad
        textAlign: "center"
      }}
      key={`ad-${id}`}
    >
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{
          display: "block",
          width: "100%",
          height: "400px",
          position: "absolute" // Prevents layout shifts
        }}
        data-ad-client="ca-pub-3758217602745916"
        data-ad-slot="1429136314"
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>
    </div>
  );
};

export default VerticalSideAd;
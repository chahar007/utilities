import React, { useEffect, useRef } from "react";

const AdBanner = ({ id }) => {
  const adRef = useRef(null);
  const containerRef = useRef(null);

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
      key={`ad-${id}`}
    >
     <ins class="adsbygoogle"
     className="adsbygoogle"
     style={{
       display: "block",
       height: "250px",
       width: "100%",
       position: "absolute" // Prevents layout shifts
     }}
     data-ad-client="ca-pub-3758217602745916"
     data-ad-slot="1666478451"
     data-ad-format="auto"
     data-full-width-responsive="true"></ins>

    </div>
  );
};

export default AdBanner;
import React, { useEffect, useRef } from "react";

const AdBanner = ({ id }) => {
    const adRef = useRef(null);
  
    useEffect(() => {
      // Ensure Google Ads script is available before pushing
      if (window.adsbygoogle && adRef.current) {
        if (!adRef.current.hasAttribute("data-ad-status")) {
          try {
            window.adsbygoogle.push({});
          } catch (e) {
            console.error("AdSense error:", e);
          }
        }
      }
    }, []);
  
    return (
      <div
        style={{
          width: "100%",
          margin: "30px 0",
          padding: "0 20px",
          minHeight: "250px", // Prevents auto height issue
          overflow: "hidden",  // Stops scrolling issues
        }}
        key={`ad-${id}`}
      >
        <ins
          ref={adRef}
          className="adsbygoogle"
          style={{ display: "block", minHeight: "250px" }}
          data-ad-client="ca-pub-3758217602745916"
          data-ad-slot="6025785041"
          data-ad-format="auto"
          data-full-width-responsive="true"
        ></ins>
      </div>
    );
  };
  
  export default AdBanner;
  
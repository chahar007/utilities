
import { useEffect, useState } from "react";

type AdSpotProps = {
  size: string;
  position: string;
};

export function AdSpot({ size, position }: AdSpotProps) {
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Optimize ad size for desktop/mobile
  const displaySize = isDesktop ? size : size.includes("970") || size.includes("728") 
    ? "320x100" 
    : "300x250";

  return (
    <div className="my-6 w-full">
      <div className="bg-gray-200 dark:bg-gray-800 border border-dashed border-gray-400 dark:border-gray-600 rounded-lg p-4 text-center">
        <p className="text-gray-800 dark:text-gray-200 text-sm font-medium">
          AD SPACE: {displaySize} - {position}
        </p>
      </div>
    </div>
  );
}

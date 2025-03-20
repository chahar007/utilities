
import { useEffect, useState } from "react";
import { Users } from "lucide-react";

export function ViewerCounter() {
  const [viewerCount, setViewerCount] = useState(10000);
  const MAX_VIEWERS = 17000;

  useEffect(() => {
    // Increment viewer count randomly
    const interval = setInterval(() => {
      setViewerCount(prev => {
        // Random increment between 1-10
        const increment = Math.floor(Math.random() * 10) + 1;
        // Don't exceed max viewers
        return Math.min(prev + increment, MAX_VIEWERS);
      });
    }, 3000); // Update every 3 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-2 text-sm font-medium bg-red-600 text-white px-3 py-1.5 rounded-full shadow-sm">
      <Users className="h-4 w-4" />
      <span className="animate-pulse">{viewerCount.toLocaleString()} live viewers</span>
    </div>
  );
}

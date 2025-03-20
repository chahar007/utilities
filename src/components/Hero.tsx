
import { ArrowDown } from "lucide-react";

export function Hero() {
  const scrollToContent = () => {
    const contentElement = document.getElementById("content");
    if (contentElement) {
      contentElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative h-16 flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 bg-gradient-to-br from-ipl-blue/20 via-ipl-purple/10 to-ipl-red/20 dark:from-ipl-blue/10 dark:via-ipl-purple/5 dark:to-ipl-red/10"
        style={{
          backgroundImage: "url('/pattern.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundBlendMode: "overlay",
        }}
      />
      
      <div
        className="absolute bottom-1 left-1/2 transform -translate-x-1/2 cursor-pointer animate-bounce"
        onClick={scrollToContent}
      >
        <ArrowDown className="h-5 w-5 text-gray-600 dark:text-gray-400" />
      </div>
    </section>
  );
}

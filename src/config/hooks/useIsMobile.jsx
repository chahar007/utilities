
import { useState, useEffect } from 'react';

const useIsMobile = (breakpoint = 768) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= breakpoint);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= breakpoint);
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial check on mount

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [breakpoint]); // Dependency on `breakpoint` for flexibility

  return isMobile;
};

export default useIsMobile;

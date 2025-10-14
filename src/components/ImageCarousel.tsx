import React, { useState, useEffect } from "react";

const carouselItems = [
  "bg-red-500",
  "bg-blue-500",
  "bg-green-500",
  "bg-yellow-500",
  "bg-purple-500",
  "bg-pink-500",
];

const ImageCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselItems.length);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  const handleCenterItemClick = () => {
    console.log(`Center item ${currentIndex + 1} clicked!`);
  };

  // The function expects an object { itemIndex: number } as its argument
  const getItemStyle = ({
    itemIndex,
  }: {
    itemIndex: number;
  }): React.CSSProperties => {
    const len = carouselItems.length;
    const centerIndex = currentIndex;
    const leftIndex = (currentIndex - 1 + len) % len;
    const rightIndex = (currentIndex + 1) % len;

    // Check if we're on mobile (simplified approach using window width)
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const isTablet = typeof window !== 'undefined' && window.innerWidth >= 768 && window.innerWidth < 1024;

    // Explicitly typing the 'style' object with React.CSSProperties
    let style: React.CSSProperties = {
      transition: "all 1s ease-in-out",
      opacity: 0,
      transform: "scale(0.5)",
      zIndex: 0,
      position: "absolute",
    };

    if (itemIndex === centerIndex) {
      style = {
        ...style,
        opacity: 1,
        transform: isMobile ? "translateX(0) scale(1)" : "translateX(0) scale(1.2)",
        zIndex: 10,
        cursor: "pointer",
      };
    } else if (itemIndex === leftIndex) {
      style = {
        ...style,
        opacity: isMobile ? 0.4 : 0.6,
        transform: isMobile 
          ? "translateX(-60%) scale(0.6)" 
          : isTablet 
            ? "translateX(-70%) scale(0.7)"
            : "translateX(-80%) scale(0.8)",
        zIndex: 5,
      };
    } else if (itemIndex === rightIndex) {
      style = {
        ...style,
        opacity: isMobile ? 0.4 : 0.6,
        transform: isMobile 
          ? "translateX(60%) scale(0.6)" 
          : isTablet 
            ? "translateX(70%) scale(0.7)"
            : "translateX(80%) scale(0.8)",
        zIndex: 5,
      };
    }

    return style;
  };

  return (
    <div
      className="relative flex items-center justify-center w-full lg:justify-end lg:mr-52 px-4 sm:px-8 md:px-12 lg:px-0"
      style={{ height: "60vh", minHeight: "300px", maxHeight: "500px" }}
    >
      {carouselItems.map((color, index) => (
        <div
          key={index}
          className={`border-2 border-gray-400 shadow-xl ${color}`}
          style={{
            height: "clamp(200px, 40vh, 50vh)",
            width: "clamp(150px, 30vh, 35vh)",
            // FIX: Pass an object to the function call as expected
            ...getItemStyle({ itemIndex: index }),
          }}
          onClick={() => {
            if (index === currentIndex) {
              handleCenterItemClick();
            }
          }}
        >
          <div className="flex items-center justify-center h-full text-white text-2xl sm:text-3xl md:text-4xl font-bold">
            {index + 1}
          </div>
        </div>
      ))}
    </div>
  );
};
export default ImageCarousel;

"use client";

import React, { useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";

const PastelBackground = () => {
  // Use state to store random values to avoid hydration mismatch
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Function to generate random positions
  const getRandomPositions = (count: number) => {
    if (!isClient) return [];
    // Generate random positions between -100% and 100% of the viewport relative to start
    // We want full screen coverage.
    // Since blobs start at specific corners, we need to push them far.
    // Using viewport units (vw, vh) in strings for framer motion is convenient
    const positions = [];
    for (let i = 0; i < count; i++) {
        // Random x between -100vw and 50vw
        const x = `${Math.floor(Math.random() * 150 - 100)}vw`;
        // Random y between -100vh and 100vh
        const y = `${Math.floor(Math.random() * 200 - 100)}vh`;
        // Random scale between 0.8 and 1.2 to add breathing effect
        const scale = 0.8 + Math.random() * 0.4;
        positions.push({ x, y, scale });
    }
    return positions;
  };
  
  // Transition settings for smooth, continuous movement
  const transition = {
    duration: 20, // Slow movement
    ease: "easeInOut",
    repeat: Infinity,
    repeatType: "mirror" as const,
  };

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden bg-[#F2F1EF]">
      {/* Noise Overlay */}
      <div className="absolute inset-0 z-[2] pointer-events-none opacity-[0.6] mix-blend-overlay">
        <svg className="w-full h-full">
            <filter id="noise">
                <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
            </filter>
            <rect width="100%" height="100%" filter="url(#noise)" />
        </svg>
      </div>

      {/* Gradient Blobs Container - High Blur */}
      <div className="absolute inset-0 z-[1] filter blur-[100px]">
        {/* Top-Right: Dusty Pink */}
        <motion.div 
          className="absolute top-[-10%] right-[-5%] w-[50vw] h-[50vw] rounded-full opacity-60 mix-blend-multiply"
          style={{ backgroundColor: "#4a322bff" }}
          animate={
            isClient ? {
              x: ["0vw", "-80vw", "-20vw", "10vw", "-60vw"],
              y: ["0vh", "80vh", "20vh", "90vh", "-10vh"],
              scale: [1, 1.2, 0.9, 1.1, 1],
            } : {}
          }
          transition={{
            duration: 45,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "mirror"
          }}
        />
        
        {/* Right-Center: Muted Teal */}
        <motion.div 
          className="absolute top-[30%] right-[-10%] w-[45vw] h-[45vw] rounded-full opacity-50 mix-blend-multiply"
          style={{ backgroundColor: "#1e1e1eff" }}
          animate={
             isClient ? {
              x: ["0vw", "-90vw", "0vw", "-50vw", "10vw"],
              y: ["0vh", "-50vh", "40vh", "-20vh", "10vh"],
              scale: [1, 0.8, 1.1, 0.9, 1],
            } : {}
          }
          transition={{
            duration: 55,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "mirror"
          }}
        />
        
        {/* Bottom-Center: Soft Orange */}
        <motion.div 
          className="absolute bottom-[-15%] right-[15%] w-[55vw] h-[55vw] rounded-full opacity-50 mix-blend-multiply"
          style={{ backgroundColor: "#cb7049ff" }}
          animate={
             isClient ? {
              x: ["0vw", "-40vw", "30vw", "-80vw", "0vw"],
              y: ["0vh", "-80vh", "-30vh", "10vh", "-50vh"],
              scale: [1, 1.1, 0.9, 1.2, 1],
            } : {}
          }
          transition={{
            duration: 50,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "mirror"
          }}
        />
      </div>
    </div>
  );
};

export default PastelBackground;

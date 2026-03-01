"use client";

import { useState, useCallback, useEffect } from "react";
import LogoLoader from "./LogoLoader";

interface LoaderWrapperProps {
  children: React.ReactNode;
}

export default function LoaderWrapper({ children }: LoaderWrapperProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [showBlackScreen, setShowBlackScreen] = useState(false);
  const [revealContent, setRevealContent] = useState(false);

  const handleComplete = useCallback(() => {
    // Step 1: Show black screen (matches the zoomed-in shape 2 black fill)
    setShowBlackScreen(true);
    setIsLoading(false);

    // Step 2: After a tiny delay, start fading the black screen out to reveal content
    setTimeout(() => {
      setRevealContent(true);
    }, 100);

    // Step 3: Remove the black screen after it has fully faded
    setTimeout(() => {
      setShowBlackScreen(false);
    }, 900);
  }, []);

  return (
    <>
      {isLoading && <LogoLoader onComplete={handleComplete} />}

      {/* Black screen bridge — appears when zoom fills viewport, then fades out */}
      {showBlackScreen && (
        <div
          className="fixed inset-0 z-[99] bg-black"
          style={{
            opacity: revealContent ? 0 : 1,
            transition: "opacity 0.8s ease-out",
          }}
        />
      )}

      {/* Main content — always mounted, fades in after loader */}
      <div
        style={{
          opacity: revealContent ? 1 : 0,
          transition: "opacity 0.8s ease-out",
        }}
      >
        {children}
      </div>
    </>
  );
}

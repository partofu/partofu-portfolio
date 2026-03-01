"use client";

import { useEffect, useRef, useState } from "react";

interface LogoLoaderProps {
  onComplete: () => void;
}

// drawMode: "forward" draws normal, "reverse" draws opposite, "middle" draws from center outward
const LOGO_PATHS = [
  {
    d: "M 52 163 L 228 163 L 228 240.5 L 205.5 262 L 52 262 L 52 163 Z",
    delay: 0,
    drawMode: "forward" as const,   // 1: left to right
  },
  {
    d: "M 281 163 L 400 163 L 400 516 L 281 516 L 281 163 Z",
    delay: 0,
    drawMode: "middle" as const,    // 2: draws from both sides, meeting in middle
  },
  {
    d: "M 453 163 L 628 163 L 628 366 L 482.5 366 L 453 346 L 453 163 Z",
    delay: 0,
    drawMode: "reverse" as const,   // 3: right to left
  },
  {
    d: "M 52 314 L 202.5 314 L 229 339.5 L 229 516 L 52 516 L 52 314 Z",
    delay: 0,
    drawMode: "reverse" as const,   // 4: right to left
  },
  {
    d: "M 479.5 417 L 628 417 L 628 516 L 452 516 L 452 439.5 L 479.5 417 Z",
    delay: 0,
    drawMode: "forward" as const,   // 5: left to right
  },
];

const DRAW_DURATION = 3.0;
const FILL_START = 3.2;
const FILL_DURATION = 0.5;
const ZOOM_START = 3.8;    // when zoom-into-shape-2 begins
const ZOOM_DURATION = 1.0; // how long the zoom takes
const TOTAL_DURATION = 5000;

// Shape 2 center in SVG coordinates (the center tall rectangle)
// Path: M 281 163 L 400 163 L 400 516 L 281 516 → center is (340.5, 339.5)
// SVG viewBox center: (339, 338)
// We need to scale up so shape 2 fills the entire viewport
// Shape 2 is ~119px wide × 353px tall in SVG units out of 678×676 viewBox
// To "zoom into" it we scale the logo ~25x and translate to center on shape 2

export default function LogoLoader({ onComplete }: LogoLoaderProps) {
  const [phase, setPhase] = useState<"draw" | "fill" | "zoom" | "done">("draw");
  const [pathLengths, setPathLengths] = useState<number[]>([]);
  const pathRefs = useRef<(SVGPathElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Measure actual path lengths on mount
  useEffect(() => {
    const lengths = pathRefs.current.map(
      (ref) => ref?.getTotalLength() ?? 1000
    );
    setPathLengths(lengths);
  }, []);

  // Phase transitions
  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase("fill"), FILL_START * 1000),
      setTimeout(() => setPhase("zoom"), ZOOM_START * 1000),
      setTimeout(() => {
        setPhase("done");
        onComplete();
      }, TOTAL_DURATION),
    ];
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  // Build style for each path based on drawMode
  const getPathStyle = (i: number): React.CSSProperties => {
    const len = pathLengths[i] ?? 1000;
    const path = LOGO_PATHS[i];
    const isFilling = phase === "fill" || phase === "zoom" || phase === "done";

    if (path.drawMode === "middle") {
      return {
        strokeDasharray: "0 0.5 0 0.5",
        strokeDashoffset: 0.5,
        fillOpacity: 0,
        animation: pathLengths.length > 0
          ? [
              `logo-draw-middle ${DRAW_DURATION}s ${path.delay}s ease-out forwards`,
              isFilling ? `logo-fill ${FILL_DURATION}s ease-out forwards` : "",
            ]
              .filter(Boolean)
              .join(", ")
          : "none",
      };
    }

    const offset = path.drawMode === "reverse" ? -len : len;
    return {
      strokeDasharray: len,
      strokeDashoffset: offset,
      fillOpacity: 0,
      animation: pathLengths.length > 0
        ? [
            `logo-draw ${DRAW_DURATION}s ${path.delay}s ease-out forwards`,
            isFilling ? `logo-fill ${FILL_DURATION}s ease-out forwards` : "",
          ]
            .filter(Boolean)
            .join(", ")
        : "none",
    };
  };

  // Compute the zoom transform:
  // Shape 2 center in SVG coords: (340.5, 339.5)
  // SVG is displayed centered in the viewport. The SVG element is w-[40vw] max-w-[500px].
  // We use transform-origin at center (default), so we just need to:
  // 1. Scale up ~25x so shape 2 fills the viewport
  // 2. The SVG center ≈ shape 2 center (340.5/678 ≈ 50.2%, 339.5/676 ≈ 50.2%) so minimal translate needed
  const isZooming = phase === "zoom" || phase === "done";

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 z-[100] flex items-center justify-center ${
        phase === "done" ? "pointer-events-none" : ""
      }`}
      style={{
        backgroundColor: phase === "done" ? "transparent" : "#F2F1EF",
        transition: phase === "done" ? "background-color 0.3s ease" : "none",
      }}
    >
      {/* Subtle noise texture matching the site */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none mix-blend-overlay"
        style={{
          opacity: isZooming ? 0 : 0.3,
          transition: "opacity 0.3s ease",
        }}
      >
        <svg className="w-full h-full">
          <filter id="loader-noise">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.8"
              numOctaves="3"
              stitchTiles="stitch"
            />
          </filter>
          <rect width="100%" height="100%" filter="url(#loader-noise)" />
        </svg>
      </div>

      {/* Logo SVG — zooms into shape 2 */}
      <div
        className="relative z-[2]"
        style={{
          transition: isZooming
            ? `transform ${ZOOM_DURATION}s cubic-bezier(0.76, 0, 0.24, 1), opacity 0.3s ease ${ZOOM_DURATION - 0.3}s`
            : "none",
          transform: isZooming
            ? "scale(30)"
            : "scale(1)",
          opacity: phase === "done" ? 0 : 1,
          transformOrigin: "50.2% 50.2%", // shape 2's center relative to SVG
        }}
      >
        <svg
          width="678"
          height="676"
          viewBox="0 0 678 676"
          xmlns="http://www.w3.org/2000/svg"
          className="w-[40vw] h-auto max-w-[500px]"
        >
          {LOGO_PATHS.map((path, i) => (
            <path
              key={i}
              ref={(el) => { pathRefs.current[i] = el; }}
              d={path.d}
              stroke="rgb(0, 0, 0)"
              strokeWidth="2"
              strokeLinejoin="round"
              fill="rgb(0, 0, 0)"
              pathLength={path.drawMode === "middle" ? 1 : undefined}
              style={getPathStyle(i)}
            />
          ))}
        </svg>

        {/* Subtle glow behind the logo while drawing */}
        <div
          className="absolute inset-0 -z-10 rounded-full blur-[80px] transition-opacity duration-1000"
          style={{
            background:
              "radial-gradient(circle, rgba(227,131,96,0.15) 0%, transparent 70%)",
            opacity: phase === "draw" || phase === "fill" ? 1 : 0,
          }}
        />
      </div>

      {/* Progress indicator */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-[2] flex flex-col items-center gap-3">
        <div
          className="h-[1px] bg-neutral-400 overflow-hidden transition-opacity duration-500"
          style={{
            width: "120px",
            opacity: isZooming ? 0 : 1,
          }}
        >
          <div
            className="h-full bg-black"
            style={{
              animation: `logo-progress ${ZOOM_START}s linear forwards`,
            }}
          />
        </div>
        <p
          className="text-[10px] tracking-[0.3em] uppercase transition-opacity duration-500"
          style={{
            fontFamily: "var(--font-klaxon-smooth)",
            opacity: isZooming ? 0 : 1,
          }}
        >
          partofu
        </p>
      </div>
    </div>
  );
}

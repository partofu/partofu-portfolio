"use client";

import { useRef, useEffect, useCallback } from "react";

interface MouseCirclesProps {
  className?: string;
  variant?: "default" | "same-radius";
}

export default function MouseCircles({ 
  className = "",
  variant = "default"
}: MouseCirclesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 }); // normalized 0-1
  const currentRef = useRef({ x: 0.5, y: 0.5 });
  const animRef = useRef<number>(0);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    const cx = w / 2;
    const cy = h / 2;

    // Smooth lerp towards mouse position
    const lerp = 0.06;
    currentRef.current.x +=
      (mouseRef.current.x - currentRef.current.x) * lerp;
    currentRef.current.y +=
      (mouseRef.current.y - currentRef.current.y) * lerp;

    // Offset from center based on mouse (-1 to 1 range)
    const offsetX = (currentRef.current.x - 0.5) * 2;
    const offsetY = (currentRef.current.y - 0.5) * 2;

    ctx.clearRect(0, 0, w, h);

    // Draw concentric circles with parallax offset
    const defaultRings = [
      { radius: 0.28, parallax: 0.1, width: 1 },
      { radius: 0.23, parallax: 0.18, width: 1 },
      { radius: 0.18, parallax: 0.26, width: 1 },
      { radius: 0.13, parallax: 0.34, width: 1 },
      { radius: 0.08, parallax: 0.42, width: 1 },
    ];

    const sameRadiusRings = [
      { radius: 0.22, parallax: -0.16, width: 1 },
      { radius: 0.22, parallax: -0.08, width: 1 },
      { radius: 0.22, parallax: 0, width: 1 },
      { radius: 0.22, parallax: 0.08, width: 1 },
      { radius: 0.22, parallax: 0.16, width: 1 },
    ];

    const rings = variant === "same-radius" ? sameRadiusRings : defaultRings;

    const maxShift = Math.min(w, h) * 0.08;

    rings.forEach((ring) => {
      const rx = cx + offsetX * maxShift * ring.parallax * 10;
      const ry = cy + offsetY * maxShift * ring.parallax * 10;
      const r = Math.min(w, h) * ring.radius;

      ctx.beginPath();
      ctx.arc(rx, ry, r, 0, Math.PI * 2);
      ctx.strokeStyle = "#202020";
      ctx.lineWidth = ring.width;
      ctx.stroke();
    });



    animRef.current = requestAnimationFrame(draw);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = parent.clientWidth * dpr;
      canvas.height = parent.clientHeight * dpr;
      canvas.style.width = `${parent.clientWidth}px`;
      canvas.style.height = `${parent.clientHeight}px`;
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.scale(dpr, dpr);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = (e.clientX - rect.left) / rect.width;
      mouseRef.current.y = (e.clientY - rect.top) / rect.height;
    };

    const handleMouseLeave = () => {
      // Return to default center position
      mouseRef.current.x = 0.5;
      mouseRef.current.y = 0.5;
    };

    resizeCanvas();
    const ro = new ResizeObserver(resizeCanvas);
    ro.observe(canvas.parentElement!);

    // Listen on the whole section (parent's parent) for mouse movement
    const section = canvas.closest("section");
    if (section) {
      section.addEventListener("mousemove", handleMouseMove);
      section.addEventListener("mouseleave", handleMouseLeave);
    }

    animRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animRef.current);
      ro.disconnect();
      if (section) {
        section.removeEventListener("mousemove", handleMouseMove);
        section.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, [draw]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none ${className}`}
    />
  );
}

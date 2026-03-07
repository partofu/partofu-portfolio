"use client";

import { useRef, useEffect, useCallback } from "react";

interface DottedArcProps {
  className?: string;
  dotColor?: string;
}

// A single point in the arc physics simulation
class ArcPoint {
  baseX: number;
  baseY: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  friction: number;
  springFactor: number;

  constructor(x: number, y: number, springFactor: number, friction: number) {
    this.baseX = x;
    this.baseY = y;
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.springFactor = springFactor;
    this.friction = friction;
  }

  update(mouseX: number, mouseY: number, repelRadius: number, repelStrength: number) {
    // 1. Repulsion from mouse
    const dx = this.x - mouseX;
    const dy = this.y - mouseY;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist > 0 && dist < repelRadius) {
      // Calculate force based on proximity to cursor
      // Closer = stronger force
      const forceStr = (1 - dist / repelRadius) * repelStrength;
      const angle = Math.atan2(dy, dx);

      // Add velocity pushing away from mouse
      this.vx += Math.cos(angle) * forceStr;
      this.vy += Math.sin(angle) * forceStr;
    }

    // 2. Spring force pulling back to base position
    const baseDx = this.baseX - this.x;
    const baseDy = this.baseY - this.y;
    
    this.vx += baseDx * this.springFactor;
    this.vy += baseDy * this.springFactor;

    // 3. Apply velocity with friction/damping
    this.vx *= this.friction;
    this.vy *= this.friction;

    this.x += this.vx;
    this.y += this.vy;
  }
}

export default function DottedArc({ 
  className = "", 
  dotColor = "rgba(184, 184, 184, 0.3)" // Default semi-transparent #f2f2f2
}: DottedArcProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  
  // Store physical parameters and state outside React state for performance
  const stateRef = useRef({
    mouseX: -1000,
    mouseY: -1000,
    arcs: [] as ArcPoint[][],
  });

  const generateArcs = useCallback((w: number, h: number) => {
    const arcsData: ArcPoint[][] = [];
    
    // We create 3 overlapping concentric circles with slightly different stiffness 
    // to give that nice layered "string" effect
    const arcConfigs = [
      { radiusFactor: 0.38, points: 90, spring: 0.05, friction: 0.82 },
      { radiusFactor: 0.41, points: 100, spring: 0.03, friction: 0.85 },
      { radiusFactor: 0.44, points: 110, spring: 0.02, friction: 0.88 },
    ];

    const cx = w / 2;
    const cy = h / 2; // Center of the circle is exactly in the middle of the canvas

    arcConfigs.forEach((config) => {
      // Use the smaller dimension (height or width) to ensure the circles fit on the screen
      const minDimension = Math.min(w, h);
      const radius = minDimension * config.radiusFactor;
      const arcPoints = [];

      for (let i = 0; i < config.points; i++) {
        // Map points to a full circle (0 to 2*PI)
        const t = (i / config.points) * Math.PI * 2;
        
        const px = cx + Math.cos(t) * radius;
        const py = cy + Math.sin(t) * radius;

        arcPoints.push(new ArcPoint(px, py, config.spring, config.friction));
      }
      arcsData.push(arcPoints);
    });

    stateRef.current.arcs = arcsData;
  }, []);

  const draw = useCallback(function drawInner() {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    const { mouseX, mouseY, arcs } = stateRef.current;

    ctx.clearRect(0, 0, w, h);

    // Physics constants
    const repelRadius = Math.min(w, h) * 0.25; // How close mouse needs to be to repel
    const repelStrength = Math.min(w, h) * 0.015;

    ctx.fillStyle = dotColor;

    arcs.forEach((arcPoints, arcIndex) => {
      // Different dot sizes for different layers adds depth - made larger for higher visibility
      const dotRadius = arcIndex === 0 ? 3 : (arcIndex === 1 ? 2.2 : 1.5);

      arcPoints.forEach((p, i) => {
        // Pin the very first and very last points to their base positions
        if (i > 0 && i < arcPoints.length - 1) {
          p.update(mouseX, mouseY, repelRadius, repelStrength);
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, dotRadius, 0, Math.PI * 2);
        ctx.fill();
      });
    });

    animRef.current = requestAnimationFrame(drawInner);
  }, [dotColor]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      
      const dpr = window.devicePixelRatio || 1;
      // Get dimensions from parent, fallback to window if parent is zeroed out by absolute positioning
      const w = parent.clientWidth || window.innerWidth;
      const h = parent.clientHeight || window.innerHeight;
      
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.scale(dpr, dpr);

      // Re-generate arcs to fit new container dimensions
      generateArcs(w, h);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      stateRef.current.mouseX = e.clientX - rect.left;
      stateRef.current.mouseY = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      // Move mouse far away so springs pull points back
      stateRef.current.mouseX = -1000;
      stateRef.current.mouseY = -1000;
    };

    resizeCanvas();
    const ro = new ResizeObserver(resizeCanvas);
    ro.observe(canvas.parentElement!);

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
  }, [draw, generateArcs]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none ${className}`}
    />
  );
}

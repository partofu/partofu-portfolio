"use client";

import { useRef, useEffect, type ReactNode } from "react";

export default function CubeButton({
  children,
  className = "",
  onClick,
}: {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  const ref = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const update = () => {
      const h = el.offsetHeight;
      el.style.setProperty("--cube-half", `${h / 2}px`);
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <button
      ref={ref}
      onClick={onClick}
      className={`nav-cube nav-cube-reverse ${className}`}
    >
      <span className="nav-cube-sizer" aria-hidden="true">
        {children}
      </span>
      <span className="nav-cube-inner">
        <span className="nav-cube-face nav-cube-front">{children}</span>
        <span className="nav-cube-face nav-cube-top">{children}</span>
      </span>
    </button>
  );
}

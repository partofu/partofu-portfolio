"use client";

import { useRef, useEffect, type ReactNode } from "react";
import Link from "next/link";

export default function CubeLink({
  href,
  children,
  className = "",
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLAnchorElement>(null);

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
    <Link href={href} ref={ref} className={`nav-cube ${className}`}>
      <span className="nav-cube-sizer" aria-hidden="true">{children}</span>
      <span className="nav-cube-inner">
        <span className="nav-cube-face nav-cube-front">{children}</span>
        <span className="nav-cube-face nav-cube-bottom">{children}</span>
      </span>
    </Link>
  );
}

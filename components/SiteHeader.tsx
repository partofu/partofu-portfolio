"use client";

import Link from "next/link";
import Image from "next/image";
import CubeLink from "./CubeLink";
import { useEffect, useState } from "react";

export default function SiteHeader() {
  const [headerBgClass, setHeaderBgClass] = useState("bg-[#f2f2f2]");

  useEffect(() => {
    const handleScroll = () => {
      const sections = Array.from(document.querySelectorAll("[data-header-color]"));
      if (sections.length === 0) return;

      // Default to the first section's color if we are above everything
      let currentBg = sections[0].getAttribute("data-header-color") || "bg-[#f2f2f2]";

      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        // If the section's top has reached the header (with a tiny threshold), 
        // this section becomes the active background.
        if (rect.top <= 85) {
          currentBg = section.getAttribute("data-header-color") || currentBg;
        }
      });

      setHeaderBgClass((prev) => (prev !== currentBg ? currentBg : prev));
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Check on mount

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`w-full z-50 fixed top-0 left-0 right-0 flex items-center justify-between border-b border-[#202020] transition-colors duration-700 ${headerBgClass}`}>
      <div className="flex self-stretch">
        <Link
          href="/"
          className="px-6 border-r border-[#202020] flex items-center"
        >
          <Image
            src="/logo.svg"
            alt="Logo"
            width={20}
            height={20}
            className="w-13 h-13"
            priority
          />
        </Link>

        <CubeLink
          href="/work"
          className="border-r border-[#202020]"
        >
          work
        </CubeLink>

        <CubeLink
          href="/about"
          className="border-r border-[#202020]"
        >
          about
        </CubeLink>

        <CubeLink
          href="/contact"
          className="border-r border-[#202020]"
        >
          contact
        </CubeLink>
      </div>

      <div className="pl-36 pr-8 text-xs border-l border-[#202020]">
        <div className="flex flex-col items-end justify-center h-full py-2 text-[#202020]">
          <h1 className="text-2xl">PARTOFU</h1>
          <p className="tracking-[0.15vw]">BRANDING & TECHNOLOGY STUDIO</p>
        </div>
      </div>
    </header>
  );
}

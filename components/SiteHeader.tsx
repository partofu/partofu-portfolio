"use client";

import Link from "next/link";
import Image from "next/image";
import CubeLink from "./CubeLink";
import { useEffect, useState } from "react";

export default function SiteHeader() {
  const [headerBgClass, setHeaderBgClass] = useState("bg-[#b8b8b8]");

  useEffect(() => {
    // We observe all elements with data-header-color.
    const sections = Array.from(document.querySelectorAll("[data-header-color]"));
    
    // We use a root margin that triggers when a section crosses the top ~10% of the viewport relative to the header.
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const colorClass = entry.target.getAttribute("data-header-color");
            if (colorClass) {
              setHeaderBgClass(colorClass);
            }
          }
        });
      },
      {
        rootMargin: "-50px 0px -80% 0px", // triggers when element is roughly in the top 50px to 20vh
      }
    );

    sections.forEach((section) => {
      observer.observe(section);
    });

    return () => observer.disconnect();
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

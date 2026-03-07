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

  const isPrimary = headerBgClass.includes("bg-primary");

  const [isOpen, setIsOpen] = useState(false);

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <>
      <header data-theme={isPrimary && !isOpen ? "primary" : "light"} className={`w-full z-50 fixed top-0 left-0 right-0 flex items-stretch justify-between border-b border-[#202020] transition-colors duration-700 ${isOpen ? 'bg-[#f2f2f2]' : headerBgClass} text-[#202020]`}>
        <div className="flex flex-1 overflow-hidden">
          {/* Logo */}
          <Link
            href="/"
            onClick={() => setIsOpen(false)}
            className={`px-4 md:px-6 border-r border-[#202020] flex items-center justify-center transition-colors duration-700 shrink-0`}
          >
            <Image
              src="/logo.svg"
              alt="Logo"
              width={20}
              height={20}
              className="w-13 h-13 transition-all duration-700"
              priority
            />
          </Link>

          {/* Desktop Links (Hidden on mobile) */}
          <div className="hidden md:flex flex-1">
            <CubeLink
              href="/work"
              className={`flex-1 border-r border-[#202020] transition-colors duration-700 text-base`}
            >
              work
            </CubeLink>

            <CubeLink
              href="/about"
              className={`flex-1 border-r border-[#202020] transition-colors duration-700 text-base`}
            >
              about
            </CubeLink>

            <CubeLink
              href="/contact"
              className={`flex-1 border-r border-[#202020] transition-colors duration-700 text-base`}
            >
              contact
            </CubeLink>
          </div>

          {/* Mobile Hamburger Button (Hidden on desktop) */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex md:hidden ml-auto items-center justify-center border-l border-[#202020] px-6 hover:bg-[#202020] hover:text-[#f2f2f2] transition-colors"
            aria-label="Toggle menu"
          >
            <div className="flex flex-col gap-[5px] w-6">
              <span className={`block h-[2px] w-full bg-current transition-transform duration-300 ${isOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
              <span className={`block h-[2px] w-full bg-current transition-opacity duration-300 ${isOpen ? 'opacity-0' : ''}`} />
              <span className={`block h-[2px] w-full bg-current transition-transform duration-300 ${isOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
            </div>
          </button>
        </div>

        {/* Right side studio text (Hidden on mobile) */}
        <div className={`hidden md:flex shrink-0 pl-12 lg:pl-36 pr-8 text-xs border-l border-[#202020] transition-colors duration-700 items-center justify-center`}>
          <div className="flex flex-col items-end justify-center py-2">
            <h1 className="text-xl lg:text-2xl font-normal">PARTOFU</h1>
            <p className="tracking-[0.15vw] text-right whitespace-nowrap">BRANDING & TECHNOLOGY STUDIO</p>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div 
        className={`fixed inset-0 bg-[#f2f2f2] z-40 flex flex-col pt-24 px-6 md:hidden transition-transform duration-500 ease-in-out ${isOpen ? 'translate-y-0' : '-translate-y-full'}`}
      >
        {/* Added PARTOFU text inside menu */}
        <div className="flex flex-col mt-4">
          <h1 className="text-2xl font-bold text-[#202020]">PARTOFU</h1>
          <p className="tracking-widest text-[#202020] text-xs">STUDIO</p>
        </div>

        <nav className="flex flex-col gap-6 mt-12">
          <Link 
            href="/work" 
            onClick={() => setIsOpen(false)}
            className="text-5xl font-bold text-[#202020] uppercase tracking-tighter hover:text-primary transition-colors"
          >
            Work
          </Link>
          <div className="w-full h-[1px] bg-[#202020] opacity-20" />
          
          <Link 
            href="/about" 
            onClick={() => setIsOpen(false)}
            className="text-5xl font-bold text-[#202020] uppercase tracking-tighter hover:text-primary transition-colors"
          >
            About
          </Link>
          <div className="w-full h-[1px] bg-[#202020] opacity-20" />
          
          <Link 
            href="/contact" 
            onClick={() => setIsOpen(false)}
            className="text-5xl font-bold text-[#202020] uppercase tracking-tighter hover:text-primary transition-colors"
          >
            Contact
          </Link>
        </nav>

        <div className="mt-auto mb-12">
          <p className="text-[#202020] text-sm opacity-50 uppercase tracking-widest">branding & technology studio</p>
        </div>
      </div>
    </>
  );
}

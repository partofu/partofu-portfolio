"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <nav className="flex justify-between items-center fixed z-50 w-full top-0 left-0 p-4">
      <div className="bg-zinc-300 border border-white/20 backdrop-blur-md inline-block px-2 rounded-xs text-sm shadow-lg">
        <div className="flex items-center gap-2">
          <Link href="/" className=" rounded-xs">
            <Image
              src="/logo.svg"
              alt="Logo"
              width={40}
              height={40}
              className="w-12 h-14"
            />
          </Link>

          <AnimatePresence initial={false}>
            {isOpen && (
              <motion.div
                initial={{ width: 0, opacity: 0, scale: 0.95, marginRight: 0 }}
                animate={{
                  width: "auto",
                  opacity: 1,
                  scale: 1,
                  marginRight: 0,
                }}
                exit={{ width: 0, opacity: 0, scale: 0.95, marginRight: 0 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="flex items-center gap-2 overflow-hidden origin-right"
              >
                {[
                  { name: "About", href: "/about" },
                  { name: "Projects", href: "/projects" },
                  { name: "Contact", href: "/contact" },
                ].map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="bg-zinc-100/80 hover:bg-zinc-200/80 px-4 py-1.5 rounded-xs transition-colors whitespace-nowrap font-medium text-zinc-700"
                  >
                    {item.name}
                  </Link>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            onClick={() => setIsOpen(!isOpen)}
            className="bg-zinc-100/80 rounded-xs flex flex-row gap-1 justify-center items-center px-4 py-2 cursor-pointer hover:bg-zinc-200/80 transition-colors shadow-sm"
            aria-label="Toggle menu"
            whileTap={{ scale: 0.95 }}
          >
            <motion.span
              animate={{
                rotate: isOpen ? 46 : 0,
                x: isOpen ? 3 : 0,
                backgroundColor: "#000000",
                height: isOpen ? 18 : 16,
              }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="block w-[4px] h-4 bg-black"
            />
            <motion.span
              animate={{
                rotate: isOpen ? -46 : 0,
                x: isOpen ? -5 : 0,
                backgroundColor: "#000000",
                height: isOpen ? 18 : 16,
              }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="block w-[4px] h-4 bg-black"
            />
          </motion.button>
        </div>
      </div>
      <div className="flex flex-col items-end gap-1">
        <h1 className="text-4xl">part<span className="text-primary">o</span>fu</h1>
        <p className="text-xs font-light tracking-widest">
          Branding and Technology Studio
        </p>
      </div>
    </nav>
  );
};

export default Navbar;

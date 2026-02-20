"use client";

import React from "react";
import Navbar from "./Navbar";
import { motion } from "framer-motion";
import PastelBackground from "./PastelBackground";

const TestHero = () => {
  return (
    <div className="text-black h-screen overflow-hidden selection:bg-primary selection:text-white relative">
      <Navbar />
      
      {/* Background Blobs */}
      <PastelBackground />



      {/* Hero Content */}
      <div className="relative z-10 flex flex-col justify-center h-full px-6 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >


          <h1 className="text-6xl md:text-[11vw] tracking-tight leading-[0.8] mb-8 text-center">
            Results are the <br /> only language
          </h1>

          <p className="text-lg md:text-xl max-w-lg leading-relaxed mb-10">
            Your brand is your strongest competitive advantage. We&apos;ll help you realize it, embed it deeply into your business, and transform it into genuine momentum.
          </p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 text-[#2F2F2F] font-medium group cursor-pointer"
          >
            <span className="border-b border-[#2F2F2F] pb-1 group-hover:border-transparent transition-colors">
              Discover how
            </span>
            <span className="bg-[#2F2F2F] text-white rounded-full p-2 group-hover:bg-[#FF4D00] transition-colors duration-300">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 17l9.2-9.2M17 17V7H7" />
              </svg>
            </span>
          </motion.button>
        </motion.div>
      </div>
     
    </div>
  );
};

export default TestHero;

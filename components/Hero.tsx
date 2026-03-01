import React from 'react';
import Navbar from './Navbar';
import { LightLines } from './ui/light-lines';

const Hero = () => {
  return (
    <div className="text-black font-display h-screen overflow-hidden selection:bg-primary selection:text-white relative">
      <Navbar />
      {/* Background - LightLines */}
      <LightLines
        className="fixed inset-0 z-0"
        linesOpacity={0.08}
        lightsOpacity={0.7}
        speedMultiplier={0.8}
        gradientFrom="#ffffff"
        gradientTo="#f5f5f5"
        lightColor="#FF4D00"
        lineColor="#000000"
      />

      {/* Main Content */}
      <main className="flex-1 flex flex-col justify-center px-10 md:px-20 lg:px-24 max-w-[1400px] mx-auto w-full z-10 py-20 min-h-screen">
        <div className="relative grid grid-cols-12 gap-4 items-center">
          <div className="col-span-12 lg:col-span-8 lg:col-start-5 text-right lg:text-left order-1 lg:order-2">
            <h1 className="flex flex-col text-[10vw] md:text-[8vw] lg:text-[7.5rem] font-black uppercase tracking-tighter leading-[0.85] text-right">
              <span className="block">Results</span>
              <span className="block text-primary">Are The</span>
              <span className="block">Only</span>
              <span className="block">Language</span>
            </h1>
          </div>
          <div className="col-span-12 lg:col-span-4 flex flex-col gap-10 items-start order-2 lg:order-1 mt-12 lg:mt-0">
            <div className="max-w-sm">
              <p className="text-xl font-medium leading-tight text-black border-l-[6px] border-black pl-6">
                Architecting digital excellence through precise engineering and intentional design. We transform vision into raw, measurable impact.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <button className="bg-black text-white border-4 border-black px-8 py-5 text-base font-black uppercase tracking-widest shadow-brutal hover:shadow-brutal-hover hover-lift transition-all duration-150 whitespace-nowrap">
                Start a Project
              </button>
              <button className="bg-white/50 backdrop-blur-sm border-4 border-black px-8 py-5 text-base font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all duration-150 hover-lift whitespace-nowrap">
                View Work
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="absolute bottom-0 left-0 right-0 p-10 flex flex-col md:flex-row justify-between items-end md:items-center z-10 gap-6">
        <div className="flex items-center gap-6">
          <div className="w-16 h-[4px] bg-black"></div>
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 bg-primary rounded-full animate-pulse"></span>
            <span className="text-xs font-black uppercase tracking-[0.3em]">Now available for q4 partnerships</span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[10px] uppercase tracking-[0.6em] font-black opacity-20 leading-loose">
            51.5074° N, 0.1278° W <br className="md:hidden"/> / RAW CONFIDENCE & STRATEGY
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Hero;

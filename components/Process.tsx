"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const cards = [
  {
    id: 1,
    title: "Discovery",
    description:
      "Aligning your business vision with deep audience insights to uncover your unique strategic advantage.",
    icon: "/discovery.svg",
  },
  {
    id: 2,
    title: "Strategy",
    description:
      "Architecting clear positioning and robust roadmaps to give every digital decision undeniable purpose.",
    icon: "/strategy.svg",
  },
  {
    id: 3,
    title: "Design",
    description:
      "Crafting premium visual identities and intuitive interfaces that demand attention and elevate your brand.",
    icon: "/design.svg",
  },
  {
    id: 4,
    title: "Development",
    description:
      "Forging resilient, high-performance platforms engineered for infinite scale, rapid speed, and flawless execution.",
    icon: "/development.svg",
  },
  {
    id: 5,
    title: "Optimization",
    description:
      "Refining every detail through rigorous testing and tuning to guarantee an uncompromising user experience.",
    icon: "/optimization.svg",
  },
  {
    id: 6,
    title: "Launch",
    description:
      "Deploying with precision and providing strategic post-launch support to keep you ahead of the curve.",
    icon: "/launch.svg",
  },
];

// Shared card inner content so both layouts use identical markup
const CardContent = ({ card }: { card: (typeof cards)[0] }) => (
  <>
    {/* Top: Step Number */}
    <div className="flex justify-between items-start">
      <span className="text-xs font-mono tracking-widest opacity-40">
        {String(card.id).padStart(2, "0")}
      </span>
    </div>

    {/* Middle: Centered Icon */}
    <div className="flex justify-center items-center flex-1 py-4 md:py-6">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={card.icon}
        alt={`${card.title} icon`}
        className="w-24 h-24 sm:w-32 sm:h-32 md:w-48 md:h-48 lg:w-64 lg:h-64 object-contain invert brightness-0 group-hover:invert group-hover:brightness-200 transition-all duration-500"
      />
    </div>

    {/* Bottom: Title + Description */}
    <div className="space-y-2 md:space-y-3">
      <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
        {card.title}
      </h3>
      <p className="text-sm sm:text-base font-light leading-relaxed opacity-70 group-hover:opacity-100 transition-opacity duration-500">
        {card.description}
      </p>
    </div>
  </>
);

const Process = () => {
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-83%"]);

  return (
    <>
      {/* ── MOBILE LAYOUT (< md) ── simple vertical grid */}
      <section
        className="md:hidden bg-[#f2f2f2] pt-16 pb-12 px-5"
        data-header-color="bg-[#f2f2f2]"
      >
        {/* Section title */}
        <h2 className="flex items-center gap-2 text-[#202020] mb-8">
          <span className="h-2 w-2 inline-block bg-[#202020]"></span>
          our process
        </h2>

        {/* Card grid: 1 col on mobile, 2 cols on sm */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {cards.map((card) => (
            <div
              key={card.id}
              className="group relative flex flex-col justify-between p-6 bg-[#202020] text-[#f2f2f2] hover:bg-primary hover:text-[#202020] rounded-xs shadow-xl transition-all duration-500 min-h-[320px] sm:min-h-[360px] cursor-default"
            >
              <CardContent card={card} />
            </div>
          ))}
        </div>
      </section>

      {/* ── DESKTOP LAYOUT (≥ md) ── sticky horizontal scroll */}
      <section
        ref={targetRef}
        className="hidden md:block relative h-[400vh] bg-[#f2f2f2] pt-16"
        data-header-color="bg-[#f2f2f2]"
      >
        {/* Title: own sticky layer */}
        <div className="sticky top-16 z-20 px-12 py-3 pointer-events-none">
          <h2 className="flex items-center gap-2 text-[#202020]">
            <span className="h-2 w-2 inline-block bg-[#202020]"></span>
            our process
          </h2>
        </div>

        {/* Cards: sticky overflow-hidden horizontal track */}
        <div className="sticky top-0 -mt-14 h-screen w-full flex items-center overflow-hidden">
          <motion.div style={{ x }} className="flex gap-8 px-[10vw] z-10">
            {cards.map((card) => (
              <div
                key={card.id}
                className="group relative w-[40vw] lg:w-[30vw] h-[60vh] flex flex-col justify-between p-8 bg-[#202020] text-[#f2f2f2] hover:bg-primary hover:text-[#202020] rounded-xs shadow-xl shrink-0 transition-all duration-400 hover:-translate-y-10 cursor-default"
              >
                <CardContent card={card} />
              </div>
            ))}
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default Process;

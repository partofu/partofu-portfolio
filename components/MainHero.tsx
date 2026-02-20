import Link from "next/link";
import Image from "next/image";
import PastelBackground from "./PastelBackground";

export default function Main() {
  return (
    <div className="w-full min-h-screen bg-transparent text-black border border-neutral-700 flex flex-col relative overflow-hidden">
      <PastelBackground />

      {/* ================= NAVBAR ================= */}
      <header className="flex items-center justify-between border-b border-neutral-700">
        <div className="flex self-stretch">
          <Link
            href="/"
            className="px-6 border-r border-neutral-700 flex items-center"
          >
            <Image
              src="/logo.svg"
              alt="Logo"
              width={20}
              height={20}
              className="w-12 h-14"
              priority
            />
          </Link>

          <Link
            href="/work"
            className="px-8 py-4 border-r border-neutral-700 text-sm tracking-widest hover:bg-primary hover:text-white transition-all duration-300 flex items-center"
          >
            work
          </Link>

          <Link
            href="/about"
            className="px-8 py-4 border-r border-neutral-700 text-sm tracking-widest hover:bg-primary hover:text-white transition-all duration-300 flex items-center"
          >
            about
          </Link>

          <Link
            href="/contact"
            className="px-8 py-4 border-r border-neutral-700 text-sm tracking-widest hover:bg-primary hover:text-white transition-all duration-300 flex items-center"
          >
            contact
          </Link>
        </div>

        <div className="pl-36 pr-8 text-xs border-l border-neutral-700">
          <div className="flex flex-col items-end justify-center h-full py-2">
            <h1 className="text-2xl">PARTOFU</h1>
            <p className="tracking-[0.15vw] text-neutral-700">
              BRANDING & TECHNOLOGY STUDIO
            </p>
          </div>
        </div>
      </header>

      {/* ================= HERO SECTION ================= */}
      <section className="flex-1 flex items-center justify-center border-b border-neutral-700">
        <h1 className="text-center font-bold uppercase tracking-tight leading-none text-[11.2vw]">
          Results Are The <br /> Only Language
        </h1>
      </section>

      {/* ================= BOTTOM CTA SECTION ================= */}
      <section className="grid grid-cols-1 md:grid-cols-3 border-neutral-700 h-[12.5rem]">
        {/* Left Text */}
        <div className="md:col-span-2 px-28 border-r border-neutral-700 text-xl text-neutral-600 leading-relaxed flex items-center justify-center">
          Your brand is your strongest competitive advantage. We'll help you
          realize it, embed it deeply into your business, and transform it into
          genuine momentum.
        </div>

        {/* Right CTA */}
        <div className="flex flex-col text-lg">
          <button className="flex-1 border-b border-neutral-700 bg-primary text-white uppercase tracking-widest">
            Start Project +
          </button>

          <button className="flex-1 uppercase tracking-widest">
            Contact Us
          </button>
        </div>
      </section>
    </div>
  );
}

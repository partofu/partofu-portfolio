import Link from "next/link";
import Image from "next/image";
import CubeLink from "./CubeLink";
import CubeButton from "./CubeButton";

export default function Main() {
  return (
    <div className="w-full min-h-screen bg-transparent text-[#202020] border border-[#202020] flex flex-col relative overflow-hidden">

      {/* ================= NAVBAR ================= */}
      <header className="w-full z-50 fixed top-0 left-0 right-0 flex items-center justify-between border-b border-[#202020] bg-[#b8b8b8]">
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
          <div className="flex flex-col items-end justify-center h-full py-2">
            <h1 className="text-2xl">PARTOFU</h1>
            <p className="tracking-[0.15vw]">BRANDING & TECHNOLOGY STUDIO</p>
          </div>
        </div>
      </header>

      {/* ================= HERO SECTION ================= */}
      <section className="flex-1 flex items-center justify-center border-b border-[#202020] pt-[70px] bg-[#b8b8b8]">
        <h1 className="text-center font-bold uppercase tracking-tight leading-none text-[11.2vw]">
          Results Are The <br /> Only Language
        </h1>
      </section>

      {/* ================= BOTTOM CTA SECTION ================= */}
      <section className="flex items-stretch justify-between border-[#202020] bg-[#b8b8b8]">
        {/* Left - Contact Us */}
        <CubeButton className="border-r border-[#202020] uppercase tracking-widest text-lg px-32 py-6">
          Contact Us
        </CubeButton>

        {/* Right - Start Project */}
        <CubeButton className="border-l border-[#202020] uppercase tracking-widest text-lg px-32 py-6">
          Start Project +
        </CubeButton>
      </section>
    </div>
  );
}

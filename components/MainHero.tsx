import Link from "next/link";
import Image from "next/image";
import CubeLink from "./CubeLink";
import CubeButton from "./CubeButton";

export default function Main() {
  return (
    <div data-header-color="bg-[#b8b8b8]" className="w-full min-h-screen bg-transparent text-[#202020] border border-[#202020] flex flex-col relative overflow-hidden">

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

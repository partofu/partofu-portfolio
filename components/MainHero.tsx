import CubeButton from "./CubeButton";

export default function Main() {
  return (
    <div data-header-color="bg-[#f2f2f2]" className="w-full min-h-screen bg-transparent text-[#202020] border border-[#202020] flex flex-col relative overflow-hidden">

      {/* ================= HERO SECTION ================= */}
      <section className="flex-1 flex items-center justify-center border-b border-[#202020] pt-[70px] bg-[#f2f2f2] px-4">
        <h1 className="text-center font-bold uppercase tracking-tight leading-none text-[14vw] sm:text-[12vw] md:text-[11.2vw]">
          Results Are The <br /> Only Language
        </h1>
      </section>

      {/* ================= BOTTOM CTA SECTION ================= */}
      <section className="flex flex-col sm:flex-row items-stretch justify-between border-[#202020] bg-[#f2f2f2]">
        {/* Left - Contact Us */}
        <CubeButton className="border-b sm:border-b-0 sm:border-r border-[#202020] uppercase tracking-widest text-sm md:text-lg px-8 sm:px-16 md:px-32 py-5 md:py-6 w-full sm:w-auto justify-center">
          Contact Us
        </CubeButton>

        {/* Right - Start Project */}
        <CubeButton className="sm:border-l border-[#202020] uppercase tracking-widest text-sm md:text-lg px-8 sm:px-16 md:px-32 py-5 md:py-6 w-full sm:w-auto justify-center">
          Start Project +
        </CubeButton>
      </section>
    </div>
  );
}

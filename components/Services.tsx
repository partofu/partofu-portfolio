import MouseCircles from "./MouseCircles";

const Services = () => {
  return (
    <>
      {/* Section 1: Branding — text left, circles right */}
      <section
        data-header-color="bg-primary"
        className="flex flex-col md:flex-row md:h-[92vh] w-full bg-primary border-b-2 border-[#202020]"
      >
        {/* Text column */}
        <div className="flex flex-col w-full md:w-1/2 md:border-r-2 border-[#202020]">
          <div className="space-y-4 md:space-y-6 md:h-1/2 border-b-2 border-[#202020] p-5 md:p-6">
            <h2 className="flex items-center gap-2 text-[#f2f2f2]">
              <span className="h-2 w-2 inline-block bg-[#f2f2f2]"></span>
              Branding
            </h2>
            <div className="text-xl md:text-3xl font-bold text-[#202020]">
              <h2>Brand strategy</h2>
              <h2>Brand identity</h2>
              <h2>Graphic design</h2>
              <h2>Art direction</h2>
              <h2>Copywriting</h2>
            </div>
          </div>
          <div className="p-5 md:p-6 md:h-1/2 flex items-start md:items-center">
            <p className="text-base md:text-lg max-w-2xl text-[#202020]">
              Strong brands don&apos;t happen by accident. We combine strategy,
              design, and storytelling to create brands that stand out and
              connect with the right audience. From brand positioning to
              identity design and messaging, we craft cohesive brand experiences
              that leave a lasting impression.
            </p>
          </div>
        </div>

        {/* MouseCircles — hidden on mobile */}
        <div className="hidden md:block w-1/2 relative overflow-hidden">
          <MouseCircles />
        </div>
      </section>

      {/* Section 2: Web Design & Development — circles left, text right */}
      <section
        data-header-color="bg-primary"
        className="flex flex-col md:flex-row md:h-[92vh] w-full bg-primary border-b-2 border-[#202020]"
      >
        {/* MouseCircles — hidden on mobile */}
        <div className="hidden md:block w-1/2 border-r-2 border-[#202020] relative overflow-hidden">
          <MouseCircles variant="same-radius" />
        </div>

        {/* Text column */}
        <div className="flex flex-col w-full md:w-1/2">
          <div className="space-y-4 md:space-y-6 md:h-1/2 border-b-2 border-[#202020] p-5 md:p-6">
            <h2 className="flex items-center gap-2 text-[#f2f2f2]">
              <span className="h-2 w-2 inline-block bg-[#f2f2f2]"></span>
              Web Design &amp; Development
            </h2>
            <div className="text-xl md:text-3xl font-bold text-[#202020]">
              <h2>Web Applications</h2>
              <h2>Business Websites</h2>
              <h2>Landing Pages</h2>
              <h2>Website Redesign</h2>
              <h2>E-commerce Development</h2>
              <h2>SEO Optimization</h2>
            </div>
          </div>
          <div className="p-5 md:p-6 md:h-1/2 flex items-start md:items-center">
            <p className="text-base md:text-lg max-w-2xl text-[#202020]">
              From powerful web applications to high-impact business websites,
              we create digital experiences built to perform. By combining
              thoughtful design, modern development, and SEO optimization, we
              deliver platforms that are fast, scalable, and designed to grow
              with your business.
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default Services;

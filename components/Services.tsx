import MouseCircles from "./MouseCircles";

const Services = () => {
  return (
    <>
      <section data-header-color="bg-primary" className="flex h-[92vh] w-full bg-primary border-b-2 border-[#202020]">
        <div className="h-full w-1/2 border-r-2 border-[#202020]">
          <div className="space-y-6 h-1/2 border-b-2 border-[#202020] p-6">
            <h2 className="flex items-center gap-2 text-[#f2f2f2]">
              <span className="h-2 w-2 inline-block bg-[#f2f2f2]"></span>
              Branding
            </h2>
            <div className="text-3xl font-bold text-[#202020]">
              <h2>Brand strategy</h2>
              <h2>Brand identity</h2>
              <h2>Graphic design</h2>
              <h2>Art directionArt direction</h2>
              <h2>Copywriting</h2>
            </div>
          </div>
          <div className="p-6 h-1/2">
            <p className="text-lg max-w-2xl text-[#202020]">
              Strong brands don’t happen by accident. We combine strategy,
              design, and storytelling to create brands that stand out and
              connect with the right audience. From brand positioning to
              identity design and messaging, we craft cohesive brand experiences
              that leave a lasting impression.
            </p>
          </div>
        </div>
        <div className="w-1/2 relative overflow-hidden">
          <MouseCircles />
        </div>
      </section>
      <section data-header-color="bg-primary" className="flex h-[92vh] w-full bg-primary border-b-2 border-[#202020]">
        <div className="w-1/2 border-r-2 border-[#202020] relative overflow-hidden">
          <MouseCircles variant="same-radius" />
        </div>
        <div className="h-full w-1/2">
          <div className="space-y-6 h-1/2 border-b-2 border-[#202020] p-6">
            <h2 className="flex items-center gap-2 text-[#f2f2f2]">
              <span className="h-2 w-2 inline-block bg-[#f2f2f2]"></span>
              Web Design & Development
            </h2>
            <div className="text-3xl font-bold text-[#202020]">
              <h2>Web Applications</h2>
              <h2>Business Websites</h2>
              <h2>Landing Pages</h2>
              <h2>Website Redesign</h2>
              <h2>E-commerce Development</h2>
              <h2>SEO Optimization</h2>
            </div>
          </div>
          <div className="p-6 h-1/2">
            <p className="text-lg max-w-2xl text-[#202020]">
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

import MainHero from "@/components/MainHero";
import Services from "@/components/Services";
import LoaderWrapper from "@/components/LoaderWrapper";
import Process from "@/components/Process";

export default function Home() {
  return (
    <LoaderWrapper>
      <MainHero />
      <Services />
      <Process />
    </LoaderWrapper>
  );
}

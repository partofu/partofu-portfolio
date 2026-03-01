import MainHero from "@/components/MainHero";
import Services from "@/components/Services";
import LoaderWrapper from "@/components/LoaderWrapper";

export default function Home() {
  return (
    <LoaderWrapper>
      <MainHero />
    </LoaderWrapper>
  );
}

import PageTitle from "../../components/PageTitle";
import CurationSct4 from "./components/CurationSct4";
import GallerySct2 from "./components/GallerySct2";
import HeroSection from "./components/HeroSection";
import TodayPickSct3 from "./components/TodayPickSct3";
import ViewModeSct1 from "./components/ViewModeSct1";

export default function Home() {
  return (
    <>
      <PageTitle title="HOME" />

      <main>
        <HeroSection />
        <ViewModeSct1 />
        <GallerySct2 />
        <TodayPickSct3 />
        <CurationSct4 />
      </main>
    </>
  );
}

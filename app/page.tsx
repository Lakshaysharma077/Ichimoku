import HeroSection from "@/components/home/HeroSection";
import StatsBar from "@/components/home/StatsBar";
import PhilosophySection from "@/components/home/PhilosophySection";
import DashboardPreview from "@/components/home/DashboardPreview";
import SectionDivider from "@/components/shared/SectionDivider";
import ScrollReveal from "@/components/shared/ScrollReveal";

export default function Home() {
  return (
    <>
      <HeroSection />
      <ScrollReveal>
        <StatsBar />
      </ScrollReveal>
      <SectionDivider kanji="刀" />
      <ScrollReveal>
        <PhilosophySection />
      </ScrollReveal>
      <SectionDivider kanji="魂" />
      <ScrollReveal>
        <DashboardPreview />
      </ScrollReveal>
      <SectionDivider kanji="心" />
    </>
  );
}

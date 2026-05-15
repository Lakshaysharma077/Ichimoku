import HeroSection from "@/components/home/HeroSection";
import StatsBar from "@/components/home/StatsBar";
import PhilosophySection from "@/components/home/PhilosophySection";
import DashboardPreview from "@/components/home/DashboardPreview";
import SectionDivider from "@/components/shared/SectionDivider";
import ScrollReveal from "@/components/shared/ScrollReveal";

export default function Home() {
  return (
    <main className="relative">
      <HeroSection />
      <ScrollReveal>
        <StatsBar />
      </ScrollReveal>
      <SectionDivider />
      <ScrollReveal>
        <PhilosophySection />
      </ScrollReveal>
      <SectionDivider />
      <ScrollReveal>
        <DashboardPreview />
      </ScrollReveal>
      <SectionDivider />
    </main>
  );
}

import HeroSection from "@/components/home/HeroSection";
import StatsBar from "@/components/home/StatsBar";
import PhilosophySection from "@/components/home/PhilosophySection";
import DashboardPreview from "@/components/home/DashboardPreview";
import SectionDivider from "@/components/shared/SectionDivider";
import ScrollReveal from "@/components/shared/ScrollReveal";

export default function Home() {
  return (
    <main className="relative">
      {/* Page-wide Samurai Watermark */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] opacity-[0.02] pointer-events-none z-0 grayscale select-none"
        style={{
          backgroundImage: 'url(/logo.png)',
          backgroundSize: 'contain',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />

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

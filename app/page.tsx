import HeroSection from "@/components/home/HeroSection";
import StatsBar from "@/components/home/StatsBar";
import PhilosophySection from "@/components/home/PhilosophySection";
import DashboardPreview from "@/components/home/DashboardPreview";
import SectionDivider from "@/components/shared/SectionDivider";
import ScrollReveal from "@/components/shared/ScrollReveal";

export default function Home() {
  return (
    <main className="relative">
      {/* Home Page Background Image Watermark */}
      <div className="fixed inset-0 z-[-2] pointer-events-none overflow-hidden select-none">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-300"
          style={{ 
            backgroundImage: "url('/Overlay1.jpeg')", 
            opacity: 0.03, // Low opacity as requested to protect readability
          }} 
        />
      </div>

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

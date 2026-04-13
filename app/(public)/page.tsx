import { CtaSection } from "@/components/site/cta-section";
import { HeroSection } from "@/components/site/hero";
import { ProblemCardsSection } from "@/components/site/problem-cards";
import { ShiftSection } from "@/components/site/shift-section";
import { StatsBar } from "@/components/site/stats-bar";

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <StatsBar />
      <ShiftSection />
      <ProblemCardsSection />
      <CtaSection />
    </main>
  );
}

import { Navbar } from "@/components/layout/Navbar";
import { Hero } from "@/components/sections/Hero";
import { ComparisonTable } from "@/components/sections/ComparisonTable";
import { RevenueCalculator } from "@/components/sections/RevenueCalculator";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { SocialProof } from "@/components/sections/SocialProof";
import { Footer } from "@/components/sections/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
      <Navbar />
      <Hero />
      <RevenueCalculator />
      <HowItWorks />
      <ComparisonTable />
      <SocialProof />
      <Footer />
    </main>
  );
}

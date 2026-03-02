import { Navbar } from "@/components/layout/Navbar";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Footer } from "@/components/sections/Footer";

export default function HowItWorksPage() {
  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
      <Navbar />
      <HowItWorks />
      <Footer />
    </main>
  );
}
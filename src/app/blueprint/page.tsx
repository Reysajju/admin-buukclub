import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/sections/Footer";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

const steps = [
    {
        day: "Day 1",
        title: "Application & Vetting",
        desc: "You apply. We review your work to ensure it meets our quality standards.",
    },
    {
        day: "Day 3",
        title: "Your Club is Live",
        desc: "We build your landing page, set up your Stripe, and configure your Discord.",
    },
    {
        day: "Day 7",
        title: "First Live Session",
        desc: "You host your first live book discussion. We handle the tech.",
    },
    {
        day: "Day 30",
        title: "First Payout",
        desc: "Revenue hits your bank account. You wonder why you ever used KDP.",
    },
];

export default function BlueprintPage() {
    return (
        <main className="min-h-screen bg-background">
            <Navbar />
            <div className="pt-32 pb-20 container px-4 md:px-6">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6">The Blueprint</h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        From "Starving Artist" to "Community Leader" in 30 days.
                    </p>
                </div>

                <div className="max-w-3xl mx-auto relative">
                    {/* Vertical Line */}
                    <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-primary/30 -translate-x-1/2 hidden md:block" />

                    <div className="space-y-12">
                        {steps.map((step, i) => (
                            <div key={i} className={`relative flex flex-col md:flex-row gap-8 items-center ${i % 2 === 0 ? "md:flex-row-reverse" : ""}`}>
                                {/* Dot */}
                                <div className="absolute left-4 md:left-1/2 w-4 h-4 bg-primary rounded-full -translate-x-1/2 shadow-[0_0_10px_rgba(0,240,255,0.8)] hidden md:block" />

                                <div className="w-full md:w-1/2">
                                    <Card className="border-primary/20 hover:border-primary/50 transition-colors">
                                        <CardContent className="p-6">
                                            <div className="text-primary font-bold text-xl mb-2">{step.day}</div>
                                            <h3 className="text-2xl font-bold mb-2">{step.title}</h3>
                                            <p className="text-muted-foreground">{step.desc}</p>
                                        </CardContent>
                                    </Card>
                                </div>
                                <div className="w-full md:w-1/2 hidden md:block" />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-20 text-center">
                    <Link href="/apply">
                        <Button variant="default" size="lg" className="text-xl px-10 py-6">
                            Start Your Timeline
                        </Button>
                    </Link>
                </div>
            </div>
            <Footer />
        </main>
    );
}

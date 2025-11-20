import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/sections/Footer";
import { Button } from "@/components/ui/Button";
import { Check } from "lucide-react";
import Link from "next/link";

export default function ScoutPage() {
    return (
        <main className="min-h-screen bg-background">
            <Navbar />
            <div className="pt-32 pb-20 container px-4 md:px-6">
                <div className="max-w-3xl mx-auto text-center mb-16">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6">The Scout Program</h1>
                    <p className="text-xl text-muted-foreground">
                        Know a talented author? Refer them and earn <span className="text-primary">5% of our revenue share</span> from their club forever.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
                    <div className="space-y-6">
                        <h2 className="text-3xl font-bold">How it Works</h2>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                                <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold shrink-0">1</div>
                                <p className="text-lg">You apply to become a Scout (we vet our partners).</p>
                            </li>
                            <li className="flex items-start gap-3">
                                <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold shrink-0">2</div>
                                <p className="text-lg">You get a unique referral link.</p>
                            </li>
                            <li className="flex items-start gap-3">
                                <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold shrink-0">3</div>
                                <p className="text-lg">An author joins via your link and launches a club.</p>
                            </li>
                            <li className="flex items-start gap-3">
                                <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold shrink-0">4</div>
                                <p className="text-lg">We pay you 5% of our take, every single month. Passive income.</p>
                            </li>
                        </ul>
                        <div className="pt-6">
                            <Link href="/apply?role=scout">
                                <Button variant="outline" size="lg">
                                    Apply as a Scout
                                </Button>
                            </Link>
                        </div>
                    </div>

                    <div className="bg-muted/20 p-8 rounded-lg border border-border/50">
                        <h3 className="text-2xl font-bold mb-6">Why Scout?</h3>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <Check className="text-primary h-5 w-5" />
                                <span>Help authors escape poverty</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Check className="text-primary h-5 w-5" />
                                <span>Build a recurring revenue stream</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Check className="text-primary h-5 w-5" />
                                <span>No cap on earnings</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Check className="text-primary h-5 w-5" />
                                <span>Access to exclusive Scout community</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    );
}

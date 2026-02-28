import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/sections/Footer";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

export default function ManifestoPage() {
    return (
        <main className="min-h-screen bg-background">
            <Navbar />
            <div className="pt-32 pb-20 container px-4 md:px-6 max-w-4xl mx-auto">
                <div className="prose prose-invert prose-lg mx-auto">
                    <h1 className="text-5xl md:text-7xl font-bold mb-8 text-center tracking-tighter">
                        The <span className="text-primary text-glow">Anti-Amazon</span> Manifesto.
                    </h1>

                    <p className="lead text-xl text-muted-foreground text-center mb-12">
                        Why we are declaring war on the "Best Seller" list.
                    </p>

                    <div className="space-y-8">
                        <section>
                            <h2 className="text-3xl font-bold text-foreground mb-4">The Great Robbery</h2>
                            <p>
                                For too long, authors have been treated as content mills. You write the book, you edit it, you market it.
                                And what does Amazon do? They take 30% to 70% of your royalties. They hide your customer's email addresses.
                                They force you to pay for ads just to be seen on their platform.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-3xl font-bold text-foreground mb-4">The "Patreon" Problem</h2>
                            <p>
                                "But what about Patreon?" you ask. Patreon is great for donations, but it's terrible for community.
                                It's a blog with a paywall. It's clunky. It doesn't facilitate live, real-time connection.
                                It feels like a transaction, not a club.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-3xl font-bold text-foreground mb-4">The Solution: Direct-to-Fan</h2>
                            <p>
                                We believe in a future where authors are platform-independent. Where you own the relationship.
                                Where you own the data. Where you keep the lion's share of the revenue.
                            </p>
                            <ul className="list-disc pl-6 space-y-2 marker:text-primary">
                                <li><strong>High Ticket:</strong> Stop selling for $2.99. Sell access for $29.99.</li>
                                <li><strong>Live Events:</strong> Book clubs should be live, interactive, and fun.</li>
                                <li><strong>Ownership:</strong> You get the email list. You get the Stripe account.</li>
                            </ul>
                        </section>
                    </div>

                    <div className="mt-16 text-center">
                        <Link href="/apply">
                            <Button variant="default" size="lg" className="text-xl px-10 py-6">
                                Join the Revolution
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    );
}

"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/sections/Footer";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useState } from "react";
import { BookOpen, CheckCircle2 } from "lucide-react";

export default function JoinPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        favoriteGenre: "",
        booksPerYear: "",
        ticketCode: "", // New optional field
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError("");

        try {
            const response = await fetch("/api/join", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...formData,
                    timestamp: new Date().toISOString(),
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to submit");
            }

            setIsSuccess(true);
        } catch (err) {
            setError("Something went wrong. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSuccess) {
        return (
            <main className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground flex flex-col">
                <Navbar />

                <section className="flex-1 flex items-center justify-center px-4 pt-32 pb-20">
                    <div className="max-w-2xl mx-auto text-center">
                        <div className="mb-8 flex justify-center">
                            <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
                                <CheckCircle2 className="h-12 w-12 text-primary" />
                            </div>
                        </div>

                        <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4 text-primary">
                            Thanks for Joining!
                        </h1>
                        <p className="text-xl text-muted-foreground mb-8">
                            Welcome to the waitlist. We'd love to onboard you soon!
                        </p>
                        <p className="text-foreground/80 mb-8">
                            We'll be in touch shortly with exclusive updates about BuukClub.
                            Keep an eye on your inbox for exciting news about our launch.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button
                                variant="default"
                                size="lg"
                                onClick={() => window.location.href = "/"}
                                className="font-serif"
                            >
                                Back to Home
                            </Button>
                            <Button
                                variant="outline"
                                size="lg"
                                onClick={() => window.location.href = "/blog"}
                                className="font-serif"
                            >
                                Explore Our Blog
                            </Button>
                        </div>
                    </div>
                </section>

                <Footer />
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground flex flex-col">
            <Navbar />

            <section className="flex-1 pt-32 pb-20 px-4">
                <div className="container max-w-2xl mx-auto">
                    <div className="text-center mb-12">
                        <div className="mb-6 flex justify-center">
                            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                                <BookOpen className="h-8 w-8 text-primary" />
                            </div>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4 text-primary">
                            Join BuukClub
                        </h1>
                        <p className="text-lg text-muted-foreground">
                            Claim your spot in an upcoming session. BuukClub assigned seats are always 100% free for readers.
                        </p>
                    </div>

                    <div className="bg-card border border-border rounded-lg p-8 shadow-sm">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium font-serif">Full Name *</label>
                                <Input
                                    type="text"
                                    placeholder="Jane Austen"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                    className="h-12"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium font-serif">Email Address *</label>
                                <Input
                                    type="email"
                                    placeholder="jane@example.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                    className="h-12"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium font-serif">Favorite Genre</label>
                                <Input
                                    type="text"
                                    placeholder="Mystery, Romance, Sci-Fi..."
                                    value={formData.favoriteGenre}
                                    onChange={(e) => setFormData({ ...formData, favoriteGenre: e.target.value })}
                                    className="h-12"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium font-serif">Books You Read Per Year</label>
                                <Input
                                    type="number"
                                    placeholder="12"
                                    value={formData.booksPerYear}
                                    onChange={(e) => setFormData({ ...formData, booksPerYear: e.target.value })}
                                    className="h-12"
                                />
                            </div>

                            <div className="space-y-2 pt-4 border-t">
                                <label className="text-sm font-medium font-serif flex justify-between">
                                    <span>Ticket Code</span>
                                    <span className="text-xs font-normal text-muted-foreground italic">Optional</span>
                                </label>
                                <Input
                                    type="text"
                                    placeholder="e.g. AUTHORS-FRIEND-2025"
                                    value={formData.ticketCode}
                                    onChange={(e) => setFormData({ ...formData, ticketCode: e.target.value })}
                                    className="h-12 border-primary/20 focus:border-primary"
                                />
                                <p className="text-xs text-muted-foreground">If you were invited specifically by an author, enter your code here.</p>
                            </div>

                            {error && (
                                <div className="bg-red-500/10 border border-red-500/30 rounded-md p-3 text-sm text-red-500">
                                    {error}
                                </div>
                            )}

                            <Button
                                type="submit"
                                className="w-full font-serif text-lg py-6"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Joining..." : "Join the Waitlist"}
                            </Button>

                            <p className="text-xs text-center text-muted-foreground">
                                By joining, you agree to receive updates about BuukClub. We respect your privacy.
                            </p>
                        </form>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}

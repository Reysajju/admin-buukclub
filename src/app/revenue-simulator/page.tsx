"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/sections/Footer";
import { Button } from "@/components/ui/Button";
import { useState } from "react";
import { AlertCircle, TrendingUp, Users, DollarSign, BookOpen } from "lucide-react";

export default function RevenueSimulatorPage() {
    const [followers, setFollowers] = useState(5000);
    const [avgBookPrice, setAvgBookPrice] = useState(12);
    const [booksPerYear, setBooksPerYear] = useState(2);
    const [membershipPrice, setMembershipPrice] = useState(25);

    // Hypothetical conversion rates based on "trained data" (simulated)
    const directSalesConversion = 0.02; // 2% of followers buy books
    const membershipConversion = 0.008; // 0.8% join paid club

    // Calculate projections
    const bookSalesPerRelease = Math.floor(followers * directSalesConversion);
    const annualBookRevenue = bookSalesPerRelease * booksPerYear * avgBookPrice;
    const monthlyMembers = Math.floor(followers * membershipConversion);
    const annualMembershipRevenue = monthlyMembers * membershipPrice * 12;
    const totalAnnualRevenue = annualBookRevenue + annualMembershipRevenue;

    return (
        <main className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground flex flex-col">
            <Navbar />

            <section className="flex-1 pt-32 pb-20 px-4">
                <div className="container max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4 text-primary">
                            Hypothetical Revenue Simulator
                        </h1>
                        <p className="text-lg text-muted-foreground mb-6">
                            Explore potential revenue scenarios based on data-driven models.
                        </p>

                        {/* Prominent Disclaimer */}
                        <div className="bg-accent/10 border-2 border-accent/30 rounded-lg p-6 max-w-2xl mx-auto">
                            <div className="flex items-start gap-3">
                                <AlertCircle className="h-6 w-6 text-accent shrink-0 mt-1" />
                                <div className="text-left">
                                    <h3 className="font-serif font-bold text-accent mb-2">Important Disclaimer</h3>
                                    <p className="text-sm text-foreground/90 leading-relaxed">
                                        This simulator is based on <strong>hypothetical trained data models</strong> and industry averages.
                                        Results are <strong>not guaranteed</strong> and do not represent realistic earnings for any individual.
                                        Actual results vary widely based on genre, audience quality, marketing, and numerous other factors.
                                        Use for exploratory purposes only.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Input Controls */}
                    <div className="bg-card border border-border rounded-lg p-8 shadow-sm mb-8">
                        <h2 className="text-2xl font-serif font-bold mb-6 text-center">Your Parameters</h2>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium font-serif flex items-center gap-2">
                                    <Users className="h-4 w-4 text-primary" />
                                    Total Audience Size
                                </label>
                                <input
                                    type="number"
                                    value={followers}
                                    onChange={(e) => setFollowers(Number(e.target.value))}
                                    className="w-full p-3 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                />
                                <p className="text-xs text-muted-foreground">Combined followers across all platforms</p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium font-serif flex items-center gap-2">
                                    <BookOpen className="h-4 w-4 text-primary" />
                                    Books Published per Year
                                </label>
                                <input
                                    type="number"
                                    value={booksPerYear}
                                    onChange={(e) => setBooksPerYear(Number(e.target.value))}
                                    className="w-full p-3 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                />
                                <p className="text-xs text-muted-foreground">How many books you plan to release annually</p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium font-serif flex items-center gap-2">
                                    <DollarSign className="h-4 w-4 text-primary" />
                                    Average Book Price ($)
                                </label>
                                <input
                                    type="number"
                                    value={avgBookPrice}
                                    onChange={(e) => setAvgBookPrice(Number(e.target.value))}
                                    className="w-full p-3 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                />
                                <p className="text-xs text-muted-foreground">Typical sale price of your books</p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium font-serif flex items-center gap-2">
                                    <TrendingUp className="h-4 w-4 text-primary" />
                                    Monthly Membership Price ($)
                                </label>
                                <input
                                    type="number"
                                    value={membershipPrice}
                                    onChange={(e) => setMembershipPrice(Number(e.target.value))}
                                    className="w-full p-3 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                />
                                <p className="text-xs text-muted-foreground">Price for exclusive club membership</p>
                            </div>
                        </div>
                    </div>

                    {/* Results */}
                    <div className="bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20 rounded-lg p-8 shadow-md">
                        <h2 className="text-2xl font-serif font-bold mb-6 text-center">Hypothetical Annual Projections</h2>

                        <div className="grid md:grid-cols-3 gap-6 mb-8">
                            <div className="bg-card/80 backdrop-blur-sm p-6 rounded-lg border border-border/50">
                                <p className="text-sm text-muted-foreground mb-1 font-serif">Book Sales Revenue</p>
                                <p className="text-3xl font-bold text-primary">${annualBookRevenue.toLocaleString()}</p>
                                <p className="text-xs text-muted-foreground mt-2">
                                    ~{bookSalesPerRelease.toLocaleString()} copies per release
                                </p>
                            </div>

                            <div className="bg-card/80 backdrop-blur-sm p-6 rounded-lg border border-border/50">
                                <p className="text-sm text-muted-foreground mb-1 font-serif">Membership Revenue</p>
                                <p className="text-3xl font-bold text-secondary">${annualMembershipRevenue.toLocaleString()}</p>
                                <p className="text-xs text-muted-foreground mt-2">
                                    {monthlyMembers.toLocaleString()} active members
                                </p>
                            </div>

                            <div className="bg-card/80 backdrop-blur-sm p-6 rounded-lg border border-accent/50">
                                <p className="text-sm text-muted-foreground mb-1 font-serif">Total Projected</p>
                                <p className="text-3xl font-bold text-accent">${totalAnnualRevenue.toLocaleString()}</p>
                                <p className="text-xs text-muted-foreground mt-2">
                                    Combined annual income
                                </p>
                            </div>
                        </div>

                        {/* Model Assumptions */}
                        <div className="bg-muted/30 rounded-lg p-6 border border-border/50">
                            <h3 className="font-serif font-bold text-sm mb-3 text-foreground/90">Model Assumptions (Hypothetical)</h3>
                            <ul className="text-xs text-muted-foreground space-y-1">
                                <li>• <strong>Book Sales Conversion:</strong> {(directSalesConversion * 100).toFixed(1)}% of audience purchases each new release</li>
                                <li>• <strong>Membership Conversion:</strong> {(membershipConversion * 100).toFixed(1)}% of audience joins paid community</li>
                                <li>• <strong>Retention:</strong> 100% annual retention (unrealistic, for illustration only)</li>
                                <li>• <strong>Growth:</strong> Static audience size (no growth factored in)</li>
                                <li>• <strong>Costs:</strong> Platform fees, marketing, and production costs not included</li>
                            </ul>
                            <p className="text-xs text-muted-foreground mt-4 italic">
                                These conversion rates are based on aggregated industry data and may not reflect your specific situation.
                            </p>
                        </div>
                    </div>

                    {/* CTA */}
                    <div className="mt-12 text-center">
                        <p className="text-muted-foreground mb-6 text-lg font-serif italic">
                            Ready to explore what's possible for your author career?
                        </p>
                        <Button className="font-serif text-lg px-8 py-6" size="lg">
                            Start Your Journey
                        </Button>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}

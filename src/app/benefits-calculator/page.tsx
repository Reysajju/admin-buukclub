'use client';

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/sections/Footer";
import { Button } from "@/components/ui/Button";
import { useState } from "react";
import { BookOpen, Users, Calendar, Gift, Sparkles } from "lucide-react";
import Link from "next/link";

export default function BenefitsCalculator() {
    const [monthlyBudget, setMonthlyBudget] = useState(20);
    const [clubsToJoin, setClubsToJoin] = useState(3);

    const booksPerMonth = Math.floor(clubsToJoin * 0.5); // Assuming ~0.5 books per club
    const eventsPerMonth = clubsToJoin * 2; // 2 events per club per month
    const exclusiveContent = clubsToJoin * 4; // 4 pieces of content per club
    const annualSavings = Math.round(monthlyBudget * 12 * 0.20); // 20% discount on books

    return (
        <main className="min-h-screen bg-background">
            <Navbar />
            <div className="pt-32 pb-20 container px-4 md:px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-6xl font-bold mb-6 serif-heading">
                            Your Reading Benefits Calculator
                        </h1>
                        <p className="text-xl text-muted-foreground">
                            See exactly what you get as a BuukClub member
                        </p>
                    </div>

                    <div className="bg-card p-8 rounded-lg border border-border shadow-lg mb-8">
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Your Monthly Reading Budget
                                </label>
                                <div className="flex items-center gap-4">
                                    <input
                                        type="range"
                                        min="10"
                                        max="100"
                                        value={monthlyBudget}
                                        onChange={(e) => setMonthlyBudget(Number(e.target.value))}
                                        className="flex-1 h-2 bg-muted rounded-lg appearance-none cursor-pointer"
                                    />
                                    <span className="text-2xl font-bold text-primary min-w-[100px]">
                                        ${monthlyBudget}/mo
                                    </span>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Book Clubs You Want to Join
                                </label>
                                <div className="flex items-center gap-4">
                                    <input
                                        type="range"
                                        min="1"
                                        max="10"
                                        value={clubsToJoin}
                                        onChange={(e) => setClubsToJoin(Number(e.target.value))}
                                        className="flex-1 h-2 bg-muted rounded-lg appearance-none cursor-pointer"
                                    />
                                    <span className="text-2xl font-bold text-primary min-w-[100px]">
                                        {clubsToJoin} clubs
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Results */}
                    <div className="grid md:grid-cols-2 gap-6 mb-8">
                        <div className="bg-card p-6 rounded-lg border border-primary/20 hover:border-primary/50 transition-colors">
                            <div className="flex items-center gap-3 mb-4">
                                <BookOpen className="w-8 h-8 text-primary" />
                                <h3 className="text-xl font-bold">Books Per Month</h3>
                            </div>
                            <p className="text-4xl font-bold text-primary mb-2">{booksPerMonth}+</p>
                            <p className="text-muted-foreground">
                                Curated selections from your favorite authors
                            </p>
                        </div>

                        <div className="bg-card p-6 rounded-lg border border-primary/20 hover:border-primary/50 transition-colors">
                            <div className="flex items-center gap-3 mb-4">
                                <Calendar className="w-8 h-8 text-primary" />
                                <h3 className="text-xl font-bold">Live Events</h3>
                            </div>
                            <p className="text-4xl font-bold text-primary mb-2">{eventsPerMonth}</p>
                            <p className="text-muted-foreground">
                                Monthly Q&As, live readings, and author discussions
                            </p>
                        </div>

                        <div className="bg-card p-6 rounded-lg border border-primary/20 hover:border-primary/50 transition-colors">
                            <div className="flex items-center gap-3 mb-4">
                                <Sparkles className="w-8 h-8 text-primary" />
                                <h3 className="text-xl font-bold">Exclusive Content</h3>
                            </div>
                            <p className="text-4xl font-bold text-primary mb-2">{exclusiveContent}</p>
                            <p className="text-muted-foreground">
                                Bonus chapters, deleted scenes, and behind-the-scenes
                            </p>
                        </div>

                        <div className="bg-card p-6 rounded-lg border border-primary/20 hover:border-primary/50 transition-colors">
                            <div className="flex items-center gap-3 mb-4">
                                <Gift className="w-8 h-8 text-primary" />
                                <h3 className="text-xl font-bold">Annual Savings</h3>
                            </div>
                            <p className="text-4xl font-bold text-primary mb-2">${annualSavings}</p>
                            <p className="text-muted-foreground">
                                With 20% member discount on all book purchases
                            </p>
                        </div>
                    </div>

                    <div className="bg-muted/50 p-8 rounded-lg text-center">
                        <h3 className="text-2xl font-bold mb-4">Plus, You'll Get:</h3>
                        <div className="grid md:grid-cols-3 gap-4 mb-6">
                            <div className="flex items-center gap-2 justify-center">
                                <Users className="w-5 h-5 text-primary" />
                                <span>Community access</span>
                            </div>
                            <div className="flex items-center gap-2 justify-center">
                                <BookOpen className="w-5 h-5 text-primary" />
                                <span>Reading recommendations</span>
                            </div>
                            <div className="flex items-center gap-2 justify-center">
                                <Sparkles className="w-5 h-5 text-primary" />
                                <span>Early book access</span>
                            </div>
                        </div>
                        <Link href="/join">
                            <Button size="lg" variant="default" className="text-lg px-8 py-6">
                                Join BuukClub Today
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    );
}

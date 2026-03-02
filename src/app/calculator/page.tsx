"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/sections/Footer";
import { Button } from "@/components/ui/Button";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Book, Clock, Zap, Target } from "lucide-react";

export default function CalculatorPage() {
    const [booksPerYear, setBooksPerYear] = useState(24);
    const [avgPages, setAvgPages] = useState(320);
    const [readingSpeed, setReadingSpeed] = useState(40); // Pages per hour
    const [isCalculated, setIsCalculated] = useState(false);

    const stats = useMemo(() => {
        const totalPages = booksPerYear * avgPages;
        const totalHours = totalPages / readingSpeed;
        const dailyHours = totalHours / 365;
        const dailyMinutes = Math.round(dailyHours * 60);
        const pagesPerDay = Math.ceil(totalPages / 365);

        return {
            dailyMinutes,
            pagesPerDay,
            totalHoursYear: Math.round(totalHours),
        };
    }, [booksPerYear, avgPages, readingSpeed]);

    return (
        <main className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground flex flex-col">
            <Navbar />

            <section className="flex-1 pt-32 pb-20 px-4 relative overflow-hidden">
                {/* Decorative background elements */}
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[100px] -z-10" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-[100px] -z-10" />

                <div className="container max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-16"
                    >
                        <span className="text-primary font-bold tracking-widest uppercase text-xs mb-4 block">Reader Tools</span>
                        <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6 tracking-tight">Design Your Reading Year</h1>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                            Turn your reading goals from "someday" into a sustainable daily ritual.
                            Calculate exactly what it takes to master your library.
                        </p>
                    </motion.div>

                    <div className="grid lg:grid-cols-2 gap-12 items-start">
                        {/* Inputs */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-card/50 backdrop-blur-xl border border-border/50 rounded-3xl p-8 shadow-2xl relative"
                        >
                            <div className="space-y-8">
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center text-sm font-medium">
                                        <div className="flex items-center gap-2">
                                            <Book className="w-4 h-4 text-primary" />
                                            <span>Annual Book Goal</span>
                                        </div>
                                        <span className="text-primary font-bold">{booksPerYear} books</span>
                                    </div>
                                    <input
                                        type="range"
                                        min={1}
                                        max={100}
                                        value={booksPerYear}
                                        onChange={(e) => { setBooksPerYear(Number(e.target.value)); setIsCalculated(true); }}
                                        className="w-full h-1.5 bg-muted rounded-full appearance-none cursor-pointer accent-primary"
                                    />
                                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">How many books do you crave to finish?</p>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex justify-between items-center text-sm font-medium">
                                        <div className="flex items-center gap-2">
                                            <Zap className="w-4 h-4 text-primary" />
                                            <span>Avg. Pages per Book</span>
                                        </div>
                                        <span className="text-primary font-bold">{avgPages} pgs</span>
                                    </div>
                                    <input
                                        type="range"
                                        min={100}
                                        max={800}
                                        step={10}
                                        value={avgPages}
                                        onChange={(e) => { setAvgPages(Number(e.target.value)); setIsCalculated(true); }}
                                        className="w-full h-1.5 bg-muted rounded-full appearance-none cursor-pointer accent-primary"
                                    />
                                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Standard non-fiction is ~250-350 pgs.</p>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex justify-between items-center text-sm font-medium">
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-4 h-4 text-primary" />
                                            <span>Reading Speed</span>
                                        </div>
                                        <span className="text-primary font-bold">{readingSpeed} pgs/hr</span>
                                    </div>
                                    <input
                                        type="range"
                                        min={10}
                                        max={100}
                                        value={readingSpeed}
                                        onChange={(e) => { setReadingSpeed(Number(e.target.value)); setIsCalculated(true); }}
                                        className="w-full h-1.5 bg-muted rounded-full appearance-none cursor-pointer accent-primary"
                                    />
                                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Average focused speed is 30-50 pages per hour.</p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Results */}
                        <div className="space-y-6">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={`${booksPerYear}-${avgPages}-${readingSpeed}`}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="bg-primary/5 border border-primary/20 rounded-3xl p-10 text-center space-y-4 relative overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 p-4 opacity-10">
                                        <Target className="w-24 h-24" />
                                    </div>

                                    <p className="text-muted-foreground font-medium uppercase tracking-[0.2em] text-xs">Your Daily Commitment</p>
                                    <div className="flex items-baseline justify-center gap-2">
                                        <span className="text-7xl md:text-8xl font-serif font-bold text-primary">{stats.dailyMinutes}</span>
                                        <span className="text-xl font-medium text-muted-foreground">min/day</span>
                                    </div>

                                    <div className="pt-6 grid grid-cols-2 gap-4 border-t border-primary/10 mt-6 text-sm">
                                        <div className="space-y-1">
                                            <p className="text-muted-foreground text-[10px] uppercase">Daily Pace</p>
                                            <p className="font-bold">{stats.pagesPerDay} pages</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-muted-foreground text-[10px] uppercase">Annual Investment</p>
                                            <p className="font-bold">{stats.totalHoursYear} hours</p>
                                        </div>
                                    </div>
                                </motion.div>
                            </AnimatePresence>

                            <div className="bg-card border border-border/50 rounded-2xl p-6 text-sm text-muted-foreground leading-relaxed italic">
                                "The difference between who you are and who you want to be is what you do. These {stats.dailyMinutes} minutes are your window to a new version of yourself."
                            </div>

                            <Link href="/join" className="block w-full">
                                <Button className="w-full py-8 text-xl font-serif rounded-2xl shadow-xl shadow-primary/10 hover:shadow-primary/20 transition-all">
                                    Start My Reading Journey
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}

// Helper to avoid build error with Link
import Link from "next/link";

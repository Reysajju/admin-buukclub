"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/sections/Footer";
import { Button } from "@/components/ui/Button";
import { useState } from "react";

export default function CalculatorPage() {
    const [booksPerYear, setBooksPerYear] = useState(12);
    const [avgPages, setAvgPages] = useState(300);
    const [readingSpeed, setReadingSpeed] = useState(30); // Pages per hour
    const [result, setResult] = useState<number | null>(null);

    const calculate = () => {
        const totalPages = booksPerYear * avgPages;
        const totalHours = totalPages / readingSpeed;
        const dailyHours = totalHours / 365;
        const dailyMinutes = Math.round(dailyHours * 60);
        setResult(dailyMinutes);
    };

    return (
        <main className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground flex flex-col">
            <Navbar />

            <section className="flex-1 pt-32 pb-20 px-4">
                <div className="container max-w-2xl mx-auto">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4 text-primary">Reading Goal Calculator</h1>
                        <p className="text-lg text-muted-foreground">
                            Find out how much time you need to dedicate daily to achieve your reading dreams.
                        </p>
                    </div>

                    <div className="bg-card border border-border rounded-lg p-8 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-primary/20"></div>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium font-serif">Books per Year</label>
                                <input
                                    type="number"
                                    value={booksPerYear}
                                    onChange={(e) => setBooksPerYear(Number(e.target.value))}
                                    className="w-full p-3 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                />
                                <p className="text-xs text-muted-foreground">How many books do you want to read this year?</p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium font-serif">Average Pages per Book</label>
                                <input
                                    type="number"
                                    value={avgPages}
                                    onChange={(e) => setAvgPages(Number(e.target.value))}
                                    className="w-full p-3 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                />
                                <p className="text-xs text-muted-foreground">Standard novels are usually 300-350 pages.</p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium font-serif">Reading Speed (Pages per Hour)</label>
                                <input
                                    type="number"
                                    value={readingSpeed}
                                    onChange={(e) => setReadingSpeed(Number(e.target.value))}
                                    className="w-full p-3 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                />
                                <p className="text-xs text-muted-foreground">Average reading speed is about 30-40 pages per hour.</p>
                            </div>

                            <Button
                                onClick={calculate}
                                className="w-full font-serif text-lg py-6 mt-4"
                            >
                                Calculate My Goal
                            </Button>
                        </div>

                        {result !== null && (
                            <div className="mt-8 p-6 bg-secondary/10 rounded-lg border border-secondary/20 text-center animate-in fade-in slide-in-from-bottom-4">
                                <p className="text-muted-foreground mb-2 font-serif italic">To read {booksPerYear} books this year, you need to read for:</p>
                                <p className="text-5xl font-bold text-primary font-serif mb-2">
                                    {result} <span className="text-2xl font-normal text-foreground">min/day</span>
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    That's just {Math.ceil(result / (60 / readingSpeed))} pages a day!
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}

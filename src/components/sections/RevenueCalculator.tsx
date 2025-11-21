"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { motion, useSpring, useTransform, animate } from "framer-motion";
import Link from "next/link";

function Counter({ value }: { value: number }) {
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
        const controls = animate(displayValue, value, {
            duration: 1,
            onUpdate: (latest: number) => setDisplayValue(Math.floor(latest)),
            ease: "easeOut"
        });
        return controls.stop;
    }, [value, displayValue]);

    return <span>{displayValue.toLocaleString()}</span>;
}

export function RevenueCalculator() {
    const [budget, setBudget] = useState<number>(150);

    // Calculate loyal fans range based on budget tier
    const calculateFansRange = (budget: number) => {
        if (budget < 100) return { min: 10, max: 30 };
        if (budget < 200) return { min: 50, max: 100 };
        if (budget < 400) return { min: 100, max: 200 };
        return { min: Math.floor(budget * 0.5), max: Math.floor(budget * 1.2) };
    };

    const fansRange = calculateFansRange(budget);

    return (
        <section className="py-20 relative overflow-hidden">
            <div className="absolute inset-0 bg-primary/5 blur-[100px] -z-10" />

            <div className="container px-4 md:px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl md:text-5xl font-bold mb-4 serif-heading">Build Your Loyal Fan Community</h2>
                    <p className="text-muted-foreground text-lg">Turn readers into passionate fans who champion your work.</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <Card className="max-w-2xl mx-auto border-primary/30 shadow-[0_0_50px_rgba(197,160,89,0.15)] bg-card/80 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle className="text-center font-serif text-2xl">Loyal Fans Calculator</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-8">
                            <div className="space-y-6">
                                <div className="space-y-4">
                                    <label className="text-sm font-medium flex justify-between items-center">
                                        <span>Your Monthly Budget</span>
                                        <motion.span
                                            key={budget}
                                            initial={{ scale: 1.2 }}
                                            animate={{ scale: 1 }}
                                            className="text-primary font-bold px-3 py-1 bg-primary/10 rounded-full"
                                        >
                                            ${budget}
                                        </motion.span>
                                    </label>
                                    <div className="relative pt-2 pb-1">
                                        <input
                                            type="range"
                                            min="10"
                                            max="1000"
                                            step="10"
                                            value={budget}
                                            onChange={(e) => setBudget(Number(e.target.value))}
                                            className="slider-enhanced w-full h-3 bg-gradient-to-r from-muted via-primary/20 to-primary/40 rounded-full appearance-none cursor-pointer 
                                            [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 
                                            [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-br [&::-webkit-slider-thumb]:from-primary [&::-webkit-slider-thumb]:to-accent 
                                            [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-primary/50 [&::-webkit-slider-thumb]:cursor-pointer 
                                            [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-background [&::-webkit-slider-thumb]:transition-all 
                                            [&::-webkit-slider-thumb]:hover:scale-110 [&::-webkit-slider-thumb]:active:scale-95
                                            [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:rounded-full 
                                            [&::-moz-range-thumb]:bg-gradient-to-br [&::-moz-range-thumb]:from-primary [&::-moz-range-thumb]:to-accent 
                                            [&::-moz-range-thumb]:shadow-lg [&::-moz-range-thumb]:shadow-primary/50 [&::-moz-range-thumb]:cursor-pointer 
                                            [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-background [&::-moz-range-thumb]:transition-all
                                            [&::-moz-range-thumb]:hover:scale-110 [&::-moz-range-thumb]:active:scale-95 [&::-moz-range-thumb]:border-0"
                                        />
                                    </div>
                                    <p className="text-xs text-muted-foreground text-center">Adjust your budget to see estimated loyal fan growth.</p>
                                </div>
                            </div>

                            <div className="p-6 bg-muted/50 rounded-lg space-y-4 border border-border/50">
                                <div className="flex justify-between items-center">
                                    <span className="text-lg font-medium">Estimated Loyal Fans</span>
                                    <motion.span
                                        key={fansRange.max}
                                        initial={{ scale: 1.2, color: "var(--primary)" }}
                                        animate={{ scale: 1, color: "var(--primary)" }}
                                        className="text-4xl font-bold text-primary text-glow"
                                    >
                                        <Counter value={fansRange.min} />-<Counter value={fansRange.max} />
                                    </motion.span>
                                </div>
                                <p className="text-xs text-center text-muted-foreground pt-2">
                                    *Engaged readers who opt-in to receive updates from you.
                                </p>
                            </div>

                            <Link href="/apply" className="block">
                                <Button className="w-full text-lg h-12 shadow-lg hover:shadow-primary/20 transition-all" variant="default">
                                    Start Building Your Community
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </section>
    );
}

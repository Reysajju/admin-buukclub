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
    const [followers, setFollowers] = useState<number>(10000);
    const [price, setPrice] = useState<number>(20);

    // Assumptions:
    // 1% conversion rate to paid club members
    const conversionRate = 0.01;
    const members = Math.floor(followers * conversionRate);
    const monthlyIncome = members * price;

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
                    <h2 className="text-3xl md:text-5xl font-bold mb-4 serif-heading">Calculate Your Escape Velocity</h2>
                    <p className="text-muted-foreground text-lg">See what happens when you own the platform.</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <Card className="max-w-2xl mx-auto border-primary/30 shadow-[0_0_50px_rgba(197,160,89,0.15)] bg-card/80 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle className="text-center font-serif text-2xl">Monthly Revenue Simulator</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-8">
                            <div className="grid gap-8 md:grid-cols-2">
                                <div className="space-y-4">
                                    <label className="text-sm font-medium flex justify-between items-center">
                                        <span>Total Social Followers</span>
                                        <motion.span
                                            key={followers}
                                            initial={{ scale: 1.2 }}
                                            animate={{ scale: 1 }}
                                            className="text-primary font-bold px-3 py-1 bg-primary/10 rounded-full"
                                        >
                                            {followers.toLocaleString()}
                                        </motion.span>
                                    </label>
                                    <div className="relative pt-2 pb-1">
                                        <input
                                            type="range"
                                            min="1000"
                                            max="1000000"
                                            step="1000"
                                            value={followers}
                                            onChange={(e) => setFollowers(Number(e.target.value))}
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
                                    <p className="text-xs text-muted-foreground text-center">Across all platforms (TikTok, IG, Twitter)</p>
                                </div>
                                <div className="space-y-4">
                                    <label className="text-sm font-medium flex justify-between items-center">
                                        <span>Monthly Membership Price</span>
                                        <motion.span
                                            key={price}
                                            initial={{ scale: 1.2 }}
                                            animate={{ scale: 1 }}
                                            className="text-primary font-bold px-3 py-1 bg-primary/10 rounded-full"
                                        >
                                            ${price}
                                        </motion.span>
                                    </label>
                                    <div className="relative pt-2 pb-1">
                                        <input
                                            type="range"
                                            min="5"
                                            max="100"
                                            step="1"
                                            value={price}
                                            onChange={(e) => setPrice(Number(e.target.value))}
                                            className="slider-enhanced w-full h-3 bg-gradient-to-r from-muted via-accent/20 to-accent/40 rounded-full appearance-none cursor-pointer 
                                            [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 
                                            [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-br [&::-webkit-slider-thumb]:from-accent [&::-webkit-slider-thumb]:to-primary 
                                            [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-accent/50 [&::-webkit-slider-thumb]:cursor-pointer 
                                            [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-background [&::-webkit-slider-thumb]:transition-all 
                                            [&::-webkit-slider-thumb]:hover:scale-110 [&::-webkit-slider-thumb]:active:scale-95
                                            [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:rounded-full 
                                            [&::-moz-range-thumb]:bg-gradient-to-br [&::-moz-range-thumb]:from-accent [&::-moz-range-thumb]:to-primary 
                                            [&::-moz-range-thumb]:shadow-lg [&::-moz-range-thumb]:shadow-accent/50 [&::-moz-range-thumb]:cursor-pointer 
                                            [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-background [&::-moz-range-thumb]:transition-all
                                            [&::-moz-range-thumb]:hover:scale-110 [&::-moz-range-thumb]:active:scale-95 [&::-moz-range-thumb]:border-0"
                                        />
                                    </div>
                                    <p className="text-xs text-muted-foreground text-center">Recommended: $20 - $50</p>
                                </div>
                            </div>

                            <div className="p-6 bg-muted/50 rounded-lg space-y-4 border border-border/50">
                                <div className="flex justify-between items-center">
                                    <span className="text-muted-foreground">Est. True Fans (1%)</span>
                                    <span className="font-mono text-xl"><Counter value={members} /></span>
                                </div>
                                <div className="h-px bg-border" />
                                <div className="flex justify-between items-center">
                                    <span className="text-lg font-medium">Potential Monthly Income</span>
                                    <motion.span
                                        key={monthlyIncome}
                                        initial={{ scale: 1.2, color: "var(--primary)" }}
                                        animate={{ scale: 1, color: "var(--primary)" }}
                                        className="text-4xl font-bold text-primary text-glow"
                                    >
                                        $<Counter value={monthlyIncome} />
                                    </motion.span>
                                </div>
                                <p className="text-xs text-center text-muted-foreground pt-2">
                                    *Based on a conservative 1% conversion rate. Top authors see 3-5%.
                                </p>
                            </div>

                            <Link href="/apply" className="block">
                                <Button className="w-full text-lg h-12 shadow-lg hover:shadow-primary/20 transition-all" variant="default">
                                    Start Earning This Now
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </section>
    );
}

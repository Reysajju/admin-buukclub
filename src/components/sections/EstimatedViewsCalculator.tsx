"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { motion, animate } from "framer-motion";
import Link from "next/link";

function Counter({ value }: { value: number }) {
    const [displayValue, setDisplayValue] = useState(0);
    const latestValueRef = useRef(0);

    useEffect(() => {
        const controls = animate(latestValueRef.current, value, {
            duration: 1,
            onUpdate: (latest: number) => {
                latestValueRef.current = latest;
                setDisplayValue(Math.floor(latest));
            },
            ease: "easeOut",
        });

        return () => controls.stop();
    }, [value]);

    return <span>{displayValue.toLocaleString()}</span>;
}

export function EstimatedViewsCalculator() {
    const [budget, setBudget] = useState(250);
    const [viewsPerDollar, setViewsPerDollar] = useState(8);
    const [optInRate, setOptInRate] = useState(2.5);
    const [liveAttendanceRate, setLiveAttendanceRate] = useState(15);

    const estimatedViews = useMemo(() => Math.round(budget * viewsPerDollar), [budget, viewsPerDollar]);
    const estimatedEmails = useMemo(
        () => Math.max(0, Math.round(estimatedViews * (optInRate / 100))),
        [estimatedViews, optInRate],
    );
    const estimatedAttendees = useMemo(
        () => Math.max(0, Math.round(estimatedEmails * (liveAttendanceRate / 100))),
        [estimatedEmails, liveAttendanceRate],
    );

    const sliders = [
        {
            label: "Views per $",
            helper: "Typical BuukClub campaign falls between 6-12 views per $",
            value: viewsPerDollar,
            onChange: (val: number) => setViewsPerDollar(Math.max(1, Math.min(20, val))),
            step: 0.5,
            min: 2,
            max: 20,
            suffix: "views",
        },
        {
            label: "Email Opt-In %",
            helper: "Readers who become loyal fans (avg 2-5%)",
            value: optInRate,
            onChange: (val: number) => setOptInRate(Math.max(0.5, Math.min(25, val))),
            step: 0.5,
            min: 0.5,
            max: 25,
            suffix: "%",
        },
        {
            label: "Live Attendance %",
            helper: "Subscribers who show up live (10-30%)",
            value: liveAttendanceRate,
            onChange: (val: number) => setLiveAttendanceRate(Math.max(5, Math.min(60, val))),
            step: 1,
            min: 5,
            max: 60,
            suffix: "%",
        },
    ];

    const milestones = [
        {
            label: "Estimated Views",
            value: estimatedViews,
            description: "Guaranteed readers who spent 30+ sec or 50% scroll",
        },
        {
            label: "New Email Subscribers",
            value: estimatedEmails,
            description: "People who raised their hand to hear from you",
        },
        {
            label: "Live Event Attendees",
            value: estimatedAttendees,
            description: "Readers ready for deeper experiences",
        },
    ];

    return (
        <section className="py-20 relative overflow-hidden">
            <div className="absolute inset-0 bg-primary/5 blur-[120px] -z-10" />
            <div className="container px-4 md:px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <p className="uppercase tracking-[0.3em] text-xs text-primary/80 mb-4">guarantee planner</p>
                    <h2 className="text-3xl md:text-5xl font-bold mb-4 serif-heading">Estimate the Views We Guarantee</h2>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        Slide your budget and assumptions to see transparent math for views, subscribers, and live event attendees.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.97 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <Card className="max-w-4xl mx-auto border-primary/20 shadow-[0_0_60px_rgba(197,160,89,0.12)] bg-card/80 backdrop-blur-sm">
                        <CardHeader className="text-center">
                            <CardTitle className="font-serif text-2xl">Estimated Views Calculator</CardTitle>
                            <p className="text-sm text-muted-foreground">Real math. Real readers. No hand-wavy projections.</p>
                        </CardHeader>
                        <CardContent className="space-y-10">
                            <div className="space-y-6">
                                <label className="text-sm font-medium flex justify-between items-center">
                                    <span>Your Campaign Budget</span>
                                    <motion.span
                                        key={budget}
                                        initial={{ scale: 1.1 }}
                                        animate={{ scale: 1 }}
                                        className="text-primary font-bold px-3 py-1 bg-primary/10 rounded-full"
                                    >
                                        ${budget.toLocaleString()}
                                    </motion.span>
                                </label>
                                <div className="relative pt-2 pb-1">
                                    <input
                                        type="range"
                                        min={50}
                                        max={5000}
                                        step={25}
                                        value={budget}
                                        onChange={(e) => setBudget(Number(e.target.value))}
                                        className="slider-enhanced w-full h-3 bg-gradient-to-r from-muted via-primary/20 to-primary/50 rounded-full appearance-none cursor-pointer \
                                            [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 \
                                            [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-br [&::-webkit-slider-thumb]:from-primary [&::-webkit-slider-thumb]:to-accent \
                                            [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-primary/50 [&::-webkit-slider-thumb]:cursor-pointer \
                                            [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-background [&::-webkit-slider-thumb]:transition-all \
                                            [&::-webkit-slider-thumb]:hover:scale-110 [&::-webkit-slider-thumb]:active:scale-95 \
                                            [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:rounded-full \
                                            [&::-moz-range-thumb]:bg-gradient-to-br [&::-moz-range-thumb]:from-primary [&::-moz-range-thumb]:to-accent \
                                            [&::-moz-range-thumb]:shadow-lg [&::-moz-range-thumb]:shadow-primary/50 [&::-moz-range-thumb]:cursor-pointer \
                                            [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-background [&::-moz-range-thumb]:transition-all \
                                            [&::-moz-range-thumb]:hover:scale-110 [&::-moz-range-thumb]:active:scale-95 [&::-moz-range-thumb]:border-0"
                                    />
                                </div>
                                <p className="text-xs text-muted-foreground text-center">Drag to match the budget you&apos;re comfortable investing this month.</p>
                            </div>

                            <div className="grid md:grid-cols-3 gap-6">
                                {sliders.map((slider) => (
                                    <div key={slider.label} className="space-y-2">
                                        <label className="text-sm font-medium flex items-center justify-between">
                                            <span>{slider.label}</span>
                                            <span className="text-xs text-muted-foreground">{slider.suffix}</span>
                                        </label>
                                        <Input
                                            type="number"
                                            value={slider.value}
                                            step={slider.step}
                                            min={slider.min}
                                            max={slider.max}
                                            onChange={(e) => slider.onChange(Number(e.target.value))}
                                            className="text-lg"
                                        />
                                        <p className="text-xs text-muted-foreground">{slider.helper}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="grid md:grid-cols-3 gap-6">
                                {milestones.map((milestone) => (
                                    <div
                                        key={milestone.label}
                                        className="p-6 bg-muted/40 rounded-lg border border-border/60 text-center space-y-3"
                                    >
                                        <p className="text-sm uppercase tracking-wide text-muted-foreground">{milestone.label}</p>
                                        <motion.div
                                            key={milestone.value}
                                            initial={{ scale: 1.1 }}
                                            animate={{ scale: 1 }}
                                            className="text-4xl font-bold text-primary"
                                        >
                                            <Counter value={milestone.value} />
                                        </motion.div>
                                        <p className="text-xs text-muted-foreground leading-relaxed">{milestone.description}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="bg-muted/30 rounded-xl border border-border/60 p-6 space-y-4">
                                <p className="font-semibold text-sm uppercase tracking-[0.2em] text-muted-foreground">How we calculate it</p>
                                <div className="grid gap-4 md:grid-cols-3">
                                    <div className="p-4 rounded-lg bg-background/80 border border-border/40">
                                        <p className="text-xs text-muted-foreground uppercase mb-1">Step 1</p>
                                        <p className="font-serif">Budget × Views per $</p>
                                        <p className="text-sm text-muted-foreground mt-2">
                                            ${budget.toLocaleString()} × {viewsPerDollar.toFixed(1)} = {estimatedViews.toLocaleString()} guaranteed views
                                        </p>
                                    </div>
                                    <div className="p-4 rounded-lg bg-background/80 border border-border/40">
                                        <p className="text-xs text-muted-foreground uppercase mb-1">Step 2</p>
                                        <p className="font-serif">Views × Opt-In %</p>
                                        <p className="text-sm text-muted-foreground mt-2">
                                            {estimatedViews.toLocaleString()} × {optInRate}% = {estimatedEmails.toLocaleString()} emails captured
                                        </p>
                                    </div>
                                    <div className="p-4 rounded-lg bg-background/80 border border-border/40">
                                        <p className="text-xs text-muted-foreground uppercase mb-1">Step 3</p>
                                        <p className="font-serif">Emails × Live Attendance %</p>
                                        <p className="text-sm text-muted-foreground mt-2">
                                            {estimatedEmails.toLocaleString()} × {liveAttendanceRate}% = {estimatedAttendees.toLocaleString()} attendees
                                        </p>
                                    </div>
                                </div>
                                <p className="text-xs text-muted-foreground text-center">
                                    Assumptions are editable so you can plug in your own historical data.
                                </p>
                            </div>

                            <Link href="/apply" className="block">
                                <Button className="w-full text-lg h-12 shadow-lg hover:shadow-primary/20 transition-all">
                                    Calculate My Guaranteed Readers
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </section>
    );
}

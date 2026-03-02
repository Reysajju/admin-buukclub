"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { motion, animate } from "framer-motion";
import { cn } from "@/lib/utils";
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

const PLANS = {
    basic: { name: "Basic", readers: 75, sessions: 1, color: "bg-blue-500/10 border-blue-500/20 text-blue-500" },
    standard: { name: "Standard", readers: 150, sessions: 2, color: "bg-green-500/10 border-green-500/20 text-green-500" },
    premium: { name: "Premium", readers: 350, sessions: 4, color: "bg-primary/10 border-primary/20 text-primary" },
    platinum: { name: "Platinum", readers: 750, sessions: 5, color: "bg-purple-500/10 border-purple-500/20 text-purple-500" },
};

export function EstimatedViewsCalculator() {
    const [selectedPlan, setSelectedPlan] = useState<keyof typeof PLANS>('standard');
    const [optInRate, setOptInRate] = useState(3.5);
    const [liveAttendanceRate, setLiveAttendanceRate] = useState(20);

    const plan = PLANS[selectedPlan];

    const estimatedMonthlyViews = useMemo(() => plan.readers * plan.sessions * 4.3, [plan]);
    const estimatedEmails = useMemo(
        () => Math.round(estimatedMonthlyViews * (optInRate / 100)),
        [estimatedMonthlyViews, optInRate],
    );
    const estimatedAttendees = useMemo(
        () => Math.round(estimatedEmails * (liveAttendanceRate / 100)),
        [estimatedEmails, liveAttendanceRate],
    );

    const sliders = [
        {
            label: "Fan Conversion %",
            helper: "Readers who join your mailing list (avg 2-5%)",
            value: optInRate,
            onChange: (val: number) => setOptInRate(Math.max(0.5, Math.min(25, val))),
            step: 0.1,
            min: 0.5,
            max: 25,
            suffix: "%",
        },
        {
            label: "Live Event Show-up %",
            helper: "Subscribers who join your live chat (10-30%)",
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
            label: "Assigned Monthly Readers",
            value: estimatedMonthlyViews,
            description: "Total readers directed to your sessions each month",
        },
        {
            label: "Mailing List Growth",
            value: estimatedEmails,
            description: "Direct fans added to your personal database",
        },
        {
            label: "Active Live Community",
            value: estimatedAttendees,
            description: "Highest intent fans interacting with you live",
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
                    <p className="uppercase tracking-[0.3em] text-xs text-primary/80 mb-4">growth planner</p>
                    <h2 className="text-3xl md:text-5xl font-bold mb-4 serif-heading">Calculate Your Direct Window Growth</h2>
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
                                <label className="text-sm font-medium text-center block uppercase tracking-widest text-muted-foreground">
                                    Select Your Growth Plan
                                </label>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    {(Object.entries(PLANS) as [keyof typeof PLANS, typeof PLANS['basic']][]).map(([key, p]) => (
                                        <button
                                            key={key}
                                            onClick={() => setSelectedPlan(key)}
                                            className={cn(
                                                "p-4 rounded-xl border-2 transition-all text-center flex flex-col gap-1",
                                                selectedPlan === key
                                                    ? "border-primary bg-primary/5 shadow-[0_0_20px_rgba(197,160,89,0.2)]"
                                                    : "border-border hover:border-border/80 bg-card"
                                            )}
                                        >
                                            <span className="text-sm font-bold uppercase tracking-tight">{p.name}</span>
                                            <span className="text-[10px] text-muted-foreground">{p.readers} readers/session</span>
                                        </button>
                                    ))}
                                </div>
                                <p className="text-xs text-muted-foreground text-center">
                                    Each plan includes a guaranteed <strong>assigned audience</strong> directed to your live sessions.
                                </p>
                            </div>

                            <div className="grid md:grid-cols-2 gap-8">
                                {sliders.map((slider) => (
                                    <div key={slider.label} className="space-y-3">
                                        <label className="text-sm font-medium flex items-center justify-between">
                                            <span>{slider.label}</span>
                                            <span className="text-primary font-bold">{slider.value}{slider.suffix}</span>
                                        </label>
                                        <input
                                            type="range"
                                            min={slider.min}
                                            max={slider.max}
                                            step={slider.step}
                                            value={slider.value}
                                            onChange={(e) => slider.onChange(Number(e.target.value))}
                                            className="slider-enhanced w-full h-2 bg-muted rounded-full appearance-none cursor-pointer"
                                        />
                                        <p className="text-xs text-muted-foreground italic">{slider.helper}</p>
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
                                <p className="font-semibold text-sm uppercase tracking-[0.2em] text-muted-foreground text-center">Platform Math</p>
                                <div className="grid gap-4 md:grid-cols-3 text-center">
                                    <div className="p-4 rounded-lg bg-background/80 border border-border/40">
                                        <p className="text-[10px] text-muted-foreground uppercase mb-1">Assigned Readers</p>
                                        <p className="font-serif text-sm">
                                            {plan.readers} readers × {plan.sessions} session/wk
                                        </p>
                                        <p className="text-[10px] text-muted-foreground mt-2">
                                            ≈ {Math.round(plan.readers * plan.sessions * 4.3).toLocaleString()} monthly
                                        </p>
                                    </div>
                                    <div className="p-4 rounded-lg bg-background/80 border border-border/40">
                                        <p className="text-[10px] text-muted-foreground uppercase mb-1">Email Conversion</p>
                                        <p className="font-serif text-sm">
                                            Readers × {optInRate}%
                                        </p>
                                        <p className="text-[10px] text-muted-foreground mt-2">
                                            {estimatedEmails.toLocaleString()} new fans
                                        </p>
                                    </div>
                                    <div className="p-4 rounded-lg bg-background/80 border border-border/40">
                                        <p className="text-[10px] text-muted-foreground uppercase mb-1">Live Engagement</p>
                                        <p className="font-serif text-sm">
                                            Emails × {liveAttendanceRate}%
                                        </p>
                                        <p className="text-[10px] text-muted-foreground mt-2">
                                            {estimatedAttendees.toLocaleString()} live attendees
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <Link href="/signup" className="block">
                                <Button className="w-full text-lg h-12 shadow-lg hover:shadow-primary/20 transition-all">
                                    Create My Author Account
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </section>
    );
}

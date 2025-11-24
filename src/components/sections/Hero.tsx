"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { useRef, useState } from "react";

const PERSONA_COPY = {
    author: {
        badge: "For Authors",
        headline: "Turn Launch Buzz into Loyal Fans You Own",
        description:
            "Host live book club sessions where every guaranteed view becomes an email subscriber, a returning attendee, and eventually a customer you truly own.",
        talkingPoints: [
            "Transparent estimated views with every campaign",
            "Automatic email capture + CRM-ready exports",
            "Small-group salons that sell books and services",
        ],
        stats: [
            { label: "Guaranteed Views / $200", value: "2,000+" },
            { label: "Avg. Emails Captured", value: "40" },
            { label: "Live Attendees per Sprint", value: "6" },
        ],
        ctas: {
            primary: { label: "Apply for Access", href: "/apply" },
            secondary: { label: "See How the Guarantee Works", href: "/how-it-works" },
        },
    },
    reader: {
        badge: "For Readers",
        headline: "Hang Out With the Writers Who Light You Up",
        description:
            "Pull up a chair for intimate author sessions, surprise chapter drops, and group chats with readers who obsess over the same tropes you do.",
        talkingPoints: [
            "Weekly live Q&As and behind-the-scenes chats",
            "Exclusive bonus chapters, alt endings, and polls",
            "Reader circles that feel like group texts with friends",
        ],
        stats: [
            { label: "Live Author Moments / Month", value: "12+" },
            { label: "Clubs Included", value: "All Genres" },
            { label: "Avg. Response Time", value: "< 24 hrs" },
        ],
        ctas: {
            primary: { label: "Join a Club", href: "/join" },
            secondary: { label: "Browse Success Stories", href: "/success-stories" },
        },
    },
} as const;

type Persona = keyof typeof PERSONA_COPY;

export function Hero() {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"],
    });

    const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
    const [persona, setPersona] = useState<Persona>("author");
    const activePersona = PERSONA_COPY[persona];

    return (
        <section ref={ref} className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--primary)_0%,_transparent_45%)] opacity-5 blur-3xl" />

            <motion.div
                animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-1/4 left-10 md:left-1/4 w-12 h-12 rounded-full bg-accent/10 blur-xl"
            />
            <motion.div
                animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-1/4 right-10 md:right-1/4 w-20 h-20 rounded-full bg-primary/5 blur-xl"
            />

            <motion.div style={{ y, opacity }} className="container px-4 md:px-6 relative z-10 text-center space-y-10">
                <div className="flex justify-center">
                    <div className="inline-flex p-1 rounded-full bg-background/80 border border-border font-medium text-sm">
                        {(Object.keys(PERSONA_COPY) as Persona[]).map((key) => (
                            <button
                                key={key}
                                onClick={() => setPersona(key)}
                                className={`px-4 py-2 rounded-full transition-all ${
                                    persona === key
                                        ? "bg-primary text-primary-foreground shadow-lg"
                                        : "text-muted-foreground hover:text-foreground"
                                }`}
                            >
                                {PERSONA_COPY[key].badge}
                            </button>
                        ))}
                    </div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter mb-6 leading-tight">
                        {activePersona.headline}
                    </h1>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                >
                    <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
                        {activePersona.description}
                    </p>
                    <ul className="text-left max-w-2xl mx-auto space-y-2 text-muted-foreground">
                        {activePersona.talkingPoints.map((point) => (
                            <li key={point} className="flex items-start gap-2">
                                <span className="text-primary">•</span>
                                <span>{point}</span>
                            </li>
                        ))}
                    </ul>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                    className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                >
                    <Link href={activePersona.ctas.primary.href} className="w-full sm:w-auto">
                        <Button variant="default" size="lg" className="text-lg px-8 py-6 w-full sm:w-auto shadow-lg hover:shadow-primary/20 transition-all hover:-translate-y-1">
                            {activePersona.ctas.primary.label}
                        </Button>
                    </Link>
                    <Link href={activePersona.ctas.secondary.href} className="w-full sm:w-auto">
                        <Button variant="ghost" size="lg" className="text-lg px-8 py-6 w-full sm:w-auto hover:bg-muted/50">
                            {activePersona.ctas.secondary.label}
                        </Button>
                    </Link>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
                    className="grid gap-4 sm:grid-cols-3"
                >
                    {activePersona.stats.map((stat) => (
                        <div key={stat.label} className="bg-background/70 border border-border rounded-2xl px-6 py-5 shadow-sm">
                            <p className="text-sm uppercase tracking-wide text-muted-foreground mb-2">{stat.label}</p>
                            <p className="text-2xl md:text-3xl font-semibold text-primary">{stat.value}</p>
                        </div>
                    ))}
                </motion.div>
            </motion.div>
        </section>
    );
}

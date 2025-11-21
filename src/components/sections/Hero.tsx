"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { useRef } from "react";

export function Hero() {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"],
    });

    const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

    return (
        <section ref={ref} className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--primary)_0%,_transparent_45%)] opacity-5 blur-3xl" />

            {/* Floating Elements */}
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

            <motion.div style={{ y, opacity }} className="container px-4 md:px-6 relative z-10 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter mb-6 leading-tight">
                        Turn Readers into <span className="text-primary text-glow relative inline-block">
                            Loyal Fans
                            <svg className="absolute -bottom-2 left-0 w-full h-3 text-accent opacity-50" viewBox="0 0 100 10" preserveAspectRatio="none">
                                <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="2" fill="none" />
                            </svg>
                        </span> Who
                        <br />
                        Champion Your Work.
                    </h1>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                >
                    <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed">
                        Host live book club meetings and build an engaged community.
                        <br className="hidden md:block" />
                        <span className="text-foreground font-medium mt-2 block">Collect emails. Grow your audience. Sell more books.</span>
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                    className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                >
                    <Link href="/apply" className="w-full sm:w-auto">
                        <Button variant="default" size="lg" className="text-lg px-8 py-6 w-full sm:w-auto shadow-lg hover:shadow-primary/20 transition-all hover:-translate-y-1">
                            Apply for Access
                        </Button>
                    </Link>
                    <Link href="/manifesto" className="w-full sm:w-auto">
                        <Button variant="ghost" size="lg" className="text-lg px-8 py-6 w-full sm:w-auto hover:bg-muted/50">
                            Read the Manifesto
                        </Button>
                    </Link>
                </motion.div>
            </motion.div>
        </section>
    );
}

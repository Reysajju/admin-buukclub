"use client";

import { Check, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { motion } from "framer-motion";

export function ComparisonTable() {
    return (
        <section className="py-20 bg-muted/30 overflow-hidden">
            <div className="container px-4 md:px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl md:text-5xl font-bold mb-4 serif-heading">The Old Way vs. The New Way</h2>
                    <p className="text-muted-foreground text-lg">Why the "Best Seller" list is a trap.</p>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {/* Amazon / Old Way */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <Card className="h-full border-border/50 bg-card/50 opacity-70 hover:opacity-100 transition-all duration-300 hover:shadow-md">
                            <CardHeader>
                                <CardTitle className="text-muted-foreground text-2xl font-serif">Amazon / Traditional</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {[
                                    "30-70% Platform Fee",
                                    "No Customer Emails",
                                    "Passive Reading",
                                    "Algorithm Controls You",
                                    "Low Ticket ($2.99 - $9.99)"
                                ].map((item, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: -10 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 0.3 + (index * 0.1) }}
                                        className="flex items-center gap-3"
                                    >
                                        <div className="p-1 rounded-full bg-red-100/50">
                                            <X className="text-red-500 h-5 w-5" />
                                        </div>
                                        <span className="text-lg text-muted-foreground">{item}</span>
                                    </motion.div>
                                ))}
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* New Way */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <Card className="h-full border-primary/50 bg-card shadow-[0_0_30px_rgba(197,160,89,0.15)] scale-105 relative z-10">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 pointer-events-none" />
                            <CardHeader>
                                <CardTitle className="text-primary text-2xl font-serif text-glow">Your Platform</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6 relative">
                                {[
                                    "70% Revenue Share",
                                    "You Own the Data",
                                    "Live Interactive Events",
                                    "Direct-to-Fan Relationship",
                                    "High Ticket ($20 - $100+)"
                                ].map((item, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: 10 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 0.4 + (index * 0.1) }}
                                        className="flex items-center gap-3"
                                    >
                                        <div className="p-1 rounded-full bg-primary/10">
                                            <Check className="text-primary h-5 w-5" />
                                        </div>
                                        <span className="text-lg font-medium">{item}</span>
                                    </motion.div>
                                ))}
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

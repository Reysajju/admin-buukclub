"use client";

import { Card, CardContent } from "@/components/ui/Card";
import { motion } from "framer-motion";
import { CheckCircle, Shield, BarChart3, Users } from "lucide-react";

export function HowItWorks() {
    const features = [
        {
            icon: BarChart3,
            title: "Assigned Audience",
            description: "We don't just 'show' your book. We assign a target group of real readers from our community to join your specific session.",
        },
        {
            icon: Shield,
            title: "Real Participation",
            description: "Our system ensures 100% human attendance. Every reader assigned is a real person with a verified reading history.",
        },
        {
            icon: Users,
            title: "Building Loyal Fans",
            description: "Readers join for free, engage with you live, and top-tier authors get the full email list to turn them into lifelong fans.",
        },
        {
            icon: CheckCircle,
            title: "Our Guarantee",
            description: "If your assigned audience doesn't meet the plan count, we credit your account or reschedule your session for a larger boost.",
        },
    ];

    return (
        <section className="py-20 relative overflow-hidden" id="how-it-works">
            <div className="absolute inset-0 bg-primary/5 blur-[100px] -z-10" />

            <div className="container px-4 md:px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl md:text-5xl font-bold mb-4 serif-heading">How We Assign Your Audience</h2>
                    <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
                        Complete transparency in our reader matching system. See exactly how we build your custom fan window.
                    </p>
                </motion.div>

                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto mb-16">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <Card className="h-full bg-card/80 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-colors">
                                <CardContent className="pt-6 text-center">
                                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <feature.icon className="w-6 h-6 text-primary" />
                                    </div>
                                    <h3 className="font-semibold mb-3">{feature.title}</h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        {feature.description}
                                    </p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="max-w-4xl mx-auto"
                >
                    <Card className="bg-primary/5 border-primary/20">
                        <CardContent className="pt-8 pb-8">
                            <h3 className="text-2xl font-bold mb-6 text-center serif-heading">Sample Analytics Report</h3>

                            <div className="bg-background rounded-lg p-6 mb-6 border">
                                <h4 className="font-semibold mb-4">Campaign: Sarah Johnson - June 2025</h4>
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-sm text-muted-foreground">Assigned Readers:</span>
                                            <span className="font-medium">150</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-sm text-muted-foreground">Active Attendees:</span>
                                            <span className="font-medium">142</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-sm text-muted-foreground">Avg. Live Duration:</span>
                                            <span className="font-medium">42m 15s</span>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-sm text-muted-foreground">Email Opt-ins (Premium):</span>
                                            <span className="font-medium text-primary">64</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-sm text-muted-foreground">Chat Messages:</span>
                                            <span className="font-medium text-primary">280+</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-sm text-muted-foreground">Poll Votes:</span>
                                            <span className="font-medium text-primary">112</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="text-center">
                                <p className="text-sm text-muted-foreground mb-4">
                                    Authors get detailed analytics after each campaign, including CSV downloads for your records.
                                </p>
                                <div className="flex justify-center gap-4">
                                    <div className="text-center p-4 bg-background rounded-lg border">
                                        <div className="text-2xl font-bold text-primary">100%</div>
                                        <div className="text-xs text-muted-foreground">View Guarantee Met</div>
                                    </div>
                                    <div className="text-center p-4 bg-background rounded-lg border">
                                        <div className="text-2xl font-bold text-primary">2.0%</div>
                                        <div className="text-xs text-muted-foreground">Email Conversion</div>
                                    </div>
                                    <div className="text-center p-4 bg-background rounded-lg border">
                                        <div className="text-2xl font-bold text-primary">15%</div>
                                        <div className="text-xs text-muted-foreground">Event Attendance</div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </section>
    );
}
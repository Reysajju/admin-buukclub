"use client";

import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { motion } from "framer-motion";
import { useState, useEffect, useMemo } from "react";

const waitlistDemands = [
    {
        name: "Sarah J.",
        role: "Romance Author",
        quote: "I've been on the waitlist for 2 months. Amazon took 65% of my last royalty check. I NEED this platform.",
        avatar: "S",
    },
    {
        name: "Marcus T.",
        role: "Sci-Fi Writer",
        quote: "Dying to get access. I'm tired of Amazon owning my reader relationships. When is my invite coming?",
        avatar: "M",
    },
    {
        name: "Elena R.",
        role: "Non-Fiction",
        quote: "I applied the day I heard about this. 70% revenue share sounds like a dream. Please let me in!",
        avatar: "E",
    },
    {
        name: "David K.",
        role: "Thriller Author",
        quote: "Been watching this for months. I'm ready to build a REAL community, not just sell books. Desperately waiting.",
        avatar: "D",
    },
    {
        name: "Jessica L.",
        role: "Fantasy Writer",
        quote: "My readers keep asking for a closer connection. This is EXACTLY what I need. Hoping for early access!",
        avatar: "J",
    },
    {
        name: "Tyler M.",
        role: "Mystery Author",
        quote: "I'd pay to skip the waitlist. Amazon's algorithm killed my last launch. This could save my career.",
        avatar: "T",
    },
    {
        name: "Amanda K.",
        role: "YA Fiction",
        quote: "My author friends won't stop talking about this. I need in NOW. The suspense is killing me!",
        avatar: "A",
    },
    {
        name: "Robert P.",
        role: "Historical Fiction",
        quote: "I've made $47K on Amazon this year. They kept $33K of it. Waiting for BuukClub to change my life.",
        avatar: "R",
    },
    {
        name: "Nina S.",
        role: "Poetry",
        quote: "Amazon doesn't care about poets. This platform gets it. I'm checking my email every hour for my invite.",
        avatar: "N",
    },
    {
        name: "Chris H.",
        role: "Business Books",
        quote: "My coaching clients would LOVE live book clubs. How do I move up the waitlist? This is urgent.",
        avatar: "C",
    }
];

export function SocialProof() {
    const [approvedComments, setApprovedComments] = useState<typeof waitlistDemands>([]);
    const [formData, setFormData] = useState({ name: '', role: '', quote: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState('');

    // Fetch approved comments on mount - only once
    useEffect(() => {
        let isMounted = true;

        fetch('/api/waitlist-comments')
            .then(res => res.json())
            .then(data => {
                if (isMounted && data.comments) {
                    setApprovedComments(data.comments);
                }
            })
            .catch(() => {
                // Silently fail if API not configured
            });

        return () => { isMounted = false; };
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitMessage('');

        try {
            const response = await fetch('/api/waitlist-comments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                setSubmitMessage('✅ Comment submitted! It will appear after admin approval.');
                setFormData({ name: '', role: '', quote: '' });
            } else {
                setSubmitMessage('❌ ' + (data.error || 'Failed to submit comment'));
            }
        } catch (error) {
            setSubmitMessage('❌ Network error. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Combine hardcoded + approved user comments (memoized to prevent infinite loops)
    const allDemands = useMemo(() => [
        ...waitlistDemands,
        ...approvedComments
    ], [approvedComments]);

    return (
        <section className="py-20 overflow-hidden bg-muted/10">
            <div className="container px-4 md:px-6 mb-12">
                <div className="text-center">
                    <h2 className="text-3xl md:text-5xl font-bold mb-4 serif-heading">Authors Are Desperate for Access</h2>
                    <p className="text-muted-foreground text-lg">Real authors on the waitlist, demanding freedom from Amazon.</p>
                </div>
            </div>

            <div className="relative w-full flex overflow-hidden mask-image-linear-gradient mb-16">
                <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-background to-transparent z-10" />
                <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-background to-transparent z-10" />

                <motion.div
                    className="flex gap-6 whitespace-nowrap"
                    animate={{ x: [0, -1500] }}
                    transition={{
                        x: {
                            repeat: Infinity,
                            repeatType: "loop",
                            duration: 60,
                            ease: "linear",
                        },
                    }}
                >
                    {[...allDemands, ...allDemands].map((demand, i) => (
                        <Card key={i} className="w-[380px] flex-shrink-0 bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/30 transition-colors">
                            <CardContent className="pt-6 whitespace-normal">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                        {demand.avatar}
                                    </div>
                                    <div>
                                        <div className="font-medium">{demand.name}</div>
                                        <div className="text-xs text-muted-foreground">{demand.role}</div>
                                    </div>
                                </div>
                                <p className="text-muted-foreground italic text-sm leading-relaxed">"{demand.quote}"</p>
                            </CardContent>
                        </Card>
                    ))}
                </motion.div>
            </div>

            {/* Comment Submission Form */}
            <div className="container px-4 md:px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="max-w-2xl mx-auto"
                >
                    <Card className="border-primary/30 bg-card/80 backdrop-blur-sm">
                        <CardContent className="pt-6">
                            <h3 className="text-2xl font-bold mb-2 text-center serif-heading">Share Your Frustration</h3>
                            <p className="text-muted-foreground text-center mb-6 text-sm">
                                Tell us how badly you need access. Your comment will appear here after approval.
                            </p>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div>
                                        <label className="text-sm font-medium mb-2 block">Your Name</label>
                                        <Input
                                            type="text"
                                            placeholder="e.g., Sarah J."
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            required
                                            maxLength={50}
                                            disabled={isSubmitting}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium mb-2 block">Your Genre/Role</label>
                                        <Input
                                            type="text"
                                            placeholder="e.g., Romance Author"
                                            value={formData.role}
                                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                            required
                                            maxLength={100}
                                            disabled={isSubmitting}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-sm font-medium mb-2 block">Why You Need Access</label>
                                    <textarea
                                        className="w-full min-h-[100px] px-3 py-2 text-sm rounded-md border border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        placeholder="Tell us how desperately you need BuukClub... (max 500 characters)"
                                        value={formData.quote}
                                        onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
                                        required
                                        maxLength={500}
                                        disabled={isSubmitting}
                                    />
                                    <p className="text-xs text-muted-foreground mt-1 text-right">{formData.quote.length}/500</p>
                                </div>

                                {submitMessage && (
                                    <div className={`p-3 rounded-md text-sm ${submitMessage.startsWith('✅') ? 'bg-primary/10 text-primary' : 'bg-destructive/10 text-destructive'}`}>
                                        {submitMessage}
                                    </div>
                                )}

                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'Submitting...' : 'Submit Your Comment'}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </section>
    );
}

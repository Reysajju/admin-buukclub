'use client';

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/sections/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Check } from "lucide-react";
import Link from "next/link";
import { useUserRole } from "@/contexts/UserRoleContext";

export default function PricingPage() {
    const { role } = useUserRole();

    if (role === 'author') {
        return (
            <main className="min-h-screen bg-background">
                <Navbar />
                <div className="pt-32 pb-20 container px-4 md:px-6">
                    <div className="text-center mb-16">
                        <h1 className="text-4xl md:text-6xl font-bold mb-6">Author Pricing</h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            We only get paid when you get paid. Zero upfront costs, pure partnership.
                        </p>
                    </div>

                    <div className="max-w-3xl mx-auto">
                        <Card className="border-primary/50 bg-card shadow-xl">
                            <CardHeader className="text-center">
                                <CardTitle className="text-3xl">Revenue Share Model</CardTitle>
                                <p className="text-muted-foreground">The fairest deal in publishing</p>
                            </CardHeader>
                            <CardContent className="space-y-8">
                                <div className="text-center">
                                    <div className="text-5xl font-bold text-primary mb-2">
                                        15% <span className="text-2xl text-muted-foreground">of revenue</span>
                                    </div>
                                    <p className="text-muted-foreground">You keep 85% of everything you earn</p>
                                </div>

                                <div className="space-y-4 pt-6">
                                    <h3 className="font-bold text-xl mb-4">What's Included:</h3>
                                    <div className="grid gap-3">
                                        <div className="flex items-start gap-3">
                                            <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                                            <span>Dedicated book club platform and community management</span>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                                            <span>Direct reader engagement tools (Q&As, live events, exclusive content)</span>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                                            <span>Payment processing & subscription management</span>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                                            <span>Marketing support & promotional campaigns</span>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                                            <span>Analytics dashboard to track your community growth</span>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                                            <span>24/7 technical support</span>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                                            <span>NO monthly fees, NO setup costs, NO hidden charges</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-muted/50 p-6 rounded-lg">
                                    <h4 className="font-bold mb-2">Example:</h4>
                                    <p className="text-sm text-muted-foreground">
                                        If you earn $10,000/month from your book club members, you keep $8,500.
                                        We take $1,500 to cover platform costs and continue improving your experience.
                                    </p>
                                </div>

                                <Link href="/apply" className="block">
                                    <Button variant="default" className="w-full text-lg h-14">
                                        Apply to Join as Author
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    </div>
                </div>
                <Footer />
            </main>
        );
    }

    // Reader Pricing
    return (
        <main className="min-h-screen bg-background">
            <Navbar />
            <div className="pt-32 pb-20 container px-4 md:px-6">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6">Reader Membership</h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Access exclusive book clubs, connect with authors, and join a community of readers.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {/* Basic */}
                    <Card className="border-border/50">
                        <CardHeader>
                            <CardTitle className="text-2xl">Basic Reader</CardTitle>
                            <p className="text-muted-foreground">Get started</p>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="text-3xl font-bold">
                                $9.99<span className="text-sm font-normal text-muted-foreground">/month</span>
                            </div>
                            <ul className="space-y-3">
                                <li className="flex items-center gap-2">
                                    <Check className="h-5 w-5 text-primary" /> Access to 3 book clubs
                                </li>
                                <li className="flex items-center gap-2">
                                    <Check className="h-5 w-5 text-primary" /> Monthly reading recommendations
                                </li>
                                <li className="flex items-center gap-2">
                                    <Check className="h-5 w-5 text-primary" /> Community discussions
                                </li>
                                <li className="flex items-center gap-2">
                                    <Check className="h-5 w-5 text-primary" /> Reading goal tracker
                                </li>
                            </ul>
                            <Link href="/join" className="block">
                                <Button variant="outline" className="w-full">
                                    Choose Basic
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>

                    {/* Premium */}
                    <Card className="border-primary/50 shadow-xl relative">
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-xs font-bold">
                            MOST POPULAR
                        </div>
                        <CardHeader>
                            <CardTitle className="text-2xl">Premium Reader</CardTitle>
                            <p className="text-muted-foreground">Best value</p>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="text-3xl font-bold text-primary">
                                $19.99<span className="text-sm font-normal text-muted-foreground">/month</span>
                            </div>
                            <ul className="space-y-3">
                                <li className="flex items-center gap-2">
                                    <Check className="h-5 w-5 text-primary" /> Access to ALL book clubs
                                </li>
                                <li className="flex items-center gap-2">
                                    <Check className="h-5 w-5 text-primary" /> Live Q&A with authors
                                </li>
                                <li className="flex items-center gap-2">
                                    <Check className="h-5 w-5 text-primary" /> Exclusive content & bonus chapters
                                </li>
                                <li className="flex items-center gap-2">
                                    <Check className="h-5 w-5 text-primary" /> Priority event access
                                </li>
                                <li className="flex items-center gap-2">
                                    <Check className="h-5 w-5 text-primary" /> 20% discount on books
                                </li>
                            </ul>
                            <Link href="/join" className="block">
                                <Button variant="default" className="w-full">
                                    Choose Premium
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>

                    {/* Elite */}
                    <Card className="border-border/50">
                        <CardHeader>
                            <CardTitle className="text-2xl">Elite Reader</CardTitle>
                            <p className="text-muted-foreground">Ultimate experience</p>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="text-3xl font-bold">
                                $34.99<span className="text-sm font-normal text-muted-foreground">/month</span>
                            </div>
                            <ul className="space-y-3">
                                <li className="flex items-center gap-2">
                                    <Check className="h-5 w-5 text-primary" /> Everything in Premium
                                </li>
                                <li className="flex items-center gap-2">
                                    <Check className="h-5 w-5 text-primary" /> 1-on-1 author conversations
                                </li>
                                <li className="flex items-center gap-2">
                                    <Check className="h-5 w-5 text-primary" /> Early access to new releases
                                </li>
                                <li className="flex items-center gap-2">
                                    <Check className="h-5 w-5 text-primary" /> Signed books & merchandise
                                </li>
                                <li className="flex items-center gap-2">
                                    <Check className="h-5 w-5 text-primary" /> VIP community status
                                </li>
                            </ul>
                            <Link href="/join" className="block">
                                <Button variant="outline" className="w-full">
                                    Choose Elite
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                </div>
            </div>
            <Footer />
        </main>
    );
}

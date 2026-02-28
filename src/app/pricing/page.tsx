'use client';

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/sections/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
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
                        <h1 className="text-4xl md:text-6xl font-bold mb-6">Build Your Loyal Fan Community</h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Host live book club meetings and turn readers into loyal fans who will champion your work.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {/* Basic */}
                        <Card className="border-border/50">
                            <CardHeader>
                                <CardTitle className="text-2xl">Basic</CardTitle>
                                <p className="text-muted-foreground">Test the waters</p>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="text-3xl font-bold">
                                    $49<span className="text-sm font-normal text-muted-foreground">/month</span>
                                </div>
                                <div className="text-lg font-semibold text-primary">
                                    25+ Assigned Readers
                                </div>
                                <ul className="space-y-3 font-medium">
                                    <li className="flex items-center gap-2">
                                        <Check className="h-5 w-5 text-primary" /> 1 session per week
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Check className="h-5 w-5 text-primary" /> BuukClub Assigned Audience
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Check className="h-5 w-5 text-primary" /> Interactive Reader Chat
                                    </li>
                                    <li className="flex items-center gap-2 text-muted-foreground/50">
                                        <span>❌ Email list NOT included</span>
                                    </li>
                                    <li className="flex items-center gap-2 text-muted-foreground/50">
                                        <span>❌ No external fan invites</span>
                                    </li>
                                </ul>
                                <Link href="/signup" className="block">
                                    <Button variant="outline" className="w-full">
                                        Join Waitlist
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>

                        {/* Standard */}
                        <Card className="border-primary/50 shadow-xl relative">
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-xs font-bold">
                                MOST POPULAR
                            </div>
                            <CardHeader>
                                <CardTitle className="text-2xl">Standard</CardTitle>
                                <p className="text-muted-foreground">Grow your fan base</p>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="text-3xl font-bold text-primary">
                                    $149<span className="text-sm font-normal text-muted-foreground">/month</span>
                                </div>
                                <div className="text-xl font-bold text-primary">
                                    50-150 Assigned Readers
                                </div>
                                <ul className="space-y-3 font-medium">
                                    <li className="flex items-center gap-2">
                                        <Check className="h-5 w-5 text-primary" /> 2 sessions per week
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Check className="h-5 w-5 text-primary" /> <strong>Guaranteed reader audience</strong>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Check className="h-5 w-5 text-primary" /> Real-time interactive chat
                                    </li>
                                    <li className="flex items-center gap-2 text-muted-foreground/50">
                                        <span>❌ Email list NOT included</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Check className="h-5 w-5 text-primary" /> Standard analytics
                                    </li>
                                </ul>
                                <Link href="/signup" className="block">
                                    <Button variant="default" className="w-full">
                                        Apply to Join
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>

                        {/* Premium */}
                        <Card className="border-border/50">
                            <CardHeader>
                                <CardTitle className="text-2xl">Premium</CardTitle>
                                <p className="text-muted-foreground">The Ultimate Fan Window</p>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="text-3xl font-bold">
                                    $399<span className="text-sm font-normal text-muted-foreground">/month</span>
                                </div>
                                <div className="text-xl font-bold text-primary">
                                    200-500 Assigned Readers
                                </div>
                                <ul className="space-y-3 font-medium">
                                    <li className="flex items-center gap-2">
                                        <Check className="h-5 w-5 text-primary" /> 4 sessions per week
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Check className="h-5 w-5 text-primary" /> <strong>Maximum audience guarantee</strong>
                                    </li>
                                    <li className="flex items-center gap-2 text-primary font-bold">
                                        <Check className="h-5 w-5" /> 📧 Lifetime Email Exports
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Check className="h-5 w-5 text-primary" /> 🔗 Invite friends & family
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Check className="h-5 w-5 text-primary" /> Advanced Fan Insights
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Check className="h-5 w-5 text-primary" /> Managed Ticketing Support
                                    </li>
                                </ul>
                                <Link href="/apply" className="block">
                                    <Button variant="outline" className="w-full border-primary/50 text-primary hover:bg-primary/10">
                                        Apply for Premium
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>

                        {/* Platinum */}
                        <Card className="border-primary bg-primary/5 shadow-2xl md:col-span-3 lg:col-span-1">
                            <CardHeader>
                                <CardTitle className="text-2xl">Platinum</CardTitle>
                                <p className="text-muted-foreground">Enterprise Class Scale</p>
                            </CardHeader>
                            <CardContent className="space-y-6 text-center">
                                <div className="text-3xl font-bold">
                                    Contact for Pricing
                                </div>
                                <div className="text-xl font-bold text-primary">
                                    500+ Assigned Readers
                                </div>
                                <ul className="space-y-3 font-medium text-left">
                                    <li className="flex items-center gap-2">
                                        <Check className="h-5 w-5 text-primary" /> 5 sessions per week
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Check className="h-5 w-5 text-primary" /> Dedicated Account Manager
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Check className="h-5 w-5 text-primary" /> Custom Marketing Campaigns
                                    </li>
                                </ul>
                                <Button
                                    onClick={() => document.getElementById('platinum-form')?.scrollIntoView({ behavior: 'smooth' })}
                                    className="w-full bg-primary hover:bg-primary/90"
                                >
                                    Inquire Now
                                </Button>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Platinum Contact Form */}
                    <div id="platinum-form" className="mt-20 max-w-2xl mx-auto bg-card border border-border rounded-2xl p-8 shadow-xl">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold">Platinum Inquiry</h2>
                            <p className="text-muted-foreground mt-2">Scale your community with high-volume sessions.</p>
                        </div>
                        <form
                            onSubmit={async (e) => {
                                e.preventDefault();
                                const target = e.target as any;
                                const data = {
                                    name: target.name.value,
                                    email: target.email.value,
                                    phone: target.phone.value,
                                    bookName: target.bookName.value,
                                    sessionCount: target.sessionCount.value,
                                    message: target.message.value
                                };
                                const resp = await fetch('/api/leads', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify(data)
                                });
                                if (resp.ok) {
                                    alert('Inquiry submitted! We will contact you soon.');
                                    target.reset();
                                } else {
                                    alert('Error submitting inquiry.');
                                }
                            }}
                            className="space-y-4"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Full Name</label>
                                    <Input name="name" placeholder="John Doe" required />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Email</label>
                                    <Input name="email" type="email" placeholder="john@example.com" required />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Phone Number</label>
                                    <Input name="phone" placeholder="+1 (555) 000-0000" required />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Book Name</label>
                                    <Input name="bookName" placeholder="Title of your book" required />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Target Sessions per Week</label>
                                <Input name="sessionCount" type="number" placeholder="5" required />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Additional Details</label>
                                <textarea name="message" className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="Tell us about your needs..." />
                            </div>
                            <Button type="submit" className="w-full" size="lg">Submit Inquiry</Button>
                        </form>
                    </div>

                    {/* Info Section */}
                    <div className="mt-16 max-w-3xl mx-auto bg-primary/5 border border-primary/20 rounded-lg p-8">
                        <h3 className="text-2xl font-bold mb-4 text-center">How It Works</h3>
                        <div className="space-y-4 text-muted-foreground">
                            <p>
                                <strong className="text-foreground">📚 Host Live Meetings:</strong> Connect with readers in real-time book club sessions.
                            </p>
                            <p>
                                <strong className="text-foreground">💬 Collect Feedback:</strong> After each meeting, readers complete a brief survey sharing their thoughts.
                            </p>
                            <p>
                                <strong className="text-foreground">📧 Build Your List:</strong> Readers who loved your book opt-in to become loyal fans. Get their emails delivered to you.
                            </p>
                            <p>
                                <strong className="text-foreground">🚀 Grow Your Community:</strong> Turn one-time readers into lifelong fans who will buy your next book.
                            </p>
                        </div>
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
                                    Join the Community
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

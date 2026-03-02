import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/sections/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Zap, Users, CreditCard, Globe, Shield, Smartphone } from "lucide-react";

const features = [
    {
        title: "Live Events",
        desc: "Host video, audio, or text-based book clubs directly in Discord. We handle the bot setup.",
        icon: <Users className="h-8 w-8 text-primary" />,
    },
    {
        title: "Instant Payments",
        desc: "Connect your Stripe account and get paid directly. No waiting for 60-day royalty checks.",
        icon: <CreditCard className="h-8 w-8 text-primary" />,
    },
    {
        title: "Global Reach",
        desc: "Your site loads instantly anywhere in the world. Built on Vercel's Edge Network.",
        icon: <Globe className="h-8 w-8 text-primary" />,
    },
    {
        title: "Data Ownership",
        desc: "Export your subscriber list at any time. You own the relationship, not us.",
        icon: <Shield className="h-8 w-8 text-primary" />,
    },
    {
        title: "Mobile Optimized",
        desc: "Your book club looks perfect on every device. 60% of traffic is mobile; we're ready.",
        icon: <Smartphone className="h-8 w-8 text-primary" />,
    },
    {
        title: "Zero Tech Headache",
        desc: "We manage the servers, the security, and the updates. You just write.",
        icon: <Zap className="h-8 w-8 text-primary" />,
    },
];

export default function FeaturesPage() {
    return (
        <main className="min-h-screen bg-background">
            <Navbar />
            <div className="pt-32 pb-20 container px-4 md:px-6">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6">Platform Features</h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Everything you need to build a 6-figure author business.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {features.map((feature, i) => (
                        <Card key={i} className="bg-card/50 border-border/50 hover:border-primary/50 transition-colors">
                            <CardHeader>
                                <div className="mb-4">{feature.icon}</div>
                                <CardTitle>{feature.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">{feature.desc}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
            <Footer />
        </main>
    );
}

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/sections/Footer";
import { Shield, Lock, Heart } from "lucide-react";

export default function TrustPage() {
    return (
        <main className="min-h-screen bg-background">
            <Navbar />
            <div className="pt-32 pb-20 container px-4 md:px-6">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6">Trust & Safety</h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        We take your business seriously. Built on US Standards.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    <div className="p-8 rounded-lg border border-border/50 bg-card/50">
                        <Lock className="h-12 w-12 text-primary mb-6" />
                        <h3 className="text-2xl font-bold mb-4">Secure Payments</h3>
                        <p className="text-muted-foreground">
                            We use Stripe for all payment processing. We never store your credit card details.
                            Payouts are direct to your bank account via Stripe Connect.
                        </p>
                    </div>

                    <div className="p-8 rounded-lg border border-border/50 bg-card/50">
                        <Shield className="h-12 w-12 text-primary mb-6" />
                        <h3 className="text-2xl font-bold mb-4">GDPR & Data Privacy</h3>
                        <p className="text-muted-foreground">
                            You own your data, but we protect it. We are fully GDPR and CCPA compliant.
                            Your reader's emails are safe and exportable at any time.
                        </p>
                    </div>

                    <div className="p-8 rounded-lg border border-border/50 bg-card/50">
                        <Heart className="h-12 w-12 text-primary mb-6" />
                        <h3 className="text-2xl font-bold mb-4">Community Safety</h3>
                        <p className="text-muted-foreground">
                            We have zero tolerance for harassment. Our Discord bots and moderation tools
                            help keep your book club a safe space for all readers.
                        </p>
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    );
}

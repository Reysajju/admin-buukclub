import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/sections/Footer";

export default function TermsPage() {
    return (
        <main className="min-h-screen bg-background">
            <Navbar />
            <div className="pt-32 pb-20 container px-4 md:px-6 max-w-3xl mx-auto">
                <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
                <div className="prose prose-invert">
                    <p>Last updated: November 2025</p>
                    <p>
                        Please read these Terms of Service ("Terms", "Terms of Service") carefully before using the Anti-Amazon website (the "Service") operated by Anti-Amazon Collective ("us", "we", or "our").
                    </p>
                    <h3>1. Agreement to Terms</h3>
                    <p>
                        By accessing or using the Service you agree to be bound by these Terms. If you disagree with any part of the terms then you may not access the Service.
                    </p>
                    <h3>2. Accounts</h3>
                    <p>
                        When you create an account with us, you must provide us information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.
                    </p>
                    <h3>3. Intellectual Property</h3>
                    <p>
                        The Service and its original content, features and functionality are and will remain the exclusive property of Anti-Amazon Collective and its licensors.
                    </p>
                    <h3>4. Termination</h3>
                    <p>
                        We may terminate or suspend access to our Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
                    </p>
                </div>
            </div>
            <Footer />
        </main>
    );
}

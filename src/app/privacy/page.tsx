import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/sections/Footer";

export default function PrivacyPage() {
    return (
        <main className="min-h-screen bg-background">
            <Navbar />
            <div className="pt-32 pb-20 container px-4 md:px-6 max-w-3xl mx-auto">
                <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
                <div className="prose prose-invert">
                    <p>Last updated: November 2025</p>
                    <p>
                        At Anti-Amazon, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website.
                    </p>
                    <h3>1. Collection of Data</h3>
                    <p>
                        We collect personal data that you voluntarily provide to us when you register on the website, express an interest in obtaining information about us or our products and services, when you participate in activities on the website or otherwise when you contact us.
                    </p>
                    <h3>2. Use of Data</h3>
                    <p>
                        We use personal data collected via our website for a variety of business purposes described below. We process your personal data for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations.
                    </p>
                    <h3>3. Disclosure of Data</h3>
                    <p>
                        We may process or share your data that we hold based on the following legal basis: Consent, Legitimate Interests, Performance of a Contract, or Legal Obligations.
                    </p>
                    <h3>4. Data Retention</h3>
                    <p>
                        We will only keep your personal information for as long as it is necessary for the purposes set out in this privacy policy, unless a longer retention period is required or permitted by law.
                    </p>
                </div>
            </div>
            <Footer />
        </main>
    );
}

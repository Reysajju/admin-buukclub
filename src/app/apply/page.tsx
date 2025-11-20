'use client';

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/sections/Footer";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ApplyPage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        const formData = new FormData(e.currentTarget);

        try {
            const response = await fetch('/api/apply', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.get('name'),
                    email: formData.get('email'),
                    socialProfile: formData.get('socialProfile'),
                    followers: formData.get('followers'),
                    painPoint: formData.get('painPoint'),
                    pitch: formData.get('pitch'),
                    timestamp: new Date().toISOString(),
                }),
            });

            if (response.ok) {
                setIsSuccess(true);
            } else {
                alert('Something went wrong. Please try again.');
            }
        } catch (error) {
            alert('Something went wrong. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSuccess) {
        return (
            <main className="min-h-screen bg-background">
                <Navbar />
                <div className="pt-32 pb-20 container px-4 md:px-6">
                    <div className="max-w-2xl mx-auto text-center">
                        <div className="bg-card p-12 rounded-lg border border-border shadow-lg space-y-6">
                            <div className="text-6xl mb-4">🎉</div>
                            <h1 className="text-4xl font-bold text-primary">Got it!</h1>
                            <p className="text-2xl font-semibold">You're on the countdown!</p>
                            <p className="text-muted-foreground text-lg">
                                We'll review your application and get back to you within 48 hours.
                                Keep an eye on your inbox!
                            </p>
                            <Button
                                variant="default"
                                size="lg"
                                onClick={() => router.push('/')}
                                className="mt-6"
                            >
                                Back to Home
                            </Button>
                        </div>
                    </div>
                </div>
                <Footer />
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-background">
            <Navbar />
            <div className="pt-32 pb-20 container px-4 md:px-6">
                <div className="max-w-2xl mx-auto">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold mb-4">Apply for Access</h1>
                        <p className="text-muted-foreground">
                            We only accept 10 authors per month to ensure quality.
                        </p>
                    </div>

                    <form className="space-y-6 bg-card p-8 rounded-lg border border-border shadow-lg" onSubmit={handleSubmit}>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Full Name</label>
                            <Input name="name" placeholder="J.R.R. Tolkien" required />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Email Address</label>
                            <Input name="email" type="email" placeholder="john@example.com" required />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Link to your best social profile</label>
                            <Input name="socialProfile" placeholder="twitter.com/username" required />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">How many followers do you have?</label>
                            <Input name="followers" type="number" placeholder="10000" required />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">What brings you the most pain?</label>
                            <select name="painPoint" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" required>
                                <option value="">Select an option</option>
                                <option>Marketing</option>
                                <option>Writing</option>
                                <option>Amazon's Fees</option>
                                <option>Loneliness</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Why should we accept your book?</label>
                            <textarea name="pitch" className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" placeholder="Tell us about your vision..." required />
                        </div>

                        <Button className="w-full" size="lg" variant="default" type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Submitting...' : 'Submit Application'}
                        </Button>

                        <p className="text-xs text-center text-muted-foreground">
                            By applying, you agree to our Terms of Service. We respect your privacy.
                        </p>
                    </form>
                </div>
            </div>
            <Footer />
        </main>
    );
}

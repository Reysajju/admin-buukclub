'use client';

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/sections/Footer";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Mail, MessageSquare } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ContactPage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        const formData = new FormData(e.currentTarget);

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.get('name'),
                    email: formData.get('email'),
                    message: formData.get('message'),
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
                            <div className="text-6xl mb-4">✉️</div>
                            <h1 className="text-4xl font-bold text-primary">Message Sent!</h1>
                            <p className="text-2xl font-semibold">We'll get back to you soon</p>
                            <p className="text-muted-foreground text-lg">
                                We typically respond within 24 hours.
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
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6">Contact Us</h1>
                    <p className="text-xl text-muted-foreground">
                        We are here to help you scale.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
                    <div className="space-y-8">
                        <div>
                            <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                                <Mail className="text-primary" /> Email Support
                            </h3>
                            <p className="text-muted-foreground mb-4">
                                For general inquiries, press, and partnership opportunities.
                            </p>
                            <a href="mailto:support@buukclub.com" className="text-primary hover:underline text-lg">
                                support@buukclub.com
                            </a>
                        </div>

                        <div>
                            <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                                <MessageSquare className="text-primary" /> Discord Community
                            </h3>
                            <p className="text-muted-foreground mb-4">
                                Join our public Discord to chat with other authors and get live help.
                            </p>
                            <Link href="https://discord.gg/placeholder" target="_blank" rel="noopener noreferrer">
                                <Button variant="outline">Join Discord</Button>
                            </Link>
                        </div>
                    </div>

                    <div className="bg-card p-8 rounded-lg border border-border">
                        <h3 className="text-xl font-bold mb-6">Send us a message</h3>
                        <form className="space-y-4" onSubmit={handleSubmit}>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Name</label>
                                <Input name="name" placeholder="Your name" required />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Email</label>
                                <Input name="email" type="email" placeholder="you@example.com" required />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Message</label>
                                <textarea name="message" className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" placeholder="How can we help?" required />
                            </div>
                            <Button className="w-full" variant="default" type="submit" disabled={isSubmitting}>
                                {isSubmitting ? 'Sending...' : 'Send Message'}
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    );
}

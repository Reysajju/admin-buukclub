'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/sections/Footer";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import Link from 'next/link';

export default function SignupPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const router = useRouter();
    const supabase = createClient();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { data, error: signupError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName,
                        role: 'author'
                    },
                    emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || window.location.origin}/auth/callback`
                }
            });

            if (signupError) throw signupError;

            // Profile is usually created via trigger or manually here
            // We'll trust the trigger or the server-side auto-profile creation if any.
            // But let's ensure the user knows they are pending.
            setSuccess(true);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <main className="min-h-screen bg-background flex flex-col">
                <Navbar />
                <div className="flex-1 flex items-center justify-center p-4">
                    <div className="max-w-md w-full bg-card p-8 rounded-2xl border border-border shadow-xl text-center">
                        <div className="text-5xl mb-6">✉️</div>
                        <h1 className="text-3xl font-bold mb-4">Check your email!</h1>
                        <p className="text-muted-foreground mb-8">
                            We've sent a verification link to <strong>{email}</strong>.
                            Please verify your email, then your account will be reviewed by admin.
                        </p>
                        <Link href="/">
                            <Button className="w-full">Back to Home</Button>
                        </Link>
                    </div>
                </div>
                <Footer />
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-background flex flex-col">
            <Navbar />
            <div className="flex-1 flex items-center justify-center p-4 py-32">
                <div className="max-w-md w-full bg-card p-8 rounded-2xl border border-border shadow-xl">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold">Author Signup</h1>
                        <p className="text-muted-foreground mt-2">Join BuukClub and start your loyal community.</p>
                    </div>

                    <form onSubmit={handleSignup} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Full Name</label>
                            <Input
                                type="text"
                                placeholder="J.K. Rowling"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Email Address</label>
                            <Input
                                type="email"
                                placeholder="author@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Password</label>
                            <Input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        {error && (
                            <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-lg">
                                {error}
                            </div>
                        )}

                        <Button
                            className="w-full"
                            size="lg"
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? 'Creating Account...' : 'Sign Up as Author'}
                        </Button>
                    </form>

                    <p className="text-center text-sm text-muted-foreground mt-6">
                        Already have an account? <Link href="/login" className="text-primary hover:underline font-medium">Log in</Link>
                    </p>
                </div>
            </div>
            <Footer />
        </main>
    );
}

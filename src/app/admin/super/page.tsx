'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/sections/Footer";
import { Button } from "@/components/ui/Button";
import { Check, X, Shield, User, Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

interface Profile {
    id: string;
    full_name: string;
    email: string;
    role: string;
    is_approved: boolean;
    plan: string;
    created_at: string;
}

export default function SuperAdminPortal() {
    const [profiles, setProfiles] = useState<Profile[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);

    const router = useRouter();
    const supabase = createClientComponentClient();

    useEffect(() => {
        checkAdmin();
    }, []);

    const checkAdmin = async () => {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user || user.email !== 'sajjadr742@gmail.com') {
            router.push('/login');
            return;
        }

        setIsAdmin(true);
        fetchProfiles();
    };

    const fetchProfiles = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .order('created_at', { ascending: false });

        if (!error && data) {
            setProfiles(data);
        }
        setLoading(false);
    };

    const handleToggleApproval = async (id: string, currentStatus: boolean) => {
        const { error } = await supabase
            .from('profiles')
            .update({ is_approved: !currentStatus })
            .eq('id', id);

        if (!error) {
            setProfiles(profiles.map(p =>
                p.id === id ? { ...p, is_approved: !currentStatus } : p
            ));
        }
    };

    const handleChangePlan = async (id: string, plan: string) => {
        const { error } = await supabase
            .from('profiles')
            .update({ plan })
            .eq('id', id);

        if (!error) {
            setProfiles(profiles.map(p =>
                p.id === id ? { ...p, plan } : p
            ));
        }
    };

    if (!isAdmin) return null;

    return (
        <main className="min-h-screen bg-background flex flex-col">
            <Navbar />
            <div className="flex-1 container px-4 md:px-6 py-32">
                <div className="flex items-center gap-3 mb-12">
                    <Shield className="h-8 w-8 text-primary" />
                    <h1 className="text-4xl font-bold">Super Admin Portal</h1>
                </div>

                <div className="grid gap-6">
                    {loading ? (
                        <div className="text-center py-20">Loading accounts...</div>
                    ) : profiles.length === 0 ? (
                        <div className="text-center py-20 bg-card rounded-xl border border-border">
                            No author accounts found.
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {profiles.map((profile) => (
                                <Card key={profile.id} className={`${profile.is_approved ? 'border-border' : 'border-primary/50 bg-primary/5'}`}>
                                    <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                                        <div className="flex items-center gap-4 flex-1">
                                            <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center">
                                                <User className="h-6 w-6 text-muted-foreground" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-lg flex items-center gap-2">
                                                    {profile.full_name || 'Anonymous Author'}
                                                    {!profile.is_approved && (
                                                        <span className="text-[10px] bg-primary text-primary-foreground px-2 py-0.5 rounded-full uppercase tracking-wider">
                                                            Pending
                                                        </span>
                                                    )}
                                                </h3>
                                                <p className="text-sm text-muted-foreground">{profile.email}</p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-xs text-muted-foreground">Plan:</span>
                                                    <select
                                                        value={profile.plan}
                                                        onChange={(e) => handleChangePlan(profile.id, e.target.value)}
                                                        className="text-xs bg-transparent border-none p-0 pr-6 font-bold text-primary focus:ring-0 cursor-pointer"
                                                    >
                                                        <option value="basic">Basic (1/wk)</option>
                                                        <option value="standard">Standard (2/wk)</option>
                                                        <option value="premium">Premium (4/wk)</option>
                                                        <option value="platinum">Platinum (5/wk)</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <Button
                                                variant={profile.is_approved ? "outline" : "default"}
                                                size="sm"
                                                onClick={() => handleToggleApproval(profile.id, profile.is_approved)}
                                                className="flex items-center gap-2"
                                            >
                                                {profile.is_approved ? (
                                                    <>
                                                        <X className="h-4 w-4" /> Suspend Access
                                                    </>
                                                ) : (
                                                    <>
                                                        <Check className="h-4 w-4" /> Approve Author
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </main>
    );
}

'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
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

interface Application {
    id: string;
    name: string;
    email: string;
    social_profile: string;
    followers: number;
    pain_point: string;
    pitch: string;
    status: string;
    created_at: string;
}

export default function SuperAdminPortal() {
    const [profiles, setProfiles] = useState<Profile[]>([]);
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const [activeTab, setActiveTab] = useState<'profiles' | 'applications'>('profiles');

    const router = useRouter();
    const supabase = createClient();

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
        try {
            const { data: profileData, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .order('created_at', { ascending: false });

            if (!profileError) setProfiles(profileData || []);

            const { data: appData, error: appError } = await supabase
                .from('applications')
                .select('*')
                .order('created_at', { ascending: false });

            if (!appError) setApplications(appData || []);
        } catch (error) {
            console.error("Fetch error:", error);
        } finally {
            setLoading(false);
        }
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

                <div className="flex gap-4 mb-8">
                    <button
                        onClick={() => setActiveTab('profiles')}
                        className={`pb-2 px-4 font-bold border-b-2 transition-all ${activeTab === 'profiles' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground'}`}
                    >
                        Active Accounts ({profiles.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('applications')}
                        className={`pb-2 px-4 font-bold border-b-2 transition-all ${activeTab === 'applications' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground'}`}
                    >
                        Incoming Applications ({applications.length})
                    </button>
                </div>

                <div className="grid gap-6">
                    {loading ? (
                        <div className="text-center py-20">Loading data...</div>
                    ) : activeTab === 'profiles' ? (
                        profiles.length === 0 ? (
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
                        )
                    ) : (
                        applications.length === 0 ? (
                            <div className="text-center py-20 bg-card rounded-xl border border-border">
                                No applications found.
                            </div>
                        ) : (
                            <div className="grid gap-4">
                                {applications.map((app) => (
                                    <Card key={app.id}>
                                        <CardContent className="p-6">
                                            <div className="flex flex-col md:flex-row justify-between gap-6">
                                                <div className="flex-1 space-y-4">
                                                    <div>
                                                        <h3 className="font-bold text-xl">{app.name}</h3>
                                                        <p className="text-primary font-medium">{app.email}</p>
                                                    </div>

                                                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                                                        <div className="bg-muted/50 p-3 rounded-lg">
                                                            <p className="text-[10px] uppercase text-muted-foreground mb-1">Social Profile</p>
                                                            <a href={app.social_profile.startsWith('http') ? app.social_profile : `https://${app.social_profile}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                                                                {app.social_profile}
                                                            </a>
                                                        </div>
                                                        <div className="bg-muted/50 p-3 rounded-lg">
                                                            <p className="text-[10px] uppercase text-muted-foreground mb-1">Followers</p>
                                                            <p className="font-bold">{app.followers.toLocaleString()}</p>
                                                        </div>
                                                        <div className="bg-muted/50 p-3 rounded-lg">
                                                            <p className="text-[10px] uppercase text-muted-foreground mb-1">Pain Point</p>
                                                            <p className="font-bold">{app.pain_point}</p>
                                                        </div>
                                                        <div className="bg-muted/50 p-3 rounded-lg">
                                                            <p className="text-[10px] uppercase text-muted-foreground mb-1">Date</p>
                                                            <p className="font-bold">{new Date(app.created_at).toLocaleDateString()}</p>
                                                        </div>
                                                    </div>

                                                    <div className="bg-primary/5 p-4 rounded-xl border border-primary/10">
                                                        <p className="text-xs uppercase text-primary font-bold mb-2">The Pitch</p>
                                                        <p className="text-sm leading-relaxed italic">"{app.pitch}"</p>
                                                    </div>
                                                </div>

                                                <div className="flex flex-col gap-2 justify-start min-w-[150px]">
                                                    <Button size="sm" onClick={() => alert('Reply email functionality pending. Please contact manually for now.')}>
                                                        Contact Author
                                                    </Button>
                                                    <Button variant="outline" size="sm" className="text-destructive hover:bg-destructive/10 border-destructive/20">
                                                        Archive
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )
                    )}
                </div>
            </div>
            <Footer />
        </main>
    );
}

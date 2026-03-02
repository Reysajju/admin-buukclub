'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/sections/Footer";
import { Button } from "@/components/ui/Button";
import { Check, X, Shield, User, Clock, AlertCircle, Users, FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";

interface Profile {
    id: string;
    full_name: string;
    email: string;
    role: string;
    is_approved: boolean;
    plan: string;
    created_at: string;
}

interface ApprovalRequest {
    id: string;
    user_id: string;
    full_name: string;
    email: string;
    status: string;
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
    const [approvalRequests, setApprovalRequests] = useState<ApprovalRequest[]>([]);
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const [activeTab, setActiveTab] = useState<'pending' | 'authors' | 'applications'>('pending');

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
        fetchAllData();
    };

    const fetchAllData = async () => {
        setLoading(true);
        try {
            // Fetch pending approval requests
            const { data: requestData } = await supabase
                .from('approval_requests')
                .select('*')
                .eq('status', 'pending')
                .order('created_at', { ascending: false });

            setApprovalRequests(requestData || []);

            // Fetch all author profiles
            const { data: profileData } = await supabase
                .from('profiles')
                .select('*')
                .eq('role', 'author')
                .order('created_at', { ascending: false });

            setProfiles(profileData || []);

            // Fetch applications from /apply form
            const { data: appData } = await supabase
                .from('applications')
                .select('*')
                .order('created_at', { ascending: false });

            setApplications(appData || []);
        } catch (error) {
            console.error("Fetch error:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleApproveAuthor = async (request: ApprovalRequest) => {
        // 1. Update profile: is_approved = true
        const { error: profileError } = await supabase
            .from('profiles')
            .update({ is_approved: true })
            .eq('id', request.user_id);

        if (profileError) {
            console.error("Profile update error:", profileError);
            alert("Failed to approve author. Check console for details.");
            return;
        }

        // 2. Update approval_request status
        await supabase
            .from('approval_requests')
            .update({ status: 'approved', reviewed_at: new Date().toISOString() })
            .eq('id', request.id);

        // Refresh data
        fetchAllData();
    };

    const handleRejectAuthor = async (request: ApprovalRequest) => {
        // 1. Keep profile is_approved = false
        // 2. Update approval_request status to rejected
        await supabase
            .from('approval_requests')
            .update({ status: 'rejected', reviewed_at: new Date().toISOString() })
            .eq('id', request.id);

        fetchAllData();
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

    const pendingCount = approvalRequests.length;

    if (!isAdmin) return null;

    return (
        <main className="min-h-screen bg-background flex flex-col">
            <Navbar />
            <div className="flex-1 container px-4 md:px-6 py-32">
                <div className="flex items-center gap-3 mb-12">
                    <Shield className="h-8 w-8 text-primary" />
                    <h1 className="text-4xl font-bold">Super Admin Portal</h1>
                </div>

                {/* Tabs */}
                <div className="flex gap-4 mb-8 border-b border-border pb-0">
                    <button
                        onClick={() => setActiveTab('pending')}
                        className={`pb-3 px-4 font-bold border-b-2 transition-all flex items-center gap-2 ${activeTab === 'pending' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
                    >
                        <Clock className="h-4 w-4" />
                        Pending Approvals
                        {pendingCount > 0 && (
                            <span className="bg-destructive text-destructive-foreground text-xs font-bold px-2 py-0.5 rounded-full animate-pulse">
                                {pendingCount}
                            </span>
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab('authors')}
                        className={`pb-3 px-4 font-bold border-b-2 transition-all flex items-center gap-2 ${activeTab === 'authors' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
                    >
                        <Users className="h-4 w-4" />
                        All Authors ({profiles.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('applications')}
                        className={`pb-3 px-4 font-bold border-b-2 transition-all flex items-center gap-2 ${activeTab === 'applications' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
                    >
                        <FileText className="h-4 w-4" />
                        Applications ({applications.length})
                    </button>
                </div>

                {/* Tab Content */}
                <div className="grid gap-6">
                    {loading ? (
                        <div className="text-center py-20">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                            <p className="text-muted-foreground">Loading data...</p>
                        </div>
                    ) : activeTab === 'pending' ? (
                        /* ========== PENDING APPROVALS TAB ========== */
                        approvalRequests.length === 0 ? (
                            <div className="text-center py-20 bg-card rounded-xl border border-border">
                                <Check className="h-12 w-12 text-green-500 mx-auto mb-4" />
                                <h3 className="text-lg font-bold mb-2">All caught up!</h3>
                                <p className="text-muted-foreground">No pending author approvals right now.</p>
                            </div>
                        ) : (
                            <div className="grid gap-4">
                                {approvalRequests.map((request) => (
                                    <Card key={request.id} className="border-orange-500/30 bg-orange-500/5">
                                        <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                                            <div className="flex items-center gap-4 flex-1">
                                                <div className="h-12 w-12 rounded-full bg-orange-500/20 flex items-center justify-center">
                                                    <AlertCircle className="h-6 w-6 text-orange-500" />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-lg flex items-center gap-2">
                                                        {request.full_name}
                                                        <span className="text-[10px] bg-orange-500 text-white px-2 py-0.5 rounded-full uppercase tracking-wider">
                                                            Awaiting Review
                                                        </span>
                                                    </h3>
                                                    <p className="text-sm text-muted-foreground">{request.email}</p>
                                                    <p className="text-xs text-muted-foreground mt-1">
                                                        Signed up {new Date(request.created_at).toLocaleDateString()} at {new Date(request.created_at).toLocaleTimeString()}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <Button
                                                    size="sm"
                                                    onClick={() => handleApproveAuthor(request)}
                                                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                                                >
                                                    <Check className="h-4 w-4" /> Approve
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleRejectAuthor(request)}
                                                    className="flex items-center gap-2 text-destructive hover:bg-destructive/10 border-destructive/20"
                                                >
                                                    <X className="h-4 w-4" /> Reject
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )
                    ) : activeTab === 'authors' ? (
                        /* ========== ALL AUTHORS TAB ========== */
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
                                                        {profile.is_approved ? (
                                                            <span className="text-[10px] bg-green-600 text-white px-2 py-0.5 rounded-full uppercase tracking-wider">
                                                                Approved
                                                            </span>
                                                        ) : (
                                                            <span className="text-[10px] bg-orange-500 text-white px-2 py-0.5 rounded-full uppercase tracking-wider">
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
                        /* ========== APPLICATIONS TAB ========== */
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
                                                            <a href={app.social_profile?.startsWith('http') ? app.social_profile : `https://${app.social_profile}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                                                                {app.social_profile}
                                                            </a>
                                                        </div>
                                                        <div className="bg-muted/50 p-3 rounded-lg">
                                                            <p className="text-[10px] uppercase text-muted-foreground mb-1">Followers</p>
                                                            <p className="font-bold">{app.followers?.toLocaleString()}</p>
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
                                                        <p className="text-sm leading-relaxed italic">&quot;{app.pitch}&quot;</p>
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

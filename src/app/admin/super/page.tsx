'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/sections/Footer";
import { Button } from "@/components/ui/Button";
import { Check, X, Shield, User, Clock, AlertCircle, Users, FileText, Video, Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";

interface Profile {
    id: string;
    full_name: string;
    email: string;
    role: string;
    is_approved: boolean;
    plan: string;
    session_limit: number;
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

interface SessionRequest {
    id: string;
    author_id: string;
    author_name: string;
    author_email: string;
    book_title: string;
    preferred_date: string;
    message: string;
    status: string;
    room_link: string | null;
    admin_notes: string | null;
    created_at: string;
}

export default function SuperAdminPortal() {
    const [profiles, setProfiles] = useState<Profile[]>([]);
    const [approvalRequests, setApprovalRequests] = useState<ApprovalRequest[]>([]);
    const [applications, setApplications] = useState<Application[]>([]);
    const [sessionRequests, setSessionRequests] = useState<SessionRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const [activeTab, setActiveTab] = useState<'pending' | 'authors' | 'sessions' | 'applications'>('pending');

    // Session assignment states
    const [approveLink, setApproveLink] = useState<{ [key: string]: string }>({});
    const [assigningAuthor, setAssigningAuthor] = useState<string | null>(null);
    const [assignForm, setAssignForm] = useState({ room_link: '', book_title: '', admin_notes: '' });
    const [editingLimit, setEditingLimit] = useState<string | null>(null);
    const [limitValue, setLimitValue] = useState('');

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
            const { data: requestData } = await supabase
                .from('approval_requests')
                .select('*')
                .eq('status', 'pending')
                .order('created_at', { ascending: false });
            setApprovalRequests(requestData || []);

            const { data: profileData } = await supabase
                .from('profiles')
                .select('*')
                .eq('role', 'author')
                .order('created_at', { ascending: false });
            setProfiles(profileData || []);

            const { data: appData } = await supabase
                .from('applications')
                .select('*')
                .order('created_at', { ascending: false });
            setApplications(appData || []);

            const { data: sessionData } = await supabase
                .from('session_requests')
                .select('*')
                .order('created_at', { ascending: false });
            setSessionRequests(sessionData || []);
        } catch (error) {
            console.error("Fetch error:", error);
        } finally {
            setLoading(false);
        }
    };

    // ===== Author Approval =====
    const handleApproveAuthor = async (request: ApprovalRequest) => {
        const { error: profileError } = await supabase
            .from('profiles')
            .update({ is_approved: true })
            .eq('id', request.user_id);

        if (profileError) {
            alert("Failed to approve author.");
            return;
        }

        await supabase
            .from('approval_requests')
            .update({ status: 'approved', reviewed_at: new Date().toISOString() })
            .eq('id', request.id);

        fetchAllData();
    };

    const handleRejectAuthor = async (request: ApprovalRequest) => {
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

    // ===== Session Limit =====
    const handleUpdateSessionLimit = async (id: string) => {
        const num = parseInt(limitValue);
        if (isNaN(num) || num < 0) {
            alert("Please enter a valid number.");
            return;
        }

        const { error } = await supabase
            .from('profiles')
            .update({ session_limit: num })
            .eq('id', id);

        if (!error) {
            setProfiles(profiles.map(p =>
                p.id === id ? { ...p, session_limit: num } : p
            ));
            setEditingLimit(null);
            setLimitValue('');
        }
    };

    // ===== Session Request Management =====
    const handleApproveSession = async (request: SessionRequest) => {
        const link = approveLink[request.id];
        if (!link) {
            alert("Please provide a room link for the session.");
            return;
        }

        const { error } = await supabase
            .from('session_requests')
            .update({
                status: 'approved',
                room_link: link,
                reviewed_at: new Date().toISOString()
            })
            .eq('id', request.id);

        if (!error) {
            fetchAllData();
            setApproveLink(prev => {
                const updated = { ...prev };
                delete updated[request.id];
                return updated;
            });
        }
    };

    const handleRejectSession = async (id: string) => {
        const { error } = await supabase
            .from('session_requests')
            .update({
                status: 'rejected',
                reviewed_at: new Date().toISOString()
            })
            .eq('id', id);

        if (!error) fetchAllData();
    };

    // ===== Proactive Session Assignment =====
    const handleAssignSession = async (profile: Profile) => {
        if (!assignForm.room_link) {
            alert("Please provide a room/session link.");
            return;
        }

        const { error } = await supabase
            .from('session_requests')
            .insert({
                author_id: profile.id,
                author_name: profile.full_name || 'Author',
                author_email: profile.email,
                book_title: assignForm.book_title || null,
                preferred_date: null,
                message: assignForm.admin_notes || null,
                status: 'approved',
                room_link: assignForm.room_link,
                admin_notes: assignForm.admin_notes || null,
                reviewed_at: new Date().toISOString()
            });

        if (!error) {
            alert(`Session assigned to ${profile.full_name}!`);
            setAssigningAuthor(null);
            setAssignForm({ room_link: '', book_title: '', admin_notes: '' });
            fetchAllData();
        } else {
            alert("Failed to assign session: " + error.message);
        }
    };

    const pendingCount = approvalRequests.length;
    const pendingSessionCount = sessionRequests.filter(r => r.status === 'pending').length;
    const approvedAuthors = profiles.filter(p => p.is_approved);

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
                <div className="flex gap-2 md:gap-4 mb-8 border-b border-border pb-0 overflow-x-auto">
                    <button
                        onClick={() => setActiveTab('pending')}
                        className={`pb-3 px-3 md:px-4 font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'pending' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
                    >
                        <Clock className="h-4 w-4" />
                        Pending
                        {pendingCount > 0 && (
                            <span className="bg-destructive text-destructive-foreground text-xs font-bold px-2 py-0.5 rounded-full animate-pulse">
                                {pendingCount}
                            </span>
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab('authors')}
                        className={`pb-3 px-3 md:px-4 font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'authors' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
                    >
                        <Users className="h-4 w-4" />
                        All Authors ({profiles.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('sessions')}
                        className={`pb-3 px-3 md:px-4 font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'sessions' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
                    >
                        <Video className="h-4 w-4" />
                        Sessions
                        {pendingSessionCount > 0 && (
                            <span className="bg-blue-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                                {pendingSessionCount}
                            </span>
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab('applications')}
                        className={`pb-3 px-3 md:px-4 font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'applications' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
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
                                    <Card key={profile.id}>
                                        <CardContent className="p-6">
                                            <div className="flex flex-col md:flex-row items-start justify-between gap-6">
                                                {/* Author Info */}
                                                <div className="flex items-center gap-4 flex-1">
                                                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                                                        {(profile.full_name || 'A').charAt(0).toUpperCase()}
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
                                                        <div className="flex items-center gap-4 mt-2 flex-wrap">
                                                            <div className="flex items-center gap-1">
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
                                                            <div className="flex items-center gap-1">
                                                                <span className="text-xs text-muted-foreground">Session Limit:</span>
                                                                {editingLimit === profile.id ? (
                                                                    <div className="flex items-center gap-1">
                                                                        <input
                                                                            type="number"
                                                                            value={limitValue}
                                                                            onChange={(e) => setLimitValue(e.target.value)}
                                                                            className="w-16 px-2 py-0.5 text-xs bg-background border border-border rounded"
                                                                            min="0"
                                                                        />
                                                                        <button onClick={() => handleUpdateSessionLimit(profile.id)} className="text-xs text-green-500 hover:text-green-400 font-bold">✓</button>
                                                                        <button onClick={() => { setEditingLimit(null); setLimitValue(''); }} className="text-xs text-red-500 hover:text-red-400 font-bold">✗</button>
                                                                    </div>
                                                                ) : (
                                                                    <button
                                                                        onClick={() => { setEditingLimit(profile.id); setLimitValue(String(profile.session_limit || 0)); }}
                                                                        className="text-xs font-bold text-primary hover:underline cursor-pointer"
                                                                    >
                                                                        {profile.session_limit || 0}
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Actions */}
                                                <div className="flex flex-col gap-2 min-w-[160px]">
                                                    <Button
                                                        size="sm"
                                                        onClick={() => {
                                                            setAssigningAuthor(assigningAuthor === profile.id ? null : profile.id);
                                                            setAssignForm({ room_link: '', book_title: '', admin_notes: '' });
                                                        }}
                                                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
                                                    >
                                                        <Plus className="h-4 w-4" /> Assign Session
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleToggleApproval(profile.id, profile.is_approved)}
                                                        className="flex items-center gap-2 text-destructive hover:bg-destructive/10 border-destructive/20"
                                                    >
                                                        <X className="h-4 w-4" /> Suspend
                                                    </Button>
                                                </div>
                                            </div>

                                            {/* Assign Session Form (inline) */}
                                            {assigningAuthor === profile.id && (
                                                <div className="mt-6 p-5 bg-blue-500/5 border border-blue-500/20 rounded-xl space-y-3">
                                                    <h4 className="font-bold text-sm flex items-center gap-2">
                                                        <Video className="h-4 w-4 text-blue-500" />
                                                        Assign Session to {profile.full_name}
                                                    </h4>
                                                    <input
                                                        type="text"
                                                        placeholder="Room / LiveKit Link *"
                                                        value={assignForm.room_link}
                                                        onChange={(e) => setAssignForm({ ...assignForm, room_link: e.target.value })}
                                                        className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    />
                                                    <input
                                                        type="text"
                                                        placeholder="Book Title (optional)"
                                                        value={assignForm.book_title}
                                                        onChange={(e) => setAssignForm({ ...assignForm, book_title: e.target.value })}
                                                        className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    />
                                                    <textarea
                                                        placeholder="Admin notes (optional, visible to author)"
                                                        value={assignForm.admin_notes}
                                                        onChange={(e) => setAssignForm({ ...assignForm, admin_notes: e.target.value })}
                                                        rows={2}
                                                        className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    />
                                                    <div className="flex gap-2">
                                                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700" onClick={() => handleAssignSession(profile)}>
                                                            Assign & Notify
                                                        </Button>
                                                        <Button variant="outline" size="sm" onClick={() => setAssigningAuthor(null)}>
                                                            Cancel
                                                        </Button>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Author's existing sessions */}
                                            {sessionRequests.filter(s => s.author_id === profile.id).length > 0 && (
                                                <div className="mt-4 border-t border-border pt-4">
                                                    <p className="text-xs text-muted-foreground mb-2 uppercase font-bold">Sessions ({sessionRequests.filter(s => s.author_id === profile.id).length})</p>
                                                    <div className="space-y-2">
                                                        {sessionRequests.filter(s => s.author_id === profile.id).slice(0, 3).map(s => (
                                                            <div key={s.id} className="flex items-center justify-between text-sm bg-muted/30 px-3 py-2 rounded-lg">
                                                                <span className="truncate">{s.book_title || 'Untitled'}</span>
                                                                <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase font-bold ${s.status === 'approved' ? 'bg-green-500 text-white' :
                                                                    s.status === 'rejected' ? 'bg-red-500 text-white' :
                                                                        'bg-orange-500 text-white'
                                                                    }`}>
                                                                    {s.status}
                                                                </span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )
                    ) : activeTab === 'sessions' ? (
                        /* ========== SESSION REQUESTS TAB ========== */
                        sessionRequests.length === 0 ? (
                            <div className="text-center py-20 bg-card rounded-xl border border-border">
                                No session requests found.
                            </div>
                        ) : (
                            <div className="grid gap-4">
                                {sessionRequests.map((req) => (
                                    <Card key={req.id} className={req.status === 'pending' ? 'border-blue-500/30 bg-blue-500/5' : ''}>
                                        <CardContent className="p-6">
                                            <div className="flex flex-col md:flex-row justify-between gap-6">
                                                <div className="flex-1 space-y-3">
                                                    <div className="flex items-center gap-3">
                                                        <h3 className="font-bold text-xl">{req.author_name}</h3>
                                                        <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase font-bold tracking-wider ${req.status === 'approved' ? 'bg-green-500 text-white' :
                                                            req.status === 'rejected' ? 'bg-red-500 text-white' :
                                                                'bg-orange-500 text-white'
                                                            }`}>
                                                            {req.status}
                                                        </span>
                                                    </div>
                                                    <p className="text-primary font-medium text-sm">{req.author_email}</p>

                                                    <div className="grid md:grid-cols-2 gap-4 text-sm mt-4">
                                                        <div className="bg-muted/50 p-3 rounded-lg">
                                                            <p className="text-[10px] uppercase text-muted-foreground mb-1">Book Title</p>
                                                            <p className="font-bold">{req.book_title || 'N/A'}</p>
                                                        </div>
                                                        <div className="bg-muted/50 p-3 rounded-lg">
                                                            <p className="text-[10px] uppercase text-muted-foreground mb-1">Preferred Date/Time</p>
                                                            <p className="font-bold">{req.preferred_date || 'Not specified'}</p>
                                                        </div>
                                                    </div>

                                                    {req.message && (
                                                        <div className="bg-muted/50 p-3 rounded-lg text-sm mt-3">
                                                            <p className="text-[10px] uppercase text-muted-foreground mb-1">Note</p>
                                                            <p className="italic">{req.message}</p>
                                                        </div>
                                                    )}

                                                    {req.room_link && (
                                                        <div className="bg-green-500/10 border border-green-500/20 p-3 rounded-lg text-sm mt-3">
                                                            <p className="text-[10px] uppercase text-green-600 font-bold mb-1">Room Link</p>
                                                            <p className="truncate text-green-700">{req.room_link}</p>
                                                        </div>
                                                    )}
                                                </div>

                                                {req.status === 'pending' && (
                                                    <div className="flex flex-col gap-3 justify-center min-w-[250px]">
                                                        <input
                                                            type="text"
                                                            placeholder="Enter LiveKit/Room Link..."
                                                            value={approveLink[req.id] || ''}
                                                            onChange={(e) => setApproveLink({ ...approveLink, [req.id]: e.target.value })}
                                                            className="px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                                        />
                                                        <div className="flex gap-2">
                                                            <Button size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700" onClick={() => handleApproveSession(req)}>
                                                                Approve & Send
                                                            </Button>
                                                            <Button variant="outline" size="sm" className="text-destructive hover:bg-destructive/10 border-destructive/20" onClick={() => handleRejectSession(req.id)}>
                                                                Reject
                                                            </Button>
                                                        </div>
                                                    </div>
                                                )}
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

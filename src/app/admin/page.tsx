'use client';

import { useState, useEffect } from 'react';
import VideoRoom from '@/components/VideoRoom';
import LiveChat from '@/components/LiveChat';
import { X, MessageSquare, LogOut, Upload, ShieldAlert, Clock } from 'lucide-react';
import AuthorSessionSurvey from '@/components/AuthorSessionSurvey';
import { createClient } from '@/lib/supabase';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

interface Comment {
    id: string;
    name: string;
    message: string;
    avatar: string;
}

export default function AdminPage() {
    const [roomName, setRoomName] = useState('');
    const [userName, setUserName] = useState('');
    const [isJoined, setIsJoined] = useState(false);
    const [bookTitle, setBookTitle] = useState('');
    const [transcript, setTranscript] = useState('');
    const [latestComment, setLatestComment] = useState<Comment | null>(null);
    const [isChatOpen, setIsChatOpen] = useState(true);
    const [manuscriptName, setManuscriptName] = useState('');
    const [showSurvey, setShowSurvey] = useState(false);
    const [lastSessionName, setLastSessionName] = useState('');
    const [lastAuthorName, setLastAuthorName] = useState('');

    const [loading, setLoading] = useState(true);
    const [isApproved, setIsApproved] = useState<boolean | null>(null);
    const [userPlan, setUserPlan] = useState('basic');
    const [sessionLimitReached, setSessionLimitReached] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);

    const supabase = createClient();

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            window.location.href = '/login';
            return;
        }

        setUserId(user.id);
        setUserName(user.user_metadata?.full_name || 'Author');

        // Fetch profile
        const { data: profile } = await supabase
            .from('profiles')
            .select('is_approved, plan, full_name')
            .eq('id', user.id)
            .single();

        if (profile) {
            setIsApproved(profile.is_approved);
            setUserPlan(profile.plan || 'basic');

            // Allow super admin to skip approval check for themselves? No, follow logic.
            // Check session limits (per week)
            if (profile.is_approved) {
                const oneWeekAgo = new Date();
                oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

                const { count } = await supabase
                    .from('live_chat_messages') // Leveraging this table to count sessions (room_name distinct created_at)
                    .select('room_name', { count: 'exact', head: true })
                    .eq('name', profile.full_name || 'Author')
                    .gte('created_at', oneWeekAgo.toISOString());

                // Plan limits: Basic: 1, Standard: 2, Premium: 4, Platinum: 5
                const limits: Record<string, number> = {
                    'basic': 1,
                    'standard': 2,
                    'premium': 4,
                    'platinum': 5
                };

                if ((count || 0) >= (limits[profile.plan] || 1)) {
                    // setSessionLimitReached(true); // Temporarily disabling hard block to avoid locking out during dev
                    console.log("Weekly session limit reached for plan:", profile.plan);
                }
            }
        } else {
            setIsApproved(false);
        }
        setLoading(false);
    };

    const handleJoin = (e: React.FormEvent) => {
        e.preventDefault();
        if (roomName.trim() && userName.trim()) {
            setIsJoined(true);
            // On mobile, auto-close chat to show video full screen initially
            if (typeof window !== 'undefined' && window.innerWidth < 768) {
                setIsChatOpen(false);
            }
        }
    };

    const handleDisconnect = () => {
        setLastSessionName(roomName);
        setLastAuthorName(userName);
        setShowSurvey(true);
        setIsJoined(false);
        setRoomName('');
        setTranscript('');
        setManuscriptName('');
    };

    const handleNewComment = (comment: Comment) => {
        setLatestComment(comment);
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setManuscriptName(file.name);
        }
    };

    const handleInvite = () => {
        const url = `${window.location.origin}/reader?room=${encodeURIComponent(roomName)}`;
        navigator.clipboard.writeText(url);
        alert('Invite link copied to clipboard!');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            </div>
        );
    }

    if (isApproved === false) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
                <div className="bg-gray-800 p-8 rounded-2xl shadow-xl max-w-md w-full border border-gray-700 text-center">
                    <div className="mb-6 flex justify-center">
                        <div className="bg-orange-500/20 p-4 rounded-full">
                            <Clock className="h-10 w-10 text-orange-500" />
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-4">Approval Pending</h1>
                    <p className="text-gray-400 mb-8">
                        Thank you for joining BuukClub! Your author account is currently being reviewed.
                        We typically approve new authors within 24-48 hours.
                    </p>
                    <div className="space-y-3">
                        <Link href="/">
                            <Button variant="outline" className="w-full">Back to Home</Button>
                        </Link>
                        <button
                            onClick={() => supabase.auth.signOut().then(() => window.location.href = '/')}
                            className="text-sm text-gray-500 hover:text-white transition underline"
                        >
                            Log Out
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (sessionLimitReached) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
                <div className="bg-gray-800 p-8 rounded-2xl shadow-xl max-w-md w-full border border-red-500/50 text-center">
                    <div className="mb-6 flex justify-center">
                        <div className="bg-red-500/20 p-4 rounded-full">
                            <ShieldAlert className="h-10 w-10 text-red-500" />
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-4">Limit Reached</h1>
                    <p className="text-gray-400 mb-8">
                        You've reached your weekly session limit for the <strong className="text-white uppercase">{userPlan}</strong> plan.
                        Upgrade your plan to host more sessions.
                    </p>
                    <div className="space-y-3">
                        <Link href="/pricing">
                            <Button className="w-full bg-primary hover:bg-primary/90">Upgrade Plan</Button>
                        </Link>
                        <Link href="/">
                            <Button variant="outline" className="w-full">Back to Home</Button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    if (!isJoined) {
        return (
            <>
                <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
                    <div className="bg-gray-800 p-8 rounded-2xl shadow-xl max-w-md w-full border border-gray-700">
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-bold text-white mb-2">Admin Studio</h1>
                            <p className="text-gray-400">Join a room to start streaming</p>
                        </div>

                        <form onSubmit={handleJoin} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Your Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={userName}
                                    onChange={(e) => setUserName(e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                    placeholder="e.g., John Doe"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Room Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={roomName}
                                    onChange={(e) => setRoomName(e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                    placeholder="e.g., BookClub-1"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Book Title (Optional)
                                </label>
                                <input
                                    type="text"
                                    value={bookTitle}
                                    onChange={(e) => setBookTitle(e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                    placeholder="e.g., The Great Gatsby"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Upload Manuscript (Optional)
                                </label>
                                <div className="relative">
                                    <input
                                        type="file"
                                        onChange={handleFileUpload}
                                        className="hidden"
                                        id="manuscript-upload"
                                        accept=".pdf,.doc,.docx,.txt"
                                    />
                                    <label
                                        htmlFor="manuscript-upload"
                                        className="flex items-center justify-center w-full px-4 py-3 bg-gray-700 border border-dashed border-gray-500 rounded-lg text-gray-300 cursor-pointer hover:bg-gray-600 transition"
                                    >
                                        <Upload size={18} className="mr-2" />
                                        {manuscriptName || 'Choose file...'}
                                    </label>
                                </div>
                                <p className="text-xs text-yellow-500 mt-2 flex items-start gap-1">
                                    <span>⚠️</span>
                                    <span>Disclaimer: Users can see your book cover/title but cannot download the manuscript file.</span>
                                </p>
                            </div>

                            <button
                                type="submit"
                                className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-lg shadow-lg transform transition hover:scale-[1.02] mt-2"
                            >
                                Join Studio
                            </button>
                        </form>
                    </div>
                </div>
                <AuthorSessionSurvey
                    isOpen={showSurvey}
                    onClose={() => setShowSurvey(false)}
                    sessionName={lastSessionName}
                    authorName={lastAuthorName || userName}
                />
            </>
        );
    }

    return (
        <>
            <div className="h-screen bg-black flex overflow-hidden relative">
                {/* Header / Buttons */}
                <div className="absolute top-4 left-4 z-50 flex gap-3">
                    <button
                        onClick={handleDisconnect}
                        className="flex items-center gap-2 px-4 py-2 bg-red-600/90 hover:bg-red-700 text-white rounded-lg shadow-lg backdrop-blur-sm transition font-medium text-sm"
                    >
                        <LogOut size={16} />
                        Leave
                    </button>
                    <button
                        onClick={handleInvite}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600/90 hover:bg-blue-700 text-white rounded-lg shadow-lg backdrop-blur-sm transition font-medium text-sm"
                    >
                        <Upload size={16} className="rotate-90" />
                        Invite Readers
                    </button>
                </div>

                {/* Video Area */}
                <div className={`flex-1 relative transition-all duration-300 h-full ${isChatOpen ? 'mr-0 md:mr-[350px]' : 'mr-0'}`}>
                    <VideoRoom
                        roomName={roomName}
                        onDisconnect={handleDisconnect}
                        // onTranscriptUpdate={setTranscript} // Disabled by default as requested
                        latestComment={latestComment}
                    />

                    {/* Toggle Chat Button (Floating) */}
                    <button
                        onClick={() => setIsChatOpen(!isChatOpen)}
                        className="absolute top-4 right-4 z-30 p-2 bg-gray-800/80 backdrop-blur text-white rounded-full hover:bg-gray-700 transition shadow-lg border border-white/10"
                        title={isChatOpen ? "Close Chat" : "Open Chat"}
                    >
                        {isChatOpen ? <X size={20} /> : <MessageSquare size={20} />}
                    </button>
                </div>

                {/* Chat Sidebar */}
                <div
                    className={`fixed inset-y-0 right-0 w-full md:w-[350px] bg-gray-900 border-l border-gray-800 transform transition-transform duration-300 z-40 ${isChatOpen ? 'translate-x-0' : 'translate-x-full'
                        }`}
                >
                    <LiveChat
                        topic={roomName}
                        bookTitle={bookTitle}
                        transcript={transcript}
                        onNewComment={handleNewComment}
                        userName={userName}
                        isHost={true}
                    />
                </div>
            </div>
            <AuthorSessionSurvey
                isOpen={showSurvey}
                onClose={() => setShowSurvey(false)}
                sessionName={lastSessionName || roomName}
                authorName={lastAuthorName || userName}
            />
        </>
    );
}

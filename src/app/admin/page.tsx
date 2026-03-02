'use client';

import { useState, useEffect } from 'react';
import VideoRoom from '@/components/VideoRoom';
import LiveChat from '@/components/LiveChat';
import { X, MessageSquare, LogOut, Upload, User, BookOpen, Link2, Settings } from 'lucide-react';
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

interface ProfileData {
    full_name: string;
    email: string;
    plan: string;
    bio: string;
    book_name: string;
    avatar_url: string;
    created_at: string;
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
    const [userId, setUserId] = useState<string | null>(null);

    // Dashboard state
    const [dashboardView, setDashboardView] = useState<'dashboard' | 'studio' | 'profile'>('dashboard');
    const [profile, setProfile] = useState<ProfileData | null>(null);
    const [editingProfile, setEditingProfile] = useState(false);
    const [profileForm, setProfileForm] = useState({ full_name: '', bio: '', book_name: '' });

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
        const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

        if (profileData) {
            setProfile(profileData);
            setProfileForm({
                full_name: profileData.full_name || '',
                bio: profileData.bio || '',
                book_name: profileData.book_name || '',
            });
        }
        setLoading(false);
    };

    const handleSaveProfile = async () => {
        if (!userId) return;
        const { error } = await supabase
            .from('profiles')
            .update({
                full_name: profileForm.full_name,
                bio: profileForm.bio,
                book_name: profileForm.book_name,
                updated_at: new Date().toISOString(),
            })
            .eq('id', userId);

        if (!error) {
            setProfile(prev => prev ? { ...prev, ...profileForm } : prev);
            setUserName(profileForm.full_name || 'Author');
            setEditingProfile(false);
        }
    };

    const handleStartSession = (e: React.FormEvent) => {
        e.preventDefault();
        if (!roomName.trim()) return;
        setIsJoined(true);
    };

    const handleDisconnect = () => {
        setLastSessionName(roomName);
        setLastAuthorName(userName);
        setShowSurvey(true);
        setIsJoined(false);
        setRoomName('');
        setTranscript('');
        setManuscriptName('');
        setDashboardView('dashboard');
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

    // ==================== LOADING ====================
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            </div>
        );
    }

    // ==================== LIVE SESSION (in studio) ====================
    if (isJoined) {
        return (
            <>
                <div className="h-screen bg-black flex overflow-hidden relative">
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

                    <div className={`flex-1 relative transition-all duration-300 h-full ${isChatOpen ? 'mr-0 md:mr-[350px]' : 'mr-0'}`}>
                        <VideoRoom
                            roomName={roomName}
                            onDisconnect={handleDisconnect}
                            latestComment={latestComment}
                        />

                        <button
                            onClick={() => setIsChatOpen(!isChatOpen)}
                            className="absolute top-4 right-4 z-30 p-2 bg-gray-800/80 backdrop-blur text-white rounded-full hover:bg-gray-700 transition shadow-lg border border-white/10"
                            title={isChatOpen ? "Close Chat" : "Open Chat"}
                        >
                            {isChatOpen ? <X size={20} /> : <MessageSquare size={20} />}
                        </button>
                    </div>

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

    // ==================== DASHBOARD ====================
    return (
        <>
            <div className="min-h-screen bg-gray-900">
                {/* Top Bar */}
                <div className="border-b border-gray-800 bg-gray-900/95 backdrop-blur sticky top-0 z-30">
                    <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                                {userName?.charAt(0)?.toUpperCase() || 'A'}
                            </div>
                            <div>
                                <h2 className="text-white font-bold text-sm">{userName}</h2>
                                <p className="text-gray-500 text-xs">Author Dashboard</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setDashboardView('dashboard')}
                                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${dashboardView === 'dashboard' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'}`}
                            >
                                Dashboard
                            </button>
                            <button
                                onClick={() => setDashboardView('profile')}
                                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${dashboardView === 'profile' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'}`}
                            >
                                Profile
                            </button>
                            <button
                                onClick={() => supabase.auth.signOut().then(() => window.location.href = '/')}
                                className="ml-2 px-3 py-1.5 rounded-lg text-sm text-gray-500 hover:text-red-400 transition flex items-center gap-1"
                            >
                                <LogOut size={14} /> Logout
                            </button>
                        </div>
                    </div>
                </div>

                <div className="max-w-6xl mx-auto px-6 py-10">
                    {dashboardView === 'profile' ? (
                        /* ========== PROFILE VIEW ========== */
                        <div className="max-w-2xl mx-auto">
                            <h1 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                                <User className="h-6 w-6 text-blue-400" />
                                My Profile
                            </h1>

                            <div className="bg-gray-800 rounded-2xl border border-gray-700 p-8 space-y-6">
                                <div className="flex items-center gap-6 mb-8">
                                    <div className="h-20 w-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-2xl">
                                        {(profile?.full_name || 'A').charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-white">{profile?.full_name || 'Author'}</h2>
                                        <p className="text-gray-400 text-sm">{profile?.email}</p>
                                        <p className="text-xs text-gray-500 mt-1">Member since {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'N/A'}</p>
                                    </div>
                                </div>

                                {editingProfile ? (
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                                            <input
                                                type="text"
                                                value={profileForm.full_name}
                                                onChange={(e) => setProfileForm({ ...profileForm, full_name: e.target.value })}
                                                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">Bio</label>
                                            <textarea
                                                value={profileForm.bio}
                                                onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                                                rows={3}
                                                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                                placeholder="Tell readers about yourself..."
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">Book Name</label>
                                            <input
                                                type="text"
                                                value={profileForm.book_name}
                                                onChange={(e) => setProfileForm({ ...profileForm, book_name: e.target.value })}
                                                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                                placeholder="Your published book"
                                            />
                                        </div>
                                        <div className="flex gap-3 pt-2">
                                            <button
                                                onClick={handleSaveProfile}
                                                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition"
                                            >
                                                Save Changes
                                            </button>
                                            <button
                                                onClick={() => setEditingProfile(false)}
                                                className="px-6 py-2.5 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div className="bg-gray-700/50 p-4 rounded-xl">
                                                <p className="text-xs text-gray-500 uppercase mb-1">Plan</p>
                                                <p className="text-white font-bold capitalize">{profile?.plan || 'Basic'}</p>
                                            </div>
                                            <div className="bg-gray-700/50 p-4 rounded-xl">
                                                <p className="text-xs text-gray-500 uppercase mb-1">Status</p>
                                                <p className="text-green-400 font-bold">✓ Active</p>
                                            </div>
                                        </div>

                                        {profile?.bio && (
                                            <div className="bg-gray-700/50 p-4 rounded-xl">
                                                <p className="text-xs text-gray-500 uppercase mb-1">Bio</p>
                                                <p className="text-gray-300">{profile.bio}</p>
                                            </div>
                                        )}

                                        {profile?.book_name && (
                                            <div className="bg-gray-700/50 p-4 rounded-xl">
                                                <p className="text-xs text-gray-500 uppercase mb-1">Book</p>
                                                <p className="text-white font-medium">{profile.book_name}</p>
                                            </div>
                                        )}

                                        <button
                                            onClick={() => setEditingProfile(true)}
                                            className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition text-sm"
                                        >
                                            <Settings size={14} /> Edit Profile
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : dashboardView === 'studio' ? (
                        /* ========== START SESSION FORM ========== */
                        <div className="max-w-md mx-auto">
                            <button
                                onClick={() => setDashboardView('dashboard')}
                                className="text-gray-400 hover:text-white text-sm mb-6 flex items-center gap-1 transition"
                            >
                                ← Back to Dashboard
                            </button>

                            <div className="bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-700">
                                <div className="text-center mb-8">
                                    <h1 className="text-3xl font-bold text-white mb-2">Start Session</h1>
                                    <p className="text-gray-400">Fill in the details to go live</p>
                                </div>

                                <form onSubmit={handleStartSession} className="space-y-5">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Session Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={roomName}
                                            onChange={(e) => setRoomName(e.target.value)}
                                            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                            placeholder="e.g., Friday Book Chat"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Book Title
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
                                        <label className="flex items-center gap-2 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-400 cursor-pointer hover:bg-gray-650 transition">
                                            <Upload size={16} />
                                            {manuscriptName || 'Choose file...'}
                                            <input
                                                type="file"
                                                className="hidden"
                                                accept=".pdf,.doc,.docx,.txt"
                                                onChange={handleFileUpload}
                                            />
                                        </label>
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-lg shadow-lg transform transition hover:scale-[1.02] mt-2"
                                    >
                                        🎬 Go Live
                                    </button>
                                </form>
                            </div>
                        </div>
                    ) : (
                        /* ========== MAIN DASHBOARD ========== */
                        <div>
                            <h1 className="text-3xl font-bold text-white mb-2">Welcome back, {userName}! 👋</h1>
                            <p className="text-gray-400 mb-10">Manage your BookClub sessions from your author dashboard.</p>

                            {/* Quick Actions */}
                            <div className="grid md:grid-cols-3 gap-6 mb-10">
                                <button
                                    onClick={() => setDashboardView('studio')}
                                    className="bg-gradient-to-br from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 p-6 rounded-2xl text-left transition transform hover:scale-[1.02] shadow-lg"
                                >
                                    <BookOpen className="h-8 w-8 text-white mb-3" />
                                    <h3 className="text-lg font-bold text-white">Start Session</h3>
                                    <p className="text-blue-200 text-sm mt-1">Create a live BookClub session</p>
                                </button>

                                <button
                                    onClick={() => {
                                        const url = `${window.location.origin}/reader`;
                                        navigator.clipboard.writeText(url);
                                        alert('Reader link copied to clipboard!');
                                    }}
                                    className="bg-gray-800 hover:bg-gray-750 border border-gray-700 hover:border-gray-600 p-6 rounded-2xl text-left transition"
                                >
                                    <Link2 className="h-8 w-8 text-blue-400 mb-3" />
                                    <h3 className="text-lg font-bold text-white">Share Reader Link</h3>
                                    <p className="text-gray-400 text-sm mt-1">Copy your reader invite link</p>
                                </button>

                                <button
                                    onClick={() => setDashboardView('profile')}
                                    className="bg-gray-800 hover:bg-gray-750 border border-gray-700 hover:border-gray-600 p-6 rounded-2xl text-left transition"
                                >
                                    <User className="h-8 w-8 text-purple-400 mb-3" />
                                    <h3 className="text-lg font-bold text-white">My Profile</h3>
                                    <p className="text-gray-400 text-sm mt-1">Update your author details and bio</p>
                                </button>
                            </div>

                            {/* Account Info */}
                            <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6">
                                <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                                    <Settings className="h-4 w-4 text-gray-400" />
                                    Account Overview
                                </h3>
                                <div className="grid md:grid-cols-3 gap-4">
                                    <div className="bg-gray-700/50 p-4 rounded-xl">
                                        <p className="text-xs text-gray-500 uppercase mb-1">Current Plan</p>
                                        <p className="text-white font-bold text-lg capitalize">{profile?.plan || 'basic'}</p>
                                    </div>
                                    <div className="bg-gray-700/50 p-4 rounded-xl">
                                        <p className="text-xs text-gray-500 uppercase mb-1">Status</p>
                                        <p className="text-green-400 font-bold text-lg">✓ Active</p>
                                    </div>
                                    <div className="bg-gray-700/50 p-4 rounded-xl">
                                        <p className="text-xs text-gray-500 uppercase mb-1">Member Since</p>
                                        <p className="text-white font-bold text-lg">{profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'N/A'}</p>
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <Link href="/pricing">
                                        <span className="text-sm text-blue-400 hover:text-blue-300 transition cursor-pointer">
                                            Upgrade your plan →
                                        </span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}
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

'use client';

import { useState } from 'react';
import VideoRoom from '@/components/VideoRoom';
import LiveChat from '@/components/LiveChat';
import { Menu, X, MessageSquare, LogOut, Upload } from 'lucide-react';

export default function AdminPage() {
    const [roomName, setRoomName] = useState('');
    const [userName, setUserName] = useState('');
    const [isJoined, setIsJoined] = useState(false);
    const [bookTitle, setBookTitle] = useState('');
    const [topic, setTopic] = useState('');
    const [transcript, setTranscript] = useState('');
    const [latestComment, setLatestComment] = useState<any>(null);
    const [isChatOpen, setIsChatOpen] = useState(true);
    const [manuscriptName, setManuscriptName] = useState('');

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
        setIsJoined(false);
        setRoomName('');
        setTranscript('');
        setManuscriptName('');
    };

    const handleNewComment = (comment: any) => {
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

    if (!isJoined) {
        return (
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
        );
    }

    return (
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
                    topic={topic || roomName}
                    bookTitle={bookTitle}
                    transcript={transcript}
                    onNewComment={handleNewComment}
                />
            </div>
        </div>
    );
}

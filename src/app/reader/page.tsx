'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import VideoRoom from '@/components/VideoRoom';
import LiveChat from '@/components/LiveChat';
import FeedbackSurvey from '@/components/FeedbackSurvey';
import { MessageSquare, X, LogOut } from 'lucide-react';

function ReaderContent() {
    const searchParams = useSearchParams();
    const roomParam = searchParams.get('room');
    const docParam = searchParams.get('doc'); // Optional: shared document URL from invite link

    const [roomName, setRoomName] = useState(() => roomParam ?? '');
    const [isJoined, setIsJoined] = useState(false);
    const [isChatOpen, setIsChatOpen] = useState(true);
    const [showSurvey, setShowSurvey] = useState(false);
    const [hostName, setHostName] = useState('');

    const handleJoin = (e: React.FormEvent) => {
        e.preventDefault();
        if (roomName.trim()) {
            setIsJoined(true);
            if (typeof window !== 'undefined' && window.innerWidth < 768) {
                setIsChatOpen(false);
            }
        }
    };

    const handleDisconnect = () => {
        setIsJoined(false);
        setShowSurvey(true);
    };

    if (!isJoined) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
                <div className="bg-gray-800 p-8 rounded-2xl shadow-xl max-w-md w-full border border-gray-700">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-white mb-2">Join as Reader</h1>
                        <p className="text-gray-400">Watch the stream and enjoy the session</p>
                    </div>

                    <form onSubmit={handleJoin} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Room Name
                            </label>
                            <input
                                type="text"
                                value={roomName}
                                onChange={(e) => setRoomName(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                placeholder="Enter room name..."
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Host / Author Name (optional)
                            </label>
                            <input
                                type="text"
                                value={hostName}
                                onChange={(e) => setHostName(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                placeholder="e.g., Casey Quinn"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full py-3 px-4 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-bold rounded-lg shadow-lg transform transition hover:scale-[1.02]"
                        >
                            Join Stream
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen bg-black flex flex-col md:flex-row overflow-hidden relative">
            {/* Header / Leave Button */}
            <div className="absolute top-4 left-4 z-50">
                <button
                    onClick={handleDisconnect}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600/90 hover:bg-red-700 text-white rounded-lg shadow-lg backdrop-blur-sm transition font-medium text-sm"
                >
                    <LogOut size={16} />
                    Leave
                </button>
            </div>

            {/* Video Area — reader is subscriber only (no cam/mic) */}
            <div className={`relative transition-all duration-300 ${isChatOpen ? 'h-[50vh] md:h-full w-full md:flex-1' : 'h-full w-full flex-1'}`}>
                <VideoRoom
                    roomName={roomName}
                    onDisconnect={handleDisconnect}
                    isPublisher={false}
                    manuscriptUrl={docParam || undefined}
                    manuscriptName="Shared Document"
                />

                {/* Toggle Chat Button */}
                <button
                    onClick={() => setIsChatOpen(!isChatOpen)}
                    className="absolute top-4 right-4 z-30 p-2 bg-gray-800/80 backdrop-blur text-white rounded-full hover:bg-gray-700 transition shadow-lg border border-white/10"
                    title={isChatOpen ? "Close Chat" : "Open Chat"}
                >
                    {isChatOpen ? <X size={20} /> : <MessageSquare size={20} />}
                </button>
            </div>

            {/* Chat Sidebar — readers can interact with real messages alongside AI comments */}
            <div
                className={`w-full md:w-[350px] bg-gray-900 border-t md:border-t-0 md:border-l border-gray-800 transition-all duration-300 z-40 ${isChatOpen ? 'h-[50vh] md:h-full translate-y-0 md:translate-x-0' : 'h-0 md:h-full md:translate-x-full hidden md:block'
                    }`}
            >
                <LiveChat
                    topic={roomName}
                    userName="Reader"
                    isHost={false}
                />
            </div>

            {/* Feedback Survey */}
            <FeedbackSurvey
                isOpen={showSurvey}
                onClose={() => setShowSurvey(false)}
                bookTitle={roomName}
                authorName={hostName || "The Author"}
            />
        </div>
    );
}

export default function ReaderPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">Loading...</div>}>
            <ReaderContent />
        </Suspense>
    );
}

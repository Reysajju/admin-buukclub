'use client';

import { useState } from 'react';
import VideoRoom from '@/components/VideoRoom';
import LiveChat from '@/components/LiveChat';

export default function AdminPage() {
    const [roomName, setRoomName] = useState('');
    const [bookTitle, setBookTitle] = useState('');
    const [joined, setJoined] = useState(false);

    const handleJoinRoom = (e: React.FormEvent) => {
        e.preventDefault();
        if (roomName.trim()) {
            setJoined(true);
        }
    };

    const handleLeaveRoom = () => {
        setJoined(false);
        setRoomName('');
        setBookTitle('');
    };

    if (joined) {
        return (
            <div className="min-h-screen bg-gray-900">
                <div className="h-screen flex flex-col">
                    {/* Header */}
                    <div className="bg-gray-800 border-b border-gray-700 px-6 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                            <h1 className="text-white font-semibold">Room: {roomName}</h1>
                            {bookTitle && (
                                <span className="text-gray-400 text-sm">• {bookTitle}</span>
                            )}
                        </div>
                        <button
                            onClick={handleLeaveRoom}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                        >
                            Leave Room
                        </button>
                    </div>

                    {/* Split Screen: Video + Chat */}
                    <div className="flex-1 flex overflow-hidden">
                        {/* Video Section - 70% */}
                        <div className="flex-[7] overflow-hidden">
                            <VideoRoom roomName={roomName} onDisconnect={handleLeaveRoom} />
                        </div>

                        {/* Chat Section - 30% */}
                        <div className="flex-[3] border-l border-gray-700">
                            <LiveChat topic={roomName} bookTitle={bookTitle} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-block p-3 bg-blue-600 rounded-2xl mb-4">
                        <svg
                            className="w-12 h-12 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                            />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Video Calling Test
                    </h1>
                    <p className="text-gray-600">
                        Test LiveKit video calls with AI-powered audience simulation
                    </p>
                </div>

                {/* Form Card */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <form onSubmit={handleJoinRoom} className="space-y-6">
                        {/* Room Name Input */}
                        <div>
                            <label
                                htmlFor="roomName"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                Room Name
                            </label>
                            <input
                                type="text"
                                id="roomName"
                                value={roomName}
                                onChange={(e) => setRoomName(e.target.value)}
                                placeholder="e.g., test-room-123"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                required
                            />
                        </div>

                        {/* Book Title Input */}
                        <div>
                            <label
                                htmlFor="bookTitle"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                Book Title (Optional)
                            </label>
                            <input
                                type="text"
                                id="bookTitle"
                                value={bookTitle}
                                onChange={(e) => setBookTitle(e.target.value)}
                                placeholder="e.g., The Great Gatsby"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                            />
                            <p className="mt-2 text-sm text-gray-500">
                                AI will generate contextual comments based on this book
                            </p>
                        </div>

                        {/* Join Button */}
                        <button
                            type="submit"
                            className="w-full py-3 px-6 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition transform hover:scale-[1.02] active:scale-[0.98]"
                        >
                            Join Room
                        </button>
                    </form>

                    {/* Info Cards */}
                    <div className="mt-6 space-y-3">
                        <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
                            <svg
                                className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                                <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
                            </svg>
                            <div className="text-sm text-purple-900">
                                <strong>AI Audience:</strong> Send messages and watch AI generate
                                hundreds of contextual audience responses!
                            </div>
                        </div>

                        <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                            <svg
                                className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            <div className="text-sm text-blue-900">
                                <strong>Tip:</strong> Your browser will ask for camera and microphone
                                permissions when you join
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <p className="text-center text-sm text-gray-600 mt-6">
                    Admin Test Page • BuukClub
                </p>
            </div>
        </div>
    );
}

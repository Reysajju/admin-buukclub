'use client';

import { useState, useEffect, useRef } from 'react';

interface Comment {
    id: string;
    name: string;
    message: string;
    timestamp: Date;
    avatar: string;
}

interface LiveChatProps {
    topic?: string;
    bookTitle?: string;
}

const AVATAR_COLORS = [
    'bg-blue-500',
    'bg-green-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-yellow-500',
    'bg-red-500',
    'bg-indigo-500',
    'bg-teal-500',
];

export default function LiveChat({ topic, bookTitle }: LiveChatProps) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [authorMessage, setAuthorMessage] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [viewerCount, setViewerCount] = useState(0);
    const chatEndRef = useRef<HTMLDivElement>(null);

    // Simulate viewer count fluctuation
    useEffect(() => {
        const baseCount = Math.floor(Math.random() * 500) + 200;
        setViewerCount(baseCount);

        const interval = setInterval(() => {
            setViewerCount((prev) => {
                const change = Math.floor(Math.random() * 20) - 10;
                return Math.max(150, Math.min(1000, prev + change));
            });
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    // Auto-scroll to bottom
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [comments]);

    const generateComments = async (message?: string) => {
        setIsGenerating(true);

        try {
            const response = await fetch('/api/generate-comments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    topic,
                    bookTitle,
                    authorMessage: message || authorMessage,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to generate comments');
            }

            const data = await response.json();
            const newComments: Comment[] = data.comments.map((c: any, index: number) => ({
                id: `${Date.now()}-${index}`,
                name: c.name,
                message: c.message,
                timestamp: new Date(),
                avatar: AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)],
            }));

            // Add comments with staggered timing for realistic effect
            newComments.forEach((comment, index) => {
                setTimeout(() => {
                    setComments((prev) => [...prev, comment]);
                }, index * (Math.random() * 2000 + 500)); // Random delay between 500-2500ms
            });
        } catch (error) {
            console.error('Error generating comments:', error);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!authorMessage.trim()) return;

        // Add author's message
        const authorComment: Comment = {
            id: `author-${Date.now()}`,
            name: 'You (Author)',
            message: authorMessage,
            timestamp: new Date(),
            avatar: 'bg-gradient-to-br from-purple-600 to-blue-600',
        };

        setComments((prev) => [...prev, authorComment]);

        // Generate AI responses based on author's message
        generateComments(authorMessage);
        setAuthorMessage('');
    };

    return (
        <div className="flex flex-col h-full bg-gray-900 text-white">
            {/* Header */}
            <div className="bg-gray-800 border-b border-gray-700 px-4 py-3">
                <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-lg">Live Chat</h3>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                        <span className="text-sm text-gray-400">
                            {viewerCount.toLocaleString()} watching
                        </span>
                    </div>
                </div>
                {bookTitle && (
                    <p className="text-sm text-gray-400 mt-1">Discussing: {bookTitle}</p>
                )}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {comments.length === 0 && (
                    <div className="text-center text-gray-500 py-8">
                        <p className="mb-2">💬 No messages yet</p>
                        <p className="text-sm">Send a message to start the conversation!</p>
                    </div>
                )}

                {comments.map((comment) => (
                    <div
                        key={comment.id}
                        className="flex gap-3 animate-fade-in-up"
                        style={{
                            animation: 'fadeInUp 0.3s ease-out',
                        }}
                    >
                        {/* Avatar */}
                        <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0 ${comment.avatar}`}
                        >
                            {comment.name.charAt(0).toUpperCase()}
                        </div>

                        {/* Message */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-baseline gap-2">
                                <span className="font-semibold text-sm">{comment.name}</span>
                                <span className="text-xs text-gray-500">
                                    {comment.timestamp.toLocaleTimeString([], {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
                                </span>
                            </div>
                            <p className="text-sm text-gray-200 break-words">{comment.message}</p>
                        </div>
                    </div>
                ))}
                <div ref={chatEndRef} />
            </div>

            {/* Input */}
            <div className="border-t border-gray-700 p-4">
                <form onSubmit={handleSendMessage} className="flex gap-2">
                    <input
                        type="text"
                        value={authorMessage}
                        onChange={(e) => setAuthorMessage(e.target.value)}
                        placeholder="Send a message..."
                        className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={isGenerating}
                    />
                    <button
                        type="submit"
                        disabled={isGenerating || !authorMessage.trim()}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-lg font-medium text-sm transition"
                    >
                        {isGenerating ? '...' : 'Send'}
                    </button>
                </form>
                <p className="text-xs text-gray-500 mt-2">
                    💡 AI will generate audience responses to your messages
                </p>
            </div>

            <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
        </div>
    );
}

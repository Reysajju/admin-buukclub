'use client';

import { useState, useEffect, useRef } from 'react';
import { Send } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

interface Comment {
    id: string;
    name: string;
    message: string;
    timestamp: Date;
    avatar: string;
    color: string;
    isAI?: boolean;
}

interface LiveChatProps {
    topic?: string;
    bookTitle?: string;
    transcript?: string;
    onNewComment?: (comment: Comment) => void;
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

export default function LiveChat({ topic, bookTitle, transcript, onNewComment }: LiveChatProps) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [viewerCount, setViewerCount] = useState(150);
    const chatEndRef = useRef<HTMLDivElement>(null);
    const lastTranscriptRef = useRef<string>('');

    // Auto-scroll to bottom
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [comments]);

    // Dynamic Viewer Count Logic
    useEffect(() => {
        const interval = setInterval(() => {
            setViewerCount((prev) => {
                // Base fluctuation
                const change = Math.floor(Math.random() * 11) - 5; // -5 to +5
                let newCount = prev + change;

                // Ensure viewer count is always at least the number of comments + buffer
                const minViewers = Math.max(150, comments.length + 50);
                if (newCount < minViewers) newCount = minViewers;

                return newCount;
            });
        }, 2000);

        return () => clearInterval(interval);
    }, [comments.length]);

    // Spike viewer count on activity (message or transcript)
    const spikeViewers = () => {
        setViewerCount((prev) => prev + Math.floor(Math.random() * 40) + 10); // +10 to +50
    };

    // Handle Transcript Updates (AI Context)
    useEffect(() => {
        if (transcript && transcript !== lastTranscriptRef.current) {
            lastTranscriptRef.current = transcript;
            // Spike viewers on speech
            if (Math.random() > 0.7) spikeViewers();

            // Trigger AI comments based on transcript (throttled)
            // Note: In a real app, we'd debounce this and call the API
        }
    }, [transcript]);

    const generateAIComments = async (userMessage: string) => {
        try {
            const response = await fetch('/api/generate-comments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    topic: topic || 'General Discussion',
                    bookTitle: bookTitle || 'Unknown Book',
                    authorMessage: userMessage,
                    transcript: transcript || ''
                }),
            });

            if (!response.ok) return;

            const data = await response.json();
            const newComments = data.comments || [];

            // Add comments with staggered delay
            newComments.forEach((comment: any, index: number) => {
                setTimeout(() => {
                    const aiComment: Comment = {
                        id: Math.random().toString(36).substr(2, 9),
                        name: comment.name,
                        message: comment.message,
                        timestamp: new Date(),
                        avatar: comment.name.charAt(0).toUpperCase(),
                        color: AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)],
                        isAI: true,
                    };
                    setComments((prev) => [...prev, aiComment]);
                    if (onNewComment) onNewComment(aiComment);
                }, (index + 1) * (Math.random() * 2000 + 500)); // 0.5s to 2.5s delay per comment
            });

        } catch (error) {
            console.error('Failed to generate comments:', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        const userComment: Comment = {
            id: Math.random().toString(36).substr(2, 9),
            name: 'You (Author)',
            message: newMessage,
            timestamp: new Date(),
            avatar: 'ME',
            color: 'bg-gray-600',
            isAI: false,
        };

        setComments((prev) => [...prev, userComment]);
        if (onNewComment) onNewComment(userComment);

        const messageToSend = newMessage;
        setNewMessage('');

        // Spike viewers on author interaction
        spikeViewers();

        // Generate AI response
        await generateAIComments(messageToSend);
    };

    return (
        <div className="flex flex-col h-full bg-gray-900 border-l border-gray-800">
            {/* Header */}
            <div className="p-4 border-b border-gray-800 bg-gray-900/95 backdrop-blur z-10">
                <div className="flex items-center justify-between mb-1">
                    <h2 className="text-white font-semibold">Live Chat</h2>
                    <div className="flex items-center gap-2 text-red-500 bg-red-500/10 px-2 py-1 rounded text-xs font-medium animate-pulse">
                        <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                        LIVE
                    </div>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>{viewerCount.toLocaleString()} watching</span>
                    {topic && <span className="truncate max-w-[150px]">{topic}</span>}
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
                <AnimatePresence initial={false}>
                    {comments.map((comment) => (
                        <motion.div
                            key={comment.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-start gap-3 group"
                        >
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 ${comment.color}`}>
                                {comment.avatar}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-baseline gap-2">
                                    <span className="text-sm font-medium text-gray-300 truncate">
                                        {comment.name}
                                    </span>
                                    {comment.isAI && (
                                        <span className="text-[10px] bg-blue-500/20 text-blue-400 px-1 rounded">
                                            AI
                                        </span>
                                    )}
                                </div>
                                <p className="text-sm text-white break-words leading-relaxed">
                                    {comment.message}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
                <div ref={chatEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSubmit} className="p-4 bg-gray-900 border-t border-gray-800">
                <div className="relative">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Say something..."
                        className="w-full bg-gray-800 text-white rounded-full pl-4 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500 text-sm"
                    />
                    <button
                        type="submit"
                        disabled={!newMessage.trim()}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1.5 bg-blue-600 text-white rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition"
                    >
                        <Send size={16} />
                    </button>
                </div>
            </form>
        </div>
    );
}

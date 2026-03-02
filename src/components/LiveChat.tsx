'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Send } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { createClient } from '@supabase/supabase-js';

interface Comment {
    id: string;
    name: string;
    message: string;
    timestamp: Date;
    avatar: string;
    color: string;
    isCommunityMember?: boolean;
}

type GeneratedComment = {
    name: string;
    message: string;
};

interface LiveChatProps {
    topic?: string;
    bookTitle?: string;
    transcript?: string;
    onNewComment?: (comment: Comment) => void;
    userName?: string;
    isHost?: boolean;
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

export default function LiveChat({ topic, bookTitle, transcript, onNewComment, userName = 'Guest', isHost = false }: LiveChatProps) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [viewerCount, setViewerCount] = useState(0);
    const [targetViewerCount] = useState(150 + Math.floor(Math.random() * 50));
    const chatEndRef = useRef<HTMLDivElement>(null);
    const lastTranscriptRef = useRef<string>('');
    const autoGenerateTriggeredRef = useRef<boolean>(false);
    const commentBatchCountRef = useRef<number>(0);

    // Generate loyal comments (memoized to avoid re-declarations)
    const generateLoyalComments = useCallback(async (userMessage: string = '', isAutomatic: boolean = false) => {
        try {
            const response = await fetch('/api/generate-comments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    topic: topic || 'General Discussion',
                    bookTitle: bookTitle || 'Unknown Book',
                    authorMessage: userMessage || (isAutomatic ? 'Welcome to the book club! Excited to see readers joining.' : ''),
                    transcript: transcript || '',
                    recentComments: comments.slice(-10).map(c => ({ name: c.name, message: c.message }))
                }),
            });

            if (!response.ok) return;

            const data = await response.json();
            const newComments: GeneratedComment[] = Array.isArray(data.comments) ? data.comments : [];

            // Add comments with staggered delay
            newComments.forEach((comment, index) => {
                setTimeout(() => {
                    const loyalComment: Comment = {
                        id: Math.random().toString(36).substr(2, 9),
                        name: comment.name,
                        message: comment.message,
                        timestamp: new Date(),
                        avatar: comment.name.charAt(0).toUpperCase(),
                        color: AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)],
                        isCommunityMember: true,
                    };
                    setComments((prev) => [...prev, loyalComment]);
                    if (onNewComment) onNewComment(loyalComment);
                }, (index + 1) * (Math.random() * 2000 + 500)); // 0.5s to 2.5s delay per comment
            });

        } catch (error) {
            console.error('Failed to generate comments:', error);
        }
    }, [topic, bookTitle, transcript, onNewComment]);

    // Auto-scroll to bottom
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [comments]);

    // Auto-generate comments after 2-3 mins of joining (Host only)
    useEffect(() => {
        if (!isHost || autoGenerateTriggeredRef.current) return;

        const timer = setTimeout(() => {
            autoGenerateTriggeredRef.current = true;
            generateLoyalComments('', true);
        }, 2000 + Math.random() * 60000); // 2-3 mins random delay

        return () => clearTimeout(timer);
    }, [generateLoyalComments, isHost]);

    // Gradual Viewer Growth logic (0 to target over 5-10 mins)
    useEffect(() => {
        if (!isHost) return; // Only host sets viewer count naturally for now (or sync it later)
        const rampDuration = (5 + Math.random() * 5) * 60 * 1000; // 5-10 mins in ms
        const rampInterval = 2000; // Update every 2s
        const totalSteps = rampDuration / rampInterval;
        const incrementPerStep = targetViewerCount / totalSteps;

        const interval = setInterval(() => {
            setViewerCount((prev) => {
                if (prev >= targetViewerCount) {
                    // Small fluctuation after reaching target
                    const change = Math.floor(Math.random() * 5) - 2;
                    return Math.max(targetViewerCount - 10, prev + change);
                }
                return Math.min(targetViewerCount, prev + (incrementPerStep * (Math.random() * 1.5)));
            });
        }, rampInterval);

        return () => clearInterval(interval);
    }, [targetViewerCount]);

    // Participation Management (Maintain ~1/3 participation ratio)
    useEffect(() => {
        if (!isHost) return;
        // We want total comments to be roughly 1/3 of view count
        const targetCommentTotal = Math.floor(viewerCount / 3);

        if (comments.length < targetCommentTotal && viewerCount > 10) {
            // Check if we should trigger more comments (throttled)
            const gap = targetCommentTotal - comments.length;
            if (gap > 2 && !autoGenerateTriggeredRef.current) {
                generateLoyalComments('', true);
            }
        }
    }, [viewerCount, comments.length, generateLoyalComments]);

    // Spike viewers locally (optional, but keep it subtle)
    const spikeViewers = () => {
        setViewerCount((prev) => prev + Math.floor(Math.random() * 5) + 1);
    };

    // Handle Transcript Updates
    useEffect(() => {
        if (!isHost) return;
        if (transcript && transcript !== lastTranscriptRef.current) {
            lastTranscriptRef.current = transcript;

            // Only trigger if we definitely need more participation
            if (comments.length < Math.floor(viewerCount / 3)) {
                generateLoyalComments('', true);
            }
        }
    }, [transcript, viewerCount, comments.length, generateLoyalComments, isHost]);

    // Set up Realtime Sync for Actual Messages using Supabase
    useEffect(() => {
        if (!topic) return;

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

        if (!supabaseUrl || !supabaseKey) return;

        const supabase = createClient(supabaseUrl, supabaseKey);

        const channel = supabase.channel(`live_chat_${topic}`)
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'live_chat_messages',
                filter: `room_name=eq.${topic}`
            }, (payload) => {
                const newMsg = payload.new as any;
                // Avoid duplicating our own message if we sent it
                if (newMsg.name !== userName) {
                    const incomingComment: Comment = {
                        id: newMsg.id || Math.random().toString(36).substr(2, 9),
                        name: newMsg.name,
                        message: newMsg.message,
                        timestamp: new Date(newMsg.created_at || Date.now()),
                        avatar: newMsg.name.charAt(0).toUpperCase(),
                        color: newMsg.role === 'author' ? 'bg-red-500' : 'bg-indigo-500',
                        isCommunityMember: false,
                    };
                    setComments((prev) => [...prev, incomingComment]);
                    if (onNewComment) onNewComment(incomingComment);
                }
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [topic, userName, onNewComment]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        const userComment: Comment = {
            id: Math.random().toString(36).substr(2, 9),
            name: `${userName} ${isHost ? '(Host)' : ''}`,
            message: newMessage,
            timestamp: new Date(),
            avatar: userName.charAt(0).toUpperCase(),
            color: isHost ? 'bg-red-600' : 'bg-indigo-600',
            isCommunityMember: false,
        };

        setComments((prev) => [...prev, userComment]);
        if (onNewComment) onNewComment(userComment);

        const messageToSend = newMessage;
        setNewMessage('');

        if (isHost) {
            // Spike viewers on author interaction
            spikeViewers();
            // Generate loyal response
            await generateLoyalComments(messageToSend);
        }

        // Save real message to database asynchronously
        fetch('/api/chat/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                roomName: topic,
                name: userName,
                message: messageToSend,
                isHost: isHost
            }),
        }).catch(err => console.error('Failed to sync chat message:', err));
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

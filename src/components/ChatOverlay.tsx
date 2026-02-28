import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

interface Comment {
    id: string;
    name: string;
    message: string;
    avatar: string;
}

interface ChatOverlayProps {
    latestComment?: Comment;
}

export default function ChatOverlay({ latestComment }: ChatOverlayProps) {
    const [visibleComments, setVisibleComments] = useState<Comment[]>([]);

    useEffect(() => {
        if (latestComment) {
            setVisibleComments((prev) => {
                // Keep only last 4 messages to avoid clutter
                const updated = [...prev, latestComment].slice(-4);
                return updated;
            });

            // Auto-remove comment after 5 seconds
            const timer = setTimeout(() => {
                setVisibleComments((prev) => prev.filter((c) => c.id !== latestComment.id));
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [latestComment]);

    return (
        <div className="absolute bottom-24 right-4 z-20 flex flex-col items-end gap-2 pointer-events-none max-w-[300px] w-full">
            <AnimatePresence>
                {visibleComments.map((comment) => (
                    <motion.div
                        key={comment.id}
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                        className="bg-black/60 backdrop-blur-md text-white px-4 py-2 rounded-2xl rounded-tr-none shadow-lg border border-white/10 flex items-start gap-3 pointer-events-auto"
                    >
                        <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${comment.avatar}`}
                        >
                            {comment.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-gray-300 mb-0.5">{comment.name}</p>
                            <p className="text-sm leading-snug break-words">{comment.message}</p>
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
}

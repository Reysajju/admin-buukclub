import React, { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

// Reaction types matching Facebook style
type ReactionType = 'like' | 'love' | 'care' | 'haha' | 'wow' | 'sad' | 'angry';

interface Reaction {
    id: string;
    type: ReactionType;
    x: number; // Random horizontal position
    timestamp: number;
}

const REACTION_ICONS: Record<ReactionType, string> = {
    like: '👍',
    love: '❤️',
    care: '🥰',
    haha: '😆',
    wow: '😮',
    sad: '😢',
    angry: '😡',
};

export default function ReactionOverlay() {
    const [reactions, setReactions] = useState<Reaction[]>([]);

    // Add a new reaction
    const addReaction = useCallback((type: ReactionType) => {
        const newReaction: Reaction = {
            id: Math.random().toString(36).substr(2, 9),
            type,
            x: Math.random() * 80 + 10, // Random position between 10% and 90%
            timestamp: Date.now(),
        };

        setReactions((prev) => [...prev, newReaction]);

        // Cleanup after animation
        setTimeout(() => {
            setReactions((prev) => prev.filter((r) => r.id !== newReaction.id));
        }, 2000);
    }, []);

    // Simulate audience reactions
    useEffect(() => {
        const interval = setInterval(() => {
            if (Math.random() > 0.6) { // 40% chance per tick
                const types: ReactionType[] = ['like', 'love', 'haha', 'wow'];
                const randomType = types[Math.floor(Math.random() * types.length)];
                addReaction(randomType);
            }
        }, 600); // Check every 600ms

        return () => clearInterval(interval);
    }, [addReaction]);

    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
            {/* Floating Emojis */}
            <AnimatePresence>
                {reactions.map((reaction) => (
                    <motion.div
                        key={reaction.id}
                        initial={{ opacity: 0, y: 100, scale: 0.5 }}
                        animate={{ opacity: 1, y: -300, scale: 1.5 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 2, ease: "easeOut" }}
                        className="absolute text-4xl"
                        style={{ left: `${reaction.x}%`, bottom: '100px' }}
                    >
                        {REACTION_ICONS[reaction.type]}
                    </motion.div>
                ))}
            </AnimatePresence>

            {/* Reaction Bar (Mobile Friendly) */}
            <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 flex gap-2 bg-black/40 backdrop-blur-md p-2 rounded-full pointer-events-auto">
                {(Object.keys(REACTION_ICONS) as ReactionType[]).map((type) => (
                    <button
                        key={type}
                        onClick={() => addReaction(type)}
                        className="text-2xl hover:scale-125 transition active:scale-95 p-2"
                    >
                        {REACTION_ICONS[type]}
                    </button>
                ))}
            </div>
        </div>
    );
}

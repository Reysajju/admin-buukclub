'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { CheckCircle2, Send, Star, X } from 'lucide-react';

interface AuthorSessionSurveyProps {
    isOpen: boolean;
    onClose: () => void;
    sessionName?: string;
    authorName?: string;
}

const ENGAGEMENT_LEVELS = [
    { value: 'electric', label: 'Electric – chat never stopped' },
    { value: 'steady', label: 'Steady – thoughtful participation' },
    { value: 'quiet', label: 'Quiet – needed more prompts' },
    { value: 'technical', label: 'Technical hiccups slowed us down' },
];

export default function AuthorSessionSurvey({ isOpen, onClose, sessionName, authorName }: AuthorSessionSurveyProps) {
    const [step, setStep] = useState<'form' | 'submitted'>('form');
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [highlight, setHighlight] = useState('');
    const [challenge, setChallenge] = useState('');
    const [engagementLevel, setEngagementLevel] = useState('electric');
    const [conversions, setConversions] = useState('');
    const [supportNeeds, setSupportNeeds] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const resetAndClose = () => {
        setStep('form');
        setRating(0);
        setHoverRating(0);
        setHighlight('');
        setChallenge('');
        setEngagementLevel('electric');
        setConversions('');
        setSupportNeeds('');
        onClose();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await fetch('/api/submit-feedback', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    role: 'author',
                    sessionName,
                    authorName,
                    rating,
                    highlight,
                    challenge,
                    engagementLevel,
                    conversions,
                    supportNeeds,
                }),
            });

            if (response.ok) {
                setStep('submitted');
                setTimeout(() => {
                    resetAndClose();
                }, 3000);
            }
        } catch (error) {
            console.error('Failed to submit author survey:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                onClick={(e) => {
                    if (e.target === e.currentTarget) resetAndClose();
                }}
            >
                <motion.div
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 20 }}
                    className="bg-card border border-border rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                >
                    {step === 'form' ? (
                        <form onSubmit={handleSubmit} className="p-8 space-y-6">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-sm uppercase tracking-[0.2em] text-primary/80">Session recap</p>
                                    <h2 className="text-3xl font-bold mb-2">How did it feel?</h2>
                                    <p className="text-muted-foreground">
                                        Your answers help us improve every guaranteed campaign.
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={resetAndClose}
                                    className="text-muted-foreground hover:text-foreground transition p-1"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <div>
                                <label className="text-lg font-semibold block mb-4">
                                    Overall session energy
                                </label>
                                <div className="flex gap-2 justify-center py-4 flex-wrap">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setRating(star)}
                                            onMouseEnter={() => setHoverRating(star)}
                                            onMouseLeave={() => setHoverRating(0)}
                                            className="transition-transform hover:scale-110"
                                            aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                                        >
                                            <Star
                                                size={40}
                                                className={
                                                    star <= (hoverRating || rating)
                                                        ? 'fill-yellow-400 text-yellow-400'
                                                        : 'text-muted-foreground'
                                                }
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="grid gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold">
                                        What moment felt like pure magic?
                                    </label>
                                    <textarea
                                        value={highlight}
                                        onChange={(e) => setHighlight(e.target.value)}
                                        placeholder="The chat exploded when..."
                                        className="w-full min-h-[90px] p-4 bg-background border border-border rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-primary/20"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold">
                                        What would you tweak for next time?
                                    </label>
                                    <textarea
                                        value={challenge}
                                        onChange={(e) => setChallenge(e.target.value)}
                                        placeholder="Next time I want to test..."
                                        className="w-full min-h-[90px] p-4 bg-background border border-border rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-primary/20"
                                        required
                                    />
                                </div>

                                <div className="space-y-3">
                                    <label className="text-sm font-semibold">
                                        Reader engagement check
                                    </label>
                                    <div className="grid md:grid-cols-2 gap-2">
                                        {ENGAGEMENT_LEVELS.map((item) => (
                                            <button
                                                type="button"
                                                key={item.value}
                                                onClick={() => setEngagementLevel(item.value)}
                                                className={`px-4 py-3 rounded-xl border text-left transition ${
                                                    engagementLevel === item.value
                                                        ? 'bg-primary text-primary-foreground border-primary'
                                                        : 'bg-muted/40 border-border hover:border-primary/60'
                                                }`}
                                            >
                                                <p className="text-sm font-medium">{item.label}</p>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold">
                                        Wins to celebrate (emails, sales, consults)
                                    </label>
                                    <Input
                                        value={conversions}
                                        onChange={(e) => setConversions(e.target.value)}
                                        placeholder="e.g., 42 new emails, 3 hardcover sales"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold">
                                        Where do you want extra support from the BuukClub team?
                                    </label>
                                    <textarea
                                        value={supportNeeds}
                                        onChange={(e) => setSupportNeeds(e.target.value)}
                                        placeholder="Promo assets, follow-up emails, tech check..."
                                        className="w-full min-h-[90px] p-4 bg-background border border-border rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-primary/20"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <Button type="button" variant="outline" className="flex-1" onClick={resetAndClose}>
                                    Skip for now
                                </Button>
                                <Button type="submit" className="flex-1 gap-2" disabled={isSubmitting || rating === 0}>
                                    {isSubmitting ? 'Saving...' : (<><Send size={18} /> Submit reflections</>)}
                                </Button>
                            </div>
                        </form>
                    ) : (
                        <div className="p-12 text-center space-y-6">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: 'spring', duration: 0.6 }}
                            >
                                <CheckCircle2 className="mx-auto text-green-500" size={80} />
                            </motion.div>
                            <div>
                                <h2 className="text-3xl font-bold mb-2">Thanks for sharing! ✨</h2>
                                <p className="text-muted-foreground text-lg">
                                    We&apos;ll use your notes to dial in the next guaranteed session.
                                </p>
                            </div>
                            <p className="text-sm text-muted-foreground">This window will close automatically…</p>
                        </div>
                    )}
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}

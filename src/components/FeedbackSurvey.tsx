'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, Send, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface FeedbackSurveyProps {
    isOpen: boolean;
    onClose: () => void;
    bookTitle?: string;
    authorName?: string;
}

const GENRES = [
    'Fiction', 'Non-Fiction', 'Mystery', 'Thriller', 'Romance',
    'Sci-Fi', 'Fantasy', 'Biography', 'Self-Help', 'History'
];

export default function FeedbackSurvey({ isOpen, onClose, bookTitle, authorName }: FeedbackSurveyProps) {
    const [step, setStep] = useState<'survey' | 'submitted'>('survey');
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [feedback, setFeedback] = useState('');
    const [email, setEmail] = useState('');
    const [optIn, setOptIn] = useState(true);
    const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await fetch('/api/submit-feedback', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    bookTitle,
                    authorName,
                    rating,
                    feedback,
                    email: optIn ? email : null,
                    optedIn: optIn,
                    genres: selectedGenres,
                }),
            });

            if (response.ok) {
                setStep('submitted');
                setTimeout(() => {
                    onClose();
                }, 3000);
            }
        } catch (error) {
            console.error('Failed to submit feedback:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const toggleGenre = (genre: string) => {
        setSelectedGenres(prev =>
            prev.includes(genre)
                ? prev.filter(g => g !== genre)
                : [...prev, genre]
        );
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                onClick={(e) => {
                    if (e.target === e.currentTarget) onClose();
                }}
            >
                <motion.div
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 20 }}
                    className="bg-card border border-border rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                >
                    {step === 'survey' ? (
                        <form onSubmit={handleSubmit} className="p-8 space-y-6">
                            {/* Header */}
                            <div className="flex items-start justify-between">
                                <div>
                                    <h2 className="text-3xl font-bold mb-2">Thanks for attending! 📚</h2>
                                    <p className="text-muted-foreground">
                                        Help {authorName || 'the author'} improve and stay connected
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="text-muted-foreground hover:text-foreground transition p-1"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            {/* Rating */}
                            <div className="space-y-3">
                                <label className="text-lg font-semibold block">
                                    How would you rate this book club session?
                                </label>
                                <div className="flex gap-2 justify-center py-4">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setRating(star)}
                                            onMouseEnter={() => setHoverRating(star)}
                                            onMouseLeave={() => setHoverRating(0)}
                                            className="transition-transform hover:scale-110"
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

                            {/* Feedback */}
                            <div className="space-y-3">
                                <label htmlFor="feedback" className="text-lg font-semibold block">
                                    What did you enjoy most? (Optional)
                                </label>
                                <textarea
                                    id="feedback"
                                    value={feedback}
                                    onChange={(e) => setFeedback(e.target.value)}
                                    placeholder="Share your thoughts, favorite moments, or suggestions..."
                                    className="w-full min-h-[100px] p-4 bg-background border border-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>

                            {/* Genres */}
                            <div className="space-y-3">
                                <label className="text-lg font-semibold block">
                                    What genres do you enjoy? (Optional)
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {GENRES.map((genre) => (
                                        <button
                                            key={genre}
                                            type="button"
                                            onClick={() => toggleGenre(genre)}
                                            className={`px-4 py-2 rounded-full text-sm font-medium transition ${selectedGenres.includes(genre)
                                                    ? 'bg-primary text-primary-foreground'
                                                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                                                }`}
                                        >
                                            {genre}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Email Opt-in */}
                            <div className="space-y-4 pt-4 border-t border-border">
                                <div className="bg-primary/10 border border-primary/30 rounded-lg p-4">
                                    <label className="flex items-start gap-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={optIn}
                                            onChange={(e) => setOptIn(e.target.checked)}
                                            className="mt-1 w-5 h-5 rounded border-primary text-primary focus:ring-primary"
                                        />
                                        <div className="flex-1">
                                            <span className="font-semibold block mb-1">
                                                📧 Become a Loyal Fan
                                            </span>
                                            <p className="text-sm text-muted-foreground">
                                                Get notified about {authorName || "this author's"} new releases, exclusive content, and upcoming events. You can unsubscribe anytime.
                                            </p>
                                        </div>
                                    </label>
                                </div>

                                {optIn && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                    >
                                        <Input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="your.email@example.com"
                                            required={optIn}
                                            className="w-full"
                                        />
                                    </motion.div>
                                )}
                            </div>

                            {/* Submit Buttons */}
                            <div className="flex gap-3 pt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={onClose}
                                    className="flex-1"
                                >
                                    Skip for Now
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isSubmitting || rating === 0}
                                    className="flex-1 gap-2"
                                >
                                    {isSubmitting ? (
                                        'Submitting...'
                                    ) : (
                                        <>
                                            <Send size={18} />
                                            Submit Feedback
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>
                    ) : (
                        // Success State
                        <div className="p-12 text-center space-y-6">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: 'spring', duration: 0.6 }}
                            >
                                <CheckCircle2 className="mx-auto text-green-500" size={80} />
                            </motion.div>
                            <div>
                                <h2 className="text-3xl font-bold mb-2">Thank You! 🎉</h2>
                                <p className="text-muted-foreground text-lg">
                                    {optIn
                                        ? `Welcome to the loyal fans community! Check your email for a confirmation.`
                                        : `Your feedback has been submitted successfully.`}
                                </p>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                This window will close automatically...
                            </p>
                        </div>
                    )}
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}

import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TranscriptionManagerProps {
    onTranscriptUpdate: (text: string) => void;
    isListening: boolean;
}

export default function TranscriptionManager({ onTranscriptUpdate, isListening }: TranscriptionManagerProps) {
    const [liveCaption, setLiveCaption] = useState('');
    const recognitionRef = useRef<any>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (!('webkitSpeechRecognition' in window)) {
            console.warn('Web Speech API not supported in this browser.');
            return;
        }

        // Initialize Speech Recognition
        const SpeechRecognition = (window as any).webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event: any) => {
            let interimTranscript = '';
            let finalTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    finalTranscript += event.results[i][0].transcript;
                } else {
                    interimTranscript += event.results[i][0].transcript;
                }
            }

            // Update visual caption
            const currentText = finalTranscript || interimTranscript;
            if (currentText) {
                setLiveCaption(currentText);

                // Debounce updates to the AI context
                if (timeoutRef.current) clearTimeout(timeoutRef.current);
                timeoutRef.current = setTimeout(() => {
                    if (finalTranscript) {
                        onTranscriptUpdate(finalTranscript);
                    } else if (interimTranscript.length > 10) {
                        // If it's a long interim segment, send it anyway
                        onTranscriptUpdate(interimTranscript);
                    }
                }, 1500); // Wait 1.5s silence/completion before sending to AI
            }
        };

        recognition.onerror = (event: any) => {
            if (event.error === 'aborted' || event.error === 'no-speech') {
                // Ignore these common, non-critical errors
                return;
            }
            console.error('Speech recognition error', event.error);
        };

        recognition.onend = () => {
            // Auto-restart if it stops unexpectedly while supposed to be listening
            if (isListening) {
                try {
                    recognition.start();
                } catch (e) {
                    // Ignore errors if already started
                }
            }
        };

        recognitionRef.current = recognition;

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, []);

    // Toggle listening based on prop
    useEffect(() => {
        const recognition = recognitionRef.current;
        if (!recognition) return;

        if (isListening) {
            try {
                recognition.start();
            } catch (e) {
                // Already started
            }
        } else {
            recognition.stop();
            setLiveCaption('');
        }
    }, [isListening]);

    return (
        <div className="absolute top-8 left-0 right-0 z-30 pointer-events-none flex justify-center px-4">
            <AnimatePresence>
                {liveCaption && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="bg-black/60 backdrop-blur-sm text-white px-6 py-3 rounded-xl text-lg font-medium text-center max-w-2xl shadow-lg"
                    >
                        {liveCaption}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

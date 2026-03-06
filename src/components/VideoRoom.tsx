'use client';

import { useState, useEffect } from 'react';
import {
    LiveKitRoom,
    VideoConference,
    RoomAudioRenderer,
    useRemoteParticipants,
} from '@livekit/components-react';
import '@livekit/components-styles';
import TranscriptionManager from './TranscriptionManager';
import DocumentViewer from './DocumentViewer';
import { Eye, FileText, Video } from 'lucide-react';

interface VideoRoomProps {
    roomName: string;
    onDisconnect: () => void;
    onTranscriptUpdate?: (text: string) => void;
    isPublisher?: boolean;
    manuscriptUrl?: string;
    manuscriptName?: string;
    viewerCount?: number;
}

// Helper component to explicitly monitor whether an author (publisher) is in the room
function SessionMonitor({ isPublisher, onDisconnect }: { isPublisher: boolean, onDisconnect: () => void }) {
    const participants = useRemoteParticipants();
    const [hasSeenPublisher, setHasSeenPublisher] = useState(false);

    useEffect(() => {
        if (isPublisher) return; // Authors don't need to monitor other publishers for session survival

        // A participant with canPublish is the author/host
        const hasPublisherNow = participants.some(p => p.permissions?.canPublish);

        if (hasPublisherNow) {
            setHasSeenPublisher(true);
        } else if (hasSeenPublisher) {
            // Publisher was here but left -> Collapse session for readers
            onDisconnect();
        }
    }, [participants, isPublisher, hasSeenPublisher, onDisconnect]);

    if (isPublisher) return null;

    const hasPublisherNow = participants.some(p => p.permissions?.canPublish);

    if (!hasPublisherNow && !hasSeenPublisher) {
        return (
            <div className="absolute inset-0 z-50 bg-gray-900/95 flex flex-col items-center justify-center text-white backdrop-blur px-4 text-center">
                <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-6"></div>
                <h3 className="text-2xl font-bold mb-2">Waiting for the Author</h3>
                <p className="text-gray-400">The session will begin as soon as the author starts the meeting.</p>
            </div>
        );
    }

    return null;
}

export default function VideoRoom({
    roomName,
    onDisconnect,
    onTranscriptUpdate,
    isPublisher = true,
    manuscriptUrl,
    manuscriptName,
    viewerCount = 0,
}: VideoRoomProps) {
    const [token, setToken] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>('');
    const [isListening] = useState(true);
    // Reader view mode: 'author' = watch cam, 'document' = view PDF
    const [readerView, setReaderView] = useState<'author' | 'document'>('author');
    const livekitUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL;

    // Fetch token when component mounts
    useEffect(() => {
        let isMounted = true;

        async function fetchToken() {
            setLoading(true);
            setError('');
            setToken('');

            if (!livekitUrl) {
                setError('LiveKit server URL is not configured. Please set NEXT_PUBLIC_LIVEKIT_URL in your environment variables.');
                setLoading(false);
                return;
            }

            try {
                // Determine role based on isPublisher
                const role = isPublisher ? 'publisher' : 'subscriber';
                const response = await fetch(
                    `/api/live/get-test-token?roomName=${encodeURIComponent(roomName)}&role=${role}`
                );

                let data: { token?: string; error?: string } | null = null;
                try {
                    data = await response.json();
                } catch {
                    data = null;
                }

                if (!response.ok) {
                    let errorMsg = data?.error || 'Failed to get token';

                    if (errorMsg === 'Server misconfigured') {
                        errorMsg = 'LiveKit credentials are missing on the server. Please set LIVEKIT_API_KEY and LIVEKIT_API_SECRET.';
                    }
                    throw new Error(errorMsg);
                }

                if (!data?.token) {
                    throw new Error('Server did not return a valid token.');
                }

                if (!isMounted) return;

                setToken(data.token);
            } catch (err) {
                if (!isMounted) return;
                const errorMessage = err instanceof Error ? err.message : 'Unable to connect to the video server. Please try again.';
                setError(errorMessage);
            } finally {
                if (!isMounted) return;
                setLoading(false);
            }
        }

        fetchToken();

        return () => {
            isMounted = false;
        };
    }, [roomName, isPublisher, livekitUrl]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Connecting to room...</p>
                </div>
            </div>
        );
    }

    if (error || !livekitUrl) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center max-w-md">
                    <div className="text-red-600 text-5xl mb-4">⚠️</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Connection Error</h3>
                    <p className="text-gray-600 mb-4">{error || 'LiveKit server URL is not configured.'}</p>
                    <button
                        onClick={onDisconnect}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <LiveKitRoom
            video={isPublisher}
            audio={isPublisher}
            token={token}
            serverUrl={livekitUrl}
            data-lk-theme="default"
            style={{ width: '100%', height: '100%', position: 'relative', backgroundColor: 'black' }}
            onDisconnected={onDisconnect}
        >
            {/* ========== AUTHOR VIEW (Publisher) ========== */}
            {isPublisher && (
                <>
                    <VideoConference />
                    <RoomAudioRenderer />

                    {/* Viewer count badge — author only sees count, never names */}
                    <div className="absolute bottom-4 left-4 z-20 flex items-center gap-2 bg-black/60 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-sm">
                        <Eye size={14} className="text-red-400" />
                        <span className="font-medium">{viewerCount.toLocaleString()}</span>
                        <span className="text-gray-400 text-xs">watching</span>
                    </div>

                    {/* Transcription for context-aware comments */}
                    {onTranscriptUpdate && (
                        <TranscriptionManager
                            onTranscriptUpdate={onTranscriptUpdate}
                            isListening={isListening}
                        />
                    )}
                </>
            )}

            {/* ========== READER VIEW (Subscriber) ========== */}
            {!isPublisher && (
                <>
                    <RoomAudioRenderer />
                    <SessionMonitor isPublisher={false} onDisconnect={onDisconnect} />

                    {/* Toggle buttons for reader: Author cam vs Document */}
                    {manuscriptUrl && (
                        <div className="absolute top-14 md:top-4 left-1/2 -translate-x-1/2 z-30 flex bg-gray-900/80 backdrop-blur-md rounded-full p-1 border border-gray-700/50">
                            <button
                                onClick={() => setReaderView('author')}
                                className={`flex items-center gap-1.5 px-3 md:px-4 py-1.5 rounded-full text-xs md:text-sm font-medium transition-all ${readerView === 'author'
                                        ? 'bg-blue-600 text-white shadow-lg'
                                        : 'text-gray-400 hover:text-white'
                                    }`}
                            >
                                <Video size={14} />
                                Author
                            </button>
                            <button
                                onClick={() => setReaderView('document')}
                                className={`flex items-center gap-1.5 px-3 md:px-4 py-1.5 rounded-full text-xs md:text-sm font-medium transition-all ${readerView === 'document'
                                        ? 'bg-blue-600 text-white shadow-lg'
                                        : 'text-gray-400 hover:text-white'
                                    }`}
                            >
                                <FileText size={14} />
                                Document
                            </button>
                        </div>
                    )}

                    {/* Show author video or document based on reader choice */}
                    {readerView === 'author' || !manuscriptUrl ? (
                        <VideoConference />
                    ) : (
                        <DocumentViewer
                            fileUrl={manuscriptUrl}
                            fileName={manuscriptName}
                        />
                    )}
                </>
            )}
        </LiveKitRoom>
    );
}

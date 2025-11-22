'use client';

import { useState, useEffect } from 'react';
import {
    LiveKitRoom,
    VideoConference,
    RoomAudioRenderer,
} from '@livekit/components-react';
import '@livekit/components-styles';

import ReactionOverlay from './ReactionOverlay';
import TranscriptionManager from './TranscriptionManager';
import ChatOverlay from './ChatOverlay';

interface Comment {
    id: string;
    name: string;
    message: string;
    avatar: string;
}

interface VideoRoomProps {
    roomName: string;
    onDisconnect: () => void;
    onTranscriptUpdate?: (text: string) => void;
    latestComment?: Comment | null;
    isPublisher?: boolean; // New prop to distinguish Host vs Reader
}

export default function VideoRoom({
    roomName,
    onDisconnect,
    onTranscriptUpdate,
    latestComment,
    isPublisher = true
}: VideoRoomProps) {
    const [token, setToken] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>('');
    const [isListening] = useState(true);
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

                    // Provide more helpful error messages
                    if (errorMsg === 'Server misconfigured') {
                        errorMsg = 'LiveKit credentials are missing on the server. Please set LIVEKIT_API_KEY and LIVEKIT_API_SECRET.';
                    }
                    throw new Error(errorMsg);
                }

                if (!data?.token) {
                    throw new Error('Server did not return a valid token.');
                }

                if (!isMounted) {
                    return;
                }

                setToken(data.token);
            } catch (err) {
                if (!isMounted) {
                    return;
                }

                const errorMessage = err instanceof Error ? err.message : 'Unable to connect to the video server. Please try again.';
                setError(errorMessage);
            } finally {
                if (!isMounted) {
                    return;
                }

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

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center max-w-md">
                    <div className="text-red-600 text-5xl mb-4">⚠️</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Connection Error</h3>
                    <p className="text-gray-600 mb-4">{error}</p>
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

    // This should never happen because we check above in useEffect, but TypeScript guard
    if (!livekitUrl) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center max-w-md">
                    <div className="text-red-600 text-5xl mb-4">⚠️</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Server Configuration Error</h3>
                    <p className="text-gray-600 mb-4">LiveKit server URL is not configured.</p>
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
        <div className="w-full h-full relative group bg-black">
            <LiveKitRoom
                video={isPublisher} // Only publish if publisher
                audio={isPublisher} // Only publish if publisher
                token={token}
                serverUrl={livekitUrl}
                data-lk-theme="default"
                style={{ height: '100%' }}
                onDisconnected={onDisconnect}
            >
                <VideoConference />
                <RoomAudioRenderer />
            </LiveKitRoom>

            {/* Overlays */}
            <ReactionOverlay />
            <ChatOverlay latestComment={latestComment ?? undefined} />

            {/* Transcription disabled by default unless prop provided */}
            {onTranscriptUpdate && (
                <TranscriptionManager
                    onTranscriptUpdate={onTranscriptUpdate}
                    isListening={isListening}
                />
            )}
        </div>
    );
}

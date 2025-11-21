'use client';
'use client';

import { useState, useEffect } from 'react';
import {
    LiveKitRoom,
    VideoConference,
    RoomAudioRenderer,
    useTracks,
} from '@livekit/components-react';
import '@livekit/components-styles';
import { Track } from 'livekit-client';

import ReactionOverlay from './ReactionOverlay';
import TranscriptionManager from './TranscriptionManager';
import ChatOverlay from './ChatOverlay';

interface VideoRoomProps {
    roomName: string;
    onDisconnect: () => void;
    onTranscriptUpdate?: (text: string) => void;
    latestComment?: any;
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
    const [isListening, setIsListening] = useState(true);

    // Fetch token when component mounts
    useEffect(() => {
        async function fetchToken() {
            try {
                // Determine role based on isPublisher
                const role = isPublisher ? 'publisher' : 'subscriber';
                const response = await fetch(
                    `/api/live/get-test-token?roomName=${encodeURIComponent(roomName)}&role=${role}`
                );

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Failed to get token');
                }

                const data = await response.json();
                setToken(data.token);
                setLoading(false);
            } catch (err: any) {
                setError(err.message);
                setLoading(false);
            }
        }

        fetchToken();
    }, [roomName, isPublisher]);

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

    return (
        <div className="w-full h-full relative group bg-black">
            <LiveKitRoom
                video={isPublisher} // Only publish if publisher
                audio={isPublisher} // Only publish if publisher
                token={token}
                serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
                data-lk-theme="default"
                style={{ height: '100%' }}
                onDisconnected={onDisconnect}
            >
                <VideoConference />
                <RoomAudioRenderer />
            </LiveKitRoom>

            {/* Overlays */}
            <ReactionOverlay />
            <ChatOverlay latestComment={latestComment} />

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

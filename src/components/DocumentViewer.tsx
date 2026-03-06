'use client';

import { useState } from 'react';
import { Maximize2, Minimize2, FileText } from 'lucide-react';

interface DocumentViewerProps {
    fileUrl: string;
    fileName?: string;
}

export default function DocumentViewer({ fileUrl, fileName }: DocumentViewerProps) {
    const [isFullscreen, setIsFullscreen] = useState(false);

    if (!fileUrl) {
        return (
            <div className="w-full h-full flex items-center justify-center bg-gray-900/95 text-gray-400">
                <div className="text-center">
                    <FileText className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium">No document shared yet</p>
                    <p className="text-sm text-gray-500 mt-1">The author hasn&apos;t uploaded a file for this session</p>
                </div>
            </div>
        );
    }

    return (
        <div className={`relative bg-gray-950 ${isFullscreen ? 'fixed inset-0 z-50' : 'w-full h-full'}`}>
            {/* Header bar */}
            <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-4 py-2 bg-gray-900/90 backdrop-blur border-b border-gray-800">
                <div className="flex items-center gap-2 text-gray-300 text-sm">
                    <FileText size={14} />
                    <span className="truncate max-w-[200px]">{fileName || 'Shared Document'}</span>
                </div>
                <button
                    onClick={() => setIsFullscreen(!isFullscreen)}
                    className="p-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 transition"
                    title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
                >
                    {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
                </button>
            </div>

            {/* PDF / Document embed — no download allowed */}
            <iframe
                src={`${fileUrl}#toolbar=0&navpanes=0&scrollbar=1&view=FitH`}
                className="w-full h-full border-0 pt-10"
                title="Shared Document"
                sandbox="allow-same-origin allow-scripts"
                style={{ pointerEvents: 'auto' }}
            />

            {/* Block right-click downloads */}
            <div
                className="absolute inset-0 pt-10"
                onContextMenu={(e) => e.preventDefault()}
                style={{ pointerEvents: 'none' }}
            />
        </div>
    );
}

'use client';

import { useEffect } from 'react';

export default function DevToolsProtection() {
    useEffect(() => {
        // Disable right-click
        const handleContextMenu = (e: MouseEvent) => {
            e.preventDefault();
            return false;
        };

        // Disable keyboard shortcuts for developer tools
        const handleKeyDown = (e: KeyboardEvent) => {
            // F12
            if (e.keyCode === 123) {
                e.preventDefault();
                return false;
            }

            // Ctrl+Shift+I (Inspect Element)
            if (e.ctrlKey && e.shiftKey && e.keyCode === 73) {
                e.preventDefault();
                return false;
            }

            // Ctrl+Shift+J (Console)
            if (e.ctrlKey && e.shiftKey && e.keyCode === 74) {
                e.preventDefault();
                return false;
            }

            // Ctrl+Shift+C (Inspect Element)
            if (e.ctrlKey && e.shiftKey && e.keyCode === 67) {
                e.preventDefault();
                return false;
            }

            // Ctrl+U (View Source)
            if (e.ctrlKey && e.keyCode === 85) {
                e.preventDefault();
                return false;
            }

            // Cmd+Option+I (Mac Inspect)
            if (e.metaKey && e.altKey && e.keyCode === 73) {
                e.preventDefault();
                return false;
            }

            // Cmd+Option+J (Mac Console)
            if (e.metaKey && e.altKey && e.keyCode === 74) {
                e.preventDefault();
                return false;
            }

            // Cmd+Option+C (Mac Inspect)
            if (e.metaKey && e.altKey && e.keyCode === 67) {
                e.preventDefault();
                return false;
            }
        };

        // Detect DevTools opening (by checking window size changes)
        let devToolsOpen = false;
        const detectDevTools = () => {
            const widthThreshold = window.outerWidth - window.innerWidth > 160;
            const heightThreshold = window.outerHeight - window.innerHeight > 160;

            if (widthThreshold || heightThreshold) {
                if (!devToolsOpen) {
                    devToolsOpen = true;
                    // Optional: Show warning or redirect
                    console.clear();
                    document.body.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100vh;font-family:sans-serif;background:#000;color:#fff;"><h1>⚠️ Developer tools are not allowed</h1></div>';
                }
            } else {
                devToolsOpen = false;
            }
        };

        // Disable console methods
        const disableConsole = () => {
            const noop = () => { };
            ['log', 'warn', 'error', 'info', 'debug', 'trace'].forEach((method) => {
                (console as any)[method] = noop;
            });
        };

        // Disable text selection (optional - can be annoying for users)
        const disableSelection = (e: Event) => {
            e.preventDefault();
            return false;
        };

        // Disable copy (optional)
        const disableCopy = (e: ClipboardEvent) => {
            e.preventDefault();
            return false;
        };

        // Add event listeners
        document.addEventListener('contextmenu', handleContextMenu);
        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('copy', disableCopy);

        // Start DevTools detection
        const interval = setInterval(detectDevTools, 500);

        // Disable console
        disableConsole();

        // Cleanup
        return () => {
            document.removeEventListener('contextmenu', handleContextMenu);
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('copy', disableCopy);
            clearInterval(interval);
        };
    }, []);

    return null; // This component doesn't render anything
}

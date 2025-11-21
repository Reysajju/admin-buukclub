import { AccessToken } from 'livekit-server-sdk'
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    const roomName = req.nextUrl.searchParams.get('roomName');
    const role = req.nextUrl.searchParams.get('role') || 'publisher'; // Default to publisher
    const participantName = `user-${Math.random().toString(36).slice(2, 7)}`;

    if (!roomName) {
        return NextResponse.json({ error: 'Missing roomName' }, { status: 400 });
    }

    const apiKey = process.env.LIVEKIT_API_KEY;
    const apiSecret = process.env.LIVEKIT_API_SECRET;

    if (!apiKey || !apiSecret) {
        return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 });
    }

    try {
        const at = new AccessToken(apiKey, apiSecret, {
            identity: participantName,
        });

        // Set permissions based on role
        at.addGrant({
            roomJoin: true,
            room: roomName,
            canPublish: role === 'publisher',
            canSubscribe: true,
        });

        return NextResponse.json({ token: await at.toJwt() });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to generate token' }, { status: 500 });
    }
}

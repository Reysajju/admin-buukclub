import { AccessToken } from 'livekit-server-sdk'
import { NextResponse } from 'next/server'

// Test-only endpoint for admin page - bypasses authentication
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const roomName = searchParams.get('roomName')
    const userName = searchParams.get('userName') || 'Test User'

    if (!roomName) {
        return NextResponse.json({ error: 'Missing roomName' }, { status: 400 })
    }

    // Generate a random identity for testing
    const identity = `test-user-${Math.random().toString(36).substring(7)}`

    const at = new AccessToken(
        process.env.LIVEKIT_API_KEY,
        process.env.LIVEKIT_API_SECRET,
        {
            identity: identity,
            name: userName,
        }
    )

    at.addGrant({
        roomJoin: true,
        room: roomName,
        canPublish: true, // Allow publishing for testing
        canSubscribe: true,
    })

    return NextResponse.json({ token: await at.toJwt() })
}

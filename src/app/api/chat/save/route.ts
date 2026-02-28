import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { roomName, name, message, isHost } = body;

        // Ensure we only store ACTUAL messages, not AI generated ones
        // The client only hits this endpoint for real user submissions
        if (!roomName || !message) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 });
        }

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        if (!supabaseUrl || !supabaseKey) {
            console.error("❌ Supabase credentials missing");
            return NextResponse.json({ error: "Server config error" }, { status: 500 });
        }

        const supabase = createClient(supabaseUrl, supabaseKey, {
            auth: { persistSession: false, autoRefreshToken: false }
        });

        const { error } = await supabase
            .from('live_chat_messages')
            .insert([{
                room_name: roomName,
                name: name || 'Guest',
                message: message,
                role: isHost ? 'author' : 'reader'
            }]);

        if (error) {
            // Note: If table doesn't exist, it will throw an error here.
            console.error("❌ Supabase Insert Error:", error.message);
            return NextResponse.json({ error: "Failed to save to database", details: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("💥 Internal Error API save-chat:", error.message);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

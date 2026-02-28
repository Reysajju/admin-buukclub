import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, email, phone, bookName, sessionCount, message } = body;

        if (!name || !email) {
            return NextResponse.json({ error: "Name and email are required" }, { status: 400 });
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
            .from('leads')
            .insert([{
                name,
                email,
                phone,
                book_name: bookName,
                session_count: parseInt(sessionCount) || 0,
                message: message || ""
            }]);

        if (error) {
            console.error("❌ Supabase Insert Error:", error.message);
            return NextResponse.json({ error: "Failed to save lead", details: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("💥 Internal Error API leads:", error.message);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

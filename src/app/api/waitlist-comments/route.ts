import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function POST(request: NextRequest) {
    try {
        // Check if Supabase is configured
        if (!supabaseUrl || !supabaseServiceKey) {
            return NextResponse.json(
                { error: 'Database not configured. Please set up Supabase environment variables.' },
                { status: 503 }
            );
        }

        const { name, role, quote } = await request.json();

        // Validation
        if (!name || !role || !quote) {
            return NextResponse.json(
                { error: 'Name, role, and quote are required' },
                { status: 400 }
            );
        }

        if (name.length > 50 || role.length > 100 || quote.length > 500) {
            return NextResponse.json(
                { error: 'Input exceeds maximum length' },
                { status: 400 }
            );
        }

        const supabase = createClient(supabaseUrl, supabaseServiceKey);

        const { data, error } = await supabase
            .from('waitlist_comments')
            .insert([
                {
                    name: name.trim(),
                    role: role.trim(),
                    quote: quote.trim(),
                    avatar: name.trim().charAt(0).toUpperCase(),
                    approved: false,
                }
            ])
            .select();

        if (error) {
            console.error('Supabase insert error:', error);
            return NextResponse.json(
                { error: 'Failed to submit comment. Database table may not exist.' },
                { status: 500 }
            );
        }

        return NextResponse.json(
            {
                message: 'Comment submitted successfully! It will appear after admin approval.',
                data
            },
            { status: 201 }
        );
    } catch (error) {
        console.error('API error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        // If Supabase not configured, return empty array (graceful degradation)
        if (!supabaseUrl || !supabaseServiceKey) {
            return NextResponse.json({ comments: [] });
        }

        const supabase = createClient(supabaseUrl, supabaseServiceKey);

        const { data, error } = await supabase
            .from('waitlist_comments')
            .select('*')
            .eq('approved', true)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Supabase fetch error:', error);
            // Return empty array instead of error for better UX
            return NextResponse.json({ comments: [] });
        }

        return NextResponse.json({ comments: data || [] });
    } catch (error) {
        console.error('API error:', error);
        return NextResponse.json({ comments: [] });
    }
}

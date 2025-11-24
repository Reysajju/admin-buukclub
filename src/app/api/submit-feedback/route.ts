import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const {
            role = 'reader',
            bookTitle,
            sessionName,
            authorName,
            rating,
            feedback,
            enjoymentLevel,
            wouldAttendAgain,
            email,
            optedIn,
            genres = [],
            highlight,
            challenge,
            engagementLevel,
            conversions,
            supportNeeds,
        } = body;

        if (!rating || rating < 1 || rating > 5) {
            return NextResponse.json(
                { error: 'Valid rating is required (1-5)' },
                { status: 400 },
            );
        }

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        if (!supabaseUrl || !supabaseKey) {
            console.error('Supabase credentials missing');
            return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
        }

        const supabase = createClient(supabaseUrl, supabaseKey, {
            auth: {
                persistSession: false,
                autoRefreshToken: false,
            },
        });

        const normalizedEmail = optedIn && email ? email : null;
        const payload = {
            ...body,
            email: normalizedEmail,
            genres,
        };

        const { error } = await supabase.from('session_feedback').insert([
            {
                role,
                session_name: sessionName || bookTitle || null,
                author_display_name: authorName || null,
                rating,
                feedback_text: feedback || null,
                enjoyment_level: enjoymentLevel || null,
                would_attend_again: wouldAttendAgain || null,
                email: normalizedEmail,
                opted_in: Boolean(optedIn && normalizedEmail),
                engagement_level: engagementLevel || null,
                highlight: highlight || null,
                challenge: challenge || null,
                wins: conversions || null,
                support_needs: supportNeeds || null,
                payload,
            },
        ]);

        if (error) {
            console.error('Supabase insert error:', error.message);
            return NextResponse.json({ error: 'Failed to save feedback' }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            message: 'Thank you for your feedback!',
        });
    } catch (error) {
        console.error('Error submitting feedback:', error);
        return NextResponse.json(
            { error: 'Failed to submit feedback' },
            { status: 500 },
        );
    }
}

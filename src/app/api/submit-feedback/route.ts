import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { bookTitle, authorName, rating, feedback, email, optedIn, genres } = body;

        // Validate required fields
        if (!rating || rating < 1 || rating > 5) {
            return NextResponse.json(
                { error: 'Valid rating is required (1-5)' },
                { status: 400 }
            );
        }

        // In a real app, you would:
        // 1. Store in database (Supabase/PostgreSQL)
        // 2. Send to email service (SendGrid/Mailchimp)
        // 3. Add to author's CRM/email list

        console.log('Feedback Submission:', {
            bookTitle,
            authorName,
            rating,
            feedback,
            email: optedIn ? email : '(not provided)',
            optedIn,
            genres,
            timestamp: new Date().toISOString(),
        });

        // TODO: Implement database storage
        // await supabase.from('feedback').insert({
        //     book_title: bookTitle,
        //     author_name: authorName,
        //     rating,
        //     feedback_text: feedback,
        //     user_email: optedIn ? email : null,
        //     opted_in: optedIn,
        //     genre_preferences: genres,
        // });

        // TODO: If opted in, add to email list
        // if (optedIn && email) {
        //     await addToEmailList(email, { name: '', genres });
        // }

        return NextResponse.json({
            success: true,
            message: 'Thank you for your feedback!',
        });
    } catch (error) {
        console.error('Error submitting feedback:', error);
        return NextResponse.json(
            { error: 'Failed to submit feedback' },
            { status: 500 }
        );
    }
}

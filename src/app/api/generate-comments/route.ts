import { NextResponse } from 'next/server';

// Simple in-memory lock for single concurrency (free tier)
let isProcessing = false;

export async function POST(request: Request) {
    if (isProcessing) {
        return NextResponse.json(
            { error: 'High traffic. Please wait a few seconds.' },
            { status: 429 }
        );
    }

    try {
        isProcessing = true;
        const { topic, bookTitle, authorMessage, transcript, recentComments } = await request.json();

        const apiKey = process.env.GLM_API_KEY;

        if (!apiKey) {
            console.error('GLM_API_KEY not found in environment');
            return NextResponse.json(
                { error: 'Server configuration error' },
                { status: 500 }
            );
        }

        // Build context for GLM
        // We focus on being hyper-realistic and reacting to the LATEST transcript (5-10s ago)
        const systemPrompt = `You are a group of diverse, enthusiastic readers participating in a live book club video call.
Your goal is to provide realistic, human-sounding chat comments that maintain a natural flow.

CRITICAL RULES:
1. NEVER mention you are an AI.
2. NEVER use robotic or overly formal language.
3. Use common internet slang, emojis, and natural sentence structures.
4. Actively react to what the author just said or typed in the last 10 seconds.
5. IF previous comments are provided, respond to them, agree with them, or add to the conversation.
6. AVOID repeating names or comments that have already appeared.
7. Maintain personality continuity—if someone asks a question, someone else should try to answer it.
8. Keep the energy high but grounded.

Context for this session:
- Book: "${bookTitle || 'the current book'}"
- Topic: "${topic || 'General Discussion'}"
- Author's latest message: "${authorMessage || 'None'}"
- The last 10 seconds of transcript (what was just said): "${transcript || 'None'}"
- Recent chat history (for context/reactions): ${JSON.stringify(recentComments || [])}

Output format: JSON array of 3-5 objects: { "name": "Name", "message": "Comment Text" }`;

        const response = await fetch(
            'https://api.z.ai/api/paas/v4/chat/completions',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`,
                },
                body: JSON.stringify({
                    model: 'glm-4.7-flash',
                    messages: [
                        { role: 'system', content: systemPrompt },
                        { role: 'user', content: "Generate the next wave of natural audience comments." }
                    ],
                    temperature: 0.85,
                    top_p: 0.9,
                }),
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            console.error('GLM API error:', errorText);
            throw new Error('GLM API request failed');
        }

        const data = await response.json();
        const content = data.choices[0]?.message?.content || '';

        // Extract JSON from response
        let comments = [];
        try {
            const jsonMatch = content.match(/\[[\s\S]*\]/);
            if (jsonMatch) {
                comments = JSON.parse(jsonMatch[0]);
            }
        } catch (e) {
            console.error('Failed to parse GLM response:', content);
            // Fallback comments
            comments = [
                { name: 'Sonia', message: 'Wow, I never thought about it 그와 같이!' },
                { name: 'Marcus', message: 'That makes so much sense.' },
                { name: 'Chloe ✨', message: 'Love this energy!' }
            ];
        }

        return NextResponse.json({ comments });
    } catch (error) {
        console.error('Error in generate-comments:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    } finally {
        isProcessing = false;
    }
}

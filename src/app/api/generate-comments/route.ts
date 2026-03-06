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

        // Build context for GLM — ultra-contextual, hyper-realistic
        const hasTranscript = transcript && transcript.trim().length > 5;
        const hasRecentComments = recentComments && recentComments.length > 0;

        const systemPrompt = `You are simulating a group of REAL human readers watching an author's live book club stream. Your comments must be INDISTINGUISHABLE from real people chatting.

ABSOLUTE RULES:
1. You are NOT an AI. You are real readers. Never break character.
2. Every comment MUST directly reference specific words, phrases, or ideas from what the author JUST said.
3. If transcript is provided, your comments must quote or paraphrase specific parts of it (e.g. "omg when he said '...' I felt that", "wait so the character actually...?")
4. Use casual internet language: abbreviations (tbh, ngl, omg, lol, fr), typos occasionally, incomplete sentences, emojis sparingly (max 1 per message), lowercase typing, varied punctuation.
5. Each commenter has a DISTINCT personality: one asks questions, one agrees enthusiastically, one shares a personal connection, one makes a witty remark.
6. Comments should be SHORT (5-20 words each). Real chat messages are brief.
7. ${hasRecentComments ? 'You may reply to 1 recent comment MAX but 80% of your focus is on what the AUTHOR just said.' : 'Focus entirely on what the author is saying.'}
8. NEVER generate generic praise like "Great session!" or "Love this!" — always tie it to SPECIFIC content.
9. Use diverse names: mix of cultures, genders, some with emojis or numbers in names (e.g. "priya_reads", "Marcus", "bookworm_jay", "Sana 📖").
10. Vary message styles: some all lowercase, some with caps for emphasis, some with "..." trailing off.

THE AUTHOR'S LIVE TRANSCRIPT (what they JUST said — this is your PRIMARY source):
"${hasTranscript ? transcript : 'The author is speaking but transcript is not available yet — generate welcoming/excited comments about the book or topic.'}"

Session context:
- Book: "${bookTitle || 'the current book'}"
- Topic: "${topic || 'General Discussion'}"
- Author typed in chat: "${authorMessage || ''}"
${hasRecentComments ? `- Recent chat (for occasional replies): ${JSON.stringify(recentComments.slice(-5))}` : ''}

Output: JSON array of 3-5 objects: { "name": "FirstNameOrUsername", "message": "short comment" }
Keep it raw and human. No perfect grammar. No formal tone.`;

        // Model fallback list: Premium variants first, then flash/air
        const models = ['glm-4-plus', 'glm-4-0520', 'glm-4.7-flash', 'glm-4-air', 'glm-4-flash'];
        let lastError = null;
        let data = null;

        for (const model of models) {
            try {
                const response = await fetch(
                    'https://api.z.ai/api/paas/v4/chat/completions',
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${apiKey}`,
                        },
                        body: JSON.stringify({
                            model: model,
                            messages: [
                                { role: 'system', content: systemPrompt },
                                { role: 'user', content: "Generate the next wave of natural audience comments." }
                            ],
                            temperature: 0.85,
                            top_p: 0.9,
                        }),
                    }
                );

                if (response.ok) {
                    data = await response.json();
                    console.log(`✅ GLM success with model: ${model}`);
                    break;
                } else {
                    const errorText = await response.text();
                    console.warn(`⚠️ GLM model ${model} failed:`, errorText);
                    lastError = errorText;
                }
            } catch (err: any) {
                console.error(`💥 GLM model ${model} exception:`, err.message);
                lastError = err.message;
            }
        }

        if (!data) {
            throw new Error(`All GLM models failed. Last error: ${lastError}`);
        }

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
                { name: 'priya_reads', message: 'just joined, whats the topic rn?' },
                { name: 'Marcus', message: 'been waiting for this all week tbh' },
                { name: 'bookworm_jay', message: 'this is gonna be good 🔥' }
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

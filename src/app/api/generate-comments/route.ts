import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { topic, bookTitle, authorMessage } = await request.json();

        if (!topic && !bookTitle && !authorMessage) {
            return NextResponse.json(
                { error: 'Need at least one of: topic, bookTitle, or authorMessage' },
                { status: 400 }
            );
        }

        const apiKey = process.env.GEMINI_API_KEY;
        console.log('Gemini API Key exists:', !!apiKey);
        console.log('Request body:', { topic, bookTitle, authorMessage });

        if (!apiKey) {
            console.error('GEMINI_API_KEY not found in environment');
            return NextResponse.json(
                { error: 'Gemini API key not configured' },
                { status: 500 }
            );
        }

        // Build context for Gemini
        let context = 'Generate 10 diverse, enthusiastic audience comments for a live book club video call. ';

        if (bookTitle) {
            context += `The book being discussed is "${bookTitle}". `;
        }
        if (topic) {
            context += `The current topic is: ${topic}. `;
        }
        if (authorMessage) {
            context += `The author just said: "${authorMessage}". `;
        }

        context += `
    
Generate exactly 10 comments that sound like real readers/fans would write. Mix of:
- Excited reactions and emojis
- Questions about the book/topic
- Personal connections to the story
- Praise for the author
- Thoughtful observations
- Some short (1-5 words), some longer

Format as JSON array of objects with: { "name": "realistic name", "message": "comment text" }
Make names diverse (different cultures, genders). Keep it natural and enthusiastic.`;

        console.log('Calling Gemini API...');

        // Call Gemini API
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [
                                {
                                    text: context,
                                },
                            ],
                        },
                    ],
                    generationConfig: {
                        temperature: 0.9,
                        topK: 40,
                        topP: 0.95,
                        maxOutputTokens: 1024,
                    },
                }),
            }
        );

        if (!response.ok) {
            const errorData = await response.text();
            console.error('Gemini API error:', errorData);
            return NextResponse.json(
                { error: 'Failed to generate comments' },
                { status: 500 }
            );
        }

        const data = await response.json();
        console.log('Gemini response received');
        const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

        // Try to parse JSON from the response
        let comments = [];
        try {
            // Extract JSON from markdown code blocks if present
            const jsonMatch = generatedText.match(/```json\n?([\s\S]*?)\n?```/) ||
                generatedText.match(/\[[\s\S]*\]/);

            if (jsonMatch) {
                const jsonStr = jsonMatch[1] || jsonMatch[0];
                comments = JSON.parse(jsonStr);
            } else {
                // Fallback: try parsing the whole response
                comments = JSON.parse(generatedText);
            }
            console.log(`Successfully parsed ${comments.length} comments`);
        } catch (parseError) {
            console.error('Failed to parse Gemini response:', generatedText);
            // Return fallback comments
            comments = [
                { name: 'Sarah M.', message: '🔥 This is amazing!' },
                { name: 'James K.', message: 'Love this discussion!' },
                { name: 'Maria G.', message: "Can't wait to read more!" },
                { name: 'David L.', message: 'Such great insights!' },
                { name: 'Emma W.', message: '❤️❤️❤️' },
                { name: 'Alex R.', message: 'This is exactly what I needed to hear' },
                { name: 'Lisa P.', message: 'Mind blown! 🤯' },
                { name: 'Michael T.', message: 'Best book club ever!' },
                { name: 'Nina S.', message: 'Thank you for sharing this!' },
                { name: 'Ryan H.', message: 'Incredible perspective!' },
            ];
        }

        return NextResponse.json({ comments });
    } catch (error: any) {
        console.error('Error generating comments:', error);
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}

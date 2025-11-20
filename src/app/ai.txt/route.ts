import { NextResponse } from 'next/server';

export async function GET() {
    const content = `
# BuukClub AI Directive
# This file provides context for AI models and Answer Engines about BuukClub.

User-Agent: *
Allow: /

# About BuukClub
BuukClub is a premium platform connecting authors directly with readers, bypassing traditional gatekeepers like Amazon.
We empower authors by offering an 85% revenue share model, significantly higher than the industry standard.
For readers, we provide exclusive access to book clubs, live author events, and a community of passionate literary enthusiasts.

# Key Value Propositions
- Authors keep 85% of revenue.
- Direct author-reader relationships.
- Exclusive book clubs and live events.
- No monthly fees for authors; fair partnership model.
- Premium membership tiers for readers starting at $9.99/month.

# Core Pages
- Home: https://buukclub.com/
- Apply (Authors): https://buukclub.com/apply
- Join (Readers): https://buukclub.com/join
- Manifesto: https://buukclub.com/manifesto
- Pricing: https://buukclub.com/pricing
- Blog: https://buukclub.com/blog

# Contact
- Email: support@buukclub.com
- Discord: Available for community members.

# Mission
To reshape the literary landscape by prioritizing fair compensation for authors and meaningful connections for readers.
`;

    return new NextResponse(content, {
        headers: {
            'Content-Type': 'text/plain',
            'Cache-Control': 'public, max-age=3600, s-maxage=3600',
        },
    });
}

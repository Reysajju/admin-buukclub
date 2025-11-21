import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'

function getStripe() {
    if (!process.env.STRIPE_SECRET_KEY) {
        throw new Error('STRIPE_SECRET_KEY is not set');
    }
    return new Stripe(process.env.STRIPE_SECRET_KEY);
}

export async function POST(request: Request) {
    const stripe = getStripe();
    const cookieStore = await cookies()
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return cookieStore.get(name)?.value
                },
                set(name: string, value: string, options: CookieOptions) {
                    cookieStore.set({ name, value, ...options })
                },
                remove(name: string, options: CookieOptions) {
                    cookieStore.set({ name, value: '', ...options })
                },
            },
        }
    )

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const { clubId, authorStripeId, priceInCents } = await request.json()

        if (!clubId || !authorStripeId || !priceInCents) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        // Calculate the cut
        // Platform fee (You): 30%
        const applicationFee = Math.round(priceInCents * 0.30)

        const origin = request.headers.get('origin') || 'https://buukclub.com'

        const session = await stripe.checkout.sessions.create({
            mode: 'subscription',
            line_items: [{
                price_data: {
                    currency: 'usd',
                    product_data: { name: 'BuukClub Access' },
                    unit_amount: priceInCents,
                    recurring: { interval: 'month' },
                },
                quantity: 1,
            }],
            payment_intent_data: {
                application_fee_amount: applicationFee,
                transfer_data: {
                    destination: authorStripeId, // Money goes to Author automatically
                },
            },
            metadata: {
                userId: user.id,
                clubId: clubId,
            },
            success_url: `${origin}/club/success`,
            cancel_url: `${origin}/club/${clubId}`,
        })

        return NextResponse.json({ url: session.url })
    } catch (err: any) {
        console.error('Stripe checkout error:', err)
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}

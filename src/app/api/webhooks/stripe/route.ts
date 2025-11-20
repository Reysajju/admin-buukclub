import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

// Initialize Supabase Admin Client (Service Role)
// We need this to bypass RLS when inserting membership from a server-side webhook
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: Request) {
    const body = await request.text()
    const signature = (await headers()).get('stripe-signature') as string

    let event: Stripe.Event

    try {
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err: any) {
        console.error(`Webhook signature verification failed.`, err.message)
        return NextResponse.json({ error: err.message }, { status: 400 })
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session
        const { userId, clubId } = session.metadata || {}

        if (userId && clubId) {
            const { error } = await supabaseAdmin
                .from('memberships')
                .insert({
                    user_id: userId,
                    club_id: clubId,
                    status: 'active',
                })

            if (error) {
                console.error('Error inserting membership:', error)
                return NextResponse.json({ error: 'Database error' }, { status: 500 })
            }
        }
    }

    return NextResponse.json({ received: true })
}

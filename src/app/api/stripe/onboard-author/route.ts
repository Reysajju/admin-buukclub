import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(request: Request) {
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
        // 1. Create an Express account for the author
        const account = await stripe.accounts.create({
            type: 'express',
            country: 'US', // Defaulting to US as per prompt, but could be dynamic
            email: user.email,
            capabilities: {
                card_payments: { requested: true },
                transfers: { requested: true },
            },
        })

        // 2. Create the account link
        const origin = request.headers.get('origin') || 'https://buukclub.com'
        const accountLink = await stripe.accountLinks.create({
            account: account.id,
            refresh_url: `${origin}/dashboard`,
            return_url: `${origin}/dashboard`,
            type: 'account_onboarding',
        })

        // 3. Save account.id to Supabase profiles table
        // We need a service role client or ensure RLS allows this update.
        // Assuming the user can update their own profile or we use a service role key if needed.
        // For now, using the user's client (RLS should allow updating own profile if configured, 
        // but the prompt's RLS only mentioned clubs. We might need to add a policy for profiles or use service role).
        // The prompt says "Authors can update own club", but didn't explicitly say profiles.
        // I'll use the current client and if it fails, we'll need to fix RLS.

        const { error } = await supabase
            .from('profiles')
            .update({ stripe_account_id: account.id })
            .eq('id', user.id)

        if (error) {
            console.error('Error updating profile:', error)
            return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
        }

        return NextResponse.json({ url: accountLink.url })
    } catch (err: any) {
        console.error('Stripe error:', err)
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}

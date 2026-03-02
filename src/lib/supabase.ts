import { createBrowserClient } from '@supabase/ssr';

export const createClient = () => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!url || !anonKey) {
        console.error('Missing Supabase environment variables');
        throw new Error('Supabase project not connected. Please check your environment variables.');
    }

    return createBrowserClient(url, anonKey);
};

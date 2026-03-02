-- ============================================================
-- BUUKCLUB DATABASE SETUP
-- Run this in Supabase SQL Editor
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Add missing columns to existing tables (safe to re-run)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='profiles' AND column_name='session_limit') THEN
        ALTER TABLE public.profiles ADD COLUMN session_limit INTEGER DEFAULT 0;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='waitlist' AND column_name='favorite_genre') THEN
        ALTER TABLE public.waitlist ADD COLUMN favorite_genre TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='waitlist' AND column_name='books_per_year') THEN
        ALTER TABLE public.waitlist ADD COLUMN books_per_year TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='waitlist' AND column_name='ticket_code') THEN
        ALTER TABLE public.waitlist ADD COLUMN ticket_code TEXT;
    END IF;
END;
$$;

-- 1. PROFILES
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT,
    email TEXT UNIQUE,
    role TEXT CHECK (role IN ('author', 'reader')) DEFAULT 'reader',
    is_approved BOOLEAN DEFAULT TRUE,
    plan TEXT DEFAULT 'basic',
    session_limit INTEGER DEFAULT 0,
    phone TEXT,
    book_name TEXT,
    avatar_url TEXT,
    bio TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. WAITLIST
CREATE TABLE IF NOT EXISTS public.waitlist (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    role TEXT DEFAULT 'reader',
    favorite_genre TEXT,
    books_per_year TEXT,
    ticket_code TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. APPLICATIONS
CREATE TABLE IF NOT EXISTS public.applications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email TEXT NOT NULL,
    name TEXT NOT NULL,
    social_profile TEXT,
    followers INTEGER DEFAULT 0,
    pain_point TEXT,
    pitch TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. LIVE CHAT MESSAGES
CREATE TABLE IF NOT EXISTS public.live_chat_messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    room_name TEXT NOT NULL,
    name TEXT NOT NULL,
    message TEXT NOT NULL,
    avatar TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. SESSION FEEDBACK
CREATE TABLE IF NOT EXISTS public.session_feedback (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    session_name TEXT NOT NULL,
    reader_name TEXT NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    would_buy BOOLEAN,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. WAITLIST COMMENTS
CREATE TABLE IF NOT EXISTS public.waitlist_comments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. LEADS
CREATE TABLE IF NOT EXISTS public.leads (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    book_name TEXT,
    session_count INTEGER,
    message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. REALTIME
DO $$
BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE live_chat_messages;
EXCEPTION WHEN duplicate_object THEN NULL;
END;
$$;

-- 9. AUTO-PROFILE TRIGGER
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, email, role, is_approved, plan)
    VALUES (
        new.id,
        COALESCE(new.raw_user_meta_data->>'full_name', ''),
        new.email,
        COALESCE(new.raw_user_meta_data->>'role', 'reader'),
        TRUE,
        'basic'
    )
    ON CONFLICT (id) DO UPDATE SET
        full_name = COALESCE(EXCLUDED.full_name, public.profiles.full_name),
        email = COALESCE(EXCLUDED.email, public.profiles.email),
        updated_at = NOW();
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 10. ROW LEVEL SECURITY
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

-- Drop old policies
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Super Admin can do everything on profiles" ON public.profiles;
DROP POLICY IF EXISTS "profiles_select_public" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_superadmin" ON public.profiles;
DROP POLICY IF EXISTS "profiles_delete_superadmin" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_service" ON public.profiles;
DROP POLICY IF EXISTS "Anyone can submit an application" ON public.applications;
DROP POLICY IF EXISTS "Super Admin can view all applications" ON public.applications;
DROP POLICY IF EXISTS "Super Admin can update applications" ON public.applications;
DROP POLICY IF EXISTS "applications_insert_public" ON public.applications;
DROP POLICY IF EXISTS "applications_select_superadmin" ON public.applications;
DROP POLICY IF EXISTS "applications_update_superadmin" ON public.applications;

-- Profiles: anyone can read, users update their own, trigger inserts
CREATE POLICY "profiles_select_public" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_insert_service" ON public.profiles FOR INSERT WITH CHECK (true);

-- Applications: anyone can submit, authenticated can view
CREATE POLICY "applications_insert_public" ON public.applications FOR INSERT WITH CHECK (true);
CREATE POLICY "applications_select_auth" ON public.applications FOR SELECT TO authenticated USING (true);

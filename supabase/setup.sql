-- ============================================================
-- BUUKCLUB - FRESH DATABASE SETUP
-- ⚠️ THIS DROPS ALL EXISTING TABLES AND RECREATES THEM
-- Run this in Supabase SQL Editor
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- DROP EVERYTHING (order matters due to foreign keys)
-- ============================================================
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

DROP TABLE IF EXISTS public.session_requests CASCADE;
DROP TABLE IF EXISTS public.approval_requests CASCADE;
DROP TABLE IF EXISTS public.session_feedback CASCADE;
DROP TABLE IF EXISTS public.live_chat_messages CASCADE;
DROP TABLE IF EXISTS public.waitlist_comments CASCADE;
DROP TABLE IF EXISTS public.contact_messages CASCADE;
DROP TABLE IF EXISTS public.leads CASCADE;
DROP TABLE IF EXISTS public.applications CASCADE;
DROP TABLE IF EXISTS public.waitlist CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- ============================================================
-- 1. PROFILES
-- ============================================================
CREATE TABLE public.profiles (
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

-- ============================================================
-- 2. WAITLIST
-- ============================================================
CREATE TABLE public.waitlist (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    role TEXT DEFAULT 'reader',
    favorite_genre TEXT,
    books_per_year TEXT,
    ticket_code TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 3. APPLICATIONS
-- ============================================================
CREATE TABLE public.applications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email TEXT NOT NULL,
    name TEXT NOT NULL,
    social_profile TEXT,
    followers INTEGER DEFAULT 0,
    pain_point TEXT,
    pitch TEXT,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 4. LIVE CHAT
-- ============================================================
CREATE TABLE public.live_chat_messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    room_name TEXT NOT NULL,
    name TEXT NOT NULL,
    message TEXT NOT NULL,
    avatar TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 5. SESSION FEEDBACK
-- ============================================================
CREATE TABLE public.session_feedback (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    session_name TEXT NOT NULL,
    reader_name TEXT NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    would_buy BOOLEAN,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 6. WAITLIST COMMENTS
-- ============================================================
CREATE TABLE public.waitlist_comments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 7. LEADS
-- ============================================================
CREATE TABLE public.leads (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    book_name TEXT,
    session_count INTEGER,
    message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 8. CONTACT MESSAGES
-- ============================================================
CREATE TABLE public.contact_messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 9. REALTIME (for live chat)
-- ============================================================
DO $$
BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE live_chat_messages;
EXCEPTION WHEN duplicate_object THEN NULL;
END;
$$;

-- ============================================================
-- 10. AUTO-CREATE PROFILE ON SIGNUP
-- ============================================================
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

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- 11. RLS POLICIES
-- ============================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.live_chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.waitlist_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Profiles: public read, self update, open insert (for trigger)
CREATE POLICY "profiles_read" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "profiles_update" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles_insert" ON public.profiles FOR INSERT WITH CHECK (true);

-- Waitlist: open insert, public read
CREATE POLICY "waitlist_insert" ON public.waitlist FOR INSERT WITH CHECK (true);
CREATE POLICY "waitlist_read" ON public.waitlist FOR SELECT USING (true);

-- Applications: open insert, authenticated read
CREATE POLICY "applications_insert" ON public.applications FOR INSERT WITH CHECK (true);
CREATE POLICY "applications_read" ON public.applications FOR SELECT TO authenticated USING (true);

-- Live chat: open insert and read (public chat)
CREATE POLICY "chat_insert" ON public.live_chat_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "chat_read" ON public.live_chat_messages FOR SELECT USING (true);

-- Session feedback: open insert, authenticated read
CREATE POLICY "feedback_insert" ON public.session_feedback FOR INSERT WITH CHECK (true);
CREATE POLICY "feedback_read" ON public.session_feedback FOR SELECT TO authenticated USING (true);

-- Waitlist comments: open insert and read
CREATE POLICY "comments_insert" ON public.waitlist_comments FOR INSERT WITH CHECK (true);
CREATE POLICY "comments_read" ON public.waitlist_comments FOR SELECT USING (true);

-- Leads: open insert, authenticated read
CREATE POLICY "leads_insert" ON public.leads FOR INSERT WITH CHECK (true);
CREATE POLICY "leads_read" ON public.leads FOR SELECT TO authenticated USING (true);

-- Contact messages: open insert, authenticated read
CREATE POLICY "contact_insert" ON public.contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "contact_read" ON public.contact_messages FOR SELECT TO authenticated USING (true);

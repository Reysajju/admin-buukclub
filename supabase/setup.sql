-- ============================================================
-- BUUKCLUB COMPLETE DATABASE SETUP
-- Run this ONCE in Supabase SQL Editor (drop old tables first if needed)
-- ============================================================

-- 0. Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- 1. PROFILES TABLE
-- Stores user data for both authors and readers
-- ============================================================
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT,
    email TEXT UNIQUE,
    role TEXT CHECK (role IN ('author', 'reader')) DEFAULT 'reader',
    is_approved BOOLEAN DEFAULT FALSE,
    plan TEXT DEFAULT 'basic',
    phone TEXT,
    book_name TEXT,
    avatar_url TEXT,
    bio TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 2. APPROVAL_REQUESTS TABLE
-- Explicit record of every author signup needing superadmin review
-- ============================================================
CREATE TABLE IF NOT EXISTS public.approval_requests (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    reviewed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 3. WAITLIST TABLE
-- ============================================================
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

-- ============================================================
-- 4. APPLICATIONS TABLE
-- Detailed author applications from /apply page
-- ============================================================
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

-- ============================================================
-- 5. LIVE_CHAT_MESSAGES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.live_chat_messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    room_name TEXT NOT NULL,
    name TEXT NOT NULL,
    message TEXT NOT NULL,
    avatar TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 6. SESSION_FEEDBACK TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.session_feedback (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    session_name TEXT NOT NULL,
    reader_name TEXT NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    would_buy BOOLEAN,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 7. WAITLIST_COMMENTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.waitlist_comments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 8. LEADS TABLE
-- ============================================================
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

-- ============================================================
-- 9. SESSION_REQUESTS TABLE
-- Authors request sessions, superadmin approves and provides the live link
-- ============================================================
CREATE TABLE IF NOT EXISTS public.session_requests (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    author_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    author_name TEXT NOT NULL,
    author_email TEXT NOT NULL,
    book_title TEXT,
    preferred_date TEXT,
    message TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    room_link TEXT,
    admin_notes TEXT,
    reviewed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 10. Enable Realtime for Chat
-- ============================================================
ALTER PUBLICATION supabase_realtime ADD TABLE live_chat_messages;

-- ============================================================
-- 10. AUTO-PROFILE TRIGGER
-- When a new user signs up via Supabase Auth:
--   a) Create their profile row
--   b) If role = 'author', also create an approval_request
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
    user_role TEXT;
    user_name TEXT;
BEGIN
    user_role := COALESCE(new.raw_user_meta_data->>'role', 'reader');
    user_name := new.raw_user_meta_data->>'full_name';

    -- Insert profile
    INSERT INTO public.profiles (id, full_name, email, role, is_approved, plan)
    VALUES (
        new.id,
        user_name,
        new.email,
        user_role,
        CASE WHEN user_role = 'author' THEN FALSE ELSE TRUE END,
        'basic'
    );

    -- If author, create an approval request for the superadmin
    IF user_role = 'author' THEN
        INSERT INTO public.approval_requests (user_id, full_name, email, status)
        VALUES (
            new.id,
            COALESCE(user_name, 'Unknown'),
            new.email,
            'pending'
        );
    END IF;

    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if any, then create fresh
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- 11. ROW LEVEL SECURITY (RLS)
-- ============================================================

-- Enable RLS on all key tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.approval_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

-- -------------------------------------------------------
-- Drop ALL existing policies to avoid conflicts
-- -------------------------------------------------------
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Super Admin can do everything on profiles" ON public.profiles;
DROP POLICY IF EXISTS "Anyone can submit an application" ON public.applications;
DROP POLICY IF EXISTS "Super Admin can view all applications" ON public.applications;
DROP POLICY IF EXISTS "Super Admin can update applications" ON public.applications;

-- -------------------------------------------------------
-- PROFILES policies
-- -------------------------------------------------------

-- Anyone can read profiles (for public author pages etc)
CREATE POLICY "profiles_select_public"
    ON public.profiles FOR SELECT
    USING (true);

-- Users can update their OWN profile
CREATE POLICY "profiles_update_own"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Superadmin can update ANY profile (for approvals, plan changes)
CREATE POLICY "profiles_update_superadmin"
    ON public.profiles FOR UPDATE
    USING (auth.jwt() ->> 'email' = 'sajjadr742@gmail.com')
    WITH CHECK (auth.jwt() ->> 'email' = 'sajjadr742@gmail.com');

-- Superadmin can delete profiles
CREATE POLICY "profiles_delete_superadmin"
    ON public.profiles FOR DELETE
    USING (auth.jwt() ->> 'email' = 'sajjadr742@gmail.com');

-- Allow the trigger function to insert profiles (runs as SECURITY DEFINER, but just in case)
CREATE POLICY "profiles_insert_service"
    ON public.profiles FOR INSERT
    WITH CHECK (true);

-- -------------------------------------------------------
-- APPROVAL_REQUESTS policies
-- -------------------------------------------------------

-- Only superadmin can view approval requests
CREATE POLICY "approval_requests_select_superadmin"
    ON public.approval_requests FOR SELECT
    TO authenticated
    USING (auth.jwt() ->> 'email' = 'sajjadr742@gmail.com');

-- Authors can also see their own request status
CREATE POLICY "approval_requests_select_own"
    ON public.approval_requests FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

-- Only superadmin can update approval requests
CREATE POLICY "approval_requests_update_superadmin"
    ON public.approval_requests FOR UPDATE
    TO authenticated
    USING (auth.jwt() ->> 'email' = 'sajjadr742@gmail.com')
    WITH CHECK (auth.jwt() ->> 'email' = 'sajjadr742@gmail.com');

-- Allow inserts (from trigger, runs SECURITY DEFINER)
CREATE POLICY "approval_requests_insert"
    ON public.approval_requests FOR INSERT
    WITH CHECK (true);

-- -------------------------------------------------------
-- APPLICATIONS policies
-- -------------------------------------------------------

-- Anyone can submit an application (public form)
CREATE POLICY "applications_insert_public"
    ON public.applications FOR INSERT
    WITH CHECK (true);

-- Only superadmin can view applications
CREATE POLICY "applications_select_superadmin"
    ON public.applications FOR SELECT
    TO authenticated
    USING (auth.jwt() ->> 'email' = 'sajjadr742@gmail.com');

-- Only superadmin can update applications
CREATE POLICY "applications_update_superadmin"
    ON public.applications FOR UPDATE
    TO authenticated
    USING (auth.jwt() ->> 'email' = 'sajjadr742@gmail.com')
    WITH CHECK (auth.jwt() ->> 'email' = 'sajjadr742@gmail.com');

-- -------------------------------------------------------
-- SESSION_REQUESTS policies
-- -------------------------------------------------------
ALTER TABLE public.session_requests ENABLE ROW LEVEL SECURITY;

-- Authors can submit session requests
CREATE POLICY "session_requests_insert_author"
    ON public.session_requests FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = author_id);

-- Authors can view their own requests
CREATE POLICY "session_requests_select_own"
    ON public.session_requests FOR SELECT
    TO authenticated
    USING (auth.uid() = author_id);

-- Superadmin can view all session requests
CREATE POLICY "session_requests_select_superadmin"
    ON public.session_requests FOR SELECT
    TO authenticated
    USING (auth.jwt() ->> 'email' = 'sajjadr742@gmail.com');

-- Superadmin can update session requests (approve, add link, notes)
CREATE POLICY "session_requests_update_superadmin"
    ON public.session_requests FOR UPDATE
    TO authenticated
    USING (auth.jwt() ->> 'email' = 'sajjadr742@gmail.com')
    WITH CHECK (auth.jwt() ->> 'email' = 'sajjadr742@gmail.com');

-- ============================================================
-- 13. ADMIN SETUP (run manually after superadmin signs up)
-- ============================================================
-- UPDATE public.profiles SET is_approved = true, role = 'author' WHERE email = 'sajjadr742@gmail.com';


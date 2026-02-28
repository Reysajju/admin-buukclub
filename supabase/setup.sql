-- COMPREHENSIVE BUUKCLUB DATABASE SETUP
-- This script creates all necessary tables and extensions from scratch.

-- 0. Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES Table
-- Stores user data for both authors and readers
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
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. WAITLIST Table
-- Stores early access signups from the landing page
CREATE TABLE IF NOT EXISTS public.waitlist (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    role TEXT DEFAULT 'reader',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. APPLICATIONS Table
-- Stores detailed author applications
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

-- 4. LIVE_CHAT_MESSAGES Table
-- Stores persistent user chat messages during sessions
CREATE TABLE IF NOT EXISTS public.live_chat_messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    room_name TEXT NOT NULL,
    name TEXT NOT NULL,
    message TEXT NOT NULL,
    avatar TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. SESSION_FEEDBACK Table
-- Stores feedback from readers after a session ends
CREATE TABLE IF NOT EXISTS public.session_feedback (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    session_name TEXT NOT NULL,
    reader_name TEXT NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    would_buy BOOLEAN,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. WAITLIST_COMMENTS Table
-- Stores AI-generated "social proof" comments on the landing page
CREATE TABLE IF NOT EXISTS public.waitlist_comments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. LEADS Table
-- Stores inquiries for high-volume Platinum plans
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

-- 8. Enable Realtime for Chat
-- This allows the UI to update instantly when a new message is saved
ALTER PUBLICATION supabase_realtime ADD TABLE live_chat_messages;

-- 9. AUTO-PROFILE TRIGGER
-- Automatically creates a profile row when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, role, is_approved, plan)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.email,
    COALESCE(new.raw_user_meta_data->>'role', 'reader'),
    CASE WHEN new.raw_user_meta_data->>'role' = 'author' THEN FALSE ELSE TRUE END,
    'basic'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 10. ROW LEVEL SECURITY (RLS)
-- Enable RLS on core tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Public profiles are viewable by everyone" 
  ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Super Admin can do everything on profiles" 
  ON public.profiles FOR ALL TO authenticated 
  USING (auth.jwt() ->> 'email' = 'sajjadr742@gmail.com');

-- Applications Policies
CREATE POLICY "Anyone can submit an application" 
  ON public.applications FOR INSERT WITH CHECK (true);

CREATE POLICY "Super Admin can view all applications" 
  ON public.applications FOR SELECT TO authenticated 
  USING (auth.jwt() ->> 'email' = 'sajjadr742@gmail.com');

CREATE POLICY "Super Admin can update applications" 
  ON public.applications FOR UPDATE TO authenticated 
  USING (auth.jwt() ->> 'email' = 'sajjadr742@gmail.com');

-- 11. ADMIN PERMISSIONS (Manual Setup)
-- To make sajjadr742@gmail.com a Super Admin:
-- First, sign up the user via the UI, then run this:
-- UPDATE public.profiles SET is_approved = true, role = 'author' WHERE email = 'sajjadr742@gmail.com';

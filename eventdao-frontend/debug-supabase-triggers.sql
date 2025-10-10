-- Debug Supabase Triggers and Functions
-- Jalankan script ini di Supabase SQL Editor untuk debug

-- =============================================
-- CHECK TRIGGERS
-- =============================================
SELECT 
    trigger_name,
    event_object_table,
    action_timing,
    event_manipulation,
    action_statement
FROM information_schema.triggers 
WHERE trigger_schema = 'public' 
ORDER BY trigger_name;

-- =============================================
-- CHECK FUNCTIONS
-- =============================================
SELECT 
    routine_name,
    routine_type,
    data_type
FROM information_schema.routines 
WHERE routine_schema = 'public' 
ORDER BY routine_name;

-- =============================================
-- CHECK TABLES
-- =============================================
SELECT 
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- =============================================
-- CHECK PROFILES TABLE STRUCTURE
-- =============================================
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'profiles'
ORDER BY ordinal_position;

-- =============================================
-- CHECK AUTH USERS TABLE
-- =============================================
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_schema = 'auth' 
AND table_name = 'users'
ORDER BY ordinal_position;

-- =============================================
-- CHECK IF TRIGGER EXISTS
-- =============================================
SELECT 
    trigger_name,
    event_object_table,
    action_timing,
    event_manipulation
FROM information_schema.triggers 
WHERE trigger_schema = 'public' 
AND trigger_name = 'on_auth_user_created';

-- =============================================
-- CHECK IF FUNCTION EXISTS
-- =============================================
SELECT 
    routine_name,
    routine_type
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name = 'handle_new_user';

-- =============================================
-- COUNT USERS IN AUTH.USERS
-- =============================================
SELECT COUNT(*) as total_users FROM auth.users;

-- =============================================
-- COUNT PROFILES
-- =============================================
SELECT COUNT(*) as total_profiles FROM public.profiles;

-- =============================================
-- SHOW RECENT USERS (if any)
-- =============================================
SELECT 
    id,
    email,
    email_confirmed_at,
    created_at
FROM auth.users 
ORDER BY created_at DESC 
LIMIT 5;

-- =============================================
-- SHOW RECENT PROFILES (if any)
-- =============================================
SELECT 
    id,
    username,
    email,
    created_at
FROM public.profiles 
ORDER BY created_at DESC 
LIMIT 5;

-- Fix Supabase Trigger untuk Auto-Create Profile
-- Script ini akan memperbaiki trigger yang tidak berfungsi

-- =============================================
-- STEP 1: CHECK CURRENT TRIGGER STATUS
-- =============================================

-- Check if trigger exists
SELECT 
    trigger_name,
    event_object_table,
    action_timing,
    event_manipulation,
    action_statement
FROM information_schema.triggers 
WHERE trigger_schema = 'public' 
AND trigger_name LIKE '%user%'
ORDER BY trigger_name;

-- Check if function exists
SELECT 
    routine_name,
    routine_type,
    routine_definition
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name LIKE '%user%'
ORDER BY routine_name;

-- =============================================
-- STEP 2: DROP EXISTING TRIGGER AND FUNCTION
-- =============================================

-- Drop existing trigger if exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Drop existing function if exists
DROP FUNCTION IF EXISTS public.handle_new_user();

-- =============================================
-- STEP 3: CREATE NEW FUNCTION
-- =============================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    username_from_email TEXT;
    avatar_url TEXT;
BEGIN
    -- Generate username from email (part before @)
    username_from_email := split_part(NEW.email, '@', 1);
    
    -- Ensure username is unique by appending numbers if needed
    WHILE EXISTS (SELECT 1 FROM profiles WHERE username = username_from_email) LOOP
        username_from_email := username_from_email || '_' || floor(random() * 1000);
    END LOOP;
    
    -- Generate avatar URL using DiceBear API
    avatar_url := 'https://api.dicebear.com/7.x/avataaars/svg?seed=' || username_from_email;
    
    -- Insert profile with generated username and avatar
    INSERT INTO public.profiles (id, username, email, full_name, avatar_url, email_verified)
    VALUES (
        NEW.id, 
        username_from_email,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
        avatar_url,
        NEW.email_confirmed_at IS NOT NULL
    );
    
    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        -- Log error but don't fail the signup
        RAISE LOG 'Error creating profile for user %: %', NEW.id, SQLERRM;
        RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- STEP 4: CREATE NEW TRIGGER
-- =============================================

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =============================================
-- STEP 5: VERIFY TRIGGER CREATION
-- =============================================

-- Check if trigger was created successfully
SELECT 
    trigger_name,
    event_object_table,
    action_timing,
    event_manipulation,
    action_statement
FROM information_schema.triggers 
WHERE trigger_schema = 'public' 
AND trigger_name = 'on_auth_user_created';

-- Check if function was created successfully
SELECT 
    routine_name,
    routine_type
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name = 'handle_new_user';

-- =============================================
-- STEP 6: TEST TRIGGER MANUALLY
-- =============================================

-- Test the function manually (optional)
-- This will create a test profile
DO $$
DECLARE
    test_user_id UUID := gen_random_uuid();
    test_email TEXT := 'test@example.com';
BEGIN
    -- Insert test user
    INSERT INTO auth.users (
        id,
        email,
        email_confirmed_at,
        created_at,
        updated_at,
        raw_user_meta_data
    ) VALUES (
        test_user_id,
        test_email,
        NOW(),
        NOW(),
        NOW(),
        '{"full_name": "Test User"}'::jsonb
    );
    
    -- Check if profile was created
    IF EXISTS (SELECT 1 FROM profiles WHERE id = test_user_id) THEN
        RAISE NOTICE 'SUCCESS: Profile created for test user';
    ELSE
        RAISE NOTICE 'ERROR: Profile not created for test user';
    END IF;
    
    -- Clean up test data
    DELETE FROM profiles WHERE id = test_user_id;
    DELETE FROM auth.users WHERE id = test_user_id;
END $$;

-- =============================================
-- STEP 7: CHECK RLS POLICIES
-- =============================================

-- Ensure RLS is enabled
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Check existing policies
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'profiles';

-- Create policies if they don't exist
DO $$
BEGIN
    -- Check if policy exists
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'profiles' 
        AND policyname = 'Public profiles are viewable by everyone'
    ) THEN
        CREATE POLICY "Public profiles are viewable by everyone" 
        ON profiles FOR SELECT USING (true);
    END IF;
    
    -- Check if policy exists
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'profiles' 
        AND policyname = 'Users can insert their own profile'
    ) THEN
        CREATE POLICY "Users can insert their own profile" 
        ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
    END IF;
    
    -- Check if policy exists
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'profiles' 
        AND policyname = 'Users can update their own profile'
    ) THEN
        CREATE POLICY "Users can update their own profile" 
        ON profiles FOR UPDATE USING (auth.uid() = id);
    END IF;
END $$;

-- =============================================
-- FINAL VERIFICATION
-- =============================================

-- Final check
SELECT 
    'Trigger Status' as check_type,
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM information_schema.triggers 
            WHERE trigger_name = 'on_auth_user_created'
        ) THEN '✅ Trigger exists'
        ELSE '❌ Trigger missing'
    END as status
UNION ALL
SELECT 
    'Function Status' as check_type,
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM information_schema.routines 
            WHERE routine_name = 'handle_new_user'
        ) THEN '✅ Function exists'
        ELSE '❌ Function missing'
    END as status
UNION ALL
SELECT 
    'RLS Status' as check_type,
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM pg_class c
            JOIN pg_namespace n ON n.oid = c.relnamespace
            WHERE n.nspname = 'public' 
            AND c.relname = 'profiles'
            AND c.relrowsecurity = true
        ) THEN '✅ RLS enabled'
        ELSE '❌ RLS disabled'
    END as status;
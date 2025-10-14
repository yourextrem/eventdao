-- Debug Supabase Signup Flow
-- Script untuk debug kenapa profile tidak terbuat otomatis

-- =============================================
-- STEP 1: CHECK AUTH USERS TABLE
-- =============================================

-- Check if there are any users in auth.users
SELECT 
    id,
    email,
    email_confirmed_at,
    created_at,
    raw_user_meta_data
FROM auth.users 
ORDER BY created_at DESC 
LIMIT 10;

-- =============================================
-- STEP 2: CHECK PROFILES TABLE
-- =============================================

-- Check profiles table
SELECT 
    id,
    username,
    email,
    full_name,
    created_at
FROM profiles 
ORDER BY created_at DESC 
LIMIT 10;

-- =============================================
-- STEP 3: CHECK TRIGGER STATUS
-- =============================================

-- Check if trigger exists and is active
SELECT 
    trigger_name,
    event_object_table,
    action_timing,
    event_manipulation,
    action_statement,
    action_orientation,
    action_condition
FROM information_schema.triggers 
WHERE trigger_schema = 'public' 
AND trigger_name = 'on_auth_user_created';

-- =============================================
-- STEP 4: CHECK FUNCTION STATUS
-- =============================================

-- Check if function exists
SELECT 
    routine_name,
    routine_type,
    data_type,
    routine_definition
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name = 'handle_new_user';

-- =============================================
-- STEP 5: CHECK RLS POLICIES
-- =============================================

-- Check RLS status
SELECT 
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables 
WHERE tablename = 'profiles';

-- Check policies
SELECT 
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'profiles';

-- =============================================
-- STEP 6: MANUAL TEST
-- =============================================

-- Test manual insertion to see if trigger works
DO $$
DECLARE
    test_user_id UUID := gen_random_uuid();
    test_email TEXT := 'debug_test_' || extract(epoch from now()) || '@example.com';
    profile_count_before INTEGER;
    profile_count_after INTEGER;
BEGIN
    -- Count profiles before
    SELECT COUNT(*) INTO profile_count_before FROM profiles;
    
    RAISE NOTICE 'Profiles before test: %', profile_count_before;
    RAISE NOTICE 'Testing with user ID: %', test_user_id;
    RAISE NOTICE 'Testing with email: %', test_email;
    
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
        '{"full_name": "Debug Test User", "username": "debug_test"}'::jsonb
    );
    
    -- Count profiles after
    SELECT COUNT(*) INTO profile_count_after FROM profiles;
    
    RAISE NOTICE 'Profiles after test: %', profile_count_after;
    
    -- Check if profile was created
    IF EXISTS (SELECT 1 FROM profiles WHERE id = test_user_id) THEN
        RAISE NOTICE '✅ SUCCESS: Profile created automatically';
        
        -- Show created profile
        SELECT 
            id,
            username,
            email,
            full_name,
            avatar_url
        FROM profiles 
        WHERE id = test_user_id;
    ELSE
        RAISE NOTICE '❌ ERROR: Profile NOT created automatically';
        RAISE NOTICE 'Trigger mungkin tidak berfungsi atau ada error';
    END IF;
    
    -- Clean up test data
    DELETE FROM profiles WHERE id = test_user_id;
    DELETE FROM auth.users WHERE id = test_user_id;
    
    RAISE NOTICE 'Test completed and cleaned up';
END $$;

-- =============================================
-- STEP 7: CHECK LOGS (if available)
-- =============================================

-- Check for any error logs (if log access is available)
-- This might not work depending on Supabase plan
SELECT 
    'Log check' as check_type,
    'Check Supabase logs for trigger errors' as message;

-- =============================================
-- STEP 8: ALTERNATIVE SOLUTION
-- =============================================

-- If trigger doesn't work, we can create profiles manually
-- for existing users who don't have profiles

DO $$
DECLARE
    user_record RECORD;
    username_from_email TEXT;
    avatar_url TEXT;
    profiles_created INTEGER := 0;
BEGIN
    RAISE NOTICE 'Creating missing profiles for existing users...';
    
    -- Find users without profiles
    FOR user_record IN 
        SELECT 
            u.id,
            u.email,
            u.raw_user_meta_data
        FROM auth.users u
        LEFT JOIN profiles p ON u.id = p.id
        WHERE p.id IS NULL
    LOOP
        -- Generate username from email
        username_from_email := split_part(user_record.email, '@', 1);
        
        -- Ensure username is unique
        WHILE EXISTS (SELECT 1 FROM profiles WHERE username = username_from_email) LOOP
            username_from_email := username_from_email || '_' || floor(random() * 1000);
        END LOOP;
        
        -- Generate avatar URL
        avatar_url := 'https://api.dicebear.com/7.x/avataaars/svg?seed=' || username_from_email;
        
        -- Insert profile
        INSERT INTO profiles (
            id,
            username,
            email,
            full_name,
            avatar_url,
            email_verified
        ) VALUES (
            user_record.id,
            username_from_email,
            user_record.email,
            COALESCE(user_record.raw_user_meta_data->>'full_name', ''),
            avatar_url,
            true
        );
        
        profiles_created := profiles_created + 1;
        
        RAISE NOTICE 'Created profile for user: % (%)', user_record.email, user_record.id;
    END LOOP;
    
    RAISE NOTICE 'Total profiles created: %', profiles_created;
END $$;

-- =============================================
-- FINAL STATUS CHECK
-- =============================================

-- Final verification
SELECT 
    'Final Status' as check_type,
    'Users in auth.users: ' || COUNT(*) as status
FROM auth.users
UNION ALL
SELECT 
    'Final Status' as check_type,
    'Profiles in profiles table: ' || COUNT(*) as status
FROM profiles
UNION ALL
SELECT 
    'Final Status' as check_type,
    'Users without profiles: ' || COUNT(*) as status
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
WHERE p.id IS NULL;

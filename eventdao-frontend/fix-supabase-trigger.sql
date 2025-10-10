-- Fix Supabase Trigger untuk Auto-Create Profile
-- Jalankan script ini jika trigger belum aktif

-- =============================================
-- DROP EXISTING TRIGGER IF EXISTS
-- =============================================
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- =============================================
-- RECREATE FUNCTION
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
-- CREATE TRIGGER
-- =============================================
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =============================================
-- VERIFY TRIGGER CREATED
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
-- TEST FUNCTION (Optional)
-- =============================================
-- Uncomment untuk test function manual
-- SELECT public.handle_new_user();

-- =============================================
-- CHECK PERMISSIONS
-- =============================================
-- Pastikan function bisa diakses
SELECT 
    routine_name,
    routine_type,
    security_type
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name = 'handle_new_user';

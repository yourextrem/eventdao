-- Reset Supabase Database - Hapus Semua Objek SQL
-- Jalankan script ini untuk membersihkan database sebelum setup baru

-- =============================================
-- HAPUS SEMUA TRIGGERS
-- =============================================
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_email_confirmed ON auth.users;
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
DROP TRIGGER IF EXISTS update_events_updated_at ON public.events;
DROP TRIGGER IF EXISTS update_event_claims_updated_at ON public.event_claims;
DROP TRIGGER IF EXISTS update_verifications_updated_at ON public.verifications;

-- =============================================
-- HAPUS SEMUA FUNCTIONS
-- =============================================
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS public.handle_email_confirmation();
DROP FUNCTION IF EXISTS public.update_user_profile();
DROP FUNCTION IF EXISTS public.get_user_profile(UUID);
DROP FUNCTION IF EXISTS public.generate_avatar_url(VARCHAR);
DROP FUNCTION IF EXISTS public.update_updated_at_column();

-- =============================================
-- HAPUS SEMUA POLICIES (RLS)
-- =============================================
-- Profiles policies
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

-- Events policies
DROP POLICY IF EXISTS "Events are viewable by everyone" ON public.events;
DROP POLICY IF EXISTS "Authenticated users can create events" ON public.events;
DROP POLICY IF EXISTS "Event organizers can update their events" ON public.events;

-- Event claims policies
DROP POLICY IF EXISTS "Event claims are viewable by everyone" ON public.event_claims;
DROP POLICY IF EXISTS "Users can create their own claims" ON public.event_claims;
DROP POLICY IF EXISTS "Users can update their own claims" ON public.event_claims;

-- Verifications policies
DROP POLICY IF EXISTS "Verifications are viewable by everyone" ON public.verifications;
DROP POLICY IF EXISTS "Users can create verifications" ON public.verifications;
DROP POLICY IF EXISTS "Users can update their own verifications" ON public.verifications;

-- Stakes policies
DROP POLICY IF EXISTS "Stakes are viewable by everyone" ON public.stakes;
DROP POLICY IF EXISTS "Users can create their own stakes" ON public.stakes;

-- Notifications policies
DROP POLICY IF EXISTS "Users can view their own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can update their own notifications" ON public.notifications;

-- =============================================
-- HAPUS SEMUA TABLES (CASCADE untuk menghapus dependencies)
-- =============================================
DROP TABLE IF EXISTS public.notifications CASCADE;
DROP TABLE IF EXISTS public.stakes CASCADE;
DROP TABLE IF EXISTS public.verifications CASCADE;
DROP TABLE IF EXISTS public.event_claims CASCADE;
DROP TABLE IF EXISTS public.events CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- =============================================
-- HAPUS SEMUA CUSTOM TYPES
-- =============================================
DROP TYPE IF EXISTS public.claim_status;
DROP TYPE IF EXISTS public.event_status;

-- =============================================
-- HAPUS SEMUA INDEXES (akan terhapus otomatis dengan CASCADE)
-- =============================================
-- Indexes akan terhapus otomatis dengan CASCADE

-- =============================================
-- VERIFIKASI PEMBERSIHAN
-- =============================================
-- Check apakah semua tables sudah terhapus
SELECT 
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Check apakah semua functions sudah terhapus
SELECT 
    routine_name,
    routine_type
FROM information_schema.routines 
WHERE routine_schema = 'public' 
ORDER BY routine_name;

-- Check apakah semua triggers sudah terhapus
SELECT 
    trigger_name,
    event_object_table,
    action_timing,
    event_manipulation
FROM information_schema.triggers 
WHERE trigger_schema = 'public' 
ORDER BY trigger_name;

-- Check apakah semua types sudah terhapus
SELECT 
    typname,
    typtype
FROM pg_type 
WHERE typnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
AND typtype = 'e'
ORDER BY typname;
